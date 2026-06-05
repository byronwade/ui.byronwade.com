import { TickerTape } from "@/components/ticker-tape"
import { makeQuote } from "@/lib/market"

const items = Array.from({ length: 8 }, (_, index) =>
  makeQuote({ seed: index + 1 }),
)

export default function Example() {
  return (
    <div className="w-full max-w-3xl">
      <TickerTape items={items} />
    </div>
  )
}
