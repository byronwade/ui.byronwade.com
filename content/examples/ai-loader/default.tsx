"use client";

import { Loader } from "@/components/ai-elements/loader";

export default function Example() {
  return (
    <div className="flex min-h-[160px] items-center justify-center gap-8 bg-background p-8">
      {/* Default — inherits muted-foreground */}
      <Loader />

      {/* Larger, tinted with the brand accent via a text token */}
      <Loader size={24} className="text-brand" />

      {/* Inline with a status line */}
      <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <Loader size={16} />
        Thinking…
      </span>
    </div>
  );
}
