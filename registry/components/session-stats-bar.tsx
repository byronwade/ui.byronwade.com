"use client"

import type { ComponentPropsWithoutRef } from "react"

import {
  formatPrice,
  formatVolume,
  makeCandles,
  type Candle,
} from "@/lib/market"
import { cn } from "@/lib/utils"

const DEFAULT_CANDLE = makeCandles(1, { seed: 19 })[0]

type SessionStat = {
  label: string
  value: string
  tone?: "default" | "up" | "down"
}

function candleStats(candle: Candle): SessionStat[] {
  const up = candle.close >= candle.open
  return [
    { label: "O", value: formatPrice(candle.open) },
    { label: "H", value: formatPrice(candle.high), tone: "up" },
    { label: "L", value: formatPrice(candle.low), tone: "down" },
    {
      label: "C",
      value: formatPrice(candle.close),
      tone: up ? "up" : "down",
    },
    { label: "V", value: formatVolume(candle.volume) },
  ]
}

const toneClass: Record<NonNullable<SessionStat["tone"]>, string> = {
  default: "text-foreground",
  up: "text-success",
  down: "text-destructive",
}

type SessionStatsBarProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  candle?: Candle
  symbol?: string
}

function SessionStatsBar({
  candle = DEFAULT_CANDLE,
  symbol,
  className,
  ...props
}: SessionStatsBarProps) {
  const stats = candleStats(candle)

  return (
    <div
      data-slot="session-stats-bar"
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-border bg-muted/30 px-3 py-2 font-mono text-sm",
        className,
      )}
      {...props}
    >
      {symbol ? (
        <span
          data-slot="session-stats-bar-symbol"
          className="text-muted-foreground"
        >
          {symbol}
        </span>
      ) : null}
      {stats.map((stat) => (
        <span
          key={stat.label}
          data-slot="session-stats-bar-stat"
          data-label={stat.label}
          className="inline-flex items-baseline gap-1.5 tabular-nums"
        >
          <span className="text-xs text-muted-foreground">{stat.label}</span>
          <span className={toneClass[stat.tone ?? "default"]}>{stat.value}</span>
        </span>
      ))}
    </div>
  )
}

export { SessionStatsBar, candleStats }
export type { SessionStatsBarProps, SessionStat }
