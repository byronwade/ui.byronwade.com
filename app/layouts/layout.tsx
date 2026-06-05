import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Layouts — byronwade/ui",
  description:
    "Full-page layout archetypes composed from the byronwade/ui design system.",
}

export default function LayoutsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // No bespoke header here — the gallery and inspector share the same global
  // floating chrome (launcher + breadcrumb + nav dock) mounted in the root
  // layout. `pt-16` clears the centered top dock; the inspector still gets a
  // full-height flex shell so its preview iframe can fill the viewport.
  return (
    <div className="flex h-dvh flex-col bg-background text-foreground">
      <main className="min-h-0 flex-1 overflow-auto pt-16">{children}</main>
    </div>
  )
}
