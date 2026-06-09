"use client"

import {
  Queue,
  QueueSection,
  QueueSectionTrigger,
  QueueSectionLabel,
  QueueSectionContent,
  QueueList,
  QueueItem,
  QueueItemIndicator,
  QueueItemContent,
  QueueItemDescription,
  QueueItemActions,
  QueueItemAction,
  QueueItemAttachment,
  QueueItemFile,
} from "@/components/ai-elements/queue"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { ListTodoIcon, PencilIcon, TrashIcon } from "lucide-react"

const todos = [
  {
    id: "1",
    title: "Audit the authentication flow",
    description: "Check token refresh and session handling",
    status: "completed" as const,
  },
  {
    id: "2",
    title: "Add rate limiting to the API gateway",
    description: "100 requests / minute per key",
    status: "pending" as const,
  },
  {
    id: "3",
    title: "Wire up the streaming response parser",
    status: "pending" as const,
  },
]

const doneTodos = [
  {
    id: "1",
    title: "Audit the authentication flow",
    description: "Check token refresh and session handling",
    status: "completed" as const,
  },
  {
    id: "2",
    title: "Add rate limiting to the API gateway",
    description: "100 requests / minute per key",
    status: "completed" as const,
  },
  {
    id: "3",
    title: "Wire up the streaming response parser",
    status: "completed" as const,
  },
]

function QueueSkeletonRows() {
  return (
    <div className="-mb-1 mt-2" aria-hidden="true">
      <div className="max-h-40 space-y-1 pr-4">
        {[
          { titleW: "w-48", descW: "w-36", hasDesc: true },
          { titleW: "w-56", descW: "w-44", hasDesc: true },
          { titleW: "w-40", descW: null, hasDesc: false },
        ].map((row, i) => (
          <div key={i} className="flex flex-col gap-1 rounded-md px-3 py-1">
            <div className="flex items-center gap-2">
              <Skeleton className="mt-0.5 size-2.5 shrink-0 rounded-full" />
              <Skeleton className={`h-3.5 ${row.titleW} rounded`} />
            </div>
            {row.hasDesc && (
              <Skeleton className={`ml-6 h-3 ${row.descW} rounded`} />
            )}
          </div>
        ))}
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

  const items = isSuccess ? doneTodos : todos

  if (isEmpty) {
    return (
      <div className="flex min-h-0 items-center justify-center bg-background p-8">
        <div className="w-96">
          <DemoEmptyState>Queue is empty</DemoEmptyState>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-0 items-center justify-center bg-background p-8">
        <div className="w-96">
          <DemoErrorState>Couldn't load queue</DemoErrorState>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 items-center justify-center bg-background p-8">
      <Queue className="w-96" aria-busy={isLoading}>
        <QueueSection defaultOpen>
          <QueueSectionTrigger>
            {isLoading ? (
              <div className="flex items-center gap-2 py-0.5">
                <Skeleton className="size-4 rounded" />
                <Skeleton className="h-4 w-32 rounded" />
              </div>
            ) : (
              <QueueSectionLabel
                count={items.length}
                label="queued tasks"
                icon={<ListTodoIcon className="size-4" />}
              />
            )}
          </QueueSectionTrigger>
          <QueueSectionContent>
            {isLoading ? (
              <QueueSkeletonRows />
            ) : (
              <QueueList>
                {items.map((todo) => {
                  const completed = todo.status === "completed"
                  return (
                    <QueueItem key={todo.id}>
                      <div className="flex items-start gap-2">
                        <QueueItemIndicator completed={completed} />
                        <QueueItemContent completed={completed}>
                          {todo.title}
                        </QueueItemContent>
                        <QueueItemActions>
                          <QueueItemAction aria-label="Edit task">
                            <PencilIcon className="size-3.5" />
                          </QueueItemAction>
                          <QueueItemAction aria-label="Remove task">
                            <TrashIcon className="size-3.5" />
                          </QueueItemAction>
                        </QueueItemActions>
                      </div>
                      {todo.description ? (
                        <QueueItemDescription completed={completed}>
                          {todo.description}
                        </QueueItemDescription>
                      ) : null}
                      {todo.id === "2" && !completed ? (
                        <QueueItemAttachment>
                          <QueueItemFile>gateway.config.ts</QueueItemFile>
                        </QueueItemAttachment>
                      ) : null}
                    </QueueItem>
                  )
                })}
              </QueueList>
            )}
          </QueueSectionContent>
        </QueueSection>
      </Queue>
    </div>
  )
}
