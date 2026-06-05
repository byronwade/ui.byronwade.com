"use client"

import type { ComponentPropsWithoutRef } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusDot } from "@/components/ui/status-dot"
import { Switch } from "@/components/ui/switch"
import { formatPrice, makeAlerts, type Alert } from "@/lib/market"
import { cn } from "@/lib/utils"

const DEFAULT_ALERTS = makeAlerts(4, { seed: 15 })

type PriceAlertProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  alerts?: Alert[]
  onToggle?: (id: string, enabled: boolean) => void
  onDelete?: (id: string) => void
}

function formatCondition(alert: Alert) {
  const comparator = alert.condition === "above" ? "≥" : "≤"
  return `Price ${comparator} ${formatPrice(alert.target, { currency: "USD" })}`
}

function PriceAlert({
  alerts = DEFAULT_ALERTS,
  onToggle,
  onDelete,
  className,
  ...props
}: PriceAlertProps) {
  return (
    <div
      data-slot="price-alert"
      className={cn("w-full max-w-lg rounded-xl border border-border bg-card", className)}
      {...props}
    >
      <ul className="divide-y divide-border">
        {alerts.map((alert) => {
          const triggered = alert.status === "triggered"
          return (
            <li
              key={alert.id}
              data-slot="alert-row"
              data-alert-id={alert.id}
              data-status={alert.status}
              className={cn(
                "flex items-center gap-3 px-4 py-3",
                triggered && "bg-destructive/5",
              )}
            >
              <StatusDot
                tone={triggered ? "danger" : alert.enabled ? "success" : "neutral"}
                pulse={triggered}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{alert.symbol}</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {alert.status}
                  </Badge>
                </div>
                <p
                  data-slot="alert-row-condition"
                  className="mt-1 font-mono text-sm text-muted-foreground"
                >
                  {formatCondition(alert)}
                </p>
              </div>
              <Switch
                aria-label={`Toggle alert for ${alert.symbol}`}
                checked={alert.enabled}
                onCheckedChange={(checked) => onToggle?.(alert.id, checked)}
              />
              {onDelete ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label={`Delete alert for ${alert.symbol}`}
                  onClick={() => onDelete(alert.id)}
                >
                  Delete
                </Button>
              ) : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export { PriceAlert }
export type { PriceAlertProps }
