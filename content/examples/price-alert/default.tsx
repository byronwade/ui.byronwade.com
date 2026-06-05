import { PriceAlert } from "@/components/price-alert"
import { makeAlerts } from "@/lib/market"

export default function Example() {
  return (
    <div className="flex justify-center p-8">
      <PriceAlert alerts={makeAlerts(5, { seed: 22 })} />
    </div>
  )
}
