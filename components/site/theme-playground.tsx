/**
 * Live theme knobs — scoped CSS variables on an app preview.
 * Marketing page that behaves like a product settings surface.
 */
"use client"

import { useMemo, useState, type CSSProperties, type ReactNode } from "react"
import { ActivityLegend } from "@/components/site/activity-legend"
import { Workbench } from "@/components/surfaces/workbench"
import { Button } from "@/components/ui/button"
import { designCn, radiusIntent, themeKnobs } from "@/lib/design"
import { cn } from "@/lib/utils"

type BrandPreset = {
  id: string
  label: string
  brand: string
  brandFg: string
  brandMuted: string
  accent: string
}

/** Closed OKLCH presets — same lightness/chroma family, hue rotates. */
const brandPresets: BrandPreset[] = [
  {
    id: "teal",
    label: "Ink teal",
    brand: "oklch(0.42 0.09 200)",
    brandFg: "oklch(0.97 0.01 85)",
    brandMuted: "oklch(0.93 0.03 200)",
    accent: "oklch(0.93 0.02 200)",
  },
  {
    id: "slate",
    label: "Slate",
    brand: "oklch(0.42 0.08 250)",
    brandFg: "oklch(0.97 0.01 85)",
    brandMuted: "oklch(0.93 0.03 250)",
    accent: "oklch(0.93 0.02 250)",
  },
  {
    id: "moss",
    label: "Moss",
    brand: "oklch(0.42 0.08 155)",
    brandFg: "oklch(0.97 0.01 85)",
    brandMuted: "oklch(0.93 0.03 155)",
    accent: "oklch(0.93 0.02 155)",
  },
  {
    id: "wine",
    label: "Wine",
    brand: "oklch(0.42 0.09 15)",
    brandFg: "oklch(0.97 0.01 85)",
    brandMuted: "oklch(0.93 0.03 15)",
    accent: "oklch(0.93 0.02 15)",
  },
]

const radiusPresets = [
  { id: "compact", label: "Compact", value: "0.375rem" },
  { id: "default", label: "Default", value: "0.5rem" },
  { id: "soft", label: "Soft", value: "0.75rem" },
] as const

const paperPresets = [
  {
    id: "warm",
    label: "Warm paper",
    background: "oklch(0.965 0.01 72)",
    foreground: "oklch(0.28 0.02 55)",
    card: "oklch(0.98 0.008 72)",
  },
  {
    id: "cool",
    label: "Cool paper",
    background: "oklch(0.96 0.01 230)",
    foreground: "oklch(0.28 0.02 240)",
    card: "oklch(0.98 0.008 230)",
  },
  {
    id: "night",
    label: "Night",
    background: "oklch(0.22 0.016 50)",
    foreground: "oklch(0.94 0.01 75)",
    card: "oklch(0.27 0.016 50)",
  },
] as const

type ThemePlaygroundProps = {
  className?: string
}

