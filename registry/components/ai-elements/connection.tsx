import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import type { ConnectionLineComponentProps } from "@xyflow/react"

const HALF = 0.5

const connectionVariants = cva("", {
  variants: {
    tone: {
      ring: "stroke-ring",
      brand: "stroke-brand",
      muted: "stroke-muted-foreground",
    },
  },
  defaultVariants: {
    tone: "ring",
  },
})

export type ConnectionProps = ConnectionLineComponentProps &
  VariantProps<typeof connectionVariants> & {
    className?: string
  }

export const Connection = ({
  fromX,
  fromY,
  toX,
  toY,
  tone,
  className,
}: ConnectionProps) => (
  <g data-slot="connection">
    <path
      className={cn(
        "animated fill-none stroke-1",
        connectionVariants({ tone }),
        className
      )}
      d={`M${fromX},${fromY} C ${fromX + (toX - fromX) * HALF},${fromY} ${fromX + (toX - fromX) * HALF},${toY} ${toX},${toY}`}
      data-slot="connection-path"
    />
    <circle
      className={cn("fill-card stroke-1", connectionVariants({ tone }))}
      cx={toX}
      cy={toY}
      data-slot="connection-dot"
      r={3}
    />
  </g>
)
