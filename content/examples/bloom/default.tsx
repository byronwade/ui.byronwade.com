"use client";

import { Sparkles } from "lucide-react";
import { Bloom } from "@/components/ui/bloom";

export default function Example() {
  return (
    <div className="flex min-h-[260px] items-end justify-center rounded-xl border border-border p-8">
      <Bloom
        tone="surface"
        defaultOpen={false}
        placement="top"
        bar={
          <span className="flex items-center gap-2">
            <Sparkles className="size-4" />
            Quick summary
          </span>
        }
      >
        <div className="w-full space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Activity overview</h4>
          <div className="space-y-2">
            {[
              { label: "Tasks completed", value: "24" },
              { label: "Open items", value: "6" },
              { label: "Team members", value: "8" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium text-foreground">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Bloom>
    </div>
  );
}
