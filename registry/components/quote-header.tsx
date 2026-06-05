import type { ComponentPropsWithoutRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { MetricStat } from "@/components/metric-stat"
import { PriceChange } from "@/components/ui/price-change"
import { Sparkline } from "@/components/ui/sparkline"
import {
  formatCompact,
  formatPrice,
  formatVolume,
  makeQuote,
  makeSeries,
  type Quote,
} from "@/lib/market"
import { cn } from "@/lib/utils"

const DEFAULT_QUOTE = makeQuote({ seed: 3 })

const quoteHeaderVariants = cva("flex w-full flex-col gap-4", {
  variants: {
    size: {
      default: "",
      lg: "gap-5",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

type QuoteStat = { label: string; value: string }

type QuoteHeaderProps = Omit<ComponentPropsWithoutRef<"div">, "children"> &
  VariantProps<typeof quoteHeaderVariants> & {
    quote?: Quote
    stats?: QuoteStat[]
    spark?: number[]
  }

function QuoteHeader({
  quote = DEFAULT_QUOTE,
  stats,
  spark,
  size = "default",
  className,
  ...props
}: QuoteHeaderProps) {
  const resolvedStats: QuoteStat[] =
    stats ??
    [
      { label: "Open", value: formatPrice(quote.price - quote.change * 0.4) },
      { label: "High", value: formatPrice(quote.price + Math.abs(quote.change)) },
      { label: "Low", value: formatPrice(quote.price - Math.abs(quote.change)) },
      {
        label: "Volume",
        value: formatVolume(quote.volume ?? 12_345_678),
      },
      {
        label: "Mkt cap",
        value: formatCompact(quote.marketCap ?? quote.price * 1_000_000_000),
      },
    ]

  const sparkData = spark ?? makeSeries(32, { seed: 9 })

  return (
    <div
      data-slot="quote-header"
      className={cn(quoteHeaderVariants({ size }), className)}
      {...props}
    >
      <div data-slot="quote-header-main" className="flex flex-wrap items-end gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span
              data-slot="quote-header-symbol"
              className="text-lg font-medium tracking-tight"
            >
              {quote.symbol}
            </span>
            {quote.name ? (
              <span
                data-slot="quote-header-name"
                className="truncate text-sm text-muted-foreground"
              >
                {quote.name}
              </span>
            ) : null}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span
              data-slot="quote-header-price"
              className={cn(
                "font-mono tracking-tight text-foreground",
                size === "lg" ? "text-4xl" : "text-3xl",
              )}
            >
              {formatPrice(quote.price)}
            </span>
            <PriceChange value={quote.change} percent={quote.changePercent} />
          </div>
        </div>
        <Sparkline
          data={sparkData}
          width={size === "lg" ? 160 : 120}
          height={size === "lg" ? 48 : 40}
          aria-label={`${quote.symbol} intraday trend`}
        />
      </div>
      <div
        data-slot="quote-header-stats"
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
      >
        {resolvedStats.map((stat) => (
          <MetricStat
            key={stat.label}
            label={stat.label}
            value={<span className="font-mono text-base">{stat.value}</span>}
          />
        ))}
      </div>
    </div>
  )
}

export { QuoteHeader, quoteHeaderVariants }
export type { QuoteHeaderProps, QuoteStat }
