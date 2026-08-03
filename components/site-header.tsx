"use client"

import { useEffect, useState } from "react"
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

/** Quiet app chrome — denser than marketing pills; adapts over theater stages. */
function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [overTheater, setOverTheater] = useState(false)
  const more = docs.filter((d) => !d.nav && d.filename)

  useEffect(() => {
    const stages = Array.from(
      document.querySelectorAll<HTMLElement>('[data-tone="theater"]'),
    )
    if (stages.length === 0) {
      setOverTheater(false)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.some(
          (entry) => entry.isIntersecting && entry.intersectionRatio >= 0.45,
        )
        setOverTheater(hit)
      },
      { threshold: [0.45, 0.6] },
    )

    for (const stage of stages) observer.observe(stage)
    return () => observer.disconnect()
  }, [pathname])

  return (
    <header
      data-slot="site-header"
      data-over={overTheater ? "theater" : "paper"}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200",
        overTheater
          ? "border-border/30 bg-dock/85 text-dock-foreground backdrop-blur-xl"
          : "border-border/50 bg-background/75 text-foreground backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex h-11 max-w-6xl items-center justify-between gap-3 px-4 md:h-12 md:px-6">
        <Link
          href="/"
          className={cn(
            "relative z-10 text-[13px] font-medium tracking-tight transition-opacity hover:opacity-70",
            overTheater ? "text-dock-foreground" : "text-foreground",
          )}
        >
          Meridian
        </Link>

        <nav
          aria-label="Primary"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 md:flex"
        >
          {primaryNav.map((item) => {
            const active = linkActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[12px] tracking-tight transition-colors",
                  overTheater
                    ? active
                      ? "bg-brand/15 text-dock-foreground"
                      : "text-dock-muted hover:text-dock-foreground"
                    : active
                      ? "bg-brand/10 text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.navLabel ?? item.title}
              </Link>
            )
          })}
        </nav>

        <div className="relative z-10 flex items-center gap-0.5">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-touch"
                className={cn(
                  "md:hidden",
                  overTheater && "text-dock-foreground hover:bg-muted/20",
                )}
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
                className="flex flex-col gap-0.5 px-3 py-3"
                data-surface="mobile"
              >
                <SheetClose asChild>
                  <Link
                    href="/"
                    className={cn(
                      "rounded-lg px-3 py-3 text-[15px] tracking-tight transition-colors",
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
                          "rounded-lg px-3 py-3 text-[15px] tracking-tight transition-colors",
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
                <p className="mt-3 px-3 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                  Files
                </p>
                {more.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="rounded-lg px-3 py-3 text-[15px] tracking-tight text-foreground hover:bg-muted/40"
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
