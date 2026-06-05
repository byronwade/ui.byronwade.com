import {
  Ticker,
  TickerIcon,
  TickerSymbol,
  TickerPrice,
  TickerPriceChange,
} from "@/components/ui/ticker"

const sizes = ["sm", "default", "lg"] as const

export default function Example() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8">
      {sizes.map((size) => (
        <Ticker key={size} size={size}>
          <TickerIcon symbol="AAPL" />
          <TickerSymbol symbol="AAPL" />
          <TickerPrice price={229.35} />
          <TickerPriceChange change={1.82} isPercent />
        </Ticker>
      ))}
    </div>
  )
}
