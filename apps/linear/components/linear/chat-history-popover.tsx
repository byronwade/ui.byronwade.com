"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type ChatHistoryItem = {
  id: string
  title: string
  time: string
}

type ChatHistoryGroup = {
  label: string
  items: ChatHistoryItem[]
}

type ChatHistoryPopoverProps = {
  groups: ChatHistoryGroup[]
  activeId?: string
  onSelect?: (id: string) => void
  className?: string
}

function ChatHistoryPopover({
  groups,
  activeId,
  onSelect,
  className,
}: ChatHistoryPopoverProps) {
  return (
    <div
      data-slot="linear-chat-history"
      className={cn(
        "w-72 overflow-hidden rounded-xl border border-border bg-card shadow-none",
        className
      )}
    >
      <div className="border-b border-border px-3 py-2">
        <p className="text-sm font-medium">Chat history</p>
      </div>
      <div className="max-h-64 overflow-auto py-1">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="px-3 py-1.5 text-xs text-muted-foreground">{group.label}</p>
            {group.items.map((item) => (
              <button
                key={item.id}
                type="button"
                data-slot="linear-chat-history-item"
                data-active={activeId === item.id ? "true" : undefined}
                className={cn(
                  "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-muted/30",
                  activeId === item.id && "bg-muted/30"
                )}
                onClick={() => onSelect?.(item.id)}
              >
                <span className="truncate">{item.title}</span>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  {item.time}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export { ChatHistoryPopover }
export type { ChatHistoryGroup, ChatHistoryItem, ChatHistoryPopoverProps }
