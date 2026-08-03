function CatalogHero() {
  return (
    <section
      data-slot="catalog-hero"
      data-surface="marketing"
      className="relative overflow-hidden px-5 pb-16 pt-28 md:px-8 md:pb-20 md:pt-36"
    >
      {/* Soft atmosphere — token washes, not flat fill */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(80% 60% at 15% 10%, color-mix(in oklch, var(--brand) 14%, transparent) 0%, transparent 55%),
            radial-gradient(70% 50% at 85% 30%, color-mix(in oklch, var(--muted) 80%, transparent) 0%, transparent 50%),
            linear-gradient(180deg, var(--background) 0%, color-mix(in oklch, var(--muted) 35%, var(--background)) 100%)
          `,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-background to-transparent"
      />

      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
          ui.byronwade.com
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-medium tracking-tight text-foreground sm:text-5xl md:text-6xl md:leading-[1.05]">
          Design contracts
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Strict AI design systems agents install over MCP — so every dashboard,
          workbench, and AI rail they ship looks like one hand made it.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#contracts"
            className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium tracking-tight text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            Browse contracts
          </a>
          <a
            href="#pricing"
            className="inline-flex h-10 items-center rounded-full px-5 text-sm tracking-tight text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            Pricing · $9/mo
          </a>
        </div>
      </div>
    </section>
  )
}

export { CatalogHero }
