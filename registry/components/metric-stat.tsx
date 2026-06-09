import type { ReactNode } from "react"
import { type LucideIcon } from "lucide-react"

import {
  DeltaPill,
  Metric,
  type Delta,
} from "@/components/ui/metric"

function MetricStat({
  label,
  value,
  delta,
  icon,
  className,
}: {
  label: string
  value: ReactNode
  delta?: Delta
  icon?: LucideIcon
  className?: string
}) {
  return (
    <Metric
      data-slot="metric-stat"
      className={className}
      delta={delta}
      icon={icon}
      label={label}
      value={value}
    />
  )
}

export { DeltaPill, MetricStat }
export type { Delta }
