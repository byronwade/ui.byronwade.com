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
import { cn } from "@/lib/utils"

const nav = [
  { href: "/#stack", label: "Agent stack" },
  { href: "/#contracts", label: "Systems" },
  { href: "/stack", label: "Why MCP" },
  { href: "/#pricing", label: "Open source" },
] as const

function PlatformHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header
      data-slot="platform-header"
      data-site="platform"
      className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md"
    >
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          className="font-mono text-[12px] tracking-[0.14em] text-foreground uppercase transition-opacity hover:opacity-70"
        >
          ui.byronwade
        </Link>

        <nav
          aria-label="Platform"
          className="hidden items-center gap-1 md:flex"
        >
          {nav.map((item) => {
            const active =
              pathname === "/" && item.href === "/#contracts" ? false : false
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex h-8 items-center px-2.5 font-mono text-[12px] tracking-tight text-muted-foreground transition-colors hover:text-foreground",
                  active && "text-foreground",
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                {open ? <X className="size-4" /> : <List className="size-4" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100%,20rem)]">
              <SheetHeader>
                <SheetTitle className="text-left font-mono text-xs tracking-[0.14em] uppercase">
                  Platform
                </SheetTitle>
              </SheetHeader>
              <nav
                aria-label="Mobile platform"
                className="mt-4 flex flex-col gap-1 px-2"
              >
                {nav.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="rounded-lg px-3 py-2.5 font-mono text-sm text-foreground hover:bg-muted/30"
                    >
                      {item.label}
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

export { PlatformHeader }
