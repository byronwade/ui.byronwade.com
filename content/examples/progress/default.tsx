"use client";

import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";

export default function Example() {
  return (
    <div className="w-full max-w-sm space-y-6 p-6">
      <Progress value={65}>
        <ProgressLabel>Uploading file…</ProgressLabel>
        <ProgressValue>{(formatted) => formatted}</ProgressValue>
      </Progress>

      <Progress value={30}>
        <ProgressLabel>Storage used</ProgressLabel>
        <ProgressValue>{(formatted) => formatted}</ProgressValue>
      </Progress>

      <Progress value={100}>
        <ProgressLabel>Complete</ProgressLabel>
        <ProgressValue>{(formatted) => formatted}</ProgressValue>
      </Progress>
    </div>
  );
}
