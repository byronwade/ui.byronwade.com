"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import {
  Bell,
  ChevronDown,
  CircleDashed,
  Copy,
  Image as ImageIcon,
  Link2,
  MessageSquare,
  PanelRight,
  Plus,
  SignalHigh,
  Star,
  UserCircle2,
} from "lucide-react"

import {
  CreateIssueDialog,
  GifPicker,
  ProjectComment,
  ProjectCommentComposer,
  ProjectFileAttachment,
  ProjectLogoBlock,
  ProjectOutline,
  ProjectPropertiesPanel,
  RichTextToolbar,
} from "@/components/linear/project-detail"
import {
  WorkspaceFooterActions,
  WorkspaceShell,
} from "@/components/linear/workspace-shell"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const OUTLINE = [
  { id: "brief", label: "Project Brief", emoji: "📌" },
  { id: "background", label: "Background", depth: 1 },
  { id: "goal", label: "Goal", emoji: "🎯", depth: 1 },
  { id: "target-users", label: "Target Users", emoji: "👥", depth: 1 },
  { id: "key-features", label: "Key Features", emoji: "📊", depth: 1 },
]

const MARKDOWN = `Project: User Insight & Behavior Analytics Dashboard

Description:
A centralized dashboard that helps product and design teams analyze user behavior, identify friction points, and prioritize what to build next.

Project Brief:
This project aims to design and develop a comprehensive analytics dashboard that transforms raw user data into actionable insights.

Key Features:
- User Behavior Overview (sessions, bounce rate, retention)
- Heatmaps & Click Tracking
- Funnel Analysis (drop-off points)
- User Segmentation (by demographics & behavior)
- Real-time Insights & Alerts
- Exportable Reports

Goals:
- Improve user retention by 20%
- Identify top 3 UX pain points
- Enable data-driven design decisions`

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
  const [outlineOpen, setOutlineOpen] = React.useState(false)
  const [markdown, setMarkdown] = React.useState(false)
  const [issueOpen, setIssueOpen] = React.useState(false)

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

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Popover open={outlineOpen} onOpenChange={setOutlineOpen}>
                  <PopoverTrigger
                    render={
                      <button className="flex items-center gap-1 text-sm font-medium text-foreground">
                        Description
                        <ChevronDown className="size-3.5 text-muted-foreground" />
                      </button>
                    }
                  />
                  <PopoverContent align="start" className="w-auto border-0 bg-transparent p-0 shadow-none">
                    <ProjectOutline items={OUTLINE} activeId="background" />
                  </PopoverContent>
                </Popover>
                <div className="flex items-center gap-1">
                  <button
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted/40"
                    onClick={() => setMarkdown((value) => !value)}
                  >
                    {markdown ? "Rich text" : "Markdown"}
                    <ChevronDown className="size-3" />
                  </button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="size-7"
                    aria-label="Copy"
                    onClick={() => {
                      void navigator.clipboard?.writeText(MARKDOWN)
                      toast.success("Copied to clipboard")
                    }}
                  >
                    <Copy className="size-3.5" />
                  </Button>
                </div>
              </div>

              {markdown ? (
                <pre
                  data-slot="linear-project-markdown"
                  className="overflow-auto rounded-lg border border-border bg-muted/20 p-4 font-mono text-xs leading-relaxed text-foreground"
                >
                  {MARKDOWN}
                </pre>
              ) : (
                <>
                  <ProjectComment
                    author="alexsmith.mobbin@gmail.com"
                    timeAgo="6min ago"
                    edited
                    body="Logo of AS Mobbin"
                    reactions={[{ emoji: "✅", count: 1 }]}
                    onNewIssue={() => setIssueOpen(true)}
                  />

                  <div className="flex items-center gap-2">
                    <ProjectCommentComposer
                      value={reply}
                      onChange={setReply}
                      onSubmit={() => setReply("")}
                    />
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button variant="outline" size="icon-sm" aria-label="Add GIF">
                            <ImageIcon className="size-4" />
                          </Button>
                        }
                      />
                      <PopoverContent align="end" className="w-auto border-0 bg-transparent p-0 shadow-none">
                        <GifPicker onSelect={() => toast.success("GIF added")} />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <ProjectLogoBlock />

                  <div className="space-y-4 pt-2">
                    <RichTextToolbar />

                    <section id="brief" className="space-y-3">
                      <h2 className="text-lg font-medium tracking-tight text-foreground">
                        📌 Project Brief
                      </h2>

                      <div id="background" className="space-y-2">
                        <h3 className="text-sm font-semibold text-foreground">Background</h3>
                        <p className="text-sm text-muted-foreground">
                          Currently, product and design teams lack a centralized
                          view of user behavior and engagement data. Insights are
                          scattered across tools (analytics, research docs,
                          feedback), making it difficult to identify patterns and
                          make informed decisions.
                        </p>
                        <p className="text-sm text-muted-foreground">This results in:</p>
                        <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
                          <li>Slow decision-making</li>
                          <li>Missed UX improvement opportunities</li>
                          <li>Difficulty prioritizing features</li>
                        </ul>
                      </div>

                      <hr className="border-border" />

                      <div id="goal" className="space-y-2">
                        <h3 className="text-sm font-semibold text-foreground">🎯 Goal</h3>
                        <p className="text-sm text-muted-foreground">
                          Create a unified dashboard that transforms raw user data
                          into clear, actionable insights for product and design
                          teams.
                        </p>
                      </div>

                      <hr className="border-border" />

                      <div id="target-users" className="space-y-2">
                        <h3 className="text-sm font-semibold text-foreground">
                          👥 Target Users
                        </h3>
                        <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
                          <li>Product Managers → track feature performance &amp; prioritize roadmap</li>
                          <li>UX Designers → understand user behavior &amp; friction points</li>
                          <li>UX Researchers → validate hypotheses with behavioral data</li>
                        </ul>
                      </div>

                      <hr className="border-border" />

                      <div id="key-features" className="space-y-2">
                        <h3 className="text-sm font-semibold text-foreground">
                          📊 Key Features
                        </h3>
                        <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
                          <li>
                            <span className="text-foreground">User Behavior Overview</span>
                            <ul className="list-[circle] pl-6">
                              <li>Active users, session trends, retention</li>
                            </ul>
                          </li>
                          <li>
                            <span className="text-foreground">Feature Usage Tracking</span>
                            <ul className="list-[circle] pl-6">
                              <li>Most/least used features</li>
                            </ul>
                          </li>
                          <li>
                            <span className="text-foreground">Funnel Analysis</span>
                            <ul className="list-[circle] pl-6">
                              <li>Drop-off points in key flows (e.g. onboarding, saving UI)</li>
                            </ul>
                          </li>
                          <li>
                            <span className="text-foreground">Heatmap / Interaction Insights</span>
                            <ul className="list-[circle] pl-6">
                              <li>Clicks, scroll behavior (simulated for dummy project)</li>
                            </ul>
                          </li>
                        </ul>
                        <ProjectFileAttachment
                          name="task-export-3-22-2026-212341.csv"
                          size="1.93 KB"
                        />
                      </div>

                      <button className="flex items-center gap-1 pt-2 text-sm text-muted-foreground hover:text-foreground">
                        <Plus className="size-3.5" />
                        Milestone
                      </button>
                    </section>
                  </div>
                </>
              )}
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

      <CreateIssueDialog
        open={issueOpen}
        onOpenChange={setIssueOpen}
        onCreate={() =>
          toast.success("Issue created", {
            description: "AS-5 — New Project Logo",
          })
        }
      />
    </WorkspaceShell>
  )
}
