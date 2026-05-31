/**
 * Exhaustive tests for Gauge component + scoreTone utility.
 *
 * Component: @/components/ui/gauge
 * Exports:   Gauge (component), scoreTone (utility function)
 *
 * Props:
 *   value      – 0-100 number (required)
 *   label?     – optional string label below the value
 *   tone?      – "success" | "warning" | "danger" | "info" | "neutral"
 *               (defaults via scoreTone(value))
 *   size?      – number pixels (default 160)
 *   thickness? – number pixels (default 10)
 *   className? – string passed to wrapper div
 *
 * jsdom notes:
 *   - React SVG camelCase props (strokeDasharray, strokeWidth, etc.) are
 *     serialized to lowercase kebab-case HTML attrs in jsdom
 *     (stroke-dasharray, stroke-width, stroke-linecap).
 *   - SVGElement.className is a plain string in jsdom (not SVGAnimatedString),
 *     so use getAttribute("class") instead of className.baseVal.
 */

import { render, screen } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import { axe } from "vitest-axe";
import { Gauge, scoreTone } from "@/components/ui/gauge";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns the progress arc circle — the second <circle> which has a
 * stroke-dasharray attribute (the filled arc).
 */
function getProgressCircle(container: HTMLElement): Element {
  const circles = container.querySelectorAll("circle");
  const found = Array.from(circles).find((c) => c.hasAttribute("stroke-dasharray"));
  if (!found) throw new Error("Progress circle not found in SVG");
  return found;
}

/**
 * Returns the track/background circle — the first <circle> which does NOT
 * have a stroke-dasharray attribute.
 */
function getTrackCircle(container: HTMLElement): Element {
  const circles = container.querySelectorAll("circle");
  const found = Array.from(circles).find((c) => !c.hasAttribute("stroke-dasharray"));
  if (!found) throw new Error("Track circle not found in SVG");
  return found;
}

/** Reads the class attribute string from an element. */
function cls(el: Element): string {
  return el.getAttribute("class") ?? "";
}

// ---------------------------------------------------------------------------
// scoreTone utility
// ---------------------------------------------------------------------------

describe("scoreTone utility", () => {
  describe("default thresholds (<50 → danger, <90 → warning, else success)", () => {
    it("returns 'danger' for value = 0", () => {
      expect(scoreTone(0)).toBe("danger");
    });

    it("returns 'danger' for value = 49", () => {
      expect(scoreTone(49)).toBe("danger");
    });

    it("returns 'warning' for value = 50 (boundary)", () => {
      expect(scoreTone(50)).toBe("warning");
    });

    it("returns 'warning' for value = 75", () => {
      expect(scoreTone(75)).toBe("warning");
    });

    it("returns 'warning' for value = 89", () => {
      expect(scoreTone(89)).toBe("warning");
    });

    it("returns 'success' for value = 90 (boundary)", () => {
      expect(scoreTone(90)).toBe("success");
    });

    it("returns 'success' for value = 100", () => {
      expect(scoreTone(100)).toBe("success");
    });
  });

  describe("custom thresholds", () => {
    it("applies strict thresholds [70, 95]: value 61 → danger", () => {
      expect(scoreTone(61, [70, 95])).toBe("danger");
    });

    it("applies strict thresholds [70, 95]: value 70 → warning (boundary)", () => {
      expect(scoreTone(70, [70, 95])).toBe("warning");
    });

    it("applies strict thresholds [70, 95]: value 85 → warning", () => {
      expect(scoreTone(85, [70, 95])).toBe("warning");
    });

    it("applies strict thresholds [70, 95]: value 95 → success (boundary)", () => {
      expect(scoreTone(95, [70, 95])).toBe("success");
    });

    it("applies lenient thresholds [20, 40]: value 10 → danger", () => {
      expect(scoreTone(10, [20, 40])).toBe("danger");
    });

    it("applies lenient thresholds [20, 40]: value 22 → warning", () => {
      expect(scoreTone(22, [20, 40])).toBe("warning");
    });

    it("applies lenient thresholds [20, 40]: value 40 → success (boundary)", () => {
      expect(scoreTone(40, [20, 40])).toBe("success");
    });
  });
});

// ---------------------------------------------------------------------------
// Gauge component – renders without crashing
// ---------------------------------------------------------------------------

