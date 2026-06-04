"use client";

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
} from "@/components/ai-elements/queue";
import { ListTodoIcon, PencilIcon, TrashIcon } from "lucide-react";

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
];

export default function Example() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <Queue className="w-96">
        <QueueSection defaultOpen>
          <QueueSectionTrigger>
            <QueueSectionLabel
              count={todos.length}
              label="queued tasks"
              icon={<ListTodoIcon className="size-4" />}
            />
          </QueueSectionTrigger>
          <QueueSectionContent>
            <QueueList>
              {todos.map((todo) => {
                const completed = todo.status === "completed";
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
                    {todo.id === "2" ? (
                      <QueueItemAttachment>
                        <QueueItemFile>gateway.config.ts</QueueItemFile>
                      </QueueItemAttachment>
                    ) : null}
                  </QueueItem>
                );
              })}
            </QueueList>
          </QueueSectionContent>
        </QueueSection>
      </Queue>
    </div>
  );
}
