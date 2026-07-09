"use client"

import * as React from "react"
import { AppWindow, GitBranch, MessageSquare, Plug, Zap } from "lucide-react"

import {
  SettingsList,
  SettingsPageIntro,
  SettingsSection,
  SettingsShell,
} from "@/components/linear/settings-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type Application = {
  id: string
  name: string
  description: string
  status: "Connected" | "Authorized" | "Needs attention"
  lastUsed: string
  icon: React.ReactNode
  actionLabel: string
}

const APPLICATIONS: Application[] = [
  {
    id: "github",
    name: "GitHub",
    description: "Link pull requests and automate issue status from commits.",
    status: "Connected",
    lastUsed: "2 hours ago",
    icon: <GitBranch className="size-4" />,
    actionLabel: "Manage",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Post issue updates and create issues from Slack messages.",
    status: "Connected",
    lastUsed: "Yesterday",
    icon: <MessageSquare className="size-4" />,
    actionLabel: "Manage",
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "OAuth application authorized to access your workspace.",
    status: "Authorized",
    lastUsed: "1 week ago",
    icon: <Zap className="size-4" />,
    actionLabel: "Revoke",
  },
  {
    id: "linear-cli",
    name: "Linear CLI",
    description: "Personal OAuth client for local scripts and automation.",
    status: "Authorized",
    lastUsed: "2 days ago",
    icon: <AppWindow className="size-4" />,
    actionLabel: "Revoke",
  },
  {
    id: "figma",
    name: "Figma",
    description: "Embed design files and sync comments to issues.",
    status: "Needs attention",
    lastUsed: "Never",
    icon: <Plug className="size-4" />,
    actionLabel: "Reconnect",
  },
]

function statusVariant(
  status: Application["status"]
): "secondary" | "outline" | "destructive" {
  if (status === "Connected") return "secondary"
  if (status === "Authorized") return "outline"
  return "destructive"
}

function ApplicationRow({ app }: { app: Application }) {
  return (
    <div
      data-slot="linear-application-row"
      className="flex items-start justify-between gap-4 border-b border-border px-4 py-3 last:border-b-0"
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted/30 text-muted-foreground">
          {app.icon}
        </span>
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-foreground">{app.name}</p>
            <Badge variant={statusVariant(app.status)} className="font-normal">
              {app.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{app.description}</p>
          <p className="font-mono text-[11px] text-muted-foreground">
            Last used {app.lastUsed}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="sm" className="shrink-0">
        {app.actionLabel}
      </Button>
    </div>
  )
}

export default function ApplicationsSettingsPage() {
  return (
    <SettingsShell title="Applications" activeId="applications">
      <SettingsPageIntro
        title="Applications"
        description="OAuth applications and connected integrations for this workspace."
      />

      <SettingsSection title="Connected integrations">
        <SettingsList>
          {APPLICATIONS.filter((app) => app.status !== "Authorized").map(
            (app) => (
              <ApplicationRow key={app.id} app={app} />
            )
          )}
        </SettingsList>
      </SettingsSection>

      <SettingsSection title="Authorized OAuth applications">
        <SettingsList>
          {APPLICATIONS.filter((app) => app.status === "Authorized").map(
            (app) => (
              <ApplicationRow key={app.id} app={app} />
            )
          )}
        </SettingsList>
      </SettingsSection>
    </SettingsShell>
  )
}
