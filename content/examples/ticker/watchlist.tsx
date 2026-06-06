import {
  Ticker,
  TickerIcon,
  TickerSymbol,
  TickerPrice,
  TickerPriceChange,
} from "@/components/ui/ticker"

const rows = [
  { symbol: "AAPL", price: 229.35, change: 1.82 },
  { symbol: "MSFT", price: 478.1, change: 0.64 },
  { symbol: "NVDA", price: 134.27, change: -2.14 },
  { symbol: "TSLA", price: 412.5, change: 3.07 },
]

// A watchlist grid, card-variant tickers laid out two-up, each row justified
// so the symbol sits left and the price/change sit right.
export default function Example() {
  return (
    <div className="grid w-full max-w-xl grid-cols-2 gap-3 p-8">
      {rows.map((row) => (
        <Ticker
          key={row.symbol}
          variant="card"
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <TickerIcon symbol={row.symbol} />
            <TickerSymbol symbol={row.symbol} />
          </span>
          <span className="flex items-center gap-2">
            <TickerPrice price={row.price} className="text-foreground" />
            <TickerPriceChange change={row.change} isPercent />
          </span>
        </Ticker>
      ))}
    </div>
  )
}
