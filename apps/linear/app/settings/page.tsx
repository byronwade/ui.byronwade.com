"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"

import {
  ImportExportSettings,
  SettingsShell,
} from "@/components/linear/settings-shell"

export default function SettingsPage() {
  const { setTheme } = useTheme()

  React.useEffect(() => {
    setTheme("light")
  }, [setTheme])

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
