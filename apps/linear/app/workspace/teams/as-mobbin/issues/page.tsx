"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import {
  BacklogIssueRow,
  BacklogSection,
} from "@/components/linear/backlog-issue-row"
import {
  WorkspaceFooterActions,
  WorkspaceShell,
} from "@/components/linear/workspace-shell"

const BACKLOG_ISSUES = [
  {
    id: "AS-29",
    title: "Define product requirements (PRD)",
    project: "AI UX Research Assistant",
    date: "Apr 1",
    assigneeInitials: "AM",
  },
  {
    id: "AS-27",
    title: "Explore current user behavior analytics solutions",
    project: "AI UX Research Assistant",
    date: "Apr 1",
    assigneeInitials: "AM",
  },
  {
    id: "AS-28",
    title: "Explore competitor analytics dashboards",
    project: "AI UX Research Assistant",
    date: "Apr 1",
    assigneeInitials: "AM",
  },
  {
    id: "AS-26",
    title: "Define success metrics & KPIs",
    project: "AI UX Research Assistant",
    date: "Apr 1",
    assigneeInitials: "AM",
  },
]

const ISSUE_TABS = [
  {
    id: "all",
    label: "All issues",
    href: "/workspace/teams/as-mobbin/issues?view=all",
  },
  {
    id: "active",
    label: "Active",
    href: "/workspace/teams/as-mobbin/issues?view=active",
  },
  {
    id: "backlog",
    label: "Backlog",
    href: "/workspace/teams/as-mobbin/issues",
  },
]

export default function AsMobbinIssuesPage() {
  const router = useRouter()

  return (
    <WorkspaceShell
      team="AS Mobbin"
      view="Issues"
      activeNavId="as-mobbin-issues"
      activeTab="backlog"
      issueTabs={ISSUE_TABS}
      showIssueTabs
      onSearch={() => router.push("/workspace/search?q=design")}
      footer={
        <WorkspaceFooterActions
          onAsk={() => router.push("/workspace/ask")}
          onHistory={() => router.push("/workspace/ask")}
        />
      }
    >
      <BacklogSection title="Backlog" count={BACKLOG_ISSUES.length}>
        {BACKLOG_ISSUES.map((issue) => (
          <BacklogIssueRow
            key={issue.id}
            id={issue.id}
            title={issue.title}
            project={issue.project}
            date={issue.date}
            assigneeInitials={issue.assigneeInitials}
          />
        ))}
      </BacklogSection>
    </WorkspaceShell>
  )
}
