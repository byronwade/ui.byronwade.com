"use client"

import type { ComponentPropsWithoutRef } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PriceChange } from "@/components/ui/price-change"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  formatPrice,
  makePositions,
  type Position,
} from "@/lib/market"
import { cn } from "@/lib/utils"

const DEFAULT_POSITIONS = makePositions(4, { seed: 3 })

type PositionsTableProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  positions?: Position[]
  onSelect?: (symbol: string) => void
  onClose?: (symbol: string) => void
  showFooter?: boolean
}

function PositionsTable({
  positions = DEFAULT_POSITIONS,
  onSelect,
  onClose,
  showFooter = true,
  className,
  ...props
}: PositionsTableProps) {
  const totalPnl = positions.reduce((sum, position) => sum + position.pnl, 0)

  return (
    <div
      data-slot="positions-table"
      className={cn("w-full", className)}
      {...props}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Side</TableHead>
            <TableHead className="text-right">Size</TableHead>
            <TableHead className="text-right">Entry</TableHead>
            <TableHead className="text-right">Mark</TableHead>
            <TableHead className="text-right">P&amp;L</TableHead>
            {onClose ? <TableHead className="w-16" /> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {positions.map((position) => (
            <TableRow
              key={position.symbol}
              data-slot="position-row"
              data-symbol={position.symbol}
              className={onSelect ? "cursor-pointer" : undefined}
              onClick={() => onSelect?.(position.symbol)}
            >
              <TableCell className="font-medium">{position.symbol}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    position.side === "long"
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  }
                >
                  {position.side}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono">{position.size}</TableCell>
              <TableCell className="text-right font-mono">
                {formatPrice(position.entry, { currency: "USD" })}
              </TableCell>
              <TableCell className="text-right font-mono">
                {formatPrice(position.mark, { currency: "USD" })}
              </TableCell>
              <TableCell className="text-right">
                <PriceChange
                  value={position.pnl}
                  percent={position.pnlPercent}
                  size="sm"
                />
              </TableCell>
              {onClose ? (
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation()
                      onClose(position.symbol)
                    }}
                  >
                    Close
                  </Button>
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
        {showFooter ? (
          <TableFooter>
            <TableRow data-slot="positions-table-footer">
              <TableCell colSpan={onClose ? 6 : 5}>Total unrealized P&amp;L</TableCell>
              <TableCell className="text-right font-mono">
                {formatPrice(totalPnl, { currency: "USD" })}
              </TableCell>
              {onClose ? <TableCell /> : null}
            </TableRow>
          </TableFooter>
        ) : null}
      </Table>
    </div>
  )
}

export { PositionsTable }
export type { PositionsTableProps }
