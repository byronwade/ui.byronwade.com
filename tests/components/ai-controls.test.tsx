/**
 * Exhaustive tests for the ai-controls (React Flow controls) component
 *
 * Component source: components/ai-elements/controls.tsx
 *
 * Exports:
 *   Controls – thin wrapper over @xyflow/react's <Controls> primitive. Renders a
 *              token-styled panel of zoom / fit-view / interactivity buttons.
 *              data-slot="ai-controls".
 *
 * The Controls primitive reads from the React Flow store and its buttons call
 * store handlers, so every render is wrapped in a real <ReactFlow> (a bare
 * <ReactFlowProvider> is not enough to drive the button handlers). React Flow
 * needs measurable dimensions, so the wrapper is given an explicit width/height.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { axe } from "vitest-axe";
import { ReactFlow, type Edge, type Node } from "@xyflow/react";
import { Controls } from "@/components/ai-elements/controls";

// ---------------------------------------------------------------------------
// jsdom scaffolding: React Flow measures its container via ResizeObserver,
// which jsdom does not provide. It is intentionally NOT polyfilled globally
// (see tests/setup.ts), so install a no-op locally for this file.
// ---------------------------------------------------------------------------

let originalRO: typeof ResizeObserver | undefined;

beforeAll(() => {
  originalRO = globalThis.ResizeObserver;
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

afterAll(() => {
  if (originalRO) {
    globalThis.ResizeObserver = originalRO;
  } else {
    // @ts-expect-error allow cleanup of the polyfill
    delete globalThis.ResizeObserver;
  }
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const nodes: Node[] = [
  { id: "a", position: { x: 0, y: 0 }, data: { label: "A" } },
  { id: "b", position: { x: 120, y: 60 }, data: { label: "B" } },
];

const edges: Edge[] = [{ id: "a-b", source: "a", target: "b" }];

/** Render <Controls> (with optional props) inside a sized ReactFlow canvas. */
function renderControls(props?: React.ComponentProps<typeof Controls>) {
  return render(
    <div style={{ width: 800, height: 600 }}>
      <ReactFlow defaultEdges={edges} defaultNodes={nodes}>
        <Controls {...props} />
      </ReactFlow>
    </div>
  );
}

/** Convenience: grab the controls panel element. */
function getPanel(container: HTMLElement) {
  return container.querySelector("[data-slot='ai-controls']") as HTMLElement;
}

// ---------------------------------------------------------------------------
// 1. Renders without crashing
// ---------------------------------------------------------------------------

describe("Controls — renders without crashing", () => {
  it("renders inside a ReactFlow without throwing", () => {
    expect(() => renderControls()).not.toThrow();
  });

  it("renders the controls panel", () => {
    const { container } = renderControls();
    expect(getPanel(container)).toBeInTheDocument();
  });

  it("renders a <div> as the panel root", () => {
    const { container } = renderControls();
    expect(getPanel(container).tagName).toBe("DIV");
  });

  it("renders the default control buttons", () => {
    renderControls();
    expect(screen.getAllByRole("button").length).toBeGreaterThanOrEqual(4);
  });
});

// ---------------------------------------------------------------------------
// 2. data-slot
// ---------------------------------------------------------------------------

