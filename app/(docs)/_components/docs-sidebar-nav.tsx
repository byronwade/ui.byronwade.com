"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Bot,
  ChevronRight,
  Glasses,
  Layers,
  LayoutDashboard,
  LayoutGrid,
  Megaphone,
  Palette,
  PanelLeft,
  Plug,
  ShieldCheck,
  Sparkles,
  Terminal,
  Type,
  X,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/* ── dock-toned vocabulary (matches the floating header chrome) ─────── */

const IDLE =
  "text-dock-foreground hover:bg-dock-active hover:text-dock-active-foreground"
const ACTIVE = "bg-dock-active text-dock-active-foreground"
const RING = "outline-none focus-visible:ring-2 focus-visible:ring-ring"
const LABEL =
  "px-3 pt-3 pb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-dock-foreground/45"
/** The shared morph easing, ported from the header dock + launcher. */
const MORPH = "transition-[width] duration-200 ease-[cubic-bezier(.22,1,.36,1)]"
const FADE = "transition-opacity duration-150"
const EXPANDED_W = "w-64"

const GUIDE_ICONS: Record<string, LucideIcon> = {
  "": BookOpen,
  philosophy: Sparkles,
  installation: Terminal,
  foundation: Layers,
  theming: Palette,
  typography: Type,
  readability: Glasses,
  surfaces: LayoutGrid,
  ai: Bot,
  lint: ShieldCheck,
  mcp: Plug,
}

const SURFACE_ICONS = {
  app: LayoutDashboard,
  marketing: Megaphone,
} as const

/** Guide pages organized into fixed, non-collapsible sidebar groups. */
const GUIDE_GROUPS: { label: string; slugs: string[] }[] = [
  { label: "Get Started", slugs: ["", "philosophy", "installation"] },
  {
    label: "Foundation",
    slugs: ["foundation", "theming", "typography", "readability", "surfaces"],
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
  icon?: LucideIcon
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
    <span className="ml-auto rounded-full bg-dock-muted px-1.5 font-mono text-[10px] text-dock-foreground/55 tabular-nums">
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
        "flex h-8 items-center rounded-md px-2.5 text-[13px] transition-colors",
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
          "flex h-8 w-full items-center gap-1.5 rounded-md px-2.5 text-[13px]",
          IDLE,
          RING,
        )}
      >
        <ChevronRight className="size-3.5 shrink-0 transition-transform group-data-[open]/family:rotate-90" />
        <span className="truncate">{entry.label}</span>
        <Badge>{entry.children.length}</Badge>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-3.5 flex flex-col gap-0.5 border-l border-dock-muted pl-2.5 py-0.5">
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
        <ChevronRight className="size-3.5 shrink-0 transition-transform group-data-[open]/cat:rotate-90" />
        <span className="truncate">{label}</span>
        <Badge>{leafHrefs.length}</Badge>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-0.5 ml-3.5 flex flex-col gap-0.5 border-l border-dock-muted pl-2.5">
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

/* ── the bloomed tree (full nav) ───────────────────────────────────── */

function Tree({
  pathname,
  onNavigate,
}: {
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="scrollbar-thin flex-1 overflow-y-auto px-2 py-2">
        {GUIDE_GROUPS.map((group) => (
          <div key={group.label} className="mb-1">
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

        <div className="mx-2 my-2 h-px bg-dock-muted" />

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
    </div>
  )
}

/* ── the resting icon rail ─────────────────────────────────────────── */

type RailDest = { href: string; icon: LucideIcon; label: string }

function railDestinations(): RailDest[] {
  return [
    ...guides.map((g) => ({
      href: g.href,
      icon: GUIDE_ICONS[g.slug] ?? BookOpen,
      label: g.label,
    })),
    ...catalogSurfaces.map((s) => ({
      href: s.href,
      icon: SURFACE_ICONS[s.id],
      label: `Browse ${s.shortLabel.toLowerCase()}`,
    })),
  ]
}

function RailIcon({ dest, active }: { dest: RailDest; active: boolean }) {
  const Icon = dest.icon
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link
            href={dest.href}
            aria-label={dest.label}
            aria-current={active ? "page" : undefined}
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-xl transition-colors",
              active ? ACTIVE : IDLE,
              RING,
            )}
          />
        }
      >
        <Icon className="size-4" strokeWidth={2} />
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={10}>
        {dest.label}
      </TooltipContent>
    </Tooltip>
  )
}

