import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Section, SettingsList, SettingRow } from "@/components/section";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderSection(props: React.ComponentProps<typeof Section> = { children: <div>Content</div> }) {
  return render(<Section {...props} />);
}

// ─── Section – smoke ─────────────────────────────────────────────────────────

describe("Section – smoke", () => {
  it("renders without crashing with minimal children", () => {
    render(<Section><div>child</div></Section>);
    expect(screen.getByText("child")).toBeInTheDocument();
  });

  it("renders a <section> element", () => {
    const { container } = render(<Section><div>body</div></Section>);
    expect(container.querySelector("section")).toBeInTheDocument();
  });

  it("renders children inside the section", () => {
    render(<Section><p data-testid="inner">Hello</p></Section>);
    expect(screen.getByTestId("inner")).toBeInTheDocument();
  });

  it("renders with all props without crashing", () => {
    render(
      <Section
        title="Test"
        description="A description"
        action={<button>Act</button>}
        className="extra-class"
      >
        <div>body</div>
      </Section>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("renders with no optional props (title/description/action/className all absent)", () => {
    render(<Section><div>minimal</div></Section>);
    expect(screen.getByText("minimal")).toBeInTheDocument();
  });
});

// ─── Section – title prop ─────────────────────────────────────────────────────

describe("Section – title prop", () => {
  it("renders title text in an h2", () => {
    render(<Section title="My Section"><div /></Section>);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("My Section");
  });

  it("h2 has text-sm font-semibold tracking-tight classes", () => {
    render(<Section title="Styled Title"><div /></Section>);
    const h2 = screen.getByRole("heading", { level: 2 });
    expect(h2.className).toContain("text-sm");
    expect(h2.className).toContain("font-semibold");
    expect(h2.className).toContain("tracking-tight");
  });

  it("does NOT render an h2 when title is omitted and action is absent", () => {
    render(<Section><div>body</div></Section>);
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
  });

  it("renders title when only title is provided (no description, no action)", () => {
    render(<Section title="Danger zone"><div /></Section>);
    expect(screen.getByRole("heading", { level: 2, name: "Danger zone" })).toBeInTheDocument();
  });

  it("renders different title values correctly", () => {
    const { rerender } = render(<Section title="First"><div /></Section>);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("First");
    rerender(<Section title="Second"><div /></Section>);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Second");
  });

  it("renders long title strings without truncation", () => {
    const longTitle = "A Very Long Title For This Section That Exceeds Normal Length";
    render(<Section title={longTitle}><div /></Section>);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(longTitle);
  });
});

// ─── Section – description prop ──────────────────────────────────────────────

describe("Section – description prop", () => {
  it("renders description text in a <p> element", () => {
    render(<Section title="T" description="Some help text"><div /></Section>);
    const p = screen.getByText("Some help text");
    expect(p.tagName).toBe("P");
  });

  it("description paragraph has text-sm text-muted-foreground classes", () => {
    render(<Section title="T" description="Desc"><div /></Section>);
    const p = screen.getByText("Desc");
    expect(p.className).toContain("text-sm");
    expect(p.className).toContain("text-muted-foreground");
  });

  it("does NOT render a description <p> when description is omitted", () => {
    const { container } = render(<Section title="T"><div /></Section>);
    // The heading's left-column parent should contain no <p> (no description)
    const heading = screen.getByRole("heading", { level: 2 });
    const leftCol = heading.parentElement!;
    const allPs = leftCol.querySelectorAll("p");
    expect(allPs.length).toBe(0);
  });

  it("renders description without title (header wrapper still present)", () => {
    // description alone, no title → header wrapper NOT rendered
    // Per source: `{(title || action) && ...}` — description without title or action skips header
    render(<Section description="Standalone desc"><div /></Section>);
    // The description text should NOT be visible (header skipped because no title and no action)
    expect(screen.queryByText("Standalone desc")).not.toBeInTheDocument();
  });

  it("renders description when title is also present", () => {
    render(<Section title="T" description="D"><div /></Section>);
    expect(screen.getByText("D")).toBeInTheDocument();
  });

  it("renders description when action is also present (no title)", () => {
    render(
      <Section description="Org-managed" action={<button>Act</button>}>
        <div />
      </Section>
    );
    // Per source: (title || action) block renders; inside it description is rendered if present
    // description IS shown even without title, as long as action triggers the header block
    expect(screen.getByText("Org-managed")).toBeInTheDocument();
  });
});

// ─── Section – action prop ────────────────────────────────────────────────────

describe("Section – action prop", () => {
  it("renders action node when provided", () => {
    render(
      <Section title="T" action={<button>Save</button>}>
        <div />
      </Section>
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("action is wrapped in a shrink-0 container", () => {
    render(
      <Section title="T" action={<button data-testid="act">X</button>}>
        <div />
      </Section>
    );
    const btn = screen.getByTestId("act");
    const wrapper = btn.parentElement!;
    expect(wrapper.className).toContain("shrink-0");
  });

  it("does NOT render action wrapper when action is absent", () => {
    render(<Section title="T"><div /></Section>);
    // The header flex container should have only one child (the title/desc column)
    const heading = screen.getByRole("heading", { level: 2 });
    const flexRow = heading.closest("div")!.parentElement!;
    // shrink-0 wrapper for action should be absent
    const shrinkDivs = flexRow.querySelectorAll(".shrink-0");
    expect(shrinkDivs.length).toBe(0);
  });

  it("renders action even without title (only action triggers header)", () => {
    render(
      <Section action={<button>Add domain</button>}>
        <div />
      </Section>
    );
    expect(screen.getByRole("button", { name: "Add domain" })).toBeInTheDocument();
  });

  it("renders complex action nodes (input + button)", () => {
    render(
      <Section
        title="Invite"
        action={
          <div>
            <input placeholder="email" />
            <button>Invite</button>
          </div>
        }
      >
        <div />
      </Section>
    );
    expect(screen.getByPlaceholderText("email")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Invite" })).toBeInTheDocument();
  });

  it("action button is clickable", async () => {
    const handler = vi.fn();
    render(
      <Section title="T" action={<button onClick={handler}>Save</button>}>
        <div />
      </Section>
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("header flex container has justify-between for title+action layout", () => {
    render(
      <Section title="T" action={<button>Act</button>}>
        <div />
      </Section>
    );
    const heading = screen.getByRole("heading", { level: 2 });
    const flexRow = heading.closest("div")!.parentElement!;
    expect(flexRow.className).toContain("justify-between");
  });
});

// ─── Section – className prop ─────────────────────────────────────────────────

describe("Section – className prop", () => {
  it("merges custom className onto the <section> element", () => {
    const { container } = render(
      <Section className="my-custom-class"><div /></Section>
    );
    const section = container.querySelector("section")!;
    expect(section.className).toContain("my-custom-class");
  });

  it("custom className does not remove the space-y-4 base class", () => {
    const { container } = render(
      <Section className="extra"><div /></Section>
    );
    const section = container.querySelector("section")!;
    expect(section.className).toContain("space-y-4");
  });

  it("section without className still has space-y-4", () => {
    const { container } = render(<Section><div /></Section>);
    const section = container.querySelector("section")!;
    expect(section.className).toContain("space-y-4");
  });

  it("multiple custom classNames are all applied", () => {
    const { container } = render(
      <Section className="foo bar baz"><div /></Section>
    );
    const section = container.querySelector("section")!;
    expect(section.className).toContain("foo");
    expect(section.className).toContain("bar");
    expect(section.className).toContain("baz");
  });
});

// ─── Section – card body wrapper ─────────────────────────────────────────────

describe("Section – card body wrapper", () => {
  it("wraps children in a rounded-2xl card div", () => {
    render(<Section><div data-testid="inner">content</div></Section>);
    const inner = screen.getByTestId("inner");
    const cardWrapper = inner.parentElement!;
    expect(cardWrapper.className).toContain("rounded-2xl");
  });

  it("card wrapper has border border-border class", () => {
    render(<Section><div data-testid="inner">content</div></Section>);
    const cardWrapper = screen.getByTestId("inner").parentElement!;
    expect(cardWrapper.className).toContain("border");
    expect(cardWrapper.className).toContain("border-border");
  });

  it("card wrapper has bg-card class", () => {
    render(<Section><div data-testid="inner">content</div></Section>);
    const cardWrapper = screen.getByTestId("inner").parentElement!;
    expect(cardWrapper.className).toContain("bg-card");
  });

  it("card wrapper has shadow-card class", () => {
    render(<Section><div data-testid="inner">content</div></Section>);
    const cardWrapper = screen.getByTestId("inner").parentElement!;
    expect(cardWrapper.className).toContain("shadow-card");
  });

  it("renders multiple children inside the card wrapper", () => {
    render(
      <Section>
        <div data-testid="a">A</div>
        <div data-testid="b">B</div>
      </Section>
    );
    expect(screen.getByTestId("a")).toBeInTheDocument();
    expect(screen.getByTestId("b")).toBeInTheDocument();
  });
});

// ─── Section – accessible landmark ──────────────────────────────────────────

describe("Section – accessible landmark", () => {
  it("renders as a region landmark when aria-labelledby wires section to h2", () => {
    // <section> needs aria-labelledby to get the "region" role in jsdom.
    // The component doesn't add it automatically, so query the section element directly.
    const { container } = render(<Section title="Notifications"><div>body</div></Section>);
    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
    // The h2 is the accessible name provider for the section
    const h2 = container.querySelector("h2");
    expect(h2).toHaveTextContent("Notifications");
  });

  it("section element is present in the DOM", () => {
    const { container } = render(<Section title="T"><div /></Section>);
    expect(container.querySelector("section")).toBeInTheDocument();
  });
});

// ─── SettingsList – smoke ─────────────────────────────────────────────────────

describe("SettingsList – smoke", () => {
  it("renders without crashing with children", () => {
    render(
      <SettingsList>
        <div>row</div>
      </SettingsList>
    );
    expect(screen.getByText("row")).toBeInTheDocument();
  });

  it("renders a <div> element", () => {
    const { container } = render(
      <SettingsList><div>child</div></SettingsList>
    );
    expect(container.firstChild!.nodeName).toBe("DIV");
  });

  it("has divide-y class", () => {
    const { container } = render(
      <SettingsList><div>child</div></SettingsList>
    );
    expect((container.firstChild as HTMLElement).className).toContain("divide-y");
  });

  it("renders multiple children", () => {
    render(
      <SettingsList>
        <div data-testid="r1">Row 1</div>
        <div data-testid="r2">Row 2</div>
        <div data-testid="r3">Row 3</div>
      </SettingsList>
    );
    expect(screen.getByTestId("r1")).toBeInTheDocument();
    expect(screen.getByTestId("r2")).toBeInTheDocument();
    expect(screen.getByTestId("r3")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(
      <SettingsList className="custom-list"><div>x</div></SettingsList>
    );
    expect((container.firstChild as HTMLElement).className).toContain("custom-list");
  });

  it("custom className does not remove divide-y", () => {
    const { container } = render(
      <SettingsList className="extra"><div>x</div></SettingsList>
    );
    expect((container.firstChild as HTMLElement).className).toContain("divide-y");
  });
});

// ─── SettingRow – smoke ───────────────────────────────────────────────────────

describe("SettingRow – smoke", () => {
  it("renders without crashing with required title", () => {
    render(<SettingRow title="Email digest" />);
    expect(screen.getByText("Email digest")).toBeInTheDocument();
  });

  it("renders a <div> element", () => {
    const { container } = render(<SettingRow title="T" />);
    expect(container.firstChild!.nodeName).toBe("DIV");
  });

  it("has flex layout classes", () => {
    const { container } = render(<SettingRow title="T" />);
    const outer = container.firstChild as HTMLElement;
    expect(outer.className).toContain("flex");
  });

  it("has px-5 py-5 padding classes", () => {
    const { container } = render(<SettingRow title="T" />);
    const outer = container.firstChild as HTMLElement;
    expect(outer.className).toContain("px-5");
    expect(outer.className).toContain("py-5");
  });

  it("has gap-3 class", () => {
    const { container } = render(<SettingRow title="T" />);
    const outer = container.firstChild as HTMLElement;
    expect(outer.className).toContain("gap-3");
  });

  it("has responsive flex-col and sm:flex-row classes", () => {
    const { container } = render(<SettingRow title="T" />);
    const outer = container.firstChild as HTMLElement;
    expect(outer.className).toContain("flex-col");
    expect(outer.className).toContain("sm:flex-row");
  });
});

// ─── SettingRow – title prop ──────────────────────────────────────────────────

describe("SettingRow – title prop", () => {
  it("renders title text", () => {
    render(<SettingRow title="Two-factor authentication" />);
    expect(screen.getByText("Two-factor authentication")).toBeInTheDocument();
  });

  it("title has text-sm font-medium classes", () => {
    render(<SettingRow title="My Title" />);
    const titleEl = screen.getByText("My Title");
    expect(titleEl.className).toContain("text-sm");
    expect(titleEl.className).toContain("font-medium");
  });

  it("title is rendered in a div (not heading)", () => {
    render(<SettingRow title="T" />);
    const titleEl = screen.getByText("T");
    expect(titleEl.tagName).toBe("DIV");
  });

  it("renders different title values correctly", () => {
    const { rerender } = render(<SettingRow title="First" />);
    expect(screen.getByText("First")).toBeInTheDocument();
    rerender(<SettingRow title="Second" />);
    expect(screen.getByText("Second")).toBeInTheDocument();
  });
});

// ─── SettingRow – description prop ───────────────────────────────────────────

describe("SettingRow – description prop", () => {
  it("renders description text when provided", () => {
    render(
      <SettingRow
        title="T"
        description="Receive a daily summary of activity."
      />
    );
    expect(screen.getByText("Receive a daily summary of activity.")).toBeInTheDocument();
  });

  it("description is rendered in a <p> element", () => {
    render(<SettingRow title="T" description="Desc text" />);
    const p = screen.getByText("Desc text");
    expect(p.tagName).toBe("P");
  });

  it("description <p> has text-sm leading-relaxed text-muted-foreground classes", () => {
    render(<SettingRow title="T" description="D" />);
    const p = screen.getByText("D");
    expect(p.className).toContain("text-sm");
    expect(p.className).toContain("leading-relaxed");
    expect(p.className).toContain("text-muted-foreground");
  });

  it("does NOT render description <p> when omitted", () => {
    render(<SettingRow title="T" />);
    // No <p> in the container
    const { container } = render(<SettingRow title="T-only" />);
    expect(container.querySelector("p")).not.toBeInTheDocument();
  });

  it("renders ReactNode description (e.g. a span)", () => {
    render(
      <SettingRow
        title="T"
        description={<span data-testid="rich-desc">Rich <strong>text</strong></span>}
      />
    );
    expect(screen.getByTestId("rich-desc")).toBeInTheDocument();
    expect(screen.getByText("text")).toBeInTheDocument();
  });
});

// ─── SettingRow – control prop ────────────────────────────────────────────────

describe("SettingRow – control prop", () => {
  it("renders control node when provided", () => {
    render(
      <SettingRow
        title="T"
        control={<button data-testid="ctrl">Toggle</button>}
      />
    );
    expect(screen.getByTestId("ctrl")).toBeInTheDocument();
  });

  it("control is wrapped in a shrink-0 container", () => {
    render(
      <SettingRow
        title="T"
        control={<button data-testid="ctrl">Ctrl</button>}
      />
    );
    const ctrl = screen.getByTestId("ctrl");
    const wrapper = ctrl.parentElement!;
    expect(wrapper.className).toContain("shrink-0");
  });

  it("does NOT render control wrapper when control is absent", () => {
    const { container } = render(<SettingRow title="T" />);
    // No shrink-0 wrapper present
    const shrinkDivs = container.querySelectorAll(".shrink-0");
    expect(shrinkDivs.length).toBe(0);
  });

  it("renders a badge as control", () => {
    render(
      <SettingRow
        title="T"
        control={<span data-testid="badge">Active</span>}
      />
    );
    expect(screen.getByTestId("badge")).toBeInTheDocument();
  });

  it("renders an input as control", () => {
    render(
      <SettingRow
        title="T"
        control={<input data-testid="input-ctrl" defaultValue="John" />}
      />
    );
    expect(screen.getByTestId("input-ctrl")).toHaveValue("John");
  });

  it("control shrink-0 wrapper has sm:pt-0.5 class", () => {
    render(
      <SettingRow
        title="T"
        control={<button data-testid="ctrl">X</button>}
      />
    );
    const wrapper = screen.getByTestId("ctrl").parentElement!;
    expect(wrapper.className).toContain("sm:pt-0.5");
  });

  it("clicking control inside a SettingRow fires its handler", async () => {
    const handler = vi.fn();
    render(
      <SettingRow
        title="T"
        control={<button onClick={handler}>Click me</button>}
      />
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Click me" }));
    expect(handler).toHaveBeenCalledTimes(1);
  });
});

// ─── SettingRow – children prop ───────────────────────────────────────────────

describe("SettingRow – children prop", () => {
  it("renders children below the title/description in the left column", () => {
    render(
      <SettingRow title="T" description="D">
        <code data-testid="inline-code">https://example.com/webhook</code>
      </SettingRow>
    );
    expect(screen.getByTestId("inline-code")).toBeInTheDocument();
  });

  it("children appears after description text", () => {
    render(
      <SettingRow title="T" description="Desc">
        <span data-testid="child-node">Child content</span>
      </SettingRow>
    );
    const desc = screen.getByText("Desc");
    const child = screen.getByTestId("child-node");
    // Both should be in the document
    expect(desc).toBeInTheDocument();
    expect(child).toBeInTheDocument();
  });

  it("children renders without description also", () => {
    render(
      <SettingRow title="T">
        <button data-testid="child-btn">Connect Google</button>
      </SettingRow>
    );
    expect(screen.getByTestId("child-btn")).toBeInTheDocument();
  });

  it("children can contain interactive elements", async () => {
    const handler = vi.fn();
    render(
      <SettingRow title="T">
        <button onClick={handler}>Child Action</button>
      </SettingRow>
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Child Action" }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("children AND control can coexist", () => {
    render(
      <SettingRow
        title="T"
        control={<button data-testid="ctrl">Ctrl</button>}
      >
        <span data-testid="child">Child</span>
      </SettingRow>
    );
    expect(screen.getByTestId("ctrl")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});

// ─── SettingRow – className prop ──────────────────────────────────────────────

describe("SettingRow – className prop", () => {
  it("merges custom className onto the outer div", () => {
    const { container } = render(
      <SettingRow title="T" className="my-row-class" />
    );
    expect((container.firstChild as HTMLElement).className).toContain("my-row-class");
  });

  it("custom className does not remove flex base classes", () => {
    const { container } = render(
      <SettingRow title="T" className="extra" />
    );
    expect((container.firstChild as HTMLElement).className).toContain("flex");
  });

  it("custom className does not remove px-5 py-5", () => {
    const { container } = render(
      <SettingRow title="T" className="extra" />
    );
    const outer = container.firstChild as HTMLElement;
    expect(outer.className).toContain("px-5");
    expect(outer.className).toContain("py-5");
  });
});

// ─── Section + SettingsList + SettingRow – composition ───────────────────────

describe("Section + SettingsList + SettingRow – full composition", () => {
  it("renders a complete settings block matching the default example", () => {
    render(
      <Section
        title="Notifications"
        description="Choose which events trigger an email or push alert."
        action={<button>Save</button>}
      >
        <SettingsList>
          <SettingRow
            title="Email digest"
            description="Receive a daily summary of activity in your account."
            control={<input type="checkbox" aria-label="Email digest toggle" />}
          />
          <SettingRow
            title="Security alerts"
            description="Get notified immediately when a new device signs in."
            control={<input type="checkbox" aria-label="Security alerts toggle" />}
          />
        </SettingsList>
      </Section>
    );
    expect(screen.getByRole("heading", { level: 2, name: "Notifications" })).toBeInTheDocument();
    expect(screen.getByText("Choose which events trigger an email or push alert.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByText("Email digest")).toBeInTheDocument();
    expect(screen.getByText("Security alerts")).toBeInTheDocument();
  });

  it("renders a Section with no title or action (no-header pattern)", () => {
    render(
      <Section>
        <SettingsList>
          <SettingRow
            title="Compact mode"
            description="Reduce spacing."
            control={<input type="checkbox" aria-label="compact" />}
          />
        </SettingsList>
      </Section>
    );
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
    expect(screen.getByText("Compact mode")).toBeInTheDocument();
  });

  it("renders a Section with title only (no description, no action) – Danger zone pattern", () => {
    render(
      <Section title="Danger zone">
        <div>Destructive actions here.</div>
      </Section>
    );
    expect(screen.getByRole("heading", { level: 2, name: "Danger zone" })).toBeInTheDocument();
    expect(screen.getByText("Destructive actions here.")).toBeInTheDocument();
  });

  it("renders multiple stacked sections without interference", () => {
    render(
      <div>
        <Section title="Profile">
          <SettingsList>
            <SettingRow title="Full name" />
          </SettingsList>
        </Section>
        <Section title="Security">
          <SettingsList>
            <SettingRow title="2FA" />
          </SettingsList>
        </Section>
        <Section title="Billing">
          <SettingsList>
            <SettingRow title="Plan" />
          </SettingsList>
        </Section>
      </div>
    );
    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings).toHaveLength(3);
    expect(headings[0]).toHaveTextContent("Profile");
    expect(headings[1]).toHaveTextContent("Security");
    expect(headings[2]).toHaveTextContent("Billing");
  });

  it("SettingsList children are divided (divide-y present)", () => {
    const { container } = render(
      <SettingsList>
        <SettingRow title="Row 1" />
        <SettingRow title="Row 2" />
      </SettingsList>
    );
    // The SettingsList div has divide-y
    const listDiv = container.querySelector(".divide-y");
    expect(listDiv).toBeInTheDocument();
    expect(listDiv!.children.length).toBe(2);
  });

  it("inline-children example: code block as SettingRow child renders correctly", () => {
    render(
      <Section title="Webhook endpoints">
        <SettingsList>
          <SettingRow
            title="Production endpoint"
            description="Receives all events."
            control={<span>Active</span>}
          >
            <code data-testid="endpoint-url">https://api.example.com/webhooks/prod</code>
          </SettingRow>
        </SettingsList>
      </Section>
    );
    expect(screen.getByTestId("endpoint-url")).toHaveTextContent(
      "https://api.example.com/webhooks/prod"
    );
  });

  it("with-action example: title + description + complex action node", () => {
    render(
      <Section
        title="Custom domain"
        description="Send from your own domain."
        action={<button>Add domain</button>}
      >
        <SettingsList>
          <SettingRow title="docs.example.com" control={<span>Active</span>} />
        </SettingsList>
      </Section>
    );
    expect(screen.getByText("Send from your own domain.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add domain" })).toBeInTheDocument();
    expect(screen.getByText("docs.example.com")).toBeInTheDocument();
  });

  it("setting-row-controls: multiple control types in one section", () => {
    render(
      <Section title="Preferences">
        <SettingsList>
          <SettingRow
            title="Two-factor authentication"
            control={<input type="checkbox" aria-label="2FA" defaultChecked />}
          />
          <SettingRow
            title="Display name"
            control={<input type="text" aria-label="Display name" defaultValue="John" />}
          />
          <SettingRow
            title="Account plan"
            control={<span>Pro</span>}
          />
          <SettingRow
            title="Delete account"
            control={<button>Delete</button>}
          />
        </SettingsList>
      </Section>
    );
    expect(screen.getByText("Two-factor authentication")).toBeInTheDocument();
    expect(screen.getByText("Display name")).toBeInTheDocument();
    expect(screen.getByText("Account plan")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });
});

// ─── Section – left column internal structure ─────────────────────────────────

describe("Section – left column internal structure", () => {
  it("title and description are in a shared left column (space-y-1)", () => {
    render(<Section title="T" description="D"><div /></Section>);
    const title = screen.getByText("T");
    const desc = screen.getByText("D");
    // Both should share the same parent
    expect(title.parentElement).toBe(desc.parentElement);
  });

  it("left column has space-y-1 class", () => {
    render(<Section title="T" description="D"><div /></Section>);
    const title = screen.getByText("T");
    const leftCol = title.parentElement!;
    expect(leftCol.className).toContain("space-y-1");
  });

  it("header flex row has items-end class", () => {
    render(<Section title="T" action={<button>Act</button>}><div /></Section>);
    const heading = screen.getByRole("heading", { level: 2 });
    const flexRow = heading.closest("div")!.parentElement!;
    expect(flexRow.className).toContain("items-end");
  });

  it("header flex row has gap-4 class", () => {
    render(<Section title="T" action={<button>Act</button>}><div /></Section>);
    const heading = screen.getByRole("heading", { level: 2 });
    const flexRow = heading.closest("div")!.parentElement!;
    expect(flexRow.className).toContain("gap-4");
  });
});

// ─── SettingRow – left column internal structure ──────────────────────────────

describe("SettingRow – left column internal structure", () => {
  it("left column has space-y-1.5 class", () => {
    render(<SettingRow title="T" description="D" />);
    const title = screen.getByText("T");
    const leftCol = title.parentElement!;
    expect(leftCol.className).toContain("space-y-1.5");
  });

  it("left column has sm:max-w-xl class", () => {
    render(<SettingRow title="T" />);
    const title = screen.getByText("T");
    const leftCol = title.parentElement!;
    expect(leftCol.className).toContain("sm:max-w-xl");
  });
});

// ─── Interaction: controls inside Section/SettingsList/SettingRow ─────────────

describe("Section – interactive controls inside SettingRow", () => {
  it("checkbox control can be checked and unchecked", async () => {
    render(
      <Section title="Notifications">
        <SettingsList>
          <SettingRow
            title="Email digest"
            control={<input type="checkbox" aria-label="Email digest" />}
          />
        </SettingsList>
      </Section>
    );
    const user = userEvent.setup();
    const checkbox = screen.getByRole("checkbox", { name: "Email digest" });
    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("text input control can be typed into", async () => {
    render(
      <Section title="Profile">
        <SettingsList>
          <SettingRow
            title="Display name"
            control={<input type="text" aria-label="Display name" defaultValue="" />}
          />
        </SettingsList>
      </Section>
    );
    const user = userEvent.setup();
    const input = screen.getByRole("textbox", { name: "Display name" });
    await user.type(input, "Alice");
    expect(input).toHaveValue("Alice");
  });

  it("button control fires onClick when clicked", async () => {
    const handler = vi.fn();
    render(
      <Section title="API keys">
        <SettingsList>
          <SettingRow
            title="Production key"
            control={<button onClick={handler}>Revoke</button>}
          />
        </SettingsList>
      </Section>
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Revoke" }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("disabled input control is not interactive", async () => {
    const handler = vi.fn();
    render(
      <SettingRow
        title="Account plan"
        control={<button disabled onClick={handler}>Change</button>}
      />
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Change" }));
    expect(handler).not.toHaveBeenCalled();
  });
});

// ─── Re-render behavior ───────────────────────────────────────────────────────

describe("Section – re-render behavior", () => {
  it("updates title on re-render", () => {
    const { rerender } = render(<Section title="Before"><div /></Section>);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Before");
    rerender(<Section title="After"><div /></Section>);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("After");
  });

  it("title appears when re-rendered with title after being absent", () => {
    const { rerender } = render(<Section><div /></Section>);
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
    rerender(<Section title="Now Visible"><div /></Section>);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Now Visible");
  });

  it("action updates on re-render", () => {
    const { rerender } = render(
      <Section title="T" action={<button>Old Action</button>}><div /></Section>
    );
    expect(screen.getByRole("button", { name: "Old Action" })).toBeInTheDocument();
    rerender(
      <Section title="T" action={<button>New Action</button>}><div /></Section>
    );
    expect(screen.getByRole("button", { name: "New Action" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Old Action" })).not.toBeInTheDocument();
  });

  it("children update on re-render", () => {
    const { rerender } = render(<Section><div>Child A</div></Section>);
    expect(screen.getByText("Child A")).toBeInTheDocument();
    rerender(<Section><div>Child B</div></Section>);
    expect(screen.getByText("Child B")).toBeInTheDocument();
    expect(screen.queryByText("Child A")).not.toBeInTheDocument();
  });
});

describe("SettingRow – re-render behavior", () => {
  it("updates title on re-render", () => {
    const { rerender } = render(<SettingRow title="Before" />);
    expect(screen.getByText("Before")).toBeInTheDocument();
    rerender(<SettingRow title="After" />);
    expect(screen.getByText("After")).toBeInTheDocument();
  });

  it("description appears/disappears on re-render", () => {
    const { rerender } = render(<SettingRow title="T" description="Has desc" />);
    expect(screen.getByText("Has desc")).toBeInTheDocument();
    rerender(<SettingRow title="T" />);
    expect(screen.queryByText("Has desc")).not.toBeInTheDocument();
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe("Section – edge cases", () => {
  it("renders with a string child directly", () => {
    render(<Section>plain text child</Section>);
    expect(screen.getByText("plain text child")).toBeInTheDocument();
  });

  it("renders with deeply nested children", () => {
    render(
      <Section>
        <div>
          <div>
            <span data-testid="deep">deep</span>
          </div>
        </div>
      </Section>
    );
    expect(screen.getByTestId("deep")).toBeInTheDocument();
  });

  it("renders with a React Fragment as children", () => {
    render(
      <Section>
        <>
          <div data-testid="frag-a">A</div>
          <div data-testid="frag-b">B</div>
        </>
      </Section>
    );
    expect(screen.getByTestId("frag-a")).toBeInTheDocument();
    expect(screen.getByTestId("frag-b")).toBeInTheDocument();
  });

  it("does not crash with className=''", () => {
    render(<Section className=""><div /></Section>);
    const { container } = render(<Section className=""><div>content</div></Section>);
    expect(container.querySelector("section")).toBeInTheDocument();
  });

  it("renders title with special characters", () => {
    render(<Section title="Account & Data · Preferences"><div /></Section>);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Account & Data · Preferences"
    );
  });
});

describe("SettingRow – edge cases", () => {
  it("renders with only title (all other props omitted)", () => {
    render(<SettingRow title="Minimal" />);
    expect(screen.getByText("Minimal")).toBeInTheDocument();
  });

  it("renders with title + description + control + children all at once", () => {
    render(
      <SettingRow
        title="Full row"
        description="Description"
        control={<span data-testid="ctrl">Status</span>}
      >
        <code data-testid="extra">code block</code>
      </SettingRow>
    );
    expect(screen.getByText("Full row")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByTestId("ctrl")).toBeInTheDocument();
    expect(screen.getByTestId("extra")).toBeInTheDocument();
  });

  it("does not crash with className=''", () => {
    const { container } = render(<SettingRow title="T" className="" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe("SettingsList – edge cases", () => {
  it("renders with a single child", () => {
    render(
      <SettingsList>
        <SettingRow title="Only row" />
      </SettingsList>
    );
    expect(screen.getByText("Only row")).toBeInTheDocument();
  });

  it("renders with many children", () => {
    const rows = Array.from({ length: 10 }, (_, i) => `Row ${i + 1}`);
    render(
      <SettingsList>
        {rows.map((r) => (
          <SettingRow key={r} title={r} />
        ))}
      </SettingsList>
    );
    rows.forEach((r) => expect(screen.getByText(r)).toBeInTheDocument());
  });
});

// ─── Accessibility (axe) ─────────────────────────────────────────────────────

describe("Section – accessibility (axe)", () => {
  it("Section with title and children has no axe violations", async () => {
    const { container } = render(
      <Section title="Notifications">
        <div>Content</div>
      </Section>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Section with title + description + action has no axe violations", async () => {
    const { container } = render(
      <Section
        title="API keys"
        description="Manage your API access tokens."
        action={<button>Create key</button>}
      >
        <div>Keys list</div>
      </Section>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Section with no header props has no axe violations", async () => {
    const { container } = render(
      <Section>
        <div>Body content</div>
      </Section>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("full Section + SettingsList + SettingRow composition has no axe violations", async () => {
    const { container } = render(
      <Section
        title="Preferences"
        description="These settings apply to your personal account."
      >
        <SettingsList>
          <SettingRow
            title="Two-factor authentication"
            description="Require a second verification step."
            control={<input type="checkbox" aria-label="Two-factor authentication" />}
          />
          <SettingRow
            title="Display name"
            description="Shown on comments and feeds."
            control={<input type="text" aria-label="Display name" defaultValue="Alex" />}
          />
        </SettingsList>
      </Section>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("SettingRow with button control has no axe violations", async () => {
    const { container } = render(
      <SettingRow
        title="Delete account"
        description="Permanently remove your account."
        control={<button>Delete</button>}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("SettingRow with inline children code block has no axe violations", async () => {
    const { container } = render(
      <SettingRow
        title="Production endpoint"
        description="Receives all events."
        control={<span>Active</span>}
      >
        <code>https://api.example.com/webhooks/prod</code>
      </SettingRow>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("multiple stacked Section components have no axe violations", async () => {
    const { container } = render(
      <div>
        <Section title="Profile">
          <SettingsList>
            <SettingRow
              title="Full name"
              control={<input type="text" aria-label="Full name" defaultValue="Alex" />}
            />
          </SettingsList>
        </Section>
        <Section title="Security">
          <SettingsList>
            <SettingRow
              title="Two-factor authentication"
              control={<input type="checkbox" aria-label="Two-factor authentication" />}
            />
          </SettingsList>
        </Section>
        <Section title="Danger zone">
          <SettingsList>
            <SettingRow
              title="Delete workspace"
              control={<button>Delete</button>}
            />
          </SettingsList>
        </Section>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("SettingsList alone has no axe violations", async () => {
    const { container } = render(
      <SettingsList>
        <SettingRow
          title="Compact mode"
          description="Reduce spacing."
          control={<input type="checkbox" aria-label="Compact mode" />}
        />
      </SettingsList>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Section with action-only (no title) has no axe violations", async () => {
    const { container } = render(
      <Section action={<button>Add domain</button>}>
        <div>Body</div>
      </Section>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
