"use client"

import * as React from "react"

import {
  CommandShell,
  CyclePanel,
  IssueRow,
  WorkspaceAskBar,
  WorkspaceAskTrigger,
  WorkspaceListPanel,
  WorkspaceShell,
} from "@/components/linear"
import { Badge } from "@/components/ui/badge"

const ISSUES = [
  {
    id: "ENG-142",
    title: "Refactor command palette keyboard navigation",
    statusLabel: "In progress",
    priority: "P2",
    assignee: { name: "Alex Chen", initials: "AC" },
    tab: "active",
  },
  {
    id: "ENG-139",
    title: "Ship cycle planning sidebar",
    statusLabel: "Todo",
    priority: "P1",
    assignee: { name: "Sam Rivera", initials: "SR" },
    tab: "active",
  },
  {
    id: "ENG-128",
    title: "Agent activity timeline polish",
    statusLabel: "Done",
    priority: "P3",
    assignee: { name: "Jordan Lee", initials: "JL" },
    tab: "all",
  },
  {
    id: "ENG-121",
    title: "Issue list virtualisation for 10k+ rows",
    statusLabel: "Backlog",
    priority: "P2",
    assignee: { name: "Alex Chen", initials: "AC" },
    tab: "backlog",
  },
  {
    id: "ENG-118",
    title: "SLA automation rule builder",
    statusLabel: "In progress",
    priority: "P1",
    assignee: { name: "Sam Rivera", initials: "SR" },
    tab: "active",
  },
  {
    id: "ENG-115",
    title: "Project status color picker",
    statusLabel: "Todo",
    priority: "P2",
    assignee: { name: "Jordan Lee", initials: "JL" },
    tab: "backlog",
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
  const [askOpen, setAskOpen] = React.useState(false)
  const [askValue, setAskValue] = React.useState("")
  const [activeTab, setActiveTab] = React.useState("all")
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

  const visibleIssues = ISSUES.filter(
    (issue) => activeTab === "all" || issue.tab === activeTab
  )

  return (
    <>
      <WorkspaceShell
        team="Engineering"
        view="Cycle 24"
        activeNavId="engineering"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSearch={() => setCommandOpen(true)}
        secondary={
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Cycles</p>
              <CyclePanel
                name="Cycle 24"
                dateRange="Mar 3 – Mar 17"
                issueCount={12}
                progress={68}
                footer={
                  <Badge variant="outline" className="font-normal">
                    Current
                  </Badge>
                }
              />
              <CyclePanel
                name="Cycle 25"
                dateRange="Mar 18 – Mar 31"
                issueCount={4}
                progress={12}
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Quick filters</p>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary">Assigned to me</Badge>
                <Badge variant="outline">High priority</Badge>
                <Badge variant="outline">Blocked</Badge>
              </div>
            </div>
          </div>
        }
        footer={
          askOpen ? (
            <WorkspaceAskBar
              value={askValue}
              onChange={setAskValue}
              onSubmit={() => {
                setAskValue("")
                setAskOpen(false)
              }}
            />
          ) : (
            <WorkspaceAskTrigger onClick={() => setAskOpen(true)} />
          )
        }
      >
        <WorkspaceListPanel title="Active issues" count={visibleIssues.length}>
          {visibleIssues.map((issue) => (
            <IssueRow
              key={issue.id}
              id={issue.id}
              title={issue.title}
              status={
                issue.statusLabel === "In progress" ? (
                  <Badge variant="outline" className="gap-1.5 font-normal">
                    <span className="size-1.5 rounded-full bg-warning" />
                    {issue.statusLabel}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="font-normal">
                    {issue.statusLabel}
                  </Badge>
                )
              }
              priority={issue.priority}
              assignee={issue.assignee}
              selected={selected[issue.id] ?? false}
              onSelectedChange={(value) =>
                setSelected((prev) => ({ ...prev, [issue.id]: value }))
              }
              onActivate={() => setCommandOpen(true)}
            />
          ))}
        </WorkspaceListPanel>
      </WorkspaceShell>

      <CommandShell
        open={commandOpen}
        onOpenChange={setCommandOpen}
        items={[
          ...COMMAND_ITEMS,
          { id: "act-new", label: "Create issue", group: "Actions" },
          { id: "act-cycle", label: "Start new cycle", group: "Actions" },
          { id: "nav-settings", label: "Open settings", group: "Navigation" },
        ]}
        onSelect={(id) => {
          if (id === "nav-settings") {
            window.location.assign("/linear/settings")
          }
        }}
      />
    </>
  )
}
