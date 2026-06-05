import { MarketDepth } from "@/components/market-depth"
import { makeOrderBook } from "@/lib/market"

const book = makeOrderBook({ seed: 4, depth: 10 })

export default function Example() {
  return (
    <div className="w-full max-w-md">
      <MarketDepth bids={book.bids} asks={book.asks} />
    </div>
  )
}
