/**
 * Adapted for byronwade/ui from Aceternity UI.
 * Original code, concept, and design © Aceternity UI — https://ui.aceternity.com
 * Reworked to the byronwade/ui design system: semantic token surfaces
 * (bg-muted / bg-accent / bg-popover, text-muted-foreground), lucide icons
 * instead of @tabler, aria-labels on the icon-only toggle, and data-slot hooks.
 * Magnify-on-hover springs preserved.
 *
 * Note: use position fixed according to your needs — desktop dock reads best
 * pinned to the bottom; the mobile dock to the bottom-right.
 */
"use client"

import { useRef, useState } from "react"
import { ChevronUp } from "lucide-react"
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react"

import { cn } from "@/lib/utils"

type FloatingDockItem = { title: string; icon: React.ReactNode; href: string }

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: FloatingDockItem[]
  desktopClassName?: string
  mobileClassName?: string
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  )
}

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: FloatingDockItem[]
  className?: string
}) => {
  const [open, setOpen] = useState(false)
  return (
    <div
      data-slot="floating-dock-mobile"
      className={cn("relative block md:hidden", className)}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10, transition: { delay: idx * 0.05 } }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <a
                  href={item.href}
                  key={item.title}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-muted"
                >
                  <div className="h-4 w-4">{item.icon}</div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        aria-label={open ? "Collapse menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-muted"
      >
        <ChevronUp className="h-5 w-5 text-muted-foreground" />
      </button>
    </div>
  )
}

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: FloatingDockItem[]
  className?: string
}) => {
  const mouseX = useMotionValue(Infinity)
  return (
    <motion.div
      data-slot="floating-dock"
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden h-16 items-end gap-4 rounded-2xl bg-muted px-4 pb-3 md:flex",
        className,
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  )
}

function IconContainer({
  mouseX,
  title,
  icon,
  href,
}: {
  mouseX: MotionValue
  title: string
  icon: React.ReactNode
  href: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40])
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40])
  const widthTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 40, 20],
  )
  const heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 40, 20],
  )

  const spring = { mass: 0.1, stiffness: 150, damping: 12 }
  const width = useSpring(widthTransform, spring)
  const height = useSpring(heightTransform, spring)
  const widthIcon = useSpring(widthTransformIcon, spring)
  const heightIcon = useSpring(heightTransformIcon, spring)

  const [hovered, setHovered] = useState(false)

  return (
    <a href={href} aria-label={title}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-full bg-accent"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="absolute -top-8 left-1/2 w-fit rounded-md edge bg-popover px-2 py-0.5 text-xs whitespace-pre text-popover-foreground"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    </a>
  )
}

export type { FloatingDockItem }
