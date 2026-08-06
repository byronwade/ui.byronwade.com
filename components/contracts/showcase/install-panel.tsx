import Link from "next/link"

import { CopyButton } from "@/components/docs/copy-button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  getContractInstall,
  type ContractInstall,
} from "@/lib/contracts/install"

function CodeBlock({
  code,
  label,
}: {
  code: string
  label: string
}) {
  return (
    <div className="overflow-hidden rounded-lg bg-muted/40 edge">
      <div className="flex items-center justify-between gap-2 border-b border-border/60 px-3 py-2">
        <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
          {label}
        </p>
        <CopyButton value={code} label="Copy" size="sm" />
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-[12px] leading-relaxed text-foreground whitespace-pre-wrap">
        {code}
      </pre>
    </div>
  )
}

function InstallPanel({
  contractId,
  compact = false,
}: {
  contractId: string
  compact?: boolean
}) {
  const install = getContractInstall(contractId)
  if (!install) return null

  return (
    <div data-slot="install-panel" className="space-y-6">
      {!compact ? (
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            Design contract install
          </p>
          <h2 className="mt-2 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Install into any project
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            <Link
              href="/stack"
              className="text-foreground underline-offset-4 hover:underline"
            >
              Agent stack
            </Link>
            : law book + verified skills + CI gates are required. Contract MCP
            is optional.{" "}
            <span className="text-foreground">shadcn MCP / CLI</span> installs
            atoms;{" "}
            <span className="text-foreground">{install.name}</span> keeps agents
            inside closed tokens via docs, skills, and{" "}
            <span className="font-mono text-foreground">npm run validate</span>.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card size="sm" className="lg:col-span-2">
          <CardHeader>
            <CardTitle>0. Agent loop (golden path)</CardTitle>
            <CardDescription>
              Fail-closed order — gates are the bailiff, not a skipped tool
              call.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm text-muted-foreground">
              {install.agentLoop.map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="font-mono text-[11px] text-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle>1. Skills (required cookbook)</CardTitle>
            <CardDescription>
              Native {install.name} skill pack — theme, compose, specialty.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <CodeBlock code={install.skillsNpx} label="all skills" />
            <CodeBlock
              code={install.skillsNpxTheme}
              label={install.themeSkillNote}
            />
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle>2. Law book + gates</CardTitle>
            <CardDescription>
              Machine markdown +{" "}
              <span className="font-mono">npm run validate</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-1.5 font-mono text-[12px] text-muted-foreground">
              {(
                [
                  ["design.md", install.machineUrls.design],
                  ["agents.md", install.machineUrls.agents],
                  ["architecture.md", install.machineUrls.architecture],
                  ["llms.txt", install.machineUrls.llms],
                ] as const
              ).map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href.replace("https://ui.byronwade.com", "")}
                    className="text-foreground underline-offset-4 hover:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <Separator />
            <CodeBlock code={install.checkCli} label="done gate" />
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle>3. Compose with shadcn</CardTitle>
            <CardDescription>
              Install atoms, then stay inside the contract.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <CodeBlock code={install.shadcnInit} label="shadcn init" />
            <CodeBlock code={install.shadcnAdd} label="add primitives" />
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle>4. Contract API (JSON)</CardTitle>
            <CardDescription>
              Slim consistency kit — mandate, tokens, primitives, recipes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <CodeBlock code={install.contractJsonCurl} label="curl" />
            <p className="font-mono text-[11px] text-muted-foreground break-all">
              <Link
                href={install.contractJsonUrl.replace(
                  "https://ui.byronwade.com",
                  "",
                )}
                className="text-foreground underline-offset-4 hover:underline"
              >
                {install.contractJsonUrl.replace(
                  "https://ui.byronwade.com",
                  "",
                )}
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card size="sm" className="lg:col-span-2">
          <CardHeader>
            <CardTitle>5. Optional — contract MCP</CardTitle>
            <CardDescription>
              Accelerator for tool-calling agents. Not a substitute for gates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <CodeBlock code={install.mcpCommand} label="npx (any project)" />
            <CodeBlock code={install.mcpCursorJson} label=".cursor/mcp.json" />
            <div className="flex flex-wrap gap-1.5">
              {install.tools.map((t) => (
                <Badge
                  key={t}
                  variant="secondary"
                  className="font-mono text-[10px]"
                >
                  {t}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {install.shadcnMcpNote}
            </p>
            <p className="text-xs text-muted-foreground">
              Contributor checkout:{" "}
              <span className="font-mono text-foreground">
                {install.mcpLocalCommand}
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {!compact ? (
        <p className="text-sm text-muted-foreground">
          Next: explore{" "}
          <Link
            href={install.pages.ui}
            className="text-foreground underline-offset-4 hover:underline"
          >
            UI primitives
          </Link>
          ,{" "}
          <Link
            href={install.pages.surfaces}
            className="text-foreground underline-offset-4 hover:underline"
          >
            app shells
          </Link>
          ,{" "}
          <Link
            href={install.pages.theme}
            className="text-foreground underline-offset-4 hover:underline"
          >
            theme
          </Link>
          , and{" "}
          <Link
            href={install.pages.design}
            className="text-foreground underline-offset-4 hover:underline"
          >
            design.md
          </Link>{" "}
          — all styled with {install.name} tokens on this route.
        </p>
      ) : null}
    </div>
  )
}

export { InstallPanel }
export type { ContractInstall }
