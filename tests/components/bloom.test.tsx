/**
 * Exhaustive tests for the Bloom primitive (components/ui/bloom.tsx).
 *
 * Bloom is now pure CSS (Motion removed). jsdom does not run CSS transitions,
 * so the morph is effectively instant: opening mounts the body + dialog
 * immediately, and the close keeps the body mounted for MORPH_MS (~400ms) via a
 * setTimeout before unmounting — `waitFor` covers that window.
 *
 * Reduced-motion is read from `window.matchMedia("(prefers-reduced-motion:
 * reduce)")`, and the mobile vs desktop split from
 * `matchMedia("(max-width:…)")`. The stub below is query-aware so the two can be
 * controlled independently (e.g. desktop + reduced-motion, which exercises the
 * `if (reduce)` arms of the cross-axis morph effect).
 *
 * We assert behaviour / markup / state / a11y — never animation visuals.
 */

import { useRef } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { axe } from "vitest-axe";

import { Bloom } from "@/components/ui/bloom";

// Stub window.matchMedia (jsdom lacks it). Query-aware: `mobile` drives the
// max-width query, `reduce` drives the prefers-reduced-motion query.
function stubMatchMedia({
  mobile = false,
  reduce = false,
}: { mobile?: boolean; reduce?: boolean } = {}) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => {
    const matches = query.includes("prefers-reduced-motion")
      ? reduce
      : query.includes("max-width")
        ? mobile
        : false;
    return {
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
  });
}

// jsdom has no ResizeObserver; the CSS Bloom uses one to measure its body's
// natural size for the height bloom. A no-op lets it mount (measurements are 0
// in jsdom anyway). Scoped to this file — NOT global setup — because recharts'
// tests behave differently when a ResizeObserver is present.
function stubResizeObserver() {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

beforeEach(() => {
  stubResizeObserver();
  stubMatchMedia();
});

afterEach(() => {
  vi.restoreAllMocks();
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

  it("runs focus-restore cleanup on close and restores the collapsed trigger", async () => {
    // NOTE: the actual `.focus()` target is filtered out by `getFocusable`'s
    // `offsetParent` check (always null in jsdom — the same sanctioned limit as
    // the Tab-wrap), so we don't assert `toHaveFocus`. We still drive the full
    // open→Esc→close path so the close cleanup (getFocusable + focus()) runs,
    // and assert the dialog is gone and the collapsed trigger is back.
    const user = userEvent.setup();
    renderBloom();
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await screen.findByRole("dialog");
    await user.click(screen.getByRole("button", { name: "Body action" }));
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(
      screen.getByRole("button", { name: "Open menu" }),
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Tone tokens
// ---------------------------------------------------------------------------
describe("Bloom — tone", () => {
  it("tone='surface' (default) applies card/border classes to the morph container", () => {
    renderBloom({ tone: "surface" });
    // Tone lives on the morph container (the trigger's nearest `.transform-gpu`).
    const container = screen
      .getByRole("button", { name: "Open menu" })
      .closest(".transform-gpu");
    expect(container).toBeTruthy();
    expect(container!.className).toContain("bg-card");
    expect(container!.className).toContain("border-border");
  });

  it("tone='dock' applies dock token classes to the morph container", () => {
    renderBloom({ tone: "dock" });
    const container = screen
      .getByRole("button", { name: "Open menu" })
      .closest(".transform-gpu");
    expect(container).toBeTruthy();
    expect(container!.className).toContain("bg-dock");
    expect(container!.className).toContain("shadow-float");
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

  it("barPosition='leading' docks the bar as a header (border-b)", async () => {
    const user = userEvent.setup();
    renderBloom({ placement: "bottom", barPosition: "leading" });
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    // Leading → the docked bar wrapper gets a bottom border (header), not top.
    const barWrap = screen.getByText("Open menu").closest("div");
    expect(barWrap?.className).toContain("border-b");
  });
});

// ---------------------------------------------------------------------------
// Element/inline anchor mode (anchor = a ref, not "viewport")
// ---------------------------------------------------------------------------
describe("Bloom — element/inline anchor", () => {
  function InlineAnchorHarness() {
    const ref = useRef<HTMLDivElement>(null);
    return (
      <div ref={ref}>
        <Bloom
          bar={<span>Open menu</span>}
          aria-label="Inline bloom"
          anchor={ref}
          modal
        >
          <div>
            <p>Bloomed body content</p>
            <button type="button">Body action</button>
          </div>
        </Bloom>
      </div>
    );
  }

  it("opens an absolutely-anchored panel that grows from the bar (inline mode)", async () => {
    const user = userEvent.setup();
    const { container } = render(<InlineAnchorHarness />);
    // The single accessible trigger (the aria-hidden spacer copy is excluded).
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Bloomed body content")).toBeInTheDocument();
    // Inline mode wraps in `span.relative.inline-flex` with an `.absolute` panel.
    expect(container.querySelector("span.relative.inline-flex")).toBeTruthy();
    expect(container.querySelector(".absolute.z-50")).toBeTruthy();
  });

  it("the inline-mode scrim closes the panel", async () => {
    const user = userEvent.setup();
    const { container } = render(<InlineAnchorHarness />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await screen.findByRole("dialog");
    const scrim = container.querySelector(".fixed.inset-0") as HTMLElement;
    expect(scrim).toBeTruthy();
    await user.click(scrim);
    await waitFor(() =>
      expect(screen.queryByText("Bloomed body content")).not.toBeInTheDocument(),
    );
  });
});

// ---------------------------------------------------------------------------
// Mobile bottom-sheet branch (matchMedia matches=true)
// ---------------------------------------------------------------------------
describe("Bloom — mobile sheet", () => {
  it("renders the bottom-sheet dialog when the mobile media query matches", async () => {
    stubMatchMedia({ mobile: true });
    // On mobile + closed there is no collapsed trigger (the parent owns `open`
    // and renders its own pill, as BloomDock does), so drive `open` directly.
    renderBloom({ open: true, modal: true });
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
// Reduced motion — the default (above) runs with reduce=false (the animated
// arm of every `reduce ? … : …`); these turn reduced-motion ON to cover the
// `if (reduce)` arms of the cross-axis morph effect on DESKTOP (the mobile
// branch early-returns before those arms, so the stub must keep mobile=false).
// ---------------------------------------------------------------------------
describe("Bloom — reduced motion (desktop)", () => {
  beforeEach(() => {
    stubMatchMedia({ mobile: false, reduce: true });
  });

  it("opens + closes on the y-axis with reduced motion (covers the reduce arms)", async () => {
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

  it("opens + closes on the x-axis with reduced motion", async () => {
    const user = userEvent.setup();
    renderBloom({ placement: "left", modal: true });
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog.className).toContain("flex-row");
    await user.click(screen.getByRole("button", { name: "Body action" }));
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByText("Bloomed body content")).not.toBeInTheDocument(),
    );
  });

  it("renders the mobile sheet with reduced motion", async () => {
    stubMatchMedia({ mobile: true, reduce: true });
    // Drive `open` (no collapsed trigger on mobile — see the mobile-sheet block).
    renderBloom({ open: true, modal: true, barPosition: "leading" });
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
