/** biome-ignore-all lint/nursery/useImageSize: "size is handled by props / intrinsic image" */

import { cn } from "@/lib/utils"
import type { Experimental_GeneratedImage } from "ai"

export type ImageProps = Experimental_GeneratedImage & {
  className?: string
  alt?: string
}

/**
 * Renders an AI-generated image (adapted from AI Elements). Takes the
 * `Experimental_GeneratedImage` shape (`base64` + `mediaType`) and inlines it as
 * a data URI. Framed on-system: clipped to the radius scale with the `edge`
 * hairline instead of a hard border or drop shadow.
 */
export const Image = ({
  base64,
  uint8Array,
  mediaType,
  ...props
}: ImageProps) => (
  <img
    {...props}
    alt={props.alt}
    className={cn(
      "edge h-auto max-w-full overflow-hidden rounded-lg bg-muted",
      props.className
    )}
    data-slot="image"
    src={`data:${mediaType};base64,${base64}`}
  />
)
