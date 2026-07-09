"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import {
  CommandShell,
  IssueRow,
  WorkspaceAskBar,
  WorkspaceAskTrigger,
  WorkspaceListPanel,
  WorkspaceShell,
} from "@/components/linear"
import { Badge } from "@/components/ui/badge"

const MY_ISSUES = [
  {
    id: "ENG-142",
    title: "Refactor command palette keyboard navigation",
    statusLabel: "In progress",
    priority: "P2",
    assignee: { name: "Alex Chen", initials: "AC" },
    tab: "active",
  },
  {
    id: "ENG-118",
    title: "SLA automation rule builder",
    statusLabel: "In progress",
    priority: "P1",
    assignee: { name: "Alex Chen", initials: "AC" },
    tab: "active",
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
    id: "AS-29",
    title: "Define product requirements (PRD)",
    statusLabel: "Todo",
    priority: "P2",
    assignee: { name: "Alex Chen", initials: "AC" },
    tab: "active",
  },
]

const ISSUE_TABS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "backlog", label: "Backlog" },
]

const COMMAND_ITEMS = MY_ISSUES.map((issue) => ({
  id: issue.id,
  label: issue.title,
  meta: issue.priority,
  group: "My issues",
}))

export default function MyIssuesPage() {
  const router = useRouter()
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

  const visibleIssues = MY_ISSUES.filter(
    (issue) => activeTab === "all" || issue.tab === activeTab
  )

  return (
    <>
      <WorkspaceShell
        team="My issues"
        view="Assigned"
        breadcrumbs={[{ label: "My issues" }]}
        activeNavId="my-issues"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        issueTabs={ISSUE_TABS}
        onSearch={() => setCommandOpen(true)}
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
        <WorkspaceListPanel title="Assigned to me" count={visibleIssues.length}>
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
          { id: "nav-inbox", label: "Go to Inbox", group: "Navigation" },
          { id: "nav-settings", label: "Open settings", group: "Navigation" },
        ]}
        onSelect={(id) => {
          if (id === "nav-inbox") router.push("/workspace/inbox")
          if (id === "nav-settings") router.push("/settings")
        }}
      />
    </>
  )
}
