import { Watchlist } from "@/components/watchlist"
import { makeQuote } from "@/lib/market"

const items = Array.from({ length: 6 }, (_, index) =>
  makeQuote({ seed: index + 20 }),
)

export default function Example() {
  return (
    <div className="w-full max-w-3xl rounded-xl edge bg-card p-4">
      <Watchlist items={items} selectedSymbol={items[0].symbol} />
    </div>
  )
}
