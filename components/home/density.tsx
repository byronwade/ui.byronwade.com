"use client";

import { Circle } from "lucide-react";
import { Stage } from "@/components/cinematic/stage";
import { Reveal } from "@/components/cinematic/reveal";
import { ScrollScale } from "@/components/cinematic/scroll-scale";

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
    <Stage
      id="density"
      tone="paper"
      className="flex flex-col justify-center px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-14 lg:grid-cols-[0.9fr_1.2fr] lg:items-center lg:gap-20">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
            Density
          </p>
          <h2 className="mt-4 max-w-[14ch] text-3xl font-medium tracking-[-0.035em] text-foreground md:text-5xl">
            Scan like Linear. Rest like Polaris.
          </h2>
          <p className="reading-muted mt-5 max-w-md text-base leading-relaxed tracking-tight">
            The product fills the frame. Stable rows, mono metadata, selected
            state as brand wash — presented as a close-up, not a styleguide tile.
          </p>
        </Reveal>

        <ScrollScale>
          <div className="overflow-hidden rounded-3xl bg-card depth-raised">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
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
                      ? "flex h-11 items-center gap-3 bg-brand/10 px-5"
                      : "flex h-11 items-center gap-3 px-5 transition-colors hover:bg-muted/30"
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
          </div>
        </ScrollScale>
      </div>
    </Stage>
  );
}

export { Density };
