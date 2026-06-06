"use client"

import { ChartPanel } from "@/components/chart-panel"
import { makeCandles } from "@/lib/market"

export default function Example() {
  return (
    <div className="w-full max-w-3xl">
      <ChartPanel
        symbol="TSLA"
        interactive
        data={makeCandles(56, { seed: 4 })}
      />
    </div>
  )
}
