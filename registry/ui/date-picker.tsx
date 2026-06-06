"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerProps = {
  date?: Date
  defaultDate?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  align?: React.ComponentProps<typeof PopoverContent>["align"]
}

function DatePicker({
  date: dateProp,
  defaultDate,
  onDateChange,
  placeholder = "Pick a date",
  disabled,
  className,
  align = "start",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [uncontrolledDate, setUncontrolledDate] = React.useState<
    Date | undefined
  >(defaultDate)

  const date = dateProp ?? uncontrolledDate

  const handleSelect = (next: Date | undefined) => {
    if (dateProp === undefined) {
      setUncontrolledDate(next)
    }
    onDateChange?.(next)
    if (next) {
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        render={
          <Button
            variant="outline"
            data-slot="date-picker-trigger"
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
              className,
            )}
            disabled={disabled}
          />
        }
      >
        <CalendarIcon data-icon="inline-start" />
        {date ? format(date, "PPP") : placeholder}
      </PopoverTrigger>
      <PopoverContent
        data-slot="date-picker-content"
        className="w-auto p-0"
        align={align}
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
export type { DatePickerProps }
