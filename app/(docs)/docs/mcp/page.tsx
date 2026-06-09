import type { Metadata } from "next"
import Link from "next/link"

import { CodeBlock } from "@/app/(docs)/_components/code-block"
import {
  BLEED,
  DocsIntro,
  DocsProse,
} from "@/app/(docs)/_components/docs-prose"
import { GuidePager } from "@/app/(docs)/_components/guide-pager"

export const metadata: Metadata = {
  title: "MCP, byronwade/ui",
  description:
    "The byronwade/ui MCP server gives an AI agent live access to components, tokens, the design rule, and a real-time on-system check.",
}

/* ---------------------------------------------------------------------------
   MCP docs, a single-page reference for the @byronwade/mcp server.
   Shell mirrors installation/page.tsx: token-only classes, font-medium
   headings, font-mono labels, CodeBlock for all code.
--------------------------------------------------------------------------- */

const TOOLS: { name: string; description: string }[] = [
  {
    name: "search_components",
    description:
      "Full-text search across all registry components and their metadata.",
  },
  {
    name: "get_component_source",
    description: "Fetch the raw source of any registry component by slug.",
  },
  {
    name: "check_on_system",
    description:
      "Verify whether a given component is already installed in the consumer's project.",
  },
  {
    name: "get_design_rule",
    description:
      "Return the full byronwade-ui.mdc design rule so the agent stays on-system.",
  },
  {
    name: "list_design_tokens",
    description:
      "List every CSS custom property defined in the foundation token set.",
  },
  {
    name: "list_house_utilities",
    description:
      "List all house utility classes (bg-grid, glow-brand, text-gradient, mask-fade-x, …).",
  },
]

const MCP_CONFIG = `{
  "mcpServers": {
    "byronwade": {
      "command": "npx",
      "args": ["-y", "@byronwade/mcp"]
    }
  }
}`

const HOSTS: { name: string; note: string }[] = [
  { name: "Cursor", note: "Add to .cursor/mcp.json or the global MCP config." },
  { name: "Windsurf", note: "Add under mcpServers in the Cascade settings." },
  {
    name: "Claude Desktop",
    note: "Add to claude_desktop_config.json, then restart.",
  },
  {
    name: "Any MCP-compatible client",
    note: "Same JSON, anywhere the Model Context Protocol is spoken.",
  },
]

const AGENT_FLOW = `// 1. Find the right primitive instead of inventing one
search_components({ query: "status pill" })
  → [{ slug: "status-pill", type: "registry:component", … }]

// 2. Read the real source, not a guess
get_component_source({ slug: "status-pill" })
  → "export function StatusPill(…) { … }"

// 3. Is it already in the consumer's project?
check_on_system({ slug: "status-pill" })
  → { installed: false, command: "npx shadcn add @byronwade/status-pill" }

// 4. Stay on-system while authoring new markup
get_design_rule()        → byronwade-ui.mdc (tokens-only, edge, font rules)
list_design_tokens()     → ["--brand", "--background", "--success", …]`

