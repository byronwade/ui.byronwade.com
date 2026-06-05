"use client"

import { UploadRow } from "@/components/upload-row"

export default function Example() {
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
      <UploadRow
        filename="thumbnail-card.png"
        sizeLabel="2 MB"
        status="done"
      />
      <UploadRow
        filename="corrupted-export.mp4"
        sizeLabel="512 MB"
        status="error"
        onRetry={() => {}}
      />
    </div>
  )
}
