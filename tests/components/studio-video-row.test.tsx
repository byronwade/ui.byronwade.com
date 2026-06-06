import * as React from "react"
import { render, screen, fireEvent, within } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { axe } from "vitest-axe"
import {
  StudioVideoRow,
  type VideoVisibility,
} from "@/components/studio-video-row"

describe("StudioVideoRow – smoke", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <StudioVideoRow title="My video" visibility="public" />,
    )
    expect(
      container.querySelector("[data-slot='studio-video-row']"),
    ).toBeInTheDocument()
  })

  it("renders the title", () => {
    render(<StudioVideoRow title="My video" visibility="public" />)
    expect(screen.getByText("My video")).toBeInTheDocument()
  })

  it("merges a custom className onto the root while keeping base classes", () => {
    const { container } = render(
      <StudioVideoRow
        className="custom-class"
        title="My video"
        visibility="public"
      />,
    )
    const root = container.querySelector("[data-slot='studio-video-row']")
    expect(root).toHaveClass("custom-class")
    expect(root).toHaveClass("border-b")
  })
})

describe("StudioVideoRow – description", () => {
  it("renders the description when provided", () => {
    const { container } = render(
      <StudioVideoRow
        title="My video"
        description="A short blurb"
        visibility="public"
      />,
    )
    expect(
      container.querySelector("[data-slot='studio-video-row-description']"),
    ).toBeInTheDocument()
    expect(screen.getByText("A short blurb")).toBeInTheDocument()
  })

  it("omits the description when absent", () => {
    const { container } = render(
      <StudioVideoRow title="My video" visibility="public" />,
    )
    expect(
      container.querySelector("[data-slot='studio-video-row-description']"),
    ).not.toBeInTheDocument()
  })
})

describe("StudioVideoRow – visibility", () => {
  it.each([
    ["public", "Public", "bg-success"],
    ["scheduled", "Scheduled", "bg-warning"],
    ["unlisted", "Unlisted", "bg-muted-foreground"],
    ["private", "Private", "bg-muted-foreground"],
    ["draft", "Draft", "bg-muted-foreground"],
  ] as const)(
    "renders the %s visibility label and tone",
    (visibility, label, dotClass) => {
      const { container } = render(
        <StudioVideoRow title="My video" visibility={visibility} />,
      )
      const cell = container.querySelector(
        "[data-slot='studio-video-row-visibility']",
      )
      expect(cell).toBeInTheDocument()
      expect(within(cell as HTMLElement).getByText(label)).toBeInTheDocument()
      expect(cell!.querySelector(`.${dotClass}`)).toBeTruthy()
    },
  )
})

describe("StudioVideoRow – date", () => {
  it("renders the date and dateLabel when provided", () => {
    render(
      <StudioVideoRow
        title="My video"
        visibility="public"
        date="Apr 3, 2026"
        dateLabel="Published"
      />,
    )
    expect(screen.getByText("Apr 3, 2026")).toBeInTheDocument()
    expect(screen.getByText("Published")).toBeInTheDocument()
  })

  it("renders an em dash and omits the label when date is absent", () => {
    const { container } = render(
      <StudioVideoRow title="My video" visibility="public" />,
    )
    const cell = container.querySelector("[data-slot='studio-video-row-date']")
    expect(cell).toHaveTextContent("—")
    expect(screen.queryByText("Published")).not.toBeInTheDocument()
  })
})

describe("StudioVideoRow – metrics", () => {
  it("renders compact metric values", () => {
    const { container } = render(
      <StudioVideoRow
        title="My video"
        visibility="public"
        views={1200}
        comments={1500000}
        likes={42}
      />,
    )
    expect(
      container.querySelector("[data-slot='studio-video-row-views']")
        ?.textContent,
    ).toBe("1.2K")
    expect(
      container.querySelector("[data-slot='studio-video-row-comments']")
        ?.textContent,
    ).toBe("1.5M")
    expect(
      container.querySelector("[data-slot='studio-video-row-likes']")
        ?.textContent,
    ).toBe("42")
  })

  it("renders an em dash for each undefined metric cell", () => {
    const { container } = render(
      <StudioVideoRow title="My video" visibility="public" />,
    )
    expect(
      container.querySelector("[data-slot='studio-video-row-views']")
        ?.textContent,
    ).toBe("—")
    expect(
      container.querySelector("[data-slot='studio-video-row-comments']")
        ?.textContent,
    ).toBe("—")
    expect(
      container.querySelector("[data-slot='studio-video-row-likes']")
        ?.textContent,
    ).toBe("—")
  })
})

