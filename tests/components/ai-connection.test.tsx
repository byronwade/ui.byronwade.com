/**
 * Exhaustive tests for the ai-connection component
 *
 * Component source: components/ai-elements/connection.tsx
 *
 * Exports:
 *   Connection – React-Flow connection-line component. Renders an SVG <g>
 *                containing a bezier <path> (data-slot="connection-path") and a
 *                terminal <circle> (data-slot="connection-dot"). Accepts
 *                fromX/fromY/toX/toY coords, a `tone` variant, and `className`.
 *
 * tone variant (applied to both path stroke and dot stroke):
 *   "ring"  (default) – stroke-ring
 *   "brand"           – stroke-brand
 *   "muted"           – stroke-muted-foreground
 */

import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { axe } from "vitest-axe"
import { ReactFlowProvider } from "@xyflow/react"
import { Connection } from "@/components/ai-elements/connection"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type ConnProps = React.ComponentProps<typeof Connection>

/** Minimal coord/style subset used by the component (the rest of the
 * React-Flow connection props are required by type but never read). */
type MinimalConnProps = {
  fromX: number
  fromY: number
  toX: number
  toY: number
  tone?: ConnProps["tone"]
  className?: string
}

const COORDS = {
  fromX: 0,
  fromY: 0,
  toX: 100,
  toY: 50,
}

/** Cast the minimal prop subset to the full Connection props type — the
 * component only reads from/to coords, tone and className. */
const conn = (props: MinimalConnProps) => (
  <Connection {...(props as unknown as ConnProps)} />
)

/**
 * Connection renders raw SVG children (<g>/<path>/<circle>); they must live
 * inside an <svg>, and the note requires a ReactFlowProvider wrapper.
 */
function renderConnection(props: Partial<MinimalConnProps> = {}) {
  return render(
    <ReactFlowProvider>
      <svg>{conn({ ...COORDS, ...props })}</svg>
    </ReactFlowProvider>
  )
}

// ---------------------------------------------------------------------------
// 1. Renders without crashing
// ---------------------------------------------------------------------------

