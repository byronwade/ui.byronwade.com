/**
 * Exhaustive tests for the ai-node (React Flow node) compound component
 *
 * Component source: components/ai-elements/node.tsx
 *
 * Exports:
 *   Node            – root, composes Card; renders React Flow Handles per `handles` prop
 *   NodeHeader      – composes CardHeader; bg-secondary + bottom border
 *   NodeTitle       – composes CardTitle (data-slot="card-title", font-medium)
 *   NodeDescription – composes CardDescription (data-slot="card-description")
 *   NodeAction      – composes CardAction (data-slot="card-action")
 *   NodeContent     – composes CardContent; p-3
 *   NodeFooter      – composes CardFooter; bg-secondary + top border
 *
 * `handles` prop drives two booleans:
 *   target → renders a left "target" Handle (data-slot="node-handle-target")
 *   source → renders a right "source" Handle (data-slot="node-handle-source")
 *
 * Handle requires React Flow context — every Node render is wrapped in
 * <ReactFlowProvider>.
 */

import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ReactFlowProvider } from "@xyflow/react";
import {
  Node,
  NodeHeader,
  NodeTitle,
  NodeDescription,
  NodeAction,
  NodeContent,
  NodeFooter,
} from "@/components/ai-elements/node";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Render arbitrary content inside a ReactFlowProvider (Handle needs context). */
function renderInFlow(ui: React.ReactNode) {
  return render(<ReactFlowProvider>{ui}</ReactFlowProvider>);
}

/** Render a fully-populated node and return the render result. */
function renderFullNode(handles = { target: true, source: true }) {
  return renderInFlow(
    <Node handles={handles}>
      <NodeHeader>
        <NodeTitle>Prompt</NodeTitle>
        <NodeDescription>Entry point</NodeDescription>
        <NodeAction>
          <button aria-label="Edit node">Edit</button>
        </NodeAction>
      </NodeHeader>
      <NodeContent>
        <p>Classify the ticket.</p>
      </NodeContent>
      <NodeFooter>
        <span>gpt-5</span>
      </NodeFooter>
    </Node>
  );
}

// ---------------------------------------------------------------------------
// 1. Renders without crashing
// ---------------------------------------------------------------------------

describe("Node — renders without crashing", () => {
  it("renders a bare Node without crashing", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: false, source: false }} />
    );
    expect(container.querySelector("[data-slot='card']")).toBeInTheDocument();
  });

  it("Node root composes a Card (data-slot='card')", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: false, source: false }} />
    );
    expect(container.querySelector("[data-slot='card']")).toBeInTheDocument();
  });

  it("renders a fully-composed node without crashing", () => {
    expect(() => renderFullNode()).not.toThrow();
  });

  it("renders children inside Node", () => {
    renderInFlow(
      <Node handles={{ target: false, source: false }}>hello node</Node>
    );
    expect(screen.getByText("hello node")).toBeInTheDocument();
  });

  it("renders all compound parts without crashing", () => {
    const { container } = renderFullNode();
    expect(container.querySelector("[data-slot='card']")).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='card-header']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='card-title']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='card-description']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='card-action']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='card-content']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='card-footer']")
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 2. handles prop — all four boolean combinations (branch coverage)
// ---------------------------------------------------------------------------

describe("Node — handles prop combinations", () => {
  it("renders both handles when target & source are true", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: true, source: true }} />
    );
    expect(
      container.querySelector("[data-slot='node-handle-target']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='node-handle-source']")
    ).toBeInTheDocument();
  });

  it("renders only the target handle when source is false", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: true, source: false }} />
    );
    expect(
      container.querySelector("[data-slot='node-handle-target']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='node-handle-source']")
    ).not.toBeInTheDocument();
  });

  it("renders only the source handle when target is false", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: false, source: true }} />
    );
    expect(
      container.querySelector("[data-slot='node-handle-target']")
    ).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='node-handle-source']")
    ).toBeInTheDocument();
  });

  it("renders no handles when both are false", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: false, source: false }} />
    );
    expect(
      container.querySelector("[data-slot='node-handle-target']")
    ).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='node-handle-source']")
    ).not.toBeInTheDocument();
  });

  it("target handle is a React Flow target handle", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: true, source: false }} />
    );
    const handle = container.querySelector("[data-slot='node-handle-target']");
    expect(handle).toHaveClass("react-flow__handle");
    expect(handle).toHaveClass("target");
  });

  it("source handle is a React Flow source handle", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: false, source: true }} />
    );
    const handle = container.querySelector("[data-slot='node-handle-source']");
    expect(handle).toHaveClass("react-flow__handle");
    expect(handle).toHaveClass("source");
  });

  it("handles use token-based styling (no raw colors)", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: true, source: true }} />
    );
    const target = container.querySelector(
      "[data-slot='node-handle-target']"
    ) as HTMLElement;
    expect(target.className).toContain("edge");
    expect(target.className).toContain("bg-background");
    expect(target.className).toContain("ring-ring");
  });
});

