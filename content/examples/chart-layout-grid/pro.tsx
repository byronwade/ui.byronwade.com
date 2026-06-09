import { ChartPanel } from "@/components/chart-panel"
import { ChartLayoutGrid } from "@/components/chart-layout-grid"
import { makeCandles } from "@/lib/market"

export default function Example() {
  return (
    <div className="h-[min(560px,75vh)] w-full overflow-hidden rounded-xl edge bg-background p-2">
      <ChartLayoutGrid layout="1x2" className="h-full">
        <ChartPanel
          symbol="AAPL"
          engine="pro"
          fill
          data={makeCandles(64, { seed: 1 })}
        />
        <ChartPanel
          symbol="MSFT"
          engine="pro"
          fill
          data={makeCandles(64, { seed: 2 })}
        />
      </ChartLayoutGrid>
    </div>
  )
}
