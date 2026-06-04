/**
 * Adapted for byronwade/ui from a coss.com UI block (p-slider-22).
 * Original concept © coss.com. Reworked as a reusable composite on the
 * byronwade design system — composes `slider` + `number-field` + `button`,
 * token surfaces only, controlled/uncontrolled value, derived histogram.
 */
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
} from "@/components/ui/number-field";

type Range = [number, number];

export interface PriceRangeFilterProps {
  /** Items to bucket into the histogram and count within the range. */
  items: { price: number }[];
  /** Lower bound (defaults to the cheapest item). */
  min?: number;
  /** Upper bound (defaults to the priciest item). */
  max?: number;
  /** Controlled selected range. */
  value?: Range;
  /** Initial range when uncontrolled (defaults to the full span). */
  defaultValue?: Range;
  onValueChange?: (value: Range) => void;
  /** Number of histogram buckets. */
  tickCount?: number;
  /** Currency symbol shown in the inputs. */
  currency?: string;
  /** Called with the in-range item count when the apply button is pressed. */
  onApply?: (count: number, value: Range) => void;
  className?: string;
}

export function PriceRangeFilter({
  items,
  min: minProp,
  max: maxProp,
  value,
  defaultValue,
  onValueChange,
  tickCount = 40,
  currency = "$",
  onApply,
  className,
}: PriceRangeFilterProps) {
  const prices = React.useMemo(() => items.map((i) => i.price), [items]);
  const min = minProp ?? (prices.length ? Math.min(...prices) : 0);
  const max = maxProp ?? (prices.length ? Math.max(...prices) : 100);

  const [internal, setInternal] = React.useState<Range>(
    defaultValue ?? [min, max],
  );
  const selected = value ?? internal;

  const setSelected = (next: Range) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  const priceStep = (max - min) / tickCount || 1;

  const itemCounts = React.useMemo(
    () =>
      Array.from({ length: tickCount }, (_, tick) => {
        const lo = min + tick * priceStep;
        const hi = min + (tick + 1) * priceStep;
        return prices.filter((p) => p >= lo && p < hi).length;
      }),
    [prices, tickCount, min, priceStep],
  );
  const maxCount = Math.max(1, ...itemCounts);

  const inRangeCount = prices.filter(
    (p) => p >= selected[0] && p <= selected[1],
  ).length;

  const isBarSelected = (i: number) => {
    const lo = min + i * priceStep;
    const hi = min + (i + 1) * priceStep;
    return inRangeCount > 0 && lo <= selected[1] && hi >= selected[0];
  };

  const updateBound = (index: 0 | 1, raw: number | null) => {
    const v = raw ?? (index === 0 ? min : max);
    const next: Range = [...selected];
    if (index === 0) next[0] = Math.min(v, selected[1]);
    else next[1] = Math.max(v, selected[0]);
    setSelected(next);
  };

  return (
    <div data-slot="price-range-filter" className={cn("flex flex-col gap-4", className)}>
      <div>
        <div aria-hidden className="flex h-12 w-full items-end px-3">
          {itemCounts.map((count, i) => (
            <div
              key={i}
              className="flex flex-1 justify-center"
              style={{ height: `${(count / maxCount) * 100}%` }}
            >
              <span
                data-selected={isBarSelected(i)}
                className="mx-px size-full bg-primary/20 data-[selected=true]:bg-primary/50"
              />
            </div>
          ))}
        </div>
        <Slider
          aria-label="Price range"
          min={min}
          max={max}
          value={selected}
          onValueChange={(v) =>
            setSelected(Array.isArray(v) ? ([v[0], v[1]] as Range) : [v, v])
          }
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <NumberField
          value={selected[0]}
          min={min}
          max={selected[1]}
          onValueChange={(v) => updateBound(0, v)}
        >
          <NumberFieldGroup>
            <span className="pl-2.5 text-sm text-muted-foreground">{currency}</span>
            <NumberFieldInput aria-label="Minimum price" className="text-left" />
          </NumberFieldGroup>
        </NumberField>
        <NumberField
          value={selected[1]}
          min={selected[0]}
          max={max}
          onValueChange={(v) => updateBound(1, v)}
        >
          <NumberFieldGroup>
            <span className="pl-2.5 text-sm text-muted-foreground">{currency}</span>
            <NumberFieldInput aria-label="Maximum price" className="text-left" />
          </NumberFieldGroup>
        </NumberField>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => onApply?.(inRangeCount, selected)}
      >
        Show {inRangeCount} items
      </Button>
    </div>
  );
}
