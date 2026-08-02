import Image from "next/image"
import { cn } from "@/lib/utils"

type BleedImageProps = {
  src: string
  alt: string
  /** Soft gradient so type stays readable over the image. */
  veil?: boolean
  priority?: boolean
  className?: string
}

/**
 * Edge-to-edge cinematic media — the image owns the frame.
 * Never use as an inset card; pair with Stage fullBleed.
 */
function BleedImage({
  src,
  alt,
  veil = true,
  priority = false,
  className,
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
        className="object-cover object-center"
      />
      {veil ? (
        <div aria-hidden className="absolute inset-0 media-veil" />
      ) : null}
    </div>
  )
}

export { BleedImage }
export type { BleedImageProps }
