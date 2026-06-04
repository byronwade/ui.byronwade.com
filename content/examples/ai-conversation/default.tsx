"use client";

import { MessageSquareIcon } from "lucide-react";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

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
  },
];

export default function Example() {
  return (
    <div className="mx-auto flex h-96 w-full max-w-md flex-col overflow-hidden rounded-2xl bg-card text-card-foreground edge">
      <Conversation initial={false} className="flex-1">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<MessageSquareIcon className="size-6" />}
              title="No messages yet"
              description="Start a conversation to see messages here"
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
                </div>
              </div>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
    </div>
  );
}
