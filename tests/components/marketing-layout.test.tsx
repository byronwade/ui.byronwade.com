import * as React from "react"
import { render, within } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { axe } from "vitest-axe"
import { MarketingLayout, type MarketingVariant } from "@/components/marketing-layout"

// ─── Fixtures ───────────────────────────────────────────────────────────────────

const ALL_VARIANTS: MarketingVariant[] = [
  "landing",
  "split-hero",
  "centered",
  "bento",
  "pricing",
  "feature-rows",
  "article",
  "docs-marketing",
  "gallery",
  "coming-soon",
]

function full(variant: MarketingVariant) {
  return render(
    <MarketingLayout
      variant={variant}
      nav={<div data-testid="nav-content">nav</div>}
      hero={<div data-testid="hero-content">hero</div>}
      media={<div data-testid="media-content">media</div>}
      sidebar={<div data-testid="sidebar-content">sidebar</div>}
      aside={<div data-testid="aside-content">aside</div>}
      footer={<div data-testid="footer-content">footer</div>}
    >
      <div data-testid="section-content">sections</div>
    </MarketingLayout>,
  )
}

const slot = (container: HTMLElement, name: string) =>
  container.querySelector(`[data-slot="${name}"]`)

// ─── Smoke ───────────────────────────────────────────────────────────────────

describe("MarketingLayout – smoke", () => {
  it("renders without crashing and defaults to the landing variant", () => {
    const { container, getByTestId } = render(
      <MarketingLayout hero={<div data-testid="h">hero</div>}>
        <div>s</div>
      </MarketingLayout>,
    )
    expect(getByTestId("h")).toBeInTheDocument()
    expect(slot(container, "marketing-layout")).toHaveAttribute("data-variant", "landing")
  })

  it("renders nav and footer frame regions for every variant", () => {
    for (const variant of ALL_VARIANTS) {
      const { container } = full(variant)
      expect(slot(container, "marketing-nav")).toBeInTheDocument()
      expect(slot(container, "marketing-footer")).toBeInTheDocument()
    }
  })

  it("stamps the variant onto data-variant for every variant", () => {
    for (const variant of ALL_VARIANTS) {
      const { container } = full(variant)
      expect(slot(container, "marketing-layout")).toHaveAttribute("data-variant", variant)
    }
  })

  it("renders the hero for every variant", () => {
    for (const variant of ALL_VARIANTS) {
      const { container } = full(variant)
      expect(within(container).getByTestId("hero-content")).toBeInTheDocument()
    }
  })
})

// ─── Variant-specific composition ────────────────────────────────────────────

describe("MarketingLayout – variant composition", () => {
  it("split-hero renders the media column", () => {
    const { container, getByTestId } = full("split-hero")
    expect(slot(container, "marketing-media")).toBeInTheDocument()
    expect(getByTestId("media-content")).toBeInTheDocument()
  })

  it("docs-marketing renders sidebar, content, and toc rails", () => {
    const { container } = full("docs-marketing")
    expect(slot(container, "marketing-sidebar")).toBeInTheDocument()
    expect(slot(container, "marketing-content")).toBeInTheDocument()
    expect(slot(container, "marketing-toc")).toBeInTheDocument()
  })

  it("renders the sections region for non-coming-soon variants", () => {
    for (const variant of ALL_VARIANTS.filter((v) => v !== "coming-soon")) {
      const { container } = full(variant)
      expect(slot(container, "marketing-sections")).toBeInTheDocument()
      expect(within(container).getAllByTestId("section-content").length).toBeGreaterThan(0)
    }
  })

  it("coming-soon omits the sections region (single focal hero)", () => {
    const { container } = full("coming-soon")
    expect(slot(container, "marketing-sections")).toBeNull()
    expect(slot(container, "marketing-hero")).toBeInTheDocument()
  })
})

// ─── Omitted slots (falsy branches) ──────────────────────────────────────────

describe("MarketingLayout – omitted slots", () => {
  for (const variant of ALL_VARIANTS) {
    it(`${variant} renders with no optional slots`, () => {
      const { container } = render(<MarketingLayout variant={variant} />)
      expect(slot(container, "marketing-layout")).toBeInTheDocument()
      expect(slot(container, "marketing-nav")).toBeNull()
      expect(slot(container, "marketing-footer")).toBeNull()
    })
  }

  it("docs-marketing renders with no sidebar/aside/hero", () => {
    const { container, getByTestId } = render(
      <MarketingLayout variant="docs-marketing">
        <div data-testid="only">only</div>
      </MarketingLayout>,
    )
    expect(getByTestId("only")).toBeInTheDocument()
    expect(slot(container, "marketing-sidebar")).toBeNull()
    expect(slot(container, "marketing-toc")).toBeNull()
    expect(slot(container, "marketing-content")).toBeInTheDocument()
  })

  it("split-hero renders with no media column", () => {
    const { container } = render(
      <MarketingLayout variant="split-hero" hero={<div>h</div>} />,
    )
    expect(slot(container, "marketing-hero")).toBeInTheDocument()
    expect(slot(container, "marketing-media")).toBeNull()
  })
})

// ─── className passthrough ───────────────────────────────────────────────────

describe("MarketingLayout – className passthrough", () => {
  it("merges a custom className onto the root frame", () => {
    const { container } = render(<MarketingLayout className="custom-page-class" />)
    expect(slot(container, "marketing-layout")).toHaveClass("custom-page-class")
    expect(slot(container, "marketing-layout")).toHaveClass("flex")
  })
})

// ─── Accessibility ───────────────────────────────────────────────────────────

describe("MarketingLayout – accessibility (axe)", () => {
  const axeOpts = { rules: { region: { enabled: false } } }

  it("landing has no violations", async () => {
    const { container } = full("landing")
    expect(await axe(container, axeOpts)).toHaveNoViolations()
  })

  it("docs-marketing (nav sidebar + complementary toc) has no violations", async () => {
    const { container } = full("docs-marketing")
    expect(await axe(container, axeOpts)).toHaveNoViolations()
  })

  it("coming-soon has no violations", async () => {
    const { container } = full("coming-soon")
    expect(await axe(container, axeOpts)).toHaveNoViolations()
  })
})
