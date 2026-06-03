"use client";

// Cockpit archetype — a dense operations console.
// uses: ScrollArea, Tabs, StatusDot, GradientAvatar, Badge, Separator, InputGroup, EventTimeline, Sparkline
//
// Design: a tri-pane command center in the Linear issue-view lineage. A slim icon rail,
// a severity-coded incident list, and a detail pane that pairs tabbed content with a
// structured properties rail (status, priority, assignee, blast-radius sparkline).
// Density lives in behavior — keyboard hints, hover/active states, monospaced IDs.
import * as React from "react";
import {
  Activity,
  Archive,
  Boxes,
  Check,
  Inbox,
  Search,
  Settings,
  Siren,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusDot, type StatusTone } from "@/components/ui/status-dot";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/status-pill";
import { EventTimeline } from "@/components/event-timeline";
import { Sparkline } from "@/app/layouts/_components/spark";

type BadgeVariant = "secondary" | "success" | "warning" | "destructive";

interface Thread {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  tone: StatusTone;
  tag: string;
  priority: string;
  assignee: string;
  unread?: boolean;
  detail: string;
  meta: { label: string; value: string }[];
  affected: string[];
  errors: number[];
}

const badgeFor: Record<StatusTone, BadgeVariant> = {
  success: "success",
  warning: "warning",
  danger: "destructive",
  info: "secondary",
  neutral: "secondary",
};

const dotBar: Record<StatusTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  info: "bg-brand",
  neutral: "bg-muted-foreground/40",
};

const threads: Thread[] = [
  {
    id: "inc-4821", from: "Pager · us-east-1", subject: "Elevated error rate on checkout", preview: "5xx ratio crossed 2% for 4 minutes…", time: "2m", tone: "danger", tag: "P1", priority: "Urgent", assignee: "Ana Reyes", unread: true,
    detail: "Error budget burn accelerated after the 14.0 deploy. Rollback initiated; traffic shifting to the previous revision.",
    meta: [{ label: "Service", value: "checkout-api" }, { label: "Region", value: "us-east-1" }, { label: "Owner", value: "Payments" }, { label: "Started", value: "12:02 UTC" }],
    affected: ["checkout-api", "payments-svc", "cart-edge"], errors: [1, 1, 2, 3, 6, 9, 12, 14, 11, 8],
  },
  {
    id: "inc-4820", from: "Pager · eu-west-1", subject: "Queue depth above threshold", preview: "Worker backlog at 12k and rising…", time: "18m", tone: "warning", tag: "P2", priority: "High", assignee: "Priya Nair", unread: true,
    detail: "Background job queue is draining slower than ingest. Auto-scaling added 4 workers; backlog projected clear in ~20m.",
    meta: [{ label: "Service", value: "jobs-worker" }, { label: "Region", value: "eu-west-1" }, { label: "Owner", value: "Platform" }, { label: "Started", value: "11:46 UTC" }],
    affected: ["jobs-worker", "ingest-api"], errors: [4, 5, 6, 6, 7, 8, 9, 8, 7, 7],
  },
  {
    id: "inc-4818", from: "Sentry", subject: "New issue: TypeError in Billing", preview: "Cannot read properties of undefined…", time: "1h", tone: "warning", tag: "Bug", priority: "Medium", assignee: "Marc Vidal",
    detail: "A null invoice line item slipped past validation. Affects 0.3% of sessions; non-blocking but noisy in logs.",
    meta: [{ label: "Service", value: "billing-web" }, { label: "Release", value: "v2.13.7" }, { label: "Owner", value: "Billing" }, { label: "Events", value: "214" }],
    affected: ["billing-web"], errors: [2, 2, 3, 2, 3, 3, 4, 3, 3, 2],
  },
  {
    id: "inc-4805", from: "Status · CDN", subject: "Edge cache hit ratio recovered", preview: "Hit ratio back above 96%…", time: "3h", tone: "success", tag: "Resolved", priority: "Low", assignee: "Liam Cho",
    detail: "Cache hit ratio dipped during the config push and has fully recovered. No customer impact recorded.",
    meta: [{ label: "Service", value: "edge-cdn" }, { label: "Region", value: "global" }, { label: "Owner", value: "Edge" }, { label: "Closed", value: "09:12 UTC" }],
    affected: ["edge-cdn"], errors: [6, 5, 5, 4, 3, 2, 2, 1, 1, 1],
  },
  {
    id: "inc-4799", from: "Cron", subject: "Nightly export finished", preview: "Exported 1.2M rows in 03:41…", time: "8h", tone: "neutral", tag: "Info", priority: "None", assignee: "Sara Kim",
    detail: "Scheduled analytics export completed successfully and uploaded to the warehouse bucket.",
    meta: [{ label: "Job", value: "warehouse-export" }, { label: "Rows", value: "1,204,882" }, { label: "Duration", value: "03:41" }, { label: "Status", value: "OK" }],
    affected: ["warehouse-export"], errors: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  },
];

