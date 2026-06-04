"use client";

import { useState } from "react";
import type { DayButtonProps } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

/**
 * Pricing calendar with custom day buttons — adapted from coss `p-calendar-24`.
 * Each day shows a price; below-threshold prices read in `text-success`. Prices
 * are deterministic mock data derived from the date (no random → SSR-safe).
 */
const GOOD_PRICE = 100;

/** Stable pseudo price (80–200) from a date — same on server and client. */
function priceFor(date: Date): number {
  const seed = date.getFullYear() * 372 + (date.getMonth() + 1) * 31 + date.getDate();
  return 80 + (seed % 121);
}

export default function Example() {
  const today = new Date();
  const [date, setDate] = useState<Date | undefined>(today);

  return (
    <div className="flex justify-center p-6">
      <div className="w-fit rounded-2xl edge bg-card">
        <Calendar
          mode="single"
          numberOfMonths={2}
          pagedNavigation
          showOutsideDays={false}
          selected={date}
          onSelect={setDate}
          disabled={{ before: today }}
          classNames={{ day: "size-12 flex-1", day_button: "size-12", weekday: "w-12" }}
          components={{
            DayButton: (props: DayButtonProps) => <PriceDay {...props} />,
          }}
        />
      </div>
    </div>
  );
}

function PriceDay({ day, modifiers, children, ...buttonProps }: DayButtonProps) {
  void modifiers; // strip the RDP-only prop so it never reaches the DOM button
  const price = priceFor(day.date);
  const good = price < GOOD_PRICE;

  return (
    <button {...buttonProps}>
      <span className="flex flex-col items-center justify-center leading-none">
        {children}
        <span
          className={cn(
            "mt-0.5 text-[10px] font-normal",
            good ? "text-success" : "text-muted-foreground"
          )}
        >
          ${price}
        </span>
      </span>
    </button>
  );
}
