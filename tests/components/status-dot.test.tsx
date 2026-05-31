import { render, screen } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import { axe } from "vitest-axe";
import { StatusDot, type StatusTone } from "@/components/ui/status-dot";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** All tone values the component advertises. */
const ALL_TONES: StatusTone[] = ["success", "warning", "danger", "info", "neutral"];

/** Expected bg-* class for each tone (from the source). */
const TONE_CLASS: Record<StatusTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  info: "bg-brand",
  neutral: "bg-muted-foreground",
};

/** Expected Tailwind size class for each size (from the source). */
const SIZE_CLASS = {
  sm: "size-1.5",
  md: "size-2",
  lg: "size-2.5",
} as const;

// Helper that returns the outer <span> wrapper rendered by StatusDot.
// StatusDot renders: <span (outer, relative inline-flex)> [ping span?] <span (inner dot)> </span>
function getOuter(container: HTMLElement) {
  // The component root is the first span inside the container.
  return container.firstElementChild as HTMLElement;
}

// ─── Smoke ───────────────────────────────────────────────────────────────────

describe("StatusDot – smoke", () => {
  it("renders without crashing with no props", () => {
    const { container } = render(<StatusDot />);
    // Outer wrapper span must be in the document.
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders a span element as the root", () => {
    const { container } = render(<StatusDot />);
    expect(getOuter(container).tagName).toBe("SPAN");
  });

  it("renders exactly one inner dot span when pulse is false (default)", () => {
    const { container } = render(<StatusDot />);
    const outer = getOuter(container);
    // No pulse → only the inner dot, not the ping span.
    expect(outer.children).toHaveLength(1);
  });

  it("renders two inner spans when pulse is true (ping + dot)", () => {
    const { container } = render(<StatusDot pulse />);
    const outer = getOuter(container);
    expect(outer.children).toHaveLength(2);
  });
});

// ─── Default prop values ─────────────────────────────────────────────────────

describe("StatusDot – default props", () => {
  it("defaults tone to 'neutral' → applies bg-muted-foreground", () => {
    const { container } = render(<StatusDot />);
    const outer = getOuter(container);
    const innerDot = outer.lastElementChild as HTMLElement;
    expect(innerDot.className).toContain("bg-muted-foreground");
  });

  it("defaults size to 'sm' → applies size-1.5 on the outer span", () => {
    const { container } = render(<StatusDot />);
    const outer = getOuter(container);
    expect(outer.className).toContain(SIZE_CLASS.sm);
  });

  it("does NOT render the animate-ping span by default", () => {
    const { container } = render(<StatusDot />);
    const outer = getOuter(container);
    const pingSpan = outer.querySelector(".animate-ping");
    expect(pingSpan).toBeNull();
  });
});

// ─── Tone prop ───────────────────────────────────────────────────────────────

describe("StatusDot – tone prop", () => {
  ALL_TONES.forEach((tone) => {
    it(`tone="${tone}" → inner dot has class ${TONE_CLASS[tone]}`, () => {
      const { container } = render(<StatusDot tone={tone} />);
      const outer = getOuter(container);
      const innerDot = outer.lastElementChild as HTMLElement;
      expect(innerDot.className).toContain(TONE_CLASS[tone]);
    });
  });

  it("inner dot always has rounded-full class regardless of tone", () => {
    ALL_TONES.forEach((tone) => {
      const { container } = render(<StatusDot tone={tone} />);
      const outer = getOuter(container);
      const innerDot = outer.lastElementChild as HTMLElement;
      expect(innerDot.className).toContain("rounded-full");
    });
  });
});

// ─── Size prop ───────────────────────────────────────────────────────────────

