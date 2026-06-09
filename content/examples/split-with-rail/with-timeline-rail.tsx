import { SplitWithRail } from "@/components/split-with-rail"
import { TimelineRail } from "@/components/timeline-rail"
import { Badge } from "@/components/ui/badge"
import { StatusDot } from "@/components/ui/status-dot"
import { GitBranch, Globe, MousePointer } from "lucide-react"

export default function Example() {
  return (
    <div className="p-6">
      <SplitWithRail
        summary={
          <div className="space-y-5 rounded-2xl edge bg-card p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-lg font-semibold">
                A
              </span>
              <div>
                <p className="font-semibold">alice@example.com</p>
                <p className="text-xs text-muted-foreground">
                  Member since Jan 2025
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <StatusDot tone="success" size="sm" />
              <span className="text-sm text-muted-foreground">
                Active session
              </span>
              <Badge variant="secondary" className="ml-auto">
                Pro
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="rounded-xl edge p-3 text-center">
                <p className="text-2xl font-semibold tabular-nums">12</p>
                <p className="text-xs text-muted-foreground">Sessions</p>
              </div>
              <div className="rounded-xl edge p-3 text-center">
                <p className="text-2xl font-semibold tabular-nums">47m</p>
                <p className="text-xs text-muted-foreground">Total time</p>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Details
              </p>
              <div className="divide-y divide-border rounded-xl edge">
                {[
                  { label: "Country", value: "United States" },
                  { label: "Browser", value: "Chrome 124" },
                  { label: "First seen", value: "3 days ago" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between px-3 py-2 text-sm"
                  >
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
        rail={
          <TimelineRail
            terminalLabel="This is where their journey begins"
            groups={[
              {
                label: "Today",
                items: [
                  {
                    glyph: <Globe className="size-3.5" />,
                    title: "Visited /pricing",
                    meta: "2m ago",
                  },
                  {
                    glyph: <MousePointer className="size-3.5" />,
                    title: "Clicked 'Start trial'",
                    meta: "3m ago",
                  },
                  {
                    glyph: <Globe className="size-3.5" />,
                    title: "Visited /features",
                    meta: "5m ago",
                  },
                  {
                    glyph: <Globe className="size-3.5" />,
                    title: "Visited /home",
                    meta: "8m ago",
                  },
                ],
              },
              {
                label: "Yesterday",
                items: [
                  {
                    glyph: <GitBranch className="size-3.5" />,
                    title: "OAuth sign-in via GitHub",
                    meta: "1d ago",
                  },
                  {
                    glyph: <Globe className="size-3.5" />,
                    title: "Visited /docs/quickstart",
                    meta: "1d ago",
                  },
                  {
                    glyph: <Globe className="size-3.5" />,
                    title: "Visited /home",
                    meta: "1d ago",
                  },
                ],
              },
            ]}
          />
        }
      />
    </div>
  )
}
