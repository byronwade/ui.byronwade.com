"use client"

import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { DepthChart } from "@/components/ui/depth-chart"
import { OrderBook } from "@/components/ui/order-book"
import {
  formatCompact,
  formatPrice,
  makeOrderBook,
  type OrderBookLevel,
} from "@/lib/market"
import { cn } from "@/lib/utils"

const defaultBook = makeOrderBook()

const marketDepthVariants = cva("flex w-full flex-col", {
  variants: {
    variant: {
      default: "gap-3",
      panel: "overflow-hidden rounded-xl border border-border bg-card",
      terminal: "overflow-hidden rounded-lg border border-border bg-background font-mono",
    },
    view: {
      both: "",
      book: "",
      chart: "",
    },
    layout: {
      stacked: "",
      split: "",
    },
    size: {
      sm: "",
      default: "",
      lg: "",
    },
    density: {
      compact: "",
      comfortable: "",
    },
  },
  compoundVariants: [
    { variant: "panel", density: "compact", className: "gap-2 p-3" },
    { variant: "panel", density: "comfortable", className: "gap-4 p-4" },
    { variant: "terminal", density: "compact", className: "gap-2 p-2" },
    { variant: "terminal", density: "comfortable", className: "gap-3 p-3" },
  ],
  defaultVariants: {
    variant: "default",
    view: "both",
    layout: "stacked",
    size: "default",
    density: "comfortable",
  },
})

const marketDepthBodyVariants = cva("grid w-full min-w-0", {
  variants: {
    layout: {
      stacked: "gap-3",
      split: "gap-3 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]",
    },
    view: {
      both: "",
      book: "",
      chart: "",
    },
  },
  defaultVariants: {
    layout: "stacked",
    view: "both",
  },
})

type MarketDepthMetric = {
  label: ReactNode
  value: ReactNode
  tone?: "default" | "positive" | "negative" | "muted"
}

type MarketDepthProps = Omit<ComponentPropsWithoutRef<"div">, "children"> &
  VariantProps<typeof marketDepthVariants> & {
    bids?: OrderBookLevel[]
    asks?: OrderBookLevel[]
    depth?: number
    title?: ReactNode
    symbol?: ReactNode
    description?: ReactNode
    metrics?: MarketDepthMetric[]
    footer?: ReactNode
    empty?: ReactNode
    chartHeight?: number
    chartWidth?: number
    chartClassName?: string
    bookClassName?: string
    bookLayout?: "split" | "vertical"
    showMidline?: boolean
    onSelectPrice?: (price: number) => void
  }

function sumSize(levels: OrderBookLevel[]) {
  return levels.reduce((total, level) => total + level.size, 0)
}

function computeSpread(bids: OrderBookLevel[], asks: OrderBookLevel[]) {
  if (bids.length === 0 || asks.length === 0) return 0
  const bestBid = Math.max(...bids.map((level) => level.price))
  const bestAsk = Math.min(...asks.map((level) => level.price))
  return Math.max(0, bestAsk - bestBid)
}

function metricToneClass(tone: MarketDepthMetric["tone"]) {
  if (tone === "positive") return "text-success"
  if (tone === "negative") return "text-destructive"
  if (tone === "muted") return "text-muted-foreground"
  return "text-foreground"
}

function MarketDepth({
  bids = defaultBook.bids,
  asks = defaultBook.asks,
  variant = "default",
  view = "both",
  layout = "stacked",
  size = "default",
  density = "comfortable",
  depth,
  title,
  symbol,
  description,
  metrics,
  footer,
  empty = "No order book depth available.",
  chartHeight = size === "lg" ? 260 : size === "sm" ? 160 : 200,
  chartWidth = 480,
  chartClassName,
  bookClassName,
  bookLayout,
  showMidline = true,
  onSelectPrice,
  className,
  ...props
}: MarketDepthProps) {
  const hasBook = bids.length > 0 || asks.length > 0
  const summaryMetrics =
    metrics ??
    [
      { label: "Bid depth", value: formatCompact(sumSize(bids)), tone: "positive" },
      { label: "Ask depth", value: formatCompact(sumSize(asks)), tone: "negative" },
      { label: "Spread", value: formatPrice(computeSpread(bids, asks)), tone: "muted" },
    ]

  return (
    <div
      data-slot="market-depth"
      data-variant={variant}
      data-view={view}
      data-layout={layout}
      data-size={size}
      data-density={density}
      className={cn(
        marketDepthVariants({ variant, view, layout, size, density }),
        className,
      )}
      {...props}
    >
      {title || symbol || description || summaryMetrics.length > 0 ? (
        <div
          data-slot="market-depth-header"
          className={cn(
            "flex flex-wrap items-start justify-between gap-3",
            variant === "default" ? "" : "border-b border-border pb-3",
          )}
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {title ? (
                <h3 className="text-sm font-medium tracking-normal">{title}</h3>
              ) : null}
              {symbol ? (
                <span className="font-mono text-xs text-muted-foreground">
                  {symbol}
                </span>
              ) : null}
            </div>
            {description ? (
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {summaryMetrics.length > 0 ? (
            <dl
              data-slot="market-depth-metrics"
              className="grid grid-cols-3 gap-3 text-right"
            >
              {summaryMetrics.map((metric, index) => (
                <div key={index} className="min-w-0">
                  <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {metric.label}
                  </dt>
                  <dd
                    className={cn(
                      "font-mono text-xs tabular-nums",
                      metricToneClass(metric.tone),
                    )}
                  >
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      ) : null}

      {!hasBook ? (
        <div
          data-slot="market-depth-empty"
          className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground"
        >
          {empty}
        </div>
      ) : (
        <div
          data-slot="market-depth-body"
          className={cn(marketDepthBodyVariants({ layout, view }))}
        >
          {view === "both" || view === "chart" ? (
            <DepthChart
              bids={bids}
              asks={asks}
              width={chartWidth}
              height={chartHeight}
              showMidline={showMidline}
              className={cn("w-full", chartClassName)}
            />
          ) : null}
          {view === "both" || view === "book" ? (
            <OrderBook
              bids={bids}
              asks={asks}
              depth={depth}
              layout={bookLayout ?? (layout === "split" ? "split" : "vertical")}
              onSelectPrice={onSelectPrice}
              className={cn("w-full", bookClassName)}
            />
          ) : null}
        </div>
      )}

      {footer ? (
        <div
          data-slot="market-depth-footer"
          className={cn(
            "text-xs text-muted-foreground",
            variant === "default" ? "" : "border-t border-border pt-3",
          )}
        >
          {footer}
        </div>
      ) : null}
    </div>
  )
}

export { MarketDepth, marketDepthVariants }
export type { MarketDepthProps }
