"use client"

import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtImage,
  ChainOfThoughtSearchResult,
  ChainOfThoughtSearchResults,
  ChainOfThoughtStep,
} from "@/components/ai-elements/chain-of-thought"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"
import { FileSearchIcon, GlobeIcon, ListChecksIcon } from "lucide-react"

function ChainOfThoughtSkeleton() {
  return (
    <div aria-hidden="true" className="mt-2 space-y-3">
      {/* Step 1 skeleton — complete layout mirrored */}
      <div className="flex gap-2">
        <div className="relative mt-0.5">
          <Skeleton className="size-4 rounded-full" />
          <div className="-mx-px absolute top-7 bottom-0 left-1/2 w-px bg-border" />
        </div>
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-48" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
      </div>

      {/* Step 2 skeleton — active/streaming layout mirrored */}
      <div className="flex gap-2">
        <div className="relative mt-0.5">
          <Skeleton className="size-4 rounded-full" />
          <div className="-mx-px absolute top-7 bottom-0 left-1/2 w-px bg-border" />
        </div>
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-56" />
          <Skeleton className="mt-2 h-20 w-full rounded-lg" />
        </div>
      </div>

      {/* Step 3 skeleton — pending layout mirrored */}
      <div className="flex gap-2">
        <Skeleton className="mt-0.5 size-4 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"
  const isSuccess = state === "success"

  return (
    <div className="flex min-h-0 items-start justify-center bg-background p-8">
      <div className="w-full max-w-md">
        {isEmpty ? (
          <DemoEmptyState>No reasoning recorded</DemoEmptyState>
        ) : isError ? (
          <DemoErrorState>Couldn&apos;t load reasoning</DemoErrorState>
        ) : (
          <ChainOfThought className="w-full max-w-md" defaultOpen>
            <ChainOfThoughtHeader>Reasoning</ChainOfThoughtHeader>
            <ChainOfThoughtContent>
              {isLoading ? (
                <ChainOfThoughtSkeleton />
              ) : (
                <>
                  <ChainOfThoughtStep
                    icon={GlobeIcon}
                    label="Searching the web for recent results"
                    status="complete"
                  >
                    <ChainOfThoughtSearchResults>
                      <ChainOfThoughtSearchResult>
                        vercel.com
                      </ChainOfThoughtSearchResult>
                      <ChainOfThoughtSearchResult>
                        nextjs.org/docs
                      </ChainOfThoughtSearchResult>
                      <ChainOfThoughtSearchResult>
                        react.dev
                      </ChainOfThoughtSearchResult>
                    </ChainOfThoughtSearchResults>
                  </ChainOfThoughtStep>

                  <ChainOfThoughtStep
                    description="Cross-referencing three primary sources for accuracy."
                    icon={FileSearchIcon}
                    label="Reading documentation"
                    status={isSuccess ? "complete" : "active"}
                  >
                    <ChainOfThoughtImage caption="App Router data-flow diagram">
                      <span className="font-mono text-xs text-muted-foreground">
                        diagram.png
                      </span>
                    </ChainOfThoughtImage>
                  </ChainOfThoughtStep>

                  <ChainOfThoughtStep
                    icon={ListChecksIcon}
                    label="Drafting the answer"
                    status={isSuccess ? "complete" : "pending"}
                  />
                </>
              )}
            </ChainOfThoughtContent>
          </ChainOfThought>
        )}
      </div>
    </div>
  )
}
