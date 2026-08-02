"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { List, X } from "@/lib/icons"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { primaryNav, docs } from "@/lib/docs/catalog"
import { cn } from "@/lib/utils"

function linkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const more = docs.filter((d) => !d.nav && d.filename)

  return (
    <header
      data-slot="site-header"
      className="fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-2xl"
    >
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between gap-3 px-4 md:h-14 md:px-8">
        <Link
          href="/"
          className="relative z-10 text-[13px] font-medium tracking-tight text-foreground transition-opacity hover:opacity-60"
        >
          Meridian
        </Link>

        <nav
          aria-label="Primary"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex"
        >
          {primaryNav.map((item) => {
            const active = linkActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[13px] tracking-tight transition-colors",
                  active
                    ? "bg-brand/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.navLabel ?? item.title}
              </Link>
            )
          })}
        </nav>

        <div className="relative z-10 flex items-center gap-1">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-touch"
                className="md:hidden"
                aria-label="Open menu"
              >
                <List className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              showCloseButton={false}
              className="w-full max-w-none border-border/60 bg-background p-0 sm:max-w-sm"
            >
              <SheetHeader className="flex-row items-center justify-between gap-3 border-b border-border/60 px-5 py-4">
                <SheetTitle className="text-[15px] font-medium tracking-tight">
                  Menu
                </SheetTitle>
                <SheetClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-touch"
                    aria-label="Close menu"
                  >
                    <X className="size-5" />
                  </Button>
                </SheetClose>
              </SheetHeader>
              <nav
                aria-label="Mobile"
                className="flex flex-col gap-1 px-3 py-4"
                data-surface="mobile"
              >
                <SheetClose asChild>
                  <Link
                    href="/"
                    className={cn(
                      "rounded-2xl px-4 py-3.5 text-base tracking-tight transition-colors",
                      pathname === "/"
                        ? "bg-brand/10 text-foreground"
                        : "text-foreground hover:bg-muted/40",
                    )}
                  >
                    Home
                  </Link>
                </SheetClose>
                {primaryNav.map((item) => {
                  const active = linkActive(pathname, item.href)
                  return (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "rounded-2xl px-4 py-3.5 text-base tracking-tight transition-colors",
                          active
                            ? "bg-brand/10 text-foreground"
                            : "text-foreground hover:bg-muted/40",
                        )}
                      >
                        {item.navLabel ?? item.title}
                      </Link>
                    </SheetClose>
                  )
                })}
                <p className="mt-4 px-4 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                  Files
                </p>
                {more.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="rounded-2xl px-4 py-3.5 text-base tracking-tight text-foreground hover:bg-muted/40"
                    >
                      {item.filename ?? item.title}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export { SiteHeader }
