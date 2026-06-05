import {
  Ticker,
  TickerIcon,
  TickerSymbol,
  TickerPrice,
  TickerPriceChange,
} from "@/components/ui/ticker"

export default function Example() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8">
      <Ticker>
        <TickerIcon symbol="AAPL" />
        <TickerSymbol symbol="AAPL" />
        <TickerPrice price={229.35} />
        <TickerPriceChange change={1.82} isPercent />
      </Ticker>
      <Ticker currency="USD">
        <TickerIcon symbol="BTC" />
        <TickerSymbol symbol="BTC" />
        <TickerPrice price={68420.5} />
        <TickerPriceChange change={-2.14} isPercent />
      </Ticker>
    </div>
  )
}