describe("StudioVideoRow – selection", () => {
  it("reflects defaultSelected (uncontrolled) and toggles on click", () => {
    const onSelectedChange = vi.fn()
    render(
      <StudioVideoRow
        title="My video"
        visibility="public"
        defaultSelected
        onSelectedChange={onSelectedChange}
      />,
    )
    const checkbox = screen.getByRole("checkbox", { name: "Select My video" })
    expect(checkbox).toHaveAttribute("aria-checked", "true")
    fireEvent.click(checkbox)
    expect(onSelectedChange).toHaveBeenCalledWith(false)
    expect(checkbox).toHaveAttribute("aria-checked", "false")
  })

  it("defaults to unselected when defaultSelected is absent", () => {
    render(<StudioVideoRow title="My video" visibility="public" />)
    expect(
      screen.getByRole("checkbox", { name: "Select My video" }),
    ).toHaveAttribute("aria-checked", "false")
  })

  it("toggles uncontrolled with no onSelectedChange handler", () => {
    render(<StudioVideoRow title="My video" visibility="public" />)
    const checkbox = screen.getByRole("checkbox", { name: "Select My video" })
    fireEvent.click(checkbox)
    expect(checkbox).toHaveAttribute("aria-checked", "true")
  })

  it("respects the controlled selected prop and does not self-update", () => {
    const onSelectedChange = vi.fn()
    render(
      <StudioVideoRow
        title="My video"
        visibility="public"
        selected={false}
        onSelectedChange={onSelectedChange}
      />,
    )
    const checkbox = screen.getByRole("checkbox", { name: "Select My video" })
    expect(checkbox).toHaveAttribute("aria-checked", "false")
    fireEvent.click(checkbox)
    expect(onSelectedChange).toHaveBeenCalledWith(true)
    // Controlled: stays false because the parent did not update the prop.
    expect(checkbox).toHaveAttribute("aria-checked", "false")
  })
})

describe("StudioVideoRow – menu", () => {
  it("opens the menu and fires an item's onClick", () => {
    const onEdit = vi.fn()
    render(
      <StudioVideoRow
        title="My video"
        visibility="public"
        menuItems={[{ key: "edit", label: "Edit", onClick: onEdit }]}
      />,
    )
    fireEvent.click(
      screen.getByRole("button", { name: "More options for My video" }),
    )
    fireEvent.click(screen.getByText("Edit"))
    expect(onEdit).toHaveBeenCalledTimes(1)
  })

  it("renders an item icon when provided", () => {
    render(
      <StudioVideoRow
        title="My video"
        visibility="public"
        menuItems={[
          {
            key: "edit",
            label: "Edit",
            icon: <span data-testid="edit-icon" />,
          },
        ]}
      />,
    )
    fireEvent.click(
      screen.getByRole("button", { name: "More options for My video" }),
    )
    expect(screen.getByTestId("edit-icon")).toBeInTheDocument()
  })

  it("omits the menu when no menuItems are provided", () => {
    const { container } = render(
      <StudioVideoRow title="My video" visibility="public" />,
    )
    expect(
      container.querySelector("[data-slot='studio-video-row-menu']"),
    ).not.toBeInTheDocument()
  })
})

describe("StudioVideoRow – row interaction", () => {
  it("exposes button semantics and fires onClick when clicked", () => {
    const onClick = vi.fn()
    render(
      <StudioVideoRow title="My video" visibility="public" onClick={onClick} />,
    )
    const surface = screen.getByRole("button", { name: /My video/ })
    expect(surface).toHaveAttribute("tabindex", "0")
    fireEvent.click(surface)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("fires onClick on Enter", () => {
    const onClick = vi.fn()
    render(
      <StudioVideoRow title="My video" visibility="public" onClick={onClick} />,
    )
    fireEvent.keyDown(screen.getByRole("button", { name: /My video/ }), {
      key: "Enter",
    })
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("fires onClick on Space", () => {
    const onClick = vi.fn()
    render(
      <StudioVideoRow title="My video" visibility="public" onClick={onClick} />,
    )
    fireEvent.keyDown(screen.getByRole("button", { name: /My video/ }), {
      key: " ",
    })
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("does not fire onClick on a non-activating key", () => {
    const onClick = vi.fn()
    render(
      <StudioVideoRow title="My video" visibility="public" onClick={onClick} />,
    )
    fireEvent.keyDown(screen.getByRole("button", { name: /My video/ }), {
      key: "Escape",
    })
    expect(onClick).not.toHaveBeenCalled()
  })

  it("is non-interactive on the video surface when no onClick is provided", () => {
    render(<StudioVideoRow title="My video" visibility="public" />)
    // The only button-less render still has a checkbox, never a row button.
    expect(
      screen.queryByRole("button", { name: /My video/ }),
    ).not.toBeInTheDocument()
  })
})

describe("StudioVideoRow – highlighted", () => {
  it("applies accent background when highlighted", () => {
    const { container } = render(
      <StudioVideoRow title="My video" visibility="public" highlighted />,
    )
    expect(
      container.querySelector("[data-slot='studio-video-row']"),
    ).toHaveClass("bg-accent/50")
  })

  it("omits highlight styling by default", () => {
    const { container } = render(
      <StudioVideoRow title="My video" visibility="public" />,
    )
    expect(
      container.querySelector("[data-slot='studio-video-row']"),
    ).not.toHaveClass("bg-accent/50")
  })
})

describe("StudioVideoRow – accessibility", () => {
  it("has no axe violations across visibility states", async () => {
    const all: VideoVisibility[] = [
      "public",
      "unlisted",
      "private",
      "draft",
      "scheduled",
    ]
    const { container } = render(
      <div>
        {all.map((visibility) => (
          <StudioVideoRow
            key={visibility}
            title={`Video ${visibility}`}
            description="A blurb"
            visibility={visibility}
            date="Apr 3, 2026"
            dateLabel="Published"
            views={1200}
            comments={42}
            likes={9}
            onClick={() => {}}
            menuItems={[{ key: "edit", label: "Edit" }]}
          />
        ))}
      </div>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
