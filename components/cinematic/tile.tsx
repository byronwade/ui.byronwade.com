import { type ReactNode } from "react"
import { Stage, type StageTone } from "@/components/cinematic/stage"
import { BleedImage, type Veil } from "@/components/cinematic/bleed-image"
import { designCn, text } from "@/lib/design"
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
   * stack — copy above, app subject below (Cursor-app proof, not marketing card)
   */
  layout?: Layout
  align?: Align
  /** Product / workbench subject for stack layout */
  subject?: ReactNode
  children: ReactNode
  className?: string
}

/**
 * One-idea stage tile.
 * Stack layout puts the application on stage; overlay keeps media full-bleed.
 * Callers must satisfy cinematicLaws via defineCinemaFrame at the call site.
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
  /** primary = hairline underline; secondary = quieter muted */
  priority?: "primary" | "secondary"
}

/** Quiet text CTA — Cursor-app calm, no chevron. */
function CinemaLink({
  href,
  children,
  className,
  priority = "primary",
}: CinemaLinkProps) {
  return (
    <a
      href={href}
      data-priority={priority}
      className={designCn(
        "text-[15px] tracking-tight underline-offset-[0.2em] transition-opacity md:text-[16px]",
        priority === "primary" &&
          designCn(text("brand"), "font-medium underline hover:opacity-80"),
        priority === "secondary" &&
          designCn(text("brand"), "opacity-90 hover:opacity-100 hover:underline"),
        className,
      )}
    >
      {children}
    </a>
  )
}

export { CinemaTile, CinemaLink }
export type { CinemaTileProps, CinemaLinkProps }
