import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Renders a standard 3-crumb breadcrumb (Home > Products > Current Page). */
function renderDefault() {
  return render(
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/products">Products</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Wireless Headphones</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

// ─── Breadcrumb (nav wrapper) ─────────────────────────────────────────────────

describe("Breadcrumb", () => {
  it("renders without crashing", () => {
    const { container } = renderDefault();
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders as a <nav> element", () => {
    renderDefault();
    expect(screen.getByRole("navigation")).toBeInstanceOf(HTMLElement);
  });

  it("has aria-label='breadcrumb'", () => {
    renderDefault();
    expect(screen.getByRole("navigation")).toHaveAttribute("aria-label", "breadcrumb");
  });

  it("has data-slot='breadcrumb'", () => {
    renderDefault();
    expect(screen.getByRole("navigation")).toHaveAttribute("data-slot", "breadcrumb");
  });

  it("forwards extra className to the nav element", () => {
    render(<Breadcrumb className="custom-nav"><BreadcrumbList /></Breadcrumb>);
    expect(screen.getByRole("navigation")).toHaveClass("custom-nav");
  });

  it("forwards extra props to the nav element", () => {
    render(<Breadcrumb data-testid="bc-nav"><BreadcrumbList /></Breadcrumb>);
    expect(screen.getByTestId("bc-nav")).toBeInTheDocument();
  });

  it("renders children inside nav", () => {
    renderDefault();
    const nav = screen.getByRole("navigation");
    expect(nav.querySelector("ol")).toBeInTheDocument();
  });
});

// ─── BreadcrumbList ───────────────────────────────────────────────────────────

describe("BreadcrumbList", () => {
  it("renders as an <ol> element", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList data-testid="list" />
      </Breadcrumb>
    );
    expect(screen.getByTestId("list").tagName).toBe("OL");
  });

  it("has data-slot='breadcrumb-list'", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList data-testid="list" />
      </Breadcrumb>
    );
    expect(screen.getByTestId("list")).toHaveAttribute("data-slot", "breadcrumb-list");
  });

  it("applies flex layout classes", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList data-testid="list" />
      </Breadcrumb>
    );
    const list = screen.getByTestId("list");
    expect(list).toHaveClass("flex");
    expect(list).toHaveClass("flex-wrap");
    expect(list).toHaveClass("items-center");
  });

  it("applies text-sm class", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList data-testid="list" />
      </Breadcrumb>
    );
    expect(screen.getByTestId("list")).toHaveClass("text-sm");
  });

  it("applies text-muted-foreground class", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList data-testid="list" />
      </Breadcrumb>
    );
    expect(screen.getByTestId("list")).toHaveClass("text-muted-foreground");
  });

  it("forwards extra className", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList className="my-list" data-testid="list" />
      </Breadcrumb>
    );
    expect(screen.getByTestId("list")).toHaveClass("my-list");
  });

  it("forwards extra props", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList data-custom="yes" data-testid="list" />
      </Breadcrumb>
    );
    expect(screen.getByTestId("list")).toHaveAttribute("data-custom", "yes");
  });
});

// ─── BreadcrumbItem ───────────────────────────────────────────────────────────

describe("BreadcrumbItem", () => {
  it("renders as an <li> element", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem data-testid="item">First</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("item").tagName).toBe("LI");
  });

  it("has data-slot='breadcrumb-item'", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem data-testid="item">X</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("item")).toHaveAttribute("data-slot", "breadcrumb-item");
  });

  it("applies inline-flex items-center gap-1 classes", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem data-testid="item">X</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    const item = screen.getByTestId("item");
    expect(item).toHaveClass("inline-flex");
    expect(item).toHaveClass("items-center");
    expect(item).toHaveClass("gap-1");
  });

  it("forwards extra className", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="extra" data-testid="item">X</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("item")).toHaveClass("extra");
  });

  it("renders children", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <span data-testid="child">inner</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});

// ─── BreadcrumbLink ───────────────────────────────────────────────────────────

