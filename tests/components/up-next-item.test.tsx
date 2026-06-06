import * as React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { axe } from "vitest-axe"
import { UpNextItem } from "@/components/up-next-item"

const base = {
  title: "Building a design system from scratch",
} as const

describe("UpNextItem – smoke", () => {
  it("renders without crashing with the up-next-item data-slot", () => {
    const { container } = render(<UpNextItem {...base} />)
    expect(
      container.querySelector("[data-slot='up-next-item']"),
    ).toBeInTheDocument()
  })

  it("renders the title and the body/title slots", () => {
    const { container } = render(<UpNextItem {...base} />)
    expect(screen.getByText(base.title)).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='up-next-item-body']"),
    ).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='up-next-item-title']"),
    ).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='up-next-item-meta']"),
    ).toBeInTheDocument()
  })

  it("merges a custom className onto the root while keeping base classes", () => {
    const { container } = render(
      <UpNextItem {...base} className="custom-class" />,
    )
    const root = container.querySelector("[data-slot='up-next-item']")
    expect(root).toHaveClass("custom-class")
    expect(root).toHaveClass("flex")
  })
})

describe("UpNextItem – channel + verified", () => {
  it("renders the channel line when channelName is provided", () => {
    const { container } = render(
      <UpNextItem {...base} channelName="byronwade" />,
    )
    expect(screen.getByText("byronwade")).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='up-next-item-channel']"),
    ).toBeInTheDocument()
  })

  it("omits the channel line when channelName is absent", () => {
    const { container } = render(<UpNextItem {...base} />)
    expect(
      container.querySelector("[data-slot='up-next-item-channel']"),
    ).not.toBeInTheDocument()
  })

  it("renders the verified badge when channelName and verified are set", () => {
    const { container } = render(
      <UpNextItem {...base} channelName="byronwade" verified />,
    )
    expect(
      container.querySelector("[data-slot='verified-badge']"),
    ).toBeInTheDocument()
  })

  it("omits the verified badge when channel is set but verified is false", () => {
    const { container } = render(
      <UpNextItem {...base} channelName="byronwade" />,
    )
    expect(
      container.querySelector("[data-slot='verified-badge']"),
    ).not.toBeInTheDocument()
  })

  it("renders no verified badge when verified is true but channelName is absent", () => {
    const { container } = render(<UpNextItem {...base} verified />)
    expect(
      container.querySelector("[data-slot='verified-badge']"),
    ).not.toBeInTheDocument()
  })
})

describe("UpNextItem – meta line", () => {
  it("compact-formats the view count with mono tabular figures", () => {
    render(<UpNextItem {...base} views={2200000} />)
    const views = screen.getByText("2.2M views")
    expect(views).toHaveClass("font-mono")
    expect(views).toHaveClass("tabular-nums")
  })

  it("renders zero views (does not treat 0 as absent)", () => {
    render(<UpNextItem {...base} views={0} />)
    expect(screen.getByText("0 views")).toBeInTheDocument()
  })

  it("omits the view count when views is undefined", () => {
    render(<UpNextItem {...base} timestamp="2 months ago" />)
    expect(screen.queryByText(/views/)).not.toBeInTheDocument()
  })

  it("renders a separator only when both views and timestamp exist", () => {
    render(<UpNextItem {...base} views={1000} timestamp="1 day ago" />)
    expect(screen.getByText("·")).toBeInTheDocument()
    expect(screen.getByText("1K views")).toBeInTheDocument()
    expect(screen.getByText("1 day ago")).toBeInTheDocument()
  })

  it("omits the separator when only views exist", () => {
    render(<UpNextItem {...base} views={1000} />)
    expect(screen.queryByText("·")).not.toBeInTheDocument()
  })

  it("omits the separator when only timestamp exists", () => {
    render(<UpNextItem {...base} timestamp="1 day ago" />)
    expect(screen.queryByText("·")).not.toBeInTheDocument()
    expect(screen.getByText("1 day ago")).toBeInTheDocument()
  })

  it("omits both views and separator when neither exists", () => {
    render(<UpNextItem {...base} />)
    expect(screen.queryByText(/views/)).not.toBeInTheDocument()
    expect(screen.queryByText("·")).not.toBeInTheDocument()
  })
})

