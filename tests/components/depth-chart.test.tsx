/**
 * Tests for <DepthChart /> (components/ui/depth-chart.tsx). Both bid and ask
 * cumulative-depth areas come from the pure `cumulativeDepthPath` lib over
 * numeric props — jsdom gives SVG no layout, so nothing is measured from the
 * DOM. Covers default render (both sides present), per-side omission for empty
 * input, the midline toggle, custom dimensions, default seeded data, and a11y.
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

import { DepthChart } from "@/components/ui/depth-chart";
import type { OrderBookLevel } from "@/lib/market";

const bids: OrderBookLevel[] = [
  { price: 99.95, size: 120 },
  { price: 99.9, size: 80 },
  { price: 99.85, size: 200 },
];

const asks: OrderBookLevel[] = [
  { price: 100.05, size: 140 },
  { price: 100.1, size: 60 },
  { price: 100.15, size: 220 },
];

describe("DepthChart", () => {
  it("renders an svg with the depth-chart data-slot and role=img", () => {
    const { container } = render(<DepthChart bids={bids} asks={asks} />);
    const svg = container.querySelector('[data-slot="depth-chart"]');
    expect(svg).not.toBeNull();
    expect(svg!.tagName.toLowerCase()).toBe("svg");
    expect(svg).toHaveAttribute("role", "img");
  });

  it("renders both the bid and ask depth areas by default", () => {
    const { container } = render(<DepthChart bids={bids} asks={asks} />);
    expect(container.querySelector('[data-slot="depth-bid"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="depth-ask"]')).not.toBeNull();
  });

  it("omits the bid path when bids is empty without crashing", () => {
    const { container } = render(<DepthChart bids={[]} asks={asks} />);
    expect(container.querySelector('[data-slot="depth-chart"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="depth-bid"]')).toBeNull();
    expect(container.querySelector('[data-slot="depth-ask"]')).not.toBeNull();
  });

  it("omits the ask path when asks is empty without crashing", () => {
    const { container } = render(<DepthChart bids={bids} asks={[]} />);
    expect(container.querySelector('[data-slot="depth-chart"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="depth-ask"]')).toBeNull();
    expect(container.querySelector('[data-slot="depth-bid"]')).not.toBeNull();
  });

  it("renders the midline by default and hides it when showMidline is false", () => {
    const { container } = render(<DepthChart bids={bids} asks={asks} />);
    expect(
      container.querySelector('[data-slot="depth-midline"]'),
    ).not.toBeNull();
    const { container: noMid } = render(
      <DepthChart bids={bids} asks={asks} showMidline={false} />,
    );
    expect(noMid.querySelector('[data-slot="depth-midline"]')).toBeNull();
  });

  it("tones the bid area with success and the ask area with destructive", () => {
    const { container } = render(<DepthChart bids={bids} asks={asks} />);
    const bid = container.querySelector('[data-slot="depth-bid"]');
    const ask = container.querySelector('[data-slot="depth-ask"]');
    expect(bid!.getAttribute("class")).toMatch(/(fill|stroke)-success/);
    expect(ask!.getAttribute("class")).toMatch(/(fill|stroke)-destructive/);
  });

  it("applies custom width and height to the svg", () => {
    const { container } = render(
      <DepthChart bids={bids} asks={asks} width={640} height={300} />,
    );
    const svg = container.querySelector('[data-slot="depth-chart"]');
    expect(svg).toHaveAttribute("width", "640");
    expect(svg).toHaveAttribute("height", "300");
    expect(svg).toHaveAttribute("viewBox", "0 0 640 300");
  });

  it("uses the provided aria-label and a unique title id", () => {
    const { container } = render(
      <>
        <DepthChart bids={bids} asks={asks} aria-label="AAPL depth" />
        <DepthChart bids={bids} asks={asks} aria-label="MSFT depth" />
      </>,
    );
    expect(screen.getByLabelText("AAPL depth")).toBeInTheDocument();
    const ids = Array.from(container.querySelectorAll("title")).map((t) => t.id);
    expect(ids[0]).not.toBe(ids[1]);
  });

  it("renders with the seeded default data when none is provided", () => {
    const { container } = render(<DepthChart />);
    expect(container.querySelector('[data-slot="depth-chart"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="depth-bid"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="depth-ask"]')).not.toBeNull();
  });

  it("uses no raw green/red", () => {
    const { container } = render(<DepthChart bids={bids} asks={asks} />);
    expect(container.innerHTML).not.toMatch(/green|red/i);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <DepthChart bids={bids} asks={asks} aria-label="Order book depth" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
