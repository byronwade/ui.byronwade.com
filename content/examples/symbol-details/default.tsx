import { SymbolDetails } from "@/components/symbol-details"
import { makeSymbolStats } from "@/lib/market"

export default function Example() {
  return (
    <div className="w-full max-w-3xl p-4">
      <SymbolDetails stats={makeSymbolStats({ seed: 4 })} />
    </div>
  )
}
