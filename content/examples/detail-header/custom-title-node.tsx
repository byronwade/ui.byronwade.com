import { DetailHeader } from "@/components/detail-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

/**
 * The `title` prop accepts any ReactNode. This example shows compound title
 * markup — an icon + text combo — demonstrating that the h1 wraps arbitrary
 * children without breaking alignment.
 */
export default function Example() {
  return (
    <div className="max-w-4xl space-y-10 p-8">
      {/* Title with an inline colored dot (status indicator before the text) */}
      <DetailHeader
        title={
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-success" />
            api.acme.com
          </span>
        }
        badge={<Badge variant="success">Healthy</Badge>}
        actions={
          <Button variant="outline" size="sm">
            Configure
          </Button>
        }
        meta={[
          { label: "Uptime (30d)", value: "99.98%" },
          { label: "Avg latency", value: "42 ms" },
          { label: "Requests today", value: "3.1 M" },
        ]}
      />

      {/* Title with a version tag inline */}
      <DetailHeader
        title={
          <span className="flex items-baseline gap-2">
            inference-endpoint
            <span className="font-mono text-sm font-normal text-muted-foreground">
              v2.1.4
            </span>
          </span>
        }
        badge={<Badge variant="warning">Degraded</Badge>}
        actions={
          <>
            <Button variant="outline" size="sm">
              Rollback
            </Button>
            <Button size="sm">View logs</Button>
          </>
        }
        meta={[
          { label: "Model", value: "mixtral-8x7b" },
          { label: "GPU", value: "A100 80 GB" },
          { label: "Replicas", value: "4" },
          { label: "Queue depth", value: "12" },
        ]}
      />
    </div>
  )
}
