/**
 * Adapted for byronwade/ui from kibo-ui.
 * Original code, concept, and design © kibo-ui — https://www.kibo-ui.com
 * Reworked to the byronwade/ui design system: the up/down change maps to
 * success/destructive tokens (no raw green/red), composes the house avatar,
 * editorial weight, a unique SVG title id (useId), and `data-slot` hooks.
 */
"use client"

import type { HTMLAttributes, ReactNode } from "react"
import { createContext, memo, useContext, useId, useMemo } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type TickerContextValue = { formatter: Intl.NumberFormat }

const DEFAULT_CURRENCY = "USD"
const DEFAULT_LOCALE = "en-US"

const defaultFormatter = new Intl.NumberFormat(DEFAULT_LOCALE, {
  style: "currency",
  currency: DEFAULT_CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const TickerContext = createContext<TickerContextValue>({
  formatter: defaultFormatter,
})

export const useTickerContext = () => useContext(TickerContext)

export type TickerProps = HTMLAttributes<HTMLButtonElement> & {
  currency?: string
  locale?: string
}

export const Ticker = memo(
  ({
    children,
    className,
    currency = DEFAULT_CURRENCY,
    locale = DEFAULT_LOCALE,
    ...props
  }: TickerProps & { children: ReactNode }) => {
    const formatter = useMemo(() => {
      try {
        return new Intl.NumberFormat(locale, {
          style: "currency",
          currency: currency.toUpperCase(),
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      } catch {
        return defaultFormatter
      }
    }, [currency, locale])

    return (
      <TickerContext.Provider value={{ formatter }}>
        <button
          data-slot="ticker"
          className={cn(
            "inline-flex items-center gap-1.5 align-middle whitespace-nowrap",
            className,
          )}
          type="button"
          {...props}
        >
          {children}
        </button>
      </TickerContext.Provider>
    )
  },
)
Ticker.displayName = "Ticker"

export type TickerIconProps = HTMLAttributes<HTMLImageElement> & {
  src?: string
  symbol?: string
  asChild?: boolean
}

export const TickerIcon = memo(
  ({
    src,
    symbol,
    className,
    asChild,
    children,
    ...props
  }: TickerIconProps) => {
    if (asChild) {
      return (
        <div
          data-slot="ticker-icon"
          className={cn(
            "overflow-hidden rounded-full border border-border bg-muted",
            className,
          )}
        >
          {children}
        </div>
      )
    }
    return (
      <Avatar
        data-slot="ticker-icon"
        className={cn("size-7 border border-border bg-muted", className)}
      >
        <AvatarImage src={src} {...props} />
        <AvatarFallback className="text-sm font-medium text-muted-foreground">
          {symbol?.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    )
  },
)
TickerIcon.displayName = "TickerIcon"

export type TickerSymbolProps = HTMLAttributes<HTMLSpanElement> & {
  symbol: string
}

export const TickerSymbol = memo(
  ({ symbol, className, ...props }: TickerSymbolProps) => (
    <span
      data-slot="ticker-symbol"
      className={cn("font-medium", className)}
      {...props}
    >
      {symbol.toUpperCase()}
    </span>
  ),
)
TickerSymbol.displayName = "TickerSymbol"

export type TickerPriceProps = HTMLAttributes<HTMLSpanElement> & {
  price: number
}

export const TickerPrice = memo(
  ({ price, className, ...props }: TickerPriceProps) => {
    const context = useTickerContext()
    const formattedPrice = useMemo(
      () => context.formatter.format(price),
      [price, context],
    )
    return (
      <span
        data-slot="ticker-price"
        className={cn("text-muted-foreground", className)}
        {...props}
      >
        {formattedPrice}
      </span>
    )
  },
)
TickerPrice.displayName = "TickerPrice"

export type TickerPriceChangeProps = HTMLAttributes<HTMLSpanElement> & {
  change: number
  isPercent?: boolean
}

export const TickerPriceChange = memo(
  ({ change, isPercent, className, ...props }: TickerPriceChangeProps) => {
    const titleId = useId()
    const isPositiveChange = change >= 0
    const context = useTickerContext()
    const changeFormatted = useMemo(() => {
      if (isPercent) return `${change.toFixed(2)}%`
      return context.formatter.format(change)
    }, [change, isPercent, context])

    return (
      <span
        data-slot="ticker-price-change"
        className={cn(
          "flex items-center gap-0.5",
          isPositiveChange ? "text-success" : "text-destructive",
          className,
        )}
        {...props}
      >
        <svg
          aria-labelledby={titleId}
          className={isPositiveChange ? "" : "rotate-180"}
          fill="currentColor"
          height="12"
          role="img"
          viewBox="0 0 24 24"
          width="12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title id={titleId}>{isPositiveChange ? "Up" : "Down"}</title>
          <path d="M24 22h-24l12-20z" />
        </svg>
        {changeFormatted}
      </span>
    )
  },
)
TickerPriceChange.displayName = "TickerPriceChange"
