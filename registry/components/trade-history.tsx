"use client"

import type { ComponentPropsWithoutRef } from "react"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RelativeTime, RelativeTimeZone, RelativeTimeZoneDisplay } from "@/components/ui/relative-time"
import { formatPrice, makeTrades, type Trade } from "@/lib/market"
import { cn } from "@/lib/utils"

const DEFAULT_TRADES = makeTrades(6, { seed: 8 })

type TradeHistoryProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  trades?: Trade[]
  onSelect?: (id: string) => void
}

function TradeHistory({
  trades = DEFAULT_TRADES,
  onSelect,
  className,
  ...props
}: TradeHistoryProps) {
  return (
    <div
      data-slot="trade-history"
      className={cn("w-full", className)}
      {...props}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Side</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Size</TableHead>
            <TableHead className="text-right">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade) => {
            const value = trade.price * trade.size
            return (
              <TableRow
                key={trade.id}
                data-slot="trade-row"
                data-trade-id={trade.id}
                className={onSelect ? "cursor-pointer" : undefined}
                onClick={() => onSelect?.(trade.id)}
              >
                <TableCell>
                  <RelativeTime time={new Date(trade.time)} className="inline-grid">
                    <RelativeTimeZone zone="UTC">
                      <RelativeTimeZoneDisplay className="font-mono text-xs" />
                    </RelativeTimeZone>
                  </RelativeTime>
                </TableCell>
                <TableCell className="font-medium">{trade.symbol}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      trade.side === "buy"
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    }
                  >
                    {trade.side}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatPrice(trade.price, { currency: "USD" })}
                </TableCell>
                <TableCell className="text-right font-mono">{trade.size}</TableCell>
                <TableCell className="text-right font-mono">
                  {formatPrice(value, { currency: "USD" })}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export { TradeHistory }
export type { TradeHistoryProps }