describe("Connection — renders without crashing", () => {
  it("renders without crashing", () => {
    expect(() => renderConnection()).not.toThrow()
  })

  it("Connection is an exported function", () => {
    expect(typeof Connection).toBe("function")
  })

  it("renders a <g> root group", () => {
    const { container } = renderConnection()
    const group = container.querySelector("[data-slot='connection']")
    expect(group).toBeInTheDocument()
    expect(group?.tagName.toLowerCase()).toBe("g")
  })

  it("renders a path and a circle", () => {
    const { container } = renderConnection()
    expect(
      container.querySelector("[data-slot='connection-path']")
    ).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='connection-dot']")
    ).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// 2. data-slot attributes
// ---------------------------------------------------------------------------

describe("Connection — data-slot attributes", () => {
  it("group has data-slot='connection'", () => {
    const { container } = renderConnection()
    expect(
      container.querySelector("g[data-slot='connection']")
    ).toBeInTheDocument()
  })

  it("path has data-slot='connection-path'", () => {
    const { container } = renderConnection()
    const path = container.querySelector("[data-slot='connection-path']")
    expect(path?.tagName.toLowerCase()).toBe("path")
  })

  it("dot has data-slot='connection-dot'", () => {
    const { container } = renderConnection()
    const dot = container.querySelector("[data-slot='connection-dot']")
    expect(dot?.tagName.toLowerCase()).toBe("circle")
  })
})

// ---------------------------------------------------------------------------
// 3. Path geometry — bezier `d` from coordinates
// ---------------------------------------------------------------------------

describe("Connection — path geometry", () => {
  it("computes the bezier `d` from the from/to coordinates (HALF control points)", () => {
    const { container } = renderConnection({
      fromX: 0,
      fromY: 0,
      toX: 100,
      toY: 50,
    })
    const path = container.querySelector("[data-slot='connection-path']")
    // control points at 50% of the horizontal span (HALF = 0.5)
    expect(path).toHaveAttribute("d", "M0,0 C 50,0 50,50 100,50")
  })

  it("recomputes `d` for different coordinates", () => {
    const { container } = renderConnection({
      fromX: 10,
      fromY: 20,
      toX: 210,
      toY: 120,
    })
    const path = container.querySelector("[data-slot='connection-path']")
    // fromX + (toX-fromX)*0.5 = 10 + 200*0.5 = 110
    expect(path).toHaveAttribute("d", "M10,20 C 110,20 110,120 210,120")
  })

  it("path has fill-none and stroke-1 (hairline, no fill)", () => {
    const { container } = renderConnection()
    const path = container.querySelector(
      "[data-slot='connection-path']"
    ) as SVGPathElement
    expect(path.getAttribute("class")).toContain("fill-none")
    expect(path.getAttribute("class")).toContain("stroke-1")
  })

  it("path keeps the original `animated` class for React-Flow flow animation", () => {
    const { container } = renderConnection()
    const path = container.querySelector(
      "[data-slot='connection-path']"
    ) as SVGPathElement
    expect(path.getAttribute("class")).toContain("animated")
  })
})

// ---------------------------------------------------------------------------
// 4. Dot position — circle at the `to` endpoint
// ---------------------------------------------------------------------------

describe("Connection — terminal dot", () => {
  it("positions the dot at the `to` endpoint", () => {
    const { container } = renderConnection({
      fromX: 0,
      fromY: 0,
      toX: 100,
      toY: 50,
    })
    const dot = container.querySelector("[data-slot='connection-dot']")
    expect(dot).toHaveAttribute("cx", "100")
    expect(dot).toHaveAttribute("cy", "50")
  })

  it("dot has r=3 radius", () => {
    const { container } = renderConnection()
    const dot = container.querySelector("[data-slot='connection-dot']")
    expect(dot).toHaveAttribute("r", "3")
  })

  it("dot fills with the card token (not raw white)", () => {
    const { container } = renderConnection()
    const dot = container.querySelector(
      "[data-slot='connection-dot']"
    ) as SVGCircleElement
    expect(dot.getAttribute("class")).toContain("fill-card")
  })

  it("dot has stroke-1 hairline", () => {
    const { container } = renderConnection()
    const dot = container.querySelector(
      "[data-slot='connection-dot']"
    ) as SVGCircleElement
    expect(dot.getAttribute("class")).toContain("stroke-1")
  })
})

// ---------------------------------------------------------------------------
// 5. tone variant — stroke token on both path and dot
// ---------------------------------------------------------------------------

describe("Connection — tone variant", () => {
  it("defaults to tone='ring' (stroke-ring) when tone is omitted", () => {
    const { container } = renderConnection()
    const path = container.querySelector(
      "[data-slot='connection-path']"
    ) as SVGPathElement
    const dot = container.querySelector(
      "[data-slot='connection-dot']"
    ) as SVGCircleElement
    expect(path.getAttribute("class")).toContain("stroke-ring")
    expect(dot.getAttribute("class")).toContain("stroke-ring")
  })

  it("tone='ring' applies stroke-ring", () => {
    const { container } = renderConnection({ tone: "ring" })
    const path = container.querySelector(
      "[data-slot='connection-path']"
    ) as SVGPathElement
    expect(path.getAttribute("class")).toContain("stroke-ring")
  })

  it("tone='brand' applies stroke-brand to path and dot", () => {
    const { container } = renderConnection({ tone: "brand" })
    const path = container.querySelector(
      "[data-slot='connection-path']"
    ) as SVGPathElement
    const dot = container.querySelector(
      "[data-slot='connection-dot']"
    ) as SVGCircleElement
    expect(path.getAttribute("class")).toContain("stroke-brand")
    expect(dot.getAttribute("class")).toContain("stroke-brand")
  })

  it("tone='muted' applies stroke-muted-foreground to path and dot", () => {
    const { container } = renderConnection({ tone: "muted" })
    const path = container.querySelector(
      "[data-slot='connection-path']"
    ) as SVGPathElement
    const dot = container.querySelector(
      "[data-slot='connection-dot']"
    ) as SVGCircleElement
    expect(path.getAttribute("class")).toContain("stroke-muted-foreground")
    expect(dot.getAttribute("class")).toContain("stroke-muted-foreground")
  })

  it("non-default tone does not leave the default stroke-ring on the path", () => {
    const { container } = renderConnection({ tone: "brand" })
    const path = container.querySelector(
      "[data-slot='connection-path']"
    ) as SVGPathElement
    expect(path.getAttribute("class")).not.toContain("stroke-ring")
  })
})

// ---------------------------------------------------------------------------
// 6. className passthrough (path only)
// ---------------------------------------------------------------------------

describe("Connection — className passthrough", () => {
  it("forwards custom className to the path", () => {
    const { container } = renderConnection({ className: "custom-line" })
    const path = container.querySelector(
      "[data-slot='connection-path']"
    ) as SVGPathElement
    expect(path.getAttribute("class")).toContain("custom-line")
  })

  it("custom className merges with base path classes", () => {
    const { container } = renderConnection({ className: "custom-line" })
    const path = container.querySelector(
      "[data-slot='connection-path']"
    ) as SVGPathElement
    const cls = path.getAttribute("class") ?? ""
    expect(cls).toContain("custom-line")
    expect(cls).toContain("fill-none")
    expect(cls).toContain("animated")
  })
})

// ---------------------------------------------------------------------------
// 7. No raw colors leaked (DNA guard)
// ---------------------------------------------------------------------------

describe("Connection — token-only styling", () => {
  it("path uses no inline stroke/fill attributes (token utilities only)", () => {
    const { container } = renderConnection()
    const path = container.querySelector("[data-slot='connection-path']")
    expect(path).not.toHaveAttribute("stroke")
    expect(path).not.toHaveAttribute("fill")
  })

  it("dot uses no inline fill='#fff' (token utility only)", () => {
    const { container } = renderConnection()
    const dot = container.querySelector("[data-slot='connection-dot']")
    expect(dot).not.toHaveAttribute("fill")
    expect(dot?.getAttribute("class")).not.toMatch(/#fff|#ffffff/i)
  })
})

// ---------------------------------------------------------------------------
// 8. Re-render behavior
// ---------------------------------------------------------------------------

describe("Connection — re-render behavior", () => {
  it("updates path `d` when coordinates change", () => {
    const { container, rerender } = render(
      <ReactFlowProvider>
        <svg>{conn({ fromX: 0, fromY: 0, toX: 100, toY: 50 })}</svg>
      </ReactFlowProvider>
    )
    let path = container.querySelector("[data-slot='connection-path']")
    expect(path).toHaveAttribute("d", "M0,0 C 50,0 50,50 100,50")

    rerender(
      <ReactFlowProvider>
        <svg>{conn({ fromX: 0, fromY: 0, toX: 200, toY: 100 })}</svg>
      </ReactFlowProvider>
    )
    path = container.querySelector("[data-slot='connection-path']")
    expect(path).toHaveAttribute("d", "M0,0 C 100,0 100,100 200,100")
  })

  it("updates tone on re-render", () => {
    const { container, rerender } = render(
      <ReactFlowProvider>
        <svg>{conn({ ...COORDS, tone: "ring" })}</svg>
      </ReactFlowProvider>
    )
    let path = container.querySelector(
      "[data-slot='connection-path']"
    ) as SVGPathElement
    expect(path.getAttribute("class")).toContain("stroke-ring")

    rerender(
      <ReactFlowProvider>
        <svg>{conn({ ...COORDS, tone: "brand" })}</svg>
      </ReactFlowProvider>
    )
    path = container.querySelector(
      "[data-slot='connection-path']"
    ) as SVGPathElement
    expect(path.getAttribute("class")).toContain("stroke-brand")
    expect(path.getAttribute("class")).not.toContain("stroke-ring")
  })
})

// ---------------------------------------------------------------------------
// 9. Accessibility — axe
// ---------------------------------------------------------------------------

describe("Connection — accessibility (axe)", () => {
  it("has no axe violations (default tone)", async () => {
    const { container } = render(
      <main>
        <ReactFlowProvider>
          <svg aria-label="Connection line preview">{conn(COORDS)}</svg>
        </ReactFlowProvider>
      </main>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("has no axe violations (brand tone with custom className)", async () => {
    const { container } = render(
      <main>
        <ReactFlowProvider>
          <svg aria-label="Brand connection line">
            {conn({ ...COORDS, className: "custom-line", tone: "brand" })}
          </svg>
        </ReactFlowProvider>
      </main>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
