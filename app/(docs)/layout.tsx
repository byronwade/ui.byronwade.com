import { DocsSidebarShell } from "@/app/(docs)/_components/docs-sidebar-shell"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DocsSidebarShell>{children}</DocsSidebarShell>
}
