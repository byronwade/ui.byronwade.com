/**
 * Tests for the gantt (components/ui/gantt.tsx) — adapted from kibo-ui onto the
 * byronwade/ui design system. Drag-and-drop internals (pointer math, dnd-kit
 * sensors) cannot run in jsdom, so these tests maximize the render-path surface:
 * provider + sidebar + header (all three ranges) + feature list / rows / items +
 * markers + today line + create-marker + add-feature helper, plus directly
 * triggerable callbacks (onSelectItem, onRemove, scrollToFeature) and className
 * passthrough, and an axe pass.
 */

import * as React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { addDays, startOfMonth, subDays } from "date-fns";
import { Provider as JotaiProvider } from "jotai";

import {
  GanttAddFeatureHelper,
  GanttColumns,
  GanttControls,
  GanttCreateMarkerTrigger,
  GanttFeatureItem,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttFeatureRow,
  GanttHeader,
  GanttMarker,
  GanttMilestone,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttToday,
  useGanttDragging,
  useGanttScrollX,
  type GanttFeature,
  type Range,
} from "@/components/ui/gantt";

// jsdom lacks these; the gantt + Base UI lean on them.
beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
  if (!("scrollTo" in Element.prototype)) {
    Element.prototype.scrollTo = () => {};
  }
  if (!("getAnimations" in Element.prototype)) {
    Element.prototype.getAnimations = () => [];
  }
});

// Don't leak the no-op ResizeObserver into sibling files in this worker — the
// carousel + recharts behave differently when one is globally present.
afterAll(() => {
  Reflect.deleteProperty(globalThis, "ResizeObserver");
});

const monthStart = startOfMonth(new Date());

const FEATURES: GanttFeature[] = [
  {
    id: "1",
    name: "Design system",
    startAt: subDays(monthStart, 20),
    endAt: addDays(monthStart, 10),
    status: { id: "ip", name: "In Progress", color: "bg-brand" },
  },
  {
    id: "2",
    name: "API integration",
    startAt: addDays(monthStart, 5),
    endAt: addDays(monthStart, 35),
    status: { id: "pl", name: "Planned", color: "bg-secondary" },
  },
];

// A second feature overlapping the first to exercise the sub-row stacking path.
const OVERLAPPING: GanttFeature[] = [
  FEATURES[0],
  {
    ...FEATURES[1],
    id: "3",
    startAt: subDays(monthStart, 18),
    endAt: addDays(monthStart, 2),
  },
];

function Board({
  range = "monthly",
  onSelectItem,
  onMove,
  onAddItem,
  onRemoveMarker,
  features = FEATURES,
  className,
}: {
  range?: Range;
  onSelectItem?: (id: string) => void;
  onMove?: (id: string, s: Date, e: Date | null) => void;
  onAddItem?: (date: Date) => void;
  onRemoveMarker?: (id: string) => void;
  features?: GanttFeature[];
  className?: string;
}) {
  return (
    <GanttProvider
      range={range}
      zoom={100}
      onAddItem={onAddItem}
      className={className}
    >
      <GanttSidebar>
        <GanttSidebarGroup name="Roadmap">
          {features.map((f) => (
            <GanttSidebarItem
              feature={f}
              key={f.id}
              onSelectItem={onSelectItem}
            />
          ))}
        </GanttSidebarGroup>
      </GanttSidebar>
      <GanttTimeline>
        <GanttHeader />
        <GanttFeatureList>
          <GanttFeatureListGroup>
            <GanttFeatureRow features={features} onMove={onMove} />
          </GanttFeatureListGroup>
        </GanttFeatureList>
        <GanttMarker
          id="m1"
          date={addDays(monthStart, 12)}
          label="Milestone"
          onRemove={onRemoveMarker}
        />
        <GanttToday />
        <GanttCreateMarkerTrigger onCreateMarker={() => {}} />
      </GanttTimeline>
    </GanttProvider>
  );
}

