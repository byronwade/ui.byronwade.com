import type { ComponentPropsWithoutRef } from "react"
import { Children } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const chartLayoutGridVariants = cva("grid w-full gap-3", {
  variants: {
    layout: {
      "1x2": "grid-cols-1 md:grid-cols-2",
      "2x2": "grid-cols-1 md:grid-cols-2",
    },
  },
  defaultVariants: {
    layout: "1x2",
  },
})

type ChartLayoutGridProps = Omit<ComponentPropsWithoutRef<"div">, "children"> &
  VariantProps<typeof chartLayoutGridVariants> & {
    children: React.ReactNode
  }

function ChartLayoutGrid({
  layout = "1x2",
  children,
  className,
  ...props
}: ChartLayoutGridProps) {
  const maxPanels = layout === "2x2" ? 4 : 2
  const panels = Children.toArray(children).slice(0, maxPanels)

  return (
    <div
      data-slot="chart-layout-grid"
      data-layout={layout}
      className={cn(chartLayoutGridVariants({ layout }), className)}
      {...props}
    >
      {panels.map((panel, index) => (
        <div
          key={index}
          data-slot="chart-layout-grid-panel"
          data-panel-index={index}
          className="min-w-0 rounded-xl border border-border bg-card p-2"
        >
          {panel}
        </div>
      ))}
    </div>
  )
}

export { ChartLayoutGrid, chartLayoutGridVariants }
export type { ChartLayoutGridProps }
