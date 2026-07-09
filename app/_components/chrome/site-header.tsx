"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowUpRight,
  GitFork,
  GridFour,
  List,
  MagnifyingGlass,
} from "@/lib/icons"

import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { isActive, navItems } from "./nav-config"
import { SkinToggle } from "./skin-toggle"
import { ThemeToggleButton } from "./theme-toggle-button"

const GITHUB_URL = "https://github.com/byronwade/ui.byronwade.com"

/** Skin hubs on the main site (explain toggle vs sibling demo apps). */
const SKIN_APPS = [
  {
    name: "Linear",
    desc: "Skin toggle + demo app hub",
    href: "/linear",
    external: false,
  },
  {
    name: "Polaris",
    desc: "Skin toggle + admin demo hub",
    href: "/polaris",
    external: false,
  },
] as const

/** Cross-app switcher — the byronwade product umbrella. */
const PRODUCTS = [
  {
    name: "byronwade.com",
    desc: "Portfolio & personal site",
    href: "https://byronwade.com",
  },
  { name: "GoodMarks", desc: "Review routing", href: "https://goodmarks.io" },
  {
    name: "SignalRoute",
    desc: "Beautiful phone & SMS",
    href: "https://getsignalroute.com",
  },
  {
    name: "Fakebase",
    desc: "Mock backend for prototyping",
    href: "https://fakebase.byronwade.com",
  },
  {
    name: "Dits",
    desc: "Large-file version control",
    href: "https://dits.byronwade.com",
  },
  {
    name: "Wormhole",
    desc: "Instant file transfer",
    href: "https://wormhole.byronwade.com",
  },
]

const ICON_BTN =
  "inline-flex size-9 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"

function AppsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Switch app"
        className={cn(ICON_BTN, "size-8")}
      >
        <GridFour className="size-4" strokeWidth={2} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Design skins
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {SKIN_APPS.map((p) => (
          <DropdownMenuItem
            key={p.href}
            render={<Link href={p.href} />}
            className="flex-col items-start gap-0.5"
          >
            <span className="text-sm text-foreground">{p.name}</span>
            <span className="text-xs text-muted-foreground">{p.desc}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          render={
            <a
              href="https://ui.byronwade.com/linear"
              target="_blank"
              rel="noreferrer"
            />
          }
          className="flex-col items-start gap-0.5"
        >
          <span className="flex w-full items-center gap-1.5 text-sm text-foreground">
            Linear demo
            <ArrowUpRight className="size-3 text-muted-foreground" />
          </span>
          <span className="text-xs text-muted-foreground">
            Full product app (production)
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          render={
            <a
              href="https://ui.byronwade.com/polaris"
              target="_blank"
              rel="noreferrer"
            />
          }
          className="flex-col items-start gap-0.5"
        >
          <span className="flex w-full items-center gap-1.5 text-sm text-foreground">
            Polaris demo
            <ArrowUpRight className="size-3 text-muted-foreground" />
          </span>
          <span className="text-xs text-muted-foreground">
            Full admin app (production)
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          byronwade
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {PRODUCTS.map((p) => (
          <DropdownMenuItem
            key={p.href}
            render={<a href={p.href} target="_blank" rel="noreferrer" />}
            className="flex-col items-start gap-0.5"
          >
            <span className="flex w-full items-center gap-1.5 text-sm text-foreground">
              {p.name}
              <ArrowUpRight className="size-3 text-muted-foreground" />
            </span>
            <span className="text-xs text-muted-foreground">{p.desc}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()
  const item = navItems.find((n) => n.href === href)
  const active = item ? isActive(item, pathname) : pathname === href
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-8 items-center rounded-full px-3 text-[13px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-brand/10 text-foreground"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
      )}
    >
      {label}
    </Link>
  )
}

/**
 * SiteHeader — the primary application top bar. Full-width, sticky-feeling
 * (fixed), calm token surface with a hairline underline. Wordmark + app switcher
 * on the left, primary nav centered-left, and a search / theme / source cluster
 * on the right. Search opens the command palette (⌘K). On docs routes a menu
 * button blooms the docs sidebar sheet on small screens; elsewhere a mobile
 * nav menu mirrors primary destinations.
 */
function MobileNavMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open navigation menu"
        className={cn(ICON_BTN, "size-8 md:hidden")}
      >
        <List className="size-4" strokeWidth={2} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Navigate
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {navItems.map((item) => (
          <DropdownMenuItem key={item.href} render={<Link href={item.href} />}>
            {item.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Skins
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {SKIN_APPS.map((p) => (
          <DropdownMenuItem key={p.href} render={<Link href={p.href} />}>
            {p.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          render={
            <a
              href="https://ui.byronwade.com/linear"
              target="_blank"
              rel="noreferrer"
            />
          }
        >
          <span className="flex w-full items-center gap-1.5">
            Linear demo
            <ArrowUpRight className="size-3 text-muted-foreground" />
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          render={
            <a
              href="https://ui.byronwade.com/polaris"
              target="_blank"
              rel="noreferrer"
            />
          }
        >
          <span className="flex w-full items-center gap-1.5">
            Polaris demo
            <ArrowUpRight className="size-3 text-muted-foreground" />
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const isDocs = pathname === "/docs" || pathname?.startsWith("/docs/")

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md print:hidden">
      <div className="flex h-14 items-center gap-2 px-3 sm:px-4">
        {isDocs ? (
          <button
            type="button"
            aria-label="Open documentation menu"
            onClick={() => window.dispatchEvent(new Event("open-docs-nav"))}
            className={cn(ICON_BTN, "size-8 md:hidden")}
          >
            <List className="size-4" strokeWidth={2} />
          </button>
        ) : (
          <MobileNavMenu />
        )}

        <AppsMenu />

        <Link
          href="/"
          className="flex items-center rounded-lg px-1.5 font-mono text-sm font-medium tracking-tight text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          byronwade<span className="text-brand">/ui</span>
        </Link>

        <nav
          aria-label="Primary"
          className="ml-3 hidden items-center gap-1 md:flex"
        >
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new Event("open-command-palette"))
            }
            aria-label="Search"
            className="flex h-9 items-center gap-2 rounded-full bg-muted/50 pl-3 pr-2 text-sm text-muted-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
          >
            <MagnifyingGlass className="size-4" strokeWidth={2} />
            <span className="hidden lg:inline">Search</span>
            <kbd className="hidden rounded border border-border bg-background px-1.5 font-mono text-[10px] sm:inline">
              ⌘K
            </kbd>
          </button>

          <SkinToggle />

          <ThemeToggleButton />

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className={ICON_BTN}
          >
            <GitFork className="size-4" strokeWidth={2} />
          </a>
        </div>
      </div>
    </header>
  )
}