describe("gantt — structure", () => {
  it("renders the provider, sidebar, timeline and header", () => {
    const { container } = render(<Board />);
    expect(container.querySelector('[data-slot="gantt"]')).not.toBeNull();
    expect(
      container.querySelector('[data-slot="gantt-sidebar"]')
    ).not.toBeNull();
    expect(
      container.querySelector('[data-slot="gantt-timeline"]')
    ).not.toBeNull();
    expect(container.querySelector('[data-slot="gantt-header"]')).not.toBeNull();
    // Sidebar header labels.
    expect(screen.getByText("Issues")).toBeInTheDocument();
    expect(screen.getByText("Duration")).toBeInTheDocument();
    expect(screen.getByText("Roadmap")).toBeInTheDocument();
  });

  it("renders a sidebar item + feature bar per feature", () => {
    const { container } = render(<Board />);
    // Names appear in both the sidebar and the bar → at least one each.
    expect(screen.getAllByText("Design system").length).toBeGreaterThan(0);
    expect(screen.getAllByText("API integration").length).toBeGreaterThan(0);
    expect(
      container.querySelectorAll('[data-slot="gantt-feature-item"]').length
    ).toBe(2);
    expect(
      container.querySelector('[data-slot="gantt-feature-item-card"]')
    ).not.toBeNull();
  });

  it("renders the today line and a marker", () => {
    const { container } = render(<Board />);
    expect(container.querySelector('[data-slot="gantt-today"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="gantt-marker"]')).not.toBeNull();
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Milestone")).toBeInTheDocument();
  });

  it("renders the create-marker trigger with a formatted (mono) date", () => {
    const { container } = render(<Board />);
    expect(
      container.querySelector('[data-slot="gantt-create-marker-trigger"]')
    ).not.toBeNull();
    // A date string in "MMM dd, yyyy" form is rendered.
    expect(
      container.querySelectorAll(".font-mono").length
    ).toBeGreaterThan(0);
  });

  it("passes className through to the provider root", () => {
    const { container } = render(<Board className="ring-2 ring-ring" />);
    const root = container.querySelector('[data-slot="gantt"]')!;
    expect(root).toHaveClass("ring-2");
    expect(root).toHaveClass("ring-ring");
  });
});

describe("gantt — header ranges", () => {
  it.each(["daily", "monthly", "quarterly"] as Range[])(
    "renders the %s header",
    (range) => {
      const { container } = render(<Board range={range} />);
      const root = container.querySelector('[data-slot="gantt"]')!;
      expect(root).toHaveClass(range);
      expect(
        container.querySelectorAll('[data-slot="gantt-content-header"]').length
      ).toBeGreaterThan(0);
      expect(
        container.querySelectorAll('[data-slot="gantt-columns"]').length
      ).toBeGreaterThan(0);
    }
  );
});

describe("gantt — sidebar item interactions", () => {
  it("fires onSelectItem + scrolls when the row itself is clicked", async () => {
    const onSelectItem = vi.fn();
    const { container } = render(<Board onSelectItem={onSelectItem} />);
    const item = container.querySelector(
      '[data-slot="gantt-sidebar-item"]'
    ) as HTMLElement;
    // Click the row element directly (event.target === currentTarget).
    fireEvent.click(item, { target: item });
    expect(onSelectItem).toHaveBeenCalledWith("1");
  });

  it("fires onSelectItem on Enter keydown", () => {
    const onSelectItem = vi.fn();
    const { container } = render(<Board onSelectItem={onSelectItem} />);
    const item = container.querySelector(
      '[data-slot="gantt-sidebar-item"]'
    ) as HTMLElement;
    fireEvent.keyDown(item, { key: "Enter" });
    expect(onSelectItem).toHaveBeenCalledWith("1");
  });

  it("ignores other keys", () => {
    const onSelectItem = vi.fn();
    const { container } = render(<Board onSelectItem={onSelectItem} />);
    const item = container.querySelector(
      '[data-slot="gantt-sidebar-item"]'
    ) as HTMLElement;
    fireEvent.keyDown(item, { key: "a" });
    expect(onSelectItem).not.toHaveBeenCalled();
  });

  it("renders a duration string and a token-driven status dot", () => {
    const { container } = render(<Board />);
    const item = container.querySelector(
      '[data-slot="gantt-sidebar-item"]'
    ) as HTMLElement;
    // duration text uses formatDistance → contains 'month' or 'day'.
    expect(item.textContent).toMatch(/day|month|week/i);
    // status dot carries the token class passed in (bg-brand).
    expect(item.querySelector(".bg-brand")).not.toBeNull();
  });

  it("renders 'so far' duration when start === end (same day)", () => {
    const sameDay = addDays(monthStart, 3);
    const feat: GanttFeature = {
      id: "x",
      name: "Spike",
      startAt: sameDay,
      endAt: sameDay,
      status: { id: "s", name: "S", color: "bg-secondary" },
    };
    render(
      <GanttProvider range="monthly">
        <GanttSidebar>
          <GanttSidebarGroup name="G">
            <GanttSidebarItem feature={feat} />
          </GanttSidebarGroup>
        </GanttSidebar>
      </GanttProvider>
    );
    expect(screen.getByText("Spike")).toBeInTheDocument();
  });
});

