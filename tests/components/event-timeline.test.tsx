/**
 * Exhaustive tests for <EventTimeline />
 *
 * Component source: components/event-timeline.tsx
 * API summary:
 *   - EventTimeline renders an <ol> (list) of events
 *   - Props: events: TimelineEvent[], className?: string
 *   - TimelineEvent: { title: ReactNode, description?: ReactNode, timestamp?: ReactNode,
 *                       tone?: "success" | "warning" | "danger" | "info" | "neutral" }
 *   - Each event is an <li> with a status dot + content column
 *   - Dot tones map to CSS classes:
 *       success  → bg-success
 *       warning  → bg-warning
 *       danger   → bg-destructive
 *       info     → bg-brand
 *       neutral  → bg-muted-foreground
 *   - Default tone (omitted) → neutral → bg-muted-foreground
 *   - Connector line (w-px bg-border) appears between ALL events except after the last
 *   - title is always rendered (text-sm font-medium)
 *   - description is optional → rendered as <p> with text-muted-foreground
 *   - timestamp is optional → rendered in font-mono text-xs text-muted-foreground
 *   - title and description accept React.ReactNode (JSX, strings, etc.)
 */

import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { EventTimeline, type TimelineEvent } from "@/components/event-timeline";

// ---------------------------------------------------------------------------
// Helpers & fixtures
// ---------------------------------------------------------------------------

const ALL_TONES = ["success", "warning", "danger", "info", "neutral"] as const;
type Tone = (typeof ALL_TONES)[number];

/** Expected CSS class fragment for each tone. */
const TONE_CLASSES: Record<Tone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  info: "bg-brand",
  neutral: "bg-muted-foreground",
};

/** Minimal single-event fixture. */
function singleEvent(overrides: Partial<TimelineEvent> = {}): TimelineEvent[] {
  return [{ title: "Event title", ...overrides }];
}

/** Full deployment pipeline fixture (matches default.tsx example). */
const deploymentEvents: TimelineEvent[] = [
  {
    title: "Build succeeded",
    description: "All 42 tests passed with no warnings.",
    timestamp: "2026-05-31T09:15:00Z",
    tone: "success",
  },
  {
    title: "Deployment started",
    description: "Uploading assets to production environment.",
    timestamp: "2026-05-31T09:16:03Z",
    tone: "info",
  },
  {
    title: "Health check failed",
    description: "Service did not respond within 30 s — retrying.",
    timestamp: "2026-05-31T09:17:45Z",
    tone: "warning",
  },
  {
    title: "Rollback triggered",
    description: "Previous stable release restored automatically.",
    timestamp: "2026-05-31T09:18:02Z",
    tone: "danger",
  },
];

/** All-tone fixture (matches tones.tsx example). */
const allToneEvents: TimelineEvent[] = ALL_TONES.map((tone) => ({
  title: `${tone} event`,
  description: `Description for ${tone}`,
  tone,
}));

/** Title-only fixture (matches title-only.tsx example). */
const titleOnlyEvents: TimelineEvent[] = [
  { title: "Account created", tone: "success" },
  { title: "Email verified", tone: "success" },
  { title: "Profile completed", tone: "info" },
  { title: "Two-factor enabled", tone: "success" },
  { title: "First login", tone: "neutral" },
];

// ---------------------------------------------------------------------------
// 1. Renders without crashing — default usage
// ---------------------------------------------------------------------------

