/**
 * Tests for the AI Loader component (adapted from AI Elements).
 *
 * Component source: components/ai-elements/loader.tsx
 * Export: Loader — spinning SVG indicator, data-slot="loader", size prop (number).
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Loader } from "@/components/ai-elements/loader";

describe("Loader — render", () => {
  it("renders without crashing", () => {
    const { container } = render(<Loader />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("root has data-slot='loader'", () => {
    const { container } = render(<Loader />);
    expect(container.firstChild).toHaveAttribute("data-slot", "loader");
  });

  it("renders the inner loader icon svg", () => {
    const { container } = render(<Loader />);
    const icon = container.querySelector("[data-slot='loader-icon']");
    expect(icon).toBeInTheDocument();
    expect(icon?.tagName.toLowerCase()).toBe("svg");
  });

  it("animates (animate-spin) and is tinted with a token", () => {
    const { container } = render(<Loader />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("animate-spin");
    expect(cls).toContain("text-muted-foreground");
  });
});

describe("Loader — size prop", () => {
  it("defaults the icon to 16px", () => {
    const { container } = render(<Loader />);
    const icon = container.querySelector("[data-slot='loader-icon']") as SVGElement;
    expect(icon.getAttribute("width")).toBe("16");
    expect(icon.getAttribute("height")).toBe("16");
  });

  it("forwards a custom size to the icon", () => {
    const { container } = render(<Loader size={32} />);
    const icon = container.querySelector("[data-slot='loader-icon']") as SVGElement;
    expect(icon.getAttribute("width")).toBe("32");
    expect(icon.getAttribute("height")).toBe("32");
  });
});

describe("Loader — props passthrough", () => {
  it("merges a custom className without dropping base classes", () => {
    const { container } = render(<Loader className="text-brand custom-x" />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("custom-x");
    expect(cls).toContain("text-brand");
    expect(cls).toContain("inline-flex");
  });

  it("forwards arbitrary HTML attributes", () => {
    const { container } = render(
      <Loader id="busy" data-testid="loader" aria-label="Loading" role="status" />
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("id", "busy");
    expect(el).toHaveAttribute("data-testid", "loader");
    expect(el).toHaveAttribute("aria-label", "Loading");
  });
});

describe("Loader — accessibility (axe)", () => {
  it("decorative loader has no axe violations", async () => {
    const { container } = render(
      <main>
        <Loader />
      </main>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("labeled status loader has no axe violations", async () => {
    const { container } = render(
      <main>
        <Loader role="status" aria-label="Loading results" />
      </main>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
