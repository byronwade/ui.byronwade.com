"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  Copy,
  ExternalLink,
  FolderKanban,
  Tag,
  User,
  Users,
} from "lucide-react"

import {
  SettingsBackLink,
  SettingsBehaviorRow,
  SettingsFormCard,
  SettingsList,
  SettingsPageIntro,
  SettingsSection,
  SettingsShell,
  SettingsToggleRow,
} from "@/components/linear/settings-shell"
import { Textarea } from "@/components/ui/textarea"

export default function AiAgentsSettingsPage() {
  const { setTheme } = useTheme()
  const [enabled, setEnabled] = React.useState(false)
  const [guidance, setGuidance] = React.useState("")

  React.useEffect(() => {
    setTheme("light")
  }, [setTheme])

  return (
    <SettingsShell title="AI & Agents" activeId="ai-agents">
      <SettingsBackLink href="/settings/features/ai-agents">
        AI & Agents
      </SettingsBackLink>

      <SettingsPageIntro
        title="Triage Intelligence"
        description={
          <>
            Get suggestions for related issues, assignees, and labels when
            triaging new work.{" "}
            <Link
              href="https://linear.app/docs/triage-intelligence"
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
            title="Enable Triage Intelligence"
            description="Get suggestions for related issues, assignees, projects, and labels."
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </SettingsList>
      </SettingsSection>

      <SettingsSection
        title="Behavior"
        description="Define rules for showing, hiding, or auto-applying suggestions."
      >
        <SettingsList>
          <SettingsBehaviorRow
            icon={<User />}
            label="Assignee is suggested"
            onFilter={() => undefined}
          />
          <SettingsBehaviorRow
            icon={<FolderKanban />}
            label="Project is suggested"
            onFilter={() => undefined}
          />
          <SettingsBehaviorRow
            icon={<Tag />}
            label="Label is suggested"
            onFilter={() => undefined}
          />
          <SettingsBehaviorRow
            icon={<Users />}
            label="Team is suggested"
            onFilter={() => undefined}
          />
          <SettingsBehaviorRow
            icon={<Copy />}
            label="Duplicate issue is suggested"
            onFilter={() => undefined}
          />
          <SettingsBehaviorRow
            icon={<Copy />}
            label="Related issue is suggested"
            onFilter={() => undefined}
          />
        </SettingsList>
      </SettingsSection>

      <SettingsSection
        title="Workspace guidance"
        description="Optional instructions for how Triage Intelligence should behave in this workspace."
      >
        {enabled ? (
          <SettingsFormCard>
            <Textarea
              data-slot="linear-agent-guidance"
              value={guidance}
              onChange={(event) => setGuidance(event.target.value)}
              placeholder="Optional agent guidance…"
              className="min-h-[120px] resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
            />
          </SettingsFormCard>
        ) : (
          <SettingsFormCard>
            <p className="text-sm text-muted-foreground">
              Triage Intelligence is not enabled in this workspace.
            </p>
          </SettingsFormCard>
        )}
      </SettingsSection>
    </SettingsShell>
  )
}
