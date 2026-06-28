import * as React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { axe } from "vitest-axe"
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "@/components/ui/message-scroller"

function renderScroller(ui: React.ReactNode) {
  return render(
    <MessageScrollerProvider autoScroll defaultScrollPosition="end">
      <MessageScroller className="h-64">{ui}</MessageScroller>
    </MessageScrollerProvider>,
  )
}

describe("MessageScroller – smoke", () => {
  it("renders without crashing", () => {
    const { container } = renderScroller(
      <MessageScrollerViewport>
        <MessageScrollerContent>
          <MessageScrollerItem messageId="1">Hello</MessageScrollerItem>
        </MessageScrollerContent>
      </MessageScrollerViewport>,
    )
    expect(
      container.querySelector("[data-slot='message-scroller']"),
    ).toBeInTheDocument()
  })

  it("renders viewport, content, and item slots", () => {
    const { container } = renderScroller(
      <MessageScrollerViewport>
        <MessageScrollerContent>
          <MessageScrollerItem messageId="turn-1" scrollAnchor>
            Turn one
          </MessageScrollerItem>
        </MessageScrollerContent>
      </MessageScrollerViewport>,
    )
    expect(
      container.querySelector("[data-slot='message-scroller-viewport']"),
    ).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='message-scroller-content']"),
    ).toBeInTheDocument()
    const item = container.querySelector("[data-slot='message-scroller-item']")
    expect(item).toHaveAttribute("data-message-id", "turn-1")
    expect(item).toHaveAttribute("data-scroll-anchor", "true")
  })

  it("renders scroll button with accessible label", () => {
    renderScroller(
      <>
        <MessageScrollerViewport>
          <MessageScrollerContent>
            <MessageScrollerItem messageId="1">Hi</MessageScrollerItem>
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </>,
    )
    expect(screen.getByText("Scroll to end")).toBeInTheDocument()
  })

  it("merges className on root", () => {
    const { container } = render(
      <MessageScrollerProvider>
        <MessageScroller className="custom-scroller">
          <MessageScrollerViewport />
        </MessageScroller>
      </MessageScrollerProvider>,
    )
    expect(
      container.querySelector("[data-slot='message-scroller']"),
    ).toHaveClass("custom-scroller")
  })

  it("has no axe violations", async () => {
    const { container } = renderScroller(
      <>
        <MessageScrollerViewport>
          <MessageScrollerContent>
            <MessageScrollerItem messageId="1">Accessible thread</MessageScrollerItem>
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
