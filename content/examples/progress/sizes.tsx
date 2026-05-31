"use client";

import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@/components/ui/progress";

export default function Example() {
  return (
    <div className="w-full max-w-sm space-y-8 p-6">
      {/* Extra small — hairline (h-0.5) */}
      <Progress value={55}>
        <ProgressLabel>Extra small</ProgressLabel>
        <ProgressValue>{(f) => f}</ProgressValue>
        <ProgressTrack className="h-0.5">
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>

      {/* Small — default (h-1) */}
      <Progress value={55}>
        <ProgressLabel>Small (default)</ProgressLabel>
        <ProgressValue>{(f) => f}</ProgressValue>
      </Progress>

      {/* Medium — h-2 */}
      <Progress value={55}>
        <ProgressLabel>Medium</ProgressLabel>
        <ProgressValue>{(f) => f}</ProgressValue>
        <ProgressTrack className="h-2">
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>

      {/* Large — h-3 */}
      <Progress value={55}>
        <ProgressLabel>Large</ProgressLabel>
        <ProgressValue>{(f) => f}</ProgressValue>
        <ProgressTrack className="h-3">
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>

      {/* Extra large — h-4 */}
      <Progress value={55}>
        <ProgressLabel>Extra large</ProgressLabel>
        <ProgressValue>{(f) => f}</ProgressValue>
        <ProgressTrack className="h-4">
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  );
}
