import {
  Bell,
  ChartBar,
  CreditCard,
  Cube,
  Gear,
  House,
  type Icon,
  MagnifyingGlass,
  Pulse,
  Users,
} from "@/lib/icons"

import { AppShell } from "@/components/app-shell"
import { EventTimeline, type TimelineEvent } from "@/components/event-timeline"
import { Metric } from "@/components/ui/metric"
import { Kbd } from "@/components/ui/kbd"

/**
 * Dashboard shell composed from real system components — the flagship app
 * surface. Sidebar nav + header + a metric row + an activity timeline, all on
 * calm token surfaces with the `edge` hairline and mono metadata.
 */

const NAV: { icon: Icon; label: string; active?: boolean }[] = [
  { icon: House, label: "Overview", active: true },
  { icon: Users, label: "Customers" },
  { icon: Cube, label: "Orders" },
  { icon: ChartBar, label: "Analytics" },
  { icon: CreditCard, label: "Billing" },
  { icon: Gear, label: "Settings" },
]

const ACTIVITY: TimelineEvent[] = [
  {
    title: "Order #4021 fulfilled",
    description: "Shipped to Portland, OR via standard delivery.",
    timestamp: "2026-06-01T14:22:00Z",
    tone: "success",
  },
  {
    title: "New customer signed up",
    description: "avery@northwind.co joined the Pro plan.",
    timestamp: "2026-06-01T13:47:00Z",
    tone: "info",
  },
  {
    title: "Payment retry scheduled",
    description: "Invoice INV-2287 failed once; retrying in 24h.",
    timestamp: "2026-06-01T12:10:00Z",
    tone: "warning",
  },
  {
    title: "Refund issued",
    description: "Order #3998 refunded $84.00 to the customer.",
    timestamp: "2026-06-01T11:02:00Z",
    tone: "danger",
  },
]

export default function Example() {
  return (
    <div className="h-[600px] overflow-hidden rounded-xl edge">
      <AppShell
        variant="dashboard"
        header={
          <>
            <span className="flex size-7 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <House className="size-4" />
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              acme / production
            </span>
            <div className="flex-1" />
            <span className="hidden items-center gap-2 rounded-lg bg-muted/40 px-2.5 py-1.5 text-muted-foreground sm:flex">
              <MagnifyingGlass className="size-3.5" />
              <span className="text-xs">Search</span>
              <Kbd>⌘K</Kbd>
            </span>
            <span className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted/30">
              <Bell className="size-4" />
            </span>
            <span className="size-8 rounded-full bg-brand/15" aria-hidden />
          </>
        }
        sidebar={
          <div className="flex h-full flex-col p-3">
            <p className="px-2 pb-2 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
              Workspace
            </p>
            <nav className="space-y-0.5">
              {NAV.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  aria-current={item.active ? "page" : undefined}
                  className={
                    item.active
                      ? "flex h-8 w-full items-center gap-2.5 rounded-lg bg-brand/10 px-2.5 text-sm text-foreground"
                      : "flex h-8 w-full items-center gap-2.5 rounded-lg px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
                  }
                >
                  <item.icon className="size-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        }
        footer={
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-success" aria-hidden />
            <span className="font-mono text-[11px] text-muted-foreground">
              v2.14.0 · all systems operational
            </span>
          </div>
        }
      >
        <div className="space-y-6 p-6">
          <div>
            <h1 className="text-xl font-normal tracking-tight text-foreground">
              Overview
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              A snapshot of your store over the last 30 days.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric
              variant="card"
              icon={Users}
              label="Active customers"
              value="8,340"
              delta={{ value: "+5.7%", direction: "up" }}
            />
            <Metric
              variant="card"
              icon={CreditCard}
              label="MRR"
              value="$48.2k"
              delta={{ value: "+2.1%", direction: "up" }}
            />
            <Metric
              variant="card"
              icon={Cube}
              label="Orders today"
              value="126"
              delta={{ value: "-1.2%", direction: "down" }}
            />
            <Metric
              variant="card"
              icon={Pulse}
              label="Uptime"
              value="99.99%"
              delta={{ value: "0.0%", direction: "flat" }}
            />
          </div>

          <div className="rounded-2xl edge bg-card p-5">
            <h2 className="mb-4 text-sm font-medium text-foreground">
              Recent activity
            </h2>
            <EventTimeline events={ACTIVITY} />
          </div>
        </div>
      </AppShell>
    </div>
  )
}
