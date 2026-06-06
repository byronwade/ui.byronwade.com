"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"
import {
  endOfMonth,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
} from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

/**
 * Range calendar with date presets, adapted from coss `p-calendar-21` to our
 * tokens + components. Presets are ghost Buttons; the range selection follows
 * `--brand` via the calendar.
 */
export default function Example() {
  const today = new Date()
  const [month, setMonth] = useState(today)
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(today, 6),
    to: today,
  })

  const presets: { label: string; range: DateRange }[] = [
    { label: "Today", range: { from: today, to: today } },
    {
      label: "Yesterday",
      range: { from: subDays(today, 1), to: subDays(today, 1) },
    },
    { label: "Last 7 days", range: { from: subDays(today, 6), to: today } },
    { label: "Last 30 days", range: { from: subDays(today, 29), to: today } },
    { label: "Month to date", range: { from: startOfMonth(today), to: today } },
    {
      label: "Last month",
      range: {
        from: startOfMonth(subMonths(today, 1)),
        to: endOfMonth(subMonths(today, 1)),
      },
    },
    { label: "Year to date", range: { from: startOfYear(today), to: today } },
  ]

  return (
    <div className="flex justify-center p-6">
      <div className="flex w-fit rounded-2xl edge bg-card max-sm:flex-col">
        <div className="flex flex-col gap-0.5 p-2 max-sm:order-1 max-sm:border-t sm:border-r sm:border-border">
          {presets.map((p) => (
            <Button
              key={p.label}
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                setDate(p.range)
                if (p.range.to) setMonth(p.range.to)
              }}
            >
              {p.label}
            </Button>
          ))}
        </div>
        <Calendar
          mode="range"
          month={month}
          onMonthChange={setMonth}
          selected={date}
          onSelect={setDate}
          numberOfMonths={1}
        />
      </div>
    </div>
  )
}
