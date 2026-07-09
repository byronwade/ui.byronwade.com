"use client"

import * as React from "react"
import Link from "next/link"
import { Hash, Mail, Monitor, Smartphone } from "lucide-react"

import {
  SettingsList,
  SettingsPageIntro,
  SettingsRow,
  SettingsSection,
  SettingsShell,
  SettingsStatusDot,
  SettingsSubheading,
  SettingsToggleRow,
} from "@/components/linear/settings-shell"

export default function NotificationsSettingsPage() {
  const [sidebarUpdates, setSidebarUpdates] = React.useState(true)

  return (
    <SettingsShell title="Notifications" activeId="notifications">
      <SettingsPageIntro
        title="Notifications"
        description="Choose how you want to be notified."
      />

      <SettingsSection
        title="Notification channels"
        description="Choose how to be notified when working outside of Linear."
      >
        <SettingsList>
          <SettingsRow
            icon={<Monitor />}
            title="Desktop"
            description={
              <SettingsStatusDot status="enabled">
                Enabled for all notifications
              </SettingsStatusDot>
            }
            href="/settings/notifications"
          />
          <SettingsRow
            icon={<Smartphone />}
            title="Mobile"
            description={
              <SettingsStatusDot status="disabled">Disabled</SettingsStatusDot>
            }
          />
          <SettingsRow
            icon={<Mail />}
            title="Email"
            description={
              <SettingsStatusDot status="enabled">
                Enabled for all notifications
              </SettingsStatusDot>
            }
            href="/settings/notifications/email"
          />
          <SettingsRow
            icon={<Hash />}
            title="Slack"
            description={
              <SettingsStatusDot status="disabled">Disabled</SettingsStatusDot>
            }
          />
        </SettingsList>
      </SettingsSection>

      <SettingsSection
        title="Updates from Linear"
        description="Subscribe to product announcements and changelog updates."
      >
        <SettingsSubheading>Changelog</SettingsSubheading>
        <SettingsList className="mt-2">
          <SettingsToggleRow
            title="Show updates in sidebar"
            description="Highlight new features and improvements in the sidebar."
            checked={sidebarUpdates}
            onCheckedChange={setSidebarUpdates}
          />
        </SettingsList>

        <SettingsSubheading className="mt-6">Marketing</SettingsSubheading>
        <SettingsList className="mt-2">
          <SettingsToggleRow
            title="Marketing and onboarding"
            description="Tips for getting started and feature highlights."
            defaultChecked={false}
          />
        </SettingsList>

        <SettingsSubheading className="mt-6">Other updates</SettingsSubheading>
        <SettingsList className="mt-2">
          <SettingsToggleRow
            title="Invite accepted"
            description="When someone accepts your workspace invite."
            defaultChecked
          />
          <SettingsToggleRow
            title="Privacy and legal updates"
            description="Changes to terms, privacy, or security policies."
            defaultChecked
          />
        </SettingsList>
      </SettingsSection>

      <p className="text-xs text-muted-foreground">
        Per-channel settings live under{" "}
        <Link href="/settings/notifications/email" className="underline-offset-2 hover:underline">
          Email
        </Link>
        .
      </p>
    </SettingsShell>
  )
}
