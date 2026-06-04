/**
 * Exhaustive tests for Card compound component
 *
 * Component source: components/ui/card.tsx
 *
 * Exports:
 *   Card            – root container div, data-slot="card", size prop ("default"|"sm")
 *   CardHeader      – header grid, data-slot="card-header"
 *   CardTitle       – title text, data-slot="card-title"
 *   CardDescription – description text, data-slot="card-description"
 *   CardAction      – action area (aligns to header grid col 2), data-slot="card-action"
 *   CardContent     – body content area, data-slot="card-content"
 *   CardFooter      – footer row, data-slot="card-footer"
 *
 * Size prop on Card:
 *   "default" – larger padding/gap (data-size="default")
 *   "sm"      – compact padding/gap (data-size="sm")
 */

import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CardPanel,
  CardFrame,
  CardFrameHeader,
  CardFrameTitle,
  CardFrameDescription,
  CardFrameAction,
  CardFrameFooter,
} from "@/components/ui/card";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Render a fully-populated card and return the container */
function renderFullCard(size?: "default" | "sm") {
  return render(
    <Card size={size}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description text</CardDescription>
        <CardAction>
          <button aria-label="View all">View all</button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>Content area</p>
      </CardContent>
      <CardFooter>
        <span>Footer text</span>
      </CardFooter>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// 1. Renders without crashing — default usage
// ---------------------------------------------------------------------------

describe("Card — renders without crashing", () => {
  it("renders a bare Card without crashing", () => {
    const { container } = render(<Card />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("Card root element is a <div>", () => {
    const { container } = render(<Card />);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("renders a fully-composed card without crashing", () => {
    expect(() => renderFullCard()).not.toThrow();
  });

  it("renders all compound parts without crashing", () => {
    const { container } = renderFullCard();
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders children inside Card", () => {
    render(<Card>hello world</Card>);
    expect(screen.getByText("hello world")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 2. data-slot attributes
// ---------------------------------------------------------------------------

describe("Card — data-slot attributes", () => {
  it("Card root has data-slot='card'", () => {
    const { container } = render(<Card />);
    expect(container.firstChild).toHaveAttribute("data-slot", "card");
  });

  it("CardHeader has data-slot='card-header'", () => {
    const { container } = render(
      <Card>
        <CardHeader />
      </Card>
    );
    const header = container.querySelector("[data-slot='card-header']");
    expect(header).toBeInTheDocument();
  });

  it("CardTitle has data-slot='card-title'", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
      </Card>
    );
    const title = container.querySelector("[data-slot='card-title']");
    expect(title).toBeInTheDocument();
  });

  it("CardDescription has data-slot='card-description'", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardDescription>Desc</CardDescription>
        </CardHeader>
      </Card>
    );
    const desc = container.querySelector("[data-slot='card-description']");
    expect(desc).toBeInTheDocument();
  });

  it("CardAction has data-slot='card-action'", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardAction>
            <button>Action</button>
          </CardAction>
        </CardHeader>
      </Card>
    );
    const action = container.querySelector("[data-slot='card-action']");
    expect(action).toBeInTheDocument();
  });

  it("CardContent has data-slot='card-content'", () => {
    const { container } = render(
      <Card>
        <CardContent>body</CardContent>
      </Card>
    );
    const content = container.querySelector("[data-slot='card-content']");
    expect(content).toBeInTheDocument();
  });

  it("CardFooter has data-slot='card-footer'", () => {
    const { container } = render(
      <Card>
        <CardFooter>footer</CardFooter>
      </Card>
    );
    const footer = container.querySelector("[data-slot='card-footer']");
    expect(footer).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 3. size prop — "default" vs "sm"
// ---------------------------------------------------------------------------

describe("Card — size prop", () => {
  it("defaults to size='default' when size prop is omitted", () => {
    const { container } = render(<Card />);
    expect(container.firstChild).toHaveAttribute("data-size", "default");
  });

  it("size='default' sets data-size='default'", () => {
    const { container } = render(<Card size="default" />);
    expect(container.firstChild).toHaveAttribute("data-size", "default");
  });

  it("size='sm' sets data-size='sm'", () => {
    const { container } = render(<Card size="sm" />);
    expect(container.firstChild).toHaveAttribute("data-size", "sm");
  });

  it("size='default' card has default padding class (py-5)", () => {
    const { container } = render(<Card size="default" />);
    expect((container.firstChild as HTMLElement).className).toContain("py-5");
  });

  it("size='sm' card includes data-[size=sm]:py-3 class", () => {
    const { container } = render(<Card size="sm" />);
    const className = (container.firstChild as HTMLElement).className;
    expect(className).toContain("data-[size=sm]:py-3");
  });

  it("size='sm' card includes data-[size=sm]:gap-3 class", () => {
    const { container } = render(<Card size="sm" />);
    const className = (container.firstChild as HTMLElement).className;
    expect(className).toContain("data-[size=sm]:gap-3");
  });

  it("size='default' has gap-4 class", () => {
    const { container } = render(<Card size="default" />);
    expect((container.firstChild as HTMLElement).className).toContain("gap-4");
  });

  it("CardHeader uses group-data-[size=sm]/card:px-3 for compact padding", () => {
    const { container } = render(
      <Card size="sm">
        <CardHeader />
      </Card>
    );
    const header = container.querySelector("[data-slot='card-header']") as HTMLElement;
    expect(header.className).toContain("group-data-[size=sm]/card:px-3");
  });

  it("CardContent uses group-data-[size=sm]/card:px-3 for compact padding", () => {
    const { container } = render(
      <Card size="sm">
        <CardContent />
      </Card>
    );
    const content = container.querySelector("[data-slot='card-content']") as HTMLElement;
    expect(content.className).toContain("group-data-[size=sm]/card:px-3");
  });

  it("CardFooter uses group-data-[size=sm]/card:p-3 for compact padding", () => {
    const { container } = render(
      <Card size="sm">
        <CardFooter />
      </Card>
    );
    const footer = container.querySelector("[data-slot='card-footer']") as HTMLElement;
    expect(footer.className).toContain("group-data-[size=sm]/card:p-3");
  });
});

// ---------------------------------------------------------------------------
// 4. Card base classes
// ---------------------------------------------------------------------------

describe("Card — base classes", () => {
  it("has rounded-2xl class", () => {
    const { container } = render(<Card />);
    expect((container.firstChild as HTMLElement).className).toContain("rounded-2xl");
  });

  it("has flex class", () => {
    const { container } = render(<Card />);
    expect((container.firstChild as HTMLElement).className).toContain("flex");
  });

  it("has flex-col class", () => {
    const { container } = render(<Card />);
    expect((container.firstChild as HTMLElement).className).toContain("flex-col");
  });

  it("has overflow-hidden class", () => {
    const { container } = render(<Card />);
    expect((container.firstChild as HTMLElement).className).toContain("overflow-hidden");
  });

  it("elevates with edge (immersive edge, no hard border)", () => {
    const { container } = render(<Card />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("edge");
    expect(cls).not.toContain("border-border");
  });

  it("has bg-card class", () => {
    const { container } = render(<Card />);
    expect((container.firstChild as HTMLElement).className).toContain("bg-card");
  });

  it("has text-card-foreground class", () => {
    const { container } = render(<Card />);
    expect((container.firstChild as HTMLElement).className).toContain("text-card-foreground");
  });

  it("has edge class", () => {
    const { container } = render(<Card />);
    expect((container.firstChild as HTMLElement).className).toContain("edge");
  });

  it("has text-sm class", () => {
    const { container } = render(<Card />);
    expect((container.firstChild as HTMLElement).className).toContain("text-sm");
  });

  it("has group/card class (Tailwind group modifier)", () => {
    const { container } = render(<Card />);
    expect((container.firstChild as HTMLElement).className).toContain("group/card");
  });
});

// ---------------------------------------------------------------------------
// 5. CardHeader base classes
// ---------------------------------------------------------------------------

describe("CardHeader — base classes", () => {
  it("has grid class", () => {
    const { container } = render(
      <Card>
        <CardHeader />
      </Card>
    );
    const header = container.querySelector("[data-slot='card-header']") as HTMLElement;
    expect(header.className).toContain("grid");
  });

  it("has rounded-t-2xl class", () => {
    const { container } = render(
      <Card>
        <CardHeader />
      </Card>
    );
    const header = container.querySelector("[data-slot='card-header']") as HTMLElement;
    expect(header.className).toContain("rounded-t-2xl");
  });

  it("has px-5 class (default horizontal padding)", () => {
    const { container } = render(
      <Card>
        <CardHeader />
      </Card>
    );
    const header = container.querySelector("[data-slot='card-header']") as HTMLElement;
    expect(header.className).toContain("px-5");
  });

  it("has items-start class", () => {
    const { container } = render(
      <Card>
        <CardHeader />
      </Card>
    );
    const header = container.querySelector("[data-slot='card-header']") as HTMLElement;
    expect(header.className).toContain("items-start");
  });

  it("has gap-1 class", () => {
    const { container } = render(
      <Card>
        <CardHeader />
      </Card>
    );
    const header = container.querySelector("[data-slot='card-header']") as HTMLElement;
    expect(header.className).toContain("gap-1");
  });

  it("has has-data-[slot=card-action]:grid-cols-[1fr_auto] class (action column layout)", () => {
    const { container } = render(
      <Card>
        <CardHeader />
      </Card>
    );
    const header = container.querySelector("[data-slot='card-header']") as HTMLElement;
    expect(header.className).toContain("has-data-[slot=card-action]:grid-cols-[1fr_auto]");
  });
});

// ---------------------------------------------------------------------------
// 6. CardTitle base classes and content
// ---------------------------------------------------------------------------

describe("CardTitle — classes and content", () => {
  it("has font-heading class", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Hello</CardTitle>
        </CardHeader>
      </Card>
    );
    const title = container.querySelector("[data-slot='card-title']") as HTMLElement;
    expect(title.className).toContain("font-heading");
  });

  it("has text-base class", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Hello</CardTitle>
        </CardHeader>
      </Card>
    );
    const title = container.querySelector("[data-slot='card-title']") as HTMLElement;
    expect(title.className).toContain("text-base");
  });

  it("has font-medium class", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Hello</CardTitle>
        </CardHeader>
      </Card>
    );
    const title = container.querySelector("[data-slot='card-title']") as HTMLElement;
    expect(title.className).toContain("font-medium");
  });

  it("has leading-snug class", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Hello</CardTitle>
        </CardHeader>
      </Card>
    );
    const title = container.querySelector("[data-slot='card-title']") as HTMLElement;
    expect(title.className).toContain("leading-snug");
  });

  it("has group-data-[size=sm]/card:text-sm class for compact size", () => {
    const { container } = render(
      <Card size="sm">
        <CardHeader>
          <CardTitle>Hello</CardTitle>
        </CardHeader>
      </Card>
    );
    const title = container.querySelector("[data-slot='card-title']") as HTMLElement;
    expect(title.className).toContain("group-data-[size=sm]/card:text-sm");
  });

  it("renders title text content", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Monthly Summary</CardTitle>
        </CardHeader>
      </Card>
    );
    expect(screen.getByText("Monthly Summary")).toBeInTheDocument();
  });

  it("is a <div> element", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
      </Card>
    );
    const title = container.querySelector("[data-slot='card-title']");
    expect(title?.tagName).toBe("DIV");
  });
});

