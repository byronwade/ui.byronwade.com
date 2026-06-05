"use client";

import { Files, Search, GitBranch, Bug } from "lucide-react";
import { MorphRail } from "@/components/ui/morph-rail";

export default function Example() {
  return (
    <div className="flex h-80 overflow-hidden rounded-xl edge">
      <div className="flex-1 bg-background" />
      <MorphRail
        items={[
          { id: "files", label: "Files", icon: Files, panel: <p className="text-[13px] text-muted-foreground">Explorer tree…</p> },
          { id: "search", label: "Search", icon: Search, panel: <p className="text-[13px] text-muted-foreground">Search results…</p> },
          { id: "git", label: "Source Control", icon: GitBranch, panel: <p className="text-[13px] text-muted-foreground">Changes…</p> },
          { id: "debug", label: "Run & Debug", icon: Bug, panel: <p className="text-[13px] text-muted-foreground">Breakpoints…</p> },
        ]}
      />
    </div>
  );
}
