"use client";

import { motion } from "motion/react";
import { Circle } from "lucide-react";

const rows = [
  {
    id: "ISS-1842",
    title: "Tighten selected-state contrast on resource rows",
    status: "In progress",
    meta: "2h",
    active: true,
  },
  {
    id: "ISS-1839",
    title: "Ship reading-ui lane for docs surfaces",
    status: "Review",
    meta: "48m",
    active: false,
  },
  {
    id: "ISS-1831",
    title: "Map activity tokens to agent timeline",
    status: "Todo",
    meta: "—",
    active: false,
  },
  {
    id: "ISS-1820",
    title: "Align depth-soft with Polaris shadow-100",
    status: "Done",
    meta: "1d",
    active: false,
  },
];

function Density() {
  return (
    <section
      id="density"
      data-slot="density"
      className="scroll-mt-20 border-t border-border px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-20">
        <div>
          <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
            Density
          </p>
          <h2 className="mt-4 max-w-[16ch] text-3xl font-medium tracking-[-0.03em] text-foreground md:text-5xl">
            Scan like Linear. Rest like Polaris.
          </h2>
          <p className="reading-muted mt-5 max-w-md text-base leading-relaxed tracking-tight">
            Stable row heights. Mono metadata. Selected state is brand at 10% —
            never a loud border. Hover is muted, not theatrical.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-2xl bg-card edge"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm tracking-tight text-foreground">
              Issues
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              4 open
            </span>
          </div>
          <ul>
            {rows.map((row) => (
              <li
                key={row.id}
                className={
                  row.active
                    ? "flex h-10 items-center gap-3 bg-brand/10 px-4"
                    : "flex h-10 items-center gap-3 px-4 transition-colors hover:bg-muted/30"
                }
              >
                <Circle
                  className={
                    row.active
                      ? "size-3.5 text-brand"
                      : "size-3.5 text-muted-foreground/50"
                  }
                  strokeWidth={row.active ? 2.5 : 1.5}
                />
                <span className="font-mono text-xs text-muted-foreground">
                  {row.id}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm tracking-tight text-foreground">
                  {row.title}
                </span>
                <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
                  {row.status}
                </span>
                <span className="w-8 text-right font-mono text-xs text-muted-foreground">
                  {row.meta}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

export { Density };
