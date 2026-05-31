import Link from "next/link";
import { GitFork } from "lucide-react";
import { SiteNav } from "@/app/(docs)/_components/site-nav";
import { ThemeToggle } from "@/app/_components/theme-toggle";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur">
        <Link href="/" className="font-semibold tracking-tight">byronwade<span className="text-muted-foreground">/ui</span></Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="https://github.com/byronwade/ui"
            className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
            aria-label="GitHub"
          >
            <GitFork className="size-4" />
          </a>
        </div>
      </header>
      <div className="mx-auto flex max-w-6xl gap-10 px-6 py-10">
        <aside className="hidden w-52 shrink-0 lg:block">
          <div className="sticky top-24"><SiteNav /></div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
