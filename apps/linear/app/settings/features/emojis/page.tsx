"use client"

import {
  SettingsPageIntro,
  SettingsSection,
  SettingsShell,
  SettingsToggleRow,
} from "@/components/linear/settings-shell"
import { Button } from "@/components/ui/button"

const EMOJIS = [
  { id: "ship", glyph: "🚀", label: "Ship it" },
  { id: "eyes", glyph: "👀", label: "Looking" },
  { id: "check", glyph: "✅", label: "Done" },
  { id: "fire", glyph: "🔥", label: "Hot" },
]

export default function EmojisSettingsPage() {
  return (
    <SettingsShell title="Emojis" activeId="emojis">
      <SettingsPageIntro
        title="Emojis"
        description="Custom emoji for reactions and status updates across the workspace."
      />

      <SettingsSection
        title="Custom emoji"
        description="Upload workspace emoji or enable the default set."
      >
        <div className="flex flex-wrap gap-2 border-b border-border px-4 py-3">
          {EMOJIS.map((emoji) => (
            <div
              key={emoji.id}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm"
            >
              <span aria-hidden className="text-base">
                {emoji.glyph}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                :{emoji.id}:
              </span>
            </div>
          ))}
          <Button variant="outline" size="sm">
            Upload emoji
          </Button>
        </div>
        <SettingsToggleRow
          title="Allow custom emoji uploads"
          description="Members can add emoji used in comments and reactions."
          defaultChecked
        />
      </SettingsSection>
    </SettingsShell>
  )
}
