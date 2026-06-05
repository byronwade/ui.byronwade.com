import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const spinnerVariants = cva(
  "inline-block shrink-0 animate-spin rounded-full border-current border-t-transparent text-muted-foreground",
  {
    variants: {
      size: {
        sm: "size-3 border-2",
        default: "size-4 border-2",
        lg: "size-6 border-[3px]",
      },
    },
    defaultVariants: { size: "default" },
  },
)

/**
 * A token-driven loading spinner — a pure-CSS ring in `currentColor`, so it
 * inherits whatever text color you give it (defaults to muted-foreground).
 */
function Spinner({
  className,
  size,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof spinnerVariants>) {
  return (
    <span
      role="status"
      aria-label="Loading"
      data-slot="spinner"
      className={cn(spinnerVariants({ size, className }))}
      {...props}
    />
  )
}

export { Spinner, spinnerVariants }
