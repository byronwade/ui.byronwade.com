function TypeSpecimen() {
  return (
    <section
      id="type"
      data-slot="type-specimen"
      className="scroll-mt-20 border-t border-border px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
          Type
        </p>
        <h2 className="mt-4 max-w-[18ch] text-3xl font-medium tracking-[-0.03em] text-foreground md:text-5xl">
          Hierarchy from size and tracking — not weight.
        </h2>

        <div className="mt-14 grid gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <p className="font-mono text-xs text-muted-foreground">
                display
              </p>
              <p className="mt-2 text-4xl font-medium tracking-[-0.04em] md:text-6xl">
                Meridian
              </p>
            </div>
            <div>
              <p className="font-mono text-xs text-muted-foreground">ui</p>
              <p className="mt-2 text-sm tracking-tight text-foreground">
                Resource lists, forms, and nav stay compact —{" "}
                <span className="text-muted-foreground">
                  14px / tight tracking / Geist Sans
                </span>
              </p>
            </div>
            <div>
              <p className="font-mono text-xs text-muted-foreground">mono</p>
              <p className="mt-2 font-mono text-sm tracking-tight text-foreground">
                ISS-1842 · 48m · bg-brand/10 · --brand
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-card p-6 edge md:p-8">
            <p className="font-mono text-xs text-muted-foreground">
              reading-ui
            </p>
            <div className="reading-ui mt-4 text-foreground">
              <p className="reading-lead">
                Web reading on emissive screens is not e-ink.
              </p>
              <p className="reading-muted mt-4">
                Docs and help use a capped measure, relaxed line-height, and
                zero letter-spacing so paragraphs stay readable without
                abandoning the product voice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { TypeSpecimen };
