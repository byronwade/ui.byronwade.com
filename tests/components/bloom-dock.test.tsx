/**
 * Exhaustive tests for BloomDock (components/ui/bloom-dock.tsx).
 *
 * Motion is mocked per-file. BloomDock composes Bloom + BloomFlow for its
 * flow action, so the mock also covers those nested components.
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { axe } from "vitest-axe";
import { Home, MessageSquare, Phone, Settings, Plus, Sparkles } from "lucide-react";

// Mutable reduced-motion flag (see bloom.test.tsx for rationale).
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

import { BloomDock, type BloomDockItem, type BloomDockAction } from "@/components/ui/bloom-dock";
import type { BloomFlowDef } from "@/components/ui/bloom-flow";

// jsdom lacks matchMedia (needed by the nested Bloom for the flow action).
beforeEach(() => {
  motionState.reduce = true;
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});
afterEach(() => {
  vi.restoreAllMocks();
  motionState.reduce = true;
});

const items: BloomDockItem[] = [
  { id: "home", label: "Home", icon: Home, core: true, active: true },
  { id: "calls", label: "Calls", icon: Phone, core: true },
  { id: "messages", label: "Messages", icon: MessageSquare, badge: 3 },
  { id: "settings", label: "Settings", icon: Settings, pinned: true },
];

// ---------------------------------------------------------------------------
// Compact vs full
// ---------------------------------------------------------------------------
describe("BloomDock — compact / expand", () => {
  it("compact shows only core/pinned/active items, hiding collapsible ones", () => {
    render(<BloomDock items={items} />);
    // core + active + pinned are visible; "Messages" (no core/pinned/active) is hidden.
    expect(screen.getByRole("button", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Calls" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Settings" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Messages" })).not.toBeInTheDocument();
  });

  it("expanding reveals all items and toggles aria-expanded", async () => {
    const user = userEvent.setup();
    render(<BloomDock items={items} />);
    const toggle = screen.getByRole("button", { name: "Show all" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(screen.getByRole("button", { name: "Messages" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show fewer" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("omits the expand toggle when there is nothing collapsible", () => {
    const allCore: BloomDockItem[] = [
      { id: "home", label: "Home", icon: Home, core: true },
      { id: "calls", label: "Calls", icon: Phone, core: true },
    ];
    render(<BloomDock items={allCore} />);
    expect(screen.queryByRole("button", { name: /show all|show fewer/i })).not.toBeInTheDocument();
  });

  it("respects expandable={false}", () => {
    render(<BloomDock items={items} expandable={false} />);
    expect(screen.queryByRole("button", { name: /show all/i })).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Item semantics
// ---------------------------------------------------------------------------
describe("BloomDock — item semantics", () => {
  it("active item carries aria-current='page'", () => {
    render(<BloomDock items={items} />);
    expect(screen.getByRole("button", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Calls" })).not.toHaveAttribute("aria-current");
  });

  it("renders an <a> when href is set, else a <button>", () => {
    render(
      <BloomDock
        items={[
          { id: "home", label: "Home", icon: Home, core: true, href: "/home" },
          { id: "calls", label: "Calls", icon: Phone, core: true },
        ]}
      />,
    );
    const link = screen.getByRole("link", { name: "Home" });
    expect(link).toHaveAttribute("href", "/home");
    expect(screen.getByRole("button", { name: "Calls" }).tagName).toBe("BUTTON");
  });

  it("calls item.onSelect when an item is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <BloomDock
        items={[{ id: "home", label: "Home", icon: Home, core: true, onSelect }]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Home" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("renders a badge dot when badge > 0 (and the item is visible)", async () => {
    const user = userEvent.setup();
    const { container } = render(<BloomDock items={items} />);
    await user.click(screen.getByRole("button", { name: "Show all" }));
    const messages = screen.getByRole("button", { name: "Messages" });
    expect(messages.querySelector(".bg-brand")).toBeTruthy();
    // No badge on items with badge undefined / 0.
    expect(
      screen.getByRole("button", { name: "Home" }).querySelector(".bg-brand"),
    ).toBeFalsy();
    expect(container).toBeTruthy();
  });

  it("nav landmark uses navLabel", () => {
    render(<BloomDock items={items} navLabel="Workspace" />);
    expect(screen.getByRole("navigation", { name: "Workspace" })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Cluster + plain action
// ---------------------------------------------------------------------------
describe("BloomDock — cluster & plain action", () => {
  it("renders the cluster node", () => {
    render(<BloomDock items={items} cluster={<span data-testid="cluster">12 online</span>} />);
    expect(screen.getByTestId("cluster")).toHaveTextContent("12 online");
  });

  it("a plain action (onSelect, no flow) runs its handler on click and does not bloom", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const action: BloomDockAction = { label: "Compose", icon: Plus, onSelect };
    render(<BloomDock items={items} action={action} />);

    const actionBtn = screen.getByRole("button", { name: /compose/i });
    await user.click(actionBtn);
    expect(onSelect).toHaveBeenCalledTimes(1);
    // No flow → no dialog.
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Flow action — opens the BloomFlow
// ---------------------------------------------------------------------------
const buyFlow: BloomFlowDef<{ area: string }, { number: string }> = {
  id: "buy",
  initial: { area: "" },
  steps: [
    {
      title: "Choose an area code",
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
  ],
  onComplete: async () => ({ number: "+1 (415) 555-0100" }),
  success: (r) => ({ title: `Bought ${r.number}` }),
};

describe("BloomDock — flow action", () => {
  it("clicking the flow action pill opens the bloom and shows the flow's first step", async () => {
    const user = userEvent.setup();
    const action: BloomDockAction = { label: "Buy number", icon: Sparkles, flow: buyFlow };
    render(<BloomDock items={items} action={action} />);

    // Two triggers exist: the persisted brand pill + the (hidden) bloom bar trigger.
    const pill = screen.getByRole("button", { name: "Buy number" });
    await user.click(pill);

    expect(await screen.findByText("Choose an area code")).toBeInTheDocument();
    expect(screen.getByLabelText("Area code")).toBeInTheDocument();
  });

  it("the flow action pill exposes aria-haspopup='dialog' and toggles aria-expanded", async () => {
    const user = userEvent.setup();
    const action: BloomDockAction = { label: "Buy number", icon: Sparkles, flow: buyFlow };
    render(<BloomDock items={items} action={action} />);
    const pill = screen.getByRole("button", { name: "Buy number" });
    expect(pill).toHaveAttribute("aria-haspopup", "dialog");
    expect(pill).toHaveAttribute("aria-expanded", "false");
    await user.click(pill);
    await waitFor(() => expect(pill).toHaveAttribute("aria-expanded", "true"));
  });
});

// ---------------------------------------------------------------------------
// Tone
// ---------------------------------------------------------------------------
describe("BloomDock — tone", () => {
  it("tone='dock' (default) applies dock background", () => {
    const { container } = render(<BloomDock items={items} />);
    expect((container.firstChild as HTMLElement).className).toContain("bg-dock");
  });

  it("tone='surface' applies card background", () => {
    const { container } = render(<BloomDock items={items} tone="surface" />);
    expect((container.firstChild as HTMLElement).className).toContain("bg-card");
  });
});

// ---------------------------------------------------------------------------
// Non-reduced motion — exercises the animated arm of each ternary across the
// dock + nested Bloom/BloomFlow (DOM identical under the mock).
// ---------------------------------------------------------------------------
describe("BloomDock — non-reduced motion branches", () => {
  beforeEach(() => {
    motionState.reduce = false;
  });

  it("expands and opens a flow with motion enabled", async () => {
    const user = userEvent.setup();
    const action: BloomDockAction = { label: "Buy number", icon: Sparkles, flow: buyFlow };
    render(<BloomDock items={items} action={action} />);
    await user.click(screen.getByRole("button", { name: "Show all" }));
    expect(screen.getByRole("button", { name: "Messages" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Buy number" }));
    expect(await screen.findByText("Choose an area code")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Accessibility
// ---------------------------------------------------------------------------
describe("BloomDock — a11y", () => {
  it("has no axe violations (plain dock)", async () => {
    const { container } = render(
      <BloomDock items={items} cluster={<span>12 online</span>} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
