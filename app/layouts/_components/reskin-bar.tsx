"use client";

import { RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";
import { SegmentedControl } from "@/components/ui/segmented-control";

export interface Reskin {
  /** oklch/hex string applied to `--brand` (cascades to ring/success/chart-1). */
  brand?: string;
  /** length applied to `--radius` (reshapes every rounded surface). */
  radius?: string;
}

const swatches: { name: string; value?: string }[] = [
  { name: "Default" },
  { name: "Blue", value: "oklch(0.62 0.17 250)" },
  { name: "Violet", value: "oklch(0.60 0.20 290)" },
  { name: "Amber", value: "oklch(0.78 0.15 75)" },
  { name: "Rose", value: "oklch(0.64 0.21 18)" },
];

const radii = [
  { label: "Sharp", value: "0rem" },
  { label: "Default", value: "default" },
  { label: "Round", value: "1.25rem" },
];

/**
 * Live re-skin playground. Dogfoods the "override `--brand` to re-skin
 * everything" promise: swatches set `--brand` and a radius control sets
 * `--radius`, both forwarded to the preview iframe via query params.
 */
export function ReskinBar({
  value,
  onChange,
}: {
  value: Reskin;
  onChange: (next: Reskin) => void;
}) {
  const activeRadius = value.radius ?? "default";
  const dirty = Boolean(value.brand || value.radius);

  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1 shadow-card">
      <span className="hidden pl-1 text-xs font-medium text-muted-foreground md:inline">
        Re-skin
      </span>
      <div className="flex items-center gap-1">
        {swatches.map((s) => {
          const active = s.value === value.brand;
          return (
            <button
              key={s.name}
              type="button"
              title={s.name}
              aria-label={`Brand: ${s.name}`}
              aria-pressed={active}
              onClick={() => onChange({ ...value, brand: s.value })}
              className={cn(
                "size-5 rounded-full border border-border outline-none transition-transform hover:scale-110 focus-visible:ring-3 focus-visible:ring-ring/50",
                active && "ring-2 ring-foreground ring-offset-1 ring-offset-card",
              )}
              style={{ background: s.value ?? "var(--brand)" }}
            />
          );
        })}
      </div>
      <SegmentedControl
        value={activeRadius}
        onValueChange={(v) => onChange({ ...value, radius: v === "default" ? undefined : v })}
        options={radii}
      />
      {dirty && (
        <button
          type="button"
          onClick={() => onChange({})}
          aria-label="Reset re-skin"
          title="Reset"
          className="grid size-6 place-items-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <RotateCcw className="size-3.5" />
        </button>
      )}
    </div>
  );
}
