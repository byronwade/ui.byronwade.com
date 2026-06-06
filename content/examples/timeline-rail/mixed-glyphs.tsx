import { TimelineRail } from "@/components/timeline-rail"
import { GitCommit, GitMerge, AlertTriangle, CheckCircle2 } from "lucide-react"

export default function Example() {
  return (
    <div className="max-w-xs p-6">
      <TimelineRail
        groups={[
          {
            label: "Pipeline run #84",
            items: [
              {
                glyph: <GitCommit className="size-4" />,
                title: "Commit abc1234 received",
                meta: "0:00",
              },
              {
                glyph: <CheckCircle2 className="size-4 text-success" />,
                title: "Lint passed",
                meta: "0:14",
              },
              {
                glyph: <CheckCircle2 className="size-4 text-success" />,
                title: "Unit tests passed (138/138)",
                meta: "0:52",
              },
              {
                glyph: <AlertTriangle className="size-4 text-warning" />,
                title: "Coverage dropped below threshold",
                meta: "0:53",
              },
              {
                glyph: <GitMerge className="size-4" />,
                title: "Merge blocked, review required",
                meta: "0:53",
              },
            ],
          },
        ]}
        terminalLabel="Pipeline started"
      />
    </div>
  )
}
