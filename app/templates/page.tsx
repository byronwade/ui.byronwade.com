import Link from "next/link"
import { ArrowRight, Clock, Stack } from "@/lib/icons"

const launchNotes = [
  "Template gallery is being rebuilt",
  "Docs and component catalog remain available",
  "Built with byronwade/ui tokens",
]

export default async function TemplatesPage() {
  return (
    <main className="fixed inset-0 h-dvh overflow-hidden bg-background text-foreground">
      <div className="bg-grid pointer-events-none fixed inset-0 -z-10 opacity-[0.32]" />
      <div className="glow-brand pointer-events-none fixed inset-x-0 top-0 -z-10 h-[70vh] opacity-70" />

      <section className="mx-auto flex h-dvh w-full max-w-6xl flex-col justify-center px-6 pb-20 pt-16 sm:pb-16">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:gap-12">
          <div className="max-w-4xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
              byronwade/ui templates
            </p>

            <h1
              aria-label="Templates coming soon"
              className="mt-5 max-w-3xl text-[clamp(2.65rem,9vw,8rem)] font-normal leading-[0.88] text-balance sm:mt-6"
            >
              Templates{" "}
              <span className="block text-gradient-brand">coming soon.</span>
            </h1>

            <p className="reading-ui mt-4 max-w-2xl text-sm leading-6 text-foreground text-pretty sm:mt-7 sm:text-base sm:leading-[1.6]">
              The template library is being reset before launch. The design
              system, docs, and component catalog stay available while this
              surface gets rebuilt around the same token foundation.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-9">
              <Link
                href="/docs"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Read the docs
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/catalog"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full edge bg-background px-4 text-sm font-medium text-foreground transition-all hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <Stack className="size-4" aria-hidden="true" />
                Browse components
              </Link>
            </div>
          </div>

          <aside
            aria-label="Template launch status"
            className="edge bg-card/80 p-4 backdrop-blur sm:p-5 [@media(max-height:760px)]:hidden"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-brand/10 text-brand sm:size-10">
                <Clock className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-mono text-[11px] uppercase text-muted-foreground">
                  Status
                </p>
                <p className="text-sm font-medium text-foreground sm:text-base">
                  Template launch in progress
                </p>
              </div>
            </div>

            <ul className="mt-3 space-y-1.5 sm:mt-6 sm:space-y-3 [@media(max-height:760px)]:hidden">
              {launchNotes.map((note) => (
                <li
                  key={note}
                  className="flex items-center gap-3 border-t border-border pt-2 text-xs text-muted-foreground first:border-t-0 first:pt-0 sm:pt-3 sm:text-sm"
                >
                  <span className="size-1.5 shrink-0 rounded-full bg-brand" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </main>
  )
}
