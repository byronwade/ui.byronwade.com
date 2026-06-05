"use client"

import { Separator } from "@/components/ui/separator"

export default function Example() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Inline content with vertical separators
        </p>
        <div className="flex h-10 items-center gap-3 text-sm">
          <span>Overview</span>
          <Separator orientation="vertical" />
          <span>Analytics</span>
          <Separator orientation="vertical" />
          <span>Reports</span>
          <Separator orientation="vertical" />
          <span>Settings</span>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Tall column split
        </p>
        <div className="flex h-20 items-start gap-4 text-sm">
          <div className="space-y-1">
            <p className="font-medium">Column A</p>
            <p className="text-muted-foreground">
              First piece of content here.
            </p>
          </div>
          <Separator orientation="vertical" />
          <div className="space-y-1">
            <p className="font-medium">Column B</p>
            <p className="text-muted-foreground">
              Second piece of content here.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
