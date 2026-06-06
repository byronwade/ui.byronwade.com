import { ChartPanel } from "@/components/chart-panel"
import { ChartLayoutGrid } from "@/components/chart-layout-grid"
import { makeCandles } from "@/lib/market"

const SYMBOLS = ["AAPL", "MSFT", "NVDA", "TSLA"] as const

export default function Example() {
  return (
    <div className="h-[min(640px,80vh)] w-full overflow-hidden rounded-xl border border-border bg-background p-2">
      <ChartLayoutGrid layout="2x2" className="h-full">
        {SYMBOLS.map((symbol, index) => (
          <ChartPanel
            key={symbol}
            symbol={symbol}
            engine="pro"
            fill
            data={makeCandles(56, { seed: index + 10 })}
          />
        ))}
      </ChartLayoutGrid>
    </div>
  )
}
