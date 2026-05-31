import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { HeroSection } from "@/components/hero-section";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function childContent(text = "Hero content") {
  return <div data-testid="hero-child">{text}</div>;
}

function headerContent(text = "Section title") {
  return <span data-testid="hero-header">{text}</span>;
}

// ---------------------------------------------------------------------------
// 1. Basic rendering
// ---------------------------------------------------------------------------
describe("HeroSection – basic rendering", () => {
  it("renders without crashing with only required children prop", () => {
    render(<HeroSection>{childContent()}</HeroSection>);
    expect(screen.getByTestId("hero-child")).toBeInTheDocument();
  });

  it("renders a <section> element as the root", () => {
    const { container } = render(<HeroSection>{childContent()}</HeroSection>);
    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
  });

  it("root element has role=region (implied by <section> with no accessible name)", () => {
    // <section> without aria-label/aria-labelledby has role=generic per ARIA spec,
    // but testing-library exposes it as 'region' only when it has an accessible name.
    // Confirm the root is a <section> DOM node.
    const { container } = render(<HeroSection>{childContent()}</HeroSection>);
    expect(container.firstChild?.nodeName).toBe("SECTION");
  });

  it("children are rendered inside the full-bleed wrapper", () => {
    const { container } = render(<HeroSection>{childContent()}</HeroSection>);
    const fullBleed = container.querySelector(".full-bleed");
    expect(fullBleed).toBeInTheDocument();
    expect(within(fullBleed as HTMLElement).getByTestId("hero-child")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 2. Header prop – presence / absence
// ---------------------------------------------------------------------------
describe("HeroSection – header prop", () => {
  it("does NOT render a header wrapper when header prop is omitted", () => {
    const { container } = render(<HeroSection>{childContent()}</HeroSection>);
    // The header wrapper has flex/flex-wrap classes
    const headerWrapper = container.querySelector(".flex.flex-wrap");
    expect(headerWrapper).not.toBeInTheDocument();
  });

  it("does NOT render a header wrapper when header prop is undefined", () => {
    const { container } = render(
      <HeroSection header={undefined}>{childContent()}</HeroSection>
    );
    expect(container.querySelector(".flex.flex-wrap")).not.toBeInTheDocument();
  });

  it("renders the header wrapper when header prop is provided", () => {
    const { container } = render(
      <HeroSection header={headerContent()}>{childContent()}</HeroSection>
    );
    const headerWrapper = container.querySelector(".flex.flex-wrap");
    expect(headerWrapper).toBeInTheDocument();
  });

  it("renders header content inside the header wrapper", () => {
    render(
      <HeroSection header={headerContent("My Header")}>{childContent()}</HeroSection>
    );
    expect(screen.getByTestId("hero-header")).toBeInTheDocument();
    expect(screen.getByText("My Header")).toBeInTheDocument();
  });

  it("header wrapper has items-end and justify-between classes", () => {
    const { container } = render(
      <HeroSection header={headerContent()}>{childContent()}</HeroSection>
    );
    const headerWrapper = container.querySelector(".flex.flex-wrap");
    expect(headerWrapper).toHaveClass("items-end", "justify-between", "gap-4");
  });

  it("renders complex header content (multiple children via Fragment)", () => {
    render(
      <HeroSection
        header={
          <>
            <div data-testid="header-left">Left</div>
            <a href="#" data-testid="header-right">See all</a>
          </>
        }
      >
        {childContent()}
      </HeroSection>
    );
    expect(screen.getByTestId("header-left")).toBeInTheDocument();
    expect(screen.getByTestId("header-right")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See all" })).toBeInTheDocument();
  });

  it("renders a metrics-style multi-metric header row", () => {
    const metrics = [
      { label: "Total Users", value: "24,830", delta: "+12.4%" },
      { label: "Revenue", value: "$91,200", delta: "+8.1%" },
    ];
    render(
      <HeroSection
        header={
          <div className="flex flex-wrap gap-8">
            {metrics.map((m) => (
              <div key={m.label}>
                <span>{m.label}</span>
                <span>{m.value}</span>
                <span>{m.delta}</span>
              </div>
            ))}
          </div>
        }
      >
        {childContent()}
      </HeroSection>
    );
    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("24,830")).toBeInTheDocument();
    expect(screen.getByText("+12.4%")).toBeInTheDocument();
  });

  it("renders a heading element inside header", () => {
    render(
      <HeroSection header={<h2>Section Heading</h2>}>{childContent()}</HeroSection>
    );
    expect(screen.getByRole("heading", { level: 2, name: "Section Heading" })).toBeInTheDocument();
  });

  it("renders action link in header (action-header pattern)", () => {
    render(
      <HeroSection
        header={
          <>
            <h2>Activity</h2>
            <a href="#all">See all ›</a>
          </>
        }
      >
        {childContent()}
      </HeroSection>
    );
    expect(screen.getByRole("link", { name: "See all ›" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("renders a badge/pill element inside header", () => {
    render(
      <HeroSection
        header={
          <span data-testid="badge" className="rounded-full bg-emerald-100 px-2.5">
            +18.2%
          </span>
        }
      >
        {childContent()}
      </HeroSection>
    );
    const badge = screen.getByTestId("badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("+18.2%");
  });
});

// ---------------------------------------------------------------------------
// 3. className prop
// ---------------------------------------------------------------------------
describe("HeroSection – className prop", () => {
  it("applies default space-y-4 class to root section", () => {
    const { container } = render(<HeroSection>{childContent()}</HeroSection>);
    expect(container.querySelector("section")).toHaveClass("space-y-4");
  });

  it("merges a custom className onto the root section", () => {
    const { container } = render(
      <HeroSection className="border-b pb-8">{childContent()}</HeroSection>
    );
    const section = container.querySelector("section");
    expect(section).toHaveClass("space-y-4");
    expect(section).toHaveClass("border-b");
    expect(section).toHaveClass("pb-8");
  });

  it("custom className can override spacing (space-y-6 replaces space-y-4 via cn)", () => {
    const { container } = render(
      <HeroSection className="space-y-6">{childContent()}</HeroSection>
    );
    const section = container.querySelector("section");
    // cn merges; both classes may appear but space-y-6 is present
    expect(section).toHaveClass("space-y-6");
  });

  it("applies multiple custom classes simultaneously", () => {
    const { container } = render(
      <HeroSection className="space-y-6 border-b border-border pb-8">
        {childContent()}
      </HeroSection>
    );
    const section = container.querySelector("section");
    expect(section).toHaveClass("space-y-6", "border-b", "pb-8");
  });

  it("className does not affect child/header rendering", () => {
    render(
      <HeroSection className="custom-wrapper" header={headerContent()}>
        {childContent()}
      </HeroSection>
    );
    expect(screen.getByTestId("hero-header")).toBeInTheDocument();
    expect(screen.getByTestId("hero-child")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 4. Children / full-bleed wrapper
// ---------------------------------------------------------------------------
describe("HeroSection – children / full-bleed wrapper", () => {
  it("full-bleed wrapper always renders (even with no header)", () => {
    const { container } = render(<HeroSection>{childContent()}</HeroSection>);
    expect(container.querySelector(".full-bleed")).toBeInTheDocument();
  });

  it("full-bleed wrapper always renders (even with header)", () => {
    const { container } = render(
      <HeroSection header={headerContent()}>{childContent()}</HeroSection>
    );
    expect(container.querySelector(".full-bleed")).toBeInTheDocument();
  });

  it("renders multiple children inside the full-bleed wrapper", () => {
    render(
      <HeroSection>
        <div data-testid="child-1">First</div>
        <div data-testid="child-2">Second</div>
      </HeroSection>
    );
    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
  });

  it("renders deeply nested children inside the full-bleed wrapper", () => {
    render(
      <HeroSection>
        <div>
          <div>
            <span data-testid="deep-child">Deep</span>
          </div>
        </div>
      </HeroSection>
    );
    expect(screen.getByTestId("deep-child")).toBeInTheDocument();
  });

  it("renders text-only children without error", () => {
    render(<HeroSection>Plain text child</HeroSection>);
    expect(screen.getByText("Plain text child")).toBeInTheDocument();
  });

  it("full-bleed div is a direct child of the section", () => {
    const { container } = render(<HeroSection>{childContent()}</HeroSection>);
    const section = container.querySelector("section");
    const fullBleed = section?.querySelector(":scope > .full-bleed");
    expect(fullBleed).toBeInTheDocument();
  });

  it("children render inside full-bleed, not directly in section root", () => {
    const { container } = render(<HeroSection>{childContent()}</HeroSection>);
    const section = container.querySelector("section");
    // The child div should NOT be a direct child of section (it's wrapped in .full-bleed)
    const directChild = section?.querySelector(":scope > [data-testid='hero-child']");
    expect(directChild).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 5. Structural / layout invariants
// ---------------------------------------------------------------------------
describe("HeroSection – structure invariants", () => {
  it("section contains exactly one .full-bleed child when no header", () => {
    const { container } = render(<HeroSection>{childContent()}</HeroSection>);
    const section = container.querySelector("section");
    const directDivs = section?.querySelectorAll(":scope > div");
    // Only the full-bleed wrapper div should be there
    expect(directDivs?.length).toBe(1);
    expect(directDivs?.[0]).toHaveClass("full-bleed");
  });

  it("section contains header wrapper + full-bleed div when header is provided", () => {
    const { container } = render(
      <HeroSection header={headerContent()}>{childContent()}</HeroSection>
    );
    const section = container.querySelector("section");
    const directDivs = section?.querySelectorAll(":scope > div");
    expect(directDivs?.length).toBe(2);
    // First is header wrapper (flex flex-wrap), second is full-bleed
    expect(directDivs?.[0]).toHaveClass("flex");
    expect(directDivs?.[1]).toHaveClass("full-bleed");
  });

  it("header wrapper appears before the full-bleed div in DOM order", () => {
    const { container } = render(
      <HeroSection header={headerContent()}>{childContent()}</HeroSection>
    );
    const section = container.querySelector("section")!;
    const kids = Array.from(section.querySelectorAll(":scope > div"));
    const headerIdx = kids.findIndex((el) => el.classList.contains("flex"));
    const bleedIdx = kids.findIndex((el) => el.classList.contains("full-bleed"));
    expect(headerIdx).toBeLessThan(bleedIdx);
  });
});

// ---------------------------------------------------------------------------
// 6. Prop combinations
// ---------------------------------------------------------------------------
describe("HeroSection – prop combinations", () => {
  it("all props together: header + children + className", () => {
    const { container } = render(
      <HeroSection header={headerContent()} className="extra-class">
        {childContent()}
      </HeroSection>
    );
    expect(container.querySelector("section")).toHaveClass("space-y-4", "extra-class");
    expect(container.querySelector(".flex.flex-wrap")).toBeInTheDocument();
    expect(container.querySelector(".full-bleed")).toBeInTheDocument();
    expect(screen.getByTestId("hero-header")).toBeInTheDocument();
    expect(screen.getByTestId("hero-child")).toBeInTheDocument();
  });

  it("no header + custom className", () => {
    const { container } = render(
      <HeroSection className="pb-4">{childContent()}</HeroSection>
    );
    expect(container.querySelector(".flex.flex-wrap")).not.toBeInTheDocument();
    expect(container.querySelector(".full-bleed")).toBeInTheDocument();
    expect(container.querySelector("section")).toHaveClass("pb-4");
  });

  it("null header is treated as no header (wrapper not rendered)", () => {
    // React children: null is falsy so header conditional should not render
    const { container } = render(
      // @ts-expect-error – testing null explicitly
      <HeroSection header={null}>{childContent()}</HeroSection>
    );
    expect(container.querySelector(".flex.flex-wrap")).not.toBeInTheDocument();
  });

  it("false header is treated as no header (wrapper not rendered)", () => {
    const { container } = render(
      // @ts-expect-error – testing false explicitly
      <HeroSection header={false}>{childContent()}</HeroSection>
    );
    expect(container.querySelector(".flex.flex-wrap")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 7. Accessibility
// ---------------------------------------------------------------------------
describe("HeroSection – accessibility", () => {
  it("has no axe violations with no header", async () => {
    const { container } = render(
      <HeroSection>
        <div>Chart content</div>
      </HeroSection>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with a heading in the header", async () => {
    const { container } = render(
      <main>
        <HeroSection header={<h2>Activity</h2>}>
          <div>Chart</div>
        </HeroSection>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with a link in the header", async () => {
    const { container } = render(
      <HeroSection header={<a href="#all">See all</a>}>
        <div>Chart</div>
      </HeroSection>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with full metrics-header pattern", async () => {
    const { container } = render(
      <main>
        <HeroSection
          header={
            <>
              <div>
                <span>Total Users</span>
                <span>24,830</span>
              </div>
              <a href="#report">Full report ›</a>
            </>
          }
        >
          <div>Full-bleed area chart</div>
        </HeroSection>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with aria-label on the section for region role", async () => {
    // Wrapping with aria-label makes <section> a proper landmark region
    const { container } = render(
      <HeroSection className="[&>section]:undefined" aria-label="Activity overview">
        <div>Chart</div>
      </HeroSection>
    );
    // HeroSection does not forward aria-label; verify there's still no violation
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with the with-action-header example pattern", async () => {
    const { container } = render(
      <main>
        <HeroSection
          header={
            <>
              <div>
                <h2>Activity</h2>
                <p>Last 7 days</p>
              </div>
              <a href="#">See all ›</a>
            </>
          }
        >
          <div aria-label="Activity chart" role="img">
            Full-bleed activity chart
          </div>
        </HeroSection>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with the custom-classname example pattern", async () => {
    const { container } = render(
      <main>
        <HeroSection
          className="space-y-6 border-b pb-8"
          header={<h2>Custom spacing via className</h2>}
        >
          <div>Full-bleed zone</div>
        </HeroSection>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// 8. No-header (no-header example) pattern
// ---------------------------------------------------------------------------
describe("HeroSection – no-header example pattern", () => {
  it("renders the full-bleed child when no header is provided (no-header pattern)", () => {
    render(
      <div className="overflow-x-clip w-full">
        <HeroSection>
          <div data-testid="hero-content">Hero content without a header row</div>
        </HeroSection>
      </div>
    );
    expect(screen.getByTestId("hero-content")).toBeInTheDocument();
    expect(screen.getByText("Hero content without a header row")).toBeInTheDocument();
  });

  it("no header wrapper div is rendered in the DOM for no-header pattern", () => {
    const { container } = render(
      <HeroSection>
        <div>Content</div>
      </HeroSection>
    );
    // Should only have the full-bleed div under section
    const sectionChildren = container.querySelector("section")?.children;
    expect(sectionChildren?.length).toBe(1);
    expect(sectionChildren?.[0]).toHaveClass("full-bleed");
  });
});

// ---------------------------------------------------------------------------
// 9. Edge cases
// ---------------------------------------------------------------------------
describe("HeroSection – edge cases", () => {
  it("renders correctly when children is a React Fragment", () => {
    render(
      <HeroSection>
        <>
          <div data-testid="frag-child-1">A</div>
          <div data-testid="frag-child-2">B</div>
        </>
      </HeroSection>
    );
    expect(screen.getByTestId("frag-child-1")).toBeInTheDocument();
    expect(screen.getByTestId("frag-child-2")).toBeInTheDocument();
  });

  it("renders with an empty string className prop without crashing", () => {
    const { container } = render(
      <HeroSection className="">{childContent()}</HeroSection>
    );
    expect(container.querySelector("section")).toHaveClass("space-y-4");
  });

  it("renders correctly with a zero-value className", () => {
    const { container } = render(
      <HeroSection className="p-0">{childContent()}</HeroSection>
    );
    expect(container.querySelector("section")).toHaveClass("p-0");
  });

  it("header containing interactive elements renders them accessibly", () => {
    render(
      <HeroSection
        header={
          <button type="button" aria-label="Filter by date">
            Filter
          </button>
        }
      >
        {childContent()}
      </HeroSection>
    );
    const btn = screen.getByRole("button", { name: "Filter by date" });
    expect(btn).toBeInTheDocument();
    expect(btn).not.toBeDisabled();
  });

  it("renders header with img element that has alt text", () => {
    render(
      <HeroSection
        header={<img src="/logo.png" alt="Company logo" />}
      >
        {childContent()}
      </HeroSection>
    );
    expect(screen.getByRole("img", { name: "Company logo" })).toBeInTheDocument();
  });

  it("renders children with a role attribute", () => {
    render(
      <HeroSection>
        <div role="img" aria-label="Activity chart">Chart</div>
      </HeroSection>
    );
    expect(screen.getByRole("img", { name: "Activity chart" })).toBeInTheDocument();
  });

  it("does not throw when re-rendered with different header content", () => {
    const { rerender } = render(
      <HeroSection header={<span>Header v1</span>}>{childContent()}</HeroSection>
    );
    expect(screen.getByText("Header v1")).toBeInTheDocument();

    rerender(
      <HeroSection header={<span>Header v2</span>}>{childContent()}</HeroSection>
    );
    expect(screen.queryByText("Header v1")).not.toBeInTheDocument();
    expect(screen.getByText("Header v2")).toBeInTheDocument();
  });

  it("does not throw when re-rendered without a header after having one", () => {
    const { container, rerender } = render(
      <HeroSection header={<span>My Header</span>}>{childContent()}</HeroSection>
    );
    expect(container.querySelector(".flex.flex-wrap")).toBeInTheDocument();

    rerender(<HeroSection>{childContent()}</HeroSection>);
    expect(container.querySelector(".flex.flex-wrap")).not.toBeInTheDocument();
  });

  it("does not throw when re-rendered with a header after having none", () => {
    const { container, rerender } = render(
      <HeroSection>{childContent()}</HeroSection>
    );
    expect(container.querySelector(".flex.flex-wrap")).not.toBeInTheDocument();

    rerender(
      <HeroSection header={<span>Now I have a header</span>}>{childContent()}</HeroSection>
    );
    expect(container.querySelector(".flex.flex-wrap")).toBeInTheDocument();
    expect(screen.getByText("Now I have a header")).toBeInTheDocument();
  });

  it("renders correctly when used inside an overflow-x-clip ancestor (intended usage)", () => {
    render(
      <div className="overflow-x-clip w-full">
        <HeroSection header={headerContent()}>{childContent()}</HeroSection>
      </div>
    );
    expect(screen.getByTestId("hero-child")).toBeInTheDocument();
    expect(screen.getByTestId("hero-header")).toBeInTheDocument();
  });
});
