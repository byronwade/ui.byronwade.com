import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"

/**
 * Demonstrates PageHeader used inside a page layout with surrounding
 * context, a breadcrumb line above and a divider below, to show how it
 * composes with real page scaffolding.
 */
export default function Example() {
  return (
    <div className="p-8 space-y-6 max-w-3xl">
      {/* Breadcrumb line above the header */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <span>Workspace</span>
        <span>/</span>
        <span>Projects</span>
        <span>/</span>
        <span className="text-foreground font-medium">Alpha</span>
      </nav>

      <PageHeader
        title="Project Alpha"
        description="Manage tasks, milestones, and collaborators for this project."
      >
        <Button size="sm" variant="outline">
          Share
        </Button>
        <Button size="sm">New Task</Button>
      </PageHeader>

      <hr className="border-border" />

      <p className="text-sm text-muted-foreground">
        Page body content would follow here…
      </p>
    </div>
  )
}