// ---------------------------------------------------------------------------
// 7. CardDescription base classes and content
// ---------------------------------------------------------------------------

describe("CardDescription — classes and content", () => {
  it("has text-sm class", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardDescription>Desc</CardDescription>
        </CardHeader>
      </Card>
    );
    const desc = container.querySelector("[data-slot='card-description']") as HTMLElement;
    expect(desc.className).toContain("text-sm");
  });

  it("has text-muted-foreground class", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardDescription>Desc</CardDescription>
        </CardHeader>
      </Card>
    );
    const desc = container.querySelector("[data-slot='card-description']") as HTMLElement;
    expect(desc.className).toContain("text-muted-foreground");
  });

  it("renders description text content", () => {
    render(
      <Card>
        <CardHeader>
          <CardDescription>Overview for May 2026</CardDescription>
        </CardHeader>
      </Card>
    );
    expect(screen.getByText("Overview for May 2026")).toBeInTheDocument();
  });

  it("is a <div> element", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardDescription>Desc</CardDescription>
        </CardHeader>
      </Card>
    );
    const desc = container.querySelector("[data-slot='card-description']");
    expect(desc?.tagName).toBe("DIV");
  });
});

// ---------------------------------------------------------------------------
// 8. CardAction classes
// ---------------------------------------------------------------------------

