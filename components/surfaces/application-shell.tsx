import { House, ListTodo, Search, Settings, Circle } from "lucide-react";
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
    title: "Selected state uses brand wash",
    status: "In progress",
    active: true,
  },
  {
    id: "ISS-1839",
    title: "Ship reading-ui for help drawer",
    status: "Review",
    active: false,
  },
  {
    id: "ISS-1831",
    title: "Wire activity tokens to timeline",
    status: "Todo",
    active: false,
  },
];

function ApplicationShell({ className }: { className?: string }) {
  return (
    <Surface
      id="application"
      className={cn(
        "flex h-[28rem] overflow-hidden rounded-2xl bg-background edge md:h-[32rem]",
        className,
      )}
    >
      <aside className="hidden w-48 shrink-0 flex-col border-r border-border bg-sidebar p-3 text-sidebar-foreground sm:flex">
        <p className="px-2 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
          Workspace
        </p>
        <nav className="mt-3 flex flex-col gap-0.5">
          {nav.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "justify-start gap-2",
                item.active && "bg-brand/10 text-foreground hover:bg-brand/10",
              )}
            >
              <item.icon className="size-3.5" />
              {item.label}
            </Button>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-11 items-center gap-2 border-b border-border px-3">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search issues…"
              className="h-(--control-h) border-0 bg-muted/40 pl-8 shadow-none focus-visible:ring-1"
            />
          </div>
          <Badge variant="secondary" className="font-mono text-[10px]">
            ⌘K
          </Badge>
        </header>

        <div className="min-h-0 flex-1 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8 pl-3" />
                <TableHead className="w-24">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="pr-3 text-right">Status</TableHead>
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
                  <TableCell className="pr-3 text-right font-mono text-xs text-muted-foreground">
                    {row.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Separator />
        <footer className="flex items-center justify-between px-3 py-2">
          <p className="font-mono text-[10px] text-muted-foreground">
            application · compact
          </p>
          <Button size="sm">New issue</Button>
        </footer>
      </div>
    </Surface>
  );
}

export { ApplicationShell };
