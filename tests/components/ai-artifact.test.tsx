/**
 * Exhaustive tests for the Artifact compound component (AI Elements).
 *
 * Component source: components/ai-elements/artifact.tsx
 * Adapted from Vercel AI Elements to byronwade/ui Design DNA.
 *
 * Exports:
 *   Artifact            – root surface div, data-slot="artifact"
 *   ArtifactHeader      – header row, data-slot="artifact-header"
 *   ArtifactClose       – close Button (icon-sm/ghost), data-slot="artifact-close"
 *   ArtifactTitle       – title <p>, data-slot="artifact-title"
 *   ArtifactDescription – description <p>, data-slot="artifact-description"
 *   ArtifactActions     – action row, data-slot="artifact-actions"
 *   ArtifactAction      – action Button (+ optional tooltip/label/icon), data-slot="artifact-action"
 *   ArtifactContent     – scrollable body, data-slot="artifact-content"
 *
 * Notes on overlays (Base UI tooltip — render prop, not asChild):
 *   - Tooltip content renders in a portal; query via document.querySelector
 *   - Opens on focus (tab) when delay=0
 */

import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { CopyIcon } from "lucide-react";

import {
  Artifact,
  ArtifactHeader,
  ArtifactClose,
  ArtifactTitle,
  ArtifactDescription,
  ArtifactActions,
  ArtifactAction,
  ArtifactContent,
} from "@/components/ai-elements/artifact";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderFullArtifact() {
  return render(
    <Artifact>
      <ArtifactHeader>
        <div>
          <ArtifactTitle>component.tsx</ArtifactTitle>
          <ArtifactDescription>24 lines</ArtifactDescription>
        </div>
        <ArtifactActions>
          <ArtifactAction icon={CopyIcon} label="Copy" tooltip="Copy" />
          <ArtifactClose />
        </ArtifactActions>
      </ArtifactHeader>
      <ArtifactContent>
        <pre>const x = 1;</pre>
      </ArtifactContent>
    </Artifact>
  );
}

// ---------------------------------------------------------------------------
// 1. Renders without crashing
// ---------------------------------------------------------------------------

