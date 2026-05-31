/**
 * Exhaustive tests for BloomFlow (components/ui/bloom-flow.tsx).
 *
 * Motion is mocked per-file (motion.<tag> → <tag>, AnimatePresence → children,
 * useReducedMotion → true) so step transitions are deterministic.
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { axe } from "vitest-axe";

// Mutable reduced-motion flag (see bloom.test.tsx for the rationale): the mock
// strips all animation props, so flipping this only selects the ternary arm.
const motionState = vi.hoisted(() => ({ reduce: true }));

vi.mock("motion/react", async () => {
  const React = await import("react");
  const cache: Record<string, unknown> = {};
  const passthrough = (tag: string) =>
    React.forwardRef((props: Record<string, unknown>, ref: unknown) => {
      const {
        initial, animate, exit, transition, layout, layoutId,
        drag, dragConstraints, dragElastic, onDragEnd, variants,
        whileTap, whileHover, whileDrag, whileFocus, whileInView,
        pathLength, ...rest
      } = props;
      return React.createElement(tag, { ref, ...rest });
    });
  const motion = new Proxy(
    {},
    { get: (_t, tag: string) => (cache[tag] ??= passthrough(tag)) },
  );
  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    useReducedMotion: () => motionState.reduce,
  };
});

import { BloomFlow, type BloomFlowDef } from "@/components/ui/bloom-flow";

// ---------------------------------------------------------------------------
// Flow definitions
// ---------------------------------------------------------------------------
interface BuyState {
  area: string;
  confirm: boolean;
}

function makeTwoStepFlow(
  onComplete: (s: BuyState) => Promise<{ number: string }>,
): BloomFlowDef<BuyState, { number: string }> {
  return {
    id: "buy",
    initial: { area: "", confirm: false },
    steps: [
      {
        title: "Pick an area code",
        caption: "Choose where the number lives.",
        primaryLabel: "Continue",
        canAdvance: (s) => s.area.length === 3,
        body: (state, set) => (
          <input
            aria-label="Area code"
            value={state.area}
            onChange={(e) => set({ area: e.target.value })}
          />
        ),
      },
      {
        title: "Confirm purchase",
        primaryLabel: "Buy number",
        canAdvance: (s) => s.confirm,
        body: (state, set) => (
          <label>
            <input
              type="checkbox"
              checked={state.confirm}
              onChange={(e) => set({ confirm: e.target.checked })}
            />
            I agree
          </label>
        ),
      },
    ],
    onComplete,
    success: (r) => ({
      title: `Purchased ${r.number}`,
      actions: <button type="button">Copy number</button>,
    }),
  };
}

const oneStepFlow: BloomFlowDef<{ name: string }, { ok: true }> = {
  id: "single",
  initial: { name: "" },
  steps: [
    {
      title: "Name it",
      primaryLabel: "Save",
      canAdvance: (s) => s.name.length > 0,
      body: (state, set) => (
        <input
          aria-label="Name"
          value={state.name}
          onChange={(e) => set({ name: e.target.value })}
        />
      ),
    },
  ],
  onComplete: async () => ({ ok: true }),
  success: () => ({ title: "Saved" }),
};

// ---------------------------------------------------------------------------
// First-step rendering + gating
// ---------------------------------------------------------------------------
describe("BloomFlow — first step", () => {
  it("renders the first step's title, caption and body", () => {
    render(<BloomFlow flow={makeTwoStepFlow(async () => ({ number: "x" }))} onClose={vi.fn()} />);
    expect(screen.getByText("Pick an area code")).toBeInTheDocument();
    expect(screen.getByText("Choose where the number lives.")).toBeInTheDocument();
    expect(screen.getByLabelText("Area code")).toBeInTheDocument();
  });

  it("shows Close (not Back) on the first step", () => {
    render(<BloomFlow flow={makeTwoStepFlow(async () => ({ number: "x" }))} onClose={vi.fn()} />);
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /back/i })).not.toBeInTheDocument();
  });

  it("Primary is disabled until canAdvance is satisfied", async () => {
    const user = userEvent.setup();
    render(<BloomFlow flow={makeTwoStepFlow(async () => ({ number: "x" }))} onClose={vi.fn()} />);
    const primary = screen.getByRole("button", { name: "Continue" });
    expect(primary).toBeDisabled();
    await user.type(screen.getByLabelText("Area code"), "415");
    expect(primary).toBeEnabled();
  });

  it("renders one step-dot per step", () => {
    const { container } = render(
      <BloomFlow flow={makeTwoStepFlow(async () => ({ number: "x" }))} onClose={vi.fn()} />,
    );
    const dots = container.querySelectorAll(".size-1\\.5.rounded-full");
    expect(dots.length).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// Navigation between steps
// ---------------------------------------------------------------------------
describe("BloomFlow — navigation", () => {
  it("advancing moves to the next step and the active dot changes", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <BloomFlow flow={makeTwoStepFlow(async () => ({ number: "x" }))} onClose={vi.fn()} />,
    );
    await user.type(screen.getByLabelText("Area code"), "415");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(await screen.findByText("Confirm purchase")).toBeInTheDocument();
    // Active dot (index 1) is the brand-filled one.
    const dots = container.querySelectorAll(".size-1\\.5.rounded-full");
    expect(dots[1].className).toContain("bg-brand");
    expect(dots[0].className).not.toContain("bg-brand ");
  });

  it("Back returns to the previous step (and preserves entered state)", async () => {
    const user = userEvent.setup();
    render(
      <BloomFlow flow={makeTwoStepFlow(async () => ({ number: "x" }))} onClose={vi.fn()} />,
    );
    await user.type(screen.getByLabelText("Area code"), "415");
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await screen.findByText("Confirm purchase");

    await user.click(screen.getByRole("button", { name: /back/i }));
    expect(await screen.findByText("Pick an area code")).toBeInTheDocument();
    expect(screen.getByLabelText("Area code")).toHaveValue("415");
  });

  it("Close on the first step calls onClose", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<BloomFlow flow={makeTwoStepFlow(async () => ({ number: "x" }))} onClose={onClose} />);
    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// Completion + success view
// ---------------------------------------------------------------------------
describe("BloomFlow — completion", () => {
  it("last-step Primary calls onComplete and renders the success view", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn(async () => ({ number: "+1 (415) 555-0100" }));
    render(<BloomFlow flow={makeTwoStepFlow(onComplete)} onClose={vi.fn()} />);

    await user.type(screen.getByLabelText("Area code"), "415");
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(await screen.findByLabelText(/i agree/i));
    await user.click(screen.getByRole("button", { name: "Buy number" }));

    expect(await screen.findByText("Purchased +1 (415) 555-0100")).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledTimes(1);
    // Success actions render.
    expect(screen.getByRole("button", { name: "Copy number" })).toBeInTheDocument();
  });

  it("the Done button on the success view calls onClose", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <BloomFlow flow={makeTwoStepFlow(async () => ({ number: "x" }))} onClose={onClose} />,
    );
    await user.type(screen.getByLabelText("Area code"), "415");
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(await screen.findByLabelText(/i agree/i));
    await user.click(screen.getByRole("button", { name: "Buy number" }));
    await screen.findByText("Purchased x");

    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("surfaces an error and stays on the step when onComplete rejects", async () => {
    const user = userEvent.setup();
    render(
      <BloomFlow
        flow={makeTwoStepFlow(async () => {
          throw new Error("Network down");
        })}
        onClose={vi.fn()}
      />,
    );
    await user.type(screen.getByLabelText("Area code"), "415");
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(await screen.findByLabelText(/i agree/i));
    await user.click(screen.getByRole("button", { name: "Buy number" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Network down");
    // Remained on the confirm step (not success).
    expect(screen.getByText("Confirm purchase")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// One-step flow
// ---------------------------------------------------------------------------
describe("BloomFlow — single step", () => {
  it("shows Close + exactly one dot; completes to success", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container } = render(<BloomFlow flow={oneStepFlow} onClose={onClose} />);

    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
    expect(container.querySelectorAll(".size-1\\.5.rounded-full").length).toBe(1);

    await user.type(screen.getByLabelText("Name"), "Main line");
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByText("Saved")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// Non-reduced motion — exercises the animated arm of each ternary, incl. the
// SuccessRing draw transitions (DOM identical under the mock).
// ---------------------------------------------------------------------------
describe("BloomFlow — non-reduced motion branches", () => {
  beforeEach(() => {
    motionState.reduce = false;
  });
  afterEach(() => {
    motionState.reduce = true;
  });

  it("runs a full step → success cycle with motion enabled (covers SuccessRing draw)", async () => {
    const user = userEvent.setup();
    render(
      <BloomFlow flow={makeTwoStepFlow(async () => ({ number: "x" }))} onClose={vi.fn()} />,
    );
    await user.type(screen.getByLabelText("Area code"), "415");
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(await screen.findByLabelText(/i agree/i));
    await user.click(screen.getByRole("button", { name: "Buy number" }));
    expect(await screen.findByText("Purchased x")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Accessibility
// ---------------------------------------------------------------------------
describe("BloomFlow — a11y", () => {
  it("has no axe violations on a rendered step", async () => {
    const { container } = render(
      <BloomFlow flow={makeTwoStepFlow(async () => ({ number: "x" }))} onClose={vi.fn()} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
