import { MarketNews } from "@/components/market-news"
import { makeNewsItems } from "@/lib/market"

const items = makeNewsItems(8, { seed: 31 })

export default function Example() {
  return (
    <div className="flex justify-center p-8">
      <MarketNews
        items={items}
        variant="terminal"
        layout="grid"
        density="compact"
        title="Market news"
        description="Positive headlines across the active watchlist"
        sentiment="positive"
        limit={4}
        selectedId={items[0]?.id}
        footer="Filtered by sentiment and capped to the latest four matching stories."
      />
    </div>
  )
}
