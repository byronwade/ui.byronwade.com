import Link from "next/link"

import { PlatformFooter } from "@/components/chrome/platform-footer"
import { PlatformHeader } from "@/components/chrome/platform-header"
import { designContracts } from "@/lib/contracts/catalog"

export const metadata = { title: "Not found" }

/**
 * Owned 404. The contract's own uxLaws require an owned empty state on every
 * resource surface; a missing route is one, and the framework default is not
 * on-system.
 */
export default function NotFound() {
  return (
    <div data-site="platform" className="flex min-h-svh flex-col">
      <PlatformHeader />
      <main
        data-surface="marketing"
        className="flex flex-1 items-center px-4 py-24 md:px-6"
      >
        <div className="mx-auto w-full max-w-5xl">
          <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
            404 · not found
          </p>
          <h1 className="mt-6 max-w-2xl text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.05] font-medium tracking-[-0.04em] text-foreground">
            That route is not in the catalog.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Every design contract serves the same route slots. If you followed a
            link here, the contract may not have authored that page yet.
          </p>
          <div className="mt-10 border-t border-border/70 pt-6">
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              Systems
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
              {designContracts.map((c) => (
                <li key={c.id}>
                  <Link
                    href={c.href}
                    className="font-mono text-sm text-foreground underline-offset-4 hover:underline"
                  >
                    /{c.id}
                  </Link>
                  <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                    {c.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <PlatformFooter />
    </div>
  )
}
