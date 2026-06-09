"use client"

import {
  Task,
  TaskContent,
  TaskItem,
  TaskItemFile,
  TaskTrigger,
} from "@/components/ai-elements/task"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"

function TaskSkeletonRows() {
  return (
    <div className="mt-4 space-y-2 border-l-2 border-muted pl-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-3.5 w-20 rounded" />
        <Skeleton className="h-5 w-28 rounded-md" />
        <Skeleton className="h-3.5 w-24 rounded" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-3.5 w-14 rounded" />
        <Skeleton className="h-5 w-20 rounded-md" />
        <Skeleton className="h-3.5 w-32 rounded" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-3.5 w-18 rounded" />
        <Skeleton className="h-5 w-24 rounded-md" />
        <Skeleton className="h-3.5 w-20 rounded" />
      </div>
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"
  const isSuccess = state === "success"

  if (isEmpty) {
    return (
      <div className="flex min-h-0 items-center justify-center bg-background p-8">
        <div className="w-96">
          <DemoEmptyState>No tasks</DemoEmptyState>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-0 items-center justify-center bg-background p-8">
        <div className="w-96">
          <DemoErrorState>Couldn&apos;t load tasks</DemoErrorState>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-0 items-center justify-center bg-background p-8">
        <Task className="w-96" defaultOpen>
          <TaskTrigger title="Loading tasks…" />
          <TaskSkeletonRows />
        </Task>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-0 items-center justify-center bg-background p-8">
        <Task className="w-96" defaultOpen>
          <TaskTrigger title="All tasks complete" />
          <TaskContent>
            <TaskItem>
              Scanned{" "}
              <TaskItemFile variant="brand">
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
              <TaskItemFile variant="brand">
                <span className="font-mono">tokens.css</span>
              </TaskItemFile>{" "}
              with the new brand accent
            </TaskItem>
          </TaskContent>
        </Task>
      </div>
    )
  }

  // default — mixed statuses (in-progress, done, pending)
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