function ThemePlayground({ className }: ThemePlaygroundProps) {
  const [brandId, setBrandId] = useState(brandPresets[0].id)
  const [radiusId, setRadiusId] =
    useState<(typeof radiusPresets)[number]["id"]>("compact")
  const [paperId, setPaperId] =
    useState<(typeof paperPresets)[number]["id"]>("warm")

  const brand = brandPresets.find((b) => b.id === brandId) ?? brandPresets[0]
  const radius =
    radiusPresets.find((r) => r.id === radiusId) ?? radiusPresets[1]
  const paper = paperPresets.find((p) => p.id === paperId) ?? paperPresets[0]

  const style = useMemo(
    () =>
      ({
        "--brand": brand.brand,
        "--brand-foreground": brand.brandFg,
        "--brand-muted": brand.brandMuted,
        "--accent": brand.accent,
        "--primary": brand.brand,
        "--primary-foreground": brand.brandFg,
        "--ring": brand.brand,
        "--success": brand.brand,
        "--chart-1": brand.brand,
        "--sidebar-primary": brand.brand,
        "--sidebar-ring": brand.brand,
        "--background": paper.background,
        "--foreground": paper.foreground,
        "--card": paper.card,
        "--card-foreground": paper.foreground,
        "--popover": paper.card,
        "--popover-foreground": paper.foreground,
        "--radius": radius.value,
        colorScheme: paperId === "night" ? "dark" : "light",
      }) as CSSProperties,
    [brand, paper, radius, paperId],
  )

  return (
    <div
      className={designCn(
        "overflow-hidden bg-card edge",
        radiusIntent("shell"),
        className,
      )}
    >
      <div className="flex flex-col gap-4 border-b border-border bg-muted/20 p-4 md:flex-row md:items-start md:justify-between md:p-5">
        <div className="min-w-0">
          <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
            Live knobs
          </p>
          <h3 className="mt-1 text-lg font-medium tracking-tight md:text-xl">
            Reskin the workbench
          </h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Scoped {themeKnobs.length} CSS variables — click a preset, watch
            the app update.
          </p>
        </div>
        <p className="shrink-0 font-mono text-[11px] text-muted-foreground">
          {brand.label} · {radius.label} · {paper.label}
        </p>
      </div>

      <div className="grid gap-0 lg:grid-cols-[14rem_1fr]">
        <aside className="space-y-5 border-b border-border p-4 lg:border-r lg:border-b-0">
          <ControlGroup label="Brand">
            {brandPresets.map((preset) => (
              <Button
                key={preset.id}
                type="button"
                size="sm"
                variant="ghost"
                aria-pressed={brandId === preset.id}
                onClick={() => setBrandId(preset.id)}
                className={cn(
                  "h-8 w-full justify-start gap-2 px-2 text-[12px]",
                  radiusIntent("control"),
                  brandId === preset.id && "bg-brand/10 text-foreground",
                )}
              >
                <span
                  className="size-3.5 shrink-0 rounded-full edge"
                  style={{ background: preset.brand }}
                  aria-hidden
                />
                {preset.label}
              </Button>
            ))}
          </ControlGroup>

          <ControlGroup label="Radius">
            {radiusPresets.map((preset) => (
              <Button
                key={preset.id}
                type="button"
                size="sm"
                variant="ghost"
                aria-pressed={radiusId === preset.id}
                onClick={() => setRadiusId(preset.id)}
                className={cn(
                  "h-8 w-full justify-start px-2 font-mono text-[11px]",
                  radiusIntent("control"),
                  radiusId === preset.id && "bg-brand/10 text-foreground",
                )}
              >
                {preset.label}
                <span className="ml-auto text-muted-foreground">
                  {preset.value}
                </span>
              </Button>
            ))}
          </ControlGroup>

          <ControlGroup label="Paper">
            {paperPresets.map((preset) => (
              <Button
                key={preset.id}
                type="button"
                size="sm"
                variant="ghost"
                aria-pressed={paperId === preset.id}
                onClick={() => setPaperId(preset.id)}
                className={cn(
                  "h-8 w-full justify-start gap-2 px-2 text-[12px]",
                  radiusIntent("control"),
                  paperId === preset.id && "bg-brand/10 text-foreground",
                )}
              >
                <span
                  className="size-3.5 shrink-0 rounded-full edge"
                  style={{ background: preset.background }}
                  aria-hidden
                />
                {preset.label}
              </Button>
            ))}
          </ControlGroup>

          <div>
            <p className="mb-1.5 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
              Activity (scoped)
            </p>
            <ActivityLegend dense={false} />
            <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
              Pastels mark agent stages only — never CTAs.
            </p>
          </div>
        </aside>

        <div className="min-w-0 bg-muted/15 p-3 md:p-4" style={style}>
          <Workbench className="h-[28rem] md:h-[32rem]" />
        </div>
      </div>
    </div>
  )
}

function ControlGroup({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div>
      <p className="mb-1.5 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </p>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  )
}

export { ThemePlayground }
export type { ThemePlaygroundProps }
