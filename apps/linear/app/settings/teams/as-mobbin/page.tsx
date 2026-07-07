"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Bot,
  CalendarClock,
  CheckCircle2,
  CircleDot,
  FileText,
  Globe,
  MessageSquareText,
  Settings,
  Shield,
  Tag,
  Target,
  Users,
} from "lucide-react"

import {
  SettingsBackLink,
  SettingsFieldRow,
  SettingsFormGroup,
  SettingsList,
  SettingsMetaRow,
  SettingsSection,
  SettingsShell,
  SettingsTeamHeader,
} from "@/components/linear/settings-shell"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AsMobbinTeamSettingsPage() {
  const router = useRouter()
  const { setTheme } = useTheme()
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [confirm, setConfirm] = React.useState("")

  React.useEffect(() => {
    setTheme("light")
  }, [setTheme])

  return (
    <SettingsShell title="AS Mobbin" activeId="teams">
      <SettingsBackLink href="/settings/teams">Teams</SettingsBackLink>

      <div className="space-y-1">
        <SettingsTeamHeader icon={<Globe className="size-5 text-brand" />} title="AS Mobbin" />
        <p className="text-sm text-muted-foreground">Owned by you</p>
      </div>

      <SettingsSection title="">
        <SettingsList>
          <SettingsMetaRow
            icon={<Settings />}
            title="General"
            description="Name, identifier, timezone, estimates, and broader settings."
            href="/settings/teams/as-mobbin/general"
          />
          <SettingsMetaRow
            icon={<Shield />}
            title="Access and permissions"
            description="Manage team access and who in the team can take certain actions."
            href="/settings/teams/as-mobbin/access"
          />
          <SettingsMetaRow
            icon={<Users />}
            title="Members"
            description="Manage team members."
            meta="1 member"
          />
          <SettingsMetaRow
            icon={<Shield />}
            title="Slack notifications"
            description="Broadcast notifications to Slack."
            meta="Off"
          />
        </SettingsList>
      </SettingsSection>

      <SettingsSection title="Issues, projects, and docs">
        <SettingsList>
          <SettingsMetaRow
            icon={<Tag />}
            title="Issue labels"
            description="Labels available to this team's issues."
            meta="5 labels"
          />
          <SettingsMetaRow
            icon={<FileText />}
            title="Templates"
            description="Pre-filled templates for issues, documents, and projects."
            meta="1 template"
          />
          <SettingsMetaRow
            icon={<CalendarClock />}
            title="Recurring issues"
            description="Automatically create issues on a schedule."
            meta="None"
          />
        </SettingsList>
      </SettingsSection>

      <SettingsSection title="Workflow">
        <SettingsList>
          <SettingsMetaRow
            icon={<CheckCircle2 />}
            title="Issue statuses"
            description="Customize the statuses issues go through."
            meta="6 statuses"
          />
          <SettingsMetaRow
            icon={<Settings />}
            title="Workflows & automations"
            description="Manage issue automations, git workflows and other workflows."
          />
          <SettingsMetaRow
            icon={<Target />}
            title="Triage"
            description="Streamline how you handle requests from outside your team."
            meta="Off"
          />
          <SettingsMetaRow
            icon={<CircleDot />}
            title="Cycles"
            description="Focus your team over short, time-boxed windows."
            meta="Every 4 weeks, 1 week cooldown"
            href="/settings/teams/as-mobbin/cycles"
          />
        </SettingsList>
      </SettingsSection>

      <SettingsSection title="AI">
        <SettingsList>
          <SettingsMetaRow
            icon={<Bot />}
            title="Agents"
            description="Add guidance for how agents should operate within this team."
          />
          <SettingsMetaRow
            icon={<MessageSquareText />}
            title="Discussion summaries"
            description="Automatically generate summaries for issues and comments."
          />
        </SettingsList>
      </SettingsSection>

      <SettingsSection
        title="Team hierarchy"
        description={
          <>
            Teams can be nested to reflect your team structure and to share
            workflows and settings.{" "}
            <span className="text-brand">Docs ↗</span>
          </>
        }
      >
        <SettingsFormGroup>
          <SettingsFieldRow label="Parent team">
            <Select
              defaultValue="none"
              onValueChange={(value) => {
                if (value && value !== "none") {
                  router.push("/settings/teams/as-mobbin/parent")
                }
              }}
            >
              <SelectTrigger className="h-8 w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No parent team</SelectItem>
                <SelectItem value="slmobbin">SLMobbin</SelectItem>
                <SelectItem value="backend">Backend</SelectItem>
                <SelectItem value="engineering">Engineering Team</SelectItem>
              </SelectContent>
            </Select>
          </SettingsFieldRow>
        </SettingsFormGroup>
      </SettingsSection>

      <SettingsSection title="Danger zone">
        <SettingsFormGroup>
          <SettingsFieldRow
            label="Leave team"
            description="Remove yourself as a member of this team."
          >
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Leave team…
            </Button>
          </SettingsFieldRow>
          <SettingsFieldRow
            label="Retire team"
            description="Prevent creating and updating issues in this team while preserving all historical data."
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              render={<Link href="/settings/teams/as-mobbin/retire">Retire…</Link>}
            />
          </SettingsFieldRow>
          <SettingsFieldRow
            label="Delete team"
            description="Permanently delete this team and all its data, with a 30-day restoration window."
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              Delete…
            </Button>
          </SettingsFieldRow>
        </SettingsFormGroup>
      </SettingsSection>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent
          data-slot="linear-team-delete-dialog"
          className="max-w-md"
        >
          <DialogHeader>
            <DialogTitle>Delete the AS Mobbin team?</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              This team, including its data below, will be permanently deleted.
              For the next 30 days you&apos;ll be able to restore it from{" "}
              <span className="font-medium text-foreground">Settings &rsaquo; Teams</span>.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>30 issues</li>
              <li>3 projects</li>
              <li>1 template</li>
              <li>1 document</li>
            </ul>
            <p>
              To confirm, type{" "}
              <span className="font-medium text-foreground">AS Mobbin</span> below:
            </p>
            <Input
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              className="h-8"
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
              variant="destructive"
              size="sm"
              disabled={confirm !== "AS Mobbin"}
              onClick={() => {
                setDeleteOpen(false)
                router.push("/settings/teams")
              }}
            >
              Delete team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SettingsShell>
  )
}
