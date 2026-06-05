"use client"

import type { ComponentPropsWithoutRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { RelativeTime, RelativeTimeZone, RelativeTimeZoneDisplay } from "@/components/ui/relative-time"
import {
  formatPrice,
  formatTradeTime,
  makeTimeAndSalesRows,
  type TimeAndSale,
} from "@/lib/market"
import { cn } from "@/lib/utils"

const DEFAULT_ROWS = makeTimeAndSalesRows(12, { seed: 6 })

const timeAndSalesVariants = cva("w-full", {
  variants: {
    density: {
      default: "",
      compact: "text-xs",
    },
  },
  defaultVariants: {
    density: "default",
  },
})

type TimeAndSalesProps = Omit<ComponentPropsWithoutRef<"div">, "children"> &
  VariantProps<typeof timeAndSalesVariants> & {
    rows?: TimeAndSale[]
    maxRows?: number
    showRelativeTime?: boolean
    onSelect?: (id: string) => void
  }

function TimeAndSales({
  rows = DEFAULT_ROWS,
  maxRows,
  density = "default",
  showRelativeTime = false,
  onSelect,
  className,
  ...props
}: TimeAndSalesProps) {
  const visible = maxRows != null ? rows.slice(0, maxRows) : rows

  return (
    <div
      data-slot="time-and-sales"
      className={cn(timeAndSalesVariants({ density }), className)}
      {...props}
    >
      <div
        data-slot="time-and-sales-header"
        className="grid grid-cols-[minmax(4.5rem,auto)_1fr_auto] gap-2 border-b border-border px-2 py-1.5 text-xs text-muted-foreground"
      >
        <span>Time</span>
        <span className="text-right">Price</span>
        <span className="text-right">Size</span>
      </div>
      <ul data-slot="time-and-sales-list" className="divide-y divide-border">
        {visible.map((row) => (
          <li key={row.id}>
            <button
              type="button"
              data-slot="time-and-sales-row"
              data-side={row.side}
              data-row-id={row.id}
              className={cn(
                "grid w-full grid-cols-[minmax(4.5rem,auto)_1fr_auto] gap-2 px-2 py-1.5 text-left font-mono outline-none transition-colors hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50",
                onSelect ? "cursor-pointer" : "cursor-default",
              )}
              onClick={() => onSelect?.(row.id)}
            >
              <span data-slot="time-and-sales-time" className="text-muted-foreground">
                {showRelativeTime ? (
                  <RelativeTime time={new Date(row.time)} className="inline-grid">
                    <RelativeTimeZone zone="UTC">
                      <RelativeTimeZoneDisplay />
                    </RelativeTimeZone>
                  </RelativeTime>
                ) : (
                  formatTradeTime(row.time)
                )}
              </span>
              <span
                data-slot="time-and-sales-price"
                className={
                  row.side === "buy" ? "text-right text-success" : "text-right text-destructive"
                }
              >
                {formatPrice(row.price, { currency: "USD" })}
              </span>
              <span data-slot="time-and-sales-size" className="text-right">
                {row.size}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { TimeAndSales, timeAndSalesVariants }
export type { TimeAndSalesProps }
