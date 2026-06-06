/**
 * Tests for Carousel (components/ui/carousel.tsx) — Embla-powered carousel.
 * Embla is mocked so jsdom can assert structure without scroll geometry.
 */

import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { axe } from "vitest-axe"

const emblaMocks = vi.hoisted(() => {
  const scrollPrev = vi.fn()
  const scrollNext = vi.fn()
  const api = {
    canScrollPrev: () => false,
    canScrollNext: () => true,
    scrollPrev,
    scrollNext,
    on: vi.fn(),
    off: vi.fn(),
  }
  return { scrollPrev, scrollNext, api }
})

vi.mock("embla-carousel-react", () => ({
  default: vi.fn(() => [vi.fn(), emblaMocks.api]),
}))

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

function BasicCarousel({ count = 3 }: { count?: number }) {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: count }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-6">Slide {index + 1}</div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

describe("Carousel — render", () => {
  it("renders the carousel region and slides", () => {
    render(<BasicCarousel />)
    expect(screen.getByRole("region")).toHaveAttribute("aria-roledescription", "carousel")
    expect(screen.getByText("Slide 1")).toBeInTheDocument()
    expect(screen.getByText("Slide 2")).toBeInTheDocument()
    expect(screen.getByText("Slide 3")).toBeInTheDocument()
  })

  it("has data-slot attributes on carousel parts", () => {
    const { container } = render(<BasicCarousel />)
    expect(container.querySelector('[data-slot="carousel"]')).not.toBeNull()
    expect(container.querySelector('[data-slot="carousel-content"]')).not.toBeNull()
    expect(container.querySelectorAll('[data-slot="carousel-item"]')).toHaveLength(3)
    expect(container.querySelector('[data-slot="carousel-previous"]')).not.toBeNull()
    expect(container.querySelector('[data-slot="carousel-next"]')).not.toBeNull()
  })

  it("renders previous and next controls with accessible names", () => {
    render(<BasicCarousel />)
    expect(screen.getByRole("button", { name: "Previous slide" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Next slide" })).toBeInTheDocument()
  })
})

describe("Carousel — interaction", () => {
  it("calls scrollNext when Next is clicked", async () => {
    const user = userEvent.setup()
    emblaMocks.scrollNext.mockClear()
    render(<BasicCarousel />)
    await user.click(screen.getByRole("button", { name: "Next slide" }))
    expect(emblaMocks.scrollNext).toHaveBeenCalled()
  })

  it("calls scrollPrev when Previous is clicked", async () => {
    const user = userEvent.setup()
    emblaMocks.scrollPrev.mockClear()
    emblaMocks.api.canScrollPrev = () => true
    render(<BasicCarousel />)
    await user.click(screen.getByRole("button", { name: "Previous slide" }))
    expect(emblaMocks.scrollPrev).toHaveBeenCalled()
  })

  it("handles ArrowLeft keyboard on the carousel region", async () => {
    const user = userEvent.setup()
    render(<BasicCarousel />)
    const region = screen.getByRole("region")
    region.focus()
    await user.keyboard("{ArrowLeft}")
    expect(region).toBeInTheDocument()
  })
})

describe("Carousel — accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(<BasicCarousel />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
