import { TradeHistory } from "@/components/trade-history"
import { makeTrades } from "@/lib/market"

export default function Example() {
  return (
    <div className="w-full max-w-4xl p-4">
      <TradeHistory trades={makeTrades(8, { seed: 5 })} />
    </div>
  )
}
