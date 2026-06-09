import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { DemoPreviewFrame } from "@/app/(docs)/_components/demo-preview-frame"

const navigation = vi.hoisted(() => ({
  replace: vi.fn((href: string) => {
    navigation.search = href.split("?")[1] ?? ""
  }),
  search: "viewport=desktop&density=default&frame=default",
}))

vi.mock("next/navigation", () => ({
  usePathname: () => "/docs/resource-list",
  useRouter: () => ({ replace: navigation.replace }),
  useSearchParams: () => new URLSearchParams(navigation.search),
}))

describe("DemoPreviewFrame", () => {
  it("renders the context toolbar as accessible icon-only controls", () => {
    render(
      <DemoPreviewFrame defaultSurface="app">
        {() => <div>Preview</div>}
      </DemoPreviewFrame>,
    )

    expect(
      screen.queryByRole("button", { name: "Application" }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Marketing" }),
    ).not.toBeInTheDocument()

    for (const name of [
      "Preview",
      "Code",
      "Desktop",
      "Tablet",
      "Mobile",
      "Compact",
      "Default",
      "Comfort",
      "Flat",
      "Inset",
      "No edge",
      "Soft edge",
      "Raised edge",
      "Default state",
      "Success",
      "Error",
      "Loading",
    ]) {
      const button = screen.getByRole("button", { name })
      expect(button).toHaveAttribute("title", name)
      expect(button).toHaveTextContent("")
    }
  })

  it("renders minimal toolbar group labels above each icon run", () => {
    const { container } = render(
      <DemoPreviewFrame defaultSurface="app">
        {() => <div>Preview</div>}
      </DemoPreviewFrame>,
    )

    for (const name of [
      "View",
      "Device",
      "Density",
      "Frame",
      "Depth",
      "State",
    ]) {
      const group = screen.getByRole("group", { name })
      expect(group).toHaveAttribute("data-slot", "demo-preview-toolbar-group")
      expect(group).toHaveClass("flex-col", "items-start")
      expect(group).not.toHaveClass("rounded-lg")
      expect(group).not.toHaveClass("edge")
      expect(group).not.toHaveClass("bg-background")
      expect(group).toHaveTextContent(name)

      const label = group.querySelector(
        "[data-slot='demo-preview-toolbar-group-label']",
      )
      const controls = group.querySelector(
        "[data-slot='demo-preview-toolbar-group-controls']",
      )
      expect(label).toBeInTheDocument()
      expect(controls).toBeInTheDocument()
      expect(label?.compareDocumentPosition(controls!)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      )
    }

    expect(
      container.querySelector("[data-slot='demo-preview-toolbar-separator']"),
    ).not.toBeInTheDocument()
  })

  it("keeps unsupported toolbar groups visible but disables their controls", async () => {
    const user = userEvent.setup()
    render(
      <DemoPreviewFrame
        defaultSurface="app"
        disabledControls={() => ({ frame: true, depth: true, state: true })}
      >
        {(ctx) => (
          <div data-testid="ctx">
            {ctx.frame}/{ctx.depth}/{ctx.state}
          </div>
        )}
      </DemoPreviewFrame>,
    )

    const frameGroup = screen.getByRole("group", { name: "Frame" })
    const depthGroup = screen.getByRole("group", { name: "Depth" })

    expect(frameGroup).toHaveAttribute("data-disabled", "true")
    const stateGroup = screen.getByRole("group", { name: "State" })

    expect(depthGroup).toHaveAttribute("data-disabled", "true")
    expect(stateGroup).toHaveAttribute("data-disabled", "true")
    expect(screen.getByRole("button", { name: "Inset" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Raised edge" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Loading" })).toBeDisabled()

    await user.click(screen.getByRole("button", { name: "Inset" }))
    await user.click(screen.getByRole("button", { name: "Raised edge" }))
    await user.click(screen.getByRole("button", { name: "Loading" }))

    expect(screen.getByTestId("ctx")).toHaveTextContent("default/none/default")
  })

  it("shows tooltips for toolbar groups and icon controls, including disabled controls", async () => {
    const user = userEvent.setup()
    render(
      <DemoPreviewFrame
        defaultSurface="app"
        disabledControls={() => ({ frame: true, depth: true, state: true })}
      >
        {() => <div>Preview</div>}
      </DemoPreviewFrame>,
    )

    await user.hover(screen.getByText("Density"))
    expect(
      await screen.findByText("Adjust the example density."),
    ).toBeInTheDocument()

    await user.hover(screen.getByRole("button", { name: "Compact" }))
    expect(await screen.findByText("Compact density")).toBeInTheDocument()

    await user.hover(screen.getByRole("button", { name: "Inset" }))
    expect(
      await screen.findByText("Frame is not available for this example."),
    ).toBeInTheDocument()

    await user.hover(screen.getByRole("button", { name: "Raised edge" }))
    expect(
      await screen.findByText("Depth is not available for this example."),
    ).toBeInTheDocument()

    await user.hover(screen.getByRole("button", { name: "Loading" }))
    expect(
      await screen.findByText("State is not available for this example."),
    ).toBeInTheDocument()
  })

  it("wraps the toolbar and preview in a single example card", () => {
    const { container } = render(
      <DemoPreviewFrame defaultSurface="app">
        {() => <div>Preview</div>}
      </DemoPreviewFrame>,
    )

    const card = container.querySelector("[data-slot='demo-preview-card']")
    const toolbar = container.querySelector(
      "[data-slot='demo-preview-toolbar']",
    )
    const surface = container.querySelector(
      "[data-slot='demo-preview-surface']",
    )

    expect(card).toBeInTheDocument()
    expect(card).toHaveClass("edge", "bg-card")
    expect(card).toContainElement(toolbar)
    expect(card).toContainElement(surface)
  })

  it("uses the card header as the toolbar and centers preview content with balanced padding", () => {
    const { container } = render(
      <DemoPreviewFrame defaultSurface="app">
        {() => <div>Preview</div>}
      </DemoPreviewFrame>,
    )

    const header = container.querySelector("[data-slot='demo-preview-header']")
    const toolbar = container.querySelector(
      "[data-slot='demo-preview-toolbar']",
    )
    const surface = container.querySelector(
      "[data-slot='demo-preview-surface']",
    )

    expect(header).toContainElement(toolbar)
    expect(header).toHaveClass("border-b", "bg-muted/30")
    expect(surface).toHaveClass(
      "items-center",
      "justify-center",
      "p-6",
      "sm:p-8",
    )
    expect(surface).not.toHaveClass("items-stretch")
  })

  it("keeps the toolbar usable as a horizontal scroll rail on mobile", () => {
    const { container } = render(
      <DemoPreviewFrame defaultSurface="app">
        {() => <div>Preview</div>}
      </DemoPreviewFrame>,
    )

    const header = container.querySelector("[data-slot='demo-preview-header']")
    const toolbar = container.querySelector(
      "[data-slot='demo-preview-toolbar']",
    )

    expect(header).toHaveClass("overflow-x-auto", "scrollbar-thin")
    expect(toolbar).toHaveClass("w-max", "flex-nowrap")
    expect(toolbar).not.toHaveClass("flex-wrap")

    for (const group of screen.getAllByRole("group")) {
      expect(group).toHaveClass("shrink-0")
      expect(group).toHaveClass("max-sm:min-w-16")
      expect(
        group.querySelector("[data-slot='demo-preview-toolbar-group-label']"),
      ).not.toHaveClass("hidden")
    }
  })

  it("removes preview padding when the code view is active", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <DemoPreviewFrame
        defaultSurface="app"
        code={() => <pre data-testid="example-code">code</pre>}
      >
        {() => <div>Preview</div>}
      </DemoPreviewFrame>,
    )

    await user.click(screen.getByRole("button", { name: "Code" }))

    const surface = container.querySelector(
      "[data-slot='demo-preview-surface']",
    )
    expect(surface).toHaveClass("p-0")
    expect(surface).not.toHaveClass("p-6")
  })

  it("switches between preview and code from the toolbar", async () => {
    const user = userEvent.setup()

    render(
      <DemoPreviewFrame
        defaultSurface="app"
        code={() => (
          <pre data-testid="example-code">export default Example</pre>
        )}
      >
        {() => <div data-testid="example-preview">Preview content</div>}
      </DemoPreviewFrame>,
    )

    expect(screen.getByTestId("example-preview")).toBeInTheDocument()
    expect(screen.queryByTestId("example-code")).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Code" }))

    expect(screen.getByTestId("example-code")).toBeInTheDocument()
    expect(screen.queryByTestId("example-preview")).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Code" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )

    await user.click(screen.getByRole("button", { name: "Preview" }))

    expect(screen.getByTestId("example-preview")).toBeInTheDocument()
    expect(screen.queryByTestId("example-code")).not.toBeInTheDocument()
  })

  it("gives active toolbar buttons a visible token-based selected state", () => {
    render(
      <DemoPreviewFrame defaultSurface="app">
        {() => <div>Preview</div>}
      </DemoPreviewFrame>,
    )

    expect(screen.getByRole("button", { name: "Preview" })).toHaveClass(
      "data-[active=true]:bg-brand/10",
      "data-[active=true]:text-brand",
      "data-[active=true]:ring-1",
      "data-[active=true]:ring-brand/30",
      "data-[active=true]:ring-inset",
    )
  })

  it("syncs its context when the URL toolbar params change", () => {
    navigation.search =
      "viewport=desktop&density=compact&frame=inset&depth=soft&state=success"
    const { rerender } = render(
      <DemoPreviewFrame defaultSurface="app">
        {(ctx) => (
          <div data-testid="ctx">
            {ctx.viewport}/{ctx.density}/{ctx.frame}/{ctx.depth}/{ctx.state}
          </div>
        )}
      </DemoPreviewFrame>,
    )

    expect(screen.getByTestId("ctx")).toHaveTextContent(
      "desktop/compact/inset/soft/success",
    )

    navigation.search =
      "viewport=desktop&density=default&frame=default&depth=raised&state=loading"
    rerender(
      <DemoPreviewFrame defaultSurface="app">
        {(ctx) => (
          <div data-testid="ctx">
            {ctx.viewport}/{ctx.density}/{ctx.frame}/{ctx.depth}/{ctx.state}
          </div>
        )}
      </DemoPreviewFrame>,
    )

    expect(screen.getByTestId("ctx")).toHaveTextContent(
      "desktop/default/default/raised/loading",
    )
  })

  it("updates only its own preview context when selecting a depth option", async () => {
    navigation.search = "viewport=desktop&density=default&frame=default"
    const user = userEvent.setup()

    render(
      <>
        <DemoPreviewFrame defaultSurface="app">
          {(ctx) => <div data-testid="first-ctx">{ctx.depth}</div>}
        </DemoPreviewFrame>
        <DemoPreviewFrame defaultSurface="app">
          {(ctx) => <div data-testid="second-ctx">{ctx.depth}</div>}
        </DemoPreviewFrame>
      </>,
    )

    const softEdgeButtons = screen.getAllByRole("button", {
      name: "Soft edge",
    })
    await user.click(softEdgeButtons[0])

    expect(screen.getByTestId("first-ctx")).toHaveTextContent("soft")
    expect(screen.getByTestId("second-ctx")).toHaveTextContent("none")
    expect(navigation.replace).not.toHaveBeenCalled()
    expect(softEdgeButtons[0]).toHaveAttribute("aria-pressed", "true")
    expect(softEdgeButtons[1]).toHaveAttribute("aria-pressed", "false")
  })

  it("keeps preview depth on the inset edge for every depth toolbar state", async () => {
    navigation.search = "viewport=desktop&density=default&frame=default"
    const user = userEvent.setup()

    const { container } = render(
      <DemoPreviewFrame defaultSurface="app">
        {() => <div>Preview</div>}
      </DemoPreviewFrame>,
    )

    const card = container.querySelector("[data-slot='demo-preview-card']")
    expect(card).toHaveClass("edge")

    await user.click(screen.getByRole("button", { name: "Raised edge" }))

    expect(card).toHaveClass("edge")
    expect(card).not.toHaveClass("shadow-sm")
    expect(card).not.toHaveClass("shadow-md")
  })
})
