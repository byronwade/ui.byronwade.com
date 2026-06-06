import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"

import { Thumbnail } from "@/components/ui/thumbnail"

const SRC = "https://example.com/v.jpg"

const root = (c: HTMLElement) =>
  c.querySelector('[data-slot="thumbnail"]') as HTMLElement

const slot = (c: HTMLElement, name: string) =>
  c.querySelector(`[data-slot="${name}"]`)

describe("Thumbnail", () => {
  it("renders the root with its data-slot", () => {
    const { container } = render(<Thumbnail src={SRC} alt="Clip" />)
    expect(root(container)).toBeInTheDocument()
    expect(root(container)).toHaveClass("rounded-lg")
  })

  it("renders the image with src and alt when src is provided", () => {
    render(<Thumbnail src={SRC} alt="Clip" />)
    const img = screen.getByAltText("Clip")
    expect(img).toHaveAttribute("src", SRC)
    expect(img).toHaveAttribute("data-slot", "thumbnail-image")
  })

  it("renders no image and a placeholder when src is absent", () => {
    const { container } = render(<Thumbnail alt="Clip" />)
    expect(container.querySelector("img")).toBeNull()
    expect(slot(container, "thumbnail-placeholder")).toBeInTheDocument()
  })

  it("uses the uppercased alt initial in the placeholder", () => {
    const { container } = render(<Thumbnail alt="draft clip" />)
    expect(slot(container, "thumbnail-placeholder")).toHaveTextContent("D")
  })

  it("falls back to the play glyph when there is no alt", () => {
    const { container } = render(<Thumbnail />)
    const placeholder = slot(container, "thumbnail-placeholder") as HTMLElement
    expect(placeholder).toBeInTheDocument()
    expect(placeholder.querySelector("svg")).toBeInTheDocument()
    expect(placeholder).toHaveTextContent("")
  })

  it("renders the duration pill when duration is provided", () => {
    const { container } = render(
      <Thumbnail src={SRC} alt="Clip" duration="12:34" />,
    )
    const pill = slot(container, "thumbnail-duration") as HTMLElement
    expect(pill).toHaveTextContent("12:34")
    expect(pill).toHaveClass("font-mono", "tabular-nums")
  })

  it("omits the duration pill when duration is absent", () => {
    const { container } = render(<Thumbnail src={SRC} alt="Clip" />)
    expect(slot(container, "thumbnail-duration")).toBeNull()
  })

  it("renders the progress bar with a clamped width when progress is set", () => {
    const { container } = render(
      <Thumbnail src={SRC} alt="Clip" progress={42} />,
    )
    const fill = slot(container, "thumbnail-progress-fill") as HTMLElement
    expect(slot(container, "thumbnail-progress")).toBeInTheDocument()
    expect(fill).toHaveClass("bg-brand")
    expect(fill).toHaveStyle({ width: "42%" })
  })

  it("clamps progress below 0 to 0%", () => {
    const { container } = render(
      <Thumbnail src={SRC} alt="Clip" progress={-10} />,
    )
    const fill = slot(container, "thumbnail-progress-fill") as HTMLElement
    expect(fill).toHaveStyle({ width: "0%" })
  })

  it("clamps progress above 100 to 100%", () => {
    const { container } = render(
      <Thumbnail src={SRC} alt="Clip" progress={150} />,
    )
    const fill = slot(container, "thumbnail-progress-fill") as HTMLElement
    expect(fill).toHaveStyle({ width: "100%" })
  })

  it("omits the progress bar when progress is undefined", () => {
    const { container } = render(<Thumbnail src={SRC} alt="Clip" />)
    expect(slot(container, "thumbnail-progress")).toBeNull()
  })

  it("renders the live chip when live is true", () => {
    const { container } = render(<Thumbnail src={SRC} alt="Clip" live />)
    const chip = slot(container, "thumbnail-live") as HTMLElement
    expect(chip).toHaveTextContent("Live")
    expect(chip).toHaveClass("bg-destructive", "text-destructive-foreground")
  })

  it("omits the live chip by default", () => {
    const { container } = render(<Thumbnail src={SRC} alt="Clip" />)
    expect(slot(container, "thumbnail-live")).toBeNull()
  })

  it("forwards a custom ratio to AspectRatio", () => {
    const { container } = render(<Thumbnail src={SRC} alt="Clip" ratio={1} />)
    const ar = container.querySelector(
      '[data-slot="aspect-ratio"]',
    ) as HTMLElement
    expect(ar.style.getPropertyValue("--ratio")).toBe("1")
  })

  it("merges a custom className onto the root", () => {
    const { container } = render(
      <Thumbnail src={SRC} alt="Clip" className="custom" />,
    )
    expect(root(container)).toHaveClass("custom")
  })

  it("lazy-loads images by default", () => {
    render(<Thumbnail src={SRC} alt="Clip" />)
    expect(screen.getByAltText("Clip")).toHaveAttribute("loading", "lazy")
  })

  it("renders a hover play overlay when hoverPlay is true", () => {
    const { container } = render(
      <Thumbnail src={SRC} alt="Clip" hoverPlay />,
    )
    expect(slot(container, "thumbnail-hover-play")).toBeInTheDocument()
  })

  it("omits the hover play overlay by default", () => {
    const { container } = render(<Thumbnail src={SRC} alt="Clip" />)
    expect(slot(container, "thumbnail-hover-play")).toBeNull()
  })

  it("has no axe violations with an image", async () => {
    const { container } = render(
      <Thumbnail src={SRC} alt="Clip" duration="12:34" progress={42} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations as a live placeholder", async () => {
    const { container } = render(<Thumbnail alt="Stream" live />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
