import { SplitWithRail } from "@/components/split-with-rail"

export default function Example() {
  return (
    <div className="p-6">
      <SplitWithRail
        summary={
          <div className="space-y-4 rounded-2xl edge bg-card p-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Project
              </p>
              <h2 className="mt-1 text-xl font-semibold">my-dashboard</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              A summary column is ideal for identity, stats, or a profile
              snapshot. The right column holds a timeline, log, or event rail.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl edge p-3">
                <p className="text-xs text-muted-foreground">Environment</p>
                <p className="mt-0.5 text-sm font-medium">Production</p>
              </div>
              <div className="rounded-xl edge p-3">
                <p className="text-xs text-muted-foreground">Region</p>
                <p className="mt-0.5 text-sm font-medium">us-east-1</p>
              </div>
            </div>
          </div>
        }
        rail={
          <div className="rounded-2xl edge bg-card p-6">
            <p className="mb-3 text-sm font-semibold">Recent activity</p>
            <ol className="space-y-3">
              {[
                "Deployment triggered",
                "Build completed",
                "Tests passed",
                "Config updated",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <span className="size-2 rounded-full bg-muted-foreground/40 shrink-0" />
                  <span className="flex-1 text-muted-foreground">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        }
      />
    </div>
  )
}
