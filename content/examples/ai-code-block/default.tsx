"use client"

import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import {
  CodeBlock,
  CodeBlockCopyButton,
} from "@/components/ai-elements/code-block"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"

const code = `import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function summarize(input: string) {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: \`Summarize: \${input}\`,
  });

  return text;
}`

// Line lengths mirror the actual code block so the skeleton has authentic shape
const skeletonLines = [
  "w-3/4",
  "w-1/2",
  "w-full",
  "w-2/3",
  "w-5/6",
  "w-3/4",
  "w-1/2",
  "w-2/5",
  "w-1/4",
]

function CodeBlockSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="w-full overflow-hidden rounded-lg bg-card ring-1 ring-border/70"
    >
      <div className="flex flex-col gap-2 p-4">
        {skeletonLines.map((w, i) => (
          <Skeleton key={i} className={`h-4 ${w} font-mono`} />
        ))}
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
    <div className="flex w-full items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {isLoading ? (
          <CodeBlockSkeleton />
        ) : isEmpty ? (
          <DemoEmptyState>No code</DemoEmptyState>
        ) : isError ? (
          <DemoErrorState>Couldn&apos;t load code</DemoErrorState>
        ) : (
          <CodeBlock code={code} language="ts" showLineNumbers>
            <CodeBlockCopyButton
              onCopy={() => console.log("Copied to clipboard")}
              onError={() => console.error("Failed to copy")}
            />
          </CodeBlock>
        )}
      </div>
    </div>
  )
}
