"use client"

import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface OrderLineItem {
  id?: string
  title: string
  variant?: string
  sku?: string
  quantity: number
  price: number
  image?: string
}

interface OrderDiscount {
  label: string
  amount: number
  code?: string
}

interface OrderSummaryProps extends React.ComponentProps<"div"> {
  lineItems: OrderLineItem[]
  subtotal?: number
  discounts?: OrderDiscount[]
  shipping?: number
  tax?: number
  total?: number
  currency?: string
  locale?: string
}

function OrderSummary({
  lineItems,
  subtotal,
  discounts = [],
  shipping,
  tax,
  total,
  currency = "USD",
  locale = "en-US",
  className,
  ...props
}: OrderSummaryProps) {
  const format = React.useCallback(
    (value: number) =>
      new Intl.NumberFormat(locale, { style: "currency", currency }).format(
        value,
      ),
    [locale, currency],
  )

  const computedSubtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  )
  const resolvedSubtotal = subtotal ?? computedSubtotal
  const discountTotal = discounts.reduce(
    (sum, discount) => sum + discount.amount,
    0,
  )
  const resolvedTotal =
    total ?? resolvedSubtotal - discountTotal + (shipping ?? 0) + (tax ?? 0)

  return (
    <div
      data-slot="order-summary"
      className={cn(
        "flex flex-col gap-4 rounded-lg edge bg-card p-4",
        className,
      )}
      {...props}
    >
      {lineItems.length === 0 ? (
        <p data-slot="order-empty" className="text-sm text-muted-foreground">
          No items in this order.
        </p>
      ) : (
        <ul data-slot="order-items" className="flex flex-col gap-3">
          {lineItems.map((item, i) => (
            <li
              key={item.id ?? i}
              data-slot="order-item"
              className="flex items-center gap-3"
            >
              {item.image ? (
                <Avatar size="lg" className="rounded-lg">
                  <AvatarImage
                    src={item.image}
                    alt={item.title}
                    className="rounded-lg"
                  />
                  <AvatarFallback className="rounded-lg">
                    {item.title.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div
                  data-slot="order-item-thumb"
                  aria-hidden
                  className="grid size-10 shrink-0 place-items-center rounded-lg edge bg-muted text-xs text-muted-foreground"
                >
                  {item.title.slice(0, 2)}
                </div>
              )}

              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span
                  data-slot="order-item-title"
                  className="truncate text-sm font-medium"
                >
                  {item.title}
                </span>
                {(item.variant || item.sku) && (
                  <span className="truncate text-xs text-muted-foreground">
                    {item.variant ?? item.sku}
                  </span>
                )}
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {item.quantity} × {format(item.price)}
                </span>
              </div>

              <span
                data-slot="order-item-total"
                className="shrink-0 font-mono text-sm tabular-nums"
              >
                {format(item.quantity * item.price)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <Separator />

      <dl data-slot="order-totals" className="flex flex-col gap-2">
        <div
          data-slot="order-row"
          className="flex items-center justify-between"
        >
          <dt className="text-sm text-muted-foreground">Subtotal</dt>
          <dd className="font-mono text-sm tabular-nums">
            {format(resolvedSubtotal)}
          </dd>
        </div>

        {discounts.map((discount, i) => (
          <div
            key={i}
            data-slot="order-discount"
            className="flex items-center justify-between"
          >
            <dt className="flex items-center gap-2 text-sm text-success">
              {discount.label}
              {discount.code && (
                <Badge variant="success" className="font-mono">
                  {discount.code}
                </Badge>
              )}
            </dt>
            <dd className="font-mono text-sm text-success tabular-nums">
              {format(-discount.amount)}
            </dd>
          </div>
        ))}

        {shipping !== undefined && (
          <div
            data-slot="order-row"
            className="flex items-center justify-between"
          >
            <dt className="text-sm text-muted-foreground">Shipping</dt>
            <dd className="font-mono text-sm tabular-nums">
              {format(shipping)}
            </dd>
          </div>
        )}

        {tax !== undefined && (
          <div
            data-slot="order-row"
            className="flex items-center justify-between"
          >
            <dt className="text-sm text-muted-foreground">Tax</dt>
            <dd className="font-mono text-sm tabular-nums">{format(tax)}</dd>
          </div>
        )}

        <div
          data-slot="order-total"
          className="flex items-center justify-between pt-1"
        >
          <dt className="text-base font-medium">Total</dt>
          <dd className="font-mono text-base font-medium tabular-nums">
            {format(resolvedTotal)}
          </dd>
        </div>
      </dl>
    </div>
  )
}

export { OrderSummary }
export type { OrderLineItem, OrderDiscount, OrderSummaryProps }
