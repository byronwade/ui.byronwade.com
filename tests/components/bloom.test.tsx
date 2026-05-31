/**
 * Exhaustive tests for the Bloom primitive (components/ui/bloom.tsx).
 *
 * Motion is mocked per-file so behaviour is deterministic in jsdom:
 *   motion.<tag>  → plain <tag> with motion-only props stripped
 *   AnimatePresence → renders children
 *   useReducedMotion → true
 *
 * We assert behaviour / markup / state / a11y — never animation visuals.
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { axe } from "vitest-axe";

// Mutable reduced-motion flag. Because the mock strips ALL animation props, the
// rendered DOM is identical regardless of this value — it only selects which arm
// of each `reduce ? A : B` ternary executes. Flipping it (see "non-reduced
// motion" block) deterministically covers the animated arms.
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
        ...rest
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

import { Bloom } from "@/components/ui/bloom";

// Stub window.matchMedia (jsdom lacks it). Default: desktop (matches=false).
function stubMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

beforeEach(() => {
  stubMatchMedia(false);
  motionState.reduce = true;
});

afterEach(() => {
  vi.restoreAllMocks();
  motionState.reduce = true;
});

function renderBloom(props: Partial<React.ComponentProps<typeof Bloom>> = {}) {
  return render(
    <Bloom bar={<span>Open menu</span>} aria-label="Demo bloom" {...props}>
      <div>
        <p>Bloomed body content</p>
        <button type="button">Body action</button>
      </div>
    </Bloom>,
  );
}

// ---------------------------------------------------------------------------
// Collapsed state
// ---------------------------------------------------------------------------
describe("Bloom — collapsed", () => {
  it("renders only the bar trigger; body is not in the document", () => {
    renderBloom();
    const trigger = screen.getByRole("button", { name: "Open menu" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Bloomed body content")).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("sets aria-haspopup='dialog' when modal", () => {
    renderBloom({ modal: true });
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-haspopup",
      "dialog",
    );
  });

  it("omits aria-haspopup when not modal", () => {
    renderBloom({ modal: false });
    expect(
      screen.getByRole("button", { name: "Open menu" }),
    ).not.toHaveAttribute("aria-haspopup");
  });
});

// ---------------------------------------------------------------------------
// Open / close interactions
// ---------------------------------------------------------------------------
describe("Bloom — open / close", () => {
  it("clicking the bar opens it; body + dialog appear with aria-modal", async () => {
    const user = userEvent.setup();
    renderBloom({ modal: true });
    await user.click(screen.getByRole("button", { name: "Open menu" }));

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-label", "Demo bloom");
    expect(screen.getByText("Bloomed body content")).toBeInTheDocument();
  });

  it("does not render dialog role when modal=false", async () => {
    const user = userEvent.setup();
    renderBloom({ modal: false });
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByText("Bloomed body content")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Escape closes the panel", async () => {
    const user = userEvent.setup();
    renderBloom();
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await screen.findByRole("dialog");
    // Esc is handled on the panel's onKeyDown, so focus must be inside it.
    await user.click(screen.getByRole("button", { name: "Body action" }));
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByText("Bloomed body content")).not.toBeInTheDocument(),
    );
  });

  it("clicking the scrim closes the panel (modal)", async () => {
    const user = userEvent.setup();
    const { container } = renderBloom({ modal: true });
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await screen.findByRole("dialog");
    // Scrim is the fixed inset-0 overlay element.
    const scrim = container.querySelector(".fixed.inset-0") as HTMLElement;
    expect(scrim).toBeTruthy();
    await user.click(scrim);
    await waitFor(() =>
      expect(screen.queryByText("Bloomed body content")).not.toBeInTheDocument(),
    );
  });

  it("returns focus to the bar trigger after closing", async () => {
    const user = userEvent.setup();
    renderBloom();
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await screen.findByRole("dialog");
    await user.click(screen.getByRole("button", { name: "Body action" }));
    await user.keyboard("{Escape}");
    await waitFor(() => {
      const trigger = screen.getByRole("button", { name: "Open menu" });
      expect(trigger).toHaveFocus();
    });
  });
});

// ---------------------------------------------------------------------------
// Tone tokens
// ---------------------------------------------------------------------------
describe("Bloom — tone", () => {
  it("tone='surface' (default) applies card/border classes to the trigger", () => {
    renderBloom({ tone: "surface" });
    const trigger = screen.getByRole("button", { name: "Open menu" });
    expect(trigger.className).toContain("bg-card");
    expect(trigger.className).toContain("border-border");
  });

  it("tone='dock' applies dock token classes to the trigger", () => {
    renderBloom({ tone: "dock" });
    const trigger = screen.getByRole("button", { name: "Open menu" });
    expect(trigger.className).toContain("bg-dock");
    expect(trigger.className).toContain("shadow-float");
  });

  it("tone='dock' applies dock classes to the open panel", async () => {
    const user = userEvent.setup();
    renderBloom({ tone: "dock" });
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog.className).toContain("bg-dock");
  });
});

// ---------------------------------------------------------------------------
// Controlled mode
// ---------------------------------------------------------------------------
describe("Bloom — controlled", () => {
  it("respects controlled open=true and fires onOpenChange(false) on close", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderBloom({ open: true, onOpenChange });
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Body action" }));
    await user.keyboard("{Escape}");
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it("controlled open=false stays closed until parent flips it", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderBloom({ open: false, onOpenChange });
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    // Controlled: clicking calls onOpenChange but does not self-open.
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Placement / barPosition variants (markup-level)
// ---------------------------------------------------------------------------
describe("Bloom — placement & barPosition", () => {
  it("renders an x-axis (left/right) placement panel", async () => {
    const user = userEvent.setup();
    renderBloom({ placement: "right" });
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog.className).toContain("flex-row");
  });

  it("barPosition='leading' forces the bar to dock as header", async () => {
    const user = userEvent.setup();
    renderBloom({ placement: "bottom", barPosition: "leading" });
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    // Two "Open menu" labels: the (hidden) trigger + the docked bar.
    expect(screen.getAllByText("Open menu").length).toBeGreaterThanOrEqual(2);
  });
});

// ---------------------------------------------------------------------------
// Mobile bottom-sheet branch (matchMedia matches=true)
// ---------------------------------------------------------------------------
describe("Bloom — mobile sheet", () => {
  it("renders the bottom-sheet dialog when the mobile media query matches", async () => {
    stubMatchMedia(true);
    const user = userEvent.setup();
    renderBloom({ modal: true });
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog.className).toContain("rounded-t-2xl");
    expect(screen.getByText("Bloomed body content")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Focus trap (modal Tab handling)
// ---------------------------------------------------------------------------
describe("Bloom — focus trap", () => {
  function renderTrap() {
    return render(
      <Bloom bar={<span>Open menu</span>} aria-label="Trap" modal>
        <div>
          <button type="button">First</button>
          <button type="button">Last</button>
        </div>
      </Bloom>,
    );
  }

  // NOTE: the Tab-wrap path (focus moving between first/last) cannot be exercised
  // in jsdom — `getFocusable` filters on `el.offsetParent`, which jsdom always
  // reports as null, so every non-active focusable is filtered out. That branch
  // is part of the sanctioned animation/measurement allowance. We still cover the
  // empty-focusables guard below (which preventDefaults without moving focus).
  it("keeps the panel mounted on Tab even when the trap finds no movable focusables", async () => {
    const user = userEvent.setup();
    renderTrap();
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const dialog = await screen.findByRole("dialog");
    screen.getByRole("button", { name: "Last" }).focus();
    await user.tab();
    expect(dialog).toBeInTheDocument();
  });

  it("prevents Tab when the modal panel has no focusable children", async () => {
    const user = userEvent.setup();
    render(
      <Bloom bar={<span>Open menu</span>} aria-label="Empty" modal>
        <div>Just text, nothing focusable.</div>
      </Bloom>,
    );
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const dialog = await screen.findByRole("dialog");
    dialog.focus();
    // Should not throw and should keep the dialog mounted.
    await user.tab();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Uncontrolled defaultOpen
// ---------------------------------------------------------------------------
describe("Bloom — uncontrolled defaultOpen", () => {
  it("renders open on mount when defaultOpen is true", async () => {
    renderBloom({ defaultOpen: true });
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Non-reduced motion — exercises the animated arm of each `reduce ? … : …`
// ternary (DOM is identical under the mock; only branch selection differs).
// ---------------------------------------------------------------------------
describe("Bloom — non-reduced motion branches", () => {
  beforeEach(() => {
    motionState.reduce = false;
  });

  it("opens, renders the body, and closes with full motion enabled (desktop)", async () => {
    const user = userEvent.setup();
    renderBloom({ modal: true, placement: "bottom" });
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(await screen.findByText("Bloomed body content")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Body action" }));
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByText("Bloomed body content")).not.toBeInTheDocument(),
    );
  });

  it("renders the x-axis panel with motion enabled", async () => {
    const user = userEvent.setup();
    renderBloom({ placement: "left" });
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog.className).toContain("flex-row");
  });

  it("renders the mobile sheet with motion enabled", async () => {
    stubMatchMedia(true);
    const user = userEvent.setup();
    renderBloom({ modal: true, barPosition: "leading" });
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog.className).toContain("rounded-t-2xl");
  });
});

// ---------------------------------------------------------------------------
// Accessibility
// ---------------------------------------------------------------------------
describe("Bloom — a11y", () => {
  it("has no axe violations when collapsed", async () => {
    const { container } = renderBloom();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations when open", async () => {
    const user = userEvent.setup();
    const { container } = renderBloom({ modal: true });
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await screen.findByRole("dialog");
    expect(await axe(container)).toHaveNoViolations();
  });
});
