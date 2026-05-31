import { render, screen } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import { axe } from "vitest-axe";
import { StatusPill } from "@/components/status-pill";
import type { StatusTone } from "@/components/ui/status-dot";

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_TONES: StatusTone[] = ["success", "warning", "danger", "info", "neutral"];

/**
 * Expected text-color classes for each tone.
 * Derived directly from the `tones` map in status-pill.tsx.
 */
const TONE_TEXT_CLASS: Record<StatusTone, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
  info: "text-brand",
  neutral: "text-muted-foreground",
};

/**
 * Expected ring/background classes for each tone.
 * Derived directly from the `tones` map in status-pill.tsx.
 */
const TONE_RING_CLASS: Record<StatusTone, string> = {
  success: "bg-success/10",
  warning: "bg-warning/10",
  danger: "bg-destructive/10",
  info: "bg-brand/10",
  neutral: "bg-muted",
};

/**
 * Expected bg classes that the embedded StatusDot carries per tone.
 * Derived from status-dot.tsx `dot` record.
 */
const DOT_BG_CLASS: Record<StatusTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  info: "bg-brand",
  neutral: "bg-muted-foreground",
};

// Helper: grab the root <span> element rendered by StatusPill.
function getRoot(container: HTMLElement): HTMLElement {
  return container.firstElementChild as HTMLElement;
}

// Helper: grab the outer <span> of the embedded StatusDot.
// The StatusDot is the first child of the StatusPill root span.
function getDotOuter(container: HTMLElement): HTMLElement {
  const root = getRoot(container);
  return root.firstElementChild as HTMLElement;
}

// ─── Smoke ────────────────────────────────────────────────────────────────────

describe("StatusPill – smoke", () => {
  it("renders without crashing with only children", () => {
    const { container } = render(<StatusPill>Operational</StatusPill>);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders a <span> as the root element", () => {
    const { container } = render(<StatusPill>Test</StatusPill>);
    expect(getRoot(container).tagName).toBe("SPAN");
  });

  it("renders children text content", () => {
    render(<StatusPill>Degraded</StatusPill>);
    expect(screen.getByText("Degraded")).toBeInTheDocument();
  });

  it("renders a JSX element as children", () => {
    render(
      <StatusPill>
        <strong>Live</strong>
      </StatusPill>
    );
    expect(screen.getByText("Live")).toBeInTheDocument();
  });
});

// ─── Default props ─────────────────────────────────────────────────────────────

describe("StatusPill – default props", () => {
  it("defaults tone to 'neutral' → applies text-muted-foreground", () => {
    const { container } = render(<StatusPill>Unknown</StatusPill>);
    expect(getRoot(container).className).toContain("text-muted-foreground");
  });

  it("defaults tone to 'neutral' → applies bg-muted ring", () => {
    const { container } = render(<StatusPill>Unknown</StatusPill>);
    expect(getRoot(container).className).toContain("bg-muted");
  });

  it("defaults pulse to false → no animate-ping span in StatusDot", () => {
    const { container } = render(<StatusPill>Test</StatusPill>);
    expect(container.querySelector(".animate-ping")).toBeNull();
  });
});

// ─── Base classes ─────────────────────────────────────────────────────────────

describe("StatusPill – base classes always present", () => {
  it("has inline-flex class", () => {
    const { container } = render(<StatusPill>Test</StatusPill>);
    expect(getRoot(container).className).toContain("inline-flex");
  });

  it("has items-center class", () => {
    const { container } = render(<StatusPill>Test</StatusPill>);
    expect(getRoot(container).className).toContain("items-center");
  });

  it("has gap-1.5 class", () => {
    const { container } = render(<StatusPill>Test</StatusPill>);
    expect(getRoot(container).className).toContain("gap-1.5");
  });

  it("has rounded-full class", () => {
    const { container } = render(<StatusPill>Test</StatusPill>);
    expect(getRoot(container).className).toContain("rounded-full");
  });

  it("has px-2.5 class", () => {
    const { container } = render(<StatusPill>Test</StatusPill>);
    expect(getRoot(container).className).toContain("px-2.5");
  });

  it("has py-0.5 class", () => {
    const { container } = render(<StatusPill>Test</StatusPill>);
    expect(getRoot(container).className).toContain("py-0.5");
  });

  it("has text-xs class", () => {
    const { container } = render(<StatusPill>Test</StatusPill>);
    expect(getRoot(container).className).toContain("text-xs");
  });

  it("has font-medium class", () => {
    const { container } = render(<StatusPill>Test</StatusPill>);
    expect(getRoot(container).className).toContain("font-medium");
  });
});

