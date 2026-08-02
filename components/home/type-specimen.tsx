"use client";

import { Stage } from "@/components/cinematic/stage";
import { Reveal } from "@/components/cinematic/reveal";

function TypeSpecimen() {
  return (
    <Stage
      id="type"
      tone="paper"
      className="flex flex-col justify-center px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
            Type
          </p>
          <h2 className="mt-4 max-w-[18ch] text-3xl font-medium tracking-[-0.035em] text-foreground md:text-5xl">
            Hierarchy from size and tracking — not weight.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 md:grid-cols-2">
          <Reveal delay={0.05} className="space-y-8">
            <div>
              <p className="font-mono text-xs text-muted-foreground">
                display
              </p>
              <p className="mt-2 text-4xl font-medium tracking-[-0.045em] md:text-6xl">
                Meridian
              </p>
            </div>
            <div>
              <p className="font-mono text-xs text-muted-foreground">ui</p>
              <p className="mt-2 text-sm tracking-tight text-foreground">
                Resource lists stay compact —{" "}
                <span className="text-muted-foreground">
                  14px / tight tracking / Geist Sans
                </span>
              </p>
            </div>
            <div>
              <p className="font-mono text-xs text-muted-foreground">mono</p>
              <p className="mt-2 font-mono text-sm tracking-tight text-foreground">
                ISS-1842 · 48m · bg-brand/10 · --brand
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-3xl bg-card p-6 edge md:p-8">
              <p className="font-mono text-xs text-muted-foreground">
                reading-ui
              </p>
              <div className="reading-ui mt-4 text-foreground">
                <p className="reading-lead">
                  Web reading on emissive screens is not e-ink.
                </p>
                <p className="reading-muted mt-4">
                  Docs use a capped measure and relaxed line-height so
                  paragraphs stay readable without abandoning the product voice.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Stage>
  );
}

export { TypeSpecimen };
