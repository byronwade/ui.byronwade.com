"use client"

import { Connection } from "@/components/ai-elements/connection"
import {
  Background,
  Handle,
  type Node,
  type NodeProps,
  Position,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

function StepNode({ data }: NodeProps) {
  return (
    <div className="rounded-lg bg-card px-4 py-3 text-card-foreground edge">
      <Handle className="!bg-ring" position={Position.Left} type="target" />
      <p className="text-sm font-medium">{String(data.label)}</p>
      <p className="font-mono text-xs text-muted-foreground">
        {String(data.id)}
      </p>
      <Handle className="!bg-ring" position={Position.Right} type="source" />
    </div>
  )
}

const nodeTypes = { step: StepNode }

const nodes: Node[] = [
  {
    id: "plan",
    type: "step",
    position: { x: 0, y: 60 },
    data: { label: "Plan", id: "step-01" },
  },
  {
    id: "build",
    type: "step",
    position: { x: 260, y: 60 },
    data: { label: "Build", id: "step-02" },
  },
]

export default function Example() {
  return (
    <div className="h-96 w-full overflow-hidden rounded-2xl bg-background edge">
      <ReactFlowProvider>
        <ReactFlow
          connectionLineComponent={Connection}
          defaultEdges={[]}
          fitView
          nodeTypes={nodeTypes}
          nodes={nodes}
          proOptions={{ hideAttribution: true }}
        >
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  )
}
