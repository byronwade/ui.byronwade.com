/**
 * Exhaustive tests for ActivityRing.
 *
 * Component: @/components/ui/activity-ring
 * Exports:   ActivityRing (component), RingSegment (type)
 *
 * jsdom notes:
 *   - window.matchMedia is NOT polyfilled (see tests/setup.ts) — stub it per
 *     test, mirroring tests/components/morph-dock.test.tsx.
 *   - Under prefers-reduced-motion the draw-in is skipped, so segments render at
 *     full length on first synchronous render — geometry is assertable without
 *     flushing requestAnimationFrame.
 *   - SVG camelCase props serialize to kebab-case attrs (stroke-dasharray, etc.).
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, describe, it, vi, beforeEach } from "vitest";
import { axe } from "vitest-axe";
import { ActivityRing, scoreTone, type RingSegment } from "@/components/ui/activity-ring";

// ---------------------------------------------------------------------------
// matchMedia stub (mirrors morph-dock.test.tsx)
// ---------------------------------------------------------------------------

function stubMatchMedia({ reduce = false }: { reduce?: boolean } = {}) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("prefers-reduced-motion") ? reduce : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

beforeEach(() => {
  // Default to reduced motion so segments are full-length synchronously.
  stubMatchMedia({ reduce: true });
});

const SEGMENTS: RingSegment[] = [
  { value: 120, label: "Inbound" },
  { value: 80, label: "Outbound" },
];

function segmentCircles(container: HTMLElement): Element[] {
  return Array.from(container.querySelectorAll('[data-slot="activity-ring-segment"]'));
}
function cls(el: Element): string {
  return el.getAttribute("class") ?? "";
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe("ActivityRing – rendering", () => {
  it("renders the root wrapper with data-slot", () => {
    const { container } = render(<ActivityRing segments={SEGMENTS} />);
    expect(container.querySelector('[data-slot="activity-ring"]')).toBeInTheDocument();
  });

  it("renders an SVG with a track circle", () => {
    const { container } = render(<ActivityRing segments={SEGMENTS} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.querySelector('[data-slot="activity-ring-track"]')).toHaveClass("stroke-muted");
  });

  it("renders one segment circle per segment", () => {
    const { container } = render(<ActivityRing segments={SEGMENTS} />);
    expect(segmentCircles(container)).toHaveLength(2);
  });

  it("renders three segments when given three", () => {
    const three: RingSegment[] = [
      { value: 1, label: "A" },
      { value: 1, label: "B" },
      { value: 1, label: "C" },
    ];
    const { container } = render(<ActivityRing segments={three} />);
    expect(segmentCircles(container)).toHaveLength(3);
  });

  it("shows the total in the centre by default", () => {
    render(<ActivityRing segments={SEGMENTS} centerLabel="interactions" />);
    expect(screen.getByText("200")).toBeInTheDocument();
    expect(screen.getByText("interactions")).toBeInTheDocument();
  });

  it("defaults centerLabel to 'total'", () => {
    render(<ActivityRing segments={SEGMENTS} />);
    expect(screen.getByText("total")).toBeInTheDocument();
  });

  it("applies custom className to the root", () => {
    const { container } = render(<ActivityRing segments={SEGMENTS} className="my-ring" />);
    expect(container.querySelector('[data-slot="activity-ring"]')).toHaveClass("my-ring");
  });

  it("applies size to the ring box", () => {
    const { container } = render(<ActivityRing segments={SEGMENTS} size={200} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "200");
    expect(svg).toHaveAttribute("height", "200");
  });
});

// ---------------------------------------------------------------------------
// Tone mapping
// ---------------------------------------------------------------------------

describe("ActivityRing – tone mapping", () => {
  it("cycles default tones: segment 0 = stroke-brand, segment 1 = stroke-muted-foreground/40", () => {
    const { container } = render(<ActivityRing segments={SEGMENTS} />);
    const [a, b] = segmentCircles(container);
    expect(cls(a)).toContain("stroke-brand");
    expect(cls(b)).toContain("stroke-muted-foreground/40");
  });

  it("honours explicit tones", () => {
    const segs: RingSegment[] = [
      { value: 1, label: "Up", tone: "success" },
      { value: 1, label: "Down", tone: "danger" },
    ];
    const { container } = render(<ActivityRing segments={segs} />);
    const [a, b] = segmentCircles(container);
    expect(cls(a)).toContain("stroke-success");
    expect(cls(b)).toContain("stroke-destructive");
  });

  it("wraps the tone cycle past 5 segments", () => {
    const segs: RingSegment[] = Array.from({ length: 6 }, (_, i) => ({ value: 1, label: `S${i}` }));
    const { container } = render(<ActivityRing segments={segs} />);
    const circles = segmentCircles(container);
    // index 5 wraps back to toneCycle[0] = info = stroke-brand
    expect(cls(circles[5])).toContain("stroke-brand");
  });
});

// ---------------------------------------------------------------------------
// Geometry (reduced motion → full-length synchronously)
// ---------------------------------------------------------------------------

describe("ActivityRing – geometry", () => {
  const size = 168;
  const thickness = 12;
  const gap = 18;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  it("segment visible length = share*circumference - gap", () => {
    const { container } = render(
      <ActivityRing segments={SEGMENTS} size={size} thickness={thickness} gap={gap} />
    );
    const [a] = segmentCircles(container);
    const share = 120 / 200;
    const expected = circumference * share - gap;
    const dasharray = a.getAttribute("stroke-dasharray") ?? "";
    const visible = Number(dasharray.split(" ")[0]);
    expect(visible).toBeCloseTo(expected, 2);
  });

  it("first segment offset = -(gap/2)", () => {
    const { container } = render(
      <ActivityRing segments={SEGMENTS} size={size} thickness={thickness} gap={gap} />
    );
    const [a] = segmentCircles(container);
    expect(Number(a.getAttribute("stroke-dashoffset"))).toBeCloseTo(-(gap / 2), 2);
  });

  it("second segment offset accounts for the first segment length", () => {
    const { container } = render(
      <ActivityRing segments={SEGMENTS} size={size} thickness={thickness} gap={gap} />
    );
    const [, b] = segmentCircles(container);
    const firstShare = 120 / 200;
    const expected = -(circumference * firstShare + gap / 2);
    expect(Number(b.getAttribute("stroke-dashoffset"))).toBeCloseTo(expected, 2);
  });

  it("default thickness drives stroke-width 12 on the track", () => {
    const { container } = render(<ActivityRing segments={SEGMENTS} />);
    expect(container.querySelector('[data-slot="activity-ring-track"]')).toHaveAttribute(
      "stroke-width",
      "12"
    );
  });
});

// ---------------------------------------------------------------------------
// Quiet state (total === 0)
// ---------------------------------------------------------------------------

describe("ActivityRing – quiet state", () => {
  const QUIET: RingSegment[] = [
    { value: 0, label: "Inbound" },
    { value: 0, label: "Outbound" },
  ];

  it("renders no segment circles when total is 0", () => {
    const { container } = render(<ActivityRing segments={QUIET} />);
    expect(segmentCircles(container)).toHaveLength(0);
  });

  it("still renders the track when total is 0", () => {
    const { container } = render(<ActivityRing segments={QUIET} />);
    expect(container.querySelector('[data-slot="activity-ring-track"]')).toBeInTheDocument();
  });

  it("centre shows 0 total", () => {
    render(<ActivityRing segments={QUIET} centerLabel="calls" />);
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("calls")).toBeInTheDocument();
  });

  it("legend chips are disabled when total is 0", () => {
    render(<ActivityRing segments={QUIET} />);
    const chips = screen.getAllByRole("button");
    chips.forEach((c) => expect(c).toBeDisabled());
  });

  it("disabled legend chip click does not change the centre", () => {
    render(<ActivityRing segments={QUIET} centerLabel="calls" />);
    fireEvent.click(screen.getByRole("button", { name: /Inbound/ }));
    // still showing the idle total label
    expect(screen.getByText("calls")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Hover / pin emphasis + tooltip
// ---------------------------------------------------------------------------

describe("ActivityRing – hover/pin + tooltip", () => {
  it("hovering a segment shows the tooltip and swaps the centre figure", () => {
    const { container } = render(<ActivityRing segments={SEGMENTS} />);
    const [a] = segmentCircles(container);
    fireEvent.mouseEnter(a);
    // tooltip appears
    const tooltip = container.querySelector('[data-slot="activity-ring-tooltip"]');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent("Inbound");
    expect(tooltip).toHaveTextContent("60%"); // 120/200
    // centre swaps to the active segment value
    expect(screen.getByText("120")).toBeInTheDocument();
  });

  it("mouseLeave clears the tooltip", () => {
    const { container } = render(<ActivityRing segments={SEGMENTS} />);
    const [a] = segmentCircles(container);
    fireEvent.mouseEnter(a);
    expect(container.querySelector('[data-slot="activity-ring-tooltip"]')).toBeInTheDocument();
    fireEvent.mouseLeave(a);
    expect(container.querySelector('[data-slot="activity-ring-tooltip"]')).not.toBeInTheDocument();
  });

  it("active segment gets a thicker stroke; the other dims", () => {
    const { container } = render(<ActivityRing segments={SEGMENTS} thickness={12} />);
    const [a, b] = segmentCircles(container);
    fireEvent.mouseEnter(a);
    expect(a).toHaveAttribute("stroke-width", "15"); // thickness + 3
    expect(b).toHaveAttribute("stroke-width", "12");
    // React renders SVG `opacity` as an attribute, not style.opacity
    expect(Number(b.getAttribute("opacity"))).toBeCloseTo(0.4, 5);
  });

  it("clicking a legend chip pins emphasis (aria-pressed) and swaps centre", () => {
    render(<ActivityRing segments={SEGMENTS} />);
    const chip = screen.getByRole("button", { name: /Outbound/ });
    fireEvent.click(chip);
    expect(chip).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("80")).toBeInTheDocument();
  });

  it("clicking a pinned legend chip again unpins it", () => {
    render(<ActivityRing segments={SEGMENTS} centerLabel="total" />);
    const chip = screen.getByRole("button", { name: /Outbound/ });
    fireEvent.click(chip);
    expect(chip).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(chip);
    expect(chip).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("total")).toBeInTheDocument();
  });

  it("legend chip focus/blur drives hover emphasis", () => {
    render(<ActivityRing segments={SEGMENTS} />);
    const chip = screen.getByRole("button", { name: /Inbound/ });
    fireEvent.focus(chip);
    expect(screen.getByText("120")).toBeInTheDocument(); // centre follows
    fireEvent.blur(chip);
    expect(screen.getByText("200")).toBeInTheDocument(); // back to total
  });
});

// ---------------------------------------------------------------------------
// Click behavior: callback vs pin
// ---------------------------------------------------------------------------

describe("ActivityRing – segment click", () => {
  it("calls onSegmentClick with the segment and index", () => {
    const onSegmentClick = vi.fn();
    const { container } = render(
      <ActivityRing segments={SEGMENTS} onSegmentClick={onSegmentClick} />
    );
    const [a] = segmentCircles(container);
    fireEvent.click(a);
    expect(onSegmentClick).toHaveBeenCalledWith(SEGMENTS[0], 0);
  });

  it("without onSegmentClick, clicking a segment pins emphasis", () => {
    const { container } = render(<ActivityRing segments={SEGMENTS} />);
    const [, b] = segmentCircles(container);
    fireEvent.click(b);
    // legend chip for that segment is now pinned
    expect(screen.getByRole("button", { name: /Outbound/ })).toHaveAttribute("aria-pressed", "true");
  });
});

// ---------------------------------------------------------------------------
// formatValue
// ---------------------------------------------------------------------------

describe("ActivityRing – formatValue", () => {
  it("default formatter uses toLocaleString (thousands separator)", () => {
    const big: RingSegment[] = [
      { value: 1200, label: "A" },
      { value: 800, label: "B" },
    ];
    render(<ActivityRing segments={big} />);
    expect(screen.getByText("2,000")).toBeInTheDocument();
  });

  it("custom formatter is applied to the centre", () => {
    render(<ActivityRing segments={SEGMENTS} formatValue={(n) => `$${n}`} />);
    expect(screen.getByText("$200")).toBeInTheDocument();
  });

  it("custom formatter is applied in the tooltip", () => {
    const { container } = render(
      <ActivityRing segments={SEGMENTS} formatValue={(n) => `${n} pcs`} />
    );
    fireEvent.mouseEnter(segmentCircles(container)[0]);
    expect(container.querySelector('[data-slot="activity-ring-tooltip"]')).toHaveTextContent(
      "120 pcs"
    );
  });
});

// ---------------------------------------------------------------------------
// Animation branch (reduce: false) + cleanup
// ---------------------------------------------------------------------------

describe("ActivityRing – draw-in animation", () => {
  it("animated branch: segments start collapsed then draw in via rAF", async () => {
    stubMatchMedia({ reduce: false });
    const { container } = render(<ActivityRing segments={SEGMENTS} />);
    const [a] = segmentCircles(container);
    // On first render (drawn=false, reduced=false) the visible length is 0.
    const initial = Number((a.getAttribute("stroke-dasharray") ?? "").split(" ")[0]);
    expect(initial).toBe(0);
    // After the rAF fires, it expands to its share length.
    await waitFor(() => {
      const after = Number((a.getAttribute("stroke-dasharray") ?? "").split(" ")[0]);
      expect(after).toBeGreaterThan(0);
    });
  });

  it("animated branch attaches the multi-property transition to segments", () => {
    stubMatchMedia({ reduce: false });
    const { container } = render(<ActivityRing segments={SEGMENTS} />);
    const [a] = segmentCircles(container) as unknown as SVGElement[];
    expect(a.style.transition).toContain("stroke-dasharray");
  });

  it("unmounts cleanly (cancels rAF + removes matchMedia listener)", () => {
    const { unmount } = render(<ActivityRing segments={SEGMENTS} />);
    expect(() => unmount()).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// Accessibility
// ---------------------------------------------------------------------------

describe("ActivityRing – accessibility", () => {
  it("legend entries are real buttons with aria-pressed", () => {
    render(<ActivityRing segments={SEGMENTS} />);
    const chips = screen.getAllByRole("button");
    expect(chips).toHaveLength(2);
    chips.forEach((c) => expect(c).toHaveAttribute("aria-pressed"));
  });

  it("decorative SVG is aria-hidden", () => {
    const { container } = render(<ActivityRing segments={SEGMENTS} />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden");
  });

  it("has no axe violations – default", async () => {
    const { container } = render(
      <div role="region" aria-label="Activity">
        <ActivityRing segments={SEGMENTS} />
      </div>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations – quiet state", async () => {
    const { container } = render(
      <div role="region" aria-label="Activity">
        <ActivityRing
          segments={[
            { value: 0, label: "Inbound" },
            { value: 0, label: "Outbound" },
          ]}
        />
      </div>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations – pinned/active state", async () => {
    const { container } = render(
      <div role="region" aria-label="Activity">
        <ActivityRing segments={SEGMENTS} />
      </div>
    );
    fireEvent.click(screen.getByRole("button", { name: /Inbound/ }));
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// Verdict + caption + active-index guard
// ---------------------------------------------------------------------------

describe("ActivityRing – verdict + caption", () => {
  it("does not render the summary block by default", () => {
    const { container } = render(<ActivityRing segments={SEGMENTS} />);
    expect(container.querySelector('[data-slot="activity-ring-summary"]')).not.toBeInTheDocument();
  });

  it("renders 'Mostly {label}' when one segment dominates (≥60%)", () => {
    // 120/200 = 60% → Mostly Inbound
    render(<ActivityRing segments={SEGMENTS} verdict />);
    expect(screen.getByText("Mostly Inbound")).toBeInTheDocument();
  });

  it("derives the dominant label even when it is not the first segment", () => {
    const segs: RingSegment[] = [
      { value: 80, label: "A" },
      { value: 120, label: "B" },
    ];
    render(<ActivityRing segments={segs} verdict />);
    expect(screen.getByText("Mostly B")).toBeInTheDocument();
  });

  it("renders 'Balanced' when no segment reaches 60%", () => {
    const segs: RingSegment[] = [
      { value: 100, label: "A" },
      { value: 100, label: "B" },
    ];
    render(<ActivityRing segments={segs} verdict />);
    expect(screen.getByText("Balanced")).toBeInTheDocument();
  });

  it("renders 'Quiet' when total is 0", () => {
    const segs: RingSegment[] = [
      { value: 0, label: "A" },
      { value: 0, label: "B" },
    ];
    render(<ActivityRing segments={segs} verdict />);
    expect(screen.getByText("Quiet")).toBeInTheDocument();
  });

  it("renders a caption when provided", () => {
    render(<ActivityRing segments={SEGMENTS} caption="1.2k in · 740 out this week" />);
    expect(screen.getByText("1.2k in · 740 out this week")).toBeInTheDocument();
  });

  it("renders both verdict and caption together", () => {
    const { container } = render(
      <ActivityRing segments={SEGMENTS} verdict caption="this week" />
    );
    expect(container.querySelector('[data-slot="activity-ring-verdict"]')).toBeInTheDocument();
    expect(screen.getByText("this week")).toBeInTheDocument();
  });

  it("verdict is a paragraph, not a heading (avoids heading-order issues)", () => {
    render(<ActivityRing segments={SEGMENTS} verdict />);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("has no axe violations with verdict + caption", async () => {
    const { container } = render(
      <div role="region" aria-label="Activity">
        <ActivityRing segments={SEGMENTS} verdict caption="this week" />
      </div>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("ActivityRing – active-index guard", () => {
  it("does not crash when segments shrink while a chip is pinned", () => {
    const three: RingSegment[] = [
      { value: 10, label: "A" },
      { value: 20, label: "B" },
      { value: 35, label: "C" },
    ];
    const { rerender } = render(<ActivityRing segments={three} centerLabel="total" />);
    // Pin the third chip (index 2) → centre follows C (35).
    fireEvent.click(screen.getByRole("button", { name: /C/ }));
    expect(screen.getByText("35")).toBeInTheDocument();
    // Shrink to 2 segments — index 2 is now out of range.
    const two: RingSegment[] = [
      { value: 10, label: "A" },
      { value: 20, label: "B" },
    ];
    expect(() => rerender(<ActivityRing segments={two} centerLabel="total" />)).not.toThrow();
    // Centre falls back to the new total (30), not the stale C value.
    expect(screen.getByText("30")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// scoreTone utility (score mode)
// ---------------------------------------------------------------------------

describe("scoreTone utility", () => {
  it("default thresholds: <50 → danger", () => {
    expect(scoreTone(0)).toBe("danger");
    expect(scoreTone(49)).toBe("danger");
  });
  it("default thresholds: 50–89 → warning", () => {
    expect(scoreTone(50)).toBe("warning");
    expect(scoreTone(89)).toBe("warning");
  });
  it("default thresholds: ≥90 → success", () => {
    expect(scoreTone(90)).toBe("success");
    expect(scoreTone(100)).toBe("success");
  });
  it("custom thresholds [70, 95]", () => {
    expect(scoreTone(61, [70, 95])).toBe("danger");
    expect(scoreTone(85, [70, 95])).toBe("warning");
    expect(scoreTone(95, [70, 95])).toBe("success");
  });
});

// ---------------------------------------------------------------------------
// Score mode (single-value gauge)
// ---------------------------------------------------------------------------

function scoreProgress(container: HTMLElement): Element {
  const found = Array.from(container.querySelectorAll("circle")).find((el) =>
    el.hasAttribute("stroke-dasharray"),
  );
  if (!found) throw new Error("progress circle not found");
  return found;
}

describe("ActivityRing – score mode", () => {
  it("renders the rounded value and label", () => {
    render(<ActivityRing value={78.6} label="Performance" />);
    expect(screen.getByText("79")).toBeInTheDocument();
    expect(screen.getByText("Performance")).toBeInTheDocument();
  });

  it("wrapper is role=img with a default aria-label of value + label", () => {
    const { container } = render(<ActivityRing value={78} label="Performance" />);
    const root = container.querySelector('[data-slot="activity-ring"]');
    expect(root).toHaveAttribute("role", "img");
    expect(root).toHaveAttribute("aria-label", "78 Performance");
  });

  it("default aria-label omits the label segment when absent", () => {
    const { container } = render(<ActivityRing value={42} />);
    expect(container.querySelector('[data-slot="activity-ring"]')).toHaveAttribute("aria-label", "42");
  });

  it("explicit aria-label overrides the default", () => {
    const { container } = render(<ActivityRing value={78} aria-label="Overall health" />);
    expect(container.querySelector('[data-slot="activity-ring"]')).toHaveAttribute("aria-label", "Overall health");
  });

  it("auto-derives tone from value (30 → danger → stroke-destructive)", () => {
    const { container } = render(<ActivityRing value={30} />);
    expect(cls(scoreProgress(container))).toContain("stroke-destructive");
  });

  it("auto tone 70 → warning and 95 → success", () => {
    const a = render(<ActivityRing value={70} />);
    expect(cls(scoreProgress(a.container))).toContain("stroke-warning");
    const b = render(<ActivityRing value={95} />);
    expect(cls(scoreProgress(b.container))).toContain("stroke-success");
  });

  it("explicit tone overrides the auto tone", () => {
    const { container } = render(<ActivityRing value={30} tone="success" />);
    expect(cls(scoreProgress(container))).toContain("stroke-success");
    expect(cls(scoreProgress(container))).not.toContain("stroke-destructive");
  });

  it("info tone maps to stroke-brand (never a literal blue)", () => {
    const { container } = render(<ActivityRing value={55} tone="info" />);
    expect(cls(scoreProgress(container))).toContain("stroke-brand");
  });

  it("progress arc carries motion-reduce:transition-none", () => {
    const { container } = render(<ActivityRing value={78} />);
    expect(cls(scoreProgress(container))).toContain("motion-reduce:transition-none");
  });

  it("geometry: value 0 → full offset, value 100 → 0 offset", () => {
    const size = 160, thickness = 10, c = 2 * Math.PI * ((size - thickness) / 2);
    const zero = render(<ActivityRing value={0} size={size} thickness={thickness} />);
    expect(Number(scoreProgress(zero.container).getAttribute("stroke-dashoffset"))).toBeCloseTo(c, 2);
    const full = render(<ActivityRing value={100} size={size} thickness={thickness} />);
    expect(Number(scoreProgress(full.container).getAttribute("stroke-dashoffset"))).toBeCloseTo(0, 2);
  });

  it("geometry: value 50 → half offset", () => {
    const size = 160, thickness = 10, c = 2 * Math.PI * ((size - thickness) / 2);
    const { container } = render(<ActivityRing value={50} size={size} thickness={thickness} />);
    expect(Number(scoreProgress(container).getAttribute("stroke-dashoffset"))).toBeCloseTo(c / 2, 2);
  });

  it("max scales the arc: value 50 / max 200 → 25% filled (0.75·c offset)", () => {
    const size = 160, thickness = 10, c = 2 * Math.PI * ((size - thickness) / 2);
    const { container } = render(<ActivityRing value={50} max={200} size={size} thickness={thickness} />);
    expect(Number(scoreProgress(container).getAttribute("stroke-dashoffset"))).toBeCloseTo(c * 0.75, 2);
  });

  it("clamps geometry but not the displayed number (value 150 shows 150)", () => {
    const { container } = render(<ActivityRing value={150} />);
    expect(screen.getByText("150")).toBeInTheDocument();
    expect(Number(scoreProgress(container).getAttribute("stroke-dashoffset"))).toBeCloseTo(0, 2);
  });

  it("applies size to the wrapper box", () => {
    const { container } = render(<ActivityRing value={78} size={120} />);
    const root = container.querySelector('[data-slot="activity-ring"]') as HTMLElement;
    expect(root.style.width).toBe("120px");
  });

  it("merges className on the score wrapper", () => {
    const { container } = render(<ActivityRing value={78} className="my-score" />);
    expect(container.querySelector('[data-slot="activity-ring"]')).toHaveClass("my-score");
  });

  it("has no axe violations in score mode", async () => {
    const { container } = render(<ActivityRing value={78} label="Performance" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
