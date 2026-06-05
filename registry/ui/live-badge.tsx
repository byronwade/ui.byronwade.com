import type { ComponentProps, ReactNode } from "react"

import { cn } from "@/lib/utils"

const compact = new Intl.NumberFormat("en", { notation: "compact" })

type LiveBadgeProps = Omit<ComponentProps<"span">, "children"> & {
  children?: ReactNode
  pulse?: boolean
  count?: number
}

function LiveBadge({
  children = "LIVE",
  pulse = true,
  count,
  className,
  ...props
}: LiveBadgeProps) {
  return (
    <span
      data-slot="live-badge"
      aria-label={`Live${count !== undefined ? `, ${count} watching` : ""}`}
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full bg-destructive px-2 py-0.5 font-mono text-xs uppercase tracking-wide text-destructive-foreground",
        className,
      )}
      {...props}
    >
      {pulse && (
        <span
          data-slot="live-badge-dot"
          aria-hidden
          className="size-1.5 animate-pulse rounded-full bg-current"
        />
      )}
      {children}
      {count !== undefined && (
        <span
          data-slot="live-badge-count"
          className="font-mono tabular-nums normal-case opacity-80"
        >
          {compact.format(count)} watching
        </span>
      )}
    </span>
  )
}

export { LiveBadge }
export type { LiveBadgeProps }
