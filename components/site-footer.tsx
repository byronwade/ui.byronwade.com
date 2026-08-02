import Link from "next/link";

function SiteFooter() {
  return (
    <footer
      data-slot="site-footer"
      className="border-t border-border bg-background px-5 py-10 md:px-8"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs tracking-tight text-muted-foreground">
            Meridian · theme for AIs
          </p>
          <p className="mt-1 text-sm tracking-tight text-muted-foreground">
            design.md · skills · agents · surfaces
          </p>
        </div>
        <div className="flex flex-wrap gap-4 font-mono text-xs text-muted-foreground">
          <Link href="/design.md" className="hover:text-foreground">
            design.md
          </Link>
          <Link href="/llms.txt" className="hover:text-foreground">
            llms.txt
          </Link>
          <Link href="/theme" className="hover:text-foreground">
            Theme
          </Link>
          <Link href="/for-agents" className="hover:text-foreground">
            For agents
          </Link>
        </div>
      </div>
    </footer>
  );
}

export { SiteFooter };
