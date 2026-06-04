"use client";

import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
} from "@/components/ai-elements/reasoning";

const TRACE = `The user is asking for the capital of France.

1. France is a country in Western Europe.
2. Its capital and largest city is **Paris**.

So the answer is **Paris**.`;

export default function Example() {
  return (
    <div className="flex min-h-0 items-center justify-center bg-background p-8">
      <div className="w-full max-w-md">
        <Reasoning defaultOpen={false}>
          <ReasoningTrigger />
          <ReasoningContent>{TRACE}</ReasoningContent>
        </Reasoning>
      </div>
    </div>
  );
}
