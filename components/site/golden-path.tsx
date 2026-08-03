import { CopyButton } from "@/components/docs/copy-button"
import { cn } from "@/lib/utils"

const GOLDEN_PATH = `import { Button } from "@/components/ui/button"
import { typesetClass, radiusIntent } from "@/lib/design"

export function Panel() {
  return (
    <section data-surface="application" className="shell-pad shell-stack">
      <h2 className="type-section">Issues</h2>
      <Button className={radiusIntent("control")}>New</Button>
      <div className={typesetClass("docs")}>{/* help HTML */}</div>
    </section>
  )
}`

/**
 * DX golden path — shortest correct compose for agents.
 * Progressive disclosure: this first, deep contracts on Ask.
 */
function GoldenPath({ className }: { className?: string }) {
  return (
    <section
      data-slot="golden-path"
      className={cn("space-y-4", className)}
      id="golden-path"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] tracking-[0.14em] text-brand uppercase">
            DX · Always tier
          </p>
          <h2 className="mt-1 text-xl font-medium tracking-[-0.03em] text-foreground md:text-2xl">
            Golden path
          </h2>
          <p className="mt-2 max-w-prose text-sm text-muted-foreground">
            Compose shadcn + frozen presets. Depth loads on Ask — don’t dump
            every skill into the first prompt.
          </p>
        </div>
        <CopyButton value={GOLDEN_PATH} label="Copy path" />
      </div>
      <pre className="overflow-x-auto rounded-2xl bg-dock px-4 py-4 font-mono text-[0.8125rem] leading-relaxed text-dock-foreground edge md:px-5">
        <code>{GOLDEN_PATH}</code>
      </pre>
      <ol className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
        <li className="rounded-lg bg-muted/25 px-3 py-2">
          <span className="font-mono text-[10px] text-foreground">1</span>
          {" · "}
          <code className="font-mono text-[11px] text-foreground">
            data-surface
          </code>
        </li>
        <li className="rounded-lg bg-muted/25 px-3 py-2">
          <span className="font-mono text-[10px] text-foreground">2</span>
          {" · "}
          shadcn atoms only
        </li>
        <li className="rounded-lg bg-muted/25 px-3 py-2">
          <span className="font-mono text-[10px] text-foreground">3</span>
          {" · "}
          <code className="font-mono text-[11px] text-foreground">
            typesetClass
          </code>
        </li>
      </ol>
    </section>
  )
}

export { GoldenPath, GOLDEN_PATH }
