"use client"

import { Separator } from "@/components/ui/separator"

const navItems = ["Dashboard", "Projects", "Team", "Billing"]
const footerItems = ["Help", "Sign out"]

export default function Example() {
  return (
    <div className="w-56 rounded-xl edge bg-card p-2 edge">
      {/* Main navigation group */}
      <div className="space-y-0.5">
        {navItems.map((item) => (
          <button
            key={item}
            className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted transition-colors first:font-medium"
          >
            {item}
          </button>
        ))}
      </div>

      <Separator className="my-2" />

      {/* Footer navigation group */}
      <div className="space-y-0.5">
        {footerItems.map((item) => (
          <button
            key={item}
            className="w-full rounded-md px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted transition-colors"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}
