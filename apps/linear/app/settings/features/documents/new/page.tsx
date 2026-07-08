"use client"

import * as React from "react"
import Link from "next/link"
import { FilePlus2 } from "lucide-react"

import {
  SettingsBackLink,
  SettingsPageIntro,
  SettingsShell,
} from "@/components/linear/settings-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function NewDocumentTemplatePage() {
  const [title, setTitle] = React.useState("")
  const [body, setBody] = React.useState("")

  return (
    <SettingsShell title="New document template" activeId="documents" wide>
      <SettingsBackLink href="/settings/features/documents">
        Documents
      </SettingsBackLink>

      <SettingsPageIntro title="New document template" />

      <div
        data-slot="linear-document-template"
        className="space-y-6 border-t border-border pt-6"
      >
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-muted/30 text-muted-foreground"
          aria-label="Choose icon"
        >
          <FilePlus2 className="size-5" />
        </button>

        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Template name"
          className="h-auto border-0 bg-transparent px-0 text-xl font-medium shadow-none focus-visible:ring-0"
        />

        <Textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Click here to start writing…"
          data-slot="linear-template-editor"
          className="min-h-[320px] resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" render={<Link href="/settings/features/documents" />}>
            Cancel
          </Button>
          <Button size="sm">Create</Button>
        </div>
      </div>
    </SettingsShell>
  )
}
