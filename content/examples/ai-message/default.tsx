"use client";

import { CopyIcon, RefreshCwIcon, ThumbsUpIcon } from "lucide-react";

import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
  MessageToolbar,
} from "@/components/ai-elements/message";

export default function Example() {
  return (
    <div className="mx-auto flex min-h-0 max-w-2xl flex-col gap-6 bg-background p-8">
      <Message from="user">
        <MessageContent>
          How do I re-skin the byronwade/ui accent color?
        </MessageContent>
      </Message>

      <Message from="assistant">
        <MessageContent>
          <MessageResponse>
            {[
              "Override a single variable. The entire accent — rings, the primary",
              "chart line, active states, and success — follows `--brand`:",
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
  );
}
