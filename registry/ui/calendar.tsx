"use client"

import * as React from "react"
import { CaretLeft, CaretRight } from "@/lib/icons"
import { DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

/**
 * Date picker built on react-day-picker, dressed in byronwade/ui tokens:
 * selection follows `--brand` (active states), the range bar uses `bg-accent`,
 * and nav + day cells reuse `buttonVariants` so they match every other control.
 * Re-skins for free — override `--brand` and the calendar follows.
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaults = getDefaultClassNames()

  return (
    <DayPicker
      data-slot="calendar"
      showOutsideDays={showOutsideDays}
      className={cn("w-fit p-3", className)}
      classNames={{
        root: cn("w-fit", defaults.root),
        months: cn("relative flex flex-col gap-4 sm:flex-row", defaults.months),
        month: cn("flex w-full flex-col gap-4", defaults.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex items-center justify-between",
          defaults.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "text-muted-foreground",
          defaults.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "text-muted-foreground",
          defaults.button_next,
        ),
        month_caption: cn(
          "flex h-7 items-center justify-center px-9",
          defaults.month_caption,
        ),
        caption_label: cn("text-sm font-medium", defaults.caption_label),
        month_grid: cn("w-full border-collapse", defaults.month_grid),
        weekdays: cn("flex", defaults.weekdays),
        weekday: cn(
          "flex-1 select-none rounded-lg text-[0.8rem] font-normal text-muted-foreground",
          defaults.weekday,
        ),
        week: cn("mt-2 flex w-full", defaults.week),
        day: cn(
          "relative size-9 flex-1 select-none p-0 text-center text-sm",
          defaults.day,
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "size-9 select-none font-normal text-foreground",
          defaults.day_button,
        ),
        // SelectionState — endpoints + single selection follow --brand.
        selected: cn(
          "[&>button]:bg-brand [&>button]:text-brand-foreground [&>button]:hover:bg-brand [&>button]:hover:text-brand-foreground",
          defaults.selected,
        ),
        range_start: cn("rounded-l-md bg-accent", defaults.range_start),
        range_end: cn("rounded-r-md bg-accent", defaults.range_end),
        range_middle: cn(
          "rounded-none bg-accent [&>button]:bg-transparent [&>button]:text-foreground [&>button]:hover:bg-transparent",
          defaults.range_middle,
        ),
        // DayFlags.
        today: cn(
          "[&>button:not([aria-selected])]:bg-accent [&>button:not([aria-selected])]:font-medium [&>button:not([aria-selected])]:text-accent-foreground",
          defaults.today,
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaults.outside,
        ),
        disabled: cn("text-muted-foreground opacity-50", defaults.disabled),
        hidden: cn("invisible", defaults.hidden),
        ...classNames,
      }}
      components={{
        Chevron: ({
          orientation,
          className: chevronClassName,
          ...chevronProps
        }) => {
          const Icon = orientation === "left" ? CaretLeft : CaretRight
          return (
            <Icon
              className={cn("size-4", chevronClassName)}
              {...chevronProps}
            />
          )
        },
      }}
      {...props}
    />
  )
}

export { Calendar }