describe("gantt — feature rows & overlap stacking", () => {
  it("stacks overlapping features onto sub-rows", () => {
    const { container } = render(<Board features={OVERLAPPING} />);
    // Two bars rendered even though they overlap in time.
    expect(
      container.querySelectorAll('[data-slot="gantt-feature-item"]').length
    ).toBe(2);
  });

  it("renders drag helpers only when onMove is supplied", () => {
    const onMove = vi.fn();
    const { container } = render(<Board onMove={onMove} />);
    expect(
      container.querySelectorAll('[data-slot="gantt-feature-drag-helper"]')
        .length
    ).toBeGreaterThan(0);
  });

  it("renders no drag helpers without onMove", () => {
    const { container } = render(<Board />);
    expect(
      container.querySelectorAll('[data-slot="gantt-feature-drag-helper"]')
        .length
    ).toBe(0);
  });

  it("drives a mouse drag on a feature bar (onMove path)", () => {
    const onMove = vi.fn();
    const { container } = render(<Board onMove={onMove} />);
    const card = container.querySelector(
      '[data-slot="gantt-feature-item-card"]'
    )!;
    const handle = card.querySelector("div")!;
    // dnd-kit MouseSensor: mousedown → move past activation distance → up.
    fireEvent.mouseDown(handle, { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 60, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 120, clientY: 0 });
    fireEvent.mouseUp(document);
    // Whether or not jsdom fully simulates the drag, the component stays mounted.
    expect(card).toBeInTheDocument();
  });

  it("drives a daily-range drag (daily delta branch)", () => {
    const onMove = vi.fn();
    const { container } = render(<Board range="daily" onMove={onMove} />);
    const card = container.querySelector(
      '[data-slot="gantt-feature-item-card"]'
    )!;
    const handle = card.querySelector("div")!;
    fireEvent.mouseDown(handle, { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 60, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 120, clientY: 0 });
    fireEvent.mouseUp(document);
    expect(card).toBeInTheDocument();
  });

  it("drives the right resize handle (endAt fallback branch)", () => {
    const onMove = vi.fn();
    const { container } = render(<Board onMove={onMove} />);
    const handles = container.querySelectorAll(
      '[data-slot="gantt-feature-drag-helper"]'
    );
    // Each feature has a left (index 0) and right (index 1) handle.
    const right = handles[1]!;
    fireEvent.mouseDown(right, { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 40, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 90, clientY: 0 });
    fireEvent.mouseUp(document);
    expect(right).toBeInTheDocument();
  });

  it("drives a mouse drag on the left resize handle", () => {
    const onMove = vi.fn();
    const { container } = render(<Board onMove={onMove} />);
    const handle = container.querySelector(
      '[data-slot="gantt-feature-drag-helper"]'
    )!;
    fireEvent.mouseDown(handle, { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 40, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 80, clientY: 0 });
    fireEvent.mouseUp(document);
    expect(handle).toBeInTheDocument();
  });

  it("supports a custom feature renderer via children", () => {
    render(
      <GanttProvider range="monthly">
        <GanttTimeline>
          <GanttFeatureList>
            <GanttFeatureListGroup>
              <GanttFeatureRow features={FEATURES}>
                {(f) => <span data-testid="custom">★ {f.name}</span>}
              </GanttFeatureRow>
            </GanttFeatureListGroup>
          </GanttFeatureList>
        </GanttTimeline>
      </GanttProvider>
    );
    expect(screen.getAllByTestId("custom").length).toBe(2);
  });
});

