"use client"

import { useState } from "react"

import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { Skeleton } from "@/components/ui/skeleton"
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/ui/kanban"
import { useDemoState } from "@/lib/demo-viewport"

const columns = [
  { id: "todo", name: "To do" },
  { id: "in-progress", name: "In progress" },
  { id: "done", name: "Done" },
]

type Task = {
  id: string
  name: string
  column: string
  owner: string
}

const initialData: Task[] = [
  { id: "1", name: "Draft design tokens", column: "todo", owner: "Avery" },
  { id: "2", name: "Wire up the registry", column: "todo", owner: "Jordan" },
  {
    id: "3",
    name: "Build the kanban board",
    column: "in-progress",
    owner: "Riley",
  },
  { id: "4", name: "Ship the dark theme", column: "done", owner: "Sam" },
]

// Skeleton layout mirrors the real board: 3 columns, same card counts as initialData
const skeletonColumns = [
  { id: "todo", cardCount: 2 },
  { id: "in-progress", cardCount: 1 },
  { id: "done", cardCount: 1 },
]

function KanbanSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="grid size-full auto-cols-fr grid-flow-col gap-4"
    >
      {skeletonColumns.map((col) => (
        <div
          key={col.id}
          className="flex size-full min-h-40 flex-col divide-y divide-edge overflow-hidden rounded-xl edge bg-secondary"
        >
          {/* Header */}
          <div className="p-2">
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          {/* Cards */}
          <div className="flex flex-col gap-2 p-2">
            {Array.from({ length: col.cardCount }, (_, i) => (
              <div
                key={i}
                className="rounded-md bg-card p-3 edge ring-1 ring-border/40"
              >
                <Skeleton className="mb-1.5 h-3.5 w-4/5 rounded" />
                <Skeleton className="h-3 w-1/3 rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Example() {
  const [data, setData] = useState<Task[]>(initialData)
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  return (
    <div aria-busy={isLoading} data-state={state} className="h-96 w-full">
      {isLoading ? (
        <KanbanSkeleton />
      ) : isError ? (
        <DemoErrorState className="h-full flex flex-col justify-center">
          Couldn&apos;t load board
        </DemoErrorState>
      ) : isEmpty ? (
        <div className="grid size-full auto-cols-fr grid-flow-col gap-4">
          {columns.map((col) => (
            <div
              key={col.id}
              className="flex size-full min-h-40 flex-col overflow-hidden rounded-xl edge bg-secondary"
            >
              <div className="p-2">
                <span className="font-medium text-sm text-foreground">
                  {col.name}
                </span>
              </div>
              <div className="flex-1 p-2">
                <DemoEmptyState className="h-full flex items-center justify-center">
                  No tasks
                </DemoEmptyState>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <KanbanProvider columns={columns} data={data} onDataChange={setData}>
          {(column) => (
            <KanbanBoard id={column.id} key={column.id}>
              <KanbanHeader>{column.name}</KanbanHeader>
              <KanbanCards id={column.id}>
                {(task: Task) => (
                  <KanbanCard
                    column={task.column}
                    id={task.id}
                    key={task.id}
                    name={task.name}
                  >
                    <p className="m-0 font-medium text-sm text-foreground">
                      {task.name}
                    </p>
                    <p className="m-0 font-mono text-xs text-muted-foreground">
                      {task.owner}
                    </p>
                  </KanbanCard>
                )}
              </KanbanCards>
            </KanbanBoard>
          )}
        </KanbanProvider>
      )}
    </div>
  )
}
