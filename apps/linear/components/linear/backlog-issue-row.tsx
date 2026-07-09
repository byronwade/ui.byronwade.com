"use client"

import * as React from "react"
import { GripVertical } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type BacklogIssueRowProps = {
  id: string
  title: string
  project?: string
  date?: string
  assigneeInitials?: string
  onActivate?: () => void
  className?: string
}

function BacklogIssueRow({
  id,
  title,
  project,
  date,
  assigneeInitials = "?",
  onActivate,
  className,
}: BacklogIssueRowProps) {
  return (
    <div
      data-slot="linear-backlog-issue-row"
      className={cn(
        "group flex min-h-9 items-center gap-2 border-b border-border px-3 text-sm last:border-b-0 hover:bg-muted/30",
        className
      )}
    >
      <GripVertical className="size-3.5 shrink-0 text-muted-foreground/50 opacity-0 group-hover:opacity-100" />
      <span className="w-12 shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
        {id}
      </span>
      <span
        data-slot="linear-backlog-status"
        className="inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-dashed border-muted-foreground/60"
        aria-hidden
      />
      <button
        type="button"
        className="min-w-0 flex-1 truncate text-left text-foreground hover:underline"
        onClick={onActivate}
      >
        {title}
      </button>
      <Avatar className="size-5 shrink-0">
        <AvatarFallback className="text-[9px]">{assigneeInitials}</AvatarFallback>
      </Avatar>
      {project ? (
        <span className="hidden max-w-[180px] truncate text-xs text-muted-foreground lg:inline">
          {project}
        </span>
      ) : null}
      {date ? (
        <span className="w-10 shrink-0 text-right font-mono text-xs text-muted-foreground">
          {date}
        </span>
      ) : null}
    </div>
  )
}

function BacklogSection({
  title,
  count,
  children,
  defaultOpen = true,
}: {
  title: string
  count: number
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <section data-slot="linear-backlog-section" className="flex flex-col">
      <button
        type="button"
        data-slot="linear-backlog-section-header"
        className="flex items-center gap-2 border-b border-border px-3 py-2 text-left text-sm hover:bg-muted/30"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="text-muted-foreground">{open ? "▾" : "▸"}</span>
        <span className="font-medium">{title}</span>
        <span className="font-mono text-xs text-muted-foreground">{count}</span>
        <span className="ml-auto text-muted-foreground">+</span>
      </button>
      {open ? children : null}
    </section>
  )
}

export { BacklogIssueRow, BacklogSection }
