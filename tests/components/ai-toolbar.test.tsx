/**
 * Exhaustive tests for the ai-toolbar component (React Flow NodeToolbar port)
 *
 * Component source: components/ai-elements/toolbar.tsx
 *
 * Exports:
 *   Toolbar – wraps React Flow's NodeToolbar. Renders a token-driven floating
 *             toolbar (data-slot="toolbar") next to a custom node. cva variant
 *             `orientation` ("horizontal" | "vertical", default "horizontal")
 *             toggles flex-row / flex-col. `position` defaults to
 *             Position.Bottom. Forwards className (merged via cn) and all
 *             NodeToolbarProps.
 *
 * Rendering notes (React Flow internals):
 *   NodeToolbar portals into the React Flow renderer and returns null unless
 *   (a) it is "active" and (b) a matching node exists in the store. We force
 *   visibility with `isVisible` and supply a node whose id matches the
 *   Toolbar's `nodeId`. Every render is therefore wrapped in a real <ReactFlow>
 *   (ReactFlowProvider alone is insufficient — the portal target only exists
 *   when the renderer is mounted). jsdom also needs a ResizeObserver polyfill.
 */

import { render, screen, within } from "@testing-library/react";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { axe } from "vitest-axe";
import { Position, ReactFlow } from "@xyflow/react";

import { Toolbar } from "@/components/ai-elements/toolbar";

// ---------------------------------------------------------------------------
// jsdom scaffolding: React Flow measures its container via ResizeObserver.
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

/**
 * Render a Toolbar inside a live React Flow renderer with a single node "n1".
 * NodeToolbar portals out of the React tree, so queries target `document`.
 */
function renderToolbar(ui: React.ReactNode) {
  return render(
    <ReactFlow nodes={[{ id: "n1", position: { x: 0, y: 0 }, data: {} }]}>
      {ui}
    </ReactFlow>
  );
}

/** Locate the portaled toolbar div by data-slot. */
const toolbar = () =>
  document.querySelector("[data-slot='toolbar']") as HTMLElement | null;

// ---------------------------------------------------------------------------
// 1. Exports
// ---------------------------------------------------------------------------

describe("Toolbar — exports", () => {
  it("exports Toolbar as a component", () => {
    expect(Toolbar).toBeTypeOf("function");
  });
});

// ---------------------------------------------------------------------------
// 2. Renders without crashing
// ---------------------------------------------------------------------------

