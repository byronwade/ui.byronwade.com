"use client"

// Board archetype, a horizontally-scrolling Kanban with WIP columns.
// uses: Badge, GradientAvatar, StatusDot, Button, InputGroup, FilterPill, ScrollArea
import * as React from "react"
import {
  ChevronDown,
  Filter,
  MessageSquare,
  Paperclip,
  Plus,
  Search,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FilterPill } from "@/components/ui/filter-pill"
import { GradientAvatar } from "@/components/ui/gradient-avatar"
import { StatusDot, type StatusTone } from "@/components/ui/status-dot"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

type Priority = "Low" | "Med" | "High" | "Urgent"

interface Card {
  id: string
  title: string
  labels: {
    text: string
    variant: "secondary" | "success" | "warning" | "destructive"
  }[]
  assignee: string
  priority: Priority
  comments: number
  files: number
}

interface Column {
  id: string
  name: string
  tone: StatusTone
  limit?: number
  cards: Card[]
}

const priorityTone: Record<Priority, StatusTone> = {
  Low: "neutral",
  Med: "info",
  High: "warning",
  Urgent: "danger",
}

const columns: Column[] = [
  {
    id: "backlog",
    name: "Backlog",
    tone: "neutral",
    cards: [
      {
        id: "ATL-241",
        title: "Audit color tokens for AA contrast in dark mode",
        labels: [{ text: "a11y", variant: "secondary" }],
        assignee: "marlow",
        priority: "Med",
        comments: 2,
        files: 0,
      },
      {
        id: "ATL-238",
        title: "Spike: virtualized table for 50k rows",
        labels: [
          { text: "spike", variant: "secondary" },
          { text: "perf", variant: "warning" },
        ],
        assignee: "june",
        priority: "Low",
        comments: 0,
        files: 1,
      },
      {
        id: "ATL-233",
        title: "Draft empty-state illustrations",
        labels: [{ text: "design", variant: "secondary" }],
        assignee: "ada",
        priority: "Low",
        comments: 5,
        files: 3,
      },
    ],
  },
  {
    id: "progress",
    name: "In progress",
    tone: "info",
    limit: 3,
    cards: [
      {
        id: "ATL-219",
        title: "Migrate auth flow to passkeys",
        labels: [
          { text: "auth", variant: "secondary" },
          { text: "P1", variant: "destructive" },
        ],
        assignee: "ravi",
        priority: "Urgent",
        comments: 8,
        files: 2,
      },
      {
        id: "ATL-227",
        title: "Command palette fuzzy ranking",
        labels: [{ text: "feature", variant: "success" }],
        assignee: "june",
        priority: "High",
        comments: 3,
        files: 0,
      },
    ],
  },
  {
    id: "review",
    name: "In review",
    tone: "warning",
    cards: [
      {
        id: "ATL-205",
        title: "Floating dock collision avoidance",
        labels: [{ text: "nav", variant: "secondary" }],
        assignee: "marlow",
        priority: "High",
        comments: 12,
        files: 4,
      },
      {
        id: "ATL-211",
        title: "Reduce bundle: tree-shake icon set",
        labels: [{ text: "perf", variant: "warning" }],
        assignee: "ada",
        priority: "Med",
        comments: 1,
        files: 1,
      },
    ],
  },
  {
    id: "done",
    name: "Done",
    tone: "success",
    cards: [
      {
        id: "ATL-198",
        title: "Token-driven chart theming",
        labels: [{ text: "charts", variant: "success" }],
        assignee: "ravi",
        priority: "Med",
        comments: 4,
        files: 0,
      },
      {
        id: "ATL-186",
        title: "Sheet + Drawer parity pass",
        labels: [{ text: "overlays", variant: "secondary" }],
        assignee: "june",
        priority: "Low",
        comments: 2,
        files: 2,
      },
      {
        id: "ATL-180",
        title: "Keyboard nav for menus",
        labels: [{ text: "a11y", variant: "secondary" }],
        assignee: "ada",
        priority: "Med",
        comments: 6,
        files: 0,
      },
    ],
  },
]

const team = ["ravi", "june", "ada", "marlow"]

export function BoardArchetype() {
  return (
    <div className="flex h-dvh flex-col bg-background text-foreground">
      <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border px-4">
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium tracking-tight transition-colors hover:bg-muted"
        >
          <span className="grid size-5 place-items-center rounded-md bg-brand/15 text-[10px] font-medium text-brand">
            A
          </span>
          Atlas redesign
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>

        <div className="hidden w-full max-w-xs sm:block">
          <InputGroup>
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search issues…" />
          </InputGroup>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-1.5">
            {team.map((m) => (
              <GradientAvatar
                key={m}
                seed={m}
                size="sm"
                className="ring-2 ring-background"
              />
            ))}
          </div>
          <Button size="sm">
            <Plus data-icon="inline-start" />
            New
          </Button>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-medium tracking-tight">Sprint 24</h1>
          <Badge variant="secondary">10 issues</Badge>
        </div>
        <div className="flex items-center gap-2">
          <FilterPill icon={<Filter className="size-3.5" />}>
            Assignee
          </FilterPill>
          <FilterPill>Label</FilterPill>
          <FilterPill>Priority</FilterPill>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-x-auto">
        <div className="flex h-full min-w-max gap-4 p-4">
          {columns.map((col) => (
            <section key={col.id} className="flex w-80 shrink-0 flex-col">
              <div className="mb-2 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <StatusDot tone={col.tone} />
                  <span className="text-sm font-medium tracking-tight">
                    {col.name}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {col.cards.length}
                    {col.limit ? ` / ${col.limit}` : ""}
                  </span>
                </div>
                <button
                  type="button"
                  aria-label={`Add to ${col.name}`}
                  className="grid size-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Plus className="size-4" />
                </button>
              </div>

              <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto rounded-2xl bg-muted/30 p-2">
                {col.cards.map((card) => (
                  <article
                    key={card.id}
                    className="edge group cursor-grab space-y-2.5 overflow-hidden rounded-xl bg-card p-3 active:cursor-grabbing"
                  >
                    <div className="flex flex-wrap items-center gap-1.5">
                      {card.labels.map((l) => (
                        <Badge
                          key={l.text}
                          variant={l.variant}
                          className="px-1.5 py-0 text-[10px]"
                        >
                          {l.text}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm leading-snug font-medium">
                      {card.title}
                    </p>
                    <div className="flex items-center justify-between pt-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="flex items-center gap-1"
                          title={`${card.priority} priority`}
                        >
                          <StatusDot tone={priorityTone[card.priority]} />
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {card.id}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-muted-foreground">
                        {card.comments > 0 && (
                          <span className="flex items-center gap-1 text-[11px]">
                            <MessageSquare className="size-3.5" />
                            {card.comments}
                          </span>
                        )}
                        {card.files > 0 && (
                          <span className="flex items-center gap-1 text-[11px]">
                            <Paperclip className="size-3.5" />
                            {card.files}
                          </span>
                        )}
                        <GradientAvatar seed={card.assignee} size="sm" />
                      </div>
                    </div>
                  </article>
                ))}
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-left text-xs font-medium text-muted-foreground",
                    "transition-colors hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Plus className="size-3.5" />
                  Add card
                </button>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