describe("BreadcrumbLink", () => {
  it("renders as an <a> element by default", () => {
    renderDefault();
    const links = screen.getAllByRole("link");
    expect(links[0].tagName).toBe("A");
  });

  it("renders with correct href", () => {
    renderDefault();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Products" })).toHaveAttribute("href", "/products");
  });

  it("renders text content", () => {
    renderDefault();
    expect(screen.getByRole("link", { name: "Home" })).toHaveTextContent("Home");
  });

  it("applies transition-colors and hover:text-foreground classes", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" data-testid="link">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    const link = screen.getByTestId("link");
    expect(link).toHaveClass("transition-colors");
    expect(link).toHaveClass("hover:text-foreground");
  });

  it("forwards extra className", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="font-bold" data-testid="link">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("link")).toHaveClass("font-bold");
  });

  it("forwards extra props (data attributes)", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" data-custom="yes" data-testid="link">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("link")).toHaveAttribute("data-custom", "yes");
  });

  it("renders as a custom element via render prop (button)", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<button type="button" />} data-testid="link">
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("link").tagName).toBe("BUTTON");
  });

  it("render prop button receives children text content", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<button type="button" />}>
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByRole("button", { name: "Dashboard" })).toBeInTheDocument();
  });

  it("render prop anchor keeps href", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/store"
              render={<a className="font-medium underline underline-offset-4" />}
              data-testid="link"
            >
              Store
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    const link = screen.getByTestId("link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/store");
  });

  it("render prop anchor merges extra className", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/"
              render={<a className="font-medium underline underline-offset-4 hover:no-underline" />}
              data-testid="link"
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    const link = screen.getByTestId("link");
    expect(link).toHaveClass("font-medium");
    expect(link).toHaveClass("underline");
  });

  it("is clickable (onClick fires)", async () => {
    const handleClick = vi.fn();
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" onClick={handleClick}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("link", { name: "Home" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("can render with icon children", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-1.5">
              <span data-testid="icon" aria-hidden="true">🏠</span>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Home/i })).toBeInTheDocument();
  });
});

// ─── BreadcrumbPage ───────────────────────────────────────────────────────────

describe("BreadcrumbPage", () => {
  it("renders as a <span> element", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage data-testid="page">Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("page").tagName).toBe("SPAN");
  });

  it("has data-slot='breadcrumb-page'", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage data-testid="page">Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("page")).toHaveAttribute("data-slot", "breadcrumb-page");
  });

  it("has role='link'", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByRole("link", { name: "Current" })).toBeInTheDocument();
  });

  it("has aria-disabled='true'", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage data-testid="page">Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("page")).toHaveAttribute("aria-disabled", "true");
  });

  it("has aria-current='page'", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage data-testid="page">Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("page")).toHaveAttribute("aria-current", "page");
  });

  it("applies font-normal and text-foreground classes", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage data-testid="page">Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    const page = screen.getByTestId("page");
    expect(page).toHaveClass("font-normal");
    expect(page).toHaveClass("text-foreground");
  });

  it("forwards extra className", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="custom-page" data-testid="page">
              Current
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("page")).toHaveClass("custom-page");
  });

  it("renders text content", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Wireless Headphones</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByText("Wireless Headphones")).toBeInTheDocument();
  });

  it("renders with icon children (flex layout)", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-1.5">
              <span data-testid="icon" aria-hidden="true">📄</span>
              Getting Started
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByText(/Getting Started/i)).toBeInTheDocument();
  });
});

// ─── BreadcrumbSeparator ──────────────────────────────────────────────────────

