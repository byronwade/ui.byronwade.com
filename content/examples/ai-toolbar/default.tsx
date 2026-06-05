"use client"

import {
  Background,
  Position,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react"
import { Button } from "@/components/ui/button"
import { Toolbar } from "@/components/ai-elements/toolbar"
import {
  Node,
  NodeContent,
  NodeDescription,
  NodeHeader,
  NodeTitle,
} from "@/components/ai-elements/node"

function PromptNode() {
  return (
    <>
      <Toolbar isVisible orientation="horizontal" position={Position.Top}>
        <Button size="sm" variant="ghost">
          Run
        </Button>
        <Button size="sm" variant="ghost">
          Duplicate
        </Button>
        <Button size="sm" variant="ghost">
          Delete
        </Button>
      </Toolbar>
      <Node handles={{ target: false, source: true }}>
        <NodeHeader>
          <NodeTitle>Prompt</NodeTitle>
          <NodeDescription>Hover actions live in the toolbar</NodeDescription>
        </NodeHeader>
        <NodeContent>
          <p className="text-sm text-muted-foreground">
            Summarize the incoming support ticket and classify its urgency.
          </p>
        </NodeContent>
      </Node>
    </>
  )
}

const nodeTypes = { prompt: PromptNode }

const nodes = [
  {
    id: "prompt-1",
    type: "prompt",
    position: { x: 0, y: 0 },
    data: {},
  },
]

export default function Example() {
  return (
    <div className="h-[420px] w-full bg-background">
      <ReactFlowProvider>
        <ReactFlow
          fitView
          nodes={nodes}
          nodeTypes={nodeTypes}
          proOptions={{ hideAttribution: true }}
        >
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  )
}
