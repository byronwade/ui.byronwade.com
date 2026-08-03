import Link from "next/link"

const layers = [
  {
    n: "01",
    name: "Contract MCP",
    role: "Required · product centerpiece",
    job: "Runtime consistency law agents call in-session.",
    tools: ["get_contract", "apply_prefs", "validate_ui", "get_recipe"],
    body: "Fail-closed. Same tools on every DNA. Unlike shadcn MCP (which installs atoms), this keeps agents inside closed tokens and bans.",
  },
  {
    n: "02",
    name: "design.md · agents.md",
    role: "Required · source of truth",
    job: "Persistent law book — why, load order, material rules.",
    tools: ["design.md", "agents.md", "system/*"],
    body: "Markdown agents can reread. Negotiated HTML for humans, raw for machines. MCP stays slim; fat prose lives here.",
  },
  {
    n: "03",
    name: "Skills",
    role: "Optional · cookbook",
    job: "On-demand playbooks for theme, compose, cinema, a11y.",
    tools: ["meridian-theme", "meridian-compose", "…"],
    body: "Accelerate common work. Easy to skip — so skills teach MCP usage; they never replace get_contract / validate_ui.",
  },
] as const

const compare = [
  {
    approach: "DESIGN.md only",
    strength: "Portable prose identity",
    gap: "Easy to ignore · no lint",
  },
  {
    approach: "Skills only",
    strength: "Great procedures",
    gap: "Opt-in · never loaded = no contract",
  },
  {
    approach: "shadcn MCP only",
    strength: "Installs registry atoms",
    gap: "No brand / ban / recipe enforcement",
  },
  {
    approach: "MCP + markdown + skills",
    strength: "Law · law book · cookbook",
    gap: "Slightly more to learn — intentional",
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
          MCP is the product. Markdown is the law book. Skills are the cookbook.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Don&apos;t pick one. DESIGN.md-style files teach agents with prose.
          Skills teach procedures. Neither{" "}
          <span className="text-foreground">enforces</span> a design system at
          runtime. Design contracts install a fail-closed MCP — then keep the
          docs and optional skills beside it.
        </p>

        <ol className="mt-12 grid gap-0 border border-border/80 lg:grid-cols-3">
          {layers.map((layer, i) => (
            <li
              key={layer.n}
              className={
                i === 0
                  ? "p-6 lg:border-r lg:border-border/80"
                  : i === 1
                    ? "border-t border-border/80 p-6 lg:border-t-0 lg:border-r"
                    : "border-t border-border/80 p-6 lg:border-t-0"
              }
            >
              <p className="font-mono text-xs text-muted-foreground">{layer.n}</p>
              <h3 className="mt-2 text-lg font-medium tracking-tight text-foreground">
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
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="border-b border-border/80 bg-muted/20 font-mono text-[11px] tracking-tight text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Approach</th>
                  <th className="px-4 py-3 font-medium">Strength</th>
                  <th className="px-4 py-3 font-medium">Gap alone</th>
                </tr>
              </thead>
              <tbody>
                {compare.map((row) => (
                  <tr
                    key={row.approach}
                    className="border-b border-border/60 last:border-b-0"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {row.approach}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.strength}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{row.gap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/stack"
            className="inline-flex h-9 items-center border border-foreground/15 bg-foreground px-4 font-mono text-[12px] tracking-tight text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            Full stack docs
          </Link>
          <Link
            href="/meridian/install"
            className="inline-flex h-9 items-center border border-border px-4 font-mono text-[12px] tracking-tight text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            Install Meridian MCP
          </Link>
          <Link
            href="/meridian/system/stack"
            className="inline-flex h-9 items-center border border-border px-4 font-mono text-[12px] tracking-tight text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            stack.md
          </Link>
        </div>
      </div>
    </section>
  )
}

export { AgentStack }
