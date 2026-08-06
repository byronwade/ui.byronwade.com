import { type ReactNode } from "react"
import { Stage, type StageTone } from "@/components/cinematic/stage"
import { BleedImage, type Veil } from "@/components/cinematic/bleed-image"
import { designCn, stageInk, text } from "@/lib/design"
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
          "justify-end pt-24 md:justify-center md:pt-0",
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
        <div className="relative z-10 mx-auto grid w-full max-w-[92rem] flex-1 items-end gap-8 px-5 pb-0 md:grid-cols-[minmax(16rem,28rem)_minmax(0,1fr)] md:items-center md:gap-10 md:px-8 lg:grid-cols-[minmax(18rem,32rem)_minmax(0,1fr)]">
          <div className="max-w-md pb-6 text-left md:pb-0 md:pl-2 lg:pl-6">
            {children}
          </div>
          {subject ? (
            <div className="relative min-h-0 w-full overflow-hidden md:h-full md:min-h-[min(70svh,40rem)] md:self-end">
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
        fullBleed
        className={cn("items-stretch justify-center", className)}
      >
        {/*
          Outer column centers the beat in the stage; the inner row keeps the
          editorial ledger alignment (index at the top of the statement).
          Without the outer centering the copy pins to the top padding and
          leaves a viewport-tall void under every paper beat.
        */}
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 py-24 md:px-8 md:py-28">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-16">
            <aside className="shrink-0 md:w-28">
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
                  "mt-4 hidden h-px w-12 md:block",
                  tone === "theater" ? "bg-dock-muted/40" : "bg-border",
                )}
                aria-hidden
              />
            </aside>
            <div className="min-w-0 max-w-2xl flex-1 text-left">{children}</div>
          </div>
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
        <div
          className={cn(
            "relative z-10 mx-auto w-full max-w-4xl px-6 md:px-8",
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
        align === "bottom" && "justify-end pb-20 md:pb-28",
        align === "start" && "items-end justify-end pb-20 md:pb-28",
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
          "relative z-10 mx-auto w-full max-w-4xl px-6 md:px-8",
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
}

/**
 * Quiet text CTA — brand stays scarce (eyebrow / wordmark).
 * Primary = stage ink underline; secondary = muted stage ink.
 *
 * Ink comes from `--stage-ink`, which `[data-tone]` remaps, so the same link
 * reads on paper and on theater. Hard-coded dock tokens collapse to ~1:1 on
 * a paper tile — see `stageInk()` in lib/design/cx.ts.
 */
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
        "inline-flex min-h-8 items-center text-[15px] tracking-tight underline-offset-[0.2em] transition-opacity md:text-[16px]",
        priority === "primary" &&
          designCn(stageInk("ink"), "font-medium underline hover:opacity-80"),
        priority === "secondary" &&
          designCn(stageInk("muted"), "hover:stage-ink hover:underline"),
        className,
      )}
    >
      {children}
    </a>
  )
}

export { CinemaTile, CinemaLink }
export type { CinemaTileProps, CinemaLinkProps }
