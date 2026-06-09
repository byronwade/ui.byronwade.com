"use client"

import { memo, useEffect, useId, useRef } from "react"
import { getSmoothStepPath, type EdgeProps } from "@xyflow/react"

import { getServiceLegendColor } from "@/lib/service-map-colors"
import { getDbColor } from "./service-map-db"
import {
  DB_NODE_PREFIX,
  isDbNodeId,
  type ServiceEdgeData,
} from "./service-map-utils"
import { useParticleRegistry } from "./service-map-particles"

const dbEndpointColor = (nodeId: string): string =>
  getDbColor(decodeURIComponent(nodeId.slice(DB_NODE_PREFIX.length)))

function getStrokeWidth(callCount: number): number {
  if (callCount <= 0) return 2
  return Math.min(8, Math.max(2, 2 + Math.log10(callCount) * 2))
}

function getEdgeIntensity(callsPerSecond: number): number {
  if (callsPerSecond <= 0) return 0.15
  return Math.min(
    1,
    0.3 + (0.7 * Math.log10(1 + callsPerSecond)) / Math.log10(100),
  )
}

function formatCallCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`
  return String(count)
}

export const ServiceMapEdge = memo(function ServiceMapEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const uniqueId = useId()
  const edgeData = data as ServiceEdgeData | undefined

  const callCount = edgeData?.callCount ?? 0
  const estimatedCallCount = edgeData?.hasSampling
    ? Math.round(
        (edgeData?.estimatedCallsPerSecond ?? 0) *
          (callCount / Math.max(edgeData?.callsPerSecond ?? 1, 0.001)),
      )
    : callCount
  const callsPerSecond = edgeData?.callsPerSecond ?? 0
  const errorRate = edgeData?.errorRate ?? 0
  const hasSampling = edgeData?.hasSampling ?? false
  const services = edgeData?.services ?? []

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 12,
  })

  const sourceColor = isDbNodeId(source)
    ? dbEndpointColor(source)
    : getServiceLegendColor(source, services)
  const targetColor = isDbNodeId(target)
    ? dbEndpointColor(target)
    : getServiceLegendColor(target, services)
  const sw = getStrokeWidth(callCount)
  const i = getEdgeIntensity(callsPerSecond)

  const gradientId = `grad-${id}-${uniqueId}`.replace(/[^a-zA-Z0-9-_]/g, "_")

  const registry = useParticleRegistry()
  const lastParticleSpec = useRef("")
  useEffect(() => {
    if (!registry) return
    const specKey = `${edgePath}|${sourceColor}|${callsPerSecond}|${sw}`
    if (lastParticleSpec.current === specKey) return
    lastParticleSpec.current = specKey
    registry.set(id, {
      pathString: edgePath,
      sourceColor,
      callsPerSecond,
      strokeWidth: sw,
    })
    return () => {
      lastParticleSpec.current = ""
      registry.remove(id)
    }
  }, [registry, id, edgePath, sourceColor, callsPerSecond, sw])

  return (
    <>
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1={sourceX}
          y1={sourceY}
          x2={targetX}
          y2={targetY}
        >
          <stop offset="0%" stopColor={sourceColor} />
          <stop offset="100%" stopColor={targetColor} />
        </linearGradient>
      </defs>

      <path
        d={edgePath}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={sw * 3 + 12}
        strokeOpacity={0.03 + i * 0.05}
        strokeLinecap="round"
      />
      <path
        d={edgePath}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={sw + 4}
        strokeOpacity={0.12 + i * 0.15}
      />
      <path
        d={edgePath}
        fill="none"
        stroke="var(--background)"
        strokeWidth={sw}
        strokeOpacity={0.5 + i * 0.2}
        className="react-flow__edge-path"
      />
      <path
        d={edgePath}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={Math.max(1, sw * 0.4)}
        strokeOpacity={0.15 + i * 0.25}
      />

      <foreignObject
        x={labelX - 40}
        y={labelY + (targetY > sourceY ? -16 : 4) - 12}
        width={80}
        height={24}
        className="pointer-events-none overflow-visible"
      >
        <div
          className="flex items-center justify-center"
          title={
            hasSampling
              ? "Based on traced requests — actual rate may be higher with sampling enabled"
              : undefined
          }
        >
          <span className="rounded edge bg-card/90 px-1.5 py-0.5 font-mono text-[10px] font-medium whitespace-nowrap text-muted-foreground tabular-nums backdrop-blur-sm">
            {hasSampling ? "~" : ""}
            {formatCallCount(hasSampling ? estimatedCallCount : callCount)}
            {errorRate > 0 && (
              <span
                className={
                  errorRate > 0.05
                    ? " text-destructive"
                    : errorRate > 0.01
                      ? " text-warning"
                      : ""
                }
              >
                {" "}
                {(errorRate * 100).toFixed(1)}%
              </span>
            )}
          </span>
        </div>
      </foreignObject>
    </>
  )
})
