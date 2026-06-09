/**
 * Showcase carousel — a horizontal scroll of cover cards that expand into a
 * detail modal. Adapted for byronwade/ui from Aceternity UI (original concept &
 * design © Aceternity UI — https://ui.aceternity.com), reskinned to the
 * byronwade/ui design system: token surfaces with the `edge` hairline + depth,
 * the radius scale, mono metadata eyebrows over editorial titles, lucide icons,
 * data-slot hooks, and focus-visible rings on every control.
 */
"use client"

import * as React from "react"
import { useEffect, useRef, useState, createContext, useContext } from "react"
import { ArrowLeft, ArrowRight, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"
import { useOutsideClick } from "@/lib/use-outside-click"

interface ShowcaseCarouselProps {
  items: React.ReactElement[]
  initialScroll?: number
}

type ShowcaseCardData = {
  src: string
  title: string
  category: string
  content: React.ReactNode
}

export const ShowcaseCarouselContext = createContext<{
  onCardClose: (index: number) => void
  currentIndex: number
}>({
  onCardClose: () => {},
  currentIndex: 0,
})

export const ShowcaseCarousel = ({
  items,
  initialScroll = 0,
}: ShowcaseCarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll
      checkScrollability()
    }
  }, [initialScroll])

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth)
    }
  }

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -300, behavior: "smooth" })
  }

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 300, behavior: "smooth" })
  }

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = isMobile() ? 224 : 384 // w-56 / md:w-96
      const gap = 16 // gap-4
      const scrollPosition = (cardWidth + gap) * (index + 1)
      carouselRef.current.scrollTo({ left: scrollPosition, behavior: "smooth" })
      setCurrentIndex(index)
    }
  }

  const isMobile = () => {
    return typeof window !== "undefined" && window.innerWidth < 768
  }

  return (
    <ShowcaseCarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div
        data-slot="showcase-carousel"
        className="relative w-full max-w-full min-w-0"
      >
        <div
          className="flex w-full min-w-0 overflow-x-scroll scroll-smooth py-8 overscroll-x-auto [scrollbar-width:none] md:py-12"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          {/* Items start flush-left so the carousel scrolls from the start and
              never blows out its container (no mx-auto/max-w-7xl — that centring
              is for a full-bleed page, and broke bounded layouts). */}
          <div className="flex flex-row justify-start gap-4 pl-4">
            {items.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.4,
                    delay: 0.12 * index,
                    ease: "easeOut",
                  },
                }}
                key={"card" + index}
                className="rounded-2xl last:pr-[5%] md:last:pr-[33%]"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mr-4 flex justify-end gap-2">
          <button
            type="button"
            data-slot="showcase-carousel-prev"
            aria-label="Previous cards"
            className="relative z-40 flex size-9 items-center justify-center rounded-full bg-muted edge text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            data-slot="showcase-carousel-next"
            aria-label="Next cards"
            className="relative z-40 flex size-9 items-center justify-center rounded-full bg-muted edge text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </ShowcaseCarouselContext.Provider>
  )
}

export const ShowcaseCard = ({
  card,
  index,
  layout = false,
}: {
  card: ShowcaseCardData
  index: number
  layout?: boolean
}) => {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { onCardClose } = useContext(ShowcaseCarouselContext)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose()
      }
    }

    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useOutsideClick(containerRef, () => handleClose())

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
    onCardClose(index)
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 h-screen overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-foreground/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              data-slot="showcase-card-detail"
              className="relative z-[60] mx-auto my-10 h-fit max-w-3xl rounded-2xl bg-card p-6 depth-400 md:p-10"
            >
              <button
                type="button"
                data-slot="showcase-card-close"
                aria-label="Close"
                className="sticky top-0 right-0 ml-auto flex size-8 items-center justify-center rounded-full bg-foreground text-background outline-none transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50"
                onClick={handleClose}
              >
                <X className="size-4" />
              </button>
              <motion.p
                layoutId={layout ? `category-${card.title}` : undefined}
                className="font-mono text-xs tracking-wide text-muted-foreground uppercase"
              >
                {card.category}
              </motion.p>
              <motion.p
                layoutId={layout ? `title-${card.title}` : undefined}
                className="mt-2 text-2xl font-medium tracking-tight text-foreground md:text-4xl"
              >
                {card.title}
              </motion.p>
              <div className="py-8">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleOpen}
        data-slot="showcase-card"
        className="relative z-10 flex h-80 w-56 flex-col items-start justify-start overflow-hidden rounded-2xl bg-muted outline-none transition hover:depth-soft focus-visible:ring-3 focus-visible:ring-ring/50 md:h-[30rem] md:w-96"
      >
        <div className="scrim-top pointer-events-none absolute inset-x-0 top-0 z-30 h-full" />
        <div className="relative z-40 p-6">
          <motion.p
            layoutId={layout ? `category-${card.category}` : undefined}
            className="text-left font-mono text-xs tracking-wide text-background/90 uppercase"
          >
            {card.category}
          </motion.p>
          <motion.p
            layoutId={layout ? `title-${card.title}` : undefined}
            className="mt-2 max-w-xs text-left text-lg font-medium tracking-tight text-balance text-background md:text-2xl"
          >
            {card.title}
          </motion.p>
        </div>
        <ShowcaseCardImage
          src={card.src}
          alt={card.title}
          className="absolute inset-0 z-10 object-cover"
        />
      </motion.button>
    </>
  )
}

export const ShowcaseCardImage = ({
  src,
  className,
  alt,
  ...rest
}: React.ImgHTMLAttributes<HTMLImageElement>) => {
  const [isLoading, setLoading] = useState(true)
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-slot="showcase-card-image"
      className={cn(
        "h-full w-full transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className,
      )}
      onLoad={() => setLoading(false)}
      src={src}
      loading="lazy"
      decoding="async"
      alt={alt ?? "Background"}
      {...rest}
    />
  )
}
