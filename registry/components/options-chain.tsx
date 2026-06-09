"use client"

import type { ComponentPropsWithoutRef } from "react"

import { PriceChange } from "@/components/ui/price-change"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  formatPrice,
  makeOptionsChainRows,
  type OptionsChainRow,
} from "@/lib/market"
import { cn } from "@/lib/utils"

const DEFAULT_ROWS = makeOptionsChainRows(9, { seed: 16, spot: 100 })

type OptionsChainProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  rows?: OptionsChainRow[]
  spot?: number
  onSelectStrike?: (strike: number) => void
}

function OptionsChainTable({
  rows,
  side,
  spot,
  onSelectStrike,
}: {
  rows: OptionsChainRow[]
  side: "calls" | "puts"
  spot: number
  onSelectStrike?: (strike: number) => void
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {side === "calls" ? (
            <>
              <TableHead className="text-right">Bid</TableHead>
              <TableHead className="text-right">Ask</TableHead>
              <TableHead className="text-right">Last</TableHead>
              <TableHead className="text-right">Chg</TableHead>
            </>
          ) : null}
          <TableHead className="text-center">Strike</TableHead>
          {side === "puts" ? (
            <>
              <TableHead className="text-right">Bid</TableHead>
              <TableHead className="text-right">Ask</TableHead>
              <TableHead className="text-right">Last</TableHead>
              <TableHead className="text-right">Chg</TableHead>
            </>
          ) : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => {
          const isAtm = Math.abs(row.strike - spot) < 0.01
          return (
            <TableRow
              key={row.strike}
              data-slot="options-chain-row"
              data-strike={row.strike}
              className={cn(
                onSelectStrike ? "cursor-pointer" : undefined,
                isAtm && "bg-muted/40",
              )}
              onClick={() => onSelectStrike?.(row.strike)}
            >
              {side === "calls" ? (
                <>
                  <TableCell className="text-right font-mono">
                    {formatPrice(row.callBid, { currency: "USD" })}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatPrice(row.callAsk, { currency: "USD" })}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatPrice(row.callLast, { currency: "USD" })}
                  </TableCell>
                  <TableCell className="text-right">
                    <PriceChange
                      value={row.callChange}
                      format="percent"
                      size="sm"
                      showIcon={false}
                    />
                  </TableCell>
                </>
              ) : null}
              <TableCell className="text-center font-mono">{row.strike.toFixed(0)}</TableCell>
              {side === "puts" ? (
                <>
                  <TableCell className="text-right font-mono">
                    {formatPrice(row.putBid, { currency: "USD" })}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatPrice(row.putAsk, { currency: "USD" })}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatPrice(row.putLast, { currency: "USD" })}
                  </TableCell>
                  <TableCell className="text-right">
                    <PriceChange
                      value={row.putChange}
                      format="percent"
                      size="sm"
                      showIcon={false}
                    />
                  </TableCell>
                </>
              ) : null}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

function OptionsChain({
  rows = DEFAULT_ROWS,
  spot = 100,
  onSelectStrike,
  className,
  ...props
}: OptionsChainProps) {
  return (
    <div
      data-slot="options-chain"
      className={cn("w-full rounded-xl edge bg-card", className)}
      {...props}
    >
      <div
        data-slot="options-chain-header"
        className="border-b border-border px-4 py-3 text-sm text-muted-foreground"
      >
        Spot{" "}
        <span className="font-mono text-foreground">
          {formatPrice(spot, { currency: "USD" })}
        </span>
      </div>
      <Tabs defaultValue="calls" data-slot="options-chain-tabs">
        <TabsList className="grid w-full grid-cols-2 rounded-none border-b border-border bg-transparent">
          <TabsTrigger value="calls">Calls</TabsTrigger>
          <TabsTrigger value="puts">Puts</TabsTrigger>
        </TabsList>
        <TabsContent value="calls" className="mt-0">
          <OptionsChainTable
            rows={rows}
            side="calls"
            spot={spot}
            onSelectStrike={onSelectStrike}
          />
        </TabsContent>
        <TabsContent value="puts" className="mt-0">
          <OptionsChainTable
            rows={rows}
            side="puts"
            spot={spot}
            onSelectStrike={onSelectStrike}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export { OptionsChain }
export type { OptionsChainProps }
