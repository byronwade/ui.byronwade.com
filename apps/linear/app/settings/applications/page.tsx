"use client"

import * as React from "react"

import {
  SettingsList,
  SettingsPageIntro,
  SettingsRow,
  SettingsSection,
  SettingsShell,
} from "@/components/linear/settings-shell"

export default function ApplicationsSettingsPage() {

  return (
    <SettingsShell title="Applications" activeId="applications">
      <SettingsPageIntro
        title="Applications"
        description="OAuth applications authorized to access your workspace."
      />

      <SettingsSection title="Authorized applications">
        <SettingsList>
          <SettingsRow
            title="Linear CLI"
            description="Last used 2 days ago"
          />
          <SettingsRow
            title="Zapier"
            description="Last used 1 week ago"
          />
        </SettingsList>
      </SettingsSection>
    </SettingsShell>
  )
}
