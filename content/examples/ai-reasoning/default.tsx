"use client"

import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
} from "@/components/ai-elements/reasoning"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"

const TRACE = `The user is asking for the capital of France.

1. France is a country in Western Europe.
2. Its capital and largest city is **Paris**.

So the answer is **Paris**.`

function ReasoningSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-2">
      <div className="flex items-center gap-2">
        <Skeleton className="size-4 rounded-full" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <div className="mt-4 space-y-2 pl-6">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-2/3" />
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
    <div className="flex min-h-0 items-center justify-center bg-background p-8">
      <div className="w-full max-w-md">
        {isLoading ? (
          <ReasoningSkeleton />
        ) : isEmpty ? (
          <DemoEmptyState>No reasoning</DemoEmptyState>
        ) : isError ? (
          <DemoErrorState>Couldn&apos;t load reasoning</DemoErrorState>
        ) : (
          <Reasoning defaultOpen={false}>
            <ReasoningTrigger />
            <ReasoningContent>{TRACE}</ReasoningContent>
          </Reasoning>
        )}
      </div>
    </div>
  )
}
