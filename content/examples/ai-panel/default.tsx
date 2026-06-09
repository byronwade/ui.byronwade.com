"use client"

import { ReactFlow, Background, ReactFlowProvider } from "@xyflow/react"
import { Panel } from "@/components/ai-elements/panel"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import "@xyflow/react/dist/style.css"

function PanelContentNormal() {
  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <span className="text-sm font-medium text-foreground">Workflow</span>
      <span className="font-mono text-xs text-muted-foreground">4 nodes</span>
    </div>
  )
}

function PanelContentLoading() {
  return (
    <div className="flex items-center gap-2 px-2 py-1" aria-hidden="true">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-3 w-10" />
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"
  const isNormal = state === "default" || state === "success"

  return (
    <div className="flex min-h-0 items-center justify-center bg-background p-8">
      <div className="h-96 w-full max-w-2xl overflow-hidden rounded-lg">
        <ReactFlowProvider>
          <ReactFlow nodes={[]} edges={[]} fitView aria-busy={isLoading}>
            <Background />
            <Panel
              position="top-left"
              className={isEmpty || isError ? "w-64" : undefined}
            >
              {isLoading && <PanelContentLoading />}
              {isNormal && <PanelContentNormal />}
              {isEmpty && <DemoEmptyState>Nothing here yet</DemoEmptyState>}
              {isError && <DemoErrorState>Couldn&apos;t load</DemoErrorState>}
            </Panel>
            <Panel position="bottom-right">
              <button
                type="button"
                className="rounded-sm bg-primary px-3 py-1 text-sm text-primary-foreground"
              >
                Run
              </button>
            </Panel>
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  )
}