// ─── Tone prop ─────────────────────────────────────────────────────────────────

describe("StatusPill – tone prop (text classes)", () => {
  ALL_TONES.forEach((tone) => {
    it(`tone="${tone}" → applies ${TONE_TEXT_CLASS[tone]}`, () => {
      const { container } = render(<StatusPill tone={tone}>Label</StatusPill>);
      expect(getRoot(container).className).toContain(TONE_TEXT_CLASS[tone]);
    });
  });
});

describe("StatusPill – tone prop (ring/background classes)", () => {
  ALL_TONES.forEach((tone) => {
    it(`tone="${tone}" → applies ${TONE_RING_CLASS[tone]}`, () => {
      const { container } = render(<StatusPill tone={tone}>Label</StatusPill>);
      expect(getRoot(container).className).toContain(TONE_RING_CLASS[tone]);
    });
  });
});

describe("StatusPill – tone prop (embedded StatusDot color)", () => {
  ALL_TONES.forEach((tone) => {
    it(`tone="${tone}" → embedded StatusDot inner dot has ${DOT_BG_CLASS[tone]}`, () => {
      const { container } = render(<StatusPill tone={tone}>Label</StatusPill>);
      const dotOuter = getDotOuter(container);
      const innerDot = dotOuter.lastElementChild as HTMLElement;
      expect(innerDot.className).toContain(DOT_BG_CLASS[tone]);
    });
  });
});

// ─── Pulse prop ────────────────────────────────────────────────────────────────

describe("StatusPill – pulse prop", () => {
  it("pulse=false (default) → no animate-ping span rendered", () => {
    const { container } = render(<StatusPill tone="success">Completed</StatusPill>);
    expect(container.querySelector(".animate-ping")).toBeNull();
  });

  it("pulse=true → animate-ping span is rendered inside the dot", () => {
    const { container } = render(
      <StatusPill tone="success" pulse>
        Streaming
      </StatusPill>
    );
    const ping = container.querySelector(".animate-ping");
    expect(ping).not.toBeNull();
  });

  it("pulse=true → ping span carries the tone bg class", () => {
    const { container } = render(
      <StatusPill tone="danger" pulse>
        Incident active
      </StatusPill>
    );
    const ping = container.querySelector(".animate-ping") as HTMLElement;
    expect(ping.className).toContain(DOT_BG_CLASS.danger);
  });

  it("pulse=true → inner dot still has the correct tone bg class", () => {
    const { container } = render(
      <StatusPill tone="info" pulse>
        Syncing
      </StatusPill>
    );
    const dotOuter = getDotOuter(container);
    const innerDot = dotOuter.lastElementChild as HTMLElement;
    expect(innerDot.className).toContain(DOT_BG_CLASS.info);
  });

  it("pulse=true + all tones → ping and dot both carry their tone class", () => {
    ALL_TONES.forEach((tone) => {
      const { container } = render(
        <StatusPill tone={tone} pulse>
          Live
        </StatusPill>
      );
      const dotOuter = getDotOuter(container);
      const ping = dotOuter.querySelector(".animate-ping") as HTMLElement;
      const innerDot = dotOuter.lastElementChild as HTMLElement;
      expect(ping.className).toContain(DOT_BG_CLASS[tone]);
      expect(innerDot.className).toContain(DOT_BG_CLASS[tone]);
    });
  });
});

// ─── className prop ────────────────────────────────────────────────────────────

