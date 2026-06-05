"use client"

import type { ComponentPropsWithoutRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import {
  Ticker,
  TickerPrice,
  TickerPriceChange,
  TickerSymbol,
} from "@/components/ui/ticker"
import { makeQuote, type Quote } from "@/lib/market"
import { cn } from "@/lib/utils"

const DEFAULT_ITEMS: Quote[] = Array.from({ length: 8 }, (_, index) =>
  makeQuote({ seed: index + 1 }),
)

const tapeDuration: Record<"slow" | "default" | "fast", string> = {
  slow: "60s",
  default: "40s",
  fast: "20s",
}

const tickerTapeVariants = cva(
  "relative w-full overflow-hidden border-y border-border bg-muted/30 py-2",
  {
    variants: {
      speed: {
        slow: "",
        default: "",
        fast: "",
      },
    },
    defaultVariants: {
      speed: "default",
    },
  },
)

type TickerTapeProps = Omit<ComponentPropsWithoutRef<"div">, "children"> &
  VariantProps<typeof tickerTapeVariants> & {
    items?: Quote[]
    paused?: boolean
  }

function TickerTapeItem({ quote }: { quote: Quote }) {
  return (
    <Ticker
      data-slot="ticker-tape-item"
      className="shrink-0 px-3"
      aria-label={`${quote.symbol} ${quote.price.toFixed(2)}`}
    >
      <TickerSymbol symbol={quote.symbol} />
      <TickerPrice price={quote.price} />
      <TickerPriceChange change={quote.changePercent} isPercent />
    </Ticker>
  )
}

function TickerTape({
  items = DEFAULT_ITEMS,
  speed = "default",
  paused = false,
  className,
  ...props
}: TickerTapeProps) {
  const track = [...items, ...items]

  return (
    <div
      data-slot="ticker-tape"
      data-paused={paused ? "true" : "false"}
      aria-label="Market ticker tape"
      className={cn(tickerTapeVariants({ speed }), className)}
      {...props}
    >
      <style>{`@keyframes ticker-tape-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      <div
        data-slot="ticker-tape-track"
        className={cn(
          "flex w-max items-center gap-2 motion-reduce:translate-x-0",
          paused && "motion-safe:animate-none",
        )}
        style={
          paused
            ? undefined
            : {
                animation: `ticker-tape-scroll ${tapeDuration[speed ?? "default"]} linear infinite`,
              }
        }
      >
        {track.map((quote, index) => (
          <TickerTapeItem key={`${quote.symbol}-${index}`} quote={quote} />
        ))}
      </div>
    </div>
  )
}

export { TickerTape, tickerTapeVariants }
export type { TickerTapeProps }
