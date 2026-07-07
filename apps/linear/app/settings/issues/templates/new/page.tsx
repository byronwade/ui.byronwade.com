"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  CircleDashed,
  Ellipsis,
  Palette,
  Signal,
  Tag,
  User,
} from "lucide-react"

import {
  SettingsBackLink,
  SettingsFormCard,
  SettingsShell,
} from "@/components/linear/settings-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

const TEMPLATE_BODY = `[UI/UX] - <Feature or Page Name>

Context
Why do we need this design? What is the user's primary goal?

Deliverables Required
☐ Wireframes or low-fidelity flows
☐ High-fidelity mockups
☐ Prototype link

Copy & Localization
☐ Final copy provided
☐ Strings ready for localization

Acceptance Criteria
☐ Matches design system tokens
☐ Responsive breakpoints documented
☐ Accessibility review complete`

export default function NewIssueTemplatePage() {
  const { setTheme } = useTheme()
  const router = useRouter()

  React.useEffect(() => {
    setTheme("light")
  }, [setTheme])

  return (
    <SettingsShell title="Issue templates" activeId="issue-templates" wide>
      <SettingsBackLink href="/settings/issues/templates">
        Issue templates
      </SettingsBackLink>

      <div className="flex items-start gap-3">
        <Palette className="mt-1 size-5 text-muted-foreground" />
        <div className="min-w-0 flex-1 space-y-1">
          <h1
            data-slot="linear-settings-page-title"
            className="text-xl font-medium tracking-tight"
          >
            UI/UX Design Request
          </h1>
          <p className="text-sm text-muted-foreground">
            Request design support for a feature, page, or workflow change.
          </p>
        </div>
      </div>

      <SettingsFormCard
        footer={
          <>
            <Button
              variant="ghost"
              size="sm"
              render={<Link href="/settings/issues/templates" />}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={() => router.push("/settings/issues/templates")}>
              Create
            </Button>
          </>
        }
      >
        <Textarea
          data-slot="linear-template-editor"
          defaultValue={TEMPLATE_BODY}
          className="min-h-[360px] resize-none border-0 bg-transparent p-0 font-sans text-sm leading-relaxed shadow-none focus-visible:ring-0"
        />

        <div className="mt-6 space-y-2">
          <p className="text-sm font-medium">Default properties</p>
          <p className="text-xs text-muted-foreground">
            Automatically applied upon issue creation, and editable when composing
            within Linear.
          </p>
          <div
            data-slot="linear-template-property-bar"
            className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2"
          >
            <Badge variant="outline" className="gap-1 font-normal">
              AS Mobbin
            </Badge>
            <Badge variant="outline" className="gap-1 font-normal">
              <CircleDashed className="size-3" />
              Backlog
            </Badge>
            <Badge variant="outline" className="gap-1 font-normal">
              <span className="size-2 rounded-full bg-brand" />
              UX
            </Badge>
            <Badge variant="outline" className="gap-1 font-normal">
              <Signal className="size-3" />
              Medium
            </Badge>
            <Badge variant="outline" className="gap-1 font-normal">
              <User className="size-3" />
              Assignee
            </Badge>
            <Badge variant="outline" className="gap-1 font-normal">
              <Tag className="size-3" />
              User Insight & Beh…
            </Badge>
            <button
              type="button"
              className="inline-flex size-7 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted/30"
            >
              <Ellipsis className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium">Acceptance Criteria</p>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox defaultChecked />
            Matches design system tokens
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox />
            Responsive breakpoints documented
          </label>
        </div>
      </SettingsFormCard>
    </SettingsShell>
  )
}
