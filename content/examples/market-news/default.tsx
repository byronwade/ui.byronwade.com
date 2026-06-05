import { MarketNews } from "@/components/market-news"
import { makeNewsItems } from "@/lib/market"

export default function Example() {
  return (
    <div className="flex justify-center p-8">
      <MarketNews items={makeNewsItems(6, { seed: 18 })} />
    </div>
  )
}
