/**
 * Exhaustive tests for ChainOfThought compound component
 *
 * Component source: components/ai-elements/chain-of-thought.tsx
 *
 * Exports:
 *   useChainOfThought          – context hook (throws outside <ChainOfThought>)
 *   ChainOfThought             – root div, data-slot="chain-of-thought",
 *                                controllable disclosure (open/defaultOpen/onOpenChange)
 *   ChainOfThoughtHeader       – collapsible trigger, data-slot="chain-of-thought-header"
 *   ChainOfThoughtStep         – a reasoning step, data-slot="chain-of-thought-step",
 *                                data-status="complete|active|pending", optional icon/description
 *   ChainOfThoughtSearchResults – flex wrapper, data-slot="chain-of-thought-search-results"
 *   ChainOfThoughtSearchResult  – Badge chip, data-slot="chain-of-thought-search-result"
 *   ChainOfThoughtContent       – collapsible panel, data-slot="chain-of-thought-content"
 *   ChainOfThoughtImage         – image well + caption, data-slot="chain-of-thought-image"
 */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { MagnifyingGlass } from "@/lib/icons"
import {
  ChainOfThought,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
  ChainOfThoughtSearchResults,
  ChainOfThoughtSearchResult,
  ChainOfThoughtContent,
  ChainOfThoughtImage,
  useChainOfThought,
} from "@/components/ai-elements/chain-of-thought";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderFull(props?: React.ComponentProps<typeof ChainOfThought>) {
  return render(
    <main>
      <ChainOfThought {...props}>
        <ChainOfThoughtHeader>My reasoning</ChainOfThoughtHeader>
        <ChainOfThoughtContent>
          <ChainOfThoughtStep
            icon={MagnifyingGlass}
            label="Searching the web"
            status="complete"
          >
            <ChainOfThoughtSearchResults>
              <ChainOfThoughtSearchResult>vercel.com</ChainOfThoughtSearchResult>
              <ChainOfThoughtSearchResult>react.dev</ChainOfThoughtSearchResult>
            </ChainOfThoughtSearchResults>
          </ChainOfThoughtStep>
          <ChainOfThoughtStep
            description="Reading the docs"
            label="Reading"
            status="active"
          >
            <ChainOfThoughtImage caption="A diagram">
              <span>diagram</span>
            </ChainOfThoughtImage>
          </ChainOfThoughtStep>
          <ChainOfThoughtStep label="Drafting" status="pending" />
        </ChainOfThoughtContent>
      </ChainOfThought>
    </main>
  );
}

// ---------------------------------------------------------------------------
// 1. Renders without crashing
// ---------------------------------------------------------------------------

