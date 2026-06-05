"use client"

import { Section, SettingsList, SettingRow } from "@/components/section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

export default function Example() {
  const [value, setValue] = useState("John Doe")

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      {/* Mix of right-side control types in one section */}
      <Section
        title="Preferences"
        description="These settings apply to your personal account only."
      >
        <SettingsList>
          {/* Switch control */}
          <SettingRow
            title="Two-factor authentication"
            description="Require a second verification step when signing in."
            control={<Switch defaultChecked />}
          />

          {/* Text input control */}
          <SettingRow
            title="Display name"
            description="Shown on comments, activity feeds, and shared reports."
            control={
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-44"
              />
            }
          />

          {/* Badge (read-only status) */}
          <SettingRow
            title="Account plan"
            description="Your current subscription tier and billing cycle."
            control={<Badge variant="default">Pro</Badge>}
          />

          {/* Button control */}
          <SettingRow
            title="Session timeout"
            description="Automatically sign out after 30 minutes of inactivity."
            control={
              <Button size="sm" variant="outline">
                Change
              </Button>
            }
          />

          {/* Destructive button control */}
          <SettingRow
            title="Delete account"
            description="Permanently remove your account and all associated data. This cannot be undone."
            control={
              <Button size="sm" variant="destructive">
                Delete
              </Button>
            }
          />
        </SettingsList>
      </Section>
    </div>
  )
}
