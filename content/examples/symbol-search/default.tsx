import { SymbolSearch } from "@/components/symbol-search"
import { makeQuotes } from "@/lib/market"

export default function Example() {
  return (
    <div className="flex justify-center p-8">
      <SymbolSearch symbols={makeQuotes(8, { seed: 25 })} />
    </div>
  )
}
