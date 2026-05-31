/**
 * Exhaustive tests for the SplitWithRail layout component.
 *
 * Component API (from components/split-with-rail.tsx):
 *   <SplitWithRail
 *     summary={ReactNode}   // left column
 *     rail={ReactNode}      // right column
 *     className={string}    // optional, merged via cn()
 *   />
 *
 * It renders a CSS grid wrapper with two child divs.
 */

import { render, screen, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import { SplitWithRail } from "@/components/split-with-rail";

// ---------------------------------------------------------------------------
// 1. Renders without crashing — default usage
// ---------------------------------------------------------------------------
describe("SplitWithRail — default rendering", () => {
  it("renders without crashing with minimal props", () => {
    render(
      <SplitWithRail
        summary={<div>Summary content</div>}
        rail={<div>Rail content</div>}
      />
    );
    expect(screen.getByText("Summary content")).toBeInTheDocument();
    expect(screen.getByText("Rail content")).toBeInTheDocument();
  });

  it("renders a single outermost div (grid wrapper)", () => {
    const { container } = render(
      <SplitWithRail
        summary={<span>S</span>}
        rail={<span>R</span>}
      />
    );
    // The root element should be a div
    expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
  });

  it("renders exactly two child divs inside the grid", () => {
    const { container } = render(
      <SplitWithRail
        summary={<span>Left</span>}
        rail={<span>Right</span>}
      />
    );
    const wrapper = container.firstChild as HTMLElement;
    const children = Array.from(wrapper.children);
    expect(children).toHaveLength(2);
    expect(children[0].tagName).toBe("DIV");
    expect(children[1].tagName).toBe("DIV");
  });

  it("places summary content in the first child div", () => {
    const { container } = render(
      <SplitWithRail
        summary={<p data-testid="summary-node">Summary here</p>}
        rail={<p>Rail here</p>}
      />
    );
    const wrapper = container.firstChild as HTMLElement;
    const firstChild = wrapper.children[0] as HTMLElement;
    expect(within(firstChild).getByTestId("summary-node")).toBeInTheDocument();
  });

  it("places rail content in the second child div", () => {
    const { container } = render(
      <SplitWithRail
        summary={<p>Summary here</p>}
        rail={<p data-testid="rail-node">Rail here</p>}
      />
    );
    const wrapper = container.firstChild as HTMLElement;
    const secondChild = wrapper.children[1] as HTMLElement;
    expect(within(secondChild).getByTestId("rail-node")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 2. CSS classes on the wrapper
// ---------------------------------------------------------------------------
describe("SplitWithRail — default CSS classes", () => {
  it("applies 'grid' class to the outer wrapper", () => {
    const { container } = render(
      <SplitWithRail summary={<div>S</div>} rail={<div>R</div>} />
    );
    expect(container.firstChild).toHaveClass("grid");
  });

  it("applies 'gap-8' class to the outer wrapper", () => {
    const { container } = render(
      <SplitWithRail summary={<div>S</div>} rail={<div>R</div>} />
    );
    expect(container.firstChild).toHaveClass("gap-8");
  });

  it("applies responsive lg:grid-cols layout class to the outer wrapper", () => {
    const { container } = render(
      <SplitWithRail summary={<div>S</div>} rail={<div>R</div>} />
    );
    // The default layout uses lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]
    // Tailwind arbitrary values encode brackets as escaped in the DOM class list
    const wrapper = container.firstChild as HTMLElement;
    const classList = wrapper.className;
    // Check that a responsive grid-cols class is present (handles encoding)
    expect(classList).toMatch(/lg:grid-cols/);
  });
});

// ---------------------------------------------------------------------------
// 3. className prop — custom class is merged/applied
// ---------------------------------------------------------------------------
describe("SplitWithRail — className prop", () => {
  it("applies a custom className to the wrapper when provided", () => {
    const { container } = render(
      <SplitWithRail
        summary={<div>S</div>}
        rail={<div>R</div>}
        className="my-custom-class"
      />
    );
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  it("preserves default classes when a custom className is added", () => {
    const { container } = render(
      <SplitWithRail
        summary={<div>S</div>}
        rail={<div>R</div>}
        className="extra-class"
      />
    );
    expect(container.firstChild).toHaveClass("grid");
    expect(container.firstChild).toHaveClass("gap-8");
    expect(container.firstChild).toHaveClass("extra-class");
  });

  it("allows overriding the grid-cols value via className (twMerge behavior)", () => {
    // The custom-layout example overrides the column ratio
    const { container } = render(
      <SplitWithRail
        summary={<div>S</div>}
        rail={<div>R</div>}
        className="lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"
      />
    );
    const wrapper = container.firstChild as HTMLElement;
    // The className string should contain the override
    expect(wrapper.className).toContain("1.4fr");
  });

  it("works without className prop (className is optional)", () => {
    // No className prop — should not throw and default classes stay
    expect(() =>
      render(<SplitWithRail summary={<div>S</div>} rail={<div>R</div>} />)
    ).not.toThrow();
  });

  it("handles empty string className without error", () => {
    const { container } = render(
      <SplitWithRail
        summary={<div>S</div>}
        rail={<div>R</div>}
        className=""
      />
    );
    expect(container.firstChild).toHaveClass("grid");
  });

  it("handles multiple space-separated custom classes", () => {
    const { container } = render(
      <SplitWithRail
        summary={<div>S</div>}
        rail={<div>R</div>}
        className="p-6 max-w-5xl mx-auto"
      />
    );
    expect(container.firstChild).toHaveClass("p-6");
    expect(container.firstChild).toHaveClass("max-w-5xl");
    expect(container.firstChild).toHaveClass("mx-auto");
  });
});

// ---------------------------------------------------------------------------
// 4. summary prop — accepts any ReactNode
// ---------------------------------------------------------------------------
describe("SplitWithRail — summary prop content", () => {
  it("renders a plain string as summary", () => {
    render(
      <SplitWithRail summary="Plain text summary" rail={<div>Rail</div>} />
    );
    expect(screen.getByText("Plain text summary")).toBeInTheDocument();
  });

  it("renders a number as summary", () => {
    render(<SplitWithRail summary={42} rail={<div>Rail</div>} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders complex nested JSX as summary", () => {
    render(
      <SplitWithRail
        summary={
          <div>
            <h2>Title</h2>
            <p>Description</p>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </div>
        }
        rail={<div>Rail</div>}
      />
    );
    expect(screen.getByRole("heading", { name: "Title" })).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("renders a null summary without crashing", () => {
    // null is a valid ReactNode
    expect(() =>
      render(<SplitWithRail summary={null} rail={<div>Rail</div>} />)
    ).not.toThrow();
  });

  it("renders a fragment as summary", () => {
    render(
      <SplitWithRail
        summary={
          <>
            <span>Fragment child 1</span>
            <span>Fragment child 2</span>
          </>
        }
        rail={<div>Rail</div>}
      />
    );
    expect(screen.getByText("Fragment child 1")).toBeInTheDocument();
    expect(screen.getByText("Fragment child 2")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 5. rail prop — accepts any ReactNode
// ---------------------------------------------------------------------------
describe("SplitWithRail — rail prop content", () => {
  it("renders a plain string as rail", () => {
    render(
      <SplitWithRail summary={<div>Summary</div>} rail="Plain rail text" />
    );
    expect(screen.getByText("Plain rail text")).toBeInTheDocument();
  });

  it("renders complex nested JSX as rail", () => {
    render(
      <SplitWithRail
        summary={<div>Summary</div>}
        rail={
          <ol>
            <li>Step 1</li>
            <li>Step 2</li>
            <li>Step 3</li>
          </ol>
        }
      />
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
  });

  it("renders a null rail without crashing", () => {
    expect(() =>
      render(<SplitWithRail summary={<div>Summary</div>} rail={null} />)
    ).not.toThrow();
  });

  it("renders a fragment as rail", () => {
    render(
      <SplitWithRail
        summary={<div>Summary</div>}
        rail={
          <>
            <span>Rail fragment A</span>
            <span>Rail fragment B</span>
          </>
        }
      />
    );
    expect(screen.getByText("Rail fragment A")).toBeInTheDocument();
    expect(screen.getByText("Rail fragment B")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 6. Column isolation — summary and rail are in separate columns
// ---------------------------------------------------------------------------
describe("SplitWithRail — column isolation", () => {
  it("summary content is NOT in the rail column", () => {
    const { container } = render(
      <SplitWithRail
        summary={<p data-testid="sum">Summary only</p>}
        rail={<p data-testid="rail">Rail only</p>}
      />
    );
    const wrapper = container.firstChild as HTMLElement;
    const railColumn = wrapper.children[1] as HTMLElement;
    expect(within(railColumn).queryByTestId("sum")).not.toBeInTheDocument();
  });

  it("rail content is NOT in the summary column", () => {
    const { container } = render(
      <SplitWithRail
        summary={<p data-testid="sum">Summary only</p>}
        rail={<p data-testid="rail">Rail only</p>}
      />
    );
    const wrapper = container.firstChild as HTMLElement;
    const summaryColumn = wrapper.children[0] as HTMLElement;
    expect(within(summaryColumn).queryByTestId("rail")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 7. Interactive content within summary and rail columns
// ---------------------------------------------------------------------------
describe("SplitWithRail — interactive content inside columns", () => {
  it("renders and allows interaction with buttons inside the summary column", async () => {
    const handleClick = vi.fn();
    render(
      <SplitWithRail
        summary={
          <button type="button" onClick={handleClick}>
            Click me
          </button>
        }
        rail={<div>Rail</div>}
      />
    );
    const btn = screen.getByRole("button", { name: "Click me" });
    await btn.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders and allows interaction with buttons inside the rail column", async () => {
    const handleClick = vi.fn();
    render(
      <SplitWithRail
        summary={<div>Summary</div>}
        rail={
          <button type="button" onClick={handleClick}>
            Rail action
          </button>
        }
      />
    );
    const btn = screen.getByRole("button", { name: "Rail action" });
    await btn.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders form inputs inside summary and they are accessible", () => {
    render(
      <SplitWithRail
        summary={
          <label>
            Name
            <input type="text" name="name" />
          </label>
        }
        rail={<div>Rail</div>}
      />
    );
    expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 8. Example usage scenarios (mirrors the example files)
// ---------------------------------------------------------------------------
describe("SplitWithRail — example usage scenarios", () => {
  it("renders the default example (deployment info + activity list)", () => {
    render(
      <SplitWithRail
        summary={
          <div>
            <p>Project</p>
            <h2>my-dashboard</h2>
            <div>
              <div>
                <p>Environment</p>
                <p>Production</p>
              </div>
              <div>
                <p>Region</p>
                <p>us-east-1</p>
              </div>
            </div>
          </div>
        }
        rail={
          <div>
            <p>Recent activity</p>
            <ol>
              {["Deployment triggered", "Build completed", "Tests passed", "Config updated"].map(
                (item, i) => (
                  <li key={i}>{item}</li>
                )
              )}
            </ol>
          </div>
        }
      />
    );
    expect(screen.getByRole("heading", { name: "my-dashboard" })).toBeInTheDocument();
    expect(screen.getByText("Production")).toBeInTheDocument();
    expect(screen.getByText("Deployment triggered")).toBeInTheDocument();
    expect(screen.getByText("Config updated")).toBeInTheDocument();
  });

  it("renders the custom-layout example with overridden className (wider summary)", () => {
    const { container } = render(
      <SplitWithRail
        className="lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"
        summary={
          <div>
            <h2>Get started</h2>
            <p>3 / 5 complete</p>
          </div>
        }
        rail={
          <div>
            <p>Setup checklist</p>
          </div>
        }
      />
    );
    expect(screen.getByRole("heading", { name: "Get started" })).toBeInTheDocument();
    expect(screen.getByText("3 / 5 complete")).toBeInTheDocument();
    // Verify the custom ratio is applied
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("1.4fr");
  });

  it("renders the with-event-timeline example (deployment pipeline)", () => {
    render(
      <SplitWithRail
        summary={
          <div>
            <h2>v2.14.0</h2>
            <p>Triggered by push to main</p>
          </div>
        }
        rail={
          <div>
            <p>Pipeline events</p>
            <ul>
              <li>Deployment succeeded</li>
              <li>Pipeline triggered</li>
            </ul>
          </div>
        }
      />
    );
    expect(screen.getByRole("heading", { name: "v2.14.0" })).toBeInTheDocument();
    expect(screen.getByText("Deployment succeeded")).toBeInTheDocument();
  });

  it("renders the with-timeline-rail example (user session profile)", () => {
    render(
      <SplitWithRail
        summary={
          <div>
            <p>alice@example.com</p>
            <p>Member since Jan 2025</p>
            <div>
              <div>
                <p>12</p>
                <p>Sessions</p>
              </div>
              <div>
                <p>47m</p>
                <p>Total time</p>
              </div>
            </div>
          </div>
        }
        rail={
          <div>
            <p>This is where their journey begins</p>
          </div>
        }
      />
    );
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("Sessions")).toBeInTheDocument();
    expect(screen.getByText("This is where their journey begins")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 9. Re-render / update behavior
// ---------------------------------------------------------------------------
describe("SplitWithRail — re-render and update behavior", () => {
  it("updates summary content when prop changes", () => {
    const { rerender } = render(
      <SplitWithRail
        summary={<p>Initial summary</p>}
        rail={<div>Rail</div>}
      />
    );
    expect(screen.getByText("Initial summary")).toBeInTheDocument();

    rerender(
      <SplitWithRail
        summary={<p>Updated summary</p>}
        rail={<div>Rail</div>}
      />
    );
    expect(screen.queryByText("Initial summary")).not.toBeInTheDocument();
    expect(screen.getByText("Updated summary")).toBeInTheDocument();
  });

  it("updates rail content when prop changes", () => {
    const { rerender } = render(
      <SplitWithRail
        summary={<div>Summary</div>}
        rail={<p>Initial rail</p>}
      />
    );
    expect(screen.getByText("Initial rail")).toBeInTheDocument();

    rerender(
      <SplitWithRail
        summary={<div>Summary</div>}
        rail={<p>Updated rail</p>}
      />
    );
    expect(screen.queryByText("Initial rail")).not.toBeInTheDocument();
    expect(screen.getByText("Updated rail")).toBeInTheDocument();
  });

  it("updates className when prop changes", () => {
    const { container, rerender } = render(
      <SplitWithRail
        summary={<div>S</div>}
        rail={<div>R</div>}
        className="class-a"
      />
    );
    expect(container.firstChild).toHaveClass("class-a");

    rerender(
      <SplitWithRail
        summary={<div>S</div>}
        rail={<div>R</div>}
        className="class-b"
      />
    );
    expect(container.firstChild).toHaveClass("class-b");
    expect(container.firstChild).not.toHaveClass("class-a");
  });

  it("removes className when prop is removed", () => {
    const { container, rerender } = render(
      <SplitWithRail
        summary={<div>S</div>}
        rail={<div>R</div>}
        className="extra-class"
      />
    );
    expect(container.firstChild).toHaveClass("extra-class");

    rerender(
      <SplitWithRail summary={<div>S</div>} rail={<div>R</div>} />
    );
    expect(container.firstChild).not.toHaveClass("extra-class");
    // Default classes still present
    expect(container.firstChild).toHaveClass("grid");
  });
});

// ---------------------------------------------------------------------------
// 10. Multiple instances
// ---------------------------------------------------------------------------
describe("SplitWithRail — multiple instances", () => {
  it("renders multiple independent instances without content bleed", () => {
    render(
      <div>
        <SplitWithRail
          summary={<p>Summary A</p>}
          rail={<p>Rail A</p>}
        />
        <SplitWithRail
          summary={<p>Summary B</p>}
          rail={<p>Rail B</p>}
        />
      </div>
    );
    expect(screen.getByText("Summary A")).toBeInTheDocument();
    expect(screen.getByText("Rail A")).toBeInTheDocument();
    expect(screen.getByText("Summary B")).toBeInTheDocument();
    expect(screen.getByText("Rail B")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 11. Edge cases
// ---------------------------------------------------------------------------
describe("SplitWithRail — edge cases", () => {
  it("renders with deeply nested children without error", () => {
    const DeepContent = () => (
      <div>
        <div>
          <div>
            <div>
              <span data-testid="deep-node">Deep node</span>
            </div>
          </div>
        </div>
      </div>
    );
    render(
      <SplitWithRail
        summary={<DeepContent />}
        rail={<DeepContent />}
      />
    );
    expect(screen.getAllByTestId("deep-node")).toHaveLength(2);
  });

  it("renders with a very long text string in summary without error", () => {
    const longText = "a".repeat(1000);
    render(
      <SplitWithRail summary={<p>{longText}</p>} rail={<div>R</div>} />
    );
    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  it("renders with an image element in the rail without error", () => {
    render(
      <SplitWithRail
        summary={<div>S</div>}
        rail={<img src="/test.png" alt="Test image" />}
      />
    );
    expect(screen.getByRole("img", { name: "Test image" })).toBeInTheDocument();
  });

  it("renders with a table in the summary without error", () => {
    render(
      <SplitWithRail
        summary={
          <table>
            <tbody>
              <tr>
                <td>Cell 1</td>
                <td>Cell 2</td>
              </tr>
            </tbody>
          </table>
        }
        rail={<div>R</div>}
      />
    );
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("renders boolean false as summary without error (falsy ReactNode)", () => {
    // false renders nothing in React
    expect(() =>
      render(<SplitWithRail summary={false} rail={<div>R</div>} />)
    ).not.toThrow();
  });

  it("renders undefined as summary without error", () => {
    expect(() =>
      render(<SplitWithRail summary={undefined} rail={<div>R</div>} />)
    ).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// 12. Accessibility
// ---------------------------------------------------------------------------
describe("SplitWithRail — accessibility (axe)", () => {
  it("has no axe violations with semantic landmark content", async () => {
    const { container } = render(
      <main>
        <SplitWithRail
          summary={
            <section aria-label="Profile summary">
              <h2>User profile</h2>
              <p>Account details and statistics.</p>
            </section>
          }
          rail={
            <section aria-label="Activity timeline">
              <h3>Recent activity</h3>
              <ol>
                <li>Action 1</li>
                <li>Action 2</li>
              </ol>
            </section>
          }
        />
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with interactive content including labeled buttons", async () => {
    const { container } = render(
      <SplitWithRail
        summary={
          <div>
            <h2>Actions</h2>
            <button type="button" aria-label="Skip setup">
              Skip
            </button>
            <button type="button" aria-label="Continue setup">
              Continue
            </button>
          </div>
        }
        rail={
          <div>
            <h3>Steps</h3>
            <ol>
              <li>Create account</li>
              <li>Set preferences</li>
            </ol>
          </div>
        }
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with a navigation list in the rail", async () => {
    const { container } = render(
      <SplitWithRail
        summary={
          <div>
            <h2>Dashboard</h2>
            <p>Overview of your project.</p>
          </div>
        }
        rail={
          <nav aria-label="Recent events">
            <ul>
              <li>Event one</li>
              <li>Event two</li>
              <li>Event three</li>
            </ul>
          </nav>
        }
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations when both columns have form controls", async () => {
    const { container } = render(
      <SplitWithRail
        summary={
          <form>
            <label htmlFor="name-input">Name</label>
            <input id="name-input" type="text" />
          </form>
        }
        rail={
          <form>
            <label htmlFor="email-input">Email</label>
            <input id="email-input" type="email" />
          </form>
        }
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with a simple text-only render", async () => {
    const { container } = render(
      <SplitWithRail summary={<p>Left side text</p>} rail={<p>Right side text</p>} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// 13. Structure invariants — the wrapper structure never changes
// ---------------------------------------------------------------------------
describe("SplitWithRail — structural invariants", () => {
  it("always has exactly one root element", () => {
    const { container } = render(
      <SplitWithRail summary={<div>S</div>} rail={<div>R</div>} />
    );
    // container.children should contain exactly one element (the grid wrapper)
    expect(container.children).toHaveLength(1);
  });

  it("always has exactly two columns regardless of content", () => {
    const scenarios = [
      { summary: null, rail: null },
      { summary: <p>A</p>, rail: null },
      { summary: null, rail: <p>B</p> },
      { summary: <p>A</p>, rail: <p>B</p> },
      { summary: <><p>1</p><p>2</p></>, rail: <><p>3</p><p>4</p></> },
    ] as Array<{ summary: React.ReactNode; rail: React.ReactNode }>;

    for (const { summary, rail } of scenarios) {
      const { container, unmount } = render(
        <SplitWithRail summary={summary} rail={rail} />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.children).toHaveLength(2);
      unmount();
    }
  });

  it("the grid wrapper is a div (not a section, aside, etc.)", () => {
    const { container } = render(
      <SplitWithRail summary={<div>S</div>} rail={<div>R</div>} />
    );
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("both column wrappers are divs", () => {
    const { container } = render(
      <SplitWithRail summary={<div>S</div>} rail={<div>R</div>} />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.children[0].nodeName).toBe("DIV");
    expect(wrapper.children[1].nodeName).toBe("DIV");
  });

  it("the outer wrapper does not have an id or aria attribute by default", () => {
    const { container } = render(
      <SplitWithRail summary={<div>S</div>} rail={<div>R</div>} />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.id).toBe("");
    expect(wrapper.getAttribute("aria-label")).toBeNull();
    expect(wrapper.getAttribute("role")).toBeNull();
  });
});
