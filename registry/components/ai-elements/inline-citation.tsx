"use client"

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import {
  type ComponentProps,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import { Badge } from "@/components/ui/badge"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"

export type InlineCitationProps = ComponentProps<"span">

export const InlineCitation = ({
  className,
  ...props
}: InlineCitationProps) => (
  <span
    data-slot="inline-citation"
    className={cn("group inline items-center gap-1", className)}
    {...props}
  />
)

export type InlineCitationTextProps = ComponentProps<"span">

export const InlineCitationText = ({
  className,
  ...props
}: InlineCitationTextProps) => (
  <span
    data-slot="inline-citation-text"
    className={cn("transition-colors group-hover:bg-accent", className)}
    {...props}
  />
)

export type InlineCitationCardProps = ComponentProps<typeof HoverCard>

export const InlineCitationCard = (props: InlineCitationCardProps) => (
  <HoverCard closeDelay={0} openDelay={0} {...props} />
)

export type InlineCitationCardTriggerProps = ComponentProps<typeof Badge> & {
  sources: string[]
}

export const InlineCitationCardTrigger = ({
  sources,
  className,
  ...props
}: InlineCitationCardTriggerProps) => (
  <HoverCardTrigger
    render={
      <Badge
        data-slot="inline-citation-card-trigger"
        className={cn("ml-1 rounded-full", className)}
        variant="secondary"
        {...props}
      >
        {sources[0] ? (
          <>
            {new URL(sources[0]).hostname}{" "}
            {sources.length > 1 && `+${sources.length - 1}`}
          </>
        ) : (
          "unknown"
        )}
      </Badge>
    }
  />
)

export type InlineCitationCardBodyProps = ComponentProps<"div">

export const InlineCitationCardBody = ({
  className,
  ...props
}: InlineCitationCardBodyProps) => (
  <HoverCardContent
    data-slot="inline-citation-card-body"
    className={cn("relative w-80 p-0", className)}
    {...props}
  />
)

type CarouselContextValue = {
  index: number
  count: number
  setCount: (count: number) => void
  scrollPrev: () => void
  scrollNext: () => void
}

const CarouselContext = createContext<CarouselContextValue | undefined>(
  undefined
)

const useInlineCitationCarousel = () => {
  const context = useContext(CarouselContext)

  if (!context) {
    throw new Error(
      "InlineCitationCarousel parts must be used within <InlineCitationCarousel>"
    )
  }

  return context
}

export type InlineCitationCarouselProps = ComponentProps<"div">

export const InlineCitationCarousel = ({
  className,
  children,
  ...props
}: InlineCitationCarouselProps) => {
  const [index, setIndex] = useState(0)
  const [count, setRawCount] = useState(0)

  const setCount = useCallback((next: number) => {
    setRawCount((current) => (current === next ? current : next))
  }, [])

  const scrollPrev = useCallback(() => {
    setIndex((current) => Math.max(0, current - 1))
  }, [])

  const scrollNext = useCallback(() => {
    setIndex((current) => Math.min(Math.max(0, count - 1), current + 1))
  }, [count])

  const value = useMemo(
    () => ({ index, count, setCount, scrollPrev, scrollNext }),
    [index, count, setCount, scrollPrev, scrollNext]
  )

  return (
    <CarouselContext.Provider value={value}>
      <div
        data-slot="inline-citation-carousel"
        className={cn("w-full", className)}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

export type InlineCitationCarouselContentProps = ComponentProps<"div">

export const InlineCitationCarouselContent = ({
  className,
  children,
  ...props
}: InlineCitationCarouselContentProps) => {
  const { index, setCount } = useInlineCitationCarousel()
  const itemCount = useMemo(() => {
    const array = Array.isArray(children) ? children : [children]
    return array.filter((child) => child != null).length
  }, [children])

  useEffect(() => {
    setCount(itemCount)
  }, [itemCount, setCount])

  return (
    <div
      data-slot="inline-citation-carousel-content"
      className={cn("overflow-hidden", className)}
      {...props}
    >
      <div
        data-slot="inline-citation-carousel-track"
        className="flex transition-transform duration-200 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {children}
      </div>
    </div>
  )
}

export type InlineCitationCarouselItemProps = ComponentProps<"div">

export const InlineCitationCarouselItem = ({
  className,
  ...props
}: InlineCitationCarouselItemProps) => (
  <div
    data-slot="inline-citation-carousel-item"
    className={cn("min-w-full shrink-0 grow-0 space-y-2 p-4 pl-8", className)}
    {...props}
  />
)

export type InlineCitationCarouselHeaderProps = ComponentProps<"div">

export const InlineCitationCarouselHeader = ({
  className,
  ...props
}: InlineCitationCarouselHeaderProps) => (
  <div
    data-slot="inline-citation-carousel-header"
    className={cn(
      "flex items-center justify-between gap-2 rounded-t-md bg-secondary p-2",
      className
    )}
    {...props}
  />
)

export type InlineCitationCarouselIndexProps = ComponentProps<"div">

export const InlineCitationCarouselIndex = ({
  children,
  className,
  ...props
}: InlineCitationCarouselIndexProps) => {
  const { index, count } = useInlineCitationCarousel()
  const current = count === 0 ? 0 : index + 1

  return (
    <div
      data-slot="inline-citation-carousel-index"
      className={cn(
        "flex flex-1 items-center justify-end px-3 py-1 font-mono text-xs text-muted-foreground",
        className
      )}
      {...props}
    >
      {children ?? `${current}/${count}`}
    </div>
  )
}

export type InlineCitationCarouselPrevProps = ComponentProps<"button">

export const InlineCitationCarouselPrev = ({
  className,
  ...props
}: InlineCitationCarouselPrevProps) => {
  const { scrollPrev } = useInlineCitationCarousel()

  const handleClick = useCallback(() => {
    scrollPrev()
  }, [scrollPrev])

  return (
    <button
      data-slot="inline-citation-carousel-prev"
      aria-label="Previous"
      className={cn(
        "shrink-0 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className
      )}
      onClick={handleClick}
      type="button"
      {...props}
    >
      <ArrowLeftIcon className="size-4" />
    </button>
  )
}

export type InlineCitationCarouselNextProps = ComponentProps<"button">

export const InlineCitationCarouselNext = ({
  className,
  ...props
}: InlineCitationCarouselNextProps) => {
  const { scrollNext } = useInlineCitationCarousel()

  const handleClick = useCallback(() => {
    scrollNext()
  }, [scrollNext])

  return (
    <button
      data-slot="inline-citation-carousel-next"
      aria-label="Next"
      className={cn(
        "shrink-0 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className
      )}
      onClick={handleClick}
      type="button"
      {...props}
    >
      <ArrowRightIcon className="size-4" />
    </button>
  )
}

export type InlineCitationSourceProps = ComponentProps<"div"> & {
  title?: string
  url?: string
  description?: string
}

export const InlineCitationSource = ({
  title,
  url,
  description,
  className,
  children,
  ...props
}: InlineCitationSourceProps) => (
  <div
    data-slot="inline-citation-source"
    className={cn("space-y-1", className)}
    {...props}
  >
    {title && (
      <h4
        data-slot="inline-citation-source-title"
        className="truncate text-sm font-medium leading-tight"
      >
        {title}
      </h4>
    )}
    {url && (
      <p
        data-slot="inline-citation-source-url"
        className="truncate break-all font-mono text-xs text-muted-foreground"
      >
        {url}
      </p>
    )}
    {description && (
      <p
        data-slot="inline-citation-source-description"
        className="line-clamp-3 text-sm leading-relaxed text-muted-foreground"
      >
        {description}
      </p>
    )}
    {children}
  </div>
)

export type InlineCitationQuoteProps = ComponentProps<"blockquote">

export const InlineCitationQuote = ({
  children,
  className,
  ...props
}: InlineCitationQuoteProps) => (
  <blockquote
    data-slot="inline-citation-quote"
    className={cn(
      "border-l-2 border-border pl-3 font-serif text-sm italic text-muted-foreground",
      className
    )}
    {...props}
  >
    {children}
  </blockquote>
)
