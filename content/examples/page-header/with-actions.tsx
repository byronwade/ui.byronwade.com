import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { DownloadSimple, Gear, Plus } from "@/lib/icons"

export default function Example() {
  return (
    <div className="p-8 space-y-12">
      {/* Single primary action */}
      <PageHeader
        title="Reports"
        description="View summaries and export your data."
      >
        <Button size="sm">
          <DownloadSimple />
          Export
        </Button>
      </PageHeader>

      {/* Multiple actions */}
      <PageHeader
        title="Team Members"
        description="Manage roles and access for your organization."
      >
        <Button size="sm" variant="outline">
          <Gear />
          Manage Roles
        </Button>
        <Button size="sm">
          <Plus />
          Invite Member
        </Button>
      </PageHeader>

      {/* Icon-only action */}
      <PageHeader
        title="Integrations"
        description="Connect your tools and external services."
      >
        <Button size="icon" variant="outline" aria-label="Open settings">
          <Gear />
        </Button>
        <Button size="sm">
          <Plus />
          Add Integration
        </Button>
      </PageHeader>
    </div>
  )
}
