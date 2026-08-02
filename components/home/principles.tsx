"use client";

import { motion } from "motion/react";

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
];

function Principles() {
  return (
    <section
      id="system"
      data-slot="principles"
      className="scroll-mt-20 border-t border-border px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
          The merge
        </p>
        <h2 className="mt-4 max-w-[18ch] text-3xl font-medium tracking-[-0.03em] text-foreground md:text-5xl">
          Five systems. One accent. One depth model.
        </h2>
        <p className="reading-muted mt-5 max-w-xl text-base leading-relaxed tracking-tight">
          Anyone can stack Linear rows on Vercel type. Meridian binds them with
          cool paper, steel-teal brand, Polaris-shaped depth that defaults to
          none, and AI that only appears when attached to a product object.
        </p>

        <ul className="mt-16 divide-y divide-border edge overflow-hidden rounded-2xl bg-card">
          {principles.map((item, index) => (
            <motion.li
              key={item.source}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.45,
                delay: index * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="grid gap-2 px-5 py-5 transition-colors hover:bg-muted/30 md:grid-cols-[8rem_1fr] md:gap-8 md:px-6 md:py-6"
            >
              <span className="font-mono text-xs tracking-tight text-brand">
                {item.source}
              </span>
              <p className="text-sm leading-relaxed tracking-tight text-foreground md:text-base">
                {item.take}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export { Principles };
