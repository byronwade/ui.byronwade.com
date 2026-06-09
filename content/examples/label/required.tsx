"use client"

import { Label } from "@/components/ui/label"

export default function Example() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-sm w-full">
      {/* Required indicator via asterisk span */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="req-name">
          Full name
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        </Label>
        <input
          id="req-name"
          type="text"
          required
          placeholder="Jane Smith"
          className="rounded-md edge px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="req-email">
          Email address
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        </Label>
        <input
          id="req-email"
          type="email"
          required
          placeholder="jane@example.com"
          className="rounded-md edge px-3 py-2 text-sm"
        />
      </div>

      {/* Optional indicator */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="opt-website">
          Website
          <span className="text-muted-foreground font-normal text-xs ml-1">
            (optional)
          </span>
        </Label>
        <input
          id="opt-website"
          type="url"
          placeholder="https://example.com"
          className="rounded-md edge px-3 py-2 text-sm"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Fields marked with <span className="text-destructive">*</span> are
        required.
      </p>
    </div>
  )
}
