/**
 * Exhaustive tests for the Queue compound component (ai-elements)
 *
 * Component source: components/ai-elements/queue.tsx
 *
 * Exports:
 *   Queue                  – root container div, data-slot="queue"
 *   QueueSection           – collapsible section (Base UI Collapsible), data-slot="queue-section"
 *   QueueSectionTrigger    – section header button, data-slot="queue-section-trigger"
 *   QueueSectionLabel      – label with chevron + icon + count, data-slot="queue-section-label"
 *   QueueSectionContent    – collapsible panel, data-slot="queue-section-content"
 *   QueueList              – scroll area wrapping a <ul>, data-slot="queue-list"
 *   QueueItem              – <li> row, data-slot="queue-item"
 *   QueueItemIndicator     – status dot, completed variant, data-slot="queue-item-indicator"
 *   QueueItemContent       – item title text, completed variant, data-slot="queue-item-content"
 *   QueueItemDescription   – item description, completed variant, data-slot="queue-item-description"
 *   QueueItemActions       – action button row, data-slot="queue-item-actions"
 *   QueueItemAction        – ghost icon button, data-slot="queue-item-action"
 *   QueueItemAttachment    – attachment wrapper, data-slot="queue-item-attachment"
 *   QueueItemImage         – <img> thumbnail, data-slot="queue-item-image"
 *   QueueItemFile          – file chip, data-slot="queue-item-file"
 *
 * Types (re-exported, compile-time only):
 *   QueueMessagePart, QueueMessage, QueueTodo
 */

import { render, screen, within, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  Queue,
  QueueSection,
  QueueSectionTrigger,
  QueueSectionLabel,
  QueueSectionContent,
  QueueList,
  QueueItem,
  QueueItemIndicator,
  QueueItemContent,
  QueueItemDescription,
  QueueItemActions,
  QueueItemAction,
  QueueItemAttachment,
  QueueItemImage,
  QueueItemFile,
} from "@/components/ai-elements/queue";

// ---------------------------------------------------------------------------
// Helper — a fully-composed queue
// ---------------------------------------------------------------------------

function renderFullQueue() {
  return render(
    <Queue>
      <QueueSection>
        <QueueSectionTrigger>
          <QueueSectionLabel count={2} label="tasks" />
        </QueueSectionTrigger>
        <QueueSectionContent>
          <QueueList>
            <QueueItem>
              <QueueItemIndicator />
              <QueueItemContent>First task</QueueItemContent>
              <QueueItemDescription>Do the first thing</QueueItemDescription>
              <QueueItemActions>
                <QueueItemAction aria-label="Edit">e</QueueItemAction>
              </QueueItemActions>
              <QueueItemAttachment>
                <QueueItemFile>doc.txt</QueueItemFile>
              </QueueItemAttachment>
            </QueueItem>
            <QueueItem>
              <QueueItemIndicator completed />
              <QueueItemContent completed>Second task</QueueItemContent>
            </QueueItem>
          </QueueList>
        </QueueSectionContent>
      </QueueSection>
    </Queue>
  );
}

// ---------------------------------------------------------------------------
// 1. Renders without crashing
// ---------------------------------------------------------------------------

