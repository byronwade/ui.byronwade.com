/**
 * Exhaustive tests for the Plan compound component (AI Elements port).
 *
 * Component source: components/ai-elements/plan.tsx
 *
 * Exports:
 *   Plan            – Base UI Collapsible Root rendered AS a Card, data-slot="plan".
 *                     `isStreaming` prop shimmers the title + description.
 *   PlanHeader      – CardHeader, data-slot="plan-header"
 *   PlanTitle       – CardTitle (string child), data-slot="plan-title", shimmers when streaming
 *   PlanDescription – CardDescription (string child), data-slot="plan-description", shimmers when streaming
 *   PlanAction      – CardAction, data-slot="plan-action"
 *   PlanContent     – Collapsible Panel rendered AS CardContent, data-slot="plan-content"
 *   PlanFooter      – CardFooter, data-slot="plan-footer"
 *   PlanTrigger     – Collapsible Trigger rendered AS a ghost icon Button, data-slot="plan-trigger"
 *
 * Notes for jsdom:
 *   - Plan defaults CLOSED (Base UI open=false), so the panel/content is not
 *     mounted until the trigger is clicked (test closed → open).
 *   - The `data-slot` placed on the Base UI primitive wins over the rendered
 *     primitive's own slot (e.g. "plan-trigger" replaces "button").
 */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  Plan,
  PlanHeader,
  PlanTitle,
  PlanDescription,
  PlanAction,
  PlanContent,
  PlanFooter,
  PlanTrigger,
} from "@/components/ai-elements/plan";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderFullPlan(
  props: { isStreaming?: boolean; defaultOpen?: boolean } = {}
) {
  return render(
    <Plan defaultOpen={props.defaultOpen} isStreaming={props.isStreaming}>
      <PlanHeader>
        <PlanTitle>Refactor the auth module</PlanTitle>
        <PlanDescription>Three steps to migrate sessions.</PlanDescription>
        <PlanAction>
          <PlanTrigger />
        </PlanAction>
      </PlanHeader>
      <PlanContent>
        <p>Step one body</p>
      </PlanContent>
      <PlanFooter>
        <span>1 / 3 done</span>
      </PlanFooter>
    </Plan>
  );
}

// ---------------------------------------------------------------------------
// 1. Renders without crashing
// ---------------------------------------------------------------------------

