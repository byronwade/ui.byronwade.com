"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import {
  SettingsBackLink,
  SettingsFormGroup,
  SettingsShell,
} from "@/components/linear/settings-shell"
import { Switch } from "@/components/ui/switch"

type CodingTool = {
  id: string
  name: string
  description: string
  learnMore?: boolean
  enabled?: boolean
}

const TOOLS: CodingTool[] = [
  { id: "amp", name: "Amp", description: "Opens in your terminal. Requires the Linear desktop app.", learnMore: true, enabled: true },
  { id: "claude-code", name: "Claude Code", description: "Opens in your terminal. Requires the Linear desktop app.", learnMore: true, enabled: true },
  { id: "codex-cli", name: "Codex CLI", description: "Opens in your terminal. Requires the Linear desktop app.", learnMore: true },
  { id: "codex-desktop", name: "Codex desktop", description: "Opens in the Codex desktop app.", enabled: true },
  { id: "conductor", name: "Conductor", description: "Opens in the Conductor desktop app." },
  { id: "cursor", name: "Cursor", description: "Opens in the Cursor desktop app." },
  { id: "devin", name: "Devin", description: "Opens on devin.ai." },
  { id: "factory", name: "Factory", description: "Opens in the Factory desktop app." },
  { id: "github-copilot", name: "GitHub Copilot", description: "Opens in VS Code." },
  { id: "lovable", name: "Lovable", description: "Opens on lovable.dev." },
  { id: "netlify", name: "Netlify Agent Runners", description: "Opens on netlify.com." },
  { id: "opencode", name: "OpenCode", description: "Opens in your terminal. Requires the Linear desktop app.", learnMore: true },
]

function CodingToolRow({ tool }: { tool: CodingTool }) {
  return (
    <div
      data-slot="linear-coding-tool-row"
      className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0"
    >
      <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted/30 font-mono text-xs text-muted-foreground">
        {tool.name.slice(0, 1)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{tool.name}</p>
        <p className="text-xs text-muted-foreground">
          {tool.description}
          {tool.learnMore ? (
            <span className="ml-1 font-medium text-foreground">Learn more ↗</span>
          ) : null}
        </p>
      </div>
      <Switch defaultChecked={tool.enabled} />
    </div>
  )
}

export default function PreferencesPage() {
  const { setTheme } = useTheme()

  React.useEffect(() => {
    setTheme("light")
  }, [setTheme])

  return (
    <SettingsShell title="Preferences" activeId="preferences" wide>
      <SettingsBackLink href="/settings">Preferences</SettingsBackLink>

      <div className="space-y-1">
        <h1 className="text-xl font-medium tracking-tight text-foreground">
          Coding tools
        </h1>
        <p className="text-sm text-muted-foreground">
          Tools enabled here can be used to work on issues from the issue page.{" "}
          <span className="font-medium text-foreground">Docs ↗</span>
        </p>
      </div>

      <SettingsFormGroup>
        {TOOLS.map((tool) => (
          <CodingToolRow key={tool.id} tool={tool} />
        ))}
      </SettingsFormGroup>
    </SettingsShell>
  )
}
