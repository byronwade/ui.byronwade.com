/**
 * Exhaustive tests for <Separator />
 *
 * Component source: components/ui/separator.tsx
 * Underlying primitive: @base-ui/react/separator
 *
 * API summary:
 *   - Renders a <div> element with role="separator"
 *   - Props: orientation ("horizontal" | "vertical", default "horizontal")
 *            + className (merged via cn())
 *            + render prop (polymorphic — Base UI pattern, NOT asChild/Radix)
 *            + all native div props
 *   - Base classes always present:
 *       shrink-0  bg-border
 *   - Orientation-gated classes (applied via data-* selectors):
 *       data-[orientation=horizontal]:h-px  data-[orientation=horizontal]:w-full
 *       data-[orientation=vertical]:w-px    data-[orientation=vertical]:self-stretch
 *   - data-slot="separator" attribute always set
 *   - aria-orientation reflects the orientation value
 *   - data-orientation reflects the orientation value
 */

import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Separator } from "@/components/ui/separator";

// ---------------------------------------------------------------------------
// 1. Renders without crashing — default usage
// ---------------------------------------------------------------------------

describe("Separator — default render", () => {
  it("renders without crashing", () => {
    const { container } = render(<Separator />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders a <div> element by default", () => {
    const { container } = render(<Separator />);
    expect((container.firstElementChild as HTMLElement).tagName).toBe("DIV");
  });

  it("renders with role='separator'", () => {
    render(<Separator />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("defaults to orientation='horizontal'", () => {
    const { container } = render(<Separator />);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("sets data-slot='separator' attribute", () => {
    const { container } = render(<Separator />);
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute(
      "data-slot",
      "separator"
    );
  });

  it("renders a single root element", () => {
    const { container } = render(<Separator />);
    expect(container.children).toHaveLength(1);
  });

  it("renders without any children (void-like)", () => {
    const { container } = render(<Separator />);
    const el = container.firstElementChild as HTMLElement;
    // The separator is presentational; it should not render visible text
    expect(el.textContent).toBe("");
  });
});

// ---------------------------------------------------------------------------
// 2. Base CSS classes — always present regardless of orientation
// ---------------------------------------------------------------------------

describe("Separator — base CSS classes", () => {
  it("has 'shrink-0' class", () => {
    const { container } = render(<Separator />);
    expect((container.firstElementChild as HTMLElement).className).toContain(
      "shrink-0"
    );
  });

  it("has 'bg-border' class", () => {
    const { container } = render(<Separator />);
    expect((container.firstElementChild as HTMLElement).className).toContain(
      "bg-border"
    );
  });

  it("vertical separator also has 'shrink-0'", () => {
    const { container } = render(<Separator orientation="vertical" />);
    expect((container.firstElementChild as HTMLElement).className).toContain(
      "shrink-0"
    );
  });

  it("vertical separator also has 'bg-border'", () => {
    const { container } = render(<Separator orientation="vertical" />);
    expect((container.firstElementChild as HTMLElement).className).toContain(
      "bg-border"
    );
  });
});

// ---------------------------------------------------------------------------
// 3. orientation prop — "horizontal" (default)
// ---------------------------------------------------------------------------

describe("Separator — orientation='horizontal'", () => {
  it("sets aria-orientation='horizontal'", () => {
    const { container } = render(<Separator orientation="horizontal" />);
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute(
      "aria-orientation",
      "horizontal"
    );
  });

  it("sets data-orientation='horizontal'", () => {
    const { container } = render(<Separator orientation="horizontal" />);
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute(
      "data-orientation",
      "horizontal"
    );
  });

  it("className includes horizontal-width class fragment", () => {
    const { container } = render(<Separator orientation="horizontal" />);
    const cls = (container.firstElementChild as HTMLElement).className;
    expect(cls).toContain("data-[orientation=horizontal]:w-full");
  });

  it("className includes horizontal-height class fragment", () => {
    const { container } = render(<Separator orientation="horizontal" />);
    const cls = (container.firstElementChild as HTMLElement).className;
    expect(cls).toContain("data-[orientation=horizontal]:h-px");
  });

  it("omitting orientation prop gives same aria-orientation as explicit 'horizontal'", () => {
    const { container: c1 } = render(<Separator />);
    const { container: c2 } = render(<Separator orientation="horizontal" />);
    expect(
      (c1.firstElementChild as HTMLElement).getAttribute("aria-orientation")
    ).toBe(
      (c2.firstElementChild as HTMLElement).getAttribute("aria-orientation")
    );
  });

  it("omitting orientation gives the same className as explicit 'horizontal'", () => {
    const { container: c1 } = render(<Separator />);
    const { container: c2 } = render(<Separator orientation="horizontal" />);
    expect((c1.firstElementChild as HTMLElement).className).toBe(
      (c2.firstElementChild as HTMLElement).className
    );
  });
});

// ---------------------------------------------------------------------------
// 4. orientation prop — "vertical"
// ---------------------------------------------------------------------------

describe("Separator — orientation='vertical'", () => {
  it("renders without crashing", () => {
    const { container } = render(<Separator orientation="vertical" />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("role is still 'separator'", () => {
    render(<Separator orientation="vertical" />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("sets aria-orientation='vertical'", () => {
    const { container } = render(<Separator orientation="vertical" />);
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute(
      "aria-orientation",
      "vertical"
    );
  });

  it("sets data-orientation='vertical'", () => {
    const { container } = render(<Separator orientation="vertical" />);
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute(
      "data-orientation",
      "vertical"
    );
  });

  it("className includes vertical-width class fragment", () => {
    const { container } = render(<Separator orientation="vertical" />);
    const cls = (container.firstElementChild as HTMLElement).className;
    expect(cls).toContain("data-[orientation=vertical]:w-px");
  });

  it("className includes vertical self-stretch class fragment", () => {
    const { container } = render(<Separator orientation="vertical" />);
    const cls = (container.firstElementChild as HTMLElement).className;
    expect(cls).toContain("data-[orientation=vertical]:self-stretch");
  });

  it("does NOT have data-orientation='horizontal' when orientation='vertical'", () => {
    const { container } = render(<Separator orientation="vertical" />);
    expect((container.firstElementChild as HTMLElement)).not.toHaveAttribute(
      "data-orientation",
      "horizontal"
    );
  });
});

// ---------------------------------------------------------------------------
// 5. data-orientation attribute (Base UI state injection)
// ---------------------------------------------------------------------------

describe("Separator — data-orientation attribute", () => {
  it("horizontal: data-orientation='horizontal'", () => {
    const { container } = render(<Separator />);
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute(
      "data-orientation",
      "horizontal"
    );
  });

  it("vertical: data-orientation='vertical'", () => {
    const { container } = render(<Separator orientation="vertical" />);
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute(
      "data-orientation",
      "vertical"
    );
  });
});

// ---------------------------------------------------------------------------
// 6. className prop — merging and custom styling
// ---------------------------------------------------------------------------

describe("Separator — className prop merging", () => {
  it("merges custom className alongside base classes", () => {
    const { container } = render(<Separator className="my-4" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("my-4");
    expect(el.className).toContain("bg-border"); // base still present
  });

  it("can add margin classes via className", () => {
    const { container } = render(<Separator className="mt-2 mb-2" />);
    const cls = (container.firstElementChild as HTMLElement).className;
    expect(cls).toContain("mt-2");
    expect(cls).toContain("mb-2");
  });

  it("can add a custom background color class", () => {
    const { container } = render(<Separator className="bg-primary" />);
    expect((container.firstElementChild as HTMLElement).className).toContain(
      "bg-primary"
    );
  });

  it("can add height override (thicker separator: h-0.5)", () => {
    const { container } = render(<Separator className="h-0.5" />);
    expect((container.firstElementChild as HTMLElement).className).toContain(
      "h-0.5"
    );
  });

  it("can add flex-1 class for use in label-separator pattern", () => {
    const { container } = render(<Separator className="flex-1" />);
    expect((container.firstElementChild as HTMLElement).className).toContain(
      "flex-1"
    );
  });

  it("can add mx-auto and width fraction for centered short variant", () => {
    const { container } = render(<Separator className="mx-auto w-1/2" />);
    const cls = (container.firstElementChild as HTMLElement).className;
    expect(cls).toContain("mx-auto");
    expect(cls).toContain("w-1/2");
  });

  it("renders with no className prop without error", () => {
    const { container } = render(<Separator />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("can accept destructive color class", () => {
    const { container } = render(<Separator className="bg-destructive" />);
    expect((container.firstElementChild as HTMLElement).className).toContain(
      "bg-destructive"
    );
  });

  it("can accept a gradient/dashed background via utility class", () => {
    const { container } = render(
      <Separator className="bg-transparent bg-[repeating-linear-gradient(90deg,red_0,red_6px,transparent_6px,transparent_12px)]" />
    );
    const cls = (container.firstElementChild as HTMLElement).className;
    expect(cls).toContain("bg-transparent");
  });
});

// ---------------------------------------------------------------------------
// 7. render prop — polymorphic rendering (Base UI pattern)
// ---------------------------------------------------------------------------

describe("Separator — render prop (polymorphic)", () => {
  it("renders as <hr> element when render={<hr />}", () => {
    const { container } = render(<Separator render={<hr />} />);
    expect(container.querySelector("hr")).not.toBeNull();
    expect(container.querySelector("div")).toBeNull();
  });

  it("rendered <hr> still receives base classes", () => {
    const { container } = render(<Separator render={<hr />} />);
    const el = container.querySelector("hr") as HTMLElement;
    expect(el.className).toContain("shrink-0");
    expect(el.className).toContain("bg-border");
  });

  it("rendered <hr> carries data-slot='separator'", () => {
    const { container } = render(<Separator render={<hr />} />);
    const el = container.querySelector("hr") as HTMLElement;
    expect(el).toHaveAttribute("data-slot", "separator");
  });

  it("rendered <hr> carries orientation classes", () => {
    const { container } = render(<Separator render={<hr />} orientation="horizontal" />);
    const el = container.querySelector("hr") as HTMLElement;
    expect(el.className).toContain("data-[orientation=horizontal]:h-px");
  });

  it("renders as <span> when render={<span />}", () => {
    const { container } = render(<Separator render={<span />} />);
    expect(container.querySelector("span")).not.toBeNull();
    expect(container.querySelector("div")).toBeNull();
  });

  it("span render preserves base classes", () => {
    const { container } = render(<Separator render={<span />} />);
    const el = container.querySelector("span") as HTMLElement;
    expect(el.className).toContain("bg-border");
  });
});

// ---------------------------------------------------------------------------
// 8. Native HTML attribute pass-through
// ---------------------------------------------------------------------------

describe("Separator — native attribute pass-through", () => {
  it("passes id attribute", () => {
    const { container } = render(<Separator id="my-sep" />);
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute(
      "id",
      "my-sep"
    );
  });

  it("passes data-testid attribute", () => {
    render(<Separator data-testid="sep-test" />);
    expect(screen.getByTestId("sep-test")).toBeInTheDocument();
  });

  it("passes aria-label attribute", () => {
    const { container } = render(<Separator aria-label="section divider" />);
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute(
      "aria-label",
      "section divider"
    );
  });

  it("passes style attribute", () => {
    const { container } = render(<Separator style={{ opacity: 0.5 }} />);
    expect((container.firstElementChild as HTMLElement)).toHaveStyle({
      opacity: "0.5",
    });
  });

  it("passes custom data-* attributes", () => {
    const { container } = render(<Separator data-custom="value" />);
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute(
      "data-custom",
      "value"
    );
  });

  it("passes tabIndex attribute", () => {
    const { container } = render(<Separator tabIndex={-1} />);
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute(
      "tabIndex",
      "-1"
    );
  });

  it("passes title attribute", () => {
    const { container } = render(<Separator title="divider" />);
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute(
      "title",
      "divider"
    );
  });
});

// ---------------------------------------------------------------------------
// 9. Usage patterns from examples
// ---------------------------------------------------------------------------

describe("Separator — usage in context (example patterns)", () => {
  it("renders between two text sections (default.tsx pattern)", () => {
    render(
      <div className="w-64 space-y-4 p-4">
        <p className="text-sm font-medium">Section A</p>
        <Separator />
        <p className="text-sm font-medium">Section B</p>
      </div>
    );
    expect(screen.getByText("Section A")).toBeInTheDocument();
    expect(screen.getByText("Section B")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("renders vertical separator between inline items (default.tsx pattern)", () => {
    render(
      <div className="flex h-8 items-center gap-4">
        <span>Left</span>
        <Separator orientation="vertical" />
        <span>Right</span>
      </div>
    );
    const sep = screen.getByRole("separator");
    expect(sep).toHaveAttribute("aria-orientation", "vertical");
  });

  it("renders multiple vertical separators in nav (vertical.tsx pattern)", () => {
    render(
      <div className="flex h-10 items-center gap-3 text-sm">
        <span>Overview</span>
        <Separator orientation="vertical" />
        <span>Analytics</span>
        <Separator orientation="vertical" />
        <span>Reports</span>
        <Separator orientation="vertical" />
        <span>Settings</span>
      </div>
    );
    const seps = screen.getAllByRole("separator");
    expect(seps).toHaveLength(3);
    seps.forEach((s) =>
      expect(s).toHaveAttribute("aria-orientation", "vertical")
    );
  });

  it("renders with flex-1 class between label spans (with-label.tsx pattern)", () => {
    const { container } = render(
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs font-medium text-muted-foreground">or</span>
        <Separator className="flex-1" />
      </div>
    );
    const seps = screen.getAllByRole("separator");
    expect(seps).toHaveLength(2);
    seps.forEach((s) =>
      expect((s as HTMLElement).className).toContain("flex-1")
    );
  });

  it("renders with my-4 margin inside a card (in-card.tsx pattern)", () => {
    const { container } = render(
      <div className="rounded-xl border bg-card p-5">
        <h3>Account Summary</h3>
        <Separator className="my-4" />
        <p>Content below divider</p>
      </div>
    );
    const sep = screen.getByRole("separator");
    expect((sep as HTMLElement).className).toContain("my-4");
  });

  it("renders with my-2 margin inside a nav menu (in-nav.tsx pattern)", () => {
    render(
      <div className="rounded-xl border bg-card p-2">
        <button>Dashboard</button>
        <Separator className="my-2" />
        <button>Sign out</button>
      </div>
    );
    const sep = screen.getByRole("separator");
    expect((sep as HTMLElement).className).toContain("my-2");
  });
});

// ---------------------------------------------------------------------------
// 10. Multiple separators rendered independently
// ---------------------------------------------------------------------------

describe("Separator — multiple instances", () => {
  it("renders two separators independently without interference", () => {
    render(
      <div>
        <Separator data-testid="sep-1" />
        <Separator data-testid="sep-2" orientation="vertical" />
      </div>
    );
    const sep1 = screen.getByTestId("sep-1");
    const sep2 = screen.getByTestId("sep-2");
    expect(sep1).toHaveAttribute("aria-orientation", "horizontal");
    expect(sep2).toHaveAttribute("aria-orientation", "vertical");
  });

  it("screen.getAllByRole finds all rendered separators", () => {
    render(
      <div>
        <Separator />
        <Separator />
        <Separator orientation="vertical" />
      </div>
    );
    expect(screen.getAllByRole("separator")).toHaveLength(3);
  });

  it("each has independent data-slot='separator'", () => {
    const { container } = render(
      <div>
        <Separator />
        <Separator orientation="vertical" />
      </div>
    );
    const seps = container.querySelectorAll('[data-slot="separator"]');
    expect(seps).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// 11. Re-render behavior
// ---------------------------------------------------------------------------

describe("Separator — re-render behavior", () => {
  it("updates aria-orientation when orientation changes h→v", () => {
    const { container, rerender } = render(<Separator orientation="horizontal" />);
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute(
      "aria-orientation",
      "horizontal"
    );
    rerender(<Separator orientation="vertical" />);
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute(
      "aria-orientation",
      "vertical"
    );
  });

  it("updates aria-orientation when orientation changes v→h", () => {
    const { container, rerender } = render(<Separator orientation="vertical" />);
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute(
      "aria-orientation",
      "vertical"
    );
    rerender(<Separator orientation="horizontal" />);
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute(
      "aria-orientation",
      "horizontal"
    );
  });

  it("updates className on re-render", () => {
    const { container, rerender } = render(<Separator className="old-class" />);
    expect((container.firstElementChild as HTMLElement).className).toContain(
      "old-class"
    );
    rerender(<Separator className="new-class" />);
    expect((container.firstElementChild as HTMLElement).className).toContain(
      "new-class"
    );
    expect((container.firstElementChild as HTMLElement).className).not.toContain(
      "old-class"
    );
  });

  it("data-orientation updates correctly on re-render", () => {
    const { container, rerender } = render(<Separator orientation="horizontal" />);
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute(
      "data-orientation",
      "horizontal"
    );
    rerender(<Separator orientation="vertical" />);
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute(
      "data-orientation",
      "vertical"
    );
  });
});

// ---------------------------------------------------------------------------
// 12. Ref forwarding
// ---------------------------------------------------------------------------

describe("Separator — ref forwarding", () => {
  it("forwards ref to the underlying DOM element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Separator ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("DIV");
  });

  it("ref has correct role attribute", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Separator ref={ref} />);
    expect(ref.current?.getAttribute("role")).toBe("separator");
  });

  it("ref.current points to the element with data-slot='separator'", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Separator ref={ref} />);
    expect(ref.current?.getAttribute("data-slot")).toBe("separator");
  });
});

// ---------------------------------------------------------------------------
// 13. Interaction — no interactive behavior but keyboard-accessible context
// ---------------------------------------------------------------------------

describe("Separator — interaction (non-interactive but reachable via tabIndex)", () => {
  it("is not focusable by default (no tabIndex)", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button>Before</button>
        <Separator />
        <button>After</button>
      </div>
    );
    await user.tab();
    expect(screen.getByRole("button", { name: "Before" })).toHaveFocus();
    await user.tab();
    // Focus should skip the separator and land on After
    expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
  });

  it("can receive focus when tabIndex={0}", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button>Before</button>
        <Separator tabIndex={0} data-testid="sep-focusable" />
        <button>After</button>
      </div>
    );
    await user.tab();
    expect(screen.getByRole("button", { name: "Before" })).toHaveFocus();
    await user.tab();
    expect(screen.getByTestId("sep-focusable")).toHaveFocus();
  });
});

// ---------------------------------------------------------------------------
// 14. Edge cases
// ---------------------------------------------------------------------------

describe("Separator — edge cases", () => {
  it("renders with extra whitespace className gracefully", () => {
    const { container } = render(<Separator className="  my-4  " />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders with empty string className without crashing", () => {
    const { container } = render(<Separator className="" />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders inside a flex container (common pattern) without crashing", () => {
    const { container } = render(
      <div className="flex items-center">
        <Separator orientation="vertical" className="flex-1" />
      </div>
    );
    expect(container.firstElementChild?.firstElementChild).toBeInTheDocument();
  });

  it("renders inside an article element without crashing", () => {
    render(
      <article>
        <h2>Title</h2>
        <Separator />
        <p>Content</p>
      </article>
    );
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("renders inside a nav element without crashing", () => {
    render(
      <nav>
        <a href="#">Home</a>
        <Separator orientation="vertical" />
        <a href="#">About</a>
      </nav>
    );
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("renders inside a card div without crashing", () => {
    render(
      <div className="rounded-xl border p-4">
        <p>Header content</p>
        <Separator className="my-4" />
        <p>Body content</p>
      </div>
    );
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 15. Accessibility — axe violations
// ---------------------------------------------------------------------------

describe("Separator — accessibility (axe)", () => {
  it("has no axe violations with default (horizontal) orientation", async () => {
    const { container } = render(<Separator />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with orientation='horizontal' explicit", async () => {
    const { container } = render(<Separator orientation="horizontal" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with orientation='vertical'", async () => {
    const { container } = render(<Separator orientation="vertical" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with aria-label", async () => {
    const { container } = render(
      <Separator aria-label="section divider" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations when used between text sections", async () => {
    const { container } = render(
      <div>
        <p>Section A</p>
        <Separator />
        <p>Section B</p>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations in a nav context (vertical)", async () => {
    const { container } = render(
      <nav aria-label="breadcrumb">
        <span>Home</span>
        <Separator orientation="vertical" aria-hidden="true" />
        <span>Products</span>
        <Separator orientation="vertical" aria-hidden="true" />
        <span>Detail</span>
      </nav>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with aria-hidden='true' (presentational use)", async () => {
    const { container } = render(
      <div>
        <p>Above</p>
        <Separator aria-hidden="true" />
        <p>Below</p>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with custom className (bg-primary)", async () => {
    const { container } = render(<Separator className="bg-primary" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations inside a card-like structure (in-card pattern)", async () => {
    const { container } = render(
      <div role="region" aria-label="account summary">
        <h3>Account Summary</h3>
        <Separator className="my-4" />
        <p>API Requests: 12,450</p>
        <Separator className="my-4" />
        <p>Estimated total: $24.00</p>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with render as <hr>", async () => {
    const { container } = render(<Separator render={<hr />} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// 16. DOM structure introspection
// ---------------------------------------------------------------------------

describe("Separator — DOM structure", () => {
  it("has role='separator' on the root element", () => {
    const { container } = render(<Separator />);
    expect((container.firstElementChild as HTMLElement).getAttribute("role")).toBe(
      "separator"
    );
  });

  it("horizontal: does NOT have aria-orientation='vertical'", () => {
    const { container } = render(<Separator />);
    expect((container.firstElementChild as HTMLElement)).not.toHaveAttribute(
      "aria-orientation",
      "vertical"
    );
  });

  it("vertical: does NOT have aria-orientation='horizontal'", () => {
    const { container } = render(<Separator orientation="vertical" />);
    expect((container.firstElementChild as HTMLElement)).not.toHaveAttribute(
      "aria-orientation",
      "horizontal"
    );
  });

  it("has no visible text content by default", () => {
    const { container } = render(<Separator />);
    expect((container.firstElementChild as HTMLElement).textContent).toBe("");
  });

  it("className contains both orientation-gated fragments for horizontal", () => {
    const { container } = render(<Separator />);
    const cls = (container.firstElementChild as HTMLElement).className;
    expect(cls).toContain("data-[orientation=horizontal]:h-px");
    expect(cls).toContain("data-[orientation=horizontal]:w-full");
  });

  it("className contains both orientation-gated fragments for vertical", () => {
    const { container } = render(<Separator orientation="vertical" />);
    const cls = (container.firstElementChild as HTMLElement).className;
    expect(cls).toContain("data-[orientation=vertical]:w-px");
    expect(cls).toContain("data-[orientation=vertical]:self-stretch");
  });
});
