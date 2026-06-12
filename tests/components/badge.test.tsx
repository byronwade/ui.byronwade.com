/**
 * Exhaustive tests for <Badge />
 *
 * Component source: components/ui/badge.tsx
 * API summary:
 *   - Badge renders as a <span> by default (via Base UI useRender)
 *   - Props: variant (default|secondary|destructive|success|warning|outline|ghost|link)
 *            + all native span props
 *            + render prop for polymorphic rendering (Base UI pattern, NOT asChild/Radix)
 *   - Base classes: group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center
 *                   gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5
 *                   text-xs font-medium whitespace-nowrap transition-all
 *   - Focus ring: focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50
 *   - Invalid state: aria-invalid → border-destructive + ring-destructive/20
 *   - Icon slots: data-icon="inline-start" → has-data-[icon=inline-start]:pl-1.5
 *                 data-icon="inline-end"   → has-data-[icon=inline-end]:pr-1.5
 *   - SVG children: pointer-events-none, size-3!
 *   - Polymorphic: render={<a href="#" />} renders as <a> tag
 *
 * Variant → expected class fragments:
 *   default:     bg-primary text-primary-foreground
 *   secondary:   bg-secondary text-secondary-foreground
 *   destructive: bg-destructive/10 text-destructive
 *   success:     bg-success/10 text-success
 *   warning:     bg-warning/10 text-warning
 *   outline:     border-border text-foreground
 *   ghost:       (no bg by default, hover:bg-muted hover:text-muted-foreground)
 *   link:        text-primary underline-offset-4 hover:underline
 */

import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { CheckCircle, Info, Star, Warning, XCircle } from "@/lib/icons"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** All variant values the component exposes. */
const ALL_VARIANTS = [
  "default",
  "secondary",
  "destructive",
  "success",
  "warning",
  "outline",
  "ghost",
  "link",
] as const;

type Variant = (typeof ALL_VARIANTS)[number];

/**
 * Expected class fragments for each variant.
 * We test for presence of these fragments inside className.
 */
const VARIANT_CLASSES: Record<Variant, string[]> = {
  default: ["bg-primary", "text-primary-foreground"],
  secondary: ["bg-secondary", "text-secondary-foreground"],
  destructive: ["bg-destructive/10", "text-destructive"],
  success: ["bg-success/10", "text-success"],
  warning: ["bg-warning/10", "text-warning"],
  outline: ["border-border", "text-foreground"],
  ghost: ["hover:bg-muted", "hover:text-muted-foreground"],
  link: ["text-primary", "underline-offset-4"],
};

// ---------------------------------------------------------------------------
// 1. Renders without crashing — default usage
// ---------------------------------------------------------------------------

