"use client"

import { Separator } from "@/components/ui/separator"

export default function Example() {
  return (
    <div className="w-72 space-y-8 p-4">
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Default</p>
        <Separator />
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Thicker (2px)</p>
        <Separator className="h-0.5" />
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Accent color</p>
        <Separator className="bg-primary" />
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Destructive color</p>
        <Separator className="bg-destructive" />
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Soft muted divider</p>
        <Separator className="bg-muted" />
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          Centered short (50% width)
        </p>
        <Separator className="mx-auto w-1/2" />
      </div>
    </div>
  )
}
