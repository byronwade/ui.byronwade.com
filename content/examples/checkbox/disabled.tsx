"use client"

import { Checkbox } from "@/components/ui/checkbox"

export default function Example() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <p className="text-sm font-medium text-muted-foreground mb-1">
        Disabled states
      </p>

      <label className="flex items-center gap-2 cursor-not-allowed opacity-50">
        <Checkbox disabled />
        <span className="text-sm">Disabled unchecked</span>
      </label>

      <label className="flex items-center gap-2 cursor-not-allowed opacity-50">
        <Checkbox disabled defaultChecked />
        <span className="text-sm">Disabled checked</span>
      </label>
    </div>
  )
}
