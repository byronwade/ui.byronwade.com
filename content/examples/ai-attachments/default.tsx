"use client"

import {
  Attachment,
  Attachments,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  type AttachmentData,
} from "@/components/ai-elements/attachments"

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

export default function Example() {
  return (
    <div className="flex min-h-0 items-center justify-center bg-background p-8">
      <div className="w-full max-w-md rounded-2xl bg-card p-5 text-card-foreground edge">
        <p className="mb-3 text-sm text-muted-foreground">Attachments</p>
        <Attachments variant="list">
          {FILES.map((file) => (
            <Attachment data={file} key={file.id} onRemove={() => {}}>
              <AttachmentPreview />
              <AttachmentInfo showMediaType />
              <AttachmentRemove />
            </Attachment>
          ))}
        </Attachments>
      </div>
    </div>
  )
}
