"use client"

import { Separator } from "@/components/ui/separator"

export default function Example() {
  return (
    <div className="w-64 space-y-4 p-4">
      <p className="text-sm font-medium">Section A</p>
      <Separator />
      <p className="text-sm font-medium">Section B</p>
      <div className="flex h-8 items-center gap-4">
        <span className="text-sm">Left</span>
        <Separator orientation="vertical" />
        <span className="text-sm">Right</span>
      </div>
    </div>
  )
}
