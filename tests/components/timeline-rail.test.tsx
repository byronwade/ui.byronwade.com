import { render, screen, within } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import { axe } from "vitest-axe";
import { Eye, GitCommit, Star } from "@/lib/icons"
import { TimelineRail, type RailItem } from "@/components/timeline-rail";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const singleGroup = (items: RailItem[], label = "Today") => [{ label, items }];

const minimalItems: RailItem[] = [
  { title: "First event" },
  { title: "Second event" },
];

// ---------------------------------------------------------------------------
// 1. Smoke / default render
// ---------------------------------------------------------------------------

describe("TimelineRail — default render", () => {
  it("renders without crashing with minimal props", () => {
    render(<TimelineRail groups={singleGroup(minimalItems)} />);
    expect(screen.getByText("First event")).toBeInTheDocument();
    expect(screen.getByText("Second event")).toBeInTheDocument();
  });

  it("renders a group label", () => {
    render(<TimelineRail groups={singleGroup(minimalItems, "Today")} />);
    expect(screen.getByText("Today")).toBeInTheDocument();
  });

  it("renders the default terminal label", () => {
    render(<TimelineRail groups={singleGroup(minimalItems)} />);
    expect(screen.getByText("This is where it begins")).toBeInTheDocument();
  });

  it("renders a <Flame /> icon in the terminal footer (svg present)", () => {
    const { container } = render(<TimelineRail groups={singleGroup(minimalItems)} />);
    // the icon renders an <svg> element
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(1);
  });

  it("renders items as an ordered list", () => {
    render(<TimelineRail groups={singleGroup(minimalItems)} />);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// 2. Item title rendering
// ---------------------------------------------------------------------------

describe("TimelineRail — item titles", () => {
  it("renders plain string title", () => {
    render(<TimelineRail groups={singleGroup([{ title: "My event" }])} />);
    expect(screen.getByText("My event")).toBeInTheDocument();
  });

  it("renders ReactNode title (e.g. a <strong>)", () => {
    render(
      <TimelineRail
        groups={singleGroup([{ title: <strong data-testid="bold-title">Bold</strong> }])}
      />
    );
    expect(screen.getByTestId("bold-title")).toBeInTheDocument();
    expect(screen.getByText("Bold")).toBeInTheDocument();
  });

  it("truncates long titles (has truncate class on span)", () => {
    const { container } = render(
      <TimelineRail groups={singleGroup([{ title: "A very long title that should be truncated by CSS" }])} />
    );
    const titleSpan = container.querySelector("span.truncate");
    expect(titleSpan).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 3. Meta (trailing time/duration) prop
// ---------------------------------------------------------------------------

describe("TimelineRail — meta prop", () => {
  it("renders meta text when provided", () => {
    render(<TimelineRail groups={singleGroup([{ title: "Event", meta: "2m" }])} />);
    expect(screen.getByText("2m")).toBeInTheDocument();
  });

  it("meta element has mono font class", () => {
    const { container } = render(
      <TimelineRail groups={singleGroup([{ title: "Event", meta: "30s" }])} />
    );
    const metaEl = container.querySelector("span.font-mono");
    expect(metaEl).not.toBeNull();
    expect(metaEl?.textContent).toBe("30s");
  });

  it("does NOT render a meta element when meta is absent", () => {
    const { container } = render(
      <TimelineRail groups={singleGroup([{ title: "No meta" }])} />
    );
    expect(container.querySelector("span.font-mono")).toBeNull();
  });

  it("renders ReactNode meta", () => {
    render(
      <TimelineRail
        groups={singleGroup([{ title: "Event", meta: <em data-testid="meta-em">3h</em> }])}
      />
    );
    expect(screen.getByTestId("meta-em")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 4. Glyph prop — custom leading icon
// ---------------------------------------------------------------------------

describe("TimelineRail — glyph prop", () => {
  it("renders a custom glyph when provided", () => {
    render(
      <TimelineRail
        groups={singleGroup([
          { glyph: <Eye data-testid="eye-icon" className="size-4" />, title: "Page viewed" },
        ])}
      />
    );
    expect(screen.getByTestId("eye-icon")).toBeInTheDocument();
  });

  it("renders multiple different glyphs", () => {
    render(
      <TimelineRail
        groups={singleGroup([
          { glyph: <Eye data-testid="g-eye" className="size-4" />, title: "Viewed" },
          { glyph: <Star data-testid="g-star" className="size-4" />, title: "Starred" },
          { glyph: <GitCommit data-testid="g-git" className="size-4" />, title: "Committed" },
        ])}
      />
    );
    expect(screen.getByTestId("g-eye")).toBeInTheDocument();
    expect(screen.getByTestId("g-star")).toBeInTheDocument();
    expect(screen.getByTestId("g-git")).toBeInTheDocument();
  });

  it("falls back to a StatusDot when no glyph is provided", () => {
    // When no glyph, a StatusDot (span.rounded-full) should render inside the glyph wrapper
    const { container } = render(
      <TimelineRail groups={singleGroup([{ title: "No glyph" }])} />
    );
    // StatusDot renders a span with rounded-full
    const roundedFulSpans = container.querySelectorAll("span.rounded-full");
    expect(roundedFulSpans.length).toBeGreaterThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// 5. Tone prop — StatusDot background color classes
// ---------------------------------------------------------------------------

describe("TimelineRail — tone prop (StatusDot colors)", () => {
  const toneMap: { tone: "success" | "warning" | "danger" | "info" | "neutral"; cls: string }[] = [
    { tone: "success", cls: "bg-success" },
    { tone: "warning", cls: "bg-warning" },
    { tone: "danger",  cls: "bg-destructive" },
    { tone: "info",    cls: "bg-brand" },
    { tone: "neutral", cls: "bg-muted-foreground" },
  ];

  for (const { tone, cls } of toneMap) {
    it(`tone="${tone}" renders StatusDot with class "${cls}"`, () => {
      const { container } = render(
        <TimelineRail groups={singleGroup([{ tone, title: `${tone} event` }])} />
      );
      // StatusDot inner span has the bg class
      const dot = container.querySelector(`span.${cls}`);
      expect(dot).not.toBeNull();
    });
  }

  it("defaults to neutral StatusDot when no tone and no glyph", () => {
    const { container } = render(
      <TimelineRail groups={singleGroup([{ title: "Neutral default" }])} />
    );
    expect(container.querySelector("span.bg-muted-foreground")).not.toBeNull();
  });

  it("does NOT render StatusDot when a glyph is provided (glyph takes precedence)", () => {
    // When glyph is provided, the StatusDot fallback is NOT rendered.
    // The glyph IS rendered instead.
    const { container } = render(
      <TimelineRail
        groups={singleGroup([
          {
            glyph: <Eye data-testid="glyph-only" className="size-4" />,
            tone: "success",  // tone should be ignored
            title: "Glyph wins",
          },
        ])}
      />
    );
    expect(screen.getByTestId("glyph-only")).toBeInTheDocument();
    // No StatusDot bg-success dot should be rendered
    expect(container.querySelector("span.bg-success")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 6. Groups — multiple groups
// ---------------------------------------------------------------------------

describe("TimelineRail — multiple groups", () => {
  const multiGroups = [
    {
      label: "May 31",
      items: [
        { tone: "success" as const, title: "Release published", meta: "09:12" },
        { tone: "info" as const,    title: "Tests ran",          meta: "08:57" },
      ],
    },
    {
      label: "May 30",
      items: [
        { tone: "warning" as const, title: "High memory", meta: "22:03" },
        { tone: "success" as const, title: "Backup done",  meta: "20:00" },
      ],
    },
    {
      label: "May 29",
      items: [
        { tone: "danger" as const,  title: "DB timeout",       meta: "14:30" },
        { tone: "success" as const, title: "Auto-recovery ok", meta: "14:31" },
      ],
    },
  ];

  it("renders all group labels", () => {
    render(<TimelineRail groups={multiGroups} />);
    expect(screen.getByText("May 31")).toBeInTheDocument();
    expect(screen.getByText("May 30")).toBeInTheDocument();
    expect(screen.getByText("May 29")).toBeInTheDocument();
  });

  it("renders all items across all groups", () => {
    render(<TimelineRail groups={multiGroups} />);
    expect(screen.getByText("Release published")).toBeInTheDocument();
    expect(screen.getByText("Tests ran")).toBeInTheDocument();
    expect(screen.getByText("High memory")).toBeInTheDocument();
    expect(screen.getByText("Backup done")).toBeInTheDocument();
    expect(screen.getByText("DB timeout")).toBeInTheDocument();
    expect(screen.getByText("Auto-recovery ok")).toBeInTheDocument();
  });

  it("renders one <ol> per group", () => {
    render(<TimelineRail groups={multiGroups} />);
    const lists = screen.getAllByRole("list");
    expect(lists).toHaveLength(multiGroups.length);
  });

  it("renders correct number of list items total", () => {
    render(<TimelineRail groups={multiGroups} />);
    const allItems = screen.getAllByRole("listitem");
    const totalItems = multiGroups.reduce((sum, g) => sum + g.items.length, 0);
    expect(allItems).toHaveLength(totalItems);
  });

  it("renders all meta timestamps", () => {
    render(<TimelineRail groups={multiGroups} />);
    expect(screen.getByText("09:12")).toBeInTheDocument();
    expect(screen.getByText("08:57")).toBeInTheDocument();
    expect(screen.getByText("22:03")).toBeInTheDocument();
    expect(screen.getByText("20:00")).toBeInTheDocument();
    expect(screen.getByText("14:30")).toBeInTheDocument();
    expect(screen.getByText("14:31")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 7. terminalLabel prop
// ---------------------------------------------------------------------------

describe("TimelineRail — terminalLabel prop", () => {
  it("renders a custom terminalLabel", () => {
    render(
      <TimelineRail
        groups={singleGroup(minimalItems)}
        terminalLabel="Nothing recorded before this point"
      />
    );
    expect(screen.getByText("Nothing recorded before this point")).toBeInTheDocument();
  });

  it("renders 'This is where your journey began' custom label", () => {
    render(
      <TimelineRail
        groups={singleGroup(minimalItems)}
        terminalLabel="This is where your journey began"
      />
    );
    expect(screen.getByText("This is where your journey began")).toBeInTheDocument();
  });

  it("renders 'Pipeline started' custom label", () => {
    render(
      <TimelineRail
        groups={singleGroup(minimalItems)}
        terminalLabel="Pipeline started"
      />
    );
    expect(screen.getByText("Pipeline started")).toBeInTheDocument();
  });

  it("does not render default label when custom label provided", () => {
    render(
      <TimelineRail
        groups={singleGroup(minimalItems)}
        terminalLabel="Custom label"
      />
    );
    expect(screen.queryByText("This is where it begins")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 8. className prop
// ---------------------------------------------------------------------------

describe("TimelineRail — className prop", () => {
  it("applies additional className to root element", () => {
    const { container } = render(
      <TimelineRail
        groups={singleGroup(minimalItems)}
        className="custom-class-x"
      />
    );
    expect(container.firstChild).toHaveClass("custom-class-x");
  });

  it("retains default space-y-4 class when custom className added", () => {
    const { container } = render(
      <TimelineRail
        groups={singleGroup(minimalItems)}
        className="my-extra"
      />
    );
    expect(container.firstChild).toHaveClass("space-y-4");
    expect(container.firstChild).toHaveClass("my-extra");
  });
});

// ---------------------------------------------------------------------------
// 9. Structure / DOM classes
// ---------------------------------------------------------------------------

describe("TimelineRail — structural classes", () => {
  it("group label has rounded-full and bg-muted classes", () => {
    const { container } = render(<TimelineRail groups={singleGroup(minimalItems, "Today")} />);
    const labelSpan = container.querySelector("span.rounded-full.bg-muted");
    expect(labelSpan).not.toBeNull();
    expect(labelSpan?.textContent).toBe("Today");
  });

  it("group label is centered (parent has justify-center)", () => {
    const { container } = render(<TimelineRail groups={singleGroup(minimalItems, "Today")} />);
    const centeredDiv = container.querySelector("div.flex.justify-center");
    expect(centeredDiv).not.toBeNull();
  });

  it("the <ol> has rounded-2xl class", () => {
    const { container } = render(<TimelineRail groups={singleGroup(minimalItems)} />);
    const ol = container.querySelector("ol.rounded-2xl");
    expect(ol).not.toBeNull();
  });

  it("the <ol> has bg-card class", () => {
    const { container } = render(<TimelineRail groups={singleGroup(minimalItems)} />);
    const ol = container.querySelector("ol.bg-card");
    expect(ol).not.toBeNull();
  });

  it("second and subsequent items have border-t class", () => {
    const { container } = render(
      <TimelineRail
        groups={singleGroup([
          { title: "First" },
          { title: "Second" },
          { title: "Third" },
        ])}
      />
    );
    const listItems = container.querySelectorAll("li");
    // First item: no border-t
    expect(listItems[0]).not.toHaveClass("border-t");
    // Second and third: border-t
    expect(listItems[1]).toHaveClass("border-t");
    expect(listItems[2]).toHaveClass("border-t");
  });

  it("first item does NOT have border-t class", () => {
    const { container } = render(
      <TimelineRail groups={singleGroup([{ title: "Only item" }])} />
    );
    const li = container.querySelector("li");
    expect(li).not.toHaveClass("border-t");
  });

  it("terminal footer has flex-col items-center", () => {
    const { container } = render(<TimelineRail groups={singleGroup(minimalItems)} />);
    const footer = container.querySelector("div.flex.flex-col.items-center");
    expect(footer).not.toBeNull();
  });

  it("terminal label has text-xs class", () => {
    const { container } = render(<TimelineRail groups={singleGroup(minimalItems)} />);
    // There may be multiple span.text-xs (group label pills also have it),
    // so find the one whose text is the terminal label.
    const allTextXs = Array.from(container.querySelectorAll("span.text-xs"));
    const termSpan = allTextXs.find((el) => el.textContent === "This is where it begins");
    expect(termSpan).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// 10. Empty groups array
// ---------------------------------------------------------------------------

describe("TimelineRail — edge cases", () => {
  it("renders with empty groups array (no crash)", () => {
    render(<TimelineRail groups={[]} />);
    expect(screen.getByText("This is where it begins")).toBeInTheDocument();
  });

  it("renders with a group that has no items (no crash)", () => {
    render(<TimelineRail groups={[{ label: "Empty group", items: [] }]} />);
    expect(screen.getByText("Empty group")).toBeInTheDocument();
  });

  it("renders with a single item in a group", () => {
    render(<TimelineRail groups={singleGroup([{ title: "Solo event" }])} />);
    expect(screen.getByText("Solo event")).toBeInTheDocument();
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(1);
  });

  it("renders items with no meta and no tone and no glyph", () => {
    render(
      <TimelineRail
        groups={singleGroup([{ title: "Bare item" }])}
      />
    );
    expect(screen.getByText("Bare item")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 11. Combinations — glyph + tone + meta together
// ---------------------------------------------------------------------------

describe("TimelineRail — full item combinations", () => {
  it("renders item with all props (glyph + tone + title + meta)", () => {
    const { container } = render(
      <TimelineRail
        groups={singleGroup([
          {
            glyph: <Eye data-testid="combo-eye" className="size-4" />,
            tone: "success",
            title: "Full combo",
            meta: "5m",
          },
        ])}
      />
    );
    expect(screen.getByTestId("combo-eye")).toBeInTheDocument();
    expect(screen.getByText("Full combo")).toBeInTheDocument();
    expect(screen.getByText("5m")).toBeInTheDocument();
    // glyph takes priority — no bg-success dot
    expect(container.querySelector("span.bg-success")).toBeNull();
  });

  it("renders multiple items each with all tone options in one group", () => {
    render(
      <TimelineRail
        groups={singleGroup([
          { tone: "success", title: "Success item", meta: "1s" },
          { tone: "info",    title: "Info item",    meta: "2s" },
          { tone: "warning", title: "Warning item", meta: "3s" },
          { tone: "danger",  title: "Danger item",  meta: "4s" },
          { tone: "neutral", title: "Neutral item", meta: "5s" },
        ])}
      />
    );
    expect(screen.getByText("Success item")).toBeInTheDocument();
    expect(screen.getByText("Info item")).toBeInTheDocument();
    expect(screen.getByText("Warning item")).toBeInTheDocument();
    expect(screen.getByText("Danger item")).toBeInTheDocument();
    expect(screen.getByText("Neutral item")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 12. within() — scoped queries per group
// ---------------------------------------------------------------------------

describe("TimelineRail — within() scoped queries", () => {
  it("each group <ol> contains only its own items", () => {
    const { container } = render(
      <TimelineRail
        groups={[
          { label: "Group A", items: [{ title: "A1" }, { title: "A2" }] },
          { label: "Group B", items: [{ title: "B1" }] },
        ]}
      />
    );
    const [olA, olB] = container.querySelectorAll("ol");
    const withinA = within(olA);
    const withinB = within(olB);

    expect(withinA.getByText("A1")).toBeInTheDocument();
    expect(withinA.getByText("A2")).toBeInTheDocument();
    expect(withinA.queryByText("B1")).toBeNull();

    expect(withinB.getByText("B1")).toBeInTheDocument();
    expect(withinB.queryByText("A1")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 13. Accessibility
// ---------------------------------------------------------------------------

describe("TimelineRail — accessibility", () => {
  it("has no axe violations with default usage", async () => {
    const { container } = render(
      <TimelineRail
        groups={[
          {
            label: "Today",
            items: [
              { tone: "success", title: "Account created", meta: "2m" },
              { tone: "info",    title: "Profile completed", meta: "1m" },
            ],
          },
        ]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with custom glyphs", async () => {
    const { container } = render(
      <TimelineRail
        groups={[
          {
            label: "Activity",
            items: [
              {
                glyph: <Eye aria-hidden="true" className="size-4" />,
                title: "Page viewed",
                meta: "5m",
              },
              {
                glyph: <Star aria-hidden="true" className="size-4" />,
                title: "Item starred",
                meta: "2m",
              },
            ],
          },
        ]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with multiple groups", async () => {
    const { container } = render(
      <TimelineRail
        groups={[
          {
            label: "May 31",
            items: [
              { tone: "success", title: "Release published", meta: "09:12" },
              { tone: "danger",  title: "DB error",          meta: "08:00" },
            ],
          },
          {
            label: "May 30",
            items: [
              { tone: "warning", title: "High memory", meta: "22:03" },
            ],
          },
        ]}
        terminalLabel="Nothing recorded before this point"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with empty groups", async () => {
    const { container } = render(
      <TimelineRail groups={[]} terminalLabel="No events yet" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with custom terminalLabel", async () => {
    const { container } = render(
      <TimelineRail
        groups={singleGroup([
          { tone: "success", title: "Onboarding complete", meta: "Day 3" },
        ])}
        terminalLabel="This is where your journey began"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// 14. Realistic examples from docs
// ---------------------------------------------------------------------------

describe("TimelineRail — realistic doc examples", () => {
  it("renders the pipeline run example (mixed-glyphs)", () => {
    render(
      <TimelineRail
        groups={[
          {
            label: "Pipeline run #84",
            items: [
              {
                glyph: <GitCommit data-testid="git-commit" className="size-4" />,
                title: "Commit abc1234 received",
                meta: "0:00",
              },
              {
                title: "Lint passed",
                meta: "0:14",
              },
              {
                title: "Unit tests passed (138/138)",
                meta: "0:52",
              },
              {
                title: "Coverage dropped below threshold",
                meta: "0:53",
              },
              {
                title: "Merge blocked — review required",
                meta: "0:53",
              },
            ],
          },
        ]}
        terminalLabel="Pipeline started"
      />
    );
    expect(screen.getByTestId("git-commit")).toBeInTheDocument();
    expect(screen.getByText("Commit abc1234 received")).toBeInTheDocument();
    expect(screen.getByText("Pipeline started")).toBeInTheDocument();
    expect(screen.getByText("Merge blocked — review required")).toBeInTheDocument();
  });

  it("renders the onboarding example (custom-terminal)", () => {
    render(
      <TimelineRail
        groups={[
          {
            label: "Onboarding",
            items: [
              { tone: "success", title: "Email verified",      meta: "Day 1" },
              { tone: "success", title: "Profile set up",      meta: "Day 1" },
              { tone: "success", title: "First import done",   meta: "Day 2" },
              { tone: "success", title: "Invited a colleague", meta: "Day 3" },
            ],
          },
        ]}
        terminalLabel="This is where your journey began"
      />
    );
    expect(screen.getByText("Email verified")).toBeInTheDocument();
    expect(screen.getByText("Invited a colleague")).toBeInTheDocument();
    expect(screen.getByText("This is where your journey began")).toBeInTheDocument();
    // all 4 items rendered
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(4);
  });

  it("renders the status tones example", () => {
    render(
      <TimelineRail
        groups={[
          {
            label: "Status tones",
            items: [
              { tone: "success", title: "Deployment succeeded", meta: "12s" },
              { tone: "info",    title: "Health check passed",  meta: "3s"  },
              { tone: "warning", title: "Retry attempted",      meta: "8s"  },
              { tone: "danger",  title: "Rollback triggered",   meta: "1s"  },
              { tone: "neutral", title: "Log entry recorded",   meta: "0s"  },
            ],
          },
        ]}
      />
    );
    expect(screen.getByText("Deployment succeeded")).toBeInTheDocument();
    expect(screen.getByText("Health check passed")).toBeInTheDocument();
    expect(screen.getByText("Retry attempted")).toBeInTheDocument();
    expect(screen.getByText("Rollback triggered")).toBeInTheDocument();
    expect(screen.getByText("Log entry recorded")).toBeInTheDocument();
  });
});
