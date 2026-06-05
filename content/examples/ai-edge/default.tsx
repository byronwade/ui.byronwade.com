"use client"

import { Edge } from "@/components/ai-elements/edge"
import {
  Background,
  type EdgeTypes,
  Handle,
  type Node,
  type NodeProps,
  Position,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

const edgeTypes: EdgeTypes = {
  animated: Edge.Animated,
  temporary: Edge.Temporary,
}

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
    position: { x: 0, y: 40 },
    data: { label: "Plan", id: "step-01" },
  },
  {
    id: "build",
    type: "step",
    position: { x: 240, y: 40 },
    data: { label: "Build", id: "step-02" },
  },
  {
    id: "ship",
    type: "step",
    position: { x: 480, y: 40 },
    data: { label: "Ship", id: "step-03" },
  },
]

const edges = [
  { id: "plan-build", source: "plan", target: "build", type: "animated" },
  { id: "build-ship", source: "build", target: "ship", type: "temporary" },
]

export default function Example() {
  return (
    <div className="h-96 w-full overflow-hidden rounded-2xl bg-background edge">
      <ReactFlowProvider>
        <ReactFlow
          edgeTypes={edgeTypes}
          edges={edges}
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
