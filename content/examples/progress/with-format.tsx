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
      {/* Default percent format */}
      <Progress value={68}>
        <ProgressLabel>Default (percent)</ProgressLabel>
        <ProgressValue>{(formatted) => formatted}</ProgressValue>
      </Progress>

      {/* Custom min/max range — bytes transferred */}
      <Progress value={340} min={0} max={512}>
        <ProgressLabel>Data transferred</ProgressLabel>
        <ProgressValue>
          {(_formatted, value) =>
            value !== null ? `${value} / 512 MB` : null
          }
        </ProgressValue>
        <ProgressTrack className="h-2">
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>

      {/* Custom locale + format: fraction digits */}
      <Progress
        value={0.734}
        min={0}
        max={1}
        format={{ style: "percent", maximumFractionDigits: 1 }}
      >
        <ProgressLabel>Accuracy</ProgressLabel>
        <ProgressValue>{(formatted) => formatted}</ProgressValue>
        <ProgressTrack className="h-2">
          <ProgressIndicator className="bg-emerald-500" />
        </ProgressTrack>
      </Progress>

      {/* getAriaValueText for screen readers + custom display */}
      <Progress
        value={7}
        min={0}
        max={10}
        getAriaValueText={(_, value) => `Step ${value} of 10`}
      >
        <ProgressLabel>Onboarding steps</ProgressLabel>
        <ProgressValue>
          {(_formatted, value) => (value !== null ? `${value} / 10` : null)}
        </ProgressValue>
        <ProgressTrack className="h-2">
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  );
}
