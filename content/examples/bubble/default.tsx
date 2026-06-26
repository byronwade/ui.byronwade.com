"use client"

import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
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

export default function Example() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      {VARIANTS.map((variant) => (
        <Bubble key={variant} variant={variant}>
          <BubbleContent>
            {variant.charAt(0).toUpperCase() + variant.slice(1)} bubble variant
          </BubbleContent>
        </Bubble>
      ))}

      <BubbleGroup>
        <Bubble variant="secondary">
          <BubbleContent>
            Grouped bubbles stack with consistent spacing.
          </BubbleContent>
        </Bubble>
        <Bubble variant="secondary">
          <BubbleContent>Second message in the group.</BubbleContent>
          <BubbleReactions>👍 ❤️</BubbleReactions>
        </Bubble>
      </BubbleGroup>
    </div>
  )
}
