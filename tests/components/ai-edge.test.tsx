/**
 * Exhaustive tests for the Edge compound (React Flow custom edges)
 *
 * Component source: components/ai-elements/edge.tsx
 *
 * Exports:
 *   Edge            – object with two React Flow edge components:
 *     Edge.Temporary – dashed simple-bezier edge (stroke-ring), data-slot="edge-temporary"
 *     Edge.Animated  – bezier edge with a brand dot traveling along it,
 *                      data-slot="edge-animated" (+ "edge-animated-dot" on the circle).
 *                      Returns null when source/target nodes are not in the store.
 *
 * React Flow edges must render inside an <svg> within a <ReactFlowProvider>.
 * Edge.Animated reads node geometry from the store via useInternalNode; we
 * partial-mock that hook so its truthy path (getEdgeParams + handle math) runs
 * deterministically in jsdom (which never measures real nodes).
 */

import { render } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { axe } from "vitest-axe"
import { Position, ReactFlowProvider } from "@xyflow/react"

// --- partial mock of @xyflow/react: only swap useInternalNode -------------
const fakeNodes: Record<string, unknown> = {}

vi.mock("@xyflow/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@xyflow/react")>()
  return {
    ...actual,
    useInternalNode: (id: string) => fakeNodes[id],
  }
})

import { Edge } from "@/components/ai-elements/edge"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build an internal-node-like object with measurable handle bounds. */
function makeNode(
  x: number,
  y: number,
  opts?: { withHandles?: boolean }
) {
  const withHandles = opts?.withHandles ?? true
  return {
    internals: {
      positionAbsolute: { x, y },
      handleBounds: withHandles
        ? {
            source: [
              { position: Position.Right, x: 100, y: 20, width: 8, height: 8 },
            ],
            target: [
              { position: Position.Left, x: 0, y: 20, width: 8, height: 8 },
            ],
          }
        : undefined,
    },
  }
}

/** Render a React Flow edge inside the required SVG + provider scaffolding. */
function renderEdge(ui: React.ReactNode) {
  return render(
    <ReactFlowProvider>
      <svg>
        <g>{ui}</g>
      </svg>
    </ReactFlowProvider>
  )
}

const temporaryProps = {
  id: "e-temp",
  source: "a",
  target: "b",
  sourceX: 0,
  sourceY: 0,
  targetX: 200,
  targetY: 100,
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
} as never

const animatedProps = {
  id: "e-anim",
  source: "a",
  target: "b",
} as never

function resetFakeNodes() {
  for (const k of Object.keys(fakeNodes)) {
    delete fakeNodes[k]
  }
}

// ---------------------------------------------------------------------------
// 1. Exports
// ---------------------------------------------------------------------------

describe("Edge — exports", () => {
  it("exports an Edge object", () => {
    expect(Edge).toBeTypeOf("object")
  })

  it("exposes Edge.Temporary as a component", () => {
    expect(Edge.Temporary).toBeTypeOf("function")
  })

  it("exposes Edge.Animated as a component", () => {
    expect(Edge.Animated).toBeTypeOf("function")
  })
})

// ---------------------------------------------------------------------------
// 2. Edge.Temporary — render + classes + data-slot
// ---------------------------------------------------------------------------

