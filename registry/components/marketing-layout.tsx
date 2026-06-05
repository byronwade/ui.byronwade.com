import { cn } from "@/lib/utils"

/**
 * MarketingLayout — variant-driven marketing / landing page scaffolds.
 *
 * A slot-based page frame: pass `nav` (top bar), `hero`, `media` (the second
 * column of a split hero), `children` (the stacked content sections), plus
 * `sidebar` / `aside` for the docs variant, and `footer`. The `variant`
 * decides how the hero and the content region are arranged; unused slots are
 * omitted. The page grows to at least the viewport height.
 */
type MarketingVariant =
  | "landing"
  | "split-hero"
  | "centered"
  | "bento"
  | "pricing"
  | "feature-rows"
  | "article"
  | "docs-marketing"
  | "gallery"
  | "coming-soon"

type MarketingLayoutProps = {
  variant?: MarketingVariant
  /** Sticky top navigation bar. */
  nav?: React.ReactNode
  /** Hero region — the variant controls its framing. */
  hero?: React.ReactNode
  /** Second hero column (split-hero only). */
  media?: React.ReactNode
  /** Left navigation column (docs-marketing only). */
  sidebar?: React.ReactNode
  /** Right table-of-contents rail (docs-marketing only). */
  aside?: React.ReactNode
  /** Bottom footer. */
  footer?: React.ReactNode
  /** Content sections below the hero. */
  children?: React.ReactNode
  className?: string
}

const container = "mx-auto w-full max-w-6xl px-6"

// ─── Frame regions ──────────────────────────────────────────────────────────────

function MarketingNav({ children }: { children: React.ReactNode }) {
  return (
    <header
      data-slot="marketing-nav"
      className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur"
    >
      <div className={cn(container, "flex h-16 items-center justify-between gap-4")}>
        {children}
      </div>
    </header>
  )
}

function MarketingFooter({ children }: { children: React.ReactNode }) {
  return (
    <footer data-slot="marketing-footer" className="mt-auto border-t border-border bg-background">
      <div className={cn(container, "py-12")}>{children}</div>
    </footer>
  )
}

function Hero({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section data-slot="marketing-hero" className={className}>
      {children}
    </section>
  )
}

function Sections({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div data-slot="marketing-sections" className={className}>
      {children}
    </div>
  )
}

// ─── Variant compositions ──────────────────────────────────────────────────────

function MarketingLayout({
  variant = "landing",
  nav,
  hero,
  media,
  sidebar,
  aside,
  footer,
  children,
  className,
}: MarketingLayoutProps) {
  const root = (body: React.ReactNode) => (
    <div
      data-slot="marketing-layout"
      data-variant={variant}
      className={cn(
        "flex min-h-dvh w-full flex-col bg-background text-foreground",
        className,
      )}
    >
      {nav && <MarketingNav>{nav}</MarketingNav>}
      {body}
      {footer && <MarketingFooter>{footer}</MarketingFooter>}
    </div>
  )

  switch (variant) {
    case "split-hero":
      return root(
        <>
          {hero && (
            <Hero className="border-b border-border">
              <div
                className={cn(
                  container,
                  "grid items-center gap-10 py-20 lg:grid-cols-2 lg:py-28",
                )}
              >
                <div>{hero}</div>
                {media && <div data-slot="marketing-media">{media}</div>}
              </div>
            </Hero>
          )}
          {children && (
            <Sections className={cn(container, "space-y-24 py-24")}>{children}</Sections>
          )}
        </>,
      )

    case "centered":
      return root(
        <>
          {hero && (
            <Hero className="border-b border-border">
              <div className={cn(container, "max-w-3xl py-24 text-center lg:py-32")}>{hero}</div>
            </Hero>
          )}
          {children && (
            <Sections className={cn(container, "space-y-24 py-24")}>{children}</Sections>
          )}
        </>,
      )

    case "bento":
      return root(
        <>
          {hero && (
            <Hero>
              <div className={cn(container, "max-w-3xl py-20 text-center")}>{hero}</div>
            </Hero>
          )}
          {children && (
            <Sections
              className={cn(
                container,
                "grid auto-rows-[13rem] grid-cols-1 gap-4 pb-24 sm:grid-cols-2 lg:grid-cols-3",
              )}
            >
              {children}
            </Sections>
          )}
        </>,
      )

    case "pricing":
      return root(
        <>
          {hero && (
            <Hero>
              <div className={cn(container, "max-w-2xl py-20 text-center")}>{hero}</div>
            </Hero>
          )}
          {children && (
            <Sections
              className={cn(container, "grid grid-cols-1 gap-6 pb-24 md:grid-cols-3")}
            >
              {children}
            </Sections>
          )}
        </>,
      )

    case "feature-rows":
      return root(
        <>
          {hero && (
            <Hero className="border-b border-border">
              <div className={cn(container, "max-w-3xl py-24 text-center")}>{hero}</div>
            </Hero>
          )}
          {children && (
            <Sections className={cn(container, "space-y-28 py-24")}>{children}</Sections>
          )}
        </>,
      )

    case "article":
      return root(
        <>
          {hero && (
            <Hero className="border-b border-border">
              <div className="mx-auto w-full max-w-2xl px-6 py-16">{hero}</div>
            </Hero>
          )}
          {children && (
            <Sections className="mx-auto w-full max-w-2xl space-y-6 px-6 py-12">
              {children}
            </Sections>
          )}
        </>,
      )

    case "docs-marketing":
      return root(
        <div className="flex min-h-0 flex-1">
          {sidebar && (
            <nav
              data-slot="marketing-sidebar"
              className="hidden w-60 shrink-0 border-r border-border bg-background md:block"
            >
              {sidebar}
            </nav>
          )}
          <main
            data-slot="marketing-content"
            className="mx-auto w-full max-w-3xl flex-1 px-6 py-12"
          >
            {hero && <div className="mb-10">{hero}</div>}
            <Sections className="space-y-8">{children}</Sections>
          </main>
          {aside && (
            <aside
              data-slot="marketing-toc"
              className="hidden w-56 shrink-0 border-l border-border bg-background py-12 pl-6 pr-6 xl:block"
            >
              {aside}
            </aside>
          )}
        </div>,
      )

    case "gallery":
      return root(
        <>
          {hero && (
            <Hero>
              <div className={cn(container, "max-w-2xl py-20")}>{hero}</div>
            </Hero>
          )}
          {children && (
            <Sections
              className={cn(container, "columns-1 gap-4 pb-24 sm:columns-2 lg:columns-3 [&>*]:mb-4")}
            >
              {children}
            </Sections>
          )}
        </>,
      )

    case "coming-soon":
      return root(
        <Hero className="flex flex-1 items-center justify-center">
          <div className="mx-auto w-full max-w-xl px-6 py-24 text-center">{hero}</div>
        </Hero>,
      )

    case "landing":
    default:
      return root(
        <>
          {hero && (
            <Hero className="border-b border-border">
              <div className={cn(container, "py-24 text-center lg:py-32")}>{hero}</div>
            </Hero>
          )}
          {children && (
            <Sections className={cn(container, "space-y-24 py-24")}>{children}</Sections>
          )}
        </>,
      )
  }
}

export { MarketingLayout, type MarketingLayoutProps, type MarketingVariant }
