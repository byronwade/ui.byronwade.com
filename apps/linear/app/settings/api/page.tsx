"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Copy, MoreHorizontal } from "lucide-react"

import {
  SettingsBackLink,
  SettingsFormCard,
  SettingsPageIntro,
  SettingsShell,
} from "@/components/linear/settings-shell"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const API_KEY = "lin_api_7f3k9m2p8q1r4s6t0u5v8w2x4y6z8a1b"

export default function ApiKeyDetailPage() {

  const copyKey = React.useCallback(async () => {
    await navigator.clipboard.writeText(API_KEY)
    toast.success("Personal API key copied to clipboard", {
      description:
        "Store this key securely. You won't be able to view it again after leaving this page.",
    })
  }, [])

  return (
    <SettingsShell title="API Key" activeId="api">
      <SettingsBackLink href="/settings/security">Security settings</SettingsBackLink>

      <div className="flex items-start justify-between gap-3">
        <SettingsPageIntro
          title="API Key"
          description="Created Apr 6, 2026"
        />
        <Button variant="ghost" size="icon-sm" aria-label="More actions">
          <MoreHorizontal className="size-4" />
        </Button>
      </div>

      <SettingsFormCard>
        <div className="space-y-6">
          <div className="space-y-1">
            <p className="text-sm font-medium">Key name</p>
            <p className="text-sm text-muted-foreground">API Key</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">API key</p>
            <div className="flex items-center gap-2">
              <code data-slot="linear-api-key-value" className="font-mono text-sm">
                {API_KEY}
              </code>
              <Button variant="ghost" size="icon-sm" onClick={copyKey} aria-label="Copy API key">
                <Copy className="size-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This API key will not be visible in the future. Please copy it now.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Permissions</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Read</span> — Read
                access to workspace data
              </p>
              <p>
                <span className="font-medium text-foreground">Write</span> — Create
                and update issues, comments, and projects
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Team access</p>
            <div className="flex items-center gap-2">
              <Avatar className="size-6">
                <AvatarFallback className="text-[10px]">AS</AvatarFallback>
              </Avatar>
              <span className="text-sm">Mobbin</span>
            </div>
          </div>
        </div>
      </SettingsFormCard>

      <p className="text-xs text-muted-foreground">
        Need a new key?{" "}
        <Link href="/settings/api/create" className="underline-offset-2 hover:underline">
          Create API key
        </Link>
      </p>
    </SettingsShell>
  )
}
