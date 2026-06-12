"use client"

import { Check, Copy, DownloadSimple } from "@/lib/icons"

import {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactClose,
  ArtifactContent,
  ArtifactDescription,
  ArtifactHeader,
  ArtifactTitle,
} from "@/components/ai-elements/artifact"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"
import { cn } from "@/lib/utils"

const codeContent = `export function fib(n: number): number {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}`

function ArtifactSkeleton() {
  return (
    <Artifact className="w-full max-w-lg" aria-busy="true">
      {/* header skeleton */}
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3.5 w-28 rounded" />
          <Skeleton className="h-3 w-20 rounded" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="size-7 rounded" />
          <Skeleton className="size-7 rounded" />
          <Skeleton className="size-7 rounded" />
        </div>
      </div>
      {/* content skeleton — mirrors a ~4-line code block */}
      <div className="flex-1 space-y-2 p-4">
        <Skeleton className="h-3.5 w-[72%] rounded" />
        <Skeleton className="h-3.5 w-[55%] rounded" />
        <Skeleton className="h-3.5 w-[63%] rounded" />
        <Skeleton className="h-3.5 w-[40%] rounded" />
      </div>
    </Artifact>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"
  const isSuccess = state === "success"

  if (state === "loading") {
    return (
      <div className="flex min-h-0 items-center justify-center bg-background p-8">
        <ArtifactSkeleton />
      </div>
    )
  }

  if (state === "empty") {
    return (
      <div className="flex min-h-0 items-center justify-center bg-background p-8">
        <div className="w-full max-w-lg">
          <DemoEmptyState>No artifact</DemoEmptyState>
        </div>
      </div>
    )
  }

  if (state === "error") {
    return (
      <div className="flex min-h-0 items-center justify-center bg-background p-8">
        <div className="w-full max-w-lg">
          <DemoErrorState>Couldn&apos;t load artifact</DemoErrorState>
        </div>
      </div>
    )
  }

  // default + success share the same artifact; success gets a "Generated" badge
  return (
    <div className="flex min-h-0 items-center justify-center bg-background p-8">
      <Artifact
        className={cn("w-full max-w-lg", isSuccess && "ring-success/30")}
        data-state={state}
      >
        <ArtifactHeader>
          <div className="flex flex-col gap-0.5">
            <ArtifactTitle>fibonacci.ts</ArtifactTitle>
            <ArtifactDescription>
              <span className="font-mono">42 lines</span> · TypeScript
              {isSuccess && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-md bg-success/10 px-1.5 py-0.5 text-xs font-medium text-success">
                  <Check className="size-3" />
                  Generated
                </span>
              )}
            </ArtifactDescription>
          </div>
          <ArtifactActions>
            <ArtifactAction icon={Copy} label="Copy" tooltip="Copy" />
            <ArtifactAction
              icon={DownloadSimple}
              label="Download"
              tooltip="Download"
            />
            <ArtifactClose />
          </ArtifactActions>
        </ArtifactHeader>
        <ArtifactContent>
          <pre className="font-mono text-sm text-foreground">{codeContent}</pre>
        </ArtifactContent>
      </Artifact>
    </div>
  )
}