describe("CardAction — classes", () => {
  it("has col-start-2 class (pins to 2nd grid column)", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardAction>
            <button>More</button>
          </CardAction>
        </CardHeader>
      </Card>
    );
    const action = container.querySelector("[data-slot='card-action']") as HTMLElement;
    expect(action.className).toContain("col-start-2");
  });

  it("has row-span-2 class (spans both title and description rows)", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardAction>
            <button>More</button>
          </CardAction>
        </CardHeader>
      </Card>
    );
    const action = container.querySelector("[data-slot='card-action']") as HTMLElement;
    expect(action.className).toContain("row-span-2");
  });

  it("has row-start-1 class", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardAction>
            <button>More</button>
          </CardAction>
        </CardHeader>
      </Card>
    );
    const action = container.querySelector("[data-slot='card-action']") as HTMLElement;
    expect(action.className).toContain("row-start-1");
  });

  it("has self-start class", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardAction>
            <button>More</button>
          </CardAction>
        </CardHeader>
      </Card>
    );
    const action = container.querySelector("[data-slot='card-action']") as HTMLElement;
    expect(action.className).toContain("self-start");
  });

  it("has justify-self-end class", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardAction>
            <button>More</button>
          </CardAction>
        </CardHeader>
      </Card>
    );
    const action = container.querySelector("[data-slot='card-action']") as HTMLElement;
    expect(action.className).toContain("justify-self-end");
  });

  it("renders action children", () => {
    render(
      <Card>
        <CardHeader>
          <CardAction>
            <button aria-label="More options">...</button>
          </CardAction>
        </CardHeader>
      </Card>
    );
    expect(screen.getByRole("button", { name: "More options" })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 9. CardContent classes and content
// ---------------------------------------------------------------------------

describe("CardContent — classes and content", () => {
  it("has px-5 class (default padding)", () => {
    const { container } = render(
      <Card>
        <CardContent />
      </Card>
    );
    const content = container.querySelector("[data-slot='card-content']") as HTMLElement;
    expect(content.className).toContain("px-5");
  });

  it("has group-data-[size=sm]/card:px-3 class", () => {
    const { container } = render(
      <Card>
        <CardContent />
      </Card>
    );
    const content = container.querySelector("[data-slot='card-content']") as HTMLElement;
    expect(content.className).toContain("group-data-[size=sm]/card:px-3");
  });

  it("renders content children", () => {
    render(
      <Card>
        <CardContent>
          <p>$4,820.00</p>
        </CardContent>
      </Card>
    );
    expect(screen.getByText("$4,820.00")).toBeInTheDocument();
  });

  it("is a <div> element", () => {
    const { container } = render(
      <Card>
        <CardContent />
      </Card>
    );
    const content = container.querySelector("[data-slot='card-content']");
    expect(content?.tagName).toBe("DIV");
  });
});

// ---------------------------------------------------------------------------
// 10. CardFooter classes and content
// ---------------------------------------------------------------------------

describe("CardFooter — classes and content", () => {
  it("has flex class", () => {
    const { container } = render(
      <Card>
        <CardFooter />
      </Card>
    );
    const footer = container.querySelector("[data-slot='card-footer']") as HTMLElement;
    expect(footer.className).toContain("flex");
  });

  it("has items-center class", () => {
    const { container } = render(
      <Card>
        <CardFooter />
      </Card>
    );
    const footer = container.querySelector("[data-slot='card-footer']") as HTMLElement;
    expect(footer.className).toContain("items-center");
  });

  it("has rounded-b-2xl class", () => {
    const { container } = render(
      <Card>
        <CardFooter />
      </Card>
    );
    const footer = container.querySelector("[data-slot='card-footer']") as HTMLElement;
    expect(footer.className).toContain("rounded-b-2xl");
  });

  it("has border-t class", () => {
    const { container } = render(
      <Card>
        <CardFooter />
      </Card>
    );
    const footer = container.querySelector("[data-slot='card-footer']") as HTMLElement;
    expect(footer.className).toContain("border-t");
  });

  it("has bg-muted/40 class", () => {
    const { container } = render(
      <Card>
        <CardFooter />
      </Card>
    );
    const footer = container.querySelector("[data-slot='card-footer']") as HTMLElement;
    expect(footer.className).toContain("bg-muted/40");
  });

  it("has px-5 class", () => {
    const { container } = render(
      <Card>
        <CardFooter />
      </Card>
    );
    const footer = container.querySelector("[data-slot='card-footer']") as HTMLElement;
    expect(footer.className).toContain("px-5");
  });

  it("has py-4 class", () => {
    const { container } = render(
      <Card>
        <CardFooter />
      </Card>
    );
    const footer = container.querySelector("[data-slot='card-footer']") as HTMLElement;
    expect(footer.className).toContain("py-4");
  });

  it("has group-data-[size=sm]/card:p-3 class", () => {
    const { container } = render(
      <Card>
        <CardFooter />
      </Card>
    );
    const footer = container.querySelector("[data-slot='card-footer']") as HTMLElement;
    expect(footer.className).toContain("group-data-[size=sm]/card:p-3");
  });

  it("renders footer children", () => {
    render(
      <Card>
        <CardFooter>
          <span>Last updated: today</span>
        </CardFooter>
      </Card>
    );
    expect(screen.getByText("Last updated: today")).toBeInTheDocument();
  });

  it("is a <div> element", () => {
    const { container } = render(
      <Card>
        <CardFooter />
      </Card>
    );
    const footer = container.querySelector("[data-slot='card-footer']");
    expect(footer?.tagName).toBe("DIV");
  });
});

// ---------------------------------------------------------------------------
// 11. className forwarding — all parts accept and merge custom className
// ---------------------------------------------------------------------------

describe("Card compound parts — className forwarding", () => {
  it("Card forwards custom className", () => {
    const { container } = render(<Card className="my-card-class" />);
    expect((container.firstChild as HTMLElement).className).toContain("my-card-class");
  });

  it("CardHeader forwards custom className", () => {
    const { container } = render(
      <Card>
        <CardHeader className="custom-header" />
      </Card>
    );
    const header = container.querySelector("[data-slot='card-header']") as HTMLElement;
    expect(header.className).toContain("custom-header");
  });

  it("CardTitle forwards custom className", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle className="custom-title">T</CardTitle>
        </CardHeader>
      </Card>
    );
    const title = container.querySelector("[data-slot='card-title']") as HTMLElement;
    expect(title.className).toContain("custom-title");
  });

  it("CardDescription forwards custom className", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardDescription className="custom-desc">D</CardDescription>
        </CardHeader>
      </Card>
    );
    const desc = container.querySelector("[data-slot='card-description']") as HTMLElement;
    expect(desc.className).toContain("custom-desc");
  });

  it("CardAction forwards custom className", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardAction className="custom-action">
            <button>A</button>
          </CardAction>
        </CardHeader>
      </Card>
    );
    const action = container.querySelector("[data-slot='card-action']") as HTMLElement;
    expect(action.className).toContain("custom-action");
  });

  it("CardContent forwards custom className", () => {
    const { container } = render(
      <Card>
        <CardContent className="custom-content" />
      </Card>
    );
    const content = container.querySelector("[data-slot='card-content']") as HTMLElement;
    expect(content.className).toContain("custom-content");
  });

  it("CardFooter forwards custom className", () => {
    const { container } = render(
      <Card>
        <CardFooter className="custom-footer" />
      </Card>
    );
    const footer = container.querySelector("[data-slot='card-footer']") as HTMLElement;
    expect(footer.className).toContain("custom-footer");
  });

  it("custom class merges with base classes — base classes remain", () => {
    const { container } = render(<Card className="my-extra-class" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("my-extra-class");
    expect(el.className).toContain("rounded-2xl");
    expect(el.className).toContain("bg-card");
  });
});

