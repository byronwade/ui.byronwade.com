import * as React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, describe, it, vi } from "vitest"
import { axe } from "vitest-axe"
import { CommentComposer } from "@/components/comment-composer"

// Helper: grab the input by its accessible name (aria-label === placeholder).
function getInput(name = "Add a comment…"): HTMLTextAreaElement {
  return screen.getByLabelText(name) as HTMLTextAreaElement
}

// ─── Smoke / default render ─────────────────────────────────────────────────────

describe("CommentComposer – smoke", () => {
  it("renders without crashing and exposes the root data-slot", () => {
    const { container } = render(<CommentComposer />)
    expect(
      container.querySelector('[data-slot="comment-composer"]'),
    ).toBeInTheDocument()
  })

  it("renders the avatar part with its data-slot", () => {
    const { container } = render(<CommentComposer />)
    expect(
      container.querySelector('[data-slot="comment-composer-avatar"]'),
    ).toBeInTheDocument()
  })

  it("renders the input part with its data-slot", () => {
    const { container } = render(<CommentComposer />)
    expect(
      container.querySelector('[data-slot="comment-composer-input"]'),
    ).toBeInTheDocument()
  })

  it("uses the default placeholder", () => {
    render(<CommentComposer />)
    expect(getInput()).toHaveAttribute("placeholder", "Add a comment…")
  })

  it("renders fallback initials from currentUserName", () => {
    render(<CommentComposer currentUserName="Byron Wade" />)
    expect(screen.getByText("BW")).toBeInTheDocument()
  })

  it("renders a '?' fallback when no name is provided", () => {
    render(<CommentComposer />)
    expect(screen.getByText("?")).toBeInTheDocument()
  })

  it("renders single-letter initials for a one-word name", () => {
    render(<CommentComposer currentUserName="Madonna" />)
    expect(screen.getByText("M")).toBeInTheDocument()
  })

  it("renders a '?' fallback for a whitespace-only name", () => {
    // name is truthy but trims to nothing → parts.length === 0 branch.
    render(<CommentComposer currentUserName="   " />)
    expect(screen.getByText("?")).toBeInTheDocument()
  })

  it("derives initials from a name with extra internal whitespace", () => {
    render(<CommentComposer currentUserName="  Jane   Doe  " />)
    expect(screen.getByText("JD")).toBeInTheDocument()
  })
})

// ─── Action row visibility ──────────────────────────────────────────────────────

