/**
 * Live theme knobs — scoped CSS variables on an app preview.
 * Presets are frozen in lib/design/knobs — never invent OKLCH at call sites.
 * Export = closed prefs JSON/CSS for MCP apply_prefs into a consumer project.
 */
"use client"

import { useMemo, useState, type CSSProperties, type ReactNode } from "react"
import { ActivityLegend } from "@/components/site/activity-legend"
import { CopyButton } from "@/components/docs/copy-button"
import { Workbench } from "@/components/surfaces/workbench"
import { Button } from "@/components/ui/button"
import {
  brandPresets,
  designCn,
  getBrandPreset,
  getPaperPreset,
  getRadiusPreset,
  knobDefaults,
  knobStyleVars,
  paperPresets,
  prefsToCss,
  prefsToJson,
  radiusIntent,
  radiusPresets,
  themeKnobs,
  type BrandPresetId,
  type ContractPrefs,
  type PaperPresetId,
  type RadiusPresetId,
} from "@/lib/design"
import { cn } from "@/lib/utils"

type ThemePlaygroundProps = {
  className?: string
  contractId?: string
}

function ThemePlayground({
  className,
  contractId = "meridian",
}: ThemePlaygroundProps) {
  const [brandId, setBrandId] = useState<BrandPresetId>(knobDefaults.brand)
  const [radiusId, setRadiusId] = useState<RadiusPresetId>(knobDefaults.radius)
  const [paperId, setPaperId] = useState<PaperPresetId>(knobDefaults.paper)

  const brand = getBrandPreset(brandId)
  const radius = getRadiusPreset(radiusId)
  const paper = getPaperPreset(paperId)

  const prefs = useMemo<ContractPrefs>(
    () => ({
      contractId,
      brand: brandId,
      radius: radiusId,
      paper: paperId,
      surface: "application",
    }),
    [brandId, contractId, paperId, radiusId],
  )

  const prefsJson = useMemo(() => prefsToJson(prefs), [prefs])
  const prefsCss = useMemo(() => prefsToCss(prefs), [prefs])
  const mcpCall = useMemo(
    () =>
      `apply_prefs({ brand: "${prefs.brand}", radius: "${prefs.radius}", paper: "${prefs.paper}", surface: "application" })`,
    [prefs],
  )

  const style = useMemo(
    () =>
      ({
        ...knobStyleVars({ brand, radius, paper }),
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
            Closed presets only — brand · radius · paper. Layout shells and
            motion stay laws. Export below feeds MCP{" "}
            <span className="font-mono text-[12px]">apply_prefs</span> (
            {themeKnobs.length} CSS vars).
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

      <div className="space-y-3 border-t border-border bg-muted/10 p-4 md:p-5">
        <div>
          <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
            Install these prefs
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Copy into your project, or ask the contract MCP to{" "}
            <span className="font-mono text-foreground">apply_prefs</span>. Not
            a freeform theme editor — unknown ids fail closed.
          </p>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          <ExportBlock label="MCP call" value={mcpCall} />
          <ExportBlock label="contract.prefs.json" value={prefsJson} />
          <ExportBlock label="app/contract-prefs.css" value={prefsCss} />
        </div>
      </div>
    </div>
  )
}

function ExportBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="overflow-hidden rounded-lg bg-card edge">
      <div className="flex items-center justify-between gap-2 border-b border-border/60 px-3 py-2">
        <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
          {label}
        </p>
        <CopyButton value={value} label="Copy" size="sm" />
      </div>
      <pre className="max-h-40 overflow-auto p-3 font-mono text-[11px] leading-relaxed text-foreground whitespace-pre-wrap">
        {value}
      </pre>
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
