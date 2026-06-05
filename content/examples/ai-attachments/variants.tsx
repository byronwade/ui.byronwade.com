"use client";

import {
  Attachment,
  Attachments,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  type AttachmentData,
  type AttachmentVariant,
} from "@/components/ai-elements/attachments";

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
];

const VARIANTS: AttachmentVariant[] = ["grid", "inline", "list"];

export default function Example() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6 bg-background p-6">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {variant}
          </span>
          <Attachments variant={variant}>
            {FILES.map((file) => (
              <Attachment data={file} key={file.id} onRemove={() => {}}>
                <AttachmentPreview />
                <AttachmentInfo showMediaType />
                <AttachmentRemove />
              </Attachment>
            ))}
          </Attachments>
        </div>
      ))}
    </div>
  );
}
