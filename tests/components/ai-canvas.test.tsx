/**
 * Exhaustive tests for the Canvas component (React Flow wrapper)
 *
 * Component source: components/ai-elements/canvas.tsx
 *
 * Exports:
 *   Canvas – ReactFlow wrapper, data-slot="ai-canvas".
 *            Renders a token-driven <Background> (class .ai-canvas-background;
 *            React Flow's Background spreads className but not data-slot)
 *            whose pattern is controlled by the `pattern` prop
 *            ("dots" | "lines" | "cross" | "none"). pattern="none" omits the
 *            background entirely. Forwards className (merged via cn) and all
 *            ReactFlowProps. Sets opinionated interaction defaults
 *            (fitView, panOnScroll, no pan-on-drag, no zoom-on-double-click,
 *            Backspace/Delete delete keys) which callers can override.
 *
 * React Flow must render inside a <ReactFlowProvider>; in jsdom it also needs a
 * ResizeObserver polyfill (installed locally — see tests/setup.ts note).
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { axe } from "vitest-axe";
import { ReactFlowProvider } from "@xyflow/react";

import { Canvas } from "@/components/ai-elements/canvas";

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

function renderCanvas(ui: React.ReactNode) {
  return render(
    <ReactFlowProvider>{ui}</ReactFlowProvider>
  );
}

const root = (container: HTMLElement) =>
  container.querySelector("[data-slot='ai-canvas']") as HTMLElement;
const background = (container: HTMLElement) =>
  container.querySelector(".ai-canvas-background");

// ---------------------------------------------------------------------------
// 1. Exports
// ---------------------------------------------------------------------------

describe("Canvas — exports", () => {
  it("exports Canvas as a component", () => {
    expect(Canvas).toBeTypeOf("function");
  });
});

// ---------------------------------------------------------------------------
// 2. Render without crashing
// ---------------------------------------------------------------------------

describe("Canvas — renders without crashing", () => {
  it("renders a bare Canvas without throwing", () => {
    expect(() => renderCanvas(<Canvas />)).not.toThrow();
  });

  it("renders the ai-canvas root element", () => {
    const { container } = renderCanvas(<Canvas />);
    expect(root(container)).toBeInTheDocument();
  });

  it("renders children inside the canvas", () => {
    renderCanvas(
      <Canvas>
        <div data-testid="overlay">Toolbar</div>
      </Canvas>
    );
    expect(screen.getByTestId("overlay")).toBeInTheDocument();
    expect(screen.getByText("Toolbar")).toBeInTheDocument();
  });

  it("renders given default nodes/edges without crashing", () => {
    expect(() =>
      renderCanvas(
        <Canvas
          defaultNodes={[
            { id: "a", position: { x: 0, y: 0 }, data: { label: "A" } },
            { id: "b", position: { x: 100, y: 0 }, data: { label: "B" } },
          ]}
          defaultEdges={[{ id: "a-b", source: "a", target: "b" }]}
        />
      )
    ).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// 3. data-slot attributes
// ---------------------------------------------------------------------------

describe("Canvas — data-slot attributes", () => {
  it("root carries data-slot='ai-canvas'", () => {
    const { container } = renderCanvas(<Canvas />);
    expect(root(container)).toHaveAttribute("data-slot", "ai-canvas");
  });

  it("renders the token-driven background by default", () => {
    const { container } = renderCanvas(<Canvas />);
    expect(background(container)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 4. pattern prop — every variant + the "none" branch
// ---------------------------------------------------------------------------

describe("Canvas — pattern prop", () => {
  it("defaults to a dots background when pattern is omitted", () => {
    const { container } = renderCanvas(<Canvas />);
    const bg = background(container);
    expect(bg).toBeInTheDocument();
    // React Flow tags the pattern variant onto the SVG pattern container class
    expect(container.querySelector(".react-flow__background")).toBeInTheDocument();
  });

  it("pattern='dots' renders a background", () => {
    const { container } = renderCanvas(<Canvas pattern="dots" />);
    expect(background(container)).toBeInTheDocument();
  });

  it("pattern='lines' renders a background", () => {
    const { container } = renderCanvas(<Canvas pattern="lines" />);
    expect(background(container)).toBeInTheDocument();
  });

  it("pattern='cross' renders a background", () => {
    const { container } = renderCanvas(<Canvas pattern="cross" />);
    expect(background(container)).toBeInTheDocument();
  });

  it("pattern='none' omits the background entirely", () => {
    const { container } = renderCanvas(<Canvas pattern="none" />);
    expect(background(container)).toBeNull();
  });

  it("pattern='none' still renders the canvas root + children", () => {
    const { container } = renderCanvas(
      <Canvas pattern="none">
        <div data-testid="child">x</div>
      </Canvas>
    );
    expect(root(container)).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("explicit pattern={undefined} falls back to dots (default param)", () => {
    const { container } = renderCanvas(<Canvas pattern={undefined} />);
    expect(background(container)).toBeInTheDocument();
  });

  it("pattern={null} falls back to dots (nullish coalescing branch)", () => {
    const { container } = renderCanvas(<Canvas pattern={null} />);
    expect(background(container)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 5. Base classes (tokens only)
// ---------------------------------------------------------------------------

describe("Canvas — base classes", () => {
  it("uses the sidebar token surface (bg-sidebar)", () => {
    const { container } = renderCanvas(<Canvas />);
    expect(root(container).className).toContain("bg-sidebar");
  });

  it("uses the foreground token for text", () => {
    const { container } = renderCanvas(<Canvas />);
    expect(root(container).className).toContain("text-foreground");
  });

  it("fills its container (size-full)", () => {
    const { container } = renderCanvas(<Canvas />);
    expect(root(container).className).toContain("size-full");
  });

  it("contains no raw hex/rgb/hsl color in the root className", () => {
    const { container } = renderCanvas(<Canvas />);
    const cls = root(container).className;
    expect(cls).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(cls).not.toMatch(/\brgb\(/);
    expect(cls).not.toMatch(/\bhsl\(/);
  });
});

// ---------------------------------------------------------------------------
// 6. className passthrough + merge
// ---------------------------------------------------------------------------

describe("Canvas — className passthrough", () => {
  it("forwards a custom className", () => {
    const { container } = renderCanvas(<Canvas className="my-canvas" />);
    expect(root(container).className).toContain("my-canvas");
  });

  it("merges custom className with base classes", () => {
    const { container } = renderCanvas(<Canvas className="my-extra" />);
    const cls = root(container).className;
    expect(cls).toContain("my-extra");
    expect(cls).toContain("bg-sidebar");
  });
});

// ---------------------------------------------------------------------------
// 7. ReactFlowProps forwarding + default overrides
// ---------------------------------------------------------------------------

describe("Canvas — props forwarding", () => {
  it("forwards an id attribute to the React Flow root", () => {
    const { container } = renderCanvas(<Canvas id="board" />);
    expect(root(container)).toHaveAttribute("id", "board");
  });

  it("forwards aria-label to the React Flow root", () => {
    const { container } = renderCanvas(
      <Canvas aria-label="Workflow canvas" />
    );
    expect(root(container)).toHaveAttribute("aria-label", "Workflow canvas");
  });

  it("forwards data-testid", () => {
    const { container } = renderCanvas(<Canvas data-testid="rf" />);
    expect(root(container)).toHaveAttribute("data-testid", "rf");
  });

  it("allows callers to override interaction defaults (panOnScroll=false)", () => {
    expect(() =>
      renderCanvas(<Canvas panOnScroll={false} fitView={false} />)
    ).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// 8. Re-render behavior
// ---------------------------------------------------------------------------

describe("Canvas — re-render behavior", () => {
  it("swaps the background when the pattern prop changes", () => {
    const { container, rerender } = render(
      <ReactFlowProvider>
        <Canvas pattern="dots" />
      </ReactFlowProvider>
    );
    expect(background(container)).toBeInTheDocument();

    rerender(
      <ReactFlowProvider>
        <Canvas pattern="none" />
      </ReactFlowProvider>
    );
    expect(background(container)).toBeNull();
  });

  it("updates a custom className on re-render", () => {
    const { container, rerender } = render(
      <ReactFlowProvider>
        <Canvas className="class-a" />
      </ReactFlowProvider>
    );
    expect(root(container).className).toContain("class-a");

    rerender(
      <ReactFlowProvider>
        <Canvas className="class-b" />
      </ReactFlowProvider>
    );
    expect(root(container).className).toContain("class-b");
    expect(root(container).className).not.toContain("class-a");
  });
});

// ---------------------------------------------------------------------------
// 9. DOM structure
// ---------------------------------------------------------------------------

describe("Canvas — DOM structure", () => {
  it("the background is nested inside the canvas root", () => {
    const { container } = renderCanvas(<Canvas />);
    const r = root(container);
    expect(r.querySelector(".ai-canvas-background")).toBeInTheDocument();
  });

  it("renders exactly one canvas root", () => {
    const { container } = renderCanvas(<Canvas />);
    expect(container.querySelectorAll("[data-slot='ai-canvas']")).toHaveLength(1);
  });

  it("children render alongside the background inside the root", () => {
    const { container } = renderCanvas(
      <Canvas>
        <div data-testid="panel">P</div>
      </Canvas>
    );
    const r = root(container);
    expect(r.querySelector(".ai-canvas-background")).toBeInTheDocument();
    expect(r.querySelector("[data-testid='panel']")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 10. Accessibility (axe)
// ---------------------------------------------------------------------------

describe("Canvas — accessibility (axe)", () => {
  it("bare canvas has no axe violations", async () => {
    const { container } = render(
      <main>
        <ReactFlowProvider>
          <Canvas aria-label="Empty workflow canvas" />
        </ReactFlowProvider>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("canvas with nodes/edges has no axe violations", async () => {
    const { container } = render(
      <main>
        <ReactFlowProvider>
          <Canvas
            aria-label="Agent workflow"
            defaultNodes={[
              { id: "a", position: { x: 0, y: 0 }, data: { label: "A" } },
              { id: "b", position: { x: 120, y: 60 }, data: { label: "B" } },
            ]}
            defaultEdges={[{ id: "a-b", source: "a", target: "b" }]}
          />
        </ReactFlowProvider>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("pattern='none' canvas has no axe violations", async () => {
    const { container } = render(
      <main>
        <ReactFlowProvider>
          <Canvas aria-label="Plain canvas" pattern="none" />
        </ReactFlowProvider>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
