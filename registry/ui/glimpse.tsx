/**
 * Adapted for byronwade/ui from kibo-ui.
 * Original code, concept, and design © kibo-ui — https://www.kibo-ui.com
 * Reworked to the byronwade/ui design system: composes the house `hover-card`,
 * fixes the import path, editorial weight (font-medium, not bold), token text,
 * and `data-slot` hooks. (kibo's server-side `glimpse(url)` metadata fetcher is
 * intentionally omitted — feed title/description/image yourself.)
 */
"use client"

import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export type GlimpseProps = ComponentProps<typeof HoverCard>

export const Glimpse = (props: GlimpseProps) => <HoverCard {...props} />

export type GlimpseContentProps = ComponentProps<typeof HoverCardContent>

export const GlimpseContent = (props: GlimpseContentProps) => (
  <HoverCardContent {...props} />
)

export type GlimpseTriggerProps = ComponentProps<typeof HoverCardTrigger>

export const GlimpseTrigger = (props: GlimpseTriggerProps) => (
  <HoverCardTrigger {...props} />
)

export type GlimpseTitleProps = ComponentProps<"p">

export const GlimpseTitle = ({ className, ...props }: GlimpseTitleProps) => (
  <p
    data-slot="glimpse-title"
    className={cn("truncate text-sm font-medium", className)}
    {...props}
  />
)

export type GlimpseDescriptionProps = ComponentProps<"p">

export const GlimpseDescription = ({
  className,
  ...props
}: GlimpseDescriptionProps) => (
  <p
    data-slot="glimpse-description"
    className={cn("line-clamp-2 text-sm text-muted-foreground", className)}
    {...props}
  />
)

export type GlimpseImageProps = ComponentProps<"img">

export const GlimpseImage = ({
  className,
  alt,
  ...props
}: GlimpseImageProps) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    data-slot="glimpse-image"
    alt={alt ?? ""}
    className={cn(
      "mb-4 aspect-[120/63] w-full rounded-lg edge object-cover",
      className,
    )}
    {...props}
  />
)
