import type { ComponentPropsWithoutRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { TrendDown, TrendUp } from "@/lib/icons"

import { formatPercent, formatPrice } from "@/lib/market"
import { cn } from "@/lib/utils"

type Direction = "up" | "down" | "neutral"

const priceChangeVariants = cva(
  "inline-flex items-center align-middle whitespace-nowrap [&_svg]:shrink-0",
  {
    variants: {
      size: {
        sm: "gap-0.5 text-xs [&_svg]:size-3",
        default: "gap-1 text-sm [&_svg]:size-3.5",
        lg: "gap-1 text-base [&_svg]:size-4",
      },
      variant: {
        text: "",
        chip: "rounded-full font-medium",
      },
    },
    compoundVariants: [
      { variant: "chip", size: "sm", className: "px-1.5 py-0.5" },
      { variant: "chip", size: "default", className: "px-2 py-0.5" },
      { variant: "chip", size: "lg", className: "px-2.5 py-1" },
    ],
    defaultVariants: {
      size: "default",
      variant: "text",
    },
  },
)

// Tone is runtime-derived (sign + threshold), not a CVA variant: text variant
// only colors the text; chip adds a matching tinted pill background.
const toneClass: Record<Direction, { text: string; chip: string }> = {
  up: { text: "text-success", chip: "bg-success/10 text-success" },
  down: {
    text: "text-destructive",
    chip: "bg-destructive/10 text-destructive",
  },
  neutral: {
    text: "text-muted-foreground",
    chip: "bg-muted text-muted-foreground",
  },
}

const directionWord: Record<Direction, string> = {
  up: "up",
  down: "down",
  neutral: "unchanged",
}

type PriceChangeProps = Omit<ComponentPropsWithoutRef<"span">, "color"> &
  VariantProps<typeof priceChangeVariants> & {
    /** Signed change amount; its sign (with `neutralThreshold`) drives the tone + caret. */
    value: number
    /** Optional percent change; used for the `percent`/`both` formats (falls back to `value`). */
    percent?: number
    /**
     * `absolute` → signed amount (`+1.82`), `percent` → signed percent (`+1.82%`),
     * `both` → amount with percent in parens (`+1.82 (+1.82%)`).
     */
    format?: "absolute" | "percent" | "both"
    /** Hide the trend caret. Neutral changes never render a caret regardless. */
    showIcon?: boolean
    /** `Math.abs(value) <= neutralThreshold` → neutral tone, no caret. */
    neutralThreshold?: number
  }

function PriceChange({
  className,
  value,
  percent,
  format = "both",
  size = "default",
  variant = "text",
  showIcon = true,
  neutralThreshold = 0,
  ...props
}: PriceChangeProps) {
  const direction: Direction =
    Math.abs(value) <= neutralThreshold ? "neutral" : value > 0 ? "up" : "down"

  const absoluteText = `${value > 0 ? "+" : ""}${formatPrice(value)}`
  const percentText = formatPercent(percent ?? value)
  const displayText =
    format === "absolute"
      ? absoluteText
      : format === "percent"
        ? percentText
        : `${absoluteText} (${percentText})`

  const tone = toneClass[direction]
  const Icon = direction === "up" ? TrendUp : TrendDown

  return (
    <span
      data-slot="price-change"
      data-direction={direction}
      role="img"
      aria-label={`${directionWord[direction]} ${displayText}`}
      className={cn(
        priceChangeVariants({ size, variant }),
        variant === "chip" ? tone.chip : tone.text,
        className,
      )}
      {...props}
    >
      {showIcon && direction !== "neutral" ? <Icon aria-hidden /> : null}
      <span data-slot="price-change-value" className="font-mono">
        {displayText}
      </span>
    </span>
  )
}

export { PriceChange, priceChangeVariants }
export type { PriceChangeProps }
