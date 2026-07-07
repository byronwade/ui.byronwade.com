"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import {
  SettingsList,
  SettingsPageIntro,
  SettingsRow,
  SettingsSection,
  SettingsShell,
} from "@/components/linear/settings-shell"

export default function MembersSettingsPage() {
  const { setTheme } = useTheme()

  React.useEffect(() => {
    setTheme("light")
  }, [setTheme])

  return (
    <SettingsShell title="Members" activeId="members">
      <SettingsPageIntro
        title="Members"
        description="Manage workspace members, roles, and invitations."
      />

      <SettingsSection title="Workspace members">
        <SettingsList>
          <SettingsRow
            title="Alex Smith"
            description="Admin · alex@mobbin.com"
          />
          <SettingsRow
            title="Jordan Lee"
            description="Member · jordan@mobbin.com"
          />
        </SettingsList>
      </SettingsSection>
    </SettingsShell>
  )
}