// ---------------------------------------------------------------------------
// 12. HTML attribute forwarding
// ---------------------------------------------------------------------------

describe("Card compound parts — HTML attribute forwarding", () => {
  it("Card forwards id attribute", () => {
    const { container } = render(<Card id="my-card" />);
    expect(container.firstChild).toHaveAttribute("id", "my-card");
  });

  it("Card forwards aria-label attribute", () => {
    const { container } = render(<Card aria-label="Monthly summary card" />);
    expect(container.firstChild).toHaveAttribute("aria-label", "Monthly summary card");
  });

  it("Card forwards data-testid attribute", () => {
    const { container } = render(<Card data-testid="test-card" />);
    expect(container.firstChild).toHaveAttribute("data-testid", "test-card");
  });

  it("CardHeader forwards id attribute", () => {
    const { container } = render(
      <Card>
        <CardHeader id="card-hdr" />
      </Card>
    );
    const header = container.querySelector("[data-slot='card-header']");
    expect(header).toHaveAttribute("id", "card-hdr");
  });

  it("CardFooter forwards aria-label attribute", () => {
    const { container } = render(
      <Card>
        <CardFooter aria-label="Card footer" />
      </Card>
    );
    const footer = container.querySelector("[data-slot='card-footer']");
    expect(footer).toHaveAttribute("aria-label", "Card footer");
  });

  it("CardContent forwards data-testid attribute", () => {
    const { container } = render(
      <Card>
        <CardContent data-testid="card-body" />
      </Card>
    );
    const content = container.querySelector("[data-slot='card-content']");
    expect(content).toHaveAttribute("data-testid", "card-body");
  });
});

// ---------------------------------------------------------------------------
// 13. Composition patterns from examples
// ---------------------------------------------------------------------------

