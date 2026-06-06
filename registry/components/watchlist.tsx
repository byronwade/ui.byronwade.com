"use client"

import type { ComponentPropsWithoutRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { PriceChange } from "@/components/ui/price-change"
import { Sparkline } from "@/components/ui/sparkline"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  formatPrice,
  formatVolume,
  makeQuote,
  makeSeries,
  type Quote,
} from "@/lib/market"
import { cn } from "@/lib/utils"

const DEFAULT_ITEMS: Quote[] = Array.from({ length: 6 }, (_, index) =>
  makeQuote({ seed: index + 10 }),
)

const watchlistVariants = cva("w-full", {
  variants: {
    dense: {
      true: "[&_[data-slot=watchlist-row]]:h-8",
      false: "",
    },
  },
  defaultVariants: {
    dense: false,
  },
})

type WatchlistColumn = "price" | "change" | "spark" | "volume"

type WatchlistProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onSelect"
> &
  VariantProps<typeof watchlistVariants> & {
    items?: Quote[]
    columns?: WatchlistColumn[]
    onSelect?: (symbol: string) => void
    selectedSymbol?: string
  }

function Watchlist({
  items = DEFAULT_ITEMS,
  columns = ["price", "change", "spark", "volume"],
  onSelect,
  selectedSymbol,
  dense = false,
  className,
  ...props
}: WatchlistProps) {
  const show = (column: WatchlistColumn) => columns.includes(column)

  return (
    <div
      data-slot="watchlist"
      className={cn(watchlistVariants({ dense }), className)}
      {...props}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            {show("price") ? <TableHead className="text-right">Last</TableHead> : null}
            {show("change") ? <TableHead className="text-right">Change</TableHead> : null}
            {show("spark") ? <TableHead>Spark</TableHead> : null}
            {show("volume") ? <TableHead className="text-right">Volume</TableHead> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => {
            const selected = selectedSymbol === item.symbol
            return (
              <TableRow
                key={item.symbol}
                data-slot="watchlist-row"
                data-symbol={item.symbol}
                data-selected={selected ? "true" : "false"}
                className={cn(
                  onSelect && "cursor-pointer",
                  selected && "bg-accent",
                )}
                onClick={() => onSelect?.(item.symbol)}
              >
                <TableCell>
                  <div className="flex min-w-0 flex-col">
                    <span className="font-medium">{item.symbol}</span>
                    {item.name ? (
                      <span className="truncate text-xs text-muted-foreground">
                        {item.name}
                      </span>
                    ) : null}
                  </div>
                </TableCell>
                {show("price") ? (
                  <TableCell className="text-right font-mono">
                    {formatPrice(item.price)}
                  </TableCell>
                ) : null}
                {show("change") ? (
                  <TableCell className="text-right">
                    <PriceChange
                      value={item.change}
                      percent={item.changePercent}
                      size="sm"
                    />
                  </TableCell>
                ) : null}
                {show("spark") ? (
                  <TableCell>
                    <Sparkline
                      data={makeSeries(20, { seed: index + 20 })}
                      width={72}
                      height={24}
                      aria-label={`${item.symbol} trend`}
                    />
                  </TableCell>
                ) : null}
                {show("volume") ? (
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {formatVolume(item.volume ?? 0)}
                  </TableCell>
                ) : null}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export { Watchlist, watchlistVariants }
export type { WatchlistProps, WatchlistColumn }
