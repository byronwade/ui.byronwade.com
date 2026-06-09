"use client"

import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { BarChart3, CandlestickChart, LineChart, Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

const DEFAULT_INTERVALS = ["1m", "5m", "15m", "1H", "1D", "1W"] as const

type ChartType = "candles" | "line" | "area"
type ChartToolbarDensity = "default" | "compact"

type ChartToolbarProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  symbol: string
  interval: string
  intervals?: string[]
  onIntervalChange?: (interval: string) => void
  chartType?: ChartType
  onChartTypeChange?: (type: ChartType) => void
  onSymbolClick?: () => void
  onIndicatorsClick?: () => void
  /** Extra controls after the symbol (e.g. compare/add). */
  symbolAddon?: ReactNode
  /** Trailing toolbar actions (alerts, replay, trade). */
  actions?: ReactNode
  density?: ChartToolbarDensity
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
  symbolAddon,
  actions,
  density = "default",
  className,
  ...props
}: ChartToolbarProps) {
  const intervalOptions = intervals.map((value) => ({ label: value, value }))
  const compact = density === "compact"

  return (
    <div
      data-slot="chart-toolbar"
      className={cn(
        "flex flex-wrap items-center gap-2",
        compact
          ? "h-9 shrink-0 gap-0.5 rounded-none border-0 border-b border-border bg-card/80 px-1 py-0"
          : "rounded-lg edge bg-card px-2 py-1.5",
        className,
      )}
      {...props}
    >
      <Button
        data-slot="chart-toolbar-symbol"
        type="button"
        variant="ghost"
        size="sm"
        className={cn("font-mono", compact && "h-7 px-2 text-sm")}
        onClick={onSymbolClick}
      >
        {symbol.toUpperCase()}
      </Button>
      {symbolAddon}
      <SegmentedControl
        data-slot="chart-toolbar-intervals"
        options={intervalOptions}
        value={interval}
        onValueChange={(value) => onIntervalChange?.(value)}
        className={cn(
          "flex-1 justify-center sm:flex-none",
          compact &&
            "rounded-none border-0 bg-transparent p-0 [&_button]:h-7 [&_button]:rounded-sm [&_button]:px-2 [&_button]:font-mono [&_button]:text-xs",
        )}
      />
      <ToggleGroup
        data-slot="chart-toolbar-chart-type"
        role="toolbar"
        aria-label="Chart type"
        variant={compact ? "default" : "outline"}
        size="sm"
        value={[chartType]}
        onValueChange={(values) => {
          const next = values[0] as ChartType | undefined
          if (next) onChartTypeChange?.(next)
        }}
        className={cn(compact && "gap-0")}
      >
        <ToggleGroupItem
          value="candles"
          aria-label="Candlestick chart"
          className={cn(compact && "size-7 px-1.5")}
        >
          <CandlestickChart className={cn(compact ? "size-3.5" : "size-4")} />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="line"
          aria-label="Line chart"
          className={cn(compact && "size-7 px-1.5")}
        >
          <LineChart className={cn(compact ? "size-3.5" : "size-4")} />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="area"
          aria-label="Area chart"
          className={cn(compact && "size-7 px-1.5")}
        >
          <BarChart3 className={cn(compact ? "size-3.5" : "size-4")} />
        </ToggleGroupItem>
      </ToggleGroup>
      {onIndicatorsClick ? (
        <Button
          data-slot="chart-toolbar-indicators"
          type="button"
          variant={compact ? "ghost" : "outline"}
          size="sm"
          aria-label="Indicators"
          className={cn(compact && "h-7 gap-1.5 px-2 text-xs")}
          onClick={onIndicatorsClick}
        >
          <Settings2 className={cn(compact ? "size-3.5" : "size-4")} />
          Indicators
        </Button>
      ) : null}
      {actions}
    </div>
  )
}

export { ChartToolbar }
export type { ChartToolbarProps, ChartType, ChartToolbarDensity }