describe("Toolbar — renders without crashing", () => {
  it("renders a visible toolbar without throwing", () => {
    expect(() =>
      renderToolbar(
        <Toolbar nodeId="n1" isVisible>
          <button>Run</button>
        </Toolbar>
      )
    ).not.toThrow();
  });

  it("renders the toolbar element when visible", () => {
    renderToolbar(
      <Toolbar nodeId="n1" isVisible>
        <button>Run</button>
      </Toolbar>
    );
    expect(toolbar()).toBeInTheDocument();
  });

  it("renders children inside the toolbar", () => {
    renderToolbar(
      <Toolbar nodeId="n1" isVisible>
        <button>Duplicate</button>
      </Toolbar>
    );
    expect(
      screen.getByRole("button", { name: "Duplicate" })
    ).toBeInTheDocument();
  });

  it("renders multiple action children", () => {
    renderToolbar(
      <Toolbar nodeId="n1" isVisible>
        <button>Run</button>
        <button>Copy</button>
        <button>Delete</button>
      </Toolbar>
    );
    expect(screen.getByRole("button", { name: "Run" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("renders the root as a <div>", () => {
    renderToolbar(
      <Toolbar nodeId="n1" isVisible>
        <button>Run</button>
      </Toolbar>
    );
    expect(toolbar()?.tagName).toBe("DIV");
  });

  it("renders nothing when not visible and node is not selected", () => {
    // Default behavior: hidden unless its node is selected. isVisible omitted.
    renderToolbar(
      <Toolbar nodeId="n1">
        <button>Hidden action</button>
      </Toolbar>
    );
    expect(toolbar()).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Hidden action" })
    ).not.toBeInTheDocument();
  });

  it("isVisible={false} explicitly hides the toolbar", () => {
    renderToolbar(
      <Toolbar nodeId="n1" isVisible={false}>
        <button>Hidden action</button>
      </Toolbar>
    );
    expect(toolbar()).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 3. data-slot attribute
// ---------------------------------------------------------------------------

describe("Toolbar — data-slot", () => {
  it("root has data-slot='toolbar'", () => {
    renderToolbar(
      <Toolbar nodeId="n1" isVisible>
        <button>Run</button>
      </Toolbar>
    );
    expect(toolbar()).toHaveAttribute("data-slot", "toolbar");
  });
});

// ---------------------------------------------------------------------------
// 4. Base classes (token-driven surface)
// ---------------------------------------------------------------------------

describe("Toolbar — base classes", () => {
  function classes() {
    renderToolbar(
      <Toolbar nodeId="n1" isVisible>
        <button>Run</button>
      </Toolbar>
    );
    return toolbar()!.className;
  }

  it("has flex layout", () => {
    expect(classes()).toContain("flex");
  });

  it("has items-center alignment", () => {
    expect(classes()).toContain("items-center");
  });

  it("has gap-1 spacing", () => {
    expect(classes()).toContain("gap-1");
  });

  it("uses the radius scale (rounded-sm)", () => {
    expect(classes()).toContain("rounded-sm");
  });

  it("has p-1.5 padding", () => {
    expect(classes()).toContain("p-1.5");
  });

  it("uses the popover surface token (bg-popover)", () => {
    expect(classes()).toContain("bg-popover");
  });

  it("uses the popover foreground token (text-popover-foreground)", () => {
    expect(classes()).toContain("text-popover-foreground");
  });

  it("elevates with the edge hairline (no hard border, no shadow)", () => {
    const cls = classes();
    expect(cls).toContain("edge");
    expect(cls).not.toContain("border-border");
    expect(cls).not.toContain("shadow");
  });

  it("uses no raw color utilities (token-driven only)", () => {
    const cls = classes();
    expect(cls).not.toMatch(/bg-background\b/);
    expect(cls).not.toMatch(/\[#/);
    expect(cls).not.toMatch(/rgb\(/);
  });
});

// ---------------------------------------------------------------------------
// 5. orientation variant (cva)
// ---------------------------------------------------------------------------

describe("Toolbar — orientation variant", () => {
  function renderWith(orientation?: "horizontal" | "vertical") {
    renderToolbar(
      <Toolbar nodeId="n1" isVisible orientation={orientation}>
        <button>Run</button>
      </Toolbar>
    );
    return toolbar()!.className;
  }

  it("defaults to horizontal (flex-row) when omitted", () => {
    expect(renderWith()).toContain("flex-row");
  });

  it("default does not apply flex-col", () => {
    expect(renderWith()).not.toContain("flex-col");
  });

  it("orientation='horizontal' applies flex-row", () => {
    expect(renderWith("horizontal")).toContain("flex-row");
  });

  it("orientation='vertical' applies flex-col", () => {
    expect(renderWith("vertical")).toContain("flex-col");
  });

  it("orientation='vertical' does not apply flex-row", () => {
    expect(renderWith("vertical")).not.toContain("flex-row");
  });

  it("does not leak the orientation prop onto the DOM as an attribute", () => {
    renderToolbar(
      <Toolbar nodeId="n1" isVisible orientation="vertical">
        <button>Run</button>
      </Toolbar>
    );
    expect(toolbar()).not.toHaveAttribute("orientation");
  });
});

// ---------------------------------------------------------------------------
// 6. position prop
// ---------------------------------------------------------------------------

describe("Toolbar — position prop", () => {
  it("renders with the default position (Bottom) without crashing", () => {
    expect(() =>
      renderToolbar(
        <Toolbar nodeId="n1" isVisible>
          <button>Run</button>
        </Toolbar>
      )
    ).not.toThrow();
    expect(toolbar()).toBeInTheDocument();
  });

  it("accepts an explicit Position.Top without crashing", () => {
    expect(() =>
      renderToolbar(
        <Toolbar nodeId="n1" isVisible position={Position.Top}>
          <button>Run</button>
        </Toolbar>
      )
    ).not.toThrow();
    expect(toolbar()).toBeInTheDocument();
  });

  it("accepts Position.Left without crashing", () => {
    expect(() =>
      renderToolbar(
        <Toolbar nodeId="n1" isVisible position={Position.Left}>
          <button>Run</button>
        </Toolbar>
      )
    ).not.toThrow();
  });

  it("accepts Position.Right without crashing", () => {
    expect(() =>
      renderToolbar(
        <Toolbar nodeId="n1" isVisible position={Position.Right}>
          <button>Run</button>
        </Toolbar>
      )
    ).not.toThrow();
  });

  it("does not place position as a DOM attribute on the toolbar div", () => {
    renderToolbar(
      <Toolbar nodeId="n1" isVisible position={Position.Top}>
        <button>Run</button>
      </Toolbar>
    );
    expect(toolbar()).not.toHaveAttribute("position");
  });
});

// ---------------------------------------------------------------------------
// 7. className forwarding & merge
// ---------------------------------------------------------------------------

describe("Toolbar — className forwarding", () => {
  it("forwards a custom className", () => {
    renderToolbar(
      <Toolbar nodeId="n1" isVisible className="custom-toolbar">
        <button>Run</button>
      </Toolbar>
    );
    expect(toolbar()!.className).toContain("custom-toolbar");
  });

  it("merges custom className with base classes (base classes remain)", () => {
    renderToolbar(
      <Toolbar nodeId="n1" isVisible className="custom-toolbar">
        <button>Run</button>
      </Toolbar>
    );
    const cls = toolbar()!.className;
    expect(cls).toContain("custom-toolbar");
    expect(cls).toContain("bg-popover");
    expect(cls).toContain("edge");
  });

  it("retains React Flow's own toolbar class alongside ours", () => {
    renderToolbar(
      <Toolbar nodeId="n1" isVisible>
        <button>Run</button>
      </Toolbar>
    );
    expect(toolbar()!.className).toContain("react-flow__node-toolbar");
  });
});

// ---------------------------------------------------------------------------
// 8. HTML / NodeToolbar prop forwarding
// ---------------------------------------------------------------------------

describe("Toolbar — prop forwarding", () => {
  it("forwards id attribute", () => {
    renderToolbar(
      <Toolbar nodeId="n1" isVisible id="node-actions">
        <button>Run</button>
      </Toolbar>
    );
    expect(toolbar()).toHaveAttribute("id", "node-actions");
  });

  it("forwards aria-label attribute", () => {
    renderToolbar(
      <Toolbar nodeId="n1" isVisible aria-label="Node actions">
        <button>Run</button>
      </Toolbar>
    );
    expect(toolbar()).toHaveAttribute("aria-label", "Node actions");
  });

  it("forwards data-testid attribute", () => {
    renderToolbar(
      <Toolbar nodeId="n1" isVisible data-testid="tb">
        <button>Run</button>
      </Toolbar>
    );
    expect(toolbar()).toHaveAttribute("data-testid", "tb");
  });

  it("forwards role attribute", () => {
    renderToolbar(
      <Toolbar nodeId="n1" isVisible role="toolbar" aria-label="Actions">
        <button>Run</button>
      </Toolbar>
    );
    expect(toolbar()).toHaveAttribute("role", "toolbar");
  });

  it("supports targeting a node via nodeId (matching the rendered node)", () => {
    renderToolbar(
      <Toolbar nodeId="n1" isVisible>
        <button>Run</button>
      </Toolbar>
    );
    // NodeToolbar stamps the matched node id(s) onto data-id.
    expect(toolbar()).toHaveAttribute("data-id", "n1");
  });
});

// ---------------------------------------------------------------------------
// 9. DOM structure
// ---------------------------------------------------------------------------

describe("Toolbar — DOM structure", () => {
  it("contains its action buttons", () => {
    renderToolbar(
      <Toolbar nodeId="n1" isVisible>
        <button>Run</button>
        <button>Delete</button>
      </Toolbar>
    );
    const tb = toolbar()!;
    expect(within(tb).getByRole("button", { name: "Run" })).toBeInTheDocument();
    expect(
      within(tb).getByRole("button", { name: "Delete" })
    ).toBeInTheDocument();
  });

  it("renders exactly one toolbar root", () => {
    renderToolbar(
      <Toolbar nodeId="n1" isVisible>
        <button>Run</button>
      </Toolbar>
    );
    expect(document.querySelectorAll("[data-slot='toolbar']")).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// 10. Re-render / prop updates
// ---------------------------------------------------------------------------

describe("Toolbar — re-render behavior", () => {
  it("updates orientation class on re-render", () => {
    const { rerender } = render(
      <ReactFlow nodes={[{ id: "n1", position: { x: 0, y: 0 }, data: {} }]}>
        <Toolbar nodeId="n1" isVisible orientation="horizontal">
          <button>Run</button>
        </Toolbar>
      </ReactFlow>
    );
    expect(toolbar()!.className).toContain("flex-row");

    rerender(
      <ReactFlow nodes={[{ id: "n1", position: { x: 0, y: 0 }, data: {} }]}>
        <Toolbar nodeId="n1" isVisible orientation="vertical">
          <button>Run</button>
        </Toolbar>
      </ReactFlow>
    );
    expect(toolbar()!.className).toContain("flex-col");
    expect(toolbar()!.className).not.toContain("flex-row");
  });

  it("toggles visibility on re-render", () => {
    const { rerender } = render(
      <ReactFlow nodes={[{ id: "n1", position: { x: 0, y: 0 }, data: {} }]}>
        <Toolbar nodeId="n1" isVisible={false}>
          <button>Run</button>
        </Toolbar>
      </ReactFlow>
    );
    expect(toolbar()).not.toBeInTheDocument();

    rerender(
      <ReactFlow nodes={[{ id: "n1", position: { x: 0, y: 0 }, data: {} }]}>
        <Toolbar nodeId="n1" isVisible>
          <button>Run</button>
        </Toolbar>
      </ReactFlow>
    );
    expect(toolbar()).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 11. Accessibility (axe)
// ---------------------------------------------------------------------------

describe("Toolbar — accessibility (axe)", () => {
  it("a labelled toolbar of buttons has no axe violations", async () => {
    const { container } = renderToolbar(
      <Toolbar nodeId="n1" isVisible role="toolbar" aria-label="Node actions">
        <button type="button">Run</button>
        <button type="button">Duplicate</button>
        <button type="button">Delete</button>
      </Toolbar>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("a vertical toolbar has no axe violations", async () => {
    const { container } = renderToolbar(
      <Toolbar
        nodeId="n1"
        isVisible
        orientation="vertical"
        role="toolbar"
        aria-label="Node actions"
      >
        <button type="button">Run</button>
        <button type="button">Delete</button>
      </Toolbar>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
