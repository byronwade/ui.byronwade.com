"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  CalendarClock,
  CheckCircle2,
  FileText,
  Laptop,
  Settings,
  Shield,
  Tag,
  Target,
  Users,
} from "lucide-react"

import {
  SettingsBackLink,
  SettingsList,
  SettingsMetaRow,
  SettingsSection,
  SettingsShell,
  SettingsTeamHeader,
} from "@/components/linear/settings-shell"

export default function EngineeringTeamSettingsPage() {
  const { setTheme } = useTheme()

  React.useEffect(() => {
    setTheme("light")
  }, [setTheme])

  return (
    <SettingsShell title="Engineering Team" activeId="engineering-team">
      <SettingsBackLink href="/settings/teams">Teams</SettingsBackLink>

      <SettingsTeamHeader icon={<Laptop className="size-5" />} title="Engineering Team" />

      <SettingsSection title="">
        <SettingsList>
          <SettingsMetaRow
            icon={<Settings />}
            title="General"
            description="Name, identifier, timezone, estimates, and broader settings."
          />
          <SettingsMetaRow
            icon={<Users />}
            title="Members"
            description="Manage team members."
            meta="1 member"
          />
          <SettingsMetaRow
            icon={<Shield />}
            title="Slack notifications"
            description="Broadcast notifications to Slack."
            meta="Off"
          />
        </SettingsList>
      </SettingsSection>

      <SettingsSection title="Issues, projects, and docs">
        <SettingsList>
          <SettingsMetaRow
            icon={<Tag />}
            title="Issue labels"
            description="Labels available to this team's issues."
            meta="5 labels"
          />
          <SettingsMetaRow
            icon={<FileText />}
            title="Templates"
            description="Pre-filled templates for issues, documents, and projects."
            meta="1 template"
          />
          <SettingsMetaRow
            icon={<CalendarClock />}
            title="Recurring issues"
            description="Automatically create issues on a schedule."
            meta="None"
          />
        </SettingsList>
      </SettingsSection>

      <SettingsSection title="Workflow">
        <SettingsList>
          <SettingsMetaRow
            icon={<CheckCircle2 />}
            title="Issue statuses"
            description="Customize the statuses issues go through."
            meta="6 statuses"
          />
          <SettingsMetaRow
            icon={<Settings />}
            title="Workflows & automations"
            description="Manage issue automations, git workflows and other workflows."
          />
          <SettingsMetaRow
            icon={<Target />}
            title="Triage"
            description="Streamline how you handle requests from outside your team."
            meta="Off"
          />
        </SettingsList>
      </SettingsSection>
    </SettingsShell>
  )
}
