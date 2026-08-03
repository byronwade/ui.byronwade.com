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
import { contractPrimaryNav, getContract } from "@/lib/contracts/catalog"
import { cn } from "@/lib/utils"

function linkActive(pathname: string, href: string, base: string) {
  if (href === base) {
    return pathname === base || pathname === `${base}/`
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

function ContractHeader({ contractId }: { contractId: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [overTheater, setOverTheater] = useState(false)
  const contract = getContract(contractId)
  const name = contract?.name ?? contractId
  const base = `/${contractId}`
  const live = contract?.status === "live"
  const nav = live
    ? contractPrimaryNav(contractId)
    : ([
        { href: base, label: "Experience" },
        { href: "/#contracts", label: "All contracts" },
      ] as const)

  useEffect(() => {
    const update = () => {
      const stages = document.querySelectorAll<HTMLElement>(
        '[data-tone="theater"]',
      )
      if (stages.length === 0) {
        setOverTheater(false)
        return
      }
      let hit = false
      for (const stage of stages) {
        const rect = stage.getBoundingClientRect()
        if (rect.top < 96 && rect.bottom > 180) {
          hit = true
          break
        }
      }
      setOverTheater(hit)
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [pathname])

  return (
    <header
      data-slot="contract-header"
      data-surface="marketing"
      data-over={overTheater ? "theater" : "paper"}
      data-tone={overTheater ? "theater" : undefined}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200",
        overTheater
          ? "border-border/30 bg-dock/85 text-dock-foreground backdrop-blur-xl"
          : "border-border/50 bg-background/80 text-foreground backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex h-11 max-w-6xl items-center justify-between gap-3 px-4 md:h-12 md:px-6">
        <div className="relative z-10 flex min-w-0 items-center gap-2">
          <Link
            href="/"
            className={cn(
              "text-[13px] font-medium tracking-tight transition-opacity hover:opacity-70",
              overTheater ? "text-dock-muted" : "text-muted-foreground",
            )}
          >
            Contracts
          </Link>
          <span
            className={cn(
              "text-[13px]",
              overTheater ? "text-dock-muted" : "text-muted-foreground",
            )}
            aria-hidden
          >
            /
          </span>
          <Link
            href={base}
            className={cn(
              "truncate text-[13px] font-medium tracking-tight transition-opacity hover:opacity-70",
              overTheater ? "text-dock-foreground" : "text-foreground",
            )}
          >
            {name}
          </Link>
        </div>

        <nav
          aria-label={`${name} primary`}
          className="hidden min-w-0 flex-1 items-center justify-end gap-0.5 md:flex lg:justify-center"
        >
          {nav.map((item) => {
            const active = linkActive(pathname, item.href, base)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-8 shrink-0 items-center rounded-full px-2.5 text-[13px] tracking-tight transition-colors",
                  overTheater
                    ? active
                      ? "bg-background/15 text-dock-foreground"
                      : "text-dock-muted hover:bg-background/10 hover:text-dock-foreground"
                    : active
                      ? "bg-brand/10 text-foreground"
                      : "text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="relative z-10 flex items-center gap-1.5">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "md:hidden",
                  overTheater && "text-dock-foreground hover:bg-background/10",
                )}
                aria-label="Open menu"
              >
                {open ? <X className="size-4" /> : <List className="size-4" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100%,20rem)]">
              <SheetHeader>
                <SheetTitle className="text-left text-sm font-medium tracking-tight">
                  {name}
                </SheetTitle>
              </SheetHeader>
              <nav
                aria-label="Mobile contract"
                className="mt-4 flex flex-col gap-1 px-2"
              >
                {nav.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="rounded-lg px-3 py-2.5 text-sm tracking-tight text-foreground hover:bg-muted/30"
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

export { ContractHeader }
