"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

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
          className="rounded-full px-3 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          Cinema
        </Link>
        <Link
          href="#system"
          className="rounded-full px-3 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
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
