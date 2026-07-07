"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import {
  SettingsPageIntro,
  SettingsSection,
  SettingsShell,
} from "@/components/linear/settings-shell"
import { Button } from "@/components/ui/button"

export default function BillingSettingsPage() {
  const { setTheme } = useTheme()

  React.useEffect(() => {
    setTheme("light")
  }, [setTheme])

  return (
    <SettingsShell title="Billing" activeId="billing">
      <SettingsPageIntro
        title="Billing"
        description="Manage your workspace plan, payment method, and invoices."
      />

      <SettingsSection title="Current plan">
        <div
          data-slot="linear-billing-plan"
          className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-4"
        >
          <div>
            <p className="text-sm font-medium">Business trial</p>
            <p className="text-xs text-muted-foreground">29 days remaining</p>
          </div>
          <Button size="sm">Upgrade</Button>
        </div>
      </SettingsSection>
    </SettingsShell>
  )
}
