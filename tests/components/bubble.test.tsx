import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { axe } from "vitest-axe"
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
  bubbleVariants,
} from "@/components/ui/bubble"

const VARIANTS = [
  "default",
  "secondary",
  "muted",
  "tinted",
  "outline",
  "ghost",
  "destructive",
] as const

describe("Bubble – variants", () => {
  it.each(VARIANTS)("renders %s variant", (variant) => {
    const { container } = render(
      <Bubble variant={variant}>
        <BubbleContent>{variant}</BubbleContent>
      </Bubble>,
    )
    const bubble = container.querySelector("[data-slot='bubble']")
    expect(bubble).toHaveAttribute("data-variant", variant)
    expect(
      container.querySelector("[data-slot='bubble-content']"),
    ).toHaveTextContent(variant)
  })

  it("renders align end", () => {
    const { container } = render(
      <Bubble align="end">
        <BubbleContent>Outgoing</BubbleContent>
      </Bubble>,
    )
    expect(container.querySelector("[data-slot='bubble']")).toHaveAttribute(
      "data-align",
      "end",
    )
  })

  it("renders reactions and groups", () => {
    const { container } = render(
      <BubbleGroup>
        <Bubble variant="secondary">
          <BubbleContent>One</BubbleContent>
          <BubbleReactions side="top" align="start">
            👍
          </BubbleReactions>
        </Bubble>
      </BubbleGroup>,
    )
    expect(
      container.querySelector("[data-slot='bubble-group']"),
    ).toBeInTheDocument()
    const reactions = container.querySelector("[data-slot='bubble-reactions']")
    expect(reactions).toHaveAttribute("data-side", "top")
    expect(reactions).toHaveAttribute("data-align", "start")
  })

  it("exports bubbleVariants helper", () => {
    expect(bubbleVariants({ variant: "muted" })).toContain("bg-muted")
  })

  it("has no axe violations", async () => {
    const { container } = render(
      <Bubble>
        <BubbleContent>Accessible bubble</BubbleContent>
      </Bubble>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
