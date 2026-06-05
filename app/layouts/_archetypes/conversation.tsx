"use client"

// Conversation archetype — a focused assistant thread with a docked composer.
// uses: GradientAvatar, Badge, Button, InputGroup, FilterPill, ScrollArea, Separator
import * as React from "react"
import {
  ArrowUp,
  Check,
  Copy,
  Paperclip,
  Plus,
  Sparkles,
  ThumbsUp,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GradientAvatar } from "@/components/ui/gradient-avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

type Role = "user" | "assistant"

interface Turn {
  role: Role
  content: React.ReactNode
  sources?: { label: string; meta: string }[]
}

const history = [
  { title: "Refactor billing webhook", active: true },
  { title: "Token contrast audit" },
  { title: "Draft launch changelog" },
  { title: "Explain the retry queue" },
]

const turns: Turn[] = [
  {
    role: "user",
    content: "Why are checkout retries piling up after the 14.0 deploy?",
  },
  {
    role: "assistant",
    content: (
      <>
        <p>
          The spike traces back to a stricter idempotency check shipped in{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]">
            14.0
          </code>
          . Retries now collide on a key that was previously regenerated, so the
          queue rejects them as duplicates and re-enqueues:
        </p>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
          <li>Burst correlates with the 12:02 UTC rollout window.</li>
          <li>
            Affected path is limited to{" "}
            <span className="text-foreground">checkout-api</span>.
          </li>
          <li>No data loss — payments are deferred, not dropped.</li>
        </ul>
      </>
    ),
    sources: [
      { label: "deploy-14.0.md", meta: "changelog" },
      { label: "queue-worker.ts", meta: "L142" },
    ],
  },
  {
    role: "user",
    content: "What's the smallest safe fix?",
  },
  {
    role: "assistant",
    content: (
      <p>
        Scope the idempotency key to{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]">
          order_id + attempt
        </code>{" "}
        instead of{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]">
          order_id
        </code>{" "}
        alone. That preserves dedupe within an attempt while letting genuine
        retries through. I can open a PR against{" "}
        <span className="text-foreground">checkout-api</span> with a test.
      </p>
    ),
  },
]

const suggestions = [
  "Open the PR",
  "Show the diff",
  "Draft a status update",
  "Add a regression test",
]

export function ConversationArchetype() {
  return (
    <div className="grid h-dvh grid-cols-1 bg-background text-foreground md:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="hidden min-h-0 flex-col border-r border-border md:flex">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <Sparkles className="size-4 text-brand" />
            Copilot
          </div>
          <Button variant="outline" size="icon-sm" aria-label="New chat">
            <Plus />
          </Button>
        </div>
        <Separator />
        <ScrollArea className="min-h-0 flex-1">
          <nav className="space-y-0.5 p-2">
            <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              Today
            </p>
            {history.map((h) => (
              <button
                key={h.title}
                type="button"
                data-active={h.active}
                className="flex w-full items-center gap-2 truncate rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted data-[active=true]:bg-muted data-[active=true]:font-medium"
              >
                {h.title}
              </button>
            ))}
          </nav>
        </ScrollArea>
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2">
            <GradientAvatar seed="byron" size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">Byron Wade</p>
              <p className="truncate text-xs text-muted-foreground">
                Pro · gpt-5
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-h-0 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-4 sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">
              Refactor billing webhook
            </p>
            <p className="hidden truncate text-xs text-muted-foreground sm:block">
              4 messages · 2 sources
            </p>
          </div>
          <Badge variant="secondary">
            <Sparkles data-icon="inline-start" className="text-brand" />
            gpt-5
          </Badge>
        </header>

        <ScrollArea className="min-h-0 flex-1">
          <div className="mx-auto max-w-2xl space-y-7 px-4 py-7 sm:px-6">
            {turns.map((turn, i) => (
              <Message key={i} turn={turn} />
            ))}
          </div>
        </ScrollArea>

        <div className="border-t border-border bg-background px-4 pb-4 pt-3 sm:px-6">
          <div className="mx-auto max-w-2xl space-y-2.5">
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="inline-flex h-7 items-center rounded-full bg-background px-3 text-xs font-medium shadow-card transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-2 rounded-2xl bg-card p-2 shadow-card focus-within:ring-3 focus-within:ring-ring/40">
              <Button variant="ghost" size="icon-sm" aria-label="Attach">
                <Paperclip />
              </Button>
              <textarea
                rows={1}
                defaultValue="Open the PR with the scoped idempotency key"
                aria-label="Message"
                className="max-h-32 min-h-9 flex-1 resize-none bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
              />
              <Button size="icon-sm" aria-label="Send">
                <ArrowUp />
              </Button>
            </div>
            <p className="text-center text-[11px] text-muted-foreground">
              Copilot can make mistakes. Verify important changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Message({ turn }: { turn: Turn }) {
  if (turn.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-brand px-4 py-2.5 text-sm leading-relaxed text-brand-foreground">
          {turn.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-brand/15 text-brand">
        <Sparkles className="size-4" />
      </span>
      <div className="min-w-0 flex-1 space-y-3">
        <div className="space-y-2 text-sm leading-relaxed">{turn.content}</div>

        {turn.sources && (
          <div className="flex flex-wrap gap-1.5">
            {turn.sources.map((s) => (
              <span
                key={s.label}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2 py-1 text-xs"
              >
                <span className="font-mono">{s.label}</span>
                <span className="text-muted-foreground">{s.meta}</span>
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1 text-muted-foreground">
          <button
            type="button"
            aria-label="Copy"
            className="grid size-7 place-items-center rounded-md transition-colors hover:bg-muted hover:text-foreground"
          >
            <Copy className="size-3.5" />
          </button>
          <button
            type="button"
            aria-label="Good response"
            className="grid size-7 place-items-center rounded-md transition-colors hover:bg-muted hover:text-foreground"
          >
            <ThumbsUp className="size-3.5" />
          </button>
          <span className={cn("ml-1 inline-flex items-center gap-1 text-xs")}>
            <Check className="size-3.5 text-success" />
            Verified
          </span>
        </div>
      </div>
    </div>
  )
}
