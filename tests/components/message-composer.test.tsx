/** Tests for MessageComposer (components/message-composer.tsx). */

import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest"
import { axe } from "vitest-axe"

import { MessageComposer } from "@/components/message-composer"
import { MessagesProvider } from "@/lib/comms-store"

function stubMatchMedia() {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    media: "",
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

function renderComposer(conversationId?: string) {
  return render(
    <MessagesProvider latencyMs={0}>
      <MessageComposer conversationId={conversationId} />
    </MessagesProvider>,
  )
}

describe("MessageComposer", () => {
  it("disables input when no conversation is selected", () => {
    renderComposer()
    expect(screen.getByRole("textbox", { name: "Message" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled()
  })

  it("sends a message on Enter", async () => {
    const user = userEvent.setup()
    renderComposer("v1")
    const input = screen.getByRole("textbox", { name: "Message" })
    await user.type(input, "Hello there")
    await user.keyboard("{Enter}")
    expect(input).toHaveValue("")
  })

  it("fires optional callbacks for attach, template, and schedule", async () => {
    const user = userEvent.setup()
    const onAttach = vi.fn()
    const onPickTemplate = vi.fn()
    const onSchedule = vi.fn()
    render(
      <MessagesProvider latencyMs={0}>
        <MessageComposer
          conversationId="v1"
          onAttach={onAttach}
          onPickTemplate={onPickTemplate}
          onSchedule={onSchedule}
        />
      </MessagesProvider>,
    )

    await user.click(screen.getByRole("button", { name: "Attach file" }))
    await user.click(screen.getByRole("button", { name: "Insert template" }))
    await user.click(screen.getByRole("button", { name: "Schedule message" }))
    expect(onAttach).toHaveBeenCalledTimes(1)
    expect(onPickTemplate).toHaveBeenCalledTimes(1)
    expect(onSchedule).toHaveBeenCalledTimes(1)
  })

  it("has no axe violations", async () => {
    const { container } = renderComposer("v1")
    expect(await axe(container)).toHaveNoViolations()
  })
})
