"use client"

import * as React from "react"
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "@/components/ui/message-scroller"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "@/components/ui/message"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { GradientAvatar } from "@/components/ui/gradient-avatar"
import { Marker, MarkerContent } from "@/components/ui/marker"

const TURNS = [
  {
    id: "1",
    role: "user" as const,
    text: "How can I help you today?",
  },
  {
    id: "2",
    role: "assistant" as const,
    text: "Morning! What are we working on today?",
  },
  {
    id: "3",
    role: "user" as const,
    text: "I'm building a chat for our app and the scroll behavior is driving me nuts.",
  },
  {
    id: "4",
    role: "assistant" as const,
    text: "MessageScroller handles anchored turns, streamed replies, and prepend preservation so the thread stays put while content grows.",
  },
]

export default function Example() {
  return (
    <div className="mx-auto flex h-[28rem] w-full max-w-lg flex-col overflow-hidden rounded-2xl edge bg-card">
      <div className="border-b px-4 py-3">
        <p className="text-sm font-medium text-foreground">New Chat</p>
        <p className="text-xs text-muted-foreground">
          Scroll stays anchored while messages stream in
        </p>
      </div>

      <MessageScrollerProvider autoScroll defaultScrollPosition="end">
        <MessageScroller className="min-h-0 flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent className="gap-4 px-4 py-4">
              <MessageScrollerItem>
                <Marker variant="separator">
                  <MarkerContent>Today</MarkerContent>
                </Marker>
              </MessageScrollerItem>

              {TURNS.map((turn) => (
                <MessageScrollerItem
                  key={turn.id}
                  messageId={turn.id}
                  scrollAnchor
                >
                  <Message align={turn.role === "user" ? "end" : "start"}>
                    {turn.role === "assistant" ? (
                      <MessageAvatar>
                        <GradientAvatar seed="assistant" size="sm" />
                      </MessageAvatar>
                    ) : null}
                    <MessageContent>
                      {turn.role === "assistant" ? (
                        <MessageHeader>Assistant</MessageHeader>
                      ) : null}
                      <Bubble
                        variant={turn.role === "user" ? "default" : "muted"}
                        align={turn.role === "user" ? "end" : "start"}
                      >
                        <BubbleContent>{turn.text}</BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  )
}
