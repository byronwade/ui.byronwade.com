import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"

import { ComponentReferenceSections } from "@/app/(docs)/_components/component-reference-sections"
import type { ComponentDoc } from "@/content/components"

const doc = {
  slug: "demo-panel",
  name: "Demo panel",
  category: "UI",
  description: "",
  examples: ["default"],
  registryDeps: ["@byronwade/foundation"],
  npmDeps: ["@base-ui/react"],
  props: [
    {
      name: "open",
      type: "boolean",
      default: "false",
      description: "Controls the panel visibility.",
    },
  ],
  features: [
    {
      title: "Controlled or uncontrolled",
      description: "Works with local state or external state.",
    },
  ],
  exports: [
    {
      name: "DemoPanel",
      type: "component",
      description: "Root panel component.",
    },
  ],
  slots: [
    {
      name: "demo-panel",
      element: "section",
      description: "Root slot.",
    },
  ],
  cssVars: [
    {
      name: "--demo-panel-gap",
      default: "1rem",
      description: "Spacing between panel regions.",
    },
  ],
  source: [
    {
      label: "Component",
      path: "registry/ui/demo-panel.tsx",
    },
  ],
  related: ["button"],
} satisfies ComponentDoc

describe("ComponentReferenceSections", () => {
  it("renders features, API groups, dependencies, source, and related links", () => {
    render(<ComponentReferenceSections doc={doc} />)

    expect(screen.getByRole("heading", { name: "Features" })).toBeVisible()
    expect(screen.getByText("Controlled or uncontrolled")).toBeVisible()

    expect(screen.getByRole("heading", { name: "API" })).toBeVisible()
    expect(screen.getByText("open")).toBeVisible()
    expect(screen.getByText("DemoPanel")).toBeVisible()
    expect(screen.getByText("demo-panel")).toBeVisible()
    expect(screen.getByText("--demo-panel-gap")).toBeVisible()
    expect(screen.getByText("@byronwade/foundation")).toBeVisible()
    expect(screen.getByText("@base-ui/react")).toBeVisible()

    expect(
      screen.getByRole("heading", { name: "Source and related" }),
    ).toBeVisible()
    expect(screen.getByText("registry/ui/demo-panel.tsx")).toBeVisible()
    expect(screen.getByRole("link", { name: "Button" })).toHaveAttribute(
      "href",
      "/docs/button",
    )
  })

  it("omits empty optional sections", () => {
    render(
      <ComponentReferenceSections
        doc={{
          slug: "empty",
          name: "Empty",
          category: "UI",
          description: "",
          examples: [],
        }}
      />,
    )

    expect(screen.queryByRole("heading", { name: "Features" })).toBeNull()
    expect(screen.queryByRole("heading", { name: "API" })).toBeNull()
    expect(
      screen.getByRole("heading", { name: "Source and related" }),
    ).toBeVisible()
    expect(screen.getByText("registry/ui/empty.tsx")).toBeVisible()
  })

  it("has no axe violations", async () => {
    const { container } = render(<ComponentReferenceSections doc={doc} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
