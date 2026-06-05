import type { ComponentPropsWithoutRef } from "react"
import { useId } from "react"

import { candleGeometry, linearScale, makeCandles } from "@/lib/market"
import type { Candle } from "@/lib/market"
import { cn } from "@/lib/utils"

const GRID_ROWS = 4
const VOLUME_RATIO = 0.2

type CandlestickChartProps = Omit<ComponentPropsWithoutRef<"svg">, "children"> & {
  data?: Candle[]
  width?: number
  height?: number
  showVolume?: boolean
  showGrid?: boolean
  showCrosshair?: boolean
}

const CandlestickChart = ({
  data = makeCandles(48, { seed: 7 }),
  width = 480,
  height = 280,
  showVolume = true,
  showGrid = true,
  showCrosshair = false,
  className,
  "aria-label": ariaLabel = "Candlestick chart",
  ...props
}: CandlestickChartProps) => {
  const titleId = useId()
  const volumeRatio = showVolume ? VOLUME_RATIO : 0
  const priceHeight = height * (1 - volumeRatio)
  const volumeTop = priceHeight
  const volumeHeight = height - priceHeight

  const geometry = candleGeometry(data, { width, height, volumeRatio })
  // Candle slot width: spread evenly, leave a gap; min 1 so bodies stay visible.
  const slot = data.length > 0 ? width / data.length : width
  const bodyWidth = Math.max(1, slot * 0.6)

  const maxVolume = data.length > 0 ? Math.max(...data.map((c) => c.volume)) : 0
  const volumeScale = linearScale(0, maxVolume, 0, volumeHeight)

  return (
    <svg
      data-slot="candlestick-chart"
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

      {showGrid ? (
        <g data-slot="candle-grid" className="stroke-border">
          {Array.from({ length: GRID_ROWS + 1 }, (_, row) => {
            const y = (priceHeight / GRID_ROWS) * row
            return (
              <line
                key={`h-${row}`}
                x1={0}
                y1={y}
                x2={width}
                y2={y}
                strokeWidth={1}
                strokeOpacity={0.5}
              />
            )
          })}
        </g>
      ) : null}

      {showVolume ? (
        <g data-slot="candle-volume">
          {geometry.map((g, index) => {
            const candle = data[index]
            const barHeight = volumeScale(candle.volume)
            return (
              <rect
                key={`v-${candle.time}-${index}`}
                data-slot="candle-volume-bar"
                x={g.x - bodyWidth / 2}
                y={volumeTop + (volumeHeight - barHeight)}
                width={bodyWidth}
                height={Math.max(0, barHeight)}
                className={g.bullish ? "fill-success/30" : "fill-destructive/30"}
              />
            )
          })}
        </g>
      ) : null}

      {geometry.map((g, index) => {
        const candle = data[index]
        const tone = g.bullish ? "text-success" : "text-destructive"
        return (
          <g
            key={`${candle.time}-${index}`}
            data-slot="candle"
            data-direction={g.bullish ? "up" : "down"}
            className={tone}
          >
            <line
              data-slot="candle-wick"
              x1={g.x}
              y1={g.highY}
              x2={g.x}
              y2={g.lowY}
              strokeWidth={1}
              className="stroke-current"
            />
            <rect
              data-slot="candle-body"
              x={g.x - bodyWidth / 2}
              y={g.bodyTop}
              width={bodyWidth}
              height={g.bodyHeight}
              className="fill-current"
            />
          </g>
        )
      })}

      {showCrosshair ? (
        <g
          data-slot="candle-crosshair"
          className="stroke-muted-foreground"
          strokeDasharray="3 3"
          strokeWidth={1}
        >
          <line x1={width / 2} y1={0} x2={width / 2} y2={height} />
          <line x1={0} y1={priceHeight / 2} x2={width} y2={priceHeight / 2} />
        </g>
      ) : null}

      {showVolume ? (
        <line
          data-slot="candle-axis"
          x1={0}
          y1={volumeTop}
          x2={width}
          y2={volumeTop}
          strokeWidth={1}
          className="stroke-border"
        />
      ) : null}
    </svg>
  )
}

export { CandlestickChart }
export type { CandlestickChartProps }
