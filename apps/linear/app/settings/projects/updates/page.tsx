"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { ExternalLink } from "lucide-react"

import {
  SettingsIntegrationRow,
  SettingsList,
  SettingsPageIntro,
  SettingsScheduleCard,
  SettingsSection,
  SettingsShell,
  SettingsSubheading,
} from "@/components/linear/settings-shell"

export default function ProjectUpdatesPage() {
  const { setTheme } = useTheme()

  React.useEffect(() => {
    setTheme("light")
  }, [setTheme])

  return (
    <SettingsShell title="Project updates" activeId="project-updates">
      <SettingsPageIntro
        title="Project updates"
        description={
          <>
            Keep stakeholders aligned with recurring project health updates.{" "}
            <Link
              href="https://linear.app/docs/project-updates"
              className="inline-flex items-center gap-0.5 underline-offset-2 hover:underline"
            >
              Docs
              <ExternalLink className="size-3" />
            </Link>
          </>
        }
      />

      <SettingsSection
        title="Update schedule"
        description="Set expectations for when project leads should post updates."
      >
        <div className="space-y-2">
          <SettingsSubheading>Update schedule</SettingsSubheading>
          <SettingsScheduleCard cadence="biweekly" />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Slack notifications"
        description="Send project updates to a Slack channel when they are published."
      >
        <SettingsList>
          <SettingsIntegrationRow
            icon={
              <span className="inline-flex size-5 items-center justify-center rounded bg-muted text-[10px] font-medium">
                #
              </span>
            }
            title="Send project updates to a Slack channel"
            description="Connect a channel to send all project updates to."
          />
        </SettingsList>
      </SettingsSection>
    </SettingsShell>
  )
}
