import { type ReactNode } from "react"
import { Stage, type StageTone } from "@/components/cinematic/stage"
import { BleedImage, type Veil } from "@/components/cinematic/bleed-image"
import { cn } from "@/lib/utils"

type Align = "center" | "bottom"

type CinemaTileProps = {
  id?: string
  tone?: StageTone
  /** Photograph owns the frame. Omit for solid paper/theater canvas. */
  image?: {
    src: string
    alt: string
    veil?: Veil
    priority?: boolean
    objectPosition?: string
  }
  align?: Align
  children: ReactNode
  className?: string
}

/**
 * Apple-style cinematic tile — one viewport, one idea, media edge-to-edge.
 * Copy is sparse. Never pack cards into a tile.
 */
function CinemaTile({
  id,
  tone = "theater",
  image,
  align = "center",
  children,
  className,
}: CinemaTileProps) {
  return (
    <Stage
      id={id}
      tone={tone}
      fullBleed
      className={cn(
        align === "center" && "items-center justify-center",
        align === "bottom" && "justify-end pb-16 md:pb-24",
        className,
      )}
    >
      {image ? (
        <BleedImage
          src={image.src}
          alt={image.alt}
          veil={image.veil ?? "soft"}
          priority={image.priority}
          objectPosition={image.objectPosition}
        />
      ) : null}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 text-center md:px-8">
        {children}
      </div>
    </Stage>
  )
}

type CinemaLinkProps = {
  href: string
  children: ReactNode
  className?: string
}

/** Apple-style text CTA — quiet, not a fat button. */
function CinemaLink({ href, children, className }: CinemaLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center gap-1 text-[17px] tracking-tight text-brand transition-opacity hover:opacity-80",
        className,
      )}
    >
      {children}
      <span aria-hidden className="text-lg leading-none">
        ›
      </span>
    </a>
  )
}

export { CinemaTile, CinemaLink }
export type { CinemaTileProps, CinemaLinkProps }
