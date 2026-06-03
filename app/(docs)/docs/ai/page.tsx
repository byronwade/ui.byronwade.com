import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/app/(docs)/_components/code-block";
import { Step } from "@/app/(docs)/_components/step";
import { REGISTRY_URL } from "@/content/guides";

export const metadata: Metadata = {
  title: "AI rules — byronwade/ui",
  description:
    "Install one design-system rule so your AI agent keeps building with byronwade/ui components and tokens.",
};

export default function AiPage() {
  return (
    <article className="mx-auto max-w-4xl space-y-12">
      <header>
        <p className="text-sm font-medium text-brand">Get Started</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Keep your AI on-system
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground text-pretty">
          This registry ships a design-system{" "}
          <span className="text-foreground">rule for AI agents</span>. Install it once and your
          assistant — Cursor, Claude, Copilot, Windsurf, Codex — keeps building and editing UI with
          these components and tokens: reaching for existing components instead of reinventing them,
          styling with semantic tokens instead of hardcoded colors, and re-skinning only through{" "}
          <code className="font-mono text-[13px]">--brand</code>. Every future change stays
          on-system without you having to re-explain the rules.
        </p>
        <div className="mt-5">
          <Badge variant="success">
            <Bot className="size-3" />
            AI-native
          </Badge>
        </div>
      </header>

      <div className="space-y-8">
        <Step n={1} title="Add the rule (Cursor — one command)">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Drops the rule into{" "}
            <code className="font-mono text-[13px]">.cursor/rules/byronwade-ui.mdc</code>. Cursor
            auto-applies it on every edit.
          </p>
          <CodeBlock lang="bash" code={`npx shadcn@latest add @byronwade/design-rules`} />
        </Step>

        <Step n={2} title="Using a different AI tool? Point it at the same rule">
          <p className="text-sm leading-relaxed text-muted-foreground">
            The rule&apos;s content lives at{" "}
            <code className="font-mono text-[13px]">{REGISTRY_URL}/r/design-rules.json</code>. Run
            the command above (or copy the file&apos;s contents) into your agent&apos;s instructions
            file:
          </p>
          <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li>
              <span className="text-foreground">Cursor</span> —{" "}
              <code className="font-mono text-[13px]">.cursor/rules/byronwade-ui.mdc</code>{" "}
              (installed automatically above)
            </li>
            <li>
              <span className="text-foreground">Claude Code</span> — reference it from{" "}
              <code className="font-mono text-[13px]">CLAUDE.md</code>
            </li>
            <li>
              <span className="text-foreground">GitHub Copilot</span> —{" "}
              <code className="font-mono text-[13px]">.github/copilot-instructions.md</code>
            </li>
            <li>
              <span className="text-foreground">Codex / AGENTS-aware tools</span> —{" "}
              <code className="font-mono text-[13px]">AGENTS.md</code>
            </li>
            <li>
              <span className="text-foreground">Windsurf</span> —{" "}
              <code className="font-mono text-[13px]">.windsurfrules</code>
            </li>
          </ul>
        </Step>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-border pt-8 text-sm">
        <Link
          href="/docs"
          className="inline-flex items-center gap-1.5 text-brand underline-offset-4 hover:underline"
        >
          Browse all components
          <ArrowRight className="size-3.5" />
        </Link>
        <Link
          href="/docs/theming"
          className="inline-flex items-center gap-1.5 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Back to Theming
        </Link>
      </div>
    </article>
  );
}
