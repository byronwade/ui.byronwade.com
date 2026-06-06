/** Tests for MessageThread (components/message-thread.tsx). */

import * as React from "react"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest"
import { axe } from "vitest-axe"

import { MessageThread } from "@/components/message-thread"
import { MessagesProvider, useMessages } from "@/lib/comms-store"

function UnreadProbe({ conversationId }: { conversationId: string }) {
  const { conversations } = useMessages()
  const unread = conversations.find((c) => c.id === conversationId)?.unread ?? 0
  return <span data-testid="unread-count">{unread}</span>
}

function stubMatchMedia() {
  window.matchMedia = vi.fn().mockImplementation((q: string) => ({
    matches: false,
    media: q,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}
beforeEach(stubMatchMedia)
afterEach(() => vi.restoreAllMocks())

function renderThread(conversationId?: string) {
  return render(
    <MessagesProvider latencyMs={0}>
      {conversationId ? <UnreadProbe conversationId={conversationId} /> : null}
      <MessageThread conversationId={conversationId} />
    </MessagesProvider>,
  )
}

const bubbles = () =>
  document.querySelectorAll('[data-slot="message-bubble"]')

describe("MessageThread", () => {
  it("renders message bubbles for a conversation", () => {
    renderThread("v1")
    expect(screen.getByText("Ana Reyes")).toBeInTheDocument()
    expect(screen.getByText("Hey! Are we still on for Thursday?")).toBeInTheDocument()
    expect(screen.getByText("Yes, 2pm works.")).toBeInTheDocument()
    expect(bubbles().length).toBe(3)
    expect(
      [...bubbles()].some(
        (node) => node.getAttribute("data-direction") === "out",
      ),
    ).toBe(true)
    expect(
      [...bubbles()].some(
        (node) => node.getAttribute("data-direction") === "in",
      ),
    ).toBe(true)
  })

  it("shows empty state when no conversationId is provided", () => {
    renderThread()
    expect(screen.getByText("No conversation selected")).toBeInTheDocument()
    expect(
      document.querySelector('[data-slot="message-thread"][data-empty]'),
    ).toBeTruthy()
    expect(bubbles().length).toBe(0)
  })

  it("adds a reaction to a message", async () => {
    renderThread("v1")
    const bubble = bubbles()[0] as HTMLElement
    await userEvent.click(within(bubble).getByRole("button", { name: "Add reaction" }))
    await userEvent.click(screen.getByRole("button", { name: "React with 👍" }))
    expect(
      within(bubble).getByRole("button", { name: "Remove reaction 👍" }),
    ).toBeInTheDocument()
  })

  it("marks the conversation read when opened", () => {
    renderThread("v1")
    expect(screen.getByTestId("unread-count")).toHaveTextContent("0")
  })

  it("has no axe violations", async () => {
    const { container } = renderThread("v1")
    expect(await axe(container)).toHaveNoViolations()
  })
})
