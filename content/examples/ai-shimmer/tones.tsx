"use client";

import { Shimmer } from "@/components/ai-elements/shimmer";

const TONES = ["muted", "brand", "foreground"] as const;

export default function Example() {
  return (
    <div className="flex min-h-[200px] flex-col items-start justify-center gap-6 bg-background p-6">
      {TONES.map((tone) => (
        <div key={tone} className="flex flex-col gap-1">
          <span className="font-mono text-xs text-muted-foreground">
            tone=&quot;{tone}&quot;
          </span>
          <Shimmer tone={tone} size="lg">
            Generating response…
          </Shimmer>
        </div>
      ))}
    </div>
  );
}
