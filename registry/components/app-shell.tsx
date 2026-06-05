import { cn } from "@/lib/utils"

/**
 * AppShell — variant-driven application layout scaffolds.
 *
 * A slot-based frame: pass `header`, `sidebar`, `panel`, `toolbar`, `nav`,
 * `aside`, `footer`, and `children` (primary content). Each `variant` arranges
 * only the slots its topology uses; unused slots are simply omitted. The frame
 * fills its parent — give the parent a height (`h-dvh` in a real app, a fixed
 * height in a preview).
 */
type AppShellVariant =
  | "dashboard"
  | "sidebar"
  | "stacked"
  | "three-column"
  | "master-detail"
  | "docs"
  | "editor"
  | "holy-grail"
  | "focused"
  | "command-center"

type AppShellProps = {
  variant?: AppShellVariant
  /** Top bar spanning the full width. */
  header?: React.ReactNode
  /** Primary left navigation column. */
  sidebar?: React.ReactNode
  /** Secondary column between sidebar and content (e.g. a list in master-detail). */
  panel?: React.ReactNode
  /** Horizontal secondary nav / tab strip under the header (stacked). */
  nav?: React.ReactNode
  /** Action / filter bar directly above the content. */
  toolbar?: React.ReactNode
  /** Right rail: TOC, inspector, activity. */
  aside?: React.ReactNode
  /** Bottom bar spanning the full width. */
  footer?: React.ReactNode
  /** Primary content / canvas. */
  children?: React.ReactNode
  className?: string
}

const frame =
  "flex size-full min-h-0 min-w-0 flex-col overflow-hidden bg-background text-foreground"

// ─── Region primitives ─────────────────────────────────────────────────────────

function Header({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <header
      data-slot="app-shell-header"
      className={cn(
        "flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4",
        className,
      )}
    >
      {children}
    </header>
  )
}

function Nav({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <nav
      data-slot="app-shell-nav"
      className={cn(
        "flex h-11 shrink-0 items-center gap-1 border-b border-border bg-background px-4",
        className,
      )}
    >
      {children}
    </nav>
  )
}

function Sidebar({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <nav
      data-slot="app-shell-sidebar"
      className={cn(
        "hidden w-60 shrink-0 overflow-auto border-r border-border bg-sidebar text-sidebar-foreground scrollbar-thin md:flex md:flex-col",
        className,
      )}
    >
      {children}
    </nav>
  )
}

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      data-slot="app-shell-panel"
      className={cn(
        "hidden w-80 shrink-0 overflow-auto border-r border-border bg-background scrollbar-thin lg:flex lg:flex-col",
        className,
      )}
    >
      {children}
    </div>
  )
}

function Toolbar({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      data-slot="app-shell-toolbar"
      className={cn(
        "flex h-12 shrink-0 items-center gap-2 border-b border-border bg-background px-4",
        className,
      )}
    >
      {children}
    </div>
  )
}

function Aside({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <aside
      data-slot="app-shell-aside"
      className={cn(
        "hidden w-72 shrink-0 overflow-auto border-l border-border bg-background scrollbar-thin xl:flex xl:flex-col",
        className,
      )}
    >
      {children}
    </aside>
  )
}

function Footer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <footer
      data-slot="app-shell-footer"
      className={cn(
        "flex shrink-0 items-center gap-3 border-t border-border bg-background px-4 py-3",
        className,
      )}
    >
      {children}
    </footer>
  )
}

function Content({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <main
      data-slot="app-shell-content"
      className={cn("min-h-0 min-w-0 flex-1 overflow-auto scrollbar-thin", className)}
    >
      {children}
    </main>
  )
}

/** A horizontal row that owns the remaining vertical space below top bars. */
function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-0 flex-1 overflow-hidden">{children}</div>
}

// ─── Variant compositions ──────────────────────────────────────────────────────

function AppShell({
  variant = "dashboard",
  header,
  sidebar,
  panel,
  nav,
  toolbar,
  aside,
  footer,
  children,
  className,
}: AppShellProps) {
  const root = (body: React.ReactNode) => (
    <div data-slot="app-shell" data-variant={variant} className={cn(frame, className)}>
      {body}
    </div>
  )

  switch (variant) {
    case "sidebar":
      return root(
        <Row>
          {sidebar && <Sidebar>{sidebar}</Sidebar>}
          <Content>{children}</Content>
        </Row>,
      )

    case "stacked":
      return root(
        <>
          {header && <Header>{header}</Header>}
          {nav && <Nav>{nav}</Nav>}
          <Content>{children}</Content>
          {footer && <Footer>{footer}</Footer>}
        </>,
      )

    case "three-column":
      return root(
        <Row>
          {sidebar && <Sidebar>{sidebar}</Sidebar>}
          <Content>{children}</Content>
          {aside && <Aside>{aside}</Aside>}
        </Row>,
      )

    case "master-detail":
      return root(
        <Row>
          {sidebar && <Sidebar className="w-56">{sidebar}</Sidebar>}
          {panel && <Panel>{panel}</Panel>}
          <Content>{children}</Content>
        </Row>,
      )

    case "docs":
      return root(
        <>
          {header && <Header>{header}</Header>}
          <Row>
            {sidebar && <Sidebar>{sidebar}</Sidebar>}
            <Content className="mx-auto w-full max-w-3xl px-6 py-10">{children}</Content>
            {aside && <Aside className="w-64">{aside}</Aside>}
          </Row>
        </>,
      )

    case "editor":
      return root(
        <>
          {toolbar && <Toolbar>{toolbar}</Toolbar>}
          <Row>
            {sidebar && (
              <Sidebar className="flex w-14 items-center bg-background md:items-stretch">
                {sidebar}
              </Sidebar>
            )}
            <Content className="bg-muted/30">{children}</Content>
            {aside && <Aside className="w-72 xl:flex">{aside}</Aside>}
          </Row>
        </>,
      )

    case "holy-grail":
      return root(
        <>
          {header && <Header>{header}</Header>}
          <Row>
            {sidebar && <Sidebar>{sidebar}</Sidebar>}
            <Content>{children}</Content>
            {aside && <Aside>{aside}</Aside>}
          </Row>
          {footer && <Footer>{footer}</Footer>}
        </>,
      )

    case "focused":
      return root(
        <>
          {header && <Header className="justify-center">{header}</Header>}
          <Content>
            <div className="mx-auto w-full max-w-2xl px-6 py-12">{children}</div>
          </Content>
          {footer && <Footer className="justify-center">{footer}</Footer>}
        </>,
      )

    case "command-center":
      return root(
        <>
          {header && <Header>{header}</Header>}
          <Row>
            {sidebar && <Sidebar>{sidebar}</Sidebar>}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              {toolbar && <Toolbar className="sticky top-0 z-10">{toolbar}</Toolbar>}
              <Content>{children}</Content>
            </div>
          </Row>
        </>,
      )

    case "dashboard":
    default:
      return root(
        <>
          {header && <Header>{header}</Header>}
          <Row>
            {sidebar && <Sidebar>{sidebar}</Sidebar>}
            <Content>{children}</Content>
          </Row>
          {footer && <Footer>{footer}</Footer>}
        </>,
      )
  }
}

export { AppShell, type AppShellProps, type AppShellVariant }
