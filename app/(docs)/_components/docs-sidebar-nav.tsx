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
  Search,
  Sparkles,
  Terminal,
  Type,
  X,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { byCategory } from "@/content/components"
import { guides } from "@/content/guides"
import {
  catalogSurfaces,
  categoriesForSurface,
  getSurface,
} from "@/content/catalog-surfaces"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

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
}

const SURFACE_ICONS = {
  app: LayoutDashboard,
  marketing: Megaphone,
} as const

type NavLink = { href: string; label: string }

function useNavSearch() {
  const [query, setQuery] = React.useState("")
  const normalized = query.trim().toLowerCase()
  return { query, setQuery, normalized, searching: normalized.length > 0 }
}

function collectLinks(): (NavLink & { group: string; surface?: string })[] {
  const links: (NavLink & { group: string; surface?: string })[] = guides.map(
    (g) => ({
      href: g.href,
      label: g.label,
      group: "Get Started",
    }),
  )

  for (const surface of catalogSurfaces) {
    for (const cat of categoriesForSurface(surface.id)) {
      for (const doc of byCategory(cat).filter((c) => getSurface(c) === surface.id)) {
        links.push({
          href: `/docs/${doc.slug}`,
          label: doc.name,
          group: `${surface.shortLabel} · ${cat}`,
          surface: surface.id,
        })
      }
    }
  }

  return links
}

const ALL_LINKS = collectLinks()

function GuideMenu({ pathname }: { pathname: string }) {
  return (
    <SidebarMenu>
      {guides.map((guide) => {
        const Icon = GUIDE_ICONS[guide.slug] ?? BookOpen
        const active = pathname === guide.href
        return (
          <SidebarMenuItem key={guide.href}>
            <SidebarMenuButton
              isActive={active}
              tooltip={guide.label}
              render={<Link href={guide.href} />}
            >
              <Icon />
              <span>{guide.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}

function CategoryCollapsible({
  label,
  items,
  pathname,
  defaultOpen,
}: {
  label: string
  items: NavLink[]
  pathname: string
  defaultOpen: boolean
}) {
  const activeInCategory = items.some((item) => pathname === item.href)
  const [open, setOpen] = React.useState(defaultOpen || activeInCategory)

  React.useEffect(() => {
    if (activeInCategory) setOpen(true)
  }, [activeInCategory])

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="group/cat">
      <SidebarMenuItem>
        <CollapsibleTrigger
          render={
            <SidebarMenuButton render={<button type="button" />} />
          }
        >
          <ChevronRight className="transition-transform group-data-[open]/cat:rotate-90" />
          <span>{label}</span>
          <SidebarMenuBadge>{items.length}</SidebarMenuBadge>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((item) => (
              <SidebarMenuSubItem key={item.href}>
                <SidebarMenuSubButton
                  isActive={pathname === item.href}
                  render={<Link href={item.href} />}
                >
                  {item.label}
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

function SurfaceSection({
  surface,
  pathname,
  searching,
}: {
  surface: (typeof catalogSurfaces)[number]
  pathname: string
  searching: boolean
}) {
  const Icon = SURFACE_ICONS[surface.id]

  return (
    <SidebarGroup className="py-0">
      <SidebarGroupLabel className="font-mono text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/60">
        {surface.label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={`Browse ${surface.shortLabel}`}
              render={<Link href={surface.href} />}
            >
              <Icon />
              <span>Browse {surface.shortLabel.toLowerCase()}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {!searching
            ? categoriesForSurface(surface.id).map((cat) => {
                const items = byCategory(cat)
                  .filter((c) => getSurface(c) === surface.id)
                  .map((c) => ({
                    href: `/docs/${c.slug}`,
                    label: c.name,
                  }))
                if (items.length === 0) return null
                return (
                  <CategoryCollapsible
                    key={`${surface.id}-${cat}`}
                    label={cat}
                    items={items}
                    pathname={pathname}
                    defaultOpen={surface.id === "app" && cat === "UI"}
                  />
                )
              })
            : null}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function SearchResults({
  query,
  pathname,
  onClear,
}: {
  query: string
  pathname: string
  onClear: () => void
}) {
  const results = ALL_LINKS.filter(
    (link) =>
      link.label.toLowerCase().includes(query) ||
      link.group.toLowerCase().includes(query) ||
      link.href.toLowerCase().includes(query),
  )

  return (
    <SidebarGroup className="py-0">
      <div className="flex items-center justify-between px-2 pb-1">
        <SidebarGroupLabel className="h-auto p-0 font-mono text-[10px] uppercase tracking-[0.18em]">
          Results · {results.length}
        </SidebarGroupLabel>
        <button
          type="button"
          onClick={onClear}
          className="rounded-md p-1 text-sidebar-foreground/60 outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          aria-label="Clear search"
        >
          <X className="size-3.5" />
        </button>
      </div>
      <SidebarGroupContent>
        <SidebarMenu>
          {results.length === 0 ? (
            <p className="px-2 py-3 text-xs text-sidebar-foreground/60">
              No matches for &ldquo;{query}&rdquo;
            </p>
          ) : (
            results.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  size="sm"
                  render={<Link href={item.href} />}
                >
                  <span className="truncate">{item.label}</span>
                  <span className="ml-auto truncate font-mono text-[10px] text-sidebar-foreground/50">
                    {item.group}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export function DocsSidebarNav() {
  const pathname = usePathname()
  const { query, setQuery, normalized, searching } = useNavSearch()

  return (
    <>
      <SidebarHeader className="gap-2 border-b border-border bg-background p-2">
        <p className="px-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Documentation
        </p>
        <div className="relative px-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/50" />
          <SidebarInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search docs…"
            aria-label="Search documentation"
            className={cn(
              "h-8 border-border bg-background pl-8 shadow-none",
              searching && "ring-1 ring-brand/30",
            )}
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="scrollbar-thin gap-0 bg-background py-2">
        {searching ? (
          <SearchResults
            query={normalized}
            pathname={pathname}
            onClear={() => setQuery("")}
          />
        ) : (
          <>
            <SidebarGroup className="py-0">
              <SidebarGroupLabel className="font-mono text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/60">
                Get Started
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <GuideMenu pathname={pathname} />
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator className="my-2" />

            {catalogSurfaces.map((surface) => (
              <SurfaceSection
                key={surface.id}
                surface={surface}
                pathname={pathname}
                searching={searching}
              />
            ))}
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-border bg-background p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="sm"
              render={<Link href="/docs/surfaces" />}
              isActive={pathname === "/docs/surfaces"}
            >
              <LayoutGrid />
              <span>Surfaces guide</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm" render={<Link href="/catalog" />}>
              <LayoutDashboard />
              <span>Full catalog</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  )
}
