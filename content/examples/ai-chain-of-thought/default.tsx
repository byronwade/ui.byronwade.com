"use client";

import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtImage,
  ChainOfThoughtSearchResult,
  ChainOfThoughtSearchResults,
  ChainOfThoughtStep,
} from "@/components/ai-elements/chain-of-thought";
import { FileSearchIcon, GlobeIcon, ListChecksIcon } from "lucide-react";

export default function Example() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-background p-8">
      <ChainOfThought className="w-full max-w-md" defaultOpen>
        <ChainOfThoughtHeader>Reasoning</ChainOfThoughtHeader>
        <ChainOfThoughtContent>
          <ChainOfThoughtStep
            icon={GlobeIcon}
            label="Searching the web for recent results"
            status="complete"
          >
            <ChainOfThoughtSearchResults>
              <ChainOfThoughtSearchResult>
                vercel.com
              </ChainOfThoughtSearchResult>
              <ChainOfThoughtSearchResult>
                nextjs.org/docs
              </ChainOfThoughtSearchResult>
              <ChainOfThoughtSearchResult>
                react.dev
              </ChainOfThoughtSearchResult>
            </ChainOfThoughtSearchResults>
          </ChainOfThoughtStep>

          <ChainOfThoughtStep
            description="Cross-referencing three primary sources for accuracy."
            icon={FileSearchIcon}
            label="Reading documentation"
            status="active"
          >
            <ChainOfThoughtImage caption="App Router data-flow diagram">
              <span className="font-mono text-xs text-muted-foreground">
                diagram.png
              </span>
            </ChainOfThoughtImage>
          </ChainOfThoughtStep>

          <ChainOfThoughtStep
            icon={ListChecksIcon}
            label="Drafting the answer"
            status="pending"
          />
        </ChainOfThoughtContent>
      </ChainOfThought>
    </div>
  );
}