describe("Plan — renders without crashing", () => {
  it("renders a bare Plan without crashing", () => {
    const { container } = render(<Plan />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("Plan root element is a <div>", () => {
    const { container } = render(<Plan />);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("renders a fully-composed plan without crashing", () => {
    expect(() => renderFullPlan({ defaultOpen: true })).not.toThrow();
  });

  it("renders children inside Plan", () => {
    render(<Plan>hello plan</Plan>);
    expect(screen.getByText("hello plan")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 2. data-slot attributes — every rendered part
// ---------------------------------------------------------------------------

describe("Plan — data-slot attributes", () => {
  it("Plan root has data-slot='plan'", () => {
    const { container } = render(<Plan />);
    expect(container.firstChild).toHaveAttribute("data-slot", "plan");
  });

  it("PlanHeader has data-slot='plan-header'", () => {
    const { container } = render(
      <Plan>
        <PlanHeader />
      </Plan>
    );
    expect(
      container.querySelector("[data-slot='plan-header']")
    ).toBeInTheDocument();
  });

  it("PlanTitle has data-slot='plan-title'", () => {
    const { container } = render(
      <Plan>
        <PlanHeader>
          <PlanTitle>T</PlanTitle>
        </PlanHeader>
      </Plan>
    );
    expect(
      container.querySelector("[data-slot='plan-title']")
    ).toBeInTheDocument();
  });

  it("PlanDescription has data-slot='plan-description'", () => {
    const { container } = render(
      <Plan>
        <PlanHeader>
          <PlanDescription>D</PlanDescription>
        </PlanHeader>
      </Plan>
    );
    expect(
      container.querySelector("[data-slot='plan-description']")
    ).toBeInTheDocument();
  });

  it("PlanAction has data-slot='plan-action'", () => {
    const { container } = render(
      <Plan>
        <PlanHeader>
          <PlanAction>
            <button type="button">A</button>
          </PlanAction>
        </PlanHeader>
      </Plan>
    );
    expect(
      container.querySelector("[data-slot='plan-action']")
    ).toBeInTheDocument();
  });

  it("PlanFooter has data-slot='plan-footer'", () => {
    const { container } = render(
      <Plan>
        <PlanFooter>footer</PlanFooter>
      </Plan>
    );
    expect(
      container.querySelector("[data-slot='plan-footer']")
    ).toBeInTheDocument();
  });

  it("PlanTrigger has data-slot='plan-trigger' (wins over button slot)", () => {
    const { container } = render(
      <Plan>
        <PlanTrigger />
      </Plan>
    );
    expect(
      container.querySelector("[data-slot='plan-trigger']")
    ).toBeInTheDocument();
    expect(container.querySelector("[data-slot='button']")).toBeNull();
  });

  it("PlanContent has data-slot='plan-content' once opened", async () => {
    const { container } = renderFullPlan({ defaultOpen: true });
    expect(
      container.querySelector("[data-slot='plan-content']")
    ).toBeInTheDocument();
  });

  it("all eight slots are present in a fully-composed open plan", () => {
    const { container } = renderFullPlan({ defaultOpen: true });
    const slots = Array.from(
      container.querySelectorAll("[data-slot^='plan']")
    ).map((el) => el.getAttribute("data-slot"));
    expect(slots).toEqual(
      expect.arrayContaining([
        "plan",
        "plan-header",
        "plan-title",
        "plan-description",
        "plan-action",
        "plan-trigger",
        "plan-content",
        "plan-footer",
      ])
    );
  });
});

// ---------------------------------------------------------------------------
// 3. Plan root — renders as a Card
// ---------------------------------------------------------------------------

describe("Plan — root renders as a Card", () => {
  it("carries the Card base classes (bg-card, rounded-2xl, edge)", () => {
    const { container } = render(<Plan />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("bg-card");
    expect(cls).toContain("rounded-2xl");
    expect(cls).toContain("edge");
  });

  it("does not carry a hard border (depth via edge hairline)", () => {
    const { container } = render(<Plan />);
    expect((container.firstChild as HTMLElement).className).not.toContain(
      "border-border"
    );
  });

  it("forwards a custom className onto the Card", () => {
    const { container } = render(<Plan className="custom-plan" />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "custom-plan"
    );
  });

  it("merges custom className with base Card classes", () => {
    const { container } = render(<Plan className="custom-plan" />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("custom-plan");
    expect(cls).toContain("bg-card");
  });

  it("forwards HTML attributes (id, data-testid)", () => {
    const { container } = render(<Plan id="plan-1" data-testid="plan-root" />);
    expect(container.firstChild).toHaveAttribute("id", "plan-1");
    expect(container.firstChild).toHaveAttribute("data-testid", "plan-root");
  });
});

// ---------------------------------------------------------------------------
// 4. PlanTitle — content + classes + streaming branch
// ---------------------------------------------------------------------------

describe("PlanTitle — content, classes & streaming", () => {
  it("renders the title text (non-streaming)", () => {
    render(
      <Plan>
        <PlanHeader>
          <PlanTitle>Migrate to Postgres</PlanTitle>
        </PlanHeader>
      </Plan>
    );
    expect(screen.getByText("Migrate to Postgres")).toBeInTheDocument();
  });

  it("is font-medium and never bold (editorial type)", () => {
    const { container } = render(
      <Plan>
        <PlanHeader>
          <PlanTitle>Title</PlanTitle>
        </PlanHeader>
      </Plan>
    );
    const title = container.querySelector(
      "[data-slot='plan-title']"
    ) as HTMLElement;
    expect(title.className).toContain("font-medium");
    expect(title.className).not.toContain("font-bold");
    expect(title.className).not.toContain("font-semibold");
  });

  it("renders the raw string (no Shimmer) when not streaming", () => {
    const { container } = render(
      <Plan isStreaming={false}>
        <PlanHeader>
          <PlanTitle>Plain title</PlanTitle>
        </PlanHeader>
      </Plan>
    );
    expect(screen.getByText("Plain title")).toBeInTheDocument();
    expect(container.querySelector("[data-slot='shimmer']")).toBeNull();
  });

  it("wraps the title in Shimmer when streaming", () => {
    const { container } = render(
      <Plan isStreaming>
        <PlanHeader>
          <PlanTitle>Streaming title</PlanTitle>
        </PlanHeader>
      </Plan>
    );
    const title = container.querySelector(
      "[data-slot='plan-title']"
    ) as HTMLElement;
    const shimmer = title.querySelector("[data-slot='shimmer']");
    expect(shimmer).toBeInTheDocument();
    expect(screen.getByText("Streaming title")).toBeInTheDocument();
  });

  it("forwards a custom className onto the title", () => {
    const { container } = render(
      <Plan>
        <PlanHeader>
          <PlanTitle className="custom-title">T</PlanTitle>
        </PlanHeader>
      </Plan>
    );
    const title = container.querySelector(
      "[data-slot='plan-title']"
    ) as HTMLElement;
    expect(title.className).toContain("custom-title");
  });
});

// ---------------------------------------------------------------------------
// 5. PlanDescription — content + classes + streaming branch
// ---------------------------------------------------------------------------

describe("PlanDescription — content, classes & streaming", () => {
  it("renders the description text (non-streaming)", () => {
    render(
      <Plan>
        <PlanHeader>
          <PlanDescription>Overview of the migration.</PlanDescription>
        </PlanHeader>
      </Plan>
    );
    expect(screen.getByText("Overview of the migration.")).toBeInTheDocument();
  });

  it("has muted text + text-balance classes", () => {
    const { container } = render(
      <Plan>
        <PlanHeader>
          <PlanDescription>Desc</PlanDescription>
        </PlanHeader>
      </Plan>
    );
    const desc = container.querySelector(
      "[data-slot='plan-description']"
    ) as HTMLElement;
    expect(desc.className).toContain("text-muted-foreground");
    expect(desc.className).toContain("text-balance");
  });

  it("renders the raw string (no Shimmer) when not streaming", () => {
    const { container } = render(
      <Plan isStreaming={false}>
        <PlanHeader>
          <PlanDescription>Plain desc</PlanDescription>
        </PlanHeader>
      </Plan>
    );
    expect(screen.getByText("Plain desc")).toBeInTheDocument();
    expect(container.querySelector("[data-slot='shimmer']")).toBeNull();
  });

  it("wraps the description in Shimmer when streaming", () => {
    const { container } = render(
      <Plan isStreaming>
        <PlanHeader>
          <PlanDescription>Streaming desc</PlanDescription>
        </PlanHeader>
      </Plan>
    );
    const desc = container.querySelector(
      "[data-slot='plan-description']"
    ) as HTMLElement;
    expect(desc.querySelector("[data-slot='shimmer']")).toBeInTheDocument();
    expect(screen.getByText("Streaming desc")).toBeInTheDocument();
  });

  it("forwards a custom className onto the description", () => {
    const { container } = render(
      <Plan>
        <PlanHeader>
          <PlanDescription className="custom-desc">D</PlanDescription>
        </PlanHeader>
      </Plan>
    );
    const desc = container.querySelector(
      "[data-slot='plan-description']"
    ) as HTMLElement;
    expect(desc.className).toContain("custom-desc");
  });
});

// ---------------------------------------------------------------------------
// 6. isStreaming default — both branches via the default value
// ---------------------------------------------------------------------------

describe("Plan — isStreaming default", () => {
  it("defaults isStreaming to false (no shimmer when prop omitted)", () => {
    const { container } = render(
      <Plan>
        <PlanHeader>
          <PlanTitle>No prop</PlanTitle>
          <PlanDescription>No prop desc</PlanDescription>
        </PlanHeader>
      </Plan>
    );
    expect(container.querySelector("[data-slot='shimmer']")).toBeNull();
  });

  it("shimmers both title and description when streaming", () => {
    const { container } = render(
      <Plan isStreaming>
        <PlanHeader>
          <PlanTitle>Title</PlanTitle>
          <PlanDescription>Desc</PlanDescription>
        </PlanHeader>
      </Plan>
    );
    expect(
      container.querySelectorAll("[data-slot='shimmer']")
    ).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// 7. PlanHeader / PlanAction / PlanFooter — classes & content
// ---------------------------------------------------------------------------

describe("PlanHeader — classes & content", () => {
  it("has flex / items-start / justify-between layout classes", () => {
    const { container } = render(
      <Plan>
        <PlanHeader />
      </Plan>
    );
    const header = container.querySelector(
      "[data-slot='plan-header']"
    ) as HTMLElement;
    expect(header.className).toContain("flex");
    expect(header.className).toContain("items-start");
    expect(header.className).toContain("justify-between");
  });

  it("forwards a custom className", () => {
    const { container } = render(
      <Plan>
        <PlanHeader className="custom-header" />
      </Plan>
    );
    const header = container.querySelector(
      "[data-slot='plan-header']"
    ) as HTMLElement;
    expect(header.className).toContain("custom-header");
  });
});

describe("PlanAction — content", () => {
  it("renders action children", () => {
    render(
      <Plan>
        <PlanHeader>
          <PlanAction>
            <button type="button" aria-label="Pin plan">
              Pin
            </button>
          </PlanAction>
        </PlanHeader>
      </Plan>
    );
    expect(
      screen.getByRole("button", { name: "Pin plan" })
    ).toBeInTheDocument();
  });

  it("forwards a custom className", () => {
    const { container } = render(
      <Plan>
        <PlanHeader>
          <PlanAction className="custom-action">
            <button type="button">A</button>
          </PlanAction>
        </PlanHeader>
      </Plan>
    );
    const action = container.querySelector(
      "[data-slot='plan-action']"
    ) as HTMLElement;
    expect(action.className).toContain("custom-action");
  });
});

describe("PlanFooter — content", () => {
  it("renders footer children", () => {
    render(
      <Plan>
        <PlanFooter>
          <span>2 / 4 done</span>
        </PlanFooter>
      </Plan>
    );
    expect(screen.getByText("2 / 4 done")).toBeInTheDocument();
  });

  it("forwards a custom className", () => {
    const { container } = render(
      <Plan>
        <PlanFooter className="custom-footer" />
      </Plan>
    );
    const footer = container.querySelector(
      "[data-slot='plan-footer']"
    ) as HTMLElement;
    expect(footer.className).toContain("custom-footer");
  });
});

// ---------------------------------------------------------------------------
// 8. PlanTrigger — renders as a ghost icon Button
// ---------------------------------------------------------------------------

describe("PlanTrigger — ghost icon button", () => {
  it("renders a real <button>", () => {
    const { container } = render(
      <Plan>
        <PlanTrigger />
      </Plan>
    );
    const trigger = container.querySelector("[data-slot='plan-trigger']");
    expect(trigger?.tagName).toBe("BUTTON");
  });

  it("carries the size-8 ghost classes from the merged Button", () => {
    const { container } = render(
      <Plan>
        <PlanTrigger />
      </Plan>
    );
    const trigger = container.querySelector(
      "[data-slot='plan-trigger']"
    ) as HTMLElement;
    expect(trigger.className).toContain("size-8");
  });

  it("exposes an accessible 'Toggle plan' label via the default sr-only span", () => {
    render(
      <Plan>
        <PlanTrigger />
      </Plan>
    );
    expect(
      screen.getByRole("button", { name: /toggle plan/i })
    ).toBeInTheDocument();
  });

  it("renders the default chevron icon when no children given", () => {
    const { container } = render(
      <Plan>
        <PlanTrigger />
      </Plan>
    );
    const trigger = container.querySelector("[data-slot='plan-trigger']");
    expect(trigger?.querySelector("svg")).toBeInTheDocument();
  });

  it("renders custom children instead of the default chevron", () => {
    render(
      <Plan>
        <PlanTrigger>
          <span>Expand</span>
        </PlanTrigger>
      </Plan>
    );
    expect(screen.getByText("Expand")).toBeInTheDocument();
    expect(screen.queryByText("Toggle plan")).not.toBeInTheDocument();
  });

  it("forwards a custom className onto the trigger button", () => {
    const { container } = render(
      <Plan>
        <PlanTrigger className="custom-trigger" />
      </Plan>
    );
    const trigger = container.querySelector(
      "[data-slot='plan-trigger']"
    ) as HTMLElement;
    expect(trigger.className).toContain("custom-trigger");
  });
});

// ---------------------------------------------------------------------------
// 9. Collapsible behavior — open / close interactions
// ---------------------------------------------------------------------------

describe("Plan — collapsible interactions", () => {
  it("defaults closed — content is not mounted initially", () => {
    renderFullPlan();
    expect(screen.queryByText("Step one body")).not.toBeInTheDocument();
  });

  it("renders content immediately when defaultOpen", () => {
    renderFullPlan({ defaultOpen: true });
    expect(screen.getByText("Step one body")).toBeInTheDocument();
  });

  it("opens the content when the trigger is clicked", async () => {
    const user = userEvent.setup();
    renderFullPlan();
    expect(screen.queryByText("Step one body")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /toggle plan/i }));
    expect(screen.getByText("Step one body")).toBeInTheDocument();
  });

  it("closes the content when the trigger is clicked again", async () => {
    const user = userEvent.setup();
    renderFullPlan({ defaultOpen: true });
    expect(screen.getByText("Step one body")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /toggle plan/i }));
    expect(screen.queryByText("Step one body")).not.toBeInTheDocument();
  });

  it("toggles open via keyboard (Enter) on the focused trigger", async () => {
    const user = userEvent.setup();
    renderFullPlan();
    const trigger = screen.getByRole("button", { name: /toggle plan/i });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByText("Step one body")).toBeInTheDocument();
  });

  it("respects controlled open prop", () => {
    renderFullPlan({ defaultOpen: undefined });
    const { rerender } = render(
      <Plan open>
        <PlanContent>
          <p>Controlled body</p>
        </PlanContent>
      </Plan>
    );
    expect(screen.getByText("Controlled body")).toBeInTheDocument();
    rerender(
      <Plan open={false}>
        <PlanContent>
          <p>Controlled body</p>
        </PlanContent>
      </Plan>
    );
    expect(screen.queryByText("Controlled body")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 10. usePlan context guard
// ---------------------------------------------------------------------------

describe("Plan — context guard", () => {
  it("PlanTitle throws when used outside Plan", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<PlanTitle>Orphan</PlanTitle>)).toThrow(
      /must be used within Plan/i
    );
    spy.mockRestore();
  });

  it("PlanDescription throws when used outside Plan", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<PlanDescription>Orphan</PlanDescription>)).toThrow(
      /must be used within Plan/i
    );
    spy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// 11. DOM structure
// ---------------------------------------------------------------------------

describe("Plan — DOM structure", () => {
  it("nests all compound parts inside the Plan root", () => {
    const { container } = renderFullPlan({ defaultOpen: true });
    const root = container.querySelector("[data-slot='plan']") as HTMLElement;
    expect(
      within(root).getByText("Refactor the auth module")
    ).toBeInTheDocument();
    expect(
      within(root).getByText("Three steps to migrate sessions.")
    ).toBeInTheDocument();
    expect(within(root).getByText("Step one body")).toBeInTheDocument();
    expect(within(root).getByText("1 / 3 done")).toBeInTheDocument();
  });

  it("renders exactly one plan root", () => {
    const { container } = renderFullPlan({ defaultOpen: true });
    expect(container.querySelectorAll("[data-slot='plan']")).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// 12. Accessibility — axe
// ---------------------------------------------------------------------------

describe("Plan — accessibility (axe)", () => {
  it("fully-composed open plan has no axe violations", async () => {
    const { container } = render(
      <main>
        <Plan defaultOpen>
          <PlanHeader>
            <PlanTitle>Refactor the auth module</PlanTitle>
            <PlanDescription>Three steps to migrate sessions.</PlanDescription>
            <PlanAction>
              <PlanTrigger />
            </PlanAction>
          </PlanHeader>
          <PlanContent>
            <p>Step one body</p>
          </PlanContent>
          <PlanFooter>
            <span>1 / 3 done</span>
          </PlanFooter>
        </Plan>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("closed plan has no axe violations", async () => {
    const { container } = render(
      <main>
        <Plan>
          <PlanHeader>
            <PlanTitle>Refactor the auth module</PlanTitle>
            <PlanDescription>Three steps to migrate sessions.</PlanDescription>
            <PlanAction>
              <PlanTrigger />
            </PlanAction>
          </PlanHeader>
          <PlanContent>
            <p>Body</p>
          </PlanContent>
        </Plan>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("streaming plan has no axe violations", async () => {
    const { container } = render(
      <main>
        <Plan defaultOpen isStreaming>
          <PlanHeader>
            <PlanTitle>Generating plan</PlanTitle>
            <PlanDescription>Thinking through the steps…</PlanDescription>
            <PlanAction>
              <PlanTrigger />
            </PlanAction>
          </PlanHeader>
          <PlanContent>
            <p>Drafting…</p>
          </PlanContent>
        </Plan>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
