import type { Metadata } from "next"
import Link from "next/link"
import { DocShell } from "@/components/docs/doc-shell"
import { Button } from "@/components/ui/button"
import {
  activity,
  activityRoles,
  banned,
  cinematicLaws,
  colorRoles,
  depths,
  radii,
  themeKnobs,
} from "@/lib/design"
import { surfaces } from "@/lib/surfaces"
import { densitySteps } from "@/lib/theme-showcase"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Theme",
  description:
    "Meridian cinematic design grammar — live knobs, closed tokens, density.",
}

const knobSwatch: Record<string, string> = {
  "--brand": "bg-brand",
  "--brand-foreground": "bg-brand-foreground edge",
  "--brand-muted": "bg-brand-muted",
  "--background": "bg-background edge",
  "--foreground": "bg-foreground",
  "--radius": "bg-muted",
}

export default function ThemePage() {
  return (
    <DocShell
      eyebrow="Theme"
      title="See the system."
      lead="Closed sets in lib/design. Live knobs in CSS. Drift fails check:design."
      measure="wide"
      actions={
        <>
          <Button variant="outline" size="default" asChild>
            <Link href="/design">Design</Link>
          </Button>
          <Button variant="ghost" size="default" asChild>
            <Link href="/surfaces">Surfaces</Link>
          </Button>
        </>
      }
    >
      <section>
        <h2 className="text-xl font-medium tracking-[-0.03em] md:text-2xl">
          Accent
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          One deep ink-teal. Everything brand-colored resolves here.
        </p>
        <div className="mt-6 overflow-hidden rounded-3xl bg-card edge">
          <div className="flex h-36 items-end bg-brand p-5 md:h-44 md:p-6">
            <p className="font-mono text-sm text-brand-foreground">--brand</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3">
            {(
              [
                ["bg-brand/10", "selected"],
                ["bg-brand-muted", "muted"],
                ["bg-dock", "theater"],
              ] as const
            ).map(([swatch, label]) => (
              <div
                key={label}
                className={cn("flex h-24 flex-col justify-end p-4", swatch)}
              >
                <p
                  className={cn(
                    "font-mono text-[11px]",
                    label === "theater"
                      ? "text-dock-foreground"
                      : "text-foreground",
                  )}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-medium tracking-[-0.03em] md:text-2xl">
          Paper
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Soft warm stone — never pure white or pure black.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(
            [
              ["bg-background edge", "background"],
              ["bg-card edge", "card"],
              ["bg-muted", "muted"],
              ["bg-dock", "dock"],
            ] as const
          ).map(([swatch, label]) => (
            <div
              key={label}
              className={cn(
                "flex h-28 flex-col justify-end rounded-2xl p-3",
                swatch,
              )}
            >
              <p
                className={cn(
                  "font-mono text-[11px]",
                  label === "dock" ? "text-dock-foreground" : "text-foreground",
                )}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-medium tracking-[-0.03em] md:text-2xl">
          Theme knobs
        </h2>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          {themeKnobs.map((name) => (
            <div
              key={name}
              className="flex items-center gap-3 rounded-2xl bg-card px-3 py-3 edge"
            >
              <div
                className={cn(
                  "size-10 shrink-0 rounded-lg",
                  knobSwatch[name] ?? "bg-muted",
                )}
                aria-hidden
              />
              <p className="truncate font-mono text-xs">{name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-medium tracking-[-0.03em] md:text-2xl">
          Cinematic laws
        </h2>
        <ol className="mt-6 space-y-3">
          {Object.entries(cinematicLaws).map(([key, value], i) => (
            <li
              key={key}
              className="flex gap-3 border-b border-border/60 py-3 last:border-b-0"
            >
              <span className="w-6 shrink-0 font-mono text-sm text-muted-foreground">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="font-mono text-sm text-foreground">{key}</p>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                  {String(value)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-medium tracking-[-0.03em] md:text-2xl">
          Shape · depth
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
              radii
            </p>
            <ul className="mt-4 space-y-3">
              {radii.map((r) => (
                <li key={r} className="flex items-center gap-3">
                  <div
                    className={cn("size-12 shrink-0 bg-brand/15 edge", r)}
                    aria-hidden
                  />
                  <span className="font-mono text-xs">{r}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
              depths
            </p>
            <ul className="mt-4 space-y-3">
              {depths.map((d) => (
                <li
                  key={d}
                  className={cn(
                    "rounded-2xl bg-card px-4 py-3",
                    d === "edge" ? "edge" : d,
                  )}
                >
                  <span className="font-mono text-xs">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-medium tracking-[-0.03em] md:text-2xl">
          Density
        </h2>
        <ul className="mt-6 space-y-2">
          {densitySteps.map((step) => (
            <li key={step.token} className="rounded-2xl bg-muted/30 px-4 py-3">
              <div
                className="mb-2 w-full max-w-xs rounded-lg bg-brand/15"
                style={{ height: `var(${step.token})` }}
                aria-hidden
              />
              <p className="font-mono text-xs">
                {step.token}{" "}
                <span className="text-muted-foreground">{step.px}px</span>
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">{step.use}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-medium tracking-[-0.03em] md:text-2xl">
          Color roles
        </h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {colorRoles.map((role) => (
            <span
              key={role}
              className="rounded-full bg-muted/50 px-3 py-1.5 font-mono text-[11px] text-foreground"
            >
              {role}
            </span>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {activityRoles.map((role) => (
            <span
              key={role}
              className={cn(
                "rounded-full px-3 py-1.5 font-mono text-[11px] text-foreground",
                activity(role),
              )}
            >
              {role}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-medium tracking-[-0.03em] md:text-2xl">
          Banned
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Enforced by npm run check:design.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {banned.map((item) => (
            <span
              key={item}
              className="rounded-full bg-destructive/10 px-3 py-1.5 font-mono text-[11px] text-destructive"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-xl font-medium tracking-[-0.03em] md:text-2xl">
            Surfaces
          </h2>
          <Link
            href="/surfaces"
            className="text-sm text-brand transition-opacity hover:opacity-80"
          >
            Gallery ›
          </Link>
        </div>
        <ul className="mt-6 space-y-2">
          {surfaces.map((surface) => (
            <li key={surface.id}>
              <Link
                href={`/surfaces#${surface.id}`}
                className="flex flex-col gap-0.5 rounded-2xl bg-card px-4 py-3.5 transition-colors edge hover:bg-muted/30"
              >
                <span className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                  {surface.platform}
                </span>
                <span className="text-sm font-medium tracking-tight">
                  {surface.label}
                </span>
                <span className="text-sm text-muted-foreground">
                  {surface.density}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </DocShell>
  )
}
