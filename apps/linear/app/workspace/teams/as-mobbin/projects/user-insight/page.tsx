"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Bell,
  CircleDashed,
  Link2,
  MessageSquare,
  PanelRight,
  Plus,
  SignalHigh,
  Star,
  UserCircle2,
} from "lucide-react"

import {
  ProjectComment,
  ProjectCommentComposer,
  ProjectLogoBlock,
  ProjectPropertiesPanel,
} from "@/components/linear/project-detail"
import {
  WorkspaceFooterActions,
  WorkspaceShell,
} from "@/components/linear/workspace-shell"
import { Button } from "@/components/ui/button"

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "updates", label: "Updates" },
  { id: "issues", label: "Issues" },
]

export default function ProjectOverviewPage() {
  const router = useRouter()
  const { setTheme } = useTheme()
  const [activeTab, setActiveTab] = React.useState("overview")
  const [reply, setReply] = React.useState("")

  React.useEffect(() => {
    setTheme("light")
  }, [setTheme])

  return (
    <WorkspaceShell
      breadcrumbs={[
        { label: "AS Mobbin", href: "/workspace/teams/as-mobbin/projects" },
        { label: "User Insight & Behavior Analytics Dashboard" },
      ]}
      activeNavId="as-mobbin-projects"
      showIssueTabs={false}
      headerActions={
        <>
          <Button variant="ghost" size="icon-sm" aria-label="Favorite">
            <Star className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Copy link">
            <Link2 className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Notifications">
            <Bell className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Toggle comments">
            <MessageSquare className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Toggle panel">
            <PanelRight className="size-4" />
          </Button>
        </>
      }
      footer={
        <WorkspaceFooterActions
          onAsk={() => router.push("/workspace/ask")}
          onHistory={() => router.push("/workspace/ask")}
        />
      }
    >
      <div className="flex items-center gap-1 border-b border-border px-4 py-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            data-slot="linear-project-tab"
            data-active={activeTab === tab.id ? "true" : undefined}
            className={
              activeTab === tab.id
                ? "rounded-full bg-muted px-2.5 py-1 text-xs text-foreground"
                : "rounded-full px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted/30 hover:text-foreground"
            }
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
        <Button variant="ghost" size="icon-sm" className="size-6" aria-label="Project settings">
          <Plus className="size-3.5" />
        </Button>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1 overflow-auto">
          <div className="mx-auto max-w-3xl space-y-6 px-8 py-8">
            <div className="space-y-2">
              <h1 className="text-2xl font-medium tracking-tight text-foreground">
                User Insight &amp; Behavior Analytics Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Create an internal dashboard to track user behavior, popular UI
                patterns, and engagement metrics to inform product decisions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-1 text-muted-foreground">
                <CircleDashed className="size-3.5" />
                Backlog
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-1 text-muted-foreground">
                <SignalHigh className="size-3.5" />
                No priority
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-1 text-muted-foreground">
                <UserCircle2 className="size-3.5" />
                Lead
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-1 text-muted-foreground">
                Target date
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-1 text-muted-foreground">
                <span className="inline-flex size-3 items-center justify-center rounded-full bg-brand/20 text-[7px] text-brand">
                  ●
                </span>
                AS Mobbin
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Resources</span>
              <button className="inline-flex items-center gap-1 hover:text-foreground">
                <Plus className="size-3.5" />
                Add document or link…
              </button>
            </div>

            <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card py-6 text-sm text-muted-foreground hover:bg-muted/30">
              Write first project update
            </button>

            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Description</p>

              <ProjectComment
                author="alexsmith.mobbin@gmail.com"
                timeAgo="6min ago"
                edited
                body="Logo of AS Mobbin"
                reactions={[{ emoji: "✅", count: 1 }]}
              />

              <ProjectCommentComposer
                value={reply}
                onChange={setReply}
                onSubmit={() => setReply("")}
              />

              <ProjectLogoBlock />

              <div className="space-y-2 pt-4">
                <h2 className="text-lg font-medium tracking-tight text-foreground">
                  📌 Project Brief
                </h2>
                <h3 className="text-sm font-medium text-foreground">Background</h3>
                <p className="text-sm text-muted-foreground">
                  Product and design teams lack a single place to understand user
                  behavior, engagement, and UI usage patterns. Insights are
                  scattered across analytics, research docs, and feedback.
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside
          data-slot="linear-project-sidebar"
          className="hidden w-80 shrink-0 overflow-auto border-l border-border p-5 xl:block"
        >
          <ProjectPropertiesPanel />
        </aside>
      </div>
    </WorkspaceShell>
  )
}
