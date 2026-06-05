import * as React from "react"
import { render, screen, waitFor, within, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { axe } from "vitest-axe"
import { PlaybackMenu, type PlaybackSetting } from "@/components/playback-menu"

function makeSettings(
  overrides: Partial<Record<string, (v: string) => void>> = {},
): PlaybackSetting[] {
  return [
    {
      key: "quality",
      label: "Quality",
      value: "auto",
      onValueChange: overrides.quality,
      options: [
        { label: "Auto", value: "auto" },
        { label: "1080p", value: "1080" },
        { label: "720p", value: "720" },
        { label: "480p", value: "480" },
      ],
    },
    {
      key: "speed",
      label: "Playback speed",
      value: "1",
      onValueChange: overrides.speed,
      options: [
        { label: "0.5", value: "0.5" },
        { label: "Normal", value: "1" },
        { label: "1.5", value: "1.5" },
        { label: "2", value: "2" },
      ],
    },
    {
      key: "subtitles",
      label: "Subtitles",
      value: "off",
      onValueChange: overrides.subtitles,
      options: [
        { label: "Off", value: "off" },
        { label: "English", value: "en" },
      ],
    },
  ]
}

describe("PlaybackMenu – trigger", () => {
  it("renders the default gear trigger with the playback-menu data-slot", () => {
    render(<PlaybackMenu settings={makeSettings()} />)
    const trigger = screen.getByRole("button", { name: "Settings" })
    expect(trigger).toBeInTheDocument()
    expect(trigger).toHaveAttribute("data-slot", "playback-menu")
  })

  it("merges a custom className onto the default trigger", () => {
    render(<PlaybackMenu settings={makeSettings()} className="custom-class" />)
    const trigger = screen.getByRole("button", { name: "Settings" })
    expect(trigger).toHaveClass("custom-class")
    expect(trigger).toHaveClass("inline-flex")
  })

  it("renders a custom trigger instead of the gear button", () => {
    render(
      <PlaybackMenu
        settings={makeSettings()}
        trigger={<button aria-label="Open settings">Gear</button>}
      />,
    )
    expect(
      screen.getByRole("button", { name: "Open settings" }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Settings" }),
    ).not.toBeInTheDocument()
  })

  it("merges className onto a custom trigger", () => {
    render(
      <PlaybackMenu
        settings={makeSettings()}
        className="custom-class"
        trigger={<button aria-label="Open settings">Gear</button>}
      />,
    )
    expect(screen.getByRole("button", { name: "Open settings" })).toHaveClass(
      "custom-class",
    )
  })
})

describe("PlaybackMenu – rows", () => {
  it("opens the menu and shows each setting row with its current value", async () => {
    const user = userEvent.setup()
    render(<PlaybackMenu settings={makeSettings()} />)
    await user.click(screen.getByRole("button", { name: "Settings" }))

    await waitFor(() => {
      expect(screen.getByText("Quality")).toBeInTheDocument()
    })
    expect(screen.getByText("Playback speed")).toBeInTheDocument()
    expect(screen.getByText("Subtitles")).toBeInTheDocument()

    // current value labels rendered on the parent rows
    expect(screen.getByText("Auto")).toBeInTheDocument()
    expect(screen.getByText("Normal")).toBeInTheDocument()
    expect(screen.getByText("Off")).toBeInTheDocument()
  })

  it("renders a row icon when provided", async () => {
    const user = userEvent.setup()
    const settings = makeSettings()
    settings[0].icon = <span data-testid="quality-icon" />
    render(<PlaybackMenu settings={settings} />)
    await user.click(screen.getByRole("button", { name: "Settings" }))
    await waitFor(() => {
      expect(screen.getByTestId("quality-icon")).toBeInTheDocument()
    })
  })

  it("falls back to the raw value when no option label matches", async () => {
    const user = userEvent.setup()
    const settings = makeSettings()
    settings[0].value = "ultra"
    render(<PlaybackMenu settings={settings} />)
    await user.click(screen.getByRole("button", { name: "Settings" }))
    await waitFor(() => {
      expect(screen.getByText("ultra")).toBeInTheDocument()
    })
  })
})

describe("PlaybackMenu – submenu selection", () => {
  async function openSubmenu(rowLabel: string) {
    // Base UI submenu content carries `pointer-events: none` in jsdom (no layout),
    // which user-event's default pointer check rejects — disable it for the click.
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    await user.click(screen.getByRole("button", { name: "Settings" }))
    const row = await screen.findByText(rowLabel)
    await user.click(row)
    return user
  }

  it("opens a submenu of radio options for a setting", async () => {
    render(<PlaybackMenu settings={makeSettings()} />)
    await openSubmenu("Quality")
    await waitFor(() => {
      expect(
        document.querySelector("[data-slot='playback-menu-options']"),
      ).not.toBeNull()
    })
    expect(screen.getByRole("menuitemradio", { name: "1080p" })).toBeInTheDocument()
  })

  it("marks the current option as checked in the submenu", async () => {
    render(<PlaybackMenu settings={makeSettings()} />)
    await openSubmenu("Playback speed")
    await waitFor(() => {
      const normal = screen.getByRole("menuitemradio", { name: "Normal" })
      expect(normal).toHaveAttribute("aria-checked", "true")
    })
    expect(
      screen.getByRole("menuitemradio", { name: "0.5" }),
    ).toHaveAttribute("aria-checked", "false")
  })

  it("fires the setting's onValueChange with the selected value", async () => {
    const quality = vi.fn()
    render(<PlaybackMenu settings={makeSettings({ quality })} />)
    await openSubmenu("Quality")
    const item = await screen.findByRole("menuitemradio", { name: "720p" })
    // Base UI submenu radio selection only registers via a raw click in jsdom
    // (user-event's pointer sequence does not toggle the item).
    fireEvent.click(item)
    expect(quality).toHaveBeenCalledWith("720")
  })

  it("fires onValueChange for a different setting independently", async () => {
    const subtitles = vi.fn()
    render(<PlaybackMenu settings={makeSettings({ subtitles })} />)
    await openSubmenu("Subtitles")
    const item = await screen.findByRole("menuitemradio", { name: "English" })
    // Base UI submenu radio selection only registers via a raw click in jsdom
    // (user-event's pointer sequence does not toggle the item).
    fireEvent.click(item)
    expect(subtitles).toHaveBeenCalledWith("en")
  })

  it("does not throw when a setting has no onValueChange handler", async () => {
    render(<PlaybackMenu settings={makeSettings()} />)
    await openSubmenu("Playback speed")
    const item = await screen.findByRole("menuitemradio", { name: "1.5" })
    // Base UI submenu radio selection only registers via a raw click in jsdom
    // (user-event's pointer sequence does not toggle the item).
    fireEvent.click(item)
    expect(item).toBeInTheDocument()
  })
})

describe("PlaybackMenu – forwarded positioning", () => {
  it("accepts align and side props without error", async () => {
    const user = userEvent.setup()
    render(<PlaybackMenu settings={makeSettings()} align="start" side="bottom" />)
    await user.click(screen.getByRole("button", { name: "Settings" }))
    await waitFor(() => {
      expect(
        document.querySelector("[data-slot='playback-menu-content']"),
      ).not.toBeNull()
    })
  })
})

describe("PlaybackMenu – accessibility", () => {
  it("has no axe violations when closed", async () => {
    const { container } = render(<PlaybackMenu settings={makeSettings()} />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations with a custom trigger", async () => {
    const { container } = render(
      <PlaybackMenu
        settings={makeSettings()}
        trigger={<button aria-label="Open settings">Gear</button>}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