export default function McpPage() {
  return (
    <article className="max-w-none">
      {/* ============================ HERO ============================== */}
      <section className="py-12 lg:py-16">
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-700">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
            Tooling · MCP Server
          </p>
          <h1 className="mt-4 text-[clamp(2.25rem,6vw,4rem)] font-normal leading-[1.05] tracking-tight text-foreground text-balance">
            MCP, byronwade/ui
          </h1>
          <DocsIntro>
            The <code className="font-mono text-[13px]">@byronwade/mcp</code>{" "}
            server gives an AI agent live access to every component, the full
            token set, the design rule, and a real-time on-system check, so the
            agent authors code that is always on-system, without needing a copy
            of the registry embedded in its context.
          </DocsIntro>
        </div>
      </section>

      {/* =========================== WHY IT MATTERS ==================== */}
      <section className="py-16">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-brand">
          Why it matters
        </p>
        <h2 className="mb-6 text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
          The agent stays on-system without carrying the registry
        </h2>
        <DocsProse>
          <p>
            Pasting the whole component library into a prompt is expensive and
            goes stale the moment the registry changes. The MCP server flips
            that: the agent queries components, tokens, and the design rule{" "}
            <em>live</em>, so its context stays small and always current. It
            authors against the real source instead of a remembered
            approximation.
          </p>
          <p>
            This is one third of the on-system loop. The{" "}
            <Link
              href="/docs/ai"
              className="text-brand underline-offset-4 hover:underline"
            >
              design rule
            </Link>{" "}
            tells the agent what on-system looks like, the server hands it the
            live primitives and{" "}
            <Link
              href="/docs/foundation"
              className="text-brand underline-offset-4 hover:underline"
            >
              foundation tokens
            </Link>{" "}
            to build with, and the{" "}
            <Link
              href="/docs/lint"
              className="text-brand underline-offset-4 hover:underline"
            >
              lint
            </Link>{" "}
            catches anything that drifts off-system before it ships.
          </p>
        </DocsProse>
      </section>

      {/* ============================ INSTALL =========================== */}
      <section className={`${BLEED} border-y border-border bg-card`}>
        <div className="py-14">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-brand">
            Install
          </p>
          <h2 className="mb-6 text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
            Add the server to your MCP host
          </h2>
          <p className="mb-6 max-w-xl text-sm leading-relaxed text-muted-foreground text-pretty">
            Drop this config into your MCP host (Cursor, Windsurf, Claude
            Desktop, or any MCP-compatible client). No global install needed,{" "}
            <code className="font-mono text-[13px]">npx</code> pulls the package
            on first use.
          </p>
          <CodeBlock lang="json" code={MCP_CONFIG} />
        </div>
      </section>

      {/* ============================ TOOLS ============================= */}
      <section className="py-16">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-brand">
          Tools
        </p>
        <h2 className="mb-6 text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
          Six tools exposed to the agent
        </h2>
        <p className="mb-8 max-w-xl text-sm leading-relaxed text-muted-foreground text-pretty">
          Every tool is read-only. The server never writes to the
          consumer&apos;s project, it only surfaces information the agent needs
          to stay on-system.
        </p>
        <ul className="space-y-4">
          {TOOLS.map((tool) => (
            <li key={tool.name} className="flex items-start gap-4">
              <span className="shrink-0 rounded-md edge bg-muted px-2 py-1 font-mono text-[13px] text-foreground">
                {tool.name}
              </span>
              <span className="text-sm leading-relaxed text-muted-foreground">
                {tool.description}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ========================== SUPPORTED HOSTS ==================== */}
      <section className={`${BLEED} border-y border-border bg-card`}>
        <div className="py-14">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-brand">
            Supported hosts
          </p>
          <h2 className="mb-6 text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
            Anywhere that speaks MCP
          </h2>
          <p className="mb-8 max-w-xl text-sm leading-relaxed text-muted-foreground text-pretty">
            The same <code className="font-mono text-[13px]">mcpServers</code>{" "}
            block from{" "}
            <Link
              href="/docs/installation"
              className="text-brand underline-offset-4 hover:underline"
            >
              installation
            </Link>{" "}
            works in any Model Context Protocol client.
          </p>
          <ul className="space-y-4">
            {HOSTS.map((host) => (
              <li key={host.name} className="flex items-start gap-4">
                <span className="shrink-0 rounded-md edge bg-muted px-2 py-1 font-mono text-[13px] text-foreground">
                  {host.name}
                </span>
                <span className="text-sm leading-relaxed text-muted-foreground">
                  {host.note}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ========================= HOW AN AGENT USES IT ================ */}
      <section className="py-16">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-brand">
          How an agent uses it
        </p>
        <h2 className="mb-6 text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
          A typical on-system flow
        </h2>
        <p className="mb-8 max-w-xl text-sm leading-relaxed text-muted-foreground text-pretty">
          Asked for a status indicator, the agent searches first, reads the real
          source, checks whether it is already installed, then pulls the rule
          and tokens so the markup it writes never drifts off-system.
        </p>
        <CodeBlock lang="js" code={AGENT_FLOW} />
      </section>

      {/* ============================ PAIRS WITH ====================== */}
      <section className={`${BLEED} border-y border-border bg-card`}>
        <div className="py-14">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-brand">
            Pairs with
          </p>
          <h2 className="mb-6 text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
            The rest of the on-system toolchain
          </h2>
          <DocsProse>
            <p>
              The server is most useful alongside the other two halves of the
              loop. The{" "}
              <Link
                href="/docs/ai"
                className="text-brand underline-offset-4 hover:underline"
              >
                AI design rule
              </Link>{" "}
              ships the conventions the agent reads through{" "}
              <code className="font-mono text-[13px]">get_design_rule</code>,
              and the{" "}
              <Link
                href="/docs/lint"
                className="text-brand underline-offset-4 hover:underline"
              >
                on-system lint
              </Link>{" "}
              enforces them in CI — turning the same guidance the agent consumed
              into a hard gate. Rule, server, and lint share one source of
              truth.
            </p>
          </DocsProse>
        </div>
      </section>

      <GuidePager current="/docs/mcp" />
    </article>
  )
}
