import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function SiteHeader() {
  return (
    <header
      data-slot="site-header"
      className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between px-5 mix-blend-difference md:px-8"
    >
      <Link
        href="/"
        className="font-mono text-xs tracking-tight text-white transition-opacity hover:opacity-80"
      >
        ui.byronwade.com
      </Link>
      <nav className="flex items-center gap-1">
        <Link
          href="#cinema"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-white hover:bg-white/10 hover:text-white",
          )}
        >
          Cinema
        </Link>
        <Link
          href="#system"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-white hover:bg-white/10 hover:text-white",
          )}
        >
          System
        </Link>
        <div className="text-white [&_button]:text-white [&_button:hover]:bg-white/10">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

export { SiteHeader };
