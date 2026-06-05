/**
 * Tests for <LiveBadge /> (components/ui/live-badge.tsx) — a "LIVE" indicator
 * pill. Covers default render, custom children, the pulse dot toggle, the
 * optional compact-formatted viewer count, className passthrough, and a11y.
 */

import { render, screen } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import { axe } from "vitest-axe";
import { LiveBadge } from "@/components/ui/live-badge";

function getRoot(container: HTMLElement) {
  return container.querySelector('[data-slot="live-badge"]') as HTMLElement;
}

// ─── Smoke / default render ──────────────────────────────────────────────────

describe("LiveBadge – default render", () => {
  it("renders without crashing", () => {
    const { container } = render(<LiveBadge />);
    expect(getRoot(container)).toBeInTheDocument();
  });

  it("root carries data-slot=live-badge", () => {
    const { container } = render(<LiveBadge />);
    expect(getRoot(container)).not.toBeNull();
  });

  it("defaults the label to LIVE", () => {
    render(<LiveBadge />);
    expect(screen.getByText("LIVE")).toBeInTheDocument();
  });

  it("renders a span as the root element", () => {
    const { container } = render(<LiveBadge />);
    expect(getRoot(container).tagName).toBe("SPAN");
  });

  it("root has the destructive token classes (live/attention red)", () => {
    const { container } = render(<LiveBadge />);
    const cls = getRoot(container).className;
    expect(cls).toContain("bg-destructive");
    expect(cls).toContain("text-destructive-foreground");
  });

  it("root is a rounded-full font-mono pill", () => {
    const { container } = render(<LiveBadge />);
    const cls = getRoot(container).className;
    expect(cls).toContain("rounded-full");
    expect(cls).toContain("font-mono");
    expect(cls).toContain("uppercase");
  });

  it("root exposes an aria-label conveying live status", () => {
    const { container } = render(<LiveBadge />);
    expect(getRoot(container).getAttribute("aria-label")).toBe("Live");
  });
});

// ─── Custom children ─────────────────────────────────────────────────────────

describe("LiveBadge – custom children", () => {
  it("renders custom text children", () => {
    render(<LiveBadge>On air</LiveBadge>);
    expect(screen.getByText("On air")).toBeInTheDocument();
  });

  it("does not render the default LIVE when children provided", () => {
    render(<LiveBadge>Replay</LiveBadge>);
    expect(screen.queryByText("LIVE")).toBeNull();
    expect(screen.getByText("Replay")).toBeInTheDocument();
  });

  it("renders element children", () => {
    render(
      <LiveBadge>
        <span data-testid="custom-child">Broadcasting</span>
      </LiveBadge>
    );
    expect(screen.getByTestId("custom-child")).toBeInTheDocument();
  });
});

// ─── Pulse dot ───────────────────────────────────────────────────────────────

describe("LiveBadge – pulse dot", () => {
  it("renders the pulse dot by default", () => {
    const { container } = render(<LiveBadge />);
    const dot = container.querySelector('[data-slot="live-badge-dot"]');
    expect(dot).not.toBeNull();
  });

  it("pulse dot has animate-pulse + bg-current", () => {
    const { container } = render(<LiveBadge />);
    const dot = container.querySelector(
      '[data-slot="live-badge-dot"]'
    ) as HTMLElement;
    expect(dot.className).toContain("animate-pulse");
    expect(dot.className).toContain("bg-current");
    expect(dot.className).toContain("rounded-full");
  });

  it("pulse dot is aria-hidden", () => {
    const { container } = render(<LiveBadge />);
    const dot = container.querySelector(
      '[data-slot="live-badge-dot"]'
    ) as HTMLElement;
    expect(dot.getAttribute("aria-hidden")).toBe("true");
  });

  it("omits the pulse dot when pulse={false}", () => {
    const { container } = render(<LiveBadge pulse={false} />);
    expect(container.querySelector('[data-slot="live-badge-dot"]')).toBeNull();
  });

  it("renders the pulse dot when pulse={true} explicitly", () => {
    const { container } = render(<LiveBadge pulse={true} />);
    expect(
      container.querySelector('[data-slot="live-badge-dot"]')
    ).not.toBeNull();
  });

  it("toggles the dot across re-renders", () => {
    const { container, rerender } = render(<LiveBadge pulse={false} />);
    expect(container.querySelector('[data-slot="live-badge-dot"]')).toBeNull();
    rerender(<LiveBadge pulse={true} />);
    expect(
      container.querySelector('[data-slot="live-badge-dot"]')
    ).not.toBeNull();
  });
});

