"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Laptop } from "lucide-react"

import {
  SettingsBackLink,
  SettingsFieldRow,
  SettingsFormGroup,
  SettingsPageIntro,
  SettingsSection,
  SettingsShell,
} from "@/components/linear/settings-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function CreateTeamPage() {
  const { setTheme } = useTheme()
  const [name, setName] = React.useState("Engineering Team")
  const [identifier, setIdentifier] = React.useState("ENG")

  React.useEffect(() => {
    setTheme("light")
  }, [setTheme])

  return (
    <SettingsShell title="Create a new team" activeId="join-team" wide>
      <SettingsBackLink href="/settings/teams/engineering">Teams</SettingsBackLink>

      <SettingsPageIntro
        title="Create a new team"
        description="Create a new team to manage separate cycles, workflows and notifications."
      />

      <SettingsSection title="">
        <SettingsFormGroup>
          <SettingsFieldRow label="Team icon">
            <span className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-muted/30">
              <Laptop className="size-4 text-muted-foreground" />
            </span>
          </SettingsFieldRow>
          <SettingsFieldRow label="Team name">
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Engineering"
              className="h-8 w-[220px]"
            />
          </SettingsFieldRow>
          <SettingsFieldRow
            label="Identifier"
            description="Used to identify issues from this team (e.g. ENG-123)."
          >
            <Input
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="e.g. ENG"
              className="h-8 w-[100px] font-mono"
            />
          </SettingsFieldRow>
        </SettingsFormGroup>
      </SettingsSection>

      <SettingsSection
        title="Team hierarchy"
        description="Teams can be nested to reflect your team structure and to share workflows and settings."
      >
        <SettingsFormGroup>
          <SettingsFieldRow
            label="Parent team"
            trailing={
              <span className="text-xs text-muted-foreground">
                Available on Business
              </span>
            }
          />
        </SettingsFormGroup>
      </SettingsSection>

      <SettingsSection
        title="Copy settings from existing team"
        description="Workflow and cycle settings are copied, but Slack notifications and members are not."
      >
        <SettingsFormGroup>
          <SettingsFieldRow label="Copy from team">
            <Select defaultValue="none">
              <SelectTrigger className="h-8 w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Don&apos;t copy</SelectItem>
                <SelectItem value="as-mobbin">AS Mobbin</SelectItem>
              </SelectContent>
            </Select>
          </SettingsFieldRow>
        </SettingsFormGroup>
      </SettingsSection>

      <SettingsSection
        title="Timezone"
        description="Team cycles and times are relative to this timezone."
      >
        <SettingsFormGroup>
          <SettingsFieldRow label="Timezone">
            <Select defaultValue="sgt">
              <SelectTrigger className="h-8 w-[280px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sgt">
                  GMT+8:00 – Singapore Standard Time
                </SelectItem>
                <SelectItem value="pst">GMT-8:00 – Pacific Time</SelectItem>
              </SelectContent>
            </Select>
          </SettingsFieldRow>
        </SettingsFormGroup>
      </SettingsSection>

      <SettingsSection
        title="Make team private"
        description="Private teams are only visible to members. Public teams are visible to all workspace members."
      >
        <SettingsFormGroup>
          <SettingsFieldRow
            label="Private team"
            trailing={
              <span className="text-xs text-muted-foreground">
                Available on Business
              </span>
            }
          />
        </SettingsFormGroup>
      </SettingsSection>

      <div className="flex justify-end">
        <Button size="sm" render={<Link href="/settings/teams/engineering" />}>
          Create team
        </Button>
      </div>
    </SettingsShell>
  )
}
