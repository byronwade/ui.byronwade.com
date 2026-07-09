"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { LayoutGrid, Plus } from "lucide-react"

import {
  WorkspaceFooterActions,
  WorkspaceListPanel,
  WorkspaceShell,
} from "@/components/linear/workspace-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type CustomView = {
  id: string
  name: string
  filters: string
  owner: string
  shared?: boolean
}

const VIEWS: CustomView[] = [
  {
    id: "high-priority",
    name: "High priority",
    filters: "Priority is Urgent or High · Status is not Done",
    owner: "Alex Smith",
    shared: true,
  },
  {
    id: "my-bugs",
    name: "My bugs",
    filters: "Assignee is me · Label is Bug",
    owner: "You",
  },
  {
    id: "cycle-24",
    name: "Cycle 24 carryover",
    filters: "Cycle is Cycle 24 · Status is In progress or Todo",
    owner: "Jordan Lee",
    shared: true,
  },
  {
    id: "customer-requests",
    name: "Customer requests",
    filters: "Label is Customer · Created in last 30 days",
    owner: "Sam Rivera",
    shared: true,
  },
  {
    id: "blocked",
    name: "Blocked issues",
    filters: "Status is Blocked · Team is AS Mobbin",
    owner: "You",
  },
]

function ViewRow({ view }: { view: CustomView }) {
  return (
    <div
      data-slot="linear-view-row"
      role="listitem"
      className="flex items-center gap-3 border-b border-border px-4 py-2.5 last:border-b-0"
    >
      <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted/30 text-muted-foreground">
        <LayoutGrid className="size-3.5" />
      </span>
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-medium text-foreground">
            {view.name}
          </p>
          {view.shared ? (
            <Badge variant="secondary" className="font-normal">
              Shared
            </Badge>
          ) : null}
        </div>
        <p className="truncate text-xs text-muted-foreground">{view.filters}</p>
      </div>
      <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
        {view.owner}
      </span>
    </div>
  )
}

export default function AsMobbinViewsPage() {
  const router = useRouter()

  return (
    <WorkspaceShell
      team="AS Mobbin"
      view="Views"
      activeNavId="as-mobbin-views"
      showIssueTabs={false}
      onSearch={() => router.push("/workspace/search")}
      headerActions={
        <Button size="sm">
          <Plus className="size-4" />
          <span className="hidden sm:inline">New view</span>
        </Button>
      }
      footer={
        <WorkspaceFooterActions
          onAsk={() => router.push("/workspace/ask")}
          onHistory={() => router.push("/workspace/ask")}
        />
      }
    >
      <WorkspaceListPanel title="Custom views" count={VIEWS.length}>
        {VIEWS.map((view) => (
          <ViewRow key={view.id} view={view} />
        ))}
      </WorkspaceListPanel>
    </WorkspaceShell>
  )
}
