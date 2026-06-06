import { describe, expect, it } from "vitest"

import {
  bySlug,
  getComponentFeatures,
  getComponentSourceRows,
  resolveRelatedComponents,
  type ComponentDoc,
} from "@/content/components"

describe("component docs reference metadata", () => {
  it("returns authored features unchanged", () => {
    const doc = {
      slug: "demo-card",
      name: "Demo card",
      category: "UI",
      description: "",
      examples: ["default"],
      features: [
        {
          title: "Composes token surfaces",
          description: "Keeps card chrome on semantic color utilities.",
        },
      ],
    } satisfies ComponentDoc

    expect(getComponentFeatures(doc)).toEqual([
      {
        title: "Composes token surfaces",
        description: "Keeps card chrome on semantic color utilities.",
      },
    ])
  })

  it("derives fallback features from variants, examples, and tags", () => {
    const doc = {
      slug: "demo-button",
      name: "Demo button",
      category: "UI",
      description: "",
      examples: ["default", "with-icon"],
      tags: ["action", "interactive"],
      variants: [
        {
          id: "solid",
          name: "Solid",
          tags: ["variant:solid"],
          example: "default",
        },
        {
          id: "ghost",
          name: "Ghost",
          tags: ["variant:ghost"],
          example: "with-icon",
        },
      ],
    } satisfies ComponentDoc

    expect(getComponentFeatures(doc)).toEqual([
      {
        title: "2 documented variants",
        description: "Solid, Ghost.",
      },
      {
        title: "2 examples",
        description: "Default, With Icon.",
      },
      {
        title: "Tagged for action, interactive",
      },
    ])
  })

  it("derives source rows from the component category and examples", () => {
    const doc = {
      slug: "demo-input",
      name: "Demo input",
      category: "Forms",
      description: "",
      examples: ["default", "disabled"],
    } satisfies ComponentDoc

    expect(getComponentSourceRows(doc)).toEqual([
      {
        label: "Component",
        path: "registry/ui/demo-input.tsx",
      },
      {
        label: "Default example",
        path: "content/examples/demo-input/default.tsx",
      },
      {
        label: "Disabled example",
        path: "content/examples/demo-input/disabled.tsx",
      },
    ])
  })

  it("resolves related component slugs and drops unknown slugs", () => {
    const doc = {
      slug: "demo-related",
      name: "Demo related",
      category: "UI",
      description: "",
      examples: [],
      related: ["button", "missing-component"],
    } satisfies ComponentDoc

    expect(resolveRelatedComponents(doc)).toEqual([
      {
        slug: "button",
        name: bySlug("button")?.name,
        href: "/docs/button",
      },
    ])
  })
})