describe("Card — composition patterns", () => {
  it("renders a content-only card (no header/footer) correctly", () => {
    render(
      <Card>
        <CardContent>
          <p>Deployment checklist</p>
        </CardContent>
      </Card>
    );
    expect(screen.getByText("Deployment checklist")).toBeInTheDocument();
  });

  it("renders header-only card (no footer/content) without crashing", () => {
    expect(() =>
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title only</CardTitle>
          </CardHeader>
        </Card>
      )
    ).not.toThrow();
  });

  it("renders card with title + description in header", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Project Alpha</CardTitle>
          <CardDescription>Active — 3 contributors</CardDescription>
        </CardHeader>
      </Card>
    );
    expect(screen.getByText("Project Alpha")).toBeInTheDocument();
    expect(screen.getByText("Active — 3 contributors")).toBeInTheDocument();
  });

  it("renders card with action button in header", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
          <CardDescription>Last 30 days</CardDescription>
          <CardAction>
            <button>View report</button>
          </CardAction>
        </CardHeader>
      </Card>
    );
    expect(screen.getByRole("button", { name: "View report" })).toBeInTheDocument();
  });

  it("renders card with icon-only action button (aria-label)", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Active Users</CardTitle>
          <CardAction>
            <button aria-label="More options">...</button>
          </CardAction>
        </CardHeader>
      </Card>
    );
    expect(screen.getByRole("button", { name: "More options" })).toBeInTheDocument();
  });

  it("CardAction is accessible via its button child", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>T</CardTitle>
          <CardAction>
            <button aria-label="View all details">View all</button>
          </CardAction>
        </CardHeader>
      </Card>
    );
    expect(
      screen.getByRole("button", { name: "View all details" })
    ).toBeInTheDocument();
  });

  it("multiple cards render independently without conflict", () => {
    render(
      <>
        <Card data-testid="card-a">
          <CardContent>Card A</CardContent>
        </Card>
        <Card data-testid="card-b">
          <CardContent>Card B</CardContent>
        </Card>
      </>
    );
    expect(screen.getByText("Card A")).toBeInTheDocument();
    expect(screen.getByText("Card B")).toBeInTheDocument();
  });

  it("multiple cards each have independent size attributes", () => {
    const { container } = render(
      <>
        <Card size="default" data-testid="large" />
        <Card size="sm" data-testid="small" />
      </>
    );
    const cards = container.querySelectorAll("[data-slot='card']");
    expect(cards[0]).toHaveAttribute("data-size", "default");
    expect(cards[1]).toHaveAttribute("data-size", "sm");
  });

  it("renders a with-image pattern (img as first child) without crashing", () => {
    expect(() =>
      render(
        <Card>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://example.com/img.jpg" alt="Test landscape" />
          <CardHeader>
            <CardTitle>Mountain Retreat</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Scenic alpine getaway.</p>
          </CardContent>
          <CardFooter>
            <span>$320 / night</span>
          </CardFooter>
        </Card>
      )
    ).not.toThrow();
  });

  it("renders full card (default example) with all parts", () => {
    const { container } = renderFullCard("default");
    expect(container.querySelector("[data-slot='card']")).toBeInTheDocument();
    expect(container.querySelector("[data-slot='card-header']")).toBeInTheDocument();
    expect(container.querySelector("[data-slot='card-title']")).toBeInTheDocument();
    expect(container.querySelector("[data-slot='card-description']")).toBeInTheDocument();
    expect(container.querySelector("[data-slot='card-action']")).toBeInTheDocument();
    expect(container.querySelector("[data-slot='card-content']")).toBeInTheDocument();
    expect(container.querySelector("[data-slot='card-footer']")).toBeInTheDocument();
  });

  it("renders full card (sm size) with all parts", () => {
    const { container } = renderFullCard("sm");
    expect(container.querySelector("[data-slot='card']")).toHaveAttribute("data-size", "sm");
    expect(container.querySelector("[data-slot='card-footer']")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 14. Grid layout usage (multiple sm cards)
// ---------------------------------------------------------------------------

describe("Card — grid layout usage", () => {
  it("renders 3 size='sm' cards in a grid without crashing", () => {
    const metrics = [
      { title: "Total Users", description: "Registered accounts" },
      { title: "Orders", description: "Placed this week" },
      { title: "In Transit", description: "Active shipments" },
    ];
    expect(() =>
      render(
        <div>
          {metrics.map(({ title, description }) => (
            <Card key={title} size="sm">
              <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Value</p>
              </CardContent>
              <CardFooter>
                <span>Updated</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )
    ).not.toThrow();
  });

  it("each card in grid has correct data-size='sm'", () => {
    const { container } = render(
      <>
        <Card size="sm" data-testid="c1" />
        <Card size="sm" data-testid="c2" />
        <Card size="sm" data-testid="c3" />
      </>
    );
    container.querySelectorAll("[data-slot='card']").forEach((c) => {
      expect(c).toHaveAttribute("data-size", "sm");
    });
  });
});

// ---------------------------------------------------------------------------
// 15. Re-render / prop updates
// ---------------------------------------------------------------------------

describe("Card — re-render behavior", () => {
  it("updates size attribute on re-render", () => {
    const { container, rerender } = render(<Card size="default" />);
    expect(container.firstChild).toHaveAttribute("data-size", "default");

    rerender(<Card size="sm" />);
    expect(container.firstChild).toHaveAttribute("data-size", "sm");
  });

  it("updates children content on re-render", () => {
    const { rerender } = render(
      <Card>
        <CardContent>original</CardContent>
      </Card>
    );
    expect(screen.getByText("original")).toBeInTheDocument();

    rerender(
      <Card>
        <CardContent>updated</CardContent>
      </Card>
    );
    expect(screen.getByText("updated")).toBeInTheDocument();
    expect(screen.queryByText("original")).not.toBeInTheDocument();
  });

  it("updates custom className on re-render", () => {
    const { container, rerender } = render(<Card className="class-a" />);
    expect((container.firstChild as HTMLElement).className).toContain("class-a");

    rerender(<Card className="class-b" />);
    expect((container.firstChild as HTMLElement).className).toContain("class-b");
    expect((container.firstChild as HTMLElement).className).not.toContain("class-a");
  });
});

// ---------------------------------------------------------------------------
// 16. Nesting and children type coverage
// ---------------------------------------------------------------------------

describe("Card — nesting and children variety", () => {
  it("accepts string children in CardTitle", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Plain string title</CardTitle>
        </CardHeader>
      </Card>
    );
    expect(screen.getByText("Plain string title")).toBeInTheDocument();
  });

  it("accepts element children in CardContent", () => {
    render(
      <Card>
        <CardContent>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </CardContent>
      </Card>
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("CardFooter accepts multiple children", () => {
    render(
      <Card>
        <CardFooter>
          <span>Left text</span>
          <span className="ml-auto">Right text</span>
        </CardFooter>
      </Card>
    );
    expect(screen.getByText("Left text")).toBeInTheDocument();
    expect(screen.getByText("Right text")).toBeInTheDocument();
  });

  it("CardHeader can contain title and description only (no action)", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>T</CardTitle>
          <CardDescription>D</CardDescription>
        </CardHeader>
      </Card>
    );
    expect(screen.getByText("T")).toBeInTheDocument();
    expect(screen.getByText("D")).toBeInTheDocument();
  });

  it("Card renders with no children (empty)", () => {
    const { container } = render(<Card />);
    const card = container.querySelector("[data-slot='card']") as HTMLElement;
    expect(card.children).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// 17. Accessibility — axe
// ---------------------------------------------------------------------------

describe("Card — accessibility (axe)", () => {
  it("bare Card has no axe violations", async () => {
    // aria-label on a plain <div> is not permitted — wrap card in a landmark
    const { container } = render(
      <main>
        <section aria-label="Bare card">
          <Card />
        </section>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("fully-composed default card has no axe violations", async () => {
    // Card renders as a plain <div> — do not put aria-label on it directly
    const { container } = render(
      <main>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Summary</CardTitle>
            <CardDescription>Overview for May 2026</CardDescription>
            <CardAction>
              <button aria-label="View all reports">View all</button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p>$4,820.00</p>
          </CardContent>
          <CardFooter>
            <span>Last updated: today</span>
          </CardFooter>
        </Card>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("size='sm' card has no axe violations", async () => {
    const { container } = render(
      <main>
        <Card size="sm">
          <CardHeader>
            <CardTitle>Project Alpha</CardTitle>
            <CardDescription>Active — 3 contributors</CardDescription>
          </CardHeader>
          <CardContent>
            <p>A compact card.</p>
          </CardContent>
          <CardFooter>
            <span>Updated 2 hours ago</span>
          </CardFooter>
        </Card>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("content-only card has no axe violations", async () => {
    const { container } = render(
      <main>
        <Card>
          <CardContent>
            <p>Uptime</p>
            <p>99.9%</p>
          </CardContent>
        </Card>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("card with icon-only action button (aria-label) has no axe violations", async () => {
    const { container } = render(
      <main>
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
            <CardDescription>This week</CardDescription>
            <CardAction>
              <button aria-label="More options for Active Users">...</button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p>1,042</p>
          </CardContent>
        </Card>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("multiple cards in a grid have no axe violations", async () => {
    const { container } = render(
      <main>
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p>$18,240</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p>1,042</p>
          </CardContent>
        </Card>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("card with with-image pattern has no axe violations", async () => {
    const { container } = render(
      <main>
        <Card>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://example.com/img.jpg" alt="Mountain landscape" />
          <CardHeader>
            <CardTitle>Mountain Retreat</CardTitle>
            <CardDescription>Elevation 2,400 m</CardDescription>
          </CardHeader>
          <CardContent>
            <p>A scenic alpine getaway.</p>
          </CardContent>
          <CardFooter>
            <span>$320 / night</span>
          </CardFooter>
        </Card>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// 18. Structural / DOM assertions
// ---------------------------------------------------------------------------

describe("Card — DOM structure", () => {
  it("all compound parts are contained within the Card root", () => {
    const { container } = renderFullCard();
    const card = container.querySelector("[data-slot='card']") as HTMLElement;
    expect(within(card).getByText("Card Title")).toBeInTheDocument();
    expect(within(card).getByText("Card description text")).toBeInTheDocument();
    expect(within(card).getByText("Content area")).toBeInTheDocument();
    expect(within(card).getByText("Footer text")).toBeInTheDocument();
  });

  it("CardHeader is a direct child of Card", () => {
    const { container } = render(
      <Card>
        <CardHeader />
      </Card>
    );
    const card = container.querySelector("[data-slot='card']") as HTMLElement;
    const header = card.querySelector("[data-slot='card-header']");
    expect(header?.parentElement).toBe(card);
  });

  it("CardContent is a direct child of Card", () => {
    const { container } = render(
      <Card>
        <CardContent />
      </Card>
    );
    const card = container.querySelector("[data-slot='card']") as HTMLElement;
    const content = card.querySelector("[data-slot='card-content']");
    expect(content?.parentElement).toBe(card);
  });

  it("CardFooter is a direct child of Card", () => {
    const { container } = render(
      <Card>
        <CardFooter />
      </Card>
    );
    const card = container.querySelector("[data-slot='card']") as HTMLElement;
    const footer = card.querySelector("[data-slot='card-footer']");
    expect(footer?.parentElement).toBe(card);
  });

  it("CardTitle is inside CardHeader", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>T</CardTitle>
        </CardHeader>
      </Card>
    );
    const header = container.querySelector("[data-slot='card-header']") as HTMLElement;
    const title = header.querySelector("[data-slot='card-title']");
    expect(title).toBeInTheDocument();
  });

  it("CardDescription is inside CardHeader", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardDescription>D</CardDescription>
        </CardHeader>
      </Card>
    );
    const header = container.querySelector("[data-slot='card-header']") as HTMLElement;
    const desc = header.querySelector("[data-slot='card-description']");
    expect(desc).toBeInTheDocument();
  });

  it("CardAction is inside CardHeader", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardAction>
            <button>A</button>
          </CardAction>
        </CardHeader>
      </Card>
    );
    const header = container.querySelector("[data-slot='card-header']") as HTMLElement;
    const action = header.querySelector("[data-slot='card-action']");
    expect(action).toBeInTheDocument();
  });

  it("container has exactly 1 card root element", () => {
    const { container } = render(<Card />);
    expect(container.querySelectorAll("[data-slot='card']")).toHaveLength(1);
  });

  it("Card renders a single root div (no extra wrapper)", () => {
    const { container } = render(<Card />);
    expect(container.children).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// 19. CardPanel — form/content body inside a Card
// ---------------------------------------------------------------------------

describe("CardPanel — classes and content", () => {
  it("has data-slot='card-panel'", () => {
    const { container } = render(
      <Card>
        <CardPanel>body</CardPanel>
      </Card>
    );
    expect(
      container.querySelector("[data-slot='card-panel']")
    ).toBeInTheDocument();
  });

  it("has flex-1 class (fills remaining height)", () => {
    const { container } = render(
      <Card>
        <CardPanel />
      </Card>
    );
    const panel = container.querySelector(
      "[data-slot='card-panel']"
    ) as HTMLElement;
    expect(panel.className).toContain("flex-1");
  });

  it("has px-5 class (default padding)", () => {
    const { container } = render(
      <Card>
        <CardPanel />
      </Card>
    );
    const panel = container.querySelector(
      "[data-slot='card-panel']"
    ) as HTMLElement;
    expect(panel.className).toContain("px-5");
  });

  it("has group-data-[size=sm]/card:px-3 class", () => {
    const { container } = render(
      <Card>
        <CardPanel />
      </Card>
    );
    const panel = container.querySelector(
      "[data-slot='card-panel']"
    ) as HTMLElement;
    expect(panel.className).toContain("group-data-[size=sm]/card:px-3");
  });

  it("renders children", () => {
    render(
      <Card>
        <CardPanel>
          <p>Deploy form</p>
        </CardPanel>
      </Card>
    );
    expect(screen.getByText("Deploy form")).toBeInTheDocument();
  });

  it("forwards custom className", () => {
    const { container } = render(
      <Card>
        <CardPanel className="custom-panel" />
      </Card>
    );
    const panel = container.querySelector(
      "[data-slot='card-panel']"
    ) as HTMLElement;
    expect(panel.className).toContain("custom-panel");
  });

  it("forwards HTML attributes", () => {
    const { container } = render(
      <Card>
        <CardPanel id="panel-1" data-testid="panel" />
      </Card>
    );
    const panel = container.querySelector("[data-slot='card-panel']");
    expect(panel).toHaveAttribute("id", "panel-1");
    expect(panel).toHaveAttribute("data-testid", "panel");
  });
});

// ---------------------------------------------------------------------------
// 20. CardFrame family — framed (inset panel) variant
// ---------------------------------------------------------------------------

describe("CardFrame — outer frame wrapper", () => {
  it("has data-slot='card-frame'", () => {
    const { container } = render(<CardFrame />);
    expect(container.firstChild).toHaveAttribute("data-slot", "card-frame");
  });

  it("is a <div> element", () => {
    const { container } = render(<CardFrame />);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("has muted frame surface (bg-muted/40)", () => {
    const { container } = render(<CardFrame />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "bg-muted/40"
    );
  });

  it("has rounded-2xl class", () => {
    const { container } = render(<CardFrame />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "rounded-2xl"
    );
  });

  it("elevates with edge (no hard border)", () => {
    const { container } = render(<CardFrame />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("edge");
    expect(cls).not.toContain("border-border");
  });

  it("has group/card-frame class", () => {
    const { container } = render(<CardFrame />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "group/card-frame"
    );
  });

  it("squares the inset card to rounded-xl via child selector", () => {
    const { container } = render(<CardFrame />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "*:data-[slot=card]:rounded-xl"
    );
  });

  it("renders an inset Card child", () => {
    const { container } = render(
      <CardFrame>
        <Card>
          <CardPanel>inside</CardPanel>
        </Card>
      </CardFrame>
    );
    const frame = container.querySelector("[data-slot='card-frame']");
    expect(frame?.querySelector("[data-slot='card']")).toBeInTheDocument();
    expect(screen.getByText("inside")).toBeInTheDocument();
  });

  it("forwards custom className and HTML attributes", () => {
    const { container } = render(
      <CardFrame className="custom-frame" id="frame-1" />
    );
    const frame = container.firstChild as HTMLElement;
    expect(frame.className).toContain("custom-frame");
    expect(frame).toHaveAttribute("id", "frame-1");
  });
});

describe("CardFrameHeader / Title / Description / Action / Footer", () => {
  it("CardFrameHeader has data-slot and action-aware grid class", () => {
    const { container } = render(<CardFrameHeader />);
    const el = container.querySelector("[data-slot='card-frame-header']") as
      | HTMLElement
      | null;
    expect(el).toBeInTheDocument();
    expect(el?.className).toContain(
      "has-data-[slot=card-frame-action]:grid-cols-[1fr_auto]"
    );
  });

  it("CardFrameTitle has data-slot, is font-medium (never bold), renders text", () => {
    render(<CardFrameTitle>Create project</CardFrameTitle>);
    const title = screen.getByText("Create project");
    expect(title).toHaveAttribute("data-slot", "card-frame-title");
    expect(title.className).toContain("font-medium");
    expect(title.className).not.toContain("font-bold");
    expect(title.className).not.toContain("font-semibold");
  });

  it("CardFrameDescription has data-slot, muted text, renders text", () => {
    render(<CardFrameDescription>Manage your projects</CardFrameDescription>);
    const desc = screen.getByText("Manage your projects");
    expect(desc).toHaveAttribute("data-slot", "card-frame-description");
    expect(desc.className).toContain("text-muted-foreground");
  });

  it("CardFrameAction has data-slot and pins to the second column", () => {
    const { container } = render(
      <CardFrameAction>
        <button>Add</button>
      </CardFrameAction>
    );
    const action = container.querySelector(
      "[data-slot='card-frame-action']"
    ) as HTMLElement;
    expect(action).toBeInTheDocument();
    expect(action.className).toContain("col-start-2");
    expect(action.className).toContain("justify-self-end");
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("CardFrameFooter has data-slot and renders children", () => {
    render(
      <CardFrameFooter>
        <span>This will take a few seconds.</span>
      </CardFrameFooter>
    );
    const footer = screen.getByText("This will take a few seconds.");
    expect(footer.parentElement).toHaveAttribute(
      "data-slot",
      "card-frame-footer"
    );
  });

  it("all frame parts forward custom className", () => {
    const { container } = render(
      <CardFrame className="f">
        <CardFrameHeader className="h">
          <CardFrameTitle className="t">T</CardFrameTitle>
          <CardFrameDescription className="d">D</CardFrameDescription>
          <CardFrameAction className="a">
            <button>A</button>
          </CardFrameAction>
        </CardFrameHeader>
        <CardFrameFooter className="ft">F</CardFrameFooter>
      </CardFrame>
    );
    expect(
      (container.querySelector("[data-slot='card-frame']") as HTMLElement)
        .className
    ).toContain("f");
    expect(
      (
        container.querySelector(
          "[data-slot='card-frame-header']"
        ) as HTMLElement
      ).className
    ).toContain("h");
    expect(
      (container.querySelector("[data-slot='card-frame-title']") as HTMLElement)
        .className
    ).toContain("t");
    expect(
      (
        container.querySelector(
          "[data-slot='card-frame-description']"
        ) as HTMLElement
      ).className
    ).toContain("d");
    expect(
      (
        container.querySelector(
          "[data-slot='card-frame-action']"
        ) as HTMLElement
      ).className
    ).toContain("a");
    expect(
      (
        container.querySelector(
          "[data-slot='card-frame-footer']"
        ) as HTMLElement
      ).className
    ).toContain("ft");
  });
});

describe("CardFrame — composition & accessibility (axe)", () => {
  it("renders a frame with header + inset card panel (header-above pattern)", () => {
    const { container } = render(
      <CardFrame>
        <CardFrameHeader>
          <CardFrameTitle>Create project</CardFrameTitle>
          <CardFrameDescription>Deploy in one click.</CardFrameDescription>
        </CardFrameHeader>
        <Card>
          <CardPanel>
            <p>form</p>
          </CardPanel>
        </Card>
      </CardFrame>
    );
    expect(
      container.querySelector("[data-slot='card-frame-header']")
    ).toBeInTheDocument();
    expect(container.querySelector("[data-slot='card-panel']")).toBeInTheDocument();
    expect(screen.getByText("Create project")).toBeInTheDocument();
  });

  it("renders a frame with footnote below the panel (footer pattern)", () => {
    render(
      <CardFrame>
        <Card>
          <CardHeader>
            <CardTitle>Create project</CardTitle>
          </CardHeader>
          <CardPanel>
            <p>form</p>
          </CardPanel>
        </Card>
        <CardFrameFooter>
          <span>This will take a few seconds.</span>
        </CardFrameFooter>
      </CardFrame>
    );
    expect(screen.getByText("This will take a few seconds.")).toBeInTheDocument();
  });

  it("framed form has no axe violations", async () => {
    const { container } = render(
      <main>
        <CardFrame>
          <CardFrameHeader>
            <CardFrameTitle>Create project</CardFrameTitle>
            <CardFrameDescription>Deploy in one click.</CardFrameDescription>
          </CardFrameHeader>
          <Card>
            <CardPanel>
              <form className="flex flex-col gap-2">
                <label htmlFor="project-name">Name</label>
                <input id="project-name" type="text" placeholder="Project" />
              </form>
            </CardPanel>
          </Card>
        </CardFrame>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("framed empty-state with header action has no axe violations", async () => {
    const { container } = render(
      <main>
        <CardFrame>
          <CardFrameHeader>
            <CardFrameTitle>Project</CardFrameTitle>
            <CardFrameDescription>Manage your projects</CardFrameDescription>
            <CardFrameAction>
              <button>Add</button>
            </CardFrameAction>
          </CardFrameHeader>
          <Card>
            <CardPanel>
              <p>No projects yet</p>
            </CardPanel>
          </Card>
        </CardFrame>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
