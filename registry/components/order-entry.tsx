"use client"

import type { ComponentPropsWithoutRef, FormEvent } from "react"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoneyInput } from "@/components/ui/money-input"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatPrice } from "@/lib/market"
import { cn } from "@/lib/utils"

type OrderSide = "buy" | "sell"
type OrderType = "Market" | "Limit" | "Stop"

type OrderPayload = {
  side: OrderSide
  type: OrderType
  qty: number
  price?: number
  total: number
}

type OrderEntryProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  symbol: string
  lastPrice?: number
  defaultSide?: OrderSide
  side?: OrderSide
  onSideChange?: (side: OrderSide) => void
  onSubmit?: (order: OrderPayload) => void
}

const ORDER_TYPES: OrderType[] = ["Market", "Limit", "Stop"]

function OrderEntry({
  symbol,
  lastPrice = 100,
  defaultSide = "buy",
  side: sideProp,
  onSideChange,
  onSubmit,
  className,
  ...props
}: OrderEntryProps) {
  const [internalSide, setInternalSide] = useState<OrderSide>(defaultSide)
  const [orderType, setOrderType] = useState<OrderType>("Market")
  const [qty, setQty] = useState("1")
  const [price, setPrice] = useState<number | null>(lastPrice)

  const side = sideProp ?? internalSide
  const qtyNum = Number(qty) || 0
  const unitPrice = orderType === "Market" ? lastPrice : (price ?? lastPrice)
  const total = qtyNum * unitPrice

  const orderTypeOptions = useMemo(
    () => ORDER_TYPES.map((value) => ({ label: value, value })),
    [],
  )

  const setSide = (next: OrderSide) => {
    onSideChange?.(next)
    if (sideProp === undefined) setInternalSide(next)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit?.({
      side,
      type: orderType,
      qty: qtyNum,
      price: orderType === "Market" ? undefined : unitPrice,
      total,
    })
  }

  return (
    <div
      data-slot="order-entry"
      className={cn("w-full max-w-sm rounded-xl edge bg-card p-4", className)}
      {...props}
    >
      <Tabs
        value={side}
        onValueChange={(value) => setSide(value as OrderSide)}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="buy">Buy</TabsTrigger>
          <TabsTrigger value="sell">Sell</TabsTrigger>
        </TabsList>
        <TabsContent value={side} className="mt-4">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{symbol.toUpperCase()}</span>
              <span className="font-mono text-muted-foreground">
                Last {formatPrice(lastPrice, { currency: "USD" })}
              </span>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${symbol}-order-type`}>Order type</Label>
              <SegmentedControl
                options={orderTypeOptions}
                value={orderType}
                onValueChange={setOrderType}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${symbol}-qty`}>Quantity</Label>
              <Input
                id={`${symbol}-qty`}
                data-slot="order-entry-qty"
                inputMode="decimal"
                value={qty}
                onChange={(event) => setQty(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${symbol}-price`}>Price</Label>
              <MoneyInput
                id={`${symbol}-price`}
                data-slot="order-entry-price"
                value={price}
                onValueChange={setPrice}
                disabled={orderType === "Market"}
              />
            </div>
            <div
              data-slot="order-entry-total"
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted-foreground">Total</span>
              <span className="font-mono">{formatPrice(total, { currency: "USD" })}</span>
            </div>
            <Button
              data-slot="order-entry-submit"
              type="submit"
              className={cn(
                "w-full",
                side === "buy"
                  ? "bg-success text-primary-foreground hover:bg-success/90"
                  : "bg-destructive text-primary-foreground hover:bg-destructive/90",
              )}
            >
              {side === "buy" ? "Buy" : "Sell"} {symbol.toUpperCase()}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export { OrderEntry }
export type { OrderEntryProps, OrderPayload, OrderSide, OrderType }