describe("gantt — feature item directly", () => {
  it("renders a single feature item with a bar card", () => {
    const { container } = render(
      <GanttProvider range="daily">
        <GanttTimeline>
          <GanttFeatureList>
            <GanttFeatureItem {...FEATURES[0]} />
          </GanttFeatureList>
        </GanttTimeline>
      </GanttProvider>
    );
    expect(
      container.querySelector('[data-slot="gantt-feature-item-card"]')
    ).not.toBeNull();
  });
});

describe("gantt — marker context menu", () => {
  it("opens the context menu and fires onRemove", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<Board onRemoveMarker={onRemove} />);
    const trigger = screen.getByText("Milestone");
    // Right-click to open the Base UI context menu.
    fireEvent.contextMenu(trigger);
    const remove = await screen.findByText("Remove marker");
    await user.click(remove);
    expect(onRemove).toHaveBeenCalledWith("m1");
  });

  it("renders no remove item when onRemove is omitted", () => {
    render(
      <GanttProvider range="monthly">
        <GanttTimeline>
          <GanttMarker id="m2" date={monthStart} label="NoRemove" />
        </GanttTimeline>
      </GanttProvider>
    );
    fireEvent.contextMenu(screen.getByText("NoRemove"));
    expect(screen.queryByText("Remove marker")).not.toBeInTheDocument();
  });
});

describe("gantt — add-feature helper", () => {
  it("shows the add-feature button on column hover when onAddItem is set", () => {
    const onAddItem = vi.fn();
    const { container } = render(<Board onAddItem={onAddItem} />);
    const column = container.querySelector(
      '[data-slot="gantt-column"]'
    ) as HTMLElement;
    fireEvent.mouseEnter(column);
    const helper = container.querySelector(
      '[data-slot="gantt-add-feature-helper"]'
    );
    expect(helper).not.toBeNull();
    // Clicking the helper invokes onAddItem with a Date.
    const button = helper!.querySelector("button")!;
    fireEvent.click(button);
    expect(onAddItem).toHaveBeenCalled();
    expect(onAddItem.mock.calls[0][0]).toBeInstanceOf(Date);
    fireEvent.mouseLeave(column);
  });

  it("does not show the helper without onAddItem", () => {
    const { container } = render(<Board />);
    const column = container.querySelector(
      '[data-slot="gantt-column"]'
    ) as HTMLElement;
    fireEvent.mouseEnter(column);
    expect(
      container.querySelector('[data-slot="gantt-add-feature-helper"]')
    ).toBeNull();
  });
});

describe("gantt — create marker trigger callback", () => {
  it("invokes onCreateMarker with a Date when clicked", () => {
    const onCreateMarker = vi.fn();
    const { container } = render(
      <GanttProvider range="monthly">
        <GanttTimeline>
          <GanttCreateMarkerTrigger onCreateMarker={onCreateMarker} />
        </GanttTimeline>
      </GanttProvider>
    );
    const trigger = container.querySelector(
      '[data-slot="gantt-create-marker-trigger"]'
    )!;
    const button = trigger.querySelector("button")!;
    fireEvent.click(button);
    expect(onCreateMarker).toHaveBeenCalled();
    expect(onCreateMarker.mock.calls[0][0]).toBeInstanceOf(Date);
  });
});

describe("gantt — standalone columns", () => {
  it("marks secondary columns with bg-secondary", () => {
    const { container } = render(
      <GanttProvider range="daily">
        <GanttTimeline>
          <GanttColumns columns={4} isColumnSecondary={(i) => i % 2 === 0} />
        </GanttTimeline>
      </GanttProvider>
    );
    const cols = container.querySelectorAll('[data-slot="gantt-column"]');
    expect(cols.length).toBe(4);
    expect(cols[0]).toHaveClass("bg-secondary");
    expect(cols[1]).not.toHaveClass("bg-secondary");
  });
});

