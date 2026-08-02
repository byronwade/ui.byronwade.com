import Link from "next/link"
import { Stage } from "@/components/cinematic/stage"
import { Button } from "@/components/ui/button"
import { zones } from "@/lib/design"
import { designCn, typeClass } from "@/lib/design"

function GrammarSplit() {
  return (
    <Stage id="grammar" tone="paper" className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className={designCn(typeClass("label"), "text-muted-foreground")}>
            Typed grammar
          </p>
          <h2
            className={designCn(
              typeClass("title"),
              "mt-3 text-3xl md:text-5xl",
            )}
          >
            Strict where AIs drift.
            <br />
            Open where they create.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Soft warm neutrals and one deep accent are frozen in the grammar.
            Agents invent stories and compositions — not new whites, blacks, or
            bright colors.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl bg-card p-6 edge md:p-8">
            <p className={designCn(typeClass("label"), "text-brand")}>
              Frozen
            </p>
            <p className="mt-3 text-xl font-medium tracking-tight">
              Compile-time + lint
            </p>
            <ul className="mt-6 space-y-2">
              {zones.frozen.map((item) => (
                <li
                  key={item}
                  className="font-mono text-sm text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-dock p-6 text-dock-foreground md:p-8">
            <p className={designCn(typeClass("label"), "text-brand")}>
              Creative
            </p>
            <p className="mt-3 text-xl font-medium tracking-tight">
              Invent freely here
            </p>
            <ul className="mt-6 space-y-2">
              {zones.creative.map((item) => (
                <li
                  key={item}
                  className="font-mono text-sm text-dock-foreground/65"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <Button variant="outline" asChild>
            <Link href="/for-agents">How agents load this</Link>
          </Button>
        </div>
      </div>
    </Stage>
  )
}

export { GrammarSplit }
