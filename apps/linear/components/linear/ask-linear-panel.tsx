"use client"

import * as React from "react"
import { Paperclip, Send, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type AskLinearPanelProps = {
  className?: string
  placeholder?: string
  onSubmit?: (value: string) => void
}

function AskLinearPanel({
  className,
  placeholder = "Ask Linear…",
  onSubmit,
}: AskLinearPanelProps) {
  const [value, setValue] = React.useState("")

  return (
    <div
      data-slot="linear-ask-panel"
      className={cn(
        "flex max-w-xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-none",
        className
      )}
    >
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Sparkles className="size-4 text-muted-foreground" />
          Welcome to Linear
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Ask anything or tell Linear what you need
        </p>
      </div>

      <div className="p-4">
        <Textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          className="min-h-24 resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
        />
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
          <Button variant="outline" size="sm" className="rounded-full">
            Skills
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" aria-label="Attach file">
              <Paperclip className="size-4" />
            </Button>
            <Button
              size="icon-sm"
              className="rounded-full"
              aria-label="Send"
              disabled={!value.trim()}
              onClick={() => {
                onSubmit?.(value.trim())
                setValue("")
              }}
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { AskLinearPanel }
export type { AskLinearPanelProps }
