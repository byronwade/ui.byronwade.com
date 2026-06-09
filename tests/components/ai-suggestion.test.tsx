/**
 * Exhaustive tests for the ai-suggestion compound component
 *
 * Component source: components/ai-elements/suggestion.tsx
 *
 * Exports:
 *   Suggestions – horizontal scroll container, data-slot="suggestions"
 *                 (inner track data-slot="suggestions-track")
 *   Suggestion  – clickable pill button, data-slot="suggestion"
 *                 props: suggestion (string), onClick(suggestion), variant, size
 */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";

import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";

// ---------------------------------------------------------------------------
// 1. Renders without crashing
// ---------------------------------------------------------------------------

describe("Suggestions — renders without crashing", () => {
  it("renders an empty Suggestions container", () => {
    const { container } = render(<Suggestions />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders Suggestions with children", () => {
    render(
      <Suggestions>
        <Suggestion suggestion="Hello" />
      </Suggestions>
    );
    expect(screen.getByRole("button", { name: "Hello" })).toBeInTheDocument();
  });

  it("renders a bare Suggestion without crashing", () => {
    expect(() => render(<Suggestion suggestion="Solo" />)).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// 2. data-slot attributes
// ---------------------------------------------------------------------------

describe("data-slot attributes", () => {
  it("Suggestions root has data-slot='suggestions'", () => {
    const { container } = render(<Suggestions />);
    expect(
      container.querySelector("[data-slot='suggestions']")
    ).toBeInTheDocument();
  });

  it("Suggestions inner track has data-slot='suggestions-track'", () => {
    const { container } = render(
      <Suggestions>
        <Suggestion suggestion="x" />
      </Suggestions>
    );
    expect(
      container.querySelector("[data-slot='suggestions-track']")
    ).toBeInTheDocument();
  });

  it("Suggestion button has data-slot='suggestion'", () => {
    const { container } = render(<Suggestion suggestion="x" />);
    expect(
      container.querySelector("[data-slot='suggestion']")
    ).toBeInTheDocument();
  });

  it("Suggestion is rendered as a <button> element", () => {
    render(<Suggestion suggestion="Press me" />);
    expect(screen.getByRole("button", { name: "Press me" }).tagName).toBe(
      "BUTTON"
    );
  });
});

// ---------------------------------------------------------------------------
// 3. Suggestions container classes
// ---------------------------------------------------------------------------

describe("Suggestions — base classes", () => {
  it("root is horizontally scrollable (overflow-x-auto)", () => {
    const { container } = render(<Suggestions />);
    const root = container.querySelector(
      "[data-slot='suggestions']"
    ) as HTMLElement;
    expect(root.className).toContain("overflow-x-auto");
  });

  it("root has w-full and whitespace-nowrap", () => {
    const { container } = render(<Suggestions />);
    const root = container.querySelector(
      "[data-slot='suggestions']"
    ) as HTMLElement;
    expect(root.className).toContain("w-full");
    expect(root.className).toContain("whitespace-nowrap");
  });

  it("root hides the scrollbar slot", () => {
    const { container } = render(<Suggestions />);
    const root = container.querySelector(
      "[data-slot='suggestions']"
    ) as HTMLElement;
    expect(root.className).toContain(
      "[&_[data-slot=scroll-area-scrollbar]]:hidden"
    );
  });

  it("inner track lays out children in a horizontal flex row with gap", () => {
    const { container } = render(
      <Suggestions>
        <Suggestion suggestion="a" />
      </Suggestions>
    );
    const track = container.querySelector(
      "[data-slot='suggestions-track']"
    ) as HTMLElement;
    expect(track.className).toContain("flex");
    expect(track.className).toContain("w-max");
    expect(track.className).toContain("flex-nowrap");
    expect(track.className).toContain("items-center");
    expect(track.className).toContain("gap-2");
  });
});

// ---------------------------------------------------------------------------
// 4. className forwarding
// ---------------------------------------------------------------------------

describe("className forwarding", () => {
  it("Suggestions forwards className onto the inner track and keeps base classes", () => {
    const { container } = render(<Suggestions className="custom-track" />);
    const track = container.querySelector(
      "[data-slot='suggestions-track']"
    ) as HTMLElement;
    expect(track.className).toContain("custom-track");
    expect(track.className).toContain("flex");
  });

  it("Suggestion forwards className and keeps base classes", () => {
    const { container } = render(
      <Suggestion className="custom-pill" suggestion="x" />
    );
    const btn = container.querySelector(
      "[data-slot='suggestion']"
    ) as HTMLElement;
    expect(btn.className).toContain("custom-pill");
    expect(btn.className).toContain("rounded-full");
    expect(btn.className).toContain("px-4");
    expect(btn.className).toContain("cursor-pointer");
  });
});

// ---------------------------------------------------------------------------
// 5. Suggestion content — suggestion prop vs children
// ---------------------------------------------------------------------------

describe("Suggestion — content resolution", () => {
  it("renders the suggestion string as label when no children", () => {
    render(<Suggestion suggestion="Summarize" />);
    expect(
      screen.getByRole("button", { name: "Summarize" })
    ).toBeInTheDocument();
  });

  it("renders children when provided, overriding the suggestion string", () => {
    render(<Suggestion suggestion="raw-value">Pretty label</Suggestion>);
    expect(
      screen.getByRole("button", { name: "Pretty label" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "raw-value" })
    ).not.toBeInTheDocument();
  });

  it("falls back to suggestion when children is an empty string", () => {
    render(<Suggestion suggestion="fallback">{""}</Suggestion>);
    expect(
      screen.getByRole("button", { name: "fallback" })
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 6. variant prop
// ---------------------------------------------------------------------------

describe("Suggestion — variant prop", () => {
  it("defaults to the outline variant", () => {
    const { container } = render(<Suggestion suggestion="x" />);
    const btn = container.querySelector(
      "[data-slot='suggestion']"
    ) as HTMLElement;
    // outline variant uses bordered background tokens
    expect(btn.className).toContain("border-border");
  });

  it("renders the default (primary) variant", () => {
    const { container } = render(
      <Suggestion suggestion="x" variant="default" />
    );
    const btn = container.querySelector(
      "[data-slot='suggestion']"
    ) as HTMLElement;
    expect(btn.className).toContain("bg-primary");
  });

  it("renders the secondary variant", () => {
    const { container } = render(
      <Suggestion suggestion="x" variant="secondary" />
    );
    const btn = container.querySelector(
      "[data-slot='suggestion']"
    ) as HTMLElement;
    expect(btn.className).toContain("bg-secondary");
  });

  it("renders the ghost variant", () => {
    const { container } = render(<Suggestion suggestion="x" variant="ghost" />);
    const btn = container.querySelector(
      "[data-slot='suggestion']"
    ) as HTMLElement;
    expect(btn.className).toContain("hover:bg-muted");
  });

  it("renders the destructive variant", () => {
    const { container } = render(
      <Suggestion suggestion="x" variant="destructive" />
    );
    const btn = container.querySelector(
      "[data-slot='suggestion']"
    ) as HTMLElement;
    expect(btn.className).toContain("text-destructive");
  });

  it("renders the link variant", () => {
    const { container } = render(<Suggestion suggestion="x" variant="link" />);
    const btn = container.querySelector(
      "[data-slot='suggestion']"
    ) as HTMLElement;
    expect(btn.className).toContain("text-primary");
  });
});

// ---------------------------------------------------------------------------
// 7. size prop
// ---------------------------------------------------------------------------

describe("Suggestion — size prop", () => {
  it("defaults to the sm size", () => {
    const { container } = render(<Suggestion suggestion="x" />);
    const btn = container.querySelector(
      "[data-slot='suggestion']"
    ) as HTMLElement;
    expect(btn.className).toContain("h-8");
  });

  it("renders the default size", () => {
    const { container } = render(<Suggestion suggestion="x" size="default" />);
    const btn = container.querySelector(
      "[data-slot='suggestion']"
    ) as HTMLElement;
    expect(btn.className).toContain("h-8");
  });

  it("renders the lg size", () => {
    const { container } = render(<Suggestion suggestion="x" size="lg" />);
    const btn = container.querySelector(
      "[data-slot='suggestion']"
    ) as HTMLElement;
    expect(btn.className).toContain("h-9");
  });

  it("renders the xs size", () => {
    const { container } = render(<Suggestion suggestion="x" size="xs" />);
    const btn = container.querySelector(
      "[data-slot='suggestion']"
    ) as HTMLElement;
    expect(btn.className).toContain("h-6");
  });
});

// ---------------------------------------------------------------------------
// 8. Interactions
// ---------------------------------------------------------------------------

describe("Suggestion — interactions", () => {
  it("calls onClick with the suggestion string when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Suggestion onClick={onClick} suggestion="Draft a reply" />);
    await user.click(screen.getByRole("button", { name: "Draft a reply" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith("Draft a reply");
  });

  it("does not throw when clicked without an onClick handler", async () => {
    const user = userEvent.setup();
    render(<Suggestion suggestion="No handler" />);
    await user.click(screen.getByRole("button", { name: "No handler" }));
    expect(
      screen.getByRole("button", { name: "No handler" })
    ).toBeInTheDocument();
  });

  it("is keyboard-activatable (Enter triggers onClick)", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Suggestion onClick={onClick} suggestion="Keyboard" />);
    const btn = screen.getByRole("button", { name: "Keyboard" });
    btn.focus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledWith("Keyboard");
  });

  it("does not fire onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Suggestion disabled onClick={onClick} suggestion="Off" />);
    await user.click(screen.getByRole("button", { name: "Off" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("passes the same suggestion string regardless of custom children", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Suggestion onClick={onClick} suggestion="raw-id">
        Friendly Label
      </Suggestion>
    );
    await user.click(screen.getByRole("button", { name: "Friendly Label" }));
    expect(onClick).toHaveBeenCalledWith("raw-id");
  });
});

// ---------------------------------------------------------------------------
// 9. HTML attribute forwarding
// ---------------------------------------------------------------------------

describe("HTML attribute forwarding", () => {
  it("Suggestion forwards arbitrary props (id, aria-label)", () => {
    render(
      <Suggestion aria-label="Custom label" id="s1" suggestion="x" />
    );
    const btn = screen.getByRole("button", { name: "Custom label" });
    expect(btn).toHaveAttribute("id", "s1");
  });

  it("Suggestion uses type='button'", () => {
    const { container } = render(<Suggestion suggestion="x" />);
    const btn = container.querySelector(
      "[data-slot='suggestion']"
    ) as HTMLElement;
    expect(btn).toHaveAttribute("type", "button");
  });

  it("Suggestions forwards arbitrary props onto the root", () => {
    const { container } = render(<Suggestions id="suggs" />);
    const root = container.querySelector("[data-slot='suggestions']");
    expect(root).toHaveAttribute("id", "suggs");
  });
});

// ---------------------------------------------------------------------------
// 10. Composition
// ---------------------------------------------------------------------------

describe("Composition", () => {
  it("renders a list of suggestions inside the track", () => {
    const prompts = ["One", "Two", "Three"];
    const { container } = render(
      <Suggestions>
        {prompts.map((p) => (
          <Suggestion key={p} suggestion={p} />
        ))}
      </Suggestions>
    );
    const track = container.querySelector(
      "[data-slot='suggestions-track']"
    ) as HTMLElement;
    for (const p of prompts) {
      expect(within(track).getByRole("button", { name: p })).toBeInTheDocument();
    }
  });

  it("each suggestion fires its own value", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Suggestions>
        <Suggestion onClick={onClick} suggestion="alpha" />
        <Suggestion onClick={onClick} suggestion="beta" />
      </Suggestions>
    );
    await user.click(screen.getByRole("button", { name: "beta" }));
    expect(onClick).toHaveBeenCalledWith("beta");
  });
});

// ---------------------------------------------------------------------------
// 11. Accessibility — axe
// ---------------------------------------------------------------------------

describe("accessibility (axe)", () => {
  it("a Suggestions list has no axe violations", async () => {
    const { container } = render(
      <main>
        <Suggestions>
          <Suggestion suggestion="Summarize this thread" />
          <Suggestion suggestion="Draft a reply" />
          <Suggestion suggestion="Explain the diff" />
        </Suggestions>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("a single Suggestion has no axe violations", async () => {
    const { container } = render(
      <main>
        <Suggestion suggestion="Write tests" />
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("a disabled Suggestion has no axe violations", async () => {
    const { container } = render(
      <main>
        <Suggestion disabled suggestion="Unavailable" />
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
