"use client"

import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { useMemo } from "react"
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

const marketNewsVariants = cva("w-full max-w-2xl overflow-hidden edge", {
  variants: {
    variant: {
      default: "rounded-2xl bg-card",
      feed: "rounded-lg bg-background",
      terminal: "rounded-lg bg-background font-mono",
    },
    layout: {
      list: "",
      grid: "",
    },
    density: {
      compact: "",
      comfortable: "",
    },
    compact: {
      true: "[&_[data-slot=news-item]]:py-2 [&_[data-slot=news-item]]:gap-2",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    layout: "list",
    density: "comfortable",
    compact: false,
  },
})

const newsListVariants = cva("", {
  variants: {
    layout: {
      list: "divide-y divide-border",
      grid: "grid gap-2 p-2 sm:grid-cols-2",
    },
  },
  defaultVariants: {
    layout: "list",
  },
})

type MarketNewsProps = Omit<ComponentPropsWithoutRef<"div">, "children"> &
  VariantProps<typeof marketNewsVariants> & {
    items?: NewsItem[]
    title?: ReactNode
    description?: ReactNode
    actions?: ReactNode
    footer?: ReactNode
    empty?: ReactNode
    loading?: boolean
    loadingItems?: number
    limit?: number
    sentiment?: NewsItem["sentiment"] | "all"
    source?: string
    selectedId?: string
    disabled?: boolean
    showSource?: boolean
    showSentiment?: boolean
    showSymbols?: boolean
    onSelect?: (id: string) => void
  }

function MarketNews({
  items = DEFAULT_ITEMS,
  title,
  description,
  actions,
  footer,
  empty = "No market headlines matched.",
  loading = false,
  loadingItems = 4,
  limit,
  sentiment = "all",
  source,
  selectedId,
  disabled = false,
  showSource = true,
  showSentiment = true,
  showSymbols = true,
  onSelect,
  variant = "default",
  layout = "list",
  density = "comfortable",
  compact = false,
  className,
  ...props
}: MarketNewsProps) {
  const visibleItems = useMemo(() => {
    const filtered = items.filter((item) => {
      if (sentiment !== "all" && item.sentiment !== sentiment) return false
      if (source && item.source !== source) return false
      return true
    })

    return typeof limit === "number" ? filtered.slice(0, limit) : filtered
  }, [items, limit, sentiment, source])

  const itemPadding =
    density === "compact" || compact
      ? "gap-2 px-3 py-2"
      : "gap-3 px-4 py-3"

  return (
    <div
      data-slot="market-news"
      data-variant={variant}
      data-layout={layout}
      data-density={density}
      data-disabled={disabled || undefined}
      className={cn(
        marketNewsVariants({ variant, layout, density, compact }),
        className,
      )}
      {...props}
    >
      {title || description || actions ? (
        <div
          data-slot="market-news-header"
          className="flex items-start justify-between gap-3 border-b border-border px-4 py-3"
        >
          <div className="min-w-0">
            {title ? (
              <h3 className="text-sm font-medium tracking-normal">{title}</h3>
            ) : null}
            {description ? (
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      ) : null}

      {loading ? (
        <div data-slot="market-news-loading" className="space-y-0 divide-y divide-border">
          {Array.from({ length: loadingItems }, (_, index) => (
            <div
              key={index}
              data-testid="market-news-skeleton"
              data-slot="market-news-skeleton"
              className={cn("flex items-start", itemPadding)}
            >
              <div className="size-8 shrink-0 rounded-full bg-muted" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3 w-28 rounded-sm bg-muted" />
                <div className="h-4 w-full rounded-sm bg-muted" />
                <div className="h-3 w-36 rounded-sm bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : visibleItems.length === 0 ? (
        <div
          data-slot="market-news-empty"
          className="px-4 py-8 text-center text-sm text-muted-foreground"
        >
          {empty}
        </div>
      ) : (
        <ul className={cn(newsListVariants({ layout }))}>
          {visibleItems.map((item) => {
          const symbol = item.symbols?.[0]
          const quote = symbol ? makeQuote({ seed: symbol.length * 17 }) : null
          return (
            <li key={item.id}>
              <button
                type="button"
                data-slot="news-item"
                data-news-id={item.id}
                data-selected={selectedId === item.id || undefined}
                disabled={disabled}
                className={cn(
                  "flex w-full items-start text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-60",
                  itemPadding,
                  layout === "grid" ? "rounded-lg edge" : "",
                  selectedId === item.id
                    ? "bg-brand/10 ring-1 ring-brand/30"
                    : "hover:bg-muted/40",
                )}
                onClick={() => {
                  if (!disabled) onSelect?.(item.id)
                }}
              >
                <Avatar className="size-8 edge">
                  <AvatarFallback className="text-xs font-medium">
                    {item.source.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {showSource ? (
                      <span className="text-xs text-muted-foreground">
                        {item.source}
                      </span>
                    ) : null}
                    <RelativeTime time={new Date(item.time)} className="inline-grid">
                      <RelativeTimeZone zone="UTC">
                        <RelativeTimeZoneDisplay className="font-mono text-[11px] text-muted-foreground" />
                      </RelativeTimeZone>
                    </RelativeTime>
                    {showSentiment && item.sentiment ? (
                      <Badge
                        variant="outline"
                        className={sentimentTone[item.sentiment]}
                      >
                        {item.sentiment}
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm leading-snug">{item.headline}</p>
                  {showSymbols && symbol && quote ? (
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
      )}

      {footer ? (
        <div
          data-slot="market-news-footer"
          className="border-t border-border px-4 py-3 text-xs text-muted-foreground"
        >
          {footer}
        </div>
      ) : null}
    </div>
  )
}

export { MarketNews, marketNewsVariants }
export type { MarketNewsProps }
