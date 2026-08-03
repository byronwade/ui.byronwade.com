import type { Metadata } from "next"
import Link from "next/link"
import { DocShell } from "@/components/docs/doc-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  activity,
  activityRoles,
  banned,
  cinematicLaws,
  colorRoles,
  contrastPairs,
  depths,
  designInfluences,
  materialLaws,
  radii,
  themeKnobs,
} from "@/lib/design"
import { surfaces } from "@/lib/surfaces"
import { densitySteps } from "@/lib/theme-showcase"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Theme",
  description:
    "Meridian cinematic design grammar — OKLCH tokens, contrast, density.",
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
      lead="Strict OKLCH tokens. Fluent 2 material + Cursor-app density, frozen in lib/design. Contrast audited to WCAG AA."
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
          One deep ink-teal. On theater stages, brand lifts for AA contrast.
        </p>
        <Card className="mt-6 overflow-hidden py-0">
          <div className="flex h-36 items-end bg-brand p-5 md:h-44 md:p-6">
            <p className="font-mono text-sm text-brand-foreground">--brand</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3">
            {(
              [
                ["bg-brand/10", "selected", false],
                ["bg-brand-muted", "muted", false],
                ["bg-dock", "theater", true],
              ] as const
            ).map(([swatch, label, theater]) => (
              <div
                key={label}
                data-tone={theater ? "theater" : undefined}
                className={cn("flex h-24 flex-col justify-end p-4", swatch)}
              >
                <p
                  className={cn(
                    "font-mono text-[11px]",
                    theater ? "text-brand" : "text-foreground",
                  )}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-medium tracking-[-0.03em] md:text-2xl">
          Contrast pairs
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Frozen pairs from lib/design/contrast.ts — checked by npm run
          check:contrast.
        </p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {contrastPairs.map((pair) => (
            <li key={pair.context}>
              <Card>
                <CardHeader className="gap-1">
                  <CardTitle className="font-mono text-sm">
                    {pair.fg} → {pair.bg}
                  </CardTitle>
                  <CardDescription>{pair.context}</CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <Separator className="my-14" />

      <section>
        <h2 className="text-xl font-medium tracking-[-0.03em] md:text-2xl">
          Paper
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Soft warm stone — never pure white or pure black. OKLCH only.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(
            [
              ["bg-background edge", "background", false],
              ["bg-card edge", "card", false],
              ["bg-muted", "muted", false],
              ["bg-dock", "dock", true],
            ] as const
          ).map(([swatch, label, dock]) => (
            <Card
              key={label}
              data-tone={dock ? "theater" : undefined}
              className={cn("h-28 justify-end py-0", swatch)}
            >
              <CardContent className="flex h-full items-end p-3">
                <p
                  className={cn(
                    "font-mono text-[11px]",
                    dock ? "text-dock-foreground" : "text-foreground",
                  )}
                >
                  {label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-medium tracking-[-0.03em] md:text-2xl">
          Theme knobs
        </h2>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          {themeKnobs.map((name) => (
            <Card key={name}>
              <CardContent className="flex items-center gap-3 pt-0">
                <div
                  className={cn(
                    "size-10 shrink-0 rounded-lg",
                    knobSwatch[name] ?? "bg-muted",
                  )}
                  aria-hidden
                />
                <p className="truncate font-mono text-xs">{name}</p>
              </CardContent>
            </Card>
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
          Material laws
        </h2>
        <p className="mt-2 max-w-prose text-sm text-muted-foreground">
          Fluent 2 shape/stroke/elevation expressed as closed Meridian behaviors
          — absorb, never label.
        </p>
        <ol className="mt-6 space-y-3">
          {Object.entries(materialLaws).map(([key, value], i) => (
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
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {Object.entries(designInfluences).map(([key, value]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                  {key}
                </CardTitle>
                <CardDescription className="font-mono text-xs">
                  absorb {value.absorb.length} · reject {value.reject.length}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                {value.absorb.map((item) => (
                  <p
                    key={item}
                    className="font-mono text-[11px] text-muted-foreground"
                  >
                    + {item}
                  </p>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-medium tracking-[-0.03em] md:text-2xl">
          Shape · depth
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                radii
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
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
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                depths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {depths.map((d) => (
                  <li
                    key={d}
                    className={cn(
                      "rounded-2xl bg-background px-4 py-3",
                      d === "edge" ? "edge" : d,
                    )}
                  >
                    <span className="font-mono text-xs">{d}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-medium tracking-[-0.03em] md:text-2xl">
          Density
        </h2>
        <ul className="mt-6 space-y-2">
          {densitySteps.map((step) => (
            <li key={step.token}>
              <Card>
                <CardContent className="pt-0">
                  <div
                    className="mb-2 w-full max-w-xs rounded-lg bg-brand/15"
                    style={{ height: `var(${step.token})` }}
                    aria-hidden
                  />
                  <p className="font-mono text-xs">
                    {step.token}{" "}
                    <span className="text-muted-foreground">{step.px}px</span>
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {step.use}
                  </p>
                </CardContent>
              </Card>
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
            <Badge
              key={role}
              variant="secondary"
              className="font-mono text-[11px]"
            >
              {role}
            </Badge>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {activityRoles.map((role) => (
            <Badge
              key={role}
              className={cn(
                "border-transparent font-mono text-[11px] text-foreground",
                activity(role),
              )}
            >
              {role}
            </Badge>
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
            <Badge
              key={item}
              variant="destructive"
              className="font-mono text-[11px]"
            >
              {item}
            </Badge>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-xl font-medium tracking-[-0.03em] md:text-2xl">
            Surfaces
          </h2>
          <Button variant="link" size="sm" asChild>
            <Link href="/surfaces">Gallery</Link>
          </Button>
        </div>
        <ul className="mt-6 space-y-2">
          {surfaces.map((surface) => (
            <li key={surface.id}>
              <Link href={`/surfaces#${surface.id}`} className="block">
                <Card className="transition-colors hover:bg-muted/30">
                  <CardHeader className="gap-1">
                    <Badge
                      variant="secondary"
                      className="w-fit font-mono text-[10px]"
                    >
                      {surface.platform}
                    </Badge>
                    <CardTitle className="text-sm tracking-tight">
                      {surface.label}
                    </CardTitle>
                    <CardDescription>{surface.density}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </DocShell>
  )
}
