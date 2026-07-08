"use client"

import * as React from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

import {
  SettingsIntegrationRow,
  SettingsList,
  SettingsPageIntro,
  SettingsScheduleCard,
  SettingsSection,
  SettingsShell,
  SettingsSubheading,
  SettingsToggleRow,
} from "@/components/linear/settings-shell"

export default function InitiativesSettingsPage() {
  const [enabled, setEnabled] = React.useState(true)

  return (
    <SettingsShell title="Initiatives" activeId="initiatives">
      <SettingsPageIntro
        title="Initiatives"
        description={
          <>
            Group projects into initiatives and track high-level progress with
            status updates.{" "}
            <Link
              href="https://linear.app/docs/initiatives"
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
            title="Enable Initiatives"
            description="Visible to all non-guest workspace members."
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </SettingsList>
      </SettingsSection>

      {enabled ? (
        <>
          <SettingsSection
            title="Initiative updates"
            description="Set expectations for when initiative owners should post status updates."
          >
            <div className="space-y-2">
              <SettingsSubheading>Update schedule</SettingsSubheading>
              <p className="text-xs text-muted-foreground">
                Define when initiative leads should share progress.
              </p>
              <SettingsScheduleCard cadence="biweekly" />
            </div>
          </SettingsSection>

          <SettingsSection title="Slack notifications">
            <SettingsList>
              <SettingsIntegrationRow
                icon={
                  <span className="inline-flex size-5 items-center justify-center rounded bg-muted text-[10px] font-medium">
                    #
                  </span>
                }
                title="Send initiative updates to a Slack channel"
                description="Connect a channel to send all initiative updates to."
              />
            </SettingsList>
          </SettingsSection>
        </>
      ) : null}
    </SettingsShell>
  )
}
