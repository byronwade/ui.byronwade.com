/**
 * Tests for <PriceChange /> (components/ui/price-change.tsx). Covers the
 * runtime-derived tone (success/destructive/muted from sign + neutralThreshold),
 * the up/down caret (and its absence at neutral), every `format` mode, each
 * `size`, the chip tint, `showIcon={false}`, the descriptive aria-label, and a11y.
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

import { PriceChange } from "@/components/ui/price-change";

const root = (container: HTMLElement) =>
  container.querySelector('[data-slot="price-change"]') as HTMLElement;

describe("PriceChange — tone + direction", () => {
  it("positive value uses the success token and an up caret", () => {
    const { container } = render(<PriceChange value={1.82} percent={1.82} />);
    const el = root(container);
    expect(el).toHaveClass("text-success");
    expect(el).not.toHaveClass("text-destructive");
    expect(el.querySelector("svg")).not.toBeNull();
    expect(el.querySelector(".lucide-trending-up")).not.toBeNull();
  });

  it("negative value uses the destructive token and a down caret", () => {
    const { container } = render(<PriceChange value={-2.14} percent={-2.14} />);
    const el = root(container);
    expect(el).toHaveClass("text-destructive");
    expect(el).not.toHaveClass("text-success");
    expect(el.querySelector(".lucide-trending-down")).not.toBeNull();
  });

  it("zero is muted with no caret", () => {
    const { container } = render(<PriceChange value={0} percent={0} />);
    const el = root(container);
    expect(el).toHaveClass("text-muted-foreground");
    expect(el.querySelector("svg")).toBeNull();
  });

  it("a value within neutralThreshold is muted with no caret", () => {
    const { container } = render(
      <PriceChange value={0.4} percent={0.4} neutralThreshold={0.5} />,
    );
    const el = root(container);
    expect(el).toHaveClass("text-muted-foreground");
    expect(el.querySelector("svg")).toBeNull();
  });

  it("a value exactly at neutralThreshold is neutral (boundary inclusive)", () => {
    const { container } = render(
      <PriceChange value={0.5} percent={0.5} neutralThreshold={0.5} />,
    );
    expect(root(container)).toHaveClass("text-muted-foreground");
  });

  it("a value beyond neutralThreshold is directional", () => {
    const { container } = render(
      <PriceChange value={0.6} percent={0.6} neutralThreshold={0.5} />,
    );
    const el = root(container);
    expect(el).toHaveClass("text-success");
    expect(el.querySelector("svg")).not.toBeNull();
  });
});

describe("PriceChange — format modes", () => {
  it("default 'both' renders signed absolute + percent in parens", () => {
    render(<PriceChange value={1.82} percent={1.82} />);
    expect(screen.getByText("+1.82 (+1.82%)")).toBeInTheDocument();
  });

  it("negative 'both' renders both signed values", () => {
    render(<PriceChange value={-2.14} percent={-2.14} />);
    expect(screen.getByText("-2.14 (-2.14%)")).toBeInTheDocument();
  });

  it("'absolute' renders only the signed absolute change", () => {
    render(<PriceChange value={1.82} percent={1.82} format="absolute" />);
    expect(screen.getByText("+1.82")).toBeInTheDocument();
  });

  it("'absolute' groups thousands and signs positives", () => {
    render(<PriceChange value={1234.5} format="absolute" />);
    expect(screen.getByText("+1,234.50")).toBeInTheDocument();
  });

  it("'percent' renders only the percent and prefers `percent` over `value`", () => {
    render(<PriceChange value={1.82} percent={3.5} format="percent" />);
    expect(screen.getByText("+3.50%")).toBeInTheDocument();
  });

  it("'percent' falls back to `value` when `percent` is omitted", () => {
    render(<PriceChange value={2.5} format="percent" />);
    expect(screen.getByText("+2.50%")).toBeInTheDocument();
  });
});

describe("PriceChange — size", () => {
  it.each([
    ["sm", "text-xs"],
    ["default", "text-sm"],
    ["lg", "text-base"],
  ] as const)("size=%s applies %s", (size, cls) => {
    const { container } = render(<PriceChange value={1} size={size} />);
    expect(root(container)).toHaveClass(cls);
  });
});

describe("PriceChange — variant", () => {
  it("text variant (default) has no chip background", () => {
    const { container } = render(<PriceChange value={1.82} />);
    const el = root(container);
    expect(el).not.toHaveClass("bg-success/10");
    expect(el).not.toHaveClass("rounded-full");
  });

  it("chip variant adds a success tint for gains", () => {
    const { container } = render(<PriceChange value={1.82} variant="chip" />);
    const el = root(container);
    expect(el).toHaveClass("bg-success/10");
    expect(el).toHaveClass("text-success");
    expect(el).toHaveClass("rounded-full");
  });

  it("chip variant adds a destructive tint for losses", () => {
    const { container } = render(<PriceChange value={-2.14} variant="chip" />);
    expect(root(container)).toHaveClass("bg-destructive/10");
  });

  it("chip variant uses a muted tint at neutral", () => {
    const { container } = render(<PriceChange value={0} variant="chip" />);
    expect(root(container)).toHaveClass("bg-muted");
  });
});

describe("PriceChange — icon toggle", () => {
  it("showIcon={false} removes the caret", () => {
    const { container } = render(<PriceChange value={1.82} showIcon={false} />);
    expect(root(container).querySelector("svg")).toBeNull();
  });

  it("the caret is decorative (aria-hidden)", () => {
    const { container } = render(<PriceChange value={1.82} />);
    expect(root(container).querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});

describe("PriceChange — a11y + passthrough", () => {
  it("describes direction + value in the root aria-label", () => {
    const { container } = render(<PriceChange value={1.82} percent={1.82} />);
    expect(root(container)).toHaveAttribute("aria-label", "up +1.82 (+1.82%)");
  });

  it("labels a loss as down", () => {
    const { container } = render(
      <PriceChange value={-2.14} percent={-2.14} format="percent" />,
    );
    expect(root(container)).toHaveAttribute("aria-label", "down -2.14%");
  });

  it("labels a neutral change as unchanged", () => {
    const { container } = render(<PriceChange value={0} format="percent" />);
    expect(root(container)).toHaveAttribute("aria-label", "unchanged 0.00%");
  });

  it("renders numerals in a monospace font", () => {
    const { container } = render(<PriceChange value={1.82} />);
    expect(root(container).querySelector(".font-mono")).not.toBeNull();
  });

  it("merges a custom className and forwards span props", () => {
    const { container } = render(
      <PriceChange value={1} className="custom-x" data-testid="pc" />,
    );
    const el = root(container);
    expect(el).toHaveClass("custom-x");
    expect(el).toHaveAttribute("data-testid", "pc");
  });

  it("uses no raw green/red", () => {
    const { container } = render(
      <>
        <PriceChange value={1} variant="chip" />
        <PriceChange value={-1} variant="chip" />
      </>,
    );
    expect(container.innerHTML).not.toMatch(/green|red/i);
  });

  it("has no axe violations across tones", async () => {
    const { container } = render(
      <div>
        <PriceChange value={1.82} percent={1.82} />
        <PriceChange value={-2.14} percent={-2.14} variant="chip" />
        <PriceChange value={0} percent={0} />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
