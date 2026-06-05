import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Size mirrors the house input scale (h-7/h-8/h-9). Horizontal padding grows
// with height, and the trailing chevron gutter (pr-*) tracks the chevron inset
// below so the glyph never collides with the value.
const nativeSelectVariants = cva(
  "w-full appearance-none rounded-md border border-input bg-transparent text-foreground transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30",
  {
    variants: {
      size: {
        sm: "h-7 py-0.5 pl-2 pr-7 text-xs",
        default: "h-8 py-1 pl-2.5 pr-8 text-sm",
        lg: "h-9 py-1.5 pl-3 pr-9 text-base",
      },
    },
    defaultVariants: { size: "default" },
  },
)

type NativeSelectSize = NonNullable<
  VariantProps<typeof nativeSelectVariants>["size"]
>

// Chevron inset per size — keeps the glyph centered in the gutter the select's
// pr-* reserves for it.
const chevronInset: Record<NativeSelectSize, string> = {
  sm: "right-2",
  default: "right-2.5",
  lg: "right-3",
}

/**
 * A styled native <select> — for simple, platform-native option lists where the
 * full Base UI `select` would be overkill. Token-driven, with an inline chevron
 * (no icon dependency) and the standard input affordance edge + focus ring.
 */
function NativeSelect({
  className,
  children,
  size,
  ...props
}: Omit<React.ComponentProps<"select">, "size"> &
  VariantProps<typeof nativeSelectVariants>) {
  return (
    <div
      data-slot="native-select-wrapper"
      className="relative inline-flex w-full"
    >
      <select
        data-slot="native-select"
        className={cn(nativeSelectVariants({ size }), className)}
        {...props}
      >
        {children}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          "pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground",
          chevronInset[size ?? "default"],
        )}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  )
}

export { NativeSelect }
