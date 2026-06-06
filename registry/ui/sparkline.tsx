"use client"

import type { ComponentPropsWithoutRef } from "react"
import { useEffect, useId, useRef, useState } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { makeSeries, seriesToAreaPath, seriesToPolyline } from "@/lib/market"
import { cn } from "@/lib/utils"

type SparklineTone = "auto" | "success" | "destructive" | "muted" | "brand"

type ResolvedTone = Exclude<SparklineTone, "auto">

const sparklineVariants = cva("overflow-visible", {
  variants: {
    variant: {
      line: "",
      area: "",
    },
  },
  defaultVariants: {
    variant: "line",
  },
})

const toneText: Record<ResolvedTone, string> = {
  success: "text-success",
  destructive: "text-destructive",
  muted: "text-muted-foreground",
  brand: "text-brand",
}

const toneStroke: Record<ResolvedTone, string> = {
  success: "stroke-success",
  destructive: "stroke-destructive",
  muted: "stroke-muted-foreground",
  brand: "stroke-brand",
}

const toneFill: Record<ResolvedTone, string> = {
  success: "fill-success/15",
  destructive: "fill-destructive/15",
  muted: "fill-muted-foreground/15",
  brand: "fill-brand/15",
}

// Derive the up/down/flat tone from the first vs last value; <2 points → muted.
const resolveAutoTone = (data: number[]): ResolvedTone => {
  if (data.length < 2) return "muted"
  const delta = data[data.length - 1] - data[0]
  if (delta > 0) return "success"
  if (delta < 0) return "destructive"
  return "muted"
}

type SparklineProps = Omit<
  ComponentPropsWithoutRef<"svg">,
  "children" | "fill"
> &
  VariantProps<typeof sparklineVariants> & {
    data?: number[]
    tone?: SparklineTone
    width?: number
    height?: number
    strokeWidth?: number
    /** Size to the parent box (uses ResizeObserver). */
    fill?: boolean
  }

const Sparkline = ({
  data = makeSeries(24),
  variant = "line",
  tone = "auto",
  width = 96,
  height = 32,
  strokeWidth = 1.5,
  fill = false,
  className,
  "aria-label": ariaLabel = "Sparkline chart",
  ...props
}: SparklineProps) => {
  const titleId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [measured, setMeasured] = useState({ width, height })

  useEffect(() => {
    if (!fill) return
    const node = rootRef.current
    if (!node) return

    const update = () => {
      const rect = node.getBoundingClientRect()
      const nextWidth = Math.max(1, Math.floor(rect.width))
      const nextHeight = Math.max(1, Math.floor(rect.height))
      setMeasured((current) =>
        current.width === nextWidth && current.height === nextHeight
          ? current
          : { width: nextWidth, height: nextHeight },
      )
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => observer.disconnect()
  }, [fill])

  const renderWidth = fill ? measured.width : width
  const renderHeight = fill ? measured.height : height
  const resolvedTone = tone === "auto" ? resolveAutoTone(data) : tone

  const chart = (
    <svg
      data-slot="sparkline"
      role="img"
      aria-label={ariaLabel}
      aria-labelledby={titleId}
      width={renderWidth}
      height={renderHeight}
      viewBox={`0 0 ${renderWidth} ${renderHeight}`}
      preserveAspectRatio="none"
      className={cn(
        sparklineVariants({ variant }),
        toneText[resolvedTone],
        fill ? "block h-full w-full" : className,
      )}
      {...(fill ? {} : props)}
    >
      <title id={titleId}>{ariaLabel}</title>
      {variant === "area" ? (
        <path
          data-slot="sparkline-area"
          d={seriesToAreaPath(data, renderWidth, renderHeight, {
            padding: strokeWidth,
          })}
          stroke="none"
          className={toneFill[resolvedTone]}
        />
      ) : null}
      <polyline
        data-slot="sparkline-line"
        points={seriesToPolyline(data, renderWidth, renderHeight, {
          padding: strokeWidth,
        })}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={toneStroke[resolvedTone]}
      />
    </svg>
  )

  if (!fill) return chart

  return (
    <div
      ref={rootRef}
      data-slot="sparkline-root"
      className={cn("relative h-full min-h-0 w-full min-w-0", className)}
    >
      {chart}
    </div>
  )
}

export { Sparkline, sparklineVariants }
export type { SparklineProps, SparklineTone }
