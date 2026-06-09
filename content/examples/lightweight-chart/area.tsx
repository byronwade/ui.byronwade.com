import { LightweightChart } from "@/components/ui/lightweight-chart"
import { makeCandles } from "@/lib/market"

export default function Example() {
  return (
    <div className="flex justify-center p-8">
      <div className="h-[280px] w-full max-w-3xl overflow-hidden rounded-lg edge bg-card">
        <LightweightChart
          data={makeCandles(64, { seed: 13 })}
          chartType="area"
          fill
          aria-label="NVDA area chart"
        />
      </div>
    </div>
  )
}
