"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  Circle,
  Flame,
  Plus,
  X,
} from "lucide-react"

import {
  SettingsList,
  SettingsPageIntro,
  SettingsSection,
  SettingsShell,
  SettingsToggleRow,
} from "@/components/linear/settings-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function IssueSlasPage() {
  const { setTheme } = useTheme()
  const [enabled, setEnabled] = React.useState(true)
  const [editing, setEditing] = React.useState(true)

  React.useEffect(() => {
    setTheme("light")
  }, [setTheme])

  return (
    <SettingsShell title="SLAs" activeId="issue-slas">
      <SettingsPageIntro
        title="SLAs"
        description={
          <>
            Service-level agreements help teams track response and resolution
            targets.{" "}
            <Link
              href="https://linear.app/docs/sla"
              className="inline-flex items-center gap-0.5 underline-offset-2 hover:underline"
            >
              Docs
            </Link>
          </>
        }
      />

      <SettingsSection title="General">
        <SettingsList>
          <SettingsToggleRow
            title="Enable SLAs"
            description="Track SLA targets on issues across your workspace."
            checked={enabled}
            onCheckedChange={setEnabled}
          />
          <div
            data-slot="linear-settings-select-row"
            className="flex items-center justify-between gap-4 px-4 py-3"
          >
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Work week</p>
              <p className="text-xs text-muted-foreground">
                Days used when calculating SLA durations
              </p>
            </div>
            <Select defaultValue="mon-fri">
              <SelectTrigger className="h-8 w-[120px]">
                <SelectValue placeholder="Work week" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mon-fri">Mon–Fri</SelectItem>
                <SelectItem value="mon-sat">Mon–Sat</SelectItem>
                <SelectItem value="all">All days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </SettingsList>
      </SettingsSection>

      <SettingsSection
        title="Automation rules"
        description="Automatically add or remove SLAs based on issue properties."
      >
        <div className="flex items-center justify-between">
          <span />
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Add rule
          </Button>
        </div>

        <div className="space-y-3">
          {editing ? (
            <div data-slot="linear-sla-rule-card" className="rounded-lg border border-border bg-card p-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-xs text-muted-foreground">When</span>
                  <Badge variant="secondary" className="gap-1 font-normal">
                    Priority
                  </Badge>
                  <span className="text-muted-foreground">is</span>
                  <Badge variant="secondary" className="gap-1 pr-1 font-normal">
                    <span className="size-2 rounded-sm bg-destructive" />
                    Urgent
                    <button type="button" className="rounded-sm p-0.5 hover:bg-muted/50">
                      <X className="size-3" />
                    </button>
                  </Badge>
                  <button
                    type="button"
                    className="inline-flex size-6 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted/30"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-xs text-muted-foreground">Then</span>
                  <Select defaultValue="add">
                    <SelectTrigger className="h-8 w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="add">Add SLA</SelectItem>
                      <SelectItem value="remove">Remove SLA</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="12h">
                    <SelectTrigger className="h-8 w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12 hours</SelectItem>
                      <SelectItem value="24h">24 hours</SelectItem>
                      <SelectItem value="48h">48 hours</SelectItem>
                      <SelectItem value="1w">1 week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={() => setEditing(false)}>
                  Save
                </Button>
              </div>
            </div>
          ) : null}

          <div data-slot="linear-sla-rule-card" className="rounded-lg border border-border bg-card px-4 py-3">
            <p className="text-sm">
              <span className="text-muted-foreground">When </span>
              Priority is{" "}
              <Badge variant="secondary" className="mx-0.5 gap-1 font-normal">
                <span className="size-2 rounded-sm bg-destructive" />
                Urgent
              </Badge>
              <span className="text-muted-foreground"> Then </span>
              <Badge variant="secondary" className="mx-0.5 gap-1 font-normal">
                <Flame className="size-3 text-brand" />
                Add SLA of 24 hours
              </Badge>
            </p>
          </div>

          <div data-slot="linear-sla-rule-card" className="rounded-lg border border-border bg-card px-4 py-3">
            <p className="text-sm">
              <span className="text-muted-foreground">When </span>
              Priority is{" "}
              <Badge variant="secondary" className="mx-0.5 gap-1 font-normal">
                High
              </Badge>
              <span className="text-muted-foreground"> Then </span>
              <Badge variant="secondary" className="mx-0.5 gap-1 font-normal">
                <Flame className="size-3 text-brand" />
                Add SLA of 1 week
              </Badge>
            </p>
          </div>

          <div data-slot="linear-sla-rule-card" className="rounded-lg border border-border bg-card px-4 py-3">
            <p className="text-sm">
              <span className="text-muted-foreground">When </span>
              Priority is{" "}
              <Badge variant="secondary" className="mx-0.5 gap-1 font-normal">
                Medium
              </Badge>
              <span className="text-muted-foreground"> Then </span>
              <Badge variant="secondary" className="mx-0.5 gap-1 font-normal">
                <Circle className="size-3" />
                Remove SLA
              </Badge>
            </p>
          </div>
        </div>
      </SettingsSection>
    </SettingsShell>
  )
}