describe("StatusDot – size prop", () => {
  (["sm", "md", "lg"] as const).forEach((size) => {
    it(`size="${size}" → outer span has class ${SIZE_CLASS[size]}`, () => {
      const { container } = render(<StatusDot size={size} />);
      const outer = getOuter(container);
      expect(outer.className).toContain(SIZE_CLASS[size]);
    });
  });

  it("only one size class is present at a time (sm)", () => {
    const { container } = render(<StatusDot size="sm" />);
    // Split on spaces so "size-2.5" is never confused with "size-2"
    const classes = getOuter(container).className.split(/\s+/);
    expect(classes).toContain(SIZE_CLASS.sm);
    expect(classes).not.toContain(SIZE_CLASS.md);
    expect(classes).not.toContain(SIZE_CLASS.lg);
  });

  it("only one size class is present at a time (md)", () => {
    const { container } = render(<StatusDot size="md" />);
    const classes = getOuter(container).className.split(/\s+/);
    expect(classes).toContain(SIZE_CLASS.md);
    expect(classes).not.toContain(SIZE_CLASS.sm);
    expect(classes).not.toContain(SIZE_CLASS.lg);
  });

  it("only one size class is present at a time (lg)", () => {
    const { container } = render(<StatusDot size="lg" />);
    const classes = getOuter(container).className.split(/\s+/);
    expect(classes).toContain(SIZE_CLASS.lg);
    expect(classes).not.toContain(SIZE_CLASS.sm);
    expect(classes).not.toContain(SIZE_CLASS.md);
  });
});

// ─── Pulse prop ──────────────────────────────────────────────────────────────

describe("StatusDot – pulse prop", () => {
  it("pulse=false does NOT render the animate-ping span", () => {
    const { container } = render(<StatusDot pulse={false} />);
    expect(getOuter(container).querySelector(".animate-ping")).toBeNull();
  });

  it("pulse=true renders an animate-ping span", () => {
    const { container } = render(<StatusDot pulse={true} />);
    const ping = getOuter(container).querySelector(".animate-ping");
    expect(ping).not.toBeNull();
  });

  it("pulse=true → ping span has absolute class", () => {
    const { container } = render(<StatusDot pulse={true} />);
    const ping = getOuter(container).querySelector(".animate-ping") as HTMLElement;
    expect(ping.className).toContain("absolute");
  });

  it("pulse=true → ping span has opacity-75 class", () => {
    const { container } = render(<StatusDot pulse={true} />);
    const ping = getOuter(container).querySelector(".animate-ping") as HTMLElement;
    expect(ping.className).toContain("opacity-75");
  });

  it("pulse=true → ping span has inline-flex class", () => {
    const { container } = render(<StatusDot pulse={true} />);
    const ping = getOuter(container).querySelector(".animate-ping") as HTMLElement;
    expect(ping.className).toContain("inline-flex");
  });

  it("pulse=true → ping span has rounded-full class", () => {
    const { container } = render(<StatusDot pulse={true} />);
    const ping = getOuter(container).querySelector(".animate-ping") as HTMLElement;
    expect(ping.className).toContain("rounded-full");
  });

  it("pulse=true → ping span carries the tone bg class", () => {
    ALL_TONES.forEach((tone) => {
      const { container } = render(<StatusDot pulse={true} tone={tone} />);
      const ping = getOuter(container).querySelector(".animate-ping") as HTMLElement;
      expect(ping.className).toContain(TONE_CLASS[tone]);
    });
  });

  it("pulse=true → inner dot still has the correct tone bg class", () => {
    ALL_TONES.forEach((tone) => {
      const { container } = render(<StatusDot pulse={true} tone={tone} />);
      const outer = getOuter(container);
      const innerDot = outer.lastElementChild as HTMLElement;
      expect(innerDot.className).toContain(TONE_CLASS[tone]);
    });
  });
});

// ─── className prop ───────────────────────────────────────────────────────────

describe("StatusDot – className prop", () => {
  it("merges a custom className onto the outer span", () => {
    const { container } = render(<StatusDot className="my-custom-class" />);
    expect(getOuter(container).className).toContain("my-custom-class");
  });

  it("custom className does not remove the base relative class", () => {
    const { container } = render(<StatusDot className="extra" />);
    expect(getOuter(container).className).toContain("relative");
  });

  it("custom className does not remove the inline-flex class", () => {
    const { container } = render(<StatusDot className="extra" />);
    expect(getOuter(container).className).toContain("inline-flex");
  });
});

// ─── DOM structure ───────────────────────────────────────────────────────────

