import { ReactFlow, Background, ReactFlowProvider } from "@xyflow/react";
import { Panel } from "@/components/ai-elements/panel";
import "@xyflow/react/dist/style.css";

export default function Example() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <div className="h-96 w-full max-w-2xl overflow-hidden rounded-lg">
        <ReactFlowProvider>
          <ReactFlow nodes={[]} edges={[]} fitView>
            <Background />
            <Panel position="top-left">
              <div className="flex items-center gap-2 px-2 py-1">
                <span className="text-sm font-medium text-foreground">
                  Workflow
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  4 nodes
                </span>
              </div>
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
  );
}
