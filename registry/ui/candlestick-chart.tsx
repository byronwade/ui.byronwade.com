"use client"

import type { ComponentPropsWithoutRef, PointerEvent } from "react"
import { useEffect, useId, useMemo, useRef, useState } from "react"

import {
  candleGeometry,
  formatPrice,
  formatTradeTime,
  formatVolume,
  linearScale,
  makeCandles,
} from "@/lib/market"
import type { Candle } from "@/lib/market"
import { cn } from "@/lib/utils"

const GRID_ROWS = 4
const VOLUME_RATIO = 0.2

type CandlestickChartProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  data?: Candle[]
  width?: number
  height?: number
  showVolume?: boolean
  showGrid?: boolean
  /** Static center crosshair (demo / screenshot mode). */
  showCrosshair?: boolean
  /** Pointer crosshair snapped to the nearest candle. */
  interactive?: boolean
  /** Size to the parent box (uses ResizeObserver). */
  fill?: boolean
  onCandleHover?: (candle: Candle | null, index: number | null) => void
  className?: string
  "aria-label"?: string
}

const CandlestickChart = ({
  data = makeCandles(48, { seed: 7 }),
  width = 480,
  height = 280,
  showVolume = true,
  showGrid = true,
  showCrosshair = false,
  interactive = false,
  fill = false,
  onCandleHover,
  className,
  "aria-label": ariaLabel = "Candlestick chart",
  ...props
}: CandlestickChartProps) => {
  const titleId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [measured, setMeasured] = useState({ width, height })

  useEffect(() => {
    if (!fill) return
    const node = rootRef.current
    if (!node) return

    const update = () => {
      const rect = node.getBoundingClientRect()
      const nextWidth = Math.max(1, Math.floor(rect.width))
      const nextHeight = Math.max(1, Math.floor(rect.height))
      setMeasured((current) =>
        current.width === nextWidth && current.height === nextHeight
          ? current
          : { width: nextWidth, height: nextHeight },
      )
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => observer.disconnect()
  }, [fill])

  const renderWidth = fill ? measured.width : width
  const renderHeight = fill ? measured.height : height
  const volumeRatio = showVolume ? VOLUME_RATIO : 0
  const priceHeight = renderHeight * (1 - volumeRatio)
  const volumeTop = priceHeight
  const volumeHeight = renderHeight - priceHeight

  const geometry = useMemo(
    () =>
      candleGeometry(data, {
        width: renderWidth,
        height: renderHeight,
        volumeRatio,
      }),
    [data, renderWidth, renderHeight, volumeRatio],
  )

  const slot = data.length > 0 ? renderWidth / data.length : renderWidth
  const bodyWidth = Math.max(1, slot * 0.6)

  const maxVolume = data.length > 0 ? Math.max(...data.map((c) => c.volume)) : 0
  const volumeScale = linearScale(0, maxVolume, 0, volumeHeight)

  const hovered = hoverIndex != null ? data[hoverIndex] : null
  const hoveredGeometry = hoverIndex != null ? geometry[hoverIndex] : null

  const resolveIndex = (clientX: number, rect: DOMRect) => {
    if (data.length === 0) return null
    const x = ((clientX - rect.left) / rect.width) * renderWidth
    return Math.min(data.length - 1, Math.max(0, Math.floor(x / slot)))
  }

  const setHover = (index: number | null) => {
    setHoverIndex(index)
    if (index == null) {
      onCandleHover?.(null, null)
      return
    }
    onCandleHover?.(data[index], index)
  }

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!interactive) return
    const rect = event.currentTarget.getBoundingClientRect()
    setHover(resolveIndex(event.clientX, rect))
  }

  const handlePointerLeave = () => {
    if (!interactive) return
    setHover(null)
  }

  const chart = (
    <svg
      data-slot="candlestick-chart"
      role="img"
      aria-label={ariaLabel}
      aria-labelledby={titleId}
      width={renderWidth}
      height={renderHeight}
      viewBox={`0 0 ${renderWidth} ${renderHeight}`}
      className={cn(
        "block overflow-visible",
        fill ? "h-full w-full" : "h-auto w-full",
        interactive && "cursor-crosshair touch-none",
        !interactive && !fill && className,
      )}
      onPointerMove={interactive ? handlePointerMove : undefined}
      onPointerLeave={interactive ? handlePointerLeave : undefined}
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
                x2={renderWidth}
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
            const dimmed = hoverIndex != null && hoverIndex !== index
            return (
              <rect
                key={`v-${candle.time}-${index}`}
                data-slot="candle-volume-bar"
                x={g.x - bodyWidth / 2}
                y={volumeTop + (volumeHeight - barHeight)}
                width={bodyWidth}
                height={Math.max(0, barHeight)}
                className={cn(
                  g.bullish ? "fill-success/30" : "fill-destructive/30",
                  dimmed && "opacity-40",
                )}
              />
            )
          })}
        </g>
      ) : null}

      {geometry.map((g, index) => {
        const candle = data[index]
        const tone = g.bullish ? "text-success" : "text-destructive"
        const dimmed = hoverIndex != null && hoverIndex !== index
        return (
          <g
            key={`${candle.time}-${index}`}
            data-slot="candle"
            data-direction={g.bullish ? "up" : "down"}
            data-active={hoverIndex === index ? "true" : undefined}
            className={cn(tone, dimmed && "opacity-40")}
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

      {interactive && hoveredGeometry ? (
        <g
          data-slot="candle-crosshair"
          className="pointer-events-none stroke-muted-foreground"
          strokeDasharray="3 3"
          strokeWidth={1}
        >
          <line
            x1={hoveredGeometry.x}
            y1={0}
            x2={hoveredGeometry.x}
            y2={renderHeight}
          />
          <line
            x1={0}
            y1={hoveredGeometry.closeY}
            x2={renderWidth}
            y2={hoveredGeometry.closeY}
          />
        </g>
      ) : null}

      {showCrosshair && !interactive ? (
        <g
          data-slot="candle-crosshair"
          className="stroke-muted-foreground"
          strokeDasharray="3 3"
          strokeWidth={1}
        >
          <line
            x1={renderWidth / 2}
            y1={0}
            x2={renderWidth / 2}
            y2={renderHeight}
          />
          <line
            x1={0}
            y1={priceHeight / 2}
            x2={renderWidth}
            y2={priceHeight / 2}
          />
        </g>
      ) : null}

      {showVolume ? (
        <line
          data-slot="candle-axis"
          x1={0}
          y1={volumeTop}
          x2={renderWidth}
          y2={volumeTop}
          strokeWidth={1}
          className="stroke-border"
        />
      ) : null}
    </svg>
  )

  if (!interactive && !fill) return chart

  return (
    <div
      ref={fill ? rootRef : undefined}
      data-slot="candlestick-chart-root"
      className={cn(
        "relative min-w-0",
        fill && "h-full min-h-0 w-full",
        !fill && "w-full",
        className,
      )}
      {...props}
    >
      {chart}
      {interactive && hovered ? (
        <div
          data-slot="candlestick-chart-readout"
          className={cn(
            "pointer-events-none absolute rounded-lg border border-border/70 bg-card/95 px-2.5 py-1.5 font-mono text-xs shadow-sm backdrop-blur-sm",
            fill ? "right-2 top-2" : "left-2 top-2",
          )}
        >
          <p className="text-muted-foreground">
            {formatTradeTime(hovered.time)}
          </p>
          <div className="mt-1 grid grid-cols-4 gap-x-3 gap-y-0.5 tabular-nums">
            <span>
              <span className="text-muted-foreground">O </span>
              {formatPrice(hovered.open)}
            </span>
            <span className="text-success">
              <span className="text-muted-foreground">H </span>
              {formatPrice(hovered.high)}
            </span>
            <span className="text-destructive">
              <span className="text-muted-foreground">L </span>
              {formatPrice(hovered.low)}
            </span>
            <span>
              <span className="text-muted-foreground">C </span>
              {formatPrice(hovered.close)}
            </span>
          </div>
          <p className="mt-1 text-muted-foreground">
            Vol {formatVolume(hovered.volume)}
          </p>
        </div>
      ) : null}
    </div>
  )
}

export { CandlestickChart }
export type { CandlestickChartProps }
