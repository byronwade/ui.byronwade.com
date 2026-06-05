import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * A styled native <select> — for simple, platform-native option lists where the
 * full Base UI `select` would be overkill. Token-driven, with an inline chevron
 * (no icon dependency) and the standard input affordance edge + focus ring.
 */
function NativeSelect({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <div
      data-slot="native-select-wrapper"
      className="relative inline-flex w-full"
    >
      <select
        data-slot="native-select"
        className={cn(
          "h-8 w-full appearance-none rounded-md border border-input bg-transparent py-1 pl-2.5 pr-8 text-sm text-foreground transition-[color,box-shadow] outline-none",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
          "dark:bg-input/30",
          className,
        )}
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
        className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  )
}

export { NativeSelect }
