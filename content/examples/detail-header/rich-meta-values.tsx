import { DetailHeader } from "@/components/detail-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

/**
 * Shows that meta `value` accepts any ReactNode, inline badges,
 * colored text, links, or compound elements.
 */
export default function Example() {
  return (
    <div className="max-w-4xl p-8">
      <DetailHeader
        title="data-pipeline-v3"
        badge={<Badge variant="success">Running</Badge>}
        actions={
          <>
            <Button variant="outline" size="sm">
              Pause
            </Button>
            <Button variant="destructive" size="sm">
              Stop
            </Button>
          </>
        }
        meta={[
          {
            label: "Environment",
            value: (
              <Badge variant="outline" className="font-mono text-xs">
                production
              </Badge>
            ),
          },
          {
            label: "Health",
            value: (
              <span className="flex items-center gap-1.5 text-sm">
                <span className="size-2 rounded-full bg-success" />
                Healthy
              </span>
            ),
          },
          {
            label: "Last run",
            value: (
              <span className="text-sm text-muted-foreground">2 min ago</span>
            ),
          },
          {
            label: "Events / hr",
            value: (
              <span className="font-mono text-sm font-semibold">12,483</span>
            ),
          },
          {
            label: "Error rate",
            value: (
              <span className="text-sm text-destructive font-medium">0.4%</span>
            ),
          },
          {
            label: "Owner",
            value: (
              <a
                href="#"
                className="text-sm text-primary underline underline-offset-2 hover:no-underline"
              >
                data-eng@acme.com
              </a>
            ),
          },
        ]}
      />
    </div>
  )
}
