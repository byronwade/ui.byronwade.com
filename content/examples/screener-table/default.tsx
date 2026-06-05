import { ScreenerTable } from "@/components/screener-table"
import { makeScreenerRows } from "@/lib/market"

export default function Example() {
  return (
    <div className="w-full max-w-5xl p-4">
      <ScreenerTable rows={makeScreenerRows(10, { seed: 9 })} />
    </div>
  )
}
