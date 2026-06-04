"use client";

import { useState } from "react";

import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";

const PROMPTS = [
  "Summarize this thread",
  "Draft a reply",
  "Explain the diff",
  "Find related issues",
  "Write unit tests",
  "Refactor for readability",
];

export default function Example() {
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-8">
      <div className="w-full max-w-xl">
        <p className="mb-3 text-sm text-muted-foreground">
          Try one of these suggestions
        </p>
        <Suggestions>
          {PROMPTS.map((prompt) => (
            <Suggestion
              key={prompt}
              onClick={setPicked}
              suggestion={prompt}
            />
          ))}
        </Suggestions>
      </div>
      <p className="font-mono text-xs text-muted-foreground">
        {picked ? `selected: ${picked}` : "nothing selected yet"}
      </p>
    </div>
  );
}
