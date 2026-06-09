import * as React from "react"

import { EntityRow } from "@/components/ui/entity-row"
import { cn } from "@/lib/utils"

/**
 * Compact rich result row for a command palette: leading media (avatar /
 * thumbnail / icon), a title with an optional muted description, and trailing
 * mono meta and/or an action slot. Pure layout on tokens — drop it inside a
 * `<CommandItem>` so selection, padding, and radius come from the item.
 */
function CommandResult({
  media,
  title,
  description,
  meta,
  action,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  /** Leading visual: a gradient-avatar, thumbnail, or icon. */
  media?: React.ReactNode
  title: React.ReactNode
  /** Secondary muted line under the title. */
  description?: React.ReactNode
  /** Trailing data (size, timestamp, count) — rendered in `font-mono`. */
  meta?: React.ReactNode
  /** Trailing affordance: a button, badge, or status-dot. */
  action?: React.ReactNode
}) {
  return (
    <EntityRow
      data-slot="command-result"
      className={cn("gap-3 rounded-none p-0", className)}
      leading={
        media != null ? (
          <span
            data-slot="command-result-media"
            className="flex shrink-0 items-center justify-center"
          >
            {media}
          </span>
        ) : undefined
      }
      title={
        <span
          data-slot="command-result-body"
          className="flex min-w-0 flex-col"
        >
          <span
            data-slot="command-result-title"
            className="truncate text-sm leading-tight"
          >
            {title}
          </span>
          {description != null && (
            <span
              data-slot="command-result-description"
              className="truncate text-xs leading-tight text-muted-foreground"
            >
              {description}
            </span>
          )}
        </span>
      }
      meta={
        meta != null ? (
          <span
            data-slot="command-result-meta"
            className="ml-auto font-mono text-xs tabular-nums text-muted-foreground"
          >
            {meta}
          </span>
        ) : undefined
      }
      actions={
        action != null ? (
          <span
            data-slot="command-result-action"
            className={cn("shrink-0", meta == null && "ml-auto")}
          >
            {action}
          </span>
        ) : undefined
      }
      {...props}
    />
  )
}

export { CommandResult }
