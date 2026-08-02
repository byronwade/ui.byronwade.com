"use client";

import { Stage } from "@/components/cinematic/stage";
import { Reveal } from "@/components/cinematic/reveal";

const principles = [
  {
    source: "Polaris",
    take: "Soft elevation. Dense resource lists. Calm neutrals that survive an eight-hour admin shift.",
  },
  {
    source: "Vercel",
    take: "Typographic authority. Mono for data. Sparse craft that trusts negative space.",
  },
  {
    source: "Linear",
    take: "Row density. Selected states. Keyboard-first scanning without visual noise.",
  },
  {
    source: "Cursor",
    take: "Object-bound AI. Activity semantics. Panels that name what the agent is doing.",
  },
  {
    source: "OpenAI",
    take: "Conversational provenance. Approachable message rhythm without chatbot cliché.",
  },
  {
    source: "Cinema",
    take: "Full-bleed frames. One idea per cut. Product as the only subject in the shot.",
  },
];

function Principles() {
  return (
    <Stage
      id="system"
      tone="paper"
      className="flex flex-col justify-center px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
            The merge
          </p>
          <h2 className="mt-4 max-w-[18ch] text-3xl font-medium tracking-[-0.035em] text-foreground md:text-5xl">
            Five systems. Plus cinema. One accent.
          </h2>
          <p className="reading-muted mt-5 max-w-xl text-base leading-relaxed tracking-tight">
            Operational craft from the tools you trust — staged with the
            discipline of a product film.
          </p>
        </Reveal>

        <ul className="mt-16 divide-y divide-border overflow-hidden rounded-3xl bg-card edge">
          {principles.map((item, index) => (
            <li key={item.source}>
              <Reveal delay={index * 0.04} y={16}>
                <div className="grid gap-2 px-5 py-5 transition-colors hover:bg-muted/30 md:grid-cols-[8rem_1fr] md:gap-8 md:px-6 md:py-6">
                  <span className="font-mono text-xs tracking-tight text-brand">
                    {item.source}
                  </span>
                  <p className="text-sm leading-relaxed tracking-tight text-foreground md:text-base">
                    {item.take}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Stage>
  );
}

export { Principles };
