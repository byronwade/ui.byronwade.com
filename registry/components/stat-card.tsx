import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

import { Metric, type Delta } from "@/components/ui/metric"

function StatCard({
  label,
  value,
  hint,
  delta,
  icon,
  className,
}: {
  label: string
  value: ReactNode
  hint?: ReactNode
  delta?: Delta
  icon?: LucideIcon
  className?: string
}) {
  return (
    <Metric
      data-slot="stat-card"
      className={className}
      delta={delta}
      hint={hint}
      icon={icon}
      label={label}
      value={value}
      variant="card"
    />
  )
}

export { StatCard }
