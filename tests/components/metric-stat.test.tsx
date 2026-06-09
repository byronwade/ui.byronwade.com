import { render, screen, within } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import { axe } from "vitest-axe";
import { Activity, Users, ShoppingCart, TrendingUp, Star, Database, Clock, Globe } from "lucide-react";
import { MetricStat, DeltaPill, type Delta } from "@/components/metric-stat";

// ---------------------------------------------------------------------------
// DeltaPill unit tests
// ---------------------------------------------------------------------------
describe("DeltaPill", () => {
  it("renders the value text", () => {
    render(<DeltaPill delta={{ value: "+12.4%", direction: "up" }} />);
    expect(screen.getByText("+12.4%")).toBeInTheDocument();
  });

  it("direction=up: renders ArrowUp icon (svg present) and success classes", () => {
    const { container } = render(
      <DeltaPill delta={{ value: "+5%", direction: "up" }} />
    );
    const pill = container.querySelector("span");
    expect(pill).toHaveClass("bg-success/10");
    expect(pill).toHaveClass("text-success");
    // ArrowUp icon renders as an SVG
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("direction=down: renders ArrowDown icon and destructive classes", () => {
    const { container } = render(
      <DeltaPill delta={{ value: "+0.2%", direction: "down" }} />
    );
    const pill = container.querySelector("span");
    expect(pill).toHaveClass("bg-destructive/10");
    expect(pill).toHaveClass("text-destructive");
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("direction=flat: renders no icon and muted classes", () => {
    const { container } = render(
      <DeltaPill delta={{ value: "0.0%", direction: "flat" }} />
    );
    const pill = container.querySelector("span");
    expect(pill).toHaveClass("bg-muted");
    expect(pill).toHaveClass("text-muted-foreground");
    // flat direction renders no icon
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("renders rounded-full pill shape and sizing classes", () => {
    const { container } = render(
      <DeltaPill delta={{ value: "+1%", direction: "up" }} />
    );
    const pill = container.querySelector("span");
    expect(pill).toHaveClass("rounded-full");
    expect(pill).toHaveClass("px-1.5");
    expect(pill).toHaveClass("py-0.5");
    expect(pill).toHaveClass("text-xs");
    expect(pill).toHaveClass("font-medium");
    expect(pill).toHaveClass("tabular-nums");
  });

  it("accepts a custom className and merges it", () => {
    const { container } = render(
      <DeltaPill delta={{ value: "+1%", direction: "up" }} className="my-custom-class" />
    );
    expect(container.querySelector("span")).toHaveClass("my-custom-class");
  });

  it("renders inline-flex with items-center gap for icon alignment", () => {
    const { container } = render(
      <DeltaPill delta={{ value: "+1%", direction: "up" }} />
    );
    const pill = container.querySelector("span");
    expect(pill).toHaveClass("inline-flex");
    expect(pill).toHaveClass("items-center");
    expect(pill).toHaveClass("gap-0.5");
  });
});

// ---------------------------------------------------------------------------
// MetricStat unit tests
// ---------------------------------------------------------------------------
describe("MetricStat", () => {
  // -------------------------------------------------------------------------
  // Smoke / basic rendering
  // -------------------------------------------------------------------------
  describe("basic rendering", () => {
    it("renders without crashing with minimum required props", () => {
      render(<MetricStat label="Revenue" value="$48,295" />);
      expect(screen.getByText("Revenue")).toBeInTheDocument();
      expect(screen.getByText("$48,295")).toBeInTheDocument();
    });

    it("renders the label as small muted text", () => {
      const { container } = render(<MetricStat label="Total Revenue" value="$100" />);
      const labelEl = screen.getByText("Total Revenue");
      expect(labelEl.tagName.toLowerCase()).toBe("span");
      expect(labelEl).toHaveClass("text-sm");
      expect(labelEl).toHaveClass("text-muted-foreground");
    });

    it("renders the value as large medium-weight text", () => {
      const { container } = render(<MetricStat label="Revenue" value="$48,295" />);
      const valueEl = screen.getByText("$48,295");
      expect(valueEl.tagName.toLowerCase()).toBe("span");
      expect(valueEl).toHaveClass("text-2xl");
      expect(valueEl).toHaveClass("font-medium");
      expect(valueEl).toHaveClass("tracking-tight");
      expect(valueEl).toHaveClass("tabular-nums");
    });

    it("root element is a flex column div", () => {
      const { container } = render(<MetricStat label="Revenue" value="$100" />);
      const root = container.firstChild as HTMLElement;
      expect(root.tagName.toLowerCase()).toBe("div");
      expect(root).toHaveClass("flex");
      expect(root).toHaveClass("flex-col");
      expect(root).toHaveClass("gap-1");
    });

    it("root element preserves the metric-stat data-slot", () => {
      const { container } = render(<MetricStat label="Revenue" value="$100" />);
      expect(container.firstChild).toHaveAttribute("data-slot", "metric-stat");
    });
  });

  // -------------------------------------------------------------------------
  // Delta prop
  // -------------------------------------------------------------------------
  describe("delta prop", () => {
    it("renders DeltaPill when delta is provided", () => {
      const { container } = render(
        <MetricStat
          label="Sessions"
          value="9,210"
          delta={{ value: "+14.3%", direction: "up" }}
        />
      );
      expect(screen.getByText("+14.3%")).toBeInTheDocument();
      // pill carries success classes
      const pill = container.querySelector(".bg-success\\/10");
      expect(pill).toBeInTheDocument();
    });

    it("does NOT render DeltaPill when delta is omitted", () => {
      const { container } = render(<MetricStat label="Storage" value="128 GB" />);
      expect(container.querySelector(".bg-success\\/10")).not.toBeInTheDocument();
      expect(container.querySelector(".bg-destructive\\/10")).not.toBeInTheDocument();
      expect(container.querySelector(".bg-muted")).not.toBeInTheDocument();
    });

    it("up direction: DeltaPill has success styling", () => {
      const { container } = render(
        <MetricStat label="L" value="V" delta={{ value: "+5%", direction: "up" }} />
      );
      const pill = container.querySelector("span.rounded-full") as HTMLElement;
      expect(pill).toHaveClass("bg-success/10");
      expect(pill).toHaveClass("text-success");
    });

    it("down direction: DeltaPill has destructive styling", () => {
      const { container } = render(
        <MetricStat label="L" value="V" delta={{ value: "+0.3%", direction: "down" }} />
      );
      const pill = container.querySelector("span.rounded-full") as HTMLElement;
      expect(pill).toHaveClass("bg-destructive/10");
      expect(pill).toHaveClass("text-destructive");
    });

    it("flat direction: DeltaPill has muted styling and no arrow icon", () => {
      const { container } = render(
        <MetricStat label="Uptime" value="99.9%" delta={{ value: "0.0%", direction: "flat" }} />
      );
      const pill = container.querySelector("span.rounded-full") as HTMLElement;
      expect(pill).toHaveClass("bg-muted");
      expect(pill).toHaveClass("text-muted-foreground");
      // No SVG (no arrow) for flat
      expect(within(pill).queryByRole("img", { hidden: true })).not.toBeInTheDocument();
    });

    it("up direction: ArrowUp SVG icon appears inside DeltaPill", () => {
      const { container } = render(
        <MetricStat label="L" value="V" delta={{ value: "+5%", direction: "up" }} />
      );
      const pill = container.querySelector("span.rounded-full") as HTMLElement;
      expect(pill.querySelector("svg")).toBeInTheDocument();
    });

    it("down direction: ArrowDown SVG icon appears inside DeltaPill", () => {
      const { container } = render(
        <MetricStat label="L" value="V" delta={{ value: "-2%", direction: "down" }} />
      );
      const pill = container.querySelector("span.rounded-full") as HTMLElement;
      expect(pill.querySelector("svg")).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Icon prop
  // -------------------------------------------------------------------------
  describe("icon prop", () => {
    it("renders the icon SVG when icon prop is provided", () => {
      const { container } = render(
        <MetricStat icon={Users} label="Subscribers" value="24,800" />
      );
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("does NOT render an icon SVG in the label area when icon prop is omitted", () => {
      const { container } = render(<MetricStat label="Revenue" value="$100" />);
      // No SVG at all (no delta either)
      expect(container.querySelector("svg")).not.toBeInTheDocument();
    });

    it("icon is placed inside the label span alongside the label text", () => {
      const { container } = render(
        <MetricStat icon={Users} label="Subscribers" value="24,800" />
      );
      const labelSpan = screen.getByText("Subscribers").closest("span");
      expect(labelSpan?.querySelector("svg")).toBeInTheDocument();
    });

    it("icon has size-3.5 class for correct sizing", () => {
      const { container } = render(
        <MetricStat icon={TrendingUp} label="Growth" value="18.6%" />
      );
      // The icon SVG should be within the label span
      const labelSpan = screen.getByText("Growth").closest("span");
      const svg = labelSpan?.querySelector("svg");
      expect(svg).toHaveClass("size-3.5");
    });

    it("works with multiple different icons (ShoppingCart)", () => {
      render(<MetricStat icon={ShoppingCart} label="Orders" value="1,045" />);
      expect(screen.getByText("Orders")).toBeInTheDocument();
      expect(screen.getByText("1,045")).toBeInTheDocument();
    });

    it("works with Star icon", () => {
      render(<MetricStat icon={Star} label="Avg Rating" value="4.7" />);
      expect(screen.getByText("Avg Rating")).toBeInTheDocument();
    });

    it("works with Database icon", () => {
      render(<MetricStat icon={Database} label="Records" value="2.4M" />);
      expect(screen.getByText("Records")).toBeInTheDocument();
    });

    it("works with Activity icon (from custom-value example)", () => {
      render(<MetricStat icon={Activity} label="P95 Latency" value="142ms" />);
      expect(screen.getByText("P95 Latency")).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Value as ReactNode
  // -------------------------------------------------------------------------
  describe("value as ReactNode", () => {
    it("renders a plain string value", () => {
      render(<MetricStat label="Revenue" value="$48,295" />);
      expect(screen.getByText("$48,295")).toBeInTheDocument();
    });

    it("renders a number value (coerced to string by React)", () => {
      render(<MetricStat label="Count" value={42} />);
      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("renders a React element as value (colored span)", () => {
      render(
        <MetricStat
          label="System Health"
          value={<span className="text-green-600">Healthy</span>}
        />
      );
      expect(screen.getByText("Healthy")).toBeInTheDocument();
      expect(screen.getByText("Healthy")).toHaveClass("text-green-600");
    });

    it("renders a badge-style pill as value", () => {
      render(
        <MetricStat
          label="Build Status"
          value={
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-lg font-semibold text-green-800">
              Passing
            </span>
          }
        />
      );
      expect(screen.getByText("Passing")).toBeInTheDocument();
      expect(screen.getByText("Passing")).toHaveClass("bg-green-100");
    });

    it("renders a multi-unit display as value (number + unit span)", () => {
      render(
        <MetricStat
          icon={Activity}
          label="P95 Latency"
          value={
            <span>
              142
              <span className="ml-1 text-base font-normal text-muted-foreground">ms</span>
            </span>
          }
          delta={{ value: "-18ms", direction: "up" }}
        />
      );
      expect(screen.getByText("142")).toBeInTheDocument();
      expect(screen.getByText("ms")).toBeInTheDocument();
      expect(screen.getByText("-18ms")).toBeInTheDocument();
    });

    it("renders a skeleton/loading placeholder as value (animate-pulse span)", () => {
      const SkeletonValue = () => (
        <span className="inline-block h-8 w-20 animate-pulse rounded-md bg-muted" />
      );
      const { container } = render(
        <MetricStat label="Downloads" value={<SkeletonValue />} />
      );
      expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
      // No delta pill in loading state
      expect(container.querySelector(".bg-success\\/10")).not.toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // className prop (customization)
  // -------------------------------------------------------------------------
  describe("className prop", () => {
    it("merges custom className onto the root div", () => {
      const { container } = render(
        <MetricStat label="Revenue" value="$100" className="my-custom-class" />
      );
      expect(container.firstChild).toHaveClass("my-custom-class");
    });

    it("retains base flex flex-col gap-1 classes when custom className is given", () => {
      const { container } = render(
        <MetricStat label="Revenue" value="$100" className="p-4" />
      );
      const root = container.firstChild as HTMLElement;
      expect(root).toHaveClass("flex");
      expect(root).toHaveClass("flex-col");
      expect(root).toHaveClass("gap-1");
      expect(root).toHaveClass("p-4");
    });
  });

  // -------------------------------------------------------------------------
  // Composition: all props together
  // -------------------------------------------------------------------------
  describe("full composition", () => {
    it("renders correctly with icon + label + value + delta (up)", () => {
      const { container } = render(
        <MetricStat
          icon={Users}
          label="Subscribers"
          value="24,800"
          delta={{ value: "+3.2%", direction: "up" }}
        />
      );
      expect(screen.getByText("Subscribers")).toBeInTheDocument();
      expect(screen.getByText("24,800")).toBeInTheDocument();
      expect(screen.getByText("+3.2%")).toBeInTheDocument();
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders correctly with icon + label + value + delta (down)", () => {
      render(
        <MetricStat
          icon={ShoppingCart}
          label="Orders"
          value="1,045"
          delta={{ value: "-1.8%", direction: "down" }}
        />
      );
      expect(screen.getByText("Orders")).toBeInTheDocument();
      expect(screen.getByText("1,045")).toBeInTheDocument();
      expect(screen.getByText("-1.8%")).toBeInTheDocument();
    });

    it("renders correctly with icon + label + value + delta (flat)", () => {
      render(
        <MetricStat
          icon={Star}
          label="Avg Rating"
          value="4.7"
          delta={{ value: "0.0%", direction: "flat" }}
        />
      );
      expect(screen.getByText("Avg Rating")).toBeInTheDocument();
      expect(screen.getByText("4.7")).toBeInTheDocument();
      expect(screen.getByText("0.0%")).toBeInTheDocument();
    });

    it("renders correctly with no icon, no delta (minimum)", () => {
      render(<MetricStat label="Storage Used" value="128 GB" />);
      expect(screen.getByText("Storage Used")).toBeInTheDocument();
      expect(screen.getByText("128 GB")).toBeInTheDocument();
    });

    it("renders correctly with icon but no delta", () => {
      render(<MetricStat icon={Clock} label="Avg Response" value="230 ms" />);
      expect(screen.getByText("Avg Response")).toBeInTheDocument();
      expect(screen.getByText("230 ms")).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Multiple MetricStat instances (grid / flex layout scenarios)
  // -------------------------------------------------------------------------
  describe("multiple instances", () => {
    it("renders multiple stats side by side without conflict", () => {
      render(
        <div className="flex gap-8">
          <MetricStat
            label="Total Revenue"
            value="$48,295"
            delta={{ value: "+12.4%", direction: "up" }}
          />
          <MetricStat
            label="Active Users"
            value="8,340"
            delta={{ value: "+5.7%", direction: "up" }}
          />
          <MetricStat
            label="Churn Rate"
            value="2.1%"
            delta={{ value: "+0.3%", direction: "down" }}
          />
        </div>
      );
      expect(screen.getByText("Total Revenue")).toBeInTheDocument();
      expect(screen.getByText("Active Users")).toBeInTheDocument();
      expect(screen.getByText("Churn Rate")).toBeInTheDocument();
      expect(screen.getByText("$48,295")).toBeInTheDocument();
      expect(screen.getByText("8,340")).toBeInTheDocument();
      expect(screen.getByText("2.1%")).toBeInTheDocument();
    });

    it("renders all three delta directions side by side", () => {
      render(
        <div>
          <MetricStat label="Sessions" value="9,210" delta={{ value: "+14.3%", direction: "up" }} />
          <MetricStat label="Error Rate" value="0.8%" delta={{ value: "+0.2%", direction: "down" }} />
          <MetricStat label="Uptime" value="99.9%" delta={{ value: "0.0%", direction: "flat" }} />
        </div>
      );
      expect(screen.getByText("+14.3%")).toBeInTheDocument();
      expect(screen.getByText("+0.2%")).toBeInTheDocument();
      expect(screen.getByText("0.0%")).toBeInTheDocument();
    });

    it("renders a 6-item grid layout from the grid-layout example", () => {
      render(
        <div className="grid grid-cols-2 gap-6 rounded-2xl border bg-card p-6 sm:grid-cols-3">
          <MetricStat label="MRR" value="$21,450" delta={{ value: "+9.1%", direction: "up" }} />
          <MetricStat label="Paying Customers" value="312" delta={{ value: "+4.0%", direction: "up" }} />
          <MetricStat label="Conversion Rate" value="3.8%" delta={{ value: "+0.5%", direction: "up" }} />
          <MetricStat label="Page Views" value="104K" delta={{ value: "-2.3%", direction: "down" }} />
          <MetricStat label="Shipments" value="876" delta={{ value: "0.0%", direction: "flat" }} />
          <MetricStat label="Renewal Rate" value="91%" delta={{ value: "+1.2%", direction: "up" }} />
        </div>
      );
      expect(screen.getByText("MRR")).toBeInTheDocument();
      expect(screen.getByText("Paying Customers")).toBeInTheDocument();
      expect(screen.getByText("Conversion Rate")).toBeInTheDocument();
      expect(screen.getByText("Page Views")).toBeInTheDocument();
      expect(screen.getByText("Shipments")).toBeInTheDocument();
      expect(screen.getByText("Renewal Rate")).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Layout structure
  // -------------------------------------------------------------------------
  describe("layout structure", () => {
    it("value row container has flex items-center gap-2", () => {
      const { container } = render(
        <MetricStat label="Revenue" value="$100" delta={{ value: "+5%", direction: "up" }} />
      );
      // The root div has flex flex-col; its child div wraps value + delta
      // Use querySelectorAll to get the inner div (second div in the subtree)
      const allDivs = container.querySelectorAll("div");
      // allDivs[0] = root (flex-col), allDivs[1] = value row (flex items-center gap-2)
      const valueRow = allDivs[1] as HTMLElement;
      expect(valueRow).toHaveClass("flex");
      expect(valueRow).toHaveClass("items-center");
      expect(valueRow).toHaveClass("gap-2");
    });

    it("label row container has flex items-center gap-1.5", () => {
      const { container } = render(
        <MetricStat icon={Users} label="Subscribers" value="24,800" />
      );
      const labelSpan = screen.getByText("Subscribers").closest("span") as HTMLElement;
      expect(labelSpan).toHaveClass("flex");
      expect(labelSpan).toHaveClass("items-center");
      expect(labelSpan).toHaveClass("gap-1.5");
    });
  });

  // -------------------------------------------------------------------------
  // Edge cases
  // -------------------------------------------------------------------------
  describe("edge cases", () => {
    it("renders with a very long label string", () => {
      render(
        <MetricStat label="This is a very long metric label that might wrap" value="999" />
      );
      expect(screen.getByText("This is a very long metric label that might wrap")).toBeInTheDocument();
    });

    it("renders with a zero value", () => {
      render(<MetricStat label="Errors" value="0" />);
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("renders with a value of '0' and a flat delta", () => {
      render(
        <MetricStat label="Errors" value="0" delta={{ value: "0.0%", direction: "flat" }} />
      );
      expect(screen.getByText("0")).toBeInTheDocument();
      expect(screen.getByText("0.0%")).toBeInTheDocument();
    });

    it("renders with a negative delta value string (down direction)", () => {
      render(
        <MetricStat label="MRR" value="$5,000" delta={{ value: "-10%", direction: "down" }} />
      );
      expect(screen.getByText("-10%")).toBeInTheDocument();
    });

    it("renders with empty string as label (no crash)", () => {
      const { container } = render(<MetricStat label="" value="$100" />);
      expect(container).toBeInTheDocument();
    });

    it("renders with a React node value that is null-like (empty fragment)", () => {
      const { container } = render(<MetricStat label="Empty" value={<></>} />);
      expect(container).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Accessibility
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("MetricStat (no delta, no icon) has no axe violations", async () => {
      const { container } = render(<MetricStat label="Revenue" value="$48,295" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("MetricStat with up delta has no axe violations", async () => {
      const { container } = render(
        <MetricStat
          label="Active Users"
          value="8,340"
          delta={{ value: "+5.7%", direction: "up" }}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("MetricStat with down delta has no axe violations", async () => {
      const { container } = render(
        <MetricStat
          label="Churn Rate"
          value="2.1%"
          delta={{ value: "+0.3%", direction: "down" }}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("MetricStat with flat delta has no axe violations", async () => {
      const { container } = render(
        <MetricStat
          label="Uptime"
          value="99.9%"
          delta={{ value: "0.0%", direction: "flat" }}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("MetricStat with icon has no axe violations", async () => {
      const { container } = render(
        <MetricStat
          icon={Users}
          label="Subscribers"
          value="24,800"
          delta={{ value: "+3.2%", direction: "up" }}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("MetricStat with ReactNode value has no axe violations", async () => {
      const { container } = render(
        <MetricStat
          label="System Health"
          value={<span className="text-green-600">Healthy</span>}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("DeltaPill (up) has no axe violations", async () => {
      const { container } = render(
        <DeltaPill delta={{ value: "+12.4%", direction: "up" }} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("DeltaPill (down) has no axe violations", async () => {
      const { container } = render(
        <DeltaPill delta={{ value: "+0.2%", direction: "down" }} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("DeltaPill (flat) has no axe violations", async () => {
      const { container } = render(
        <DeltaPill delta={{ value: "0.0%", direction: "flat" }} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("multiple MetricStats in a grid have no axe violations", async () => {
      const { container } = render(
        <div>
          <MetricStat label="Revenue" value="$48,295" delta={{ value: "+12.4%", direction: "up" }} />
          <MetricStat label="Users" value="8,340" delta={{ value: "+5.7%", direction: "up" }} />
          <MetricStat label="Churn" value="2.1%" delta={{ value: "+0.3%", direction: "down" }} />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // -------------------------------------------------------------------------
  // Exports / API surface
  // -------------------------------------------------------------------------
  describe("module exports", () => {
    it("exports MetricStat as a named export", async () => {
      const mod = await import("@/components/metric-stat");
      expect(typeof mod.MetricStat).toBe("function");
    });

    it("exports DeltaPill as a named export", async () => {
      const mod = await import("@/components/metric-stat");
      expect(typeof mod.DeltaPill).toBe("function");
    });
  });
});
