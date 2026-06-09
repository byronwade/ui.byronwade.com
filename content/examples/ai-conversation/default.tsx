"use client"

import { MessageSquareIcon } from "lucide-react"

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import { DemoErrorState } from "@/app/(docs)/_components/demo-state-bits"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  model?: string
}

const messages: Message[] = [
  {
    id: "1",
    role: "user",
    content: "What's the difference between a token and a raw color?",
  },
  {
    id: "2",
    role: "assistant",
    content:
      "A token is a semantic variable like bg-background that adapts to light/dark and re-skinning. A raw color is a fixed value like #16a34a that never adapts.",
    model: "claude-sonnet-4",
  },
  {
    id: "3",
    role: "user",
    content: "So I should always reach for the token?",
  },
  {
    id: "4",
    role: "assistant",
    content:
      "Exactly. Tone a token with opacity (bg-brand/10) instead of inventing a new color, and dark mode comes for free.",
    model: "claude-sonnet-4",
  },
]

function ConversationSkeleton() {
  return (
    <div className="flex flex-col gap-8 p-4" aria-hidden="true">
      {/* assistant bubble */}
      <div className="flex items-start gap-3">
        <Skeleton className="size-7 shrink-0 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-56 rounded-xl" />
          <Skeleton className="h-4 w-40 rounded-xl" />
        </div>
      </div>
      {/* user bubble */}
      <div className="flex items-start gap-3 self-end">
        <Skeleton className="h-8 w-48 rounded-2xl" />
      </div>
      {/* assistant bubble */}
      <div className="flex items-start gap-3">
        <Skeleton className="size-7 shrink-0 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-64 rounded-xl" />
          <Skeleton className="h-4 w-36 rounded-xl" />
          <Skeleton className="h-4 w-20 rounded-xl" />
        </div>
      </div>
      {/* user bubble */}
      <div className="flex items-start gap-3 self-end">
        <Skeleton className="h-8 w-36 rounded-2xl" />
      </div>
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  return (
    <div className="mx-auto flex h-96 w-full max-w-md flex-col overflow-hidden rounded-2xl bg-card text-card-foreground edge">
      {isError ? (
        <div className="flex flex-1 flex-col items-center justify-center p-6">
          <DemoErrorState>Couldn&apos;t load conversation</DemoErrorState>
        </div>
      ) : isLoading ? (
        <ConversationSkeleton />
      ) : (
        <Conversation initial={false} className="flex-1">
          <ConversationContent>
            {isEmpty ? (
              <ConversationEmptyState
                icon={<MessageSquareIcon className="size-6" />}
                title="No messages yet"
                description="Start the conversation"
              />
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.role === "user"
                      ? "flex items-start gap-3 self-end"
                      : "flex items-start gap-3"
                  }
                >
                  {message.role === "assistant" && (
                    <Avatar className="size-7 shrink-0">
                      <AvatarFallback className="text-xs">AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={
                      message.role === "user"
                        ? "rounded-2xl bg-primary px-3 py-2 text-sm text-primary-foreground"
                        : "rounded-2xl bg-muted px-3 py-2 text-sm text-foreground"
                    }
                  >
                    {message.content}
                    {message.role === "assistant" && message.model && (
                      <p
                        data-provenance="assistant"
                        className="mt-1 font-mono text-xs text-muted-foreground"
                      >
                        {message.model}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      )}
    </div>
  )
}
