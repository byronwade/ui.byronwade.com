import type { Metadata } from "next"

import { TemplatesShell } from "./templates-shell"

export const metadata: Metadata = {
  title: "Templates, byronwade/ui",
  description:
    "Ready-to-ship starter screens — pricing, dashboard, and settings — composed from the byronwade/ui design system.",
}

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Shares the global fixed header from the root layout. `pt-14` clears `h-14`.
  return <TemplatesShell>{children}</TemplatesShell>
}
