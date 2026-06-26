import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { axe } from "vitest-axe"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/components/ui/message"

describe("Message – smoke", () => {
  it("renders without crashing", () => {
    const { container } = render(<Message>Body</Message>)
    expect(container.querySelector("[data-slot='message']")).toBeInTheDocument()
  })

  it("renders align end", () => {
    const { container } = render(<Message align="end">Outgoing</Message>)
    expect(container.querySelector("[data-slot='message']")).toHaveAttribute(
      "data-align",
      "end",
    )
  })

  it("renders grouped messages and subparts", () => {
    const { container } = render(
      <MessageGroup>
        <Message>
          <MessageAvatar>
            <span>A</span>
          </MessageAvatar>
          <MessageContent>
            <MessageHeader>Author</MessageHeader>
            <p>First</p>
            <MessageFooter>Read</MessageFooter>
          </MessageContent>
        </Message>
      </MessageGroup>,
    )
    expect(
      container.querySelector("[data-slot='message-group']"),
    ).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='message-avatar']"),
    ).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='message-header']"),
    ).toHaveTextContent("Author")
    expect(
      container.querySelector("[data-slot='message-footer']"),
    ).toHaveTextContent("Read")
    expect(screen.getByText("First")).toBeInTheDocument()
  })

  it("has no axe violations", async () => {
    const { container } = render(
      <Message>
        <MessageContent>
          <p>Hello team</p>
        </MessageContent>
      </Message>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
