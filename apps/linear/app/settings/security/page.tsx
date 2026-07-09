"use client"

import * as React from "react"
import Link from "next/link"
import { Key, ShieldCheck } from "lucide-react"

import {
  SettingsList,
  SettingsPageIntro,
  SettingsRow,
  SettingsSection,
  SettingsShell,
} from "@/components/linear/settings-shell"

export default function SecuritySettingsPage() {

  return (
    <SettingsShell title="Security & access" activeId="security">
      <SettingsPageIntro
        title="Security & access"
        description="Manage authentication, API keys, and connected accounts."
      />

      <SettingsSection title="API keys">
        <SettingsList>
          <SettingsRow
            icon={<Key />}
            title="Personal API keys"
            description="Create keys for scripts and integrations"
            href="/settings/api"
          />
          <SettingsRow
            icon={<Key />}
            title="Create API key"
            description="Generate a new personal access token"
            href="/settings/api/create"
          />
        </SettingsList>
      </SettingsSection>

      <SettingsSection title="Authentication">
        <SettingsList>
          <SettingsRow
            icon={<ShieldCheck />}
            title="Two-factor authentication"
            description="Not enabled"
          />
        </SettingsList>
      </SettingsSection>
    </SettingsShell>
  )
}
