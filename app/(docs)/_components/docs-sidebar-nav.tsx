"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  CaretRight,
  Eyeglasses,
  GridFour,
  Heart,
  Megaphone,
  Palette,
  Plug,
  Robot,
  ShieldCheck,
  Sparkle,
  SquaresFour,
  Stack,
  Terminal,
  TextT,
  X,
  type Icon,
} from "@/lib/icons"

import { cn } from "@/lib/utils"
import { guides } from "@/content/guides"
import {
  catalogSurfaces,
  categoriesForSurface,
} from "@/content/catalog-surfaces"
import {
  buildCategoryNav,
  isDocsNavFamily,
  type DocsNavEntry,
  type DocsNavLeaf,
} from "@/content/docs-nav"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

/* ── calm, token-driven vocabulary ─────────────────────────────────── */

const IDLE = "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
const ACTIVE = "bg-brand/10 font-medium text-foreground"
const RING = "outline-none focus-visible:ring-2 focus-visible:ring-ring"
const LABEL =
  "px-2.5 pt-4 pb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70"

const GUIDE_ICONS: Record<string, Icon> = {
  "": BookOpen,
  philosophy: Sparkle,
  installation: Terminal,
  foundation: Stack,
  theming: Palette,
  typography: TextT,
  readability: Eyeglasses,
  icons: Heart,
  surfaces: GridFour,
  ai: Robot,
  lint: ShieldCheck,
  mcp: Plug,
}

const SURFACE_ICONS = {
  app: SquaresFour,
  marketing: Megaphone,
} as const

/** Guide pages organized into fixed, non-collapsible sidebar groups. */
const GUIDE_GROUPS: { label: string; slugs: string[] }[] = [
  { label: "Get Started", slugs: ["", "philosophy", "installation"] },
  {
    label: "Foundation",
    slugs: [
      "foundation",
      "theming",
      "typography",
      "readability",
      "icons",
      "surfaces",
    ],
  },
  { label: "Tooling", slugs: ["ai", "lint", "mcp"] },
]

/* ── shared rows ───────────────────────────────────────────────────── */

function NavRow({
  href,
  icon: Icon,
  label,
  active,
  onNavigate,
}: {
  href: string
  icon?: Icon
  label: string
  active: boolean
  onNavigate?: () => void
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        "flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-[13px] transition-colors",
        active ? ACTIVE : IDLE,
        RING,
      )}
    >
      {Icon ? <Icon className="size-4 shrink-0" strokeWidth={2} /> : null}
      <span className="truncate">{label}</span>
    </Link>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="ml-auto rounded-full bg-muted px-1.5 font-mono text-[10px] tabular-nums text-muted-foreground">
      {children}
    </span>
  )
}

function NavLeaf({
  item,
  pathname,
  onNavigate,
}: {
  item: DocsNavLeaf
  pathname: string
  onNavigate?: () => void
}) {
  const active = pathname === item.href
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        "flex h-8 items-center rounded-lg px-2.5 text-[13px] transition-colors",
        active ? ACTIVE : IDLE,
        RING,
      )}
    >
      <span className="truncate">{item.label}</span>
    </Link>
  )
}

