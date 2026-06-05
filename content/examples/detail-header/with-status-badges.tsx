import { DetailHeader } from "@/components/detail-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

/**
 * Demonstrates the badge prop with all meaningful status variants:
 * success, warning, destructive, secondary, and outline.
 */
export default function Example() {
  const statuses = [
    { label: "Active", badge: <Badge variant="success">Active</Badge> },
    { label: "Pending", badge: <Badge variant="warning">Pending</Badge> },
    { label: "Failed", badge: <Badge variant="destructive">Failed</Badge> },
    { label: "Archived", badge: <Badge variant="secondary">Archived</Badge> },
    { label: "Draft", badge: <Badge variant="outline">Draft</Badge> },
  ] as const

  return (
    <div className="max-w-4xl space-y-10 p-8">
      {statuses.map(({ label, badge }) => (
        <DetailHeader
          key={label}
          title={`report-${label.toLowerCase()}.csv`}
          badge={badge}
          actions={
            <Button variant="outline" size="sm">
              View
            </Button>
          }
          meta={[
            { label: "Status", value: label },
            { label: "Size", value: "2.4 MB" },
            { label: "Updated", value: "Today at 09:41" },
          ]}
        />
      ))}
    </div>
  )
}