describe("ChainOfThought — renders without crashing", () => {
  it("renders a bare ChainOfThought without crashing", () => {
    const { container } = render(<ChainOfThought />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("root element is a <div>", () => {
    const { container } = render(<ChainOfThought />);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("renders a fully-composed tree without crashing", () => {
    expect(() => renderFull({ defaultOpen: true })).not.toThrow();
  });

  it("renders children inside the root", () => {
    render(<ChainOfThought>hello chain</ChainOfThought>);
    expect(screen.getByText("hello chain")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 2. data-slot attributes
// ---------------------------------------------------------------------------

describe("ChainOfThought — data-slot attributes", () => {
  it("root has data-slot='chain-of-thought'", () => {
    const { container } = render(<ChainOfThought />);
    expect(container.firstChild).toHaveAttribute(
      "data-slot",
      "chain-of-thought"
    );
  });

  it("ChainOfThoughtHeader trigger has data-slot='chain-of-thought-header'", () => {
    const { container } = render(
      <ChainOfThought>
        <ChainOfThoughtHeader />
      </ChainOfThought>
    );
    expect(
      container.querySelector("[data-slot='chain-of-thought-header']")
    ).toBeInTheDocument();
  });

  it("header renders the brain icon and chevron slots", () => {
    const { container } = render(
      <ChainOfThought>
        <ChainOfThoughtHeader />
      </ChainOfThought>
    );
    expect(
      container.querySelector("[data-slot='chain-of-thought-header-icon']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='chain-of-thought-header-chevron']")
    ).toBeInTheDocument();
  });

  it("ChainOfThoughtContent panel has data-slot='chain-of-thought-content'", () => {
    const { container } = render(
      <ChainOfThought defaultOpen>
        <ChainOfThoughtContent>body</ChainOfThoughtContent>
      </ChainOfThought>
    );
    expect(
      container.querySelector("[data-slot='chain-of-thought-content']")
    ).toBeInTheDocument();
  });

  it("ChainOfThoughtStep has data-slot='chain-of-thought-step'", () => {
    const { container } = render(
      <ChainOfThought>
        <ChainOfThoughtStep label="x" />
      </ChainOfThought>
    );
    expect(
      container.querySelector("[data-slot='chain-of-thought-step']")
    ).toBeInTheDocument();
  });

  it("ChainOfThoughtStep icon and label have data-slots", () => {
    const { container } = render(
      <ChainOfThought>
        <ChainOfThoughtStep label="Step label" />
      </ChainOfThought>
    );
    expect(
      container.querySelector("[data-slot='chain-of-thought-step-icon']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='chain-of-thought-step-label']")
    ).toBeInTheDocument();
  });

  it("ChainOfThoughtSearchResults has data-slot", () => {
    const { container } = render(<ChainOfThoughtSearchResults />);
    expect(container.firstChild).toHaveAttribute(
      "data-slot",
      "chain-of-thought-search-results"
    );
  });

  it("ChainOfThoughtSearchResult has data-slot", () => {
    const { container } = render(
      <ChainOfThoughtSearchResult>x</ChainOfThoughtSearchResult>
    );
    expect(container.firstChild).toHaveAttribute(
      "data-slot",
      "chain-of-thought-search-result"
    );
  });

  it("ChainOfThoughtImage has data-slot", () => {
    const { container } = render(<ChainOfThoughtImage>x</ChainOfThoughtImage>);
    expect(container.firstChild).toHaveAttribute(
      "data-slot",
      "chain-of-thought-image"
    );
  });
});

// ---------------------------------------------------------------------------
// 3. Header — default label fallback & custom children
// ---------------------------------------------------------------------------

describe("ChainOfThoughtHeader — label", () => {
  it("falls back to 'Chain of Thought' when no children given", () => {
    render(
      <ChainOfThought>
        <ChainOfThoughtHeader />
      </ChainOfThought>
    );
    expect(screen.getByText("Chain of Thought")).toBeInTheDocument();
  });

  it("renders custom children label", () => {
    render(
      <ChainOfThought>
        <ChainOfThoughtHeader>Custom reasoning</ChainOfThoughtHeader>
      </ChainOfThought>
    );
    expect(screen.getByText("Custom reasoning")).toBeInTheDocument();
    expect(screen.queryByText("Chain of Thought")).not.toBeInTheDocument();
  });

  it("trigger renders as a button (accessible)", () => {
    render(
      <ChainOfThought>
        <ChainOfThoughtHeader>Reasoning</ChainOfThoughtHeader>
      </ChainOfThought>
    );
    expect(
      screen.getByRole("button", { name: /reasoning/i })
    ).toBeInTheDocument();
  });

  it("reflects open state via aria-expanded and data-panel-open (drives chevron)", async () => {
    const user = userEvent.setup();
    render(
      <ChainOfThought>
        <ChainOfThoughtHeader>Reasoning</ChainOfThoughtHeader>
      </ChainOfThought>
    );
    const button = screen.getByRole("button", { name: /reasoning/i });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).not.toHaveAttribute("data-panel-open");

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(button).toHaveAttribute("data-panel-open");
  });

  it("preserves a consumer-supplied onClick alongside the toggle", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <ChainOfThought>
        <ChainOfThoughtHeader onClick={onClick}>
          Reasoning
        </ChainOfThoughtHeader>
        <ChainOfThoughtContent>
          <ChainOfThoughtStep label="Inner step" />
        </ChainOfThoughtContent>
      </ChainOfThought>
    );
    await user.click(screen.getByRole("button", { name: /reasoning/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
    // toggle still happened
    expect(screen.getByText("Inner step")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 4. ChainOfThoughtStep — status variants (cva) + data-status
// ---------------------------------------------------------------------------

describe("ChainOfThoughtStep — status variants", () => {
  it("defaults to status='complete' (data-status + muted text)", () => {
    const { container } = render(
      <ChainOfThought>
        <ChainOfThoughtStep label="x" />
      </ChainOfThought>
    );
    const step = container.querySelector(
      "[data-slot='chain-of-thought-step']"
    ) as HTMLElement;
    expect(step).toHaveAttribute("data-status", "complete");
    expect(step.className).toContain("text-muted-foreground");
  });

  it("status='complete' sets data-status='complete'", () => {
    const { container } = render(
      <ChainOfThought>
        <ChainOfThoughtStep label="x" status="complete" />
      </ChainOfThought>
    );
    const step = container.querySelector(
      "[data-slot='chain-of-thought-step']"
    ) as HTMLElement;
    expect(step).toHaveAttribute("data-status", "complete");
  });

  it("status='active' sets data-status='active' and text-foreground", () => {
    const { container } = render(
      <ChainOfThought>
        <ChainOfThoughtStep label="x" status="active" />
      </ChainOfThought>
    );
    const step = container.querySelector(
      "[data-slot='chain-of-thought-step']"
    ) as HTMLElement;
    expect(step).toHaveAttribute("data-status", "active");
    expect(step.className).toContain("text-foreground");
  });

  it("status='pending' sets data-status='pending' and faded text", () => {
    const { container } = render(
      <ChainOfThought>
        <ChainOfThoughtStep label="x" status="pending" />
      </ChainOfThought>
    );
    const step = container.querySelector(
      "[data-slot='chain-of-thought-step']"
    ) as HTMLElement;
    expect(step).toHaveAttribute("data-status", "pending");
    expect(step.className).toContain("text-muted-foreground/50");
  });
});

// ---------------------------------------------------------------------------
// 5. ChainOfThoughtStep — icon, label, description, children
// ---------------------------------------------------------------------------

describe("ChainOfThoughtStep — content", () => {
  it("renders the label", () => {
    render(
      <ChainOfThought>
        <ChainOfThoughtStep label="Searching the web" />
      </ChainOfThought>
    );
    expect(screen.getByText("Searching the web")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    const { container } = render(
      <ChainOfThought>
        <ChainOfThoughtStep description="Cross-referencing" label="Reading" />
      </ChainOfThought>
    );
    expect(screen.getByText("Cross-referencing")).toBeInTheDocument();
    expect(
      container.querySelector(
        "[data-slot='chain-of-thought-step-description']"
      )
    ).toBeInTheDocument();
  });

  it("omits description node when not provided", () => {
    const { container } = render(
      <ChainOfThought>
        <ChainOfThoughtStep label="Reading" />
      </ChainOfThought>
    );
    expect(
      container.querySelector(
        "[data-slot='chain-of-thought-step-description']"
      )
    ).not.toBeInTheDocument();
  });

  it("renders a custom icon when supplied", () => {
    const { container } = render(
      <ChainOfThought>
        <ChainOfThoughtStep icon={MagnifyingGlass} label="Search" />
      </ChainOfThought>
    );
    const icon = container.querySelector(
      "[data-slot='chain-of-thought-step-icon']"
    ) as SVGElement;
    expect(icon).toBeInTheDocument();
    expect(icon.tagName.toLowerCase()).toBe("svg");
  });

  it("renders the default Circle icon when no icon prop is given", () => {
    const { container } = render(
      <ChainOfThought>
        <ChainOfThoughtStep label="Default icon" />
      </ChainOfThought>
    );
    const icon = container.querySelector(
      "[data-slot='chain-of-thought-step-icon']"
    ) as SVGElement;
    expect(icon).toBeInTheDocument();
    expect(icon.tagName.toLowerCase()).toBe("svg");
  });

  it("renders nested children", () => {
    render(
      <ChainOfThought>
        <ChainOfThoughtStep label="Step">
          <span>nested content</span>
        </ChainOfThoughtStep>
      </ChainOfThought>
    );
    expect(screen.getByText("nested content")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 6. Search results
// ---------------------------------------------------------------------------

describe("ChainOfThoughtSearchResults / SearchResult", () => {
  it("renders multiple search-result chips", () => {
    render(
      <ChainOfThoughtSearchResults>
        <ChainOfThoughtSearchResult>vercel.com</ChainOfThoughtSearchResult>
        <ChainOfThoughtSearchResult>react.dev</ChainOfThoughtSearchResult>
      </ChainOfThoughtSearchResults>
    );
    expect(screen.getByText("vercel.com")).toBeInTheDocument();
    expect(screen.getByText("react.dev")).toBeInTheDocument();
  });

  it("search-result is rendered as a secondary Badge (font-normal data text)", () => {
    const { container } = render(
      <ChainOfThoughtSearchResult>vercel.com</ChainOfThoughtSearchResult>
    );
    const chip = container.querySelector(
      "[data-slot='chain-of-thought-search-result']"
    ) as HTMLElement;
    expect(chip.className).toContain("bg-secondary");
    expect(chip.className).toContain("font-normal");
  });

  it("search-results wrapper has flex-wrap layout", () => {
    const { container } = render(<ChainOfThoughtSearchResults />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "flex-wrap"
    );
  });
});

// ---------------------------------------------------------------------------
// 7. ChainOfThoughtImage — caption present / absent
// ---------------------------------------------------------------------------

describe("ChainOfThoughtImage", () => {
  it("renders its children inside the image well", () => {
    render(
      <ChainOfThoughtImage>
        <span>diagram-body</span>
      </ChainOfThoughtImage>
    );
    expect(screen.getByText("diagram-body")).toBeInTheDocument();
  });

  it("renders caption when provided", () => {
    const { container } = render(
      <ChainOfThoughtImage caption="A helpful caption">
        <span>x</span>
      </ChainOfThoughtImage>
    );
    expect(screen.getByText("A helpful caption")).toBeInTheDocument();
    expect(
      container.querySelector(
        "[data-slot='chain-of-thought-image-caption']"
      )
    ).toBeInTheDocument();
  });

  it("omits caption node when not provided", () => {
    const { container } = render(
      <ChainOfThoughtImage>
        <span>x</span>
      </ChainOfThoughtImage>
    );
    expect(
      container.querySelector(
        "[data-slot='chain-of-thought-image-caption']"
      )
    ).not.toBeInTheDocument();
  });

  it("uses a scale-based max-height (no arbitrary value)", () => {
    const { container } = render(
      <ChainOfThoughtImage>
        <span>x</span>
      </ChainOfThoughtImage>
    );
    const well = (container.firstChild as HTMLElement)
      .firstChild as HTMLElement;
    expect(well.className).toContain("max-h-80");
    expect(well.className).toContain("bg-muted");
  });
});

// ---------------------------------------------------------------------------
// 8. Disclosure behavior — uncontrolled + controlled
// ---------------------------------------------------------------------------

describe("ChainOfThought — disclosure (uncontrolled)", () => {
  it("content is hidden by default (defaultOpen omitted => closed)", () => {
    renderFull();
    expect(screen.queryByText("Searching the web")).not.toBeInTheDocument();
  });

  it("content is visible when defaultOpen", () => {
    renderFull({ defaultOpen: true });
    expect(screen.getByText("Searching the web")).toBeInTheDocument();
  });

  it("clicking the header toggles the content open then closed", async () => {
    const user = userEvent.setup();
    renderFull();
    // Initially closed
    expect(screen.queryByText("Searching the web")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /my reasoning/i }));
    expect(screen.getByText("Searching the web")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /my reasoning/i }));
    expect(screen.queryByText("Searching the web")).not.toBeInTheDocument();
  });
});

describe("ChainOfThought — disclosure (controlled)", () => {
  it("respects controlled open=true", () => {
    renderFull({ open: true });
    expect(screen.getByText("Searching the web")).toBeInTheDocument();
  });

  it("respects controlled open=false", () => {
    renderFull({ open: false });
    expect(screen.queryByText("Searching the web")).not.toBeInTheDocument();
  });

  it("calls onOpenChange when the header is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderFull({ open: false, onOpenChange });

    await user.click(screen.getByRole("button", { name: /my reasoning/i }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("does not internally toggle while controlled (stays closed if parent ignores)", async () => {
    const user = userEvent.setup();
    renderFull({ open: false, onOpenChange: vi.fn() });

    await user.click(screen.getByRole("button", { name: /my reasoning/i }));
    // Parent ignored the change, so content remains closed
    expect(screen.queryByText("Searching the web")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 9. useChainOfThought — context guard
// ---------------------------------------------------------------------------

describe("useChainOfThought — context guard", () => {
  it("throws when a header is rendered outside <ChainOfThought>", () => {
    // Silence the expected React error boundary console noise
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<ChainOfThoughtHeader />)).toThrow(
      /must be used within ChainOfThought/
    );
    spy.mockRestore();
  });

  it("throws from the hook directly when no provider is present", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    function Consumer() {
      useChainOfThought();
      return null;
    }
    expect(() => render(<Consumer />)).toThrow(
      /must be used within ChainOfThought/
    );
    spy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// 10. className + HTML attribute forwarding
// ---------------------------------------------------------------------------

describe("ChainOfThought — className & attribute forwarding", () => {
  it("root forwards custom className and merges base classes", () => {
    const { container } = render(<ChainOfThought className="my-root" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("my-root");
    expect(el.className).toContain("max-w-prose");
  });

  it("root forwards id and data-testid", () => {
    const { container } = render(
      <ChainOfThought id="cot-1" data-testid="cot" />
    );
    expect(container.firstChild).toHaveAttribute("id", "cot-1");
    expect(container.firstChild).toHaveAttribute("data-testid", "cot");
  });

  it("header forwards custom className", () => {
    const { container } = render(
      <ChainOfThought>
        <ChainOfThoughtHeader className="my-header" />
      </ChainOfThought>
    );
    const trigger = container.querySelector(
      "[data-slot='chain-of-thought-header']"
    ) as HTMLElement;
    expect(trigger.className).toContain("my-header");
  });

  it("step forwards custom className", () => {
    const { container } = render(
      <ChainOfThought>
        <ChainOfThoughtStep className="my-step" label="x" />
      </ChainOfThought>
    );
    const step = container.querySelector(
      "[data-slot='chain-of-thought-step']"
    ) as HTMLElement;
    expect(step.className).toContain("my-step");
  });

  it("search-results forwards custom className", () => {
    const { container } = render(
      <ChainOfThoughtSearchResults className="my-results" />
    );
    expect((container.firstChild as HTMLElement).className).toContain(
      "my-results"
    );
  });

  it("search-result forwards custom className", () => {
    const { container } = render(
      <ChainOfThoughtSearchResult className="my-chip">x</ChainOfThoughtSearchResult>
    );
    expect((container.firstChild as HTMLElement).className).toContain(
      "my-chip"
    );
  });

  it("image forwards custom className", () => {
    const { container } = render(
      <ChainOfThoughtImage className="my-image">x</ChainOfThoughtImage>
    );
    expect((container.firstChild as HTMLElement).className).toContain(
      "my-image"
    );
  });

  it("content forwards custom className", () => {
    const { container } = render(
      <ChainOfThought defaultOpen>
        <ChainOfThoughtContent className="my-content">
          body
        </ChainOfThoughtContent>
      </ChainOfThought>
    );
    const panel = container.querySelector(
      "[data-slot='chain-of-thought-content']"
    ) as HTMLElement;
    expect(panel.className).toContain("my-content");
  });
});

// ---------------------------------------------------------------------------
// 11. DOM structure
// ---------------------------------------------------------------------------

describe("ChainOfThought — DOM structure", () => {
  it("renders a single root element", () => {
    const { container } = render(<ChainOfThought />);
    expect(container.children).toHaveLength(1);
  });

  it("step contains its label, description, and search chips", () => {
    const { container } = render(
      <ChainOfThought>
        <ChainOfThoughtStep description="desc" label="Step label">
          <ChainOfThoughtSearchResults>
            <ChainOfThoughtSearchResult>a.com</ChainOfThoughtSearchResult>
          </ChainOfThoughtSearchResults>
        </ChainOfThoughtStep>
      </ChainOfThought>
    );
    const step = container.querySelector(
      "[data-slot='chain-of-thought-step']"
    ) as HTMLElement;
    expect(within(step).getByText("Step label")).toBeInTheDocument();
    expect(within(step).getByText("desc")).toBeInTheDocument();
    expect(within(step).getByText("a.com")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 12. Re-render behavior
// ---------------------------------------------------------------------------

describe("ChainOfThought — re-render", () => {
  it("updates step status on re-render", () => {
    const { container, rerender } = render(
      <ChainOfThought>
        <ChainOfThoughtStep label="x" status="pending" />
      </ChainOfThought>
    );
    let step = container.querySelector(
      "[data-slot='chain-of-thought-step']"
    ) as HTMLElement;
    expect(step).toHaveAttribute("data-status", "pending");

    rerender(
      <ChainOfThought>
        <ChainOfThoughtStep label="x" status="active" />
      </ChainOfThought>
    );
    step = container.querySelector(
      "[data-slot='chain-of-thought-step']"
    ) as HTMLElement;
    expect(step).toHaveAttribute("data-status", "active");
  });

  it("reflects controlled open prop changes on re-render", () => {
    const { rerender } = renderFull({ open: false });
    expect(screen.queryByText("Searching the web")).not.toBeInTheDocument();

    rerender(
      <main>
        <ChainOfThought open>
          <ChainOfThoughtHeader>My reasoning</ChainOfThoughtHeader>
          <ChainOfThoughtContent>
            <ChainOfThoughtStep label="Searching the web" />
          </ChainOfThoughtContent>
        </ChainOfThought>
      </main>
    );
    expect(screen.getByText("Searching the web")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 13. Accessibility — axe
// ---------------------------------------------------------------------------

describe("ChainOfThought — accessibility (axe)", () => {
  it("collapsed tree has no axe violations", async () => {
    const { container } = renderFull();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("expanded tree (defaultOpen) has no axe violations", async () => {
    const { container } = renderFull({ defaultOpen: true });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("standalone image with caption has no axe violations", async () => {
    const { container } = render(
      <main>
        <ChainOfThoughtImage caption="A diagram">
          <span>diagram</span>
        </ChainOfThoughtImage>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
