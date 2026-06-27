/**
 * Exhaustive tests for the ai-panel (React Flow panel) component
 *
 * Component source: components/ai-elements/panel.tsx
 *
 * Exports:
 *   Panel – wraps React Flow's <Panel> primitive; absolute overlay floating
 *           over the flow canvas. data-slot="panel".
 *
 * The React Flow Panel primitive reads from the flow store, so every render is
 * wrapped in <ReactFlowProvider>.
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ReactFlowProvider } from "@xyflow/react";
import { Panel } from "@/components/ai-elements/panel";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Render arbitrary content inside a ReactFlowProvider (Panel needs context). */
function renderWithProvider(ui: React.ReactNode) {
  return render(<ReactFlowProvider>{ui}</ReactFlowProvider>);
}

function getPanel(container: HTMLElement): HTMLElement {
  return container.querySelector("[data-slot='panel']") as HTMLElement;
}

// ---------------------------------------------------------------------------
// 1. Renders without crashing
// ---------------------------------------------------------------------------

describe("Panel — renders without crashing", () => {
  it("renders a bare Panel without crashing", () => {
    const { container } = renderWithProvider(<Panel />);
    expect(getPanel(container)).toBeInTheDocument();
  });

  it("Panel root element is a <div>", () => {
    const { container } = renderWithProvider(<Panel />);
    expect(getPanel(container).nodeName).toBe("DIV");
  });

  it("renders children inside Panel", () => {
    renderWithProvider(<Panel>hello world</Panel>);
    expect(screen.getByText("hello world")).toBeInTheDocument();
  });

  it("renders element children", () => {
    renderWithProvider(
      <Panel>
        <button type="button">Run</button>
      </Panel>
    );
    expect(screen.getByRole("button", { name: "Run" })).toBeInTheDocument();
  });

  it("renders without children (empty)", () => {
    const { container } = renderWithProvider(<Panel />);
    expect(getPanel(container).children).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// 2. data-slot attribute
// ---------------------------------------------------------------------------

describe("Panel — data-slot attribute", () => {
  it("Panel root has data-slot='panel'", () => {
    const { container } = renderWithProvider(<Panel />);
    expect(getPanel(container)).toHaveAttribute("data-slot", "panel");
  });

  it("there is exactly one panel root element", () => {
    const { container } = renderWithProvider(<Panel />);
    expect(container.querySelectorAll("[data-slot='panel']")).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// 3. Base classes (DNA: edge hairline, tokens, radius scale)
// ---------------------------------------------------------------------------

describe("Panel — base classes", () => {
  it("elevates with the edge hairline (no hard border)", () => {
    const { container } = renderWithProvider(<Panel />);
    const cls = getPanel(container).className;
    expect(cls).toContain("edge");
    expect(cls).not.toContain("border-border");
  });

  it("uses the bg-card surface token", () => {
    const { container } = renderWithProvider(<Panel />);
    expect(getPanel(container).className).toContain("bg-card");
  });

  it("uses the text-card-foreground token", () => {
    const { container } = renderWithProvider(<Panel />);
    expect(getPanel(container).className).toContain("text-card-foreground");
  });

  it("has rounded-2xl from the radius scale", () => {
    const { container } = renderWithProvider(<Panel />);
    expect(getPanel(container).className).toContain("rounded-2xl");
  });

  it("has overflow-hidden", () => {
    const { container } = renderWithProvider(<Panel />);
    expect(getPanel(container).className).toContain("overflow-hidden");
  });

  it("has m-4 spacing", () => {
    const { container } = renderWithProvider(<Panel />);
    expect(getPanel(container).className).toContain("m-4");
  });

  it("has p-1 padding", () => {
    const { container } = renderWithProvider(<Panel />);
    expect(getPanel(container).className).toContain("p-1");
  });

  it("uses no raw hex/rgb colors", () => {
    const { container } = renderWithProvider(<Panel />);
    const cls = getPanel(container).className;
    expect(cls).not.toMatch(/#[0-9a-fA-F]{3,6}/);
    expect(cls).not.toContain("rgb");
    expect(cls).not.toContain("hsl");
  });
});

// ---------------------------------------------------------------------------
// 4. position prop (React Flow primitive)
// ---------------------------------------------------------------------------

describe("Panel — position prop", () => {
  const positions = [
    "top-left",
    "top-center",
    "top-right",
    "bottom-left",
    "bottom-center",
    "bottom-right",
  ] as const;

  for (const position of positions) {
    it(`renders with position='${position}' without crashing`, () => {
      const { container } = renderWithProvider(
        <Panel position={position}>content</Panel>
      );
      expect(getPanel(container)).toBeInTheDocument();
    });
  }

  it("renders without an explicit position (default)", () => {
    const { container } = renderWithProvider(<Panel>content</Panel>);
    expect(getPanel(container)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 5. className forwarding & merging
// ---------------------------------------------------------------------------

describe("Panel — className forwarding", () => {
  it("forwards a custom className", () => {
    const { container } = renderWithProvider(
      <Panel className="my-panel-class" />
    );
    expect(getPanel(container).className).toContain("my-panel-class");
  });

  it("merges custom className with base classes (base remain)", () => {
    const { container } = renderWithProvider(
      <Panel className="my-extra-class" />
    );
    const cls = getPanel(container).className;
    expect(cls).toContain("my-extra-class");
    expect(cls).toContain("bg-card");
    expect(cls).toContain("edge");
  });

  it("updates custom className on re-render", () => {
    const { container, rerender } = renderWithProvider(
      <Panel className="class-a" />
    );
    expect(getPanel(container).className).toContain("class-a");

    rerender(
      <ReactFlowProvider>
        <Panel className="class-b" />
      </ReactFlowProvider>
    );
    const cls = getPanel(container).className;
    expect(cls).toContain("class-b");
    expect(cls).not.toContain("class-a");
  });
});

// ---------------------------------------------------------------------------
// 6. HTML attribute forwarding
// ---------------------------------------------------------------------------

describe("Panel — HTML attribute forwarding", () => {
  it("forwards id attribute", () => {
    const { container } = renderWithProvider(<Panel id="my-panel" />);
    expect(getPanel(container)).toHaveAttribute("id", "my-panel");
  });

  it("forwards data-testid attribute", () => {
    const { container } = renderWithProvider(<Panel data-testid="test-panel" />);
    expect(getPanel(container)).toHaveAttribute("data-testid", "test-panel");
  });

  it("forwards aria-label attribute", () => {
    const { container } = renderWithProvider(
      <Panel aria-label="Canvas controls" />
    );
    expect(getPanel(container)).toHaveAttribute("aria-label", "Canvas controls");
  });
});

// ---------------------------------------------------------------------------
// 7. Re-render behavior
// ---------------------------------------------------------------------------

describe("Panel — re-render behavior", () => {
  it("updates children content on re-render", () => {
    const { rerender } = renderWithProvider(<Panel>original</Panel>);
    expect(screen.getByText("original")).toBeInTheDocument();

    rerender(
      <ReactFlowProvider>
        <Panel>updated</Panel>
      </ReactFlowProvider>
    );
    expect(screen.getByText("updated")).toBeInTheDocument();
    expect(screen.queryByText("original")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 8. Composition patterns
// ---------------------------------------------------------------------------

describe("Panel — composition patterns", () => {
  it("renders multiple panels in one flow without conflict", () => {
    renderWithProvider(
      <>
        <Panel position="top-left" data-testid="panel-a">
          A
        </Panel>
        <Panel position="bottom-right" data-testid="panel-b">
          B
        </Panel>
      </>
    );
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("renders a data overlay (mono count) without crashing", () => {
    renderWithProvider(
      <Panel position="top-left">
        <span className="text-sm font-medium text-foreground">Workflow</span>
        <span className="font-mono text-xs text-muted-foreground">4 nodes</span>
      </Panel>
    );
    expect(screen.getByText("Workflow")).toBeInTheDocument();
    expect(screen.getByText("4 nodes")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 9. Accessibility — axe
// ---------------------------------------------------------------------------

describe("Panel — accessibility (axe)", () => {
  it("bare panel has no axe violations", async () => {
    const { container } = render(
      <main>
        <ReactFlowProvider>
          <Panel />
        </ReactFlowProvider>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("panel with interactive content has no axe violations", async () => {
    const { container } = render(
      <main>
        <ReactFlowProvider>
          <Panel position="bottom-right">
            <button type="button" aria-label="Run workflow">
              Run
            </button>
          </Panel>
        </ReactFlowProvider>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("panel with labelled data overlay has no axe violations", async () => {
    const { container } = render(
      <main>
        <ReactFlowProvider>
          <Panel position="top-left" aria-label="Workflow summary">
            <span className="text-sm font-medium text-foreground">Workflow</span>
            <span className="font-mono text-xs text-muted-foreground">
              4 nodes
            </span>
          </Panel>
        </ReactFlowProvider>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
