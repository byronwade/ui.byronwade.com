import { SplitWithRail } from "@/components/split-with-rail"
import { EventTimeline, type TimelineEvent } from "@/components/event-timeline"

const steps: TimelineEvent[] = [
  {
    title: "Account created",
    description: "Signed up via Google OAuth.",
    timestamp: "Step 1 of 5",
    tone: "success",
  },
  {
    title: "Profile completed",
    description: "Name, timezone, and avatar set.",
    timestamp: "Step 2 of 5",
    tone: "success",
  },
  {
    title: "Team invited",
    description: "Sent 3 invitations, 2 accepted.",
    timestamp: "Step 3 of 5",
    tone: "success",
  },
  {
    title: "Integration connected",
    description: "GitHub repository linked.",
    timestamp: "Step 4 of 5",
    tone: "warning",
  },
  {
    title: "First project created",
    description: "Waiting for you to add a project.",
    timestamp: "Step 5 of 5",
    tone: "neutral",
  },
]

export default function Example() {
  return (
    <div className="p-6">
      {/* className overrides the default 1fr/1.1fr ratio to give the summary more space */}
      <SplitWithRail
        className="lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"
        summary={
          <div className="space-y-5 rounded-2xl edge bg-card p-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Onboarding
              </p>
              <h2 className="mt-1 text-2xl font-medium">Get started</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Complete each step to unlock the full product experience. You
                can come back to any step at any time from your settings page.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">3 / 5 complete</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[60%] rounded-full bg-success transition-all duration-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="rounded-full edge px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
                Skip for now
              </button>
              <button className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity">
                Continue setup
              </button>
            </div>
          </div>
        }
        rail={
          <div className="rounded-2xl edge bg-card p-6">
            <p className="mb-4 text-sm font-semibold">Setup checklist</p>
            <EventTimeline events={steps} />
          </div>
        }
      />
    </div>
  )
}