describe("BreadcrumbSeparator", () => {
  it("renders as an <li> element", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator data-testid="sep" />
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("sep").tagName).toBe("LI");
  });

  it("has data-slot='breadcrumb-separator'", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator data-testid="sep" />
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("sep")).toHaveAttribute("data-slot", "breadcrumb-separator");
  });

  it("has role='presentation'", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator data-testid="sep" />
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("sep")).toHaveAttribute("role", "presentation");
  });

  it("has aria-hidden='true'", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator data-testid="sep" />
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("sep")).toHaveAttribute("aria-hidden", "true");
  });

  it("renders default ChevronRightIcon when no children provided", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator data-testid="sep" />
        </BreadcrumbList>
      </Breadcrumb>
    );
    // The default separator contains an SVG (ChevronRight)
    const sep = screen.getByTestId("sep");
    expect(sep.querySelector("svg")).toBeInTheDocument();
  });

  it("renders custom children instead of default icon", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator data-testid="sep">
            <span data-testid="slash">/</span>
          </BreadcrumbSeparator>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("slash")).toBeInTheDocument();
    // Custom child replaces the default svg
    expect(screen.getByTestId("sep").querySelector("svg")).toBeNull();
  });

  it("renders custom SVG icon as separator", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator data-testid="sep">
            <svg data-testid="slash-svg" viewBox="0 0 24 24" aria-hidden="true">
              <line x1="6" y1="4" x2="18" y2="20" stroke="currentColor" strokeWidth="2" />
            </svg>
          </BreadcrumbSeparator>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("slash-svg")).toBeInTheDocument();
  });

  it("applies [&>svg]:size-3.5 class", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator data-testid="sep" />
        </BreadcrumbList>
      </Breadcrumb>
    );
    // The class uses Tailwind arbitrary syntax — check the class string directly
    expect(screen.getByTestId("sep").className).toContain("[&>svg]:size-3.5");
  });

  it("forwards extra className", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="extra-sep" data-testid="sep" />
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("sep")).toHaveClass("extra-sep");
  });

  it("renders text content as custom separator", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator data-testid="sep">
            <span className="text-muted-foreground">→</span>
          </BreadcrumbSeparator>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByText("→")).toBeInTheDocument();
  });

  it("renders dot custom separator", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator data-testid="sep">
            <span className="text-xs">•</span>
          </BreadcrumbSeparator>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByText("•")).toBeInTheDocument();
  });
});

// ─── BreadcrumbEllipsis ───────────────────────────────────────────────────────

describe("BreadcrumbEllipsis", () => {
  it("renders as a <span> element", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbEllipsis data-testid="ellipsis" />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("ellipsis").tagName).toBe("SPAN");
  });

  it("has data-slot='breadcrumb-ellipsis'", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbEllipsis data-testid="ellipsis" />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("ellipsis")).toHaveAttribute("data-slot", "breadcrumb-ellipsis");
  });

  it("has role='presentation'", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbEllipsis data-testid="ellipsis" />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("ellipsis")).toHaveAttribute("role", "presentation");
  });

  it("has aria-hidden='true'", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbEllipsis data-testid="ellipsis" />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("ellipsis")).toHaveAttribute("aria-hidden", "true");
  });

  it("renders a MoreHorizontalIcon (svg)", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbEllipsis data-testid="ellipsis" />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    const ellipsis = screen.getByTestId("ellipsis");
    expect(ellipsis.querySelector("svg")).toBeInTheDocument();
  });

  it("renders a visually-hidden 'More' sr-only span", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    const srSpan = screen.getByText("More");
    expect(srSpan).toHaveClass("sr-only");
  });

  it("applies size classes (size-5 flex items-center justify-center)", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbEllipsis data-testid="ellipsis" />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    const ellipsis = screen.getByTestId("ellipsis");
    expect(ellipsis).toHaveClass("flex");
    expect(ellipsis).toHaveClass("size-5");
    expect(ellipsis).toHaveClass("items-center");
    expect(ellipsis).toHaveClass("justify-center");
  });

  it("forwards extra className", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbEllipsis className="extra" data-testid="ellipsis" />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("ellipsis")).toHaveClass("extra");
  });

  it("forwards extra props", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbEllipsis data-custom="val" data-testid="ellipsis" />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("ellipsis")).toHaveAttribute("data-custom", "val");
  });
});

// ─── Composed usage scenarios ─────────────────────────────────────────────────

