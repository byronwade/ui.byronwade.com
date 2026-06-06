import * as React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, beforeEach, vi } from "vitest"
import { axe } from "vitest-axe"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

beforeEach(() => {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal("ResizeObserver", ResizeObserverMock)
})

describe("Resizable", () => {
  it("renders a panel group with handle", () => {
    render(
      <ResizablePanelGroup direction="horizontal" className="h-48">
        <ResizablePanel defaultSize={50}>Left</ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>Right</ResizablePanel>
      </ResizablePanelGroup>,
    )

    expect(
      document.querySelector('[data-slot="resizable-panel-group"]'),
    ).toBeInTheDocument()
    expect(document.querySelectorAll('[data-slot="resizable-panel"]').length).toBe(2)
    expect(document.querySelector('[data-slot="resizable-handle"]')).toBeInTheDocument()
    expect(screen.getByText("Left")).toBeInTheDocument()
    expect(screen.getByText("Right")).toBeInTheDocument()
  })

  it("has no axe violations", async () => {
    const { container } = render(
      <ResizablePanelGroup direction="horizontal" className="h-48">
        <ResizablePanel defaultSize={50}>A</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>B</ResizablePanel>
      </ResizablePanelGroup>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
