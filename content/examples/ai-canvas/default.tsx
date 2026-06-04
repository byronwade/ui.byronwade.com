"use client";

import { Canvas } from "@/components/ai-elements/canvas";
import { ReactFlowProvider } from "@xyflow/react";

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
];

const edges = [
  { id: "prompt-model", source: "prompt", target: "model" },
  { id: "model-output", source: "model", target: "output" },
];

export default function Example() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <div className="h-[420px] w-full max-w-3xl overflow-hidden rounded-2xl edge">
        <ReactFlowProvider>
          <Canvas
            aria-label="Agent workflow canvas"
            defaultEdges={edges}
            defaultNodes={nodes}
            pattern="dots"
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
