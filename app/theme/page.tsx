import type { Metadata } from "next"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  activity,
  activityRoles,
  banned,
  cinematicLaws,
  colorRoles,
  depths,
  radii,
  surfaces as surfaceIds,
  themeKnobs,
  typeClass,
  designCn,
} from "@/lib/design"
import { surfaces } from "@/lib/surfaces"
import { densitySteps } from "@/lib/theme-showcase"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Theme",
  description:
    "Meridian cinematic design grammar — closed TypeScript tokens, density, and theme knobs.",
}

export default function ThemePage() {
  return (
    <main className="px-5 pt-20 pb-24 md:px-8 md:pt-24 md:pb-32">
      <div className="mx-auto max-w-6xl">
        <p className={designCn(typeClass("label"), "text-muted-foreground")}>
          Theme · cinematic grammar
        </p>
        <h1
          className={designCn(
            typeClass("title"),
            "mt-4 max-w-[18ch] text-3xl md:text-5xl",
          )}
        >
          The product is a typed theme.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed tracking-tight text-muted-foreground">
          Closed sets in{" "}
          <span className="font-mono text-foreground">lib/design</span>. Live
          knobs in CSS. Drift fails{" "}
          <span className="font-mono text-foreground">check:design</span>.
          Contract:{" "}
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
            <Link href="/design.md">design.md</Link>
          </Button>
        </div>

        <Separator className="my-14" />

        <section>
          <h2 className={designCn(typeClass("title"), "text-2xl")}>
            Cinematic laws
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Encoded as constants — agents compose freely inside them.
          </p>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            {Object.entries(cinematicLaws).map(([key, value]) => (
              <div
                key={key}
                className="flex items-baseline justify-between gap-3 rounded-2xl bg-card px-4 py-3 edge"
              >
                <dt className="font-mono text-xs text-foreground">{key}</dt>
                <dd className="font-mono text-xs text-muted-foreground">
                  {String(value)}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <Separator className="my-14" />

        <section>
          <h2 className={designCn(typeClass("title"), "text-2xl")}>
            Theme knobs
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {themeKnobs.map((name) => (
              <div key={name} className="rounded-2xl bg-card p-4 edge">
                <div
                  className={cn(
                    "mb-3 h-10 rounded-lg",
                    name.includes("brand") && "bg-brand",
                    name === "--background" && "bg-background edge",
                    name === "--foreground" && "bg-foreground",
                    name === "--radius" && "bg-muted",
                  )}
                  aria-hidden
                />
                <p className="font-mono text-xs">{name}</p>
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-14" />

        <section>
          <h2 className={designCn(typeClass("title"), "text-2xl")}>
            Closed color roles
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
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
          <div className="mt-6 flex flex-wrap gap-2">
            {activityRoles.map((role) => (
              <Badge
                key={role}
                className={cn(
                  "border-transparent font-mono text-[11px] text-foreground",
                  activity(role),
                )}
              >
                activity/{role}
              </Badge>
            ))}
          </div>
        </section>

        <Separator className="my-14" />

        <section>
          <h2 className={designCn(typeClass("title"), "text-2xl")}>
            Radius · depth · density
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-card p-5 edge">
              <p className={designCn(typeClass("label"), "text-muted-foreground")}>
                radii
              </p>
              <ul className="mt-4 space-y-2 font-mono text-sm">
                {radii.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-card p-5 edge">
              <p className={designCn(typeClass("label"), "text-muted-foreground")}>
                depths
              </p>
              <ul className="mt-4 space-y-3">
                {depths.map((d) => (
                  <li
                    key={d}
                    className={cn("rounded-xl bg-background px-3 py-2", d)}
                  >
                    <span className="font-mono text-sm">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <ul className="mt-6 space-y-2">
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
                <div>
                  <p className="font-mono text-xs">
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
          <h2 className={designCn(typeClass("title"), "text-2xl")}>Banned</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Shortest list, highest leverage — also enforced by{" "}
            <span className="font-mono">npm run check:design</span>.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {banned.map((item) => (
              <Badge
                key={item}
                variant="outline"
                className="font-mono text-[11px] text-destructive"
              >
                {item}
              </Badge>
            ))}
          </div>
        </section>

        <Separator className="my-14" />

        <section>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className={designCn(typeClass("title"), "text-2xl")}>
                Surfaces ({surfaceIds.length})
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Density remaps — same grammar, different task.
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/surfaces">Gallery</Link>
            </Button>
          </div>
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
  )
}
