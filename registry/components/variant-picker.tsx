"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface VariantOption {
  name: string
  values: string[]
  unavailable?: string[]
}

interface VariantPickerProps extends Omit<
  React.ComponentProps<"div">,
  "value" | "defaultValue" | "onChange"
> {
  options: VariantOption[]
  value?: Record<string, string>
  defaultValue?: Record<string, string>
  onChange?: (next: Record<string, string>) => void
}

function VariantPicker({
  options,
  value,
  defaultValue,
  onChange,
  className,
  ...props
}: VariantPickerProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<Record<string, string>>(
    defaultValue ?? {},
  )
  const selection = isControlled ? value : internal

  function selectValue(name: string, next: string[]) {
    // Single-select toggle groups let the active chip be clicked off, yielding
    // an empty array. A variant option must keep its current value selected, so
    // we treat that as a no-op rather than clearing the record.
    if (next.length === 0) return
    const merged = { ...selection, [name]: next[0] }
    if (!isControlled) setInternal(merged)
    onChange?.(merged)
  }

  return (
    <div
      data-slot="variant-picker"
      className={cn("flex flex-col gap-5", className)}
      {...props}
    >
      {options.map((option) => {
        const selected = selection[option.name]
        return (
          <div
            key={option.name}
            data-slot="variant-picker-option"
            className="flex flex-col gap-2"
          >
            <Label data-slot="variant-picker-label" className="gap-1.5">
              {option.name}
              {selected && (
                <span
                  data-slot="variant-picker-selected"
                  className="font-normal text-muted-foreground"
                >
                  {selected}
                </span>
              )}
            </Label>
            <ToggleGroup
              role="toolbar"
              aria-label={option.name}
              variant="outline"
              value={selected ? [selected] : []}
              onValueChange={(next) => selectValue(option.name, next)}
              className="flex-wrap"
            >
              {option.values.map((item) => {
                const isUnavailable = option.unavailable?.includes(item)
                return (
                  <ToggleGroupItem
                    key={item}
                    value={item}
                    disabled={isUnavailable}
                    aria-label={item}
                    className={cn(
                      "data-[state=on]:border-brand data-[state=on]:bg-brand/10 data-[state=on]:text-brand",
                      isUnavailable && "text-muted-foreground line-through",
                    )}
                  >
                    {item}
                  </ToggleGroupItem>
                )
              })}
            </ToggleGroup>
          </div>
        )
      })}
    </div>
  )
}

export { VariantPicker }
export type { VariantOption, VariantPickerProps }
