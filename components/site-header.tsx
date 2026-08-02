import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

const links = [
  { href: "/theme", label: "Theme" },
  { href: "/surfaces", label: "Surfaces" },
  { href: "/for-agents", label: "Agents" },
] as const

/** Frosted, sparse — sits over cinema tiles like Apple nav. */
function SiteHeader() {
  return (
    <header
      data-slot="site-header"
      className="fixed inset-x-0 top-0 z-50 flex h-12 items-center justify-between px-5 md:h-11 md:px-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-background/55 backdrop-blur-xl" />
      <Link
        href="/"
        className="relative z-10 text-[12px] font-medium tracking-tight text-foreground/90 transition-opacity hover:opacity-70"
      >
        Meridian
      </Link>
      <nav className="relative z-10 flex items-center gap-5">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "hidden text-[12px] tracking-tight text-foreground/70 transition-opacity hover:opacity-100 sm:inline",
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
