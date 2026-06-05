import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { axe } from "vitest-axe"
import { Bookmark } from "lucide-react"
import { ShortsPlayer } from "@/components/shorts-player"

const author = { name: "Coastline Studio", handle: "@coastline" }

// ─── Default render ───────────────────────────────────────────────────────────

describe("ShortsPlayer – default render", () => {
  it("renders the root with data-slot", () => {
    const { container } = render(<ShortsPlayer author={author} />)
    const root = container.querySelector("[data-slot='shorts-player']")
    expect(root).toBeInTheDocument()
    expect(root).toHaveClass("aspect-[9/16]")
  })

  it("renders media, overlay, author, and rail slots", () => {
    const { container } = render(<ShortsPlayer author={author} />)
    expect(
      container.querySelector("[data-slot='shorts-player-media']"),
    ).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='shorts-player-overlay']"),
    ).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='shorts-player-author']"),
    ).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='shorts-player-rail']"),
    ).toBeInTheDocument()
  })

  it("merges a custom className onto the root", () => {
    const { container } = render(
      <ShortsPlayer author={author} className="custom-class" />,
    )
    const root = container.querySelector("[data-slot='shorts-player']")
    expect(root).toHaveClass("custom-class")
    expect(root).toHaveClass("relative")
  })

  it("applies a numeric width as a pixel style", () => {
    const { container } = render(<ShortsPlayer author={author} width={400} />)
    const root = container.querySelector(
      "[data-slot='shorts-player']",
    ) as HTMLElement
    expect(root.style.width).toBe("400px")
  })

  it("applies a string width verbatim", () => {
    const { container } = render(
      <ShortsPlayer author={author} width="50vw" />,
    )
    const root = container.querySelector(
      "[data-slot='shorts-player']",
    ) as HTMLElement
    expect(root.style.width).toBe("50vw")
  })
})

// ─── Media ────────────────────────────────────────────────────────────────────

describe("ShortsPlayer – media", () => {
  it("renders custom children media when provided", () => {
    const { container } = render(
      <ShortsPlayer author={author}>
        <video data-testid="custom-video" />
      </ShortsPlayer>,
    )
    expect(screen.getByTestId("custom-video")).toBeInTheDocument()
    expect(container.querySelector("img")).toBeNull()
    expect(
      container.querySelector("[data-slot='shorts-player-placeholder']"),
    ).toBeNull()
  })

  it("renders the poster image when posterSrc is provided and no children", () => {
    const { container } = render(
      <ShortsPlayer author={author} posterSrc="/poster.jpg" />,
    )
    const img = container.querySelector(
      "[data-slot='shorts-player-media'] img",
    ) as HTMLImageElement
    expect(img).toBeInTheDocument()
    expect(img.getAttribute("src")).toBe("/poster.jpg")
    expect(img).toHaveClass("object-cover")
  })

  it("renders the placeholder when neither children nor poster is provided", () => {
    const { container } = render(<ShortsPlayer author={author} />)
    expect(
      container.querySelector("[data-slot='shorts-player-placeholder']"),
    ).toBeInTheDocument()
  })
})

// ─── Author ───────────────────────────────────────────────────────────────────

describe("ShortsPlayer – author", () => {
  it("renders the handle when provided", () => {
    render(<ShortsPlayer author={author} />)
    expect(screen.getByText("@coastline")).toBeInTheDocument()
  })

  it("falls back to the name when no handle is provided", () => {
    render(<ShortsPlayer author={{ name: "Coastline Studio" }} />)
    expect(screen.getByText("Coastline Studio")).toBeInTheDocument()
  })

  it("renders the verified badge when verified", () => {
    const { container } = render(
      <ShortsPlayer author={{ ...author, verified: true }} />,
    )
    expect(
      container.querySelector("[data-slot='verified-badge']"),
    ).toBeInTheDocument()
  })

  it("omits the verified badge when not verified", () => {
    const { container } = render(<ShortsPlayer author={author} />)
    expect(
      container.querySelector("[data-slot='verified-badge']"),
    ).toBeNull()
  })

  it("renders the avatar with the image branch when avatarSrc is provided", () => {
    const { container } = render(
      <ShortsPlayer author={{ ...author, avatarSrc: "/me.jpg" }} />,
    )
    // Base UI's AvatarImage only mounts after the image load event (never fires
    // in jsdom), so assert the avatar slot the avatarSrc branch still renders.
    expect(
      container.querySelector("[data-slot='avatar']"),
    ).toBeInTheDocument()
  })

  it("renders avatar initials fallback when no avatarSrc", () => {
    const { container } = render(<ShortsPlayer author={author} />)
    expect(
      container.querySelector("[data-slot='avatar-image']"),
    ).toBeNull()
    expect(
      container.querySelector("[data-slot='avatar-fallback']"),
    ).toHaveTextContent("CO")
  })
})

