import { PortfolioSummary } from "@/components/portfolio-summary"
import { makeSeries } from "@/lib/market"

export default function Example() {
  return (
    <div className="w-full max-w-3xl p-4">
      <PortfolioSummary spark={makeSeries(40, { seed: 16 })} />
    </div>
  )
}
