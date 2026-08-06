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
        className={cn(
          "justify-end pt-20 md:justify-center md:pt-0",
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
        <div className="relative z-10 mx-auto grid w-full max-w-[92rem] flex-1 items-end gap-6 px-5 pb-0 md:grid-cols-[minmax(15rem,26rem)_minmax(0,1fr)] md:items-center md:gap-10 md:px-8 lg:grid-cols-[minmax(16rem,28rem)_minmax(0,1fr)]">
          <div className="max-w-md pb-4 text-left md:pb-0">{children}</div>
          {subject ? (
            <div className="relative w-full md:h-[min(72svh,42rem)] md:self-end">
              {subject}
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
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-20 md:flex-row md:items-start md:gap-14 md:px-8 md:py-24">
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
        align === "center" && "items-center justify-center",
        align === "bottom" && "justify-end pb-16 md:pb-24",
        align === "start" && "items-end justify-end pb-16 md:pb-24",
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
          align === "start" ? "mr-auto text-left" : "text-center",
          align === "start" && "max-w-xl",
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
