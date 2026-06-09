/**
 * Exhaustive tests for the ai-task compound component (AI Elements "task",
 * ported to byronwade/ui).
 *
 * Component source: components/ai-elements/task.tsx
 *
 * Exports:
 *   Task          – Collapsible root, data-slot="task", defaultOpen=true
 *   TaskTrigger   – Collapsible trigger button, data-slot="task-trigger",
 *                   required `title` prop, optional children override
 *   TaskContent   – Collapsible panel, data-slot="task-content"
 *   TaskItem      – muted text row, data-slot="task-item"
 *   TaskItemFile  – inline file chip, data-slot="task-item-file",
 *                   variant ("default"|"muted"|"brand")
 */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import {
  Task,
  TaskTrigger,
  TaskContent,
  TaskItem,
  TaskItemFile,
} from "@/components/ai-elements/task";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderFullTask(opts?: { defaultOpen?: boolean }) {
  return render(
    <Task defaultOpen={opts?.defaultOpen}>
      <TaskTrigger title="Searching codebase" />
      <TaskContent>
        <TaskItem>
          Scanned <TaskItemFile>button.tsx</TaskItemFile>
        </TaskItem>
        <TaskItem>
          Read <TaskItemFile variant="brand">utils.ts</TaskItemFile>
        </TaskItem>
      </TaskContent>
    </Task>
  );
}

// ---------------------------------------------------------------------------
// 1. Renders without crashing
// ---------------------------------------------------------------------------

