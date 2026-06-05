"use client"

import { Controls } from "@/components/ai-elements/controls"
import { Background, ReactFlow, type Edge, type Node } from "@xyflow/react"
import "@xyflow/react/dist/style.css"

const nodes: Node[] = [
  {
    id: "prompt",
    position: { x: 0, y: 0 },
    data: { label: "Prompt" },
  },
  {
    id: "model",
    position: { x: 220, y: 80 },
    data: { label: "Model" },
  },
]

const edges: Edge[] = [
  { id: "prompt-model", source: "prompt", target: "model" },
]

export default function Example() {
  return (
    <div className="flex min-h-0 items-center justify-center bg-background p-8">
      <div className="h-80 w-full max-w-2xl overflow-hidden rounded-md border border-border bg-card">
        <ReactFlow defaultEdges={edges} defaultNodes={nodes} fitView>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  )
}
