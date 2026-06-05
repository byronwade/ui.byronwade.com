"use client"

import { Label } from "@/components/ui/label"

export default function Example() {
  return (
    <div className="flex flex-col gap-8 p-6 max-w-lg w-full">
      {/* Stacked layout (default) */}
      <section className="flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Stacked
        </p>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="stacked-name">Display name</Label>
          <input
            id="stacked-name"
            type="text"
            placeholder="Jane Smith"
            className="rounded-md border px-3 py-2 text-sm"
          />
          <p className="text-xs text-muted-foreground">
            This is the name others will see.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="stacked-handle">Handle</Label>
          <input
            id="stacked-handle"
            type="text"
            placeholder="@janesmith"
            className="rounded-md border px-3 py-2 text-sm"
          />
        </div>
      </section>

      {/* Inline / horizontal layout */}
      <section className="flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Inline
        </p>
        <div className="flex items-center gap-4">
          <Label htmlFor="inline-country" className="w-28 shrink-0 text-right">
            Country
          </Label>
          <input
            id="inline-country"
            type="text"
            placeholder="United States"
            className="flex-1 rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-center gap-4">
          <Label htmlFor="inline-city" className="w-28 shrink-0 text-right">
            City
          </Label>
          <input
            id="inline-city"
            type="text"
            placeholder="New York"
            className="flex-1 rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-center gap-4">
          <Label htmlFor="inline-zip" className="w-28 shrink-0 text-right">
            Postal code
          </Label>
          <input
            id="inline-zip"
            type="text"
            placeholder="10001"
            className="flex-1 rounded-md border px-3 py-2 text-sm"
          />
        </div>
      </section>
    </div>
  )
}
