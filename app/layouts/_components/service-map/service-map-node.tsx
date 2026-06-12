"use client"

import { memo } from "react"
import { Handle, Position } from "@xyflow/react"
import {
  Cloud,
  Cube,
  Globe,
  HardDrives,
  Lightning,
  type Icon,
} from "@/lib/icons"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { ServicePlatform } from "@/lib/service-map-types"
import { getDbDescriptor, withAlpha } from "./service-map-db"
import {
  getServiceMapNodeColor,
  type ServiceNodeData,
} from "./service-map-utils"

function getPlatformIcon(platform: ServicePlatform | undefined): {
  Icon: Icon
  label: string
} {
  switch (platform) {
    case "kubernetes":
      return { Icon: Cube, label: "Kubernetes" }
    case "cloudflare":
      return { Icon: Cloud, label: "Cloudflare Workers" }
    case "lambda":
      return { Icon: Lightning, label: "AWS Lambda" }
    case "web":
      return { Icon: Globe, label: "Web (browser)" }
    default:
      return { Icon: HardDrives, label: "Unknown runtime" }
  }
}

function formatRuntimeLabel(
  rt: string | undefined,
): { short: string; full: string } | null {
  if (!rt) return null
  switch (rt) {
    case "nodejs":
      return { short: "node", full: "Node.js" }
    case "edge-light":
      return { short: "edge", full: "Edge runtime" }
    case "bun":
      return { short: "bun", full: "Bun" }
    case "deno":
      return { short: "deno", full: "Deno" }
    case "workerd":
      return { short: "workerd", full: "Cloudflare workerd" }
    case "fastly":
      return { short: "fastly", full: "Fastly Compute" }
    default:
      return { short: rt, full: rt }
  }
}

function formatRate(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
  if (value >= 1) return value.toFixed(1)
  return value.toFixed(2)
}

