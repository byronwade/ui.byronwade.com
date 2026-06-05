import { EconomicCalendar } from "@/components/economic-calendar"
import { makeMarketEvents } from "@/lib/market"

export default function Example() {
  return (
    <div className="flex justify-center p-8">
      <EconomicCalendar events={makeMarketEvents(8, { seed: 13 })} />
    </div>
  )
}
