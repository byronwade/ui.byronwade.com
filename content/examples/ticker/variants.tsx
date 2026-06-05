import {
  Ticker,
  TickerIcon,
  TickerSymbol,
  TickerPrice,
  TickerPriceChange,
} from "@/components/ui/ticker"

const variants = ["bare", "soft", "outline", "card"] as const

export default function Example() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-8">
      {variants.map((variant) => (
        <Ticker key={variant} variant={variant}>
          <TickerIcon symbol="AAPL" />
          <TickerSymbol symbol="AAPL" />
          <TickerPrice price={229.35} />
          <TickerPriceChange change={1.82} isPercent />
        </Ticker>
      ))}
    </div>
  )
}
