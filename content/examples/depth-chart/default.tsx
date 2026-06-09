import { DepthChart } from "@/components/ui/depth-chart"
import { makeOrderBook } from "@/lib/market"

export default function Example() {
  const { bids, asks } = makeOrderBook({ seed: 7, depth: 16 })

  return (
    <div className="flex justify-center p-8">
      <div className="w-[480px] rounded-lg edge bg-card p-4">
        <DepthChart
          bids={bids}
          asks={asks}
          width={448}
          height={200}
          aria-label="AAPL order book depth"
        />
      </div>
    </div>
  )
}
