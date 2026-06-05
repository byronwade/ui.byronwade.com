import { TimelineRail } from "@/components/timeline-rail"

export default function Example() {
  return (
    <div className="max-w-xs p-6">
      <TimelineRail
        groups={[
          {
            label: "Onboarding",
            items: [
              { tone: "success", title: "Email verified", meta: "Day 1" },
              { tone: "success", title: "Profile set up", meta: "Day 1" },
              { tone: "success", title: "First import done", meta: "Day 2" },
              { tone: "success", title: "Invited a colleague", meta: "Day 3" },
            ],
          },
        ]}
        terminalLabel="This is where your journey began"
      />
    </div>
  )
}
