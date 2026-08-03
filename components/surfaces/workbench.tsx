/**
 * Canonical application whole — Cursor-app density:
 * quiet sidebar, compact rows, object-bound agent rail.
 */
import {
  House,
  ListTodo,
  Search,
  Settings,
  Circle,
  Sparkle,
} from "@/lib/icons"
import { Surface } from "@/components/surfaces/surface"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const nav = [
  { label: "Home", icon: House, active: false },
  { label: "Issues", icon: ListTodo, active: true },
  { label: "Settings", icon: Settings, active: false },
]

const rows = [
  {
    id: "ISS-1842",
    title: "Tighten selected-state contrast",
    meta: "2h",
    active: true,
  },
  {
    id: "ISS-1839",
    title: "Ship help drawer reading lane",
    meta: "48m",
    active: false,
  },
  {
    id: "ISS-1831",
    title: "Map activity to agent timeline",
    meta: "—",
    active: false,
  },
  {
    id: "ISS-1820",
    title: "Align edge depth on panels",
    meta: "1d",
    active: false,
  },
]

const events = [
  {
    provenance: "user",
    label: "You",
    body: "Use brand wash on selected rows — not a border.",
  },
  {
    provenance: "assistant",
    label: "Assistant",
    body: "Updating IssueRow to bg-brand/10; checking paper + theater.",
  },
  {
    provenance: "tool",
    label: "edit · IssueRow.tsx",
    body: "Selected treatment → brand/10 fill.",
    activity: "edit" as const,
  },
]

type WorkbenchProps = {
  className?: string
  /** Object-bound AI rail — only when an object needs it. */
  withAgent?: boolean
}

function Workbench({ className, withAgent = true }: WorkbenchProps) {
  return (
    <Surface
      id="application"
      className={cn(
        "flex h-[32rem] overflow-hidden rounded-xl bg-background edge md:h-[36rem]",
        className,
      )}
    >
      <aside className="hidden w-40 shrink-0 flex-col border-r border-border/70 bg-muted/15 text-sidebar-foreground md:flex">
        <p className="px-2.5 pt-2.5 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
          Workspace
        </p>
        <nav className="mt-1.5 flex flex-col gap-px px-1">
          {nav.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 justify-start gap-2 rounded-md px-1.5 text-[12px]",
                item.active && "bg-brand/10 text-foreground hover:bg-brand/10",
              )}
            >
              <item.icon className="size-3.5 opacity-70" />
              {item.label}
            </Button>
          ))}
        </nav>
        <p className="mt-auto px-2.5 pb-2 font-mono text-[10px] text-muted-foreground">
          {withAgent ? "Agent on selection" : "Ready"}
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-8 items-center gap-2 border-b border-border/70 bg-muted/10 px-2.5">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search or jump…"
              className="h-7 border-0 bg-background/80 pl-7 text-[12px] shadow-none focus-visible:ring-1"
            />
          </div>
          <kbd className="font-mono text-[10px] tracking-tight text-muted-foreground">
            ⌘K
          </kbd>
        </header>

        <div
          className={cn(
            "grid min-h-0 flex-1",
            withAgent ? "lg:grid-cols-[1fr_16.5rem]" : "grid-cols-1",
          )}
        >
          <div className="min-h-0 overflow-hidden border-border/70 lg:border-r">
            <Table>
              <TableHeader>
                <TableRow className="h-8 hover:bg-transparent">
                  <TableHead className="h-8 w-7 pl-2.5" />
                  <TableHead className="h-8 w-20 text-[11px]">ID</TableHead>
                  <TableHead className="h-8 text-[11px]">Title</TableHead>
                  <TableHead className="hidden h-8 pr-2.5 text-right text-[11px] sm:table-cell">
                    Meta
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.active ? "selected" : undefined}
                    className="h-8 data-[state=selected]:bg-brand/10"
                  >
                    <TableCell className="pl-2.5">
                      <Circle
                        className={
                          row.active
                            ? "size-2.5 text-brand"
                            : "size-2.5 text-muted-foreground/40"
                        }
                        weight={row.active ? "fill" : "regular"}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-[11px] text-muted-foreground">
                      {row.id}
                    </TableCell>
                    <TableCell className="truncate text-[13px] tracking-tight">
                      {row.title}
                    </TableCell>
                    <TableCell className="hidden pr-2.5 text-right font-mono text-[11px] text-muted-foreground sm:table-cell">
                      {row.meta}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {withAgent ? (
            <aside className="hidden min-h-0 flex-col bg-muted/10 lg:flex">
              <div className="flex h-8 items-center gap-1.5 border-b border-border/70 px-2.5">
                <Sparkle className="size-3.5 text-brand" />
                <span className="font-mono text-[11px] tracking-tight text-muted-foreground">
                  ISS-1842
                </span>
              </div>
              <div className="min-h-0 flex-1 space-y-1.5 overflow-hidden p-2">
                {events.map((event) => (
                  <article
                    key={event.label + event.body}
                    data-provenance={event.provenance}
                    className="rounded-lg bg-background/80 px-2 py-1.5 edge"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {event.label}
                      </span>
                      {event.activity ? (
                        <Badge className="h-4 border-transparent bg-activity-edit px-1.5 font-mono text-[9px] text-foreground">
                          {event.activity}
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-[12px] leading-snug tracking-tight">
                      {event.body}
                    </p>
                  </article>
                ))}
              </div>
              <Separator />
              <div className="p-1.5">
                <Input
                  placeholder="Ask about this issue…"
                  className="h-7 border-0 bg-background text-[12px] shadow-none"
                />
              </div>
            </aside>
          ) : null}
        </div>

        <footer className="flex h-6 items-center justify-between border-t border-border/70 bg-muted/15 px-2.5 font-mono text-[10px] text-muted-foreground">
          <span>application</span>
          <span>{withAgent ? "agent bound" : "idle"}</span>
        </footer>
      </div>
    </Surface>
  )
}

export { Workbench }
export type { WorkbenchProps }
