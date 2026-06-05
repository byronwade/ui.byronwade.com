"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"

const settings = [
  {
    id: "dark-mode",
    label: "Dark mode",
    description: "Use a darker color palette",
    defaultChecked: false,
  },
  {
    id: "auto-save",
    label: "Auto-save",
    description: "Save changes automatically",
    defaultChecked: true,
  },
  {
    id: "analytics",
    label: "Usage analytics",
    description: "Help us improve by sharing anonymous data",
    defaultChecked: false,
  },
]

export default function Example() {
  const [states, setStates] = useState<Record<string, boolean>>(
    Object.fromEntries(settings.map((s) => [s.id, s.defaultChecked])),
  )

  return (
    <div className="flex flex-col divide-y rounded-lg border p-0 overflow-hidden max-w-sm mx-auto">
      {settings.map((setting) => (
        <label
          key={setting.id}
          className="flex items-center justify-between gap-4 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
        >
          <div className="space-y-0.5">
            <p className="text-sm font-medium">{setting.label}</p>
            <p className="text-xs text-muted-foreground">
              {setting.description}
            </p>
          </div>
          <Switch
            checked={states[setting.id]}
            onCheckedChange={(checked) =>
              setStates((prev) => ({ ...prev, [setting.id]: checked }))
            }
          />
        </label>
      ))}
    </div>
  )
}
