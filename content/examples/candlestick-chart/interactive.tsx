import { CandlestickChart } from "@/components/ui/candlestick-chart"
import { makeCandles } from "@/lib/market"

export default function Example() {
  return (
    <div className="flex justify-center p-8">
      <div className="w-full max-w-3xl rounded-lg border border-border bg-card p-4">
        <CandlestickChart
          data={makeCandles(48, { seed: 9 })}
          interactive
          width={640}
          height={320}
          aria-label="Interactive AAPL candles"
        />
      </div>
    </div>
  )
}
