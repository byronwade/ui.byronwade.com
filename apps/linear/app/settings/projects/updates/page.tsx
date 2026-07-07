"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { ExternalLink, Info } from "lucide-react"

import {
  SettingsFormCard,
  SettingsPageIntro,
  SettingsSection,
  SettingsShell,
} from "@/components/linear/settings-shell"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ProjectUpdatesPage() {
  const { setTheme } = useTheme()
  const [cadence, setCadence] = React.useState("none")
  const [dirty, setDirty] = React.useState(false)

  React.useEffect(() => {
    setTheme("light")
  }, [setTheme])

  return (
    <SettingsShell title="Project updates" activeId="project-updates">
      <SettingsPageIntro
        title="Project updates"
        description={
          <>
            Keep stakeholders aligned with recurring project health updates.{" "}
            <Link
              href="https://linear.app/docs/project-updates"
              className="inline-flex items-center gap-0.5 underline-offset-2 hover:underline"
            >
              Docs
              <ExternalLink className="size-3" />
            </Link>
          </>
        }
      />

      <SettingsSection
        title="Update schedule"
        description="Set expectations for when project leads should post updates."
      >
        <SettingsFormCard
          footer={
            dirty ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => setDirty(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={() => setDirty(false)}>
                  Save
                </Button>
              </>
            ) : null
          }
        >
          <div
            data-slot="linear-update-schedule"
            className="flex flex-wrap items-center gap-2 text-sm"
          >
            <Select
              value={cadence}
              onValueChange={(value) => {
                if (!value) return
                setCadence(value)
                setDirty(true)
              }}
            >
              <SelectTrigger className="h-8 w-auto min-w-[220px]">
                <SelectValue placeholder="Cadence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No expectation for updates</SelectItem>
                <SelectItem value="weekly">Every week</SelectItem>
                <SelectItem value="biweekly">Every 2 weeks</SelectItem>
                <SelectItem value="monthly">Every month</SelectItem>
              </SelectContent>
            </Select>

            {cadence === "biweekly" ? (
              <>
                <span className="text-muted-foreground">on</span>
                <Select defaultValue="friday">
                  <SelectTrigger className="h-8 w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friday">Friday</SelectItem>
                    <SelectItem value="monday">Monday</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-muted-foreground">between</span>
                <Select defaultValue="2-3">
                  <SelectTrigger className="h-8 w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2-3">2PM – 3PM</SelectItem>
                    <SelectItem value="9-10">9AM – 10AM</SelectItem>
                  </SelectContent>
                </Select>
              </>
            ) : null}
          </div>
        </SettingsFormCard>
      </SettingsSection>

      <SettingsSection
        title="Slack notifications"
        description="Send project updates to a Slack channel when they are published."
      >
        <SettingsFormCard>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Send project updates to a Slack channel</p>
              <p className="text-xs text-muted-foreground">
                Connect a channel to send all project updates to.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Info className="size-4 text-muted-foreground" />
              <Button variant="ghost" size="sm" className="gap-1">
                Connect
                <ExternalLink className="size-3" />
              </Button>
            </div>
          </div>
        </SettingsFormCard>
      </SettingsSection>
    </SettingsShell>
  )
}
