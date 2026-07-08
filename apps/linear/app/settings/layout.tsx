"use client"

import * as React from "react"
import { useTheme } from "next-themes"

/**
 * Settings / admin surfaces default to light — Mobbin reference canvas.
 * Individual pages no longer call setTheme("light").
 */
export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { setTheme } = useTheme()

  React.useEffect(() => {
    setTheme("light")
  }, [setTheme])

  return children
}
