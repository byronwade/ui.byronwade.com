"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { CircleDot, FolderKanban, RefreshCcw } from "lucide-react"

import {
  SettingsBackLink,
  SettingsFormGroup,
  SettingsIconRow,
  SettingsPageIntro,
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

export default function AsMobbinRetirePage() {
  const router = useRouter()

  return (
    <SettingsShell title="Retire team" activeId="as-mobbin" wide>
      <SettingsBackLink href="/settings/teams/as-mobbin">AS Mobbin</SettingsBackLink>

      <SettingsPageIntro
        title="Retire team"
        description="Retiring a team prevents new issues from being created and existing issues from being edited. All issues and their history are preserved, and the team can be restored at any time."
      />

      <SettingsFormGroup>
        <SettingsIconRow
          icon={<CircleDot className="size-4" />}
          title="13 issues will be canceled"
          description="Cancel active and backlog issues, or move them to another team."
          trailing={
            <Select defaultValue="cancel">
              <SelectTrigger className="h-8 w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cancel">Cancel issues</SelectItem>
                <SelectItem value="move">Move to another team</SelectItem>
              </SelectContent>
            </Select>
          }
        />
        <SettingsIconRow
          icon={<FolderKanban className="size-4" />}
          title="3 projects will become read-only"
          description="Projects shared with other active teams will not be affected."
        />
        <SettingsIconRow
          icon={<RefreshCcw className="size-4" />}
          title="Cycles will be disabled"
          description="Cycles will be disabled for this team."
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
          variant="destructive"
          size="sm"
          onClick={() => {
            toast.success("ASMobbin retired", {
              description: "Successfully canceled 5 issues",
            })
            router.push("/settings/teams")
          }}
        >
          Retire team
        </Button>
      </div>
    </SettingsShell>
  )
}
