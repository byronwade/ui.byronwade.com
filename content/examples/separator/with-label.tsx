"use client"

import { Separator } from "@/components/ui/separator"

export default function Example() {
  return (
    <div className="w-80 space-y-6 p-4">
      {/* Centered label */}
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs font-medium text-muted-foreground">or</span>
        <Separator className="flex-1" />
      </div>

      {/* Left-aligned label */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          Continue with
        </span>
        <Separator className="flex-1" />
      </div>

      {/* Right-aligned label */}
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          see all
        </span>
      </div>
    </div>
  )
}
