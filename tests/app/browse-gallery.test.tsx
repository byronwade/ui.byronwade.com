import { render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { BrowseGallery } from "@/app/_components/browse-gallery"
import type { BrowseItem } from "@/content/browse"

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

const items: BrowseItem[] = [
  {
    kind: "layout",
    slug: "ops",
    name: "Ops Workspace",
    surface: "app",
    group: "Operations",
    href: "/layouts/ops",
    previewSrc: "/preview/ops",
    search: "ops workspace operations app",
  },
]

const componentItems: BrowseItem[] = [
  {
    kind: "component",
    slug: "missing-thumb",
    name: "Missing Thumb",
    surface: "app",
    group: "Primitive",
    href: "/docs/components/missing-thumb",
    search: "missing thumb primitive app",
    thumbnailAvailable: false,
  },
]

describe("BrowseGallery", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("keeps catalog cards in one column on mobile", () => {
    const { container } = render(<BrowseGallery items={items} />)

    expect(screen.getByLabelText("Ops Workspace")).toBeInTheDocument()
    expect(container.querySelector("ul")).toHaveClass("grid-cols-1")
  })

  it("does not mount oversized live preview iframes before the desktop breakpoint", () => {
    const { container } = render(<BrowseGallery items={items} />)

    expect(container.querySelector("iframe")).not.toBeInTheDocument()
  })

  it("mounts live preview iframes on desktop", async () => {
    vi.stubGlobal("matchMedia", () => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))

    const { container } = render(<BrowseGallery items={items} />)

    expect(
      await screen.findByTitle("Ops Workspace preview"),
    ).toBeInTheDocument()
    expect(container.querySelector("iframe")).toHaveClass(
      "hidden",
      "sm:block",
      "w-[320%]",
    )
  })

  it("uses the avatar fallback when a thumbnail is unavailable", () => {
    const { container } = render(<BrowseGallery items={componentItems} />)

    expect(screen.getByLabelText("Missing Thumb")).toBeInTheDocument()
    expect(container.querySelector("img")).not.toBeInTheDocument()
  })
})