describe("Queue — renders without crashing", () => {
  it("renders a bare Queue", () => {
    const { container } = render(<Queue />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("Queue root is a <div>", () => {
    const { container } = render(<Queue />);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("renders a fully-composed queue without throwing", () => {
    expect(() => renderFullQueue()).not.toThrow();
  });

  it("renders children inside Queue", () => {
    render(<Queue>queue body</Queue>);
    expect(screen.getByText("queue body")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 2. data-slot attributes for every part
// ---------------------------------------------------------------------------

describe("Queue — data-slot attributes", () => {
  it("Queue root has data-slot='queue'", () => {
    const { container } = render(<Queue />);
    expect(container.firstChild).toHaveAttribute("data-slot", "queue");
  });

  it("QueueSection has data-slot='queue-section'", () => {
    const { container } = render(<QueueSection />);
    expect(
      container.querySelector("[data-slot='queue-section']")
    ).toBeInTheDocument();
  });

  it("QueueSectionTrigger has data-slot='queue-section-trigger'", () => {
    const { container } = render(
      <QueueSection>
        <QueueSectionTrigger>label</QueueSectionTrigger>
      </QueueSection>
    );
    expect(
      container.querySelector("[data-slot='queue-section-trigger']")
    ).toBeInTheDocument();
  });

  it("QueueSectionLabel has data-slot='queue-section-label'", () => {
    const { container } = render(
      <QueueSectionLabel count={1} label="task" />
    );
    expect(
      container.querySelector("[data-slot='queue-section-label']")
    ).toBeInTheDocument();
  });

  it("QueueSectionContent has data-slot='queue-section-content'", () => {
    const { container } = render(
      <QueueSection defaultOpen>
        <QueueSectionContent>content</QueueSectionContent>
      </QueueSection>
    );
    expect(
      container.querySelector("[data-slot='queue-section-content']")
    ).toBeInTheDocument();
  });

  it("QueueList has data-slot='queue-list'", () => {
    const { container } = render(<QueueList />);
    expect(
      container.querySelector("[data-slot='queue-list']")
    ).toBeInTheDocument();
  });

  it("QueueItem has data-slot='queue-item'", () => {
    const { container } = render(
      <ul>
        <QueueItem />
      </ul>
    );
    expect(
      container.querySelector("[data-slot='queue-item']")
    ).toBeInTheDocument();
  });

  it("QueueItemIndicator has data-slot='queue-item-indicator'", () => {
    const { container } = render(<QueueItemIndicator />);
    expect(
      container.querySelector("[data-slot='queue-item-indicator']")
    ).toBeInTheDocument();
  });

  it("QueueItemContent has data-slot='queue-item-content'", () => {
    const { container } = render(<QueueItemContent>x</QueueItemContent>);
    expect(
      container.querySelector("[data-slot='queue-item-content']")
    ).toBeInTheDocument();
  });

  it("QueueItemDescription has data-slot='queue-item-description'", () => {
    const { container } = render(
      <QueueItemDescription>x</QueueItemDescription>
    );
    expect(
      container.querySelector("[data-slot='queue-item-description']")
    ).toBeInTheDocument();
  });

  it("QueueItemActions has data-slot='queue-item-actions'", () => {
    const { container } = render(<QueueItemActions />);
    expect(
      container.querySelector("[data-slot='queue-item-actions']")
    ).toBeInTheDocument();
  });

  it("QueueItemAction has data-slot='queue-item-action'", () => {
    const { container } = render(
      <QueueItemAction aria-label="act">a</QueueItemAction>
    );
    expect(
      container.querySelector("[data-slot='queue-item-action']")
    ).toBeInTheDocument();
  });

  it("QueueItemAttachment has data-slot='queue-item-attachment'", () => {
    const { container } = render(<QueueItemAttachment />);
    expect(
      container.querySelector("[data-slot='queue-item-attachment']")
    ).toBeInTheDocument();
  });

  it("QueueItemImage has data-slot='queue-item-image'", () => {
    const { container } = render(<QueueItemImage src="x.png" />);
    expect(
      container.querySelector("[data-slot='queue-item-image']")
    ).toBeInTheDocument();
  });

  it("QueueItemFile has data-slot='queue-item-file'", () => {
    const { container } = render(<QueueItemFile>file</QueueItemFile>);
    expect(
      container.querySelector("[data-slot='queue-item-file']")
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 3. Queue root — base classes
// ---------------------------------------------------------------------------

describe("Queue — base classes", () => {
  it("has flex flex-col", () => {
    const { container } = render(<Queue />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("flex");
    expect(cls).toContain("flex-col");
  });

  it("uses token surface + border (no raw color)", () => {
    const { container } = render(<Queue />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("bg-background");
    expect(cls).toContain("edge");
  });

  it("uses radius-scale rounding (rounded-xl)", () => {
    const { container } = render(<Queue />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "rounded-xl"
    );
  });
});

// ---------------------------------------------------------------------------
// 4. QueueItem — element + classes
// ---------------------------------------------------------------------------

describe("QueueItem", () => {
  it("is an <li> element", () => {
    const { container } = render(
      <ul>
        <QueueItem />
      </ul>
    );
    expect(
      container.querySelector("[data-slot='queue-item']")?.tagName
    ).toBe("LI");
  });

  it("has group + hover:bg-muted for action reveal", () => {
    const { container } = render(
      <ul>
        <QueueItem />
      </ul>
    );
    const cls = (
      container.querySelector("[data-slot='queue-item']") as HTMLElement
    ).className;
    expect(cls).toContain("group");
    expect(cls).toContain("hover:bg-muted");
  });

  it("renders children", () => {
    render(
      <ul>
        <QueueItem>row content</QueueItem>
      </ul>
    );
    expect(screen.getByText("row content")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 5. QueueItemIndicator — completed variant
// ---------------------------------------------------------------------------

describe("QueueItemIndicator — completed variant", () => {
  it("defaults to not completed (no data-completed)", () => {
    const { container } = render(<QueueItemIndicator />);
    const el = container.querySelector(
      "[data-slot='queue-item-indicator']"
    ) as HTMLElement;
    expect(el).not.toHaveAttribute("data-completed");
    expect(el.className).toContain("border-muted-foreground/50");
  });

  it("completed=false keeps the pending border", () => {
    const { container } = render(<QueueItemIndicator completed={false} />);
    const el = container.querySelector(
      "[data-slot='queue-item-indicator']"
    ) as HTMLElement;
    expect(el.className).toContain("border-muted-foreground/50");
    expect(el.className).not.toContain("bg-muted-foreground/10");
  });

  it("completed=true sets data-completed and filled token classes", () => {
    const { container } = render(<QueueItemIndicator completed />);
    const el = container.querySelector(
      "[data-slot='queue-item-indicator']"
    ) as HTMLElement;
    expect(el).toHaveAttribute("data-completed", "");
    expect(el.className).toContain("bg-muted-foreground/10");
    expect(el.className).toContain("border-muted-foreground/20");
  });

  it("is a <span> with rounded-full dot sizing", () => {
    const { container } = render(<QueueItemIndicator />);
    const el = container.querySelector(
      "[data-slot='queue-item-indicator']"
    ) as HTMLElement;
    expect(el.tagName).toBe("SPAN");
    expect(el.className).toContain("rounded-full");
    expect(el.className).toContain("size-2.5");
  });
});

// ---------------------------------------------------------------------------
// 6. QueueItemContent — completed variant
// ---------------------------------------------------------------------------

describe("QueueItemContent — completed variant", () => {
  it("defaults to not completed (muted, no line-through)", () => {
    const { container } = render(<QueueItemContent>t</QueueItemContent>);
    const el = container.querySelector(
      "[data-slot='queue-item-content']"
    ) as HTMLElement;
    expect(el).not.toHaveAttribute("data-completed");
    expect(el.className).toContain("text-muted-foreground");
    expect(el.className).not.toContain("line-through");
  });

  it("completed=false renders pending styles", () => {
    const { container } = render(
      <QueueItemContent completed={false}>t</QueueItemContent>
    );
    const el = container.querySelector(
      "[data-slot='queue-item-content']"
    ) as HTMLElement;
    expect(el.className).toContain("text-muted-foreground");
    expect(el.className).not.toContain("line-through");
  });

  it("completed=true adds line-through + dimmed token", () => {
    const { container } = render(
      <QueueItemContent completed>t</QueueItemContent>
    );
    const el = container.querySelector(
      "[data-slot='queue-item-content']"
    ) as HTMLElement;
    expect(el).toHaveAttribute("data-completed", "");
    expect(el.className).toContain("line-through");
    expect(el.className).toContain("text-muted-foreground/50");
  });

  it("renders its text content", () => {
    render(<QueueItemContent>Audit the flow</QueueItemContent>);
    expect(screen.getByText("Audit the flow")).toBeInTheDocument();
  });

  it("is a <span> with line-clamp", () => {
    const { container } = render(<QueueItemContent>t</QueueItemContent>);
    const el = container.querySelector(
      "[data-slot='queue-item-content']"
    ) as HTMLElement;
    expect(el.tagName).toBe("SPAN");
    expect(el.className).toContain("line-clamp-1");
  });
});

// ---------------------------------------------------------------------------
// 7. QueueItemDescription — completed variant
// ---------------------------------------------------------------------------

describe("QueueItemDescription — completed variant", () => {
  it("defaults to not completed", () => {
    const { container } = render(
      <QueueItemDescription>d</QueueItemDescription>
    );
    const el = container.querySelector(
      "[data-slot='queue-item-description']"
    ) as HTMLElement;
    expect(el).not.toHaveAttribute("data-completed");
    expect(el.className).toContain("text-muted-foreground");
    expect(el.className).not.toContain("line-through");
  });

  it("completed=false renders pending styles", () => {
    const { container } = render(
      <QueueItemDescription completed={false}>d</QueueItemDescription>
    );
    const el = container.querySelector(
      "[data-slot='queue-item-description']"
    ) as HTMLElement;
    expect(el.className).toContain("text-muted-foreground");
    expect(el.className).not.toContain("line-through");
  });

  it("completed=true adds line-through + dimmed token", () => {
    const { container } = render(
      <QueueItemDescription completed>d</QueueItemDescription>
    );
    const el = container.querySelector(
      "[data-slot='queue-item-description']"
    ) as HTMLElement;
    expect(el).toHaveAttribute("data-completed", "");
    expect(el.className).toContain("line-through");
    expect(el.className).toContain("text-muted-foreground/40");
  });

  it("is a <div> with text-xs + indent", () => {
    const { container } = render(
      <QueueItemDescription>d</QueueItemDescription>
    );
    const el = container.querySelector(
      "[data-slot='queue-item-description']"
    ) as HTMLElement;
    expect(el.tagName).toBe("DIV");
    expect(el.className).toContain("text-xs");
    expect(el.className).toContain("ml-6");
  });

  it("renders its text content", () => {
    render(<QueueItemDescription>100 req / min</QueueItemDescription>);
    expect(screen.getByText("100 req / min")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 8. QueueItemActions + QueueItemAction
// ---------------------------------------------------------------------------

describe("QueueItemActions", () => {
  it("is a flex row", () => {
    const { container } = render(<QueueItemActions />);
    const el = container.querySelector(
      "[data-slot='queue-item-actions']"
    ) as HTMLElement;
    expect(el.className).toContain("flex");
    expect(el.className).toContain("gap-1");
  });

  it("renders children", () => {
    render(
      <QueueItemActions>
        <span>a1</span>
      </QueueItemActions>
    );
    expect(screen.getByText("a1")).toBeInTheDocument();
  });
});

describe("QueueItemAction", () => {
  it("renders a button (ghost)", () => {
    render(<QueueItemAction aria-label="Edit task">e</QueueItemAction>);
    expect(
      screen.getByRole("button", { name: "Edit task" })
    ).toBeInTheDocument();
  });

  it("reveals on group-hover (opacity classes)", () => {
    const { container } = render(
      <QueueItemAction aria-label="x">x</QueueItemAction>
    );
    const el = container.querySelector(
      "[data-slot='queue-item-action']"
    ) as HTMLElement;
    expect(el.className).toContain("opacity-0");
    expect(el.className).toContain("group-hover:opacity-100");
  });

  it("fires onClick", () => {
    const onClick = vi.fn();
    render(
      <QueueItemAction aria-label="Remove" onClick={onClick}>
        r
      </QueueItemAction>
    );
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("forwards disabled", () => {
    render(
      <QueueItemAction aria-label="Disabled" disabled>
        d
      </QueueItemAction>
    );
    expect(screen.getByRole("button", { name: "Disabled" })).toBeDisabled();
  });

  it("does not fire onClick when disabled", () => {
    const onClick = vi.fn();
    render(
      <QueueItemAction aria-label="Disabled" disabled onClick={onClick}>
        d
      </QueueItemAction>
    );
    fireEvent.click(screen.getByRole("button", { name: "Disabled" }));
    expect(onClick).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 9. QueueItemAttachment / Image / File
// ---------------------------------------------------------------------------

describe("QueueItemAttachment", () => {
  it("is a flex-wrap row", () => {
    const { container } = render(<QueueItemAttachment />);
    const el = container.querySelector(
      "[data-slot='queue-item-attachment']"
    ) as HTMLElement;
    expect(el.className).toContain("flex-wrap");
  });

  it("renders children", () => {
    render(
      <QueueItemAttachment>
        <span>att</span>
      </QueueItemAttachment>
    );
    expect(screen.getByText("att")).toBeInTheDocument();
  });
});

describe("QueueItemImage", () => {
  it("is an <img> element", () => {
    const { container } = render(<QueueItemImage src="a.png" />);
    expect(
      container.querySelector("[data-slot='queue-item-image']")?.tagName
    ).toBe("IMG");
  });

  it("defaults alt to empty string", () => {
    const { container } = render(<QueueItemImage src="a.png" />);
    const img = container.querySelector(
      "[data-slot='queue-item-image']"
    ) as HTMLImageElement;
    expect(img).toHaveAttribute("alt", "");
  });

  it("accepts a custom alt", () => {
    render(<QueueItemImage src="a.png" alt="A diagram" />);
    expect(screen.getByAltText("A diagram")).toBeInTheDocument();
  });

  it("forwards src and has cover/rounded classes", () => {
    const { container } = render(<QueueItemImage src="https://x/a.png" />);
    const img = container.querySelector(
      "[data-slot='queue-item-image']"
    ) as HTMLImageElement;
    expect(img).toHaveAttribute("src", "https://x/a.png");
    expect(img.className).toContain("object-cover");
    expect(img.className).toContain("rounded-sm");
  });
});

describe("QueueItemFile", () => {
  it("renders the filename text", () => {
    render(<QueueItemFile>gateway.config.ts</QueueItemFile>);
    expect(screen.getByText("gateway.config.ts")).toBeInTheDocument();
  });

  it("renders a paperclip icon part", () => {
    const { container } = render(<QueueItemFile>a.txt</QueueItemFile>);
    expect(
      container.querySelector("[data-slot='queue-item-file-icon']")
    ).toBeInTheDocument();
  });

  it("uses token surface (bg-muted) and truncation", () => {
    const { container } = render(<QueueItemFile>a.txt</QueueItemFile>);
    const el = container.querySelector(
      "[data-slot='queue-item-file']"
    ) as HTMLElement;
    expect(el.className).toContain("bg-muted");
    expect(within(el).getByText("a.txt").className).toContain("truncate");
  });
});

// ---------------------------------------------------------------------------
// 10. QueueList — scroll area + ul
// ---------------------------------------------------------------------------

describe("QueueList", () => {
  it("wraps children in a <ul>", () => {
    const { container } = render(
      <QueueList>
        <QueueItem>row</QueueItem>
      </QueueList>
    );
    const ul = container.querySelector("ul");
    expect(ul).toBeInTheDocument();
    expect(ul?.querySelector("[data-slot='queue-item']")).toBeInTheDocument();
  });

  it("renders item text", () => {
    render(
      <QueueList>
        <QueueItem>visible row</QueueItem>
      </QueueList>
    );
    expect(screen.getByText("visible row")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 11. QueueSection — collapsible behavior
// ---------------------------------------------------------------------------

describe("QueueSection — collapsible", () => {
  it("defaults open (content visible)", () => {
    render(
      <QueueSection>
        <QueueSectionTrigger>
          <QueueSectionLabel count={1} label="task" />
        </QueueSectionTrigger>
        <QueueSectionContent>panel body</QueueSectionContent>
      </QueueSection>
    );
    expect(screen.getByText("panel body")).toBeInTheDocument();
  });

  it("trigger is an accessible button", () => {
    render(
      <QueueSection>
        <QueueSectionTrigger>
          <QueueSectionLabel count={2} label="tasks" />
        </QueueSectionTrigger>
        <QueueSectionContent>body</QueueSectionContent>
      </QueueSection>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("toggles aria-expanded when clicked", () => {
    render(
      <QueueSection>
        <QueueSectionTrigger>
          <QueueSectionLabel count={2} label="tasks" />
        </QueueSectionTrigger>
        <QueueSectionContent>body</QueueSectionContent>
      </QueueSection>
    );
    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("respects defaultOpen={false} (collapsed)", () => {
    render(
      <QueueSection defaultOpen={false}>
        <QueueSectionTrigger>
          <QueueSectionLabel count={0} label="tasks" />
        </QueueSectionTrigger>
        <QueueSectionContent>body</QueueSectionContent>
      </QueueSection>
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });
});

// ---------------------------------------------------------------------------
// 12. QueueSectionTrigger — classes
// ---------------------------------------------------------------------------

describe("QueueSectionTrigger", () => {
  it("uses editorial weight (font-medium, never bold)", () => {
    const { container } = render(
      <QueueSection>
        <QueueSectionTrigger>label</QueueSectionTrigger>
      </QueueSection>
    );
    const el = container.querySelector(
      "[data-slot='queue-section-trigger']"
    ) as HTMLElement;
    expect(el.className).toContain("font-medium");
    expect(el.className).not.toContain("font-bold");
    expect(el.className).not.toContain("font-semibold");
  });

  it("has focus-visible ring token", () => {
    const { container } = render(
      <QueueSection>
        <QueueSectionTrigger>label</QueueSectionTrigger>
      </QueueSection>
    );
    const el = container.querySelector(
      "[data-slot='queue-section-trigger']"
    ) as HTMLElement;
    expect(el.className).toContain("focus-visible:ring-ring");
  });

  it("renders the trigger children", () => {
    render(
      <QueueSection>
        <QueueSectionTrigger>Click me</QueueSectionTrigger>
      </QueueSection>
    );
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 13. QueueSectionLabel — count, label, icon, chevron
// ---------------------------------------------------------------------------

describe("QueueSectionLabel", () => {
  it("renders count and label together", () => {
    render(<QueueSectionLabel count={3} label="queued tasks" />);
    expect(screen.getByText(/queued tasks/)).toBeInTheDocument();
    expect(screen.getByText(/3/)).toBeInTheDocument();
  });

  it("renders count as font-mono data", () => {
    const { container } = render(
      <QueueSectionLabel count={5} label="items" />
    );
    const mono = container.querySelector(".font-mono") as HTMLElement;
    expect(mono).toBeInTheDocument();
    expect(mono.textContent).toContain("5");
    expect(mono.textContent).toContain("items");
  });

  it("renders a chevron icon part", () => {
    const { container } = render(
      <QueueSectionLabel count={1} label="task" />
    );
    expect(
      container.querySelector("[data-slot='queue-section-label-chevron']")
    ).toBeInTheDocument();
  });

  it("renders an optional leading icon", () => {
    render(
      <QueueSectionLabel
        count={1}
        label="task"
        icon={<span data-testid="lead-icon">i</span>}
      />
    );
    expect(screen.getByTestId("lead-icon")).toBeInTheDocument();
  });

  it("omits leading icon when not provided", () => {
    render(<QueueSectionLabel count={1} label="task" />);
    expect(screen.queryByTestId("lead-icon")).not.toBeInTheDocument();
  });

  it("renders without a count (undefined)", () => {
    render(<QueueSectionLabel label="pending" />);
    expect(screen.getByText(/pending/)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 14. QueueSectionContent
// ---------------------------------------------------------------------------

describe("QueueSectionContent", () => {
  it("renders children when section is open", () => {
    render(
      <QueueSection defaultOpen>
        <QueueSectionTrigger>t</QueueSectionTrigger>
        <QueueSectionContent>inner content</QueueSectionContent>
      </QueueSection>
    );
    expect(screen.getByText("inner content")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 15. className + HTML attribute forwarding — every part
// ---------------------------------------------------------------------------

describe("Queue parts — className forwarding", () => {
  it("Queue forwards className and merges base", () => {
    const { container } = render(<Queue className="my-queue" />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("my-queue");
    expect(cls).toContain("bg-background");
  });

  it("QueueSectionTrigger forwards className", () => {
    const { container } = render(
      <QueueSection>
        <QueueSectionTrigger className="ct">x</QueueSectionTrigger>
      </QueueSection>
    );
    expect(
      (
        container.querySelector(
          "[data-slot='queue-section-trigger']"
        ) as HTMLElement
      ).className
    ).toContain("ct");
  });

  it("QueueSectionLabel forwards className", () => {
    const { container } = render(
      <QueueSectionLabel className="cl" count={1} label="x" />
    );
    expect(
      (
        container.querySelector(
          "[data-slot='queue-section-label']"
        ) as HTMLElement
      ).className
    ).toContain("cl");
  });

  it("QueueItem forwards className", () => {
    const { container } = render(
      <ul>
        <QueueItem className="ci" />
      </ul>
    );
    expect(
      (container.querySelector("[data-slot='queue-item']") as HTMLElement)
        .className
    ).toContain("ci");
  });

  it("QueueItemIndicator forwards className", () => {
    const { container } = render(<QueueItemIndicator className="cind" />);
    expect(
      (
        container.querySelector(
          "[data-slot='queue-item-indicator']"
        ) as HTMLElement
      ).className
    ).toContain("cind");
  });

  it("QueueItemContent forwards className", () => {
    const { container } = render(
      <QueueItemContent className="cc">x</QueueItemContent>
    );
    expect(
      (
        container.querySelector(
          "[data-slot='queue-item-content']"
        ) as HTMLElement
      ).className
    ).toContain("cc");
  });

  it("QueueItemDescription forwards className", () => {
    const { container } = render(
      <QueueItemDescription className="cd">x</QueueItemDescription>
    );
    expect(
      (
        container.querySelector(
          "[data-slot='queue-item-description']"
        ) as HTMLElement
      ).className
    ).toContain("cd");
  });

  it("QueueItemActions forwards className", () => {
    const { container } = render(<QueueItemActions className="cas" />);
    expect(
      (
        container.querySelector(
          "[data-slot='queue-item-actions']"
        ) as HTMLElement
      ).className
    ).toContain("cas");
  });

  it("QueueItemAction forwards className", () => {
    const { container } = render(
      <QueueItemAction aria-label="a" className="caction">
        a
      </QueueItemAction>
    );
    expect(
      (
        container.querySelector(
          "[data-slot='queue-item-action']"
        ) as HTMLElement
      ).className
    ).toContain("caction");
  });

  it("QueueItemAttachment forwards className", () => {
    const { container } = render(<QueueItemAttachment className="catt" />);
    expect(
      (
        container.querySelector(
          "[data-slot='queue-item-attachment']"
        ) as HTMLElement
      ).className
    ).toContain("catt");
  });

  it("QueueItemImage forwards className", () => {
    const { container } = render(
      <QueueItemImage src="a.png" className="cimg" />
    );
    expect(
      (
        container.querySelector(
          "[data-slot='queue-item-image']"
        ) as HTMLElement
      ).className
    ).toContain("cimg");
  });

  it("QueueItemFile forwards className", () => {
    const { container } = render(
      <QueueItemFile className="cfile">x</QueueItemFile>
    );
    expect(
      (
        container.querySelector("[data-slot='queue-item-file']") as HTMLElement
      ).className
    ).toContain("cfile");
  });

  it("QueueList forwards className", () => {
    const { container } = render(<QueueList className="clist" />);
    expect(
      (container.querySelector("[data-slot='queue-list']") as HTMLElement)
        .className
    ).toContain("clist");
  });
});

describe("Queue parts — HTML attribute forwarding", () => {
  it("Queue forwards id + data-testid", () => {
    const { container } = render(<Queue id="q1" data-testid="q" />);
    expect(container.firstChild).toHaveAttribute("id", "q1");
    expect(container.firstChild).toHaveAttribute("data-testid", "q");
  });

  it("QueueItem forwards id", () => {
    const { container } = render(
      <ul>
        <QueueItem id="item-1" />
      </ul>
    );
    expect(
      container.querySelector("[data-slot='queue-item']")
    ).toHaveAttribute("id", "item-1");
  });

  it("QueueItemAction forwards type attribute (button)", () => {
    render(<QueueItemAction aria-label="submit">s</QueueItemAction>);
    expect(screen.getByRole("button", { name: "submit" })).toHaveAttribute(
      "type",
      "button"
    );
  });
});

// ---------------------------------------------------------------------------
// 16. Composition — realistic queue (mirrors example)
// ---------------------------------------------------------------------------

describe("Queue — composition", () => {
  it("renders a full queue with all parts present", () => {
    const { container } = renderFullQueue();
    expect(container.querySelector("[data-slot='queue']")).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='queue-section']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='queue-section-trigger']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='queue-section-content']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='queue-list']")
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll("[data-slot='queue-item']")
    ).toHaveLength(2);
  });

  it("shows both pending and completed items", () => {
    renderFullQueue();
    expect(screen.getByText("First task")).toBeInTheDocument();
    expect(screen.getByText("Second task")).toBeInTheDocument();
  });

  it("renders an attachment file chip", () => {
    renderFullQueue();
    expect(screen.getByText("doc.txt")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 17. Accessibility — axe
// ---------------------------------------------------------------------------

describe("Queue — accessibility (axe)", () => {
  it("bare Queue has no violations", async () => {
    const { container } = render(
      <main>
        <Queue />
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("fully-composed queue has no violations", async () => {
    const { container } = render(
      <main>
        <Queue>
          <QueueSection>
            <QueueSectionTrigger>
              <QueueSectionLabel count={2} label="queued tasks" />
            </QueueSectionTrigger>
            <QueueSectionContent>
              <QueueList>
                <QueueItem>
                  <div className="flex items-start gap-2">
                    <QueueItemIndicator />
                    <QueueItemContent>Add rate limiting</QueueItemContent>
                    <QueueItemActions>
                      <QueueItemAction aria-label="Edit task">e</QueueItemAction>
                    </QueueItemActions>
                  </div>
                  <QueueItemDescription>100 req / min</QueueItemDescription>
                  <QueueItemAttachment>
                    <QueueItemImage src="a.png" alt="Diagram" />
                    <QueueItemFile>gateway.config.ts</QueueItemFile>
                  </QueueItemAttachment>
                </QueueItem>
                <QueueItem>
                  <div className="flex items-start gap-2">
                    <QueueItemIndicator completed />
                    <QueueItemContent completed>Audit auth</QueueItemContent>
                  </div>
                </QueueItem>
              </QueueList>
            </QueueSectionContent>
          </QueueSection>
        </Queue>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("collapsed section has no violations", async () => {
    const { container } = render(
      <main>
        <Queue>
          <QueueSection defaultOpen={false}>
            <QueueSectionTrigger>
              <QueueSectionLabel count={0} label="tasks" />
            </QueueSectionTrigger>
            <QueueSectionContent>
              <QueueList>
                <QueueItem>
                  <QueueItemContent>hidden</QueueItemContent>
                </QueueItem>
              </QueueList>
            </QueueSectionContent>
          </QueueSection>
        </Queue>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