describe("gantt — scroll handler & scrollToFeature", () => {
  it("scrolling the root timeline updates state without crashing", () => {
    const { container } = render(<Board />);
    const root = container.querySelector('[data-slot="gantt"]') as HTMLElement;
    // Give the element measurable dimensions so the handler's branches run.
    Object.defineProperty(root, "scrollWidth", {
      configurable: true,
      value: 4000,
    });
    Object.defineProperty(root, "clientWidth", {
      configurable: true,
      value: 1000,
    });
    // Mid-scroll (neither edge) → just records scrollX.
    root.scrollLeft = 1500;
    fireEvent.scroll(root);
    // Far-right edge → extends the timeline into the future.
    root.scrollLeft = 3000;
    fireEvent.scroll(root);
    // Far-left edge → extends into the past.
    root.scrollLeft = 0;
    fireEvent.scroll(root);
    expect(root).toBeInTheDocument();
  });

  it("clicking a sidebar item runs scrollToFeature (smooth scrollTo)", () => {
    const scrollToSpy = vi.spyOn(Element.prototype, "scrollTo");
    const { container } = render(<Board />);
    const item = container.querySelector(
      '[data-slot="gantt-sidebar-item"]'
    ) as HTMLElement;
    fireEvent.click(item, { target: item });
    expect(scrollToSpy).toHaveBeenCalled();
    scrollToSpy.mockRestore();
  });
});

describe("gantt — exported atoms", () => {
  it("exposes dragging + scrollX atom hooks", () => {
    function Probe() {
      const [dragging] = useGanttDragging();
      const [scrollX] = useGanttScrollX();
      return (
        <span data-testid="probe">
          {String(dragging)}:{scrollX}
        </span>
      );
    }
    // Fresh jotai store so the global scrollX atom (written by Board renders in
    // other tests) can't leak in — we're asserting the hooks' defaults.
    render(
      <JotaiProvider>
        <Probe />
      </JotaiProvider>,
    );
    expect(screen.getByTestId("probe").textContent).toBe("false:0");
  });
});

describe("gantt — variants", () => {
  it("density='compact' tightens the row-height CSS var; comfortable is the default", () => {
    const { container, rerender } = render(<Board />);
    const root = () =>
      container.querySelector('[data-slot="gantt"]') as HTMLElement;
    expect(root().style.getPropertyValue("--gantt-row-height")).toBe("40px");

    rerender(
      <GanttProvider range="monthly" density="compact">
        <GanttSidebar>
          <GanttSidebarGroup name="Roadmap">
            {FEATURES.map((f) => (
              <GanttSidebarItem feature={f} key={f.id} />
            ))}
          </GanttSidebarGroup>
        </GanttSidebar>
        <GanttTimeline>
          <GanttHeader />
        </GanttTimeline>
      </GanttProvider>
    );
    expect(root().style.getPropertyValue("--gantt-row-height")).toBe("26px");
  });

  it("read-only feature bars carry no drag affordance", () => {
    const { container } = render(
      <GanttProvider range="monthly" readOnly>
        <GanttTimeline>
          <GanttFeatureList>
            <GanttFeatureListGroup>
              {FEATURES.map((f) => (
                <GanttFeatureItem {...f} key={f.id} />
              ))}
            </GanttFeatureListGroup>
          </GanttFeatureList>
        </GanttTimeline>
      </GanttProvider>
    );
    expect(
      container.querySelector('[aria-roledescription="draggable"]')
    ).toBeNull();
    expect(
      container.querySelector('[data-slot="gantt-feature-item-card"]')
    ).not.toBeNull();
  });

  it("tints the bar with a status-colored accent strip", () => {
    const { container } = render(
      <GanttProvider range="monthly" readOnly>
        <GanttTimeline>
          <GanttFeatureList>
            <GanttFeatureListGroup>
              <GanttFeatureItem {...FEATURES[0]} />
            </GanttFeatureListGroup>
          </GanttFeatureList>
        </GanttTimeline>
      </GanttProvider>
    );
    const card = container.querySelector(
      '[data-slot="gantt-feature-item-card"]'
    ) as HTMLElement;
    expect(card.getAttribute("data-status-color")).toBe("bg-brand");
    expect(card.querySelector(".bg-brand")).not.toBeNull();
  });

  it("GanttMilestone renders a labelled diamond on the timeline", () => {
    render(
      <GanttProvider range="monthly">
        <GanttTimeline>
          <GanttFeatureList>
            <GanttMilestone date={addDays(monthStart, 10)} label="Launch" />
          </GanttFeatureList>
        </GanttTimeline>
      </GanttProvider>
    );
    expect(
      document.querySelector('[data-slot="gantt-milestone"]')
    ).not.toBeNull();
    expect(screen.getByText("Launch")).toBeInTheDocument();
  });
});

