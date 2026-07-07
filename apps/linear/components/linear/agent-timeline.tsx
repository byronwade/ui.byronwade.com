"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
} from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { cn } from "@/lib/utils"

type AgentTimelineEvent = {
  id: string
  actor: string
  initials: string
  text: string
  time: string
  provenance: "user" | "assistant" | "tool"
}

const DEFAULT_EVENTS: AgentTimelineEvent[] = [
  {
    id: "evt-1",
    actor: "Alex Chen",
    initials: "AC",
    text: "User created issue ENG-142",
    time: "4m ago",
    provenance: "user",
  },
  {
    id: "evt-2",
    actor: "Linear Agent",
    initials: "AI",
    text: "Status changed to In progress",
    time: "3m ago",
    provenance: "assistant",
  },
  {
    id: "evt-3",
    actor: "Sam Rivera",
    initials: "SR",
    text: "Comment added on cycle scope",
    time: "2m ago",
    provenance: "user",
  },
  {
    id: "evt-4",
    actor: "Codex",
    initials: "CX",
    text: "Ran grep across registry/ui for command palette hooks",
    time: "1m ago",
    provenance: "tool",
  },
  {
    id: "evt-5",
    actor: "Linear Agent",
    initials: "AI",
    text: "Suggested assignee based on file ownership",
    time: "just now",
    provenance: "assistant",
  },
]

function provenanceLabel(provenance: AgentTimelineEvent["provenance"]) {
  if (provenance === "tool") return "tool"
  if (provenance === "assistant") return "assistant"
  return "user"
}

function AgentTimeline({
  events = DEFAULT_EVENTS,
  className,
}: {
  events?: AgentTimelineEvent[]
  className?: string
}) {
  const lastId = events.at(-1)?.id

  return (
    <MessageScrollerProvider autoScroll defaultScrollPosition="end">
      <MessageScroller
        data-slot="linear-agent-timeline"
        className={cn("h-72 max-w-md", className)}
      >
        <MessageScrollerViewport className="h-full rounded-lg border border-border bg-card">
          <MessageScrollerContent className="gap-4 p-3">
            {events.map((event) => (
              <MessageScrollerItem
                key={event.id}
                messageId={event.id}
                scrollAnchor={event.id === lastId}
              >
                <Message data-provenance={event.provenance}>
                  <MessageAvatar>
                    <Avatar className="size-8">
                      <AvatarFallback className="text-[10px]">
                        {event.initials}
                      </AvatarFallback>
                    </Avatar>
                  </MessageAvatar>
                  <MessageContent>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-foreground">
                        {event.actor}
                      </span>
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {provenanceLabel(event.provenance)}
                      </Badge>
                    </div>
                    <Bubble
                      variant={
                        event.provenance === "assistant"
                          ? "muted"
                          : event.provenance === "tool"
                            ? "outline"
                            : "secondary"
                      }
                    >
                      <BubbleContent>{event.text}</BubbleContent>
                    </Bubble>
                    <MessageFooter className="font-mono text-[10px]">
                      {event.time}
                    </MessageFooter>
                  </MessageContent>
                </Message>
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton direction="end" />
      </MessageScroller>
    </MessageScrollerProvider>
  )
}

export { AgentTimeline, DEFAULT_EVENTS }
export type { AgentTimelineEvent }
