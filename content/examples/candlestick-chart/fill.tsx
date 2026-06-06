import { CandlestickChart } from "@/components/ui/candlestick-chart"
import { makeCandles } from "@/lib/market"

export default function Example() {
  return (
    <div className="h-[360px] w-full overflow-hidden rounded-xl border border-border bg-background">
      <CandlestickChart
        data={makeCandles(72, { seed: 7 })}
        interactive
        fill
        aria-label="Fill-mode SVG candles"
      />
    </div>
  )
}
