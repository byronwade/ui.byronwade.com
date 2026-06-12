"use client"

import * as React from "react"
import { Calendar, FileText, PaperPlaneRight, Paperclip } from "@/lib/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useMessagesActions } from "@/lib/comms-store"

/**
 * Composer for the Messages Cockpit — auto-growing textarea, Enter to send,
 * Shift+Enter for a newline, attachment affordance, and optional template /
 * schedule callbacks. Calls `send` on the comms-store backend.
 */
export function MessageComposer({
  conversationId,
  onPickTemplate,
  onSchedule,
  onAttach,
  className,
}: {
  conversationId?: string
  onPickTemplate?: () => void
  onSchedule?: () => void
  onAttach?: () => void
  className?: string
}) {
  const { send } = useMessagesActions()
  const [body, setBody] = React.useState("")
  const [sending, setSending] = React.useState(false)

  const canSend = Boolean(conversationId && body.trim() && !sending)

  const handleSend = React.useCallback(async () => {
    if (!conversationId || !body.trim() || sending) return
    const text = body.trim()
    setBody("")
    setSending(true)
    try {
      await send(conversationId, text)
    } finally {
      setSending(false)
    }
  }, [body, conversationId, send, sending])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      void handleSend()
    }
  }

  return (
    <div
      data-slot="message-composer"
      className={cn(
        "flex flex-col gap-2 border-t bg-card px-3 py-3 edge",
        !conversationId && "opacity-60",
        className,
      )}
    >
      <div className="flex items-end gap-2">
        <div className="flex shrink-0 items-center gap-0.5">
          <ComposerIconButton
            label="Attach file"
            disabled={!conversationId}
            onClick={onAttach}
          >
            <Paperclip className="size-4" />
          </ComposerIconButton>
          {onPickTemplate ? (
            <ComposerIconButton
              label="Insert template"
              disabled={!conversationId}
              onClick={onPickTemplate}
            >
              <FileText className="size-4" />
            </ComposerIconButton>
          ) : null}
          {onSchedule ? (
            <ComposerIconButton
              label="Schedule message"
              disabled={!conversationId}
              onClick={onSchedule}
            >
              <Calendar className="size-4" />
            </ComposerIconButton>
          ) : null}
        </div>

        <Textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            conversationId ? "Write a message…" : "Select a conversation to reply"
          }
          disabled={!conversationId || sending}
          aria-label="Message"
          rows={1}
          className="min-h-10 max-h-40 resize-none border-0 bg-muted/50 px-3 py-2.5 shadow-none focus-visible:ring-2"
        />

        <Button
          type="button"
          size="icon-sm"
          variant="default"
          aria-label="Send message"
          disabled={!canSend}
          onClick={() => void handleSend()}
        >
          <PaperPlaneRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}

function ComposerIconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled || !onClick}
      onClick={onClick}
      className="grid size-8 place-items-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  )
}
