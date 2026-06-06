import { SectorRotation } from "@/components/ui/sector-rotation"
import { makeSectorSegments } from "@/lib/market"

const segments = makeSectorSegments(6, { seed: 21 })

export default function Example() {
  return (
    <div className="w-full max-w-lg">
      <SectorRotation segments={segments} />
    </div>
  )
}
