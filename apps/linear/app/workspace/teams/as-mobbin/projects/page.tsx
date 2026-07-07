"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

import {
  WorkspaceFooterActions,
  WorkspaceListPanel,
  WorkspaceShell,
} from "@/components/linear/workspace-shell"

const PROJECTS = [
  {
    title: "User Insight & Behavior Analytics Dashboard",
    meta: "Backlog · 3 issues",
    href: "/workspace/teams/as-mobbin/projects/user-insight",
  },
  {
    title: "AI UX Research Assistant",
    meta: "In Progress · 4 issues",
  },
]

export default function AsMobbinProjectsPage() {
  const router = useRouter()
  const { setTheme } = useTheme()

  React.useEffect(() => {
    setTheme("light")
  }, [setTheme])

  return (
    <WorkspaceShell
      team="AS Mobbin"
      view="Projects"
      activeNavId="as-mobbin-projects"
      showIssueTabs={false}
      onSearch={() => router.push("/workspace/search")}
      footer={
        <WorkspaceFooterActions
          onAsk={() => router.push("/workspace/ask")}
          onHistory={() => router.push("/workspace/ask")}
        />
      }
    >
      <WorkspaceListPanel title="Projects" count={PROJECTS.length}>
        {PROJECTS.map((project) => (
          <button
            key={project.title}
            type="button"
            className="flex w-full items-center justify-between border-b border-border px-4 py-3 text-left text-sm last:border-b-0 hover:bg-muted/30"
            onClick={project.href ? () => router.push(project.href!) : undefined}
          >
            <span className="font-medium">{project.title}</span>
            <span className="text-xs text-muted-foreground">{project.meta}</span>
          </button>
        ))}
      </WorkspaceListPanel>
    </WorkspaceShell>
  )
}