function FamilyCollapsible({
  entry,
  pathname,
  onNavigate,
}: {
  entry: Extract<DocsNavEntry, { kind: "family" }>
  pathname: string
  onNavigate?: () => void
}) {
  const activeInFamily = entry.children.some((child) => pathname === child.href)
  const [open, setOpen] = React.useState(activeInFamily)

  const [wasActive, setWasActive] = React.useState(activeInFamily)
  if (activeInFamily !== wasActive) {
    setWasActive(activeInFamily)
    if (activeInFamily) setOpen(true)
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="group/family">
      <CollapsibleTrigger
        className={cn(
          "flex h-8 w-full items-center gap-1.5 rounded-lg px-2.5 text-[13px]",
          IDLE,
          RING,
        )}
      >
        <CaretRight className="size-3.5 shrink-0 transition-transform group-data-[open]/family:rotate-90" />
        <span className="truncate">{entry.label}</span>
        <Badge>{entry.children.length}</Badge>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-3.5 flex flex-col gap-0.5 border-l border-border py-0.5 pl-2.5">
          {entry.children.map((child) => (
            <NavLeaf
              key={child.href}
              item={child}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function CategoryCollapsible({
  label,
  entries,
  pathname,
  defaultOpen,
  onNavigate,
}: {
  label: string
  entries: DocsNavEntry[]
  pathname: string
  defaultOpen: boolean
  onNavigate?: () => void
}) {
  const leafHrefs = entries.flatMap((entry) =>
    entry.kind === "family"
      ? entry.children.map((child) => child.href)
      : [entry.href],
  )
  const activeInCategory = leafHrefs.some((href) => pathname === href)
  const [open, setOpen] = React.useState(defaultOpen || activeInCategory)

  const [wasActive, setWasActive] = React.useState(activeInCategory)
  if (activeInCategory !== wasActive) {
    setWasActive(activeInCategory)
    if (activeInCategory) setOpen(true)
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="group/cat">
      <CollapsibleTrigger
        className={cn(
          "flex h-8 w-full items-center gap-1.5 rounded-lg px-2.5 text-[13px]",
          IDLE,
          RING,
        )}
      >
        <CaretRight className="size-3.5 shrink-0 transition-transform group-data-[open]/cat:rotate-90" />
        <span className="truncate">{label}</span>
        <Badge>{leafHrefs.length}</Badge>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-0.5 ml-3.5 flex flex-col gap-0.5 border-l border-border pl-2.5">
          {entries.map((entry) =>
            isDocsNavFamily(entry) ? (
              <FamilyCollapsible
                key={entry.slug}
                entry={entry}
                pathname={pathname}
                onNavigate={onNavigate}
              />
            ) : (
              <NavLeaf
                key={entry.href}
                item={entry}
                pathname={pathname}
                onNavigate={onNavigate}
              />
            ),
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

/* ── the nav tree ──────────────────────────────────────────────────── */

function Tree({
  pathname,
  onNavigate,
}: {
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <div className="scrollbar-thin h-full overflow-y-auto px-3 pb-8">
      {GUIDE_GROUPS.map((group) => (
        <div key={group.label}>
          <div className={LABEL}>{group.label}</div>
          <div className="flex flex-col gap-0.5">
            {group.slugs.map((slug) => {
              const guide = guides.find((g) => g.slug === slug)
              if (!guide) return null
              return (
                <NavRow
                  key={guide.href}
                  href={guide.href}
                  icon={GUIDE_ICONS[slug] ?? BookOpen}
                  label={guide.label}
                  active={pathname === guide.href}
                  onNavigate={onNavigate}
                />
              )
            })}
          </div>
        </div>
      ))}

      <div className="my-3 h-px bg-border" />

      {catalogSurfaces.map((surface) => {
        const Icon = SURFACE_ICONS[surface.id]
        return (
          <div key={surface.id}>
            <div className={LABEL}>{surface.label}</div>
            <div className="flex flex-col gap-0.5">
              <NavRow
                href={surface.href}
                icon={Icon}
                label={`Browse ${surface.shortLabel.toLowerCase()}`}
                active={false}
                onNavigate={onNavigate}
              />
              {categoriesForSurface(surface.id).map((cat) => {
                const entries = buildCategoryNav(cat, surface.id)
                if (entries.length === 0) return null
                return (
                  <CategoryCollapsible
                    key={`${surface.id}-${cat}`}
                    label={cat}
                    entries={entries}
                    pathname={pathname}
                    defaultOpen={surface.id === "app" && cat === "UI"}
                    onNavigate={onNavigate}
                  />
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function DocsSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  // Close the mobile sheet whenever the route changes.
  const [lastPath, setLastPath] = React.useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    if (mobileOpen) setMobileOpen(false)
  }

  // The header's menu button opens the sheet via this decoupled event.
  React.useEffect(() => {
    const onOpen = () => setMobileOpen(true)
    window.addEventListener("open-docs-nav", onOpen)
    return () => window.removeEventListener("open-docs-nav", onOpen)
  }, [])

  return (
    <>
      {/* DESKTOP — calm sticky column with a hairline divider. */}
      <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-64 shrink-0 self-start border-r border-border pt-4 md:block">
        <Tree pathname={pathname} />
      </aside>

      {/* MOBILE — slide-in sheet from the left. */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-in fade-in duration-150"
          />
          <div className="animate-in slide-in-from-left duration-200 absolute inset-y-0 left-0 flex w-72 flex-col border-r border-border bg-background">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
              <span className="font-mono text-sm font-medium text-foreground">
                byronwade<span className="text-brand">/ui</span>
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className={cn(
                  "grid size-8 place-items-center rounded-lg",
                  IDLE,
                  RING,
                )}
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1 pt-2">
              <Tree
                pathname={pathname}
                onNavigate={() => setMobileOpen(false)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
