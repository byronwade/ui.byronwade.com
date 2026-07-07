"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { ExternalLink, Mail, Plus } from "lucide-react"

import {
  SettingsList,
  SettingsListHeader,
  SettingsPageIntro,
  SettingsRow,
  SettingsSection,
  SettingsShell,
  SettingsToggleRow,
} from "@/components/linear/settings-shell"

export default function AsksSettingsPage() {
  const { setTheme } = useTheme()
  const [enabled, setEnabled] = React.useState(true)

  React.useEffect(() => {
    setTheme("light")
  }, [setTheme])

  return (
    <SettingsShell title="Asks" activeId="asks">
      <SettingsPageIntro
        title="Asks"
        description={
          <>
            Let anyone submit requests to your workspace via email, Slack, or
            web forms.{" "}
            <Link
              href="https://linear.app/docs/asks"
              className="inline-flex items-center gap-0.5 underline-offset-2 hover:underline"
            >
              Docs
              <ExternalLink className="size-3" />
            </Link>
          </>
        }
      />

      <SettingsSection title="">
        <SettingsList>
          <SettingsToggleRow
            title="Enable Asks"
            description="Collect requests from external channels into Linear issues."
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </SettingsList>
      </SettingsSection>

      {enabled ? (
        <SettingsSection title="Email intake">
          <div data-slot="linear-asks-intake-list">
            <SettingsListHeader
              count="0 email intakes"
              addLabel="Add email intake"
              onAdd={() => undefined}
            />
            <SettingsList className="rounded-t-none border-t-0">
              <SettingsRow
                icon={<Mail />}
                title="Add email intake"
                description="Create issues by emailing a custom address."
                href="/settings/features/asks/email/new"
                action={<Plus className="size-4 text-muted-foreground" />}
              />
            </SettingsList>
          </div>
        </SettingsSection>
      ) : null}
    </SettingsShell>
  )
}
