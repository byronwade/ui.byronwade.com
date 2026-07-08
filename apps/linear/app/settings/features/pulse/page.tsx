"use client"

import * as React from "react"
import Link from "next/link"

import {
  SettingsList,
  SettingsPageIntro,
  SettingsSection,
  SettingsShell,
  SettingsToggleRow,
} from "@/components/linear/settings-shell"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function PulseSettingsPage() {
  const [enabled, setEnabled] = React.useState(true)

  return (
    <SettingsShell title="Pulse" activeId="pulse">
      <SettingsPageIntro
        title="Pulse"
        description="Pulse centralizes all your project updates into a single feed. Members can choose to receive summary notifications daily or weekly."
      />

      <SettingsSection title="">
        <SettingsList>
          <SettingsToggleRow
            title="Enable Pulse"
            description="Workspace-wide feed of updates with optional summary notifications."
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </SettingsList>
      </SettingsSection>

      {enabled ? (
        <SettingsSection
          title="Summary notifications"
          description="Pulse summary notifications can be delivered in the mornings based on a set schedule."
        >
          <SettingsList>
            <div
              data-slot="linear-settings-select-row"
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Default workspace schedule</p>
                <p className="text-xs text-muted-foreground">
                  Applies to all members who haven&apos;t set their own preference.
                </p>
              </div>
              <Select defaultValue="daily">
                <SelectTrigger className="h-8 w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div
              data-slot="linear-settings-select-row"
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Your personal schedule</p>
                <p className="text-xs text-muted-foreground">
                  Only applies to you, overriding the workspace default.
                </p>
              </div>
              <Select defaultValue="weekly">
                <SelectTrigger className="h-8 w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </SettingsList>
        </SettingsSection>
      ) : null}
    </SettingsShell>
  )
}
