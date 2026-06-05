"use client"

import type { ComponentPropsWithoutRef } from "react"
import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type ChartIndicator = {
  id: string
  name: string
  visible: boolean
  tone?: "chart-1" | "chart-2" | "chart-3" | "chart-4" | "chart-5"
}

const DEFAULT_INDICATORS: ChartIndicator[] = [
  { id: "ma-20", name: "MA 20", visible: true, tone: "chart-1" },
  { id: "ma-50", name: "MA 50", visible: true, tone: "chart-2" },
  { id: "rsi", name: "RSI 14", visible: false, tone: "chart-3" },
  { id: "macd", name: "MACD", visible: true, tone: "chart-4" },
]

const toneClass: Record<NonNullable<ChartIndicator["tone"]>, string> = {
  "chart-1": "bg-chart-1",
  "chart-2": "bg-chart-2",
  "chart-3": "bg-chart-3",
  "chart-4": "bg-chart-4",
  "chart-5": "bg-chart-5",
}

type IndicatorLegendProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  indicators?: ChartIndicator[]
  onToggleVisibility?: (id: string, visible: boolean) => void
  onRemove?: (id: string) => void
}

function IndicatorLegend({
  indicators = DEFAULT_INDICATORS,
  onToggleVisibility,
  onRemove,
  className,
  ...props
}: IndicatorLegendProps) {
  return (
    <div
      data-slot="indicator-legend"
      className={cn(
        "w-full max-w-sm rounded-xl border border-border bg-card",
        className,
      )}
      {...props}
    >
      <div
        data-slot="indicator-legend-header"
        className="border-b border-border px-3 py-2 text-sm text-muted-foreground"
      >
        Indicators
      </div>
      <ul className="divide-y divide-border">
        {indicators.map((indicator) => (
          <li
            key={indicator.id}
            data-slot="indicator-legend-row"
            data-indicator-id={indicator.id}
            data-visible={indicator.visible ? "true" : "false"}
            className="flex items-center gap-3 px-3 py-2"
          >
            <span
              data-slot="indicator-legend-swatch"
              className={cn(
                "size-2.5 shrink-0 rounded-full",
                toneClass[indicator.tone ?? "chart-1"],
              )}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <span className="font-medium">{indicator.name}</span>
              {!indicator.visible ? (
                <Badge variant="outline" className="ml-2 text-xs">
                  hidden
                </Badge>
              ) : null}
            </div>
            <Switch
              aria-label={`Toggle ${indicator.name} visibility`}
              checked={indicator.visible}
              onCheckedChange={(checked) =>
                onToggleVisibility?.(indicator.id, checked)
              }
            />
            {onRemove ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove ${indicator.name}`}
                onClick={() => onRemove(indicator.id)}
              >
                <X className="size-4" />
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}

export { IndicatorLegend, DEFAULT_INDICATORS }
export type { IndicatorLegendProps, ChartIndicator }