describe("StatusPill – className prop", () => {
  it("merges a custom className onto the root span", () => {
    const { container } = render(
      <StatusPill className="my-custom-class">Test</StatusPill>
    );
    expect(getRoot(container).className).toContain("my-custom-class");
  });

  it("custom className does not remove base inline-flex class", () => {
    const { container } = render(
      <StatusPill className="extra">Test</StatusPill>
    );
    expect(getRoot(container).className).toContain("inline-flex");
  });

  it("custom className does not remove rounded-full class", () => {
    const { container } = render(
      <StatusPill className="extra">Test</StatusPill>
    );
    expect(getRoot(container).className).toContain("rounded-full");
  });

  it("accepts custom padding override via className (text-sm px-3 py-1 pattern)", () => {
    const { container } = render(
      <StatusPill tone="success" className="text-sm px-3 py-1">
        Active
      </StatusPill>
    );
    const cls = getRoot(container).className;
    expect(cls).toContain("text-sm");
    expect(cls).toContain("px-3");
    expect(cls).toContain("py-1");
  });

  it("accepts width override via className (w-full justify-center pattern)", () => {
    const { container } = render(
      <StatusPill tone="success" className="w-full justify-center">
        All systems operational
      </StatusPill>
    );
    const cls = getRoot(container).className;
    expect(cls).toContain("w-full");
    expect(cls).toContain("justify-center");
  });
});

// ─── Children content ──────────────────────────────────────────────────────────

describe("StatusPill – children content", () => {
  it("renders plain string children", () => {
    render(<StatusPill tone="success">Operational</StatusPill>);
    expect(screen.getByText("Operational")).toBeInTheDocument();
  });

  it("renders children with status label 'Degraded'", () => {
    render(<StatusPill tone="warning">Degraded</StatusPill>);
    expect(screen.getByText("Degraded")).toBeInTheDocument();
  });

  it("renders children with status label 'Outage'", () => {
    render(<StatusPill tone="danger">Outage</StatusPill>);
    expect(screen.getByText("Outage")).toBeInTheDocument();
  });

  it("renders children with status label 'Scheduled'", () => {
    render(<StatusPill tone="info">Scheduled</StatusPill>);
    expect(screen.getByText("Scheduled")).toBeInTheDocument();
  });

  it("renders children with status label 'Unknown'", () => {
    render(<StatusPill tone="neutral">Unknown</StatusPill>);
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });

  it("renders long text children without error", () => {
    render(
      <StatusPill tone="success">
        All systems are fully operational
      </StatusPill>
    );
    expect(
      screen.getByText("All systems are fully operational")
    ).toBeInTheDocument();
  });

  it("renders a number as children", () => {
    render(<StatusPill tone="info">{42}</StatusPill>);
    expect(screen.getByText("42")).toBeInTheDocument();
  });
});

// ─── DOM structure ─────────────────────────────────────────────────────────────

describe("StatusPill – DOM structure", () => {
  it("root span contains the embedded StatusDot as first child", () => {
    const { container } = render(<StatusPill tone="success">Live</StatusPill>);
    const root = getRoot(container);
    const firstChild = root.firstElementChild as HTMLElement;
    // StatusDot renders a span with inline-flex + relative classes.
    expect(firstChild.tagName).toBe("SPAN");
    expect(firstChild.className).toContain("inline-flex");
    expect(firstChild.className).toContain("relative");
  });

  it("root span has exactly one StatusDot child element (the outer dot span)", () => {
    const { container } = render(<StatusPill>Test</StatusPill>);
    const root = getRoot(container);
    // The root has: [StatusDot outer span] + text node.
    // There should be exactly 1 element child (StatusDot).
    expect(root.children).toHaveLength(1);
  });

  it("the embedded StatusDot inner dot has rounded-full", () => {
    const { container } = render(<StatusPill tone="warning">Degraded</StatusPill>);
    const dotOuter = getDotOuter(container);
    const innerDot = dotOuter.lastElementChild as HTMLElement;
    expect(innerDot.className).toContain("rounded-full");
  });

  it("the embedded StatusDot uses size sm (size-1.5) by default", () => {
    const { container } = render(<StatusPill tone="success">Test</StatusPill>);
    const dotOuter = getDotOuter(container);
    expect(dotOuter.className).toContain("size-1.5");
  });
});

