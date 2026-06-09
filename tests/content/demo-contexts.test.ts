import { describe, it, expect } from "vitest"
import {
  demoViewportWidths,
  parseDemoContextParams,
  resolveDemoExample,
  isDemoContextExample,
  type DemoContext,
} from "@/content/demo-contexts"
import { readInitialDemoContext } from "@/app/(docs)/_components/demo-preview-frame"
import {
  bySlug,
  getVariants,
  type ComponentDoc,
  type Variant,
} from "@/content/components"

const doc = {
  slug: "video-card",
  name: "Video card",
  category: "Video",
  description: "",
  examples: ["default"],
} as ComponentDoc

const variants: Variant[] = [
  { id: "default", name: "Default", tags: [], example: "default" },
  {
    id: "marketing-mobile",
    name: "Marketing mobile",
    tags: ["surface:marketing", "viewport:mobile"],
    example: "marketing-mobile",
  },
  {
    id: "app-only",
    name: "App",
    tags: ["surface:app"],
    example: "app",
  },
]

describe("demoViewportWidths", () => {
  it("matches template gallery widths", () => {
    expect(demoViewportWidths.tablet).toBe(834)
    expect(demoViewportWidths.mobile).toBe(390)
    expect(demoViewportWidths.desktop).toBeNull()
  })
})

describe("parseDemoContextParams", () => {
  it("defaults to app + desktop", () => {
    expect(parseDemoContextParams({})).toEqual({
      surface: "app",
      viewport: "desktop",
      density: "default",
      frame: "default",
      depth: "none",
      state: "default",
    })
  })

  it("parses valid params", () => {
    expect(
      parseDemoContextParams({ surface: "marketing", viewport: "mobile" }),
    ).toEqual({
      surface: "marketing",
      viewport: "mobile",
      density: "default",
      frame: "default",
      depth: "none",
      state: "default",
    })
  })

  it("ignores invalid values", () => {
    expect(
      parseDemoContextParams({ surface: "bogus", viewport: "tablet" }),
    ).toEqual({
      surface: "app",
      viewport: "tablet",
      density: "default",
      frame: "default",
      depth: "none",
      state: "default",
    })
  })

  it("parses the empty state param", () => {
    expect(parseDemoContextParams({ state: "empty" })).toEqual({
      surface: "app",
      viewport: "desktop",
      density: "default",
      frame: "default",
      depth: "none",
      state: "empty",
    })
  })

  it("parses density, frame, depth, and state params", () => {
    expect(
      parseDemoContextParams({
        density: "compact",
        frame: "inset",
        depth: "soft",
        state: "error",
      }),
    ).toEqual({
      surface: "app",
      viewport: "desktop",
      density: "compact",
      frame: "inset",
      depth: "soft",
      state: "error",
    })
  })
})

describe("readInitialDemoContext", () => {
  it("uses the component surface instead of a query toggle", () => {
    const params = new URLSearchParams(
      "surface=marketing&viewport=mobile&density=compact&frame=inset&depth=raised",
    )

    expect(readInitialDemoContext(params, "app")).toEqual({
      surface: "app",
      viewport: "mobile",
      density: "compact",
      frame: "inset",
      depth: "raised",
      state: "default",
    })
  })
})

describe("resolveDemoExample", () => {
  const ctx = (
    surface: DemoContext["surface"],
    viewport: DemoContext["viewport"],
    density: DemoContext["density"] = "default",
    frame: DemoContext["frame"] = "default",
    depth: DemoContext["depth"] = "none",
    state: DemoContext["state"] = "default",
  ) => ({ surface, viewport, density, frame, depth, state })

  it("prefers exact surface + viewport match", () => {
    const r = resolveDemoExample(
      doc,
      variants[0],
      ctx("marketing", "mobile"),
      variants,
    )
    expect(r.example).toBe("marketing-mobile")
    expect(r.fallbackLevel).toBe(1)
  })

  it("falls back to surface-only match", () => {
    const r = resolveDemoExample(
      doc,
      variants[0],
      ctx("app", "mobile"),
      variants,
    )
    expect(r.example).toBe("app")
    expect(r.fallbackLevel).toBe(2)
  })

  it("falls back to default variant", () => {
    const r = resolveDemoExample(
      doc,
      variants[0],
      ctx("marketing", "desktop"),
      variants,
    )
    expect(r.example).toBe("default")
    expect(r.fallbackLevel).toBe(4)
  })

  it("prefers density and frame matches within the active surface and viewport", () => {
    const r = resolveDemoExample(
      doc,
      variants[0],
      ctx("app", "desktop", "compact", "inset"),
      [
        ...variants,
        {
          id: "compact-inset",
          name: "Compact inset",
          tags: ["surface:app", "density:compact", "frame:inset"],
          example: "compact-inset",
        },
      ],
    )
    expect(r.example).toBe("compact-inset")
    expect(r.fallbackLevel).toBe(1)
  })

  it("resolves resource list density and frame controls to real examples", () => {
    const resourceList = bySlug("resource-list")!
    const resourceVariants = getVariants(resourceList)
    const active = resourceVariants[0]

    expect(
      resolveDemoExample(
        resourceList,
        active,
        ctx("app", "desktop", "compact", "default"),
        resourceVariants,
      ).example,
    ).toBe("compact")

    expect(
      resolveDemoExample(
        resourceList,
        active,
        ctx("app", "desktop", "default", "inset"),
        resourceVariants,
      ).example,
    ).toBe("inset")

    expect(
      resolveDemoExample(
        resourceList,
        active,
        ctx("app", "desktop", "comfortable", "default"),
        resourceVariants,
      ).example,
    ).toBe("comfortable")

    expect(
      resolveDemoExample(
        resourceList,
        active,
        ctx("app", "desktop", "compact", "inset"),
        resourceVariants,
      ).example,
    ).toBe("compact-inset")

    expect(
      resolveDemoExample(
        resourceList,
        active,
        ctx("app", "desktop", "comfortable", "inset"),
        resourceVariants,
      ).example,
    ).toBe("comfortable-inset")
  })

  it("resolves density and frame examples without authored variant tags", () => {
    const docWithoutContextVariants = {
      slug: "resource-list",
      name: "Resource list",
      category: "Data display",
      description: "",
      examples: [
        "default",
        "compact",
        "inset",
        "compact-inset",
        "comfortable",
        "comfortable-inset",
        "empty",
      ],
    } as ComponentDoc
    const active = {
      id: "default",
      name: "Resource list",
      tags: [],
      example: "default",
    }

    expect(
      resolveDemoExample(
        docWithoutContextVariants,
        active,
        ctx("app", "desktop", "compact", "default"),
        [active],
      ).example,
    ).toBe("compact")

    expect(
      resolveDemoExample(
        docWithoutContextVariants,
        active,
        ctx("app", "desktop", "comfortable", "inset"),
        [active],
      ).example,
    ).toBe("comfortable-inset")
  })
})

describe("isDemoContextExample", () => {
  it("identifies examples controlled by the toolbar density and frame controls", () => {
    expect(isDemoContextExample("default")).toBe(false)
    expect(isDemoContextExample("empty")).toBe(false)
    expect(isDemoContextExample("compact")).toBe(true)
    expect(isDemoContextExample("inset")).toBe(true)
    expect(isDemoContextExample("compact-inset")).toBe(true)
    expect(isDemoContextExample("comfortable")).toBe(true)
    expect(isDemoContextExample("comfortable-inset")).toBe(true)
  })
})
