"use client"

import type { ComponentPropsWithoutRef } from "react"
import { useId } from "react"
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

type SparklineProps = Omit<ComponentPropsWithoutRef<"svg">, "children"> &
  VariantProps<typeof sparklineVariants> & {
    data?: number[]
    tone?: SparklineTone
    width?: number
    height?: number
    strokeWidth?: number
  }

const Sparkline = ({
  data = makeSeries(24),
  variant = "line",
  tone = "auto",
  width = 96,
  height = 32,
  strokeWidth = 1.5,
  className,
  "aria-label": ariaLabel = "Sparkline chart",
  ...props
}: SparklineProps) => {
  const titleId = useId()
  const resolvedTone = tone === "auto" ? resolveAutoTone(data) : tone

  return (
    <svg
      data-slot="sparkline"
      role="img"
      aria-label={ariaLabel}
      aria-labelledby={titleId}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn(
        sparklineVariants({ variant }),
        toneText[resolvedTone],
        className,
      )}
      {...props}
    >
      <title id={titleId}>{ariaLabel}</title>
      {variant === "area" ? (
        <path
          data-slot="sparkline-area"
          d={seriesToAreaPath(data, width, height, { padding: strokeWidth })}
          stroke="none"
          className={toneFill[resolvedTone]}
        />
      ) : null}
      <polyline
        data-slot="sparkline-line"
        points={seriesToPolyline(data, width, height, { padding: strokeWidth })}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={toneStroke[resolvedTone]}
      />
    </svg>
  )
}

export { Sparkline, sparklineVariants }
export type { SparklineProps, SparklineTone }