function Rail({
  pathname,
  onExpand,
}: {
  pathname: string
  onExpand: () => void
}) {
  return (
    <div className="flex h-full w-14 flex-col items-center gap-1 p-2">
      {/* Toggle pinned to the TOP — mirrors the collapse button's position so
          nothing jumps vertically when the rail morphs into the tree. */}
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              onClick={onExpand}
              aria-label="Expand sidebar"
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-xl",
                IDLE,
                RING,
              )}
            />
          }
        >
          <PanelLeft className="size-4" strokeWidth={2} />
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          Expand sidebar
        </TooltipContent>
      </Tooltip>

      <div className="my-1 h-px w-6 bg-dock-muted" />

      <div className="scrollbar-none flex flex-1 flex-col items-center gap-1 overflow-y-auto">
        {railDestinations().map((dest) => (
          <RailIcon
            key={dest.href}
            dest={dest}
            active={pathname === dest.href}
          />
        ))}
      </div>
    </div>
  )
}

/* ── the dock-toned vessel that morphs rail ↔ tree ─────────────────── */

const VESSEL =
  "relative overflow-hidden rounded-3xl bg-dock text-dock-foreground edge"

export function DocsSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  // Close the mobile sheet whenever the route changes.
  const [lastPath, setLastPath] = React.useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    if (mobileOpen) setMobileOpen(false)
  }

  // The header chrome's hamburger lives outside this tree; it opens the sheet
  // via this event (decoupled, like the ⌘K search launcher).
  React.useEffect(() => {
    const onOpen = () => setMobileOpen(true)
    window.addEventListener("open-docs-nav", onOpen)
    return () => window.removeEventListener("open-docs-nav", onOpen)
  }, [])

  return (
    <>
      {/* DESKTOP — sticky, dock-toned rail that morphs its width. */}
      <aside className="group sticky top-16 z-20 hidden h-[calc(100dvh-5rem)] shrink-0 self-start py-2 pl-3 md:block">
        <div className="relative h-full">
          <div
            className={cn(
              VESSEL,
              "h-full",
              collapsed ? "w-14" : EXPANDED_W,
              MORPH,
            )}
          >
            {/* Tree (in flow → owns height); cross-fades with the rail. */}
            <div
              className={cn(
                "h-full",
                EXPANDED_W,
                FADE,
                collapsed && "pointer-events-none opacity-0",
              )}
            >
              <Tree pathname={pathname} />
            </div>

            {/* Rail (absolute overlay); cross-fades with the tree. */}
            <div
              className={cn(
                "absolute inset-0",
                FADE,
                collapsed ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <Rail pathname={pathname} onExpand={() => setCollapsed(false)} />
            </div>
          </div>

          {/* Collapse handle — a dock-toned button straddling the rail's outer
              right edge near the top, revealed on sidebar hover (expanded only). */}
          {collapsed ? null : (
            <div className="absolute top-3 right-0 z-10 translate-x-[calc(100%+0.625rem)] rounded-full bg-dock p-[3px] opacity-0 edge transition-opacity duration-150 group-hover:opacity-100 focus-within:opacity-100">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      onClick={() => setCollapsed(true)}
                      aria-label="Collapse sidebar"
                      className={cn(
                        "flex size-8 items-center justify-center rounded-full transition-colors",
                        IDLE,
                        RING,
                      )}
                    />
                  }
                >
                  <PanelLeft className="size-4" strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  Collapse sidebar
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </aside>

      {/* MOBILE — the tree as a left sheet, opened from the header hamburger. */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-foreground/50"
          />
          <div className="absolute inset-y-3 left-3 w-72">
            <div className={cn(VESSEL, "h-full w-full")}>
              <div className="flex items-center justify-end p-2">
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
              <div className="h-[calc(100%-3rem)]">
                <Tree
                  pathname={pathname}
                  onNavigate={() => setMobileOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
