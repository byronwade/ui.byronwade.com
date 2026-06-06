import { MarketDepth } from "@/components/market-depth"
import { makeOrderBook } from "@/lib/market"

const book = makeOrderBook({ seed: 22, depth: 12 })

export default function Example() {
  return (
    <div className="w-full max-w-4xl">
      <MarketDepth
        bids={book.bids}
        asks={book.asks}
        variant="panel"
        layout="split"
        density="compact"
        title="Market depth"
        symbol="AAPL"
        description="Level 2 liquidity with split ladder"
        chartHeight={180}
        depth={10}
        bookLayout="split"
        footer="Bid and ask depth updates from the active session feed."
      />
    </div>
  )
}
