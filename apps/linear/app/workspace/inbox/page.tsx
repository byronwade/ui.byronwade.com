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

const INBOX_ITEMS = [
  {
    id: "ENG-142",
    title: "Refactor command palette keyboard navigation",
    statusLabel: "In progress",
    priority: "P2",
    assignee: { name: "Alex Chen", initials: "AC" },
    reason: "Mentioned you",
  },
  {
    id: "ENG-139",
    title: "Ship cycle planning sidebar",
    statusLabel: "Todo",
    priority: "P1",
    assignee: { name: "Sam Rivera", initials: "SR" },
    reason: "Assigned to you",
  },
  {
    id: "AS-29",
    title: "Define product requirements (PRD)",
    statusLabel: "Todo",
    priority: "P2",
    assignee: { name: "Alex Chen", initials: "AC" },
    reason: "Subscribed",
  },
]

const COMMAND_ITEMS = INBOX_ITEMS.map((issue) => ({
  id: issue.id,
  label: issue.title,
  meta: issue.priority,
  group: "Inbox",
}))

export default function InboxPage() {
  const router = useRouter()
  const [commandOpen, setCommandOpen] = React.useState(false)
  const [askOpen, setAskOpen] = React.useState(false)
  const [askValue, setAskValue] = React.useState("")
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
    <>
      <WorkspaceShell
        team="Inbox"
        view="Unread"
        breadcrumbs={[{ label: "Inbox" }]}
        activeNavId="inbox"
        showIssueTabs={false}
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
        <WorkspaceListPanel title="Inbox" count={INBOX_ITEMS.length}>
          {INBOX_ITEMS.map((issue) => (
            <IssueRow
              key={issue.id}
              id={issue.id}
              title={issue.title}
              status={
                <Badge variant="outline" className="font-normal">
                  {issue.reason}
                </Badge>
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
          { id: "nav-my", label: "Go to My issues", group: "Navigation" },
          { id: "nav-settings", label: "Open settings", group: "Navigation" },
        ]}
        onSelect={(id) => {
          if (id === "nav-my") router.push("/workspace/my-issues")
          if (id === "nav-settings") router.push("/settings")
        }}
      />
    </>
  )
}