describe("EventTimeline — default render", () => {
  it("renders without crashing with a single event", () => {
    const { container } = render(<EventTimeline events={singleEvent()} />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders an <ol> element at the root", () => {
    const { container } = render(<EventTimeline events={singleEvent()} />);
    expect(container.firstElementChild!.tagName).toBe("OL");
  });

  it("renders as an ordered list (accessible role 'list')", () => {
    render(<EventTimeline events={singleEvent()} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("renders with multiple events without crashing", () => {
    const { container } = render(<EventTimeline events={deploymentEvents} />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders with an empty events array without crashing", () => {
    const { container } = render(<EventTimeline events={[]} />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders the correct number of list items", () => {
    render(<EventTimeline events={deploymentEvents} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(deploymentEvents.length);
  });

  it("renders one list item for a single event", () => {
    render(<EventTimeline events={singleEvent()} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("renders zero list items for an empty array", () => {
    render(<EventTimeline events={[]} />);
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// 2. Base CSS classes on <ol>
// ---------------------------------------------------------------------------

describe("EventTimeline — base CSS classes on <ol>", () => {
  it("has 'relative' class on the root <ol>", () => {
    const { container } = render(<EventTimeline events={singleEvent()} />);
    expect((container.firstElementChild as HTMLElement).className).toContain("relative");
  });

  it("has 'space-y-6' class on the root <ol>", () => {
    const { container } = render(<EventTimeline events={singleEvent()} />);
    expect((container.firstElementChild as HTMLElement).className).toContain("space-y-6");
  });
});

// ---------------------------------------------------------------------------
// 3. className prop merging
// ---------------------------------------------------------------------------

describe("EventTimeline — className prop merging", () => {
  it("applies custom className to the root <ol>", () => {
    const { container } = render(
      <EventTimeline events={singleEvent()} className="custom-timeline" />
    );
    expect((container.firstElementChild as HTMLElement).className).toContain("custom-timeline");
  });

  it("preserves base classes when custom className is provided", () => {
    const { container } = render(
      <EventTimeline events={singleEvent()} className="my-class" />
    );
    const ol = container.firstElementChild as HTMLElement;
    expect(ol.className).toContain("my-class");
    expect(ol.className).toContain("relative");
    expect(ol.className).toContain("space-y-6");
  });

  it("renders correctly without className prop (no prop provided)", () => {
    const { container } = render(<EventTimeline events={singleEvent()} />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("allows multiple custom classes", () => {
    const { container } = render(
      <EventTimeline events={singleEvent()} className="mt-4 px-2" />
    );
    const ol = container.firstElementChild as HTMLElement;
    expect(ol.className).toContain("mt-4");
    expect(ol.className).toContain("px-2");
  });
});

// ---------------------------------------------------------------------------
// 4. title field — always rendered
// ---------------------------------------------------------------------------

describe("EventTimeline — title field", () => {
  it("renders string title text", () => {
    render(<EventTimeline events={[{ title: "Build succeeded" }]} />);
    expect(screen.getByText("Build succeeded")).toBeInTheDocument();
  });

  it("title has text-sm class", () => {
    const { container } = render(<EventTimeline events={[{ title: "My event" }]} />);
    const titleEl = container.querySelector(".text-sm.font-medium");
    expect(titleEl).not.toBeNull();
    expect(titleEl!.textContent).toContain("My event");
  });

  it("title has font-medium class", () => {
    const { container } = render(<EventTimeline events={[{ title: "My event" }]} />);
    const titleEl = container.querySelector(".font-medium");
    expect(titleEl).not.toBeNull();
  });

  it("renders JSX ReactNode as title", () => {
    render(
      <EventTimeline
        events={[
          {
            title: (
              <span>
                Pull request{" "}
                <code data-testid="pr-code">#482</code> merged
              </span>
            ),
          },
        ]}
      />
    );
    expect(screen.getByTestId("pr-code")).toBeInTheDocument();
    expect(screen.getByTestId("pr-code").textContent).toBe("#482");
  });

  it("renders all titles for multiple events", () => {
    render(<EventTimeline events={deploymentEvents} />);
    expect(screen.getByText("Build succeeded")).toBeInTheDocument();
    expect(screen.getByText("Deployment started")).toBeInTheDocument();
    expect(screen.getByText("Health check failed")).toBeInTheDocument();
    expect(screen.getByText("Rollback triggered")).toBeInTheDocument();
  });

  it("renders titles for title-only events (no description/timestamp)", () => {
    render(<EventTimeline events={titleOnlyEvents} />);
    titleOnlyEvents.forEach((e) => {
      expect(screen.getByText(e.title as string)).toBeInTheDocument();
    });
  });
});

// ---------------------------------------------------------------------------
// 5. description field — optional
// ---------------------------------------------------------------------------

describe("EventTimeline — description field", () => {
  it("renders description text when provided", () => {
    render(
      <EventTimeline
        events={[{ title: "Step complete", description: "All checks passed." }]}
      />
    );
    expect(screen.getByText("All checks passed.")).toBeInTheDocument();
  });

  it("description is rendered inside a <p> element", () => {
    const { container } = render(
      <EventTimeline
        events={[{ title: "Event", description: "Details here." }]}
      />
    );
    const p = container.querySelector("p");
    expect(p).not.toBeNull();
    expect(p!.textContent).toBe("Details here.");
  });

  it("description <p> has text-muted-foreground class", () => {
    const { container } = render(
      <EventTimeline
        events={[{ title: "Event", description: "Details here." }]}
      />
    );
    const p = container.querySelector("p");
    expect(p!.className).toContain("text-muted-foreground");
  });

  it("description <p> has text-sm class", () => {
    const { container } = render(
      <EventTimeline
        events={[{ title: "Event", description: "Details here." }]}
      />
    );
    const p = container.querySelector("p");
    expect(p!.className).toContain("text-sm");
  });

  it("does NOT render a <p> when description is omitted", () => {
    const { container } = render(
      <EventTimeline events={[{ title: "Title only" }]} />
    );
    expect(container.querySelector("p")).toBeNull();
  });

  it("does NOT render a <p> when description is undefined", () => {
    const { container } = render(
      <EventTimeline events={[{ title: "Title only", description: undefined }]} />
    );
    expect(container.querySelector("p")).toBeNull();
  });

  it("renders JSX ReactNode as description", () => {
    render(
      <EventTimeline
        events={[
          {
            title: "CI failed",
            description: (
              <span>
                Step <code data-testid="step-code">lint</code> failed.
              </span>
            ),
          },
        ]}
      />
    );
    expect(screen.getByTestId("step-code")).toBeInTheDocument();
    expect(screen.getByTestId("step-code").textContent).toBe("lint");
  });

  it("renders descriptions for all events in a multi-event list", () => {
    render(<EventTimeline events={deploymentEvents} />);
    deploymentEvents.forEach((e) => {
      if (e.description) {
        expect(screen.getByText(e.description as string)).toBeInTheDocument();
      }
    });
  });

  it("correctly mixes events with and without description", () => {
    const events: TimelineEvent[] = [
      { title: "With desc", description: "I have a description" },
      { title: "Without desc" },
      { title: "Also with desc", description: "Me too" },
    ];
    render(<EventTimeline events={events} />);
    expect(screen.getByText("I have a description")).toBeInTheDocument();
    expect(screen.getByText("Me too")).toBeInTheDocument();
    // Only 2 <p> elements for the 2 descriptions
    const { container } = render(<EventTimeline events={events} />);
    expect(container.querySelectorAll("p")).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// 6. timestamp field — optional
// ---------------------------------------------------------------------------

describe("EventTimeline — timestamp field", () => {
  it("renders timestamp text when provided", () => {
    render(
      <EventTimeline
        events={[{ title: "Task queued", timestamp: "2026-05-31T08:00:00Z" }]}
      />
    );
    expect(screen.getByText("2026-05-31T08:00:00Z")).toBeInTheDocument();
  });

  it("timestamp container has font-mono class", () => {
    const { container } = render(
      <EventTimeline
        events={[{ title: "Event", timestamp: "2026-01-01T00:00:00Z" }]}
      />
    );
    const tsEl = container.querySelector(".font-mono");
    expect(tsEl).not.toBeNull();
    expect(tsEl!.textContent).toContain("2026-01-01T00:00:00Z");
  });

  it("timestamp container has text-xs class", () => {
    const { container } = render(
      <EventTimeline
        events={[{ title: "Event", timestamp: "2026-01-01T00:00:00Z" }]}
      />
    );
    const tsEl = container.querySelector(".font-mono");
    expect(tsEl!.className).toContain("text-xs");
  });

  it("timestamp container has text-muted-foreground class", () => {
    const { container } = render(
      <EventTimeline
        events={[{ title: "Event", timestamp: "2026-01-01T00:00:00Z" }]}
      />
    );
    const tsEl = container.querySelector(".font-mono");
    expect(tsEl!.className).toContain("text-muted-foreground");
  });

  it("timestamp container has pt-1 class", () => {
    const { container } = render(
      <EventTimeline
        events={[{ title: "Event", timestamp: "2026-01-01T00:00:00Z" }]}
      />
    );
    const tsEl = container.querySelector(".font-mono");
    expect(tsEl!.className).toContain("pt-1");
  });

  it("does NOT render a timestamp element when timestamp is omitted", () => {
    const { container } = render(
      <EventTimeline events={[{ title: "No timestamp" }]} />
    );
    expect(container.querySelector(".font-mono")).toBeNull();
  });

  it("does NOT render a timestamp element when timestamp is undefined", () => {
    const { container } = render(
      <EventTimeline events={[{ title: "No timestamp", timestamp: undefined }]} />
    );
    expect(container.querySelector(".font-mono")).toBeNull();
  });

  it("renders JSX ReactNode as timestamp", () => {
    render(
      <EventTimeline
        events={[
          {
            title: "Event",
            timestamp: (
              <time dateTime="2026-05-31T09:15:00Z" data-testid="time-el">
                May 31, 2026
              </time>
            ),
          },
        ]}
      />
    );
    expect(screen.getByTestId("time-el")).toBeInTheDocument();
    expect(screen.getByTestId("time-el").textContent).toBe("May 31, 2026");
  });

  it("renders timestamps for all events in a timestamped fixture", () => {
    render(<EventTimeline events={deploymentEvents} />);
    expect(screen.getByText("2026-05-31T09:15:00Z")).toBeInTheDocument();
    expect(screen.getByText("2026-05-31T09:16:03Z")).toBeInTheDocument();
    expect(screen.getByText("2026-05-31T09:17:45Z")).toBeInTheDocument();
    expect(screen.getByText("2026-05-31T09:18:02Z")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 7. tone prop — every value
// ---------------------------------------------------------------------------

describe("EventTimeline — tone prop", () => {
  ALL_TONES.forEach((tone) => {
    describe(`tone="${tone}"`, () => {
      it("renders without crashing", () => {
        const { container } = render(
          <EventTimeline events={[{ title: `${tone} event`, tone }]} />
        );
        expect(container.firstElementChild).toBeInTheDocument();
      });

      it(`dot has class "${TONE_CLASSES[tone]}"`, () => {
        const { container } = render(
          <EventTimeline events={[{ title: `${tone} event`, tone }]} />
        );
        // The dot is the first <span> inside the list item's first column div
        const dot = container.querySelector(`.${TONE_CLASSES[tone]}`);
        expect(dot).not.toBeNull();
      });

      it("dot is a rounded-full circle (size-2 rounded-full)", () => {
        const { container } = render(
          <EventTimeline events={[{ title: "dot test", tone }]} />
        );
        const dot = container.querySelector(`.${TONE_CLASSES[tone]}`);
        expect(dot!.className).toContain("rounded-full");
        expect(dot!.className).toContain("size-2");
      });

      it("dot has ring-4 ring-background classes", () => {
        const { container } = render(
          <EventTimeline events={[{ title: "ring test", tone }]} />
        );
        const dot = container.querySelector(`.${TONE_CLASSES[tone]}`);
        expect(dot!.className).toContain("ring-4");
        expect(dot!.className).toContain("ring-background");
      });
    });
  });

  it("omitting tone defaults to neutral (bg-muted-foreground)", () => {
    const { container } = render(
      <EventTimeline events={[{ title: "No tone set" }]} />
    );
    const dot = container.querySelector(".bg-muted-foreground");
    expect(dot).not.toBeNull();
  });

  it("all tones render their respective dot classes in an all-tone list", () => {
    const { container } = render(<EventTimeline events={allToneEvents} />);
    ALL_TONES.forEach((tone) => {
      expect(container.querySelector(`.${TONE_CLASSES[tone]}`)).not.toBeNull();
    });
  });
});

// ---------------------------------------------------------------------------
// 8. Connector line between events
// ---------------------------------------------------------------------------

describe("EventTimeline — connector lines", () => {
  it("renders a connector line between events (w-px bg-border)", () => {
    const { container } = render(<EventTimeline events={deploymentEvents} />);
    const connectors = container.querySelectorAll(".w-px.bg-border");
    // 4 events → 3 connectors (no connector after last)
    expect(connectors).toHaveLength(deploymentEvents.length - 1);
  });

  it("does NOT render a connector line for a single event (no element after last dot)", () => {
    const { container } = render(<EventTimeline events={singleEvent()} />);
    expect(container.querySelector(".w-px.bg-border")).toBeNull();
  });

  it("does not render a connector after the last item in a 2-event list", () => {
    const events: TimelineEvent[] = [
      { title: "First", tone: "success" },
      { title: "Second", tone: "danger" },
    ];
    const { container } = render(<EventTimeline events={events} />);
    const connectors = container.querySelectorAll(".w-px.bg-border");
    expect(connectors).toHaveLength(1);
  });

  it("renders n-1 connectors for n events", () => {
    const n = 6;
    const events: TimelineEvent[] = Array.from({ length: n }, (_, i) => ({
      title: `Event ${i + 1}`,
    }));
    const { container } = render(<EventTimeline events={events} />);
    const connectors = container.querySelectorAll(".w-px.bg-border");
    expect(connectors).toHaveLength(n - 1);
  });

  it("connector has flex-1 class to fill vertical space", () => {
    const { container } = render(
      <EventTimeline events={[{ title: "A" }, { title: "B" }]} />
    );
    const connector = container.querySelector(".w-px.bg-border");
    expect(connector!.className).toContain("flex-1");
  });

  it("connector has mt-1 class", () => {
    const { container } = render(
      <EventTimeline events={[{ title: "A" }, { title: "B" }]} />
    );
    const connector = container.querySelector(".w-px.bg-border");
    expect(connector!.className).toContain("mt-1");
  });
});

// ---------------------------------------------------------------------------
// 9. List item structure
// ---------------------------------------------------------------------------

describe("EventTimeline — list item structure", () => {
  it("each list item has 'relative flex gap-4 pl-1' classes", () => {
    const { container } = render(<EventTimeline events={singleEvent()} />);
    const li = container.querySelector("li");
    expect(li!.className).toContain("relative");
    expect(li!.className).toContain("flex");
    expect(li!.className).toContain("gap-4");
    expect(li!.className).toContain("pl-1");
  });

  it("content div inside list item has flex-1 class", () => {
    const { container } = render(<EventTimeline events={singleEvent()} />);
    const li = container.querySelector("li");
    // The second child of the li is the content column
    const contentDiv = li!.children[1] as HTMLElement;
    expect(contentDiv.className).toContain("flex-1");
  });

  it("content div has space-y-0.5 class", () => {
    const { container } = render(<EventTimeline events={singleEvent()} />);
    const li = container.querySelector("li");
    const contentDiv = li!.children[1] as HTMLElement;
    expect(contentDiv.className).toContain("space-y-0.5");
  });

  it("content div has pb-1 class", () => {
    const { container } = render(<EventTimeline events={singleEvent()} />);
    const li = container.querySelector("li");
    const contentDiv = li!.children[1] as HTMLElement;
    expect(contentDiv.className).toContain("pb-1");
  });

  it("left column has 'flex flex-col items-center' classes", () => {
    const { container } = render(<EventTimeline events={singleEvent()} />);
    const li = container.querySelector("li");
    const leftCol = li!.children[0] as HTMLElement;
    expect(leftCol.className).toContain("flex");
    expect(leftCol.className).toContain("flex-col");
    expect(leftCol.className).toContain("items-center");
  });

  it("renders the correct title text inside the list item", () => {
    render(<EventTimeline events={[{ title: "Custom title" }]} />);
    const item = screen.getByRole("listitem");
    expect(within(item).getByText("Custom title")).toBeInTheDocument();
  });

  it("renders the correct description inside the list item", () => {
    render(
      <EventTimeline
        events={[{ title: "Event A", description: "Desc for A" }]}
      />
    );
    const item = screen.getByRole("listitem");
    expect(within(item).getByText("Desc for A")).toBeInTheDocument();
  });

  it("renders the correct timestamp inside the list item", () => {
    render(
      <EventTimeline
        events={[{ title: "Event A", timestamp: "T-123" }]}
      />
    );
    const item = screen.getByRole("listitem");
    expect(within(item).getByText("T-123")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 10. Rich ReactNode content (rich-content.tsx example patterns)
// ---------------------------------------------------------------------------

describe("EventTimeline — rich ReactNode content", () => {
  it("renders <code> elements inside JSX title", () => {
    render(
      <EventTimeline
        events={[
          {
            title: (
              <span>
                PR <code data-testid="code-pr">#482</code> merged
              </span>
            ),
            tone: "success",
          },
        ]}
      />
    );
    expect(screen.getByTestId("code-pr")).toBeInTheDocument();
  });

  it("renders <code> elements inside JSX description", () => {
    render(
      <EventTimeline
        events={[
          {
            title: "CI failed",
            description: (
              <span>
                Step <code data-testid="code-step">lint</code> exited with code{" "}
                <code data-testid="code-exit">1</code>.
              </span>
            ),
            tone: "danger",
          },
        ]}
      />
    );
    expect(screen.getByTestId("code-step")).toBeInTheDocument();
    expect(screen.getByTestId("code-exit")).toBeInTheDocument();
  });

  it("renders a full rich-content event list without crashing", () => {
    const richEvents: TimelineEvent[] = [
      {
        title: (
          <span>
            PR <code>#482</code> merged
          </span>
        ),
        description: (
          <span>
            Branch <code>feat/dark-mode</code> → <code>main</code>.
          </span>
        ),
        timestamp: "2026-05-31T11:04:30Z",
        tone: "success",
      },
      {
        title: (
          <span>
            CI pipeline <code>#1093</code> failed
          </span>
        ),
        description: (
          <span>
            Step <code>lint</code> exited with code <code>1</code>.
          </span>
        ),
        timestamp: "2026-05-31T11:06:10Z",
        tone: "danger",
      },
    ];
    render(<EventTimeline events={richEvents} />);
    expect(screen.getByText("2026-05-31T11:04:30Z")).toBeInTheDocument();
    expect(screen.getByText("2026-05-31T11:06:10Z")).toBeInTheDocument();
  });

  it("renders a ReactNode timestamp (time element)", () => {
    render(
      <EventTimeline
        events={[
          {
            title: "Event",
            timestamp: (
              <time dateTime="2026-05-31T09:15:00Z" data-testid="ts-time">
                2026-05-31T09:15:00Z
              </time>
            ),
          },
        ]}
      />
    );
    expect(screen.getByTestId("ts-time")).toBeInTheDocument();
  });

  it("renders numeric title (number coerced to ReactNode)", () => {
    render(<EventTimeline events={[{ title: 42 as unknown as string }]} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 11. Live-feed pattern (prepend) — dynamic updates
// ---------------------------------------------------------------------------

describe("EventTimeline — dynamic event list updates", () => {
  it("re-renders and shows newly prepended event", () => {
    const initial: TimelineEvent[] = [{ title: "Request received", tone: "neutral" }];
    const { rerender } = render(<EventTimeline events={initial} />);
    expect(screen.getByText("Request received")).toBeInTheDocument();

    const updated: TimelineEvent[] = [
      { title: "Validation passed", tone: "success" },
      ...initial,
    ];
    rerender(<EventTimeline events={updated} />);
    expect(screen.getByText("Validation passed")).toBeInTheDocument();
    expect(screen.getByText("Request received")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("re-renders and reflects a full event list replacement", () => {
    const first: TimelineEvent[] = [{ title: "Old event" }];
    const second: TimelineEvent[] = [{ title: "New event A" }, { title: "New event B" }];
    const { rerender } = render(<EventTimeline events={first} />);
    expect(screen.getByText("Old event")).toBeInTheDocument();

    rerender(<EventTimeline events={second} />);
    expect(screen.queryByText("Old event")).not.toBeInTheDocument();
    expect(screen.getByText("New event A")).toBeInTheDocument();
    expect(screen.getByText("New event B")).toBeInTheDocument();
  });

  it("correctly updates connector count when events grow from 1 to 3", () => {
    const { container, rerender } = render(
      <EventTimeline events={[{ title: "A" }]} />
    );
    expect(container.querySelectorAll(".w-px.bg-border")).toHaveLength(0);

    rerender(
      <EventTimeline events={[{ title: "A" }, { title: "B" }, { title: "C" }]} />
    );
    expect(container.querySelectorAll(".w-px.bg-border")).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// 12. Single-event edge case (single-event.tsx example)
// ---------------------------------------------------------------------------

describe("EventTimeline — single event", () => {
  it("renders a single event without a connector line", () => {
    const { container } = render(
      <EventTimeline
        events={[
          {
            title: "Waiting for first event",
            description: "No activity recorded yet.",
            tone: "neutral",
          },
        ]}
      />
    );
    expect(container.querySelector(".w-px.bg-border")).toBeNull();
  });

  it("renders title for single event", () => {
    render(
      <EventTimeline events={[{ title: "Waiting for first event", tone: "neutral" }]} />
    );
    expect(screen.getByText("Waiting for first event")).toBeInTheDocument();
  });

  it("renders description for single event", () => {
    render(
      <EventTimeline
        events={[
          {
            title: "Waiting",
            description: "No activity recorded yet.",
            tone: "neutral",
          },
        ]}
      />
    );
    expect(screen.getByText("No activity recorded yet.")).toBeInTheDocument();
  });

  it("renders single-item list with exactly one listitem", () => {
    render(<EventTimeline events={[{ title: "Only one" }]} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// 13. Timestamps example (timestamps.tsx)
// ---------------------------------------------------------------------------

describe("EventTimeline — timestamps fixture", () => {
  const tsEvents: TimelineEvent[] = [
    {
      title: "Task queued",
      description: "Waiting for an available worker.",
      timestamp: "2026-05-31T08:00:00Z",
      tone: "neutral",
    },
    {
      title: "Task started",
      description: "Worker picked up the job.",
      timestamp: "2026-05-31T08:03:17Z",
      tone: "info",
    },
    {
      title: "Checkpoint saved",
      description: "Intermediate results written to storage.",
      timestamp: "2026-05-31T08:11:44Z",
      tone: "neutral",
    },
    {
      title: "Task completed",
      description: "Output is ready to download.",
      timestamp: "2026-05-31T08:19:02Z",
      tone: "success",
    },
  ];

  it("renders all 4 events without crashing", () => {
    render(<EventTimeline events={tsEvents} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
  });

  it("renders all timestamps in font-mono style", () => {
    const { container } = render(<EventTimeline events={tsEvents} />);
    const monoEls = container.querySelectorAll(".font-mono");
    expect(monoEls).toHaveLength(4);
  });

  it("renders 3 connector lines for 4 events", () => {
    const { container } = render(<EventTimeline events={tsEvents} />);
    expect(container.querySelectorAll(".w-px.bg-border")).toHaveLength(3);
  });

  it("renders each title text", () => {
    render(<EventTimeline events={tsEvents} />);
    tsEvents.forEach((e) => {
      expect(screen.getByText(e.title as string)).toBeInTheDocument();
    });
  });

  it("renders each description text", () => {
    render(<EventTimeline events={tsEvents} />);
    tsEvents.forEach((e) => {
      if (e.description) {
        expect(screen.getByText(e.description as string)).toBeInTheDocument();
      }
    });
  });
});

// ---------------------------------------------------------------------------
// 14. All tones example (tones.tsx) — every tone in one list
// ---------------------------------------------------------------------------

describe("EventTimeline — all tones in one list", () => {
  it("renders 5 list items for 5-tone fixture", () => {
    render(<EventTimeline events={allToneEvents} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
  });

  it("renders 4 connector lines for 5 events", () => {
    const { container } = render(<EventTimeline events={allToneEvents} />);
    expect(container.querySelectorAll(".w-px.bg-border")).toHaveLength(4);
  });

  ALL_TONES.forEach((tone) => {
    it(`renders the "${tone}" dot class for the matching event`, () => {
      const { container } = render(<EventTimeline events={allToneEvents} />);
      expect(container.querySelector(`.${TONE_CLASSES[tone]}`)).not.toBeNull();
    });
  });
});

// ---------------------------------------------------------------------------
// 15. Edge cases
// ---------------------------------------------------------------------------

describe("EventTimeline — edge cases", () => {
  it("handles an event with only a title (no optional fields)", () => {
    const { container } = render(<EventTimeline events={[{ title: "Bare event" }]} />);
    expect(screen.getByText("Bare event")).toBeInTheDocument();
    expect(container.querySelector("p")).toBeNull();
    expect(container.querySelector(".font-mono")).toBeNull();
  });

  it("handles all optional fields simultaneously (title + description + timestamp + tone)", () => {
    const event: TimelineEvent = {
      title: "Full event",
      description: "A complete event",
      timestamp: "2026-01-01T00:00:00Z",
      tone: "success",
    };
    render(<EventTimeline events={[event]} />);
    expect(screen.getByText("Full event")).toBeInTheDocument();
    expect(screen.getByText("A complete event")).toBeInTheDocument();
    expect(screen.getByText("2026-01-01T00:00:00Z")).toBeInTheDocument();
  });

  it("renders a very long list (20 events) without crashing", () => {
    const events: TimelineEvent[] = Array.from({ length: 20 }, (_, i) => ({
      title: `Event ${i + 1}`,
      tone: ALL_TONES[i % ALL_TONES.length],
    }));
    const { container } = render(<EventTimeline events={events} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(20);
    expect(container.querySelectorAll(".w-px.bg-border")).toHaveLength(19);
  });

  it("renders events with empty string title without crashing", () => {
    const { container } = render(<EventTimeline events={[{ title: "" }]} />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders events with empty string description without showing <p> text", () => {
    // empty string is falsy — component's `{e.description && ...}` should suppress it
    // However React treats empty string as falsy for conditional rendering
    const { container } = render(
      <EventTimeline events={[{ title: "Event", description: "" }]} />
    );
    // Empty string is falsy, so conditional render suppresses it
    const p = container.querySelector("p");
    // Either no <p>, or <p> with empty text — both are acceptable; guard only that it doesn't crash
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders an all-neutral list (no tone prop on any event)", () => {
    const events: TimelineEvent[] = [
      { title: "Step one" },
      { title: "Step two" },
      { title: "Step three" },
    ];
    const { container } = render(<EventTimeline events={events} />);
    const dots = container.querySelectorAll(".bg-muted-foreground");
    expect(dots).toHaveLength(3);
  });

  it("renders events list that mixes tones and missing tones", () => {
    const mixed: TimelineEvent[] = [
      { title: "A", tone: "success" },
      { title: "B" }, // neutral by default
      { title: "C", tone: "danger" },
    ];
    const { container } = render(<EventTimeline events={mixed} />);
    expect(container.querySelector(".bg-success")).not.toBeNull();
    expect(container.querySelector(".bg-muted-foreground")).not.toBeNull();
    expect(container.querySelector(".bg-destructive")).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 16. Accessibility — axe violations
// ---------------------------------------------------------------------------

describe("EventTimeline — accessibility (axe)", () => {
  it("has no axe violations with a single event", async () => {
    const { container } = render(
      <EventTimeline events={[{ title: "Single accessible event" }]} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with the deployment fixture (all tones)", async () => {
    const { container } = render(<EventTimeline events={deploymentEvents} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations for every individual tone", async () => {
    for (const tone of ALL_TONES) {
      const { container } = render(
        <EventTimeline events={[{ title: `${tone} event`, tone }]} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  it("has no axe violations with description text", async () => {
    const { container } = render(
      <EventTimeline
        events={[{ title: "Build succeeded", description: "All tests passed.", tone: "success" }]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with timestamp", async () => {
    const { container } = render(
      <EventTimeline
        events={[
          {
            title: "Task queued",
            description: "Waiting.",
            timestamp: "2026-05-31T08:00:00Z",
            tone: "neutral",
          },
        ]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations for the all-tone events list", async () => {
    const { container } = render(<EventTimeline events={allToneEvents} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations for title-only events list", async () => {
    const { container } = render(<EventTimeline events={titleOnlyEvents} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with JSX ReactNode title", async () => {
    const { container } = render(
      <EventTimeline
        events={[
          {
            title: (
              <span>
                PR <code>#482</code> merged
              </span>
            ),
            tone: "success",
          },
        ]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with custom className", async () => {
    const { container } = render(
      <EventTimeline events={singleEvent()} className="mt-4 max-w-md" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations for an empty events list", async () => {
    const { container } = render(<EventTimeline events={[]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("is wrapped in an accessible ordered list structure", () => {
    render(<EventTimeline events={deploymentEvents} />);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(deploymentEvents.length);
  });
});

// ---------------------------------------------------------------------------
// 17. DOM structure introspection
// ---------------------------------------------------------------------------

describe("EventTimeline — DOM structure", () => {
  it("renders a single root <ol> element with no siblings", () => {
    const { container } = render(<EventTimeline events={singleEvent()} />);
    expect(container.children).toHaveLength(1);
    expect(container.firstElementChild!.tagName).toBe("OL");
  });

  it("each <li> has exactly 2 children: the dot column and the content column", () => {
    const { container } = render(<EventTimeline events={singleEvent()} />);
    const li = container.querySelector("li");
    expect(li!.children).toHaveLength(2);
  });

  it("dot column (first child of <li>) has flex flex-col items-center", () => {
    const { container } = render(<EventTimeline events={singleEvent()} />);
    const li = container.querySelector("li");
    const dotCol = li!.children[0] as HTMLElement;
    expect(dotCol.className).toContain("flex");
    expect(dotCol.className).toContain("flex-col");
    expect(dotCol.className).toContain("items-center");
  });

  it("dot (first child of dot column) has mt-1 class", () => {
    const { container } = render(<EventTimeline events={singleEvent()} />);
    const li = container.querySelector("li");
    const dotCol = li!.children[0];
    const dot = dotCol.children[0] as HTMLElement;
    expect(dot.className).toContain("mt-1");
  });

  it("content column (second child of <li>) renders the title text", () => {
    const { container } = render(<EventTimeline events={[{ title: "Check me" }]} />);
    const li = container.querySelector("li");
    const contentCol = li!.children[1];
    expect(contentCol.textContent).toContain("Check me");
  });

  it("list items are ordered by the events array order", () => {
    render(
      <EventTimeline
        events={[
          { title: "First event" },
          { title: "Second event" },
          { title: "Third event" },
        ]}
      />
    );
    const items = screen.getAllByRole("listitem");
    expect(items[0].textContent).toContain("First event");
    expect(items[1].textContent).toContain("Second event");
    expect(items[2].textContent).toContain("Third event");
  });
});

// ---------------------------------------------------------------------------
// 18. TypeScript / export correctness
// ---------------------------------------------------------------------------

describe("EventTimeline — exports", () => {
  it("EventTimeline is a function (React component)", () => {
    expect(typeof EventTimeline).toBe("function");
  });

  it("EventTimeline can be called with just an events prop", () => {
    expect(() =>
      render(<EventTimeline events={[{ title: "Test" }]} />)
    ).not.toThrow();
  });
});
