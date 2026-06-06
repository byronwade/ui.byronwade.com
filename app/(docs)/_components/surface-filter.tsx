"use client"

import { SegmentedControl } from "@/components/ui/segmented-control"
import {
  catalogSurfaces,
  surfaceCounts,
  type SurfaceFilter,
} from "@/content/catalog-surfaces"

const OPTIONS: { label: string; value: SurfaceFilter }[] = [
  { label: "All", value: "all" },
  ...catalogSurfaces.map((s) => ({
    label: s.shortLabel,
    value: s.id,
  })),
]

export function SurfaceFilterControl({
  value,
  onValueChange,
  counts,
}: {
  value: SurfaceFilter
  onValueChange: (value: SurfaceFilter) => void
  /** Optional per-option counts; defaults to live catalog totals. */
  counts?: Partial<Record<SurfaceFilter, number>>
}) {
  const totals = surfaceCounts()
  const countFor = (v: SurfaceFilter) => {
    if (counts?.[v] != null) return counts[v]
    if (v === "all") return totals.total
    return totals[v]
  }

  return (
    <SegmentedControl
      options={OPTIONS.map((o) => ({
        label: `${o.label} (${countFor(o.value)})`,
        value: o.value,
      }))}
      value={value}
      onValueChange={onValueChange}
    />
  )
}
