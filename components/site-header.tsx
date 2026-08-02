import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

const links = [
  { href: "/theme", label: "Theme" },
  { href: "/surfaces", label: "Surfaces" },
  { href: "/for-agents", label: "Agents" },
] as const

/** Sparse frosted chrome — recedes so the film can lead. */
function SiteHeader() {
  return (
    <header
      data-slot="site-header"
      className="fixed inset-x-0 top-0 z-50 flex h-11 items-center justify-between px-5 md:px-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-background/40 backdrop-blur-2xl" />
      <Link
        href="/"
        className="relative z-10 text-[13px] font-medium tracking-tight text-foreground/85 transition-opacity hover:opacity-60"
      >
        Meridian
      </Link>
      <nav className="relative z-10 flex items-center gap-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "hidden text-[12px] tracking-tight text-foreground/55 transition-opacity hover:text-foreground/90 sm:inline",
            )}
          >
            {link.label}
          </Link>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  )
}

export { SiteHeader }
