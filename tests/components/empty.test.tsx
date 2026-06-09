/**
 * Exhaustive tests for the Empty compound component
 *
 * Component source: components/ui/empty.tsx
 *
 * Exports:
 *   Empty            – centered container, data-slot="empty"
 *   EmptyHeader      – groups media/title/description, data-slot="empty-header"
 *   EmptyMedia       – media slot, data-slot="empty-media", variant "default"|"icon"
 *   EmptyTitle       – title text, data-slot="empty-title" (font-medium, never bold)
 *   EmptyDescription – muted description, data-slot="empty-description"
 *   EmptyContent     – CTA slot, data-slot="empty-content"
 */

import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  emptyMediaVariants,
} from "@/components/ui/empty";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderFullEmpty(variant?: "default" | "icon") {
  return render(
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant={variant}>
          <svg aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>Create your first project to start.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <button>Create project</button>
      </EmptyContent>
    </Empty>
  );
}

// ---------------------------------------------------------------------------
// 1. Renders without crashing
// ---------------------------------------------------------------------------

describe("Empty — renders without crashing", () => {
  it("renders a bare Empty without crashing", () => {
    const { container } = render(<Empty />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("Empty root element is a <div>", () => {
    const { container } = render(<Empty />);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("renders a fully-composed empty state without crashing", () => {
    expect(() => renderFullEmpty()).not.toThrow();
  });

  it("renders children inside Empty", () => {
    render(<Empty>hello world</Empty>);
    expect(screen.getByText("hello world")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 2. data-slot attributes (every part)
// ---------------------------------------------------------------------------

describe("Empty — data-slot attributes", () => {
  it("Empty root has data-slot='empty'", () => {
    const { container } = render(<Empty />);
    expect(container.firstChild).toHaveAttribute("data-slot", "empty");
  });

  it("EmptyHeader has data-slot='empty-header'", () => {
    const { container } = render(
      <Empty>
        <EmptyHeader />
      </Empty>
    );
    expect(
      container.querySelector("[data-slot='empty-header']")
    ).toBeInTheDocument();
  });

  it("EmptyMedia has data-slot='empty-media'", () => {
    const { container } = render(
      <Empty>
        <EmptyMedia />
      </Empty>
    );
    expect(
      container.querySelector("[data-slot='empty-media']")
    ).toBeInTheDocument();
  });

  it("EmptyTitle has data-slot='empty-title'", () => {
    render(<EmptyTitle>Title</EmptyTitle>);
    expect(screen.getByText("Title")).toHaveAttribute(
      "data-slot",
      "empty-title"
    );
  });

  it("EmptyDescription has data-slot='empty-description'", () => {
    render(<EmptyDescription>Desc</EmptyDescription>);
    expect(screen.getByText("Desc")).toHaveAttribute(
      "data-slot",
      "empty-description"
    );
  });

  it("EmptyContent has data-slot='empty-content'", () => {
    const { container } = render(
      <Empty>
        <EmptyContent>cta</EmptyContent>
      </Empty>
    );
    expect(
      container.querySelector("[data-slot='empty-content']")
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 3. Empty container base classes
// ---------------------------------------------------------------------------

describe("Empty — base classes", () => {
  it("is a centered flex column", () => {
    const { container } = render(<Empty />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("flex");
    expect(cls).toContain("flex-col");
    expect(cls).toContain("items-center");
    expect(cls).toContain("justify-center");
    expect(cls).toContain("text-center");
  });

  it("uses the radius scale (rounded-lg)", () => {
    const { container } = render(<Empty />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "rounded-lg"
    );
  });

  it("has generous padding", () => {
    const { container } = render(<Empty />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("px-6");
    expect(cls).toContain("py-12");
  });
});

// ---------------------------------------------------------------------------
// 4. EmptyMedia variants
// ---------------------------------------------------------------------------

describe("EmptyMedia — variants", () => {
  it("defaults to variant='default' (data-variant + bare, no chip)", () => {
    const { container } = render(<EmptyMedia />);
    const media = container.querySelector(
      "[data-slot='empty-media']"
    ) as HTMLElement;
    expect(media).toHaveAttribute("data-variant", "default");
    expect(media.className).toContain("text-muted-foreground");
    expect(media.className).not.toContain("bg-muted");
  });

  it("variant='default' explicitly sets data-variant='default'", () => {
    const { container } = render(<EmptyMedia variant="default" />);
    expect(
      container.querySelector("[data-slot='empty-media']")
    ).toHaveAttribute("data-variant", "default");
  });

  it("variant='icon' is a muted rounded token chip with a sized box", () => {
    const { container } = render(<EmptyMedia variant="icon" />);
    const media = container.querySelector(
      "[data-slot='empty-media']"
    ) as HTMLElement;
    expect(media).toHaveAttribute("data-variant", "icon");
    expect(media.className).toContain("bg-muted");
    expect(media.className).toContain("text-muted-foreground");
    expect(media.className).toContain("rounded-lg");
    expect(media.className).toContain("size-12");
  });

  it("auto-sizes child svgs via the escape hatch", () => {
    const { container } = render(<EmptyMedia />);
    const media = container.querySelector(
      "[data-slot='empty-media']"
    ) as HTMLElement;
    expect(media.className).toContain("[&_svg:not([class*='size-'])]:size-6");
  });

  it("renders icon children", () => {
    render(
      <EmptyMedia variant="icon">
        <svg data-testid="icon" aria-hidden="true" />
      </EmptyMedia>
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("emptyMediaVariants helper resolves the icon variant classes", () => {
    expect(emptyMediaVariants({ variant: "icon" })).toContain("bg-muted");
    expect(emptyMediaVariants({ variant: "default" })).not.toContain("bg-muted");
  });
});

// ---------------------------------------------------------------------------
// 5. EmptyTitle — editorial typography (never bold)
// ---------------------------------------------------------------------------

describe("EmptyTitle — typography", () => {
  it("is font-medium and text-sm", () => {
    render(<EmptyTitle>Title</EmptyTitle>);
    const title = screen.getByText("Title");
    expect(title.className).toContain("font-medium");
    expect(title.className).toContain("text-sm");
  });

  it("is never font-bold or font-semibold (editorial DNA)", () => {
    render(<EmptyTitle>Title</EmptyTitle>);
    const title = screen.getByText("Title");
    expect(title.className).not.toContain("font-bold");
    expect(title.className).not.toContain("font-semibold");
  });

  it("uses text-foreground", () => {
    render(<EmptyTitle>Title</EmptyTitle>);
    expect(screen.getByText("Title").className).toContain("text-foreground");
  });

  it("renders title text content", () => {
    render(<EmptyTitle>No results found</EmptyTitle>);
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 6. EmptyDescription — muted + link affordance
// ---------------------------------------------------------------------------

describe("EmptyDescription — classes and content", () => {
  it("is muted and text-sm", () => {
    render(<EmptyDescription>Desc</EmptyDescription>);
    const desc = screen.getByText("Desc");
    expect(desc.className).toContain("text-sm");
    expect(desc.className).toContain("text-muted-foreground");
  });

  it("underlines inline links", () => {
    render(<EmptyDescription>Desc</EmptyDescription>);
    expect(screen.getByText("Desc").className).toContain("[&>a]:underline");
  });

  it("renders a navigable inline link", () => {
    render(
      <EmptyDescription>
        Try a different <a href="#search">search</a>.
      </EmptyDescription>
    );
    expect(screen.getByRole("link", { name: "search" })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 7. EmptyContent — CTA slot
// ---------------------------------------------------------------------------

describe("EmptyContent — classes and content", () => {
  it("is a flex slot with gap", () => {
    const { container } = render(
      <Empty>
        <EmptyContent />
      </Empty>
    );
    const content = container.querySelector(
      "[data-slot='empty-content']"
    ) as HTMLElement;
    expect(content.className).toContain("flex");
    expect(content.className).toContain("gap-2");
  });

  it("renders CTA children", () => {
    render(
      <EmptyContent>
        <button>Create project</button>
      </EmptyContent>
    );
    expect(
      screen.getByRole("button", { name: "Create project" })
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 8. className passthrough — every part merges custom className
// ---------------------------------------------------------------------------

describe("Empty compound parts — className forwarding", () => {
  it("Empty forwards custom className and keeps base classes", () => {
    const { container } = render(<Empty className="my-empty" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("my-empty");
    expect(el.className).toContain("rounded-lg");
  });

  it("EmptyHeader forwards custom className", () => {
    const { container } = render(<EmptyHeader className="custom-header" />);
    expect(
      (container.firstChild as HTMLElement).className
    ).toContain("custom-header");
  });

  it("EmptyMedia forwards custom className (merges with variant classes)", () => {
    const { container } = render(
      <EmptyMedia variant="icon" className="custom-media" />
    );
    const media = container.firstChild as HTMLElement;
    expect(media.className).toContain("custom-media");
    expect(media.className).toContain("bg-muted");
  });

  it("EmptyTitle forwards custom className", () => {
    render(<EmptyTitle className="custom-title">T</EmptyTitle>);
    expect(screen.getByText("T").className).toContain("custom-title");
  });

  it("EmptyDescription forwards custom className", () => {
    render(<EmptyDescription className="custom-desc">D</EmptyDescription>);
    expect(screen.getByText("D").className).toContain("custom-desc");
  });

  it("EmptyContent forwards custom className", () => {
    const { container } = render(<EmptyContent className="custom-content" />);
    expect(
      (container.firstChild as HTMLElement).className
    ).toContain("custom-content");
  });
});

// ---------------------------------------------------------------------------
// 9. HTML / aria attribute forwarding
// ---------------------------------------------------------------------------

describe("Empty compound parts — attribute forwarding", () => {
  it("Empty forwards id and data-testid", () => {
    const { container } = render(
      <Empty id="empty-1" data-testid="empty" />
    );
    expect(container.firstChild).toHaveAttribute("id", "empty-1");
    expect(container.firstChild).toHaveAttribute("data-testid", "empty");
  });

  it("Empty forwards role and aria attributes (safe passthrough)", () => {
    const { container } = render(
      <Empty role="status" aria-live="polite" aria-label="No results" />
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("role", "status");
    expect(el).toHaveAttribute("aria-live", "polite");
    expect(el).toHaveAttribute("aria-label", "No results");
  });

  it("EmptyMedia forwards data-testid", () => {
    const { container } = render(<EmptyMedia data-testid="media" />);
    expect(container.firstChild).toHaveAttribute("data-testid", "media");
  });
});

// ---------------------------------------------------------------------------
// 10. Composition / DOM structure
// ---------------------------------------------------------------------------

describe("Empty — composition and DOM structure", () => {
  it("renders all parts inside the Empty root (default media)", () => {
    const { container } = renderFullEmpty("default");
    const empty = container.querySelector("[data-slot='empty']") as HTMLElement;
    expect(within(empty).getByText("No projects yet")).toBeInTheDocument();
    expect(
      within(empty).getByText("Create your first project to start.")
    ).toBeInTheDocument();
    expect(
      within(empty).getByRole("button", { name: "Create project" })
    ).toBeInTheDocument();
  });

  it("renders all parts inside the Empty root (icon media)", () => {
    const { container } = renderFullEmpty("icon");
    expect(
      container.querySelector("[data-slot='empty-media']")
    ).toHaveAttribute("data-variant", "icon");
  });

  it("EmptyHeader contains media, title and description", () => {
    const { container } = renderFullEmpty();
    const header = container.querySelector(
      "[data-slot='empty-header']"
    ) as HTMLElement;
    expect(
      header.querySelector("[data-slot='empty-media']")
    ).toBeInTheDocument();
    expect(
      header.querySelector("[data-slot='empty-title']")
    ).toBeInTheDocument();
    expect(
      header.querySelector("[data-slot='empty-description']")
    ).toBeInTheDocument();
  });

  it("renders a single Empty root (no extra wrapper)", () => {
    const { container } = render(<Empty />);
    expect(container.children).toHaveLength(1);
    expect(container.querySelectorAll("[data-slot='empty']")).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// 11. Accessibility — axe
// ---------------------------------------------------------------------------

describe("Empty — accessibility (axe)", () => {
  it("bare Empty has no axe violations", async () => {
    const { container } = render(
      <main>
        <section aria-label="Empty section">
          <Empty />
        </section>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("fully-composed empty state (icon media) has no axe violations", async () => {
    const { container } = render(
      <main>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <svg aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>No projects yet</EmptyTitle>
            <EmptyDescription>
              Create your first project to start shipping.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <button>Create project</button>
          </EmptyContent>
        </Empty>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("empty state with default media + inline link has no axe violations", async () => {
    const { container } = render(
      <main>
        <Empty role="status">
          <EmptyHeader>
            <EmptyMedia>
              <svg aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>No results found</EmptyTitle>
            <EmptyDescription>
              Try a different <a href="#search">search</a>.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