describe("Artifact — renders without crashing", () => {
  it("renders a bare Artifact", () => {
    const { container } = render(<Artifact />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("Artifact root is a <div>", () => {
    const { container } = render(<Artifact />);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("renders a fully-composed artifact without throwing", () => {
    expect(() => renderFullArtifact()).not.toThrow();
  });

  it("renders children inside Artifact", () => {
    render(<Artifact>hello artifact</Artifact>);
    expect(screen.getByText("hello artifact")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 2. data-slot attributes
// ---------------------------------------------------------------------------

describe("Artifact — data-slot attributes", () => {
  it("Artifact root has data-slot='artifact'", () => {
    const { container } = render(<Artifact />);
    expect(container.firstChild).toHaveAttribute("data-slot", "artifact");
  });

  it("ArtifactHeader has data-slot='artifact-header'", () => {
    const { container } = render(<ArtifactHeader />);
    expect(container.firstChild).toHaveAttribute(
      "data-slot",
      "artifact-header"
    );
  });

  it("ArtifactTitle has data-slot='artifact-title'", () => {
    const { container } = render(<ArtifactTitle>T</ArtifactTitle>);
    expect(container.firstChild).toHaveAttribute("data-slot", "artifact-title");
  });

  it("ArtifactDescription has data-slot='artifact-description'", () => {
    const { container } = render(<ArtifactDescription>D</ArtifactDescription>);
    expect(container.firstChild).toHaveAttribute(
      "data-slot",
      "artifact-description"
    );
  });

  it("ArtifactActions has data-slot='artifact-actions'", () => {
    const { container } = render(<ArtifactActions />);
    expect(container.firstChild).toHaveAttribute(
      "data-slot",
      "artifact-actions"
    );
  });

  it("ArtifactContent has data-slot='artifact-content'", () => {
    const { container } = render(<ArtifactContent />);
    expect(container.firstChild).toHaveAttribute(
      "data-slot",
      "artifact-content"
    );
  });

  it("ArtifactClose button has data-slot='artifact-close'", () => {
    const { container } = render(<ArtifactClose />);
    expect(
      container.querySelector("[data-slot='artifact-close']")
    ).toBeInTheDocument();
  });

  it("ArtifactAction button has data-slot='artifact-action'", () => {
    const { container } = render(<ArtifactAction>A</ArtifactAction>);
    expect(
      container.querySelector("[data-slot='artifact-action']")
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 3. Artifact root — tokens & base classes (DNA)
// ---------------------------------------------------------------------------

describe("Artifact — base classes (Design DNA)", () => {
  it("has flex + flex-col", () => {
    const { container } = render(<Artifact />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("flex");
    expect(cls).toContain("flex-col");
  });

  it("has overflow-hidden", () => {
    const { container } = render(<Artifact />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "overflow-hidden"
    );
  });

  it("has rounded-lg (radius scale)", () => {
    const { container } = render(<Artifact />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "rounded-lg"
    );
  });

  it("uses bg-card token surface", () => {
    const { container } = render(<Artifact />);
    expect((container.firstChild as HTMLElement).className).toContain("bg-card");
  });

  it("uses text-card-foreground token", () => {
    const { container } = render(<Artifact />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "text-card-foreground"
    );
  });

  it("elevates with edge utility, not a hard surface border", () => {
    const { container } = render(<Artifact />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("edge");
    expect(cls).not.toContain("border-border");
  });

  it("uses no raw color / arbitrary color value", () => {
    const { container } = render(<Artifact />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).not.toMatch(/#[0-9a-f]{3,6}/i);
    expect(cls).not.toMatch(/\b(white|black)\b/);
  });
});

// ---------------------------------------------------------------------------
// 4. ArtifactHeader classes
// ---------------------------------------------------------------------------

describe("ArtifactHeader — classes", () => {
  it("is a separator-only border-b divider", () => {
    const { container } = render(<ArtifactHeader />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("border-b");
    expect(cls).toContain("border-border");
  });

  it("uses muted token fill (bg-muted/40)", () => {
    const { container } = render(<ArtifactHeader />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "bg-muted/40"
    );
  });

  it("lays out as flex with space-between", () => {
    const { container } = render(<ArtifactHeader />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("flex");
    expect(cls).toContain("items-center");
    expect(cls).toContain("justify-between");
  });

  it("renders children", () => {
    render(<ArtifactHeader>header content</ArtifactHeader>);
    expect(screen.getByText("header content")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 5. ArtifactTitle — editorial type
// ---------------------------------------------------------------------------

describe("ArtifactTitle — classes & content", () => {
  it("is a <p> element", () => {
    const { container } = render(<ArtifactTitle>T</ArtifactTitle>);
    expect(container.firstChild?.nodeName).toBe("P");
  });

  it("uses font-medium, never bold/semibold", () => {
    const { container } = render(<ArtifactTitle>T</ArtifactTitle>);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("font-medium");
    expect(cls).not.toContain("font-bold");
    expect(cls).not.toContain("font-semibold");
  });

  it("uses text-foreground token", () => {
    const { container } = render(<ArtifactTitle>T</ArtifactTitle>);
    expect((container.firstChild as HTMLElement).className).toContain(
      "text-foreground"
    );
  });

  it("renders title text", () => {
    render(<ArtifactTitle>page.tsx</ArtifactTitle>);
    expect(screen.getByText("page.tsx")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 6. ArtifactDescription
// ---------------------------------------------------------------------------

describe("ArtifactDescription — classes & content", () => {
  it("is a <p> element", () => {
    const { container } = render(<ArtifactDescription>D</ArtifactDescription>);
    expect(container.firstChild?.nodeName).toBe("P");
  });

  it("uses text-muted-foreground token", () => {
    const { container } = render(<ArtifactDescription>D</ArtifactDescription>);
    expect((container.firstChild as HTMLElement).className).toContain(
      "text-muted-foreground"
    );
  });

  it("renders description text", () => {
    render(<ArtifactDescription>42 lines</ArtifactDescription>);
    expect(screen.getByText("42 lines")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 7. ArtifactActions
// ---------------------------------------------------------------------------

describe("ArtifactActions — classes & content", () => {
  it("lays out as a flex gap row", () => {
    const { container } = render(<ArtifactActions />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("flex");
    expect(cls).toContain("items-center");
    expect(cls).toContain("gap-1");
  });

  it("renders multiple action children", () => {
    render(
      <ArtifactActions>
        <ArtifactAction label="One">1</ArtifactAction>
        <ArtifactAction label="Two">2</ArtifactAction>
      </ArtifactActions>
    );
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 8. ArtifactClose
// ---------------------------------------------------------------------------

describe("ArtifactClose — defaults, variants, interaction", () => {
  it("renders a button", () => {
    render(<ArtifactClose />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("has an accessible 'Close' label via sr-only", () => {
    render(<ArtifactClose />);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("renders a default X icon when no children provided", () => {
    const { container } = render(<ArtifactClose />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders custom children instead of the X icon", () => {
    render(<ArtifactClose>Dismiss</ArtifactClose>);
    expect(screen.getByText("Dismiss")).toBeInTheDocument();
  });

  it("defaults to ghost variant + muted foreground", () => {
    const { container } = render(<ArtifactClose />);
    const btn = container.querySelector(
      "[data-slot='artifact-close']"
    ) as HTMLElement;
    expect(btn.className).toContain("text-muted-foreground");
    expect(btn.className).toContain("hover:text-foreground");
  });

  it("accepts a different size override", () => {
    render(<ArtifactClose size="icon" />);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("accepts a different variant override", () => {
    render(<ArtifactClose variant="outline" />);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("has type='button'", () => {
    const { container } = render(<ArtifactClose />);
    const btn = container.querySelector("[data-slot='artifact-close']");
    expect(btn).toHaveAttribute("type", "button");
  });

  it("fires onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<ArtifactClose onClick={onClick} />);
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("forwards custom className (merged with base)", () => {
    const { container } = render(<ArtifactClose className="custom-close" />);
    const btn = container.querySelector(
      "[data-slot='artifact-close']"
    ) as HTMLElement;
    expect(btn.className).toContain("custom-close");
    expect(btn.className).toContain("text-muted-foreground");
  });
});

// ---------------------------------------------------------------------------
// 9. ArtifactAction — icon / label / children / tooltip branches
// ---------------------------------------------------------------------------

describe("ArtifactAction — without tooltip", () => {
  it("renders the button without a tooltip wrapper", () => {
    render(<ArtifactAction label="Copy">copy</ArtifactAction>);
    expect(screen.getByText("copy")).toBeInTheDocument();
  });

  it("renders children when no icon is provided", () => {
    render(<ArtifactAction label="Execute">Run</ArtifactAction>);
    // visible children render alongside the sr-only label
    expect(screen.getByText("Run")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Run.*Execute/ })
    ).toBeInTheDocument();
  });

  it("renders the icon (not children) when an icon is provided", () => {
    const { container } = render(
      <ArtifactAction icon={CopyIcon} label="Copy" />
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("exposes the label via sr-only text", () => {
    render(<ArtifactAction icon={CopyIcon} label="Copy code" />);
    expect(
      screen.getByRole("button", { name: "Copy code" })
    ).toBeInTheDocument();
  });

  it("falls back to tooltip text for sr-only when no label and no tooltip wrapper", () => {
    // label is undefined; tooltip is undefined -> sr-only is empty, button still renders
    const { container } = render(<ArtifactAction icon={CopyIcon} />);
    expect(
      container.querySelector("[data-slot='artifact-action']")
    ).toBeInTheDocument();
  });

  it("defaults to ghost variant + muted foreground", () => {
    const { container } = render(<ArtifactAction label="A">A</ArtifactAction>);
    const btn = container.querySelector(
      "[data-slot='artifact-action']"
    ) as HTMLElement;
    expect(btn.className).toContain("text-muted-foreground");
  });

  it("has type='button'", () => {
    const { container } = render(<ArtifactAction label="A">A</ArtifactAction>);
    expect(
      container.querySelector("[data-slot='artifact-action']")
    ).toHaveAttribute("type", "button");
  });

  it("accepts size and variant overrides", () => {
    render(
      <ArtifactAction icon={CopyIcon} label="A" size="icon" variant="outline" />
    );
    expect(screen.getByRole("button", { name: "A" })).toBeInTheDocument();
  });

  it("fires onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<ArtifactAction icon={CopyIcon} label="Copy" onClick={onClick} />);
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("forwards custom className", () => {
    const { container } = render(
      <ArtifactAction className="custom-action" label="A">
        A
      </ArtifactAction>
    );
    const btn = container.querySelector(
      "[data-slot='artifact-action']"
    ) as HTMLElement;
    expect(btn.className).toContain("custom-action");
  });
});

describe("ArtifactAction — with tooltip", () => {
  it("still renders the action button when tooltip is set", () => {
    const { container } = render(
      <ArtifactAction icon={CopyIcon} label="Copy" tooltip="Copy to clipboard" />
    );
    expect(
      container.querySelector("[data-slot='artifact-action']")
    ).toBeInTheDocument();
  });

  it("renders sr-only label text (label takes precedence over tooltip)", () => {
    render(
      <ArtifactAction icon={CopyIcon} label="Copy file" tooltip="Tooltip text" />
    );
    expect(
      screen.getByRole("button", { name: "Copy file" })
    ).toBeInTheDocument();
  });

  it("uses tooltip text as sr-only label when no explicit label", () => {
    render(<ArtifactAction icon={CopyIcon} tooltip="Copy" />);
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
  });

  it("shows tooltip content on focus", async () => {
    const user = userEvent.setup();
    render(
      <ArtifactAction icon={CopyIcon} label="Copy" tooltip="Copy snippet" />
    );
    await user.tab();
    await waitFor(() => {
      const content = document.querySelector(
        "[data-slot='tooltip-content']"
      );
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent("Copy snippet");
    });
  });

  it("fires onClick from the tooltip-wrapped button", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <ArtifactAction
        icon={CopyIcon}
        label="Copy"
        tooltip="Copy"
        onClick={onClick}
      />
    );
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// 10. ArtifactContent
// ---------------------------------------------------------------------------

describe("ArtifactContent — classes & content", () => {
  it("fills remaining space (flex-1) and scrolls", () => {
    const { container } = render(<ArtifactContent />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("flex-1");
    expect(cls).toContain("overflow-auto");
  });

  it("uses the scrollbar-thin house utility", () => {
    const { container } = render(<ArtifactContent />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "scrollbar-thin"
    );
  });

  it("renders body children", () => {
    render(
      <ArtifactContent>
        <pre>const x = 1;</pre>
      </ArtifactContent>
    );
    expect(screen.getByText("const x = 1;")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 11. className forwarding — all div-based parts
// ---------------------------------------------------------------------------

describe("Artifact parts — className forwarding", () => {
  it("Artifact merges custom className with base", () => {
    const { container } = render(<Artifact className="x-root" />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("x-root");
    expect(cls).toContain("bg-card");
  });

  it("ArtifactHeader forwards className", () => {
    const { container } = render(<ArtifactHeader className="x-header" />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "x-header"
    );
  });

  it("ArtifactTitle forwards className", () => {
    const { container } = render(
      <ArtifactTitle className="x-title">T</ArtifactTitle>
    );
    expect((container.firstChild as HTMLElement).className).toContain("x-title");
  });

  it("ArtifactDescription forwards className", () => {
    const { container } = render(
      <ArtifactDescription className="x-desc">D</ArtifactDescription>
    );
    expect((container.firstChild as HTMLElement).className).toContain("x-desc");
  });

  it("ArtifactActions forwards className", () => {
    const { container } = render(<ArtifactActions className="x-actions" />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "x-actions"
    );
  });

  it("ArtifactContent forwards className", () => {
    const { container } = render(<ArtifactContent className="x-content" />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "x-content"
    );
  });
});

// ---------------------------------------------------------------------------
// 12. HTML attribute forwarding
// ---------------------------------------------------------------------------

describe("Artifact parts — HTML attribute forwarding", () => {
  it("Artifact forwards id / data-testid", () => {
    const { container } = render(
      <Artifact id="a1" data-testid="art" />
    );
    expect(container.firstChild).toHaveAttribute("id", "a1");
    expect(container.firstChild).toHaveAttribute("data-testid", "art");
  });

  it("ArtifactHeader forwards aria-label", () => {
    const { container } = render(<ArtifactHeader aria-label="hdr" />);
    expect(container.firstChild).toHaveAttribute("aria-label", "hdr");
  });

  it("ArtifactContent forwards data-testid", () => {
    const { container } = render(<ArtifactContent data-testid="body" />);
    expect(container.firstChild).toHaveAttribute("data-testid", "body");
  });
});

// ---------------------------------------------------------------------------
// 13. Composition & DOM structure
// ---------------------------------------------------------------------------

describe("Artifact — composition", () => {
  it("renders all compound parts within the root", () => {
    const { container } = renderFullArtifact();
    const root = container.querySelector("[data-slot='artifact']") as HTMLElement;
    expect(root.querySelector("[data-slot='artifact-header']")).toBeInTheDocument();
    expect(root.querySelector("[data-slot='artifact-title']")).toBeInTheDocument();
    expect(
      root.querySelector("[data-slot='artifact-description']")
    ).toBeInTheDocument();
    expect(
      root.querySelector("[data-slot='artifact-actions']")
    ).toBeInTheDocument();
    expect(
      root.querySelector("[data-slot='artifact-action']")
    ).toBeInTheDocument();
    expect(
      root.querySelector("[data-slot='artifact-close']")
    ).toBeInTheDocument();
    expect(
      root.querySelector("[data-slot='artifact-content']")
    ).toBeInTheDocument();
  });

  it("renders a single root element", () => {
    const { container } = render(<Artifact />);
    expect(container.children).toHaveLength(1);
  });

  it("renders independent artifacts without conflict", () => {
    render(
      <>
        <Artifact data-testid="art-a">
          <ArtifactContent>A body</ArtifactContent>
        </Artifact>
        <Artifact data-testid="art-b">
          <ArtifactContent>B body</ArtifactContent>
        </Artifact>
      </>
    );
    expect(screen.getByText("A body")).toBeInTheDocument();
    expect(screen.getByText("B body")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 14. Re-render behavior
// ---------------------------------------------------------------------------

describe("Artifact — re-render", () => {
  it("updates content children on re-render", () => {
    const { rerender } = render(
      <Artifact>
        <ArtifactContent>original</ArtifactContent>
      </Artifact>
    );
    expect(screen.getByText("original")).toBeInTheDocument();
    rerender(
      <Artifact>
        <ArtifactContent>updated</ArtifactContent>
      </Artifact>
    );
    expect(screen.getByText("updated")).toBeInTheDocument();
    expect(screen.queryByText("original")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 15. Accessibility — axe
// ---------------------------------------------------------------------------

describe("Artifact — accessibility (axe)", () => {
  it("bare Artifact has no violations", async () => {
    const { container } = render(
      <main>
        <section aria-label="Bare artifact">
          <Artifact />
        </section>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("fully-composed artifact has no violations", async () => {
    const { container } = render(
      <main>
        <Artifact>
          <ArtifactHeader>
            <div>
              <ArtifactTitle>fibonacci.ts</ArtifactTitle>
              <ArtifactDescription>42 lines · TypeScript</ArtifactDescription>
            </div>
            <ArtifactActions>
              <ArtifactAction icon={CopyIcon} label="Copy" tooltip="Copy" />
              <ArtifactClose />
            </ArtifactActions>
          </ArtifactHeader>
          <ArtifactContent>
            <pre>export const x = 1;</pre>
          </ArtifactContent>
        </Artifact>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("artifact with children-only action (no icon) has no violations", async () => {
    const { container } = render(
      <main>
        <Artifact>
          <ArtifactHeader>
            <ArtifactTitle>notes.md</ArtifactTitle>
            <ArtifactActions>
              <ArtifactAction label="Run">Run</ArtifactAction>
            </ArtifactActions>
          </ArtifactHeader>
          <ArtifactContent>
            <p>Body</p>
          </ArtifactContent>
        </Artifact>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
