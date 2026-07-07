"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { CheckCircle2, Tag, Users } from "lucide-react"

import {
  SettingsBackLink,
  SettingsFormGroup,
  SettingsIconRow,
  SettingsPageIntro,
  SettingsShell,
} from "@/components/linear/settings-shell"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function AsMobbinSetParentPage() {
  const router = useRouter()
  const { setTheme } = useTheme()
  const [inheritStatuses, setInheritStatuses] = React.useState(true)

  React.useEffect(() => {
    setTheme("light")
  }, [setTheme])

  return (
    <SettingsShell title="Set parent team" activeId="teams" wide>
      <SettingsBackLink href="/settings/teams/as-mobbin">AS Mobbin</SettingsBackLink>

      <SettingsPageIntro
        title="Set parent team"
        description={
          <>
            <span className="font-medium text-foreground">AS Mobbin</span> will
            become a sub-team of{" "}
            <span className="font-medium text-foreground">SLMobbin</span>,
            inheriting workflows and settings from SLMobbin. SLMobbin will
            include issues, projects, and members from AS Mobbin in its views.
          </>
        }
      />

      <SettingsFormGroup>
        <SettingsIconRow
          icon={<CheckCircle2 className="size-4" />}
          title="Inherit statuses from SLMobbin"
          description="Sub-teams can opt to inherit statuses from SLMobbin."
          trailing={
            <Switch
              checked={inheritStatuses}
              onCheckedChange={setInheritStatuses}
            />
          }
        />
        <SettingsIconRow
          title={
            inheritStatuses
              ? "Issue statuses will be inherited"
              : "Issue statuses will not change"
          }
          description="No immediate change, issue statuses already match."
          tone="muted"
        />
        <SettingsIconRow
          icon={<Tag className="size-4" />}
          title="Labels will be inherited from SLMobbin"
          description="Sub-teams can use labels from SLMobbin."
        />
        <SettingsIconRow
          icon={<Users className="size-4" />}
          title="New members will automatically be added to SLMobbin"
          description="No immediate change, all sub-team members are already on SLMobbin."
        />
      </SettingsFormGroup>

      <div className="flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/settings/teams/as-mobbin")}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={() => {
            toast.success("Parent team set", {
              description: "AS Mobbin is now a sub-team of SLMobbin.",
            })
            router.push("/settings/teams/as-mobbin")
          }}
        >
          Set parent team
        </Button>
      </div>
    </SettingsShell>
  )
}
