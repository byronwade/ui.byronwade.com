import { TimelineRail } from "@/components/timeline-rail"

export default function Example() {
  return (
    <div className="max-w-xs p-6">
      <TimelineRail
        groups={[
          {
            label: "May 31",
            items: [
              {
                tone: "success",
                title: "Published release v2.4.0",
                meta: "09:12",
              },
              { tone: "info", title: "Ran smoke tests", meta: "08:57" },
            ],
          },
          {
            label: "May 30",
            items: [
              {
                tone: "warning",
                title: "High memory usage detected",
                meta: "22:03",
              },
              { tone: "info", title: "Cache cleared", meta: "21:55" },
              { tone: "success", title: "Backup completed", meta: "20:00" },
            ],
          },
          {
            label: "May 29",
            items: [
              { tone: "danger", title: "Database timeout", meta: "14:30" },
              {
                tone: "success",
                title: "Auto-recovery succeeded",
                meta: "14:31",
              },
            ],
          },
        ]}
        terminalLabel="Nothing recorded before this point"
      />
    </div>
  )
}
