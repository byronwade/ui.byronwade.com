"use client"

import type { ComponentPropsWithoutRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { DepthChart } from "@/components/ui/depth-chart"
import { OrderBook } from "@/components/ui/order-book"
import { makeOrderBook, type OrderBookLevel } from "@/lib/market"
import { cn } from "@/lib/utils"

const defaultBook = makeOrderBook()

const marketDepthVariants = cva("flex w-full flex-col gap-3", {
  variants: {
    view: {
      both: "",
      book: "",
      chart: "",
    },
  },
  defaultVariants: {
    view: "both",
  },
})

type MarketDepthProps = Omit<ComponentPropsWithoutRef<"div">, "children"> &
  VariantProps<typeof marketDepthVariants> & {
    bids?: OrderBookLevel[]
    asks?: OrderBookLevel[]
    depth?: number
    onSelectPrice?: (price: number) => void
  }

function MarketDepth({
  bids = defaultBook.bids,
  asks = defaultBook.asks,
  view = "both",
  depth,
  onSelectPrice,
  className,
  ...props
}: MarketDepthProps) {
  return (
    <div
      data-slot="market-depth"
      data-view={view}
      className={cn(marketDepthVariants({ view }), className)}
      {...props}
    >
      {view === "both" || view === "chart" ? (
        <DepthChart bids={bids} asks={asks} className="w-full" />
      ) : null}
      {view === "both" || view === "book" ? (
        <OrderBook
          bids={bids}
          asks={asks}
          depth={depth}
          onSelectPrice={onSelectPrice}
          className="w-full"
        />
      ) : null}
    </div>
  )
}

export { MarketDepth, marketDepthVariants }
export type { MarketDepthProps }
