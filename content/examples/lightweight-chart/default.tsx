import { LightweightChart } from "@/components/ui/lightweight-chart"
import { makeCandles } from "@/lib/market"

export default function Example() {
  return (
    <div className="flex justify-center p-8">
      <div className="h-[360px] w-full max-w-3xl overflow-hidden rounded-lg edge bg-card">
        <LightweightChart
          data={makeCandles(72, { seed: 7 })}
          chartType="candles"
          fill
          showVolume
          aria-label="AAPL daily candles"
        />
      </div>
    </div>
  )
}
