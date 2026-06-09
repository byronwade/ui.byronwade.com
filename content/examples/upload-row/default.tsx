"use client"

import { UploadRow } from "@/components/upload-row"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"

export default function Example() {
  const state = useDemoState() ?? "default"

  // loading — skeleton rows while the list is being fetched
  if (state === "loading") {
    return (
      <div className="w-[640px] flex flex-col">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 border-b border-border py-3"
          >
            <Skeleton className="w-20 shrink-0 rounded-md aspect-video" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-3.5 w-2/3 rounded" />
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
            <Skeleton className="h-6 w-20 shrink-0 rounded-full" />
          </div>
        ))}
      </div>
    )
  }

  // empty — no uploads queued or present
  if (state === "empty") {
    return (
      <div className="w-[640px]">
        <DemoEmptyState>No uploads</DemoEmptyState>
      </div>
    )
  }

  // success — all rows finished
  if (state === "success") {
    return (
      <div className="w-[640px] flex flex-col">
        <UploadRow
          filename="intro-sequence.mov"
          sizeLabel="248 MB"
          status="done"
        />
        <UploadRow
          filename="keynote-final-cut.mp4"
          sizeLabel="1.2 GB"
          status="done"
        />
        <UploadRow
          filename="b-roll-drone-4k.mp4"
          sizeLabel="3.8 GB"
          status="done"
        />
      </div>
    )
  }

  // error — one row failed; use the native `status="error"` to model a failed
  // upload rather than a load failure (upload-row encodes this status natively)
  if (state === "error") {
    return (
      <div className="w-[640px] flex flex-col">
        <UploadRow
          filename="b-roll-drone-4k.mp4"
          sizeLabel="3.8 GB"
          status="done"
        />
        <UploadRow
          filename="corrupted-export.mp4"
          sizeLabel="512 MB"
          status="error"
          onRetry={() => {}}
        />
        <DemoErrorState>Upload failed — file may be corrupted</DemoErrorState>
      </div>
    )
  }

  // default — rows in mixed active/uploading states
  return (
    <div className="w-[640px] flex flex-col">
      <UploadRow
        filename="intro-sequence.mov"
        sizeLabel="248 MB"
        status="queued"
        onCancel={() => {}}
      />
      <UploadRow
        filename="keynote-final-cut.mp4"
        sizeLabel="1.2 GB"
        status="uploading"
        progress={42}
        onCancel={() => {}}
      />
      <UploadRow
        filename="b-roll-drone-4k.mp4"
        sizeLabel="3.8 GB"
        status="processing"
        progress={88}
        statusLabel="Processing HD…"
        onCancel={() => {}}
      />
      <UploadRow filename="thumbnail-card.png" sizeLabel="2 MB" status="done" />
      <UploadRow
        filename="corrupted-export.mp4"
        sizeLabel="512 MB"
        status="error"
        onRetry={() => {}}
      />
    </div>
  )
}
