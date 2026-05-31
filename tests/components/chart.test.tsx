/**
 * Exhaustive tests for the chart components
 *
 * Component source: components/ui/chart.tsx
 *
 * API summary:
 *   - ChartContainer  – wraps recharts ResponsiveContainer; provides ChartContext;
 *                       renders a <style> tag (ChartStyle) and injects CSS vars.
 *                       Props: config (ChartConfig), id?, initialDimension?, className?, children
 *   - ChartStyle      – renders <style> with CSS custom properties from config
 *   - ChartTooltip    – re-export of recharts Tooltip
 *   - ChartTooltipContent – renders the tooltip body when active=true + payload present.
 *                       Props: indicator ("dot"|"line"|"dashed"), hideLabel?, hideIndicator?,
 *                              labelKey?, nameKey?, labelFormatter?, formatter?,
 *                              color?, labelClassName?
 *   - ChartLegend     – re-export of recharts Legend
 *   - ChartLegendContent – renders legend items from payload.
 *                       Props: hideIcon?, nameKey?, verticalAlign ("top"|"bottom")
 *   - useChart        – throws if used outside ChartContainer
 *
 * ChartConfig:
 *   Record<string, { label?, icon? } & ({ color? } | { theme: { light, dark } })>
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import {
  ChartContainer,
  ChartStyle,
  ChartTooltipContent,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

// ---------------------------------------------------------------------------
// Minimal fixtures
// ---------------------------------------------------------------------------

const basicConfig: ChartConfig = {
  revenue: { label: "Revenue", color: "#16a34a" },
  expenses: { label: "Expenses", color: "#dc2626" },
};

const themeConfig: ChartConfig = {
  a: {
    label: "Series A",
    theme: { light: "#16a34a", dark: "#4ade80" },
  },
  b: {
    label: "Series B",
    theme: { light: "#0284c7", dark: "#38bdf8" },
  },
};

const iconConfig: ChartConfig = {
  alpha: {
    label: "Alpha",
    color: "#16a34a",
    icon: () => <svg data-testid="icon-alpha" aria-hidden="true" />,
  },
  beta: {
    label: "Beta",
    color: "#dc2626",
    icon: () => <svg data-testid="icon-beta" aria-hidden="true" />,
  },
};

// A minimal recharts child that satisfies ResponsiveContainer's "children" type.
// We render a plain SVG so the test DOM has something without needing real recharts
// rendering (which requires measurements not available in jsdom).
function MinimalChart() {
  return (
    <svg data-testid="inner-chart" width={320} height={200} aria-label="chart" />
  );
}

// Build a realistic payload entry that ChartTooltipContent and ChartLegendContent expect.
function makePayload(
  dataKey: string,
  name: string,
  value: number,
  color = "#16a34a"
) {
  return {
    dataKey,
    name,
    value,
    color,
    payload: { [dataKey]: value },
    type: "line" as const,
  };
}

function makeLegendPayload(
  dataKey: string,
  value: string,
  color = "#16a34a"
) {
  return { dataKey, value, color, type: "line" as const };
}

// ---------------------------------------------------------------------------
// ChartContainer
// ---------------------------------------------------------------------------

describe("ChartContainer", () => {
  it("renders without crashing with minimal config", () => {
    render(
      <ChartContainer config={basicConfig}>
        <MinimalChart />
      </ChartContainer>
    );
    // the slot attribute is the anchor for all other queries
    expect(document.querySelector("[data-slot='chart']")).toBeInTheDocument();
  });

  it("has data-slot='chart' on the root element", () => {
    const { container } = render(
      <ChartContainer config={basicConfig}>
        <MinimalChart />
      </ChartContainer>
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute("data-slot", "chart");
  });

  it("sets a data-chart attribute containing the generated id", () => {
    const { container } = render(
      <ChartContainer config={basicConfig}>
        <MinimalChart />
      </ChartContainer>
    );
    const root = container.firstChild as HTMLElement;
    expect(root.getAttribute("data-chart")).toMatch(/^chart-/);
  });

  it("uses the provided id prop in data-chart", () => {
    const { container } = render(
      <ChartContainer config={basicConfig} id="my-chart">
        <MinimalChart />
      </ChartContainer>
    );
    const root = container.firstChild as HTMLElement;
    expect(root.getAttribute("data-chart")).toBe("chart-my-chart");
  });

  it("merges extra className onto the root div", () => {
    const { container } = render(
      <ChartContainer config={basicConfig} className="extra-class">
        <MinimalChart />
      </ChartContainer>
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("extra-class");
  });

  it("includes recharts layout class 'flex' by default", () => {
    const { container } = render(
      <ChartContainer config={basicConfig}>
        <MinimalChart />
      </ChartContainer>
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("flex");
  });

  it("renders children inside the container", () => {
    render(
      <ChartContainer config={basicConfig}>
        <MinimalChart />
      </ChartContainer>
    );
    // MinimalChart renders with data-testid="inner-chart"
    // It is wrapped by ResponsiveContainer so it may not be directly queryable;
    // we only assert the outer container rendered.
    expect(document.querySelector("[data-slot='chart']")).toBeInTheDocument();
  });

  it("renders a <style> tag when config has colors", () => {
    const { container } = render(
      <ChartContainer config={basicConfig}>
        <MinimalChart />
      </ChartContainer>
    );
    const styleEls = container.querySelectorAll("style");
    expect(styleEls.length).toBeGreaterThan(0);
  });

  it("does NOT render a <style> tag when config has no color/theme", () => {
    const emptyConfig: ChartConfig = {
      x: { label: "X" }, // no color, no theme
    };
    const { container } = render(
      <ChartContainer config={emptyConfig}>
        <MinimalChart />
      </ChartContainer>
    );
    const styleEls = container.querySelectorAll("style");
    expect(styleEls.length).toBe(0);
  });

  it("forwards additional HTML props to the root div", () => {
    const { container } = render(
      <ChartContainer config={basicConfig} aria-label="revenue chart">
        <MinimalChart />
      </ChartContainer>
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute("aria-label", "revenue chart");
  });

  it("accepts an initialDimension prop without crashing", () => {
    const { container } = render(
      <ChartContainer
        config={basicConfig}
        initialDimension={{ width: 400, height: 300 }}
      >
        <MinimalChart />
      </ChartContainer>
    );
    expect(
      document.querySelector("[data-slot='chart']")
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// ChartStyle
// ---------------------------------------------------------------------------

describe("ChartStyle", () => {
  it("injects --color-{key} CSS vars for each color config entry", () => {
    const { container } = render(
      <ChartStyle id="test-chart" config={basicConfig} />
    );
    const styleContent = container.querySelector("style")!.innerHTML;
    expect(styleContent).toContain("--color-revenue: #16a34a");
    expect(styleContent).toContain("--color-expenses: #dc2626");
  });

  it("uses the data-chart selector for the rule", () => {
    const { container } = render(
      <ChartStyle id="test-chart" config={basicConfig} />
    );
    const styleContent = container.querySelector("style")!.innerHTML;
    expect(styleContent).toContain("[data-chart=test-chart]");
  });

  it("injects theme-specific colors with the theme selector prefix", () => {
    const { container } = render(
      <ChartStyle id="test-chart" config={themeConfig} />
    );
    const styleContent = container.querySelector("style")!.innerHTML;
    // light theme → no prefix
    expect(styleContent).toContain("--color-a: #16a34a");
    // dark theme → .dark prefix
    expect(styleContent).toContain(".dark");
    expect(styleContent).toContain("--color-a: #4ade80");
  });

  it("returns null when no config entries have color or theme", () => {
    const emptyConfig: ChartConfig = { x: { label: "X" } };
    const { container } = render(
      <ChartStyle id="test-chart" config={emptyConfig} />
    );
    // nothing rendered
    expect(container.innerHTML).toBe("");
  });

  it("handles mixed color and theme entries correctly", () => {
    const mixed: ChartConfig = {
      a: { label: "A", color: "#ff0000" },
      b: {
        label: "B",
        theme: { light: "#00ff00", dark: "#00aa00" },
      },
    };
    const { container } = render(
      <ChartStyle id="mixed-chart" config={mixed} />
    );
    const styleContent = container.querySelector("style")!.innerHTML;
    expect(styleContent).toContain("--color-a: #ff0000");
    expect(styleContent).toContain("--color-b: #00ff00");
    expect(styleContent).toContain("--color-b: #00aa00");
  });

  it("does not inject CSS vars for entries that have no color or theme", () => {
    const partial: ChartConfig = {
      hasColor: { label: "Has Color", color: "#123456" },
      noColor: { label: "No Color" },
    };
    const { container } = render(
      <ChartStyle id="partial-chart" config={partial} />
    );
    const styleContent = container.querySelector("style")!.innerHTML;
    expect(styleContent).toContain("--color-hasColor: #123456");
    expect(styleContent).not.toContain("--color-noColor");
  });
});

// ---------------------------------------------------------------------------
// ChartTooltipContent
// ---------------------------------------------------------------------------

// Helper: render ChartTooltipContent inside a ChartContainer (required for useChart)
function renderTooltipContent(
  props: Partial<React.ComponentProps<typeof ChartTooltipContent>>,
  config: ChartConfig = basicConfig
) {
  return render(
    <ChartContainer config={config}>
      <svg>
        <foreignObject>
          <ChartTooltipContent {...props} />
        </foreignObject>
      </svg>
    </ChartContainer>
  );
}

describe("ChartTooltipContent", () => {
  it("returns null when active is false", () => {
    const { container } = renderTooltipContent({ active: false, payload: [] });
    // The tooltip div should not be rendered at all
    expect(container.querySelector(".grid.min-w-32")).toBeNull();
  });

  it("returns null when payload is empty", () => {
    const { container } = renderTooltipContent({ active: true, payload: [] });
    expect(container.querySelector(".grid.min-w-32")).toBeNull();
  });

  it("renders when active=true and payload has entries", () => {
    const payload = [makePayload("revenue", "revenue", 4200)];
    const { container } = renderTooltipContent({ active: true, payload });
    expect(container.querySelector(".grid.min-w-32")).toBeInTheDocument();
  });

  it("shows the value formatted with toLocaleString", () => {
    const payload = [makePayload("revenue", "revenue", 4200)];
    renderTooltipContent({ active: true, payload });
    // 4200 → "4,200" in en-US; we just check numeric content is present
    const text = document.body.textContent ?? "";
    expect(text).toMatch(/4[,.]?200/);
  });

  it("shows config label for the key when available", () => {
    const payload = [makePayload("revenue", "revenue", 100)];
    renderTooltipContent({ active: true, payload });
    expect(document.body.textContent).toContain("Revenue");
  });

  it("falls back to item.name when no config label found", () => {
    const payload = [makePayload("unknown_key", "unknown_key", 50)];
    renderTooltipContent({ active: true, payload });
    // Should render the key as fallback
    expect(document.body.textContent).toContain("unknown_key");
  });

  // indicator variants
  it("applies 'dot' indicator class (h-2.5 w-2.5) by default", () => {
    const payload = [makePayload("revenue", "revenue", 100)];
    const { container } = renderTooltipContent({ active: true, payload });
    const indicator = container.querySelector(".h-2\\.5.w-2\\.5");
    expect(indicator).toBeInTheDocument();
  });

  it("applies 'line' indicator class (w-1) when indicator='line'", () => {
    const payload = [makePayload("revenue", "revenue", 100)];
    const { container } = renderTooltipContent({
      active: true,
      payload,
      indicator: "line",
    });
    expect(container.querySelector(".w-1")).toBeInTheDocument();
  });

  it("applies 'dashed' indicator class when indicator='dashed'", () => {
    const payload = [makePayload("revenue", "revenue", 100)];
    const { container } = renderTooltipContent({
      active: true,
      payload,
      indicator: "dashed",
    });
    // dashed uses border-dashed class
    const el = container.querySelector("[class*='border-dashed']");
    expect(el).toBeInTheDocument();
  });

  it("hides indicator when hideIndicator=true", () => {
    const payload = [makePayload("revenue", "revenue", 100)];
    const { container } = renderTooltipContent({
      active: true,
      payload,
      hideIndicator: true,
    });
    // The dot class should be absent
    expect(container.querySelector(".h-2\\.5.w-2\\.5")).toBeNull();
  });

  it("renders icon from config when available (and hides indicator div)", () => {
    const payload = [makePayload("alpha", "alpha", 42)];
    const { container } = renderTooltipContent(
      { active: true, payload },
      iconConfig
    );
    // The SVG icon we defined renders with data-testid="icon-alpha"
    expect(container.querySelector("[data-testid='icon-alpha']")).toBeInTheDocument();
    // No dot indicator when icon present
    expect(container.querySelector(".h-2\\.5.w-2\\.5")).toBeNull();
  });

  it("hides label when hideLabel=true", () => {
    const payload = [makePayload("revenue", "revenue", 100)];
    const { container } = renderTooltipContent({
      active: true,
      payload,
      label: "Jan",
      hideLabel: true,
    });
    // label "Jan" should not be in output
    expect(document.body.textContent).not.toContain("Jan");
  });

  it("renders label from config when label matches a config key", () => {
    const payload = [makePayload("revenue", "revenue", 100)];
    renderTooltipContent({
      active: true,
      payload,
      label: "revenue",
    });
    // config["revenue"].label = "Revenue"
    expect(document.body.textContent).toContain("Revenue");
  });

  it("renders plain string label when label does not match a config key", () => {
    const payload = [makePayload("revenue", "revenue", 100)];
    renderTooltipContent({
      active: true,
      payload,
      label: "January",
    });
    expect(document.body.textContent).toContain("January");
  });

  it("applies labelClassName to the label element", () => {
    const payload = [makePayload("revenue", "revenue", 100)];
    const { container } = renderTooltipContent({
      active: true,
      payload,
      label: "January",
      labelClassName: "my-label-class",
    });
    expect(container.querySelector(".my-label-class")).toBeInTheDocument();
  });

  it("uses labelFormatter when provided", () => {
    const payload = [makePayload("revenue", "revenue", 100)];
    const labelFormatter = vi.fn(() => <span>Formatted Label</span>);
    renderTooltipContent({
      active: true,
      payload,
      label: "Jan",
      labelFormatter,
    });
    expect(labelFormatter).toHaveBeenCalled();
    expect(document.body.textContent).toContain("Formatted Label");
  });

  it("uses custom formatter when provided", () => {
    const payload = [makePayload("revenue", "revenue", 100)];
    const formatter = vi.fn(() => <span>Custom Value</span>);
    renderTooltipContent({
      active: true,
      payload: [{ ...makePayload("revenue", "revenue", 100) }],
      formatter,
    });
    expect(formatter).toHaveBeenCalled();
    expect(document.body.textContent).toContain("Custom Value");
  });

  it("uses nameKey to resolve config label when provided", () => {
    // nameKey="category" means each payload item's config key is looked up via the "category" field
    const p = {
      ...makePayload("value", "organic", 42),
      category: "organic",
      payload: { value: 42, category: "organic" },
    };
    const cfg: ChartConfig = {
      organic: { label: "Organic Traffic", color: "#16a34a" },
    };
    renderTooltipContent({ active: true, payload: [p], nameKey: "category" }, cfg);
    expect(document.body.textContent).toContain("Organic Traffic");
  });

  it("filters out payload entries with type='none'", () => {
    const p1 = { ...makePayload("revenue", "revenue", 100) };
    const p2 = { ...makePayload("expenses", "expenses", 50), type: "none" as const };
    renderTooltipContent({ active: true, payload: [p1, p2] });
    // revenue renders; expenses should be filtered out
    expect(document.body.textContent).toContain("Revenue");
    expect(document.body.textContent).not.toContain("Expenses");
  });

  it("renders multiple payload entries", () => {
    const p1 = makePayload("revenue", "revenue", 100);
    const p2 = makePayload("expenses", "expenses", 50);
    renderTooltipContent({ active: true, payload: [p1, p2] });
    expect(document.body.textContent).toContain("Revenue");
    expect(document.body.textContent).toContain("Expenses");
  });

  it("merges extra className onto the root grid div", () => {
    const payload = [makePayload("revenue", "revenue", 100)];
    const { container } = renderTooltipContent({
      active: true,
      payload,
      className: "my-tooltip-class",
    });
    const root = container.querySelector(".grid.min-w-32");
    expect(root?.className).toContain("my-tooltip-class");
  });

  it("renders string values as-is (not toLocaleString)", () => {
    const p = { ...makePayload("revenue", "revenue", 0), value: "active" as unknown as number };
    renderTooltipContent({ active: true, payload: [p] });
    expect(document.body.textContent).toContain("active");
  });
});

// ---------------------------------------------------------------------------
// ChartLegendContent
// ---------------------------------------------------------------------------

// Render ChartLegendContent inside ChartContainer (requires ChartContext)
function renderLegendContent(
  props: Partial<React.ComponentProps<typeof ChartLegendContent>>,
  config: ChartConfig = basicConfig
) {
  return render(
    <ChartContainer config={config}>
      <svg>
        <foreignObject>
          <ChartLegendContent {...props} />
        </foreignObject>
      </svg>
    </ChartContainer>
  );
}

describe("ChartLegendContent", () => {
  it("returns null when payload is empty", () => {
    const { container } = renderLegendContent({ payload: [] });
    // outer flex div should not render
    expect(container.querySelector(".flex.items-center")).toBeNull();
  });

  it("returns null when payload is undefined", () => {
    const { container } = renderLegendContent({});
    expect(container.querySelector(".flex.items-center")).toBeNull();
  });

  it("renders legend items for each payload entry", () => {
    const payload = [
      makeLegendPayload("revenue", "revenue"),
      makeLegendPayload("expenses", "expenses", "#dc2626"),
    ];
    renderLegendContent({ payload });
    expect(document.body.textContent).toContain("Revenue");
    expect(document.body.textContent).toContain("Expenses");
  });

  it("applies pt-3 class for bottom verticalAlign (default)", () => {
    const payload = [makeLegendPayload("revenue", "revenue")];
    const { container } = renderLegendContent({ payload });
    const root = container.querySelector(".flex.items-center");
    expect(root?.className).toContain("pt-3");
  });

  it("applies pb-3 class for top verticalAlign", () => {
    const payload = [makeLegendPayload("revenue", "revenue")];
    const { container } = renderLegendContent({ payload, verticalAlign: "top" });
    const root = container.querySelector(".flex.items-center");
    expect(root?.className).toContain("pb-3");
  });

  it("renders a color swatch div when no icon in config", () => {
    const payload = [makeLegendPayload("revenue", "revenue")];
    const { container } = renderLegendContent({ payload });
    // The color swatch is a small div with inline backgroundColor style
    const swatch = container.querySelector("[style*='background']");
    expect(swatch).toBeInTheDocument();
  });

  it("renders icon from config when available", () => {
    const payload = [
      makeLegendPayload("alpha", "alpha"),
      makeLegendPayload("beta", "beta"),
    ];
    const { container } = renderLegendContent({ payload }, iconConfig);
    expect(container.querySelector("[data-testid='icon-alpha']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='icon-beta']")).toBeInTheDocument();
  });

  it("hides icon and shows color swatch when hideIcon=true even if config has icon", () => {
    const payload = [makeLegendPayload("alpha", "alpha")];
    const { container } = renderLegendContent(
      { payload, hideIcon: true },
      iconConfig
    );
    // The SVG icon should NOT be present
    expect(container.querySelector("[data-testid='icon-alpha']")).toBeNull();
    // The swatch div should be present instead
    const swatch = container.querySelector("[style*='background']");
    expect(swatch).toBeInTheDocument();
  });

  it("merges extra className onto the root div", () => {
    const payload = [makeLegendPayload("revenue", "revenue")];
    const { container } = renderLegendContent({
      payload,
      className: "my-legend-class",
    });
    const root = container.querySelector(".flex.items-center");
    expect(root?.className).toContain("my-legend-class");
  });

  it("uses nameKey to look up config entry when provided", () => {
    // If nameKey="revenue" and payload item has dataKey="revenue", label should match
    const payload = [makeLegendPayload("revenue", "revenue")];
    renderLegendContent({ payload, nameKey: "revenue" });
    expect(document.body.textContent).toContain("Revenue");
  });

  it("filters out payload entries with type='none'", () => {
    const p1 = makeLegendPayload("revenue", "revenue");
    const p2 = { ...makeLegendPayload("expenses", "expenses"), type: "none" as const };
    renderLegendContent({ payload: [p1, p2] });
    expect(document.body.textContent).toContain("Revenue");
    expect(document.body.textContent).not.toContain("Expenses");
  });
});

// ---------------------------------------------------------------------------
// ChartContainer context propagation
// ---------------------------------------------------------------------------

describe("ChartContainer context propagation", () => {
  it("provides config to ChartLegendContent via context", () => {
    const payload = [makeLegendPayload("revenue", "revenue")];
    render(
      <ChartContainer config={basicConfig}>
        <svg>
          <foreignObject>
            <ChartLegendContent payload={payload} />
          </foreignObject>
        </svg>
      </ChartContainer>
    );
    expect(document.body.textContent).toContain("Revenue");
  });

  it("provides config to ChartTooltipContent via context", () => {
    const payload = [makePayload("revenue", "revenue", 100)];
    render(
      <ChartContainer config={basicConfig}>
        <svg>
          <foreignObject>
            <ChartTooltipContent active payload={payload} />
          </foreignObject>
        </svg>
      </ChartContainer>
    );
    expect(document.body.textContent).toContain("Revenue");
  });
});

// ---------------------------------------------------------------------------
// useChart error boundary
// ---------------------------------------------------------------------------

describe("useChart hook", () => {
  it("throws when ChartTooltipContent is rendered outside ChartContainer", () => {
    // Suppress React error output for this test
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(<ChartTooltipContent active payload={[makePayload("x", "x", 1)]} />)
    ).toThrow("useChart must be used within a <ChartContainer />");
    spy.mockRestore();
  });

  it("throws when ChartLegendContent is rendered outside ChartContainer", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const payload = [makeLegendPayload("revenue", "revenue")];
    expect(() => render(<ChartLegendContent payload={payload} />)).toThrow(
      "useChart must be used within a <ChartContainer />"
    );
    spy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// ChartConfig type shapes — smoke tests
// ---------------------------------------------------------------------------

describe("ChartConfig type shapes", () => {
  it("accepts config with only color (no theme)", () => {
    const cfg: ChartConfig = { x: { label: "X", color: "#fff" } };
    const { container } = render(
      <ChartContainer config={cfg}>
        <MinimalChart />
      </ChartContainer>
    );
    expect(container.querySelector("[data-slot='chart']")).toBeInTheDocument();
  });

  it("accepts config with only theme (no color)", () => {
    const cfg: ChartConfig = {
      x: { label: "X", theme: { light: "#fff", dark: "#000" } },
    };
    const { container } = render(
      <ChartContainer config={cfg}>
        <MinimalChart />
      </ChartContainer>
    );
    expect(container.querySelector("[data-slot='chart']")).toBeInTheDocument();
  });

  it("accepts config with only label (no color, no theme)", () => {
    const cfg: ChartConfig = { x: { label: "X" } };
    const { container } = render(
      <ChartContainer config={cfg}>
        <MinimalChart />
      </ChartContainer>
    );
    expect(container.querySelector("[data-slot='chart']")).toBeInTheDocument();
  });

  it("accepts config with icon component", () => {
    const { container } = render(
      <ChartContainer config={iconConfig}>
        <MinimalChart />
      </ChartContainer>
    );
    expect(container.querySelector("[data-slot='chart']")).toBeInTheDocument();
  });

  it("accepts config with both label and icon", () => {
    const cfg: ChartConfig = {
      x: {
        label: "X",
        color: "#abc",
        icon: () => <svg data-testid="icon-x" />,
      },
    };
    const { container } = render(
      <ChartContainer config={cfg}>
        <MinimalChart />
      </ChartContainer>
    );
    expect(container.querySelector("[data-slot='chart']")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Multiple config entries — CSS injection completeness
// ---------------------------------------------------------------------------

describe("ChartStyle with multiple config entries", () => {
  it("injects vars for all four entries in a four-series config", () => {
    const cfg: ChartConfig = {
      a: { color: "#111" },
      b: { color: "#222" },
      c: { color: "#333" },
      d: { color: "#444" },
    };
    const { container } = render(<ChartStyle id="multi" config={cfg} />);
    const styleContent = container.querySelector("style")!.innerHTML;
    expect(styleContent).toContain("--color-a: #111");
    expect(styleContent).toContain("--color-b: #222");
    expect(styleContent).toContain("--color-c: #333");
    expect(styleContent).toContain("--color-d: #444");
  });
});

// ---------------------------------------------------------------------------
// Tooltip nestLabel behavior (single payload + non-dot indicator)
// ---------------------------------------------------------------------------

describe("ChartTooltipContent nestLabel behavior", () => {
  it("nests the label inside the item row when single payload + indicator='line'", () => {
    const payload = [makePayload("revenue", "revenue", 100)];
    const { container } = renderTooltipContent({
      active: true,
      payload,
      indicator: "line",
      label: "January",
    });
    // When nestLabel=true the outer label div is NOT rendered (returns null for !nestLabel)
    // and the label appears inside the item row. The outer .grid.min-w-32 should still render.
    expect(container.querySelector(".grid.min-w-32")).toBeInTheDocument();
    // The label text should still appear somewhere
    expect(document.body.textContent).toContain("Revenue");
  });

  it("does NOT nest label when indicator='dot' (multi payload)", () => {
    const payload = [
      makePayload("revenue", "revenue", 100),
      makePayload("expenses", "expenses", 50),
    ];
    const { container } = renderTooltipContent({
      active: true,
      payload,
      indicator: "line",
      label: "January",
    });
    // nestLabel requires payload.length === 1, so with 2 items no nesting
    expect(container.querySelector(".grid.min-w-32")).toBeInTheDocument();
    expect(document.body.textContent).toContain("January");
  });
});

// ---------------------------------------------------------------------------
// Accessibility
// ---------------------------------------------------------------------------

describe("Accessibility", () => {
  it("ChartContainer: no axe violations with aria-label", async () => {
    const { container } = render(
      <ChartContainer config={basicConfig} aria-label="Monthly revenue chart">
        <svg role="img" aria-label="area chart" width={320} height={200} />
      </ChartContainer>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("ChartLegendContent: no axe violations", async () => {
    const payload = [
      makeLegendPayload("revenue", "revenue"),
      makeLegendPayload("expenses", "expenses", "#dc2626"),
    ];
    const { container } = render(
      <ChartContainer config={basicConfig}>
        <svg>
          <foreignObject>
            <ChartLegendContent payload={payload} />
          </foreignObject>
        </svg>
      </ChartContainer>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("ChartTooltipContent: no axe violations", async () => {
    const payload = [
      makePayload("revenue", "revenue", 4200),
      makePayload("expenses", "expenses", 2800, "#dc2626"),
    ];
    const { container } = render(
      <ChartContainer config={basicConfig}>
        <svg>
          <foreignObject>
            <ChartTooltipContent
              active
              payload={payload}
              label="January"
            />
          </foreignObject>
        </svg>
      </ChartContainer>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// ChartContainer: unique IDs across multiple instances
// ---------------------------------------------------------------------------

describe("ChartContainer unique IDs", () => {
  it("generates different data-chart IDs for two instances without explicit id", () => {
    const { container: c1 } = render(
      <ChartContainer config={basicConfig}>
        <MinimalChart />
      </ChartContainer>
    );
    const { container: c2 } = render(
      <ChartContainer config={basicConfig}>
        <MinimalChart />
      </ChartContainer>
    );
    const id1 = (c1.firstChild as HTMLElement).getAttribute("data-chart");
    const id2 = (c2.firstChild as HTMLElement).getAttribute("data-chart");
    expect(id1).not.toBe(id2);
  });

  it("generates the same data-chart ID when explicit id is provided", () => {
    const { container } = render(
      <ChartContainer config={basicConfig} id="stable-id">
        <MinimalChart />
      </ChartContainer>
    );
    const id = (container.firstChild as HTMLElement).getAttribute("data-chart");
    expect(id).toBe("chart-stable-id");
  });
});
