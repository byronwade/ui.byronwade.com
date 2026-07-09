"use client"

import * as React from "react"
import { useTheme } from "next-themes"

/**
 * Product OS surfaces default to dark — Linear's primary canvas.
 * Individual pages no longer call setTheme("dark").
 */
export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { setTheme } = useTheme()

  React.useEffect(() => {
    setTheme("dark")
  }, [setTheme])

  return children
}
