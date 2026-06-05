import type { ComponentPropsWithoutRef } from "react"
import { useId } from "react"

import { cumulativeDepthPath, makeOrderBook } from "@/lib/market"
import type { OrderBookLevel } from "@/lib/market"
import { cn } from "@/lib/utils"

const defaultBook = makeOrderBook()

type DepthChartProps = Omit<ComponentPropsWithoutRef<"svg">, "children"> & {
  bids?: OrderBookLevel[]
  asks?: OrderBookLevel[]
  width?: number
  height?: number
  showMidline?: boolean
}

const DepthChart = ({
  bids = defaultBook.bids,
  asks = defaultBook.asks,
  width = 480,
  height = 200,
  showMidline = true,
  className,
  "aria-label": ariaLabel = "Order book depth chart",
  ...props
}: DepthChartProps) => {
  const titleId = useId()
  const half = width / 2

  // Each side gets its own half of the canvas, mirrored about the midline so the
  // best bid/ask meet in the center: bids fill the left half, asks the right.
  const bidPath =
    bids.length > 0 ? cumulativeDepthPath(bids, half, height, "bid") : ""
  const askPath =
    asks.length > 0 ? cumulativeDepthPath(asks, half, height, "ask") : ""

  return (
    <svg
      data-slot="depth-chart"
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

      {bidPath ? (
        // Flip the left half horizontally so cumulative depth grows toward the
        // midline (best bid in the center, deepest book at the left edge).
        <g
          data-slot="depth-bid-group"
          transform={`translate(${half},0) scale(-1,1)`}
        >
          <path
            data-slot="depth-bid"
            d={bidPath}
            strokeWidth={1.5}
            strokeLinejoin="round"
            className="fill-success/15 stroke-success"
          />
        </g>
      ) : null}

      {askPath ? (
        <g data-slot="depth-ask-group" transform={`translate(${half},0)`}>
          <path
            data-slot="depth-ask"
            d={askPath}
            strokeWidth={1.5}
            strokeLinejoin="round"
            className="fill-destructive/15 stroke-destructive"
          />
        </g>
      ) : null}

      {showMidline ? (
        <line
          data-slot="depth-midline"
          x1={half}
          y1={0}
          x2={half}
          y2={height}
          strokeWidth={1}
          strokeDasharray="3 3"
          className="stroke-border"
        />
      ) : null}
    </svg>
  )
}

export { DepthChart }
export type { DepthChartProps }
