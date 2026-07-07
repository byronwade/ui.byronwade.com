"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { CalendarDays } from "lucide-react"

import {
  SettingsBackLink,
  SettingsFieldRow,
  SettingsFormGroup,
  SettingsPageIntro,
  SettingsSection,
  SettingsShell,
  SettingsToggleRow,
} from "@/components/linear/settings-shell"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

export default function AsMobbinCyclesPage() {
  const { setTheme } = useTheme()
  const [enabled, setEnabled] = React.useState(true)
  const [startDate, setStartDate] = React.useState<Date | undefined>(
    new Date(2026, 3, 13)
  )
  const [pendingDate, setPendingDate] = React.useState<Date | undefined>(startDate)
  const [dateOpen, setDateOpen] = React.useState(false)

  React.useEffect(() => {
    setTheme("light")
  }, [setTheme])

  const startLabel = startDate ? WEEKDAYS[startDate.getDay()] : "Monday"
  const nextCycle = startDate
    ? startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "Apr 13"

  return (
    <SettingsShell title="Cycles" activeId="teams" wide>
      <SettingsBackLink href="/settings/teams/as-mobbin">AS Mobbin</SettingsBackLink>

      <SettingsPageIntro
        title="Cycles"
        description={
          <>
            Cycles create rhythm and focus with short, time-boxed planning
            windows. Automations can create future cycles, carry over unfinished
            work, and move issues in or out based on status.{" "}
            <span className="text-brand">Docs ↗</span>
          </>
        }
      />

      <SettingsFormGroup>
        <SettingsToggleRow
          title="Enable cycles"
          checked={enabled}
          onCheckedChange={setEnabled}
        />
      </SettingsFormGroup>

      {enabled ? (
        <>
          <SettingsFormGroup>
            <SettingsFieldRow label="Cycle duration">
              <Select defaultValue="4w">
                <SelectTrigger className="h-8 w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1w">1 week</SelectItem>
                  <SelectItem value="2w">2 weeks</SelectItem>
                  <SelectItem value="4w">4 weeks</SelectItem>
                </SelectContent>
              </Select>
            </SettingsFieldRow>
            <SettingsFieldRow label="Cooldown duration">
              <Select defaultValue="1w">
                <SelectTrigger className="h-8 w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No cooldown</SelectItem>
                  <SelectItem value="1w">1 week</SelectItem>
                  <SelectItem value="2w">2 weeks</SelectItem>
                </SelectContent>
              </Select>
            </SettingsFieldRow>
            <SettingsFieldRow
              label="Cycle start (Singapore Standard Time)"
              description={`Next cycle begins ${nextCycle}`}
            >
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  setPendingDate(startDate)
                  setDateOpen(true)
                }}
              >
                <CalendarDays className="size-3.5" />
                {startLabel}
              </Button>
            </SettingsFieldRow>
            <SettingsFieldRow label="Auto-create cycles">
              <Select defaultValue="2">
                <SelectTrigger className="h-8 w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 cycle</SelectItem>
                  <SelectItem value="2">2 cycles</SelectItem>
                  <SelectItem value="3">3 cycles</SelectItem>
                </SelectContent>
              </Select>
            </SettingsFieldRow>
          </SettingsFormGroup>

          <SettingsSection
            title="Cycle automation"
            description="Capture all work in cycles by auto-adding issues to cycles based on their status type."
          >
            <SettingsFormGroup>
              <SettingsToggleRow
                title="Active issues & due date"
                description="Auto-add started, unstarted, and issues with due dates that match the current cycle, or the next if in cooldown."
                defaultChecked={false}
              />
              <SettingsToggleRow
                title="Started issues"
                description="Auto-add started issues to the current cycle, or the next if in cooldown."
                defaultChecked
              />
              <SettingsToggleRow
                title="Completed issues"
                description="Auto-add completed issues to the current cycle, or the next if in cooldown."
                defaultChecked
              />
            </SettingsFormGroup>
          </SettingsSection>
        </>
      ) : null}

      <Dialog open={dateOpen} onOpenChange={setDateOpen}>
        <DialogContent
          data-slot="linear-cycle-date-dialog"
          className="max-w-xl"
        >
          <DialogHeader>
            <DialogTitle>Change your next cycle&apos;s start date</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Select a start date for your upcoming cycle. Future cycles will
              also begin on the same day of the week. Selecting today will start
              your first cycle immediately.
            </p>
            <p>Date selections are in your team&apos;s timezone (Singapore Standard Time).</p>
            <Calendar
              mode="single"
              numberOfMonths={2}
              defaultMonth={pendingDate ?? new Date(2026, 3, 1)}
              selected={pendingDate}
              onSelect={setPendingDate}
              className="rounded-lg border border-border"
            />
          </div>
          <DialogFooter>
            <DialogClose
              render={
                <Button variant="ghost" size="sm">
                  Cancel
                </Button>
              }
            />
            <Button
              size="sm"
              onClick={() => {
                if (pendingDate) setStartDate(pendingDate)
                setDateOpen(false)
                toast.success("Cycles enabled", {
                  description: "Cycles are now enabled for the team.",
                })
              }}
            >
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SettingsShell>
  )
}
