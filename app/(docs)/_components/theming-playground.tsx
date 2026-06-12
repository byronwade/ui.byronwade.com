"use client"

import Color from "color"
import { ArrowCounterClockwise } from "@/lib/icons"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useTheme } from "@wrksz/themes/client"

import { Button } from "@/components/ui/button"
import {
  ColorPicker,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
} from "@/components/ui/color-picker"
import { cn } from "@/lib/utils"

const STYLE_ID = "docs-live-brand"
const DEFAULT_LIGHT = "oklch(0.60 0.17 148)"
const DEFAULT_DARK = "oklch(0.68 0.17 148)"

export type BrandPreset = {
  name: string
  light: string
  dark: string
  /** Hex seed for the color picker. */
  hex: string
}

const BARS = [38, 62, 48, 80, 56, 92]

type OklchColor = ReturnType<typeof Color.rgb> & {
  oklch(): ReturnType<typeof Color.rgb>
}

function rgbaToBrand(r: number, g: number, b: number) {
  // color@5 exposes oklch() at runtime; bundled @types only declare lch().
  const [l, c, h] = (Color.rgb(r, g, b) as OklchColor).oklch().array()
  const chroma = Math.min(0.22, Math.max(0.1, c))
  const lightL = Math.min(0.62, Math.max(0.48, l))
  const darkL = Math.min(0.72, Math.max(0.55, lightL + 0.08))
  const hue = Math.round(h)
  return {
    light: `oklch(${lightL.toFixed(2)} ${chroma.toFixed(2)} ${hue})`,
    dark: `oklch(${darkL.toFixed(2)} ${chroma.toFixed(2)} ${hue})`,
  }
}

function applyBrand(light: string, dark: string) {
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!el) {
    el = document.createElement("style")
    el.id = STYLE_ID
    document.head.appendChild(el)
  }
  el.textContent = `:root { --brand: ${light}; }
.dark { --brand: ${dark}; }`
}

function clearBrand() {
  document.getElementById(STYLE_ID)?.remove()
}

