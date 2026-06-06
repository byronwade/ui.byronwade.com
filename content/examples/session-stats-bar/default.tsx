import { SessionStatsBar } from "@/components/session-stats-bar"
import { makeCandles } from "@/lib/market"

const candle = makeCandles(1, { seed: 19 })[0]

export default function Example() {
  return (
    <div className="w-full max-w-2xl">
      <SessionStatsBar candle={candle} symbol="NVDA" />
    </div>
  )
}
