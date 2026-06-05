import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { Comment } from "@/components/comment"

function root() {
  return document.querySelector('[data-slot="comment"]') as HTMLElement
}

function like() {
  return screen.getByRole("button", { name: "Like" })
}

function dislike() {
  return screen.getByRole("button", { name: "Dislike" })
}

describe("Comment", () => {
  it("renders the root data-slot, header, body and actions", () => {
    render(<Comment author="Jules" text="Nice video" />)
    expect(root()).toBeInTheDocument()
    expect(
      document.querySelector('[data-slot="comment-header"]'),
    ).toBeInTheDocument()
    expect(
      document.querySelector('[data-slot="comment-body"]'),
    ).toBeInTheDocument()
    expect(
      document.querySelector('[data-slot="comment-actions"]'),
    ).toBeInTheDocument()
    expect(screen.getByText("Jules")).toBeInTheDocument()
    expect(screen.getByText("Nice video")).toBeInTheDocument()
  })

  it("renders the timestamp when provided and omits it otherwise", () => {
    const { rerender } = render(<Comment author="A" text="hi" />)
    expect(screen.queryByText("2 days ago")).toBeNull()
    rerender(<Comment author="A" text="hi" timestamp="2 days ago" />)
    expect(screen.getByText("2 days ago")).toBeInTheDocument()
  })

  it("shows a verified badge only when verified", () => {
    const { rerender } = render(<Comment author="A" text="hi" />)
    expect(
      document.querySelector('[data-slot="verified-badge"]'),
    ).toBeNull()
    rerender(<Comment author="A" text="hi" verified />)
    expect(
      document.querySelector('[data-slot="verified-badge"]'),
    ).toBeInTheDocument()
  })

  it("renders the avatar fallback initials, with and without an avatarSrc", () => {
    const { rerender } = render(<Comment author="Jules Verne" text="hi" />)
    expect(screen.getByText("JU")).toBeInTheDocument()
    rerender(
      <Comment
        author="Jules Verne"
        text="hi"
        authorAvatarSrc="https://x.test/a.jpg"
      />,
    )
    expect(screen.getByText("JU")).toBeInTheDocument()
  })

  it("renders rich text body nodes", () => {
    render(<Comment author="A" text={<em>emphasised</em>} />)
    expect(screen.getByText("emphasised").tagName).toBe("EM")
  })

  it("renders the compact like count and omits it when undefined", () => {
    const { rerender } = render(<Comment author="A" text="hi" />)
    const likeBtn = like()
    expect(within(likeBtn).queryByText(/\d/)).toBeNull()
    rerender(<Comment author="A" text="hi" likeCount={1240} />)
    expect(screen.getByText("1.2K")).toBeInTheDocument()
  })

  it("toggles like (uncontrolled) and fires onLikedChange", async () => {
    const user = userEvent.setup()
    const onLikedChange = vi.fn()
    render(<Comment author="A" text="hi" onLikedChange={onLikedChange} />)
    expect(like()).toHaveAttribute("aria-pressed", "false")
    await user.click(like())
    expect(onLikedChange).toHaveBeenCalledWith(true)
    expect(like()).toHaveAttribute("aria-pressed", "true")
    await user.click(like())
    expect(onLikedChange).toHaveBeenLastCalledWith(false)
    expect(like()).toHaveAttribute("aria-pressed", "false")
  })

  it("toggles like (uncontrolled) without an onLikedChange handler", async () => {
    const user = userEvent.setup()
    render(<Comment author="A" text="hi" />)
    await user.click(like())
    expect(like()).toHaveAttribute("aria-pressed", "true")
  })

  it("honors defaultLiked", () => {
    render(<Comment author="A" text="hi" defaultLiked />)
    expect(like()).toHaveAttribute("aria-pressed", "true")
  })

  it("respects controlled liked and does not self-update", async () => {
    const user = userEvent.setup()
    const onLikedChange = vi.fn()
    render(
      <Comment
        author="A"
        text="hi"
        liked
        onLikedChange={onLikedChange}
      />,
    )
    expect(like()).toHaveAttribute("aria-pressed", "true")
    await user.click(like())
    // controlled: stays true until parent updates the prop
    expect(like()).toHaveAttribute("aria-pressed", "true")
    expect(onLikedChange).toHaveBeenCalledWith(false)
  })

  it("toggles dislike (uncontrolled) and fires onDislikedChange", async () => {
    const user = userEvent.setup()
    const onDislikedChange = vi.fn()
    render(
      <Comment author="A" text="hi" onDislikedChange={onDislikedChange} />,
    )
    expect(dislike()).toHaveAttribute("aria-pressed", "false")
    await user.click(dislike())
    expect(onDislikedChange).toHaveBeenCalledWith(true)
    expect(dislike()).toHaveAttribute("aria-pressed", "true")
  })

  it("honors defaultDisliked", () => {
    render(<Comment author="A" text="hi" defaultDisliked />)
    expect(dislike()).toHaveAttribute("aria-pressed", "true")
  })

  it("respects controlled disliked and does not self-update", async () => {
    const user = userEvent.setup()
    const onDislikedChange = vi.fn()
    render(
      <Comment
        author="A"
        text="hi"
        disliked
        onDislikedChange={onDislikedChange}
      />,
    )
    expect(dislike()).toHaveAttribute("aria-pressed", "true")
    await user.click(dislike())
    expect(dislike()).toHaveAttribute("aria-pressed", "true")
    expect(onDislikedChange).toHaveBeenCalledWith(false)
  })

  it("liking clears an existing dislike (uncontrolled)", async () => {
    const user = userEvent.setup()
    const onLikedChange = vi.fn()
    const onDislikedChange = vi.fn()
    render(
      <Comment
        author="A"
        text="hi"
        defaultDisliked
        onLikedChange={onLikedChange}
        onDislikedChange={onDislikedChange}
      />,
    )
    expect(dislike()).toHaveAttribute("aria-pressed", "true")
    await user.click(like())
    expect(onLikedChange).toHaveBeenCalledWith(true)
    expect(onDislikedChange).toHaveBeenCalledWith(false)
    expect(like()).toHaveAttribute("aria-pressed", "true")
    expect(dislike()).toHaveAttribute("aria-pressed", "false")
  })

  it("disliking clears an existing like (uncontrolled)", async () => {
    const user = userEvent.setup()
    const onLikedChange = vi.fn()
    const onDislikedChange = vi.fn()
    render(
      <Comment
        author="A"
        text="hi"
        defaultLiked
        onLikedChange={onLikedChange}
        onDislikedChange={onDislikedChange}
      />,
    )
    expect(like()).toHaveAttribute("aria-pressed", "true")
    await user.click(dislike())
    expect(onDislikedChange).toHaveBeenCalledWith(true)
    expect(onLikedChange).toHaveBeenCalledWith(false)
    expect(dislike()).toHaveAttribute("aria-pressed", "true")
    expect(like()).toHaveAttribute("aria-pressed", "false")
  })

  it("liking clears a controlled dislike via callback only", async () => {
    const user = userEvent.setup()
    const onDislikedChange = vi.fn()
    render(
      <Comment
        author="A"
        text="hi"
        disliked
        onDislikedChange={onDislikedChange}
      />,
    )
    await user.click(like())
    expect(onDislikedChange).toHaveBeenCalledWith(false)
  })

  it("disliking clears a controlled like via callback only", async () => {
    const user = userEvent.setup()
    const onLikedChange = vi.fn()
    render(
      <Comment
        author="A"
        text="hi"
        liked
        onLikedChange={onLikedChange}
      />,
    )
    await user.click(dislike())
    expect(onLikedChange).toHaveBeenCalledWith(false)
  })

  it("fires onReply when Reply is clicked", async () => {
    const user = userEvent.setup()
    const onReply = vi.fn()
    render(<Comment author="A" text="hi" onReply={onReply} />)
    await user.click(screen.getByRole("button", { name: "Reply" }))
    expect(onReply).toHaveBeenCalledOnce()
  })

  it("does not throw clicking Reply without an onReply handler", async () => {
    const user = userEvent.setup()
    render(<Comment author="A" text="hi" />)
    await user.click(screen.getByRole("button", { name: "Reply" }))
    expect(screen.getByRole("button", { name: "Reply" })).toBeInTheDocument()
  })

  it("shows the pinned tag only when pinned", () => {
    const { rerender } = render(<Comment author="A" text="hi" />)
    expect(
      document.querySelector('[data-slot="comment-pinned"]'),
    ).toBeNull()
    rerender(<Comment author="A" text="hi" pinned />)
    const tag = document.querySelector('[data-slot="comment-pinned"]')
    expect(tag).toBeInTheDocument()
    expect(tag).toHaveTextContent("Pinned")
  })

  it("shows the creator heart badge only when hearted", () => {
    const { rerender } = render(<Comment author="A" text="hi" />)
    expect(
      document.querySelector('[data-slot="comment-heart"]'),
    ).toBeNull()
    rerender(<Comment author="A" text="hi" hearted />)
    expect(
      screen.getByRole("img", { name: "Hearted by creator" }),
    ).toBeInTheDocument()
  })

  it("does not render the replies disclosure when no replies", () => {
    render(<Comment author="A" text="hi" />)
    expect(
      document.querySelector('[data-slot="comment-replies"]'),
    ).toBeNull()
  })

  it("renders the disclosure for replyCount and toggles label + children visibility", async () => {
    const user = userEvent.setup()
    render(
      <Comment author="A" text="hi" replyCount={2}>
        <Comment author="B" text="reply" />
      </Comment>,
    )
    const toggle = screen.getByRole("button", { name: /View 2 replies/i })
    expect(toggle).toHaveAttribute("aria-expanded", "false")
    expect(screen.queryByText("reply")).toBeNull()

    await user.click(toggle)
    expect(
      screen.getByRole("button", { name: "Hide replies" }),
    ).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("reply")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Hide replies" }))
    expect(
      screen.getByRole("button", { name: /View 2 replies/i }),
    ).toBeInTheDocument()
    expect(screen.queryByText("reply")).toBeNull()
  })

  it("renders the disclosure for children alone (no replyCount) with generic label", () => {
    render(
      <Comment author="A" text="hi">
        <Comment author="B" text="reply" />
      </Comment>,
    )
    expect(
      screen.getByRole("button", { name: "View replies" }),
    ).toBeInTheDocument()
  })

  it("does not render the disclosure when replyCount is zero", () => {
    render(<Comment author="A" text="hi" replyCount={0} />)
    expect(
      document.querySelector('[data-slot="comment-replies"]'),
    ).toBeNull()
  })

  it("compact-formats large reply counts in the label", () => {
    render(<Comment author="A" text="hi" replyCount={2400} />)
    expect(
      screen.getByRole("button", { name: /View 2.4K replies/i }),
    ).toBeInTheDocument()
  })

  it("honors defaultRepliesOpen and renders children open", () => {
    render(
      <Comment author="A" text="hi" replyCount={1} defaultRepliesOpen>
        <Comment author="B" text="reply" />
      </Comment>,
    )
    expect(
      screen.getByRole("button", { name: "Hide replies" }),
    ).toBeInTheDocument()
    expect(screen.getByText("reply")).toBeInTheDocument()
  })

  it("renders an open disclosure with replyCount but no children (no list)", () => {
    render(<Comment author="A" text="hi" replyCount={3} defaultRepliesOpen />)
    expect(
      screen.getByRole("button", { name: "Hide replies" }),
    ).toBeInTheDocument()
    expect(
      document.querySelector('[data-slot="comment-replies-list"]'),
    ).toBeNull()
  })

  it("merges a custom className onto the root", () => {
    render(<Comment author="A" text="hi" className="custom" />)
    expect(root()).toHaveClass("custom")
  })

  it("has no axe violations (full)", async () => {
    const { container } = render(
      <Comment
        author="Marques Brownlee"
        authorAvatarSrc="https://x.test/a.jpg"
        verified
        timestamp="2 days ago"
        text="Great breakdown."
        likeCount={12400}
        pinned
        hearted
        replyCount={2}
        onReply={() => {}}
        defaultRepliesOpen
      >
        <Comment author="Jules" text="Agreed!" likeCount={86} />
      </Comment>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations (minimal)", async () => {
    const { container } = render(<Comment author="A" text="hi" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
