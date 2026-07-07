"use client"

import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

type IssueRowProps = {
  id: string
  title: string
  status?: React.ReactNode
  statusLabel?: string
  priority?: string
  assignee?: { name: string; image?: string; initials?: string }
  selected?: boolean
  onSelectedChange?: (selected: boolean) => void
  onActivate?: () => void
  className?: string
}

function IssueRow({
  id,
  title,
  status,
  statusLabel,
  priority,
  assignee,
  selected,
  onSelectedChange,
  onActivate,
  className,
}: IssueRowProps) {
  const interactive = onActivate != null

  return (
    <div
      data-slot="linear-issue-row"
      className={cn(
        "group/linear-issue-row relative grid min-h-9 grid-cols-[auto_auto_1fr_auto_auto_auto] items-center gap-2 px-3 text-sm",
        className,
      )}
    >
      {onSelectedChange != null ? (
        <Checkbox
          checked={selected}
          onCheckedChange={(v) => onSelectedChange(v === true)}
          aria-label={`Select ${id}`}
          className="relative z-10"
        />
      ) : (
        <span className="size-4" aria-hidden />
      )}

      <span className="relative z-10 font-mono text-xs tabular-nums text-muted-foreground">
        {id}
      </span>

      <button
        type="button"
        className={cn(
          "relative z-10 min-w-0 truncate text-left text-secondary-foreground transition-colors hover:text-foreground",
          interactive && "cursor-pointer",
        )}
        onClick={onActivate}
        disabled={!interactive}
      >
        {title}
      </button>

      {status != null ? (
        <span className="relative z-10 shrink-0">{status}</span>
      ) : statusLabel != null ? (
        <Badge variant="outline" className="relative z-10 shrink-0 font-normal">
          {statusLabel}
        </Badge>
      ) : null}

      {priority != null ? (
        <span className="relative z-10 shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
          {priority}
        </span>
      ) : (
        <span className="relative z-10 size-6 shrink-0" aria-hidden />
      )}

      {assignee != null ? (
        <Avatar className="relative z-10 size-6 shrink-0">
          {assignee.image ? (
            <AvatarImage src={assignee.image} alt={assignee.name} />
          ) : null}
          <AvatarFallback className="text-[10px]">{assignee.initials ?? assignee.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      ) : (
        <span className="relative z-10 size-6 shrink-0 rounded-full bg-muted/40" aria-hidden />
      )}
    </div>
  )
}

export { IssueRow }
export type { IssueRowProps }
