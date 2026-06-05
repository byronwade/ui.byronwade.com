import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import {
  CommentModerationRow,
  type ModerationStatus,
} from "@/components/comment-moderation-row"

function root() {
  return document.querySelector(
    '[data-slot="comment-moderation-row"]',
  ) as HTMLElement
}

function statusTag() {
  return document.querySelector(
    '[data-slot="comment-moderation-row-status"]',
  ) as HTMLElement
}

function approve() {
  return screen.getByRole("button", { name: "Approve" })
}

function remove() {
  return screen.getByRole("button", { name: "Remove" })
}

function heart() {
  return screen.getByRole("button", { name: "Heart" })
}

function reply() {
  return screen.getByRole("button", { name: "Reply" })
}

describe("CommentModerationRow", () => {
  it("renders the root, header, text and status slots", () => {
    render(<CommentModerationRow author="Jules" text="Nice video" />)
    expect(root()).toBeInTheDocument()
    expect(
      document.querySelector('[data-slot="comment-moderation-row-header"]'),
    ).toBeInTheDocument()
    expect(
      document.querySelector('[data-slot="comment-moderation-row-text"]'),
    ).toBeInTheDocument()
    expect(statusTag()).toBeInTheDocument()
    expect(screen.getByText("Jules")).toBeInTheDocument()
    expect(screen.getByText("Nice video")).toBeInTheDocument()
  })

  it("renders the timestamp when provided and omits it otherwise", () => {
    const { rerender } = render(<CommentModerationRow author="A" text="hi" />)
    expect(screen.queryByText("2 days ago")).toBeNull()
    rerender(<CommentModerationRow author="A" text="hi" timestamp="2 days ago" />)
    expect(screen.getByText("2 days ago")).toBeInTheDocument()
  })

  it("shows a verified badge only when verified", () => {
    const { rerender } = render(<CommentModerationRow author="A" text="hi" />)
    expect(document.querySelector('[data-slot="verified-badge"]')).toBeNull()
    rerender(<CommentModerationRow author="A" text="hi" verified />)
    expect(
      document.querySelector('[data-slot="verified-badge"]'),
    ).toBeInTheDocument()
  })

  it("renders avatar fallback initials, with and without an avatarSrc", () => {
    const { rerender } = render(
      <CommentModerationRow author="Jules Verne" text="hi" />,
    )
    expect(screen.getByText("JU")).toBeInTheDocument()
    rerender(
      <CommentModerationRow
        author="Jules Verne"
        text="hi"
        authorAvatarSrc="https://x.test/a.jpg"
      />,
    )
    expect(screen.getByText("JU")).toBeInTheDocument()
  })

  it("renders rich text body nodes", () => {
    render(<CommentModerationRow author="A" text={<em>emphasised</em>} />)
    expect(screen.getByText("emphasised").tagName).toBe("EM")
  })

  it("renders the compact like count and omits it when undefined", () => {
    const { rerender } = render(<CommentModerationRow author="A" text="hi" />)
    expect(
      document.querySelector('[data-slot="comment-moderation-row-likes"]'),
    ).toBeNull()
    rerender(<CommentModerationRow author="A" text="hi" likeCount={1240} />)
    const likes = document.querySelector(
      '[data-slot="comment-moderation-row-likes"]',
    ) as HTMLElement
    expect(within(likes).getByText("1.2K")).toBeInTheDocument()
  })

  const statuses: ReadonlyArray<{
    status: ModerationStatus
    label: string
    tone: string
  }> = [
    { status: "held", label: "Held for review", tone: "text-warning" },
    { status: "published", label: "Published", tone: "text-success" },
    { status: "approved", label: "Approved", tone: "text-success" },
    { status: "removed", label: "Removed", tone: "text-secondary-foreground" },
  ]

  it.each(statuses)(
    "renders the $status status tag with label and tone",
    ({ status, label, tone }) => {
      render(<CommentModerationRow author="A" text="hi" status={status} />)
      const tag = statusTag()
      expect(tag).toHaveTextContent(label)
      expect(tag).toHaveClass(tone)
    },
  )

  it("defaults to held status when none is provided", () => {
    render(<CommentModerationRow author="A" text="hi" />)
    expect(statusTag()).toHaveTextContent("Held for review")
  })

  it("shows moderation actions only for held status", () => {
    const { rerender } = render(
      <CommentModerationRow author="A" text="hi" status="held" />,
    )
    expect(
      document.querySelector('[data-slot="comment-moderation-row-actions"]'),
    ).toBeInTheDocument()
    expect(approve()).toBeInTheDocument()
    expect(remove()).toBeInTheDocument()
    expect(heart()).toBeInTheDocument()
    expect(reply()).toBeInTheDocument()

    rerender(<CommentModerationRow author="A" text="hi" status="removed" />)
    expect(
      document.querySelector('[data-slot="comment-moderation-row-actions"]'),
    ).toBeNull()
    expect(screen.queryByRole("button", { name: "Approve" })).toBeNull()

    rerender(<CommentModerationRow author="A" text="hi" status="approved" />)
    expect(
      document.querySelector('[data-slot="comment-moderation-row-actions"]'),
    ).toBeNull()
  })

  it("fires onApprove when Approve is clicked", async () => {
    const user = userEvent.setup()
    const onApprove = vi.fn()
    render(<CommentModerationRow author="A" text="hi" onApprove={onApprove} />)
    await user.click(approve())
    expect(onApprove).toHaveBeenCalledOnce()
  })

  it("fires onRemove when Remove is clicked", async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(<CommentModerationRow author="A" text="hi" onRemove={onRemove} />)
    await user.click(remove())
    expect(onRemove).toHaveBeenCalledOnce()
  })

  it("fires onReply when Reply is clicked", async () => {
    const user = userEvent.setup()
    const onReply = vi.fn()
    render(<CommentModerationRow author="A" text="hi" onReply={onReply} />)
    await user.click(reply())
    expect(onReply).toHaveBeenCalledOnce()
  })

  it("does not throw clicking actions without handlers", async () => {
    const user = userEvent.setup()
    render(<CommentModerationRow author="A" text="hi" />)
    await user.click(approve())
    await user.click(remove())
    await user.click(reply())
    expect(approve()).toBeInTheDocument()
  })

  it("toggles heart (uncontrolled) and fires onHeartedChange with color swap", async () => {
    const user = userEvent.setup()
    const onHeartedChange = vi.fn()
    render(
      <CommentModerationRow
        author="A"
        text="hi"
        onHeartedChange={onHeartedChange}
      />,
    )
    expect(heart()).toHaveAttribute("aria-pressed", "false")
    expect(heart()).not.toHaveClass("text-destructive")
    await user.click(heart())
    expect(onHeartedChange).toHaveBeenCalledWith(true)
    expect(heart()).toHaveAttribute("aria-pressed", "true")
    expect(heart()).toHaveClass("text-destructive")
    await user.click(heart())
    expect(onHeartedChange).toHaveBeenLastCalledWith(false)
    expect(heart()).toHaveAttribute("aria-pressed", "false")
  })

  it("toggles heart (uncontrolled) without an onHeartedChange handler", async () => {
    const user = userEvent.setup()
    render(<CommentModerationRow author="A" text="hi" />)
    await user.click(heart())
    expect(heart()).toHaveAttribute("aria-pressed", "true")
  })

  it("honors defaultHearted", () => {
    render(<CommentModerationRow author="A" text="hi" defaultHearted />)
    expect(heart()).toHaveAttribute("aria-pressed", "true")
    expect(heart()).toHaveClass("text-destructive")
  })

  it("respects controlled hearted and does not self-update", async () => {
    const user = userEvent.setup()
    const onHeartedChange = vi.fn()
    render(
      <CommentModerationRow
        author="A"
        text="hi"
        hearted
        onHeartedChange={onHeartedChange}
      />,
    )
    expect(heart()).toHaveAttribute("aria-pressed", "true")
    await user.click(heart())
    // controlled: stays true until parent updates the prop
    expect(heart()).toHaveAttribute("aria-pressed", "true")
    expect(onHeartedChange).toHaveBeenCalledWith(false)
  })

  it("renders the video context chip with and without a thumbnail", () => {
    const { rerender } = render(<CommentModerationRow author="A" text="hi" />)
    expect(
      document.querySelector('[data-slot="comment-moderation-row-context"]'),
    ).toBeNull()

    rerender(
      <CommentModerationRow author="A" text="hi" videoTitle="My great video" />,
    )
    const chip = document.querySelector(
      '[data-slot="comment-moderation-row-context"]',
    ) as HTMLElement
    expect(chip).toBeInTheDocument()
    expect(chip).toHaveTextContent("on: My great video")
    expect(chip.querySelector("img")).toBeNull()

    rerender(
      <CommentModerationRow
        author="A"
        text="hi"
        videoTitle="My great video"
        videoThumbnailSrc="https://x.test/t.jpg"
      />,
    )
    expect(
      (
        document.querySelector(
          '[data-slot="comment-moderation-row-context"]',
        ) as HTMLElement
      ).querySelector("img"),
    ).toBeInTheDocument()
  })

  it("merges a custom className onto the root", () => {
    render(<CommentModerationRow author="A" text="hi" className="custom" />)
    expect(root()).toHaveClass("custom")
  })

  it("has no axe violations (full, held)", async () => {
    const { container } = render(
      <CommentModerationRow
        author="Marques Brownlee"
        authorAvatarSrc="https://x.test/a.jpg"
        verified
        timestamp="2 days ago"
        text="Great breakdown."
        likeCount={12400}
        status="held"
        videoTitle="The pipeline"
        videoThumbnailSrc="https://x.test/t.jpg"
        defaultHearted
        onApprove={() => {}}
        onRemove={() => {}}
        onReply={() => {}}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations (minimal, removed)", async () => {
    const { container } = render(
      <CommentModerationRow author="A" text="hi" status="removed" />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
