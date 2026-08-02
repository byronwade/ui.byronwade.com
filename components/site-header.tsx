import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function SiteHeader() {
  return (
    <header
      data-slot="site-header"
      className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background px-5 md:px-8"
    >
      <Link
        href="/"
        className="font-mono text-xs tracking-tight text-foreground/80 transition-colors hover:text-foreground"
      >
        ui.byronwade.com
      </Link>
      <nav className="flex items-center gap-1">
        <Link
          href="/surfaces"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-muted-foreground hover:text-foreground",
          )}
        >
          Surfaces
        </Link>
        <Link
          href="/#system"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-muted-foreground hover:text-foreground",
          )}
        >
          System
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}

export { SiteHeader };