// ─── Tone + pulse cross matrix ─────────────────────────────────────────────────

describe("StatusPill – tone × pulse combinations", () => {
  ALL_TONES.forEach((tone) => {
    [false, true].forEach((pulse) => {
      it(`tone="${tone}" pulse=${pulse} → root has text and ring classes`, () => {
        const { container } = render(
          <StatusPill tone={tone} pulse={pulse}>
            Label
          </StatusPill>
        );
        const cls = getRoot(container).className;
        expect(cls).toContain(TONE_TEXT_CLASS[tone]);
        expect(cls).toContain(TONE_RING_CLASS[tone]);
        if (pulse) {
          expect(container.querySelector(".animate-ping")).not.toBeNull();
        } else {
          expect(container.querySelector(".animate-ping")).toBeNull();
        }
      });
    });
  });
});

// ─── Example patterns from docs ────────────────────────────────────────────────

describe("StatusPill – example usage patterns", () => {
  it("default example: renders all 6 example pills without error", () => {
    render(
      <div>
        <StatusPill tone="success">Operational</StatusPill>
        <StatusPill tone="warning">Degraded</StatusPill>
        <StatusPill tone="danger">Outage</StatusPill>
        <StatusPill tone="info">Scheduled</StatusPill>
        <StatusPill tone="neutral">Unknown</StatusPill>
        <StatusPill tone="success" pulse>
          Live
        </StatusPill>
      </div>
    );
    expect(screen.getByText("Operational")).toBeInTheDocument();
    expect(screen.getByText("Degraded")).toBeInTheDocument();
    expect(screen.getByText("Outage")).toBeInTheDocument();
    expect(screen.getByText("Scheduled")).toBeInTheDocument();
    expect(screen.getByText("Unknown")).toBeInTheDocument();
    expect(screen.getByText("Live")).toBeInTheDocument();
  });

  it("pulse example: streaming (success + pulse)", () => {
    const { container } = render(
      <StatusPill tone="success" pulse>
        Streaming
      </StatusPill>
    );
    expect(screen.getByText("Streaming")).toBeInTheDocument();
    expect(container.querySelector(".animate-ping")).not.toBeNull();
  });

  it("pulse example: incident active (danger + pulse)", () => {
    const { container } = render(
      <StatusPill tone="danger" pulse>
        Incident active
      </StatusPill>
    );
    expect(screen.getByText("Incident active")).toBeInTheDocument();
    expect(container.querySelector(".animate-ping")).not.toBeNull();
  });

  it("inline-text example: renders inline alongside prose text", () => {
    render(
      <p>
        The background job is currently{" "}
        <StatusPill tone="success" pulse>
          running
        </StatusPill>{" "}
        and will complete soon.
      </p>
    );
    expect(screen.getByText("running")).toBeInTheDocument();
  });

  it("table-rows example: renders correctly inside a table cell", () => {
    render(
      <table>
        <tbody>
          <tr>
            <td>
              <StatusPill tone="success">Operational</StatusPill>
            </td>
            <td>
              <StatusPill tone="warning" pulse>
                Syncing
              </StatusPill>
            </td>
            <td>
              <StatusPill tone="danger">Outage</StatusPill>
            </td>
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByText("Operational")).toBeInTheDocument();
    expect(screen.getByText("Syncing")).toBeInTheDocument();
    expect(screen.getByText("Outage")).toBeInTheDocument();
  });

  it("custom-class example: full-width pill renders correctly", () => {
    const { container } = render(
      <StatusPill tone="success" className="w-full justify-center">
        All systems operational
      </StatusPill>
    );
    expect(screen.getByText("All systems operational")).toBeInTheDocument();
    expect(getRoot(container).className).toContain("w-full");
    expect(getRoot(container).className).toContain("justify-center");
  });

  it("custom-class example: larger text pill (text-sm px-3 py-1)", () => {
    const { container } = render(
      <StatusPill tone="success" className="text-sm px-3 py-1">
        Active
      </StatusPill>
    );
    const cls = getRoot(container).className;
    expect(cls).toContain("text-sm");
    expect(cls).toContain("px-3");
    expect(cls).toContain("py-1");
  });

  it("renders inside a card header pattern without error", () => {
    render(
      <div className="rounded-2xl border p-4">
        <div className="flex items-center justify-between">
          <span>Background Worker</span>
          <StatusPill tone="success" pulse>
            Running
          </StatusPill>
        </div>
      </div>
    );
    expect(screen.getByText("Running")).toBeInTheDocument();
    expect(screen.getByText("Background Worker")).toBeInTheDocument();
  });

  it("renders all 5 tones map from tones example", () => {
    const toneData: { tone: StatusTone; label: string }[] = [
      { tone: "success", label: "Healthy" },
      { tone: "warning", label: "Degraded" },
      { tone: "danger", label: "Critical" },
      { tone: "info", label: "Pending" },
      { tone: "neutral", label: "Inactive" },
    ];
    render(
      <div>
        {toneData.map(({ tone, label }) => (
          <StatusPill key={tone} tone={tone}>
            {label}
          </StatusPill>
        ))}
      </div>
    );
    toneData.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("renders in a table status column (table-rows example)", () => {
    const services = [
      { name: "API Gateway", tone: "success" as StatusTone, label: "Operational", pulse: false },
      { name: "Storage Bucket", tone: "warning" as StatusTone, label: "Degraded", pulse: false },
      { name: "Job Queue", tone: "info" as StatusTone, label: "Syncing", pulse: true },
      { name: "Email Worker", tone: "danger" as StatusTone, label: "Outage", pulse: false },
      { name: "Cache Layer", tone: "neutral" as StatusTone, label: "Unknown", pulse: false },
    ];
    render(
      <table>
        <tbody>
          {services.map((svc) => (
            <tr key={svc.name}>
              <td>{svc.name}</td>
              <td>
                <StatusPill tone={svc.tone} pulse={svc.pulse}>
                  {svc.label}
                </StatusPill>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
    services.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });
});

// ─── Re-render / prop change ───────────────────────────────────────────────────

describe("StatusPill – re-render / prop change", () => {
  it("updates text class when tone changes from success to danger", () => {
    const { container, rerender } = render(
      <StatusPill tone="success">Status</StatusPill>
    );
    expect(getRoot(container).className).toContain("text-success");

    rerender(<StatusPill tone="danger">Status</StatusPill>);
    expect(getRoot(container).className).toContain("text-destructive");
    expect(getRoot(container).className).not.toContain("text-success");
  });

  it("updates ring class when tone changes", () => {
    const { container, rerender } = render(
      <StatusPill tone="info">Status</StatusPill>
    );
    expect(getRoot(container).className).toContain("bg-brand/10");

    rerender(<StatusPill tone="neutral">Status</StatusPill>);
    expect(getRoot(container).className).toContain("bg-muted");
  });

  it("toggles pulse on → animate-ping appears", () => {
    const { container, rerender } = render(
      <StatusPill tone="success" pulse={false}>
        Status
      </StatusPill>
    );
    expect(container.querySelector(".animate-ping")).toBeNull();

    rerender(
      <StatusPill tone="success" pulse={true}>
        Status
      </StatusPill>
    );
    expect(container.querySelector(".animate-ping")).not.toBeNull();
  });

  it("toggles pulse off → animate-ping disappears", () => {
    const { container, rerender } = render(
      <StatusPill tone="success" pulse={true}>
        Status
      </StatusPill>
    );
    expect(container.querySelector(".animate-ping")).not.toBeNull();

    rerender(
      <StatusPill tone="success" pulse={false}>
        Status
      </StatusPill>
    );
    expect(container.querySelector(".animate-ping")).toBeNull();
  });

  it("updates children text content on re-render", () => {
    const { rerender } = render(
      <StatusPill tone="success">Operational</StatusPill>
    );
    expect(screen.getByText("Operational")).toBeInTheDocument();

    rerender(<StatusPill tone="warning">Degraded</StatusPill>);
    expect(screen.getByText("Degraded")).toBeInTheDocument();
    expect(screen.queryByText("Operational")).toBeNull();
  });
});

// ─── Multiple instances ────────────────────────────────────────────────────────

describe("StatusPill – multiple instances", () => {
  it("renders multiple pills in the same tree without interference", () => {
    const { container } = render(
      <div>
        {ALL_TONES.map((tone) => (
          <StatusPill key={tone} tone={tone}>
            {tone}
          </StatusPill>
        ))}
      </div>
    );
    ALL_TONES.forEach((tone) => {
      expect(screen.getByText(tone)).toBeInTheDocument();
    });
    // Each pill is a direct span child of the wrapper div.
    expect(container.firstElementChild!.children).toHaveLength(ALL_TONES.length);
  });

  it("two pills with same tone render independently", () => {
    render(
      <div>
        <StatusPill tone="success">First</StatusPill>
        <StatusPill tone="success">Second</StatusPill>
      </div>
    );
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("mix of pulse and non-pulse in same tree → correct ping counts", () => {
    const { container } = render(
      <div>
        <StatusPill tone="success" pulse>
          Pulsing
        </StatusPill>
        <StatusPill tone="danger">Static</StatusPill>
        <StatusPill tone="info" pulse>
          AlsoPulsing
        </StatusPill>
      </div>
    );
    const pings = container.querySelectorAll(".animate-ping");
    expect(pings).toHaveLength(2);
  });
});

// ─── Edge cases ────────────────────────────────────────────────────────────────

describe("StatusPill – edge cases", () => {
  it("renders without error when className is an empty string", () => {
    const { container } = render(
      <StatusPill tone="success" className="">
        Active
      </StatusPill>
    );
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders without error when className is undefined", () => {
    const { container } = render(
      <StatusPill tone="success" className={undefined}>
        Active
      </StatusPill>
    );
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("root element is a span, not a div or button", () => {
    const { container } = render(<StatusPill>Check</StatusPill>);
    expect(getRoot(container).tagName).toBe("SPAN");
  });

  it("root does not have a button role (it is purely presentational)", () => {
    const { container } = render(<StatusPill>Check</StatusPill>);
    expect(getRoot(container).getAttribute("role")).toBeNull();
  });
});

// ─── A11y ──────────────────────────────────────────────────────────────────────

describe("StatusPill – accessibility", () => {
  it("has no axe violations with default (neutral) tone in a semantic context", async () => {
    const { container } = render(
      <div>
        <StatusPill>Unknown</StatusPill>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations for every tone when paired with visible text", async () => {
    for (const tone of ALL_TONES) {
      const { container } = render(
        <div>
          <StatusPill tone={tone}>{tone} status</StatusPill>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  it("has no axe violations with pulse=true", async () => {
    const { container } = render(
      <div>
        <StatusPill tone="success" pulse>
          Live
        </StatusPill>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations when used inside a paragraph (inline)", async () => {
    const { container } = render(
      <p>
        The service is currently{" "}
        <StatusPill tone="warning">degraded</StatusPill>
        .
      </p>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations when used inside a table cell", async () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <td>API Gateway</td>
            <td>
              <StatusPill tone="success">Operational</StatusPill>
            </td>
          </tr>
        </tbody>
      </table>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations when multiple pills are in a list", async () => {
    const { container } = render(
      <ul>
        {ALL_TONES.map((tone) => (
          <li key={tone}>
            <StatusPill tone={tone}>{tone}</StatusPill>
          </li>
        ))}
      </ul>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations for custom-class overrides", async () => {
    const { container } = render(
      <div>
        <StatusPill tone="success" className="w-full justify-center">
          All systems operational
        </StatusPill>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with pulse=true and danger tone", async () => {
    const { container } = render(
      <div>
        <StatusPill tone="danger" pulse>
          Incident active
        </StatusPill>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