describe("Task — renders without crashing", () => {
  it("renders a bare Task without crashing", () => {
    const { container } = render(<Task />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders a fully-composed task without crashing", () => {
    expect(() => renderFullTask()).not.toThrow();
  });

  it("renders the trigger title text", () => {
    renderFullTask();
    expect(screen.getByText("Searching codebase")).toBeInTheDocument();
  });

  it("renders children of Task", () => {
    render(<Task>hello</Task>);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 2. data-slot attributes
// ---------------------------------------------------------------------------

describe("Task — data-slot attributes", () => {
  it("Task root has data-slot='task'", () => {
    const { container } = render(<Task />);
    expect(container.firstChild).toHaveAttribute("data-slot", "task");
  });

  it("TaskTrigger has data-slot='task-trigger'", () => {
    const { container } = render(
      <Task>
        <TaskTrigger title="t" />
      </Task>
    );
    expect(
      container.querySelector("[data-slot='task-trigger']")
    ).toBeInTheDocument();
  });

  it("TaskTrigger default chevron + search icons have data-slots", () => {
    const { container } = render(
      <Task>
        <TaskTrigger title="t" />
      </Task>
    );
    expect(
      container.querySelector("[data-slot='task-trigger-icon']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='task-trigger-chevron']")
    ).toBeInTheDocument();
  });

  it("TaskContent has data-slot='task-content'", () => {
    const { container } = render(
      <Task defaultOpen>
        <TaskContent>body</TaskContent>
      </Task>
    );
    expect(
      container.querySelector("[data-slot='task-content']")
    ).toBeInTheDocument();
  });

  it("TaskItem has data-slot='task-item'", () => {
    const { container } = render(<TaskItem>x</TaskItem>);
    expect(container.firstChild).toHaveAttribute("data-slot", "task-item");
  });

  it("TaskItemFile has data-slot='task-item-file'", () => {
    const { container } = render(<TaskItemFile>x</TaskItemFile>);
    expect(container.firstChild).toHaveAttribute("data-slot", "task-item-file");
  });
});

// ---------------------------------------------------------------------------
// 3. TaskTrigger — structure & title
// ---------------------------------------------------------------------------

describe("TaskTrigger — structure", () => {
  it("renders as a <button> element (Base UI trigger)", () => {
    const { container } = render(
      <Task>
        <TaskTrigger title="t" />
      </Task>
    );
    const trigger = container.querySelector("[data-slot='task-trigger']");
    expect(trigger?.tagName).toBe("BUTTON");
  });

  it("renders the title prop text by default", () => {
    render(
      <Task>
        <TaskTrigger title="Analyzing types" />
      </Task>
    );
    expect(screen.getByText("Analyzing types")).toBeInTheDocument();
  });

  it("has group class for chevron rotation", () => {
    const { container } = render(
      <Task>
        <TaskTrigger title="t" />
      </Task>
    );
    const trigger = container.querySelector(
      "[data-slot='task-trigger']"
    ) as HTMLElement;
    expect(trigger.className).toContain("group");
  });

  it("chevron carries the panel-open rotation class", () => {
    const { container } = render(
      <Task>
        <TaskTrigger title="t" />
      </Task>
    );
    const chevron = container.querySelector(
      "[data-slot='task-trigger-chevron']"
    ) as SVGElement;
    expect(chevron.getAttribute("class")).toContain(
      "group-data-[panel-open]:rotate-180"
    );
  });

  it("renders custom children instead of the default markup", () => {
    const { container } = render(
      <Task>
        <TaskTrigger title="ignored">
          <span>Custom label</span>
        </TaskTrigger>
      </Task>
    );
    expect(screen.getByText("Custom label")).toBeInTheDocument();
    // default search icon should NOT be rendered when children provided
    expect(
      container.querySelector("[data-slot='task-trigger-icon']")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("ignored")).not.toBeInTheDocument();
  });

  it("has focus-visible ring token classes (accessibility)", () => {
    const { container } = render(
      <Task>
        <TaskTrigger title="t" />
      </Task>
    );
    const trigger = container.querySelector(
      "[data-slot='task-trigger']"
    ) as HTMLElement;
    expect(trigger.className).toContain("focus-visible:ring-ring");
  });
});

// ---------------------------------------------------------------------------
// 4. Open / close behavior
// ---------------------------------------------------------------------------

describe("Task — open/close behavior", () => {
  it("defaultOpen=true shows the content (panel rendered, not hidden)", () => {
    renderFullTask({ defaultOpen: true });
    expect(screen.getByText("Scanned")).toBeVisible();
  });

  it("Task root reflects open state via data-open when defaultOpen", () => {
    const { container } = render(
      <Task defaultOpen>
        <TaskTrigger title="t" />
        <TaskContent>body</TaskContent>
      </Task>
    );
    expect(container.querySelector("[data-slot='task']")).toHaveAttribute(
      "data-open"
    );
  });

  it("defaults to open when defaultOpen is omitted (wrapper default true)", () => {
    const { container } = render(
      <Task>
        <TaskTrigger title="t" />
        <TaskContent>body</TaskContent>
      </Task>
    );
    expect(container.querySelector("[data-slot='task']")).toHaveAttribute(
      "data-open"
    );
  });

  it("defaultOpen={false} starts collapsed (trigger not expanded)", () => {
    const { container } = render(
      <Task defaultOpen={false}>
        <TaskTrigger title="t" />
        <TaskContent>body</TaskContent>
      </Task>
    );
    const root = container.querySelector("[data-slot='task']");
    expect(root).not.toHaveAttribute("data-open");
  });

  it("clicking the trigger toggles the panel open state", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Task defaultOpen={false}>
        <TaskTrigger title="Toggle me" />
        <TaskContent>panel body</TaskContent>
      </Task>
    );
    const trigger = screen.getByRole("button", { name: /Toggle me/ });
    const root = container.querySelector("[data-slot='task']") as HTMLElement;
    expect(root).not.toHaveAttribute("data-open");
    await user.click(trigger);
    expect(root).toHaveAttribute("data-open");
    await user.click(trigger);
    expect(root).not.toHaveAttribute("data-open");
  });

  it("fires onOpenChange when toggled", async () => {
    const user = userEvent.setup();
    let lastValue: boolean | undefined;
    render(
      <Task
        defaultOpen={false}
        onOpenChange={(open) => {
          lastValue = open;
        }}
      >
        <TaskTrigger title="cb" />
        <TaskContent>body</TaskContent>
      </Task>
    );
    await user.click(screen.getByRole("button", { name: /cb/ }));
    expect(lastValue).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 5. TaskItem
// ---------------------------------------------------------------------------

describe("TaskItem — classes & content", () => {
  it("has text-muted-foreground class", () => {
    const { container } = render(<TaskItem>x</TaskItem>);
    expect((container.firstChild as HTMLElement).className).toContain(
      "text-muted-foreground"
    );
  });

  it("has text-sm class", () => {
    const { container } = render(<TaskItem>x</TaskItem>);
    expect((container.firstChild as HTMLElement).className).toContain(
      "text-sm"
    );
  });

  it("renders children", () => {
    render(<TaskItem>Read the file</TaskItem>);
    expect(screen.getByText("Read the file")).toBeInTheDocument();
  });

  it("is a <div> element", () => {
    const { container } = render(<TaskItem>x</TaskItem>);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });
});

// ---------------------------------------------------------------------------
// 6. TaskItemFile — variants
// ---------------------------------------------------------------------------

describe("TaskItemFile — variants", () => {
  it("default variant uses bg-secondary", () => {
    const { container } = render(<TaskItemFile>f</TaskItemFile>);
    expect((container.firstChild as HTMLElement).className).toContain(
      "bg-secondary"
    );
  });

  it("explicit default variant uses bg-secondary", () => {
    const { container } = render(
      <TaskItemFile variant="default">f</TaskItemFile>
    );
    expect((container.firstChild as HTMLElement).className).toContain(
      "bg-secondary"
    );
  });

  it("muted variant uses bg-muted", () => {
    const { container } = render(<TaskItemFile variant="muted">f</TaskItemFile>);
    expect((container.firstChild as HTMLElement).className).toContain(
      "bg-muted"
    );
  });

  it("brand variant uses bg-brand/10 (accent follows --brand)", () => {
    const { container } = render(<TaskItemFile variant="brand">f</TaskItemFile>);
    expect((container.firstChild as HTMLElement).className).toContain(
      "bg-brand/10"
    );
  });

  it("has edge and rounded-md base classes", () => {
    const { container } = render(<TaskItemFile>f</TaskItemFile>);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("edge");
    expect(cls).toContain("rounded-md");
  });

  it("has text-xs class", () => {
    const { container } = render(<TaskItemFile>f</TaskItemFile>);
    expect((container.firstChild as HTMLElement).className).toContain(
      "text-xs"
    );
  });

  it("renders children", () => {
    render(<TaskItemFile>config.ts</TaskItemFile>);
    expect(screen.getByText("config.ts")).toBeInTheDocument();
  });

  it("is a <div> element", () => {
    const { container } = render(<TaskItemFile>f</TaskItemFile>);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });
});

// ---------------------------------------------------------------------------
// 7. TaskContent
// ---------------------------------------------------------------------------

describe("TaskContent — classes & content", () => {
  it("renders children when open", () => {
    render(
      <Task defaultOpen>
        <TaskContent>
          <span>inner content</span>
        </TaskContent>
      </Task>
    );
    expect(screen.getByText("inner content")).toBeInTheDocument();
  });

  it("inner wrapper has the left rule (border-l-2 border-muted)", () => {
    const { container } = render(
      <Task defaultOpen>
        <TaskContent>x</TaskContent>
      </Task>
    );
    const content = container.querySelector(
      "[data-slot='task-content']"
    ) as HTMLElement;
    const inner = content.querySelector("div") as HTMLElement;
    expect(inner.className).toContain("border-l-2");
    expect(inner.className).toContain("border-muted");
  });

  it("has text-popover-foreground class on panel", () => {
    const { container } = render(
      <Task defaultOpen>
        <TaskContent>x</TaskContent>
      </Task>
    );
    const content = container.querySelector(
      "[data-slot='task-content']"
    ) as HTMLElement;
    expect(content.className).toContain("text-popover-foreground");
  });
});

// ---------------------------------------------------------------------------
// 8. className forwarding
// ---------------------------------------------------------------------------

describe("ai-task — className forwarding", () => {
  it("Task forwards custom className", () => {
    const { container } = render(<Task className="my-task" />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "my-task"
    );
  });

  it("TaskTrigger forwards custom className and keeps base classes", () => {
    const { container } = render(
      <Task>
        <TaskTrigger className="custom-trigger" title="t" />
      </Task>
    );
    const trigger = container.querySelector(
      "[data-slot='task-trigger']"
    ) as HTMLElement;
    expect(trigger.className).toContain("custom-trigger");
    expect(trigger.className).toContain("group");
  });

  it("TaskContent forwards custom className", () => {
    const { container } = render(
      <Task defaultOpen>
        <TaskContent className="custom-content">x</TaskContent>
      </Task>
    );
    const content = container.querySelector(
      "[data-slot='task-content']"
    ) as HTMLElement;
    expect(content.className).toContain("custom-content");
  });

  it("TaskItem forwards custom className", () => {
    const { container } = render(<TaskItem className="custom-item">x</TaskItem>);
    expect((container.firstChild as HTMLElement).className).toContain(
      "custom-item"
    );
  });

  it("TaskItemFile forwards custom className and merges with variant", () => {
    const { container } = render(
      <TaskItemFile className="custom-file" variant="brand">
        f
      </TaskItemFile>
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("custom-file");
    expect(el.className).toContain("bg-brand/10");
  });
});

// ---------------------------------------------------------------------------
// 9. HTML attribute forwarding
// ---------------------------------------------------------------------------

describe("ai-task — HTML attribute forwarding", () => {
  it("Task forwards id", () => {
    const { container } = render(<Task id="task-1" />);
    expect(container.firstChild).toHaveAttribute("id", "task-1");
  });

  it("TaskItem forwards data-testid", () => {
    render(<TaskItem data-testid="item-x">x</TaskItem>);
    expect(screen.getByTestId("item-x")).toBeInTheDocument();
  });

  it("TaskItemFile forwards id", () => {
    const { container } = render(<TaskItemFile id="file-1">f</TaskItemFile>);
    expect(container.firstChild).toHaveAttribute("id", "file-1");
  });

  it("TaskTrigger forwards aria-label", () => {
    render(
      <Task>
        <TaskTrigger aria-label="Expand search" title="t" />
      </Task>
    );
    expect(
      screen.getByRole("button", { name: "Expand search" })
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 10. Composition & DOM structure
// ---------------------------------------------------------------------------

describe("ai-task — composition", () => {
  it("all parts compose under the Task root", () => {
    const { container } = renderFullTask({ defaultOpen: true });
    const root = container.querySelector("[data-slot='task']") as HTMLElement;
    expect(
      root.querySelector("[data-slot='task-trigger']")
    ).toBeInTheDocument();
    expect(
      root.querySelector("[data-slot='task-content']")
    ).toBeInTheDocument();
    expect(within(root).getByText("Searching codebase")).toBeInTheDocument();
  });

  it("renders multiple TaskItemFile chips with mixed variants", () => {
    renderFullTask({ defaultOpen: true });
    expect(screen.getByText("button.tsx")).toBeInTheDocument();
    expect(screen.getByText("utils.ts")).toBeInTheDocument();
  });

  it("multiple independent tasks render without conflict", () => {
    render(
      <>
        <Task defaultOpen={false}>
          <TaskTrigger title="Task A" />
          <TaskContent>A body</TaskContent>
        </Task>
        <Task defaultOpen={false}>
          <TaskTrigger title="Task B" />
          <TaskContent>B body</TaskContent>
        </Task>
      </>
    );
    expect(screen.getByText("Task A")).toBeInTheDocument();
    expect(screen.getByText("Task B")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 11. Re-render behavior
// ---------------------------------------------------------------------------

describe("ai-task — re-render", () => {
  it("updates TaskItemFile variant on re-render", () => {
    const { container, rerender } = render(
      <TaskItemFile variant="default">f</TaskItemFile>
    );
    expect((container.firstChild as HTMLElement).className).toContain(
      "bg-secondary"
    );
    rerender(<TaskItemFile variant="muted">f</TaskItemFile>);
    expect((container.firstChild as HTMLElement).className).toContain(
      "bg-muted"
    );
  });

  it("updates trigger title on re-render", () => {
    const { rerender } = render(
      <Task>
        <TaskTrigger title="First" />
      </Task>
    );
    expect(screen.getByText("First")).toBeInTheDocument();
    rerender(
      <Task>
        <TaskTrigger title="Second" />
      </Task>
    );
    expect(screen.getByText("Second")).toBeInTheDocument();
    expect(screen.queryByText("First")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 12. Accessibility — axe
// ---------------------------------------------------------------------------

describe("ai-task — accessibility (axe)", () => {
  it("open task has no axe violations", async () => {
    const { container } = render(
      <main>
        <Task defaultOpen>
          <TaskTrigger title="Searching the codebase" />
          <TaskContent>
            <TaskItem>
              Scanned <TaskItemFile>button.tsx</TaskItemFile>
            </TaskItem>
            <TaskItem>
              Read <TaskItemFile variant="brand">utils.ts</TaskItemFile>
            </TaskItem>
          </TaskContent>
        </Task>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("collapsed task has no axe violations", async () => {
    const { container } = render(
      <main>
        <Task defaultOpen={false}>
          <TaskTrigger title="Compiling project" />
          <TaskContent>
            <TaskItem>Bundled modules</TaskItem>
          </TaskContent>
        </Task>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("task with custom trigger children has no axe violations", async () => {
    const { container } = render(
      <main>
        <Task defaultOpen>
          <TaskTrigger title="ignored">
            <span>Reviewing pull request</span>
          </TaskTrigger>
          <TaskContent>
            <TaskItem>
              Checked <TaskItemFile variant="muted">diff.patch</TaskItemFile>
            </TaskItem>
          </TaskContent>
        </Task>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
