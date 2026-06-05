"use client"

import { Home, Search, Bell, User } from "lucide-react"
import { MorphTabs } from "@/components/ui/morph-tabs"

export default function Example() {
  return (
    <div className="relative h-96 w-full max-w-sm overflow-hidden rounded-xl edge bg-background">
      <div className="space-y-3 p-5 pb-20">
        <div className="h-7 w-32 rounded-md bg-muted" />
        <div className="h-28 rounded-lg border border-border bg-card" />
        <div className="h-16 rounded-lg border border-border bg-card" />
        <div className="h-16 rounded-lg border border-border bg-card" />
      </div>
      <div className="absolute inset-x-0 bottom-0">
        <MorphTabs
          items={[
            { id: "home", label: "Home", icon: Home, active: true },
            { id: "search", label: "Search", icon: Search },
            { id: "alerts", label: "Alerts", icon: Bell },
            { id: "you", label: "You", icon: User },
          ]}
          sheet={
            <div className="space-y-2">
              <p className="text-sm font-medium tracking-tight">
                Quick actions
              </p>
              <p className="text-[13px] text-muted-foreground">
                Pull up the sheet for more.
              </p>
            </div>
          }
        />
      </div>
    </div>
  )
}
