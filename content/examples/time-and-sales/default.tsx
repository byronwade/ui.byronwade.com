import { TimeAndSales } from "@/components/time-and-sales"
import { makeTimeAndSalesRows } from "@/lib/market"

export default function Example() {
  return (
    <div className="w-full max-w-sm p-4">
      <TimeAndSales rows={makeTimeAndSalesRows(16, { seed: 2 })} />
    </div>
  )
}
