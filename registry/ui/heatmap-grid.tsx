"use client"

import type { ComponentPropsWithoutRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { formatPercent, makeHeatmapCells } from "@/lib/market"
import type { HeatmapCell } from "@/lib/market"
import { cn } from "@/lib/utils"

const defaultCells = makeHeatmapCells(12, { seed: 11 })

const heatmapGridVariants = cva("flex flex-wrap gap-1", {
  variants: {
    scale: {
      tone: "",
      chart: "",
    },
  },
  defaultVariants: {
    scale: "tone",
  },
})

type Magnitude = "low" | "mid" | "high" | "max"

function magnitudeBucket(change: number): Magnitude {
  const abs = Math.abs(change)
  if (abs < 1) return "low"
  if (abs < 3) return "mid"
  if (abs < 5) return "high"
  return "max"
}

const toneCellClass: Record<
  Magnitude,
  { up: string; down: string; flat: string }
> = {
  low: {
    up: "bg-success/10 text-success",
    down: "bg-destructive/10 text-destructive",
    flat: "bg-muted text-muted-foreground",
  },
  mid: {
    up: "bg-success/20 text-success",
    down: "bg-destructive/20 text-destructive",
    flat: "bg-muted text-muted-foreground",
  },
  high: {
    up: "bg-success/30 text-success",
    down: "bg-destructive/30 text-destructive",
    flat: "bg-muted text-muted-foreground",
  },
  max: {
    up: "bg-success/40 text-success",
    down: "bg-destructive/40 text-destructive",
    flat: "bg-muted text-muted-foreground",
  },
}

const chartCellClass: Record<Magnitude, string> = {
  low: "bg-chart-1 text-foreground",
  mid: "bg-chart-2 text-foreground",
  high: "bg-chart-3 text-foreground",
  max: "bg-chart-4 text-foreground",
}

function cellToneClass(cell: HeatmapCell, scale: "tone" | "chart"): string {
  const bucket = magnitudeBucket(cell.change)
  if (scale === "chart") return chartCellClass[bucket]
  if (cell.change > 0) return toneCellClass[bucket].up
  if (cell.change < 0) return toneCellClass[bucket].down
  return toneCellClass[bucket].flat
}

type HeatmapGridProps = Omit<ComponentPropsWithoutRef<"div">, "children"> &
  VariantProps<typeof heatmapGridVariants> & {
    cells?: HeatmapCell[]
    metric?: "change"
    columns?: number
    onSelect?: (symbol: string) => void
  }

function HeatmapGrid({
  cells = defaultCells,
  metric = "change",
  columns,
  scale = "tone",
  onSelect,
  className,
  ...props
}: HeatmapGridProps) {
  const totalWeight = cells.reduce((sum, cell) => sum + cell.weight, 0)
  const columnCount = columns ?? Math.ceil(Math.sqrt(cells.length))
  const minCellWidth = `${100 / columnCount}%`

  return (
    <div
      data-slot="heatmap-grid"
      data-scale={scale}
      data-metric={metric}
      aria-label="Market performance heatmap"
      className={cn(heatmapGridVariants({ scale }), className)}
      {...props}
    >
      {cells.map((cell, index) => {
        const weightPct =
          totalWeight > 0
            ? (cell.weight / totalWeight) * 100
            : 100 / cells.length

        return (
          <button
            key={`${cell.symbol}-${index}`}
            type="button"
            data-slot="heatmap-cell"
            data-symbol={cell.symbol}
            aria-label={`${cell.symbol} ${formatPercent(cell.change)}`}
            onClick={() => onSelect?.(cell.symbol)}
            style={{
              flexBasis: `${weightPct}%`,
              minWidth: minCellWidth,
              flexGrow: 1,
            }}
            className={cn(
              "flex min-h-14 flex-col items-center justify-center rounded-lg px-2 py-3",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              cellToneClass(cell, scale ?? "tone"),
            )}
          >
            <span data-slot="heatmap-symbol" className="text-xs tracking-wide">
              {cell.symbol}
            </span>
            <span data-slot="heatmap-value" className="font-mono text-sm">
              {formatPercent(cell.change)}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export { HeatmapGrid, heatmapGridVariants }
export type { HeatmapGridProps }
