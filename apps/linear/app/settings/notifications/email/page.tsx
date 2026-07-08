"use client"

import * as React from "react"

import {
  SettingsBackLink,
  SettingsList,
  SettingsPageIntro,
  SettingsSection,
  SettingsShell,
  SettingsToggleRow,
} from "@/components/linear/settings-shell"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function EmailNotificationsPage() {
  const [enabled, setEnabled] = React.useState(true)

  return (
    <SettingsShell title="Email" activeId="notifications">
      <SettingsBackLink href="/settings/notifications">Notifications</SettingsBackLink>

      <SettingsPageIntro title="Email" />

      <SettingsSection title="Email notifications">
        <SettingsList>
          <SettingsToggleRow
            title="Enable email notifications"
            description="Email notifications to you@company.com"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </SettingsList>
      </SettingsSection>

      <SettingsSection title="Email digest settings">
        <SettingsList>
          <div
            data-slot="linear-settings-select-row"
            className="flex items-center justify-between gap-4 px-4 py-3"
          >
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Notification format</p>
              <p className="text-xs text-muted-foreground">
                How often you receive email updates
              </p>
            </div>
            <Select defaultValue="digest">
              <SelectTrigger className="h-8 w-[120px]">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="digest">Digest</SelectItem>
                <SelectItem value="instant">Instant</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </SettingsList>
      </SettingsSection>

      <SettingsSection title="General notifications">
        <SettingsList>
          <SettingsToggleRow
            title="Assigned to you"
            description="When an issue is assigned to you"
            defaultChecked
          />
          <SettingsToggleRow
            title="Status changes"
            description="When an issue you follow changes status"
            defaultChecked
          />
          <SettingsToggleRow
            title="Comments and replies"
            description="When someone comments on your issues"
            defaultChecked
          />
          <SettingsToggleRow
            title="Project updates"
            description="Weekly summaries for projects you follow"
            defaultChecked={false}
          />
        </SettingsList>
      </SettingsSection>
    </SettingsShell>
  )
}