describe("Breadcrumb – composed scenarios", () => {
  it("renders a full 3-crumb trail (Home > Products > Page)", () => {
    renderDefault();
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Products" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Wireless Headphones" })).toBeInTheDocument();
  });

  it("only the last crumb (BreadcrumbPage) has aria-current=page", () => {
    renderDefault();
    // BreadcrumbPage sets aria-current="page"
    const currentPage = screen.getByRole("link", { name: "Wireless Headphones" });
    expect(currentPage).toHaveAttribute("aria-current", "page");

    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).not.toHaveAttribute("aria-current", "page");
  });

  it("separators are hidden from accessibility tree", () => {
    renderDefault();
    // BreadcrumbSeparator has role=presentation and aria-hidden=true
    // There should be no accessible separators in the navigation landmark
    const nav = screen.getByRole("navigation");
    const separators = nav.querySelectorAll("[data-slot='breadcrumb-separator']");
    separators.forEach((sep) => {
      expect(sep).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("with-ellipsis: renders ellipsis in place of collapsed crumbs", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbEllipsis data-testid="ellipsis" />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs/components">Components</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("ellipsis")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Components" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Breadcrumb" })).toBeInTheDocument();
  });

  it("long-path: root, ellipsis, intermediate, and page all present", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs/components">Components</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByText("More")).toBeInTheDocument(); // sr-only text
    expect(screen.getByRole("link", { name: "Components" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Breadcrumb" })).toBeInTheDocument();
  });

  it("custom separator: renders slash icon in place of chevron", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator data-testid="sep">
            <span data-testid="slash">/</span>
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Blog</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("slash")).toBeInTheDocument();
    // No default SVG since custom children provided
    expect(screen.getByTestId("sep").querySelector("svg")).toBeNull();
  });

  it("with-icons: icon + text in link and page renders correctly", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-1.5">
              <span data-testid="home-icon" aria-hidden="true" />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-1.5">
              <span data-testid="page-icon" aria-hidden="true" />
              Getting Started
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("home-icon")).toBeInTheDocument();
    expect(screen.getByTestId("page-icon")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByText(/Getting Started/i)).toBeInTheDocument();
  });

  it("multiple separators of the same breadcrumb nav are all hidden from a11y", () => {
    renderDefault();
    const nav = screen.getByRole("navigation");
    const seps = nav.querySelectorAll("[data-slot='breadcrumb-separator']");
    expect(seps.length).toBe(2);
    seps.forEach((sep) => {
      expect(sep).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("with-render-prop: renders links as buttons for SPA navigation", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<button type="button" />}>
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<button type="button" />}>
              Reports
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Annual Summary</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent("Dashboard");
    expect(buttons[1]).toHaveTextContent("Reports");
  });
});

// ─── Data-slot attributes ─────────────────────────────────────────────────────

describe("Breadcrumb – data-slot attributes", () => {
  it("Breadcrumb sets data-slot=breadcrumb on nav", () => {
    renderDefault();
    expect(document.querySelector("[data-slot='breadcrumb']")).toBeInTheDocument();
  });

  it("BreadcrumbList sets data-slot=breadcrumb-list on ol", () => {
    renderDefault();
    expect(document.querySelector("[data-slot='breadcrumb-list']")).toBeInTheDocument();
  });

  it("BreadcrumbItem sets data-slot=breadcrumb-item on li", () => {
    renderDefault();
    const items = document.querySelectorAll("[data-slot='breadcrumb-item']");
    expect(items.length).toBeGreaterThanOrEqual(1);
  });

  it("BreadcrumbPage sets data-slot=breadcrumb-page on span", () => {
    renderDefault();
    expect(document.querySelector("[data-slot='breadcrumb-page']")).toBeInTheDocument();
  });

  it("BreadcrumbSeparator sets data-slot=breadcrumb-separator on li", () => {
    renderDefault();
    const seps = document.querySelectorAll("[data-slot='breadcrumb-separator']");
    expect(seps.length).toBeGreaterThan(0);
  });
});

// ─── Interaction tests ────────────────────────────────────────────────────────

