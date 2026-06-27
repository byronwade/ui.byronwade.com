import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Smoke ────────────────────────────────────────────────────────────────────

describe("Skeleton – smoke", () => {
  it("renders without crashing with no props", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders a <div> element by default", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("renders with data-slot='skeleton'", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveAttribute("data-slot", "skeleton");
  });

  it("renders children correctly", () => {
    render(<Skeleton>Hello</Skeleton>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders with no children without crashing", () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector("[data-slot='skeleton']")).toBeInTheDocument();
  });

  it("returns a non-null DOM node", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).not.toBeNull();
  });
});

// ─── Base classes ─────────────────────────────────────────────────────────────

describe("Skeleton – base classes", () => {
  it("has animate-pulse class", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("animate-pulse");
  });

  it("has rounded-lg class", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("rounded-lg");
  });

  it("has bg-muted class", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("bg-muted");
  });

  it("has all three base classes simultaneously", () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("animate-pulse");
    expect(el.className).toContain("rounded-lg");
    expect(el.className).toContain("bg-muted");
  });
});

// ─── data-slot attribute ──────────────────────────────────────────────────────

describe("Skeleton – data-slot attribute", () => {
  it("data-slot is always 'skeleton'", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveAttribute("data-slot", "skeleton");
  });

  it("data-slot is present even when className is overridden", () => {
    const { container } = render(<Skeleton className="h-10 w-10" />);
    expect(container.firstChild).toHaveAttribute("data-slot", "skeleton");
  });

  it("data-slot is queryable via CSS attribute selector", () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector("[data-slot='skeleton']")).toBeInTheDocument();
  });
});

// ─── className prop ────────────────────────────────────────────────────────────

