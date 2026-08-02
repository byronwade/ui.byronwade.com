"use client";

import { motion } from "motion/react";

const swatches = [
  { name: "background", className: "bg-background edge" },
  { name: "foreground", className: "bg-foreground" },
  { name: "brand", className: "bg-brand" },
  { name: "muted", className: "bg-muted edge" },
  { name: "card", className: "bg-card edge" },
  { name: "dock", className: "bg-dock" },
];

const depths = [
  { name: "none", className: "depth-none edge" },
  { name: "soft", className: "depth-soft" },
  { name: "raised", className: "depth-raised" },
];

function Tokens() {
  return (
    <section
      id="tokens"
      data-slot="tokens"
      className="scroll-mt-20 border-t border-border px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
          Tokens
        </p>
        <h2 className="mt-4 max-w-[18ch] text-3xl font-medium tracking-[-0.03em] text-foreground md:text-5xl">
          Cool paper. One arc. Depth that earns its keep.
        </h2>
        <p className="reading-muted mt-5 max-w-xl text-base leading-relaxed tracking-tight">
          Surfaces use semantic tokens only. Brand is steel-teal — reskin the
          whole system by overriding{" "}
          <code className="font-mono text-sm text-foreground">--brand</code>.
          Depth defaults to an edge hairline; elevation is opt-in.
        </p>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-4 font-mono text-xs tracking-tight text-muted-foreground">
              Color
            </p>
            <div className="grid grid-cols-3 gap-3">
              {swatches.map((swatch) => (
                <div key={swatch.name} className="space-y-2">
                  <div
                    className={`aspect-[4/3] rounded-2xl ${swatch.className}`}
                  />
                  <p className="font-mono text-xs text-muted-foreground">
                    {swatch.name}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p className="mb-4 font-mono text-xs tracking-tight text-muted-foreground">
              Depth
            </p>
            <div className="grid grid-cols-3 gap-3">
              {depths.map((depth) => (
                <div key={depth.name} className="space-y-2">
                  <div
                    className={`flex aspect-[4/3] items-end rounded-2xl bg-card p-3 ${depth.className}`}
                  >
                    <span className="font-mono text-xs text-muted-foreground">
                      {depth.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl bg-muted/30 p-5 edge">
              <p className="font-mono text-xs text-muted-foreground">
                activity
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(
                  [
                    ["thinking", "bg-activity-thinking"],
                    ["search", "bg-activity-search"],
                    ["read", "bg-activity-read"],
                    ["edit", "bg-activity-edit"],
                  ] as const
                ).map(([label, cls]) => (
                  <span
                    key={label}
                    className={`rounded-full px-3 py-1 font-mono text-xs tracking-tight text-foreground ${cls}`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export { Tokens };
