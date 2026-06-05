import {
  Ticker,
  TickerIcon,
  TickerSymbol,
  TickerPrice,
  TickerPriceChange,
} from "@/components/ui/ticker"

// The compound is composable, so layout is just how you arrange the parts.
// Here: icon on the left, symbol over price stacked on the right.
export default function Example() {
  return (
    <div className="flex items-center justify-center p-8">
      <Ticker variant="card" className="items-center gap-3">
        <TickerIcon symbol="AAPL" />
        <span className="flex flex-col items-start leading-tight">
          <span className="flex items-center gap-2">
            <TickerSymbol symbol="AAPL" />
            <TickerPriceChange change={1.82} isPercent />
          </span>
          <TickerPrice price={229.35} className="text-foreground" />
        </span>
      </Ticker>
    </div>
  )
}
