import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"

export default function Example() {
  return (
    <div className="p-8 space-y-10">
      {/* Left-aligned with an action button */}
      <PageHeader
        title="All Projects"
        description="Manage and monitor your active projects."
      >
        <Button size="sm">New Project</Button>
      </PageHeader>

      {/* Centered variant */}
      <PageHeader
        title="Account Settings"
        description="Update your preferences and profile details."
        align="center"
      />
    </div>
  )
}
