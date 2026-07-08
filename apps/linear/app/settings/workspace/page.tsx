"use client"

import {
  SettingsFieldRow,
  SettingsPageIntro,
  SettingsSection,
  SettingsShell,
  SettingsToggleRow,
} from "@/components/linear/settings-shell"
import { Button } from "@/components/ui/button"

export default function WorkspaceSettingsPage() {
  return (
    <SettingsShell title="Workspace" activeId="workspace">
      <SettingsPageIntro
        title="Workspace"
        description="Name, URL, and defaults for the AS Mobbin workspace."
      />

      <SettingsSection title="General">
        <SettingsFieldRow label="Workspace name" description="Shown in the sidebar and invite emails.">
          <div className="flex items-center gap-3">
            <span className="text-sm">AS Mobbin</span>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>
        </SettingsFieldRow>
        <SettingsFieldRow label="URL" description="linear.app/as-mobbin">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs">as-mobbin</span>
            <Button variant="outline" size="sm">
              Copy
            </Button>
          </div>
        </SettingsFieldRow>
        <SettingsFieldRow label="Timezone">America/Los_Angeles</SettingsFieldRow>
      </SettingsSection>

      <SettingsSection title="Defaults">
        <SettingsToggleRow
          title="Allow public issue creation"
          description="Anyone with the link can create issues in Triage."
          defaultChecked={false}
        />
        <SettingsToggleRow
          title="Require estimates"
          description="Issues must have an estimate before moving to In Progress."
          defaultChecked
        />
      </SettingsSection>
    </SettingsShell>
  )
}