describe("UpNextItem – thumbnail forwarding", () => {
  it("forwards live and duration to the thumbnail", () => {
    const { container } = render(
      <UpNextItem {...base} live duration="12:34" />,
    )
    expect(
      container.querySelector("[data-slot='thumbnail-live']"),
    ).toBeInTheDocument()
    const dur = container.querySelector("[data-slot='thumbnail-duration']")
    expect(dur).toBeInTheDocument()
    expect(dur).toHaveTextContent("12:34")
  })

  it("forwards a progress of 0 to the thumbnail", () => {
    const { container } = render(<UpNextItem {...base} progress={0} />)
    expect(
      container.querySelector("[data-slot='thumbnail-progress']"),
    ).toBeInTheDocument()
  })

  it("renders an image thumbnail when thumbnailSrc is provided", () => {
    render(<UpNextItem {...base} thumbnailSrc="/thumb.jpg" />)
    const img = screen.getByRole("img", { name: base.title })
    expect(img).toHaveAttribute("src", "/thumb.jpg")
  })

  it("omits the live and duration chips when not provided", () => {
    const { container } = render(<UpNextItem {...base} />)
    expect(
      container.querySelector("[data-slot='thumbnail-live']"),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='thumbnail-duration']"),
    ).not.toBeInTheDocument()
  })
})

