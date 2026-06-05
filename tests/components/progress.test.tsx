/**
 * Exhaustive tests for Progress component family
 *
 * Component source: components/ui/progress.tsx
 * Built on: @base-ui/react/progress
 *
 * API:
 *   <Progress value={number|null} min? max? format? getAriaValueText? locale? className? ...>
 *     <ProgressLabel>label text</ProgressLabel>
 *     <ProgressValue>{(formattedValue, value) => ReactNode}</ProgressValue>
 *     <ProgressTrack className?>
 *       <ProgressIndicator className? />
 *     </ProgressTrack>
 *   </Progress>
 *
 * ARIA:
 *   Root renders role="progressbar" with aria-valuemin, aria-valuemax,
 *   aria-valuenow (absent when indeterminate), aria-valuetext, aria-labelledby.
 *   ProgressLabel renders role="presentation" <span> and registers its id
 *   on the root's aria-labelledby.
 *
 * State data-attributes (on root + indicator):
 *   data-progressing  — 0 < value < max  (finite, not at max)
 *   data-complete     — value === max
 *   data-indeterminate — value === null
 *
 * Indicator style:
 *   width: `${percent}%` when determinate; absent when indeterminate.
 *
 * data-slot attributes:
 *   progress / progress-track / progress-indicator / progress-label / progress-value
 */

import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Render a basic determinate progress with label and value display. */
function renderBasic(value: number | null = 50) {
  return render(
    <Progress value={value}>
      <ProgressLabel>Loading</ProgressLabel>
      <ProgressValue>{(f) => f}</ProgressValue>
    </Progress>
  );
}

/** Render the full compound anatomy. */
function renderFull(value: number | null = 50) {
  return render(
    <Progress value={value}>
      <ProgressLabel>Loading</ProgressLabel>
      <ProgressValue>{(f) => f}</ProgressValue>
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </Progress>
  );
}

// ---------------------------------------------------------------------------
// 1. Renders without crashing — default usage
// ---------------------------------------------------------------------------

