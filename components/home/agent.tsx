"use client";

import { motion } from "motion/react";

const events = [
  {
    provenance: "user",
    label: "You",
    body: "Tighten the selected state on issue rows — brand wash, not a border.",
  },
  {
    provenance: "assistant",
    label: "Assistant",
    body: "Updating `IssueRow` selected styles to `bg-brand/10` and verifying contrast in both themes.",
  },
  {
    provenance: "tool",
    label: "edit · IssueRow.tsx",
    body: "Replaced border-brand selected treatment with brand/10 fill.",
    activity: "edit" as const,
  },
];

function Agent() {
  return (
    <section
      id="agent"
      data-slot="agent"
      className="scroll-mt-20 border-t border-border px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-20">
        <div>
          <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
            Object-bound AI
          </p>
          <h2 className="mt-4 max-w-[16ch] text-3xl font-medium tracking-[-0.03em] text-foreground md:text-5xl">
            Agents attach to work — never float.
          </h2>
          <p className="reading-muted mt-5 max-w-md text-base leading-relaxed tracking-tight">
            From Cursor and OpenAI: every turn names a provenance. Activity
            pastels encode what the model is doing — thinking, search, read,
            edit — and are never used as decoration.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-3"
        >
          {events.map((event) => (
            <article
              key={event.label + event.body}
              data-provenance={event.provenance}
              className="rounded-2xl bg-card p-4 edge"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs tracking-tight text-muted-foreground">
                  {event.label}
                </span>
                {"activity" in event && event.activity ? (
                  <span className="rounded-full bg-activity-edit px-2 py-0.5 font-mono text-[10px] tracking-tight text-foreground">
                    {event.activity}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm leading-relaxed tracking-tight text-foreground">
                {event.body}
              </p>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export { Agent };
