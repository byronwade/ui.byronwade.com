"use client"

import type { ComponentPropsWithoutRef } from "react"
import { useMemo } from "react"

import { Badge } from "@/components/ui/badge"
import { RelativeTime, RelativeTimeZone, RelativeTimeZoneDisplay } from "@/components/ui/relative-time"
import { makeMarketEvents, type MarketEvent } from "@/lib/market"
import { cn } from "@/lib/utils"

const DEFAULT_EVENTS = makeMarketEvents(6, { seed: 11 })

const dayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "short",
  day: "numeric",
})

const impactTone: Record<MarketEvent["impact"], string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-warning/15 text-warning",
  high: "bg-destructive/15 text-destructive",
}

type EconomicCalendarProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  events?: MarketEvent[]
  onSelect?: (id: string) => void
}

function EconomicCalendar({
  events = DEFAULT_EVENTS,
  onSelect,
  className,
  ...props
}: EconomicCalendarProps) {
  const grouped = useMemo(() => {
    const groups = new Map<string, MarketEvent[]>()
    for (const event of events) {
      const key = dayFormatter.format(new Date(event.time))
      const bucket = groups.get(key) ?? []
      bucket.push(event)
      groups.set(key, bucket)
    }
    return [...groups.entries()]
  }, [events])

  return (
    <div
      data-slot="economic-calendar"
      className={cn("w-full max-w-2xl rounded-xl border border-border bg-card", className)}
      {...props}
    >
      {grouped.map(([day, dayEvents]) => (
        <section key={day} data-slot="economic-calendar-day" className="border-b border-border last:border-b-0">
          <h3 className="border-b border-border bg-muted/30 px-4 py-2 text-sm font-medium tracking-tight">
            {day}
          </h3>
          <ul className="divide-y divide-border">
            {dayEvents.map((event) => (
              <li key={event.id}>
                <button
                  type="button"
                  data-slot="calendar-event"
                  data-event-id={event.id}
                  className="grid w-full grid-cols-[5rem_3rem_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 text-left transition-colors outline-none hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50"
                  onClick={() => onSelect?.(event.id)}
                >
                  <RelativeTime time={new Date(event.time)} className="inline-grid">
                    <RelativeTimeZone zone="UTC">
                      <RelativeTimeZoneDisplay className="font-mono text-xs" />
                    </RelativeTimeZone>
                  </RelativeTime>
                  <span className="font-mono text-xs text-muted-foreground">{event.country}</span>
                  <div className="min-w-0">
                    <div className="truncate text-sm">{event.title}</div>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {event.actual ? (
                        <span>
                          Actual{" "}
                          <span className="font-mono text-foreground">{event.actual}</span>
                        </span>
                      ) : null}
                      {event.forecast ? (
                        <span>
                          Forecast{" "}
                          <span className="font-mono text-foreground">{event.forecast}</span>
                        </span>
                      ) : null}
                      {event.previous ? (
                        <span>
                          Prior{" "}
                          <span className="font-mono text-foreground">{event.previous}</span>
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <Badge
                    data-slot="calendar-event-impact"
                    variant="outline"
                    className={impactTone[event.impact]}
                  >
                    {event.impact}
                  </Badge>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

export { EconomicCalendar }
export type { EconomicCalendarProps }
