import type { ComponentPropsWithoutRef } from "react"

import { StatCard } from "@/components/stat-card"
import { PriceChange } from "@/components/ui/price-change"
import { Sparkline } from "@/components/ui/sparkline"
import { formatCompact, formatPrice, makeSeries } from "@/lib/market"
import { cn } from "@/lib/utils"

type Allocation = { label: string; percent: number }

type PortfolioSummaryProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  totalValue?: number
  dayChange?: number
  dayChangePercent?: number
  spark?: number[]
  allocations?: Allocation[]
}

const DEFAULT_ALLOCATIONS: Allocation[] = [
  { label: "Equities", percent: 58 },
  { label: "Options", percent: 22 },
  { label: "Cash", percent: 20 },
]

function PortfolioSummary({
  totalValue = 128_450.32,
  dayChange = 1842.15,
  dayChangePercent = 1.46,
  spark = makeSeries(36, { seed: 14 }),
  allocations = DEFAULT_ALLOCATIONS,
  className,
  ...props
}: PortfolioSummaryProps) {
  return (
    <div
      data-slot="portfolio-summary"
      className={cn("flex w-full max-w-3xl flex-col gap-4", className)}
      {...props}
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
        <StatCard
          label="Portfolio value"
          value={
            <span className="font-mono">{formatPrice(totalValue, { currency: "USD" })}</span>
          }
          hint={
            <PriceChange value={dayChange} percent={dayChangePercent} size="sm" />
          }
        />
        <div className="rounded-2xl border border-border bg-card p-4 edge">
          <span className="text-sm text-muted-foreground">Equity curve</span>
          <Sparkline
            data={spark}
            variant="area"
            width={220}
            height={72}
            className="mt-3"
            aria-label="Portfolio equity curve"
          />
        </div>
      </div>
      <div data-slot="portfolio-summary-allocations" className="space-y-3">
        <span className="text-sm font-medium">Allocation</span>
        {allocations.map((allocation, index) => (
          <div key={allocation.label} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>{allocation.label}</span>
              <span className="font-mono text-muted-foreground">
                {allocation.percent}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                data-slot="portfolio-summary-allocation-bar"
                className={cn(
                  "h-full rounded-full",
                  index === 0 ? "bg-brand" : "bg-brand/40",
                )}
                style={{ width: `${allocation.percent}%` }}
              />
            </div>
          </div>
        ))}
        <p className="text-xs text-muted-foreground">
          Cash reserve {formatCompact(totalValue * 0.08)}
        </p>
      </div>
    </div>
  )
}

export { PortfolioSummary }
export type { PortfolioSummaryProps, Allocation }
