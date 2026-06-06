import type { Metadata } from "next"

import { TemplatesShell } from "./templates-shell"

export const metadata: Metadata = {
  title: "Templates, byronwade/ui",
  description:
    "Ready-to-ship starter screens, pricing, dashboard, and settings, composed entirely from the byronwade/ui design system.",
}

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Shares the global floating chrome (launcher + breadcrumb + nav dock) from the
  // root layout, same shell as /layouts. `pt-16` clears the centered top dock; the
  // inspector gets a full-height flex shell so its preview iframe can fill the view.
  return <TemplatesShell>{children}</TemplatesShell>
}
