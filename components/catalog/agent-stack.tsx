import Link from "next/link"

const layers = [
  {
    n: "01",
    name: "Law book",
    role: "Required · source of truth",
    job: "design.md · agents.md · DNA docs agents reread.",
    tools: ["design.md", "agents.md", "docs/{id}.md"],
    body: "Persistent why, negatives, and load order per DNA. Negotiated HTML for humans, raw for machines. Not optional vibes.",
  },
  {
    n: "02",
    name: "Verified skills",
    role: "Required · cookbook",
    job: "On-demand playbooks grounded in real primitives.",
    tools: ["{id}-compose", "{id}-theme", "specialty"],
    body: "Every contract ships a native skill pack. Skills teach reuse and recipes — they are not a Meridian monopoly.",
  },
  {
    n: "03",
    name: "Fail-closed gates",
    role: "Required · bailiff",
    job: "CI + check:* agents cannot skip.",
    tools: ["check:design", "check:platform", "check:contrast"],
    body: "The real enforcement. Lint bans, route parity, contrast on every skin. Done means validate is green — not that a tool was called.",
  },
  {
    n: "04",
    name: "Contract MCP",
    role: "Optional · accelerator",
    job: "Queryable kit for tool-calling sessions.",
    tools: ["get_contract", "validate_ui", "get_recipe"],
    body: "Useful when agents are MCP-wired. Never the only bailiff — schemas cost context and tools are skippable.",
  },
] as const

const compare = [
  {
    approach: "DESIGN.md only",
    strength: "Portable prose identity",
    gap: "Easy to ignore · no PR fail",
  },
  {
    approach: "Skills only",
    strength: "Great procedures",
    gap: "Opt-in · invent APIs without catalogs",
  },
  {
    approach: "MCP only",
    strength: "Queryable tools",
    gap: "Context tax · agents skip tools",
  },
  {
    approach: "Law + skills + CI (+ optional MCP)",
    strength: "Context · procedure · enforcement",
    gap: "Slightly more surface — intentional",
  },
] as const

function AgentStack() {
  return (
    <section
      id="stack"
      data-slot="agent-stack"
      data-site="platform"
      className="scroll-mt-14 border-t border-border/70 px-4 py-16 md:px-6 md:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          Agent stack
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          Law book. Skills. Gates that fail the PR. MCP optional.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Inspired by how{" "}
          <span className="text-foreground">v0 grounds agents in real source</span>{" "}
          and verified starters — not protocol theater. Every contract on this
          platform ships the same stack shape with its own DNA.
        </p>

        <ol className="mt-12 grid gap-0 border border-border/80 sm:grid-cols-2 lg:grid-cols-4">
          {layers.map((layer, i) => (
            <li
              key={layer.n}
              className={
                i === 0
                  ? "p-5 sm:border-r sm:border-border/80"
                  : i === 1
                    ? "border-t border-border/80 p-5 sm:border-t-0 sm:border-r lg:border-r"
                    : i === 2
                      ? "border-t border-border/80 p-5 lg:border-t-0 lg:border-r"
                      : "border-t border-border/80 p-5 lg:border-t-0"
              }
            >
              <p className="font-mono text-xs text-muted-foreground">{layer.n}</p>
              <h3 className="mt-2 text-base font-medium tracking-tight text-foreground">
                {layer.name}
              </h3>
              <p className="mt-1 font-mono text-[11px] text-foreground">
                {layer.role}
              </p>
              <p className="mt-3 text-sm font-medium tracking-tight text-foreground">
                {layer.job}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {layer.body}
              </p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {layer.tools.map((t) => (
                  <li
                    key={t}
                    className="border border-border/80 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div className="mt-14">
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            Why not one layer
          </p>
          <h3 className="mt-3 max-w-xl text-2xl font-medium tracking-tight text-foreground">
            Honest comparison
          </h3>
          <div className="mt-6 overflow-x-auto border border-border/80">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead className="border-b border-border/80 bg-muted/30 font-mono text-[11px] tracking-tight text-muted-foreground uppercase">
                <tr>
                  <th className="px-3 py-2 font-medium">Approach</th>
                  <th className="px-3 py-2 font-medium">Strength</th>
                  <th className="px-3 py-2 font-medium">Gap</th>
                </tr>
              </thead>
              <tbody>
                {compare.map((row) => (
                  <tr
                    key={row.approach}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="px-3 py-2.5 font-medium text-foreground">
                      {row.approach}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">
                      {row.strength}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">
                      {row.gap}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/stack"
            className="inline-flex h-9 items-center border border-foreground/15 bg-foreground px-4 font-mono text-[12px] text-background transition-opacity hover:opacity-90"
          >
            Full stack doctrine
          </Link>
          <Link
            href="/meridian/install"
            className="inline-flex h-9 items-center border border-border px-4 font-mono text-[12px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Install a contract
          </Link>
        </div>
      </div>
    </section>
  )
}

export { AgentStack }
