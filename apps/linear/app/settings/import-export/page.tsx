"use client"

import * as React from "react"
import { toast } from "sonner"

import {
  ImportExportSettings,
  SettingsShell,
} from "@/components/linear/settings-shell"

export default function ImportExportSettingsPage() {
  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      toast("Check your email", {
        description: "We sent a confirmation link to you@company.com",
      })
    }, 1200)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <SettingsShell title="Import & export" activeId="import-export">
      <ImportExportSettings />
    </SettingsShell>
  )
}