describe("Edge.Temporary — render", () => {
  it("renders without crashing", () => {
    expect(() =>
      renderEdge(<Edge.Temporary {...temporaryProps} />)
    ).not.toThrow()
  })

  it("renders a <path> carrying data-slot='edge-temporary'", () => {
    const { container } = renderEdge(<Edge.Temporary {...temporaryProps} />)
    const path = container.querySelector("[data-slot='edge-temporary']")
    expect(path).toBeInTheDocument()
    expect(path?.tagName).toBe("path")
  })

  it("applies the stroke-ring token class", () => {
    const { container } = renderEdge(<Edge.Temporary {...temporaryProps} />)
    const path = container.querySelector(
      "[data-slot='edge-temporary']"
    ) as SVGPathElement
    expect(path.getAttribute("class")).toContain("stroke-ring")
  })

  it("applies the stroke-1 token class", () => {
    const { container } = renderEdge(<Edge.Temporary {...temporaryProps} />)
    const path = container.querySelector(
      "[data-slot='edge-temporary']"
    ) as SVGPathElement
    expect(path.getAttribute("class")).toContain("stroke-1")
  })

  it("renders a dashed stroke (strokeDasharray inline style)", () => {
    const { container } = renderEdge(<Edge.Temporary {...temporaryProps} />)
    const path = container.querySelector(
      "[data-slot='edge-temporary']"
    ) as SVGPathElement
    expect(path.style.strokeDasharray).toBe("5, 5")
  })

  it("forwards the edge id", () => {
    const { container } = renderEdge(<Edge.Temporary {...temporaryProps} />)
    const path = container.querySelector("[data-slot='edge-temporary']")
    expect(path).toHaveAttribute("id", "e-temp")
  })

  it("computes a non-empty bezier path (d attribute)", () => {
    const { container } = renderEdge(<Edge.Temporary {...temporaryProps} />)
    const path = container.querySelector("[data-slot='edge-temporary']")
    expect(path?.getAttribute("d")).toBeTruthy()
  })

  it("merges a custom className onto the path", () => {
    const { container } = renderEdge(
      <Edge.Temporary {...temporaryProps} className="custom-edge" />
    )
    const path = container.querySelector(
      "[data-slot='edge-temporary']"
    ) as SVGPathElement
    const cls = path.getAttribute("class") ?? ""
    expect(cls).toContain("custom-edge")
    expect(cls).toContain("stroke-ring")
  })

  it("works with alternate source/target positions", () => {
    expect(() =>
      renderEdge(
        <Edge.Temporary
          {...({
            ...(temporaryProps as object),
            sourcePosition: Position.Bottom,
            targetPosition: Position.Top,
          } as never)}
        />
      )
    ).not.toThrow()
  })
})

// ---------------------------------------------------------------------------
// 3. Edge.Animated — null branch (nodes absent from store)
// ---------------------------------------------------------------------------

