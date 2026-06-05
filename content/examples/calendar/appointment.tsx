"use client"

import { useState } from "react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

/**
 * Appointment picker — calendar + time slots. Adapted from coss `p-calendar-19`
 * to our components (slots are Buttons: selected = default/ink, free = outline,
 * taken = disabled).
 */
const SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
]
const TAKEN = new Set(["09:00", "09:30", "11:30", "14:30"])

export default function Example() {
  const today = new Date()
  const [date, setDate] = useState<Date>(today)
  const [time, setTime] = useState<string | null>(null)

  return (
    <div className="flex justify-center p-6">
      <div className="flex w-fit rounded-2xl edge bg-card max-sm:flex-col">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            if (d) {
              setDate(d)
              setTime(null)
            }
          }}
          disabled={{ before: today }}
          className="sm:border-r sm:border-border"
        />
        <div className="flex w-full flex-col gap-3 p-3 sm:w-44">
          <p className="px-1 text-sm font-medium text-foreground">
            {format(date, "EEEE, MMM d")}
          </p>
          <div className="grid max-h-64 grid-cols-2 gap-1.5 overflow-y-auto scrollbar-thin sm:grid-cols-1">
            {SLOTS.map((slot) => (
              <Button
                key={slot}
                variant={time === slot ? "default" : "outline"}
                size="sm"
                disabled={TAKEN.has(slot)}
                onClick={() => setTime(slot)}
              >
                {slot}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
