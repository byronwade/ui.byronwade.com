import { VolumeFootprint } from "@/components/ui/volume-footprint"
import { makeFootprintRows } from "@/lib/market"

export default function Example() {
  return (
    <div className="w-full max-w-xs p-4">
      <VolumeFootprint
        rows={makeFootprintRows(20, { seed: 2 })}
        width={220}
        height={320}
      />
    </div>
  )
}
