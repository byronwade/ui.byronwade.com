"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import {
  SettingsBackLink,
  SettingsFieldRow,
  SettingsFormGroup,
  SettingsSection,
  SettingsShell,
} from "@/components/linear/settings-shell"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const PERMISSIONS = [
  {
    id: "settings",
    label: "Settings management",
    description: "Who can manage the team's settings and workflows.",
    value: "all",
  },
  {
    id: "label",
    label: "Label management",
    description: "Who can create, update, and delete team labels.",
    value: "all",
  },
  {
    id: "template",
    label: "Template management",
    description: "Who can manage team templates and recurring issues.",
    value: "all",
  },
  {
    id: "member",
    label: "Member management",
    description: "Who can add or remove team members — excludes guests.",
    value: "owners",
  },
]

export default function AsMobbinAccessPage() {
  const { setTheme } = useTheme()
  const [isPrivate, setIsPrivate] = React.useState(true)

  React.useEffect(() => {
    setTheme("light")
  }, [setTheme])

  return (
    <SettingsShell title="Access and permissions" activeId="teams" wide>
      <SettingsBackLink href="/settings/teams/as-mobbin">AS Mobbin</SettingsBackLink>

      <div className="space-y-1">
        <h1 className="text-xl font-medium tracking-tight text-foreground">
          Access and permissions
        </h1>
        <p className="text-sm text-muted-foreground">
          All workspace admins are automatically considered team owners
        </p>
      </div>

      <SettingsSection
        title="Team access"
        description="Optionally restrict team visibility and membership."
      >
        <SettingsFormGroup>
          <SettingsFieldRow
            label="Change team visibility"
            description={isPrivate ? "This team is private." : undefined}
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => setIsPrivate((value) => !value)}
            >
              {isPrivate ? "Make public…" : "Make private…"}
            </Button>
          </SettingsFieldRow>
          <SettingsFieldRow
            label="Restrict membership"
            description="Choose how members can be added to this team."
            className={isPrivate ? undefined : "opacity-50"}
          >
            <Select defaultValue={isPrivate ? "invite" : "join"}>
              <SelectTrigger className="h-8 w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="join">Allow members to join</SelectItem>
                <SelectItem value="invite">Require invite to join</SelectItem>
              </SelectContent>
            </Select>
          </SettingsFieldRow>
        </SettingsFormGroup>
      </SettingsSection>

      <SettingsSection
        title="Team permissions"
        description="Choose who can perform various actions within this team."
      >
        <SettingsFormGroup>
          {PERMISSIONS.map((permission) => (
            <SettingsFieldRow
              key={permission.id}
              label={permission.label}
              description={permission.description}
            >
              <Select defaultValue={permission.value}>
                <SelectTrigger className="h-8 w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All team members</SelectItem>
                  <SelectItem value="owners">Only team owners</SelectItem>
                </SelectContent>
              </Select>
            </SettingsFieldRow>
          ))}
        </SettingsFormGroup>
      </SettingsSection>
    </SettingsShell>
  )
}
