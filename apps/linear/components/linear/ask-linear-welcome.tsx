"use client"

import * as React from "react"
import { Box, ChevronDown, Paperclip, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type AskLinearWelcomeProps = {
  value?: string
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
  className?: string
}

function AskLinearWelcome({
  value: controlledValue,
  onChange,
  onSubmit,
  className,
}: AskLinearWelcomeProps) {
  const [internalValue, setInternalValue] = React.useState("")
  const value = controlledValue ?? internalValue
  const setValue = onChange ?? setInternalValue

  return (
    <div
      data-slot="linear-ask-welcome"
      className={cn(
        "relative flex min-h-[480px] flex-col items-center justify-center px-6 py-12",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04]"
      >
        <div className="size-64 rounded-full border-[24px] border-foreground" />
      </div>

      <div className="relative z-10 w-full max-w-xl space-y-6 text-center">
        <div className="space-y-1">
          <h1 className="text-lg font-medium tracking-tight text-foreground">
            Welcome to Linear
          </h1>
          <p className="text-sm text-muted-foreground">
            Ask anything or tell Linear what you need
          </p>
        </div>

        <div
          data-slot="linear-ask-welcome-input"
          className="overflow-hidden rounded-xl border border-border bg-card text-left shadow-none"
        >
          <Textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Ask Linear…"
            className="min-h-[120px] resize-none border-0 bg-transparent p-4 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2">
            <Button variant="outline" size="sm" className="h-7 gap-1 rounded-full px-2.5 text-xs">
              <Box className="size-3.5" />
              Skills
              <ChevronDown className="size-3" />
            </Button>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon-sm" aria-label="Attach">
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
    </div>
  )
}

export { AskLinearWelcome }
export type { AskLinearWelcomeProps }
