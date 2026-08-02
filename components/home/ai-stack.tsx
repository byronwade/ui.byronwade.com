import Link from "next/link";
import { Stage } from "@/components/cinematic/stage";
import { Button } from "@/components/ui/button";
import { aiStack } from "@/lib/theme-showcase";

function AiStack() {
  return (
    <Stage id="for-agents" tone="paper" className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
              AI architecture
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-0.035em] md:text-4xl">
              Contract. Skills. Agents. Theme.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              The website showcases the theme. The repo teaches agents how to
              author it — short rules, progressive skills, roles with
              checklists.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/for-agents">Open guide</Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {aiStack.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              className="rounded-2xl bg-card p-5 transition-colors edge hover:bg-muted/30"
            >
              <p className="font-mono text-[10px] text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-3 font-mono text-sm text-brand">{item.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.summary}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </Stage>
  );
}

export { AiStack };
