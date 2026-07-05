"use client"

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "motion/react"

import { cn } from "@/lib/utils"

/**
 * Reveal — cinematic scroll-in wrapper. Content fades and rises into view once,
 * with a calm, filmic ease. Respects `prefers-reduced-motion` (fades only, no
 * transform). Compose it around any server-rendered content on marketing /
 * narrative site surfaces; it is site chrome, not a shipped registry component.
 */
const EASE = [0.22, 1, 0.36, 1] as const

type RevealProps = HTMLMotionProps<"div"> & {
  /** Seconds to delay the reveal — stagger siblings with 0.06–0.12 steps. */
  delay?: number
  /** Vertical travel distance in px. */
  y?: number
  /** Animation duration in seconds. */
  duration?: number
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  duration = 0.7,
  ...props
}: RevealProps) {
  const reduce = useReducedMotion()

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration, delay, ease: EASE },
    },
  }

  return (
    <motion.div
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * RevealGroup — staggers direct `Reveal` children (or any motion children that
 * read the `visible`/`hidden` variants) as the group scrolls into view.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  ...props
}: HTMLMotionProps<"div"> & { stagger?: number }) {
  const variants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger } },
  }

  return (
    <motion.div
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
