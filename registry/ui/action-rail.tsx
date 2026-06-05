"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const railVariants = cva("flex", {
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row",
    },
    size: {
      sm: "gap-3",
      md: "gap-4",
    },
  },
  defaultVariants: {
    orientation: "vertical",
    size: "md",
  },
})

const actionVariants = cva(
  "group inline-flex select-none flex-col items-center gap-1 outline-none",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
      },
    },
    defaultVariants: { size: "md" },
  },
)

const chipVariants = cva(
  "inline-flex items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring group-focus-visible:ring-2 group-focus-visible:ring-ring",
  {
    variants: {
      size: {
        sm: "size-9 [&_svg]:size-4",
        md: "size-11 [&_svg]:size-5",
      },
      active: {
        true: "bg-primary text-primary-foreground",
        false: "bg-secondary text-foreground hover:bg-secondary/80",
      },
    },
    defaultVariants: { size: "md", active: false },
  },
)

type ActionRailItem = {
  key: string
  icon: React.ReactNode
  label: string
  count?: number
  active?: boolean
  onClick?: () => void
}

type ActionRailProps = React.ComponentProps<"div"> &
  VariantProps<typeof railVariants> & {
    actions: ActionRailItem[]
  }

const compact = new Intl.NumberFormat(undefined, { notation: "compact" })

function ActionRail({
  actions,
  orientation = "vertical",
  size = "md",
  className,
  ...props
}: ActionRailProps) {
  return (
    <div
      data-slot="action-rail"
      role="group"
      data-orientation={orientation}
      className={cn(railVariants({ orientation, size }), className)}
      {...props}
    >
      {actions.map((action) => {
        const active = action.active ?? false
        return (
          <button
            key={action.key}
            type="button"
            data-slot="action-rail-action"
            data-active={active || undefined}
            aria-label={action.label}
            aria-pressed={action.active}
            onClick={action.onClick}
            className={actionVariants({ size })}
          >
            <span
              data-slot="action-rail-chip"
              className={chipVariants({ size, active })}
            >
              {action.icon}
            </span>
            {action.count !== undefined && (
              <span
                data-slot="action-rail-count"
                className="font-mono tabular-nums text-muted-foreground"
              >
                {compact.format(action.count)}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export { ActionRail }
export type { ActionRailProps, ActionRailItem }
