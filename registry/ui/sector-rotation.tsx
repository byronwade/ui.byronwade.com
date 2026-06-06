"use client"

import type { ComponentPropsWithoutRef } from "react"
import { useState } from "react"

import {
  formatPercent,
  makeSectorSegments,
  sectorRotationArcs,
  type SectorSegment,
} from "@/lib/market"
import { cn } from "@/lib/utils"

const DEFAULT_SEGMENTS = makeSectorSegments(6, { seed: 21 })

type SectorRotationProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  segments?: SectorSegment[]
  size?: number
  thickness?: number
  onSelect?: (label: string) => void
}

function SectorRotation({
  segments = DEFAULT_SEGMENTS,
  size = 180,
  thickness = 14,
  onSelect,
  className,
  ...props
}: SectorRotationProps) {
  const [active, setActive] = useState<number | null>(null)
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const arcs = sectorRotationArcs(segments, { circumference, gap: 8 })
  const focus = active !== null ? arcs[active] : null

  const dotClass = (change: number) =>
    change > 0
      ? "bg-success"
      : change < 0
        ? "bg-destructive"
        : "bg-muted-foreground"

  return (
    <div
      data-slot="sector-rotation"
      className={cn(
        "flex flex-col items-center gap-4 sm:flex-row sm:items-start",
        className,
      )}
      {...props}
    >
      <div
        className="relative shrink-0"
        style={{ width: size, height: size }}
        role="img"
        aria-label="Sector performance ring"
      >
        <svg width={size} height={size} className="-rotate-90" aria-hidden>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={thickness}
            className="stroke-muted"
          />
          {arcs.map((arc, index) => (
            <circle
              key={arc.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeWidth={thickness}
              strokeLinecap="round"
              className={cn(
                "cursor-pointer transition-opacity",
                arc.toneClass,
                active !== null && active !== index && "opacity-40",
              )}
              strokeDasharray={`${arc.dashVisible} ${circumference}`}
              strokeDashoffset={arc.dashOffset}
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(index)}
              onBlur={() => setActive(null)}
              onClick={() => onSelect?.(arc.label)}
              tabIndex={onSelect ? 0 : -1}
              role={onSelect ? "button" : undefined}
              aria-label={`${arc.label} ${formatPercent(arc.change)}`}
            />
          ))}
        </svg>
        <div
          aria-hidden
          className="absolute inset-0 grid place-items-center text-center"
        >
          {focus ? (
            <div>
              <div className="text-sm text-muted-foreground">{focus.label}</div>
              <div
                className={cn(
                  "text-2xl font-medium tabular-nums",
                  focus.change > 0
                    ? "text-success"
                    : focus.change < 0
                      ? "text-destructive"
                      : "text-foreground",
                )}
              >
                {formatPercent(focus.change)}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-xs text-muted-foreground">Sectors</div>
              <div className="text-2xl font-medium tabular-nums">
                {segments.length}
              </div>
            </div>
          )}
        </div>
      </div>
      <ul
        data-slot="sector-rotation-legend"
        className="grid w-full min-w-0 gap-1.5 sm:max-w-xs"
      >
        {arcs.map((arc, index) => (
          <li key={arc.label}>
            <button
              type="button"
              data-slot="sector-rotation-legend-item"
              data-label={arc.label}
              className={cn(
                "flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                "hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active === index && "bg-muted/60",
              )}
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)}
              onClick={() => onSelect?.(arc.label)}
            >
              <span className="flex items-center gap-2">
                <span
                  className={cn("size-2 rounded-full", dotClass(arc.change))}
                  aria-hidden
                />
                <span>{arc.label}</span>
              </span>
              <span className="flex items-center gap-2 font-mono text-xs tabular-nums">
                <span className="text-muted-foreground">
                  {Math.round(arc.share * 100)}%
                </span>
                <span
                  className={
                    arc.change > 0
                      ? "text-success"
                      : arc.change < 0
                        ? "text-destructive"
                        : "text-muted-foreground"
                  }
                >
                  {formatPercent(arc.change)}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { SectorRotation }
export type { SectorRotationProps }
