"use client"

import * as React from "react"
import {
  Check,
  Circle,
  CircleDashed,
  GripVertical,
  Plus,
  X,
} from "lucide-react"

import {
  SettingsPageIntro,
  SettingsShell,
} from "@/components/linear/settings-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type StatusGroup = {
  id: string
  label: string
  items: Array<{
    id: string
    name: string
    description?: string
    projects?: string
    icon: React.ReactNode
  }>
}

const INITIAL_GROUPS: StatusGroup[] = [
  {
    id: "backlog",
    label: "Backlog",
    items: [
      {
        id: "backlog",
        name: "Backlog",
        projects: "1 project",
        icon: <CircleDashed className="size-4 text-warning" />,
      },
    ],
  },
  {
    id: "planned",
    label: "Planned",
    items: [
      {
        id: "planned",
        name: "Planned",
        icon: <Circle className="size-4 text-muted-foreground" />,
      },
    ],
  },
  {
    id: "progress",
    label: "In Progress",
    items: [
      {
        id: "progress",
        name: "In Progress",
        projects: "2 projects",
        icon: <Circle className="size-4 fill-warning/30 text-warning" />,
      },
    ],
  },
  {
    id: "completed",
    label: "Completed",
    items: [
      {
        id: "completed",
        name: "Completed",
        icon: <Check className="size-4 text-brand" />,
      },
    ],
  },
  {
    id: "canceled",
    label: "Canceled",
    items: [
      {
        id: "canceled",
        name: "Canceled",
        icon: <X className="size-4 text-muted-foreground" />,
      },
    ],
  },
]

export default function ProjectStatusesPage() {
  const [creating, setCreating] = React.useState(true)
  const [name, setName] = React.useState("Up Next")
  const [description, setDescription] = React.useState(
    "Prioritized, but not yet active"
  )

  return (
    <SettingsShell title="Project statuses" activeId="project-statuses" wide>
      <SettingsPageIntro
        title="Project statuses"
        description="Project statuses define the workflow that projects go through from start to completion."
      />

      <div
        data-slot="linear-status-board"
        className="overflow-hidden rounded-lg border border-border bg-card"
      >
        {INITIAL_GROUPS.map((group, groupIndex) => (
          <div key={group.id}>
            <div
              data-slot="linear-status-group-header"
              className="flex items-center justify-between border-b border-border bg-muted/20 px-4 py-2"
            >
              <span className="text-xs font-medium">{group.label}</span>
              <button
                type="button"
                className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/30"
                aria-label={`Add status to ${group.label}`}
              >
                <Plus className="size-3.5" />
              </button>
            </div>

            {group.id === "planned" && creating ? (
              <div
                data-slot="linear-status-create-row"
                className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3"
              >
                <GripVertical className="size-4 text-muted-foreground/60" />
                <Circle className="size-4 text-muted-foreground" />
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="h-8 w-28"
                />
                <Input
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Description…"
                  className="h-8 min-w-[180px] flex-1"
                />
                <div className="ml-auto flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setCreating(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => setCreating(false)}>
                    Create
                  </Button>
                </div>
              </div>
            ) : null}

            {group.items.map((item, itemIndex) => (
              <div
                key={item.id}
                data-slot="linear-status-row"
                className={cn(
                  "flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0",
                  groupIndex === INITIAL_GROUPS.length - 1 &&
                    itemIndex === group.items.length - 1 &&
                    "border-b-0"
                )}
              >
                <span className="w-4" aria-hidden />
                {item.icon}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  {item.description ? (
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  ) : null}
                </div>
                {item.projects ? (
                  <span className="text-xs text-muted-foreground">{item.projects}</span>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </SettingsShell>
  )
}
