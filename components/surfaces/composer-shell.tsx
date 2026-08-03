/**
 * Fluent material + Cursor-app proof — explorer, tabs, object-bound composer.
 * Interactive: file/tab selection + live ask thread.
 */
"use client"

import { useState, type ReactNode } from "react"
import { FileText, Sparkle, CircleNotch, CheckCircle } from "@/lib/icons"
import { Surface } from "@/components/surfaces/surface"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { activity, bg, designCn, radiusIntent } from "@/lib/design"
import { cn } from "@/lib/utils"

const fileBodies: Record<
  string,
  { lines: { n: string; html: ReactNode; highlight?: boolean }[] }
> = {
  "IssueRow.tsx": {
    lines: [
      {
        n: "01",
        html: (
          <>
            <span className="text-brand">export function</span> IssueRow() {"{"}
          </>
        ),
      },
      {
        n: "02",
        html: (
          <>
            <span className="text-muted-foreground">return</span> (
          </>
        ),
      },
      {
        n: "03",
        highlight: true,
        html: (
          <>
            &lt;tr className=
            <span className="text-brand">&quot;bg-brand/10&quot;</span>&gt;
          </>
        ),
      },
      { n: "04", html: <>…</> },
      { n: "05", html: <>&lt;/tr&gt;</> },
      { n: "06", html: <>)</> },
      { n: "07", html: <>{"}"}</> },
    ],
  },
  "workbench.tsx": {
    lines: [
      {
        n: "01",
        html: (
          <>
            <span className="text-brand">const</span> recipe = proofs.workbench
          </>
        ),
      },
      {
        n: "02",
        highlight: true,
        html: (
          <>
            selected → <span className="text-brand">bg-brand/10</span>
          </>
        ),
      },
      {
        n: "03",
        html: <>agent.boundTo = selection.id</>,
      },
    ],
  },
  "design.md": {
    lines: [
      { n: "01", html: <># Meridian</> },
      {
        n: "02",
        highlight: true,
        html: <>One accent. Tokens only. App-first.</>,
      },
      { n: "03", html: <>Cinema: ideas: 1 · no stickers.</> },
    ],
  },
  "contrast.ts": {
    lines: [
      {
        n: "01",
        html: (
          <>
            <span className="text-brand">export const</span> pairs = […]
          </>
        ),
      },
      {
        n: "02",
        highlight: true,
        html: <>AA body ≥ 4.5 on paper + theater</>,
      },
    ],
  },
}

const explorerFiles = ["IssueRow.tsx", "workbench.tsx", "design.md"] as const

type FileName = keyof typeof fileBodies

type ThreadMsg = {
  provenance: "user" | "assistant"
  body: string
  busy?: boolean
  activity?: "thinking" | "edit"
}

type ComposerShellProps = {
  className?: string
}

function ComposerShell({ className }: ComposerShellProps) {
  const [activeFile, setActiveFile] = useState<FileName>("IssueRow.tsx")
  const [openTabs, setOpenTabs] = useState<FileName[]>([
    "IssueRow.tsx",
    "contrast.ts",
  ])
  const [draft, setDraft] = useState("")
  const [thread, setThread] = useState<ThreadMsg[]>([
    {
      provenance: "user",
      body: "Apply brand wash on the selected row — Fluent stroke, Cursor density.",
    },
    {
      provenance: "assistant",
      body: "Patching IssueRow.tsx — selected → bg-brand/10.",
      busy: true,
      activity: "edit",
    },
  ])
  const [settled, setSettled] = useState(false)

  const body = fileBodies[activeFile] ?? fileBodies["IssueRow.tsx"]

  function openFile(name: FileName) {
    setActiveFile(name)
    setOpenTabs((tabs) => (tabs.includes(name) ? tabs : [...tabs, name]))
  }

  function sendAsk() {
    const text = draft.trim()
    if (!text) return
    setDraft("")
    setSettled(false)
    setThread((prev) => [
      ...prev.map((m) => ({ ...m, busy: false })),
      { provenance: "user", body: text },
      {
        provenance: "assistant",
        body: `On ${activeFile}: keeping tokens + edge — no second accent.`,
        busy: true,
        activity: "thinking",
      },
    ])
    window.setTimeout(() => {
      setThread((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1
            ? {
                ...m,
                busy: false,
                activity: "edit",
                body: `Done on ${activeFile} — brand wash + object-bound rail.`,
              }
            : m,
        ),
      )
      setSettled(true)
    }, 700)
  }

  return (
    <Surface
      id="desktop"
      className={designCn(
        "flex h-[32rem] overflow-hidden edge md:h-[36rem]",
        radiusIntent("panel"),
        bg("background"),
        className,
      )}
    >
      <aside className="hidden w-40 shrink-0 flex-col border-r border-border bg-muted/20 md:flex">
        <p className="px-2 pt-2 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
          Explorer
        </p>
        <ul className="mt-1 flex flex-col gap-0.5 px-1">
          {explorerFiles.map((name) => (
            <li key={name}>
              <button
                type="button"
                onClick={() => openFile(name)}
                aria-current={activeFile === name ? "true" : undefined}
                className={cn(
                  "flex h-7 w-full items-center gap-1.5 px-1.5 text-left text-[12px] tracking-tight",
                  radiusIntent("control"),
                  activeFile === name
                    ? "bg-brand/10 text-foreground"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                )}
              >
                <FileText className="size-3.5 shrink-0 opacity-70" />
                <span className="truncate font-mono text-[11px]">{name}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div
          className="flex h-8 items-center gap-0 overflow-x-auto border-b border-border bg-muted/15"
          role="tablist"
          aria-label="Open files"
        >
          {openTabs.map((tab) => {
            const active = tab === activeFile
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveFile(tab)}
                className={cn(
                  "flex h-full shrink-0 items-center gap-1.5 border-r border-border px-3 font-mono text-[11px]",
                  active
                    ? "bg-background text-foreground"
                    : "text-muted-foreground hover:bg-muted/30",
                )}
              >
                <FileText className="size-3 opacity-60" />
                {tab}
              </button>
            )
          })}
        </div>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[1fr_18rem]">
          <div className="min-h-0 overflow-auto border-border p-4 font-mono text-[12px] leading-relaxed text-muted-foreground lg:border-r">
            {body.lines.map((line) => (
              <p
                key={line.n}
                className={cn(
                  line.highlight && "bg-brand/10 text-foreground",
                )}
              >
                <span className="text-muted-foreground">{line.n}</span>
                {"  "}
                <span className={line.highlight ? "text-foreground" : undefined}>
                  {line.html}
                </span>
              </p>
            ))}
          </div>

          <aside className="hidden min-h-0 flex-col bg-muted/15 lg:flex">
            <div className="flex h-8 items-center gap-2 border-b border-border px-3">
              <Sparkle className="size-3.5 text-brand" />
              <span className="font-mono text-[11px] text-muted-foreground">
                Agent
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "ml-auto h-4 border-transparent px-1.5 font-mono text-[9px] text-foreground opacity-80",
                  radiusIntent("pill"),
                  activity(settled ? "edit" : "thinking"),
                )}
              >
                {settled ? "edit" : "thinking"}
              </Badge>
            </div>
            <div className="min-h-0 flex-1 space-y-2 overflow-auto p-2">
              <p className="px-0.5 font-mono text-[10px] text-muted-foreground">
                bound · {activeFile}
              </p>
              {thread.map((msg, i) => (
                <article
                  key={`${msg.provenance}-${i}`}
                  data-provenance={msg.provenance}
                  className={designCn(
                    "bg-card px-2.5 py-2 edge",
                    radiusIntent("control"),
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    {msg.busy ? (
                      <CircleNotch className="size-3 animate-spin text-brand" />
                    ) : msg.provenance === "assistant" ? (
                      <CheckCircle className="size-3 text-brand" />
                    ) : null}
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {msg.provenance === "user" ? "You" : "Assistant"}
                    </p>
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed tracking-tight">
                    {msg.body}
                  </p>
                </article>
              ))}
            </div>
            <Separator />
            <form
              className="flex items-center gap-1.5 p-2"
              onSubmit={(e) => {
                e.preventDefault()
                sendAsk()
              }}
            >
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask about this file…"
                aria-label={`Ask about ${activeFile}`}
                className="h-8 rounded-lg border border-transparent bg-background text-[12px] shadow-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
              />
              <Button
                type="submit"
                size="sm"
                variant="ghost"
                className="h-8 shrink-0 rounded-lg px-2"
              >
                ⌘↵
              </Button>
            </form>
          </aside>
        </div>

        <footer className="flex h-6 items-center justify-between border-t border-border bg-muted/20 px-3 font-mono text-[10px] text-muted-foreground">
          <span>Meridian · application</span>
          <span>{activeFile}</span>
        </footer>
      </div>
    </Surface>
  )
}

export { ComposerShell }
export type { ComposerShellProps }
