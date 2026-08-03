import { type ReactNode } from "react"
import Link from "next/link"
import { CopyButton } from "@/components/docs/copy-button"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { designCn, text, typeClass } from "@/lib/design"
import { cn } from "@/lib/utils"

type DocShellProps = {
  eyebrow: string
  title: string
  lead?: string
  filename?: string
  rawHref?: string
  /** Full source text — powers Copy */
  source?: string
  children: ReactNode
  className?: string
  /** Extra actions beside Copy / Raw */
  actions?: ReactNode
  /** reading = docs measure; wide = showcases / surfaces */
  measure?: "reading" | "wide"
}

/**
 * Minimal document chrome — title, optional copy/raw, measured body.
 * Marketing density for reading; touch actions on mobile.
 */
function DocShell({
  eyebrow,
  title,
  lead,
  filename,
  rawHref,
  source,
  children,
  className,
  actions,
  measure = "reading",
}: DocShellProps) {
  const hasSourceActions = Boolean(source || rawHref)

  return (
    <main
      data-slot="doc-shell"
      data-surface="marketing"
      className={cn(
        "px-5 pt-20 pb-28 md:px-8 md:pt-24 md:pb-32",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto",
          measure === "wide" ? "max-w-6xl" : "max-w-3xl",
        )}
      >
        <header className="max-w-2xl">
          <p
            className={designCn(
              typeClass("label"),
              text("brand"),
              "text-[11px] tracking-[0.16em]",
            )}
          >
            {eyebrow}
          </p>
          <h1
            className={designCn(
              typeClass("display"),
              text("foreground"),
              "mt-4 text-[clamp(2rem,5vw,3rem)]",
            )}
          >
            {title}
          </h1>
          {lead ? (
            <p
              className={designCn(
                typeClass("body"),
                text("muted"),
                "mt-4 md:text-[1.0625rem]",
              )}
            >
              {lead}
            </p>
          ) : null}
          {filename ? (
            <p className={designCn(typeClass("data"), text("muted"), "mt-3")}>
              {filename}
            </p>
          ) : null}

          {hasSourceActions || actions ? (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {source ? (
                <CopyButton
                  value={source}
                  label="Copy"
                  size="touch"
                  className="sm:h-(--control-h) sm:px-2.5 sm:text-sm"
                />
              ) : null}
              {rawHref ? (
                <Button
                  variant="ghost"
                  size="touch"
                  className="sm:h-(--control-h) sm:px-2.5 sm:text-sm"
                  asChild
                >
                  <a href={rawHref}>Raw</a>
                </Button>
              ) : null}
              {actions}
            </div>
          ) : null}
        </header>

        <div className="mt-12 md:mt-14">{children}</div>
      </div>

      {hasSourceActions ? (
        <div
          data-slot="doc-mobile-actions"
          data-surface="mobile"
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/90 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl sm:hidden"
        >
          <div className="mx-auto flex max-w-3xl gap-2">
            {source ? (
              <CopyButton
                value={source}
                label="Copy"
                size="touch"
                className="flex-1"
              />
            ) : null}
            {rawHref ? (
              <Button variant="outline" size="touch" className="flex-1" asChild>
                <a href={rawHref}>Raw</a>
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}
    </main>
  )
}

type DocLinkRowProps = {
  items: readonly { href: string; label: string; summary: string }[]
}

function DocLinkRow({ items }: DocLinkRowProps) {
  return (
    <ul className="mt-6 space-y-2">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="block transition-opacity hover:opacity-90"
          >
            <Card className="py-0 transition-colors hover:bg-muted/30">
              <CardHeader className="gap-0.5 py-3.5">
                <CardTitle className="text-sm tracking-tight">
                  {item.label}
                </CardTitle>
                <CardDescription>{item.summary}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export { DocShell, DocLinkRow }
export type { DocShellProps, DocLinkRowProps }