// ─── Follow ───────────────────────────────────────────────────────────────────

describe("ShortsPlayer – follow", () => {
  it("toggles follow and fires onFollowingChange (uncontrolled)", async () => {
    const onFollowingChange = vi.fn()
    const user = userEvent.setup()
    render(
      <ShortsPlayer
        author={author}
        onFollowingChange={onFollowingChange}
      />,
    )
    const follow = screen.getByRole("button", { name: "Follow" })
    expect(follow).toHaveAttribute("aria-pressed", "false")
    await user.click(follow)
    expect(onFollowingChange).toHaveBeenCalledWith(true)
    expect(
      screen.getByRole("button", { name: "Following" }),
    ).toHaveAttribute("aria-pressed", "true")
  })

  it("respects defaultFollowing", () => {
    render(<ShortsPlayer author={author} defaultFollowing />)
    expect(
      screen.getByRole("button", { name: "Following" }),
    ).toHaveAttribute("aria-pressed", "true")
  })

  it("respects a controlled following value and does not self-flip", async () => {
    const onFollowingChange = vi.fn()
    const user = userEvent.setup()
    render(
      <ShortsPlayer
        author={author}
        following={false}
        onFollowingChange={onFollowingChange}
      />,
    )
    const follow = screen.getByRole("button", { name: "Follow" })
    await user.click(follow)
    expect(onFollowingChange).toHaveBeenCalledWith(true)
    expect(follow).toHaveAttribute("aria-pressed", "false")
  })

  it("does not throw when followed without a handler", async () => {
    const user = userEvent.setup()
    render(<ShortsPlayer author={author} />)
    await user.click(screen.getByRole("button", { name: "Follow" }))
    expect(
      screen.getByRole("button", { name: "Following" }),
    ).toBeInTheDocument()
  })
})

// ─── Caption & sound ──────────────────────────────────────────────────────────

describe("ShortsPlayer – caption & sound", () => {
  it("renders the caption when provided", () => {
    const { container } = render(
      <ShortsPlayer author={author} caption="A lovely sunset" />,
    )
    const caption = container.querySelector(
      "[data-slot='shorts-player-caption']",
    )
    expect(caption).toHaveTextContent("A lovely sunset")
    expect(caption).toHaveClass("line-clamp-2")
  })

  it("omits the caption when absent", () => {
    const { container } = render(<ShortsPlayer author={author} />)
    expect(
      container.querySelector("[data-slot='shorts-player-caption']"),
    ).toBeNull()
  })

  it("renders the sound row when provided", () => {
    const { container } = render(
      <ShortsPlayer author={author} sound="original sound · me" />,
    )
    expect(
      container.querySelector("[data-slot='shorts-player-sound']"),
    ).toHaveTextContent("original sound · me")
  })

  it("omits the sound row when absent", () => {
    const { container } = render(<ShortsPlayer author={author} />)
    expect(
      container.querySelector("[data-slot='shorts-player-sound']"),
    ).toBeNull()
  })
})

// ─── Engagement rail ──────────────────────────────────────────────────────────

