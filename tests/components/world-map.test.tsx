/**
 * Tests for <WorldMap /> (components/ui/world-map.tsx)
 *
 * Renders a dotted base-map <img> (generated from dotted-map, colored from the
 * --muted-foreground token resolved at runtime) plus an overlay <svg> with one
 * animated arc per dot and pulsing endpoint circles colored from `lineColor`
 * (defaults to var(--brand)). motion + next-themes run in jsdom.
 */

import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { axe } from "vitest-axe";

import { WorldMap } from "@/components/ui/world-map";

const DOTS = [
  {
    start: { lat: 37.77, lng: -122.41, label: "SF" },
    end: { lat: 51.5, lng: -0.12, label: "London" },
  },
  {
    start: { lat: 51.5, lng: -0.12, label: "London" },
    end: { lat: 35.67, lng: 139.65, label: "Tokyo" },
  },
];

describe("WorldMap — default render", () => {
  it("renders without crashing", () => {
    const { container } = render(<WorldMap />);
    expect(container.querySelector('[data-slot="world-map"]')).not.toBeNull();
  });

  it("has data-slot='world-map' and bg-background container", () => {
    const { container } = render(<WorldMap />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute("data-slot", "world-map");
    expect(root).toHaveClass("bg-background");
  });

  it("renders the dotted base map image after the token-resolving effect", async () => {
    render(<WorldMap />);
    const img = await screen.findByAltText("world map");
    expect(img).toBeInTheDocument();
    expect(img.getAttribute("src")).toMatch(/^data:image\/svg\+xml/);
  });

  it("renders the overlay svg", () => {
    const { container } = render(<WorldMap />);
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("renders no arcs when no dots are provided", () => {
    const { container } = render(<WorldMap />);
    expect(container.querySelectorAll("path")).toHaveLength(0);
  });
});

describe("WorldMap — dots", () => {
  it("renders one arc path per dot", () => {
    const { container } = render(<WorldMap dots={DOTS} />);
    expect(container.querySelectorAll("path")).toHaveLength(DOTS.length);
  });

  it("renders four endpoint circles per dot (2 points × solid+pulse)", () => {
    const { container } = render(<WorldMap dots={DOTS} />);
    expect(container.querySelectorAll("circle")).toHaveLength(DOTS.length * 4);
  });

  it("animates the pulse circles via <animate>", () => {
    const { container } = render(<WorldMap dots={DOTS} />);
    expect(container.querySelectorAll("animate").length).toBeGreaterThan(0);
  });
});

describe("WorldMap — lineColor", () => {
  it("defaults arc + points to the brand token", () => {
    const { container } = render(<WorldMap dots={DOTS} />);
    const gradientStop = container.querySelector("linearGradient stop");
    expect(gradientStop).toHaveAttribute("stop-color", "var(--brand)");
    const circle = container.querySelector("circle");
    expect(circle).toHaveAttribute("fill", "var(--brand)");
  });

  it("honors a custom lineColor token", () => {
    const { container } = render(
      <WorldMap dots={DOTS} lineColor="var(--success)" />,
    );
    expect(container.querySelector("circle")).toHaveAttribute(
      "fill",
      "var(--success)",
    );
  });

  it("defines the line gradient", () => {
    const { container } = render(<WorldMap dots={DOTS} />);
    expect(container.querySelector("#world-map-line")).not.toBeNull();
  });
});

describe("WorldMap — className / a11y", () => {
  it("merges custom className", () => {
    const { container } = render(<WorldMap className="rounded-3xl" />);
    expect(container.firstChild).toHaveClass("rounded-3xl");
    expect(container.firstChild).toHaveClass("relative");
  });

  it("has no axe violations", async () => {
    const { container } = render(<WorldMap dots={DOTS} />);
    await waitFor(() => expect(screen.getByAltText("world map")).toBeInTheDocument());
    expect(await axe(container)).toHaveNoViolations();
  });
});
