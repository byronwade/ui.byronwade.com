/**
 * Exhaustive tests for <DetailHeader /> and <MetaGrid />
 *
 * Component source: components/detail-header.tsx
 * API summary:
 *   DetailHeader props:
 *     - title: React.ReactNode  (required) — renders inside an <h1>
 *     - badge?: React.ReactNode — rendered after the title h1
 *     - actions?: React.ReactNode — rendered in a flex row on the right of title row
 *     - meta?: { label: string; value: React.ReactNode }[] — rendered via MetaGrid
 *     - className?: string — applied to the outer wrapper div
 *
 *   MetaGrid props:
 *     - items: { label: string; value: React.ReactNode }[] (required)
 *     - className?: string — applied to the grid wrapper
 *
 *   DOM structure:
 *     <div class="space-y-6 [className]">
 *       <div class="flex flex-wrap items-center justify-between gap-3">
 *         <div class="flex items-center gap-3">
 *           <h1 class="font-mono text-xl font-medium tracking-tight">{title}</h1>
 *           {badge}
 *         </div>
 *         {actions && <div class="flex items-center gap-2">{actions}</div>}
 *       </div>
 *       {meta?.length > 0 && <MetaGrid items={meta} />}
 *     </div>
 *
 *   MetaGrid DOM structure:
 *     <div class="grid grid-cols-2 gap-x-10 gap-y-5 sm:grid-cols-3 lg:grid-cols-4 [className]">
 *       {items.map((it, i) => (
 *         <div key={i} class="space-y-1">
 *           <div class="text-xs font-medium text-muted-foreground">{it.label}</div>
 *           <div class="text-sm">{it.value}</div>
 *         </div>
 *       ))}
 *     </div>
 */

import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { DetailHeader, MetaGrid } from "@/components/detail-header";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getH1() {
  return screen.getByRole("heading", { level: 1 });
}