describe("UpNextItem – clickable surface", () => {
  it("renders the surface as a link when href is provided", () => {
    render(<UpNextItem {...base} href="/watch/abc" />)
    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "/watch/abc")
  })

  it("prefers href over onClick (link, not button)", () => {
    const onClick = vi.fn()
    render(<UpNextItem {...base} href="/watch/abc" onClick={onClick} />)
    expect(screen.getByRole("link")).toBeInTheDocument()
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("renders a button surface and fires onClick when clicked", () => {
    const onClick = vi.fn()
    render(<UpNextItem {...base} onClick={onClick} />)
    const root = screen.getByRole("button")
    expect(root).toHaveAttribute("tabindex", "0")
    fireEvent.click(root)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("fires onClick on Enter", () => {
    const onClick = vi.fn()
    render(<UpNextItem {...base} onClick={onClick} />)
    fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" })
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("fires onClick on Space", () => {
    const onClick = vi.fn()
    render(<UpNextItem {...base} onClick={onClick} />)
    fireEvent.keyDown(screen.getByRole("button"), { key: " " })
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("does not fire onClick on a non-activating key", () => {
    const onClick = vi.fn()
    render(<UpNextItem {...base} onClick={onClick} />)
    fireEvent.keyDown(screen.getByRole("button"), { key: "Escape" })
    expect(onClick).not.toHaveBeenCalled()
  })

  it("renders a static surface when neither href nor onClick is provided", () => {
    render(<UpNextItem {...base} />)
    expect(screen.queryByRole("link")).not.toBeInTheDocument()
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })
})

describe("UpNextItem – overflow menu", () => {
  const items = [
    {
      key: "save",
      label: "Save to playlist",
      icon: <span data-testid="save-icon" />,
      onClick: vi.fn(),
    },
    { key: "report", label: "Report" },
  ]

  it("omits the menu when menuItems is undefined", () => {
    const { container } = render(<UpNextItem {...base} />)
    expect(
      container.querySelector("[data-slot='up-next-item-menu']"),
    ).not.toBeInTheDocument()
  })

  it("renders a labelled menu trigger when menuItems is provided", () => {
    render(<UpNextItem {...base} menuItems={items} />)
    expect(
      screen.getByRole("button", { name: "More options" }),
    ).toBeInTheDocument()
  })

  it("opens the menu and fires an item onClick", async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(
      <UpNextItem
        {...base}
        menuItems={[
          { key: "save", label: "Save to playlist", onClick },
          { key: "report", label: "Report" },
        ]}
      />,
    )
    await user.click(screen.getByRole("button", { name: "More options" }))
    let item: Element | undefined
    await waitFor(() => {
      item = Array.from(
        document.querySelectorAll("[data-slot='dropdown-menu-item']"),
      ).find((el) => el.textContent?.includes("Save to playlist"))
      expect(item).toBeTruthy()
    })
    fireEvent.click(item!)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("renders an item icon when provided and plain label when not", async () => {
    const user = userEvent.setup()
    render(<UpNextItem {...base} menuItems={items} />)
    await user.click(screen.getByRole("button", { name: "More options" }))
    await waitFor(() => {
      expect(screen.getByTestId("save-icon")).toBeInTheDocument()
    })
    expect(screen.getByText("Report")).toBeInTheDocument()
  })
})

describe("UpNextItem – accessibility", () => {
  it("has no axe violations (rich link + menu render)", async () => {
    const { container } = render(
      <UpNextItem
        {...base}
        href="/watch/abc"
        thumbnailSrc="/thumb.jpg"
        duration="12:34"
        progress={42}
        live
        views={2200000}
        timestamp="2 months ago"
        channelName="byronwade"
        verified
        menuItems={[
          { key: "save", label: "Save", onClick: () => {} },
          { key: "report", label: "Report" },
        ]}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations (minimal static render)", async () => {
    const { container } = render(<UpNextItem {...base} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe("UpNextItem – preview & active", () => {
  it("starts and stops the preview video on hover", () => {
    const play = vi
      .spyOn(HTMLMediaElement.prototype, "play")
      .mockResolvedValue(undefined)
    const pause = vi
      .spyOn(HTMLMediaElement.prototype, "pause")
      .mockImplementation(() => {})
    const { container } = render(
      <UpNextItem {...base} previewSrc="/preview.mp4" thumbnailSrc="/t.jpg" />,
    )
    const media = container.querySelector(
      "[data-slot='up-next-item-media-wrap']",
    )
    expect(media).toBeInTheDocument()

    fireEvent.mouseEnter(media!)
    const preview = container.querySelector(
      "[data-slot='up-next-item-preview']",
    )
    expect(preview).toBeInTheDocument()
    fireEvent.focus(media!)
    expect(play).toHaveBeenCalledTimes(1)

    fireEvent.mouseLeave(media!)
    expect(pause).toHaveBeenCalledTimes(1)

    play.mockRestore()
    pause.mockRestore()
  })

  it("swallows rejected preview playback attempts", () => {
    const play = vi
      .spyOn(HTMLMediaElement.prototype, "play")
      .mockReturnValue({
        catch: (callback: () => void) => {
          callback()
        },
      } as unknown as Promise<void>)
    const { container } = render(<UpNextItem {...base} previewSrc="/preview.mp4" />)
    const media = container.querySelector(
      "[data-slot='up-next-item-media-wrap']",
    )

    fireEvent.mouseEnter(media!)
    fireEvent.focus(media!)

    expect(play).toHaveBeenCalledTimes(1)
    play.mockRestore()
  })

  it("shows the Now playing badge when active", () => {
    const { container } = render(<UpNextItem {...base} active />)
    expect(
      container.querySelector("[data-slot='up-next-item-now-playing']"),
    ).toHaveTextContent("Now playing")
  })

  it("sets data-active on the root when active", () => {
    const { container } = render(<UpNextItem {...base} active />)
    expect(
      container.querySelector("[data-slot='up-next-item']"),
    ).toHaveAttribute("data-active", "true")
  })

  it("tints the title with text-brand when active", () => {
    const { container } = render(<UpNextItem {...base} active />)
    expect(
      container.querySelector("[data-slot='up-next-item-title']"),
    ).toHaveClass("text-brand")
  })
})