describe("Edge.Animated — missing nodes", () => {
  it("renders null when both nodes are absent", () => {
    resetFakeNodes()
    const { container } = renderEdge(<Edge.Animated {...animatedProps} />)
    expect(container.querySelector("[data-slot='edge-animated']")).toBeNull()
    expect(
      container.querySelector("[data-slot='edge-animated-dot']")
    ).toBeNull()
  })

  it("renders null when only the source node is present", () => {
    resetFakeNodes()
    fakeNodes.a = makeNode(0, 0)
    const { container } = renderEdge(<Edge.Animated {...animatedProps} />)
    expect(container.querySelector("[data-slot='edge-animated']")).toBeNull()
  })

  it("renders null when only the target node is present", () => {
    resetFakeNodes()
    fakeNodes.b = makeNode(200, 0)
    const { container } = renderEdge(<Edge.Animated {...animatedProps} />)
    expect(container.querySelector("[data-slot='edge-animated']")).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// 4. Edge.Animated — truthy branch (both nodes present, handles found)
// ---------------------------------------------------------------------------

describe("Edge.Animated — with both nodes", () => {
  function renderAnimated(extra?: Record<string, unknown>) {
    resetFakeNodes()
    fakeNodes.a = makeNode(0, 0)
    fakeNodes.b = makeNode(200, 0)
    return renderEdge(
      <Edge.Animated {...({ ...animatedProps, ...extra } as never)} />
    )
  }

  it("renders the edge path with data-slot='edge-animated'", () => {
    const { container } = renderAnimated()
    const path = container.querySelector("[data-slot='edge-animated']")
    expect(path).toBeInTheDocument()
    expect(path?.tagName).toBe("path")
  })

  it("renders the traveling dot with data-slot='edge-animated-dot'", () => {
    const { container } = renderAnimated()
    const dot = container.querySelector("[data-slot='edge-animated-dot']")
    expect(dot).toBeInTheDocument()
    expect(dot?.tagName).toBe("circle")
  })

  it("colors the dot with the fill-primary token class", () => {
    const { container } = renderAnimated()
    const dot = container.querySelector(
      "[data-slot='edge-animated-dot']"
    ) as SVGCircleElement
    expect(dot.getAttribute("class")).toContain("fill-primary")
  })

  it("dot has radius 4", () => {
    const { container } = renderAnimated()
    const dot = container.querySelector("[data-slot='edge-animated-dot']")
    expect(dot).toHaveAttribute("r", "4")
  })

  it("renders an <animateMotion> driving the dot along the path", () => {
    const { container } = renderAnimated()
    const motion = container.querySelector("animateMotion")
    expect(motion).toBeInTheDocument()
    expect(motion).toHaveAttribute("dur", "2s")
    expect(motion).toHaveAttribute("repeatCount", "indefinite")
    expect(motion?.getAttribute("path")).toBeTruthy()
  })

  it("computes a non-empty bezier path (d attribute)", () => {
    const { container } = renderAnimated()
    const path = container.querySelector("[data-slot='edge-animated']")
    expect(path?.getAttribute("d")).toBeTruthy()
  })

  it("forwards the edge id", () => {
    const { container } = renderAnimated()
    const path = container.querySelector("[data-slot='edge-animated']")
    expect(path).toHaveAttribute("id", "e-anim")
  })

  it("merges a custom className onto the path", () => {
    const { container } = renderAnimated({ className: "anim-extra" })
    const path = container.querySelector(
      "[data-slot='edge-animated']"
    ) as SVGPathElement
    expect(path.getAttribute("class")).toContain("anim-extra")
  })

  it("forwards an inline style prop", () => {
    const { container } = renderAnimated({ style: { strokeWidth: 3 } })
    const path = container.querySelector(
      "[data-slot='edge-animated']"
    ) as SVGPathElement
    expect(path.style.strokeWidth).toBe("3")
  })

  it("falls back to [0,0] coords when a node has no handle bounds", () => {
    resetFakeNodes()
    fakeNodes.a = makeNode(0, 0, { withHandles: false })
    fakeNodes.b = makeNode(200, 0, { withHandles: false })
    const { container } = renderEdge(<Edge.Animated {...animatedProps} />)
    // still renders (handles resolve to [0,0]) — branch coverage for `!handle`
    const path = container.querySelector("[data-slot='edge-animated']")
    expect(path).toBeInTheDocument()
    expect(path?.getAttribute("d")).toBeTruthy()
  })
})

// ---------------------------------------------------------------------------
// 5. Accessibility (axe)
// ---------------------------------------------------------------------------

describe("Edge — accessibility (axe)", () => {
  it("Temporary edge has no axe violations", async () => {
    const { container } = render(
      <main>
        <ReactFlowProvider>
          <svg aria-label="workflow diagram">
            <Edge.Temporary {...temporaryProps} />
          </svg>
        </ReactFlowProvider>
      </main>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("Animated edge has no axe violations", async () => {
    resetFakeNodes()
    fakeNodes.a = makeNode(0, 0)
    fakeNodes.b = makeNode(200, 0)
    const { container } = render(
      <main>
        <ReactFlowProvider>
          <svg aria-label="workflow diagram">
            <Edge.Animated {...animatedProps} />
          </svg>
        </ReactFlowProvider>
      </main>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// 6. DOM containment
// ---------------------------------------------------------------------------

describe("Edge — DOM structure", () => {
  it("Animated path and dot are both inside the rendered group", () => {
    resetFakeNodes()
    fakeNodes.a = makeNode(0, 0)
    fakeNodes.b = makeNode(200, 0)
    const { container } = renderEdge(<Edge.Animated {...animatedProps} />)
    const group = container.querySelector("g") as SVGGElement
    expect(group.querySelector("[data-slot='edge-animated']")).toBeInTheDocument()
    expect(
      group.querySelector("[data-slot='edge-animated-dot']")
    ).toBeInTheDocument()
  })
})
