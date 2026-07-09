import Link from "next/link"

const FOOTER_LINKS = [
  { label: "Docs", href: "/docs" },
  { label: "Browse", href: "/catalog" },
  { label: "Styleguide", href: "/styleguide" },
  { label: "Templates", href: "/templates" },
  { label: "Linear", href: "/linear" },
  { label: "Polaris", href: "/polaris" },
  {
    label: "GitHub",
    href: "https://github.com/byronwade/ui.byronwade.com",
    external: true,
  },
] as const

/**
 * Light site footer for long browse/docs surfaces. Skipped on chrome-free
 * preview routes via AppChrome.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background print:hidden">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <p className="font-mono text-xs text-muted-foreground">
          byronwade<span className="text-brand">/ui</span>
          <span className="mx-2 text-border">·</span>
          Design system registry
        </p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-4 gap-y-2">
          {FOOTER_LINKS.map((link) =>
            "external" in link && link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </footer>
  )
}

export { FOOTER_LINKS }
