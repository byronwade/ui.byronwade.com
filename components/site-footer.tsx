import Link from "next/link"

function SiteFooter() {
  return (
    <footer
      data-slot="site-footer"
      className="bg-background px-5 py-12 md:px-8"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
        <p className="text-[12px] tracking-tight text-muted-foreground">
          Meridian
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[12px] text-muted-foreground">
          <Link href="/theme" className="transition-opacity hover:opacity-70">
            Theme
          </Link>
          <Link
            href="/for-agents"
            className="transition-opacity hover:opacity-70"
          >
            Agents
          </Link>
          <Link
            href="/surfaces"
            className="transition-opacity hover:opacity-70"
          >
            Surfaces
          </Link>
          <Link
            href="/design.md"
            className="transition-opacity hover:opacity-70"
          >
            design.md
          </Link>
        </div>
      </div>
    </footer>
  )
}

export { SiteFooter }
