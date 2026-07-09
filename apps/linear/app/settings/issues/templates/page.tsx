"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CircleDashed, Ellipsis, ExternalLink, Palette } from "lucide-react"

import {
  SettingsPageIntro,
  SettingsShell,
} from "@/components/linear/settings-shell"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function IssueTemplatesPage() {
  const router = useRouter()
  const [chooserOpen, setChooserOpen] = React.useState(false)

  return (
    <SettingsShell title="Issue templates" activeId="issue-templates" wide>
      <SettingsPageIntro
        title="Issue templates"
        description={
          <>
            Pre-fill issue fields and descriptions for repeatable workflows.{" "}
            <Link
              href="https://linear.app/docs/issue-templates"
              className="inline-flex items-center gap-0.5 underline-offset-2 hover:underline"
            >
              Docs
              <ExternalLink className="size-3" />
            </Link>
          </>
        }
      />

      <div className="flex justify-end">
        <Button size="sm" onClick={() => setChooserOpen(true)}>
          New template
        </Button>
      </div>

      <div
        data-slot="linear-settings-table"
        className="overflow-hidden rounded-lg border border-border bg-card"
      >
        <button
          type="button"
          className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/30"
          onClick={() => router.push("/settings/issues/templates/new")}
        >
          <Palette className="size-4 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">UI/UX Design Request</p>
            <p className="text-xs text-muted-foreground">
              Standard issue · Updated 2 days ago
            </p>
          </div>
          <span className="text-xs text-muted-foreground">Edit</span>
        </button>
      </div>

      <Dialog open={chooserOpen} onOpenChange={setChooserOpen}>
        <DialogContent
          data-slot="linear-template-chooser"
          className="max-w-2xl gap-0 p-0"
          showCloseButton
        >
          <DialogHeader className="border-b border-border px-6 py-4">
            <DialogTitle className="text-base font-medium">
              What kind of template would you like to create?
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <button
              type="button"
              className="rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-muted/20"
              onClick={() => {
                setChooserOpen(false)
                router.push("/settings/issues/templates/new")
              }}
            >
              <p className="text-sm font-medium">Standard issue</p>
              <p className="mt-1 text-xs text-muted-foreground">
                For team members creating issues within Linear
              </p>
              <div
                data-slot="linear-template-preview"
                className="mt-4 space-y-2 rounded-md border border-border bg-muted/20 p-3"
              >
                <p className="text-sm font-medium">Issue title</p>
                <p className="text-xs text-muted-foreground">Add description…</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                    <CircleDashed className="size-3" />
                    Backlog
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                    Priority
                  </span>
                  <span className="inline-flex size-6 items-center justify-center rounded-full border border-border">
                    <Ellipsis className="size-3.5" />
                  </span>
                </div>
              </div>
            </button>

            <button
              type="button"
              className="rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-muted/20"
              onClick={() => setChooserOpen(false)}
            >
              <p className="text-sm font-medium">Asks Web Forms</p>
              <p className="mt-1 text-xs text-muted-foreground">
                For capturing Asks and external structured requests
              </p>
              <div
                data-slot="linear-template-preview"
                className="mt-4 space-y-3 rounded-md border border-border bg-muted/20 p-3"
              >
                <div className="space-y-1">
                  <p className="text-xs font-medium">Device</p>
                  <Input placeholder="Enter text" className="h-8 bg-background" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium">Department</p>
                  <div className="flex h-8 items-center justify-between rounded-md border border-border bg-background px-3 text-xs text-muted-foreground">
                    Select an option
                  </div>
                </div>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </SettingsShell>
  )
}
