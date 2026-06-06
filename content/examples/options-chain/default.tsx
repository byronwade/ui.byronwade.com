import { OptionsChain } from "@/components/options-chain"
import { makeOptionsChainRows } from "@/lib/market"

export default function Example() {
  return (
    <div className="w-full max-w-3xl p-4">
      <OptionsChain
        rows={makeOptionsChainRows(11, { seed: 3, spot: 180 })}
        spot={180}
      />
    </div>
  )
}
