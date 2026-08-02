import Image from "next/image"
import { cn } from "@/lib/utils"

type Veil = "none" | "soft" | "bottom" | "top"

type BleedImageProps = {
  src: string
  alt: string
  /** Apple-like: light veil, not a heavy poster grade. */
  veil?: Veil
  priority?: boolean
  className?: string
  /** Focal point for object-cover */
  objectPosition?: string
}

function BleedImage({
  src,
  alt,
  veil = "soft",
  priority = false,
  className,
  objectPosition = "center",
}: BleedImageProps) {
  return (
    <div
      data-slot="bleed-image"
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition }}
      />
      {veil !== "none" ? (
        <div
          aria-hidden
          className={cn(
            "absolute inset-0",
            veil === "soft" && "media-veil-soft",
            veil === "bottom" && "media-veil-bottom",
            veil === "top" && "media-veil-top",
          )}
        />
      ) : null}
    </div>
  )
}

export { BleedImage }
export type { BleedImageProps, Veil }
