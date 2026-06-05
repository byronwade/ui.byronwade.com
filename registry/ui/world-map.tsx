/**
 * Adapted for byronwade/ui from Aceternity UI.
 * Original code, concept, and design © Aceternity UI — https://ui.aceternity.com
 * Reworked to the byronwade/ui design system: connection arcs + points derive
 * from `--brand`, the dotted base map resolves its dot color from the
 * `--muted-foreground` token at runtime (re-skins with the theme), the container
 * uses `bg-background`, and `cn()` + `className` + `data-slot` are wired in.
 */
"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "motion/react"
import DottedMap from "dotted-map"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

// Building the dotted geometry is expensive (~1s), so construct it once per
// client bundle and memoize the generated SVG per dot color rather than
// regenerating the whole map on every mount.
const dottedMap = new DottedMap({ height: 100, grid: "diagonal" })
const svgCache = new Map<string, string>()

function baseMapSvg(color: string): string {
  const cached = svgCache.get(color)
  if (cached) return cached
  const svg = dottedMap.getSVG({
    radius: 0.22,
    color,
    shape: "circle",
    backgroundColor: "transparent",
  })
  svgCache.set(color, svg)
  return svg
}

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string }
    end: { lat: number; lng: number; label?: string }
  }>
  /** Color of the connection arcs and points. Defaults to the brand token. */
  lineColor?: string
  className?: string
}

export function WorldMap({
  dots = [],
  lineColor = "var(--brand)",
  className,
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const { theme } = useTheme()
  const [svgMap, setSvgMap] = useState("")

  // Resolve the dotted base-map color from the design tokens so it re-skins with
  // the theme instead of hardcoding black/white. Re-runs on theme change.
  useEffect(() => {
    const root = getComputedStyle(document.documentElement)
    const dotColor =
      root.getPropertyValue("--muted-foreground").trim() || "currentColor"
    setSvgMap(baseMapSvg(dotColor))
  }, [theme])

  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360)
    const y = (90 - lat) * (400 / 180)
    return { x, y }
  }

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number },
  ) => {
    const midX = (start.x + end.x) / 2
    const midY = Math.min(start.y, end.y) - 50
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`
  }

  return (
    <div
      data-slot="world-map"
      className={cn(
        "relative aspect-[2/1] w-full rounded-lg bg-background font-sans",
        className,
      )}
    >
      {svgMap && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
          className="pointer-events-none h-full w-full select-none [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]"
          alt="world map"
          height="495"
          width="1056"
          draggable={false}
        />
      )}
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
      >
        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng)
          const endPoint = projectPoint(dot.end.lat, dot.end.lng)
          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#world-map-line)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 * i, ease: "easeOut" }}
              />
            </g>
          )
        })}

        <defs>
          <linearGradient id="world-map-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {dots.map((dot, i) => (
          <g key={`points-group-${i}`}>
            {[dot.start, dot.end].map((point, j) => {
              const { x, y } = projectPoint(point.lat, point.lng)
              return (
                <g key={`point-${i}-${j}`}>
                  <circle cx={x} cy={y} r="2" fill={lineColor} />
                  <circle cx={x} cy={y} r="2" fill={lineColor} opacity="0.5">
                    <animate
                      attributeName="r"
                      from="2"
                      to="8"
                      dur="1.5s"
                      begin="0s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.5"
                      to="0"
                      dur="1.5s"
                      begin="0s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              )
            })}
          </g>
        ))}
      </svg>
    </div>
  )
}

export default WorldMap
