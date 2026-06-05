import type { ComponentPropsWithoutRef } from "react"
import { useId } from "react"

import {
  makeCandles,
  volumeProfileGeometry,
  volumeProfilePocIndex,
} from "@/lib/market"
import type { Candle } from "@/lib/market"
import { cn } from "@/lib/utils"

type VolumeProfileProps = Omit<ComponentPropsWithoutRef<"svg">, "children"> & {
  data?: Candle[]
  width?: number
  height?: number
  bins?: number
  showPoc?: boolean
}

const VolumeProfile = ({
  data = makeCandles(48, { seed: 11 }),
  width = 120,
  height = 280,
  bins = 24,
  showPoc = true,
  className,
  "aria-label": ariaLabel = "Session volume profile",
  ...props
}: VolumeProfileProps) => {
  const titleId = useId()
  const bars = volumeProfileGeometry(data, { width, height, bins })
  const pocIndex = volumeProfilePocIndex(bars)
  const poc = pocIndex >= 0 ? bars[pocIndex] : null

  return (
    <svg
      data-slot="volume-profile"
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

      <g data-slot="volume-profile-bars">
        {bars.map((bar, index) => (
          <rect
            key={`${bar.price}-${index}`}
            data-slot="volume-profile-bar"
            x={0}
            y={bar.y}
            width={bar.width}
            height={Math.max(1, bar.height - 0.5)}
            className="fill-chart-1/40 stroke-chart-1/60"
            strokeWidth={0.5}
          />
        ))}
      </g>

      {showPoc && poc ? (
        <line
          data-slot="volume-profile-poc"
          x1={0}
          y1={poc.y + poc.height / 2}
          x2={width}
          y2={poc.y + poc.height / 2}
          strokeWidth={1}
          strokeDasharray="4 3"
          className="stroke-brand"
        />
      ) : null}
    </svg>
  )
}

export { VolumeProfile }
export type { VolumeProfileProps }
