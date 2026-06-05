import { PositionsTable } from "@/components/positions-table"
import { makePositions } from "@/lib/market"

export default function Example() {
  return (
    <div className="w-full max-w-4xl p-4">
      <PositionsTable positions={makePositions(5, { seed: 2 })} />
    </div>
  )
}
