/**
 * Canonical application whole — Fluent 2 material + Cursor-app density.
 * Interactive: nav, row selection, search, object-bound agent rail.
 */
"use client"

import { useState } from "react"
import {
  House,
  ListTodo,
  Search,
  Settings,
  Circle,
  Sparkle,
} from "@/lib/icons"
import { Surface } from "@/components/surfaces/surface"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ActivityLegend } from "@/components/site/activity-legend"
import {
  activity,
  bg,
  designCn,
  interactionClasses,
  proofs,
  radiusIntent,
} from "@/lib/design"
import { cn } from "@/lib/utils"

const recipe = proofs.workbench
const interactive = proofs.interactiveWorkbench

type ResourceDemo = "ready" | "loading" | "error"

const navItems = [
  { id: "home" as const, label: "Home", icon: House },
  { id: "issues" as const, label: "Issues", icon: ListTodo },
  { id: "settings" as const, label: "Settings", icon: Settings },
]

type NavId = (typeof navItems)[number]["id"]

const issueRows = [
  {
    id: "ISS-1842",
    title: "Tighten selected-state contrast",
    meta: "2h",
  },
  {
    id: "ISS-1839",
    title: "Ship help drawer reading lane",
    meta: "48m",
  },
  {
    id: "ISS-1831",
    title: "Map activity to agent timeline",
    meta: "—",
  },
  {
    id: "ISS-1820",
    title: "Align edge depth on panels",
    meta: "1d",
  },
]

type AgentEvent = {
  provenance: "user" | "assistant" | "tool"
  label: string
  body: string
  activity?: "thinking" | "search" | "read" | "edit"
}

const seedEvents: Record<string, AgentEvent[]> = {
  "ISS-1842": [
    {
      provenance: "user",
      label: "You",
      body: "Use brand wash on selected rows — not a border.",
    },
    {
      provenance: "assistant",
      label: "Assistant",
      body: "Checking selected-state contrast on paper + theater.",
      activity: "thinking",
    },
    {
      provenance: "tool",
      label: "search · IssueRow",
      body: "Found selected → border treatment in three call sites.",
      activity: "search",
    },
    {
      provenance: "tool",
      label: "edit · IssueRow.tsx",
      body: "Selected treatment → brand/10 fill.",
      activity: "edit",
    },
  ],
  "ISS-1839": [
    {
      provenance: "assistant",
      label: "Assistant",
      body: "Help drawer should use typeset docs — 65ch, not dense chrome type.",
      activity: "thinking",
    },
    {
      provenance: "tool",
      label: "read · readability.md",
      body: "typeset docs preset confirmed for help copy.",
      activity: "read",
    },
  ],
  "ISS-1831": [
    {
      provenance: "tool",
      label: "read · activity.ts",
      body: "Mapped thinking / search / read / edit to timeline chips.",
      activity: "read",
    },
    {
      provenance: "assistant",
      label: "Assistant",
      body: "Pastels stay on the agent rail — never system CTAs.",
      activity: "thinking",
    },
  ],
  "ISS-1820": [
    {
      provenance: "user",
      label: "You",
      body: "Panels need edge hairline — no shadow-* utilities.",
    },
    {
      provenance: "tool",
      label: "search · shadow-",
      body: "No Tailwind shadow-* in registry surfaces.",
      activity: "search",
    },
  ],
}

type WorkbenchProps = {
  className?: string
  /** Object-bound AI rail — only when an object needs it. */
  withAgent?: boolean
}

