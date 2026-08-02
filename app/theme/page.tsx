import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  activityTokens,
  densitySteps,
  themeKnobs,
} from "@/lib/theme-showcase";
import { surfaces } from "@/lib/surfaces";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Theme",
  description:
    "Meridian theme showcase — tokens, brand, density, and surfaces for AI authors.",
};

export default function ThemePage() {
  return (
    <main className="px-5 pt-20 pb-24 md:px-8 md:pt-24 md:pb-32">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
          Theme showcase
        </p>
        <h1 className="mt-4 max-w-[18ch] text-3xl font-medium tracking-[-0.035em] md:text-5xl">
          The product is the theme.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed tracking-tight text-muted-foreground">
          Meridian is not a custom component zoo. AIs re-skin products through
          tokens and surface contracts — primitives stay shadcn. Contract:{" "}
          <Link
            href="/design.md"
            className="font-mono text-foreground underline-offset-4 hover:underline"
          >
            design.md
          </Link>
          .
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/for-agents">For agents</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/surfaces">Surfaces</Link>
          </Button>
        </div>

        <Separator className="my-14" />

        <section>
          <header className="mb-6 max-w-xl">
            <h2 className="text-2xl font-medium tracking-[-0.03em]">
              Theme knobs
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Override these variables to theme a product. Accented UI follows{" "}
              <span className="font-mono text-foreground">--brand</span>.
            </p>
          </header>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {themeKnobs.map((knob) => (
              <div
                key={knob.name}
                className="rounded-2xl bg-card p-4 edge"
              >
                <div
                  className={cn("mb-3 h-10 rounded-lg", knob.swatch)}
                  aria-hidden
                />
                <p className="font-mono text-xs text-foreground">{knob.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {knob.role}
                </p>
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-14" />

        <section>
          <header className="mb-6 max-w-xl">
            <h2 className="text-2xl font-medium tracking-[-0.03em]">
              Density scale
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Surfaces remap control height by task — one Button, four lanes.
            </p>
          </header>
          <ul className="space-y-2">
            {densitySteps.map((step) => (
              <li
                key={step.token}
                className="flex flex-wrap items-center gap-4 rounded-xl bg-muted/30 px-4 py-3"
              >
                <div
                  className="w-full max-w-xs rounded-lg bg-brand/15"
                  style={{ height: `var(${step.token})` }}
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="font-mono text-xs text-foreground">
                    {step.token}{" "}
                    <span className="text-muted-foreground">{step.px}px</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{step.use}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <Separator className="my-14" />

        <section>
          <header className="mb-6 max-w-xl">
            <h2 className="text-2xl font-medium tracking-[-0.03em]">
              Depth + type
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Edge first. Mono for data. Hierarchy from size and tracking.
            </p>
          </header>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-card p-5 edge">
              <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                edge
              </p>
              <p className="mt-3 text-sm tracking-tight">Hairline inset only</p>
            </div>
            <div className="rounded-2xl bg-card p-5 depth-soft">
              <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                depth-soft
              </p>
              <p className="mt-3 text-sm tracking-tight">Floated panels</p>
            </div>
            <div className="rounded-2xl bg-card p-5 depth-raised">
              <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                depth-raised
              </p>
              <p className="mt-3 text-sm tracking-tight">Overlays sparingly</p>
            </div>
          </div>
          <div className="mt-6 rounded-2xl bg-card p-5 edge">
            <p className="text-3xl font-medium tracking-[-0.035em]">
              Display stays medium
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              UI chrome{" "}
              <span className="text-foreground">text-sm tracking-tight</span>
            </p>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              ISS-1842 · 2h · brand/10 selected
            </p>
          </div>
        </section>

        <Separator className="my-14" />

        <section>
          <header className="mb-6 max-w-xl">
            <h2 className="text-2xl font-medium tracking-[-0.03em]">
              Agent activity
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Fixed pastels for what the agent is doing — not a second brand.
            </p>
          </header>
          <div className="flex flex-wrap gap-2">
            {activityTokens.map((token) => (
              <Badge
                key={token.name}
                className={cn(
                  "border-transparent px-3 py-1 font-mono text-xs text-foreground",
                  token.className,
                )}
              >
                {token.name}
              </Badge>
            ))}
          </div>
        </section>

        <Separator className="my-14" />

        <section>
          <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <h2 className="text-2xl font-medium tracking-[-0.03em]">
                Surfaces remap the theme
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Same tokens. Density and chrome change with the job.
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/surfaces">Open gallery</Link>
            </Button>
          </header>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {surfaces.map((surface) => (
              <Link
                key={surface.id}
                href={`/surfaces#${surface.id}`}
                className="rounded-2xl bg-card p-4 transition-colors edge hover:bg-muted/30"
              >
                <Badge variant="secondary" className="font-mono text-[10px]">
                  {surface.platform}
                </Badge>
                <p className="mt-3 text-sm font-medium tracking-tight">
                  {surface.label}
                </p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  {surface.density}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
