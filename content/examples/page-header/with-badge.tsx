import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function Example() {
  return (
    <div className="p-8 space-y-12">
      {/* Status badge in the actions slot */}
      <PageHeader
        title="API Keys"
        description="Manage credentials for programmatic access."
      >
        <Badge variant="secondary">3 active</Badge>
        <Button size="sm">New Key</Button>
      </PageHeader>

      {/* Warning badge indicating attention needed */}
      <PageHeader
        title="Billing"
        description="Review your current plan and payment methods."
      >
        <Badge variant="warning">Past due</Badge>
        <Button size="sm" variant="outline">
          Update Payment
        </Button>
      </PageHeader>

      {/* Success / live badge */}
      <PageHeader
        title="Webhooks"
        description="Receive real-time event notifications from your account."
      >
        <Badge variant="success">All healthy</Badge>
        <Button size="sm">Add Endpoint</Button>
      </PageHeader>
    </div>
  )
}