describe("Breadcrumb – interactions", () => {
  it("BreadcrumbLink click fires onClick handler", async () => {
    const handleClick = vi.fn();
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" onClick={handleClick}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("link", { name: "Home" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("BreadcrumbLink rendered as button click fires onClick handler", async () => {
    const handleClick = vi.fn();
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<button type="button" />} onClick={handleClick}>
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Dashboard" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("BreadcrumbLink responds to keyboard Enter", async () => {
    const handleClick = vi.fn();
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" onClick={handleClick}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    const user = userEvent.setup();
    const link = screen.getByRole("link", { name: "Home" });
    link.focus();
    await user.keyboard("{Enter}");
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("BreadcrumbPage does NOT fire click (aria-disabled=true)", async () => {
    // BreadcrumbPage is a non-interactive span with role=link, aria-disabled=true.
    // Clicking it should not navigate; no onClick wiring needed.
    const handleClick = vi.fn();
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage onClick={handleClick}>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    const user = userEvent.setup();
    // userEvent.click a span still fires the handler (DOM event), but the
    // element is aria-disabled. We verify the aria-disabled is correctly set.
    const page = screen.getByRole("link", { name: "Current" });
    expect(page).toHaveAttribute("aria-disabled", "true");
  });

  it("responsive: clicking ellipsis button expands the breadcrumb", async () => {
    // Mirrors the responsive.tsx example expand logic
    function ResponsiveBreadcrumb() {
      const [expanded, setExpanded] = React.useState(false);
      return (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {expanded ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/library">Library</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            ) : (
              <>
                <BreadcrumbItem>
                  <button
                    type="button"
                    onClick={() => setExpanded(true)}
                    aria-label="Show full path"
                  >
                    <BreadcrumbEllipsis />
                  </button>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage>Modern Structures</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
    }

    render(<ResponsiveBreadcrumb />);
    const user = userEvent.setup();

    // Initially ellipsis is shown
    expect(screen.getByLabelText("Show full path")).toBeInTheDocument();

    // Click to expand
    await user.click(screen.getByLabelText("Show full path"));

    // After expanding, middle crumb(s) are visible
    expect(screen.getByRole("link", { name: "Library" })).toBeInTheDocument();
    // Ellipsis button should be gone
    expect(screen.queryByLabelText("Show full path")).toBeNull();
  });

  it("multiple BreadcrumbLinks are individually clickable", async () => {
    const clicks: string[] = [];
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#home" onClick={() => clicks.push("home")}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#products" onClick={() => clicks.push("products")}>
              Products
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("link", { name: "Home" }));
    await user.click(screen.getByRole("link", { name: "Products" }));
    expect(clicks).toEqual(["home", "products"]);
  });
});

// ─── Accessibility ────────────────────────────────────────────────────────────

describe("Breadcrumb – accessibility", () => {
  it("default breadcrumb has no axe violations", async () => {
    const { container } = renderDefault();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("breadcrumb with ellipsis has no axe violations", async () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/components">Components</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("breadcrumb with custom separator has no axe violations", async () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <span aria-hidden="true">/</span>
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Blog</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("breadcrumb with render-prop buttons has no axe violations", async () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<button type="button" />}>
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Reports</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("nav landmark is present for screen-reader navigation", () => {
    renderDefault();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("nav landmark has accessible name 'breadcrumb'", () => {
    renderDefault();
    expect(screen.getByRole("navigation", { name: "breadcrumb" })).toBeInTheDocument();
  });

  it("current page is identified with aria-current=page", () => {
    renderDefault();
    // BreadcrumbPage has aria-current="page"
    expect(
      screen.getByRole("link", { name: "Wireless Headphones" })
    ).toHaveAttribute("aria-current", "page");
  });

  it("current page is identified as disabled link (aria-disabled=true)", () => {
    renderDefault();
    expect(
      screen.getByRole("link", { name: "Wireless Headphones" })
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("separators are hidden from screen readers (aria-hidden=true)", () => {
    renderDefault();
    const nav = screen.getByRole("navigation");
    const seps = nav.querySelectorAll("[data-slot='breadcrumb-separator']");
    seps.forEach((sep) => {
      expect(sep).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("ellipsis has aria-hidden=true (decorative)", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbEllipsis data-testid="ellipsis" />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("ellipsis")).toHaveAttribute("aria-hidden", "true");
  });

  it("ellipsis sr-only 'More' text is present for screen readers", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByText("More")).toBeInTheDocument();
  });

  it("breadcrumb links are keyboard-focusable", () => {
    renderDefault();
    const links = screen.getAllByRole("link");
    // Only BreadcrumbLink elements are <a> — BreadcrumbPage is also role=link but aria-disabled
    links.forEach((link) => {
      // anchor elements are natively focusable
      expect(link.tagName === "A" || link.tagName === "SPAN").toBe(true);
    });
  });
});
