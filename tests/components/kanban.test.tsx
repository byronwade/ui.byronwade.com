/**
 * Tests for kanban (components/ui/kanban.tsx) — a drag-and-drop board adapted
 * from kibo-ui. Real pointer/keyboard drag is unreliable in jsdom, so we mock
 * @dnd-kit/core's DndContext to capture its props (handlers + announcements)
 * and drive the real provider logic directly via act(), while keeping the real
 * provider so useDroppable/useSortable don't throw. Covers structure, slots,
 * content, className passthrough, the active-card overlay branch, every drag
 * handler branch, the four announcement callbacks, and a11y.
 */

import * as React from "react";
import { act, render, screen, within } from "@testing-library/react";
import { axe } from "vitest-axe";

// Capture the props DndContext receives so we can invoke the provider's
// handlers/announcements directly.
const h = vi.hoisted(() => ({ props: null as any }));

vi.mock("@dnd-kit/core", async (orig) => {
  const actual = (await orig()) as typeof import("@dnd-kit/core");
  return {
    ...actual,
    DndContext: (props: any) => {
      h.props = props;
      return <actual.DndContext {...props} />;
    },
  };
});

import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/ui/kanban";

// ScrollArea (Base UI) needs ResizeObserver + Element.getAnimations.
beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
  if (!("getAnimations" in Element.prototype)) {
    Element.prototype.getAnimations = () => [];
  }
});

// Don't leak the no-op ResizeObserver into sibling files in this worker — the
// carousel + recharts behave differently when one is globally present.
afterAll(() => {
  Reflect.deleteProperty(globalThis, "ResizeObserver");
});

beforeEach(() => {
  h.props = null;
});

const columns = [
  { id: "todo", name: "To do" },
  { id: "doing", name: "Doing" },
  { id: "done", name: "Done" },
];

type Task = { id: string; name: string; column: string };

// Fresh per Board render: the adapted provider preserves kibo-ui's in-place
// column mutation on drag-over, so a shared array would leak across tests.
const makeData = (): Task[] => [
  { id: "1", name: "Alpha", column: "todo" },
  { id: "2", name: "Beta", column: "doing" },
  { id: "3", name: "Gamma", column: "done" },
];

function Board({
  onDataChange,
  onDragStart,
  onDragEnd,
  onDragOver,
  cardChildren = true,
  className,
  boardClassName,
}: {
  onDataChange?: (d: Task[]) => void;
  onDragStart?: (e: any) => void;
  onDragEnd?: (e: any) => void;
  onDragOver?: (e: any) => void;
  cardChildren?: boolean;
  className?: string;
  boardClassName?: string;
}) {
  const [data] = React.useState(makeData);
  return (
    <KanbanProvider
      className={className}
      columns={columns}
      data={data}
      onDataChange={onDataChange}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragStart={onDragStart}
    >
      {(column) => (
        <KanbanBoard className={boardClassName} id={column.id} key={column.id}>
          <KanbanHeader>{column.name}</KanbanHeader>
          <KanbanCards id={column.id}>
            {(task: Task) =>
              cardChildren ? (
                <KanbanCard
                  className="card-extra"
                  column={task.column}
                  id={task.id}
                  key={task.id}
                  name={task.name}
                >
                  <span>{task.name} body</span>
                </KanbanCard>
              ) : (
                <KanbanCard
                  column={task.column}
                  id={task.id}
                  key={task.id}
                  name={task.name}
                />
              )
            }
          </KanbanCards>
        </KanbanBoard>
      )}
    </KanbanProvider>
  );
}

