"use client"

import * as React from "react"
import { Search, ArrowRight, Copy, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Example() {
  const [query, setQuery] = React.useState("")
  const [invite, setInvite] = React.useState("")
  const [copied, setCopied] = React.useState(false)
  const shareUrl = "https://example.com/share/abc123"

  function handleCopy() {
    void navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-5 p-6 max-w-sm w-full">
      {/* Search with inline button */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search items…"
            className="pl-8"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button type="submit" size="sm">
          Go
          <ArrowRight className="size-3" />
        </Button>
      </div>

      {/* Invite by email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Invite team member</label>
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="colleague@company.com"
            value={invite}
            onChange={(e) => setInvite(e.target.value)}
            className="flex-1"
          />
          <Button type="button" variant="outline" size="sm" disabled={!invite}>
            Invite
          </Button>
        </div>
      </div>

      {/* Copy-to-clipboard */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Share link</label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 font-mono text-xs"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleCopy}
            aria-label="Copy link"
          >
            {copied ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
