/**
 * Exhaustive tests for the Shimmer text-shimmer component
 *
 * Component source: components/ai-elements/shimmer.tsx
 *
 * Exports:
 *   Shimmer — memoized animated text-shimmer (motion). Props:
 *     children (string, required), as (ElementType, default "p"),
 *     className, duration (number, default 2), spread (number, default 2),
 *     tone ("muted" | "brand" | "foreground", default "muted"),
 *     size ("sm" | "default" | "lg" | "xl", default "default").
 *   Renders one element carrying data-slot="shimmer" with a token-driven
 *   gradient in its inline style (no raw colors, no arbitrary color classes).
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Shimmer } from "@/components/ai-elements/shimmer";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const getShimmer = (container: HTMLElement) =>
  container.querySelector("[data-slot='shimmer']") as HTMLElement;

// ---------------------------------------------------------------------------
// 1. Renders without crashing
// ---------------------------------------------------------------------------

describe("Shimmer — renders without crashing", () => {
  it("renders with required children", () => {
    expect(() => render(<Shimmer>Loading</Shimmer>)).not.toThrow();
  });

  it("renders the children text content", () => {
    render(<Shimmer>Generating response</Shimmer>);
    expect(screen.getByText("Generating response")).toBeInTheDocument();
  });

  it("renders an element carrying data-slot='shimmer'", () => {
    const { container } = render(<Shimmer>Hi</Shimmer>);
    expect(getShimmer(container)).toBeInTheDocument();
  });

  it("defaults to a <p> element", () => {
    const { container } = render(<Shimmer>Hi</Shimmer>);
    expect(getShimmer(container).tagName).toBe("P");
  });

  it("renders exactly one shimmer element", () => {
    const { container } = render(<Shimmer>Hi</Shimmer>);
    expect(container.querySelectorAll("[data-slot='shimmer']")).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// 2. `as` polymorphic prop
// ---------------------------------------------------------------------------

describe("Shimmer — `as` prop", () => {
  it("renders as an h2 when as='h2'", () => {
    const { container } = render(<Shimmer as="h2">Heading</Shimmer>);
    expect(getShimmer(container).tagName).toBe("H2");
  });

  it("renders as a span when as='span'", () => {
    const { container } = render(<Shimmer as="span">Label</Shimmer>);
    expect(getShimmer(container).tagName).toBe("SPAN");
  });

  it("renders as a div when as='div'", () => {
    const { container } = render(<Shimmer as="div">Block</Shimmer>);
    expect(getShimmer(container).tagName).toBe("DIV");
  });

  it("preserves children text regardless of element type", () => {
    render(<Shimmer as="span">Streaming</Shimmer>);
    expect(screen.getByText("Streaming")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 3. tone variant
// ---------------------------------------------------------------------------

describe("Shimmer — tone variant", () => {
  it("defaults to tone='muted' (muted-foreground base)", () => {
    const { container } = render(<Shimmer>X</Shimmer>);
    expect(getShimmer(container).className).toContain(
      "[--shimmer-base:var(--muted-foreground)]"
    );
  });

  it("tone='muted' sets the muted-foreground base var", () => {
    const { container } = render(<Shimmer tone="muted">X</Shimmer>);
    expect(getShimmer(container).className).toContain(
      "[--shimmer-base:var(--muted-foreground)]"
    );
  });

  it("tone='brand' sets the brand base var", () => {
    const { container } = render(<Shimmer tone="brand">X</Shimmer>);
    expect(getShimmer(container).className).toContain(
      "[--shimmer-base:var(--brand)]"
    );
  });

  it("tone='foreground' sets the foreground base var", () => {
    const { container } = render(<Shimmer tone="foreground">X</Shimmer>);
    expect(getShimmer(container).className).toContain(
      "[--shimmer-base:var(--foreground)]"
    );
  });
});

// ---------------------------------------------------------------------------
// 4. size variant
// ---------------------------------------------------------------------------

describe("Shimmer — size variant", () => {
  it("defaults to size='default' (text-base)", () => {
    const { container } = render(<Shimmer>X</Shimmer>);
    expect(getShimmer(container).className).toContain("text-base");
  });

  it("size='sm' applies text-sm", () => {
    const { container } = render(<Shimmer size="sm">X</Shimmer>);
    expect(getShimmer(container).className).toContain("text-sm");
  });

  it("size='default' applies text-base", () => {
    const { container } = render(<Shimmer size="default">X</Shimmer>);
    expect(getShimmer(container).className).toContain("text-base");
  });

  it("size='lg' applies text-lg", () => {
    const { container } = render(<Shimmer size="lg">X</Shimmer>);
    expect(getShimmer(container).className).toContain("text-lg");
  });

  it("size='xl' applies text-xl", () => {
    const { container } = render(<Shimmer size="xl">X</Shimmer>);
    expect(getShimmer(container).className).toContain("text-xl");
  });
});

// ---------------------------------------------------------------------------
// 5. Base classes — token-only, transparent text via bg-clip
// ---------------------------------------------------------------------------

describe("Shimmer — base classes", () => {
  it("has bg-clip-text class", () => {
    const { container } = render(<Shimmer>X</Shimmer>);
    expect(getShimmer(container).className).toContain("bg-clip-text");
  });

  it("has text-transparent class (text is the gradient)", () => {
    const { container } = render(<Shimmer>X</Shimmer>);
    expect(getShimmer(container).className).toContain("text-transparent");
  });

  it("has relative + inline-block layout classes", () => {
    const { container } = render(<Shimmer>X</Shimmer>);
    const cls = getShimmer(container).className;
    expect(cls).toContain("relative");
    expect(cls).toContain("inline-block");
  });

  it("uses no font-bold / font-semibold weight (editorial restraint)", () => {
    const { container } = render(<Shimmer>X</Shimmer>);
    const cls = getShimmer(container).className;
    expect(cls).not.toContain("font-bold");
    expect(cls).not.toContain("font-semibold");
  });
});

// ---------------------------------------------------------------------------
// 6. Inline style — gradient built from tokens, transparent (no #0000)
// ---------------------------------------------------------------------------

describe("Shimmer — token-driven inline gradient", () => {
  it("builds the highlight layer from var(--background)", () => {
    const { container } = render(<Shimmer>X</Shimmer>);
    expect(getShimmer(container).style.backgroundImage).toContain(
      "var(--background)"
    );
  });

  it("builds the base text layer from var(--shimmer-base)", () => {
    const { container } = render(<Shimmer>X</Shimmer>);
    expect(getShimmer(container).style.backgroundImage).toContain(
      "var(--shimmer-base)"
    );
  });

  it("uses `transparent` rather than the #0000 hex shorthand", () => {
    const { container } = render(<Shimmer>X</Shimmer>);
    const bg = getShimmer(container).style.backgroundImage;
    expect(bg).toContain("transparent");
    expect(bg).not.toContain("#0000");
  });

  it("sets a non-repeating, padding-box background-repeat", () => {
    const { container } = render(<Shimmer>X</Shimmer>);
    expect(getShimmer(container).style.backgroundRepeat).toContain("no-repeat");
  });

  it("sets a 250% background-size for the sweep", () => {
    const { container } = render(<Shimmer>X</Shimmer>);
    expect(getShimmer(container).style.backgroundSize).toContain("250%");
  });
});

// ---------------------------------------------------------------------------
// 7. spread prop — drives the --shimmer-spread custom property
// ---------------------------------------------------------------------------

describe("Shimmer — spread prop", () => {
  it("defaults spread to 2px-per-char (children.length * 2)", () => {
    const { container } = render(<Shimmer>abcd</Shimmer>); // 4 chars * 2 = 8
    expect(
      getShimmer(container).style.getPropertyValue("--shimmer-spread")
    ).toBe("8px");
  });

  it("scales the spread by the spread prop", () => {
    const { container } = render(<Shimmer spread={5}>abc</Shimmer>); // 3 * 5 = 15
    expect(
      getShimmer(container).style.getPropertyValue("--shimmer-spread")
    ).toBe("15px");
  });

  it("yields 0px spread for an empty string", () => {
    const { container } = render(<Shimmer>{""}</Shimmer>);
    expect(
      getShimmer(container).style.getPropertyValue("--shimmer-spread")
    ).toBe("0px");
  });

  it("recomputes spread when children change", () => {
    const { container, rerender } = render(<Shimmer spread={2}>ab</Shimmer>);
    expect(
      getShimmer(container).style.getPropertyValue("--shimmer-spread")
    ).toBe("4px");
    rerender(<Shimmer spread={2}>abcdef</Shimmer>);
    expect(
      getShimmer(container).style.getPropertyValue("--shimmer-spread")
    ).toBe("12px");
  });

  it("recomputes spread when the spread prop changes", () => {
    const { container, rerender } = render(<Shimmer spread={2}>abc</Shimmer>);
    expect(
      getShimmer(container).style.getPropertyValue("--shimmer-spread")
    ).toBe("6px");
    rerender(<Shimmer spread={4}>abc</Shimmer>);
    expect(
      getShimmer(container).style.getPropertyValue("--shimmer-spread")
    ).toBe("12px");
  });
});

// ---------------------------------------------------------------------------
// 8. duration prop — accepted without crashing
// ---------------------------------------------------------------------------

describe("Shimmer — duration prop", () => {
  it("accepts a custom duration without crashing", () => {
    expect(() =>
      render(<Shimmer duration={5}>Slow shimmer</Shimmer>)
    ).not.toThrow();
  });

  it("renders content with a custom duration", () => {
    render(<Shimmer duration={0.5}>Fast shimmer</Shimmer>);
    expect(screen.getByText("Fast shimmer")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 9. className passthrough
// ---------------------------------------------------------------------------

describe("Shimmer — className passthrough", () => {
  it("merges a custom className", () => {
    const { container } = render(
      <Shimmer className="my-shimmer">X</Shimmer>
    );
    expect(getShimmer(container).className).toContain("my-shimmer");
  });

  it("keeps base classes when a custom className is supplied", () => {
    const { container } = render(
      <Shimmer className="my-shimmer">X</Shimmer>
    );
    const cls = getShimmer(container).className;
    expect(cls).toContain("my-shimmer");
    expect(cls).toContain("bg-clip-text");
    expect(cls).toContain("text-transparent");
  });

  it("updates className on re-render", () => {
    const { container, rerender } = render(
      <Shimmer className="class-a">X</Shimmer>
    );
    expect(getShimmer(container).className).toContain("class-a");
    rerender(<Shimmer className="class-b">X</Shimmer>);
    const cls = getShimmer(container).className;
    expect(cls).toContain("class-b");
    expect(cls).not.toContain("class-a");
  });
});

// ---------------------------------------------------------------------------
// 10. Combined variants
// ---------------------------------------------------------------------------

describe("Shimmer — combined variants", () => {
  it("applies tone and size together", () => {
    const { container } = render(
      <Shimmer tone="brand" size="xl">
        Big brand
      </Shimmer>
    );
    const cls = getShimmer(container).className;
    expect(cls).toContain("[--shimmer-base:var(--brand)]");
    expect(cls).toContain("text-xl");
  });

  it("applies as + tone + size together on a heading", () => {
    const { container } = render(
      <Shimmer as="h2" tone="foreground" size="lg">
        Heading
      </Shimmer>
    );
    const el = getShimmer(container);
    expect(el.tagName).toBe("H2");
    expect(el.className).toContain("[--shimmer-base:var(--foreground)]");
    expect(el.className).toContain("text-lg");
  });
});

// ---------------------------------------------------------------------------
// 11. Re-render behavior
// ---------------------------------------------------------------------------

describe("Shimmer — re-render behavior", () => {
  it("updates children text on re-render", () => {
    const { rerender } = render(<Shimmer>original</Shimmer>);
    expect(screen.getByText("original")).toBeInTheDocument();
    rerender(<Shimmer>updated</Shimmer>);
    expect(screen.getByText("updated")).toBeInTheDocument();
    expect(screen.queryByText("original")).not.toBeInTheDocument();
  });

  it("updates the element type on re-render", () => {
    const { container, rerender } = render(<Shimmer as="p">X</Shimmer>);
    expect(getShimmer(container).tagName).toBe("P");
    rerender(<Shimmer as="span">X</Shimmer>);
    expect(getShimmer(container).tagName).toBe("SPAN");
  });
});

// ---------------------------------------------------------------------------
// 12. Accessibility — axe
// ---------------------------------------------------------------------------

describe("Shimmer — accessibility (axe)", () => {
  it("default shimmer has no axe violations", async () => {
    const { container } = render(
      <main>
        <Shimmer>Generating response</Shimmer>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("heading shimmer has no axe violations", async () => {
    const { container } = render(
      <main>
        <Shimmer as="h2" tone="brand" size="xl">
          Thinking through the plan
        </Shimmer>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("inline status-line shimmer has no axe violations", async () => {
    const { container } = render(
      <main>
        <span>
          <Shimmer as="span" size="sm" tone="foreground">
            Streaming tokens
          </Shimmer>
        </span>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
