import { TimelineRail } from "@/components/timeline-rail"

export default function Example() {
  return (
    <div className="max-w-xs p-6">
      <TimelineRail
        groups={[
          {
            label: "Status tones",
            items: [
              { tone: "success", title: "Deployment succeeded", meta: "12s" },
              { tone: "info", title: "Health check passed", meta: "3s" },
              { tone: "warning", title: "Retry attempted", meta: "8s" },
              { tone: "danger", title: "Rollback triggered", meta: "1s" },
              { tone: "neutral", title: "Log entry recorded", meta: "0s" },
            ],
          },
        ]}
      />
    </div>
  )
}