function formatLatency(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`
  return `${ms.toFixed(1)}ms`
}

function getHealthDotClass(errorRate: number): string {
  if (errorRate > 0.05) return "bg-destructive"
  if (errorRate > 0.01) return "bg-warning"
  return "bg-success"
}

function getSelectedBorderClass(errorRate: number): string {
  if (errorRate > 0.05)
    return "border-destructive ring-[3px] ring-destructive/15"
  if (errorRate > 0.01) return "border-warning ring-[3px] ring-warning/15"
  return "border-border ring-[3px] ring-foreground/15"
}

function MetricCell({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="flex flex-col gap-px">
      <span className="text-[9px] font-medium tracking-wide text-muted-foreground/60 uppercase">
        {label}
      </span>
      <span
        className={cn(
          "font-mono text-[11px] font-medium tabular-nums text-foreground",
          valueClassName,
        )}
      >
        {value}
      </span>
    </div>
  )
}

function errorRateClass(errorRate: number): string {
  if (errorRate > 0.05) return "text-destructive"
  if (errorRate > 0.01) return "text-warning"
  return "text-foreground"
}

const Handles = () => (
  <>
    <Handle
      type="target"
      position={Position.Left}
      className="!h-0 !min-h-0 !w-0 !min-w-0 !opacity-0"
      isConnectable={false}
    />
    <Handle
      type="source"
      position={Position.Right}
      className="!h-0 !min-h-0 !w-0 !min-w-0 !opacity-0"
      isConnectable={false}
    />
  </>
)

function DatabaseNode({ data }: { data: ServiceNodeData }) {
  const {
    label,
    throughput,
    errorRate,
    avgLatencyMs,
    p95LatencyMs,
    dbSystem,
    selected,
  } = data
  const {
    category,
    Icon,
    label: systemLabel,
    color,
  } = getDbDescriptor(dbSystem)

  return (
    <>
      <Handles />
      <div
        data-slot="service-map-db-node"
        className="flex w-[220px] cursor-pointer overflow-hidden rounded-r-lg edge bg-card transition-[border-color,box-shadow] duration-150"
        style={{
          backgroundImage: `linear-gradient(${withAlpha(color, 0.12)}, ${withAlpha(color, 0.12)})`,
          borderColor: selected ? color : withAlpha(color, 0.4),
          boxShadow: selected
            ? `0 0 0 3px ${withAlpha(color, 0.16)}`
            : undefined,
        }}
      >
        <div className="w-[3px] shrink-0" style={{ backgroundColor: color }} />
        <div className="flex min-w-0 flex-1 flex-col gap-2 px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                "h-1.5 w-1.5 shrink-0 rounded-full",
                getHealthDotClass(errorRate),
              )}
            />
            <Tooltip>
              <TooltipTrigger>
                <Icon size={12} className="shrink-0" style={{ color }} />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{systemLabel}</p>
              </TooltipContent>
            </Tooltip>
            <span className="truncate text-xs font-medium text-foreground">
              {label}
            </span>
            <span
              className="ml-auto shrink-0 text-[9px] font-semibold tracking-wide uppercase"
              style={{ color }}
            >
              {category}
            </span>
          </div>
          <div className="flex gap-4">
            <MetricCell label="calls/s" value={formatRate(throughput)} />
            <MetricCell
              label="err%"
              value={`${(errorRate * 100).toFixed(1)}%`}
              valueClassName={errorRateClass(errorRate)}
            />
            <MetricCell label="avg" value={formatLatency(avgLatencyMs)} />
            <MetricCell label="p95" value={formatLatency(p95LatencyMs ?? 0)} />
          </div>
        </div>
      </div>
    </>
  )
}

function ServiceNode({ data }: { data: ServiceNodeData }) {
  const {
    label,
    throughput,
    tracedThroughput,
    hasSampling,
    samplingWeight,
    errorRate,
    avgLatencyMs,
    services,
    selected,
    infra,
    platform,
    runtime,
    colorMode,
  } = data
  const runtimeInfo = formatRuntimeLabel(runtime)
  const accentColor = getServiceMapNodeColor(
    { label, kind: "service", errorRate, platform },
    services,
    colorMode ?? "service",
  )
  const { Icon, label: iconLabel } = getPlatformIcon(platform)

  return (
    <>
      <Handles />
      <div
        data-slot="service-map-node"
        className={cn(
          "flex w-[220px] cursor-pointer overflow-hidden rounded-r-lg edge bg-card transition-[border-color,box-shadow] duration-150",
          selected
            ? getSelectedBorderClass(errorRate)
            : "border-border hover:border-border",
        )}
      >
        <div
          className="w-[3px] shrink-0"
          style={{ backgroundColor: accentColor }}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2 px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                "h-1.5 w-1.5 shrink-0 rounded-full",
                getHealthDotClass(errorRate),
              )}
            />
            <Tooltip>
              <TooltipTrigger>
                <Icon size={12} className="shrink-0 text-muted-foreground/80" />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>
                  {iconLabel}
                  {runtimeInfo ? ` · ${runtimeInfo.full}` : ""}
                </p>
              </TooltipContent>
            </Tooltip>
            <span className="truncate text-xs font-medium text-foreground">
              {label}
            </span>
            {runtimeInfo && (
              <span className="shrink-0 text-[9px] font-medium tracking-wide text-muted-foreground/60 uppercase">
                {runtimeInfo.short}
              </span>
            )}
          </div>
          <div className="flex gap-4">
            <Tooltip>
              <TooltipTrigger>
                <MetricCell
                  label="req/s"
                  value={`${hasSampling ? "~" : ""}${formatRate(throughput)}`}
                />
              </TooltipTrigger>
              {hasSampling && (
                <TooltipContent side="bottom">
                  <p>
                    Estimated x{samplingWeight.toFixed(0)} from{" "}
                    {formatRate(tracedThroughput)} traced req/s
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
            <MetricCell
              label="err%"
              value={`${(errorRate * 100).toFixed(1)}%`}
              valueClassName={errorRateClass(errorRate)}
            />
            <MetricCell label="avg" value={formatLatency(avgLatencyMs)} />
            <div className="ml-auto flex flex-col items-end gap-px">
              <span className="text-[9px] font-medium tracking-wide text-muted-foreground/60 uppercase">
                pods
              </span>
              {infra ? (
                <Tooltip>
                  <TooltipTrigger>
                    <span className="flex items-center gap-1 font-mono text-[11px] font-medium tabular-nums text-foreground">
                      <Cube size={10} className="text-muted-foreground/70" />
                      {infra.podCount}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>
                      {infra.workloadCount === 1
                        ? "1 Kubernetes workload"
                        : `${infra.workloadCount} Kubernetes workloads`}
                      {", "}
                      {infra.podCount === 1
                        ? "1 pod"
                        : `${infra.podCount} pods`}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <span className="font-mono text-[11px] tabular-nums text-muted-foreground/30">
                  –
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

interface ServiceMapNodeProps {
  data: ServiceNodeData
}

export const ServiceMapNode = memo(function ServiceMapNode({
  data,
}: ServiceMapNodeProps) {
  return data.kind === "database" ? (
    <DatabaseNode data={data} />
  ) : (
    <ServiceNode data={data} />
  )
})
