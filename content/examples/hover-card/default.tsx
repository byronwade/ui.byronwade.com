"use client"

import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card"

export default function Example() {
  return (
    <div className="flex items-center justify-center p-16">
      <HoverCard>
        <HoverCardTrigger className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors cursor-pointer">
          @alexchen
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
              AC
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold leading-none">Alex Chen</p>
              <p className="text-xs text-muted-foreground">@alexchen</p>
              <p className="text-xs text-muted-foreground pt-1">
                Designer & developer. Crafting digital products since 2015.
              </p>
              <p className="text-xs text-muted-foreground">
                Joined{" "}
                <span className="font-medium text-foreground">
                  January 2023
                </span>
              </p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}
