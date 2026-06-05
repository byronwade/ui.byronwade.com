"use client"

import { useState } from "react"

import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/ui/kanban"

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

export default function Example() {
  const [data, setData] = useState<Task[]>(initialData)

  return (
    <div className="h-96 w-full">
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
    </div>
  )
}
