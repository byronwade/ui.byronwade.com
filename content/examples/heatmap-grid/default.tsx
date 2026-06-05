import { HeatmapGrid } from "@/components/ui/heatmap-grid"
import { makeHeatmapCells } from "@/lib/market"

export default function Example() {
  const cells = makeHeatmapCells(16, { seed: 5 })

  return (
    <div className="flex justify-center p-8">
      <div className="w-[480px]">
        <HeatmapGrid cells={cells} columns={4} scale="tone" />
      </div>
    </div>
  )
}
