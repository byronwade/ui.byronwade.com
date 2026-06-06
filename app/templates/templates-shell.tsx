"use client"

import { usePathname } from "next/navigation"

export function TemplatesShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === "/templates") {
    return children
  }

  return (
    <div className="flex h-dvh flex-col bg-background text-foreground">
      <main
        data-testid="templates-route-shell"
        className="min-h-0 flex-1 overflow-auto pt-16"
      >
        {children}
      </main>
    </div>
  )
}
