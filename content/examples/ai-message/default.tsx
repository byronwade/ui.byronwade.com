"use client"

import { CopyIcon, RefreshCwIcon, ThumbsUpIcon } from "lucide-react"

import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageProvenance,
  MessageResponse,
  MessageToolbar,
} from "@/components/ai-elements/message"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"

function MessageSkeleton() {
  return (
    <div
      aria-busy="true"
      className="mx-auto flex min-h-0 max-w-2xl flex-col gap-6 bg-background p-8"
    >
      {/* User bubble skeleton */}
      <div className="flex w-full flex-col items-end gap-2">
        <Skeleton className="h-10 w-56 rounded-lg" />
      </div>
      {/* Assistant response skeleton */}
      <div className="flex w-full flex-col gap-2">
        <Skeleton className="h-3 w-16 rounded" />
        <Skeleton className="h-4 w-full max-w-md rounded" />
        <Skeleton className="h-4 w-4/5 max-w-sm rounded" />
        <Skeleton className="h-4 w-3/5 max-w-xs rounded" />
        <Skeleton className="h-16 w-full max-w-lg rounded-md" />
        <Skeleton className="h-4 w-2/5 max-w-[160px] rounded" />
      </div>
    </div>
  )
}

function MessagePair() {
  return (
    <div className="mx-auto flex min-h-0 max-w-2xl flex-col gap-6 bg-background p-8">
      <Message from="user">
        <MessageContent>
          How do I re-skin the byronwade/ui accent color?
        </MessageContent>
      </Message>

      <Message from="assistant">
        <MessageContent>
          <MessageProvenance>Assistant</MessageProvenance>
          <MessageResponse>
            {[
              "Override a single variable. The entire accent, rings, the primary",
              "chart line, active states, and success, follows `--brand`:",
              "",
              "```css",
              ":root { --brand: oklch(0.55 0.20 25); }",
              ".dark { --brand: oklch(0.65 0.20 25); }",
              "```",
            ].join("\n")}
          </MessageResponse>
          <MessageToolbar>
            <MessageActions>
              <MessageAction label="Copy" tooltip="Copy">
                <CopyIcon className="size-4" />
              </MessageAction>
              <MessageAction label="Regenerate" tooltip="Regenerate">
                <RefreshCwIcon className="size-4" />
              </MessageAction>
              <MessageAction label="Good response" tooltip="Good response">
                <ThumbsUpIcon className="size-4" />
              </MessageAction>
            </MessageActions>
          </MessageToolbar>
        </MessageContent>
      </Message>
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"

  if (state === "loading") {
    return <MessageSkeleton />
  }

  if (state === "empty") {
    return (
      <div className="mx-auto w-full max-w-2xl p-8">
        <DemoEmptyState>No messages</DemoEmptyState>
      </div>
    )
  }

  if (state === "error") {
    return (
      <div className="mx-auto w-full max-w-2xl p-8">
        <DemoErrorState>Couldn&apos;t load message</DemoErrorState>
      </div>
    )
  }

  // default + success both render the normal message pair
  return <MessagePair />
}
