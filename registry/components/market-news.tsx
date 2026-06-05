"use client"

import type { ComponentPropsWithoutRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { PriceChange } from "@/components/ui/price-change"
import {
  RelativeTime,
  RelativeTimeZone,
  RelativeTimeZoneDisplay,
} from "@/components/ui/relative-time"
import { makeNewsItems, makeQuote, type NewsItem } from "@/lib/market"
import { cn } from "@/lib/utils"

const DEFAULT_ITEMS = makeNewsItems(5, { seed: 12 })

const sentimentTone: Record<
  NonNullable<NewsItem["sentiment"]>,
  string
> = {
  positive: "bg-success/10 text-success",
  negative: "bg-destructive/10 text-destructive",
  neutral: "bg-muted text-muted-foreground",
}

const marketNewsVariants = cva("w-full max-w-2xl rounded-xl border border-border bg-card", {
  variants: {
    compact: {
      true: "[&_[data-slot=news-item]]:py-2 [&_[data-slot=news-item]]:gap-2",
      false: "",
    },
  },
  defaultVariants: {
    compact: false,
  },
})

type MarketNewsProps = Omit<ComponentPropsWithoutRef<"div">, "children"> &
  VariantProps<typeof marketNewsVariants> & {
    items?: NewsItem[]
    onSelect?: (id: string) => void
  }

function MarketNews({
  items = DEFAULT_ITEMS,
  onSelect,
  compact = false,
  className,
  ...props
}: MarketNewsProps) {
  return (
    <div
      data-slot="market-news"
      className={cn(marketNewsVariants({ compact }), className)}
      {...props}
    >
      <ul className="divide-y divide-border">
        {items.map((item) => {
          const symbol = item.symbols?.[0]
          const quote = symbol ? makeQuote({ seed: symbol.length * 17 }) : null
          return (
            <li key={item.id}>
              <button
                type="button"
                data-slot="news-item"
                data-news-id={item.id}
                className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors outline-none hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50"
                onClick={() => onSelect?.(item.id)}
              >
                <Avatar className="size-8 border border-border">
                  <AvatarFallback className="text-xs font-medium">
                    {item.source.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground">{item.source}</span>
                    <RelativeTime time={new Date(item.time)} className="inline-grid">
                      <RelativeTimeZone zone="UTC">
                        <RelativeTimeZoneDisplay className="font-mono text-[11px] text-muted-foreground" />
                      </RelativeTimeZone>
                    </RelativeTime>
                    {item.sentiment ? (
                      <Badge
                        variant="outline"
                        className={sentimentTone[item.sentiment]}
                      >
                        {item.sentiment}
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm leading-snug">{item.headline}</p>
                  {symbol && quote ? (
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="outline">{symbol}</Badge>
                      <PriceChange
                        value={quote.change}
                        percent={quote.changePercent}
                        size="sm"
                      />
                    </div>
                  ) : null}
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export { MarketNews, marketNewsVariants }
export type { MarketNewsProps }