const railNav = [
  { icon: Inbox, label: "Inbox", active: true },
  { icon: Siren, label: "Alerts", active: false },
  { icon: Boxes, label: "Services", active: false },
  { icon: Activity, label: "Metrics", active: false },
];

export function CockpitArchetype() {
  const [activeId, setActiveId] = React.useState(threads[0].id);
  const active = threads.find((t) => t.id === activeId) ?? threads[0];

  return (
    <div className="flex h-dvh bg-background text-foreground">
      {/* ── Icon rail ────────────────────────────────────────────── */}
      <nav aria-label="Primary" className="hidden w-14 shrink-0 flex-col items-center gap-1 border-r border-border py-3 sm:flex">
        <span className="mb-2 grid size-8 place-items-center rounded-lg bg-brand text-brand-foreground">
          <Siren className="size-4" />
        </span>
        {railNav.map((n) => (
          <button
            key={n.label}
            type="button"
            aria-label={n.label}
            aria-current={n.active ? "page" : undefined}
            className={cn(
              "grid size-9 place-items-center rounded-lg outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
              n.active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            <n.icon className="size-4.5" />
          </button>
        ))}
        <span className="mt-auto grid size-9 place-items-center rounded-lg text-muted-foreground">
          <Settings className="size-4.5" />
        </span>
        <GradientAvatar seed="byron" size="sm" className="mt-1" />
      </nav>

      {/* ── Incident list ────────────────────────────────────────── */}
      <div className="hidden w-80 shrink-0 flex-col border-r border-border md:flex">
        <div className="flex h-12 items-center justify-between gap-2 border-b border-border px-4">
          <span className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <Inbox className="size-4 text-brand" />
            Incidents
          </span>
          <span className="font-mono text-xs text-muted-foreground">{threads.length} open</span>
        </div>
        <ScrollArea className="min-h-0 flex-1">
          <ul>
            {threads.map((t) => {
              const isActive = t.id === activeId;
              return (
                <li key={t.id} className="border-b border-border/70">
                  <button
                    type="button"
                    onClick={() => setActiveId(t.id)}
                    data-active={isActive}
                    className="relative flex w-full gap-3 py-3 pl-4 pr-3 text-left outline-none transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 data-[active=true]:bg-muted"
                  >
                    <span className={cn("absolute inset-y-2 left-0 w-0.5 rounded-full", isActive ? dotBar[t.tone] : "bg-transparent")} />
                    <StatusDot tone={t.tone} className="mt-1 shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate font-mono text-[11px] text-muted-foreground">{t.id}</span>
                        <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{t.time}</span>
                      </span>
                      <span className={cn("mt-0.5 block truncate text-sm", t.unread ? "font-semibold" : "font-medium")}>
                        {t.subject}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">{t.preview}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </div>

      {/* ── Detail ───────────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border px-4">
          <span className="flex items-center gap-2 truncate font-mono text-xs text-muted-foreground">
            Incidents
            <span aria-hidden>/</span>
            <span className="text-foreground">{active.id}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="hidden items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 lg:flex"
            >
              <Search className="size-3.5" />
              Search
              <kbd className="rounded border border-border bg-muted px-1 font-mono text-[10px]">⌘K</kbd>
            </button>
            <Button variant="outline" size="sm">
              <Archive data-icon="inline-start" />
              <span className="hidden sm:inline">Archive</span>
            </Button>
            <Button size="sm">
              <Check data-icon="inline-start" />
              Resolve
            </Button>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_300px]">
          <ScrollArea className="min-h-0">
            <div className="px-6 py-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={badgeFor[active.tone]}>{active.tag}</Badge>
                <span className="font-mono text-xs text-muted-foreground">{active.from} · {active.time} ago</span>
              </div>
              <h1 className="mt-2 text-xl font-semibold tracking-tight">{active.subject}</h1>

              <Tabs defaultValue="overview" className="mt-6 w-full">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="raw">Raw</TabsTrigger>
                </TabsList>
                <Separator className="my-4" />
                <TabsContent value="overview" className="space-y-6">
                  <p className="text-sm leading-relaxed text-muted-foreground">{active.detail}</p>
                  <div>
                    <h2 className="mb-2 text-xs font-medium text-muted-foreground">Error rate · last 30 min</h2>
                    <div className="rounded-xl border border-border bg-card p-4">
                      <Sparkline data={active.errors} fill className="h-12 text-destructive" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
                    {active.meta.map((m) => (
                      <div key={m.label} className="space-y-1">
                        <div className="text-xs font-medium text-muted-foreground">{m.label}</div>
                        <div className="font-mono text-sm">{m.value}</div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="activity">
                  <EventTimeline
                    events={[
                      { title: "Acknowledged by on-call", tone: "info", timestamp: `${active.time} ago` },
                      { title: "Auto-remediation triggered", tone: "warning", timestamp: "moments later", description: "Runbook step 2 executed." },
                      { title: "Alert opened", tone: "danger", timestamp: "at start", description: "Threshold breached for 4 consecutive minutes." },
                    ]}
                  />
                </TabsContent>
                <TabsContent value="raw">
                  <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-xs leading-relaxed">
{JSON.stringify({ id: active.id, severity: active.tag, priority: active.priority, ...Object.fromEntries(active.meta.map((m) => [m.label.toLowerCase(), m.value])) }, null, 2)}
                  </pre>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>

          {/* ── Properties rail ────────────────────────────────────── */}
          <aside className="hidden min-h-0 flex-col gap-5 border-l border-border bg-card/40 p-5 lg:flex">
            <div className="space-y-3">
              <Prop label="Status">
                <StatusPill tone={active.tone}>
                  {active.tone === "danger" ? "Firing" : active.tone === "warning" ? "Investigating" : active.tone === "success" ? "Resolved" : "Info"}
                </StatusPill>
              </Prop>
              <Prop label="Priority">
                <span className="flex items-center gap-1.5 text-sm font-medium">
                  <StatusDot tone={active.tone} />
                  {active.priority}
                </span>
              </Prop>
              <Prop label="Assignee">
                <span className="flex items-center gap-2 text-sm">
                  <GradientAvatar seed={active.assignee} size="sm" />
                  {active.assignee}
                </span>
              </Prop>
            </div>

            <Separator />

            <div>
              <h2 className="mb-2 text-xs font-medium text-muted-foreground">Affected services</h2>
              <div className="flex flex-wrap gap-1.5">
                {active.affected.map((s) => (
                  <span key={s} className="rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              {active.meta.map((m) => (
                <div key={m.label} className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className="font-mono">{m.value}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Prop({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}
