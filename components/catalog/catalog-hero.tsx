function CatalogHero() {
  return (
    <section
      data-slot="catalog-hero"
      data-site="platform"
      className="relative border-b border-border/70 px-4 pb-14 pt-16 md:px-6 md:pb-20 md:pt-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(to right, color-mix(in oklch, var(--foreground) 6%, transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 6%, transparent) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(180deg, black 0%, black 55%, transparent 100%)",
        }}
      />

      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border/60 pb-4">
          <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
            Platform index
          </p>
          <p className="font-mono text-[11px] text-muted-foreground">
            open source · MCP install
          </p>
        </div>

        <h1 className="mt-8 max-w-3xl text-[clamp(2.5rem,7vw,4.25rem)] font-medium leading-[1.02] tracking-[-0.04em] text-foreground">
          Design contracts
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          A catalog of AI design systems. Each contract keeps its own DNA —
          click in and the{" "}
          <span className="text-foreground">entire page becomes that system</span>
          . This index stays on the platform shell so you can compare without
          guessing.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#contracts"
            className="inline-flex h-9 items-center border border-foreground/15 bg-foreground px-4 font-mono text-[12px] tracking-tight text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            Browse systems
          </a>
          <a
            href="#pricing"
            className="inline-flex h-9 items-center border border-border px-4 font-mono text-[12px] tracking-tight text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            Free · open source
          </a>
        </div>
      </div>
    </section>
  )
}

export { CatalogHero }
