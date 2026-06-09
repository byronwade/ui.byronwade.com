"use client"

import { Background, ReactFlow, ReactFlowProvider } from "@xyflow/react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"
import {
  Node,
  NodeAction,
  NodeContent,
  NodeDescription,
  NodeFooter,
  NodeHeader,
  NodeTitle,
} from "@/components/ai-elements/node"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Node variants
// ---------------------------------------------------------------------------

function PromptNode() {
  return (
    <Node handles={{ target: false, source: true }}>
      <NodeHeader>
        <NodeTitle>Prompt</NodeTitle>
        <NodeDescription>User-facing entry point</NodeDescription>
        <NodeAction>
          <Button size="sm" variant="ghost">
            Edit
          </Button>
        </NodeAction>
      </NodeHeader>
      <NodeContent>
        <p className="text-sm text-muted-foreground">
          Summarize the incoming support ticket and classify its urgency.
        </p>
      </NodeContent>
      <NodeFooter>
        <span className="font-mono text-xs text-muted-foreground">
          gpt-5 · 1.2k tokens
        </span>
      </NodeFooter>
    </Node>
  )
}

function SuccessNode() {
  return (
    <Node
      handles={{ target: false, source: true }}
      className="ring-1 ring-success/30"
    >
      <NodeHeader>
        <NodeTitle>Prompt</NodeTitle>
        <NodeDescription>Completed successfully</NodeDescription>
      </NodeHeader>
      <NodeContent>
        <p className="text-sm text-muted-foreground">
          Summarize the incoming support ticket and classify its urgency.
        </p>
      </NodeContent>
      <NodeFooter>
        <span className="font-mono text-xs text-success">
          done · 1.2k tokens
        </span>
      </NodeFooter>
    </Node>
  )
}

function LoadingNode() {
  return (
    <Node handles={{ target: false, source: true }} aria-busy="true">
      <NodeHeader>
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-3 w-32 rounded" />
        </div>
      </NodeHeader>
      <NodeContent>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-4/5 rounded" />
          <Skeleton className="h-3 w-3/5 rounded" />
        </div>
      </NodeContent>
      <NodeFooter>
        <Skeleton className="h-3 w-28 rounded" />
      </NodeFooter>
    </Node>
  )
}

// ---------------------------------------------------------------------------
// ReactFlow node type maps
// ---------------------------------------------------------------------------

const defaultNodeTypes = { prompt: PromptNode }
const successNodeTypes = { prompt: SuccessNode }
const loadingNodeTypes = { prompt: LoadingNode }

const defaultNodes = [
  { id: "prompt-1", type: "prompt", position: { x: 0, y: 0 }, data: {} },
]

// ---------------------------------------------------------------------------
// Example
// ---------------------------------------------------------------------------

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"
  const isSuccess = state === "success"

  if (isEmpty) {
    return (
      <div className="flex h-[420px] items-center justify-center bg-background p-8">
        <div className="w-80">
          <DemoEmptyState>No nodes</DemoEmptyState>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-[420px] items-center justify-center bg-background p-8">
        <div className="w-80">
          <DemoErrorState>Couldn&apos;t load</DemoErrorState>
        </div>
      </div>
    )
  }

  const nodeTypes = isLoading
    ? loadingNodeTypes
    : isSuccess
      ? successNodeTypes
      : defaultNodeTypes

  return (
    <div
      aria-busy={isLoading}
      data-state={state}
      className={cn("h-[420px] w-full bg-background")}
    >
      <ReactFlowProvider>
        <ReactFlow
          fitView
          nodes={defaultNodes}
          nodeTypes={nodeTypes}
          proOptions={{ hideAttribution: true }}
        >
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  )
}
