"use client"

import * as React from "react"
import {
  Box,
  ChevronDown,
  Copy,
  Maximize2,
  Minus,
  Paperclip,
  Send,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type AskLinearChatPanelProps = {
  title?: string
  children: React.ReactNode
  reply?: string
  onReplyChange?: (value: string) => void
  onClose?: () => void
  className?: string
}

function AskLinearChatPanel({
  title = "Explain project purpose",
  children,
  reply = "",
  onReplyChange,
  onClose,
  className,
}: AskLinearChatPanelProps) {
  return (
    <div
      data-slot="linear-ask-chat-panel"
      className={cn(
        "flex w-full max-w-md flex-col overflow-hidden rounded-xl border border-border bg-card shadow-none",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <p className="truncate text-sm font-medium">{title}</p>
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon-sm" aria-label="Minimize">
            <Minus className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Expand">
            <Maximize2 className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Close" onClick={onClose}>
            <X className="size-3.5" />
          </Button>
        </div>
      </div>

      <div
        data-slot="linear-ask-chat-scroller"
        className="max-h-72 overflow-auto px-4 py-3 text-sm leading-relaxed"
      >
        {children}
        <Button variant="ghost" size="icon-sm" className="mt-2 size-7" aria-label="Copy">
          <Copy className="size-3.5" />
        </Button>
      </div>

      <div className="border-t border-border p-3">
        <Textarea
          value={reply}
          onChange={(event) => onReplyChange?.(event.target.value)}
          placeholder="Reply…"
          className="min-h-16 resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
        />
        <div className="mt-2 flex items-center justify-between gap-2">
          <Button variant="outline" size="sm" className="h-7 gap-1 rounded-full px-2.5 text-xs">
            <Box className="size-3.5" />
            Skills
            <ChevronDown className="size-3" />
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" aria-label="Attach">
              <Paperclip className="size-4" />
            </Button>
            <Button size="icon-sm" className="rounded-full" aria-label="Send">
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { AskLinearChatPanel }
export type { AskLinearChatPanelProps }
