import * as React from "react"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { axe } from "vitest-axe"

const replace = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  usePathname: () => "/docs/button",
  useSearchParams: () => new URLSearchParams(),
}))

beforeEach(() => {
  replace.mockClear()
})
import { bySlug, getVariants } from "@/content/components"
import { getSurface } from "@/content/catalog-surfaces"
import { examples } from "@/content/examples/registry"
import {
  VariantBrowser,
  filterVariants,
  type VariantView,
} from "@/app/(docs)/_components/variant-browser"

const doc = bySlug("button")!
const allVariants = getVariants(doc)
const demos = examples.button ?? []
const codeByExample: Record<string, string> = {}
for (const d of demos) {
  const base = d.file
    .split("/")
    .pop()!
    .replace(/\.tsx$/, "")
  codeByExample[base] = readFileSync(
    join(process.cwd(), "content/examples", d.file),
    "utf8",
  ).trimEnd()
}

const variants: VariantView[] = ["solid", "ghost", "icon"].map((id) => {
  const v = allVariants.find((variant) => variant.id === id)!
  return {
    id: v.id,
    name: v.name,
    tags: v.tags,
    install: `npx shadcn@latest add @byronwade/button`,
    variant: v,
    code: codeByExample[v.example] ?? "",
  }
})

const browserProps = {
  slug: doc.slug,
  defaultSurface: doc.demoContext?.defaultSurface ?? getSurface(doc),
  demoContext: doc.demoContext,
  allVariants,
  codeByExample,
  docExamples: doc.examples,
  variants,
}

describe("filterVariants", () => {
  const base = { query: "", tags: [] }
  it("returns all with no filter", () => {
    expect(filterVariants(variants, base)).toHaveLength(3)
  })
  it("query matches name / id / tags", () => {
    expect(
      filterVariants(variants, { ...base, query: "GHOST" }).map((v) => v.id),
    ).toEqual(["ghost"])
    expect(
      filterVariants(variants, { ...base, query: "shape:icon" }).map(
        (v) => v.id,
      ),
    ).toEqual(["icon"])
  })
  it("tag facet matches any selected tag", () => {
    expect(
      filterVariants(variants, { ...base, tags: ["emphasis:low"] }).map(
        (v) => v.id,
      ),
    ).toEqual(["ghost"])
  })
  it("empty when nothing matches", () => {
    expect(filterVariants(variants, { ...base, query: "zzz" })).toHaveLength(0)
  })
})

describe("VariantBrowser", () => {
  it("renders an anchored block per variant with name, tags, and install", () => {
    const { container } = render(<VariantBrowser {...browserProps} />)
    expect(container.querySelector("#solid")).not.toBeNull()
    expect(container.querySelector("#ghost")).not.toBeNull()
    expect(
      screen.getByRole("button", { name: "Save changes" }),
    ).toBeInTheDocument()
    expect(screen.getByText("variant:ghost")).toBeInTheDocument()
    expect(
      screen.getAllByText(/add @byronwade\/button/).length,
    ).toBeGreaterThanOrEqual(3)
  })

  it("free-text search filters the rendered blocks", async () => {
    const user = userEvent.setup()
    const { container } = render(<VariantBrowser {...browserProps} />)
    await user.type(
      screen.getByRole("searchbox", { name: /search variants/i }),
      "ghost",
    )
    expect(container.querySelector("#ghost")).not.toBeNull()
    expect(container.querySelector("#solid")).toBeNull()
  })

  it("shows an empty state when nothing matches", async () => {
    const user = userEvent.setup()
    render(<VariantBrowser {...browserProps} />)
    await user.type(
      screen.getByRole("searchbox", { name: /search variants/i }),
      "zzz",
    )
    expect(screen.getByText(/No variants match/i)).toBeInTheDocument()
  })

  it("has no axe violations", async () => {
    const { container } = render(<VariantBrowser {...browserProps} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
