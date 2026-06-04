"use client";

import { Background, ReactFlow, ReactFlowProvider } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import {
  Node,
  NodeAction,
  NodeContent,
  NodeDescription,
  NodeFooter,
  NodeHeader,
  NodeTitle,
} from "@/components/ai-elements/node";

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
  );
}

const nodeTypes = { prompt: PromptNode };

const nodes = [
  {
    id: "prompt-1",
    type: "prompt",
    position: { x: 0, y: 0 },
    data: {},
  },
];

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
  );
}