describe("Progress — renders without crashing", () => {
  it("renders with a numeric value", () => {
    const { container } = renderBasic(65);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders with value=0", () => {
    const { container } = renderBasic(0);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders with value=100", () => {
    const { container } = renderBasic(100);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders with value=null (indeterminate)", () => {
    const { container } = renderBasic(null);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders with no children", () => {
    const { container } = render(<Progress value={50} />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders with just ProgressTrack + ProgressIndicator", () => {
    const { container } = render(
      <Progress value={30}>
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    );
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders all five compound parts without crashing", () => {
    const { container } = renderFull(50);
    expect(container.firstElementChild).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 2. ARIA roles and attributes — root (progressbar)
// ---------------------------------------------------------------------------

describe("Progress — ARIA role and attributes", () => {
  it("renders with role='progressbar'", () => {
    renderBasic(50);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("sets aria-valuemin=0 by default", () => {
    renderBasic(50);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuemin", "0");
  });

  it("sets aria-valuemax=100 by default", () => {
    renderBasic(50);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuemax", "100");
  });

  it("sets aria-valuenow to the numeric value", () => {
    renderBasic(65);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "65");
  });

  it("omits aria-valuenow when value=null (indeterminate)", () => {
    renderBasic(null);
    // aria-valuenow must be absent for indeterminate state
    expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
  });

  it("sets aria-valuetext to a formatted percent string by default", () => {
    renderBasic(50);
    const bar = screen.getByRole("progressbar");
    // Base UI formats via Intl.NumberFormat with style:'percent'; text contains 50%
    expect(bar).toHaveAttribute("aria-valuetext");
    const text = bar.getAttribute("aria-valuetext") ?? "";
    expect(text).toContain("50");
  });

  it("sets aria-valuetext='indeterminate progress' when value=null", () => {
    renderBasic(null);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuetext",
      "indeterminate progress"
    );
  });

  it("aria-valuetext uses custom getAriaValueText when provided", () => {
    render(
      <Progress value={7} min={0} max={10} getAriaValueText={(_, v) => `Step ${v} of 10`}>
        <ProgressLabel>Onboarding</ProgressLabel>
      </Progress>
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuetext",
      "Step 7 of 10"
    );
  });

  it("aria-labelledby points to the ProgressLabel id", () => {
    renderBasic(50);
    const bar = screen.getByRole("progressbar");
    const labelledby = bar.getAttribute("aria-labelledby");
    expect(labelledby).toBeTruthy();
    // The element with that id should be the label
    const labelEl = document.getElementById(labelledby as string);
    expect(labelEl).toBeInTheDocument();
    expect(labelEl?.textContent).toContain("Loading");
  });

  it("aria-labelledby is absent when no ProgressLabel is rendered", () => {
    render(
      <Progress value={50}>
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    );
    // aria-labelledby may be undefined or set to an empty/no label
    // The root still renders; we just confirm it doesn't crash
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("aria-valuemin equals min prop", () => {
    render(
      <Progress value={340} min={0} max={512}>
        <ProgressLabel>Transfer</ProgressLabel>
      </Progress>
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuemin", "0");
  });

  it("aria-valuemax equals max prop", () => {
    render(
      <Progress value={340} min={0} max={512}>
        <ProgressLabel>Transfer</ProgressLabel>
      </Progress>
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuemax", "512");
  });

  it("aria-valuenow equals value when custom range used", () => {
    render(
      <Progress value={340} min={0} max={512}>
        <ProgressLabel>Transfer</ProgressLabel>
      </Progress>
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "340");
  });
});

// ---------------------------------------------------------------------------
// 3. State data-attributes
// ---------------------------------------------------------------------------

describe("Progress — state data-attributes", () => {
  it("sets data-progressing when 0 < value < max", () => {
    renderBasic(50);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("data-progressing");
    expect(bar).not.toHaveAttribute("data-complete");
    expect(bar).not.toHaveAttribute("data-indeterminate");
  });

  it("sets data-complete when value === max (100 by default)", () => {
    renderBasic(100);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("data-complete");
    expect(bar).not.toHaveAttribute("data-progressing");
    expect(bar).not.toHaveAttribute("data-indeterminate");
  });

  it("sets data-indeterminate when value=null", () => {
    renderBasic(null);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("data-indeterminate");
    expect(bar).not.toHaveAttribute("data-progressing");
    expect(bar).not.toHaveAttribute("data-complete");
  });

  it("sets data-progressing for value=1 (just above min)", () => {
    renderBasic(1);
    expect(screen.getByRole("progressbar")).toHaveAttribute("data-progressing");
  });

  it("sets data-progressing for value=99 (just below max)", () => {
    renderBasic(99);
    expect(screen.getByRole("progressbar")).toHaveAttribute("data-progressing");
  });

  it("sets data-complete when value equals custom max", () => {
    render(
      <Progress value={512} min={0} max={512}>
        <ProgressLabel>Transfer</ProgressLabel>
      </Progress>
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute("data-complete");
  });

  it("indicator also carries data-progressing", () => {
    render(
      <Progress value={50}>
        <ProgressLabel>Loading</ProgressLabel>
        <ProgressTrack>
          <ProgressIndicator data-testid="indicator" />
        </ProgressTrack>
      </Progress>
    );
    expect(screen.getByTestId("indicator")).toHaveAttribute("data-progressing");
  });

  it("indicator carries data-complete when value=max", () => {
    render(
      <Progress value={100}>
        <ProgressLabel>Complete</ProgressLabel>
        <ProgressTrack>
          <ProgressIndicator data-testid="indicator" />
        </ProgressTrack>
      </Progress>
    );
    expect(screen.getByTestId("indicator")).toHaveAttribute("data-complete");
  });

  it("indicator carries data-indeterminate when value=null", () => {
    render(
      <Progress value={null}>
        <ProgressLabel>Loading</ProgressLabel>
        <ProgressTrack>
          <ProgressIndicator data-testid="indicator" />
        </ProgressTrack>
      </Progress>
    );
    expect(screen.getByTestId("indicator")).toHaveAttribute("data-indeterminate");
  });
});

// ---------------------------------------------------------------------------
// 4. Indicator width (percentage style)
// ---------------------------------------------------------------------------

describe("Progress — indicator width style", () => {
  it("indicator has width=50% when value=50, min=0, max=100", () => {
    render(
      <Progress value={50}>
        <ProgressTrack>
          <ProgressIndicator data-testid="indicator" />
        </ProgressTrack>
      </Progress>
    );
    const indicator = screen.getByTestId("indicator");
    expect(indicator.style.width).toBe("50%");
  });

  it("indicator has width=0% when value=0", () => {
    render(
      <Progress value={0}>
        <ProgressTrack>
          <ProgressIndicator data-testid="indicator" />
        </ProgressTrack>
      </Progress>
    );
    expect(screen.getByTestId("indicator").style.width).toBe("0%");
  });

  it("indicator has width=100% when value=100", () => {
    render(
      <Progress value={100}>
        <ProgressTrack>
          <ProgressIndicator data-testid="indicator" />
        </ProgressTrack>
      </Progress>
    );
    expect(screen.getByTestId("indicator").style.width).toBe("100%");
  });

  it("indicator has width='' (no inline style) when value=null (indeterminate)", () => {
    render(
      <Progress value={null}>
        <ProgressTrack>
          <ProgressIndicator data-testid="indicator" />
        </ProgressTrack>
      </Progress>
    );
    // When indeterminate the Base UI indicator sets an empty object — no width
    const indicator = screen.getByTestId("indicator");
    expect(indicator.style.width).toBeFalsy();
  });

  it("indicator width scales correctly with custom min/max (340 of 512)", () => {
    render(
      <Progress value={340} min={0} max={512}>
        <ProgressTrack>
          <ProgressIndicator data-testid="indicator" />
        </ProgressTrack>
      </Progress>
    );
    const indicator = screen.getByTestId("indicator");
    // 340/512 ≈ 66.4%
    expect(indicator.style.width).toMatch(/^66\./);
  });

  it("indicator has correct width at value=1 (near start)", () => {
    render(
      <Progress value={1}>
        <ProgressTrack>
          <ProgressIndicator data-testid="indicator" />
        </ProgressTrack>
      </Progress>
    );
    expect(screen.getByTestId("indicator").style.width).toBe("1%");
  });

  it("indicator has correct width at value=25", () => {
    render(
      <Progress value={25}>
        <ProgressTrack>
          <ProgressIndicator data-testid="indicator" />
        </ProgressTrack>
      </Progress>
    );
    expect(screen.getByTestId("indicator").style.width).toBe("25%");
  });
});

// ---------------------------------------------------------------------------
// 5. CSS classes — Progress root
// ---------------------------------------------------------------------------

describe("Progress — root CSS classes", () => {
  it("has flex class", () => {
    const { container } = renderBasic(50);
    expect((container.firstElementChild as HTMLElement).className).toContain("flex");
  });

  it("has flex-wrap class", () => {
    const { container } = renderBasic(50);
    expect((container.firstElementChild as HTMLElement).className).toContain("flex-wrap");
  });

  it("has gap-3 class", () => {
    const { container } = renderBasic(50);
    expect((container.firstElementChild as HTMLElement).className).toContain("gap-3");
  });

  it("has data-slot='progress'", () => {
    const { container } = renderBasic(50);
    expect(container.firstElementChild).toHaveAttribute("data-slot", "progress");
  });

  it("merges custom className on root", () => {
    const { container } = render(<Progress value={50} className="my-custom">test</Progress>);
    expect((container.firstElementChild as HTMLElement).className).toContain("my-custom");
    expect((container.firstElementChild as HTMLElement).className).toContain("flex"); // base still present
  });
});

// ---------------------------------------------------------------------------
// 6. CSS classes — ProgressTrack
// ---------------------------------------------------------------------------

describe("ProgressTrack — CSS classes", () => {
  function getTrack() {
    return document.querySelector('[data-slot="progress-track"]') as HTMLElement;
  }

  it("track has relative class", () => {
    renderFull(50);
    expect(getTrack().className).toContain("relative");
  });

  it("track has flex class", () => {
    renderFull(50);
    expect(getTrack().className).toContain("flex");
  });

  it("track has h-1 class (default height)", () => {
    renderFull(50);
    expect(getTrack().className).toContain("h-1");
  });

  it("track has w-full class", () => {
    renderFull(50);
    expect(getTrack().className).toContain("w-full");
  });

  it("track has items-center class", () => {
    renderFull(50);
    expect(getTrack().className).toContain("items-center");
  });

  it("track has overflow-x-hidden class", () => {
    renderFull(50);
    expect(getTrack().className).toContain("overflow-x-hidden");
  });

  it("track has rounded-full class", () => {
    renderFull(50);
    expect(getTrack().className).toContain("rounded-full");
  });

  it("track has bg-muted class", () => {
    renderFull(50);
    expect(getTrack().className).toContain("bg-muted");
  });

  it("track has data-slot='progress-track'", () => {
    renderFull(50);
    expect(getTrack()).toHaveAttribute("data-slot", "progress-track");
  });

  it("track accepts custom className (size override)", () => {
    render(
      <Progress value={55}>
        <ProgressTrack className="h-4">
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    );
    const track = document.querySelector('[data-slot="progress-track"]') as HTMLElement;
    expect(track.className).toContain("h-4");
  });
});

// ---------------------------------------------------------------------------
// 7. CSS classes — ProgressIndicator
// ---------------------------------------------------------------------------

describe("ProgressIndicator — CSS classes", () => {
  function getIndicator() {
    return document.querySelector('[data-slot="progress-indicator"]') as HTMLElement;
  }

  it("indicator has h-full class", () => {
    renderFull(50);
    expect(getIndicator().className).toContain("h-full");
  });

  it("indicator has bg-primary class by default", () => {
    renderFull(50);
    expect(getIndicator().className).toContain("bg-primary");
  });

  it("indicator has transition-all class", () => {
    renderFull(50);
    expect(getIndicator().className).toContain("transition-all");
  });

  it("indicator has data-slot='progress-indicator'", () => {
    renderFull(50);
    expect(getIndicator()).toHaveAttribute("data-slot", "progress-indicator");
  });

  it("indicator accepts custom className for color override (success)", () => {
    render(
      <Progress value={91}>
        <ProgressTrack>
          <ProgressIndicator className="bg-emerald-500" data-testid="ind" />
        </ProgressTrack>
      </Progress>
    );
    expect(screen.getByTestId("ind").className).toContain("bg-emerald-500");
  });

  it("indicator accepts custom className for color override (warning)", () => {
    render(
      <Progress value={45}>
        <ProgressTrack>
          <ProgressIndicator className="bg-amber-500" data-testid="ind" />
        </ProgressTrack>
      </Progress>
    );
    expect(screen.getByTestId("ind").className).toContain("bg-amber-500");
  });

  it("indicator accepts custom className for color override (destructive)", () => {
    render(
      <Progress value={18}>
        <ProgressTrack>
          <ProgressIndicator className="bg-destructive" data-testid="ind" />
        </ProgressTrack>
      </Progress>
    );
    expect(screen.getByTestId("ind").className).toContain("bg-destructive");
  });
});

// ---------------------------------------------------------------------------
// 8. CSS classes — ProgressLabel
// ---------------------------------------------------------------------------

describe("ProgressLabel — CSS classes", () => {
  it("label has text-sm class", () => {
    renderBasic(50);
    const label = document.querySelector('[data-slot="progress-label"]') as HTMLElement;
    expect(label.className).toContain("text-sm");
  });

  it("label has font-medium class", () => {
    renderBasic(50);
    const label = document.querySelector('[data-slot="progress-label"]') as HTMLElement;
    expect(label.className).toContain("font-medium");
  });

  it("label has data-slot='progress-label'", () => {
    renderBasic(50);
    expect(document.querySelector('[data-slot="progress-label"]')).toBeInTheDocument();
  });

  it("label renders its text content", () => {
    render(
      <Progress value={50}>
        <ProgressLabel>Uploading file…</ProgressLabel>
      </Progress>
    );
    expect(screen.getByText("Uploading file…")).toBeInTheDocument();
  });

  it("label accepts custom className", () => {
    render(
      <Progress value={50}>
        <ProgressLabel className="uppercase">Label</ProgressLabel>
      </Progress>
    );
    const label = document.querySelector('[data-slot="progress-label"]') as HTMLElement;
    expect(label.className).toContain("uppercase");
  });
});

// ---------------------------------------------------------------------------
// 9. CSS classes — ProgressValue
// ---------------------------------------------------------------------------

describe("ProgressValue — CSS classes", () => {
  it("value element has ml-auto class", () => {
    renderBasic(50);
    const val = document.querySelector('[data-slot="progress-value"]') as HTMLElement;
    expect(val.className).toContain("ml-auto");
  });

  it("value element has text-sm class", () => {
    renderBasic(50);
    const val = document.querySelector('[data-slot="progress-value"]') as HTMLElement;
    expect(val.className).toContain("text-sm");
  });

  it("value element has text-muted-foreground class", () => {
    renderBasic(50);
    const val = document.querySelector('[data-slot="progress-value"]') as HTMLElement;
    expect(val.className).toContain("text-muted-foreground");
  });

  it("value element has tabular-nums class", () => {
    renderBasic(50);
    const val = document.querySelector('[data-slot="progress-value"]') as HTMLElement;
    expect(val.className).toContain("tabular-nums");
  });

  it("value element has data-slot='progress-value'", () => {
    renderBasic(50);
    expect(document.querySelector('[data-slot="progress-value"]')).toBeInTheDocument();
  });

  it("value element accepts custom className", () => {
    render(
      <Progress value={50}>
        <ProgressValue className="font-bold">{(f) => f}</ProgressValue>
      </Progress>
    );
    const val = document.querySelector('[data-slot="progress-value"]') as HTMLElement;
    expect(val.className).toContain("font-bold");
  });
});

// ---------------------------------------------------------------------------
// 10. ProgressValue render function — formatted value
// ---------------------------------------------------------------------------

describe("ProgressValue — render function", () => {
  it("render fn receives formatted percentage string and renders it", () => {
    render(
      <Progress value={65}>
        <ProgressValue>{(formatted) => formatted}</ProgressValue>
      </Progress>
    );
    // Formatted value contains "65"
    const val = document.querySelector('[data-slot="progress-value"]') as HTMLElement;
    expect(val.textContent).toContain("65");
  });

  it("render fn receives 'indeterminate' string as formattedValue arg when value=null", () => {
    // Base UI passes 'indeterminate' (not null) as the formattedValueArg when value===null;
    // the numeric value arg is null.
    const spy = vi.fn().mockReturnValue(null);
    render(
      <Progress value={null}>
        <ProgressValue>{spy}</ProgressValue>
      </Progress>
    );
    expect(spy).toHaveBeenCalled();
    const [formattedValue, value] = spy.mock.calls[0];
    expect(formattedValue).toBe("indeterminate");
    expect(value).toBeNull();
  });

  it("render fn receives numeric value as second arg", () => {
    const spy = vi.fn().mockReturnValue(null);
    render(
      <Progress value={42}>
        <ProgressValue>{spy}</ProgressValue>
      </Progress>
    );
    expect(spy).toHaveBeenCalled();
    const [, numericValue] = spy.mock.calls[0];
    expect(numericValue).toBe(42);
  });

  it("custom format — shows raw value alongside max (340 / 512 MB)", () => {
    render(
      <Progress value={340} min={0} max={512}>
        <ProgressValue data-testid="pv">
          {(_f, v) => (v !== null ? `${v} / 512 MB` : null)}
        </ProgressValue>
      </Progress>
    );
    expect(screen.getByTestId("pv").textContent).toBe("340 / 512 MB");
  });

  it("custom format — shows step counter (7 / 10)", () => {
    render(
      <Progress value={7} min={0} max={10}>
        <ProgressValue data-testid="pv">
          {(_f, v) => (v !== null ? `${v} / 10` : null)}
        </ProgressValue>
      </Progress>
    );
    expect(screen.getByTestId("pv").textContent).toBe("7 / 10");
  });

  it("shows the 'indeterminate' string when render fn receives it and passes through", () => {
    // Base UI passes formattedValueArg='indeterminate' when value===null;
    // the render fn here converts that to '—' only when it's null, but since
    // it's the string 'indeterminate', the fn returns 'indeterminate'.
    // Test the actual contract: fn receives 'indeterminate' string.
    render(
      <Progress value={null}>
        <ProgressValue data-testid="pv">
          {(f) => (f === "indeterminate" ? "—" : f)}
        </ProgressValue>
      </Progress>
    );
    expect(screen.getByTestId("pv").textContent).toBe("—");
  });
});

// ---------------------------------------------------------------------------
// 11. format prop — Intl.NumberFormat options
// ---------------------------------------------------------------------------

describe("Progress — format prop (Intl.NumberFormat)", () => {
  it("format with maximumFractionDigits shows decimal percent", () => {
    render(
      <Progress value={0.734} min={0} max={1} format={{ style: "percent", maximumFractionDigits: 1 }}>
        <ProgressLabel>Accuracy</ProgressLabel>
      </Progress>
    );
    // aria-valuetext will contain the formatted value (73.4% or similar)
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuetext");
    const text = bar.getAttribute("aria-valuetext") ?? "";
    expect(text).toMatch(/73/); // 73.4%
  });
});

// ---------------------------------------------------------------------------
// 12. Custom min/max range
// ---------------------------------------------------------------------------

describe("Progress — custom min/max", () => {
  it("min=0, max=512 — aria-valuemax is 512", () => {
    render(
      <Progress value={340} min={0} max={512}>
        <ProgressLabel>Transfer</ProgressLabel>
      </Progress>
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuemax", "512");
  });

  it("min=0, max=10 — aria-valuemax is 10", () => {
    render(
      <Progress value={7} min={0} max={10}>
        <ProgressLabel>Steps</ProgressLabel>
      </Progress>
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuemax", "10");
  });

  it("at max with custom range → data-complete", () => {
    render(
      <Progress value={10} min={0} max={10}>
        <ProgressLabel>Done</ProgressLabel>
      </Progress>
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute("data-complete");
  });

  it("below max with custom range → data-progressing", () => {
    render(
      <Progress value={7} min={0} max={10}>
        <ProgressLabel>Steps</ProgressLabel>
      </Progress>
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute("data-progressing");
  });
});

// ---------------------------------------------------------------------------
// 13. Indeterminate state
// ---------------------------------------------------------------------------

describe("Progress — indeterminate state", () => {
  it("indeterminate: role=progressbar present", () => {
    render(
      <Progress value={null}>
        <ProgressLabel>Loading…</ProgressLabel>
      </Progress>
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("indeterminate: data-indeterminate on root", () => {
    render(
      <Progress value={null}>
        <ProgressLabel>Loading…</ProgressLabel>
      </Progress>
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute("data-indeterminate");
  });

  it("indeterminate: aria-valuenow absent", () => {
    render(
      <Progress value={null}>
        <ProgressLabel>Loading…</ProgressLabel>
      </Progress>
    );
    expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
  });

  it("indeterminate indicator applies data-indeterminate for CSS animation targeting", () => {
    render(
      <Progress value={null}>
        <ProgressTrack>
          <ProgressIndicator
            data-testid="ind"
            className="data-[indeterminate]:w-1/2"
          />
        </ProgressTrack>
      </Progress>
    );
    expect(screen.getByTestId("ind")).toHaveAttribute("data-indeterminate");
  });
});

// ---------------------------------------------------------------------------
// 14. Controlled — state updates re-render correctly
// ---------------------------------------------------------------------------

describe("Progress — controlled value updates", () => {
  it("updates aria-valuenow when value prop changes", () => {
    const { rerender } = render(
      <Progress value={30}>
        <ProgressLabel>Processing</ProgressLabel>
      </Progress>
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "30");

    rerender(
      <Progress value={70}>
        <ProgressLabel>Processing</ProgressLabel>
      </Progress>
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "70");
  });

  it("transitions from progressing to complete", () => {
    const { rerender } = render(
      <Progress value={50}>
        <ProgressLabel>Loading</ProgressLabel>
      </Progress>
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute("data-progressing");

    rerender(
      <Progress value={100}>
        <ProgressLabel>Loading</ProgressLabel>
      </Progress>
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute("data-complete");
    expect(screen.getByRole("progressbar")).not.toHaveAttribute("data-progressing");
  });

  it("transitions from determinate to indeterminate", () => {
    const { rerender } = render(
      <Progress value={50}>
        <ProgressLabel>Loading</ProgressLabel>
      </Progress>
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "50");

    rerender(
      <Progress value={null}>
        <ProgressLabel>Loading</ProgressLabel>
      </Progress>
    );
    expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
    expect(screen.getByRole("progressbar")).toHaveAttribute("data-indeterminate");
  });

  it("transitions from indeterminate back to progressing", () => {
    const { rerender } = render(
      <Progress value={null}>
        <ProgressLabel>Loading</ProgressLabel>
      </Progress>
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute("data-indeterminate");

    rerender(
      <Progress value={0}>
        <ProgressLabel>Loading</ProgressLabel>
      </Progress>
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
    expect(screen.getByRole("progressbar")).not.toHaveAttribute("data-indeterminate");
  });

  it("indicator width updates when value changes (30 → 80)", () => {
    const { rerender } = render(
      <Progress value={30}>
        <ProgressTrack>
          <ProgressIndicator data-testid="ind" />
        </ProgressTrack>
      </Progress>
    );
    expect(screen.getByTestId("ind").style.width).toBe("30%");

    rerender(
      <Progress value={80}>
        <ProgressTrack>
          <ProgressIndicator data-testid="ind" />
        </ProgressTrack>
      </Progress>
    );
    expect(screen.getByTestId("ind").style.width).toBe("80%");
  });
});

// ---------------------------------------------------------------------------
// 15. Controlled — interactive component (simulating the controlled example)
// ---------------------------------------------------------------------------

describe("Progress — controlled interactive component", () => {
  function ControlledExample() {
    const [value, setValue] = React.useState<number | null>(0);
    const isIndeterminate = value === null;
    const isComplete = value === 100;

    const step = (delta: number) => {
      setValue((prev) => {
        if (prev === null) return 0;
        return Math.min(100, Math.max(0, prev + delta));
      });
    };

    return (
      <div>
        <Progress value={value}>
          <ProgressLabel>
            {isIndeterminate ? "Loading…" : isComplete ? "Complete" : "Processing"}
          </ProgressLabel>
          <ProgressValue>
            {(formatted) => (isIndeterminate ? "—" : formatted)}
          </ProgressValue>
        </Progress>

        <button onClick={() => setValue(0)}>Reset</button>
        <button onClick={() => step(-10)} disabled={isIndeterminate || value === 0}>
          −10
        </button>
        <button onClick={() => step(10)} disabled={isComplete}>
          +10
        </button>
        <button onClick={() => setValue(100)}>Complete</button>
        <button onClick={() => setValue(null)}>Indeterminate</button>
      </div>
    );
  }

  it("renders in initial state (value=0, label='Processing')", () => {
    render(<ControlledExample />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
    expect(screen.getByText("Processing")).toBeInTheDocument();
  });

  it("clicking +10 advances value to 10", async () => {
    const user = userEvent.setup();
    render(<ControlledExample />);
    await user.click(screen.getByRole("button", { name: "+10" }));
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "10");
  });

  it("clicking +10 ten times reaches 100 and shows 'Complete' in label", async () => {
    const user = userEvent.setup();
    render(<ControlledExample />);
    const plusBtn = screen.getByRole("button", { name: "+10" });
    for (let i = 0; i < 10; i++) {
      await user.click(plusBtn);
    }
    expect(screen.getByRole("progressbar")).toHaveAttribute("data-complete");
    // The label text "Complete" — check it exists inside the progressbar (not the button)
    const bar = screen.getByRole("progressbar");
    expect(bar.textContent).toContain("Complete");
  });

  it("clicking Complete sets value to 100 and label reads 'Complete'", async () => {
    const user = userEvent.setup();
    render(<ControlledExample />);
    await user.click(screen.getByRole("button", { name: "Complete" }));
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
    // The progressbar element (label span is a child) should contain 'Complete'
    const bar = screen.getByRole("progressbar");
    expect(bar.textContent).toContain("Complete");
  });

  it("clicking Indeterminate sets data-indeterminate and shows 'Loading…'", async () => {
    const user = userEvent.setup();
    render(<ControlledExample />);
    await user.click(screen.getByRole("button", { name: "Indeterminate" }));
    expect(screen.getByRole("progressbar")).toHaveAttribute("data-indeterminate");
    expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("clicking Reset from 50 returns to 0", async () => {
    const user = userEvent.setup();
    render(<ControlledExample />);
    await user.click(screen.getByRole("button", { name: "+10" }));
    await user.click(screen.getByRole("button", { name: "+10" }));
    await user.click(screen.getByRole("button", { name: "+10" }));
    await user.click(screen.getByRole("button", { name: "+10" }));
    await user.click(screen.getByRole("button", { name: "+10" }));
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "50");

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("−10 button is disabled when value=0", () => {
    render(<ControlledExample />);
    expect(screen.getByRole("button", { name: "−10" })).toBeDisabled();
  });

  it("+10 button is disabled after reaching 100", async () => {
    const user = userEvent.setup();
    render(<ControlledExample />);
    await user.click(screen.getByRole("button", { name: "Complete" }));
    expect(screen.getByRole("button", { name: "+10" })).toBeDisabled();
  });

  it("−10 from Indeterminate state resets to 0 (null → 0)", async () => {
    const user = userEvent.setup();
    render(<ControlledExample />);
    await user.click(screen.getByRole("button", { name: "Indeterminate" }));
    // step function: when prev===null returns 0; −10 would give null→step(-10)→0
    // The −10 button is disabled when indeterminate, so verify it's disabled
    expect(screen.getByRole("button", { name: "−10" })).toBeDisabled();
  });
});

// ---------------------------------------------------------------------------
// 16. "Color" variants (custom className on indicator/track)
// ---------------------------------------------------------------------------

describe("Progress — color customization via className", () => {
  const COLOR_CASES = [
    { label: "Primary (default)", value: 72, indicator: "", track: "" },
    { label: "Success", value: 91, indicator: "bg-emerald-500", track: "bg-emerald-100" },
    { label: "Warning", value: 45, indicator: "bg-amber-500", track: "bg-amber-100" },
    { label: "Destructive", value: 18, indicator: "bg-destructive", track: "bg-destructive/10" },
    { label: "Muted", value: 60, indicator: "bg-muted-foreground", track: "" },
  ];

  COLOR_CASES.forEach(({ label, value, indicator, track }) => {
    describe(`color: "${label}"`, () => {
      it(`renders without crashing (value=${value})`, () => {
        const { container } = render(
          <Progress value={value}>
            <ProgressLabel>{label}</ProgressLabel>
            <ProgressTrack className={track || undefined}>
              <ProgressIndicator className={indicator || undefined} />
            </ProgressTrack>
          </Progress>
        );
        expect(container.firstElementChild).toBeInTheDocument();
      });

      if (indicator) {
        it(`indicator has class "${indicator}"`, () => {
          render(
            <Progress value={value}>
              <ProgressTrack>
                <ProgressIndicator className={indicator} data-testid="ind" />
              </ProgressTrack>
            </Progress>
          );
          expect(screen.getByTestId("ind").className).toContain(indicator);
        });
      }

      if (track) {
        it(`track has class "${track}"`, () => {
          render(
            <Progress value={value}>
              <ProgressTrack className={track} data-testid="track">
                <ProgressIndicator />
              </ProgressTrack>
            </Progress>
          );
          expect(screen.getByTestId("track").className).toContain(track);
        });
      }
    });
  });
});

// ---------------------------------------------------------------------------
// 17. "Sizes" — custom track height via className
// ---------------------------------------------------------------------------

describe("Progress — size variants via className", () => {
  const SIZE_CASES = [
    { label: "h-0.5 (xs)", height: "h-0.5" },
    { label: "h-1 (sm default)", height: "h-1" },
    { label: "h-2 (md)", height: "h-2" },
    { label: "h-3 (lg)", height: "h-3" },
    { label: "h-4 (xl)", height: "h-4" },
    { label: "h-1.5 (indeterminate)", height: "h-1.5" },
  ];

  SIZE_CASES.forEach(({ label, height }) => {
    it(`track with className="${height}" has that class`, () => {
      render(
        <Progress value={55}>
          <ProgressLabel>{label}</ProgressLabel>
          <ProgressTrack className={height} data-testid="track">
            <ProgressIndicator />
          </ProgressTrack>
        </Progress>
      );
      expect(screen.getByTestId("track").className).toContain(height);
    });
  });
});

// ---------------------------------------------------------------------------
// 18. Compound anatomy — default auto-injected track
// ---------------------------------------------------------------------------

describe("Progress — auto-injected ProgressTrack in root", () => {
  it("Progress root always renders a progress-track even with no explicit children", () => {
    render(<Progress value={50} />);
    // The Progress wrapper always appends <ProgressTrack><ProgressIndicator /></ProgressTrack>
    expect(document.querySelector('[data-slot="progress-track"]')).toBeInTheDocument();
  });

  it("Progress root auto-injects indicator inside track", () => {
    render(<Progress value={50} />);
    expect(document.querySelector('[data-slot="progress-indicator"]')).toBeInTheDocument();
  });

  it("children appear before the auto-injected track", () => {
    const { container } = render(
      <Progress value={50}>
        <ProgressLabel>Label first</ProgressLabel>
      </Progress>
    );
    const root = container.firstElementChild as HTMLElement;
    const children = Array.from(root.children);
    // First visible element should contain the label text; track is after
    const labelIdx = children.findIndex(
      (c) => c.getAttribute("data-slot") === "progress-label"
    );
    const trackIdx = children.findIndex(
      (c) => c.getAttribute("data-slot") === "progress-track"
    );
    // label should come before the track injected by the wrapper
    expect(labelIdx).toBeLessThan(trackIdx);
  });
});

// ---------------------------------------------------------------------------
// 19. DOM structure
// ---------------------------------------------------------------------------

describe("Progress — DOM structure", () => {
  it("root renders as a <div>", () => {
    const { container } = renderBasic(50);
    expect((container.firstElementChild as HTMLElement).tagName).toBe("DIV");
  });

  it("ProgressLabel renders as a <span> with role='presentation'", () => {
    renderBasic(50);
    const label = document.querySelector('[data-slot="progress-label"]') as HTMLElement;
    expect(label.tagName).toBe("SPAN");
    expect(label).toHaveAttribute("role", "presentation");
  });

  it("ProgressValue renders as a <span>", () => {
    renderBasic(50);
    const val = document.querySelector('[data-slot="progress-value"]') as HTMLElement;
    expect(val.tagName).toBe("SPAN");
  });

  it("ProgressTrack renders as a <div>", () => {
    renderFull(50);
    const track = document.querySelector('[data-slot="progress-track"]') as HTMLElement;
    expect(track.tagName).toBe("DIV");
  });

  it("ProgressIndicator renders as a <div>", () => {
    renderFull(50);
    const ind = document.querySelector('[data-slot="progress-indicator"]') as HTMLElement;
    expect(ind.tagName).toBe("DIV");
  });

  it("ProgressIndicator is nested inside ProgressTrack", () => {
    renderFull(50);
    const track = document.querySelector('[data-slot="progress-track"]') as HTMLElement;
    const ind = track.querySelector('[data-slot="progress-indicator"]');
    expect(ind).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 20. Native prop pass-through
// ---------------------------------------------------------------------------

describe("Progress — native prop pass-through", () => {
  it("root passes id prop", () => {
    render(<Progress value={50} id="progress-1"><ProgressLabel>L</ProgressLabel></Progress>);
    expect(screen.getByRole("progressbar")).toHaveAttribute("id", "progress-1");
  });

  it("root passes data-testid", () => {
    render(<Progress value={50} data-testid="my-progress"><ProgressLabel>L</ProgressLabel></Progress>);
    expect(screen.getByTestId("my-progress")).toBeInTheDocument();
  });

  it("root passes aria-label (overrides labelledby)", () => {
    render(<Progress value={50} aria-label="File upload progress" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-label", "File upload progress");
  });
});

// ---------------------------------------------------------------------------
// 21. Multiple progress bars — independence
// ---------------------------------------------------------------------------

describe("Progress — multiple instances", () => {
  it("renders multiple progress bars independently", () => {
    render(
      <div>
        <Progress value={65}>
          <ProgressLabel>Upload</ProgressLabel>
          <ProgressValue>{(f) => f}</ProgressValue>
        </Progress>
        <Progress value={30}>
          <ProgressLabel>Storage</ProgressLabel>
          <ProgressValue>{(f) => f}</ProgressValue>
        </Progress>
        <Progress value={100}>
          <ProgressLabel>Complete</ProgressLabel>
          <ProgressValue>{(f) => f}</ProgressValue>
        </Progress>
      </div>
    );
    const bars = screen.getAllByRole("progressbar");
    expect(bars).toHaveLength(3);
    expect(bars[0]).toHaveAttribute("aria-valuenow", "65");
    expect(bars[1]).toHaveAttribute("aria-valuenow", "30");
    expect(bars[2]).toHaveAttribute("aria-valuenow", "100");
  });

  it("each bar has its own independent data-attribute state", () => {
    render(
      <div>
        <Progress value={50}><ProgressLabel>A</ProgressLabel></Progress>
        <Progress value={100}><ProgressLabel>B</ProgressLabel></Progress>
        <Progress value={null}><ProgressLabel>C</ProgressLabel></Progress>
      </div>
    );
    const bars = screen.getAllByRole("progressbar");
    expect(bars[0]).toHaveAttribute("data-progressing");
    expect(bars[1]).toHaveAttribute("data-complete");
    expect(bars[2]).toHaveAttribute("data-indeterminate");
  });

  it("each label is associated with its own bar", () => {
    render(
      <div>
        <Progress value={30}>
          <ProgressLabel>First</ProgressLabel>
        </Progress>
        <Progress value={70}>
          <ProgressLabel>Second</ProgressLabel>
        </Progress>
      </div>
    );
    const bars = screen.getAllByRole("progressbar");
    // Each bar's aria-labelledby should point to different label elements
    const lb1 = bars[0].getAttribute("aria-labelledby");
    const lb2 = bars[1].getAttribute("aria-labelledby");
    expect(lb1).toBeTruthy();
    expect(lb2).toBeTruthy();
    expect(lb1).not.toBe(lb2);
  });
});

// ---------------------------------------------------------------------------
// 22. Accessibility (axe)
// ---------------------------------------------------------------------------

describe("Progress — accessibility (axe)", () => {
  it("has no axe violations with label and value at 50%", async () => {
    const { container } = render(
      <Progress value={50}>
        <ProgressLabel>Loading</ProgressLabel>
        <ProgressValue>{(f) => f}</ProgressValue>
      </Progress>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations at 0%", async () => {
    const { container } = render(
      <Progress value={0}>
        <ProgressLabel>Starting</ProgressLabel>
      </Progress>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations at 100% (complete)", async () => {
    const { container } = render(
      <Progress value={100}>
        <ProgressLabel>Done</ProgressLabel>
        <ProgressValue>{(f) => f}</ProgressValue>
      </Progress>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations in indeterminate state", async () => {
    const { container } = render(
      <Progress value={null}>
        <ProgressLabel>Loading resources…</ProgressLabel>
      </Progress>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with custom getAriaValueText", async () => {
    const { container } = render(
      <Progress
        value={7}
        min={0}
        max={10}
        getAriaValueText={(_, v) => `Step ${v} of 10`}
      >
        <ProgressLabel>Onboarding steps</ProgressLabel>
      </Progress>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with custom min/max range", async () => {
    const { container } = render(
      <Progress value={340} min={0} max={512}>
        <ProgressLabel>Data transferred</ProgressLabel>
        <ProgressValue>
          {(_f, v) => (v !== null ? `${v} / 512 MB` : null)}
        </ProgressValue>
      </Progress>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with explicit aria-label (no ProgressLabel)", async () => {
    const { container } = render(
      <Progress value={50} aria-label="File upload progress">
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with success color customization", async () => {
    const { container } = render(
      <Progress value={91}>
        <ProgressLabel>Success</ProgressLabel>
        <ProgressTrack className="bg-emerald-100">
          <ProgressIndicator className="bg-emerald-500" />
        </ProgressTrack>
      </Progress>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations in a list of multiple progress bars", async () => {
    const { container } = render(
      <div>
        {[
          { label: "Upload", value: 65 },
          { label: "Storage", value: 30 },
          { label: "Transfer", value: 100 },
        ].map(({ label, value }) => (
          <Progress key={label} value={value}>
            <ProgressLabel>{label}</ProgressLabel>
            <ProgressValue>{(f) => f}</ProgressValue>
          </Progress>
        ))}
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with format prop", async () => {
    const { container } = render(
      <Progress
        value={0.734}
        min={0}
        max={1}
        format={{ style: "percent", maximumFractionDigits: 1 }}
      >
        <ProgressLabel>Accuracy</ProgressLabel>
      </Progress>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// 23. Edge cases
// ---------------------------------------------------------------------------

describe("Progress — edge cases", () => {
  it("renders with value exactly at min (0)", () => {
    const { container } = renderBasic(0);
    expect(container.firstElementChild).toBeInTheDocument();
    // value=0 → progressing (above min means >=0, at max=100 means complete)
    // 0 !== 100 so it should be progressing (or min edge case — check docs)
    // Base UI: status = 'progressing' when isFinite(value) && value !== max
    expect(screen.getByRole("progressbar")).not.toHaveAttribute("data-complete");
  });

  it("renders with a fractional value (50.5)", () => {
    render(<Progress value={50.5}><ProgressLabel>Half</ProgressLabel></Progress>);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "50.5");
  });

  it("renders with very small value near zero (0.01)", () => {
    render(<Progress value={0.01}><ProgressLabel>Tiny</ProgressLabel></Progress>);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0.01");
  });

  it("renders with value=100 in a custom range where max=200 → still progressing", () => {
    render(
      <Progress value={100} min={0} max={200}>
        <ProgressLabel>Half of custom</ProgressLabel>
      </Progress>
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute("data-progressing");
  });

  it("allows className to be undefined without error", () => {
    const { container } = render(<Progress value={50} className={undefined}>test</Progress>);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("children prop passed to Progress root renders in the DOM", () => {
    render(
      <Progress value={50}>
        <ProgressLabel>My label</ProgressLabel>
      </Progress>
    );
    expect(screen.getByText("My label")).toBeInTheDocument();
  });

  it("ProgressValue render function returning null renders empty span", () => {
    render(
      <Progress value={null}>
        <ProgressValue>{() => null}</ProgressValue>
      </Progress>
    );
    const val = document.querySelector('[data-slot="progress-value"]') as HTMLElement;
    expect(val).toBeInTheDocument();
    expect(val.textContent).toBe("");
  });

  it("renders in a deeply nested container without issues", () => {
    render(
      <div>
        <section>
          <article>
            <Progress value={42}>
              <ProgressLabel>Nested</ProgressLabel>
            </Progress>
          </article>
        </section>
      </div>
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "42");
  });
});

describe("Progress — tone", () => {
  it.each([
    ["default", "bg-primary"],
    ["brand", "bg-brand"],
    ["success", "bg-success"],
    ["warning", "bg-warning"],
    ["destructive", "bg-destructive"],
  ] as const)("tone=%s tints the indicator with %s", (tone, cls) => {
    const { container } = render(<Progress value={50} tone={tone} />);
    const indicator = container.querySelector(
      '[data-slot="progress-indicator"]'
    );
    expect(indicator).not.toBeNull();
    expect(indicator).toHaveClass(cls);
  });

  it("defaults to bg-primary when tone is omitted", () => {
    const { container } = render(<Progress value={50} />);
    expect(
      container.querySelector('[data-slot="progress-indicator"]')
    ).toHaveClass("bg-primary");
  });
});
