"use client"

import { Files, Search, GitBranch, Bug } from "lucide-react"
import { MorphRail } from "@/components/ui/morph-rail"

export default function Example() {
  return (
    // App-shell frame: the rail sits flush right (last in the flex row) and
    // blooms WIDER, growing leftward as the content reflows.
    <div className="flex h-80 w-full overflow-hidden rounded-xl edge bg-background">
      <div className="min-w-0 flex-1 space-y-3 overflow-auto p-5">
        <div className="h-7 w-40 rounded-md bg-muted" />
        <div className="h-28 rounded-lg bg-muted/60" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-20 rounded-lg bg-muted/60" />
          <div className="h-20 rounded-lg bg-muted/60" />
        </div>
      </div>
      <MorphRail
        items={[
          {
            id: "files",
            label: "Files",
            icon: Files,
            panel: (
              <p className="text-[13px] text-muted-foreground">
                Explorer tree…
              </p>
            ),
          },
          {
            id: "search",
            label: "Search",
            icon: Search,
            panel: (
              <p className="text-[13px] text-muted-foreground">
                Search results…
              </p>
            ),
          },
          {
            id: "git",
            label: "Source Control",
            icon: GitBranch,
            panel: (
              <p className="text-[13px] text-muted-foreground">Changes…</p>
            ),
          },
          {
            id: "debug",
            label: "Run & Debug",
            icon: Bug,
            panel: (
              <p className="text-[13px] text-muted-foreground">Breakpoints…</p>
            ),
          },
        ]}
      />
    </div>
  )
}
