"use client"

import { ChartLayoutGrid } from "@/components/chart-layout-grid"
import { ChartPanel } from "@/components/chart-panel"
import { CompareSymbols } from "@/components/compare-symbols"
import { DrawingToolbar } from "@/components/drawing-toolbar"
import { IndicatorLegend } from "@/components/indicator-legend"
import { MarketDepth } from "@/components/market-depth"
import { ReplayControls } from "@/components/replay-controls"
import { SessionStatsBar } from "@/components/session-stats-bar"
import { TimeAndSales } from "@/components/time-and-sales"
import { Watchlist } from "@/components/watchlist"
import { makeCandles, makeQuotes } from "@/lib/market"

const candle = makeCandles(1, { seed: 9 })[0]
const symbols = makeQuotes(3, { seed: 14 }).map((q) => ({
  symbol: q.symbol,
  change: q.change,
  changePercent: q.changePercent,
}))

export default function Example() {
  return (
    <div className="flex w-full max-w-6xl flex-col gap-3 p-2">
      <CompareSymbols symbols={symbols} onRemove={() => {}} onAdd={() => {}} />
      <SessionStatsBar candle={candle} symbol="AAPL" />
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex gap-2">
            <DrawingToolbar orientation="vertical" className="shrink-0" />
            <ChartLayoutGrid layout="1x2" className="min-w-0 flex-1">
              <ChartPanel symbol="AAPL" />
              <ChartPanel symbol="MSFT" />
            </ChartLayoutGrid>
          </div>
          <IndicatorLegend />
          <ReplayControls position={42} duration={120} />
        </div>
        <div className="flex min-w-0 flex-col gap-3">
          <Watchlist className="max-h-56 overflow-auto" />
          <MarketDepth className="min-h-48" />
          <TimeAndSales className="max-h-40 overflow-auto" />
        </div>
      </div>
    </div>
  )
}
