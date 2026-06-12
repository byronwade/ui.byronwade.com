"use client"

// Split + rail archetype, settings with a sticky nav rail and explain-everything rows.
// uses: Section, SettingRow, SettingsList, Switch, Select, Input, SplitWithRail, GradientAvatar, Button
//
// Design: a full-height settings *application*, not a centered document. A grouped icon
// rail with an account header sits beside a scrolling pane of explain-everything rows;
// editing anything reveals a sticky, glassy "unsaved changes" save bar, the premium
// detail real settings surfaces (Linear, Vercel) ship and generic ones omit.
import * as React from "react"
import {
  Bell,
  CaretLeft,
  CreditCard,
  GearSix,
  ShieldCheck,
  Users,
} from "@/lib/icons"

import { cn } from "@/lib/utils"
import { Section, SettingRow, SettingsList } from "@/components/section"
import { SplitWithRail } from "@/components/split-with-rail"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GradientAvatar } from "@/components/ui/gradient-avatar"
import { StatusPill } from "@/components/status-pill"

type Pane = "general" | "members" | "billing" | "notifications" | "security"

const nav: {
  group: string
  items: { id: Pane; label: string; icon: typeof GearSix }[]
}[] = [
  {
    group: "Workspace",
    items: [
      { id: "general", label: "General", icon: GearSix },
      { id: "members", label: "Members", icon: Users },
      { id: "billing", label: "Billing", icon: CreditCard },
    ],
  },
  {
    group: "Account",
    items: [
      { id: "notifications", label: "Notifications", icon: Bell },
      { id: "security", label: "Security", icon: ShieldCheck },
    ],
  },
]

const members = [
  {
    name: "Ana Reyes",
    email: "ana@acme.com",
    role: "Owner",
    tone: "success" as const,
    status: "Active",
  },
  {
    name: "Liam Cho",
    email: "liam@acme.com",
    role: "Admin",
    tone: "success" as const,
    status: "Active",
  },
  {
    name: "Priya Nair",
    email: "priya@acme.com",
    role: "Member",
    tone: "warning" as const,
    status: "Invited",
  },
]

const invoices = [
  { id: "INV-0042", date: "Jun 1, 2026", amount: "$480.00" },
  { id: "INV-0041", date: "May 1, 2026", amount: "$480.00" },
  { id: "INV-0040", date: "Apr 1, 2026", amount: "$440.00" },
]

const sessions = [
  { device: "MacBook Pro · Chrome", where: "San Francisco, US", current: true },
  { device: "iPhone 16 · Safari", where: "San Francisco, US", current: false },
]

const paneTitle: Record<Pane, { title: string; description: string }> = {
  general: {
    title: "General",
    description: "Basic information about your workspace.",
  },
  members: {
    title: "Members",
    description: "Manage who has access to this workspace.",
  },
  billing: { title: "Billing", description: "Plan, usage, and invoices." },
  notifications: {
    title: "Notifications",
    description: "Choose what lands in your inbox.",
  },
  security: {
    title: "Security",
    description: "Authentication and active sessions.",
  },
}

