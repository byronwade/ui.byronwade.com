"use client"

import type { ComponentPropsWithoutRef } from "react"
import { useState } from "react"

import { ChartToolbar, type ChartType } from "@/components/chart-toolbar"
import { CandlestickChart } from "@/components/ui/candlestick-chart"
import { Sparkline } from "@/components/ui/sparkline"
import { makeCandles, makeQuote, makeSeries, type Candle, type Quote } from "@/lib/market"
import { cn } from "@/lib/utils"

type ChartPanelProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  symbol: string
  quote?: Quote
  data?: Candle[]
  interval?: string
  onIntervalChange?: (interval: string) => void
  chartType?: ChartType
  onChartTypeChange?: (type: ChartType) => void
}

function ChartPanel({
  symbol,
  quote = makeQuote({ seed: 5 }),
  data = makeCandles(48, { seed: 5 }),
  interval: intervalProp,
  onIntervalChange,
  chartType: chartTypeProp,
  onChartTypeChange,
  className,
  ...props
}: ChartPanelProps) {
  const [internalInterval, setInternalInterval] = useState("1D")
  const [internalChartType, setInternalChartType] = useState<ChartType>("candles")

  const interval = intervalProp ?? internalInterval
  const chartType = chartTypeProp ?? internalChartType

  const handleIntervalChange = (next: string) => {
    onIntervalChange?.(next)
    if (intervalProp === undefined) setInternalInterval(next)
  }

  const handleChartTypeChange = (next: ChartType) => {
    onChartTypeChange?.(next)
    if (chartTypeProp === undefined) setInternalChartType(next)
  }

  const closes = data.map((candle) => candle.close)
  const sparkSeries = closes.length > 1 ? closes : makeSeries(32, { seed: 5 })

  return (
    <div
      data-slot="chart-panel"
      className={cn("flex w-full flex-col gap-3", className)}
      {...props}
    >
      <ChartToolbar
        symbol={symbol || quote.symbol}
        interval={interval}
        onIntervalChange={handleIntervalChange}
        chartType={chartType}
        onChartTypeChange={handleChartTypeChange}
      />
      <div data-slot="chart-panel-body" className="w-full min-w-0">
        {chartType === "candles" ? (
          <CandlestickChart data={data} className="w-full" />
        ) : (
          <Sparkline
            data={sparkSeries}
            variant={chartType === "area" ? "area" : "line"}
            width={480}
            height={280}
            className="w-full max-w-full"
            aria-label={`${symbol || quote.symbol} ${chartType} chart`}
          />
        )}
      </div>
    </div>
  )
}

export { ChartPanel }
export type { ChartPanelProps }
