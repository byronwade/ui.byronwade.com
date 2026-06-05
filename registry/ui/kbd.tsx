import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const kbdVariants = cva(
  "inline-flex select-none items-center justify-center gap-1 rounded-sm bg-muted px-1.5 font-mono font-medium text-muted-foreground",
  {
    variants: {
      size: {
        sm: "h-5 min-w-5 text-[0.65rem]",
        default: "h-6 min-w-6 text-[0.7rem]",
        lg: "h-7 min-w-7 text-xs",
      },
    },
    defaultVariants: { size: "default" },
  },
)

function Kbd({
  className,
  size,
  ...props
}: React.ComponentProps<"kbd"> & VariantProps<typeof kbdVariants>) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(kbdVariants({ size, className }))}
      {...props}
    />
  )
}

/** Groups multiple <Kbd> into a shortcut sequence (e.g. ⌘ + K). */
function KbdGroup({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1 align-middle", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup, kbdVariants }
