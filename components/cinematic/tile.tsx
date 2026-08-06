import { type ReactNode } from "react"
import { Stage, type StageTone } from "@/components/cinematic/stage"
import { BleedImage, type Veil } from "@/components/cinematic/bleed-image"
import { designCn, text } from "@/lib/design"
import { cn } from "@/lib/utils"

type Align = "center" | "bottom" | "start"
/**
 * overlay — copy on full-bleed media
 * stack — copy above, subject below (centered)
 * rail — asymmetric: copy column + edge-bleed subject (app owns the frame)
 * ledger — editorial index: mono rail + statement (paper beats)
 */
type Layout = "overlay" | "stack" | "rail" | "ledger"

type CinemaTileProps = {
  id?: string
  tone?: StageTone
  image?: {
    src: string
    alt: string
    veil?: Veil
    priority?: boolean
    objectPosition?: string
  }
  layout?: Layout
  align?: Align
  /** Product / workbench subject for stack + rail */
  subject?: ReactNode
  /** Optional mono index for ledger (e.g. "01") */
  index?: string
  children: ReactNode
  className?: string
}

/**
 * One-idea stage tile.
 * Layouts vary composition; tokens stay frozen via Stage + design helpers.
 */
function CinemaTile({
  id,
  tone = "theater",
  image,
  layout = "overlay",
  align = "center",
  subject,
  index,
  children,
  className,
}: CinemaTileProps) {
  if (layout === "rail") {
    return (
      <Stage
        id={id}
        tone={tone}
        fullBleed
        className={cn("overflow-hidden", className)}
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

        {/*
          Edge-bleed rail — copy left (gutter matches contract header max-w-6xl),
          subject fills the rest and flushes the right + bottom viewport edges.
        */}
        <div className="relative z-10 flex min-h-svh w-full flex-col md:flex-row md:items-stretch">
          <div
            className={cn(
              "flex shrink-0 flex-col justify-end pt-24 pb-10",
              "px-5 md:justify-center md:py-0 md:pr-10",
              "md:pl-[max(1.25rem,calc((100vw-72rem)/2+2rem))]",
              "md:w-[min(100%,calc(max(1.25rem,calc((100vw-72rem)/2+2rem))+22rem))]",
              "lg:w-[min(100%,calc(max(1.25rem,calc((100vw-72rem)/2+2rem))+24rem))]",
            )}
          >
            <div className="max-w-[22rem] text-left lg:max-w-md">
              {children}
            </div>
          </div>

          {subject ? (
            <div className="relative flex min-h-0 min-w-0 flex-1 items-stretch pt-0 md:pt-12">
              <div className="h-[min(56svh,32rem)] w-full self-end md:h-full md:self-stretch">
                {subject}
              </div>
            </div>
          ) : null}
        </div>
      </Stage>
    )
  }

  if (layout === "ledger") {
    return (
      <Stage
        id={id}
        tone={tone}
        fullBleed={false}
        className={cn("items-stretch", className)}
      >
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-16 md:flex-row md:items-start md:gap-14 md:px-8 md:py-20">
          <aside className="shrink-0 md:sticky md:top-24 md:w-24">
            <p
              className={designCn(
                "font-mono text-[11px] tracking-[0.2em] uppercase",
                text("brand"),
              )}
            >
              {index ?? "—"}
            </p>
            <div
              className={cn(
                "mt-3 hidden h-px w-10 md:block",
                tone === "theater" ? "bg-dock-muted/40" : "bg-border",
              )}
              aria-hidden
            />
          </aside>
          <div className="min-w-0 max-w-2xl flex-1 text-left">{children}</div>
        </div>
      </Stage>
    )
  }

  if (layout === "stack") {
    return (
      <Stage
        id={id}
        tone={tone}
        fullBleed
        className={cn(
          "items-center justify-between gap-8 pt-24 pb-0 md:pt-28",
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
        <div
          className={cn(
            "relative z-10 mx-auto w-full max-w-4xl px-5 md:px-8",
            align === "start" ? "text-left" : "text-center",
          )}
        >
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
        "overflow-hidden",
        align === "center" && "items-center justify-center",
        align === "bottom" && "justify-end pb-16 md:pb-24",
        align === "start" && "items-start justify-end pb-16 md:pb-24",
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
      <div
        className={cn(
          "relative z-10 w-full px-5 md:px-8",
          align === "start"
            ? "max-w-xl pl-5 text-left md:pl-[max(1.25rem,calc((100vw-72rem)/2+2rem))]"
            : "mx-auto max-w-4xl text-center",
        )}
      >
        {children}
      </div>
    </Stage>
  )
}

type CinemaLinkProps = {
  href: string
  children: ReactNode
  className?: string
  priority?: "primary" | "secondary"
  /** theater = dock ink (default); paper = foreground on light stages */
  tone?: StageTone
}

/**
 * Quiet text CTA — brand stays scarce (eyebrow / wordmark).
 * Primary = underline; secondary = muted link.
 */
function CinemaLink({
  href,
  children,
  className,
  priority = "primary",
  tone = "theater",
}: CinemaLinkProps) {
  const onPaper = tone === "paper"
  return (
    <a
      href={href}
      data-priority={priority}
      className={designCn(
        "text-[15px] tracking-tight underline-offset-[0.2em] transition-opacity md:text-[16px]",
        priority === "primary" &&
          designCn(
            onPaper ? text("foreground") : text("dock"),
            "font-medium underline hover:opacity-80",
          ),
        priority === "secondary" &&
          (onPaper
            ? designCn(text("muted"), "hover:text-foreground hover:underline")
            : designCn(
                text("dock-muted"),
                "hover:text-dock-foreground hover:underline",
              )),
        className,
      )}
    >
      {children}
    </a>
  )
}

export { CinemaTile, CinemaLink }
export type { CinemaTileProps, CinemaLinkProps }
