/**
 * Exhaustive tests for BloomFlow (components/ui/bloom-flow.tsx).
 *
 * BloomFlow is pure CSS (Motion removed): step bodies fade/slide in via
 * `animate-in`, the step-dots widen via a CSS `transition-all`, and the success
 * check is a static `--brand` ring. jsdom does not run CSS transitions, so step
 * advance/back/success are observable immediately after the state change.
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import { axe } from "vitest-axe";

import { BloomFlow, type BloomFlowDef } from "@/components/ui/bloom-flow";

// The step-dots are `<span class="h-1.5 rounded-full …">` (active widens to w-4,
// others stay w-1.5) — one per step. This selector counts them.
const DOT_SELECTOR = ".h-1\\.5.rounded-full";

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
    const dots = container.querySelectorAll(DOT_SELECTOR);
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
    const dots = container.querySelectorAll(DOT_SELECTOR);
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
    expect(container.querySelectorAll(DOT_SELECTOR).length).toBe(1);

    await user.type(screen.getByLabelText("Name"), "Main line");
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByText("Saved")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// Success ring — the static `--brand` check that replaced the Motion path-draw.
// ---------------------------------------------------------------------------
describe("BloomFlow — success ring", () => {
  it("renders the brand success ring on the success view", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <BloomFlow flow={makeTwoStepFlow(async () => ({ number: "x" }))} onClose={vi.fn()} />,
    );
    await user.type(screen.getByLabelText("Area code"), "415");
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(await screen.findByLabelText(/i agree/i));
    await user.click(screen.getByRole("button", { name: "Buy number" }));
    expect(await screen.findByText("Purchased x")).toBeInTheDocument();
    // The SuccessRing is a `bg-brand/15` chip wrapping a brand Check glyph.
    expect(container.querySelector(".bg-brand\\/15")).toBeTruthy();
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