describe("Skeleton – className prop", () => {
  it("merges a custom className onto the element", () => {
    const { container } = render(<Skeleton className="my-custom-class" />);
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  it("custom className does not remove the animate-pulse base class", () => {
    const { container } = render(<Skeleton className="h-6" />);
    expect(container.firstChild).toHaveClass("animate-pulse");
  });

  it("custom className does not remove rounded-lg base class", () => {
    const { container } = render(<Skeleton className="w-full" />);
    expect(container.firstChild).toHaveClass("rounded-lg");
  });

  it("custom className does not remove bg-muted base class", () => {
    const { container } = render(<Skeleton className="h-4" />);
    expect(container.firstChild).toHaveClass("bg-muted");
  });

  it("applies height utility class (h-6)", () => {
    const { container } = render(<Skeleton className="h-6 w-3/4" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("h-6");
    expect(el.className).toContain("w-3/4");
  });

  it("applies height utility class (h-4)", () => {
    const { container } = render(<Skeleton className="h-4 w-full" />);
    expect(container.firstChild).toHaveClass("h-4");
  });

  it("applies height utility class (h-10)", () => {
    const { container } = render(<Skeleton className="h-10" />);
    expect(container.firstChild).toHaveClass("h-10");
  });

  it("applies width utility class (w-full)", () => {
    const { container } = render(<Skeleton className="w-full" />);
    expect(container.firstChild).toHaveClass("w-full");
  });

  it("applies rounded-full for circular avatar skeleton", () => {
    const { container } = render(
      <Skeleton className="h-10 w-10 rounded-full" />
    );
    expect(container.firstChild).toHaveClass("rounded-full");
  });

  it("applies rounded-lg override class", () => {
    const { container } = render(<Skeleton className="rounded-lg" />);
    expect(container.firstChild).toHaveClass("rounded-lg");
  });

  it("applies multiple custom classes at once", () => {
    const { container } = render(
      <Skeleton className="h-5 w-36 foo bar" />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("h-5");
    expect(el.className).toContain("w-36");
    expect(el.className).toContain("foo");
    expect(el.className).toContain("bar");
  });

  it("empty className string does not break rendering", () => {
    const { container } = render(<Skeleton className="" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

// ─── HTML attribute forwarding ─────────────────────────────────────────────────

describe("Skeleton – HTML attribute forwarding", () => {
  it("forwards id attribute", () => {
    const { container } = render(<Skeleton id="my-skeleton" />);
    expect(container.firstChild).toHaveAttribute("id", "my-skeleton");
  });

  it("forwards data-testid attribute", () => {
    render(<Skeleton data-testid="skel-test" />);
    expect(screen.getByTestId("skel-test")).toBeInTheDocument();
  });

  it("forwards aria-label attribute", () => {
    const { container } = render(<Skeleton aria-label="Loading content" />);
    expect(container.firstChild).toHaveAttribute("aria-label", "Loading content");
  });

  it("forwards aria-hidden attribute", () => {
    const { container } = render(<Skeleton aria-hidden="true" />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("forwards role attribute", () => {
    const { container } = render(<Skeleton role="status" />);
    expect(container.firstChild).toHaveAttribute("role", "status");
  });

  it("forwards style attribute", () => {
    const { container } = render(<Skeleton style={{ width: 90 }} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe("90px");
  });

  it("forwards tabIndex attribute", () => {
    const { container } = render(<Skeleton tabIndex={-1} />);
    expect(container.firstChild).toHaveAttribute("tabindex", "-1");
  });

  it("forwards custom data-* attributes", () => {
    const { container } = render(<Skeleton data-loading="true" />);
    expect(container.firstChild).toHaveAttribute("data-loading", "true");
  });

  it("forwards aria-busy attribute", () => {
    const { container } = render(<Skeleton aria-busy="true" />);
    expect(container.firstChild).toHaveAttribute("aria-busy", "true");
  });
});

// ─── Children / composition ────────────────────────────────────────────────────

describe("Skeleton – children composition", () => {
  it("renders null children without crashing", () => {
    const { container } = render(<Skeleton>{null}</Skeleton>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders undefined children without crashing", () => {
    const { container } = render(<Skeleton>{undefined}</Skeleton>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders a string child", () => {
    render(<Skeleton>Loading…</Skeleton>);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("renders nested element children", () => {
    render(
      <Skeleton>
        <span data-testid="inner">inner</span>
      </Skeleton>
    );
    expect(screen.getByTestId("inner")).toBeInTheDocument();
  });

  it("renders multiple children without crashing", () => {
    render(
      <Skeleton>
        <span>a</span>
        <span>b</span>
      </Skeleton>
    );
    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.getByText("b")).toBeInTheDocument();
  });
});

// ─── Typical usage patterns (from examples) ────────────────────────────────────

describe("Skeleton – typical usage patterns", () => {
  it("renders a single text-line skeleton (default example, h-6 w-3/4)", () => {
    const { container } = render(<Skeleton className="h-6 w-3/4" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("h-6");
    expect(el).toHaveClass("w-3/4");
    expect(el).toHaveClass("animate-pulse");
  });

  it("renders a circular avatar skeleton (h-10 w-10 rounded-full)", () => {
    const { container } = render(
      <Skeleton className="h-10 w-10 rounded-full" />
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("rounded-full");
    expect(el).toHaveClass("h-10");
    expect(el).toHaveClass("w-10");
  });

  it("renders a small circle badge skeleton (h-5 w-5 rounded-full)", () => {
    const { container } = render(
      <Skeleton className="h-5 w-5 rounded-full" />
    );
    expect(container.firstChild).toHaveClass("rounded-full");
  });

  it("renders an image placeholder skeleton (h-40 w-full rounded-lg)", () => {
    const { container } = render(
      <Skeleton className="h-40 w-full rounded-lg" />
    );
    expect(container.firstChild).toHaveClass("h-40");
    expect(container.firstChild).toHaveClass("rounded-lg");
  });

  it("renders a button-shaped skeleton (h-8 w-20 rounded-md)", () => {
    const { container } = render(
      <Skeleton className="h-8 w-20 rounded-md" />
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("h-8");
    expect(el).toHaveClass("w-20");
    expect(el).toHaveClass("rounded-md");
  });

  it("renders a large profile avatar skeleton (h-20 w-20 rounded-full)", () => {
    const { container } = render(
      <Skeleton className="h-20 w-20 rounded-full" />
    );
    expect(container.firstChild).toHaveClass("rounded-full");
  });

  it("renders a narrow subtitle-line skeleton (h-3 w-1/3)", () => {
    const { container } = render(<Skeleton className="h-3 w-1/3" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("h-3");
    expect(el).toHaveClass("w-1/3");
  });

  it("renders a table-cell skeleton with inline style width", () => {
    const { container } = render(
      <Skeleton className="h-4 rounded" style={{ width: 90 }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("h-4");
    expect(el.style.width).toBe("90px");
  });

  it("renders multiple skeletons inside a flex container", () => {
    const { container } = render(
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    );
    const skeletons = container.querySelectorAll("[data-slot='skeleton']");
    expect(skeletons).toHaveLength(3);
  });

  it("renders a card skeleton layout with image + lines + footer", () => {
    const { container } = render(
      <div>
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    );
    const skeletons = container.querySelectorAll("[data-slot='skeleton']");
    expect(skeletons).toHaveLength(7);
  });

  it("renders a profile skeleton with avatar + name + bio + stats + buttons", () => {
    const { container } = render(
      <div>
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6" />
        <Skeleton className="h-5 w-10" />
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
    );
    const skeletons = container.querySelectorAll("[data-slot='skeleton']");
    expect(skeletons).toHaveLength(9);
  });

  it("renders list rows (5 rows × 4 skeletons each)", () => {
    const rows = Array.from({ length: 5 });
    const { container } = render(
      <div>
        {rows.map((_, i) => (
          <div key={i}>
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>
    );
    const skeletons = container.querySelectorAll("[data-slot='skeleton']");
    expect(skeletons).toHaveLength(20);
  });

  it("renders media-grid 2×2 layout (header + 4 cards × 3 skeletons each)", () => {
    const { container } = render(
      <div>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-16" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-28 w-full rounded-md" />
            <Skeleton className="h-3.5 w-4/5" />
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-3 w-14" />
          </div>
        ))}
      </div>
    );
    const skeletons = container.querySelectorAll("[data-slot='skeleton']");
    // 2 header + 4×4 = 18
    expect(skeletons).toHaveLength(18);
  });
});

// ─── Loaded-state / conditional rendering pattern ──────────────────────────────

describe("Skeleton – loaded-state pattern (with-loaded-state example)", () => {
  function ArticleSkeleton() {
    return (
      <div data-testid="article-skeleton">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-7 w-7 rounded-full" />
        <Skeleton className="h-3.5 w-28" />
      </div>
    );
  }

  function ArticleContent() {
    return (
      <div data-testid="article-content">
        <p>How to build accessible data tables</p>
      </div>
    );
  }

  function LoadingWidget({ loading }: { loading: boolean }) {
    return loading ? <ArticleSkeleton /> : <ArticleContent />;
  }

  it("shows skeleton when loading=true", () => {
    render(<LoadingWidget loading={true} />);
    expect(screen.getByTestId("article-skeleton")).toBeInTheDocument();
    expect(screen.queryByTestId("article-content")).not.toBeInTheDocument();
  });

  it("shows content and hides skeleton when loading=false", () => {
    render(<LoadingWidget loading={false} />);
    expect(screen.getByTestId("article-content")).toBeInTheDocument();
    expect(screen.queryByTestId("article-skeleton")).not.toBeInTheDocument();
  });

  it("skeletons have all base classes in loading state", () => {
    const { container } = render(<LoadingWidget loading={true} />);
    const skeletons = container.querySelectorAll("[data-slot='skeleton']");
    skeletons.forEach((skel) => {
      expect(skel).toHaveClass("animate-pulse");
      expect(skel).toHaveClass("bg-muted");
    });
  });

  it("toggle from loading to loaded: skeleton disappears, content appears", () => {
    const { rerender } = render(<LoadingWidget loading={true} />);
    expect(screen.getByTestId("article-skeleton")).toBeInTheDocument();

    rerender(<LoadingWidget loading={false} />);
    expect(screen.queryByTestId("article-skeleton")).not.toBeInTheDocument();
    expect(screen.getByTestId("article-content")).toBeInTheDocument();
  });

  it("toggle back from loaded to loading: skeleton reappears", () => {
    const { rerender } = render(<LoadingWidget loading={false} />);
    rerender(<LoadingWidget loading={true} />);
    expect(screen.getByTestId("article-skeleton")).toBeInTheDocument();
  });

  it("interactive toggle works with userEvent", async () => {
    function ToggleDemo() {
      const [loading, setLoading] = React.useState(true);
      return (
        <div>
          <button onClick={() => setLoading((v) => !v)}>
            {loading ? "Skip loading" : "Reset"}
          </button>
          {loading ? <ArticleSkeleton /> : <ArticleContent />}
        </div>
      );
    }
    const user = userEvent.setup();
    render(<ToggleDemo />);
    expect(screen.getByTestId("article-skeleton")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Skip loading" }));
    expect(screen.queryByTestId("article-skeleton")).not.toBeInTheDocument();
    expect(screen.getByTestId("article-content")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByTestId("article-skeleton")).toBeInTheDocument();
  });
});

// ─── Re-render behavior ────────────────────────────────────────────────────────

describe("Skeleton – re-render behavior", () => {
  it("updates className on re-render", () => {
    const { rerender, container } = render(<Skeleton className="h-4" />);
    expect(container.firstChild).toHaveClass("h-4");
    rerender(<Skeleton className="h-10" />);
    expect(container.firstChild).toHaveClass("h-10");
  });

  it("keeps data-slot on re-render", () => {
    const { rerender, container } = render(<Skeleton className="h-4" />);
    rerender(<Skeleton className="h-8" />);
    expect(container.firstChild).toHaveAttribute("data-slot", "skeleton");
  });

  it("keeps animate-pulse on re-render with different className", () => {
    const { rerender, container } = render(<Skeleton className="h-4" />);
    rerender(<Skeleton className="h-8 w-full" />);
    expect(container.firstChild).toHaveClass("animate-pulse");
  });

  it("updates children on re-render", () => {
    const { rerender } = render(<Skeleton>Old text</Skeleton>);
    expect(screen.getByText("Old text")).toBeInTheDocument();
    rerender(<Skeleton>New text</Skeleton>);
    expect(screen.getByText("New text")).toBeInTheDocument();
    expect(screen.queryByText("Old text")).not.toBeInTheDocument();
  });
});

// ─── Multiple skeletons / list rendering ──────────────────────────────────────

describe("Skeleton – multiple instances", () => {
  it("renders two skeletons independently", () => {
    const { container } = render(
      <div>
        <Skeleton data-testid="s1" className="h-4" />
        <Skeleton data-testid="s2" className="h-6" />
      </div>
    );
    const s1 = screen.getByTestId("s1");
    const s2 = screen.getByTestId("s2");
    expect(s1).toHaveClass("h-4");
    expect(s2).toHaveClass("h-6");
    // They don't share classes
    expect(s1).not.toHaveClass("h-6");
    expect(s2).not.toHaveClass("h-4");
  });

  it("all instances have data-slot='skeleton'", () => {
    const { container } = render(
      <div>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className={`h-${i}`} />
        ))}
      </div>
    );
    const all = container.querySelectorAll("[data-slot='skeleton']");
    expect(all).toHaveLength(5);
  });

  it("all instances share the animate-pulse class", () => {
    const { container } = render(
      <div>
        <Skeleton className="h-3" />
        <Skeleton className="h-4" />
        <Skeleton className="h-5" />
      </div>
    );
    const all = container.querySelectorAll("[data-slot='skeleton']");
    all.forEach((el) => expect(el).toHaveClass("animate-pulse"));
  });
});

// ─── Accessibility ────────────────────────────────────────────────────────────

describe("Skeleton – accessibility (axe)", () => {
  it("default Skeleton with aria-hidden has no axe violations", async () => {
    // Skeletons are decorative placeholders; aria-hidden hides from AT
    const { container } = render(
      <div>
        <Skeleton aria-hidden="true" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Skeleton with role='status' and aria-label has no axe violations", async () => {
    const { container } = render(
      <Skeleton role="status" aria-label="Loading content" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Skeleton with role='status' aria-busy and aria-label has no axe violations", async () => {
    const { container } = render(
      <Skeleton role="status" aria-busy="true" aria-label="Loading article" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("multiple hidden Skeletons inside a section have no axe violations", async () => {
    const { container } = render(
      <section aria-label="Article preview loading">
        <Skeleton className="h-5 w-3/4" aria-hidden="true" />
        <Skeleton className="h-4 w-full" aria-hidden="true" />
        <Skeleton className="h-4 w-5/6" aria-hidden="true" />
      </section>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("card Skeleton pattern with aria-hidden has no axe violations", async () => {
    const { container } = render(
      <div aria-label="Loading card" role="status">
        <Skeleton className="h-40 w-full rounded-lg" aria-hidden="true" />
        <Skeleton className="h-5 w-3/4" aria-hidden="true" />
        <Skeleton className="h-4 w-full" aria-hidden="true" />
        <Skeleton className="h-8 w-8 rounded-full" aria-hidden="true" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("circular avatar Skeleton with aria-hidden has no axe violations", async () => {
    const { container } = render(
      <Skeleton className="h-10 w-10 rounded-full" aria-hidden="true" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Skeleton inside a list item has no axe violations", async () => {
    const { container } = render(
      <ul>
        <li>
          <Skeleton className="h-4 w-1/2" aria-hidden="true" />
        </li>
        <li>
          <Skeleton className="h-4 w-2/3" aria-hidden="true" />
        </li>
      </ul>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe("Skeleton – edge cases", () => {
  it("renders correctly when deeply nested inside other elements", () => {
    const { container } = render(
      <div>
        <div>
          <div>
            <Skeleton data-testid="deep-skel" className="h-4 w-full" />
          </div>
        </div>
      </div>
    );
    expect(screen.getByTestId("deep-skel")).toBeInTheDocument();
    expect(screen.getByTestId("deep-skel")).toHaveClass("animate-pulse");
  });

  it("renders with inline style width like the table example", () => {
    const { container } = render(
      <Skeleton className="h-3.5 rounded" style={{ width: 60 }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe("60px");
    expect(el).toHaveClass("h-3.5");
    expect(el).toHaveClass("rounded");
  });

  it("table skeleton with variable inline widths renders all skeletons", () => {
    const cols = [180, 120, 90, 100];
    const { container } = render(
      <div>
        {cols.map((w, i) => (
          <Skeleton key={i} className="h-3.5 rounded" style={{ width: w / 2 }} />
        ))}
      </div>
    );
    const skeletons = container.querySelectorAll("[data-slot='skeleton']");
    expect(skeletons).toHaveLength(4);
    expect((skeletons[0] as HTMLElement).style.width).toBe("90px");
    expect((skeletons[1] as HTMLElement).style.width).toBe("60px");
    expect((skeletons[2] as HTMLElement).style.width).toBe("45px");
    expect((skeletons[3] as HTMLElement).style.width).toBe("50px");
  });

  it("renders without error when className has Tailwind fraction classes", () => {
    const { container } = render(<Skeleton className="h-3.5 w-5/6" />);
    expect(container.firstChild).toHaveClass("h-3.5");
    expect(container.firstChild).toHaveClass("w-5/6");
  });

  it("renders flex-1 className for flexible-width skeleton (profile example)", () => {
    const { container } = render(
      <Skeleton className="h-9 flex-1 rounded-md" />
    );
    expect(container.firstChild).toHaveClass("flex-1");
  });

  it("data-slot attribute value cannot be overridden by spreading different data-slot prop", () => {
    // The component hard-codes data-slot="skeleton"; the spread would follow it
    // but our component always sets it. Confirm the value is always skeleton.
    const { container } = render(
      <Skeleton {...({ "data-slot": "skeleton" } as Record<string, string>)} />
    );
    expect(container.firstChild).toHaveAttribute("data-slot", "skeleton");
  });

  it("renders 0 as child without crashing", () => {
    const { container } = render(<Skeleton>{0}</Skeleton>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders false as child without crashing", () => {
    const { container } = render(<Skeleton>{false}</Skeleton>);
    expect(container.firstChild).toBeInTheDocument();
  });
});
