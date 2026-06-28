"use client"

import { File, Image, Trash, X } from "@/lib/icons"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"

export default function Example() {
  return (
    <div className="mx-auto w-full max-w-lg space-y-6">
      <Attachment state="done">
        <AttachmentMedia variant="icon">
          <File />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>release-notes.pdf</AttachmentTitle>
          <AttachmentDescription>248 KB · PDF</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove attachment">
            <X />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>

      <Attachment state="uploading">
        <AttachmentMedia variant="icon">
          <Image />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>screenshot.png</AttachmentTitle>
          <AttachmentDescription>Uploading…</AttachmentDescription>
        </AttachmentContent>
      </Attachment>

      <AttachmentGroup>
        {["brief.md", "mockup.png", "notes.txt"].map((name) => (
          <Attachment key={name} state="done" size="sm">
            <AttachmentMedia variant="icon">
              <File />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{name}</AttachmentTitle>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label={`Remove ${name}`}>
                <Trash />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        ))}
      </AttachmentGroup>
    </div>
  )
}
