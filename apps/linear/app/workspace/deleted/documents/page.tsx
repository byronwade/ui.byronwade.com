"use client"

import * as React from "react"

import {
  WorkspaceAskTrigger,
  WorkspaceDocumentRow,
  WorkspaceListPanel,
  WorkspaceShell,
} from "@/components/linear/workspace-shell"

const DELETED_TABS = [
  { id: "issues", label: "Issues" },
  { id: "projects", label: "Projects" },
  { id: "cycles", label: "Cycles" },
  { id: "deleted-issues", label: "Recently deleted issues" },
  { id: "deleted-projects", label: "Recently deleted projects" },
  { id: "deleted-initiatives", label: "Recently deleted initiatives" },
  {
    id: "deleted-documents",
    label: "Recently deleted documents",
    href: "/workspace/deleted/documents",
  },
]

const DOCUMENTS = [
  {
    title: "Product Document - User Insight & Behavior Analytics Dashboard",
    project: "User Insight & Behavior Analytics Dashboard",
  },
  { title: "New document", project: "User Insight & Behavior Analytics Dashboard" },
  { title: "dddd", project: "User Insight & Behavior Analytics Dashboard" },
]

export default function RecentlyDeletedDocumentsPage() {

  return (
    <WorkspaceShell
      breadcrumbs={[
        { label: "AS Mobbin" },
        { label: "Recently deleted documents" },
      ]}
      activeNavId="more"
      showIssueTabs={false}
      viewTabs={DELETED_TABS}
      activeViewTab="deleted-documents"
      footer={<WorkspaceAskTrigger />}
    >
      <WorkspaceListPanel title="Recently deleted documents" count={DOCUMENTS.length}>
        {DOCUMENTS.map((document) => (
          <WorkspaceDocumentRow
            key={document.title}
            title={document.title}
            project={document.project}
          />
        ))}
      </WorkspaceListPanel>
    </WorkspaceShell>
  )
}
