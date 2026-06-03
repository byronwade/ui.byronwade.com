"use client";

// Rich-inventory archetype — a directory led by a dense, filterable table.
// uses: Table, SegmentedControl, FilterPill, StatusPill, StatusDot, GradientAvatar, InputGroup, Button, Sparkline
//
// Design: a full-height "data surface" in the Linear/Bloomberg lineage — a saved-views
// rail on the left, a tiled summary strip, and a dense table where every row carries an
// inline 7-day load sparkline and a usage bar. The grid is edge-to-edge with 1px seams;
// only the rail and toolbar float above it.
import * as React from "react";
import { Download, Plus, Search, SlidersHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { FilterPill } from "@/components/ui/filter-pill";
import { StatusPill } from "@/components/status-pill";
import { StatusDot, type StatusTone } from "@/components/ui/status-dot";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Sparkline } from "@/app/layouts/_components/spark";

type View = "all" | "production" | "degraded" | "idle";
type Sort = "name" | "usage";

interface Service {
  id: string;
  name: string;
  env: string;
  owner: string;
  region: string;
  usage: number;
  status: StatusTone;
  statusLabel: string;
  load: number[];
}

const services: Service[] = [
  { id: "1", name: "checkout-api", env: "production", owner: "Ana Reyes", region: "us-east-1", usage: 82, status: "warning", statusLabel: "Degraded", load: [40, 52, 48, 61, 70, 66, 78, 82] },
  { id: "2", name: "web-storefront", env: "production", owner: "Liam Cho", region: "global", usage: 47, status: "success", statusLabel: "Healthy", load: [38, 41, 39, 44, 46, 45, 48, 47] },
  { id: "3", name: "jobs-worker", env: "production", owner: "Priya Nair", region: "eu-west-1", usage: 64, status: "success", statusLabel: "Healthy", load: [55, 58, 52, 60, 63, 61, 66, 64] },
  { id: "4", name: "billing-web", env: "production", owner: "Marc Vidal", region: "us-east-1", usage: 31, status: "success", statusLabel: "Healthy", load: [28, 30, 27, 33, 31, 34, 30, 31] },
  { id: "5", name: "search-index", env: "staging", owner: "Sara Kim", region: "us-west-2", usage: 4, status: "neutral", statusLabel: "Idle", load: [6, 4, 5, 3, 4, 2, 3, 4] },
  { id: "6", name: "analytics-etl", env: "production", owner: "Tom Boyd", region: "eu-west-1", usage: 1, status: "neutral", statusLabel: "Idle", load: [2, 1, 3, 0, 1, 0, 2, 1] },
  { id: "7", name: "auth-gateway", env: "production", owner: "Ana Reyes", region: "global", usage: 58, status: "success", statusLabel: "Healthy", load: [50, 54, 49, 56, 60, 57, 59, 58] },
  { id: "8", name: "media-transcode", env: "production", owner: "Liam Cho", region: "ap-south-1", usage: 91, status: "danger", statusLabel: "Critical", load: [60, 68, 72, 80, 84, 88, 90, 91] },
];

const views: { id: View; label: string; match: (s: Service) => boolean }[] = [
  { id: "all", label: "All services", match: () => true },
  { id: "production", label: "Production", match: (s) => s.env === "production" },
  { id: "degraded", label: "Needs attention", match: (s) => s.status === "warning" || s.status === "danger" },
  { id: "idle", label: "Idle", match: (s) => s.status === "neutral" },
];

const usageTone = (u: number) =>
  u >= 85 ? "bg-destructive" : u >= 70 ? "bg-warning" : "bg-brand";

