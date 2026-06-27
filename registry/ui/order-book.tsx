"use client"

import type { ComponentPropsWithoutRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { formatCompact, formatPrice, makeOrderBook } from "@/lib/market"
import type { OrderBookLevel } from "@/lib/market"
import { cn } from "@/lib/utils"

const defaultBook = makeOrderBook()

const orderBookVariants = cva("flex w-full font-mono text-xs", {
  variants: {
    layout: {
      split: "flex-row gap-px",
      vertical: "flex-col gap-px",
    },
  },
  defaultVariants: {
    layout: "vertical",
  },
})

const sidePanelVariants = cva("flex min-w-0 flex-1 flex-col", {
  variants: {
    layout: {
      split: "",
      vertical: "",
    },
    side: {
      ask: "",
      bid: "",
    },
  },
  compoundVariants: [
    { layout: "split", side: "ask", className: "order-1" },
    { layout: "split", side: "bid", className: "order-3" },
  ],
  defaultVariants: {
    layout: "vertical",
    side: "bid",
  },
})

type OrderBookProps = Omit<ComponentPropsWithoutRef<"div">, "children"> &
  VariantProps<typeof orderBookVariants> & {
    bids?: OrderBookLevel[]
    asks?: OrderBookLevel[]
    /** Rows rendered per side (best levels first). */
    depth?: number
    /** Bid-ask spread; computed from best bid/ask when omitted. */
    spread?: number
    onSelectPrice?: (price: number) => void
  }

function computeSpread(
  bids: OrderBookLevel[],
  asks: OrderBookLevel[],
  spread?: number,
): number {
  if (spread !== undefined) return spread
  if (bids.length === 0 || asks.length === 0) return 0
  const bestBid = Math.max(...bids.map((level) => level.price))
  const bestAsk = Math.min(...asks.map((level) => level.price))
  return Math.max(0, bestAsk - bestBid)
}

function OrderBookRow({
  side,
  level,
  maxSize,
  onSelectPrice,
}: {
  side: "bid" | "ask"
  level: OrderBookLevel
  maxSize: number
  onSelectPrice?: (price: number) => void
}) {
  const depthPct = maxSize > 0 ? (level.size / maxSize) * 100 : 0

  return (
    <button
      type="button"
      data-slot="order-book-row"
      data-side={side}
      aria-label={`${side} ${formatPrice(level.price)} size ${formatCompact(level.size)}`}
      onClick={() => onSelectPrice?.(level.price)}
      className={cn(
        "relative grid w-full grid-cols-[1fr_auto] items-center gap-2 px-2 py-1 text-left",
        "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <span
        data-slot="order-book-depth-bar"
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0",
          side === "bid" ? "bg-success/10" : "bg-destructive/10",
        )}
        style={{ width: `${depthPct}%` }}
      />
      <span data-slot="order-book-price" className="relative z-10 tabular-nums">
        {formatPrice(level.price)}
      </span>
      <span
        data-slot="order-book-size"
        className="relative z-10 tabular-nums text-muted-foreground"
      >
        {formatCompact(level.size)}
      </span>
    </button>
  )
}

function OrderBookSide({
  side,
  levels,
  layout,
  onSelectPrice,
}: {
  side: "bid" | "ask"
  levels: OrderBookLevel[]
  layout: "split" | "vertical"
  onSelectPrice?: (price: number) => void
}) {
  const maxSize = levels.reduce((max, level) => Math.max(max, level.size), 0)

  return (
    <div
      data-slot={`order-book-${side}s`}
      className={cn(sidePanelVariants({ layout, side }))}
    >
      {levels.map((level) => (
        <OrderBookRow
          key={`${side}-${level.price}`}
          side={side}
          level={level}
          maxSize={maxSize}
          onSelectPrice={onSelectPrice}
        />
      ))}
    </div>
  )
}

function OrderBook({
  bids = defaultBook.bids,
  asks = defaultBook.asks,
  depth = 8,
  layout = "vertical",
  spread,
  onSelectPrice,
  className,
  ...props
}: OrderBookProps) {
  const visibleBids = [...bids]
    .sort((a, b) => b.price - a.price)
    .slice(0, depth)
  const visibleAsks = [...asks]
    .sort((a, b) => a.price - b.price)
    .slice(0, depth)
  const spreadValue = computeSpread(visibleBids, visibleAsks, spread)

  return (
    <div
      data-slot="order-book"
      data-layout={layout}
      className={cn(
        orderBookVariants({ layout }),
        "overflow-hidden rounded-lg edge bg-card",
        className,
      )}
      {...props}
    >
      <OrderBookSide
        side="ask"
        levels={visibleAsks}
        layout={layout ?? "vertical"}
        onSelectPrice={onSelectPrice}
      />

      <div
        data-slot="order-book-spread"
        className={cn(
          "flex items-center justify-center bg-muted/30 px-2 py-1.5 text-muted-foreground",
          layout === "split"
            ? "order-2 shrink-0 flex-col border-x border-border px-2"
            : "border-y border-border",
        )}
      >
        <span className="text-[10px] uppercase tracking-wide">Spread</span>
        <span
          className={cn(
            "tabular-nums text-foreground",
            layout === "split" ? "mt-0.5" : "ml-1",
          )}
        >
          {formatPrice(spreadValue)}
        </span>
      </div>

      <OrderBookSide
        side="bid"
        levels={visibleBids}
        layout={layout ?? "vertical"}
        onSelectPrice={onSelectPrice}
      />
    </div>
  )
}

export { OrderBook, orderBookVariants }
export type { OrderBookProps }
