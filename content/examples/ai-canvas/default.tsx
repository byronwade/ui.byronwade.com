"use client"

import { Canvas } from "@/components/ai-elements/canvas"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"
import { ReactFlowProvider } from "@xyflow/react"

const nodes = [
  {
    id: "prompt",
    position: { x: 0, y: 0 },
    data: { label: "Prompt" },
    type: "input",
  },
  {
    id: "model",
    position: { x: 220, y: 80 },
    data: { label: "Model" },
  },
  {
    id: "output",
    position: { x: 440, y: 160 },
    data: { label: "Output" },
    type: "output",
  },
]

const edges = [
  { id: "prompt-model", source: "prompt", target: "model" },
  { id: "model-output", source: "model", target: "output" },
]

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  return (
    <div className="flex min-h-0 items-center justify-center bg-background p-8">
      <div className="h-[420px] w-full max-w-3xl overflow-hidden rounded-2xl edge">
        {isLoading ? (
          <Skeleton className="size-full rounded-2xl" />
        ) : isEmpty ? (
          <DemoEmptyState className="flex h-full items-center justify-center rounded-2xl">
            Empty canvas
          </DemoEmptyState>
        ) : isError ? (
          <DemoErrorState className="flex h-full items-center justify-center rounded-2xl">
            Couldn&apos;t load canvas
          </DemoErrorState>
        ) : (
          <ReactFlowProvider>
            <Canvas
              aria-label="Agent workflow canvas"
              defaultEdges={edges}
              defaultNodes={nodes}
              pattern="dots"
            />
          </ReactFlowProvider>
        )}
      </div>
    </div>
  )
}
