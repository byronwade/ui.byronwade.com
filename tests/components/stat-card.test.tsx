import { render, screen, within } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import { axe } from "vitest-axe";
import { Users, Activity, Clock, Globe, Hash, BarChart2, ShoppingCart, Star, TrendingUp, Database, Server, Zap } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { DeltaPill, type Delta } from "@/components/metric-stat";

// ---------------------------------------------------------------------------
// StatCard — exhaustive test suite
// ---------------------------------------------------------------------------

describe("StatCard", () => {
  // -------------------------------------------------------------------------
  // Smoke / renders without crashing
  // -------------------------------------------------------------------------
  describe("renders without crashing", () => {
    it("renders with the minimum required props (label + value)", () => {
      render(<StatCard label="Total Users" value="12,480" />);
      expect(screen.getByText("Total Users")).toBeInTheDocument();
      expect(screen.getByText("12,480")).toBeInTheDocument();
    });

    it("renders to a div at the root level", () => {
      const { container } = render(<StatCard label="Revenue" value="$1,000" />);
      const root = container.firstChild as HTMLElement;
      expect(root.tagName.toLowerCase()).toBe("div");
    });

    it("returns non-null output (container is non-empty)", () => {
      const { container } = render(<StatCard label="Uptime" value="99.99%" />);
      expect(container.firstChild).not.toBeNull();
    });
  });

  // -------------------------------------------------------------------------
  // Card shell — structural classes
  // -------------------------------------------------------------------------
  describe("card shell structure", () => {
    it("root div has rounded-2xl class", () => {
      const { container } = render(<StatCard label="Label" value="Value" />);
      expect(container.firstChild).toHaveClass("rounded-2xl");
    });

    it("root div elevates with shadow-card (immersive edge, no hard border)", () => {
      const { container } = render(<StatCard label="Label" value="Value" />);
      expect(container.firstChild).toHaveClass("shadow-card");
      expect(container.firstChild).not.toHaveClass("border-border");
    });

    it("root div has bg-card class", () => {
      const { container } = render(<StatCard label="Label" value="Value" />);
      expect(container.firstChild).toHaveClass("bg-card");
    });

    it("root div has p-5 padding", () => {
      const { container } = render(<StatCard label="Label" value="Value" />);
      expect(container.firstChild).toHaveClass("p-5");
    });

    it("root div has shadow-card class", () => {
      const { container } = render(<StatCard label="Label" value="Value" />);
      expect(container.firstChild).toHaveClass("shadow-card");
    });
  });

  // -------------------------------------------------------------------------
  // label prop
  // -------------------------------------------------------------------------
  describe("label prop", () => {
    it("renders the label text", () => {
      render(<StatCard label="Total Users" value="8,340" />);
      expect(screen.getByText("Total Users")).toBeInTheDocument();
    });

    it("label is rendered as a <span> element", () => {
      render(<StatCard label="Revenue" value="$100" />);
      const labelEl = screen.getByText("Revenue");
      expect(labelEl.tagName.toLowerCase()).toBe("span");
    });

    it("label has text-sm class", () => {
      render(<StatCard label="Churn Rate" value="2.1%" />);
      expect(screen.getByText("Churn Rate")).toHaveClass("text-sm");
    });

    it("label has text-muted-foreground class", () => {
      render(<StatCard label="Avg Session" value="4m 32s" />);
      expect(screen.getByText("Avg Session")).toHaveClass("text-muted-foreground");
    });

    it("renders an empty string label without crashing", () => {
      const { container } = render(<StatCard label="" value="999" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders a very long label string", () => {
      const longLabel = "This is a very long metric label that might wrap on narrow screens";
      render(<StatCard label={longLabel} value="0" />);
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it("renders multiple different labels without conflict", () => {
      render(
        <div>
          <StatCard label="Users" value="100" />
          <StatCard label="Revenue" value="$200" />
          <StatCard label="Churn" value="1.2%" />
        </div>
      );
      expect(screen.getByText("Users")).toBeInTheDocument();
      expect(screen.getByText("Revenue")).toBeInTheDocument();
      expect(screen.getByText("Churn")).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // value prop (string and ReactNode)
  // -------------------------------------------------------------------------
  describe("value prop", () => {
    it("renders a string value", () => {
      render(<StatCard label="Count" value="12,480" />);
      expect(screen.getByText("12,480")).toBeInTheDocument();
    });

    it("renders a number value", () => {
      render(<StatCard label="Count" value={42} />);
      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("renders zero as value", () => {
      render(<StatCard label="Errors" value="0" />);
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("renders a percentage string value", () => {
      render(<StatCard label="Uptime" value="99.98%" />);
      expect(screen.getByText("99.98%")).toBeInTheDocument();
    });

    it("renders a formatted currency string value", () => {
      render(<StatCard label="Revenue" value="$48,200" />);
      expect(screen.getByText("$48,200")).toBeInTheDocument();
    });

    it("value span has text-2xl class", () => {
      const { container } = render(<StatCard label="Revenue" value="$1,000" />);
      const valueSpan = screen.getByText("$1,000");
      expect(valueSpan).toHaveClass("text-2xl");
    });

    it("value span has font-semibold class", () => {
      render(<StatCard label="Revenue" value="$1,000" />);
      expect(screen.getByText("$1,000")).toHaveClass("font-semibold");
    });

    it("value span has tracking-tight class", () => {
      render(<StatCard label="Revenue" value="$1,000" />);
      expect(screen.getByText("$1,000")).toHaveClass("tracking-tight");
    });

    it("value span has tabular-nums class", () => {
      render(<StatCard label="Revenue" value="$1,000" />);
      expect(screen.getByText("$1,000")).toHaveClass("tabular-nums");
    });

    it("renders a React element as value (currency with superscript)", () => {
      render(
        <StatCard
          label="Monthly Revenue"
          value={
            <span className="flex items-start gap-0.5">
              <span className="mt-1 text-base font-semibold text-muted-foreground">$</span>
              <span>84,312</span>
            </span>
          }
          delta={{ value: "+9.1%", direction: "up" }}
          hint="USD, excl. taxes"
        />
      );
      expect(screen.getByText("84,312")).toBeInTheDocument();
      expect(screen.getByText("$")).toBeInTheDocument();
    });

    it("renders a fraction ReactNode value (task complete example)", () => {
      render(
        <StatCard
          label="Tasks Complete"
          value={
            <span className="flex items-baseline gap-1">
              <span>142</span>
              <span className="text-base font-normal text-muted-foreground">/ 160</span>
            </span>
          }
          hint="88% done this sprint"
        />
      );
      expect(screen.getByText("142")).toBeInTheDocument();
      expect(screen.getByText("/ 160")).toBeInTheDocument();
    });

    it("renders an inline colored status badge as value", () => {
      render(
        <StatCard
          label="Incident Status"
          value={
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-green-500" />
              <span>Resolved</span>
            </span>
          }
          hint="last updated 3 min ago"
        />
      );
      expect(screen.getByText("Resolved")).toBeInTheDocument();
    });

    it("renders a fraction-style server status value (24 / 24)", () => {
      render(<StatCard label="Servers Online" value="24 / 24" hint="all regions healthy" />);
      expect(screen.getByText("24 / 24")).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // hint prop (optional)
  // -------------------------------------------------------------------------
  describe("hint prop", () => {
    it("renders hint text when provided", () => {
      render(<StatCard label="Users" value="8,340" hint="vs. last 30 days" />);
      expect(screen.getByText("vs. last 30 days")).toBeInTheDocument();
    });

    it("does NOT render hint element when hint is omitted", () => {
      render(<StatCard label="Users" value="8,340" />);
      // No hint-bearing element — the div with mt-1 text-xs class should not exist
      const { container } = render(<StatCard label="Users2" value="8,340" />);
      const hintDivs = container.querySelectorAll(".mt-1.text-xs.text-muted-foreground");
      expect(hintDivs.length).toBe(0);
    });

    it("hint is rendered inside a <div>", () => {
      const { container } = render(
        <StatCard label="Label" value="Val" hint="some hint" />
      );
      // The hint div is the last child of the card root
      const hintDiv = container.querySelector(".mt-1.text-xs");
      expect(hintDiv?.tagName.toLowerCase()).toBe("div");
    });

    it("hint has mt-1 class", () => {
      const { container } = render(
        <StatCard label="Label" value="Val" hint="hint text" />
      );
      const hintDiv = container.querySelector(".mt-1");
      expect(hintDiv).toBeInTheDocument();
    });

    it("hint has text-xs class", () => {
      const { container } = render(
        <StatCard label="Label" value="Val" hint="hint text" />
      );
      expect(container.querySelector(".text-xs")).toBeInTheDocument();
    });

    it("hint has text-muted-foreground class", () => {
      const { container } = render(
        <StatCard label="Label" value="Val" hint="hint text" />
      );
      const hintDiv = container.querySelector(".mt-1.text-xs");
      expect(hintDiv).toHaveClass("text-muted-foreground");
    });

    it("renders a ReactNode as hint", () => {
      render(
        <StatCard
          label="Uptime"
          value="99.99%"
          hint={<span className="font-bold">rolling 30 days</span>}
        />
      );
      expect(screen.getByText("rolling 30 days")).toBeInTheDocument();
    });

    it("renders hint with different text in multiple cards without conflict", () => {
      render(
        <div>
          <StatCard label="A" value="1" hint="last 24h" />
          <StatCard label="B" value="2" hint="p95 latency" />
        </div>
      );
      expect(screen.getByText("last 24h")).toBeInTheDocument();
      expect(screen.getByText("p95 latency")).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // delta prop — all three directions
  // -------------------------------------------------------------------------
  describe("delta prop", () => {
    it("renders DeltaPill when delta is provided (up)", () => {
      render(
        <StatCard
          label="Revenue"
          value="$48,200"
          delta={{ value: "+12.5%", direction: "up" }}
        />
      );
      expect(screen.getByText("+12.5%")).toBeInTheDocument();
    });

    it("renders DeltaPill when delta is provided (down)", () => {
      render(
        <StatCard
          label="Avg Session"
          value="4m 32s"
          delta={{ value: "-0.8%", direction: "down" }}
        />
      );
      expect(screen.getByText("-0.8%")).toBeInTheDocument();
    });

    it("renders DeltaPill when delta is provided (flat)", () => {
      render(
        <StatCard
          label="Bounce Rate"
          value="38.0%"
          delta={{ value: "0.0%", direction: "flat" }}
        />
      );
      expect(screen.getByText("0.0%")).toBeInTheDocument();
    });

    it("does NOT render a DeltaPill when delta is omitted", () => {
      const { container } = render(
        <StatCard label="Uptime" value="99.98%" hint="last 90 days" />
      );
      // None of the pill tone classes should exist
      expect(container.querySelector(".bg-success\\/10")).not.toBeInTheDocument();
      expect(container.querySelector(".bg-destructive\\/10")).not.toBeInTheDocument();
      expect(container.querySelector(".rounded-full")).not.toBeInTheDocument();
    });

    it("direction=up: DeltaPill has success background class (bg-success/10)", () => {
      const { container } = render(
        <StatCard label="Revenue" value="$48,200" delta={{ value: "+12.5%", direction: "up" }} />
      );
      const pill = container.querySelector(".rounded-full") as HTMLElement;
      expect(pill).toHaveClass("bg-success/10");
    });

    it("direction=up: DeltaPill has text-success class", () => {
      const { container } = render(
        <StatCard label="Revenue" value="$48,200" delta={{ value: "+12.5%", direction: "up" }} />
      );
      const pill = container.querySelector(".rounded-full") as HTMLElement;
      expect(pill).toHaveClass("text-success");
    });

    it("direction=up: DeltaPill has ArrowUp SVG icon", () => {
      const { container } = render(
        <StatCard label="Revenue" value="$48,200" delta={{ value: "+12.5%", direction: "up" }} />
      );
      const pill = container.querySelector(".rounded-full") as HTMLElement;
      expect(pill.querySelector("svg")).toBeInTheDocument();
    });

    it("direction=down: DeltaPill has bg-destructive/10 class", () => {
      const { container } = render(
        <StatCard label="Churn" value="2.1%" delta={{ value: "-0.4%", direction: "down" }} />
      );
      const pill = container.querySelector(".rounded-full") as HTMLElement;
      expect(pill).toHaveClass("bg-destructive/10");
    });

    it("direction=down: DeltaPill has text-destructive class", () => {
      const { container } = render(
        <StatCard label="Churn" value="2.1%" delta={{ value: "-0.4%", direction: "down" }} />
      );
      const pill = container.querySelector(".rounded-full") as HTMLElement;
      expect(pill).toHaveClass("text-destructive");
    });

    it("direction=down: DeltaPill has ArrowDown SVG icon", () => {
      const { container } = render(
        <StatCard label="Churn" value="2.1%" delta={{ value: "-0.4%", direction: "down" }} />
      );
      const pill = container.querySelector(".rounded-full") as HTMLElement;
      expect(pill.querySelector("svg")).toBeInTheDocument();
    });

    it("direction=flat: DeltaPill has bg-muted class", () => {
      const { container } = render(
        <StatCard label="Bounce" value="38.0%" delta={{ value: "0.0%", direction: "flat" }} />
      );
      const pill = container.querySelector(".rounded-full") as HTMLElement;
      expect(pill).toHaveClass("bg-muted");
    });

    it("direction=flat: DeltaPill has text-muted-foreground class", () => {
      const { container } = render(
        <StatCard label="Bounce" value="38.0%" delta={{ value: "0.0%", direction: "flat" }} />
      );
      const pill = container.querySelector(".rounded-full") as HTMLElement;
      expect(pill).toHaveClass("text-muted-foreground");
    });

    it("direction=flat: DeltaPill has NO SVG icon", () => {
      const { container } = render(
        <StatCard label="Bounce" value="38.0%" delta={{ value: "0.0%", direction: "flat" }} />
      );
      const pill = container.querySelector(".rounded-full") as HTMLElement;
      expect(pill.querySelector("svg")).not.toBeInTheDocument();
    });

    it("DeltaPill is rendered inside the value row (mt-2 flex container)", () => {
      const { container } = render(
        <StatCard label="Revenue" value="$48,200" delta={{ value: "+5%", direction: "up" }} />
      );
      const valueRow = container.querySelector(".mt-2.flex.items-center.gap-2") as HTMLElement;
      expect(valueRow).toBeInTheDocument();
      expect(within(valueRow).getByText("+5%")).toBeInTheDocument();
    });

    it("DeltaPill has rounded-full pill shape", () => {
      const { container } = render(
        <StatCard label="Revenue" value="$48,200" delta={{ value: "+5%", direction: "up" }} />
      );
      const pill = container.querySelector(".rounded-full");
      expect(pill).toBeInTheDocument();
    });

    it("DeltaPill has tabular-nums class", () => {
      const { container } = render(
        <StatCard label="Revenue" value="$48,200" delta={{ value: "+5%", direction: "up" }} />
      );
      const pill = container.querySelector(".rounded-full") as HTMLElement;
      expect(pill).toHaveClass("tabular-nums");
    });

    it("DeltaPill has text-xs font-medium classes", () => {
      const { container } = render(
        <StatCard label="Revenue" value="$48,200" delta={{ value: "+5%", direction: "up" }} />
      );
      const pill = container.querySelector(".rounded-full") as HTMLElement;
      expect(pill).toHaveClass("text-xs");
      expect(pill).toHaveClass("font-medium");
    });

    it("renders all three delta directions in a side-by-side grid", () => {
      render(
        <div>
          <StatCard label="Revenue" value="$48,200" delta={{ value: "+12.5%", direction: "up" }} hint="vs. previous month" />
          <StatCard label="Avg Session" value="4m 32s" delta={{ value: "-0.8%", direction: "down" }} hint="vs. previous month" />
          <StatCard label="Bounce Rate" value="38.0%" delta={{ value: "0.0%", direction: "flat" }} hint="no change" />
        </div>
      );
      expect(screen.getByText("+12.5%")).toBeInTheDocument();
      expect(screen.getByText("-0.8%")).toBeInTheDocument();
      expect(screen.getByText("0.0%")).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // icon prop
  // -------------------------------------------------------------------------
  describe("icon prop", () => {
    it("renders an SVG icon when icon prop is provided (Users)", () => {
      const { container } = render(
        <StatCard label="Total Users" value="12,480" icon={Users} />
      );
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("does NOT render an SVG when icon prop is omitted (and no delta)", () => {
      const { container } = render(
        <StatCard label="Churn Rate" value="2.1%" hint="monthly average" />
      );
      expect(container.querySelector("svg")).not.toBeInTheDocument();
    });

    it("icon is placed in the header row (flex justify-between container)", () => {
      const { container } = render(
        <StatCard label="Total Users" value="12,480" icon={Users} />
      );
      const headerRow = container.querySelector(".flex.items-center.justify-between") as HTMLElement;
      expect(headerRow).toBeInTheDocument();
      expect(headerRow.querySelector("svg")).toBeInTheDocument();
    });

    it("icon has size-4 class", () => {
      const { container } = render(
        <StatCard label="Page Views" value="1.24M" icon={BarChart2} />
      );
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("size-4");
    });

    it("icon has text-muted-foreground class", () => {
      const { container } = render(
        <StatCard label="Page Views" value="1.24M" icon={BarChart2} />
      );
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("text-muted-foreground");
    });

    it("renders Activity icon", () => {
      const { container } = render(
        <StatCard label="Requests/s" value="2,104" icon={Activity} />
      );
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders Clock icon", () => {
      const { container } = render(
        <StatCard label="Uptime" value="99.98%" icon={Clock} />
      );
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders Globe icon", () => {
      const { container } = render(
        <StatCard label="Regions" value="12" icon={Globe} />
      );
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders Hash icon", () => {
      const { container } = render(
        <StatCard label="Build #" value="4,021" icon={Hash} />
      );
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders ShoppingCart icon", () => {
      const { container } = render(
        <StatCard label="Orders" value="3,892" icon={ShoppingCart} />
      );
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders Star icon", () => {
      const { container } = render(
        <StatCard label="Avg Rating" value="4.7" icon={Star} />
      );
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders TrendingUp icon", () => {
      const { container } = render(
        <StatCard label="Growth Rate" value="22.8%" icon={TrendingUp} />
      );
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders Database icon", () => {
      const { container } = render(
        <StatCard label="DB Queries" value="182K" icon={Database} />
      );
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders Server icon", () => {
      const { container } = render(
        <StatCard label="Servers" value="24/24" icon={Server} />
      );
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders Zap icon", () => {
      const { container } = render(
        <StatCard label="Error Rate" value="0.04%" icon={Zap} />
      );
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("icon + delta: both SVGs render (one icon, one arrow)", () => {
      const { container } = render(
        <StatCard
          label="Total Users"
          value="12,480"
          delta={{ value: "+8.3%", direction: "up" }}
          icon={Users}
          hint="vs. last 30 days"
        />
      );
      const svgs = container.querySelectorAll("svg");
      // One from the icon, one from the ArrowUp in DeltaPill
      expect(svgs.length).toBeGreaterThanOrEqual(2);
    });

    it("icon without delta: only one SVG (the icon)", () => {
      const { container } = render(
        <StatCard label="Uptime" value="99.98%" icon={Clock} hint="last 90 days" />
      );
      const svgs = container.querySelectorAll("svg");
      expect(svgs.length).toBe(1);
    });
  });

  // -------------------------------------------------------------------------
  // className prop (customization / merging)
  // -------------------------------------------------------------------------
  describe("className prop", () => {
    it("merges a custom className onto the root div", () => {
      const { container } = render(
        <StatCard label="Revenue" value="$100" className="my-custom-class" />
      );
      expect(container.firstChild).toHaveClass("my-custom-class");
    });

    it("retains base card classes when custom className is given", () => {
      const { container } = render(
        <StatCard label="Revenue" value="$100" className="col-span-2" />
      );
      const root = container.firstChild as HTMLElement;
      expect(root).toHaveClass("rounded-2xl");
      expect(root).toHaveClass("shadow-card");
      expect(root).toHaveClass("bg-card");
      expect(root).toHaveClass("p-5");
      expect(root).toHaveClass("col-span-2");
    });

    it("className is undefined by default (no extra classes from undefined)", () => {
      const { container } = render(
        <StatCard label="Revenue" value="$100" />
      );
      const root = container.firstChild as HTMLElement;
      // Should still have base classes
      expect(root).toHaveClass("rounded-2xl");
    });

    it("applies multiple space-separated custom class names", () => {
      const { container } = render(
        <StatCard label="Revenue" value="$100" className="p-8 w-full" />
      );
      const root = container.firstChild as HTMLElement;
      expect(root).toHaveClass("p-8");
      expect(root).toHaveClass("w-full");
    });
  });

  // -------------------------------------------------------------------------
  // Layout structure (header row + value row)
  // -------------------------------------------------------------------------
  describe("layout structure", () => {
    it("header row is a flex justify-between items-center div", () => {
      const { container } = render(
        <StatCard label="Label" value="Value" icon={Users} />
      );
      const headerRow = container.querySelector(".flex.items-center.justify-between") as HTMLElement;
      expect(headerRow).toBeInTheDocument();
    });

    it("label span is inside the header row", () => {
      const { container } = render(
        <StatCard label="Total Users" value="12,480" />
      );
      const headerRow = container.querySelector(".flex.items-center.justify-between") as HTMLElement;
      expect(within(headerRow).getByText("Total Users")).toBeInTheDocument();
    });

    it("icon is inside the header row", () => {
      const { container } = render(
        <StatCard label="Total Users" value="12,480" icon={Users} />
      );
      const headerRow = container.querySelector(".flex.items-center.justify-between") as HTMLElement;
      expect(headerRow.querySelector("svg")).toBeInTheDocument();
    });

    it("value row has mt-2 margin-top", () => {
      const { container } = render(
        <StatCard label="Revenue" value="$100" />
      );
      const valueRow = container.querySelector(".mt-2") as HTMLElement;
      expect(valueRow).toBeInTheDocument();
    });

    it("value row has flex items-center gap-2 classes", () => {
      const { container } = render(
        <StatCard label="Revenue" value="$100" />
      );
      const valueRow = container.querySelector(".mt-2.flex.items-center.gap-2") as HTMLElement;
      expect(valueRow).toBeInTheDocument();
    });

    it("value span is inside the value row", () => {
      const { container } = render(
        <StatCard label="Revenue" value="$1,000" />
      );
      const valueRow = container.querySelector(".mt-2.flex.items-center.gap-2") as HTMLElement;
      expect(within(valueRow).getByText("$1,000")).toBeInTheDocument();
    });

    it("DeltaPill is inside the value row", () => {
      const { container } = render(
        <StatCard label="Revenue" value="$1,000" delta={{ value: "+5%", direction: "up" }} />
      );
      const valueRow = container.querySelector(".mt-2.flex.items-center.gap-2") as HTMLElement;
      expect(within(valueRow).getByText("+5%")).toBeInTheDocument();
    });

    it("hint is placed below the value row (as the last child of card)", () => {
      const { container } = render(
        <StatCard label="Revenue" value="$1,000" hint="vs. last month" />
      );
      const card = container.firstChild as HTMLElement;
      const children = Array.from(card.children);
      // Hint div should be the last child
      const lastChild = children[children.length - 1];
      expect(lastChild.textContent).toBe("vs. last month");
    });
  });

  // -------------------------------------------------------------------------
  // Full composition — every prop combination
  // -------------------------------------------------------------------------
  describe("full composition", () => {
    it("renders all props: label + value + delta(up) + icon + hint", () => {
      const { container } = render(
        <StatCard
          label="Total Users"
          value="12,480"
          delta={{ value: "+8.3%", direction: "up" }}
          icon={Users}
          hint="vs. last 30 days"
        />
      );
      expect(screen.getByText("Total Users")).toBeInTheDocument();
      expect(screen.getByText("12,480")).toBeInTheDocument();
      expect(screen.getByText("+8.3%")).toBeInTheDocument();
      expect(screen.getByText("vs. last 30 days")).toBeInTheDocument();
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders label + value + delta(down) + hint (no icon — from default example)", () => {
      render(
        <StatCard
          label="Churn Rate"
          value="2.1%"
          delta={{ value: "-0.4%", direction: "down" }}
          hint="monthly average"
        />
      );
      expect(screen.getByText("Churn Rate")).toBeInTheDocument();
      expect(screen.getByText("2.1%")).toBeInTheDocument();
      expect(screen.getByText("-0.4%")).toBeInTheDocument();
      expect(screen.getByText("monthly average")).toBeInTheDocument();
    });

    it("renders label + value + icon + hint (no delta — from no-delta example)", () => {
      const { container } = render(
        <StatCard label="Uptime" value="99.98%" icon={Clock} hint="last 90 days" />
      );
      expect(screen.getByText("Uptime")).toBeInTheDocument();
      expect(screen.getByText("99.98%")).toBeInTheDocument();
      expect(screen.getByText("last 90 days")).toBeInTheDocument();
      expect(container.querySelector("svg")).toBeInTheDocument();
      // no delta pill
      expect(container.querySelector(".rounded-full")).not.toBeInTheDocument();
    });

    it("renders label + value only (no delta, no icon, no hint)", () => {
      render(<StatCard label="Build #" value="4,021" />);
      expect(screen.getByText("Build #")).toBeInTheDocument();
      expect(screen.getByText("4,021")).toBeInTheDocument();
    });

    it("renders label + value + delta(flat) + hint (from delta-directions example)", () => {
      render(
        <StatCard
          label="Bounce Rate"
          value="38.0%"
          delta={{ value: "0.0%", direction: "flat" }}
          hint="no change"
        />
      );
      expect(screen.getByText("Bounce Rate")).toBeInTheDocument();
      expect(screen.getByText("38.0%")).toBeInTheDocument();
      expect(screen.getByText("0.0%")).toBeInTheDocument();
      expect(screen.getByText("no change")).toBeInTheDocument();
    });

    it("renders label + value + icon + delta(up) + hint (from with-icons example)", () => {
      const { container } = render(
        <StatCard
          label="Page Views"
          value="1.24M"
          delta={{ value: "+18.2%", direction: "up" }}
          icon={BarChart2}
          hint="last 7 days"
        />
      );
      expect(screen.getByText("Page Views")).toBeInTheDocument();
      expect(screen.getByText("1.24M")).toBeInTheDocument();
      expect(screen.getByText("+18.2%")).toBeInTheDocument();
      expect(screen.getByText("last 7 days")).toBeInTheDocument();
      // Both icon SVG and delta arrow SVG present
      expect(container.querySelectorAll("svg").length).toBeGreaterThanOrEqual(2);
    });
  });

  // -------------------------------------------------------------------------
  // Grid/dashboard usage — from grid-dashboard example
  // -------------------------------------------------------------------------
  describe("grid-dashboard example", () => {
    it("renders a four-card overview grid without conflicts", () => {
      render(
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Active Users" value="8,340" delta={{ value: "+5.2%", direction: "up" }} icon={Users} hint="last 24 h" />
          <StatCard label="Requests / s" value="2,104" delta={{ value: "+1.8%", direction: "up" }} icon={Activity} hint="p95 latency 42 ms" />
          <StatCard label="Error Rate" value="0.04%" delta={{ value: "+0.01%", direction: "down" }} icon={Zap} hint="last 1 h window" />
          <StatCard label="DB Queries" value="182K" delta={{ value: "-3.4%", direction: "down" }} icon={Database} hint="cache hit 94%" />
        </div>
      );
      expect(screen.getByText("Active Users")).toBeInTheDocument();
      expect(screen.getByText("Requests / s")).toBeInTheDocument();
      expect(screen.getByText("Error Rate")).toBeInTheDocument();
      expect(screen.getByText("DB Queries")).toBeInTheDocument();
    });

    it("renders a servers-online card without delta", () => {
      render(<StatCard label="Servers Online" value="24 / 24" icon={Server} hint="all regions healthy" />);
      expect(screen.getByText("Servers Online")).toBeInTheDocument();
      expect(screen.getByText("24 / 24")).toBeInTheDocument();
      expect(screen.getByText("all regions healthy")).toBeInTheDocument();
    });

    it("renders an uptime card with flat delta", () => {
      render(
        <StatCard label="Uptime" value="99.99%" delta={{ value: "0.0%", direction: "flat" }} hint="rolling 30 days" />
      );
      expect(screen.getByText("Uptime")).toBeInTheDocument();
      expect(screen.getByText("99.99%")).toBeInTheDocument();
      expect(screen.getByText("0.0%")).toBeInTheDocument();
    });

    it("renders six cards in a grid without any missing labels or values", () => {
      render(
        <div>
          <StatCard label="Active Users" value="8,340" delta={{ value: "+5.2%", direction: "up" }} icon={Users} hint="last 24 h" />
          <StatCard label="Requests / s" value="2,104" delta={{ value: "+1.8%", direction: "up" }} icon={Activity} hint="p95 latency 42 ms" />
          <StatCard label="Error Rate" value="0.04%" delta={{ value: "+0.01%", direction: "down" }} icon={Zap} hint="last 1 h window" />
          <StatCard label="DB Queries" value="182K" delta={{ value: "-3.4%", direction: "down" }} icon={Database} hint="cache hit 94%" />
          <StatCard label="Servers Online" value="24 / 24" icon={Server} hint="all regions healthy" />
          <StatCard label="Uptime" value="99.99%" delta={{ value: "0.0%", direction: "flat" }} hint="rolling 30 days" />
        </div>
      );
      // All labels
      expect(screen.getByText("Active Users")).toBeInTheDocument();
      expect(screen.getByText("Requests / s")).toBeInTheDocument();
      expect(screen.getByText("Error Rate")).toBeInTheDocument();
      expect(screen.getByText("DB Queries")).toBeInTheDocument();
      expect(screen.getByText("Servers Online")).toBeInTheDocument();
      expect(screen.getByText("Uptime")).toBeInTheDocument();
      // All values
      expect(screen.getByText("8,340")).toBeInTheDocument();
      expect(screen.getByText("2,104")).toBeInTheDocument();
      expect(screen.getByText("0.04%")).toBeInTheDocument();
      expect(screen.getByText("182K")).toBeInTheDocument();
      expect(screen.getByText("24 / 24")).toBeInTheDocument();
      expect(screen.getByText("99.99%")).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // rich-value example — ReactNode values
  // -------------------------------------------------------------------------
  describe("rich-value ReactNode examples", () => {
    it("renders currency with superscript dollar sign and number", () => {
      render(
        <StatCard
          label="Monthly Revenue"
          value={
            <span className="flex items-start gap-0.5">
              <span className="mt-1 text-base font-semibold text-muted-foreground">$</span>
              <span>84,312</span>
            </span>
          }
          delta={{ value: "+9.1%", direction: "up" }}
          hint="USD, excl. taxes"
        />
      );
      expect(screen.getByText("84,312")).toBeInTheDocument();
      expect(screen.getByText("$")).toBeInTheDocument();
      expect(screen.getByText("+9.1%")).toBeInTheDocument();
      expect(screen.getByText("USD, excl. taxes")).toBeInTheDocument();
    });

    it("renders fraction-style value (tasks complete)", () => {
      render(
        <StatCard
          label="Tasks Complete"
          value={
            <span className="flex items-baseline gap-1">
              <span>142</span>
              <span className="text-base font-normal text-muted-foreground">/ 160</span>
            </span>
          }
          hint="88% done this sprint"
        />
      );
      expect(screen.getByText("142")).toBeInTheDocument();
      expect(screen.getByText("/ 160")).toBeInTheDocument();
      expect(screen.getByText("88% done this sprint")).toBeInTheDocument();
    });

    it("renders inline colored status badge value", () => {
      render(
        <StatCard
          label="Incident Status"
          value={
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-green-500" aria-hidden="true" />
              <span>Resolved</span>
            </span>
          }
          hint="last updated 3 min ago"
        />
      );
      expect(screen.getByText("Resolved")).toBeInTheDocument();
      expect(screen.getByText("last updated 3 min ago")).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Edge cases
  // -------------------------------------------------------------------------
  describe("edge cases", () => {
    it("renders with a numeric zero value as string", () => {
      render(<StatCard label="Errors" value="0" />);
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("renders with a very large value string", () => {
      render(<StatCard label="Total Requests" value="1,234,567,890" />);
      expect(screen.getByText("1,234,567,890")).toBeInTheDocument();
    });

    it("renders with a special character value", () => {
      render(<StatCard label="Status" value="N/A" />);
      expect(screen.getByText("N/A")).toBeInTheDocument();
    });

    it("renders correctly when re-rendered with different props", () => {
      const { rerender } = render(<StatCard label="Users" value="100" />);
      expect(screen.getByText("100")).toBeInTheDocument();
      rerender(<StatCard label="Users" value="200" />);
      expect(screen.getByText("200")).toBeInTheDocument();
      expect(screen.queryByText("100")).not.toBeInTheDocument();
    });

    it("renders correctly when delta changes from up to down", () => {
      const { rerender, container } = render(
        <StatCard label="Revenue" value="$100" delta={{ value: "+5%", direction: "up" }} />
      );
      expect(container.querySelector(".bg-success\\/10")).toBeInTheDocument();

      rerender(
        <StatCard label="Revenue" value="$100" delta={{ value: "-5%", direction: "down" }} />
      );
      expect(container.querySelector(".bg-destructive\\/10")).toBeInTheDocument();
      expect(container.querySelector(".bg-success\\/10")).not.toBeInTheDocument();
    });

    it("renders correctly when hint is added after initial render", () => {
      const { rerender } = render(<StatCard label="Users" value="100" />);
      expect(screen.queryByText("hint added later")).not.toBeInTheDocument();
      rerender(<StatCard label="Users" value="100" hint="hint added later" />);
      expect(screen.getByText("hint added later")).toBeInTheDocument();
    });

    it("renders correctly when icon is added after initial render", () => {
      const { rerender, container } = render(<StatCard label="Users" value="100" />);
      expect(container.querySelector("svg")).not.toBeInTheDocument();
      rerender(<StatCard label="Users" value="100" icon={Users} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("handles delta with empty string value gracefully", () => {
      render(<StatCard label="Metric" value="42" delta={{ value: "", direction: "flat" }} />);
      expect(screen.getByText("42")).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Module exports
  // -------------------------------------------------------------------------
  describe("module exports", () => {
    it("exports StatCard as a named export", async () => {
      const mod = await import("@/components/stat-card");
      expect(typeof mod.StatCard).toBe("function");
    });

    it("StatCard is callable as a React component (returns JSX element)", () => {
      const { container } = render(<StatCard label="Test" value="123" />);
      expect(container.firstChild).not.toBeNull();
    });
  });

  // -------------------------------------------------------------------------
  // Accessibility (axe)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("StatCard with minimum props has no axe violations", async () => {
      const { container } = render(<StatCard label="Revenue" value="$48,200" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("StatCard with up delta has no axe violations", async () => {
      const { container } = render(
        <StatCard
          label="Total Users"
          value="12,480"
          delta={{ value: "+8.3%", direction: "up" }}
          hint="vs. last 30 days"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("StatCard with down delta has no axe violations", async () => {
      const { container } = render(
        <StatCard
          label="Churn Rate"
          value="2.1%"
          delta={{ value: "-0.4%", direction: "down" }}
          hint="monthly average"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("StatCard with flat delta has no axe violations", async () => {
      const { container } = render(
        <StatCard
          label="Bounce Rate"
          value="38.0%"
          delta={{ value: "0.0%", direction: "flat" }}
          hint="no change"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("StatCard with icon has no axe violations", async () => {
      const { container } = render(
        <StatCard
          label="Active Users"
          value="8,340"
          delta={{ value: "+5.2%", direction: "up" }}
          icon={Users}
          hint="last 24 h"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("StatCard with icon but no delta has no axe violations", async () => {
      const { container } = render(
        <StatCard label="Uptime" value="99.98%" icon={Clock} hint="last 90 days" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("StatCard with ReactNode value has no axe violations", async () => {
      const { container } = render(
        <StatCard
          label="Tasks Complete"
          value={
            <span className="flex items-baseline gap-1">
              <span>142</span>
              <span className="text-base font-normal text-muted-foreground">/ 160</span>
            </span>
          }
          hint="88% done this sprint"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("multiple StatCards in a grid have no axe violations", async () => {
      const { container } = render(
        <div>
          <StatCard label="Revenue" value="$48,200" delta={{ value: "+12.5%", direction: "up" }} hint="vs. previous month" />
          <StatCard label="Avg Session" value="4m 32s" delta={{ value: "-0.8%", direction: "down" }} hint="vs. previous month" />
          <StatCard label="Bounce Rate" value="38.0%" delta={{ value: "0.0%", direction: "flat" }} hint="no change" />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("StatCard with full props (all-inclusive) has no axe violations", async () => {
      const { container } = render(
        <StatCard
          label="Page Views"
          value="1.24M"
          delta={{ value: "+18.2%", direction: "up" }}
          icon={BarChart2}
          hint="last 7 days"
          className="w-full"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
