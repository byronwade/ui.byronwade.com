"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Plus } from "lucide-react"

import {
  SettingsFormCard,
  SettingsPageIntro,
  SettingsSection,
  SettingsShell,
} from "@/components/linear/settings-shell"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const GUIDANCE = `1. Accurate Categorization: Instantly identify the type of work (bug, feature, chore) and apply the correct labels and priority.

2. Complete Context: Every issue description should include:
   • What happened or what is needed
   • Steps to reproduce (for bugs)
   • Expected vs actual behavior
   • Relevant links or screenshots

3. Actionable Titles: Write titles that describe the outcome, not the activity. Prefer "Fix login redirect loop" over "Investigate login issue."

4. Respect Team Conventions: Match existing label taxonomy, cycle boundaries, and project structure before creating new categories.`

export default function AgentPersonalizationPage() {
  const { setTheme } = useTheme()

  React.useEffect(() => {
    setTheme("light")
  }, [setTheme])

  return (
    <SettingsShell title="Agent personalization" activeId="agent">
      <SettingsPageIntro
        title="Agent personalization"
        description="Personal settings for Linear Agent."
      />

      <SettingsSection
        title="Guidance"
        description="Instructions the agent follows when creating or updating issues on your behalf."
      >
        <SettingsFormCard>
          <Textarea
            data-slot="linear-agent-guidance"
            defaultValue={GUIDANCE}
            className="min-h-[280px] resize-none border-0 bg-transparent p-0 text-sm leading-relaxed shadow-none focus-visible:ring-0"
          />
        </SettingsFormCard>
        <p className="text-xs text-muted-foreground">Last edited just now</p>
      </SettingsSection>

      <SettingsSection
        title="Skills"
        description="Reusable workflows the agent can run when triggered from issues or comments."
      >
        <SettingsFormCard className="border-dashed">
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              You haven&apos;t added any skills yet.
            </p>
            <Button variant="outline" size="sm" render={<Link href="/settings/agent/skills/new" />}>
              <Plus className="size-4" />
              Create skill
            </Button>
          </div>
        </SettingsFormCard>

        <SettingsFormCard className="mt-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-medium">
                Scaffold AI Agent Specification &amp; Dataset
              </p>
              <p className="text-xs text-muted-foreground">Created just now</p>
            </div>
            <Button variant="ghost" size="icon-sm" render={<Link href="/settings/agent/skills/new" />}>
              <Plus className="size-4" />
            </Button>
          </div>
        </SettingsFormCard>
      </SettingsSection>
    </SettingsShell>
  )
}
