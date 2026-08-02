import {
  House,
  ListTodo,
  Search,
  Settings,
  Circle,
  Sparkle,
} from "@/lib/icons";
import { Surface } from "@/components/surfaces/surface";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Home", icon: House, active: false },
  { label: "Issues", icon: ListTodo, active: true },
  { label: "Settings", icon: Settings, active: false },
];

const rows = [
  {
    id: "ISS-1842",
    title: "Tighten selected-state contrast",
    status: "In progress",
    meta: "2h",
    active: true,
  },
  {
    id: "ISS-1839",
    title: "Ship help drawer reading lane",
    status: "Review",
    meta: "48m",
    active: false,
  },
  {
    id: "ISS-1831",
    title: "Map activity to agent timeline",
    status: "Todo",
    meta: "—",
    active: false,
  },
  {
    id: "ISS-1820",
    title: "Align edge depth on panels",
    status: "Done",
    meta: "1d",
    active: false,
  },
];

const events = [
  {
    provenance: "user",
    label: "You",
    body: "Use brand wash on selected rows — not a border.",
  },
  {
    provenance: "assistant",
    label: "Assistant",
    body: "Updating IssueRow to `bg-brand/10` and checking both themes.",
  },
  {
    provenance: "tool",
    label: "edit · IssueRow.tsx",
    body: "Selected treatment → brand/10 fill.",
    activity: "edit",
  },
];

type WorkbenchProps = {
  className?: string;
  /** Object-bound AI rail — only when an object needs it. */
  withAgent?: boolean;
};

/** Canonical Meridian whole: quiet chrome, dense index, object-bound AI. */
function Workbench({ className, withAgent = true }: WorkbenchProps) {
  return (
    <Surface
      id="application"
      className={cn(
        "flex h-[32rem] overflow-hidden rounded-2xl bg-background edge md:h-[36rem]",
        className,
      )}
    >
      <aside className="hidden w-44 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-2.5 text-sidebar-foreground md:flex">
        <p className="px-2 pt-1 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
          Workspace
        </p>
        <nav className="mt-2 flex flex-col gap-0.5">
          {nav.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              size="sm"
              className={cn(
                "justify-start gap-2",
                item.active && "bg-brand/10 text-foreground hover:bg-brand/10",
              )}
            >
              <item.icon className="size-3.5 opacity-70" />
              {item.label}
            </Button>
          ))}
        </nav>
        <p className="mt-auto px-2 pb-1 font-mono text-[10px] text-muted-foreground/80">
          {withAgent ? "Agent on selection" : "Ready"}
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-10 items-center gap-2 border-b border-border/80 px-3">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground/80" />
            <Input
              placeholder="Search or jump…"
              className="h-(--control-h) border-0 bg-muted/30 pl-8 shadow-none focus-visible:ring-1"
            />
          </div>
          <kbd className="font-mono text-[10px] tracking-tight text-muted-foreground">
            ⌘K
          </kbd>
        </header>

        <div
          className={cn(
            "grid min-h-0 flex-1",
            withAgent ? "lg:grid-cols-[1fr_17rem]" : "grid-cols-1",
          )}
        >
          <div className="min-h-0 overflow-hidden border-border lg:border-r">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8 pl-3" />
                  <TableHead className="w-24">ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden pr-3 text-right sm:table-cell">
                    Meta
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.active ? "selected" : undefined}
                    className="h-(--row-h) data-[state=selected]:bg-brand/10"
                  >
                    <TableCell className="pl-3">
                      <Circle
                        className={
                          row.active
                            ? "size-3 text-brand"
                            : "size-3 text-muted-foreground/40"
                        }
                        strokeWidth={row.active ? 2.5 : 1.5}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {row.id}
                    </TableCell>
                    <TableCell className="truncate tracking-tight">
                      {row.title}
                    </TableCell>
                    <TableCell className="hidden pr-3 text-right font-mono text-xs text-muted-foreground sm:table-cell">
                      {row.meta}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {withAgent ? (
            <aside className="hidden min-h-0 flex-col lg:flex">
              <div className="flex h-10 items-center gap-2 border-b border-border/80 px-3">
                <Sparkle className="size-3.5 text-brand opacity-80" />
                <span className="font-mono text-[11px] tracking-tight text-muted-foreground">
                  ISS-1842
                </span>
              </div>
              <div className="min-h-0 flex-1 space-y-2 overflow-hidden p-3">
                {events.map((event) => (
                  <article
                    key={event.label + event.body}
                    data-provenance={event.provenance}
                    className="rounded-lg bg-muted/25 p-2.5"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {event.label}
                      </span>
                      {"activity" in event && event.activity ? (
                        <Badge className="h-4 border-transparent bg-activity-edit px-1.5 font-mono text-[9px] text-foreground">
                          {event.activity}
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed tracking-tight">
                      {event.body}
                    </p>
                  </article>
                ))}
              </div>
              <Separator />
              <div className="p-2">
                <Input
                  placeholder="Ask about this issue…"
                  className="h-(--control-h) border-0 bg-muted/25 shadow-none"
                />
              </div>
            </aside>
          ) : null}
        </div>
      </div>
    </Surface>
  );
}

export { Workbench };
export type { WorkbenchProps };
