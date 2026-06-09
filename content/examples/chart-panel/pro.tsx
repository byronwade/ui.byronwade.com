import { ChartPanel } from "@/components/chart-panel"
import { makeCandles } from "@/lib/market"

export default function Example() {
  return (
    <div className="h-[420px] w-full overflow-hidden rounded-xl edge bg-background p-2">
      <ChartPanel
        symbol="AAPL"
        engine="pro"
        fill
        data={makeCandles(72, { seed: 8 })}
      />
    </div>
  )
}
