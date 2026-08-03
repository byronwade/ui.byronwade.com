const steps = [
  {
    n: "01",
    title: "Pick a contract",
    body: "Each design contract is a fail-closed rule pack — tokens, density, typeset, UX/DX laws — not a pile of one-off components.",
  },
  {
    n: "02",
    title: "Install the MCP",
    body: "Agents connect via MCP: get_contract, resolve_token, validate_ui, list_primitives, get_recipe. One accent. Closed grammar.",
  },
  {
    n: "03",
    title: "Ship under the law",
    body: "Compose shadcn primitives. Run meridian check. Surfaces stay coherent because creativity lives in content, not new colors.",
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
        <h2 className="mt-3 max-w-xl text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          Agents install the law. Humans keep the craft.
        </h2>
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
