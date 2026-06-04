import type { Metadata } from "next";

import { CodeBlock } from "@/app/(docs)/_components/code-block";

export const metadata: Metadata = {
  title: "MCP — byronwade/ui",
  description:
    "The byronwade/ui MCP server gives an AI agent live access to components, tokens, the design rule, and a real-time on-system check.",
};

/* ---------------------------------------------------------------------------
   MCP docs — a single-page reference for the @byronwade/mcp server.
   Shell mirrors installation/page.tsx: token-only classes, font-medium
   headings, font-mono labels, CodeBlock for all code.
--------------------------------------------------------------------------- */

const BLEED = "-mx-6 px-6 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10";

const TOOLS: { name: string; description: string }[] = [
  {
    name: "search_components",
    description: "Full-text search across all registry components and their metadata.",
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
    description: "Return the full byronwade-ui.mdc design rule so the agent stays on-system.",
  },
  {
    name: "list_design_tokens",
    description: "List every CSS custom property defined in the foundation token set.",
  },
  {
    name: "list_house_utilities",
    description:
      "List all house utility classes (bg-grid, glow-brand, text-gradient, mask-fade-x, …).",
  },
];

const MCP_CONFIG = `{
  "mcpServers": {
    "byronwade": {
      "command": "npx",
      "args": ["-y", "@byronwade/mcp"]
    }
  }
}`;

export default function McpPage() {
  return (
    <article className="max-w-none">
      {/* ============================ HERO ============================== */}
      <section className="py-12 lg:py-16">
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-700">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
            Tooling · MCP Server
          </p>
          <h1 className="mt-4 text-[clamp(2.25rem,6vw,4rem)] font-normal leading-[1.0] tracking-tight text-foreground text-balance">
            MCP — byronwade/ui
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground text-pretty">
            The{" "}
            <code className="font-mono text-[13px]">@byronwade/mcp</code> server gives an AI agent
            live access to every component, the full token set, the design rule, and a real-time
            on-system check — so the agent authors code that is always on-system, without needing a
            copy of the registry embedded in its context.
          </p>
        </div>
      </section>

      {/* ============================ INSTALL =========================== */}
      <section className={`${BLEED} border-y border-border bg-card`}>
        <div className="py-14">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-brand">Install</p>
          <h2 className="mb-6 text-lg font-medium tracking-tight text-foreground">
            Add the server to your MCP host
          </h2>
          <p className="mb-6 max-w-xl text-sm leading-relaxed text-muted-foreground text-pretty">
            Drop this config into your MCP host (Cursor, Windsurf, Claude Desktop, or any
            MCP-compatible client). No global install needed —{" "}
            <code className="font-mono text-[13px]">npx</code> pulls the package on first use.
          </p>
          <CodeBlock lang="json" code={MCP_CONFIG} />
        </div>
      </section>

      {/* ============================ TOOLS ============================= */}
      <section className="py-16">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-brand">Tools</p>
        <h2 className="mb-6 text-lg font-medium tracking-tight text-foreground">
          Six tools exposed to the agent
        </h2>
        <p className="mb-8 max-w-xl text-sm leading-relaxed text-muted-foreground text-pretty">
          Every tool is read-only. The server never writes to the consumer&apos;s project — it only
          surfaces information the agent needs to stay on-system.
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
    </article>
  );
}
