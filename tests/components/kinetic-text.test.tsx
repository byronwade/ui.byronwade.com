/**
 * Tests for <KineticText /> (components/ui/kinetic-text.tsx)
 *
 * Renders `text` as one <span> per character (aria-hidden) plus an sr-only copy
 * of the full string, inside a polymorphic Tag (default h1). The hover weight/
 * stroke animation is pure CSS (currentColor only); we assert structure + a11y.
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

import { KineticText } from "@/components/ui/kinetic-text";

describe("KineticText — default render", () => {
  it("renders without crashing", () => {
    const { container } = render(<KineticText text="Hi" />);
    expect(container.querySelector('[data-slot="kinetic-text"]')).not.toBeNull();
  });

  it("renders an <h1> by default", () => {
    render(<KineticText text="Hello" />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("has data-slot='kinetic-text'", () => {
    const { container } = render(<KineticText text="Hi" />);
    expect(container.firstChild).toHaveAttribute("data-slot", "kinetic-text");
  });

  it("exposes the full text once to assistive tech (sr-only span)", () => {
    const { container } = render(<KineticText text="Hello" />);
    const srOnly = container.querySelector(".sr-only");
    expect(srOnly).not.toBeNull();
    expect(srOnly).toHaveTextContent("Hello");
  });

  it("renders one aria-hidden span per character", () => {
    const { container } = render(<KineticText text="abc" />);
    const letters = container.querySelectorAll('span[aria-hidden="true"]');
    expect(letters).toHaveLength(3);
  });

  it("renders the accessible name from the text", () => {
    render(<KineticText text="Accessible" />);
    expect(
      screen.getByRole("heading", { name: "Accessible" }),
    ).toBeInTheDocument();
  });
});

describe("KineticText — polymorphic `as`", () => {
  it.each([
    ["h2", 2],
    ["h3", 3],
  ] as const)("renders as %s", (tag, level) => {
    render(<KineticText as={tag} text="Heading" />);
    expect(screen.getByRole("heading", { level })).toBeInTheDocument();
  });

  it("can render as a paragraph", () => {
    const { container } = render(<KineticText as="p" text="Para" />);
    expect(container.querySelector("p")).not.toBeNull();
  });

  it("can render as a span", () => {
    const { container } = render(<KineticText as="span" text="Inline" />);
    expect(container.querySelector('span[data-slot="kinetic-text"]')).not.toBeNull();
  });
});

describe("KineticText — spaces and edge cases", () => {
  it("preserves spaces as non-breaking spaces", () => {
    const { container } = render(<KineticText text="a b" />);
    const letters = container.querySelectorAll('span[aria-hidden="true"]');
    expect(letters).toHaveLength(3);
    expect(letters[1].textContent).toBe(String.fromCharCode(160));
  });

  it("renders nothing visible for empty text but keeps the sr-only span", () => {
    const { container } = render(<KineticText text="" />);
    expect(container.querySelectorAll('span[aria-hidden="true"]')).toHaveLength(0);
    expect(container.querySelector(".sr-only")).not.toBeNull();
  });
});

describe("KineticText — props", () => {
  it("merges custom className with base classes", () => {
    const { container } = render(
      <KineticText text="Hi" className="text-4xl text-foreground" />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("text-4xl");
    expect(root).toHaveClass("flex"); // base
  });

  it("sets the kinetic CSS custom properties", () => {
    const { container } = render(<KineticText text="Hi" />);
    const root = container.firstChild as HTMLElement;
    expect(root.style.getPropertyValue("--hover-padding")).toBe("calc(1em / 12)");
    expect(root.style.getPropertyValue("--text-stroke-width")).toBe(
      "calc(1em * 125 / 6000)",
    );
  });

  it("merges caller style without dropping the custom properties", () => {
    const { container } = render(
      <KineticText text="Hi" style={{ color: "var(--brand)" }} />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.style.getPropertyValue("--hover-padding")).toBe("calc(1em / 12)");
    expect(root.style.color).toBe("var(--brand)");
  });

  it("passes through arbitrary props (id, data-*)", () => {
    render(<KineticText text="Hi" id="title" data-testid="kt" />);
    expect(screen.getByTestId("kt")).toHaveAttribute("id", "title");
  });
});

describe("KineticText — accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(<KineticText as="p" text="Kinetic" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
