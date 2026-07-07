"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

import {
  SettingsBackLink,
  SettingsFormCard,
  SettingsPageIntro,
  SettingsShell,
} from "@/components/linear/settings-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function CreateSkillPage() {
  const { setTheme } = useTheme()
  const router = useRouter()
  const [name, setName] = React.useState("")

  React.useEffect(() => {
    setTheme("light")
  }, [setTheme])

  return (
    <SettingsShell title="Skill name" activeId="agent">
      <SettingsBackLink href="/settings/agent">Agent personalization</SettingsBackLink>

      <SettingsPageIntro title="Skill name" />

      <SettingsFormCard
        footer={
          <>
            <Button variant="ghost" size="sm" render={<Link href="/settings/agent" />}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!name.trim()}
              onClick={() => router.push("/settings/agent")}
            >
              Create
            </Button>
          </>
        }
      >
        <Input
          placeholder="Skill name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mb-3"
        />
        <Textarea
          placeholder="Add instructions…"
          className="min-h-[200px] resize-none"
        />
      </SettingsFormCard>
    </SettingsShell>
  )
}
