"use client"

import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"

const toolInput = {
  query: "byronwade ui design system",
  top_k: 5,
}

const toolOutput = {
  results: [
    { title: "byronwade/ui", url: "https://ui.byronwade.com" },
    { title: "Design DNA", url: "https://ui.byronwade.com/docs" },
  ],
  took_ms: 412,
}

function ToolSkeleton() {
  return (
    <div aria-hidden="true" className="w-full max-w-md space-y-2">
      <div className="overflow-hidden rounded-lg bg-card edge">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 rounded-sm" />
            <Skeleton className="h-3 w-10 rounded" />
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="size-4 rounded-sm" />
        </div>
        <div className="space-y-2 p-4">
          <Skeleton className="h-3 w-20 rounded" />
          <Skeleton className="h-20 w-full rounded-md" />
        </div>
      </div>
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"

  if (state === "loading") {
    return (
      <div className="flex min-h-0 items-center justify-center bg-background p-8">
        <ToolSkeleton />
      </div>
    )
  }

  if (state === "empty") {
    return (
      <div className="flex min-h-0 items-center justify-center bg-background p-8">
        <div className="w-full max-w-md">
          <DemoEmptyState>No tool calls</DemoEmptyState>
        </div>
      </div>
    )
  }

  if (state === "error") {
    return (
      <div className="flex min-h-0 items-center justify-center bg-background p-8">
        <div className="w-full max-w-md">
          <Tool defaultOpen>
            <ToolHeader
              state="output-error"
              title="Search the web"
              type="tool-web_search"
            />
            <ToolContent>
              <ToolInput input={toolInput} />
              <ToolOutput
                errorText="Connection timed out — search provider unreachable"
                output={undefined}
              />
            </ToolContent>
          </Tool>
        </div>
      </div>
    )
  }

  if (state === "success") {
    return (
      <div className="flex min-h-0 items-center justify-center bg-background p-8">
        <div className="w-full max-w-md">
          <Tool defaultOpen>
            <ToolHeader
              state="output-available"
              title="Search the web"
              type="tool-web_search"
            />
            <ToolContent>
              <ToolInput input={toolInput} />
              <ToolOutput errorText={undefined} output={toolOutput} />
            </ToolContent>
          </Tool>
        </div>
      </div>
    )
  }

  // default — tool call mid-flight: input received, running
  return (
    <div className="flex min-h-0 items-center justify-center bg-background p-8">
      <div className="w-full max-w-md">
        <Tool defaultOpen>
          <ToolHeader
            state="input-available"
            title="Search the web"
            type="tool-web_search"
          />
          <ToolContent>
            <ToolInput input={toolInput} />
          </ToolContent>
        </Tool>
      </div>
    </div>
  )
}
