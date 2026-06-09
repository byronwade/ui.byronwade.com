"use client"

import {
  Attachment,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
  type AttachmentData,
} from "@/components/ai-elements/attachments"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"
import { cn } from "@/lib/utils"

const FILES: AttachmentData[] = [
  {
    id: "1",
    type: "file",
    filename: "design-spec.pdf",
    mediaType: "application/pdf",
    url: "https://example.com/design-spec.pdf",
  },
  {
    id: "2",
    type: "file",
    filename: "interface-mock.png",
    mediaType: "image/png",
    url: "https://placehold.co/96x96/png",
  },
  {
    id: "3",
    type: "source-document",
    sourceId: "src-1",
    title: "API Reference",
    mediaType: "text/html",
  },
]

const SKELETON_ROWS = [
  { previewW: "w-12", labelW: "w-28", typeW: "w-20" },
  { previewW: "w-12", labelW: "w-36", typeW: "w-16" },
  { previewW: "w-12", labelW: "w-24", typeW: "w-24" },
]

function AttachmentsSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-2">
      {SKELETON_ROWS.map((row, i) => (
        <div
          key={i}
          className="flex w-full items-center gap-3 rounded-lg edge p-3"
        >
          <Skeleton className={cn("h-12 shrink-0 rounded-sm", row.previewW)} />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className={cn("h-3.5 rounded", row.labelW)} />
            <Skeleton className={cn("h-3 rounded", row.typeW)} />
          </div>
          <Skeleton className="h-8 w-8 shrink-0 rounded-sm" />
        </div>
      ))}
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  return (
    <div className="flex min-h-0 items-center justify-center bg-background p-8">
      <div
        aria-busy={isLoading}
        data-state={state}
        className="w-full max-w-md rounded-2xl bg-card p-5 text-card-foreground edge"
      >
        <p className="mb-3 text-sm text-muted-foreground">Attachments</p>

        {isLoading ? (
          <AttachmentsSkeleton />
        ) : isEmpty ? (
          <DemoEmptyState>No attachments</DemoEmptyState>
        ) : isError ? (
          <DemoErrorState>Couldn&apos;t load attachments</DemoErrorState>
        ) : (
          <Attachments variant="list">
            {FILES.map((file) => (
              <Attachment data={file} key={file.id} onRemove={() => {}}>
                <AttachmentPreview />
                <AttachmentInfo showMediaType />
                <AttachmentRemove />
              </Attachment>
            ))}
          </Attachments>
        )}
      </div>
    </div>
  )
}
