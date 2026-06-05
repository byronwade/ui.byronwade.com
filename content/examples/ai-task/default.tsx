"use client"

import {
  Task,
  TaskContent,
  TaskItem,
  TaskItemFile,
  TaskTrigger,
} from "@/components/ai-elements/task"

export default function Example() {
  return (
    <div className="flex min-h-0 items-center justify-center bg-background p-8">
      <Task className="w-96" defaultOpen>
        <TaskTrigger title="Searching the codebase" />
        <TaskContent>
          <TaskItem>
            Scanned{" "}
            <TaskItemFile>
              <span className="font-mono">registry/ui/button.tsx</span>
            </TaskItemFile>{" "}
            for variant definitions
          </TaskItem>
          <TaskItem>
            Read{" "}
            <TaskItemFile variant="brand">
              <span className="font-mono">lib/utils.ts</span>
            </TaskItemFile>{" "}
            to resolve the <code className="font-mono">cn()</code> helper
          </TaskItem>
          <TaskItem>
            Updated{" "}
            <TaskItemFile variant="muted">
              <span className="font-mono">tokens.css</span>
            </TaskItemFile>{" "}
            with the new brand accent
          </TaskItem>
        </TaskContent>
      </Task>
    </div>
  )
}
