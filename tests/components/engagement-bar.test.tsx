import * as React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { axe } from "vitest-axe"
import { Scissors, Flag } from "lucide-react"
import {
  EngagementBar,
  type EngagementAction,
} from "@/components/engagement-bar"

// ─── Default render ───────────────────────────────────────────────────────────

describe("EngagementBar – default render", () => {
  it("renders the root with data-slot", () => {
    const { container } = render(<EngagementBar />)
    expect(
      container.querySelector("[data-slot='engagement-bar']"),
    ).toBeInTheDocument()
  })

  it("renders like, dislike, share, and save parts", () => {
    const { container } = render(<EngagementBar />)
    expect(
      container.querySelector("[data-slot='engagement-bar-like']"),
    ).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='engagement-bar-dislike']"),
    ).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='engagement-bar-share']"),
    ).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='engagement-bar-save']"),
    ).toBeInTheDocument()
  })

  it("merges a custom className onto the root", () => {
    const { container } = render(<EngagementBar className="custom-class" />)
    const root = container.querySelector("[data-slot='engagement-bar']")
    expect(root).toHaveClass("custom-class")
    expect(root).toHaveClass("flex")
  })
})

// ─── Like count ───────────────────────────────────────────────────────────────

describe("EngagementBar – like count", () => {
  it("renders a compact mono like count when provided", () => {
    const { container } = render(<EngagementBar likeCount={88000} />)
    const count = container.querySelector(
      "[data-slot='engagement-bar-like-count']",
    )
    expect(count).toHaveTextContent("88K")
    expect(count?.className).toContain("font-mono")
    expect(count?.className).toContain("tabular-nums")
  })

  it("omits the like count when undefined", () => {
    const { container } = render(<EngagementBar />)
    expect(
      container.querySelector("[data-slot='engagement-bar-like-count']"),
    ).toBeNull()
  })
})

// ─── Like / dislike – uncontrolled ────────────────────────────────────────────

