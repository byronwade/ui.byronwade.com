const steps = [
  {
    n: "01",
    title: "Pick a design contract",
    body: "This homepage is the catalog shell. Open /meridian (or Harbor, Atlas, Vellum) and the whole route becomes that DNA — proof the system is real.",
  },
  {
    n: "02",
    title: "Install the contract MCP",
    body: "One npx line into any project. Agents get get_contract / validate_ui / recipes. Pair with shadcn MCP for atom delivery — different jobs.",
    href: "/meridian/install",
    cta: "Open Meridian install",
  },
  {
    n: "03",
    title: "Compose fail-closed",
    body: "Golden path: get_contract → get_recipe → list_primitives → compose → validate_ui. Creativity stays in content and composition — never new tokens.",
  },
] as const

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      data-slot="how-it-works"
      data-site="platform"
      className="scroll-mt-14 border-t border-border/70 px-4 py-16 md:px-6 md:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          How it works
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          Catalog for discovery. MCP for install.
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          The{" "}
          <a
            href="#stack"
            className="text-foreground underline-offset-4 hover:underline"
          >
            agent stack
          </a>{" "}
          is MCP + markdown + optional skills. This section is the install loop
          once you&apos;ve picked a DNA.
        </p>
        <ol className="mt-12 grid gap-0 border border-border/80 md:grid-cols-3">
          {steps.map((step, i) => (
            <li
              key={step.n}
              className={
                i === 0
                  ? "p-6 md:border-r md:border-border/80"
                  : i === 1
                    ? "border-t border-border/80 p-6 md:border-t-0 md:border-r"
                    : "border-t border-border/80 p-6 md:border-t-0"
              }
            >
              <p className="font-mono text-xs text-muted-foreground">{step.n}</p>
              <h3 className="mt-2 text-lg font-medium tracking-tight text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
              {"href" in step && step.href ? (
                <a
                  href={step.href}
                  className="mt-4 inline-flex font-mono text-[12px] text-foreground underline-offset-4 hover:underline"
                >
                  {step.cta}
                </a>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export { HowItWorks }
