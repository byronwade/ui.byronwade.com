"use client"

import { Shimmer } from "@/components/ai-elements/shimmer"
import { Loader } from "@/components/ai-elements/loader"

export default function Example() {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-6 bg-background p-8">
      {/* Default — muted-foreground sweep, as a status line */}
      <span className="inline-flex items-center gap-2">
        <Loader size={16} />
        <Shimmer>Generating response…</Shimmer>
      </span>

      {/* Larger, brand-toned heading rendered as an h2 */}
      <Shimmer as="h2" size="xl" tone="brand">
        Thinking through the plan
      </Shimmer>

      {/* Slower, wider sweep on a foreground-toned label */}
      <Shimmer size="sm" tone="foreground" duration={3} spread={3}>
        Streaming tokens
      </Shimmer>
    </div>
  )
}
