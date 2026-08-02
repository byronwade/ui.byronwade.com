import Link from "next/link"
import { Stage } from "@/components/cinematic/stage"
import { Button } from "@/components/ui/button"
import { aiStack } from "@/lib/theme-showcase"
import { designCn, typeClass } from "@/lib/design"

function AiStack() {
  return (
    <Stage
      id="for-agents"
      tone="theater"
      className="px-5 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className={designCn(typeClass("label"), "text-brand")}>
              AI architecture
            </p>
            <h2
              className={designCn(
                typeClass("title"),
                "mt-3 text-3xl text-dock-foreground md:text-4xl",
              )}
            >
              Contract → grammar → skills → whole.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-dock-foreground/65 md:text-base">
              design.md sets the law. TypeScript closes the set. Skills teach
              the workflow. The workbench proves it.
            </p>
          </div>
          <Button variant="theater-outline" asChild>
            <Link href="/for-agents">Open guide</Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {aiStack.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              className="rounded-2xl bg-dock-foreground/[0.04] p-5 transition-colors hover:bg-dock-foreground/[0.07]"
            >
              <p className="font-mono text-[10px] text-dock-foreground/45">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-3 font-mono text-sm text-brand">{item.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-dock-foreground/60">
                {item.summary}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </Stage>
  )
}

export { AiStack }
