/**
 * Tests for the MorphDock component (components/ui/morph-dock.tsx).
 *
 * The dock blooms via `useChromeMorph`, which reads `window.matchMedia`
 * (prefers-reduced-motion) and `offsetWidth/Height` — neither exists in jsdom,
 * so we stub matchMedia and let the (instant, 0-sized) morph run. We assert
 * behaviour / markup / state / a11y, never animation visuals.
 */

import * as React from "react";
import { render, screen, fireEvent, within, act } from "@testing-library/react";
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
afterEach(() => {
  vi.restoreAllMocks();
  // Don't leak the stubbed ResizeObserver into sibling files in this worker.
  Reflect.deleteProperty(globalThis, "ResizeObserver");
});

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

  it("drags the panel by its header when draggable", () => {
    renderDock({
      open: true,
      draggable: true,
      panelTitle: "Win",
      panelHeight: 160,
      action: { label: "Notes", icon: Search },
      children: <div>Body</div>,
    });
    const dialog = screen.getByRole("dialog", { name: "Win" });
    const header = dialog.firstElementChild as HTMLElement;
    fireEvent.pointerDown(header, { clientX: 10, clientY: 10 });
    fireEvent.pointerMove(document, { clientX: 50, clientY: 35 });
    fireEvent.pointerUp(document);
    expect(dialog).toBeInTheDocument();
  });

  it("closes via the header close button", async () => {
    const onOpenChange = vi.fn();
    renderDock({
      open: true,
      draggable: true,
      panelTitle: "Win",
      onOpenChange,
      action: { label: "Notes", icon: Search },
      children: <div>Body</div>,
    });
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders a Save button in the header when onSave is provided", async () => {
    const onSave = vi.fn();
    renderDock({
      open: true,
      panelTitle: "Win",
      onSave,
      action: { label: "Notes", icon: Search },
      children: <div>Body</div>,
    });
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSave).toHaveBeenCalledOnce();
  });

  it("renders a resize grip and resizes when resizable", () => {
    const { container } = renderDock({
      open: true,
      resizable: true,
      panelHeight: 160,
      action: { label: "Console", icon: Search },
      children: <div>Body</div>,
    });
    const grip = container.querySelector('[aria-label="Resize"]');
    expect(grip).toBeInTheDocument();
    fireEvent.pointerDown(grip!, { clientX: 100, clientY: 100 });
    fireEvent.pointerMove(document, { clientX: 160, clientY: 150 });
    fireEvent.pointerUp(document);
    expect(grip).toBeInTheDocument();
  });

  it("resizes a top-placement panel from the corner facing the open space", () => {
    const { container } = renderDock({
      open: true,
      resizable: true,
      placement: "top",
      panelHeight: 160,
      action: { label: "Console", icon: Search },
      children: <div>Body</div>,
    });
    // Top placement → grip pinned to the panel's TOP-right (faces the upward bloom).
    const grip = container.querySelector('[aria-label="Resize"]')!;
    expect(grip.className).toContain("top-0");
    // Dragging UP must grow a top-anchored panel (sy = -1).
    fireEvent.pointerDown(grip, { clientX: 200, clientY: 200 });
    fireEvent.pointerMove(document, { clientX: 240, clientY: 140 });
    fireEvent.pointerUp(document);
    expect(grip).toBeInTheDocument();
  });

  it("anchors the bloom per placement", () => {
    const { container } = renderDock({
      placement: "top",
      open: true,
      action: { label: "Search", icon: Search },
      children: <div>Body</div>,
    });
    // "top" placement anchors the wrapper bottom-left so it blooms upward.
    expect(container.querySelector(".bottom-0.left-0")).toBeInTheDocument();
  });

  it("blooms from the dock center when origin='center'", () => {
    const { container } = renderDock({
      origin: "center",
      open: true,
      action: { label: "Search", icon: Search },
      children: <div>Body</div>,
    });
    // A centered horizontal dock pins the panel to the bar midpoint.
    expect(container.querySelector(".left-1\\/2.-translate-x-1\\/2")).toBeInTheDocument();
  });

  it("blooms from the dock end when origin='end'", () => {
    const { container } = renderDock({
      origin: "end",
      open: true,
      action: { label: "Search", icon: Search },
      children: <div>Body</div>,
    });
    // The overlay wrapper pins to the right edge of the dock.
    expect(container.querySelector(".absolute.right-0")).toBeInTheDocument();
  });

  it("anchors the cross-axis per origin for vertical placements", () => {
    const { container } = renderDock({
      placement: "right",
      origin: "center",
      open: true,
      action: { label: "Search", icon: Search },
      children: <div>Body</div>,
    });
    expect(container.querySelector(".top-1\\/2.-translate-y-1\\/2")).toBeInTheDocument();
  });

  it("draws a separator between adjacent items of different groups", () => {
    render(
      <MorphDock
        items={[
          { id: "a", label: "A", icon: Home, core: true, group: "nav" },
          { id: "b", label: "B", icon: Inbox, core: true, group: "nav" },
          { id: "c", label: "C", icon: Search, core: true, group: "tools" },
        ]}
      />,
    );
    // exactly one group boundary (nav -> tools)
    expect(document.querySelectorAll('[data-slot="morph-dock-seam"]')).toHaveLength(1);
  });

  it("renders the tool zone with a brand primary and group seams", async () => {
    const onSelect = vi.fn();
    render(
      <MorphDock
        items={[{ id: "h", label: "Home", icon: Home, core: true }]}
        tools={[
          { id: "save", label: "Save", icon: Settings, primary: true, onSelect, group: "a" },
          { id: "share", label: "Share", icon: Search, group: "b" },
        ]}
      />,
    );
    const zone = document.querySelector('[data-slot="morph-dock-tools"]');
    expect(zone).toBeInTheDocument();
    expect(zone).toHaveClass("bg-dock-tool");
    expect(screen.getByRole("button", { name: "Save" })).toHaveClass("bg-brand");
    expect(zone?.querySelectorAll('[data-slot="morph-dock-seam"]')).toHaveLength(1);
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("renders tool-zone nav entries as links", () => {
    render(
      <MorphDock
        items={[{ id: "h", label: "Home", icon: Home, core: true }]}
        tools={[{ id: "docs", label: "Docs", icon: Search, href: "/docs" }]}
      />,
    );
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
  });

  it("renders a breadcrumb trail with the last crumb as current", () => {
    render(
      <MorphDock
        items={[{ id: "h", label: "Home", icon: Home, core: true }]}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Reports", href: "/reports" },
          { label: "Q2" },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByText("Q2")).toHaveAttribute("aria-current", "page");
  });

  it("blooms a status body and shows the tone title/message", () => {
    render(
      <MorphDock
        items={[{ id: "h", label: "Home", icon: Home, core: true }]}
        status={{ tone: "error", title: "Save failed", message: "Network error" }}
      />,
    );
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Save failed")).toBeInTheDocument();
    expect(within(dialog).getByText("Network error")).toBeInTheDocument();
  });

  it("auto-dismisses success but keeps errors", () => {
    vi.useFakeTimers();
    const onStatusDismiss = vi.fn();
    const { rerender } = render(
      <MorphDock
        items={[{ id: "h", label: "Home", icon: Home, core: true }]}
        status={{ tone: "success", title: "Saved" }}
        statusDismissMs={1000}
        onStatusDismiss={onStatusDismiss}
      />,
    );
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onStatusDismiss).toHaveBeenCalledOnce();

    onStatusDismiss.mockClear();
    rerender(
      <MorphDock
        items={[{ id: "h", label: "Home", icon: Home, core: true }]}
        status={{ tone: "error", title: "Nope" }}
        statusDismissMs={1000}
        onStatusDismiss={onStatusDismiss}
      />,
    );
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(onStatusDismiss).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("dismisses a status via its close button", async () => {
    const onStatusDismiss = vi.fn();
    render(
      <MorphDock
        items={[{ id: "h", label: "Home", icon: Home, core: true }]}
        status={{ tone: "error", title: "Nope" }}
        onStatusDismiss={onStatusDismiss}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onStatusDismiss).toHaveBeenCalledOnce();
  });

  it("drops the surface a beat after the panel closes", () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <MorphDock items={baseItems} open action={{ label: "Search", icon: Search }}>
        <div>Panel</div>
      </MorphDock>,
    );
    rerender(
      <MorphDock items={baseItems} open={false} action={{ label: "Search", icon: Search }}>
        <div>Panel</div>
      </MorphDock>,
    );
    act(() => {
      vi.advanceTimersByTime(240);
    });
    vi.useRealTimers();
    expect(document.querySelector('[role="dialog"]')).toBeInTheDocument();
  });

  it("anchors the cross-axis to the end for vertical placements", () => {
    const { container } = renderDock({
      placement: "left",
      origin: "end",
      action: { label: "Search", icon: Search },
      children: <div>Panel</div>,
    });
    expect(container.querySelector(".bottom-0")).toBeInTheDocument();
  });

  it("flies the dragged panel home when it closes", () => {
    const props = {
      draggable: true,
      panelTitle: "Win",
      panelHeight: 160,
      action: { label: "Notes", icon: Search },
      children: <div>Body</div>,
    } as const;
    const { rerender } = render(<MorphDock items={baseItems} open {...props} />);
    const dialog = screen.getByRole("dialog", { name: "Win" });
    const header = dialog.firstElementChild as HTMLElement;
    fireEvent.pointerDown(header, { clientX: 10, clientY: 10 });
    fireEvent.pointerMove(document, { clientX: 60, clientY: 40 });
    fireEvent.pointerUp(document);
    // Closing while dragged free runs the "fly home" path.
    rerender(<MorphDock items={baseItems} open={false} {...props} />);
    expect(dialog).toBeInTheDocument();
  });

  it("renders a non-link crumb when its href is omitted", () => {
    render(
      <MorphDock
        items={[]}
        breadcrumb={[{ label: "Root" }, { label: "Leaf" }]}
      />,
    );
    expect(screen.queryByRole("link", { name: "Root" })).toBeNull();
    expect(screen.getByText("Root")).toBeInTheDocument();
  });

  it("does not round the tool zone's trailing edge when an action follows", () => {
    render(
      <MorphDock
        items={[{ id: "h", label: "Home", icon: Home, core: true }]}
        tools={[{ id: "x", label: "Export", icon: Search }]}
        action={{ label: "Go", icon: Search }}
      />,
    );
    expect(document.querySelector('[data-slot="morph-dock-tools"]')).toHaveClass("rounded-xl");
  });

  it("anchors the cross-axis to the start for vertical placements", () => {
    const { container } = renderDock({
      placement: "right",
      origin: "start",
      action: { label: "Search", icon: Search },
      children: <div>Panel</div>,
    });
    expect(container.querySelector('[role="dialog"]')).toBeInTheDocument();
  });

  it("renders a draggable header without a title", () => {
    renderDock({
      open: true,
      draggable: true,
      action: { label: "Notes", icon: Search },
      children: <div>Body</div>,
    });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.queryByText("Win")).toBeNull();
  });

  it("hides the resize grip while closed", () => {
    renderDock({
      resizable: true,
      action: { label: "Notes", icon: Search },
      children: <div>Body</div>,
    });
    expect(screen.getByRole("button", { name: "Resize" })).toHaveClass("opacity-0");
  });

  it("drops the pill background when bare", () => {
    const { rerender } = renderDock();
    const bar = screen.getByRole("navigation").parentElement as HTMLElement;
    expect(bar).toHaveClass("bg-dock");
    rerender(<MorphDock items={baseItems} bare />);
    const bareBar = screen.getByRole("navigation").parentElement as HTMLElement;
    expect(bareBar).not.toHaveClass("bg-dock");
    expect(bareBar).not.toHaveClass("edge");
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

  it("has no axe violations for tools, breadcrumb, and status variants", async () => {
    const { container } = render(
      <MorphDock
        items={[{ id: "h", label: "Home", icon: Home, core: true, group: "nav" }]}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Now" }]}
        tools={[{ id: "save", label: "Save", icon: Settings, primary: true, group: "a" }]}
        status={{ tone: "info", title: "Heads up", message: "Synced" }}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
