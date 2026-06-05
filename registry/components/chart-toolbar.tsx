"use client"

import type { ComponentPropsWithoutRef } from "react"
import { BarChart3, CandlestickChart, LineChart, Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

const DEFAULT_INTERVALS = ["1m", "5m", "15m", "1H", "1D", "1W"] as const

type ChartType = "candles" | "line" | "area"

type ChartToolbarProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  symbol: string
  interval: string
  intervals?: string[]
  onIntervalChange?: (interval: string) => void
  chartType?: ChartType
  onChartTypeChange?: (type: ChartType) => void
  onSymbolClick?: () => void
  onIndicatorsClick?: () => void
}

function ChartToolbar({
  symbol,
  interval,
  intervals = [...DEFAULT_INTERVALS],
  onIntervalChange,
  chartType = "candles",
  onChartTypeChange,
  onSymbolClick,
  onIndicatorsClick,
  className,
  ...props
}: ChartToolbarProps) {
  const intervalOptions = intervals.map((value) => ({ label: value, value }))

  return (
    <div
      data-slot="chart-toolbar"
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card px-2 py-1.5",
        className,
      )}
      {...props}
    >
      <Button
        data-slot="chart-toolbar-symbol"
        type="button"
        variant="ghost"
        size="sm"
        className="font-mono"
        onClick={onSymbolClick}
      >
        {symbol.toUpperCase()}
      </Button>
      <SegmentedControl
        data-slot="chart-toolbar-intervals"
        options={intervalOptions}
        value={interval}
        onValueChange={(value) => onIntervalChange?.(value)}
        className="flex-1 justify-center sm:flex-none"
      />
      <ToggleGroup
        data-slot="chart-toolbar-chart-type"
        role="toolbar"
        aria-label="Chart type"
        variant="outline"
        size="sm"
        value={[chartType]}
        onValueChange={(values) => {
          const next = values[0] as ChartType | undefined
          if (next) onChartTypeChange?.(next)
        }}
      >
        <ToggleGroupItem value="candles" aria-label="Candlestick chart">
          <CandlestickChart className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="line" aria-label="Line chart">
          <LineChart className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="area" aria-label="Area chart">
          <BarChart3 className="size-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      <Button
        data-slot="chart-toolbar-indicators"
        type="button"
        variant="outline"
        size="sm"
        aria-label="Indicators"
        onClick={onIndicatorsClick}
      >
        <Settings2 className="size-4" />
        Indicators
      </Button>
    </div>
  )
}

export { ChartToolbar }
export type { ChartToolbarProps, ChartType }
