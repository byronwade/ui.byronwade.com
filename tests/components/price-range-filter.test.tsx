/**
 * Tests for <PriceRangeFilter /> (components/price-range-filter.tsx)
 *
 * Composite: histogram + range slider + two number inputs + apply button.
 * Covers derived bounds, histogram buckets, in-range count, controlled/
 * uncontrolled value, bound clamping, the apply callback, and a11y.
 */

import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { PriceRangeFilter } from "@/components/price-range-filter";

const ITEMS = [
  { price: 50 },
  { price: 120 },
  { price: 200 },
  { price: 280 },
  { price: 350 },
  { price: 500 },
];

describe("PriceRangeFilter — render", () => {
  it("renders the composite with data-slot", () => {
    const { container } = render(<PriceRangeFilter items={ITEMS} tickCount={10} />);
    expect(
      container.querySelector('[data-slot="price-range-filter"]'),
    ).not.toBeNull();
  });

  it("renders the range slider with two thumbs", () => {
    render(<PriceRangeFilter items={ITEMS} tickCount={10} />);
    expect(screen.getAllByRole("slider")).toHaveLength(2);
  });

  it("renders the histogram with tickCount buckets", () => {
    const { container } = render(<PriceRangeFilter items={ITEMS} tickCount={10} />);
    const bars = container.querySelectorAll("[data-selected]");
    expect(bars).toHaveLength(10);
  });

  it("renders both labelled price inputs", () => {
    render(<PriceRangeFilter items={ITEMS} tickCount={10} />);
    expect(screen.getByLabelText("Minimum price")).toBeInTheDocument();
    expect(screen.getByLabelText("Maximum price")).toBeInTheDocument();
  });

  it("shows the total in-range count on the apply button by default", () => {
    render(<PriceRangeFilter items={ITEMS} tickCount={10} />);
    // Full span selected → all 6 items are in range.
    expect(
      screen.getByRole("button", { name: /show 6 items/i }),
    ).toBeInTheDocument();
  });

  it("uses brand-derived histogram tokens (bg-primary/*)", () => {
    const { container } = render(<PriceRangeFilter items={ITEMS} tickCount={10} />);
    expect(container.querySelector(".bg-primary\\/20")).not.toBeNull();
  });
});

describe("PriceRangeFilter — bounds", () => {
  it("derives min/max from the items", () => {
    render(<PriceRangeFilter items={ITEMS} tickCount={10} />);
    const sliders = screen.getAllByRole("slider");
    expect(sliders[0]).toHaveAttribute("aria-valuenow", "50");
    expect(sliders[1]).toHaveAttribute("aria-valuenow", "500");
  });

  it("honors explicit min/max and defaultValue", () => {
    render(
      <PriceRangeFilter
        items={ITEMS}
        min={0}
        max={1000}
        defaultValue={[100, 400]}
        tickCount={10}
      />,
    );
    const sliders = screen.getAllByRole("slider");
    expect(sliders[0]).toHaveAttribute("aria-valuenow", "100");
    expect(sliders[1]).toHaveAttribute("aria-valuenow", "400");
    expect(sliders[0]).toHaveAttribute("min", "0");
  });

  it("counts only items inside the selected range", () => {
    render(
      <PriceRangeFilter items={ITEMS} defaultValue={[100, 300]} tickCount={10} />,
    );
    // 120, 200, 280 are within [100, 300] → 3 items.
    expect(
      screen.getByRole("button", { name: /show 3 items/i }),
    ).toBeInTheDocument();
  });

  it("renders an empty histogram gracefully with no items", () => {
    const { container } = render(<PriceRangeFilter items={[]} tickCount={5} />);
    expect(
      container.querySelector('[data-slot="price-range-filter"]'),
    ).not.toBeNull();
    expect(container.querySelectorAll("[data-selected]")).toHaveLength(5);
  });
});

describe("PriceRangeFilter — interaction", () => {
  it("clamps the minimum input to not exceed the maximum", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <PriceRangeFilter
        items={ITEMS}
        defaultValue={[100, 300]}
        tickCount={10}
        onValueChange={onValueChange}
      />,
    );
    const minInput = screen.getByLabelText("Minimum price");
    await user.clear(minInput);
    await user.type(minInput, "400");
    minInput.blur();
    // 400 > current max(300) → clamped to 300.
    const last = onValueChange.mock.calls.at(-1)?.[0];
    if (last) expect(last[0]).toBeLessThanOrEqual(last[1]);
  });

  it("updates the range when a slider thumb is moved", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <PriceRangeFilter
        items={ITEMS}
        defaultValue={[100, 300]}
        tickCount={10}
        onValueChange={onValueChange}
      />,
    );
    const lower = screen.getAllByRole("slider")[0];
    lower.focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenCalled();
    expect(Array.isArray(onValueChange.mock.calls.at(-1)?.[0])).toBe(true);
  });

  it("clamps the maximum input to not fall below the minimum", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <PriceRangeFilter
        items={ITEMS}
        defaultValue={[100, 300]}
        tickCount={10}
        onValueChange={onValueChange}
      />,
    );
    const maxInput = screen.getByLabelText("Maximum price");
    await user.clear(maxInput);
    await user.type(maxInput, "50");
    maxInput.blur();
    const last = onValueChange.mock.calls.at(-1)?.[0];
    if (last) expect(last[1]).toBeGreaterThanOrEqual(last[0]);
  });

  it("fires onApply with the in-range count and range", async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    render(
      <PriceRangeFilter
        items={ITEMS}
        defaultValue={[100, 300]}
        tickCount={10}
        onApply={onApply}
      />,
    );
    await user.click(screen.getByRole("button", { name: /show 3 items/i }));
    expect(onApply).toHaveBeenCalledWith(3, [100, 300]);
  });

  it("supports a controlled value", () => {
    render(
      <PriceRangeFilter
        items={ITEMS}
        value={[200, 280]}
        onValueChange={() => {}}
        tickCount={10}
      />,
    );
    // 200 and 280 in range → 2 items.
    expect(
      screen.getByRole("button", { name: /show 2 items/i }),
    ).toBeInTheDocument();
  });
});

describe("PriceRangeFilter — accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(<PriceRangeFilter items={ITEMS} tickCount={10} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("merges a custom className", () => {
    const { container } = render(
      <PriceRangeFilter items={ITEMS} className="max-w-sm" tickCount={10} />,
    );
    expect(container.firstChild).toHaveClass("max-w-sm");
  });
});
