import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { ChannelHeader } from "@/components/channel-header"

function root() {
  return document.querySelector(
    '[data-slot="channel-header"]',
  ) as HTMLElement
}

describe("ChannelHeader", () => {
  it("renders the root data-slot and the name", () => {
    render(<ChannelHeader name="Marques Brownlee" />)
    expect(root()).toBeInTheDocument()
    expect(screen.getByText("Marques Brownlee")).toBeInTheDocument()
  })

  it("renders the handle in the meta line", () => {
    render(<ChannelHeader name="MKBHD" handle="@mkbhd" />)
    expect(
      document.querySelector('[data-slot="channel-header-meta"]'),
    ).toBeInTheDocument()
    expect(screen.getByText("@mkbhd")).toBeInTheDocument()
  })

  it("shows a verified badge only when verified", () => {
    const { rerender } = render(<ChannelHeader name="A" />)
    expect(
      document.querySelector('[data-slot="verified-badge"]'),
    ).toBeNull()
    rerender(<ChannelHeader name="A" verified />)
    expect(
      document.querySelector('[data-slot="verified-badge"]'),
    ).toBeInTheDocument()
  })

  it("compact-formats subscriber and video counts", () => {
    render(
      <ChannelHeader
        name="A"
        subscriberCount={21000000}
        videoCount={1800}
      />,
    )
    expect(screen.getByText("21M subscribers")).toBeInTheDocument()
    expect(screen.getByText("1.8K videos")).toBeInTheDocument()
  })

  it("renders separators only between present meta parts (all parts)", () => {
    render(
      <ChannelHeader
        name="A"
        handle="@a"
        subscriberCount={1000}
        videoCount={50}
      />,
    )
    const meta = document.querySelector(
      '[data-slot="channel-header-meta"]',
    ) as HTMLElement
    // three parts -> two separators
    const seps = within(meta).getAllByText("·")
    expect(seps).toHaveLength(2)
  })

  it("renders one separator with two present parts", () => {
    render(<ChannelHeader name="A" handle="@a" videoCount={50} />)
    const meta = document.querySelector(
      '[data-slot="channel-header-meta"]',
    ) as HTMLElement
    expect(within(meta).getAllByText("·")).toHaveLength(1)
    // handle + videos present, subscribers absent
    expect(screen.queryByText(/subscribers/)).toBeNull()
  })

  it("renders no separator with a single present part", () => {
    render(<ChannelHeader name="A" subscriberCount={500} />)
    const meta = document.querySelector(
      '[data-slot="channel-header-meta"]',
    ) as HTMLElement
    expect(within(meta).queryByText("·")).toBeNull()
    expect(screen.getByText("500 subscribers")).toBeInTheDocument()
  })

  it("omits the meta line entirely when no meta parts are present", () => {
    render(<ChannelHeader name="A" />)
    expect(
      document.querySelector('[data-slot="channel-header-meta"]'),
    ).toBeNull()
  })

  it("renders zero counts (uses != null, not truthiness)", () => {
    render(<ChannelHeader name="A" subscriberCount={0} videoCount={0} />)
    expect(screen.getByText("0 subscribers")).toBeInTheDocument()
    expect(screen.getByText("0 videos")).toBeInTheDocument()
  })

  it("renders the description when provided and omits it otherwise", () => {
    const { rerender } = render(<ChannelHeader name="A" />)
    expect(screen.queryByText("A great channel")).toBeNull()
    rerender(<ChannelHeader name="A" description="A great channel" />)
    expect(screen.getByText("A great channel")).toBeInTheDocument()
  })

  it("renders the banner when provided and omits it otherwise", () => {
    const { rerender } = render(<ChannelHeader name="A" />)
    expect(
      document.querySelector('[data-slot="channel-header-banner"]'),
    ).toBeNull()
    rerender(<ChannelHeader name="A" bannerSrc="https://x.test/b.jpg" />)
    const banner = document.querySelector(
      '[data-slot="channel-header-banner"]',
    ) as HTMLImageElement
    expect(banner).toBeInTheDocument()
    expect(banner).toHaveAttribute("src", "https://x.test/b.jpg")
  })

  it("renders the avatar fallback initials, with and without an avatarSrc", () => {
    // jsdom never fires image load events, so AvatarImage stays unmounted and
    // the fallback shows in both cases — both ternary branches are exercised.
    const { rerender } = render(<ChannelHeader name="Marques Brownlee" />)
    expect(screen.getByText("MA")).toBeInTheDocument()
    rerender(
      <ChannelHeader
        name="Marques Brownlee"
        avatarSrc="https://x.test/a.jpg"
      />,
    )
    expect(screen.getByText("MA")).toBeInTheDocument()
  })

  it("renders the SubscribeButton and toggling fires onSubscribedChange", async () => {
    const user = userEvent.setup()
    const onSubscribedChange = vi.fn()
    render(
      <ChannelHeader name="A" onSubscribedChange={onSubscribedChange} />,
    )
    const actions = document.querySelector(
      '[data-slot="channel-header-actions"]',
    ) as HTMLElement
    expect(
      within(actions).getByRole("button", { name: "Subscribe" }),
    ).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Subscribe" }))
    expect(onSubscribedChange).toHaveBeenCalledWith(true)
  })

  it("renders the SubscribeButton in the subscribed state via defaultSubscribed", async () => {
    render(<ChannelHeader name="A" defaultSubscribed />)
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /Subscribed/i }),
      ).toBeInTheDocument(),
    )
  })

  it("renders a Join button only when onJoin is provided and fires it", async () => {
    const user = userEvent.setup()
    const { rerender } = render(<ChannelHeader name="A" />)
    expect(screen.queryByRole("button", { name: "Join" })).toBeNull()

    const onJoin = vi.fn()
    rerender(<ChannelHeader name="A" onJoin={onJoin} />)
    const join = screen.getByRole("button", { name: "Join" })
    await user.click(join)
    expect(onJoin).toHaveBeenCalledOnce()
  })

  it("renders a custom joinLabel", () => {
    render(<ChannelHeader name="A" onJoin={() => {}} joinLabel="Become a member" />)
    expect(
      screen.getByRole("button", { name: "Become a member" }),
    ).toBeInTheDocument()
  })

  it("does not render tabs when none are provided", () => {
    render(<ChannelHeader name="A" />)
    expect(
      document.querySelector('[data-slot="channel-header-tabs"]'),
    ).toBeNull()
  })

  it("does not render tabs when an empty array is provided", () => {
    render(<ChannelHeader name="A" tabs={[]} />)
    expect(
      document.querySelector('[data-slot="channel-header-tabs"]'),
    ).toBeNull()
  })

  it("renders tabs and clicking a tab fires onTabChange with the value", async () => {
    const user = userEvent.setup()
    const onTabChange = vi.fn()
    render(
      <ChannelHeader
        name="A"
        defaultTab="home"
        onTabChange={onTabChange}
        tabs={[
          { value: "home", label: "Home" },
          { value: "videos", label: "Videos" },
        ]}
      />,
    )
    expect(
      document.querySelector('[data-slot="channel-header-tabs"]'),
    ).toBeInTheDocument()
    await user.click(screen.getByRole("tab", { name: "Videos" }))
    expect(onTabChange).toHaveBeenCalledWith("videos")
  })

  it("renders tabs without a defaultTab (falls back to the first tab) and without an onTabChange handler", async () => {
    const user = userEvent.setup()
    render(
      <ChannelHeader
        name="A"
        tabs={[
          { value: "home", label: "Home" },
          { value: "videos", label: "Videos" },
        ]}
      />,
    )
    const home = screen.getByRole("tab", { name: "Home" })
    expect(home).toHaveAttribute("data-active")
    // clicking without a handler must not throw
    await user.click(screen.getByRole("tab", { name: "Videos" }))
    expect(screen.getByRole("tab", { name: "Videos" })).toBeInTheDocument()
  })

  it("merges a custom className onto the root", () => {
    render(<ChannelHeader name="A" className="custom" />)
    expect(root()).toHaveClass("custom")
  })

  it("has no axe violations (full)", async () => {
    const { container } = render(
      <ChannelHeader
        name="Marques Brownlee"
        verified
        handle="@mkbhd"
        subscriberCount={21000000}
        videoCount={1800}
        description="Quality tech videos and reviews."
        avatarSrc="https://x.test/a.jpg"
        bannerSrc="https://x.test/b.jpg"
        onSubscribedChange={() => {}}
        onJoin={() => {}}
        defaultTab="home"
        onTabChange={() => {}}
        tabs={[
          { value: "home", label: "Home" },
          { value: "videos", label: "Videos" },
        ]}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations (minimal)", async () => {
    const { container } = render(<ChannelHeader name="A" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
