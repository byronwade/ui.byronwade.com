import { OrderBook } from "@/components/ui/order-book"
import { makeOrderBook } from "@/lib/market"

export default function Example() {
  const { bids, asks } = makeOrderBook({ seed: 3, depth: 10 })

  return (
    <div className="flex justify-center p-8">
      <div className="w-[320px]">
        <OrderBook bids={bids} asks={asks} depth={8} layout="vertical" />
      </div>
    </div>
  )
}
