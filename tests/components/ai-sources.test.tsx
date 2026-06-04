/**
 * Exhaustive tests for the ai-sources compound component
 *
 * Component source: components/ai-elements/sources.tsx
 *
 * Exports:
 *   Sources         – Collapsible root, data-slot="sources"
 *   SourcesTrigger  – Collapsible trigger w/ count, data-slot="sources-trigger"
 *   SourcesContent  – Collapsible panel, data-slot="sources-content"
 *   Source          – anchor link to a citation, data-slot="source"
 */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";

import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderSources(opts?: { defaultOpen?: boolean; count?: number }) {
  const { defaultOpen = true, count = 2 } = opts ?? {};
  return render(
    <Sources defaultOpen={defaultOpen}>
      <SourcesTrigger count={count} />
      <SourcesContent>
        <Source href="https://example.com/a" title="Source A" />
        <Source href="https://example.com/b" title="Source B" />
      </SourcesContent>
    </Sources>
  );
}

// ---------------------------------------------------------------------------
// 1. Renders without crashing
// ---------------------------------------------------------------------------

describe("Sources — renders without crashing", () => {
  it("renders a bare Sources root without crashing", () => {
    const { container } = render(<Sources />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders a fully-composed sources block without crashing", () => {
    expect(() => renderSources()).not.toThrow();
  });

  it("renders the trigger label text", () => {
    renderSources({ count: 3 });
    expect(screen.getByText(/Used/)).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText(/sources/)).toBeInTheDocument();
  });

  it("renders source titles when open", () => {
    renderSources({ defaultOpen: true });
    expect(screen.getByText("Source A")).toBeInTheDocument();
    expect(screen.getByText("Source B")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 2. data-slot attributes
// ---------------------------------------------------------------------------

describe("ai-sources — data-slot attributes", () => {
  it("Sources root has data-slot='sources'", () => {
    const { container } = render(<Sources />);
    expect(container.firstChild).toHaveAttribute("data-slot", "sources");
  });

  it("SourcesTrigger has data-slot='sources-trigger'", () => {
    const { container } = renderSources();
    expect(
      container.querySelector("[data-slot='sources-trigger']")
    ).toBeInTheDocument();
  });

  it("SourcesContent has data-slot='sources-content'", () => {
    const { container } = renderSources();
    expect(
      container.querySelector("[data-slot='sources-content']")
    ).toBeInTheDocument();
  });

  it("Source has data-slot='source'", () => {
    const { container } = renderSources();
    expect(container.querySelector("[data-slot='source']")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 3. Sources base classes (token-only)
// ---------------------------------------------------------------------------

describe("Sources — base classes", () => {
  it("has not-prose class", () => {
    const { container } = render(<Sources />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "not-prose"
    );
  });

  it("has text-xs class", () => {
    const { container } = render(<Sources />);
    expect((container.firstChild as HTMLElement).className).toContain("text-xs");
  });

  it("uses token text color (text-foreground), no raw color", () => {
    const { container } = render(<Sources />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("text-foreground");
    expect(cls).not.toMatch(/#[0-9a-fA-F]{3,6}/);
  });
});

// ---------------------------------------------------------------------------
// 4. SourcesTrigger — default content, count, classes
// ---------------------------------------------------------------------------

describe("SourcesTrigger — default content & classes", () => {
  it("renders default 'Used N sources' label with the count", () => {
    renderSources({ count: 5 });
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("count is wrapped in font-mono (mono for data)", () => {
    renderSources({ count: 7 });
    const countEl = screen.getByText("7");
    expect(countEl.className).toContain("font-mono");
  });

  it("label uses font-medium (never bold)", () => {
    const { container } = renderSources({ count: 2 });
    const trigger = container.querySelector(
      "[data-slot='sources-trigger']"
    ) as HTMLElement;
    const label = within(trigger).getByText(/Used/);
    expect(label.className).toContain("font-medium");
    expect(label.className).not.toContain("font-bold");
    expect(label.className).not.toContain("font-semibold");
  });

  it("renders a chevron icon (svg) by default", () => {
    const { container } = renderSources();
    const trigger = container.querySelector(
      "[data-slot='sources-trigger']"
    ) as HTMLElement;
    expect(trigger.querySelector("svg")).toBeInTheDocument();
  });

  it("renders custom children instead of default label when provided", () => {
    render(
      <Sources defaultOpen>
        <SourcesTrigger count={4}>
          <span>Custom trigger</span>
        </SourcesTrigger>
      </Sources>
    );
    expect(screen.getByText("Custom trigger")).toBeInTheDocument();
    expect(screen.queryByText(/Used/)).not.toBeInTheDocument();
  });

  it("uses ring-ring focus token and hover token classes", () => {
    const { container } = renderSources();
    const trigger = container.querySelector(
      "[data-slot='sources-trigger']"
    ) as HTMLElement;
    expect(trigger.className).toContain("focus-visible:ring-ring");
    expect(trigger.className).toContain("hover:text-foreground");
    expect(trigger.className).toContain("text-muted-foreground");
  });

  it("renders as a button element", () => {
    const { container } = renderSources();
    const trigger = container.querySelector("[data-slot='sources-trigger']");
    expect(trigger?.tagName).toBe("BUTTON");
  });
});

// ---------------------------------------------------------------------------
// 5. SourcesContent — animation/token classes
// ---------------------------------------------------------------------------

describe("SourcesContent — classes", () => {
  it("has flex flex-col layout classes", () => {
    const { container } = renderSources();
    const content = container.querySelector(
      "[data-slot='sources-content']"
    ) as HTMLElement;
    expect(content.className).toContain("flex");
    expect(content.className).toContain("flex-col");
  });

  it("uses Base UI data-open/data-closed animation classes", () => {
    const { container } = renderSources();
    const content = container.querySelector(
      "[data-slot='sources-content']"
    ) as HTMLElement;
    expect(content.className).toContain("data-open:animate-in");
    expect(content.className).toContain("data-closed:animate-out");
  });
});

// ---------------------------------------------------------------------------
// 6. Source — anchor attributes, default content, custom children
// ---------------------------------------------------------------------------

describe("Source — anchor attributes & content", () => {
  it("renders an anchor with href", () => {
    renderSources();
    const link = screen.getByText("Source A").closest("a");
    expect(link).toHaveAttribute("href", "https://example.com/a");
  });

  it("opens in a new tab with rel=noreferrer", () => {
    renderSources();
    const link = screen.getByText("Source A").closest("a") as HTMLAnchorElement;
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });

  it("renders a book icon (svg) by default", () => {
    const { container } = renderSources();
    const source = container.querySelector(
      "[data-slot='source']"
    ) as HTMLElement;
    expect(source.querySelector("svg")).toBeInTheDocument();
  });

  it("renders the title in a font-medium span by default", () => {
    renderSources();
    const titleSpan = screen.getByText("Source A");
    expect(titleSpan.className).toContain("font-medium");
  });

  it("renders custom children instead of the default title/icon", () => {
    render(
      <Sources defaultOpen>
        <SourcesContent>
          <Source href="https://example.com/z">
            <span>Custom source</span>
          </Source>
        </SourcesContent>
      </Sources>
    );
    expect(screen.getByText("Custom source")).toBeInTheDocument();
  });

  it("renders Source standalone (outside Sources) without crashing", () => {
    render(<Source href="https://example.com/x" title="Standalone" />);
    const link = screen.getByText("Standalone").closest("a");
    expect(link).toHaveAttribute("href", "https://example.com/x");
  });

  it("uses muted/hover token colors and ring token, no raw color", () => {
    render(<Source href="https://example.com/x" title="Tokens" />);
    const link = screen.getByText("Tokens").closest("a") as HTMLElement;
    expect(link.className).toContain("text-muted-foreground");
    expect(link.className).toContain("hover:text-foreground");
    expect(link.className).toContain("focus-visible:ring-ring");
    expect(link.className).not.toMatch(/#[0-9a-fA-F]{3,6}/);
  });
});

// ---------------------------------------------------------------------------
// 7. className forwarding — every part
// ---------------------------------------------------------------------------

describe("ai-sources — className forwarding", () => {
  it("Sources forwards custom className and keeps base classes", () => {
    const { container } = render(<Sources className="my-sources" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("my-sources");
    expect(el.className).toContain("not-prose");
  });

  it("SourcesTrigger forwards custom className", () => {
    const { container } = render(
      <Sources defaultOpen>
        <SourcesTrigger className="my-trigger" count={1} />
      </Sources>
    );
    const trigger = container.querySelector(
      "[data-slot='sources-trigger']"
    ) as HTMLElement;
    expect(trigger.className).toContain("my-trigger");
  });

  it("SourcesContent forwards custom className", () => {
    const { container } = render(
      <Sources defaultOpen>
        <SourcesContent className="my-content">
          <Source href="#" title="x" />
        </SourcesContent>
      </Sources>
    );
    const content = container.querySelector(
      "[data-slot='sources-content']"
    ) as HTMLElement;
    expect(content.className).toContain("my-content");
  });

  it("Source forwards custom className", () => {
    render(<Source className="my-source" href="#" title="x" />);
    const link = screen.getByText("x").closest("a") as HTMLElement;
    expect(link.className).toContain("my-source");
  });
});

// ---------------------------------------------------------------------------
// 8. HTML attribute forwarding
// ---------------------------------------------------------------------------

describe("ai-sources — HTML attribute forwarding", () => {
  it("Sources forwards id and data-testid", () => {
    const { container } = render(
      <Sources id="src-root" data-testid="src" />
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("id", "src-root");
    expect(el).toHaveAttribute("data-testid", "src");
  });

  it("Source forwards extra attributes (e.g. aria-label, title attr)", () => {
    render(
      <Source href="#" aria-label="External source">
        <span>linked</span>
      </Source>
    );
    const link = screen.getByText("linked").closest("a");
    expect(link).toHaveAttribute("aria-label", "External source");
  });
});

// ---------------------------------------------------------------------------
// 9. Interaction — open/close via the trigger
// ---------------------------------------------------------------------------

describe("ai-sources — collapse interaction", () => {
  it("content is collapsed (hidden) by default when defaultOpen is false", () => {
    render(
      <Sources defaultOpen={false}>
        <SourcesTrigger count={1} />
        <SourcesContent>
          <Source href="https://example.com/a" title="Hidden Source" />
        </SourcesContent>
      </Sources>
    );
    // Base UI removes/hides the panel content when closed
    expect(screen.queryByText("Hidden Source")).not.toBeInTheDocument();
  });

  it("clicking the trigger reveals the content", async () => {
    const user = userEvent.setup();
    render(
      <Sources defaultOpen={false}>
        <SourcesTrigger count={1} />
        <SourcesContent>
          <Source href="https://example.com/a" title="Toggle Source" />
        </SourcesContent>
      </Sources>
    );
    expect(screen.queryByText("Toggle Source")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button"));
    expect(await screen.findByText("Toggle Source")).toBeInTheDocument();
  });

  it("clicking the trigger again collapses the content (loses data-panel-open)", async () => {
    const user = userEvent.setup();
    render(
      <Sources defaultOpen>
        <SourcesTrigger count={1} />
        <SourcesContent>
          <Source href="https://example.com/a" title="Closable Source" />
        </SourcesContent>
      </Sources>
    );
    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("data-panel-open");
    expect(screen.getByText("Closable Source")).toBeInTheDocument();
    await user.click(trigger);
    // Base UI marks the open state on the trigger immediately, independent of
    // any close animation finishing (which never fires in jsdom).
    expect(trigger).not.toHaveAttribute("data-panel-open");
  });

  it("the trigger is keyboard-operable (Enter toggles)", async () => {
    const user = userEvent.setup();
    render(
      <Sources defaultOpen={false}>
        <SourcesTrigger count={1} />
        <SourcesContent>
          <Source href="https://example.com/a" title="Keyboard Source" />
        </SourcesContent>
      </Sources>
    );
    const trigger = screen.getByRole("button");
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByText("Keyboard Source")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 10. Accessibility — axe
// ---------------------------------------------------------------------------

describe("ai-sources — accessibility (axe)", () => {
  it("open sources block has no axe violations", async () => {
    const { container } = render(
      <main>
        <Sources defaultOpen>
          <SourcesTrigger count={2} />
          <SourcesContent>
            <Source href="https://example.com/a" title="Source A" />
            <Source href="https://example.com/b" title="Source B" />
          </SourcesContent>
        </Sources>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("collapsed sources block has no axe violations", async () => {
    const { container } = render(
      <main>
        <Sources defaultOpen={false}>
          <SourcesTrigger count={2} />
          <SourcesContent>
            <Source href="https://example.com/a" title="Source A" />
          </SourcesContent>
        </Sources>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("custom-content sources block has no axe violations", async () => {
    const { container } = render(
      <main>
        <Sources defaultOpen>
          <SourcesTrigger count={1}>
            <span>References</span>
          </SourcesTrigger>
          <SourcesContent>
            <Source href="https://example.com/a">
              <span>Custom A</span>
            </Source>
          </SourcesContent>
        </Sources>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// 11. DOM structure
// ---------------------------------------------------------------------------

describe("ai-sources — DOM structure", () => {
  it("trigger and content are descendants of the Sources root", () => {
    const { container } = renderSources();
    const root = container.querySelector("[data-slot='sources']") as HTMLElement;
    expect(root.querySelector("[data-slot='sources-trigger']")).toBeInTheDocument();
    expect(root.querySelector("[data-slot='sources-content']")).toBeInTheDocument();
  });

  it("all source links live inside the content panel", () => {
    const { container } = renderSources();
    const content = container.querySelector(
      "[data-slot='sources-content']"
    ) as HTMLElement;
    expect(content.querySelectorAll("[data-slot='source']")).toHaveLength(2);
  });

  it("renders exactly one Sources root", () => {
    const { container } = renderSources();
    expect(container.querySelectorAll("[data-slot='sources']")).toHaveLength(1);
  });
});