export function RichInventoryArchetype() {
  const [query, setQuery] = React.useState("");
  const [view, setView] = React.useState<View>("all");
  const [sort, setSort] = React.useState<Sort>("usage");

  const activeView = views.find((v) => v.id === view) ?? views[0];
  const filtered = services
    .filter(
      (s) =>
        activeView.match(s) &&
        (s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.owner.toLowerCase().includes(query.toLowerCase())),
    )
    .sort((a, b) =>
      sort === "usage" ? b.usage - a.usage : a.name.localeCompare(b.name),
    );

  const summary: { label: string; value: React.ReactNode; tone?: string }[] = [
    { label: "Services", value: services.length },
    { label: "Healthy", value: services.filter((s) => s.status === "success").length, tone: "text-success" },
    { label: "Attention", value: services.filter((s) => s.status === "warning" || s.status === "danger").length, tone: "text-warning" },
    { label: "Avg load", value: `${Math.round(services.reduce((a, s) => a + s.usage, 0) / services.length)}%` },
  ];

  return (
    <div className="flex h-dvh bg-background text-foreground">
      {/* ── Views rail ───────────────────────────────────────────── */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card/40 lg:flex">
        <div className="flex h-14 items-center gap-2 border-b border-border px-4 font-semibold tracking-tight">
          <span className="grid size-6 place-items-center rounded-md bg-brand text-brand-foreground text-xs">A</span>
          Acme Cloud
        </div>
        <nav aria-label="Saved views" className="flex flex-col gap-0.5 p-2">
          <p className="px-2 pb-1 pt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Views</p>
          {views.map((v) => {
            const count = services.filter(v.match).length;
            const active = v.id === view;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setView(v.id)}
                aria-pressed={active}
                className={cn(
                  "flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                  active ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                {v.label}
                <span className="font-mono text-xs tabular-nums text-muted-foreground">{count}</span>
              </button>
            );
          })}
          <p className="px-2 pb-1 pt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Regions</p>
          {["us-east-1", "eu-west-1", "ap-south-1", "global"].map((r) => (
            <div key={r} className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 font-mono text-xs text-muted-foreground">
              <StatusDot tone={r === "ap-south-1" ? "warning" : "success"} />
              {r}
            </div>
          ))}
        </nav>
        <div className="mt-auto flex items-center gap-2 border-t border-border p-3">
          <GradientAvatar seed="byron" size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Byron Wade</p>
            <p className="truncate text-xs text-muted-foreground">Platform team</p>
          </div>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border px-5">
          <div>
            <h1 className="text-base font-semibold tracking-tight">Deployments</h1>
            <p className="hidden text-xs text-muted-foreground sm:block">Every service across your regions, at a glance.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download data-icon="inline-start" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button size="sm">
              <Plus data-icon="inline-start" />
              New service
            </Button>
          </div>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
          <div className="w-full max-w-xs">
            <InputGroup>
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search services or owners…"
              />
            </InputGroup>
          </div>
          <div className="flex items-center gap-2">
            <FilterPill icon={<SlidersHorizontal className="size-3.5" />}>Region</FilterPill>
            <SegmentedControl
              value={sort}
              onValueChange={(v) => setSort(v as Sort)}
              options={[
                { label: "Usage", value: "usage" },
                { label: "Name", value: "name" },
              ]}
            />
          </div>
        </div>

        {/* summary strip */}
        <div className="grid grid-cols-2 gap-px border-b border-border bg-border sm:grid-cols-4">
          {summary.map((s) => (
            <div key={s.label} className="bg-background px-5 py-3">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className={cn("text-lg font-semibold tabular-nums", s.tone)}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* data surface */}
        <div className="min-h-0 flex-1 overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow>
                <TableHead className="pl-5">Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Owner</TableHead>
                <TableHead className="hidden lg:table-cell">Region</TableHead>
                <TableHead className="hidden sm:table-cell">Load · 7d</TableHead>
                <TableHead className="pr-5 text-right">Usage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id} className="group">
                  <TableCell className="pl-5">
                    <div className="font-medium">{s.name}</div>
                    <div className="font-mono text-xs text-muted-foreground">{s.env}</div>
                  </TableCell>
                  <TableCell>
                    <StatusPill tone={s.status}>{s.statusLabel}</StatusPill>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <GradientAvatar seed={s.owner} size="sm" />
                      <span className="text-sm">{s.owner}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden font-mono text-muted-foreground lg:table-cell">{s.region}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Sparkline
                      data={s.load}
                      width={88}
                      height={24}
                      className={cn(
                        "h-6 w-24",
                        s.status === "danger" ? "text-destructive" : s.status === "warning" ? "text-warning" : "text-brand",
                      )}
                    />
                  </TableCell>
                  <TableCell className="pr-5">
                    <div className="flex items-center justify-end gap-2">
                      <div className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-muted sm:block">
                        <div className={cn("h-full rounded-full", usageTone(s.usage))} style={{ width: `${s.usage}%` }} />
                      </div>
                      <span className="w-9 text-right font-mono text-sm tabular-nums">{s.usage}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-16 text-center text-muted-foreground">
                    No services match “{query}”.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <footer className="flex shrink-0 items-center justify-between border-t border-border px-5 py-3 text-sm text-muted-foreground">
          <span>
            Showing <span className="font-medium text-foreground tabular-nums">{filtered.length}</span> of {services.length}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
