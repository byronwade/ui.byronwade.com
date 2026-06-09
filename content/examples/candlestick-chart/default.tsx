import { CandlestickChart } from "@/components/ui/candlestick-chart"
import { makeCandles } from "@/lib/market"

export default function Example() {
  return (
    <div className="flex justify-center p-8">
      <div className="w-[480px] rounded-lg edge bg-card p-4">
        <CandlestickChart
          data={makeCandles(48, { seed: 7 })}
          width={448}
          height={260}
          aria-label="AAPL daily candles"
        />
      </div>
    </div>
  )
}
