"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"

import {
  SettingsBackLink,
  SettingsFormCard,
  SettingsPageIntro,
  SettingsShell,
} from "@/components/linear/settings-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function CreateApiKeyPage() {
  const router = useRouter()
  const [permissionMode, setPermissionMode] = React.useState("custom")
  const [teamMode, setTeamMode] = React.useState("selected")
  const [read, setRead] = React.useState(true)
  const [write, setWrite] = React.useState(true)

  return (
    <SettingsShell title="Create API key" activeId="api">
      <SettingsBackLink href="/settings/security">Security settings</SettingsBackLink>

      <SettingsPageIntro
        title="Create API key"
        description="When using the API key, requests are made on your behalf. Keep keys secure and rotate them regularly."
      />

      <SettingsFormCard
        footer={
          <>
            <Button variant="ghost" size="sm" render={<Link href="/settings/api" />}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => router.push("/settings/api")}>
              Create
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="key-name">Key name</Label>
            <Input id="key-name" placeholder="A descriptive name for this API key…" />
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">Permissions</p>
              <p className="text-xs text-muted-foreground">
                Control what this key can read and write in your workspace.
              </p>
            </div>
            <RadioGroup
              value={permissionMode}
              onValueChange={setPermissionMode}
              className="gap-3"
            >
              <label className="flex cursor-pointer items-start gap-3">
                <RadioGroupItem value="full" className="mt-0.5" />
                <span className="text-sm">Full access</span>
              </label>
              <label className="flex cursor-pointer items-start gap-3">
                <RadioGroupItem value="custom" className="mt-0.5" />
                <span className="text-sm">Only select permissions…</span>
              </label>
            </RadioGroup>

            {permissionMode === "custom" ? (
              <div
                data-slot="linear-settings-permission-list"
                className="ml-7 space-y-3 border-l border-border pl-4"
              >
                <label className="flex items-start gap-3">
                  <Checkbox checked={read} onCheckedChange={(v) => setRead(v === true)} />
                  <div className="space-y-0.5">
                    <span className="text-sm font-medium">Read</span>
                    <p className="text-xs text-muted-foreground">
                      Read issues, projects, and comments
                    </p>
                  </div>
                </label>
                <label className="flex items-start gap-3">
                  <Checkbox checked={write} onCheckedChange={(v) => setWrite(v === true)} />
                  <div className="space-y-0.5">
                    <span className="text-sm font-medium">Write</span>
                    <p className="text-xs text-muted-foreground">
                      Create and update issues and comments
                    </p>
                  </div>
                </label>
                <label className="flex items-start gap-3 opacity-60">
                  <Checkbox disabled />
                  <div className="space-y-0.5">
                    <span className="text-sm font-medium">Admin</span>
                    <p className="text-xs text-muted-foreground">
                      Manage workspace settings and members
                    </p>
                  </div>
                </label>
              </div>
            ) : null}
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">Team access</p>
              <p className="text-xs text-muted-foreground">
                Limit this key to specific teams or grant workspace-wide access.
              </p>
            </div>
            <RadioGroup value={teamMode} onValueChange={setTeamMode} className="gap-3">
              <label className="flex cursor-pointer items-start gap-3">
                <RadioGroupItem value="all" className="mt-0.5" />
                <span className="text-sm">All teams you have access to</span>
              </label>
              <label className="flex cursor-pointer items-start gap-3">
                <RadioGroupItem value="selected" className="mt-0.5" />
                <span className="text-sm">Only select teams…</span>
              </label>
            </RadioGroup>

            {teamMode === "selected" ? (
              <div
                data-slot="linear-settings-team-select"
                className="flex min-h-9 flex-wrap items-center gap-2 rounded-md border border-border bg-background px-3 py-2"
              >
                <Badge variant="secondary" className="gap-1 pr-1">
                  AS Mobbin
                  <button type="button" className="rounded-sm p-0.5 hover:bg-muted/50">
                    <X className="size-3" />
                  </button>
                </Badge>
                <span className="text-xs text-muted-foreground">Select teams…</span>
              </div>
            ) : null}
          </div>
        </div>
      </SettingsFormCard>
    </SettingsShell>
  )
}
