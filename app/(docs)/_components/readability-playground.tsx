"use client"

import { RotateCcw } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import {
  FONT_SIZES,
  LINE_HEIGHTS,
  MEASURE_PRESETS,
  READING_LANES,
  SAMPLE_FOLLOWUP,
  SAMPLE_PARAGRAPH,
} from "@/app/(docs)/_components/readability-tokens"

export function ReadabilityShowcase() {
  return (
    <div className="mt-10 grid gap-4 lg:grid-cols-3">
      {READING_LANES.map((lane) => (
        <div key={lane.id} className="flex flex-col rounded-2xl edge bg-card">
          <div className="border-b border-border px-4 py-3">
            <p className="font-mono text-xs text-brand">{lane.label}</p>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
              {lane.utility}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {lane.spec}
            </p>
          </div>
          <div className={cn("flex-1 p-5 text-foreground", lane.className)}>
            <p className="text-pretty">{SAMPLE_PARAGRAPH}</p>
            {lane.id !== "ui" && (
              <p className="text-pretty">{SAMPLE_FOLLOWUP}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export function ReadabilityPlayground() {
  const [measureCh, setMeasureCh] = useState(65)
  const [lineIdx, setLineIdx] = useState(3)
  const [sizeIdx, setSizeIdx] = useState(2)
  const [serif, setSerif] = useState(true)

  const lineHeight = LINE_HEIGHTS[lineIdx]
  const fontSize = FONT_SIZES[sizeIdx]

  function handleReset() {
    setMeasureCh(65)
    setLineIdx(3)
    setSizeIdx(2)
    setSerif(true)
  }

  const measureStatus =
    measureCh > 80
      ? "Over WCAG max (80ch)"
      : measureCh >= 50 && measureCh <= 75
        ? "Research sweet spot"
        : measureCh < 45
          ? "Too narrow — rhythm breaks"
          : "Acceptable"

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {MEASURE_PRESETS.map((p) => (
            <button
              key={p.ch}
              type="button"
              onClick={() => setMeasureCh(p.ch)}
              className={cn(
                "rounded-full px-3 py-1.5 font-mono text-[11px] transition-colors edge",
                measureCh === p.ch
                  ? "bg-brand text-brand-foreground"
                  : "bg-background text-muted-foreground hover:text-foreground",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="gap-1.5"
        >
          <RotateCcw className="size-3.5" />
          Reset
        </Button>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="space-y-5">
          <div className="rounded-2xl edge bg-card p-4">
            <label
              htmlFor="read-measure"
              className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground"
            >
              Measure · {measureCh}ch
            </label>
            <input
              id="read-measure"
              type="range"
              min={35}
              max={90}
              value={measureCh}
              onChange={(e) => setMeasureCh(Number(e.target.value))}
              className="mt-3 w-full accent-brand"
            />
            <p className="mt-2 font-mono text-[11px] text-brand">
              {measureStatus}
            </p>
          </div>

          <div className="rounded-2xl edge bg-card p-4">
            <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
              Line height · {lineHeight.toFixed(2)}
            </p>
            <input
              type="range"
              min={0}
              max={LINE_HEIGHTS.length - 1}
              value={lineIdx}
              onChange={(e) => setLineIdx(Number(e.target.value))}
              className="mt-3 w-full accent-brand"
              aria-label="Line height"
            />
          </div>

          <div className="rounded-2xl edge bg-card p-4">
            <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
              Font size · {fontSize}px
            </p>
            <input
              type="range"
              min={0}
              max={FONT_SIZES.length - 1}
              value={sizeIdx}
              onChange={(e) => setSizeIdx(Number(e.target.value))}
              className="mt-3 w-full accent-brand"
              aria-label="Font size"
            />
          </div>

          <div className="rounded-2xl edge bg-card p-4">
            <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
              Typeface voice
            </p>
            <div className="mt-3 flex gap-2">
              {[
                { id: false, label: "font-sans" },
                { id: true, label: "font-serif" },
              ].map((f) => (
                <button
                  key={String(f.id)}
                  type="button"
                  onClick={() => setSerif(f.id)}
                  className={cn(
                    "rounded-full px-3 py-1.5 font-mono text-[11px] transition-colors edge",
                    serif === f.id
                      ? "bg-brand text-brand-foreground"
                      : "bg-background text-muted-foreground hover:text-foreground",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl edge bg-card p-6 sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
            Tune against the defaults
          </p>
          <div
            className={cn(
              "mt-4 text-foreground",
              serif ? "font-serif" : "font-sans",
            )}
            style={{
              maxWidth: `${measureCh}ch`,
              fontSize: `${fontSize}px`,
              lineHeight,
              letterSpacing: 0,
            }}
          >
            <p className="text-pretty">{SAMPLE_PARAGRAPH}</p>
            <p className="mt-[1.5em] text-pretty">{SAMPLE_FOLLOWUP}</p>
          </div>
          <p className="mt-6 font-mono text-[10px] text-muted-foreground">
            Foundation defaults:{" "}
            <span className="text-foreground">
              reading-ui · reading-prose @ 65ch
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