describe("Controls — data-slot", () => {
  it("panel has data-slot='ai-controls'", () => {
    const { container } = renderControls();
    expect(getPanel(container)).toHaveAttribute("data-slot", "ai-controls");
  });

  it("exactly one panel renders", () => {
    const { container } = renderControls();
    expect(
      container.querySelectorAll("[data-slot='ai-controls']")
    ).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// 3. Base classes — token-only DNA
// ---------------------------------------------------------------------------

describe("Controls — base classes", () => {
  it("has bg-card surface token", () => {
    const { container } = renderControls();
    expect(getPanel(container).className).toContain("bg-card");
  });

  it("has edge hairline token", () => {
    const { container } = renderControls();
    expect(getPanel(container).className).toContain("edge");
  });

  it("has rounded-md radius from the scale", () => {
    const { container } = renderControls();
    expect(getPanel(container).className).toContain("rounded-md");
  });

  it("has overflow-hidden", () => {
    const { container } = renderControls();
    expect(getPanel(container).className).toContain("overflow-hidden");
  });

  it("has gap-px", () => {
    const { container } = renderControls();
    expect(getPanel(container).className).toContain("gap-px");
  });

  it("has p-1 padding", () => {
    const { container } = renderControls();
    expect(getPanel(container).className).toContain("p-1");
  });

  it("flattens the primitive shadow (shadow-none!)", () => {
    const { container } = renderControls();
    expect(getPanel(container).className).toContain("shadow-none!");
  });

  it("styles inner buttons with the secondary hover token", () => {
    const { container } = renderControls();
    const cls = getPanel(container).className;
    expect(cls).toContain("[&>button]:hover:bg-secondary!");
    expect(cls).toContain("[&>button]:bg-transparent!");
    expect(cls).toContain("[&>button]:text-foreground");
  });

  it("uses no raw colors (no hex / rgb / hsl)", () => {
    const { container } = renderControls();
    const cls = getPanel(container).className;
    expect(cls).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(cls).not.toMatch(/rgb\(/);
    expect(cls).not.toMatch(/hsl\(/);
  });

  it("retains the React Flow base class for positioning", () => {
    const { container } = renderControls();
    expect(getPanel(container).className).toContain("react-flow__controls");
  });
});

// ---------------------------------------------------------------------------
// 4. className passthrough
// ---------------------------------------------------------------------------

describe("Controls — className passthrough", () => {
  it("merges a custom className", () => {
    const { container } = renderControls({ className: "my-controls" });
    expect(getPanel(container).className).toContain("my-controls");
  });

  it("keeps base classes when a custom className is supplied", () => {
    const { container } = renderControls({ className: "extra" });
    const cls = getPanel(container).className;
    expect(cls).toContain("extra");
    expect(cls).toContain("bg-card");
    expect(cls).toContain("rounded-md");
  });
});

// ---------------------------------------------------------------------------
// 5. Prop forwarding — visibility toggles & attributes
// ---------------------------------------------------------------------------

describe("Controls — prop forwarding", () => {
  it("forwards a custom aria-label", () => {
    const { container } = renderControls({ "aria-label": "Canvas controls" });
    expect(getPanel(container)).toHaveAttribute("aria-label", "Canvas controls");
  });

  it("hides zoom buttons when showZoom is false", () => {
    renderControls({ showZoom: false });
    expect(
      screen.queryByRole("button", { name: /zoom in/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /zoom out/i })
    ).not.toBeInTheDocument();
  });

  it("hides the fit-view button when showFitView is false", () => {
    renderControls({ showFitView: false });
    expect(
      screen.queryByRole("button", { name: /fit view/i })
    ).not.toBeInTheDocument();
  });

  it("hides the interactivity toggle when showInteractive is false", () => {
    renderControls({ showInteractive: false });
    expect(
      screen.queryByRole("button", { name: /toggle interactivity/i })
    ).not.toBeInTheDocument();
  });

  it("renders zoom-in, zoom-out, fit-view and interactive buttons by default", () => {
    renderControls();
    expect(screen.getByRole("button", { name: /zoom in/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /zoom out/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /fit view/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /toggle interactivity/i })
    ).toBeInTheDocument();
  });

  it("renders extra children passed into the panel", () => {
    renderControls({ children: <button type="button">Reset</button> });
    expect(
      screen.getByRole("button", { name: "Reset" })
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 6. Interactions
// ---------------------------------------------------------------------------

describe("Controls — interactions", () => {
  it("zoom-in button is clickable without throwing", () => {
    renderControls();
    const zoomIn = screen.getByRole("button", { name: /zoom in/i });
    expect(() => fireEvent.click(zoomIn)).not.toThrow();
  });

  it("zoom-out button is clickable without throwing", () => {
    renderControls();
    const zoomOut = screen.getByRole("button", { name: /zoom out/i });
    expect(() => fireEvent.click(zoomOut)).not.toThrow();
  });

  it("fit-view button is clickable without throwing", () => {
    renderControls();
    const fitView = screen.getByRole("button", { name: /fit view/i });
    expect(() => fireEvent.click(fitView)).not.toThrow();
  });

  it("toggles interactivity icon (lock/unlock) on click", () => {
    renderControls();
    const toggle = screen.getByRole("button", {
      name: /toggle interactivity/i,
    });
    expect(() => fireEvent.click(toggle)).not.toThrow();
    // still present after toggling
    expect(toggle).toBeInTheDocument();
  });

  it("fires onZoomIn / onZoomOut / onFitView / onInteractiveChange callbacks", () => {
    let zoomedIn = false;
    let zoomedOut = false;
    let fitted = false;
    let interactiveChanged = false;
    render(
      <div style={{ width: 800, height: 600 }}>
        <ReactFlow defaultEdges={edges} defaultNodes={nodes}>
          <Controls
            onFitView={() => {
              fitted = true;
            }}
            onInteractiveChange={() => {
              interactiveChanged = true;
            }}
            onZoomIn={() => {
              zoomedIn = true;
            }}
            onZoomOut={() => {
              zoomedOut = true;
            }}
          />
        </ReactFlow>
      </div>
    );
    fireEvent.click(screen.getByRole("button", { name: /zoom in/i }));
    fireEvent.click(screen.getByRole("button", { name: /zoom out/i }));
    fireEvent.click(screen.getByRole("button", { name: /fit view/i }));
    fireEvent.click(
      screen.getByRole("button", { name: /toggle interactivity/i })
    );
    expect(zoomedIn).toBe(true);
    expect(zoomedOut).toBe(true);
    expect(fitted).toBe(true);
    expect(interactiveChanged).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 7. Accessibility — axe
// ---------------------------------------------------------------------------

describe("Controls — accessibility (axe)", () => {
  it("default controls have no axe violations", async () => {
    const { container } = render(
      <main>
        <div style={{ width: 800, height: 600 }}>
          <ReactFlow defaultEdges={edges} defaultNodes={nodes}>
            <Controls />
          </ReactFlow>
        </div>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("controls with only zoom shown have no axe violations", async () => {
    const { container } = render(
      <main>
        <div style={{ width: 800, height: 600 }}>
          <ReactFlow defaultEdges={edges} defaultNodes={nodes}>
            <Controls showFitView={false} showInteractive={false} />
          </ReactFlow>
        </div>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