// ---------------------------------------------------------------------------
// 3. Node root base classes
// ---------------------------------------------------------------------------

describe("Node — root base classes", () => {
  it("has node-container class", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: false, source: false }} />
    );
    const card = container.querySelector("[data-slot='card']") as HTMLElement;
    expect(card.className).toContain("node-container");
  });

  it("has rounded-md class", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: false, source: false }} />
    );
    const card = container.querySelector("[data-slot='card']") as HTMLElement;
    expect(card.className).toContain("rounded-md");
  });

  it("has w-sm width class", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: false, source: false }} />
    );
    const card = container.querySelector("[data-slot='card']") as HTMLElement;
    expect(card.className).toContain("w-sm");
  });

  it("has relative positioning class", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: false, source: false }} />
    );
    const card = container.querySelector("[data-slot='card']") as HTMLElement;
    expect(card.className).toContain("relative");
  });

  it("inherits Card token surface (bg-card, edge)", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: false, source: false }} />
    );
    const card = container.querySelector("[data-slot='card']") as HTMLElement;
    expect(card.className).toContain("bg-card");
    expect(card.className).toContain("edge");
  });

  it("forwards a custom className merged onto the Card", () => {
    const { container } = renderInFlow(
      <Node className="custom-node" handles={{ target: false, source: false }} />
    );
    const card = container.querySelector("[data-slot='card']") as HTMLElement;
    expect(card.className).toContain("custom-node");
    expect(card.className).toContain("node-container");
  });

  it("forwards HTML attributes to the Card root", () => {
    const { container } = renderInFlow(
      <Node
        data-testid="node-root"
        handles={{ target: false, source: false }}
        id="node-1"
      />
    );
    const card = container.querySelector("[data-slot='card']");
    expect(card).toHaveAttribute("id", "node-1");
    expect(card).toHaveAttribute("data-testid", "node-root");
  });
});

// ---------------------------------------------------------------------------
// 4. NodeHeader
// ---------------------------------------------------------------------------

describe("NodeHeader — classes and content", () => {
  it("composes CardHeader (data-slot='card-header')", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: false, source: false }}>
        <NodeHeader />
      </Node>
    );
    expect(
      container.querySelector("[data-slot='card-header']")
    ).toBeInTheDocument();
  });

  it("has bg-secondary surface", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: false, source: false }}>
        <NodeHeader />
      </Node>
    );
    const header = container.querySelector(
      "[data-slot='card-header']"
    ) as HTMLElement;
    expect(header.className).toContain("bg-secondary");
  });

  it("has a bottom border (border-b)", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: false, source: false }}>
        <NodeHeader />
      </Node>
    );
    const header = container.querySelector(
      "[data-slot='card-header']"
    ) as HTMLElement;
    expect(header.className).toContain("border-b");
  });

  it("has rounded-t-md class", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: false, source: false }}>
        <NodeHeader />
      </Node>
    );
    const header = container.querySelector(
      "[data-slot='card-header']"
    ) as HTMLElement;
    expect(header.className).toContain("rounded-t-md");
  });

  it("forwards custom className", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: false, source: false }}>
        <NodeHeader className="custom-header" />
      </Node>
    );
    const header = container.querySelector(
      "[data-slot='card-header']"
    ) as HTMLElement;
    expect(header.className).toContain("custom-header");
  });

  it("forwards HTML attributes", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: false, source: false }}>
        <NodeHeader id="hdr" />
      </Node>
    );
    expect(container.querySelector("[data-slot='card-header']")).toHaveAttribute(
      "id",
      "hdr"
    );
  });
});

// ---------------------------------------------------------------------------
// 5. NodeTitle
// ---------------------------------------------------------------------------