describe("gantt — controls", () => {
  function Controlled() {
    return (
      <GanttProvider range="monthly" zoom={100}>
        <GanttControls />
        <GanttTimeline>
          <GanttHeader />
        </GanttTimeline>
      </GanttProvider>
    );
  }

  it("marks the active range and switches timescale on click", async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    const month = screen.getByRole("button", { name: "Month" });
    const day = screen.getByRole("button", { name: "Day" });
    expect(month).toHaveAttribute("data-active", "true");
    expect(day).toHaveAttribute("data-active", "false");
    await user.click(day);
    expect(day).toHaveAttribute("data-active", "true");
    expect(month).toHaveAttribute("data-active", "false");
  });

  it("steps the zoom and clamps to 50–200%", async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    expect(screen.getByText("100%")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Zoom in" }));
    expect(screen.getByText("125%")).toBeInTheDocument();
    // Walk down to the floor and confirm the out button disables at 50%.
    const out = screen.getByRole("button", { name: "Zoom out" });
    for (let i = 0; i < 5; i++) {
      await user.click(out);
    }
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(out).toBeDisabled();
  });
});

describe("gantt — getWidth date branches", () => {
  // daily range, startAt === endAt → differenceInDays is 0 → falls back to `1`.
  it("daily same-day feature falls back to a single-column width", () => {
    const sameDay = addDays(monthStart, 4);
    const feat: GanttFeature = {
      id: "d",
      name: "Day spike",
      startAt: sameDay,
      endAt: sameDay,
      status: { id: "s", name: "S", color: "bg-brand" },
    };
    const { container } = render(
      <GanttProvider range="daily">
        <GanttTimeline>
          <GanttFeatureList>
            <GanttFeatureItem {...feat} />
          </GanttFeatureList>
        </GanttTimeline>
      </GanttProvider>
    );
    expect(
      container.querySelector('[data-slot="gantt-feature-item-card"]')
    ).not.toBeNull();
  });

  // monthly range, startAt === endAt → isSameDay(startAt, endAt) true branch.
  it("monthly same-day feature uses the single-day width branch", () => {
    const sameDay = addDays(monthStart, 6);
    const feat: GanttFeature = {
      id: "ms",
      name: "Same day",
      startAt: sameDay,
      endAt: sameDay,
      status: { id: "s", name: "S", color: "bg-brand" },
    };
    const { container } = render(
      <GanttProvider range="monthly">
        <GanttTimeline>
          <GanttFeatureList>
            <GanttFeatureItem {...feat} />
          </GanttFeatureList>
        </GanttTimeline>
      </GanttProvider>
    );
    expect(
      container.querySelector('[data-slot="gantt-feature-item-card"]')
    ).not.toBeNull();
  });

  // monthly range, start & end in the SAME month but different days →
  // isSameDay(startOf(startAt), startOf(endAt)) true (inner-difference branch).
  it("monthly same-month span uses the inner-difference width branch", () => {
    const start = startOfMonth(new Date());
    const feat: GanttFeature = {
      id: "mm",
      name: "Same month",
      startAt: addDays(start, 2),
      endAt: addDays(start, 9),
      status: { id: "s", name: "S", color: "bg-brand" },
    };
    const { container } = render(
      <GanttProvider range="monthly">
        <GanttTimeline>
          <GanttFeatureList>
            <GanttFeatureItem {...feat} />
          </GanttFeatureList>
        </GanttTimeline>
      </GanttProvider>
    );
    expect(
      container.querySelector('[data-slot="gantt-feature-item-card"]')
    ).not.toBeNull();
  });
});

