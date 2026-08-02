import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

function SiteHeader() {
  return (
    <header
      data-slot="site-header"
      className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between px-5 md:px-8"
    >
      <Link
        href="/"
        className="font-mono text-xs tracking-tight text-foreground/80 transition-colors hover:text-foreground"
      >
        ui.byronwade.com
      </Link>
      <nav className="flex items-center gap-1">
        <Link
          href="#system"
          className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
        >
          System
        </Link>
        <Link
          href="#density"
          className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
        >
          Density
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}

export { SiteHeader };
