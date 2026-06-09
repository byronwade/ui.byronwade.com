"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"

export default function Example() {
  const [maintenance, setMaintenance] = useState(false)

  return (
    <div className="flex flex-col gap-6 p-6 max-w-sm mx-auto">
      <div
        className={`rounded-lg edge p-4 transition-colors ${
          maintenance
            ? "border-warning/30 bg-warning/10"
            : "border-border bg-card"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Maintenance mode</p>
            <p className="text-xs text-muted-foreground">
              Temporarily disable public access
            </p>
          </div>
          <Switch
            checked={maintenance}
            onCheckedChange={setMaintenance}
            aria-label="Toggle maintenance mode"
          />
        </div>
        {maintenance && (
          <p className="mt-3 text-xs text-warning font-medium">
            Site is now in maintenance mode. Visitors will see a downtime page.
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <button
          className="flex-1 rounded-full edge text-sm px-4 py-2 hover:bg-muted transition-colors"
          onClick={() => setMaintenance(false)}
        >
          Turn off
        </button>
        <button
          className="flex-1 rounded-full bg-primary text-primary-foreground text-sm px-4 py-2 hover:bg-primary/90 transition-colors"
          onClick={() => setMaintenance(true)}
        >
          Turn on
        </button>
      </div>
    </div>
  )
}
