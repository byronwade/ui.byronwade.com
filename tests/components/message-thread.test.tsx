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

  it("removes a reaction when its chip is clicked", async () => {
    renderThread("v1")
    const bubble = bubbles()[0] as HTMLElement
    // First add a reaction so the chip exists.
    await userEvent.click(
      within(bubble).getByRole("button", { name: "Add reaction" }),
    )
    await userEvent.click(screen.getByRole("button", { name: "React with ❤️" }))
    const chip = within(bubble).getByRole("button", {
      name: "Remove reaction ❤️",
    })
    expect(chip).toBeInTheDocument()
    // Clicking the existing chip toggles the reaction back off (line 97 handler).
    await userEvent.click(chip)
    expect(
      within(bubble).queryByRole("button", { name: "Remove reaction ❤️" }),
    ).not.toBeInTheDocument()
  })

  it("toggles the reaction picker open and closed", async () => {
    renderThread("v1")
    const bubble = bubbles()[0] as HTMLElement
    const addBtn = within(bubble).getByRole("button", { name: "Add reaction" })
    expect(addBtn).toHaveAttribute("aria-expanded", "false")
    await userEvent.click(addBtn)
    expect(addBtn).toHaveAttribute("aria-expanded", "true")
    expect(
      within(bubble).getByRole("button", { name: "React with 🎉" }),
    ).toBeInTheDocument()
    // Clicking again collapses the picker.
    await userEvent.click(addBtn)
    expect(addBtn).toHaveAttribute("aria-expanded", "false")
    expect(
      within(bubble).queryByRole("button", { name: "React with 🎉" }),
    ).not.toBeInTheDocument()
  })

  it("renders the empty 'no messages yet' state for a conversation with no thread", () => {
    render(
      <MessagesProvider
        latencyMs={0}
        source={{
          conversations: [
            {
              id: "empty-1",
              contact: {
                id: "ec1",
                name: "Empty Chat",
                handle: "+1 000 555 0000",
                avatarSeed: "empty-chat",
              },
              number: "Main line",
              lastMessage: "",
              unread: 0,
              flags: [],
              updatedAt: 1,
            },
          ],
          messages: {},
        }}
      >
        <MessageThread conversationId="empty-1" />
      </MessagesProvider>,
    )
    expect(screen.getByText("No messages yet, say hello.")).toBeInTheDocument()
    expect(bubbles().length).toBe(0)
  })

  it("renders the empty state when conversationId has no matching conversation", () => {
    renderThread("does-not-exist")
    expect(screen.getByText("No conversation selected")).toBeInTheDocument()
  })

  it("renders all outgoing delivery-status ticks", () => {
    const mkMsg = (
      id: string,
      status:
        | "sending"
        | "sent"
        | "delivered"
        | "read"
        | "failed",
    ) => ({
      id,
      conversationId: "statuses",
      body: `status ${status}`,
      direction: "out" as const,
      at: 1_700_000_000_000,
      status,
      reactions: [],
    })
    render(
      <MessagesProvider
        latencyMs={0}
        source={{
          conversations: [
            {
              id: "statuses",
              contact: {
                id: "sc1",
                name: "Status Sweep",
                handle: "+1 111 555 0000",
                avatarSeed: "status-sweep",
              },
              number: "Main line",
              lastMessage: "",
              unread: 0,
              flags: [],
              updatedAt: 1,
            },
          ],
          messages: {
            statuses: [
              mkMsg("s-sending", "sending"),
              mkMsg("s-sent", "sent"),
              mkMsg("s-delivered", "delivered"),
              mkMsg("s-read", "read"),
              mkMsg("s-failed", "failed"),
            ],
          },
        }}
      >
        <MessageThread conversationId="statuses" />
      </MessagesProvider>,
    )
    // Each StatusTick branch renders a distinct accessible label.
    expect(screen.getByLabelText("Sending")).toBeInTheDocument()
    expect(screen.getByLabelText("Sent")).toBeInTheDocument()
    expect(screen.getByLabelText("Delivered")).toBeInTheDocument()
    expect(screen.getByLabelText("Read")).toBeInTheDocument()
    expect(screen.getByLabelText("Failed to send")).toBeInTheDocument()
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
