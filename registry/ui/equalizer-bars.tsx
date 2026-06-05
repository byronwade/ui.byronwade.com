"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

/**
 * Animated "now playing" equalizer bars. The shared playing-state primitive
 * reused by `album-cover`, `track-row`, and `now-playing-bar`.
 *
 * Token-only: bars are `bg-brand`, so a consumer overriding `--brand` recolors
 * them with the rest of the system. Motion comes from `motion/react`; when the
 * viewer prefers reduced motion (or `playing` is false) the bars hold a static
 * low state instead of animating.
 */
const equalizerVariants = cva("inline-flex items-end", {
  variants: {
    size: {
      sm: "h-3 gap-px",
      md: "h-4 gap-0.5",
      lg: "h-5 gap-0.5",
    },
  },
  defaultVariants: { size: "md" },
})

const BAR_WIDTH = { sm: "w-0.5", md: "w-0.5", lg: "w-1" } as const

export type EqualizerBarsProps = Omit<
  React.ComponentProps<"span">,
  "children"
> &
  VariantProps<typeof equalizerVariants> & {
    /** Number of bars to render. */
    bars?: number
    /** Animate the bars; `false` holds a static low state. */
    playing?: boolean
  }

export function EqualizerBars({
  bars = 4,
  playing = true,
  size = "md",
  className,
  "aria-label": ariaLabel,
  ...props
}: EqualizerBarsProps) {
  const reduced = useReducedMotion()
  const animate = playing && !reduced
  return (
    <span
      data-slot="equalizer-bars"
      data-playing={playing}
      data-reduced-motion={reduced ? "true" : "false"}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={cn(equalizerVariants({ size }), className)}
      {...props}
    >
      {Array.from({ length: bars }, (_, i) => (
        <motion.span
          key={i}
          data-slot="equalizer-bars-bar"
          className={cn("block rounded-full bg-brand", BAR_WIDTH[size ?? "md"])}
          initial={{ height: "30%" }}
          animate={
            animate
              ? { height: ["30%", "100%", "45%", "80%", "30%"] }
              : { height: "30%" }
          }
          transition={
            animate
              ? {
                  duration: 0.9,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: (i % 4) * 0.15,
                }
              : { duration: 0 }
          }
        />
      ))}
    </span>
  )
}
