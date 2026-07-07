"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Globe } from "lucide-react"

import {
  SettingsBackLink,
  SettingsFieldRow,
  SettingsFormGroup,
  SettingsPageIntro,
  SettingsSection,
  SettingsShell,
  SettingsSubheading,
  SettingsToggleRow,
} from "@/components/linear/settings-shell"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AsMobbinTeamGeneralPage() {
  const { setTheme } = useTheme()
  const [name, setName] = React.useState("AS Mobbin")
  const [identifier, setIdentifier] = React.useState("ASMOB")
  const [allowZero, setAllowZero] = React.useState(false)
  const [extendedScale, setExtendedScale] = React.useState(true)
  const [countUnestimated, setCountUnestimated] = React.useState(true)
  const [emailIssues, setEmailIssues] = React.useState(false)

  React.useEffect(() => {
    setTheme("light")
  }, [setTheme])

  return (
    <SettingsShell title="General" activeId="as-mobbin" wide>
      <SettingsBackLink href="/settings/teams/as-mobbin">AS Mobbin</SettingsBackLink>

      <SettingsPageIntro title="General" />

      <SettingsSection title="Identity">
        <SettingsFormGroup>
          <SettingsFieldRow label="Icon & name">
            <div className="flex items-center gap-2">
              <span className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-muted/30">
                <Globe className="size-4 text-brand" />
              </span>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-8 w-[220px]"
              />
            </div>
          </SettingsFieldRow>
          <SettingsFieldRow
            label="Identifier"
            description="Used in issue IDs"
          >
            <Input
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              className="h-8 w-[120px] font-mono uppercase"
            />
          </SettingsFieldRow>
        </SettingsFormGroup>
      </SettingsSection>

      <SettingsSection
        title="Timezone"
        description="Used to determine team-relative settings such as when cycles start."
      >
        <SettingsFormGroup>
          <SettingsFieldRow label="Timezone">
            <Select defaultValue="sgt">
              <SelectTrigger className="h-8 w-full max-w-md">
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
        title="Estimates"
        description="Estimates communicate issue complexity and help calculate cycle capacity."
      >
        <SettingsFormGroup>
          <SettingsFieldRow label="Issue estimation">
            <Select defaultValue="linear">
              <SelectTrigger className="h-8 w-full max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linear">
                  Linear (1, 2, 3, 4, 5, 6, 7 Points)
                </SelectItem>
                <SelectItem value="none">Not in use</SelectItem>
              </SelectContent>
            </Select>
          </SettingsFieldRow>
          <SettingsToggleRow
            title="Allow zero estimates"
            description="Use zero points for parent issues that aggregate sub-issue work."
            checked={allowZero}
            onCheckedChange={setAllowZero}
          />
          <SettingsToggleRow
            title="Extended estimate scale"
            description="Large estimates should usually be broken down into smaller issues."
            checked={extendedScale}
            onCheckedChange={setExtendedScale}
          />
          <SettingsToggleRow
            title="Count unestimated issues"
            description="When enabled, unestimated issues count as 1 point toward capacity."
            checked={countUnestimated}
            onCheckedChange={setCountUnestimated}
          />
        </SettingsFormGroup>
      </SettingsSection>

      <SettingsSection
        title="Create issues by email"
        description="Use a team-specific email address to create and collaborate on issues via email."
      >
        <SettingsFormGroup>
          <SettingsSubheading>Enable issue creation by email</SettingsSubheading>
          <SettingsToggleRow
            title="Enable issue creation by email"
            checked={emailIssues}
            onCheckedChange={setEmailIssues}
          />
        </SettingsFormGroup>
      </SettingsSection>
    </SettingsShell>
  )
}
