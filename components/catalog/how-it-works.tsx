const steps = [
  {
    n: "01",
    title: "Pick a design system",
    body: "Choose a contract — Meridian for cinematic app UI, Harbor for calm ops, Atlas for workbenches, Vellum for docs. Same architecture; different DNA.",
  },
  {
    n: "02",
    title: "Install the consistency MCP",
    body: "Open-source and tiny. Agents must call get_contract before UI and validate_ui before done — closed tokens, bans, primitives, and recipes that keep the system consistent.",
  },
  {
    n: "03",
    title: "Build your product under the law",
    body: "Compose shadcn. Stay inside OKLCH tokens and closed radii. Run the check CLI. Your app UI stays coherent because the rules are frozen, not the widgets.",
  },
] as const

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      data-slot="how-it-works"
      data-surface="marketing"
      className="scroll-mt-16 border-t border-border/40 px-5 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          How it works
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          You sell product. The contract keeps the UI honest.
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Built for developers who use AI to ship application UI — not for
          browsing a styleguide. The MCP is the install surface; the design
          system is the product.
        </p>
        <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
          {steps.map((step) => (
            <li key={step.n} className="relative">
              <p className="font-mono text-xs text-muted-foreground">{step.n}</p>
              <h3 className="mt-2 text-lg font-medium tracking-tight text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export { HowItWorks }
