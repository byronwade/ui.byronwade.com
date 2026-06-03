/**
 * Tests for the MorphDock component (components/ui/morph-dock.tsx).
 *
 * The dock blooms via `useChromeMorph`, which reads `window.matchMedia`
 * (prefers-reduced-motion) and `offsetWidth/Height` — neither exists in jsdom,
 * so we stub matchMedia and let the (instant, 0-sized) morph run. We assert
 * behaviour / markup / state / a11y, never animation visuals.
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { axe } from "vitest-axe";
import { Home, Inbox, BarChart3, Settings, Search } from "lucide-react";

import { MorphDock, type MorphDockItem } from "@/components/ui/morph-dock";

function stubMatchMedia({ reduce = false }: { reduce?: boolean } = {}) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("prefers-reduced-motion") ? reduce : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

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
afterEach(() => vi.restoreAllMocks());

const baseItems: MorphDockItem[] = [
  { id: "home", label: "Home", icon: Home, href: "#", active: true, core: true },
  { id: "inbox", label: "Inbox", icon: Inbox, href: "#", core: true, badge: 3 },
  { id: "reports", label: "Reports", icon: BarChart3, href: "#" },
  { id: "settings", label: "Settings", icon: Settings, href: "#", pinned: true },
];

function renderDock(props: Partial<React.ComponentProps<typeof MorphDock>> = {}) {
  return render(<MorphDock items={baseItems} {...props} />);
}

describe("MorphDock", () => {
  it("renders every item with its accessible label", () => {
    renderDock();
    for (const label of ["Home", "Inbox", "Reports", "Settings"]) {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }
  });

  it("marks the active item with aria-current", () => {
    renderDock();
    expect(screen.getByLabelText("Home")).toHaveAttribute("aria-current", "page");
    expect(screen.getByLabelText("Inbox")).not.toHaveAttribute("aria-current");
  });

  it("renders href items as links and handler items as buttons", async () => {
    const onSelect = vi.fn();
    renderDock({
      items: [
        { id: "a", label: "Linked", icon: Home, href: "/x", core: true },
        { id: "b", label: "Action", icon: Inbox, onSelect, core: true },
      ],
    });
    expect(screen.getByLabelText("Linked").tagName).toBe("A");
    const btn = screen.getByLabelText("Action");
    expect(btn.tagName).toBe("BUTTON");
    await userEvent.click(btn);
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("collapses non-core/pinned/active items until expanded", async () => {
    renderDock();
    // Reports is the only collapsible item → its wrapper is aria-hidden at rest.
    const reportsWrapper = screen.getByLabelText("Reports").parentElement!;
    expect(reportsWrapper).toHaveAttribute("aria-hidden", "true");

    const toggle = screen.getByRole("button", { name: "Show all" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Show fewer" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByLabelText("Reports").parentElement!).toHaveAttribute(
      "aria-hidden",
      "false",
    );
  });

  it("omits the expand toggle when nothing is collapsible", () => {
    renderDock({
      items: [{ id: "home", label: "Home", icon: Home, href: "#", core: true }],
    });
    expect(screen.queryByRole("button", { name: /show/i })).not.toBeInTheDocument();
  });

  it("omits the expand toggle when expandable is false", () => {
    renderDock({ expandable: false });
    expect(screen.queryByRole("button", { name: /show/i })).not.toBeInTheDocument();
  });

  it("blooms into the children panel when the action is clicked", async () => {
    const onOpenChange = vi.fn();
    renderDock({
      action: { label: "Search", icon: Search },
      onOpenChange,
      children: <div>Panel body</div>,
    });
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog).toHaveAttribute("aria-hidden", "true");
    expect(dialog).toHaveAttribute("aria-label", "Search");

    await userEvent.click(screen.getByRole("button", { name: "Search" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("respects the controlled open prop + closes on Escape", async () => {
    const onOpenChange = vi.fn();
    renderDock({
      open: true,
      onOpenChange,
      action: { label: "Search", icon: Search },
      children: <div>Panel body</div>,
    });
    expect(screen.getByRole("dialog", { name: "Search" })).toHaveAttribute(
      "aria-hidden",
      "false",
    );
    await userEvent.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("closes on click-away", async () => {
    const onOpenChange = vi.fn();
    renderDock({
      open: true,
      onOpenChange,
      action: { label: "Search", icon: Search },
      children: <div>Panel body</div>,
    });
    await userEvent.click(document.body);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("runs a plain action with no panel and exposes no dialog", async () => {
    const onSelect = vi.fn();
    renderDock({ action: { label: "New", icon: Search, onSelect } });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    const btn = screen.getByRole("button", { name: "New" });
    expect(btn).not.toHaveAttribute("aria-haspopup");
    await userEvent.click(btn);
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("renders the trailing cluster slot", () => {
    renderDock({ cluster: <span>cluster-slot</span> });
    expect(screen.getByText("cluster-slot")).toBeInTheDocument();
  });

  it("supports the surface tone", () => {
    const { container } = renderDock({ tone: "surface" });
    expect(container.querySelector(".bg-card")).toBeInTheDocument();
  });

  it("honours reduced motion without throwing", () => {
    stubMatchMedia({ reduce: true });
    expect(() =>
      renderDock({ open: true, children: <div>Panel</div>, action: { label: "S", icon: Search } }),
    ).not.toThrow();
  });

  it("has no axe violations (closed and open)", async () => {
    const { container, rerender } = render(
      <MorphDock items={baseItems} action={{ label: "Search", icon: Search }}>
        <div>Panel</div>
      </MorphDock>,
    );
    expect(await axe(container)).toHaveNoViolations();
    rerender(
      <MorphDock items={baseItems} open action={{ label: "Search", icon: Search }}>
        <div>Panel</div>
      </MorphDock>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