describe("StatusDot – DOM structure", () => {
  it("outer span has inline-flex and relative classes", () => {
    const { container } = render(<StatusDot />);
    const cls = getOuter(container).className;
    expect(cls).toContain("inline-flex");
    expect(cls).toContain("relative");
  });

  it("inner dot span has relative, inline-flex, size-full, rounded-full", () => {
    const { container } = render(<StatusDot />);
    const innerDot = getOuter(container).lastElementChild as HTMLElement;
    expect(innerDot.className).toContain("relative");
    expect(innerDot.className).toContain("inline-flex");
    expect(innerDot.className).toContain("size-full");
    expect(innerDot.className).toContain("rounded-full");
  });

  it("ping span (when pulse) has size-full class", () => {
    const { container } = render(<StatusDot pulse />);
    const ping = getOuter(container).querySelector(".animate-ping") as HTMLElement;
    expect(ping.className).toContain("size-full");
  });

  it("ping span is the first child and dot span is the last child", () => {
    const { container } = render(<StatusDot pulse />);
    const outer = getOuter(container);
    expect(outer.firstElementChild!.className).toContain("animate-ping");
    expect(outer.lastElementChild!.className).not.toContain("animate-ping");
  });
});

// ─── Tone + size combinations ─────────────────────────────────────────────────

describe("StatusDot – tone × size combinations", () => {
  (["sm", "md", "lg"] as const).forEach((size) => {
    ALL_TONES.forEach((tone) => {
      it(`tone="${tone}" size="${size}" → correct classes on outer and inner`, () => {
        const { container } = render(<StatusDot tone={tone} size={size} />);
        const outer = getOuter(container);
        const innerDot = outer.lastElementChild as HTMLElement;
        expect(outer.className).toContain(SIZE_CLASS[size]);
        expect(innerDot.className).toContain(TONE_CLASS[tone]);
      });
    });
  });
});

// ─── Tone + pulse combinations ───────────────────────────────────────────────

describe("StatusDot – tone + pulse combinations", () => {
  ALL_TONES.forEach((tone) => {
    it(`tone="${tone}" pulse=true → both ping and dot have ${TONE_CLASS[tone]}`, () => {
      const { container } = render(<StatusDot tone={tone} pulse />);
      const outer = getOuter(container);
      const ping = outer.querySelector(".animate-ping") as HTMLElement;
      const innerDot = outer.lastElementChild as HTMLElement;
      expect(ping.className).toContain(TONE_CLASS[tone]);
      expect(innerDot.className).toContain(TONE_CLASS[tone]);
    });
  });
});

// ─── All-prop combination ─────────────────────────────────────────────────────

describe("StatusDot – all props combined", () => {
  it("tone+size+pulse+className all applied together", () => {
    const { container } = render(
      <StatusDot tone="success" size="lg" pulse className="test-combo" />
    );
    const outer = getOuter(container);
    const ping = outer.querySelector(".animate-ping") as HTMLElement;
    const innerDot = outer.lastElementChild as HTMLElement;

    expect(outer.className).toContain(SIZE_CLASS.lg);
    expect(outer.className).toContain("test-combo");
    expect(ping.className).toContain(TONE_CLASS.success);
    expect(innerDot.className).toContain(TONE_CLASS.success);
  });
});

// ─── Usage in context (as in examples) ───────────────────────────────────────