// ─── Count ───────────────────────────────────────────────────────────────────

describe("LiveBadge – count", () => {
  it("omits the count slot when count is undefined", () => {
    const { container } = render(<LiveBadge />);
    expect(container.querySelector('[data-slot="live-badge-count"]')).toBeNull();
  });

  it("renders the count slot when count is provided", () => {
    const { container } = render(<LiveBadge count={1234} />);
    expect(
      container.querySelector('[data-slot="live-badge-count"]')
    ).not.toBeNull();
  });

  it("compact-formats the count (1234 → 1.2K watching)", () => {
    render(<LiveBadge count={1234} />);
    expect(screen.getByText(/1\.2K watching/)).toBeInTheDocument();
  });

  it("compact-formats large counts (1500000 → 1.5M watching)", () => {
    render(<LiveBadge count={1500000} />);
    expect(screen.getByText(/1\.5M watching/)).toBeInTheDocument();
  });

  it("renders small counts without a compact suffix", () => {
    render(<LiveBadge count={42} />);
    expect(screen.getByText(/42 watching/)).toBeInTheDocument();
  });

  it("renders zero count (boundary, distinct from undefined)", () => {
    const { container } = render(<LiveBadge count={0} />);
    expect(
      container.querySelector('[data-slot="live-badge-count"]')
    ).not.toBeNull();
    expect(screen.getByText(/0 watching/)).toBeInTheDocument();
  });

  it("count slot uses font-mono tabular-nums", () => {
    const { container } = render(<LiveBadge count={1234} />);
    const countEl = container.querySelector(
      '[data-slot="live-badge-count"]'
    ) as HTMLElement;
    expect(countEl.className).toContain("font-mono");
    expect(countEl.className).toContain("tabular-nums");
  });

  it("count is reflected in the root aria-label", () => {
    const { container } = render(<LiveBadge count={1234} />);
    expect(getRoot(container).getAttribute("aria-label")).toContain("watching");
  });

  it("renders both pulse dot and count together", () => {
    const { container } = render(<LiveBadge count={9000} />);
    expect(
      container.querySelector('[data-slot="live-badge-dot"]')
    ).not.toBeNull();
    expect(
      container.querySelector('[data-slot="live-badge-count"]')
    ).not.toBeNull();
  });
});

// ─── className passthrough ───────────────────────────────────────────────────

describe("LiveBadge – className", () => {
  it("merges a custom className onto the root", () => {
    const { container } = render(<LiveBadge className="my-custom-class" />);
    expect(getRoot(container).className).toContain("my-custom-class");
  });

  it("custom className does not clobber base token classes", () => {
    const { container } = render(<LiveBadge className="extra" />);
    const cls = getRoot(container).className;
    expect(cls).toContain("extra");
    expect(cls).toContain("bg-destructive");
  });

  it("renders without error when className is an empty string", () => {
    const { container } = render(<LiveBadge className="" />);
    expect(getRoot(container)).toBeInTheDocument();
  });
});

// ─── Native prop passthrough ─────────────────────────────────────────────────

describe("LiveBadge – native props", () => {
  it("forwards arbitrary span props (id)", () => {
    const { container } = render(<LiveBadge id="stream-status" />);
    expect(getRoot(container).id).toBe("stream-status");
  });

  it("forwards data-* attributes", () => {
    const { container } = render(<LiveBadge data-testid="lb" />);
    expect(getRoot(container).getAttribute("data-testid")).toBe("lb");
  });
});

// ─── Accessibility ───────────────────────────────────────────────────────────

describe("LiveBadge – accessibility", () => {
  it("has no axe violations with default props", async () => {
    const { container } = render(<LiveBadge />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with a count", async () => {
    const { container } = render(<LiveBadge count={1234} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with pulse disabled and custom children", async () => {
    const { container } = render(<LiveBadge pulse={false}>Replay</LiveBadge>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
