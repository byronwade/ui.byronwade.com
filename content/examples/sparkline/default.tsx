import { Sparkline } from "@/components/ui/sparkline"
import { makeSeries } from "@/lib/market"

export default function Example() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      <div className="flex items-center gap-6">
        <Sparkline data={makeSeries(28, { seed: 7 })} aria-label="Up trend" />
        <Sparkline
          data={makeSeries(28, { seed: 7 }).slice().reverse()}
          aria-label="Down trend"
        />
        <Sparkline data={[4, 4, 4, 4, 4]} aria-label="Flat trend" />
      </div>
      <div className="flex items-center gap-6">
        <Sparkline
          variant="area"
          data={makeSeries(28, { seed: 11 })}
          width={140}
          height={44}
          aria-label="Area trend"
        />
        <Sparkline
          variant="area"
          tone="brand"
          data={makeSeries(28, { seed: 3 })}
          width={140}
          height={44}
          aria-label="Brand area trend"
        />
      </div>
    </div>
  )
}
