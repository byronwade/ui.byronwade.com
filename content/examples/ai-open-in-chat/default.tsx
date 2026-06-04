"use client";

import {
  OpenIn,
  OpenInContent,
  OpenInLabel,
  OpenInSeparator,
  OpenInTrigger,
  OpenInChatGPT,
  OpenInClaude,
  OpenInCursor,
  OpenInScira,
  OpenInT3,
  OpenInv0,
} from "@/components/ai-elements/open-in-chat";

const query =
  "Explain how React Server Components stream HTML to the browser.";

export default function Example() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <OpenIn query={query}>
        <OpenInTrigger />
        <OpenInContent>
          <OpenInLabel>Open this prompt in…</OpenInLabel>
          <OpenInSeparator />
          <OpenInChatGPT />
          <OpenInClaude />
          <OpenInCursor />
          <OpenInScira />
          <OpenInT3 />
          <OpenInv0 />
        </OpenInContent>
      </OpenIn>
    </div>
  );
}
