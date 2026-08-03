/**
 * Cursor-app-shaped proof — file tree, editor tabs, object-bound composer.
 * Not a marketing collage; dense operational chrome.
 */
import { FileText, Sparkle, CircleNotch } from "@/lib/icons"
import { Surface } from "@/components/surfaces/surface"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const files = [
  { name: "IssueRow.tsx", active: true },
  { name: "workbench.tsx", active: false },
  { name: "design.md", active: false },
]

const tabs = [
  { name: "IssueRow.tsx", active: true },
  { name: "contrast.ts", active: false },
]

type ComposerShellProps = {
  className?: string
}

function ComposerShell({ className }: ComposerShellProps) {
  return (
    <Surface
      id="desktop"
      className={cn(
        "flex h-[32rem] overflow-hidden rounded-xl bg-background edge md:h-[36rem]",
        className,
      )}
    >
      <aside className="hidden w-40 shrink-0 flex-col border-r border-border/70 bg-muted/20 md:flex">
        <p className="px-2.5 pt-2.5 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
          Explorer
        </p>
        <ul className="mt-1.5 flex flex-col gap-px px-1">
          {files.map((file) => (
            <li key={file.name}>
              <button
                type="button"
                className={cn(
                  "flex h-7 w-full items-center gap-1.5 rounded-md px-1.5 text-left text-[12px] tracking-tight",
                  file.active
                    ? "bg-brand/10 text-foreground"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                )}
              >
                <FileText className="size-3.5 shrink-0 opacity-70" />
                <span className="truncate font-mono text-[11px]">
                  {file.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-8 items-center gap-0 border-b border-border/70 bg-muted/15">
          {tabs.map((tab) => (
            <div
              key={tab.name}
              className={cn(
                "flex h-full items-center gap-1.5 border-r border-border/60 px-3 font-mono text-[11px]",
                tab.active
                  ? "bg-background text-foreground"
                  : "text-muted-foreground",
              )}
            >
              <FileText className="size-3 opacity-60" />
              {tab.name}
            </div>
          ))}
        </div>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[1fr_18rem]">
          <div className="min-h-0 overflow-hidden border-border/70 p-4 font-mono text-[12px] leading-relaxed text-muted-foreground lg:border-r">
            <p className="text-foreground">
              <span className="text-muted-foreground">01</span>
              {"  "}
              <span className="text-brand">export function</span> IssueRow() {"{"}
            </p>
            <p>
              <span className="text-muted-foreground">02</span>
              {"    "}
              <span className="text-muted-foreground">return</span> (
            </p>
            <p className="bg-brand/10 text-foreground">
              <span className="text-muted-foreground">03</span>
              {"      "}
              &lt;tr className=
              <span className="text-brand">&quot;bg-brand/10&quot;</span>&gt;
            </p>
            <p>
              <span className="text-muted-foreground">04</span>
              {"        "}
              …
            </p>
            <p>
              <span className="text-muted-foreground">05</span>
              {"      "}&lt;/tr&gt;
            </p>
            <p>
              <span className="text-muted-foreground">06</span>
              {"    "})
            </p>
            <p>
              <span className="text-muted-foreground">07</span>
              {"  "}
              {"}"}
            </p>
          </div>

          <aside className="hidden min-h-0 flex-col bg-muted/10 lg:flex">
            <div className="flex h-8 items-center gap-2 border-b border-border/70 px-3">
              <Sparkle className="size-3.5 text-brand" />
              <span className="font-mono text-[11px] text-muted-foreground">
                Agent
              </span>
              <Badge
                variant="outline"
                className="ml-auto h-4 border-transparent bg-activity-edit/80 px-1.5 font-mono text-[9px] text-foreground"
              >
                edit
              </Badge>
            </div>
            <div className="min-h-0 flex-1 space-y-2 overflow-hidden p-2.5">
              <article
                data-provenance="user"
                className="rounded-lg bg-background/80 px-2.5 py-2 edge"
              >
                <p className="font-mono text-[10px] text-muted-foreground">
                  You
                </p>
                <p className="mt-1 text-[12px] leading-relaxed tracking-tight">
                  Apply brand wash on the selected row — Cursor-dense chrome.
                </p>
              </article>
              <article
                data-provenance="assistant"
                className="rounded-lg bg-background/80 px-2.5 py-2 edge"
              >
                <div className="flex items-center gap-1.5">
                  <CircleNotch className="size-3 animate-spin text-brand" />
                  <p className="font-mono text-[10px] text-muted-foreground">
                    Assistant
                  </p>
                </div>
                <p className="mt-1 text-[12px] leading-relaxed tracking-tight">
                  Patching{" "}
                  <span className="font-mono text-[11px] text-foreground">
                    IssueRow.tsx
                  </span>{" "}
                  — selected → <span className="font-mono">bg-brand/10</span>.
                </p>
              </article>
            </div>
            <Separator />
            <div className="flex items-center gap-1.5 p-2">
              <Input
                placeholder="Ask about this file…"
                className="h-8 border-0 bg-background text-[12px] shadow-none focus-visible:ring-1"
              />
              <Button size="sm" variant="ghost" className="shrink-0 px-2">
                ⌘↵
              </Button>
            </div>
          </aside>
        </div>

        <footer className="flex h-6 items-center justify-between border-t border-border/70 bg-muted/20 px-3 font-mono text-[10px] text-muted-foreground">
          <span>Meridian · application</span>
          <span>Ln 3 · UTF-8</span>
        </footer>
      </div>
    </Surface>
  )
}

export { ComposerShell }
export type { ComposerShellProps }