describe("NodeTitle — classes and content", () => {
  it("composes CardTitle and renders text", () => {
    renderInFlow(
      <Node handles={{ target: false, source: false }}>
        <NodeHeader>
          <NodeTitle>Prompt node</NodeTitle>
        </NodeHeader>
      </Node>
    );
    const title = screen.getByText("Prompt node");
    expect(title).toHaveAttribute("data-slot", "card-title");
  });

  it("is editorial weight (font-medium, never bold)", () => {
    renderInFlow(
      <Node handles={{ target: false, source: false }}>
        <NodeHeader>
          <NodeTitle>Prompt</NodeTitle>
        </NodeHeader>
      </Node>
    );
    const title = screen.getByText("Prompt");
    expect(title.className).toContain("font-medium");
    expect(title.className).not.toContain("font-bold");
    expect(title.className).not.toContain("font-semibold");
  });

  it("forwards custom className", () => {
    renderInFlow(
      <Node handles={{ target: false, source: false }}>
        <NodeHeader>
          <NodeTitle className="custom-title">T</NodeTitle>
        </NodeHeader>
      </Node>
    );
    expect(screen.getByText("T").className).toContain("custom-title");
  });
});

// ---------------------------------------------------------------------------
// 6. NodeDescription
// ---------------------------------------------------------------------------

describe("NodeDescription — classes and content", () => {
  it("composes CardDescription and renders text", () => {
    renderInFlow(
      <Node handles={{ target: false, source: false }}>
        <NodeHeader>
          <NodeDescription>Entry point for the flow</NodeDescription>
        </NodeHeader>
      </Node>
    );
    const desc = screen.getByText("Entry point for the flow");
    expect(desc).toHaveAttribute("data-slot", "card-description");
  });

  it("uses muted token text", () => {
    renderInFlow(
      <Node handles={{ target: false, source: false }}>
        <NodeHeader>
          <NodeDescription>Desc</NodeDescription>
        </NodeHeader>
      </Node>
    );
    expect(screen.getByText("Desc").className).toContain("text-muted-foreground");
  });

  it("forwards custom className", () => {
    renderInFlow(
      <Node handles={{ target: false, source: false }}>
        <NodeHeader>
          <NodeDescription className="custom-desc">D</NodeDescription>
        </NodeHeader>
      </Node>
    );
    expect(screen.getByText("D").className).toContain("custom-desc");
  });
});

// ---------------------------------------------------------------------------
// 7. NodeAction
// ---------------------------------------------------------------------------

describe("NodeAction — classes and content", () => {
  it("composes CardAction and renders children", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: false, source: false }}>
        <NodeHeader>
          <NodeTitle>T</NodeTitle>
          <NodeAction>
            <button aria-label="More">...</button>
          </NodeAction>
        </NodeHeader>
      </Node>
    );
    const action = container.querySelector("[data-slot='card-action']");
    expect(action).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "More" })
    ).toBeInTheDocument();
  });

  it("pins to the header action column (col-start-2 / justify-self-end)", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: false, source: false }}>
        <NodeHeader>
          <NodeAction>
            <button>A</button>
          </NodeAction>
        </NodeHeader>
      </Node>
    );
    const action = container.querySelector(
      "[data-slot='card-action']"
    ) as HTMLElement;
    expect(action.className).toContain("col-start-2");
    expect(action.className).toContain("justify-self-end");
  });

  it("forwards custom className", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: false, source: false }}>
        <NodeHeader>
          <NodeAction className="custom-action">
            <button>A</button>
          </NodeAction>
        </NodeHeader>
      </Node>
    );
    const action = container.querySelector(
      "[data-slot='card-action']"
    ) as HTMLElement;
    expect(action.className).toContain("custom-action");
  });
});

// ---------------------------------------------------------------------------
// 8. NodeContent
// ---------------------------------------------------------------------------

describe("NodeContent — classes and content", () => {
  it("composes CardContent and renders children", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: false, source: false }}>
        <NodeContent>
          <p>Body text</p>
        </NodeContent>
      </Node>
    );
    expect(
      container.querySelector("[data-slot='card-content']")
    ).toBeInTheDocument();
    expect(screen.getByText("Body text")).toBeInTheDocument();
  });

  it("has p-3 padding override", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: false, source: false }}>
        <NodeContent />
      </Node>
    );
    const content = container.querySelector(
      "[data-slot='card-content']"
    ) as HTMLElement;
    expect(content.className).toContain("p-3");
  });

  it("forwards custom className", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: false, source: false }}>
        <NodeContent className="custom-content" />
      </Node>
    );
    const content = container.querySelector(
      "[data-slot='card-content']"
    ) as HTMLElement;
    expect(content.className).toContain("custom-content");
  });
});

// ---------------------------------------------------------------------------
// 9. NodeFooter
// ---------------------------------------------------------------------------