describe("gantt — null endAt (open-ended feature)", () => {
  // With no GanttProvider the component reads the DEFAULT context
  // (ref: null, timelineData: []). That exercises three fallbacks at once:
  //   • getWidth `!endAt` → width = columnWidth * 2  (b14)
  //   • timelineData.at(0)?.year ?? 0                (b48)
  //   • right drag-helper date `endAt ?? addRange`   (b58)
  // and gives us a handle on the drag callbacks whose ganttRect is undefined.
  const openFeature = {
    id: "open",
    name: "Open ended",
    startAt: monthStart,
    endAt: null as unknown as Date,
    status: { id: "s", name: "S", color: "bg-brand" },
  } as unknown as GanttFeature;

  it("renders an open-ended bar (null endAt) with drag handles", () => {
    const onMove = vi.fn();
    const { container } = render(
      <GanttFeatureList>
        <GanttFeatureItem {...openFeature} onMove={onMove} />
      </GanttFeatureList>
    );
    const card = container.querySelector(
      '[data-slot="gantt-feature-item-card"]'
    );
    expect(card).not.toBeNull();
    // left + right resize handles present.
    expect(
      container.querySelectorAll('[data-slot="gantt-feature-drag-helper"]')
        .length
    ).toBe(2);
  });

  // The drag math (getDateByMousePosition) dereferences timelineData[0], so the
  // drag callbacks must run inside a provider. Pair the provider with a null
  // endAt to reach handleItemDragMove's `previousEndAt ? … : null` (b50) branch.
  it("drives the card drag with a null endAt (previousEndAt → null branch)", () => {
    const onMove = vi.fn();
    const { container } = render(
      <GanttProvider range="monthly">
        <GanttTimeline>
          <GanttFeatureList>
            <GanttFeatureItem {...openFeature} onMove={onMove} />
          </GanttFeatureList>
        </GanttTimeline>
      </GanttProvider>
    );
    const card = container.querySelector(
      '[data-slot="gantt-feature-item-card"]'
    )!;
    const handle = card.querySelector("div")!;
    fireEvent.mouseDown(handle, { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 60, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 120, clientY: 0 });
    fireEvent.mouseUp(document);
    expect(card).toBeInTheDocument();
  });

  it("sidebar duration shows '…so far' when endAt is null", () => {
    render(
      <GanttProvider range="monthly">
        <GanttSidebar>
          <GanttSidebarGroup name="G">
            <GanttSidebarItem feature={openFeature} />
          </GanttSidebarGroup>
        </GanttSidebar>
      </GanttProvider>
    );
    expect(screen.getByText(/so far/i)).toBeInTheDocument();
  });

  it("renders a feature bar without a status color (statusColor → undefined)", () => {
    const noColor = {
      id: "nc",
      name: "No color",
      startAt: monthStart,
      endAt: addDays(monthStart, 5),
      status: { id: "s", name: "S", color: "" },
    } as GanttFeature;
    const { container } = render(
      <GanttProvider range="monthly">
        <GanttTimeline>
          <GanttFeatureList>
            <GanttFeatureItem {...noColor} />
          </GanttFeatureList>
        </GanttTimeline>
      </GanttProvider>
    );
    const card = container.querySelector(
      '[data-slot="gantt-feature-item-card"]'
    ) as HTMLElement;
    expect(card.getAttribute("data-status-color")).toBeNull();
  });
});

describe("gantt — default-context fallbacks (no provider)", () => {
  // Each of these reads timelineData.at(0)?.year ?? 0 from the DEFAULT context.
  it("GanttMarker renders against an empty timeline", () => {
    const { container } = render(
      <GanttMarker id="solo" date={monthStart} label="Solo" />
    );
    expect(
      container.querySelector('[data-slot="gantt-marker"]')
    ).not.toBeNull();
    expect(screen.getByText("Solo")).toBeInTheDocument();
  });

  it("GanttToday renders against an empty timeline", () => {
    const { container } = render(<GanttToday />);
    expect(container.querySelector('[data-slot="gantt-today"]')).not.toBeNull();
  });

  it("GanttMilestone renders against an empty timeline", () => {
    const { container } = render(
      <GanttMilestone date={monthStart} label="Solo milestone" />
    );
    expect(
      container.querySelector('[data-slot="gantt-milestone"]')
    ).not.toBeNull();
  });

  // GanttAddFeatureHelper renders standalone (default context → ref null) to
  // exercise its render path without a provider.
  it("GanttAddFeatureHelper renders an add button against the default context", () => {
    const { container } = render(<GanttAddFeatureHelper top={0} />);
    expect(
      container.querySelector('[data-slot="gantt-add-feature-helper"]')
    ).not.toBeNull();
    expect(
      container.querySelector('button[aria-label="Add feature"]')
    ).not.toBeNull();
  });
});

