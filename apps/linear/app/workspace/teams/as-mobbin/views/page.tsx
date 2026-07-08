"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import {
  WorkspaceFooterActions,
  WorkspaceListPanel,
  WorkspaceShell,
} from "@/components/linear/workspace-shell"

export default function AsMobbinViewsPage() {
  const router = useRouter()

  return (
    <WorkspaceShell
      team="AS Mobbin"
      view="Views"
      activeNavId="as-mobbin-views"
      showIssueTabs={false}
      onSearch={() => router.push("/workspace/search")}
      footer={
        <WorkspaceFooterActions
          onAsk={() => router.push("/workspace/ask")}
          onHistory={() => router.push("/workspace/ask")}
        />
      }
    >
      <WorkspaceListPanel title="Views" count={0}>
        <p className="px-4 py-12 text-center text-sm text-muted-foreground">
          No views yet. Create a view to save filters and sorting.
        </p>
      </WorkspaceListPanel>
    </WorkspaceShell>
  )
}