describe("NodeFooter — classes and content", () => {
  it("composes CardFooter and renders children", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: false, source: false }}>
        <NodeFooter>
          <span>footer text</span>
        </NodeFooter>
      </Node>
    );
    expect(
      container.querySelector("[data-slot='card-footer']")
    ).toBeInTheDocument();
    expect(screen.getByText("footer text")).toBeInTheDocument();
  });

  it("has bg-secondary surface", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: false, source: false }}>
        <NodeFooter />
      </Node>
    );
    const footer = container.querySelector(
      "[data-slot='card-footer']"
    ) as HTMLElement;
    expect(footer.className).toContain("bg-secondary");
  });

  it("has a top border (border-t)", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: false, source: false }}>
        <NodeFooter />
      </Node>
    );
    const footer = container.querySelector(
      "[data-slot='card-footer']"
    ) as HTMLElement;
    expect(footer.className).toContain("border-t");
  });

  it("has rounded-b-md class", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: false, source: false }}>
        <NodeFooter />
      </Node>
    );
    const footer = container.querySelector(
      "[data-slot='card-footer']"
    ) as HTMLElement;
    expect(footer.className).toContain("rounded-b-md");
  });

  it("forwards custom className", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: false, source: false }}>
        <NodeFooter className="custom-footer" />
      </Node>
    );
    const footer = container.querySelector(
      "[data-slot='card-footer']"
    ) as HTMLElement;
    expect(footer.className).toContain("custom-footer");
  });
});

// ---------------------------------------------------------------------------
// 10. Composition & structure
// ---------------------------------------------------------------------------

describe("Node — composition & structure", () => {
  it("all compound parts live inside the Node root", () => {
    const { container } = renderFullNode();
    const card = container.querySelector("[data-slot='card']") as HTMLElement;
    expect(within(card).getByText("Prompt")).toBeInTheDocument();
    expect(within(card).getByText("Entry point")).toBeInTheDocument();
    expect(within(card).getByText("Classify the ticket.")).toBeInTheDocument();
    expect(within(card).getByText("gpt-5")).toBeInTheDocument();
  });

  it("handles are rendered inside the Node root", () => {
    const { container } = renderInFlow(
      <Node handles={{ target: true, source: true }} />
    );
    const card = container.querySelector("[data-slot='card']") as HTMLElement;
    expect(
      card.querySelector("[data-slot='node-handle-target']")
    ).toBeInTheDocument();
    expect(
      card.querySelector("[data-slot='node-handle-source']")
    ).toBeInTheDocument();
  });

  it("renders a content-only node (no header/footer)", () => {
    renderInFlow(
      <Node handles={{ target: false, source: true }}>
        <NodeContent>
          <p>Just content</p>
        </NodeContent>
      </Node>
    );
    expect(screen.getByText("Just content")).toBeInTheDocument();
  });

  it("updates handles on re-render", () => {
    const { container, rerender } = renderInFlow(
      <Node handles={{ target: true, source: false }} />
    );
    expect(
      container.querySelector("[data-slot='node-handle-target']")
    ).toBeInTheDocument();

    rerender(
      <ReactFlowProvider>
        <Node handles={{ target: false, source: true }} />
      </ReactFlowProvider>
    );
    expect(
      container.querySelector("[data-slot='node-handle-target']")
    ).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='node-handle-source']")
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 11. Accessibility — axe
// ---------------------------------------------------------------------------

describe("Node — accessibility (axe)", () => {
  it("bare node has no axe violations", async () => {
    const { container } = render(
      <main>
        <ReactFlowProvider>
          <Node handles={{ target: false, source: false }} />
        </ReactFlowProvider>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("fully-composed node has no axe violations", async () => {
    const { container } = render(
      <main>
        <ReactFlowProvider>
          <Node handles={{ target: true, source: true }}>
            <NodeHeader>
              <NodeTitle>Prompt</NodeTitle>
              <NodeDescription>Entry point</NodeDescription>
              <NodeAction>
                <button aria-label="Edit node">Edit</button>
              </NodeAction>
            </NodeHeader>
            <NodeContent>
              <p>Classify the ticket.</p>
            </NodeContent>
            <NodeFooter>
              <span>gpt-5</span>
            </NodeFooter>
          </Node>
        </ReactFlowProvider>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("content-only node has no axe violations", async () => {
    const { container } = render(
      <main>
        <ReactFlowProvider>
          <Node handles={{ target: false, source: true }}>
            <NodeContent>
              <p>Summarize the input.</p>
            </NodeContent>
          </Node>
        </ReactFlowProvider>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
