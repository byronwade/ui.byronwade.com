import { PanelLeft, Search, Terminal, FileText } from "lucide-react";
import { Surface } from "@/components/surfaces/surface";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

function DesktopFrame({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl bg-foreground/10 depth-soft",
        className,
      )}
    >
      <div className="flex h-8 items-center gap-2 border-b border-border/60 bg-muted/80 px-3">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-foreground/20" />
          <span className="size-2.5 rounded-full bg-foreground/20" />
          <span className="size-2.5 rounded-full bg-foreground/20" />
        </div>
        <p className="flex-1 text-center font-mono text-[10px] text-muted-foreground">
          Meridian — Issues
        </p>
        <Badge variant="outline" className="h-5 font-mono text-[10px]">
          ⌘⇧P
        </Badge>
      </div>

      <Surface id="desktop" className="flex h-[26rem] bg-background md:h-[28rem]">
        <aside className="flex w-10 flex-col items-center gap-1 border-r border-border py-2">
          <Button variant="ghost" size="icon-xs" aria-label="Sidebar">
            <PanelLeft />
          </Button>
          <Button
            variant="secondary"
            size="icon-xs"
            className="bg-brand/10"
            aria-label="Files"
          >
            <FileText />
          </Button>
          <Button variant="ghost" size="icon-xs" aria-label="Terminal">
            <Terminal />
          </Button>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-(--control-h) items-center gap-1 border-b border-border px-2">
            <Button variant="ghost" size="xs">
              File
            </Button>
            <Button variant="ghost" size="xs">
              Edit
            </Button>
            <Button variant="ghost" size="xs">
              View
            </Button>
            <div className="ml-auto flex items-center gap-1">
              <Search className="size-3 text-muted-foreground" />
              <span className="font-mono text-[10px] text-muted-foreground">
                Quick Open
              </span>
            </div>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-[11rem_1fr]">
            <div className="overflow-auto border-r border-border p-2">
              <p className="px-1 font-mono text-[10px] text-muted-foreground uppercase">
                Explorer
              </p>
              <ul className="mt-1 space-y-0.5">
                {["issues/", "components/", "lib/", "docs/"].map((name) => (
                  <li key={name}>
                    <button
                      type="button"
                      className="flex h-(--row-h) w-full items-center rounded-md px-1.5 text-left font-mono text-[11px] tracking-tight hover:bg-muted/50"
                    >
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col">
              <div className="flex-1 p-3">
                <p className="font-mono text-[10px] text-muted-foreground">
                  ISS-1842
                </p>
                <h4 className="mt-1 text-sm font-medium tracking-tight">
                  Selected state uses brand wash
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Desktop native keeps Meridian tokens with tighter chrome —
                  menus, activity bar, status — not an OS theme fork.
                </p>
                <Separator className="my-3" />
                <div className="rounded-lg bg-muted/40 p-2 font-mono text-[11px] leading-relaxed">
                  <span className="text-brand">edit</span> · IssueRow.tsx
                  <br />
                  bg-brand/10 on selected
                </div>
              </div>
              <footer className="flex h-6 items-center justify-between border-t border-border px-2 font-mono text-[10px] text-muted-foreground">
                <span>desktop · compact</span>
                <span>Ln 42 · UTF-8</span>
              </footer>
            </div>
          </div>
        </div>
      </Surface>
    </div>
  );
}

export { DesktopFrame };
