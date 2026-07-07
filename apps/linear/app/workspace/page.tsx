"use client"

import * as React from "react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CommandShell,
  CyclePanel,
  IssueRow,
} from "@/components/linear"
import { Search } from "lucide-react"

const ISSUES = [
  {
    id: "ENG-142",
    title: "Refactor command palette keyboard navigation",
    statusLabel: "In progress",
    priority: "P2",
    assignee: { name: "Alex Chen", initials: "AC" },
  },
  {
    id: "ENG-139",
    title: "Ship cycle planning sidebar",
    statusLabel: "Todo",
    priority: "P1",
    assignee: { name: "Sam Rivera", initials: "SR" },
  },
  {
    id: "ENG-128",
    title: "Agent activity timeline polish",
    statusLabel: "Done",
    priority: "P3",
    assignee: { name: "Jordan Lee", initials: "JL" },
  },
  {
    id: "ENG-121",
    title: "Issue list virtualisation for 10k+ rows",
    statusLabel: "Backlog",
    priority: "P2",
    assignee: { name: "Alex Chen", initials: "AC" },
  },
]

const COMMAND_ITEMS = ISSUES.map((issue) => ({
  id: issue.id,
  label: issue.title,
  meta: issue.priority,
  group: "Issues",
}))

export default function WorkspacePage() {
  const [commandOpen, setCommandOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<Record<string, boolean>>({})

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setCommandOpen(true)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Linear UI
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm text-foreground">Workspace</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCommandOpen(true)}
            >
              <Search className="size-4" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:inline">
                ⌘K
              </kbd>
            </Button>
            <Badge variant="outline">Cycle 24</Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-4">
          <CyclePanel
            name="Cycle 24"
            dateRange="Mar 3 – Mar 17"
            issueCount={12}
            progress={68}
          />
          <CyclePanel
            name="Cycle 25"
            dateRange="Mar 18 – Mar 31"
            issueCount={4}
            progress={12}
          />
        </aside>

        <section className="overflow-hidden rounded-lg border border-border bg-card shadow-none">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <h1 className="text-sm font-medium tracking-tight">Active issues</h1>
            <span className="font-mono text-xs text-muted-foreground">
              {ISSUES.length} items
            </span>
          </div>
          <div role="list">
            {ISSUES.map((issue) => (
              <IssueRow
                key={issue.id}
                {...issue}
                selected={selected[issue.id] ?? false}
                onSelectedChange={(value) =>
                  setSelected((prev) => ({ ...prev, [issue.id]: value }))
                }
                onActivate={() => setCommandOpen(true)}
              />
            ))}
          </div>
        </section>
      </main>

      <CommandShell
        open={commandOpen}
        onOpenChange={setCommandOpen}
        items={[
          ...COMMAND_ITEMS,
          {
            id: "act-new",
            label: "Create issue",
            group: "Actions",
          },
          {
            id: "act-cycle",
            label: "Start new cycle",
            group: "Actions",
          },
        ]}
        onSelect={(id) => {
          console.log("selected", id)
        }}
      />
    </div>
  )
}
