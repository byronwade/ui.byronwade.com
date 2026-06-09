import { QuoteHeader } from "@/components/quote-header"
import { makeQuote, makeSeries } from "@/lib/market"

const quote = makeQuote({ seed: 7 })

export default function Example() {
  return (
    <div className="w-full max-w-3xl rounded-xl edge bg-card p-6">
      <QuoteHeader quote={quote} spark={makeSeries(36, { seed: 7 })} />
    </div>
  )
}
