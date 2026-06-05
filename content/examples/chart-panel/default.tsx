import { ChartPanel } from "@/components/chart-panel"
import { makeCandles } from "@/lib/market"

export default function Example() {
  return (
    <div className="w-full max-w-3xl">
      <ChartPanel symbol="AAPL" data={makeCandles(56, { seed: 8 })} />
    </div>
  )
}
