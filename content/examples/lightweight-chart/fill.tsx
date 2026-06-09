import { LightweightChart } from "@/components/ui/lightweight-chart"
import { makeCandles } from "@/lib/market"

export default function Example() {
  return (
    <div className="h-[min(480px,70vh)] w-full overflow-hidden rounded-xl edge bg-background">
      <LightweightChart
        data={makeCandles(96, { seed: 3 })}
        chartType="candles"
        showVolume
        fill
        aria-label="Full-bleed terminal chart"
      />
    </div>
  )
}