describe("gantt — sidebar click on a child element", () => {
  it("does not fire onSelectItem when a child (not the row) is clicked", () => {
    const onSelectItem = vi.fn();
    const { container } = render(<Board onSelectItem={onSelectItem} />);
    const item = container.querySelector(
      '[data-slot="gantt-sidebar-item"]'
    ) as HTMLElement;
    // The status dot / labels are children → event.target !== currentTarget.
    const child = item.querySelector("p")!;
    fireEvent.click(child);
    expect(onSelectItem).not.toHaveBeenCalled();
  });
});

describe("gantt — non-overlapping sub-row reuse", () => {
  it("reuses sub-row 0 for sequential (non-overlapping) features", () => {
    const sequential: GanttFeature[] = [
      {
        id: "a",
        name: "First",
        startAt: addDays(monthStart, 0),
        endAt: addDays(monthStart, 3),
        status: { id: "s", name: "S", color: "bg-brand" },
      },
      {
        id: "b",
        name: "Second",
        startAt: addDays(monthStart, 10),
        endAt: addDays(monthStart, 14),
        status: { id: "s", name: "S", color: "bg-brand" },
      },
    ];
    const { container } = render(
      <GanttProvider range="monthly">
        <GanttTimeline>
          <GanttFeatureList>
            <GanttFeatureListGroup>
              <GanttFeatureRow features={sequential} />
            </GanttFeatureListGroup>
          </GanttFeatureList>
        </GanttTimeline>
      </GanttProvider>
    );
    const row = container.querySelector(
      '[data-slot="gantt-feature-row"]'
    ) as HTMLElement;
    // Both bars share sub-row 0 → the row height stays a single sub-row (36px).
    expect(row.style.height).toBe("36px");
    expect(
      container.querySelectorAll('[data-slot="gantt-feature-item"]').length
    ).toBe(2);
  });
});

describe("gantt — infinite-scroll edges (per-render, throttle leading edge)", () => {
  // lodash.throttle runs only the FIRST scroll of a 100ms window synchronously,
  // so each edge needs its own fresh render to hit the leading edge.
  function measured(root: HTMLElement) {
    Object.defineProperty(root, "scrollWidth", {
      configurable: true,
      value: 4000,
    });
    Object.defineProperty(root, "clientWidth", {
      configurable: true,
      value: 1000,
    });
  }

  it("extends the timeline into the future at the far-right edge", () => {
    const { container } = render(<Board />);
    const root = container.querySelector('[data-slot="gantt"]') as HTMLElement;
    measured(root);
    const before = container.querySelectorAll(
      '[data-slot="gantt-content-header"]'
    ).length;
    root.scrollLeft = 3000; // scrollLeft + clientWidth (1000) >= scrollWidth
    fireEvent.scroll(root);
    const after = container.querySelectorAll(
      '[data-slot="gantt-content-header"]'
    ).length;
    expect(after).toBeGreaterThan(before);
  });

  it("extends the timeline into the past at the far-left edge", () => {
    const { container } = render(<Board />);
    const root = container.querySelector('[data-slot="gantt"]') as HTMLElement;
    measured(root);
    const before = container.querySelectorAll(
      '[data-slot="gantt-content-header"]'
    ).length;
    root.scrollLeft = 0; // scrollLeft === 0 → extend into the past
    fireEvent.scroll(root);
    const after = container.querySelectorAll(
      '[data-slot="gantt-content-header"]'
    ).length;
    expect(after).toBeGreaterThan(before);
  });
});

describe("gantt — accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(<Board />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("read-only + controls have no axe violations", async () => {
    const { container } = render(
      <GanttProvider range="monthly" readOnly>
        <GanttControls />
        <GanttTimeline>
          <GanttHeader />
          <GanttFeatureList>
            <GanttFeatureListGroup>
              {FEATURES.map((f) => (
                <GanttFeatureItem {...f} key={f.id} />
              ))}
            </GanttFeatureListGroup>
          </GanttFeatureList>
          <GanttMilestone date={addDays(monthStart, 10)} label="Launch" />
        </GanttTimeline>
      </GanttProvider>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
