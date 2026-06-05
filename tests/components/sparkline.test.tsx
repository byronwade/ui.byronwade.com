/**
 * Tests for <Sparkline /> (components/ui/sparkline.tsx). Covers the line/area
 * variants, the tokenized tones (explicit + `auto` derived from first→last),
 * empty data, custom dimensions, and a11y.
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

import { Sparkline } from "@/components/ui/sparkline";

describe("Sparkline", () => {
  it("renders an svg with the sparkline data-slot and a polyline by default", () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} />);
    const svg = container.querySelector('[data-slot="sparkline"]');
    expect(svg).not.toBeNull();
    expect(svg!.tagName.toLowerCase()).toBe("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(
      container.querySelector('[data-slot="sparkline-line"]'),
    ).not.toBeNull();
  });

  it("renders a filled area path under the line for variant=area", () => {
    const { container } = render(
      <Sparkline data={[1, 2, 3]} variant="area" tone="success" />,
    );
    const area = container.querySelector('[data-slot="sparkline-area"]');
    expect(area).not.toBeNull();
    expect(area!.tagName.toLowerCase()).toBe("path");
    expect(area).toHaveClass("fill-success/15");
    expect(area).toHaveAttribute("d");
    expect(
      container.querySelector('[data-slot="sparkline-line"]'),
    ).not.toBeNull();
  });

  it("does not render an area path for the line variant", () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} variant="line" />);
    expect(container.querySelector('[data-slot="sparkline-area"]')).toBeNull();
  });

  it("applies the success tone", () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} tone="success" />);
    expect(container.querySelector('[data-slot="sparkline"]')).toHaveClass(
      "text-success",
    );
    expect(container.querySelector('[data-slot="sparkline-line"]')).toHaveClass(
      "stroke-success",
    );
  });

  it("applies the destructive tone", () => {
    const { container } = render(
      <Sparkline data={[1, 2, 3]} tone="destructive" />,
    );
    expect(container.querySelector('[data-slot="sparkline"]')).toHaveClass(
      "text-destructive",
    );
    expect(container.querySelector('[data-slot="sparkline-line"]')).toHaveClass(
      "stroke-destructive",
    );
  });

  it("applies the muted tone", () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} tone="muted" />);
    expect(container.querySelector('[data-slot="sparkline"]')).toHaveClass(
      "text-muted-foreground",
    );
    expect(container.querySelector('[data-slot="sparkline-line"]')).toHaveClass(
      "stroke-muted-foreground",
    );
  });

  it("applies the brand tone", () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} tone="brand" />);
    expect(container.querySelector('[data-slot="sparkline"]')).toHaveClass(
      "text-brand",
    );
    expect(container.querySelector('[data-slot="sparkline-line"]')).toHaveClass(
      "stroke-brand",
    );
  });

  it("auto tone resolves an up-trend to success", () => {
    const { container } = render(<Sparkline data={[1, 5]} tone="auto" />);
    expect(container.querySelector('[data-slot="sparkline"]')).toHaveClass(
      "text-success",
    );
    expect(container.querySelector('[data-slot="sparkline-line"]')).toHaveClass(
      "stroke-success",
    );
  });

  it("auto tone resolves a down-trend to destructive", () => {
    const { container } = render(<Sparkline data={[5, 1]} tone="auto" />);
    expect(container.querySelector('[data-slot="sparkline"]')).toHaveClass(
      "text-destructive",
    );
    expect(container.querySelector('[data-slot="sparkline-line"]')).toHaveClass(
      "stroke-destructive",
    );
  });

  it("auto tone defaults to muted for a flat series", () => {
    const { container } = render(<Sparkline data={[3, 3, 3]} tone="auto" />);
    expect(container.querySelector('[data-slot="sparkline"]')).toHaveClass(
      "text-muted-foreground",
    );
  });

  it("renders an empty svg without crashing for empty data", () => {
    const { container } = render(<Sparkline data={[]} />);
    const svg = container.querySelector('[data-slot="sparkline"]');
    expect(svg).not.toBeNull();
    expect(svg).toHaveClass("text-muted-foreground");
  });

  it("applies custom width and height to the svg", () => {
    const { container } = render(
      <Sparkline data={[1, 2, 3]} width={200} height={64} />,
    );
    const svg = container.querySelector('[data-slot="sparkline"]');
    expect(svg).toHaveAttribute("width", "200");
    expect(svg).toHaveAttribute("height", "64");
    expect(svg).toHaveAttribute("viewBox", "0 0 200 64");
  });

  it("uses the provided aria-label and a unique title id", () => {
    const { container } = render(
      <>
        <Sparkline data={[1, 2, 3]} aria-label="AAPL trend" />
        <Sparkline data={[3, 2, 1]} aria-label="MSFT trend" />
      </>,
    );
    expect(screen.getByLabelText("AAPL trend")).toBeInTheDocument();
    const ids = Array.from(container.querySelectorAll("title")).map((t) => t.id);
    expect(ids[0]).not.toBe(ids[1]);
  });

  it("renders with the seeded default data when none is provided", () => {
    const { container } = render(<Sparkline />);
    expect(container.querySelector('[data-slot="sparkline"]')).not.toBeNull();
    expect(
      container.querySelector('[data-slot="sparkline-line"]'),
    ).not.toBeNull();
  });

  it("uses no raw green/red", () => {
    const { container } = render(
      <>
        <Sparkline data={[1, 5]} variant="area" />
        <Sparkline data={[5, 1]} variant="area" />
      </>,
    );
    expect(container.innerHTML).not.toMatch(/green|red/i);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Sparkline data={[1, 3, 2, 5, 4]} variant="area" aria-label="Trend" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
