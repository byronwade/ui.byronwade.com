"use client"

import type { ComponentPropsWithoutRef } from "react"
import { useMemo, useState } from "react"

import { PriceChange } from "@/components/ui/price-change"
import { Sparkline } from "@/components/ui/sparkline"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  formatPrice,
  makeMarketMovers,
  makeSeries,
  type MoverRow,
} from "@/lib/market"
import { cn } from "@/lib/utils"

const DEFAULT_MOVERS = makeMarketMovers(5, { seed: 4 })

type MarketMoversTab = "gainers" | "losers" | "active"

type MarketMoversProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  gainers?: MoverRow[]
  losers?: MoverRow[]
  active?: MoverRow[]
  onSelect?: (symbol: string) => void
}

function MoverRowItem({
  row,
  index,
  onSelect,
}: {
  row: MoverRow
  index: number
  onSelect?: (symbol: string) => void
}) {
  return (
    <button
      type="button"
      data-slot="market-movers-row"
      data-symbol={row.symbol}
      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors outline-none hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50"
      onClick={() => onSelect?.(row.symbol)}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.symbol}</span>
          {row.name ? (
            <span className="truncate text-xs text-muted-foreground">{row.name}</span>
          ) : null}
        </div>
        <span className="font-mono text-sm text-muted-foreground">
          {formatPrice(row.price, { currency: "USD" })}
        </span>
      </div>
      <PriceChange
        value={row.changePercent}
        format="percent"
        size="sm"
      />
      <Sparkline
        data={row.spark ?? makeSeries(16, { seed: index + 40 })}
        width={64}
        height={24}
        aria-label={`${row.symbol} trend`}
      />
    </button>
  )
}

function MarketMovers({
  gainers = DEFAULT_MOVERS.gainers,
  losers = DEFAULT_MOVERS.losers,
  active = DEFAULT_MOVERS.active,
  onSelect,
  className,
  ...props
}: MarketMoversProps) {
  const [tab, setTab] = useState<MarketMoversTab>("gainers")

  const rows = useMemo(() => {
    if (tab === "losers") return losers
    if (tab === "active") return active
    return gainers
  }, [tab, gainers, losers, active])

  return (
    <div
      data-slot="market-movers"
      className={cn("w-full max-w-md rounded-xl edge bg-card p-3", className)}
      {...props}
    >
      <Tabs value={tab} onValueChange={(value) => setTab(value as MarketMoversTab)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gainers">Gainers</TabsTrigger>
          <TabsTrigger value="losers">Losers</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
        </TabsList>
        <TabsContent value="gainers" className="mt-3 space-y-1">
          {gainers.map((row, index) => (
            <MoverRowItem key={row.symbol} row={row} index={index} onSelect={onSelect} />
          ))}
        </TabsContent>
        <TabsContent value="losers" className="mt-3 space-y-1">
          {losers.map((row, index) => (
            <MoverRowItem key={row.symbol} row={row} index={index} onSelect={onSelect} />
          ))}
        </TabsContent>
        <TabsContent value="active" className="mt-3 space-y-1">
          {active.map((row, index) => (
            <MoverRowItem key={row.symbol} row={row} index={index} onSelect={onSelect} />
          ))}
        </TabsContent>
      </Tabs>
      <div className="sr-only" aria-live="polite">
        {rows.length} movers shown
      </div>
    </div>
  )
}

export { MarketMovers }
export type { MarketMoversProps, MarketMoversTab }