function Workbench({ className, withAgent = true }: WorkbenchProps) {
  const [nav, setNav] = useState<NavId>("issues")
  const [selectedId, setSelectedId] = useState(issueRows[0].id)
  const [query, setQuery] = useState("")
  const [draft, setDraft] = useState("")
  const [eventsById, setEventsById] = useState(seedEvents)
  const [resourceDemo, setResourceDemo] = useState<ResourceDemo>("ready")

  const filtered = issueRows.filter((row) => {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return (
      row.id.toLowerCase().includes(q) || row.title.toLowerCase().includes(q)
    )
  })

  const events = eventsById[selectedId] ?? []
  const selected = issueRows.find((r) => r.id === selectedId) ?? issueRows[0]
  const outcome =
    events.toReversed().find((e) => e.provenance === "assistant")?.body ??
    "Select an issue — outcome appears here; activity stays in the trace."
  const activeActivity = events.toReversed().find((e) => e.activity)?.activity

  function sendAsk() {
    const text = draft.trim()
    if (!text) return
    setEventsById((prev) => {
      const prior = prev[selectedId] ?? []
      return {
        ...prev,
        [selectedId]: [
          ...prior,
          { provenance: "user", label: "You", body: text },
          {
            provenance: "assistant",
            label: "Assistant",
            body: `On ${selectedId}: applying brand wash + edge depth — keeping Fluent stroke.`,
            activity: "thinking",
          },
        ],
      }
    })
    setDraft("")
  }

  return (
    <Surface
      id={recipe.surface}
      className={designCn(
        /* @container: this shell is embedded at many widths (studio, cards,
           split doc columns). Viewport breakpoints would keep all three
           columns open in a 32rem slot and collide the rows. */
        "@container flex h-[32rem] overflow-hidden edge md:h-[36rem]",
        radiusIntent("panel"),
        bg("background"),
        className,
      )}
    >
      <aside className="hidden w-40 shrink-0 flex-col border-r border-border bg-muted/20 text-sidebar-foreground @md:flex">
        <p className="px-2.5 pt-2 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
          Workspace
        </p>
        <nav className="mt-1 flex flex-col gap-0.5 px-1" aria-label="Workspace">
          {navItems.map((item) => (
            <Button
              key={item.id}
              type="button"
              variant="ghost"
              size="sm"
              aria-current={nav === item.id ? "page" : undefined}
              onClick={() => setNav(item.id)}
              className={cn(
                "h-7 justify-start gap-2 px-1.5 text-[12px] hover:bg-muted/40",
                radiusIntent("control"),
                nav === item.id &&
                  cn(recipe.selected, "text-foreground hover:bg-brand/10"),
              )}
            >
              <item.icon className="size-3.5 opacity-70" />
              {item.label}
            </Button>
          ))}
        </nav>
        <p className="mt-auto px-2.5 pb-2 font-mono text-[10px] text-muted-foreground">
          {withAgent ? `Agent · ${selectedId}` : "Ready"}
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-8 items-center gap-2 border-b border-border bg-muted/15 px-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search or jump…"
              aria-label="Search issues"
              className={cn(
                "h-7 border border-transparent bg-background pl-7 text-[12px] shadow-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40",
                radiusIntent("control"),
              )}
            />
          </div>
          <kbd className="font-mono text-[10px] tracking-tight text-muted-foreground">
            ⌘K
          </kbd>
        </header>

        <div
          className={cn(
            "grid min-h-0 flex-1",
            withAgent && nav === "issues"
              ? "@3xl:grid-cols-[1fr_16.5rem]"
              : "grid-cols-1",
          )}
        >
          <div className="min-h-0 overflow-auto border-border @3xl:border-r">
            {nav === "home" ? (
              <div className="space-y-3 p-4">
                <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                  Home
                </p>
                <h3 className="text-base font-medium tracking-tight">
                  {selected.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Jump into Issues to select an object — the agent rail binds to
                  it.
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className={radiusIntent("control")}
                  onClick={() => setNav("issues")}
                >
                  Open issues
                </Button>
              </div>
            ) : null}

            {nav === "settings" ? (
              <div className="space-y-3 p-4">
                <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                  Settings
                </p>
                <ul className="space-y-1.5 text-sm tracking-tight">
                  <li className="flex h-8 items-center justify-between rounded-lg bg-muted/30 px-2.5">
                    <span>Density</span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      application
                    </span>
                  </li>
                  <li className="flex h-8 items-center justify-between rounded-lg px-2.5 hover:bg-muted/30">
                    <span>Accent</span>
                    <span className="font-mono text-[11px] text-brand">
                      --brand
                    </span>
                  </li>
                  <li className="flex h-8 items-center justify-between rounded-lg px-2.5 hover:bg-muted/30">
                    <span>Material</span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      edge
                    </span>
                  </li>
                </ul>
              </div>
            ) : null}

            {nav === "issues" ? (
              <div className="flex min-h-0 flex-1 flex-col">
                <div
                  className="flex flex-wrap items-center gap-1 border-b border-border px-2 py-1"
                  role="group"
                  aria-label="Resource state demo"
                >
                  {(
                    [
                      ["ready", "Ready"],
                      ["loading", "Loading"],
                      ["error", "Error"],
                    ] as const
                  ).map(([id, label]) => (
                    <Button
                      key={id}
                      type="button"
                      size="xs"
                      variant={resourceDemo === id ? "secondary" : "ghost"}
                      aria-pressed={resourceDemo === id}
                      className={cn(
                        "h-6 px-2 font-mono text-[10px]",
                        radiusIntent("control"),
                      )}
                      onClick={() => setResourceDemo(id)}
                    >
                      {label}
                    </Button>
                  ))}
                  <span className="ml-auto font-mono text-[9px] text-muted-foreground">
                    empty via search
                  </span>
                </div>

                {resourceDemo === "loading" ? (
                  <div
                    className="space-y-2 p-3"
                    role="status"
                    aria-live="polite"
                    aria-busy="true"
                  >
                    <p className="font-mono text-[11px] text-muted-foreground">
                      Loading issues…
                    </p>
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-8 animate-pulse rounded-lg bg-muted/40"
                      />
                    ))}
                  </div>
                ) : null}

                {resourceDemo === "error" ? (
                  <div
                    className={cn(
                      "m-3 space-y-3 p-4 edge",
                      radiusIntent("control"),
                      interactionClasses.danger,
                    )}
                    role="alert"
                  >
                    <p className="text-sm font-medium tracking-tight">
                      Couldn’t load issues
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      Index request failed — try again or clear filters.
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className={radiusIntent("control")}
                      onClick={() => setResourceDemo("ready")}
                    >
                      Retry
                    </Button>
                  </div>
                ) : null}

                {resourceDemo === "ready" ? (
                  <table className="w-full caption-bottom text-sm">
                    <thead className="sticky top-0 z-10 bg-background [&_tr]:border-b">
                      <tr className="h-8 border-b border-border">
                        <th className="h-8 w-7 pl-2.5 text-left font-medium text-muted-foreground" />
                        <th className="h-8 w-20 text-left text-[11px] font-medium text-muted-foreground">
                          ID
                        </th>
                        <th className="h-8 text-left text-[11px] font-medium text-muted-foreground">
                          Title
                        </th>
                        <th className="hidden h-8 pr-2.5 text-right text-[11px] font-medium text-muted-foreground @sm:table-cell">
                          Meta
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-3 py-8 text-center">
                            <p className="text-sm text-muted-foreground">
                              No issues match “{query}”.
                            </p>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className={cn("mt-3", radiusIntent("control"))}
                              onClick={() => setQuery("")}
                            >
                              Clear search
                            </Button>
                          </td>
                        </tr>
                      ) : (
                        filtered.map((row) => {
                          const active = row.id === selectedId
                          return (
                            <tr
                              key={row.id}
                              data-state={active ? "selected" : undefined}
                              tabIndex={0}
                              aria-selected={active}
                              onClick={() => setSelectedId(row.id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault()
                                  setSelectedId(row.id)
                                }
                              }}
                              className={cn(
                                interactionClasses.row,
                                "h-8 cursor-pointer border-b border-border/60",
                              )}
                            >
                              <td className="pl-2.5">
                                <Circle
                                  className={
                                    active
                                      ? "size-2.5 text-brand"
                                      : "size-2.5 text-muted-foreground"
                                  }
                                  weight={active ? "fill" : "regular"}
                                />
                              </td>
                              <td className="font-mono text-[11px] text-muted-foreground">
                                {row.id}
                              </td>
                              <td className="truncate text-[13px] tracking-tight">
                                {row.title}
                              </td>
                              <td className="hidden pr-2.5 text-right font-mono text-[11px] text-muted-foreground @sm:table-cell">
                                {row.meta}
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                ) : null}
              </div>
            ) : null}
          </div>

          {withAgent && nav === "issues" ? (
            <aside
              className="hidden min-h-0 flex-col bg-muted/15 @3xl:flex"
              data-disclosure={interactive.agent?.disclosure}
            >
              <div className="flex h-8 items-center gap-1.5 border-b border-border px-2.5">
                <Sparkle className="size-3.5 text-brand" />
                <span className="font-mono text-[11px] tracking-tight text-muted-foreground">
                  {selectedId}
                </span>
              </div>
              <div className="border-b border-border px-2 py-1.5">
                <ActivityLegend active={activeActivity} />
              </div>
              <div className="min-h-0 flex-1 space-y-2 overflow-auto p-2">
                <p className="px-0.5 text-[11px] tracking-tight text-muted-foreground">
                  {selected.title}
                </p>
                {/* Level 1 — outcome (Nielsen progressive disclosure) */}
                <div
                  data-slot="agent-outcome"
                  className={designCn(
                    "bg-card px-2.5 py-2 edge",
                    radiusIntent("control"),
                  )}
                >
                  <p className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                    Outcome
                  </p>
                  <p className="mt-1 text-[12px] leading-snug tracking-tight">
                    {outcome}
                  </p>
                </div>
                {/* Level 2 — activity trace, one click away */}
                <details
                  data-slot="agent-trace"
                  className="group rounded-lg edge"
                >
                  <summary className="cursor-pointer list-none px-2.5 py-2 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="inline-flex items-center gap-1.5">
                      Activity trace
                      <span className="text-muted-foreground/80 normal-case tracking-tight">
                        ({events.length})
                      </span>
                    </span>
                  </summary>
                  <div className="space-y-1.5 border-t border-border px-2 py-2">
                    {events.map((event, i) => (
                      <article
                        key={`${event.label}-${i}-${event.body.slice(0, 24)}`}
                        data-provenance={event.provenance}
                        className={designCn(
                          "bg-card px-2 py-1.5 edge",
                          radiusIntent("control"),
                        )}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {event.label}
                          </span>
                          {event.activity ? (
                            <Badge
                              className={cn(
                                "h-4 border-transparent px-1.5 font-mono text-[9px] tracking-[0.08em] text-foreground uppercase",
                                radiusIntent("pill"),
                                activity(event.activity),
                              )}
                            >
                              {event.activity}
                            </Badge>
                          ) : null}
                        </div>
                        <p className="mt-0.5 text-[12px] leading-snug tracking-tight">
                          {event.body}
                        </p>
                      </article>
                    ))}
                  </div>
                </details>
              </div>
              <Separator />
              <form
                className="flex items-center gap-1 p-1.5"
                onSubmit={(e) => {
                  e.preventDefault()
                  sendAsk()
                }}
              >
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Ask about this issue…"
                  aria-label={`Ask about ${selectedId}`}
                  className={cn(
                    "h-7 border border-transparent bg-background text-[12px] shadow-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40",
                    radiusIntent("control"),
                  )}
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="ghost"
                  className="h-7 shrink-0 rounded-lg px-2 font-mono text-[10px]"
                >
                  ⌘↵
                </Button>
              </form>
            </aside>
          ) : null}
        </div>

        <footer className="flex h-6 items-center justify-between border-t border-border bg-muted/20 px-2.5 font-mono text-[10px] text-muted-foreground">
          <span>{recipe.surface}</span>
          <span>
            {nav !== "issues"
              ? "idle"
              : resourceDemo !== "ready"
                ? resourceDemo
                : filtered.length === 0
                  ? "empty"
                  : withAgent
                    ? `${selectedId} bound`
                    : "selected"}
          </span>
        </footer>
      </div>
    </Surface>
  )
}

export { Workbench }
export type { WorkbenchProps }