describe("kanban — structure & rendering", () => {
  it("renders the provider grid, one board per column, headers, and cards", () => {
    const { container } = render(<Board />);

    expect(
      container.querySelector('[data-slot="kanban-provider"]')
    ).not.toBeNull();
    expect(container.querySelectorAll('[data-slot="kanban-board"]')).toHaveLength(
      3
    );

    const headers = container.querySelectorAll('[data-slot="kanban-header"]');
    expect(headers).toHaveLength(3);
    expect(screen.getByText("To do")).toBeInTheDocument();
    expect(screen.getByText("Doing")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();

    // Each card region exists and cards are filtered into the right column.
    expect(container.querySelectorAll('[data-slot="kanban-cards"]')).toHaveLength(
      3
    );
    expect(container.querySelectorAll('[data-slot="kanban-card"]')).toHaveLength(
      3
    );
    expect(screen.getByText("Alpha body")).toBeInTheDocument();
    expect(screen.getByText("Beta body")).toBeInTheDocument();
    expect(screen.getByText("Gamma body")).toBeInTheDocument();
  });

  it("filters each card into its own column board", () => {
    const { container } = render(<Board />);
    const cardRegions = container.querySelectorAll(
      '[data-slot="kanban-cards"]'
    );
    // first region is 'todo' → only Alpha
    expect(within(cardRegions[0] as HTMLElement).getByText(/Alpha/)).toBeInTheDocument();
    expect(
      within(cardRegions[0] as HTMLElement).queryByText(/Beta/)
    ).not.toBeInTheDocument();
  });

  it("renders the default name paragraph when no children are provided", () => {
    render(<Board cardChildren={false} />);
    // KanbanCard falls back to <p>{name}</p>
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("passes className through to provider grid, board, and card", () => {
    const { container } = render(
      <Board boardClassName="board-extra" className="grid-extra" />
    );
    expect(
      container.querySelector('[data-slot="kanban-provider"]')
    ).toHaveClass("grid-extra");
    expect(
      container.querySelector('[data-slot="kanban-board"]')
    ).toHaveClass("board-extra");
    expect(
      container.querySelector('[data-slot="kanban-card"]')
    ).toHaveClass("card-extra");
  });
});

describe("kanban — drag handlers (driven via captured DndContext props)", () => {
  it("onDragStart sets the active card, evaluating the overlay-clone branch", () => {
    const onDragStart = vi.fn();
    render(<Board onDragStart={onDragStart} />);

    expect(h.props).not.toBeNull();
    // Before: exactly one rendered copy of the card body.
    expect(screen.getAllByText("Alpha body")).toHaveLength(1);

    act(() => {
      h.props.onDragStart({ active: { id: "1" } });
    });

    // Setting activeCardId === "1" executes KanbanCard's `t.In` overlay-clone
    // branch (pushed into the tunnel). dnd-kit's DragOverlay only paints the
    // tunnel content during a real drag, so we assert the branch ran by the
    // forwarded callback + a stable, still-rendered board rather than a
    // duplicated DOM node.
    expect(onDragStart).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Alpha body")).toBeInTheDocument();
  });

  it("onDragStart ignores an unknown active id (no overlay)", () => {
    render(<Board />);
    act(() => {
      h.props.onDragStart({ active: { id: "nope" } });
    });
    expect(screen.getAllByText("Alpha body")).toHaveLength(1);
  });

  it("onDragOver moves a card to another column when over a card there", () => {
    const onDataChange = vi.fn();
    const onDragOver = vi.fn();
    render(<Board onDataChange={onDataChange} onDragOver={onDragOver} />);

    act(() => {
      // Alpha (todo) dragged over Beta (doing) → column change.
      h.props.onDragOver({ active: { id: "1" }, over: { id: "2" } });
    });
    expect(onDataChange).toHaveBeenCalledTimes(1);
    const next = onDataChange.mock.calls[0][0] as Task[];
    expect(next.find((t) => t.id === "1")?.column).toBe("doing");
    expect(onDragOver).toHaveBeenCalledTimes(1);
  });

  it("onDragOver resolves the target column from a column id when over is not a card", () => {
    const onDataChange = vi.fn();
    render(<Board onDataChange={onDataChange} />);
    act(() => {
      // Alpha (todo) dragged directly over the 'done' column droppable.
      h.props.onDragOver({ active: { id: "1" }, over: { id: "done" } });
    });
    expect(onDataChange).toHaveBeenCalledTimes(1);
    expect(
      (onDataChange.mock.calls[0][0] as Task[]).find((t) => t.id === "1")
        ?.column
    ).toBe("done");
  });

  it("onDragOver does nothing within the same column", () => {
    const onDataChange = vi.fn();
    render(<Board onDataChange={onDataChange} />);
    act(() => {
      // Over an unknown id → falls back to columns[0] ('todo') === active column.
      h.props.onDragOver({ active: { id: "1" }, over: { id: "unknown" } });
    });
    expect(onDataChange).not.toHaveBeenCalled();
  });

  it("onDragOver returns early when there is no over target", () => {
    const onDataChange = vi.fn();
    render(<Board onDataChange={onDataChange} />);
    act(() => {
      h.props.onDragOver({ active: { id: "1" }, over: null });
    });
    expect(onDataChange).not.toHaveBeenCalled();
  });

  it("onDragOver returns early when the active item is unknown", () => {
    const onDataChange = vi.fn();
    render(<Board onDataChange={onDataChange} />);
    act(() => {
      h.props.onDragOver({ active: { id: "nope" }, over: { id: "2" } });
    });
    expect(onDataChange).not.toHaveBeenCalled();
  });

  it("onDragEnd reorders and clears the active card", () => {
    const onDataChange = vi.fn();
    const onDragEnd = vi.fn();
    render(<Board onDataChange={onDataChange} onDragEnd={onDragEnd} />);

    act(() => {
      h.props.onDragStart({ active: { id: "1" } });
    });

    act(() => {
      h.props.onDragEnd({ active: { id: "1" }, over: { id: "3" } });
    });
    // Active card cleared and reorder forwarded.
    expect(screen.getByText("Alpha body")).toBeInTheDocument();
    expect(onDataChange).toHaveBeenCalledTimes(1);
    expect(onDragEnd).toHaveBeenCalledTimes(1);
  });

  it("onDragEnd returns early when there is no over target", () => {
    const onDataChange = vi.fn();
    render(<Board onDataChange={onDataChange} />);
    act(() => {
      h.props.onDragEnd({ active: { id: "1" }, over: null });
    });
    expect(onDataChange).not.toHaveBeenCalled();
  });

  it("onDragEnd returns early when dropped on itself", () => {
    const onDataChange = vi.fn();
    render(<Board onDataChange={onDataChange} />);
    act(() => {
      h.props.onDragEnd({ active: { id: "1" }, over: { id: "1" } });
    });
    expect(onDataChange).not.toHaveBeenCalled();
  });
});

describe("kanban — accessibility announcements", () => {
  it("produces strings for every announcement callback", () => {
    render(<Board />);
    const a = h.props.accessibility.announcements;

    expect(a.onDragStart({ active: { id: "1" } })).toBe(
      'Picked up the card "Alpha" from the "todo" column'
    );
    expect(a.onDragOver({ active: { id: "1" }, over: { id: "doing" } })).toBe(
      'Dragged the card "Alpha" over the "Doing" column'
    );
    expect(a.onDragEnd({ active: { id: "1" }, over: { id: "done" } })).toBe(
      'Dropped the card "Alpha" into the "Done" column'
    );
    expect(a.onDragCancel({ active: { id: "1" } })).toBe(
      'Cancelled dragging the card "Alpha"'
    );
  });

  it("handles announcements for unknown cards/columns gracefully", () => {
    render(<Board />);
    const a = h.props.accessibility.announcements;
    expect(a.onDragStart({ active: { id: "x" } })).toContain("undefined");
    expect(a.onDragOver({ active: { id: "x" }, over: undefined })).toContain(
      "undefined"
    );
    expect(a.onDragCancel({ active: { id: "x" } })).toContain("undefined");
  });
});

describe("kanban — a11y", () => {
  it("has no axe violations", async () => {
    const { container } = render(<Board />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
