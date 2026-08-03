import Link from "next/link"
import { docs, primaryNav } from "@/lib/docs/catalog"
import { systemDocs } from "@/lib/docs/system-docs"
import { skillProofs } from "@/lib/site/skill-proofs"

function SiteFooter() {
  const files = docs.filter((d) => Boolean(d.filename))

  return (
    <footer
      data-slot="site-footer"
      className="border-t border-border/50 bg-background px-5 py-12 md:px-8 md:py-16"
    >
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm font-medium tracking-tight text-foreground">
            Meridian
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Cinematic theme for product UI — soft neutrals, one accent, typed
            for agents.
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
            Explore
          </p>
          <ul className="mt-3 space-y-2">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.navLabel ?? item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
            Skills · prove
          </p>
          <ul className="mt-3 space-y-2">
            {skillProofs.map((proof) => (
              <li key={proof.slug}>
                <Link
                  href={proof.proveHref}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {proof.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
            System · files
          </p>
          <ul className="mt-3 space-y-2">
            {systemDocs.slice(0, 5).map((doc) => (
              <li key={doc.slug}>
                <Link
                  href={`/system/${doc.slug}`}
                  className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {doc.filename}
                </Link>
              </li>
            ))}
            {files.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.filename}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

export { SiteFooter }