function PreviewCard({ brand }: { brand: string }) {
  const scope = { "--brand": brand } as React.CSSProperties
  return (
    <div style={scope} className="space-y-3 rounded-2xl edge bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">Revenue</span>
        <span className="inline-flex items-center gap-1 text-[11px] text-success">
          <span className="size-1.5 rounded-full bg-success" />
          +12%
        </span>
      </div>
      <p className="font-mono text-xl tabular-nums leading-none text-foreground">
        $48.2k
      </p>
      <div className="flex h-9 items-end gap-1">
        {BARS.map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-sm bg-chart-1"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-brand px-2.5 py-1 text-[11px] font-medium text-brand-foreground">
          View
        </span>
        <span className="flex-1 rounded-md bg-background px-2 py-1 text-[11px] text-muted-foreground ring-2 ring-ring">
          filter
        </span>
      </div>
    </div>
  )
}

function TokenSwatches() {
  return (
    <div className="flex items-center gap-2">
      {[
        { cls: "bg-brand", label: "--brand" },
        { cls: "bg-ring", label: "--ring" },
        { cls: "bg-success", label: "--success" },
        { cls: "bg-chart-1", label: "--chart-1" },
      ].map((t) => (
        <div key={t.label} className="flex-1">
          <span className={`block h-8 rounded-lg edge ${t.cls}`} />
          <p className="mt-1 truncate font-mono text-[9px] text-muted-foreground">
            {t.label}
          </p>
        </div>
      ))}
    </div>
  )
}

export function ThemingPlayground({ presets }: { presets: BrandPreset[] }) {
  const { resolvedTheme } = useTheme()
  const [pickerKey, setPickerKey] = useState(0)
  const [pickerHex, setPickerHex] = useState("#28BD6E")
  const [activePreset, setActivePreset] = useState<string | null>("Forest")
  const [brand, setBrand] = useState({
    light: DEFAULT_LIGHT,
    dark: DEFAULT_DARK,
  })
  const ignorePickerChange = useRef(1)

  const activeBrand = resolvedTheme === "dark" ? brand.dark : brand.light

  const cssSnippet = useMemo(
    () =>
      `:root { --brand: ${brand.light}; }\n.dark { --brand: ${brand.dark}; }`,
    [brand],
  )

  const apply = useCallback((light: string, dark: string) => {
    setBrand({ light, dark })
    applyBrand(light, dark)
  }, [])

  const handlePickerChange = useCallback(
    (rgba: Parameters<typeof Color.rgb>[0]) => {
      if (ignorePickerChange.current > 0) {
        ignorePickerChange.current -= 1
        return
      }
      const arr = Color.rgb(rgba).rgb().array()
      const next = rgbaToBrand(arr[0], arr[1], arr[2])
      setActivePreset(null)
      apply(next.light, next.dark)
    },
    [apply],
  )

  const handlePreset = useCallback(
    (preset: BrandPreset) => {
      setActivePreset(preset.name)
      setPickerHex(preset.hex)
      ignorePickerChange.current = 1
      setPickerKey((k) => k + 1)
      apply(preset.light, preset.dark)
    },
    [apply],
  )

  const handleReset = useCallback(() => {
    setActivePreset("Forest")
    setPickerHex(presets[0]?.hex ?? "#28BD6E")
    ignorePickerChange.current = 1
    setPickerKey((k) => k + 1)
    apply(DEFAULT_LIGHT, DEFAULT_DARK)
  }, [apply, presets])

  useEffect(() => {
    apply(DEFAULT_LIGHT, DEFAULT_DARK)
    return () => clearBrand()
  }, [apply])

  return (
    <div className="mt-10 rounded-2xl edge bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
            Live preview
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a color, the whole site re-skins in real time.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="gap-1.5"
        >
          <ArrowCounterClockwise className="size-3.5" />
          Reset
        </Button>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Controls */}
        <div className="space-y-5">
          <ColorPicker
            key={pickerKey}
            defaultValue={pickerHex}
            onChange={handlePickerChange}
            className="rounded-xl edge bg-background p-4"
          >
            <ColorPickerSelection className="aspect-[4/3] w-full rounded-lg" />
            <div className="flex items-center gap-3">
              <ColorPickerEyeDropper />
              <div className="grid w-full gap-2">
                <ColorPickerHue />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ColorPickerOutput />
              <ColorPickerFormat className="flex-1" />
            </div>
          </ColorPicker>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
              Presets
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handlePreset(p)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full edge px-3 py-1.5 text-xs font-medium transition-colors",
                    activePreset === p.name
                      ? "bg-brand text-brand-foreground"
                      : "bg-background text-foreground hover:bg-accent",
                  )}
                >
                  <span
                    className="size-3.5 shrink-0 rounded-full edge"
                    style={{ background: p.light }}
                  />
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl edge bg-background p-4">
            <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
              Generated CSS
            </p>
            <pre className="mt-2 overflow-x-auto font-mono text-[11px] leading-relaxed text-foreground">
              {cssSnippet}
            </pre>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <div className="rounded-xl edge bg-background p-4">
            <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
              Component preview
            </p>
            <div className="mt-3">
              <PreviewCard brand={activeBrand} />
            </div>
          </div>

          <div className="rounded-xl edge bg-background p-4">
            <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
              Tokens that follow --brand
            </p>
            <div className="mt-3">
              <TokenSwatches />
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {["bg-brand/60", "bg-brand/30", "bg-brand/15", "bg-brand/10"].map(
                (c) => (
                  <span key={c} className={`h-6 flex-1 rounded-md edge ${c}`} />
                ),
              )}
            </div>
          </div>

          <div className="rounded-xl edge bg-background p-4">
            <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
              Active value
            </p>
            <p className="mt-2 font-mono text-sm text-brand">{activeBrand}</p>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">
              {resolvedTheme === "dark" ? "dark mode" : "light mode"} · paste
              both lines into globals.css
            </p>
          </div>

          <div className="glow-brand rounded-xl p-4">
            <p className="text-xs font-medium text-foreground">glow-brand</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              House utilities inherit the accent too.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
