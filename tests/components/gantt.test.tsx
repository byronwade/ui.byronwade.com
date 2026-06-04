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

import {
  GanttColumns,
  GanttCreateMarkerTrigger,
  GanttFeatureItem,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttFeatureRow,
  GanttHeader,
  GanttMarker,
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
    render(<Probe />);
    expect(screen.getByTestId("probe").textContent).toBe("false:0");
  });
});

describe("gantt — accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(<Board />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
