import type { ComponentPropsWithoutRef } from "react"
import { useId } from "react"

import {
  footprintGeometry,
  makeFootprintRows,
  type FootprintRow,
} from "@/lib/market"
import { cn } from "@/lib/utils"

type VolumeFootprintProps = Omit<
  ComponentPropsWithoutRef<"svg">,
  "children"
> & {
  rows?: FootprintRow[]
  width?: number
  height?: number
  showMidline?: boolean
}

const VolumeFootprint = ({
  rows = makeFootprintRows(16, { seed: 13 }),
  width = 200,
  height = 280,
  showMidline = true,
  className,
  "aria-label": ariaLabel = "Volume footprint chart",
  ...props
}: VolumeFootprintProps) => {
  const titleId = useId()
  const bars = footprintGeometry(rows, { width, height })
  const half = width / 2

  return (
    <svg
      data-slot="volume-footprint"
      role="img"
      aria-label={ariaLabel}
      aria-labelledby={titleId}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
      {...props}
    >
      <title id={titleId}>{ariaLabel}</title>

      {showMidline ? (
        <line
          data-slot="volume-footprint-midline"
          x1={half}
          y1={0}
          x2={half}
          y2={height}
          strokeWidth={1}
          strokeDasharray="3 3"
          className="stroke-border"
        />
      ) : null}

      <g data-slot="volume-footprint-bars">
        {bars.map((bar, index) => (
          <g key={`${bar.price}-${index}`} data-slot="volume-footprint-row">
            <rect
              data-slot="volume-footprint-bid"
              x={half - bar.bidWidth}
              y={bar.y}
              width={bar.bidWidth}
              height={Math.max(1, bar.height - 0.5)}
              className="fill-success/25 stroke-success/60"
              strokeWidth={0.5}
            />
            <rect
              data-slot="volume-footprint-ask"
              x={half}
              y={bar.y}
              width={bar.askWidth}
              height={Math.max(1, bar.height - 0.5)}
              className="fill-destructive/25 stroke-destructive/60"
              strokeWidth={0.5}
            />
          </g>
        ))}
      </g>
    </svg>
  )
}

export { VolumeFootprint }
export type { VolumeFootprintProps }
