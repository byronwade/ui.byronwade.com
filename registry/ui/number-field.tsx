"use client"

import * as React from "react"
import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field"
import { Minus, Plus } from "lucide-react"

import { cn } from "@/lib/utils"

type NumberFieldSize = "sm" | "default" | "lg"

// One source of truth for the size scale; the root publishes the size on a
// context so the group height, input text, and step-button width all stay in
// lockstep without the caller threading `size` onto every part. Heights mirror
// the house input scale (h-7/h-8/h-9).
const sizeClasses: Record<
  NumberFieldSize,
  { group: string; input: string; step: string }
> = {
  sm: { group: "h-7", input: "text-xs", step: "w-6" },
  default: { group: "h-8", input: "text-base md:text-sm", step: "w-7" },
  lg: { group: "h-9", input: "text-base", step: "w-8" },
}

const NumberFieldSizeContext = React.createContext<NumberFieldSize>("default")

function NumberField({
  className,
  size = "default",
  ...props
}: NumberFieldPrimitive.Root.Props & { size?: NumberFieldSize }) {
  return (
    <NumberFieldSizeContext.Provider value={size}>
      <NumberFieldPrimitive.Root
        data-slot="number-field"
        className={cn("inline-flex flex-col gap-1", className)}
        {...props}
      />
    </NumberFieldSizeContext.Provider>
  )
}

function NumberFieldGroup({
  className,
  ...props
}: NumberFieldPrimitive.Group.Props) {
  const size = React.useContext(NumberFieldSizeContext)
  return (
    <NumberFieldPrimitive.Group
      data-slot="number-field-group"
      className={cn(
        "inline-flex items-center rounded-lg border border-input bg-transparent transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-disabled:opacity-50 dark:bg-input/30",
        sizeClasses[size].group,
        className,
      )}
      {...props}
    />
  )
}

function NumberFieldInput({
  className,
  ...props
}: NumberFieldPrimitive.Input.Props) {
  const size = React.useContext(NumberFieldSizeContext)
  return (
    <NumberFieldPrimitive.Input
      data-slot="number-field-input"
      className={cn(
        "h-full w-full min-w-0 bg-transparent px-2.5 text-center tabular-nums outline-none placeholder:text-muted-foreground",
        sizeClasses[size].input,
        className,
      )}
      {...props}
    />
  )
}

const stepBtn =
  "flex h-full shrink-0 items-center justify-center text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"

function NumberFieldDecrement({
  className,
  children,
  ...props
}: NumberFieldPrimitive.Decrement.Props) {
  const size = React.useContext(NumberFieldSizeContext)
  return (
    <NumberFieldPrimitive.Decrement
      data-slot="number-field-decrement"
      aria-label="Decrease"
      className={cn(stepBtn, sizeClasses[size].step, "rounded-l-lg", className)}
      {...props}
    >
      {children ?? <Minus className="size-3.5" />}
    </NumberFieldPrimitive.Decrement>
  )
}

function NumberFieldIncrement({
  className,
  children,
  ...props
}: NumberFieldPrimitive.Increment.Props) {
  const size = React.useContext(NumberFieldSizeContext)
  return (
    <NumberFieldPrimitive.Increment
      data-slot="number-field-increment"
      aria-label="Increase"
      className={cn(stepBtn, sizeClasses[size].step, "rounded-r-lg", className)}
      {...props}
    >
      {children ?? <Plus className="size-3.5" />}
    </NumberFieldPrimitive.Increment>
  )
}

export {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldDecrement,
  NumberFieldIncrement,
}
