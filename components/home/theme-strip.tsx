import Link from "next/link";
import { Stage } from "@/components/cinematic/stage";
import { Button } from "@/components/ui/button";
import { themeKnobs } from "@/lib/theme-showcase";
import { cn } from "@/lib/utils";

function ThemeStrip() {
  return (
    <Stage id="theme" tone="paper" className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
              Theme
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-0.035em] md:text-4xl">
              Re-skin with knobs — not forks.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              One accent variable. Cool paper. Density by task. AIs change{" "}
              <span className="font-mono text-foreground">--brand</span> and the
              system follows.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/theme">Full showcase</Link>
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {themeKnobs.slice(0, 4).map((knob) => (
            <div key={knob.name} className="rounded-2xl bg-card p-4 edge">
              <div
                className={cn("mb-3 h-12 rounded-lg", knob.swatch)}
                aria-hidden
              />
              <p className="font-mono text-[11px] text-foreground">{knob.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{knob.role}</p>
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
}

export { ThemeStrip };
