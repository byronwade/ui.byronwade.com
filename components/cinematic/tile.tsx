import { type ReactNode } from "react"
import { Stage, type StageTone } from "@/components/cinematic/stage"
import { BleedImage, type Veil } from "@/components/cinematic/bleed-image"
import { cn } from "@/lib/utils"

type Align = "center" | "bottom"
type Layout = "overlay" | "stack"

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
  /**
   * overlay — copy floats on media (sparse, bottom or center)
   * stack — Apple product page: copy above, product subject below
   */
  layout?: Layout
  align?: Align
  /** Product / workbench subject for stack layout */
  subject?: ReactNode
  children: ReactNode
  className?: string
}

/**
 * Apple-style cinematic tile — one viewport, one idea.
 * Stack layout puts the product on stage; overlay keeps media full-bleed.
 */
function CinemaTile({
  id,
  tone = "theater",
  image,
  layout = "overlay",
  align = "center",
  subject,
  children,
  className,
}: CinemaTileProps) {
  if (layout === "stack") {
    return (
      <Stage
        id={id}
        tone={tone}
        fullBleed
        className={cn(
          "items-center justify-between gap-10 pt-28 pb-0 md:pt-32",
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
        {subject ? (
          <div className="relative z-10 w-full flex-1 overflow-hidden pb-0 pt-2">
            {subject}
          </div>
        ) : null}
      </Stage>
    )
  }

  return (
    <Stage
      id={id}
      tone={tone}
      fullBleed
      className={cn(
        align === "center" && "items-center justify-center",
        align === "bottom" && "justify-end pb-20 md:pb-28",
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