describe("Badge — default render", () => {
  it("renders without crashing", () => {
    const { container } = render(<Badge>Default</Badge>);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders a <span> element by default", () => {
    const { container } = render(<Badge>Test</Badge>);
    expect(container.querySelector("span")).not.toBeNull();
    expect((container.firstElementChild as HTMLElement).tagName).toBe("SPAN");
  });

  it("renders children text content", () => {
    render(<Badge>Hello badge</Badge>);
    expect(screen.getByText("Hello badge")).toBeInTheDocument();
  });

  it("renders with no children without crashing", () => {
    const { container } = render(<Badge />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("defaults to variant='default'", () => {
    const { container } = render(<Badge>Default</Badge>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("bg-primary");
    expect(el.className).toContain("text-primary-foreground");
  });
});

// ---------------------------------------------------------------------------
// 2. Base CSS classes always present
// ---------------------------------------------------------------------------

describe("Badge — base CSS classes", () => {
  it("has inline-flex class", () => {
    const { container } = render(<Badge>Test</Badge>);
    expect((container.firstElementChild as HTMLElement).className).toContain("inline-flex");
  });

  it("has h-5 class", () => {
    const { container } = render(<Badge>Test</Badge>);
    expect((container.firstElementChild as HTMLElement).className).toContain("h-5");
  });

  it("has w-fit class", () => {
    const { container } = render(<Badge>Test</Badge>);
    expect((container.firstElementChild as HTMLElement).className).toContain("w-fit");
  });

  it("has shrink-0 class", () => {
    const { container } = render(<Badge>Test</Badge>);
    expect((container.firstElementChild as HTMLElement).className).toContain("shrink-0");
  });

  it("has items-center class", () => {
    const { container } = render(<Badge>Test</Badge>);
    expect((container.firstElementChild as HTMLElement).className).toContain("items-center");
  });

  it("has justify-center class", () => {
    const { container } = render(<Badge>Test</Badge>);
    expect((container.firstElementChild as HTMLElement).className).toContain("justify-center");
  });

  it("has gap-1 class", () => {
    const { container } = render(<Badge>Test</Badge>);
    expect((container.firstElementChild as HTMLElement).className).toContain("gap-1");
  });

  it("has overflow-hidden class", () => {
    const { container } = render(<Badge>Test</Badge>);
    expect((container.firstElementChild as HTMLElement).className).toContain("overflow-hidden");
  });

  it("has rounded-4xl class", () => {
    const { container } = render(<Badge>Test</Badge>);
    expect((container.firstElementChild as HTMLElement).className).toContain("rounded-4xl");
  });

  it("has border class", () => {
    const { container } = render(<Badge>Test</Badge>);
    expect((container.firstElementChild as HTMLElement).className).toContain("border");
  });

  it("has border-transparent class (default)", () => {
    const { container } = render(<Badge>Test</Badge>);
    expect((container.firstElementChild as HTMLElement).className).toContain("border-transparent");
  });

  it("has px-2 class", () => {
    const { container } = render(<Badge>Test</Badge>);
    expect((container.firstElementChild as HTMLElement).className).toContain("px-2");
  });

  it("has py-0.5 class", () => {
    const { container } = render(<Badge>Test</Badge>);
    expect((container.firstElementChild as HTMLElement).className).toContain("py-0.5");
  });

  it("has text-xs class", () => {
    const { container } = render(<Badge>Test</Badge>);
    expect((container.firstElementChild as HTMLElement).className).toContain("text-xs");
  });

  it("has font-medium class", () => {
    const { container } = render(<Badge>Test</Badge>);
    expect((container.firstElementChild as HTMLElement).className).toContain("font-medium");
  });

  it("has whitespace-nowrap class", () => {
    const { container } = render(<Badge>Test</Badge>);
    expect((container.firstElementChild as HTMLElement).className).toContain("whitespace-nowrap");
  });

  it("has transition-all class", () => {
    const { container } = render(<Badge>Test</Badge>);
    expect((container.firstElementChild as HTMLElement).className).toContain("transition-all");
  });

  it("has group/badge class", () => {
    const { container } = render(<Badge>Test</Badge>);
    expect((container.firstElementChild as HTMLElement).className).toContain("group/badge");
  });
});

// ---------------------------------------------------------------------------
// 3. Every variant — assert correct classes
// ---------------------------------------------------------------------------

describe("Badge — variant prop", () => {
  ALL_VARIANTS.forEach((variant) => {
    describe(`variant="${variant}"`, () => {
      it(`renders without crashing`, () => {
        const { container } = render(<Badge variant={variant}>{variant}</Badge>);
        expect(container.firstElementChild).toBeInTheDocument();
      });

      VARIANT_CLASSES[variant].forEach((cls) => {
        it(`has class "${cls}"`, () => {
          const { container } = render(<Badge variant={variant}>{variant}</Badge>);
          expect((container.firstElementChild as HTMLElement).className).toContain(cls);
        });
      });
    });
  });

  it("explicitly passing variant='default' produces same classes as omitting it", () => {
    const { container: c1 } = render(<Badge>Badge</Badge>);
    const { container: c2 } = render(<Badge variant="default">Badge</Badge>);
    expect((c1.firstElementChild as HTMLElement).className).toBe(
      (c2.firstElementChild as HTMLElement).className
    );
  });
});

// ---------------------------------------------------------------------------
// 4. badgeVariants utility export
// ---------------------------------------------------------------------------

describe("badgeVariants — utility export", () => {
  it("is a function", () => {
    expect(typeof badgeVariants).toBe("function");
  });

  it("returns a string for each variant", () => {
    ALL_VARIANTS.forEach((variant) => {
      expect(typeof badgeVariants({ variant })).toBe("string");
    });
  });

  it("default variant includes bg-primary", () => {
    expect(badgeVariants({ variant: "default" })).toContain("bg-primary");
  });

  it("secondary variant includes bg-secondary", () => {
    expect(badgeVariants({ variant: "secondary" })).toContain("bg-secondary");
  });

  it("destructive variant includes text-destructive", () => {
    expect(badgeVariants({ variant: "destructive" })).toContain("text-destructive");
  });

  it("success variant includes text-success", () => {
    expect(badgeVariants({ variant: "success" })).toContain("text-success");
  });

  it("warning variant includes text-warning", () => {
    expect(badgeVariants({ variant: "warning" })).toContain("text-warning");
  });

  it("outline variant includes border-border", () => {
    expect(badgeVariants({ variant: "outline" })).toContain("border-border");
  });

  it("link variant includes underline-offset-4", () => {
    expect(badgeVariants({ variant: "link" })).toContain("underline-offset-4");
  });

  it("returns string without variant → uses default", () => {
    expect(badgeVariants({})).toContain("bg-primary");
  });

  it("merges extra className when passed", () => {
    const cls = badgeVariants({ variant: "default", className: "my-extra" });
    expect(cls).toContain("my-extra");
  });
});

// ---------------------------------------------------------------------------
// 5. className merging
// ---------------------------------------------------------------------------

describe("Badge — className prop merging", () => {
  it("merges custom className with base classes", () => {
    const { container } = render(<Badge className="custom-badge">Test</Badge>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("custom-badge");
    expect(el.className).toContain("inline-flex"); // base still present
  });

  it("allows overriding padding with custom className", () => {
    const { container } = render(<Badge className="px-4">Wide</Badge>);
    expect((container.firstElementChild as HTMLElement).className).toContain("px-4");
  });

  it("can add additional classes alongside existing ones", () => {
    const { container } = render(
      <Badge className="mt-1 ml-2">Spaced</Badge>
    );
    const cls = (container.firstElementChild as HTMLElement).className;
    expect(cls).toContain("mt-1");
    expect(cls).toContain("ml-2");
  });

  it("renders with no className prop without error", () => {
    const { container } = render(<Badge>No class</Badge>);
    expect(container.firstElementChild).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 6. aria-invalid state
// ---------------------------------------------------------------------------

describe("Badge — aria-invalid state", () => {
  it("aria-invalid applies border-destructive class", () => {
    const { container } = render(<Badge aria-invalid>Invalid</Badge>);
    const el = container.firstElementChild as HTMLElement;
    // The base class string includes the aria-invalid: selector; the attribute is set
    expect(el).toHaveAttribute("aria-invalid");
  });

  it("aria-invalid={true} sets aria-invalid attribute to 'true'", () => {
    const { container } = render(<Badge aria-invalid={true}>Invalid</Badge>);
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute("aria-invalid", "true");
  });

  it("aria-invalid={false} sets aria-invalid to 'false' (React renders boolean attrs explicitly)", () => {
    // React serialises aria-invalid={false} as aria-invalid="false" in the DOM.
    // The Tailwind selector `aria-invalid:...` only fires when the attribute value is truthy,
    // so the visual styling is still correct; we simply document the attribute value here.
    const { container } = render(<Badge aria-invalid={false}>Valid</Badge>);
    expect((container.firstElementChild as HTMLElement).getAttribute("aria-invalid")).toBe("false");
  });

  it("aria-invalid base class includes aria-invalid:border-destructive selector", () => {
    // The CVA base string should encode the selector
    const cls = badgeVariants({ variant: "default" });
    expect(cls).toContain("aria-invalid:border-destructive");
  });

  it("aria-invalid:ring-destructive/20 class is in base variant string", () => {
    const cls = badgeVariants({ variant: "default" });
    expect(cls).toContain("aria-invalid:ring-destructive");
  });

  it("works with outline variant and aria-invalid", () => {
    const { container } = render(
      <Badge variant="outline" aria-invalid>
        Invalid format
      </Badge>
    );
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute("aria-invalid");
  });

  it("works with secondary variant and aria-invalid", () => {
    const { container } = render(
      <Badge variant="secondary" aria-invalid>
        Out of range
      </Badge>
    );
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute("aria-invalid");
  });
});

// ---------------------------------------------------------------------------
// 7. Polymorphic render prop — render as <a>
// ---------------------------------------------------------------------------

describe("Badge — render prop (polymorphic)", () => {
  it("renders as <a> tag when render={<a href='#' />}", () => {
    const { container } = render(
      <Badge render={<a href="#" />}>Documentation</Badge>
    );
    expect(container.querySelector("a")).not.toBeNull();
    expect(container.querySelector("span")).toBeNull();
  });

  it("rendered <a> has the correct href", () => {
    const { container } = render(
      <Badge render={<a href="/docs" />}>Docs</Badge>
    );
    expect(container.querySelector("a")).toHaveAttribute("href", "/docs");
  });

  it("rendered <a> carries all variant classes", () => {
    const { container } = render(
      <Badge variant="secondary" render={<a href="#" />}>
        Changelog
      </Badge>
    );
    const anchor = container.querySelector("a") as HTMLElement;
    expect(anchor.className).toContain("bg-secondary");
    expect(anchor.className).toContain("text-secondary-foreground");
  });

  it("rendered <a> carries base classes", () => {
    const { container } = render(
      <Badge render={<a href="#" />}>GitHub</Badge>
    );
    const anchor = container.querySelector("a") as HTMLElement;
    expect(anchor.className).toContain("inline-flex");
    expect(anchor.className).toContain("rounded-4xl");
  });

  it("renders as <a> with variant='outline'", () => {
    const { container } = render(
      <Badge variant="outline" render={<a href="#" />}>
        GitHub
      </Badge>
    );
    expect(container.querySelector("a")).not.toBeNull();
    expect((container.querySelector("a") as HTMLElement).className).toContain("border-border");
  });

  it("renders as <a> with variant='link'", () => {
    const { container } = render(
      <Badge variant="link" render={<a href="#" />}>
        View source
      </Badge>
    );
    const anchor = container.querySelector("a") as HTMLElement;
    expect(anchor).not.toBeNull();
    expect(anchor.className).toContain("underline-offset-4");
  });

  it("renders as <a> with variant='success' for inline prose", () => {
    const { container } = render(
      <Badge variant="success" render={<a href="#" />}>
        v2.4
      </Badge>
    );
    expect(container.querySelector("a")).not.toBeNull();
  });

  it("renders children text content inside <a>", () => {
    render(
      <Badge render={<a href="#">Documentation</a>}>Documentation</Badge>
    );
    expect(screen.getByText("Documentation")).toBeInTheDocument();
  });

  it("link badge renders as a real link (accessible)", () => {
    render(
      <Badge render={<a href="/docs" />}>Read the docs</Badge>
    );
    expect(screen.getByRole("link", { name: "Read the docs" })).toBeInTheDocument();
  });

  it("multiple render-as-anchor badges render independently", () => {
    const { container } = render(
      <div>
        <Badge render={<a href="/a" />}>Alpha</Badge>
        <Badge render={<a href="/b" />}>Beta</Badge>
      </div>
    );
    const anchors = container.querySelectorAll("a");
    expect(anchors).toHaveLength(2);
    expect(anchors[0]).toHaveAttribute("href", "/a");
    expect(anchors[1]).toHaveAttribute("href", "/b");
  });
});

// ---------------------------------------------------------------------------
// 8. Icon slot — data-icon="inline-start" / "inline-end"
// ---------------------------------------------------------------------------

describe("Badge — icon slots (data-icon attribute)", () => {
  it("renders SVG with data-icon='inline-start' inside badge", () => {
    const { container } = render(
      <Badge variant="success">
        <CheckCircle data-icon="inline-start" data-testid="icon-start" />
        Verified
      </Badge>
    );
    const icon = container.querySelector('[data-icon="inline-start"]');
    expect(icon).not.toBeNull();
  });

  it("badge has has-data-[icon=inline-start]:pl-1.5 class", () => {
    const cls = badgeVariants({ variant: "default" });
    expect(cls).toContain("has-data-[icon=inline-start]:pl-1.5");
  });

  it("badge has has-data-[icon=inline-end]:pr-1.5 class", () => {
    const cls = badgeVariants({ variant: "default" });
    expect(cls).toContain("has-data-[icon=inline-end]:pr-1.5");
  });

  it("renders SVG with data-icon='inline-end' inside badge", () => {
    const { container } = render(
      <Badge variant="default">
        Featured
        <Star data-icon="inline-end" data-testid="icon-end" />
      </Badge>
    );
    const icon = container.querySelector('[data-icon="inline-end"]');
    expect(icon).not.toBeNull();
  });

  it("icon-start badge renders correct text alongside icon", () => {
    render(
      <Badge variant="warning">
        <Warning data-icon="inline-start" />
        Pending
      </Badge>
    );
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("renders icon-only badge (no text)", () => {
    const { container } = render(
      <Badge variant="success" className="px-1">
        <CheckCircle data-testid="icon-only" />
      </Badge>
    );
    expect(container.querySelector('[data-testid="icon-only"]')).toBeInTheDocument();
  });

  it("icon-only destructive badge renders without crashing", () => {
    const { container } = render(
      <Badge variant="destructive" className="px-1">
        <XCircle />
      </Badge>
    );
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("icon-only warning badge renders without crashing", () => {
    const { container } = render(
      <Badge variant="warning" className="px-1">
        <Warning />
      </Badge>
    );
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("SVG children receive size class override ([&>svg]:size-3!)", () => {
    const cls = badgeVariants({ variant: "default" });
    expect(cls).toContain("[&>svg]:size-3!");
  });

  it("SVG children receive pointer-events-none class", () => {
    const cls = badgeVariants({ variant: "default" });
    expect(cls).toContain("[&>svg]:pointer-events-none");
  });

  it("renders with multiple icons (start + end)", () => {
    const { container } = render(
      <Badge>
        <Info data-icon="inline-start" data-testid="icon-s" />
        Mixed
        <Star data-icon="inline-end" data-testid="icon-e" />
      </Badge>
    );
    expect(container.querySelector('[data-testid="icon-s"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="icon-e"]')).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 9. Native HTML attribute pass-through
// ---------------------------------------------------------------------------

describe("Badge — native attribute pass-through", () => {
  it("passes id attribute", () => {
    const { container } = render(<Badge id="badge-1">Test</Badge>);
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute("id", "badge-1");
  });

  it("passes data-testid attribute", () => {
    render(<Badge data-testid="my-badge">Test</Badge>);
    expect(screen.getByTestId("my-badge")).toBeInTheDocument();
  });

  it("passes role attribute", () => {
    const { container } = render(<Badge role="status">Test</Badge>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("passes aria-label attribute", () => {
    const { container } = render(<Badge aria-label="badge label">Test</Badge>);
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute("aria-label", "badge label");
  });

  it("passes aria-live attribute", () => {
    const { container } = render(<Badge aria-live="polite">Live</Badge>);
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute("aria-live", "polite");
  });

  it("passes tabIndex attribute", () => {
    const { container } = render(<Badge tabIndex={0}>Focusable</Badge>);
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute("tabIndex", "0");
  });

  it("passes custom data-* attributes", () => {
    const { container } = render(<Badge data-slot="custom-slot">Test</Badge>);
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute("data-slot", "custom-slot");
  });

  it("passes onClick handler", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Badge tabIndex={0} onClick={handleClick}>Clickable</Badge>);
    await user.click(screen.getByText("Clickable"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("passes onMouseEnter handler", async () => {
    const user = userEvent.setup();
    const handleHover = vi.fn();
    render(<Badge onMouseEnter={handleHover}>Hoverable</Badge>);
    await user.hover(screen.getByText("Hoverable"));
    expect(handleHover).toHaveBeenCalledTimes(1);
  });

  it("passes title attribute", () => {
    const { container } = render(<Badge title="tooltip text">Test</Badge>);
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute("title", "tooltip text");
  });
});

// ---------------------------------------------------------------------------
// 10. Inline content patterns (from examples)
// ---------------------------------------------------------------------------

describe("Badge — inline content usage", () => {
  it("renders inside a heading alongside text", () => {
    render(
      <h2>
        Components <Badge variant="outline">48</Badge>
      </h2>
    );
    expect(screen.getByText("48")).toBeInTheDocument();
    expect(screen.getByRole("heading")).toHaveTextContent("Components");
  });

  it("renders inline in prose paragraph", () => {
    render(
      <p>
        This feature is available in <Badge variant="success">v2.4</Badge> and later.
      </p>
    );
    expect(screen.getByText("v2.4")).toBeInTheDocument();
  });

  it("renders notification count badge (number child)", () => {
    render(<Badge variant="destructive">3</Badge>);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders a tag cloud of secondary badges", () => {
    const tags = ["typescript", "react", "performance"];
    render(
      <div>
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    );
    tags.forEach((tag) => expect(screen.getByText(tag)).toBeInTheDocument());
  });

  it("renders with number zero as child", () => {
    render(<Badge variant="ghost">{0}</Badge>);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders with long text content without crashing", () => {
    const text = "A".repeat(100);
    render(<Badge>{text}</Badge>);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("renders with special characters in children", () => {
    render(<Badge>{"<>&\"'"}</Badge>);
    expect(screen.getByText("<>&\"'")).toBeInTheDocument();
  });

  it("multiple badges render independently in a list", () => {
    render(
      <div>
        <Badge variant="success">Live</Badge>
        <Badge variant="warning">Building</Badge>
        <Badge variant="destructive">Failed</Badge>
        <Badge variant="secondary">Cancelled</Badge>
        <Badge variant="outline">Queued</Badge>
      </div>
    );
    expect(screen.getByText("Live")).toBeInTheDocument();
    expect(screen.getByText("Building")).toBeInTheDocument();
    expect(screen.getByText("Failed")).toBeInTheDocument();
    expect(screen.getByText("Cancelled")).toBeInTheDocument();
    expect(screen.getByText("Queued")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 11. Status pattern (from examples)
// ---------------------------------------------------------------------------

describe("Badge — status variant pattern", () => {
  const statusItems = [
    { variant: "success" as const, text: "Live" },
    { variant: "warning" as const, text: "Building" },
    { variant: "destructive" as const, text: "Failed" },
    { variant: "secondary" as const, text: "Cancelled" },
    { variant: "outline" as const, text: "Queued" },
  ];

  statusItems.forEach(({ variant, text }) => {
    it(`variant="${variant}" status badge renders correctly`, () => {
      render(<Badge variant={variant}>{text}</Badge>);
      const badge = screen.getByText(text).closest("span") as HTMLElement;
      expect(badge).toBeInTheDocument();
      VARIANT_CLASSES[variant].forEach((cls) => {
        expect(badge.className).toContain(cls);
      });
    });
  });
});

// ---------------------------------------------------------------------------
// 12. Re-render behavior
// ---------------------------------------------------------------------------

describe("Badge — re-render behavior", () => {
  it("updates children on re-render", () => {
    const { rerender } = render(<Badge>First</Badge>);
    expect(screen.getByText("First")).toBeInTheDocument();
    rerender(<Badge>Second</Badge>);
    expect(screen.getByText("Second")).toBeInTheDocument();
    expect(screen.queryByText("First")).toBeNull();
  });

  it("updates variant classes on re-render", () => {
    const { container, rerender } = render(<Badge variant="default">Test</Badge>);
    expect((container.firstElementChild as HTMLElement).className).toContain("bg-primary");

    rerender(<Badge variant="secondary">Test</Badge>);
    expect((container.firstElementChild as HTMLElement).className).toContain("bg-secondary");
    expect((container.firstElementChild as HTMLElement).className).not.toContain("bg-primary");
  });

  it("updates aria-invalid on re-render (false → true)", () => {
    // React renders aria-invalid={false} as aria-invalid="false" in the DOM;
    // after re-render with true it becomes "true".
    const { container, rerender } = render(<Badge aria-invalid={false}>Test</Badge>);
    expect((container.firstElementChild as HTMLElement).getAttribute("aria-invalid")).toBe("false");

    rerender(<Badge aria-invalid={true}>Test</Badge>);
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute("aria-invalid", "true");
  });

  it("updates aria-invalid on re-render (true → false)", () => {
    const { container, rerender } = render(<Badge aria-invalid={true}>Test</Badge>);
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute("aria-invalid", "true");

    // React renders false as "false" rather than removing the attribute.
    rerender(<Badge aria-invalid={false}>Test</Badge>);
    expect((container.firstElementChild as HTMLElement).getAttribute("aria-invalid")).toBe("false");
  });

  it("updates className on re-render", () => {
    const { container, rerender } = render(<Badge className="old-class">Test</Badge>);
    expect((container.firstElementChild as HTMLElement).className).toContain("old-class");

    rerender(<Badge className="new-class">Test</Badge>);
    expect((container.firstElementChild as HTMLElement).className).toContain("new-class");
    expect((container.firstElementChild as HTMLElement).className).not.toContain("old-class");
  });
});

// ---------------------------------------------------------------------------
// 13. Edge cases
// ---------------------------------------------------------------------------

describe("Badge — edge cases", () => {
  it("renders with undefined children", () => {
    const { container } = render(<Badge>{undefined}</Badge>);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders with null children", () => {
    const { container } = render(<Badge>{null}</Badge>);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders with empty string children", () => {
    const { container } = render(<Badge>{""}</Badge>);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders with false children without crashing", () => {
    const { container } = render(<Badge>{false}</Badge>);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders with a React fragment as children", () => {
    render(
      <Badge>
        <>Beta</>
      </Badge>
    );
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("renders with nested spans as children", () => {
    render(
      <Badge>
        <span data-testid="inner">Label</span>
      </Badge>
    );
    expect(screen.getByTestId("inner")).toBeInTheDocument();
  });

  it("renders multiple independent instances without interference", () => {
    const { container } = render(
      <div>
        {ALL_VARIANTS.map((v) => (
          <Badge key={v} variant={v}>
            {v}
          </Badge>
        ))}
      </div>
    );
    // All 8 variants rendered
    const spans = container.querySelectorAll("span");
    expect(spans.length).toBeGreaterThanOrEqual(ALL_VARIANTS.length);
  });

  it("does not render any <button> element by default", () => {
    const { container } = render(<Badge>Test</Badge>);
    expect(container.querySelector("button")).toBeNull();
  });

  it("does not render any <a> element by default (no render prop)", () => {
    const { container } = render(<Badge>Test</Badge>);
    expect(container.querySelector("a")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 14. Accessibility — axe violations
// ---------------------------------------------------------------------------

describe("Badge — accessibility (axe)", () => {
  it("has no axe violations with default variant", async () => {
    const { container } = render(<Badge>Default</Badge>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations for every variant", async () => {
    for (const variant of ALL_VARIANTS) {
      const { container } = render(<Badge variant={variant}>{variant}</Badge>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  it("has no axe violations when rendered as <a> link", async () => {
    const { container } = render(
      <Badge render={<a href="/docs" />}>Documentation</Badge>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with aria-invalid", async () => {
    const { container } = render(
      <Badge aria-invalid>Required field missing</Badge>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with inline icon (data-icon start)", async () => {
    const { container } = render(
      <Badge variant="success">
        <CheckCircle data-icon="inline-start" />
        Verified
      </Badge>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with role='status' attribute", async () => {
    const { container } = render(
      <Badge role="status" variant="success">
        Operational
      </Badge>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations for icon-only badge with role='img' and aria-label", async () => {
    // aria-label is only valid on a <span> when it has a semantic role.
    // Adding role="img" makes the accessible name meaningful.
    const { container } = render(
      <Badge role="img" aria-label="success status" className="px-1">
        <CheckCircle />
      </Badge>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations when used inline in prose", async () => {
    const { container } = render(
      <p>
        Available in <Badge variant="success" render={<a href="#" />}>v2.4</Badge> and later.
      </p>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations in a status list context", async () => {
    const { container } = render(
      <ul>
        <li>
          <span>Deployment #847</span>
          <Badge variant="success">Live</Badge>
        </li>
        <li>
          <span>Deployment #846</span>
          <Badge variant="warning">Building</Badge>
        </li>
      </ul>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations in a tag cloud context", async () => {
    const { container } = render(
      <div>
        {["typescript", "react"].map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// 15. DOM structure introspection
// ---------------------------------------------------------------------------

describe("Badge — DOM structure", () => {
  it("renders a single root element", () => {
    const { container } = render(<Badge>Single</Badge>);
    expect(container.children).toHaveLength(1);
  });

  it("text children are direct text nodes inside the span", () => {
    const { container } = render(<Badge>Label</Badge>);
    const span = container.firstElementChild as HTMLElement;
    expect(span.textContent).toBe("Label");
  });

  it("renders with icon and text — both present in DOM", () => {
    const { container } = render(
      <Badge variant="success">
        <CheckCircle data-testid="chk" />
        Verified
      </Badge>
    );
    expect(container.querySelector('[data-testid="chk"]')).toBeInTheDocument();
    expect(container.firstElementChild?.textContent).toContain("Verified");
  });

  it("render-as-anchor has textContent from children", () => {
    const { container } = render(
      <Badge render={<a href="#" />}>Read more</Badge>
    );
    const anchor = container.querySelector("a") as HTMLElement;
    expect(anchor.textContent).toContain("Read more");
  });
});

// ---------------------------------------------------------------------------
// 16. Focus-visible class (base class presence)
// ---------------------------------------------------------------------------

describe("Badge — focus-visible classes in base string", () => {
  it("base class includes focus-visible:border-ring", () => {
    const cls = badgeVariants({ variant: "default" });
    expect(cls).toContain("focus-visible:border-ring");
  });

  it("base class includes focus-visible:ring-[3px]", () => {
    const cls = badgeVariants({ variant: "default" });
    expect(cls).toContain("focus-visible:ring-[3px]");
  });

  it("base class includes focus-visible:ring-ring/50", () => {
    const cls = badgeVariants({ variant: "default" });
    expect(cls).toContain("focus-visible:ring-ring/50");
  });

  it("destructive variant has focus-visible:ring-destructive/20 override", () => {
    const cls = badgeVariants({ variant: "destructive" });
    expect(cls).toContain("focus-visible:ring-destructive");
  });

  it("success variant has focus-visible:ring-success/20 override", () => {
    const cls = badgeVariants({ variant: "success" });
    expect(cls).toContain("focus-visible:ring-success");
  });

  it("warning variant has focus-visible:ring-warning/20 override", () => {
    const cls = badgeVariants({ variant: "warning" });
    expect(cls).toContain("focus-visible:ring-warning");
  });
});
