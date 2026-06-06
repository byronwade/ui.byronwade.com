import * as React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { axe } from "vitest-axe"
import { VideoCard } from "@/components/video-card"

const base = {
  title: "Building a design system from scratch",
  channelName: "byronwade",
} as const

describe("VideoCard – smoke", () => {
  it("renders without crashing with the video-card data-slot", () => {
    const { container } = render(<VideoCard {...base} />)
    expect(
      container.querySelector("[data-slot='video-card']"),
    ).toBeInTheDocument()
  })

  it("renders the title and channel byline", () => {
    const { container } = render(<VideoCard {...base} />)
    expect(screen.getByText(base.title)).toBeInTheDocument()
    expect(screen.getByText("byronwade")).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='video-card-byline']"),
    ).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='video-card-title']"),
    ).toBeInTheDocument()
  })

  it("merges a custom className onto the root while keeping base classes", () => {
    const { container } = render(
      <VideoCard {...base} className="custom-class" />,
    )
    const root = container.querySelector("[data-slot='video-card']")
    expect(root).toHaveClass("custom-class")
    expect(root).toHaveClass("flex")
  })

  it("renders an avatar image when channelAvatarSrc is provided", () => {
    render(<VideoCard {...base} channelAvatarSrc="/avatar.jpg" />)
    expect(screen.getByText("b")).toBeInTheDocument()
  })
})

describe("VideoCard – meta line", () => {
  it("compact-formats the view count with mono tabular figures", () => {
    render(<VideoCard {...base} views={2200000} />)
    const views = screen.getByText("2.2M views")
    expect(views).toHaveClass("font-mono")
    expect(views).toHaveClass("tabular-nums")
  })

  it("renders zero views (does not treat 0 as absent)", () => {
    render(<VideoCard {...base} views={0} />)
    expect(screen.getByText("0 views")).toBeInTheDocument()
  })

  it("omits the view count when views is undefined", () => {
    render(<VideoCard {...base} timestamp="2 months ago" />)
    expect(screen.queryByText(/views/)).not.toBeInTheDocument()
  })

  it("renders a separator only when both views and timestamp exist", () => {
    render(<VideoCard {...base} views={1000} timestamp="1 day ago" />)
    expect(screen.getByText("·")).toBeInTheDocument()
    expect(screen.getByText("1K views")).toBeInTheDocument()
    expect(screen.getByText("1 day ago")).toBeInTheDocument()
  })

  it("omits the separator when only views exist", () => {
    render(<VideoCard {...base} views={1000} />)
    expect(screen.queryByText("·")).not.toBeInTheDocument()
  })

  it("omits the separator when only timestamp exists", () => {
    render(<VideoCard {...base} timestamp="1 day ago" />)
    expect(screen.queryByText("·")).not.toBeInTheDocument()
    expect(screen.getByText("1 day ago")).toBeInTheDocument()
  })

  it("omits both views and separator when neither exists", () => {
    render(<VideoCard {...base} />)
    expect(screen.queryByText(/views/)).not.toBeInTheDocument()
    expect(screen.queryByText("·")).not.toBeInTheDocument()
  })
})

describe("VideoCard – verified badge", () => {
  it("renders the verified badge when verified is true", () => {
    const { container } = render(<VideoCard {...base} verified />)
    expect(
      container.querySelector("[data-slot='verified-badge']"),
    ).toBeInTheDocument()
  })

  it("omits the verified badge by default", () => {
    const { container } = render(<VideoCard {...base} />)
    expect(
      container.querySelector("[data-slot='verified-badge']"),
    ).not.toBeInTheDocument()
  })
})

describe("VideoCard – thumbnail forwarding", () => {
  it("forwards live and duration to the thumbnail", () => {
    const { container } = render(
      <VideoCard {...base} live duration="12:34" />,
    )
    expect(
      container.querySelector("[data-slot='thumbnail-live']"),
    ).toBeInTheDocument()
    const dur = container.querySelector("[data-slot='thumbnail-duration']")
    expect(dur).toBeInTheDocument()
    expect(dur).toHaveTextContent("12:34")
  })

  it("forwards a progress of 0 to the thumbnail", () => {
    const { container } = render(<VideoCard {...base} progress={0} />)
    expect(
      container.querySelector("[data-slot='thumbnail-progress']"),
    ).toBeInTheDocument()
  })

  it("renders an image thumbnail when thumbnailSrc is provided", () => {
    render(<VideoCard {...base} thumbnailSrc="/thumb.jpg" />)
    const img = screen.getByRole("img", { name: base.title })
    expect(img).toHaveAttribute("src", "/thumb.jpg")
  })

  it("omits the live and duration chips when not provided", () => {
    const { container } = render(<VideoCard {...base} />)
    expect(
      container.querySelector("[data-slot='thumbnail-live']"),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='thumbnail-duration']"),
    ).not.toBeInTheDocument()
  })
})

