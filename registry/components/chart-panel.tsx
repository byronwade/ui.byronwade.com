"use client"

import type { ComponentPropsWithoutRef } from "react"
import { useState } from "react"

import { ChartToolbar, type ChartType } from "@/components/chart-toolbar"
import { CandlestickChart } from "@/components/ui/candlestick-chart"
import { LightweightChart } from "@/components/ui/lightweight-chart"
import { Sparkline } from "@/components/ui/sparkline"
import { makeCandles, makeQuote, makeSeries, type Candle, type Quote } from "@/lib/market"
import { cn } from "@/lib/utils"

type ChartEngine = "svg" | "pro"

type ChartPanelProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  symbol: string
  quote?: Quote
  data?: Candle[]
  interval?: string
  onIntervalChange?: (interval: string) => void
  chartType?: ChartType
  onChartTypeChange?: (type: ChartType) => void
  /** SVG (default) or TradingView Lightweight Charts. */
  engine?: ChartEngine
  /** Pointer crosshair with OHLC readout on the SVG candlestick chart. */
  interactive?: boolean
  /** Chart fills the panel body (uses ResizeObserver). */
  fill?: boolean
}

function ChartPanel({
  symbol,
  quote = makeQuote({ seed: 5 }),
  data = makeCandles(48, { seed: 5 }),
  interval: intervalProp,
  onIntervalChange,
  chartType: chartTypeProp,
  onChartTypeChange,
  engine = "svg",
  interactive = false,
  fill = false,
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
      className={cn(
        "flex w-full flex-col gap-3",
        interactive && "min-h-0 flex-1",
        className,
      )}
      {...props}
    >
      <ChartToolbar
        symbol={symbol || quote.symbol}
        interval={interval}
        onIntervalChange={handleIntervalChange}
        chartType={chartType}
        onChartTypeChange={handleChartTypeChange}
      />
      <div
        data-slot="chart-panel-body"
        className={cn(
          "w-full min-w-0",
          (interactive || fill) && "min-h-[280px] flex-1",
          fill && "min-h-0",
        )}
      >
        {engine === "pro" ? (
          <LightweightChart
            data={data}
            chartType={chartType}
            showVolume={chartType === "candles"}
            fill={fill}
            aria-label={`${symbol || quote.symbol} ${chartType} chart`}
          />
        ) : chartType === "candles" ? (
          <CandlestickChart
            data={data}
            interactive={interactive}
            fill={fill}
            className={fill ? undefined : "aspect-[12/7] h-auto w-full"}
          />
        ) : (
          <Sparkline
            data={sparkSeries}
            variant={chartType === "area" ? "area" : "line"}
            fill={fill}
            width={480}
            height={280}
            className={fill ? undefined : "aspect-[12/7] h-auto w-full max-w-full"}
            aria-label={`${symbol || quote.symbol} ${chartType} chart`}
          />
        )}
      </div>
    </div>
  )
}

export { ChartPanel }
export type { ChartPanelProps, ChartEngine }
