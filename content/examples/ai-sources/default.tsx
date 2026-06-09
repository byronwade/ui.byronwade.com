"use client"

import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"

const CITATIONS = [
  { href: "https://example.com/edge-runtime", title: "Edge Runtime overview" },
  { href: "https://example.com/streaming", title: "Streaming responses guide" },
  { href: "https://example.com/tokens", title: "Token usage & limits" },
]

function SourcesSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-2">
      {/* trigger row */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-3.5 w-28 rounded" />
        <Skeleton className="h-3.5 w-3.5 rounded" />
      </div>
      {/* source rows mirroring BookIcon + title layout */}
      {CITATIONS.map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-3.5 w-40 rounded" />
        </div>
      ))}
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
      <div className="w-full max-w-md rounded-2xl bg-card p-5 text-card-foreground edge">
        <p className="mb-3 text-sm text-muted-foreground">
          Based on your docs, edge functions stream tokens as they are
          generated, so the first byte arrives in milliseconds.
        </p>

        {isLoading ? (
          <div aria-busy="true">
            <SourcesSkeleton />
          </div>
        ) : isEmpty ? (
          <DemoEmptyState>No sources cited</DemoEmptyState>
        ) : isError ? (
          <DemoErrorState>Couldn&apos;t load sources</DemoErrorState>
        ) : (
          <Sources defaultOpen>
            <SourcesTrigger count={CITATIONS.length} />
            <SourcesContent>
              {CITATIONS.map((citation) => (
                <Source
                  key={citation.href}
                  href={citation.href}
                  title={citation.title}
                />
              ))}
            </SourcesContent>
          </Sources>
        )}
      </div>
    </div>
  )
}