describe("CommentComposer – action row visibility", () => {
  it("hides the action row initially (uncontrolled, empty, closed)", () => {
    const { container } = render(<CommentComposer />)
    expect(
      container.querySelector('[data-slot="comment-composer-actions"]'),
    ).toBeNull()
  })

  it("fires onOpenChange when focused in uncontrolled mode", () => {
    const onOpenChange = vi.fn()
    render(<CommentComposer onOpenChange={onOpenChange} />)
    fireEvent.focus(getInput())
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it("shows the action row on focus", () => {
    const { container } = render(<CommentComposer />)
    fireEvent.focus(getInput())
    expect(
      container.querySelector('[data-slot="comment-composer-actions"]'),
    ).toBeInTheDocument()
  })

  it("does not call onOpenChange on focus when open is controlled", () => {
    // openProp is defined → handleFocus skips the setOpen(true) branch (line 91 false-path).
    const onOpenChange = vi.fn()
    const { container } = render(
      <CommentComposer open onOpenChange={onOpenChange} />,
    )
    fireEvent.focus(getInput())
    expect(onOpenChange).not.toHaveBeenCalled()
    // Row stays visible because open is forced true.
    expect(
      container.querySelector('[data-slot="comment-composer-actions"]'),
    ).toBeInTheDocument()
  })

  it("shows the action row when value is non-empty (uncontrolled defaultValue)", () => {
    const { container } = render(<CommentComposer defaultValue="hi" />)
    expect(
      container.querySelector('[data-slot="comment-composer-actions"]'),
    ).toBeInTheDocument()
  })

  it("shows the action row when value is non-empty (controlled)", () => {
    const { container } = render(<CommentComposer value="hello" />)
    expect(
      container.querySelector('[data-slot="comment-composer-actions"]'),
    ).toBeInTheDocument()
  })

  it("shows the action row when open is true even with empty value", () => {
    const { container } = render(<CommentComposer open />)
    expect(
      container.querySelector('[data-slot="comment-composer-actions"]'),
    ).toBeInTheDocument()
  })

  it("shows the action row when defaultOpen is true", () => {
    const { container } = render(<CommentComposer defaultOpen />)
    expect(
      container.querySelector('[data-slot="comment-composer-actions"]'),
    ).toBeInTheDocument()
  })

  it("treats whitespace-only value as empty (row stays hidden)", () => {
    const { container } = render(<CommentComposer value="   " />)
    expect(
      container.querySelector('[data-slot="comment-composer-actions"]'),
    ).toBeNull()
  })
})

// ─── Typing → value + onValueChange ─────────────────────────────────────────────

describe("CommentComposer – typing (uncontrolled)", () => {
  it("updates the displayed value as the user types", async () => {
    const user = userEvent.setup()
    render(<CommentComposer />)
    const input = getInput()
    await user.type(input, "Nice")
    expect(input.value).toBe("Nice")
  })

  it("fires onValueChange with each new value", () => {
    const onValueChange = vi.fn()
    render(<CommentComposer onValueChange={onValueChange} />)
    fireEvent.change(getInput(), { target: { value: "abc" } })
    expect(onValueChange).toHaveBeenCalledWith("abc")
  })
})

describe("CommentComposer – typing (controlled)", () => {
  it("does not change its own value when controlled (parent owns it)", () => {
    render(<CommentComposer value="fixed" />)
    fireEvent.change(getInput(), { target: { value: "typed" } })
    expect(getInput().value).toBe("fixed")
  })

  it("still fires onValueChange when controlled", () => {
    const onValueChange = vi.fn()
    render(<CommentComposer value="fixed" onValueChange={onValueChange} />)
    fireEvent.change(getInput(), { target: { value: "next" } })
    expect(onValueChange).toHaveBeenCalledWith("next")
  })

  it("reflects an updated controlled value on re-render", () => {
    const { rerender } = render(<CommentComposer value="one" />)
    expect(getInput().value).toBe("one")
    rerender(<CommentComposer value="two" />)
    expect(getInput().value).toBe("two")
  })
})

// ─── Comment button disabled state ──────────────────────────────────────────────

describe("CommentComposer – Comment button enabled/disabled", () => {
  it("disables Comment when value is empty (open via prop)", () => {
    render(<CommentComposer open />)
    expect(screen.getByRole("button", { name: "Comment" })).toBeDisabled()
  })

  it("disables Comment for whitespace-only value", () => {
    render(<CommentComposer value="   " open />)
    expect(screen.getByRole("button", { name: "Comment" })).toBeDisabled()
  })

  it("enables Comment when value is non-empty", () => {
    render(<CommentComposer value="hello" />)
    expect(screen.getByRole("button", { name: "Comment" })).not.toBeDisabled()
  })
})

// ─── Submit behavior ────────────────────────────────────────────────────────────

describe("CommentComposer – submit", () => {
  it("fires onSubmit with the current value then clears (uncontrolled)", () => {
    const onSubmit = vi.fn()
    render(<CommentComposer defaultValue="Great video" onSubmit={onSubmit} />)
    fireEvent.click(screen.getByRole("button", { name: "Comment" }))
    expect(onSubmit).toHaveBeenCalledWith("Great video")
    expect(getInput().value).toBe("")
  })

  it("does not clear when controlled (parent owns the value)", () => {
    const onSubmit = vi.fn()
    render(<CommentComposer value="Owned" onSubmit={onSubmit} />)
    fireEvent.click(screen.getByRole("button", { name: "Comment" }))
    expect(onSubmit).toHaveBeenCalledWith("Owned")
    expect(getInput().value).toBe("Owned")
  })

  it("does not throw when onSubmit is not provided", () => {
    render(<CommentComposer defaultValue="x" />)
    expect(() =>
      fireEvent.click(screen.getByRole("button", { name: "Comment" })),
    ).not.toThrow()
  })

  it("collapses the action row after submit (uncontrolled, was opened by value)", () => {
    const { container } = render(<CommentComposer defaultValue="bye" />)
    expect(
      container.querySelector('[data-slot="comment-composer-actions"]'),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Comment" }))
    // Cleared value + never focused → row collapses.
    expect(
      container.querySelector('[data-slot="comment-composer-actions"]'),
    ).toBeNull()
  })
})

// ─── Cancel behavior ────────────────────────────────────────────────────────────

describe("CommentComposer – cancel", () => {
  it("fires onCancel, clears, and collapses (uncontrolled)", () => {
    const onCancel = vi.fn()
    const { container } = render(
      <CommentComposer defaultValue="oops" onCancel={onCancel} />,
    )
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(getInput().value).toBe("")
    expect(
      container.querySelector('[data-slot="comment-composer-actions"]'),
    ).toBeNull()
  })

  it("collapses after Cancel even when opened by focus", () => {
    const { container } = render(<CommentComposer />)
    fireEvent.focus(getInput())
    expect(
      container.querySelector('[data-slot="comment-composer-actions"]'),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
    expect(
      container.querySelector('[data-slot="comment-composer-actions"]'),
    ).toBeNull()
  })

  it("does not clear on Cancel when controlled", () => {
    const onCancel = vi.fn()
    render(<CommentComposer value="kept" onCancel={onCancel} />)
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(getInput().value).toBe("kept")
  })

  it("does not throw when onCancel is not provided", () => {
    render(<CommentComposer open />)
    expect(() =>
      fireEvent.click(screen.getByRole("button", { name: "Cancel" })),
    ).not.toThrow()
  })

  it("Cancel keeps the row visible when open prop forces it open", () => {
    const { container } = render(<CommentComposer open />)
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
    // open===true still resolves true regardless of internal collapse.
    expect(
      container.querySelector('[data-slot="comment-composer-actions"]'),
    ).toBeInTheDocument()
  })
})

// ─── Customizable labels / placeholder ──────────────────────────────────────────

describe("CommentComposer – customization", () => {
  it("supports a custom placeholder (and aria-label matches it)", () => {
    render(<CommentComposer placeholder="Reply to Byron…" />)
    expect(screen.getByLabelText("Reply to Byron…")).toBeInTheDocument()
  })

  it("supports custom submit and cancel labels", () => {
    render(
      <CommentComposer open submitLabel="Post" cancelLabel="Dismiss" value="x" />,
    )
    expect(screen.getByRole("button", { name: "Post" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument()
  })

  it("merges a custom className onto the root", () => {
    const { container } = render(<CommentComposer className="my-custom" />)
    const root = container.querySelector('[data-slot="comment-composer"]')
    expect(root?.className).toContain("my-custom")
    expect(root?.className).toContain("flex")
  })

  it("renders the avatar (with fallback) when avatarSrc is provided", () => {
    // jsdom never fires the image load event, so AvatarImage stays unmounted
    // and the fallback initials show — but the avatarSrc branch is exercised.
    const { container } = render(
      <CommentComposer avatarSrc="/me.png" currentUserName="Byron Wade" />,
    )
    expect(
      container.querySelector('[data-slot="comment-composer-avatar"]'),
    ).toBeInTheDocument()
    expect(screen.getByText("BW")).toBeInTheDocument()
  })
})

// ─── A11y ───────────────────────────────────────────────────────────────────────

describe("CommentComposer – accessibility", () => {
  it("has no axe violations in the collapsed state", async () => {
    const { container } = render(
      <CommentComposer currentUserName="Byron Wade" />,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("has no axe violations with the action row open and a value", async () => {
    const { container } = render(
      <CommentComposer currentUserName="Byron Wade" value="A thoughtful note" />,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
