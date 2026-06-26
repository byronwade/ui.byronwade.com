import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { axe } from "vitest-axe"
import { File } from "@/lib/icons"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment"

const STATES = ["idle", "uploading", "processing", "error", "done"] as const

describe("Attachment – states", () => {
  it.each(STATES)("renders state %s", (state) => {
    const { container } = render(
      <Attachment state={state}>
        <AttachmentContent>
          <AttachmentTitle>file.txt</AttachmentTitle>
        </AttachmentContent>
      </Attachment>,
    )
    expect(container.querySelector("[data-slot='attachment']")).toHaveAttribute(
      "data-state",
      state,
    )
  })

  it("renders media, description, actions, and trigger", () => {
    const { container } = render(
      <Attachment state="done">
        <AttachmentMedia variant="icon">
          <File />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>brief.pdf</AttachmentTitle>
          <AttachmentDescription>120 KB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove">×</AttachmentAction>
        </AttachmentActions>
        <AttachmentTrigger aria-label="Open attachment" />
      </Attachment>,
    )
    expect(
      container.querySelector("[data-slot='attachment-media']"),
    ).toHaveAttribute("data-variant", "icon")
    expect(screen.getByText("brief.pdf")).toBeInTheDocument()
    expect(screen.getByText("120 KB")).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='attachment-trigger']"),
    ).toBeInTheDocument()
  })

  it("renders horizontal attachment group", () => {
    const { container } = render(
      <AttachmentGroup>
        <Attachment state="done" size="sm">
          <AttachmentContent>
            <AttachmentTitle>a.txt</AttachmentTitle>
          </AttachmentContent>
        </Attachment>
        <Attachment state="done" size="sm">
          <AttachmentContent>
            <AttachmentTitle>b.txt</AttachmentTitle>
          </AttachmentContent>
        </Attachment>
      </AttachmentGroup>,
    )
    expect(
      container.querySelector("[data-slot='attachment-group']"),
    ).toBeInTheDocument()
    expect(container.querySelectorAll("[data-slot='attachment']")).toHaveLength(2)
  })

  it("has no axe violations", async () => {
    const { container } = render(
      <Attachment state="done">
        <AttachmentMedia variant="icon">
          <File />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>notes.md</AttachmentTitle>
          <AttachmentDescription>4 KB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
