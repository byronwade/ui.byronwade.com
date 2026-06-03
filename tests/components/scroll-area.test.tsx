import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { axe } from "vitest-axe";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// Base UI only mounts the scrollbar track when the viewport actually overflows
// (`clientHeight < scrollHeight`). jsdom reports every layout box as 0, so the
// vertical bar never mounts on its own. Stub the viewport metrics on the
// prototype to force the vertical-overflow path, then clean up afterwards.
const MEASURED_PROPS = [
  "scrollHeight",
  "clientHeight",
  "scrollWidth",
  "clientWidth",
] as const;

function mockVerticalOverflow() {
  Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
    configurable: true,
    get: () => 600,
  });
  Object.defineProperty(HTMLElement.prototype, "clientHeight", {
    configurable: true,
    get: () => 120,
  });
  // Equal widths keep the horizontal bar hidden while still passing Base UI's
  // non-zero content guard.
  Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
    configurable: true,
    get: () => 200,
  });
  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    get: () => 200,
  });
}

afterEach(() => {
  for (const prop of MEASURED_PROPS) {
    if (Object.prototype.hasOwnProperty.call(HTMLElement.prototype, prop)) {
      delete (HTMLElement.prototype as Record<string, unknown>)[prop];
    }
  }
});

describe("ScrollArea – smoke", () => {
  it("renders without crashing", () => {
    const { container } = render(<ScrollArea>Content</ScrollArea>);
    expect(
      container.querySelector("[data-slot='scroll-area']")
    ).toBeInTheDocument();
  });

  it("renders viewport with data-slot", () => {
    const { container } = render(<ScrollArea>Line</ScrollArea>);
    expect(
      container.querySelector("[data-slot='scroll-area-viewport']")
    ).toBeInTheDocument();
  });

  it("renders children inside viewport", () => {
    const { container } = render(<ScrollArea>Scrollable text</ScrollArea>);
    const viewport = container.querySelector(
      "[data-slot='scroll-area-viewport']"
    );
    expect(viewport).toBeInTheDocument();
    expect(viewport).toHaveTextContent("Scrollable text");
    expect(screen.getByText("Scrollable text")).toBeInTheDocument();
  });

  it("merges className on root", () => {
    const { container } = render(
      <ScrollArea className="h-40 w-56">Content</ScrollArea>
    );
    const root = container.querySelector("[data-slot='scroll-area']");
    expect(root).toHaveClass("h-40");
    expect(root).toHaveClass("w-56");
    // The component's own base class is preserved alongside the custom one.
    expect(root).toHaveClass("relative");
  });
});

describe("ScrollArea – scrollbar & thumb", () => {
  it("mounts the vertical scrollbar when the viewport overflows", async () => {
    mockVerticalOverflow();
    const { container } = render(
      <ScrollArea className="h-32 w-48">
        <div style={{ height: 600 }}>Tall content</div>
      </ScrollArea>
    );

    await waitFor(() => {
      expect(
        container.querySelector("[data-slot='scroll-area-scrollbar']")
      ).toBeInTheDocument();
    });

    const scrollbar = container.querySelector(
      "[data-slot='scroll-area-scrollbar']"
    );
    expect(scrollbar).toHaveAttribute("data-orientation", "vertical");
  });

  it("renders the thumb inside the mounted scrollbar", async () => {
    mockVerticalOverflow();
    const { container } = render(
      <ScrollArea className="h-32 w-48">
        <div style={{ height: 600 }}>Tall content</div>
      </ScrollArea>
    );

    await waitFor(() => {
      expect(
        container.querySelector("[data-slot='scroll-area-thumb']")
      ).toBeInTheDocument();
    });

    const scrollbar = container.querySelector(
      "[data-slot='scroll-area-scrollbar']"
    );
    expect(
      scrollbar?.querySelector("[data-slot='scroll-area-thumb']")
    ).toBeInTheDocument();
  });
});

describe("ScrollArea – ScrollBar export", () => {
  it("defaults the orientation to vertical", () => {
    const { container } = render(
      <ScrollArea className="h-32 w-48">
        <ScrollBar keepMounted />
        <div>Body</div>
      </ScrollArea>
    );
    const scrollbar = container.querySelector(
      "[data-slot='scroll-area-scrollbar']"
    );
    expect(scrollbar).toBeInTheDocument();
    expect(scrollbar).toHaveAttribute("data-orientation", "vertical");
    expect(
      container.querySelector("[data-slot='scroll-area-thumb']")
    ).toBeInTheDocument();
  });

  it("forwards orientation='horizontal' to data-orientation", () => {
    const { container } = render(
      <ScrollArea className="h-32 w-48">
        <ScrollBar orientation="horizontal" keepMounted />
        <div>Body</div>
      </ScrollArea>
    );
    const scrollbar = container.querySelector(
      "[data-slot='scroll-area-scrollbar']"
    );
    expect(scrollbar).toBeInTheDocument();
    expect(scrollbar).toHaveAttribute("data-orientation", "horizontal");
  });

  it("merges a custom className on the scrollbar", () => {
    const { container } = render(
      <ScrollArea className="h-32 w-48">
        <ScrollBar keepMounted className="bg-muted" />
        <div>Body</div>
      </ScrollArea>
    );
    expect(
      container.querySelector("[data-slot='scroll-area-scrollbar']")
    ).toHaveClass("bg-muted");
  });
});

describe("ScrollArea – accessibility", () => {
  it("has no axe violations for a scrollable list", async () => {
    const { container } = render(
      <ScrollArea aria-label="Tag list" className="h-32 w-48">
        <ul>
          <li>One</li>
          <li>Two</li>
        </ul>
      </ScrollArea>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations when the scrollbar is mounted", async () => {
    mockVerticalOverflow();
    const { container } = render(
      <ScrollArea aria-label="Overflowing list" className="h-32 w-48">
        <ul>
          {Array.from({ length: 20 }, (_, i) => (
            <li key={i}>Row {i + 1}</li>
          ))}
        </ul>
      </ScrollArea>
    );
    await waitFor(() => {
      expect(
        container.querySelector("[data-slot='scroll-area-scrollbar']")
      ).toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });
});