// ---------------------------------------------------------------------------
// DetailHeader — renders without crashing (default/minimal)
// ---------------------------------------------------------------------------
describe("DetailHeader — renders without crashing", () => {
  it("renders with only a title prop", () => {
    render(<DetailHeader title="My Domain" />);
    expect(getH1()).toHaveTextContent("My Domain");
  });

  it("renders a heading at level 1", () => {
    render(<DetailHeader title="Test" />);
    expect(getH1()).toBeInTheDocument();
  });

  it("does not render actions container when actions prop is omitted", () => {
    const { container } = render(<DetailHeader title="No Actions" />);
    // The actions wrapper div is only rendered when actions is truthy
    // It carries "flex items-center gap-2" — check no such div with gap-2 exists
    const flexGap2 = container.querySelector(".gap-2");
    expect(flexGap2).not.toBeInTheDocument();
  });

  it("does not render MetaGrid when meta prop is omitted", () => {
    const { container } = render(<DetailHeader title="No Meta" />);
    // MetaGrid has the class "grid-cols-2"
    expect(container.querySelector(".grid-cols-2")).not.toBeInTheDocument();
  });

  it("does not render MetaGrid when meta is an empty array", () => {
    const { container } = render(<DetailHeader title="Empty Meta" meta={[]} />);
    expect(container.querySelector(".grid-cols-2")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// DetailHeader — title prop
// ---------------------------------------------------------------------------
describe("DetailHeader — title prop", () => {
  it("renders a plain string title", () => {
    render(<DetailHeader title="my-project.acme.com" />);
    expect(getH1()).toHaveTextContent("my-project.acme.com");
  });

  it("title h1 has font-mono class", () => {
    render(<DetailHeader title="Test" />);
    expect(getH1()).toHaveClass("font-mono");
  });

  it("title h1 has text-xl class", () => {
    render(<DetailHeader title="Test" />);
    expect(getH1()).toHaveClass("text-xl");
  });

  it("title h1 has font-medium class", () => {
    render(<DetailHeader title="Test" />);
    expect(getH1()).toHaveClass("font-medium");
  });

  it("title h1 has tracking-tight class", () => {
    render(<DetailHeader title="Test" />);
    expect(getH1()).toHaveClass("tracking-tight");
  });

  it("renders a ReactNode title (span with icon-like child)", () => {
    render(
      <DetailHeader
        title={
          <span>
            <span data-testid="status-dot" className="size-2.5 rounded-full bg-green-500" />
            api.acme.com
          </span>
        }
      />,
    );
    expect(getH1()).toBeInTheDocument();
    expect(screen.getByTestId("status-dot")).toBeInTheDocument();
    expect(getH1()).toContainElement(screen.getByTestId("status-dot"));
  });

  it("renders a compound title with version tag", () => {
    render(
      <DetailHeader
        title={
          <span className="flex items-baseline gap-2">
            inference-endpoint
            <span data-testid="version-tag">v2.1.4</span>
          </span>
        }
      />,
    );
    expect(screen.getByTestId("version-tag")).toHaveTextContent("v2.1.4");
    expect(getH1()).toContainElement(screen.getByTestId("version-tag"));
  });
});

// ---------------------------------------------------------------------------
// DetailHeader — badge prop
// ---------------------------------------------------------------------------
describe("DetailHeader — badge prop", () => {
  it("renders the badge when provided", () => {
    render(
      <DetailHeader
        title="Domain"
        badge={<span data-testid="badge-el">Active</span>}
      />,
    );
    expect(screen.getByTestId("badge-el")).toBeInTheDocument();
  });

  it("badge is sibling to h1 in the same flex container", () => {
    render(
      <DetailHeader
        title="Domain"
        badge={<span data-testid="badge-el">Active</span>}
      />,
    );
    const h1 = getH1();
    const badge = screen.getByTestId("badge-el");
    // Both share the same parent (the inner flex div with gap-3)
    expect(h1.parentElement).toBe(badge.parentElement);
  });

  it("does not render badge container element when badge is omitted", () => {
    render(<DetailHeader title="No Badge" />);
    expect(screen.queryByTestId("badge-el")).not.toBeInTheDocument();
  });

  it("renders success badge text", () => {
    render(<DetailHeader title="T" badge={<span>Active</span>} />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders warning badge text", () => {
    render(<DetailHeader title="T" badge={<span>Pending</span>} />);
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("renders destructive badge text", () => {
    render(<DetailHeader title="T" badge={<span>Failed</span>} />);
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  it("renders secondary badge text", () => {
    render(<DetailHeader title="T" badge={<span>Archived</span>} />);
    expect(screen.getByText("Archived")).toBeInTheDocument();
  });

  it("renders outline badge text", () => {
    render(<DetailHeader title="T" badge={<span>Draft</span>} />);
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// DetailHeader — actions prop
// ---------------------------------------------------------------------------
describe("DetailHeader — actions prop", () => {
  it("renders a single action button", () => {
    render(
      <DetailHeader
        title="API Keys"
        actions={<button type="button">Create key</button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Create key" })).toBeInTheDocument();
  });

  it("renders multiple action buttons", () => {
    render(
      <DetailHeader
        title="Domain"
        actions={
          <>
            <button type="button">Edit</button>
            <button type="button">Deploy</button>
          </>
        }
      />,
    );
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Deploy" })).toBeInTheDocument();
  });

  it("actions wrapper div has flex items-center gap-2 classes", () => {
    const { container } = render(
      <DetailHeader
        title="T"
        actions={<button type="button">X</button>}
      />,
    );
    const actionsWrapper = container.querySelector(".gap-2");
    expect(actionsWrapper).toBeInTheDocument();
    expect(actionsWrapper).toHaveClass("flex", "items-center", "gap-2");
  });

  it("actions do not render when prop is undefined", () => {
    const { container } = render(<DetailHeader title="T" />);
    expect(container.querySelector(".gap-2")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// DetailHeader — actions interactions
// ---------------------------------------------------------------------------
describe("DetailHeader — actions interactions", () => {
  it("button click handler fires", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <DetailHeader
        title="T"
        actions={<button type="button" onClick={handleClick}>Click me</button>}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Click me" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("toggling pinned state via action updates badge", async () => {
    const user = userEvent.setup();

    function Wrapper() {
      const [pinned, setPinned] = React.useState(false);
      return (
        <DetailHeader
          title="dataset.parquet"
          badge={<span data-testid="badge">{pinned ? "Pinned" : "Unpinned"}</span>}
          actions={
            <button type="button" onClick={() => setPinned((p) => !p)}>
              {pinned ? "Unpin" : "Pin"}
            </button>
          }
        />
      );
    }

    render(<Wrapper />);
    expect(screen.getByTestId("badge")).toHaveTextContent("Unpinned");
    expect(screen.getByRole("button", { name: "Pin" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Pin" }));

    expect(screen.getByTestId("badge")).toHaveTextContent("Pinned");
    expect(screen.getByRole("button", { name: "Unpin" })).toBeInTheDocument();
  });

  it("copy button shows transient feedback on click", async () => {
    const user = userEvent.setup();

    function Wrapper() {
      const [copied, setCopied] = React.useState(false);
      function handleCopy() {
        setCopied(true);
      }
      return (
        <DetailHeader
          title="path/to/file"
          actions={
            <button type="button" onClick={handleCopy}>
              {copied ? "Copied!" : "Copy path"}
            </button>
          }
        />
      );
    }

    render(<Wrapper />);
    expect(screen.getByRole("button", { name: "Copy path" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Copy path" }));
    expect(screen.getByRole("button", { name: "Copied!" })).toBeInTheDocument();
  });

  it("multiple actions all fire their own handlers independently", async () => {
    const user = userEvent.setup();
    const onPause = vi.fn();
    const onStop = vi.fn();
    render(
      <DetailHeader
        title="pipeline"
        actions={
          <>
            <button type="button" onClick={onPause}>Pause</button>
            <button type="button" onClick={onStop}>Stop</button>
          </>
        }
      />,
    );
    await user.click(screen.getByRole("button", { name: "Pause" }));
    expect(onPause).toHaveBeenCalledTimes(1);
    expect(onStop).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Stop" }));
    expect(onStop).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// DetailHeader — meta prop / MetaGrid integration
// ---------------------------------------------------------------------------
describe("DetailHeader — meta prop", () => {
  const baseMeta = [
    { label: "Region", value: "us-east-1" },
    { label: "Created", value: "May 31, 2026" },
    { label: "Owner", value: "alice@acme.com" },
    { label: "Plan", value: "Pro" },
  ];

  it("renders all labels", () => {
    render(<DetailHeader title="T" meta={baseMeta} />);
    expect(screen.getByText("Region")).toBeInTheDocument();
    expect(screen.getByText("Created")).toBeInTheDocument();
    expect(screen.getByText("Owner")).toBeInTheDocument();
    expect(screen.getByText("Plan")).toBeInTheDocument();
  });

  it("renders all values", () => {
    render(<DetailHeader title="T" meta={baseMeta} />);
    expect(screen.getByText("us-east-1")).toBeInTheDocument();
    expect(screen.getByText("May 31, 2026")).toBeInTheDocument();
    expect(screen.getByText("alice@acme.com")).toBeInTheDocument();
    expect(screen.getByText("Pro")).toBeInTheDocument();
  });

  it("renders meta grid with correct number of items", () => {
    const { container } = render(<DetailHeader title="T" meta={baseMeta} />);
    // Each item is wrapped in a div.space-y-1
    const itemDivs = container.querySelectorAll(".space-y-1");
    expect(itemDivs).toHaveLength(baseMeta.length);
  });

  it("renders single meta item", () => {
    render(
      <DetailHeader
        title="T"
        meta={[{ label: "Status", value: "Active" }]}
      />,
    );
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("meta label has muted styling classes", () => {
    const { container } = render(
      <DetailHeader
        title="T"
        meta={[{ label: "Region", value: "us-east-1" }]}
      />,
    );
    const labelDiv = container.querySelector(".text-muted-foreground");
    expect(labelDiv).toBeInTheDocument();
    expect(labelDiv).toHaveTextContent("Region");
  });

  it("meta label div has text-xs and font-medium classes", () => {
    const { container } = render(
      <DetailHeader
        title="T"
        meta={[{ label: "Region", value: "us-east-1" }]}
      />,
    );
    const labelDiv = container.querySelector(".text-xs.font-medium.text-muted-foreground");
    expect(labelDiv).toBeInTheDocument();
  });

  it("meta value div has text-sm class", () => {
    const { container } = render(
      <DetailHeader
        title="T"
        meta={[{ label: "Region", value: "us-east-1" }]}
      />,
    );
    const valueDiv = container.querySelector(".text-sm");
    expect(valueDiv).toBeInTheDocument();
    expect(valueDiv).toHaveTextContent("us-east-1");
  });

  it("meta value accepts a ReactNode (Badge element)", () => {
    render(
      <DetailHeader
        title="T"
        meta={[
          {
            label: "Environment",
            value: <span data-testid="env-badge">production</span>,
          },
        ]}
      />,
    );
    expect(screen.getByTestId("env-badge")).toBeInTheDocument();
    expect(screen.getByTestId("env-badge")).toHaveTextContent("production");
  });

  it("meta value accepts a link element", () => {
    render(
      <DetailHeader
        title="T"
        meta={[
          {
            label: "Owner",
            value: <a href="mailto:data-eng@acme.com">data-eng@acme.com</a>,
          },
        ]}
      />,
    );
    const link = screen.getByRole("link", { name: "data-eng@acme.com" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "mailto:data-eng@acme.com");
  });

  it("meta value accepts a styled span for health indicator", () => {
    render(
      <DetailHeader
        title="T"
        meta={[
          {
            label: "Health",
            value: (
              <span data-testid="health">
                <span data-testid="health-dot" className="size-2 rounded-full bg-green-500" />
                Healthy
              </span>
            ),
          },
        ]}
      />,
    );
    expect(screen.getByTestId("health")).toHaveTextContent("Healthy");
    expect(screen.getByTestId("health-dot")).toBeInTheDocument();
  });

  it("renders meta grid element with grid-cols-2 class", () => {
    const { container } = render(
      <DetailHeader title="T" meta={[{ label: "A", value: "B" }]} />
    );
    expect(container.querySelector(".grid-cols-2")).toBeInTheDocument();
  });

  it("renders meta grid element with gap-x-10 and gap-y-5 classes", () => {
    const { container } = render(
      <DetailHeader title="T" meta={[{ label: "A", value: "B" }]} />
    );
    const grid = container.querySelector(".gap-x-10");
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass("gap-y-5");
  });
});

// ---------------------------------------------------------------------------
// DetailHeader — className prop
// ---------------------------------------------------------------------------
describe("DetailHeader — className prop", () => {
  it("applies custom className to outer wrapper", () => {
    const { container } = render(
      <DetailHeader title="T" className="my-custom-class" />,
    );
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  it("preserves default space-y-6 class when custom className is provided", () => {
    const { container } = render(
      <DetailHeader title="T" className="my-custom-class" />,
    );
    expect(container.firstChild).toHaveClass("space-y-6");
  });

  it("works without a className prop (defaults to space-y-6)", () => {
    const { container } = render(<DetailHeader title="T" />);
    expect(container.firstChild).toHaveClass("space-y-6");
  });
});

// ---------------------------------------------------------------------------
// DetailHeader — full composition (title + badge + actions + meta)
// ---------------------------------------------------------------------------
describe("DetailHeader — full composition", () => {
  it("renders all slots together correctly", () => {
    render(
      <DetailHeader
        title="my-project.acme.com"
        badge={<span data-testid="badge">Active</span>}
        actions={
          <>
            <button type="button">Edit</button>
            <button type="button">Deploy</button>
          </>
        }
        meta={[
          { label: "Region", value: "us-east-1" },
          { label: "Created", value: "May 31, 2026" },
        ]}
      />,
    );

    expect(getH1()).toHaveTextContent("my-project.acme.com");
    expect(screen.getByTestId("badge")).toHaveTextContent("Active");
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Deploy" })).toBeInTheDocument();
    expect(screen.getByText("Region")).toBeInTheDocument();
    expect(screen.getByText("us-east-1")).toBeInTheDocument();
  });

  it("renders with many meta items (6 items)", () => {
    const meta = [
      { label: "Environment", value: "production" },
      { label: "Health", value: "Healthy" },
      { label: "Last run", value: "2 min ago" },
      { label: "Events / hr", value: "12,483" },
      { label: "Error rate", value: "0.4%" },
      { label: "Owner", value: "data-eng@acme.com" },
    ];
    render(<DetailHeader title="data-pipeline-v3" meta={meta} />);
    meta.forEach(({ label, value }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
      expect(screen.getByText(value)).toBeInTheDocument();
    });
  });
});

// ---------------------------------------------------------------------------
// MetaGrid — standalone usage
// ---------------------------------------------------------------------------
describe("MetaGrid — standalone", () => {
  it("renders without crashing", () => {
    render(
      <MetaGrid items={[{ label: "Commit", value: "a3f9c12" }]} />,
    );
    expect(screen.getByText("Commit")).toBeInTheDocument();
    expect(screen.getByText("a3f9c12")).toBeInTheDocument();
  });

  it("renders correct number of item cells", () => {
    const items = [
      { label: "Commit", value: "a3f9c12" },
      { label: "Branch", value: "main" },
      { label: "Duration", value: "1m 42s" },
      { label: "Triggered by", value: "push" },
    ];
    const { container } = render(<MetaGrid items={items} />);
    const cells = container.querySelectorAll(".space-y-1");
    expect(cells).toHaveLength(4);
  });

  it("renders all labels and values from items", () => {
    const items = [
      { label: "Commit", value: "a3f9c12" },
      { label: "Branch", value: "main" },
    ];
    render(<MetaGrid items={items} />);
    expect(screen.getByText("Commit")).toBeInTheDocument();
    expect(screen.getByText("a3f9c12")).toBeInTheDocument();
    expect(screen.getByText("Branch")).toBeInTheDocument();
    expect(screen.getByText("main")).toBeInTheDocument();
  });

  it("applies custom className to the grid wrapper", () => {
    const { container } = render(
      <MetaGrid
        className="grid-cols-2 sm:grid-cols-2 lg:grid-cols-2"
        items={[{ label: "Workspace", value: "acme-org" }]}
      />,
    );
    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass("grid-cols-2");
  });

  it("preserves default grid classes when className is provided", () => {
    const { container } = render(
      <MetaGrid
        className="custom-override"
        items={[{ label: "X", value: "Y" }]}
      />,
    );
    const grid = container.firstChild as HTMLElement;
    // cn() merges, so base "grid" class should still be present
    expect(grid).toHaveClass("grid");
    expect(grid).toHaveClass("custom-override");
  });

  it("grid wrapper has correct base grid classes", () => {
    const { container } = render(
      <MetaGrid items={[{ label: "A", value: "B" }]} />,
    );
    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass("grid", "grid-cols-2", "gap-x-10", "gap-y-5");
  });

  it("renders ReactNode values inside items", () => {
    render(
      <MetaGrid
        items={[
          {
            label: "Status",
            value: <span data-testid="status-badge">Live</span>,
          },
        ]}
      />,
    );
    expect(screen.getByTestId("status-badge")).toHaveTextContent("Live");
  });

  it("renders multiple ReactNode values", () => {
    render(
      <MetaGrid
        items={[
          { label: "Status", value: <span data-testid="s1">Live</span> },
          { label: "CDN", value: <span data-testid="s2">Edge</span> },
          { label: "Region", value: "eu-west-1" },
          { label: "Instances", value: "3" },
        ]}
      />,
    );
    expect(screen.getByTestId("s1")).toBeInTheDocument();
    expect(screen.getByTestId("s2")).toBeInTheDocument();
    expect(screen.getByText("eu-west-1")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("each item cell has space-y-1 class", () => {
    const { container } = render(
      <MetaGrid
        items={[
          { label: "A", value: "1" },
          { label: "B", value: "2" },
        ]}
      />,
    );
    const cells = container.querySelectorAll(".space-y-1");
    expect(cells).toHaveLength(2);
  });

  it("label divs have text-xs font-medium text-muted-foreground classes", () => {
    const { container } = render(
      <MetaGrid items={[{ label: "Tier", value: "Enterprise" }]} />,
    );
    const label = container.querySelector(".text-xs.font-medium.text-muted-foreground");
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent("Tier");
  });

  it("value divs have text-sm class", () => {
    const { container } = render(
      <MetaGrid items={[{ label: "Tier", value: "Enterprise" }]} />,
    );
    const valueDiv = container.querySelector(".text-sm");
    expect(valueDiv).toBeInTheDocument();
    expect(valueDiv).toHaveTextContent("Enterprise");
  });

  it("renders a large number of items (8 items)", () => {
    const items = Array.from({ length: 8 }, (_, i) => ({
      label: `Label ${i}`,
      value: `Value ${i}`,
    }));
    const { container } = render(<MetaGrid items={items} />);
    const cells = container.querySelectorAll(".space-y-1");
    expect(cells).toHaveLength(8);
    for (let i = 0; i < 8; i++) {
      expect(screen.getByText(`Label ${i}`)).toBeInTheDocument();
      expect(screen.getByText(`Value ${i}`)).toBeInTheDocument();
    }
  });
});

// ---------------------------------------------------------------------------
// DetailHeader — DOM structure assertions
// ---------------------------------------------------------------------------
describe("DetailHeader — DOM structure", () => {
  it("outer wrapper has space-y-6 class", () => {
    const { container } = render(<DetailHeader title="T" />);
    expect(container.firstChild).toHaveClass("space-y-6");
  });

  it("title row has flex flex-wrap items-center justify-between gap-3 classes", () => {
    const { container } = render(<DetailHeader title="T" />);
    const titleRow = container.querySelector(".flex.flex-wrap.items-center.justify-between.gap-3");
    expect(titleRow).toBeInTheDocument();
  });

  it("left group has flex items-center gap-3 classes", () => {
    const { container } = render(<DetailHeader title="T" />);
    const leftGroup = container.querySelector(".flex.items-center.gap-3");
    expect(leftGroup).toBeInTheDocument();
    expect(leftGroup).toContainElement(getH1());
  });

  it("badge is rendered inside the left group (same parent as h1)", () => {
    render(
      <DetailHeader
        title="T"
        badge={<span data-testid="badge">B</span>}
      />,
    );
    const h1 = getH1();
    const badge = screen.getByTestId("badge");
    expect(h1.parentElement).toBe(badge.parentElement);
  });

  it("actions are rendered in a separate right-side container from the h1", () => {
    render(
      <DetailHeader
        title="T"
        actions={<button type="button">X</button>}
      />,
    );
    const h1 = getH1();
    const btn = screen.getByRole("button", { name: "X" });
    // actions wrapper is not the same as the h1 parent
    expect(h1.parentElement).not.toBe(btn.parentElement);
  });

  it("meta grid appears below the title row", () => {
    const { container } = render(
      <DetailHeader title="T" meta={[{ label: "A", value: "B" }]} />,
    );
    const wrapper = container.firstChild as HTMLElement;
    const children = Array.from(wrapper.children);
    // First child = title row, second child = meta grid
    expect(children).toHaveLength(2);
    expect(children[0]).toHaveClass("flex");
    expect(children[1]).toHaveClass("grid");
  });
});

// ---------------------------------------------------------------------------
// DetailHeader — edge cases
// ---------------------------------------------------------------------------
describe("DetailHeader — edge cases", () => {
  it("renders with only title (minimum required props)", () => {
    const { container } = render(<DetailHeader title="Minimal" />);
    expect(container.firstChild).toBeInTheDocument();
    expect(getH1()).toHaveTextContent("Minimal");
  });

  it("renders with title and badge only (no actions, no meta)", () => {
    render(
      <DetailHeader
        title="API Keys"
        badge={<span>3 active</span>}
      />,
    );
    expect(getH1()).toHaveTextContent("API Keys");
    expect(screen.getByText("3 active")).toBeInTheDocument();
  });

  it("renders with title and actions only (no badge, no meta)", () => {
    render(
      <DetailHeader
        title="Webhooks"
        actions={
          <>
            <button type="button">Documentation</button>
            <button type="button">Add endpoint</button>
          </>
        }
      />,
    );
    expect(getH1()).toHaveTextContent("Webhooks");
    expect(screen.getByRole("button", { name: "Documentation" })).toBeInTheDocument();
  });

  it("handles meta with numeric string values", () => {
    render(
      <DetailHeader
        title="T"
        meta={[
          { label: "Rows", value: "1,240,000" },
          { label: "Size", value: "48.3 MB" },
        ]}
      />,
    );
    expect(screen.getByText("1,240,000")).toBeInTheDocument();
    expect(screen.getByText("48.3 MB")).toBeInTheDocument();
  });

  it("handles meta with percentage values", () => {
    render(
      <DetailHeader
        title="T"
        meta={[
          { label: "Uptime (30d)", value: "99.98%" },
          { label: "Error rate", value: "0.4%" },
        ]}
      />,
    );
    expect(screen.getByText("99.98%")).toBeInTheDocument();
    expect(screen.getByText("0.4%")).toBeInTheDocument();
  });

  it("handles meta with mixed text and ReactNode values", () => {
    render(
      <DetailHeader
        title="T"
        meta={[
          { label: "Commit", value: "a3f9c12" },
          {
            label: "Status",
            value: <span data-testid="status-node">Live</span>,
          },
        ]}
      />,
    );
    expect(screen.getByText("a3f9c12")).toBeInTheDocument();
    expect(screen.getByTestId("status-node")).toHaveTextContent("Live");
  });

  it("title can be a number (coerced to string via ReactNode)", () => {
    // ReactNode allows numbers
    render(<DetailHeader title={42 as unknown as React.ReactNode} />);
    expect(getH1()).toHaveTextContent("42");
  });
});

// ---------------------------------------------------------------------------
// Accessibility (axe)
// ---------------------------------------------------------------------------
describe("DetailHeader — accessibility", () => {
  it("has no axe violations with title only", async () => {
    const { container } = render(<DetailHeader title="Audit Log" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations with all slots populated", async () => {
    const { container } = render(
      <DetailHeader
        title="my-project.acme.com"
        badge={<span>Active</span>}
        actions={
          <>
            <button type="button" aria-label="Edit domain">Edit</button>
            <button type="button" aria-label="Deploy domain">Deploy</button>
          </>
        }
        meta={[
          { label: "Region", value: "us-east-1" },
          { label: "Created", value: "May 31, 2026" },
          { label: "Owner", value: "alice@acme.com" },
          { label: "Plan", value: "Pro" },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations when meta contains a link", async () => {
    const { container } = render(
      <DetailHeader
        title="data-pipeline-v3"
        meta={[
          {
            label: "Owner",
            value: (
              <a href="mailto:data-eng@acme.com">data-eng@acme.com</a>
            ),
          },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations for MetaGrid standalone", async () => {
    const { container } = render(
      <MetaGrid
        items={[
          { label: "Commit", value: "a3f9c12" },
          { label: "Branch", value: "main" },
          { label: "Duration", value: "1m 42s" },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("h1 heading is accessible with its text content", () => {
    render(<DetailHeader title="Accessible Title" />);
    expect(screen.getByRole("heading", { level: 1, name: "Accessible Title" })).toBeInTheDocument();
  });

  it("heading is correctly identified as heading level 1", () => {
    render(<DetailHeader title="Page Title" />);
    const heading = screen.getByRole("heading");
    expect(heading.tagName.toLowerCase()).toBe("h1");
  });
});

// ---------------------------------------------------------------------------
// MetaGrid — accessibility
// ---------------------------------------------------------------------------
describe("MetaGrid — accessibility", () => {
  it("has no axe violations with basic items", async () => {
    const { container } = render(
      <MetaGrid
        items={[
          { label: "Status", value: "Live" },
          { label: "Region", value: "eu-west-1" },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations with ReactNode values", async () => {
    const { container } = render(
      <MetaGrid
        items={[
          { label: "Status", value: <span>Live</span> },
          { label: "CDN", value: <span>Edge</span> },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
