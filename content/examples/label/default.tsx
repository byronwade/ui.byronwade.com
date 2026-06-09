"use client"

import { Label } from "@/components/ui/label"

export default function Example() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-sm w-full">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="full-name">Full name</Label>
        <input
          id="full-name"
          type="text"
          placeholder="Jane Smith"
          className="rounded-md edge px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email address</Label>
        <input
          id="email"
          type="email"
          placeholder="jane@example.com"
          className="rounded-md edge px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          placeholder="Tell us a little about yourself…"
          rows={3}
          className="rounded-md edge px-3 py-2 text-sm resize-none"
        />
      </div>
    </div>
  )
}
