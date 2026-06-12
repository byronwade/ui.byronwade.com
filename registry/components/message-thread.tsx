"use client"

import * as React from "react"
import { Chat, Check, Checks, Clock, Plus, X } from "@/lib/icons"

import { cn } from "@/lib/utils"
import { EmptyState } from "@/components/empty-state"
import { GradientAvatar } from "@/components/ui/gradient-avatar"
import {
  useMessages,
  useMessagesActions,
  type Message,
  type MessageStatus,
} from "@/lib/comms-store"

const QUICK_REACTIONS = ["👍", "❤️", "😂", "🎉"] as const

function formatMessageTime(at: number): string {
  return new Date(at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
}

function StatusTick({ status }: { status: MessageStatus }) {
  if (status === "sending") {
    return <Clock className="size-3 opacity-70" aria-label="Sending" />
  }
  if (status === "sent") {
    return <Check className="size-3 opacity-70" aria-label="Sent" />
  }
  if (status === "delivered") {
    return <Checks className="size-3 opacity-70" aria-label="Delivered" />
  }
  if (status === "read") {
    return <Checks className="size-3 text-brand" aria-label="Read" />
  }
  return <X className="size-3 text-destructive" aria-label="Failed to send" />
}

function MessageBubble({
  message,
  conversationId,
}: {
  message: Message
  conversationId: string
}) {
  const { react } = useMessagesActions()
  const [pickerOpen, setPickerOpen] = React.useState(false)
  const outgoing = message.direction === "out"

  return (
    <div
      data-slot="message-bubble"
      data-direction={message.direction}
      className={cn(
        "group/bubble flex max-w-[85%] flex-col gap-1",
        outgoing ? "ml-auto items-end" : "mr-auto items-start",
      )}
    >
      <div
        className={cn(
          "relative rounded-2xl px-3 py-2 text-[13px] leading-relaxed edge",
          outgoing
            ? "rounded-tr-md bg-brand text-brand-foreground"
            : "rounded-tl-md bg-muted text-foreground",
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.body}</p>
        <div
          className={cn(
            "mt-1 flex items-center justify-end gap-1 text-[10px]",
            outgoing ? "text-brand-foreground/70" : "text-muted-foreground",
          )}
        >
          <time dateTime={new Date(message.at).toISOString()}>
            {formatMessageTime(message.at)}
          </time>
          {outgoing ? <StatusTick status={message.status} /> : null}
        </div>
      </div>

      {(message.reactions.length > 0 || pickerOpen) && (
        <div
          data-slot="message-reactions"
          className="flex flex-wrap items-center gap-1"
        >
          {message.reactions.map((emoji) => (
            <button
              key={emoji}
              type="button"
              aria-label={`Remove reaction ${emoji}`}
              onClick={() => react(conversationId, message.id, emoji)}
              className="rounded-full bg-accent px-1.5 py-0.5 text-[11px] outline-none transition-colors hover:bg-accent/80 focus-visible:ring-2 focus-visible:ring-ring"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover/bubble:opacity-100 group-focus-within/bubble:opacity-100">
        <button
          type="button"
          aria-label="Add reaction"
          aria-expanded={pickerOpen}
          onClick={() => setPickerOpen((open) => !open)}
          className="grid size-6 place-items-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Plus className="size-3.5" />
        </button>
        {pickerOpen ? (
          <div
            data-slot="reaction-picker"
            className="flex items-center gap-0.5 rounded-full bg-card px-1 py-0.5 edge"
          >
            {QUICK_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                aria-label={`React with ${emoji}`}
                onClick={() => {
                  react(conversationId, message.id, emoji)
                  setPickerOpen(false)
                }}
                className="grid size-7 place-items-center rounded-full text-sm outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
              >
                {emoji}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

/**
 * Thread pane for the Messages Cockpit, contact header, scrollable in/out bubbles
 * with delivery ticks, reaction chips, and an empty state when no conversation is
 * selected. Reads/acts through `comms-store`.
 */
export function MessageThread({
  conversationId,
  className,
}: {
  conversationId?: string
  className?: string
}) {
  const { conversations, messages } = useMessages()
  const { markRead } = useMessagesActions()
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const conversation = React.useMemo(
    () => conversations.find((c) => c.id === conversationId),
    [conversations, conversationId],
  )
  const thread = conversationId ? (messages[conversationId] ?? []) : []

  React.useEffect(() => {
    if (!conversationId) return
    markRead(conversationId)
  }, [conversationId])

  React.useEffect(() => {
    const node = scrollRef.current
    if (!node) return
    node.scrollTop = node.scrollHeight
  }, [thread.length, conversationId])

  if (!conversationId || !conversation) {
    return (
      <div
        data-slot="message-thread"
        data-empty
        className={cn(
          "flex h-full min-h-0 flex-col items-center justify-center p-6",
          className,
        )}
      >
        <EmptyState
          icon={Chat}
          title="No conversation selected"
          description="Choose a thread from the list to read and reply."
        />
      </div>
    )
  }

  return (
    <div
      data-slot="message-thread"
      className={cn("flex h-full min-h-0 flex-col", className)}
    >
      <header
        data-slot="thread-header"
        className="flex items-center gap-3 border-b px-4 py-3 edge"
      >
        <GradientAvatar seed={conversation.contact.avatarSeed} size="md" />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[14px] font-medium text-foreground">
            {conversation.contact.name}
          </h2>
          <p className="truncate text-[12px] text-muted-foreground">
            {conversation.contact.handle}
            <span className="mx-1.5 text-muted-foreground/50">·</span>
            {conversation.number}
          </p>
        </div>
      </header>

      <div
        ref={scrollRef}
        data-slot="thread-messages"
        className="min-h-0 flex-1 space-y-3 overflow-auto px-4 py-4"
      >
        {thread.length === 0 ? (
          <p className="py-8 text-center text-[13px] text-muted-foreground">
            No messages yet, say hello.
          </p>
        ) : (
          thread.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              conversationId={conversationId}
            />
          ))
        )}
      </div>
    </div>
  )
}