export function SplitRailArchetype() {
  const [pane, setPane] = React.useState<Pane>("general")
  const [dirty, setDirty] = React.useState(false)
  const touch = () => setDirty(true)

  const head = paneTitle[pane]

  return (
    <div className="flex h-dvh bg-background text-foreground">
      {/* ── Settings rail ────────────────────────────────────────── */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card/40 md:flex">
        <button
          type="button"
          className="flex h-14 items-center gap-2 border-b border-border px-4 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground"
        >
          <CaretLeft className="size-4" />
          Back to app
        </button>

        <div className="flex items-center gap-3 px-4 py-4">
          <GradientAvatar seed="acme" size="lg" className="rounded-xl" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Acme Inc.</p>
            <p className="truncate text-xs text-muted-foreground">
              Team plan · 12 seats
            </p>
          </div>
        </div>

        <nav
          aria-label="Settings sections"
          className="flex-1 space-y-4 overflow-y-auto px-2 pb-4"
        >
          {nav.map((g) => (
            <div key={g.group}>
              <p className="px-2 pb-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                {g.group}
              </p>
              <div className="space-y-0.5">
                {g.items.map((n) => {
                  const active = n.id === pane
                  return (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => setPane(n.id)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                        active
                          ? "bg-muted font-medium text-foreground"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                      )}
                    >
                      {active && (
                        <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-brand" />
                      )}
                      <n.icon className="size-4" />
                      {n.label}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* ── Main pane ────────────────────────────────────────────── */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl px-6 py-10">
            <header className="mb-8">
              <h1 className="text-xl font-semibold tracking-tight">
                {head.title}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {head.description}
              </p>
            </header>

            <div className="space-y-8">
              {pane === "general" && (
                <>
                  <Section
                    title="Workspace"
                    description="How your workspace appears across Acme."
                  >
                    <div className="space-y-4 p-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="ws-name">Name</Label>
                        <Input
                          id="ws-name"
                          defaultValue="Acme Inc."
                          onChange={touch}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Default region</Label>
                        <Select defaultValue="us" onValueChange={touch}>
                          <SelectTrigger className="w-full sm:w-72">
                            <SelectValue placeholder="Select a region" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">
                              US East (N. Virginia)
                            </SelectItem>
                            <SelectItem value="eu">
                              EU West (Ireland)
                            </SelectItem>
                            <SelectItem value="ap">
                              Asia Pacific (Singapore)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Section>

                  <Section
                    title="Preferences"
                    description="Defaults applied across the workspace."
                  >
                    <SettingsList>
                      <SettingRow
                        title="Compact mode"
                        description="Reduce spacing for dense screens."
                        control={<Switch onCheckedChange={touch} />}
                      />
                      <SettingRow
                        title="Usage analytics"
                        description="Share anonymous usage data to help improve the product."
                        control={
                          <Switch defaultChecked onCheckedChange={touch} />
                        }
                      />
                      <SettingRow
                        title="Beta features"
                        description="Get early access to features still in development."
                        control={<Switch onCheckedChange={touch} />}
                      />
                    </SettingsList>
                  </Section>
                </>
              )}

              {pane === "members" && (
                <Section
                  title="Members"
                  action={<Button size="sm">Invite</Button>}
                >
                  <div className="divide-y divide-border">
                    {members.map((m) => (
                      <div
                        key={m.email}
                        className="flex items-center justify-between gap-3 px-5 py-4"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <GradientAvatar seed={m.name} size="md" />
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium">
                              {m.name}
                            </div>
                            <div className="truncate text-xs text-muted-foreground">
                              {m.email}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="hidden text-xs text-muted-foreground sm:inline">
                            {m.role}
                          </span>
                          <StatusPill tone={m.tone}>{m.status}</StatusPill>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {pane === "billing" && (
                <SplitWithRail
                  summary={
                    <Section
                      title="Plan"
                      description="You are on the Team plan, billed monthly."
                    >
                      <div className="space-y-4 p-5">
                        <div className="flex items-center gap-3">
                          <div className="grid size-9 place-items-center rounded-lg bg-brand/10 text-brand">
                            <CreditCard className="size-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              Team · $40 / seat
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Renews Jul 1, 2026
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Seats used</span>
                            <span className="font-mono tabular-nums">
                              9 / 12
                            </span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                            <div className="h-full w-3/4 rounded-full bg-brand" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm">Upgrade</Button>
                          <Button variant="outline" size="sm">
                            Manage seats
                          </Button>
                        </div>
                      </div>
                    </Section>
                  }
                  rail={
                    <Section title="Invoices">
                      <div className="divide-y divide-border">
                        {invoices.map((inv) => (
                          <div
                            key={inv.id}
                            className="flex items-center justify-between px-5 py-3 text-sm"
                          >
                            <span className="font-mono">{inv.id}</span>
                            <span className="text-muted-foreground">
                              {inv.date}
                            </span>
                            <span className="font-medium tabular-nums">
                              {inv.amount}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Section>
                  }
                />
              )}

              {pane === "notifications" && (
                <Section
                  title="Email notifications"
                  description="Choose what lands in your inbox."
                >
                  <SettingsList>
                    <SettingRow
                      title="Incidents"
                      description="Critical and high-severity alerts."
                      control={
                        <Switch defaultChecked onCheckedChange={touch} />
                      }
                    />
                    <SettingRow
                      title="Deploys"
                      description="When a release ships to production."
                      control={
                        <Switch defaultChecked onCheckedChange={touch} />
                      }
                    />
                    <SettingRow
                      title="Weekly digest"
                      description="A Monday summary of activity."
                      control={<Switch onCheckedChange={touch} />}
                    />
                  </SettingsList>
                </Section>
              )}

              {pane === "security" && (
                <>
                  <Section
                    title="Authentication"
                    description="Protect your account with an extra layer."
                  >
                    <SettingsList>
                      <SettingRow
                        title="Two-factor authentication"
                        description="Require a one-time code at sign-in."
                        control={
                          <Switch defaultChecked onCheckedChange={touch} />
                        }
                      />
                      <SettingRow
                        title="Password"
                        description="Last changed 3 months ago."
                        control={
                          <Button variant="outline" size="sm">
                            Change
                          </Button>
                        }
                      />
                    </SettingsList>
                  </Section>
                  <Section title="Active sessions">
                    <div className="divide-y divide-border">
                      {sessions.map((s) => (
                        <div
                          key={s.device}
                          className="flex items-center justify-between px-5 py-4"
                        >
                          <div>
                            <div className="text-sm font-medium">
                              {s.device}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {s.where}
                            </div>
                          </div>
                          {s.current ? (
                            <StatusPill tone="success">This device</StatusPill>
                          ) : (
                            <Button variant="ghost" size="sm">
                              Revoke
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </Section>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Sticky save bar ──────────────────────────────────────── */}
        <div
          aria-hidden={!dirty}
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 border-t border-border bg-card/85 px-6 py-3 edge backdrop-blur transition-all duration-300",
            dirty ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
          )}
        >
          <p className="text-sm text-muted-foreground">
            You have unsaved changes.
          </p>
          <div
            className={cn(
              "flex items-center gap-2",
              dirty && "pointer-events-auto",
            )}
          >
            <Button variant="ghost" size="sm" onClick={() => setDirty(false)}>
              Discard
            </Button>
            <Button size="sm" onClick={() => setDirty(false)}>
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