describe("Gauge component – renders without crashing", () => {
  it("renders a wrapper element", () => {
    const { container } = render(<Gauge value={78} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders an SVG element", () => {
    const { container } = render(<Gauge value={78} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("displays the rounded numeric value", () => {
    render(<Gauge value={78} />);
    expect(screen.getByText("78")).toBeInTheDocument();
  });

  it("rounds fractional values up", () => {
    render(<Gauge value={78.7} />);
    expect(screen.getByText("79")).toBeInTheDocument();
  });

  it("rounds fractional values down", () => {
    render(<Gauge value={78.2} />);
    expect(screen.getByText("78")).toBeInTheDocument();
  });

  it("renders value 0 correctly", () => {
    render(<Gauge value={0} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders value 100 correctly", () => {
    render(<Gauge value={100} />);
    expect(screen.getByText("100")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Label prop
// ---------------------------------------------------------------------------

describe("Gauge component – label prop", () => {
  it("does NOT render a label element when label is omitted", () => {
    render(<Gauge value={78} />);
    expect(screen.queryByText("Performance")).not.toBeInTheDocument();
  });

  it("renders the label text when label is provided", () => {
    render(<Gauge value={78} label="Performance" />);
    expect(screen.getByText("Performance")).toBeInTheDocument();
  });

  it("label element has text-muted-foreground class", () => {
    render(<Gauge value={78} label="Score" />);
    const label = screen.getByText("Score");
    expect(label.className).toContain("text-muted-foreground");
  });

  it("label element has text-xs class", () => {
    render(<Gauge value={78} label="Latency" />);
    const label = screen.getByText("Latency");
    expect(label.className).toContain("text-xs");
  });

  it("renders different label text content correctly", () => {
    render(<Gauge value={50} label="Great" />);
    expect(screen.getByText("Great")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Tone prop → stroke class on progress circle
// ---------------------------------------------------------------------------

describe("Gauge component – tone prop stroke classes", () => {
  const toneClasses: Array<[string, string]> = [
    ["success", "stroke-success"],
    ["warning", "stroke-warning"],
    ["danger", "stroke-destructive"],
    ["info", "stroke-brand"],
    ["neutral", "stroke-muted-foreground"],
  ];

  toneClasses.forEach(([tone, expectedClass]) => {
    it(`tone="${tone}" applies class "${expectedClass}" to progress circle`, () => {
      const { container } = render(
        <Gauge value={50} tone={tone as "success" | "warning" | "danger" | "info" | "neutral"} />
      );
      const progressCircle = getProgressCircle(container);
      expect(cls(progressCircle)).toContain(expectedClass);
    });
  });

  it("auto-derives tone from value when tone prop is omitted (value 30 → danger → stroke-destructive)", () => {
    const { container } = render(<Gauge value={30} />);
    const progressCircle = getProgressCircle(container);
    expect(cls(progressCircle)).toContain("stroke-destructive");
  });

  it("auto-derives tone from value when tone prop is omitted (value 70 → warning → stroke-warning)", () => {
    const { container } = render(<Gauge value={70} />);
    const progressCircle = getProgressCircle(container);
    expect(cls(progressCircle)).toContain("stroke-warning");
  });

  it("auto-derives tone from value when tone prop is omitted (value 95 → success → stroke-success)", () => {
    const { container } = render(<Gauge value={95} />);
    const progressCircle = getProgressCircle(container);
    expect(cls(progressCircle)).toContain("stroke-success");
  });

  it("explicit tone overrides auto-derived tone (value 30 + tone='success')", () => {
    // value 30 would normally be 'danger', but we override with tone='success'
    const { container } = render(<Gauge value={30} tone="success" />);
    const progressCircle = getProgressCircle(container);
    expect(cls(progressCircle)).toContain("stroke-success");
    expect(cls(progressCircle)).not.toContain("stroke-destructive");
  });
});

// ---------------------------------------------------------------------------
// SVG structure and attributes
// ---------------------------------------------------------------------------

describe("Gauge component – SVG structure", () => {
  it("SVG has aria-hidden attribute (decorative)", () => {
    const { container } = render(<Gauge value={78} />);
    const svg = container.querySelector("svg");
    // React renders aria-hidden={true} as aria-hidden="true" in the DOM
    expect(svg).toHaveAttribute("aria-hidden");
  });

  it("SVG has -rotate-90 class", () => {
    const { container } = render(<Gauge value={78} />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("class")).toContain("-rotate-90");
  });

  it("track circle has stroke-muted class", () => {
    const { container } = render(<Gauge value={78} />);
    const trackCircle = getTrackCircle(container);
    expect(cls(trackCircle)).toContain("stroke-muted");
  });

  it("progress circle has stroke-linecap='round' attribute", () => {
    const { container } = render(<Gauge value={78} />);
    const progressCircle = getProgressCircle(container);
    // jsdom serializes strokeLinecap → stroke-linecap
    expect(progressCircle).toHaveAttribute("stroke-linecap", "round");
  });

  it("progress circle has CSS transition class for animation", () => {
    const { container } = render(<Gauge value={78} />);
    const progressCircle = getProgressCircle(container);
    expect(cls(progressCircle)).toContain("transition-[stroke-dashoffset]");
    expect(cls(progressCircle)).toContain("duration-700");
  });

  it("SVG has exactly two circles", () => {
    const { container } = render(<Gauge value={78} />);
    expect(container.querySelectorAll("circle")).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// Size prop
// ---------------------------------------------------------------------------

describe("Gauge component – size prop", () => {
  it("defaults to 160px when size is omitted", () => {
    const { container } = render(<Gauge value={78} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe("160px");
    expect(wrapper.style.height).toBe("160px");
  });

  it("applies size=80 to the wrapper inline style", () => {
    const { container } = render(<Gauge value={78} size={80} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe("80px");
    expect(wrapper.style.height).toBe("80px");
  });

  it("applies size=120 to the wrapper inline style", () => {
    const { container } = render(<Gauge value={78} size={120} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe("120px");
    expect(wrapper.style.height).toBe("120px");
  });

  it("applies size=200 to the wrapper inline style", () => {
    const { container } = render(<Gauge value={78} size={200} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe("200px");
    expect(wrapper.style.height).toBe("200px");
  });

  it("applies size=240 to the wrapper inline style", () => {
    const { container } = render(<Gauge value={78} size={240} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe("240px");
    expect(wrapper.style.height).toBe("240px");
  });

  it("SVG width/height attributes match size prop", () => {
    const { container } = render(<Gauge value={78} size={120} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "120");
    expect(svg).toHaveAttribute("height", "120");
  });

  it("circles are centered at (size/2, size/2)", () => {
    const size = 120;
    const { container } = render(<Gauge value={78} size={size} />);
    const circles = container.querySelectorAll("circle");
    circles.forEach((circle) => {
      expect(circle).toHaveAttribute("cx", String(size / 2));
      expect(circle).toHaveAttribute("cy", String(size / 2));
    });
  });
});

// ---------------------------------------------------------------------------
// Thickness prop
// ---------------------------------------------------------------------------

describe("Gauge component – thickness prop", () => {
  it("defaults to stroke-width=10 when thickness omitted", () => {
    const { container } = render(<Gauge value={78} />);
    // jsdom serializes strokeWidth → stroke-width
    const circles = container.querySelectorAll("circle");
    circles.forEach((circle) => {
      expect(circle).toHaveAttribute("stroke-width", "10");
    });
  });

  it("applies custom thickness=4 to both circles", () => {
    const { container } = render(<Gauge value={74} thickness={4} />);
    const circles = container.querySelectorAll("circle");
    circles.forEach((circle) => {
      expect(circle).toHaveAttribute("stroke-width", "4");
    });
  });

  it("applies custom thickness=18 to both circles", () => {
    const { container } = render(<Gauge value={74} thickness={18} />);
    const circles = container.querySelectorAll("circle");
    circles.forEach((circle) => {
      expect(circle).toHaveAttribute("stroke-width", "18");
    });
  });

  it("applies custom thickness=26 to both circles", () => {
    const { container } = render(<Gauge value={74} thickness={26} />);
    const circles = container.querySelectorAll("circle");
    circles.forEach((circle) => {
      expect(circle).toHaveAttribute("stroke-width", "26");
    });
  });

  it("radius accounts for thickness: r = (size - thickness) / 2", () => {
    const size = 160;
    const thickness = 10;
    const expectedR = (size - thickness) / 2; // 75
    const { container } = render(<Gauge value={78} size={size} thickness={thickness} />);
    const circles = container.querySelectorAll("circle");
    circles.forEach((circle) => {
      expect(circle).toHaveAttribute("r", String(expectedR));
    });
  });

  it("radius with size=80 thickness=6: r = (80 - 6) / 2 = 37", () => {
    const { container } = render(<Gauge value={78} size={80} thickness={6} />);
    const circles = container.querySelectorAll("circle");
    circles.forEach((circle) => {
      expect(circle).toHaveAttribute("r", "37");
    });
  });

  it("radius with size=120 thickness=8: r = (120 - 8) / 2 = 56", () => {
    const { container } = render(<Gauge value={78} size={120} thickness={8} />);
    const circles = container.querySelectorAll("circle");
    circles.forEach((circle) => {
      expect(circle).toHaveAttribute("r", "56");
    });
  });
});

// ---------------------------------------------------------------------------
// strokeDasharray / strokeDashoffset geometry (serialized as hyphenated attrs)
// ---------------------------------------------------------------------------

describe("Gauge component – arc geometry (stroke-dasharray/stroke-dashoffset)", () => {
  function getExpectedCircumference(size: number, thickness: number) {
    const r = (size - thickness) / 2;
    return 2 * Math.PI * r;
  }

  it("progress circle stroke-dasharray equals full circumference (size=160, thickness=10)", () => {
    const size = 160;
    const thickness = 10;
    const c = getExpectedCircumference(size, thickness);
    const { container } = render(<Gauge value={78} size={size} thickness={thickness} />);
    const progressCircle = getProgressCircle(container);
    expect(Number(progressCircle.getAttribute("stroke-dasharray"))).toBeCloseTo(c, 3);
  });

  it("value=0 → stroke-dashoffset equals full circumference (no arc visible)", () => {
    const size = 160;
    const thickness = 10;
    const c = getExpectedCircumference(size, thickness);
    const { container } = render(<Gauge value={0} size={size} thickness={thickness} />);
    const progressCircle = getProgressCircle(container);
    expect(Number(progressCircle.getAttribute("stroke-dashoffset"))).toBeCloseTo(c, 3);
  });

  it("value=100 → stroke-dashoffset is 0 (full arc visible)", () => {
    const { container } = render(<Gauge value={100} />);
    const progressCircle = getProgressCircle(container);
    expect(Number(progressCircle.getAttribute("stroke-dashoffset"))).toBeCloseTo(0, 3);
  });

  it("value=50 → stroke-dashoffset is half of circumference", () => {
    const size = 160;
    const thickness = 10;
    const c = getExpectedCircumference(size, thickness);
    const { container } = render(<Gauge value={50} size={size} thickness={thickness} />);
    const progressCircle = getProgressCircle(container);
    expect(Number(progressCircle.getAttribute("stroke-dashoffset"))).toBeCloseTo(c / 2, 3);
  });

  it("value=25 → stroke-dashoffset is 0.75 * circumference", () => {
    const size = 160;
    const thickness = 10;
    const c = getExpectedCircumference(size, thickness);
    const { container } = render(<Gauge value={25} size={size} thickness={thickness} />);
    const progressCircle = getProgressCircle(container);
    expect(Number(progressCircle.getAttribute("stroke-dashoffset"))).toBeCloseTo(c * 0.75, 3);
  });

  it("clamps geometry below 0: value=-10 arc offset = circumference (no arc)", () => {
    const size = 160;
    const thickness = 10;
    const c = getExpectedCircumference(size, thickness);
    const { container } = render(<Gauge value={-10} size={size} thickness={thickness} />);
    const progressCircle = getProgressCircle(container);
    // Math.max(0, -10) = 0 → offset = c - (0/100)*c = c
    expect(Number(progressCircle.getAttribute("stroke-dashoffset"))).toBeCloseTo(c, 3);
  });

  it("clamps geometry above 100: value=150 arc offset = 0 (full arc)", () => {
    const { container } = render(<Gauge value={150} />);
    const progressCircle = getProgressCircle(container);
    expect(Number(progressCircle.getAttribute("stroke-dashoffset"))).toBeCloseTo(0, 3);
  });

  it("geometry clamping does NOT clamp the displayed number (value=-10 shows -10)", () => {
    render(<Gauge value={-10} />);
    expect(screen.getByText("-10")).toBeInTheDocument();
  });

  it("geometry clamping does NOT clamp the displayed number (value=150 shows 150)", () => {
    render(<Gauge value={150} />);
    expect(screen.getByText("150")).toBeInTheDocument();
  });

  it("dasharray and dashoffset are consistent for value=78 (size=160, thickness=10)", () => {
    const size = 160;
    const thickness = 10;
    const c = getExpectedCircumference(size, thickness);
    const { container } = render(<Gauge value={78} size={size} thickness={thickness} />);
    const progressCircle = getProgressCircle(container);
    const dasharray = Number(progressCircle.getAttribute("stroke-dasharray"));
    const dashoffset = Number(progressCircle.getAttribute("stroke-dashoffset"));
    const filledRatio = (dasharray - dashoffset) / dasharray;
    expect(filledRatio).toBeCloseTo(0.78, 3);
  });
});

// ---------------------------------------------------------------------------
// className prop (passthrough)
// ---------------------------------------------------------------------------

describe("Gauge component – className prop", () => {
  it("applies custom className to the wrapper div", () => {
    const { container } = render(<Gauge value={78} className="my-custom-class" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("my-custom-class");
  });

  it("merges className with default wrapper classes", () => {
    const { container } = render(<Gauge value={78} className="extra-class" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("inline-grid");
    expect(wrapper.className).toContain("place-items-center");
    expect(wrapper.className).toContain("extra-class");
  });

  it("applies multiple extra classes", () => {
    const { container } = render(<Gauge value={78} className="foo bar baz" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("foo");
    expect(wrapper.className).toContain("bar");
    expect(wrapper.className).toContain("baz");
  });
});

// ---------------------------------------------------------------------------
// Layout / DOM structure
// ---------------------------------------------------------------------------

describe("Gauge component – DOM structure", () => {
  it("wrapper has relative and inline-grid classes", () => {
    const { container } = render(<Gauge value={78} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("relative");
    expect(wrapper.className).toContain("inline-grid");
    expect(wrapper.className).toContain("place-items-center");
  });

  it("inner overlay div has absolute class and inset-0", () => {
    const { container } = render(<Gauge value={78} />);
    const valueEl = screen.getByText("78");
    // value div → inner container div → overlay div
    const overlayDiv = valueEl.parentElement?.parentElement;
    expect(overlayDiv?.className).toContain("absolute");
    expect(overlayDiv?.className).toContain("inset-0");
  });

  it("value element has text-3xl class", () => {
    render(<Gauge value={78} />);
    const valueEl = screen.getByText("78");
    expect(valueEl.className).toContain("text-3xl");
  });

  it("value element has font-semibold class", () => {
    render(<Gauge value={78} />);
    const valueEl = screen.getByText("78");
    expect(valueEl.className).toContain("font-semibold");
  });

  it("value element has tabular-nums class", () => {
    render(<Gauge value={78} />);
    const valueEl = screen.getByText("78");
    expect(valueEl.className).toContain("tabular-nums");
  });

  it("value element has tracking-tight class", () => {
    render(<Gauge value={78} />);
    const valueEl = screen.getByText("78");
    expect(valueEl.className).toContain("tracking-tight");
  });
});

// ---------------------------------------------------------------------------
// Boundary / edge values
// ---------------------------------------------------------------------------

describe("Gauge component – edge/boundary values", () => {
  it("renders value=1 (very low) without error", () => {
    render(<Gauge value={1} />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("renders value=99 (very high) without error", () => {
    render(<Gauge value={99} />);
    expect(screen.getByText("99")).toBeInTheDocument();
  });

  it("value=49.5 rounds to 50", () => {
    render(<Gauge value={49.5} />);
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("value=49.4 rounds to 49", () => {
    render(<Gauge value={49.4} />);
    expect(screen.getByText("49")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Multiple gauges in one tree
// ---------------------------------------------------------------------------

describe("Gauge component – multiple instances", () => {
  it("renders multiple gauges independently with correct values", () => {
    render(
      <div>
        <Gauge value={32} tone="danger" label="Danger" />
        <Gauge value={67} tone="warning" label="Warning" />
        <Gauge value={91} tone="success" label="Success" />
      </div>
    );
    expect(screen.getByText("32")).toBeInTheDocument();
    expect(screen.getByText("67")).toBeInTheDocument();
    expect(screen.getByText("91")).toBeInTheDocument();
    expect(screen.getByText("Danger")).toBeInTheDocument();
    expect(screen.getByText("Warning")).toBeInTheDocument();
    expect(screen.getByText("Success")).toBeInTheDocument();
  });

  it("3 gauges produce 6 circles total (2 per gauge)", () => {
    const { container } = render(
      <div>
        <Gauge value={32} tone="danger" label="Danger" />
        <Gauge value={67} tone="warning" label="Warning" />
        <Gauge value={91} tone="success" label="Success" />
      </div>
    );
    expect(container.querySelectorAll("circle")).toHaveLength(6);
  });

  it("each gauge applies its own tone class independently", () => {
    const { container } = render(
      <div>
        <Gauge value={32} tone="danger" />
        <Gauge value={91} tone="success" />
      </div>
    );
    const progressCircles = Array.from(container.querySelectorAll("circle")).filter((c) =>
      c.hasAttribute("stroke-dasharray")
    );
    expect(progressCircles).toHaveLength(2);
    expect(cls(progressCircles[0])).toContain("stroke-destructive");
    expect(cls(progressCircles[1])).toContain("stroke-success");
  });
});

// ---------------------------------------------------------------------------
// Accessibility
// ---------------------------------------------------------------------------

describe("Gauge component – accessibility", () => {
  it("SVG is aria-hidden (decorative, no role leak)", () => {
    const { container } = render(<Gauge value={78} label="Performance" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden");
  });

  it("has no axe violations – basic usage with accessible wrapper", async () => {
    const { container } = render(
      <div role="region" aria-label="Performance gauge">
        <Gauge value={78} label="Performance" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations – tone=danger", async () => {
    const { container } = render(
      <div role="region" aria-label="Error rate gauge">
        <Gauge value={8} tone="danger" label="Error rate" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations – tone=success", async () => {
    const { container } = render(
      <div role="region" aria-label="Uptime gauge">
        <Gauge value={99} tone="success" label="Uptime" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations – no label prop", async () => {
    const { container } = render(
      <div role="region" aria-label="Score gauge">
        <Gauge value={75} />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations – all 5 tones rendered", async () => {
    const { container } = render(
      <div role="region" aria-label="Status gauges">
        <Gauge value={32} tone="danger" label="Danger" />
        <Gauge value={67} tone="warning" label="Warning" />
        <Gauge value={91} tone="success" label="Success" />
        <Gauge value={55} tone="info" label="Info" />
        <Gauge value={50} tone="neutral" label="Neutral" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// scoreTone + Gauge integration
// ---------------------------------------------------------------------------

describe("scoreTone + Gauge integration", () => {
  it("scoreTone(22) → 'danger' → stroke-destructive on progress circle", () => {
    const { container } = render(<Gauge value={22} tone={scoreTone(22)} />);
    const progressCircle = getProgressCircle(container);
    expect(cls(progressCircle)).toContain("stroke-destructive");
  });

  it("scoreTone(61) → 'warning' → stroke-warning on progress circle", () => {
    const { container } = render(<Gauge value={61} tone={scoreTone(61)} />);
    const progressCircle = getProgressCircle(container);
    expect(cls(progressCircle)).toContain("stroke-warning");
  });

  it("scoreTone(96) → 'success' → stroke-success on progress circle", () => {
    const { container } = render(<Gauge value={96} tone={scoreTone(96)} />);
    const progressCircle = getProgressCircle(container);
    expect(cls(progressCircle)).toContain("stroke-success");
  });

  it("scoreTone(85, [70, 95]) → 'warning' → stroke-warning", () => {
    const { container } = render(<Gauge value={85} tone={scoreTone(85, [70, 95])} />);
    const progressCircle = getProgressCircle(container);
    expect(cls(progressCircle)).toContain("stroke-warning");
  });

  it("scoreTone(48, [70, 95]) → 'danger' → stroke-destructive", () => {
    const { container } = render(<Gauge value={48} tone={scoreTone(48, [70, 95])} />);
    const progressCircle = getProgressCircle(container);
    expect(cls(progressCircle)).toContain("stroke-destructive");
  });

  it("scoreTone with all preset values used in score-tone example", () => {
    const scores = [22, 48, 61, 85, 96];
    const expectedTones = ["danger", "danger", "warning", "warning", "success"];
    scores.forEach((v, i) => {
      expect(scoreTone(v)).toBe(expectedTones[i]);
    });
  });
});