describe("StatusDot – usage in context (example patterns)", () => {
  it("renders correctly inline alongside text", () => {
    render(
      <div>
        <StatusDot tone="success" size="md" />
        <span>Active</span>
      </div>
    );
    // The dot is rendered; adjacent text is findable.
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders inside a list item without error", () => {
    render(
      <ul>
        <li>
          <StatusDot tone="warning" size="sm" />
          <span>Degraded</span>
        </li>
      </ul>
    );
    expect(screen.getByText("Degraded")).toBeInTheDocument();
  });

  it("renders multiple dots with different tones in the same tree", () => {
    const { container } = render(
      <div>
        {ALL_TONES.map((tone) => (
          <StatusDot key={tone} tone={tone} size="md" />
        ))}
      </div>
    );
    // One outer span per tone = 5 spans as direct children of the div.
    const spans = container.firstElementChild!.children;
    expect(spans).toHaveLength(ALL_TONES.length);
  });

  it("renders inside a table cell without error", () => {
    render(
      <table>
        <tbody>
          <tr>
            <td>
              <StatusDot tone="danger" size="sm" />
              <span>Failed</span>
            </td>
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  it("tone success with pulse renders in service status list pattern", () => {
    const { container } = render(
      <ul>
        <li>
          <StatusDot tone="success" size="sm" pulse />
          <span>Operational</span>
        </li>
      </ul>
    );
    const ping = container.querySelector(".animate-ping");
    expect(ping).not.toBeNull();
    expect(screen.getByText("Operational")).toBeInTheDocument();
  });
});

// ─── A11y ─────────────────────────────────────────────────────────────────────

describe("StatusDot – accessibility", () => {
  it("has no axe violations with default props", async () => {
    const { container } = render(
      // Wrapping in a semantic element with a label so the dot has context.
      <div role="status" aria-label="System status">
        <StatusDot />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations for every tone", async () => {
    for (const tone of ALL_TONES) {
      const { container } = render(
        <div role="status" aria-label={`${tone} status indicator`}>
          <StatusDot tone={tone} />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  it("has no axe violations with pulse=true", async () => {
    const { container } = render(
      <div role="status" aria-label="Live indicator">
        <StatusDot tone="success" pulse />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations when used inline beside text", async () => {
    const { container } = render(
      <span>
        <StatusDot tone="success" size="md" />
        <span>Operational</span>
      </span>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations for all sizes", async () => {
    for (const size of ["sm", "md", "lg"] as const) {
      const { container } = render(
        <div role="status" aria-label={`${size} dot`}>
          <StatusDot size={size} />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });
});

// ─── Edge-cases ───────────────────────────────────────────────────────────────

describe("StatusDot – edge cases", () => {
  it("renders correctly when pulse changes from false to true (re-render)", () => {
    const { container, rerender } = render(<StatusDot tone="info" pulse={false} />);
    expect(getOuter(container).querySelector(".animate-ping")).toBeNull();

    rerender(<StatusDot tone="info" pulse={true} />);
    expect(getOuter(container).querySelector(".animate-ping")).not.toBeNull();
  });

  it("renders correctly when pulse changes from true to false (re-render)", () => {
    const { container, rerender } = render(<StatusDot tone="info" pulse={true} />);
    expect(getOuter(container).querySelector(".animate-ping")).not.toBeNull();

    rerender(<StatusDot tone="info" pulse={false} />);
    expect(getOuter(container).querySelector(".animate-ping")).toBeNull();
  });

  it("renders correctly when tone changes between re-renders", () => {
    const { container, rerender } = render(<StatusDot tone="success" />);
    let innerDot = getOuter(container).lastElementChild as HTMLElement;
    expect(innerDot.className).toContain("bg-success");

    rerender(<StatusDot tone="danger" />);
    innerDot = getOuter(container).lastElementChild as HTMLElement;
    expect(innerDot.className).toContain("bg-destructive");
  });

  it("renders correctly when size changes between re-renders", () => {
    const { container, rerender } = render(<StatusDot size="sm" />);
    expect(getOuter(container).className).toContain(SIZE_CLASS.sm);

    rerender(<StatusDot size="lg" />);
    expect(getOuter(container).className).toContain(SIZE_CLASS.lg);
  });

  it("renders without errors when className is an empty string", () => {
    const { container } = render(<StatusDot className="" />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders multiple independent instances without interference", () => {
    const { container } = render(
      <div>
        <StatusDot tone="success" size="sm" />
        <StatusDot tone="danger" size="lg" pulse />
        <StatusDot tone="neutral" size="md" />
      </div>
    );
    const allSpans = container.querySelectorAll("span");
    // 3 outer spans + 3 inner dot spans + 1 ping span = 7 total spans
    expect(allSpans.length).toBeGreaterThanOrEqual(7);
  });
});
