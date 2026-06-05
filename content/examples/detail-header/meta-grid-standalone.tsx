import { MetaGrid } from "@/components/detail-header"
import { Badge } from "@/components/ui/badge"

/**
 * MetaGrid used independently — outside of DetailHeader — for embedding a
 * label/value grid inside a card, panel, or secondary section without a
 * title row.
 */
export default function Example() {
  return (
    <div className="max-w-4xl space-y-10 p-8">
      {/* Basic text values */}
      <div className="rounded-2xl border p-6">
        <p className="mb-4 text-sm font-medium text-muted-foreground">
          Build details
        </p>
        <MetaGrid
          items={[
            { label: "Commit", value: "a3f9c12" },
            { label: "Branch", value: "main" },
            { label: "Duration", value: "1m 42s" },
            { label: "Triggered by", value: "push" },
          ]}
        />
      </div>

      {/* Mixed ReactNode values */}
      <div className="rounded-2xl border p-6">
        <p className="mb-4 text-sm font-medium text-muted-foreground">
          Deployment info
        </p>
        <MetaGrid
          items={[
            {
              label: "Status",
              value: <Badge variant="success">Live</Badge>,
            },
            { label: "Region", value: "eu-west-1" },
            {
              label: "CDN",
              value: <Badge variant="secondary">Edge</Badge>,
            },
            { label: "Instances", value: "3" },
            { label: "Memory", value: "512 MB" },
            { label: "CPU", value: "0.25 vCPU" },
          ]}
        />
      </div>

      {/* Custom column layout via className override */}
      <div className="rounded-2xl border p-6">
        <p className="mb-4 text-sm font-medium text-muted-foreground">
          Two-column layout
        </p>
        <MetaGrid
          className="grid-cols-2 sm:grid-cols-2 lg:grid-cols-2"
          items={[
            { label: "Workspace", value: "acme-org" },
            { label: "Tier", value: "Enterprise" },
            { label: "Seats used", value: "24 / 50" },
            { label: "Renewal", value: "Jan 1, 2027" },
          ]}
        />
      </div>
    </div>
  )
}