describe("ShortsPlayer – engagement rail", () => {
  it("renders one button per engagement action", () => {
    render(<ShortsPlayer author={author} />)
    expect(screen.getByRole("button", { name: "Like" })).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Dislike" }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Comment" }),
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "More" })).toBeInTheDocument()
  })

  it("renders compact mono counts via ActionRail", () => {
    const { container } = render(
      <ShortsPlayer author={author} likeCount={128000} />,
    )
    const count = container.querySelector(
      "[data-slot='action-rail-count']",
    )
    expect(count).toHaveTextContent("128K")
    expect(count?.className).toContain("font-mono")
    expect(count?.className).toContain("tabular-nums")
  })

  it("appends extraActions to the rail", async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(
      <ShortsPlayer
        author={author}
        extraActions={[
          {
            key: "save",
            label: "Save",
            icon: <Bookmark aria-hidden />,
            onClick,
          },
        ]}
      />,
    )
    const save = screen.getByRole("button", { name: "Save" })
    expect(save).toBeInTheDocument()
    await user.click(save)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

// ─── Like / dislike ───────────────────────────────────────────────────────────

describe("ShortsPlayer – like/dislike", () => {
  it("toggles like and fires onLikedChange (uncontrolled)", async () => {
    const onLikedChange = vi.fn()
    const user = userEvent.setup()
    render(<ShortsPlayer author={author} onLikedChange={onLikedChange} />)
    const like = screen.getByRole("button", { name: "Like" })
    expect(like).toHaveAttribute("aria-pressed", "false")
    await user.click(like)
    expect(onLikedChange).toHaveBeenCalledWith(true)
    expect(like).toHaveAttribute("aria-pressed", "true")
  })

  it("liking plainly (no prior dislike) does not fire onDislikedChange", async () => {
    const onDislikedChange = vi.fn()
    const user = userEvent.setup()
    render(
      <ShortsPlayer author={author} onDislikedChange={onDislikedChange} />,
    )
    await user.click(screen.getByRole("button", { name: "Like" }))
    expect(onDislikedChange).not.toHaveBeenCalled()
  })

  it("liking clears an existing dislike (uncontrolled)", async () => {
    const onDislikedChange = vi.fn()
    const user = userEvent.setup()
    render(
      <ShortsPlayer
        author={author}
        defaultDisliked
        onDislikedChange={onDislikedChange}
      />,
    )
    const dislike = screen.getByRole("button", { name: "Dislike" })
    expect(dislike).toHaveAttribute("aria-pressed", "true")
    await user.click(screen.getByRole("button", { name: "Like" }))
    expect(onDislikedChange).toHaveBeenCalledWith(false)
    expect(dislike).toHaveAttribute("aria-pressed", "false")
  })

  it("liking clears a controlled dislike via callback only", async () => {
    const onDislikedChange = vi.fn()
    const onLikedChange = vi.fn()
    const user = userEvent.setup()
    render(
      <ShortsPlayer
        author={author}
        liked={false}
        disliked={true}
        onLikedChange={onLikedChange}
        onDislikedChange={onDislikedChange}
      />,
    )
    await user.click(screen.getByRole("button", { name: "Like" }))
    expect(onLikedChange).toHaveBeenCalledWith(true)
    expect(onDislikedChange).toHaveBeenCalledWith(false)
  })

  it("liking with a prior dislike but no dislike handler does not throw", async () => {
    const user = userEvent.setup()
    render(<ShortsPlayer author={author} defaultDisliked />)
    await user.click(screen.getByRole("button", { name: "Like" }))
    expect(
      screen.getByRole("button", { name: "Dislike" }),
    ).toHaveAttribute("aria-pressed", "false")
  })

  it("respects a controlled liked value", () => {
    render(
      <ShortsPlayer author={author} liked onLikedChange={() => {}} />,
    )
    expect(screen.getByRole("button", { name: "Like" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
  })

  it("does not self-flip a controlled liked value", async () => {
    const onLikedChange = vi.fn()
    const user = userEvent.setup()
    render(
      <ShortsPlayer
        author={author}
        liked={false}
        onLikedChange={onLikedChange}
      />,
    )
    const like = screen.getByRole("button", { name: "Like" })
    await user.click(like)
    expect(onLikedChange).toHaveBeenCalledWith(true)
    expect(like).toHaveAttribute("aria-pressed", "false")
  })

  it("does not throw when liking without a handler", async () => {
    const user = userEvent.setup()
    render(<ShortsPlayer author={author} />)
    await user.click(screen.getByRole("button", { name: "Like" }))
    expect(screen.getByRole("button", { name: "Like" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
  })

  it("toggles dislike and fires onDislikedChange (uncontrolled)", async () => {
    const onDislikedChange = vi.fn()
    const user = userEvent.setup()
    render(
      <ShortsPlayer author={author} onDislikedChange={onDislikedChange} />,
    )
    const dislike = screen.getByRole("button", { name: "Dislike" })
    expect(dislike).toHaveAttribute("aria-pressed", "false")
    await user.click(dislike)
    expect(onDislikedChange).toHaveBeenCalledWith(true)
    expect(dislike).toHaveAttribute("aria-pressed", "true")
  })

  it("respects a controlled disliked value and does not self-flip", async () => {
    const onDislikedChange = vi.fn()
    const user = userEvent.setup()
    render(
      <ShortsPlayer
        author={author}
        disliked={false}
        onDislikedChange={onDislikedChange}
      />,
    )
    const dislike = screen.getByRole("button", { name: "Dislike" })
    await user.click(dislike)
    expect(onDislikedChange).toHaveBeenCalledWith(true)
    expect(dislike).toHaveAttribute("aria-pressed", "false")
  })

  it("does not throw when disliking without a handler", async () => {
    const user = userEvent.setup()
    render(<ShortsPlayer author={author} />)
    await user.click(screen.getByRole("button", { name: "Dislike" }))
    expect(
      screen.getByRole("button", { name: "Dislike" }),
    ).toHaveAttribute("aria-pressed", "true")
  })
})

// ─── Comment / share / more ───────────────────────────────────────────────────

describe("ShortsPlayer – comment/share/more", () => {
  it("fires onComment when comment is clicked", async () => {
    const onComment = vi.fn()
    const user = userEvent.setup()
    render(<ShortsPlayer author={author} onComment={onComment} />)
    await user.click(screen.getByRole("button", { name: "Comment" }))
    expect(onComment).toHaveBeenCalledTimes(1)
  })

  it("fires onShare when share is clicked", async () => {
    const onShare = vi.fn()
    const user = userEvent.setup()
    render(<ShortsPlayer author={author} onShare={onShare} />)
    await user.click(screen.getByRole("button", { name: "Share" }))
    expect(onShare).toHaveBeenCalledTimes(1)
  })

  it("fires onMore when more is clicked", async () => {
    const onMore = vi.fn()
    const user = userEvent.setup()
    render(<ShortsPlayer author={author} onMore={onMore} />)
    await user.click(screen.getByRole("button", { name: "More" }))
    expect(onMore).toHaveBeenCalledTimes(1)
  })

  it("does not throw when comment/share/more clicked without handlers", async () => {
    const user = userEvent.setup()
    render(<ShortsPlayer author={author} />)
    await user.click(screen.getByRole("button", { name: "Comment" }))
    await user.click(screen.getByRole("button", { name: "Share" }))
    await user.click(screen.getByRole("button", { name: "More" }))
    expect(screen.getByRole("button", { name: "More" })).toBeInTheDocument()
  })
})

// ─── Accessibility ────────────────────────────────────────────────────────────

describe("ShortsPlayer – accessibility", () => {
  it("has no axe violations in the full configuration", async () => {
    const { container } = render(
      <ShortsPlayer
        posterSrc="/poster.jpg"
        author={{
          name: "Coastline Studio",
          handle: "@coastline",
          avatarSrc: "/me.jpg",
          verified: true,
        }}
        following={false}
        onFollowingChange={() => {}}
        caption="A lovely sunset over the cliffs"
        sound="original sound · me"
        likeCount={128000}
        commentCount={2400}
        shareCount={910}
        liked={false}
        disliked={false}
        onLikedChange={() => {}}
        onDislikedChange={() => {}}
        onComment={() => {}}
        onShare={() => {}}
        onMore={() => {}}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations in the minimal configuration", async () => {
    const { container } = render(<ShortsPlayer author={author} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