describe("EngagementBar – like/dislike uncontrolled", () => {
  it("toggles like and fires onLikedChange (uncontrolled)", async () => {
    const onLikedChange = vi.fn()
    const user = userEvent.setup()
    render(
      <EngagementBar defaultLiked={false} onLikedChange={onLikedChange} />,
    )
    const like = screen.getByRole("button", { name: "Like" })
    expect(like).toHaveAttribute("aria-pressed", "false")
    await user.click(like)
    expect(onLikedChange).toHaveBeenCalledWith(true)
    expect(like).toHaveAttribute("aria-pressed", "true")
  })

  it("clears dislike when liking (uncontrolled mutual exclusion)", async () => {
    const onDislikedChange = vi.fn()
    const user = userEvent.setup()
    render(
      <EngagementBar
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

  it("toggles dislike and fires onDislikedChange, clearing like (uncontrolled)", async () => {
    const onDislikedChange = vi.fn()
    const onLikedChange = vi.fn()
    const user = userEvent.setup()
    render(
      <EngagementBar
        defaultLiked
        onLikedChange={onLikedChange}
        onDislikedChange={onDislikedChange}
      />,
    )
    const like = screen.getByRole("button", { name: "Like" })
    expect(like).toHaveAttribute("aria-pressed", "true")
    await user.click(screen.getByRole("button", { name: "Dislike" }))
    expect(onDislikedChange).toHaveBeenCalledWith(true)
    expect(onLikedChange).toHaveBeenCalledWith(false)
    expect(like).toHaveAttribute("aria-pressed", "false")
  })

  it("un-likes when liking again (next === false)", async () => {
    const onLikedChange = vi.fn()
    const user = userEvent.setup()
    render(<EngagementBar defaultLiked onLikedChange={onLikedChange} />)
    const like = screen.getByRole("button", { name: "Like" })
    expect(like).toHaveAttribute("aria-pressed", "true")
    await user.click(like)
    expect(onLikedChange).toHaveBeenCalledWith(false)
    expect(like).toHaveAttribute("aria-pressed", "false")
  })

  it("un-dislikes when disliking again (next === false)", async () => {
    const onDislikedChange = vi.fn()
    const user = userEvent.setup()
    render(
      <EngagementBar defaultDisliked onDislikedChange={onDislikedChange} />,
    )
    const dislike = screen.getByRole("button", { name: "Dislike" })
    expect(dislike).toHaveAttribute("aria-pressed", "true")
    await user.click(dislike)
    expect(onDislikedChange).toHaveBeenCalledWith(false)
    expect(dislike).toHaveAttribute("aria-pressed", "false")
  })

  it("does not throw when liking without handlers", async () => {
    const user = userEvent.setup()
    render(<EngagementBar />)
    await user.click(screen.getByRole("button", { name: "Like" }))
    expect(screen.getByRole("button", { name: "Like" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
  })

  it("does not throw when disliking without handlers", async () => {
    const user = userEvent.setup()
    render(<EngagementBar />)
    await user.click(screen.getByRole("button", { name: "Dislike" }))
    expect(screen.getByRole("button", { name: "Dislike" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
  })
})

// ─── Like / dislike – controlled ──────────────────────────────────────────────

describe("EngagementBar – grouped ToggleState API", () => {
  it("toggles like via grouped like prop", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <EngagementBar
        like={{ defaultValue: false, onValueChange }}
      />,
    )
    await user.click(screen.getByRole("button", { name: "Like" }))
    expect(onValueChange).toHaveBeenCalledWith(true)
  })

  it("respects grouped like.value when controlled", () => {
    render(<EngagementBar like={{ value: true }} />)
    expect(screen.getByRole("button", { name: "Like" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
  })
})

describe("EngagementBar – like/dislike controlled", () => {
  it("respects a controlled liked value", () => {
    render(<EngagementBar liked onLikedChange={() => {}} />)
    expect(screen.getByRole("button", { name: "Like" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
  })

  it("respects a controlled disliked value", () => {
    render(<EngagementBar disliked onDislikedChange={() => {}} />)
    expect(screen.getByRole("button", { name: "Dislike" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
  })

  it("does not flip aria-pressed on its own when controlled", async () => {
    const onLikedChange = vi.fn()
    const user = userEvent.setup()
    render(<EngagementBar liked={false} onLikedChange={onLikedChange} />)
    const like = screen.getByRole("button", { name: "Like" })
    await user.click(like)
    expect(onLikedChange).toHaveBeenCalledWith(true)
    // Parent owns state; without a prop change it stays unpressed.
    expect(like).toHaveAttribute("aria-pressed", "false")
  })

  it("fires both callbacks when liking clears a controlled dislike", async () => {
    const onLikedChange = vi.fn()
    const onDislikedChange = vi.fn()
    const user = userEvent.setup()
    render(
      <EngagementBar
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

  it("fires both callbacks when disliking clears a controlled like", async () => {
    const onLikedChange = vi.fn()
    const onDislikedChange = vi.fn()
    const user = userEvent.setup()
    render(
      <EngagementBar
        liked={true}
        disliked={false}
        onLikedChange={onLikedChange}
        onDislikedChange={onDislikedChange}
      />,
    )
    await user.click(screen.getByRole("button", { name: "Dislike" }))
    expect(onDislikedChange).toHaveBeenCalledWith(true)
    expect(onLikedChange).toHaveBeenCalledWith(false)
  })
})

// ─── Share ────────────────────────────────────────────────────────────────────

describe("EngagementBar – share", () => {
  it("fires onShare when the share pill is clicked", async () => {
    const onShare = vi.fn()
    const user = userEvent.setup()
    render(<EngagementBar onShare={onShare} />)
    await user.click(screen.getByRole("button", { name: /share/i }))
    expect(onShare).toHaveBeenCalledTimes(1)
  })

  it("does not throw when share is clicked without onShare", async () => {
    const user = userEvent.setup()
    render(<EngagementBar />)
    await user.click(screen.getByRole("button", { name: /share/i }))
    expect(screen.getByRole("button", { name: /share/i })).toBeInTheDocument()
  })

  it("renders a custom shareLabel", () => {
    render(<EngagementBar shareLabel="Send" />)
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument()
  })
})

// ─── Save ─────────────────────────────────────────────────────────────────────

describe("EngagementBar – save", () => {
  it("toggles save and swaps the icon (uncontrolled)", async () => {
    const onSavedChange = vi.fn()
    const user = userEvent.setup()
    const { container } = render(
      <EngagementBar onSavedChange={onSavedChange} />,
    )
    const save = container.querySelector(
      "[data-slot='engagement-bar-save']",
    ) as HTMLButtonElement
    expect(save).toHaveAttribute("aria-pressed", "false")
    expect(save).toHaveTextContent("Save")
    await user.click(save)
    expect(onSavedChange).toHaveBeenCalledWith(true)
    expect(save).toHaveAttribute("aria-pressed", "true")
    expect(save).toHaveTextContent("Saved")
  })

  it("respects a controlled saved value", () => {
    const { container } = render(
      <EngagementBar saved onSavedChange={() => {}} />,
    )
    const save = container.querySelector("[data-slot='engagement-bar-save']")
    expect(save).toHaveAttribute("aria-pressed", "true")
    expect(save).toHaveTextContent("Saved")
  })

  it("fires onSavedChange but does not self-flip when controlled", async () => {
    const onSavedChange = vi.fn()
    const user = userEvent.setup()
    const { container } = render(
      <EngagementBar saved={false} onSavedChange={onSavedChange} />,
    )
    const save = container.querySelector(
      "[data-slot='engagement-bar-save']",
    ) as HTMLButtonElement
    await user.click(save)
    expect(onSavedChange).toHaveBeenCalledWith(true)
    expect(save).toHaveAttribute("aria-pressed", "false")
  })

  it("does not throw when save is clicked without onSavedChange", async () => {
    const user = userEvent.setup()
    const { container } = render(<EngagementBar defaultSaved />)
    const save = container.querySelector(
      "[data-slot='engagement-bar-save']",
    ) as HTMLButtonElement
    await user.click(save)
    expect(save).toHaveAttribute("aria-pressed", "false")
  })
})

// ─── Extra actions ────────────────────────────────────────────────────────────

describe("EngagementBar – extra actions", () => {
  const actions: EngagementAction[] = [
    { key: "clip", label: "Clip", icon: <Scissors data-testid="clip-icon" /> },
    { key: "thanks", label: "Thanks" },
  ]

  it("renders extra action pills", () => {
    render(<EngagementBar actions={actions} />)
    expect(screen.getByRole("button", { name: /clip/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Thanks" })).toBeInTheDocument()
  })

  it("renders an action icon when provided and none when absent", () => {
    const { container } = render(<EngagementBar actions={actions} />)
    expect(screen.getByTestId("clip-icon")).toBeInTheDocument()
    const thanks = screen
      .getByText("Thanks")
      .closest("[data-slot='engagement-bar-action']")
    expect(thanks?.querySelector("svg")).toBeNull()
    expect(container).toBeTruthy()
  })

  it("fires an action onClick", async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(
      <EngagementBar actions={[{ key: "clip", label: "Clip", onClick }]} />,
    )
    await user.click(screen.getByRole("button", { name: "Clip" }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("does not throw when an action without onClick is clicked", async () => {
    const user = userEvent.setup()
    render(<EngagementBar actions={[{ key: "x", label: "Noop" }]} />)
    await user.click(screen.getByRole("button", { name: "Noop" }))
    expect(screen.getByRole("button", { name: "Noop" })).toBeInTheDocument()
  })

  it("renders no action pills when actions is undefined", () => {
    const { container } = render(<EngagementBar />)
    expect(
      container.querySelector("[data-slot='engagement-bar-action']"),
    ).toBeNull()
  })
})

// ─── Overflow menu ────────────────────────────────────────────────────────────

describe("EngagementBar – overflow menu", () => {
  it("omits the menu when menuItems is undefined", () => {
    const { container } = render(<EngagementBar />)
    expect(
      container.querySelector("[data-slot='engagement-bar-menu']"),
    ).toBeNull()
  })

  it("omits the menu when menuItems is empty", () => {
    const { container } = render(<EngagementBar menuItems={[]} />)
    expect(
      container.querySelector("[data-slot='engagement-bar-menu']"),
    ).toBeNull()
  })

  it("renders a labelled trigger when menuItems is provided", () => {
    render(
      <EngagementBar menuItems={[{ key: "report", label: "Report" }]} />,
    )
    expect(
      screen.getByRole("button", { name: "More actions" }),
    ).toBeInTheDocument()
  })

  it("opens the menu and fires an item onClick", async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(
      <EngagementBar
        menuItems={[
          {
            key: "playlist",
            label: "Save to playlist",
            icon: <Flag data-testid="report-icon" />,
            onClick,
          },
          { key: "report", label: "Report" },
        ]}
      />,
    )
    await user.click(screen.getByRole("button", { name: "More actions" }))
    let item: Element | undefined
    await waitFor(() => {
      item = Array.from(
        document.querySelectorAll("[data-slot='dropdown-menu-item']"),
      ).find((el) => el.textContent?.includes("Save to playlist"))
      expect(item).toBeTruthy()
    })
    expect(screen.getByTestId("report-icon")).toBeInTheDocument()
    fireEvent.click(item!)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("does not throw when a menu item without onClick is chosen", async () => {
    const user = userEvent.setup()
    render(
      <EngagementBar menuItems={[{ key: "report", label: "Report" }]} />,
    )
    await user.click(screen.getByRole("button", { name: "More actions" }))
    let item: Element | undefined
    await waitFor(() => {
      item = Array.from(
        document.querySelectorAll("[data-slot='dropdown-menu-item']"),
      ).find((el) => el.textContent?.includes("Report"))
      expect(item).toBeTruthy()
    })
    fireEvent.click(item!)
    expect(
      screen.getByRole("button", { name: "More actions" }),
    ).toBeInTheDocument()
  })
})

// ─── Accessibility ────────────────────────────────────────────────────────────

describe("EngagementBar – clip & remix", () => {
  it("renders Clip and Remix pills when handlers are provided", () => {
    const { container } = render(
      <EngagementBar onClip={() => {}} onRemix={() => {}} />,
    )
    expect(
      container.querySelector("[data-slot='engagement-bar-clip']"),
    ).toHaveTextContent("Clip")
    expect(
      container.querySelector("[data-slot='engagement-bar-remix']"),
    ).toHaveTextContent("Remix")
  })

  it("omits Clip and Remix when handlers are absent", () => {
    const { container } = render(<EngagementBar />)
    expect(
      container.querySelector("[data-slot='engagement-bar-clip']"),
    ).toBeNull()
    expect(
      container.querySelector("[data-slot='engagement-bar-remix']"),
    ).toBeNull()
  })

  it("fires onClip when the Clip pill is clicked", () => {
    const onClip = vi.fn()
    render(<EngagementBar onClip={onClip} />)
    fireEvent.click(screen.getByRole("button", { name: "Clip" }))
    expect(onClip).toHaveBeenCalledTimes(1)
  })

  it("fires onRemix when the Remix pill is clicked", () => {
    const onRemix = vi.fn()
    render(<EngagementBar onRemix={onRemix} />)
    fireEvent.click(screen.getByRole("button", { name: "Remix" }))
    expect(onRemix).toHaveBeenCalledTimes(1)
  })
})

describe("EngagementBar – accessibility", () => {
  it("has no axe violations in the full configuration", async () => {
    const { container } = render(
      <EngagementBar
        liked={false}
        disliked={false}
        likeCount={88000}
        onShare={() => {}}
        saved={false}
        onLikedChange={() => {}}
        onDislikedChange={() => {}}
        onSavedChange={() => {}}
        actions={[{ key: "clip", label: "Clip" }]}
        menuItems={[{ key: "report", label: "Report" }]}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations in the minimal configuration", async () => {
    const { container } = render(<EngagementBar />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
