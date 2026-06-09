import { ChartPanel } from "@/components/chart-panel"
import { ChartLayoutGrid } from "@/components/chart-layout-grid"

export default function Example() {
  return (
    <div className="w-full overflow-hidden rounded-xl edge bg-background p-3">
      <ChartLayoutGrid layout="1x2">
        <ChartPanel symbol="AAPL" />
        <ChartPanel symbol="MSFT" />
      </ChartLayoutGrid>
    </div>
  )
}
