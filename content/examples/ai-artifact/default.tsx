"use client";

import { CopyIcon, DownloadIcon } from "lucide-react";

import {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactClose,
  ArtifactContent,
  ArtifactDescription,
  ArtifactHeader,
  ArtifactTitle,
} from "@/components/ai-elements/artifact";

export default function Example() {
  return (
    <div className="flex min-h-0 items-center justify-center bg-background p-8">
      <Artifact className="w-full max-w-lg">
        <ArtifactHeader>
          <div className="flex flex-col gap-0.5">
            <ArtifactTitle>fibonacci.ts</ArtifactTitle>
            <ArtifactDescription>
              <span className="font-mono">42 lines</span> · TypeScript
            </ArtifactDescription>
          </div>
          <ArtifactActions>
            <ArtifactAction icon={CopyIcon} label="Copy" tooltip="Copy" />
            <ArtifactAction
              icon={DownloadIcon}
              label="Download"
              tooltip="Download"
            />
            <ArtifactClose />
          </ArtifactActions>
        </ArtifactHeader>
        <ArtifactContent>
          <pre className="font-mono text-sm text-foreground">
            {`export function fib(n: number): number {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}`}
          </pre>
        </ArtifactContent>
      </Artifact>
    </div>
  );
}
