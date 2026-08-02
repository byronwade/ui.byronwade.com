import Link from "next/link"
import { Stage } from "@/components/cinematic/stage"
import { Button } from "@/components/ui/button"
import { colorRoles, themeKnobs as knobs } from "@/lib/design"
import { designCn, typeClass } from "@/lib/design"

function ThemeStrip() {
  return (
    <Stage id="theme" tone="paper" className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className={designCn(typeClass("label"), "text-muted-foreground")}>
              Theme knobs
            </p>
            <h2
              className={designCn(
                typeClass("title"),
                "mt-3 text-3xl md:text-4xl",
              )}
            >
              Re-skin the system — not the components.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              {knobs.length} CSS knobs. {colorRoles.length} closed color roles.
              One accent variable. AIs change{" "}
              <span className="font-mono text-foreground">--brand</span>; the
              grammar holds.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/theme">Full showcase</Link>
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
          {knobs.map((name) => (
            <div key={name} className="rounded-2xl bg-card p-4 edge">
              <div
                className={
                  name.includes("brand")
                    ? "mb-3 h-12 rounded-lg bg-brand"
                    : name.includes("background")
                      ? "mb-3 h-12 rounded-lg bg-background edge"
                      : name.includes("foreground")
                        ? "mb-3 h-12 rounded-lg bg-foreground"
                        : "mb-3 h-12 rounded-lg bg-muted"
                }
                aria-hidden
              />
              <p className="font-mono text-[11px] text-foreground">{name}</p>
            </div>
          ))}
        </div>
      </div>
    </Stage>
  )
}

export { ThemeStrip }
