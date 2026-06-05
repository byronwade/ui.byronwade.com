import { PositionCard } from "@/components/position-card"
import { makePosition } from "@/lib/market"

export default function Example() {
  return (
    <div className="flex justify-center p-8">
      <PositionCard position={makePosition({ seed: 9 })} />
    </div>
  )
}