describe("VideoCard – versatile API", () => {
  it("renders horizontal, compact, and featured variants with state attributes", () => {
    const { container, rerender } = render(
      <VideoCard
        {...base}
        variant="horizontal"
        size="sm"
        density="compact"
        selected
      />,
    )
    const root = container.querySelector("[data-slot='video-card']")
    expect(root).toHaveAttribute("data-variant", "horizontal")
    expect(root).toHaveAttribute("data-size", "sm")
    expect(root).toHaveAttribute("data-density", "compact")
    expect(root).toHaveAttribute("data-selected", "true")

    rerender(<VideoCard {...base} variant="compact" />)
    expect(root).toHaveAttribute("data-variant", "compact")

    rerender(<VideoCard {...base} variant="featured" size="lg" />)
    expect(root).toHaveAttribute("data-variant", "featured")
    expect(root).toHaveAttribute("data-size", "lg")
  })

  it("maps large cards to the default avatar size", () => {
    const { container } = render(<VideoCard {...base} size="lg" />)
    expect(container.querySelector("[data-slot='avatar']")).toHaveAttribute(
      "data-size",
      "default",
    )
  })

  it("renders overlay content, badges, description, custom stats, and actions", () => {
    const { container } = render(
      <VideoCard
        {...base}
        variant="overlay"
        description="A practical walkthrough of primitives and composites."
        badges={<span>Premiere</span>}
        stats={<span>Watching now</span>}
        actions={<button type="button">Save</button>}
      />,
    )

    expect(container.querySelector("[data-slot='video-card-badges']")).toHaveTextContent(
      "Premiere",
    )
    expect(
      container.querySelector("[data-slot='video-card-description']"),
    ).toHaveTextContent("A practical walkthrough")
    expect(container.querySelector("[data-slot='video-card-meta']")).toHaveTextContent(
      "Watching now",
    )
    expect(container.querySelector("[data-slot='video-card-actions']")).toHaveTextContent(
      "Save",
    )
  })

  it("forwards thumbnailRatio to the thumbnail AspectRatio wrapper", () => {
    const { container } = render(
      <VideoCard {...base} thumbnailRatio={1} thumbnailSrc="/square.jpg" />,
    )
    const aspect = container.querySelector("[data-slot='aspect-ratio']")
    expect(aspect).toHaveStyle({ "--ratio": "1" })
  })

  it("suppresses disabled card interactions", () => {
    const onClick = vi.fn()
    const { container } = render(
      <VideoCard {...base} disabled onClick={onClick} />,
    )
    const root = container.querySelector("[data-slot='video-card']")
    expect(root).toHaveAttribute("data-disabled", "true")
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
    fireEvent.click(screen.getByText(base.title))
    expect(onClick).not.toHaveBeenCalled()
  })
})

describe("VideoCard – clickable surface", () => {
  it("renders thumbnail and title as links when href is provided", () => {
    render(<VideoCard {...base} href="/watch/abc" />)
    const links = screen.getAllByRole("link")
    expect(links.length).toBeGreaterThanOrEqual(2)
    for (const link of links) {
      expect(link).toHaveAttribute("href", "/watch/abc")
    }
  })

  it("prefers href over onClick (links, not button surfaces)", () => {
    const onClick = vi.fn()
    render(<VideoCard {...base} href="/watch/abc" onClick={onClick} />)
    expect(screen.getAllByRole("link").length).toBeGreaterThanOrEqual(2)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("renders button surfaces and fires onClick when the title is clicked", () => {
    const onClick = vi.fn()
    render(<VideoCard {...base} onClick={onClick} />)
    const surfaces = screen.getAllByRole("button")
    expect(surfaces.length).toBeGreaterThanOrEqual(2)
    fireEvent.click(screen.getByText(base.title))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("fires onClick on Enter from a button surface", () => {
    const onClick = vi.fn()
    render(<VideoCard {...base} onClick={onClick} />)
    fireEvent.keyDown(screen.getAllByRole("button")[0], { key: "Enter" })
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("fires onClick on Space from a button surface", () => {
    const onClick = vi.fn()
    render(<VideoCard {...base} onClick={onClick} />)
    fireEvent.keyDown(screen.getAllByRole("button")[0], { key: " " })
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("does not fire onClick on a non-activating key", () => {
    const onClick = vi.fn()
    render(<VideoCard {...base} onClick={onClick} />)
    fireEvent.keyDown(screen.getAllByRole("button")[0], { key: "Escape" })
    expect(onClick).not.toHaveBeenCalled()
  })

  it("renders a static surface when neither href nor onClick is provided", () => {
    render(<VideoCard {...base} />)
    expect(screen.queryByRole("link")).not.toBeInTheDocument()
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })
})

describe("VideoCard – overflow menu", () => {
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
    const { container } = render(<VideoCard {...base} />)
    expect(
      container.querySelector("[data-slot='video-card-menu']"),
    ).not.toBeInTheDocument()
  })

  it("renders a labelled menu trigger when menuItems is provided", () => {
    render(<VideoCard {...base} menuItems={items} />)
    expect(
      screen.getByRole("button", { name: "More options" }),
    ).toBeInTheDocument()
  })

  it("opens the menu and fires an item onClick", async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(
      <VideoCard
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

  it("renders an item icon when provided", async () => {
    const user = userEvent.setup()
    render(<VideoCard {...base} menuItems={items} />)
    await user.click(screen.getByRole("button", { name: "More options" }))
    await waitFor(() => {
      expect(screen.getByTestId("save-icon")).toBeInTheDocument()
    })
    expect(screen.getByText("Report")).toBeInTheDocument()
  })
})

describe("VideoCard – accessibility", () => {
  it("has no axe violations (rich link + menu render)", async () => {
    const { container } = render(
      <VideoCard
        {...base}
        href="/watch/abc"
        thumbnailSrc="/thumb.jpg"
        duration="12:34"
        progress={42}
        views={2200000}
        timestamp="2 months ago"
        channelAvatarSrc="/avatar.jpg"
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
    const { container } = render(<VideoCard {...base} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
