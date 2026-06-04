"use client";

import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";

const CITATIONS = [
  { href: "https://example.com/edge-runtime", title: "Edge Runtime overview" },
  { href: "https://example.com/streaming", title: "Streaming responses guide" },
  { href: "https://example.com/tokens", title: "Token usage & limits" },
];

export default function Example() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <div className="w-full max-w-md rounded-2xl bg-card p-5 text-card-foreground edge">
        <p className="mb-3 text-sm text-muted-foreground">
          Based on your docs, edge functions stream tokens as they are
          generated, so the first byte arrives in milliseconds.
        </p>
        <Sources defaultOpen>
          <SourcesTrigger count={CITATIONS.length} />
          <SourcesContent>
            {CITATIONS.map((citation) => (
              <Source
                key={citation.href}
                href={citation.href}
                title={citation.title}
              />
            ))}
          </SourcesContent>
        </Sources>
      </div>
    </div>
  );
}
