import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { PageHeader } from "@/components/page-header";

// ─── Smoke ────────────────────────────────────────────────────────────────────

describe("PageHeader – smoke", () => {
  it("renders without crashing with only title", () => {
    render(<PageHeader title="Dashboard" />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders the title in a level-1 heading", () => {
    render(<PageHeader title="My Page" />);
    expect(screen.getByRole("heading", { level: 1, name: "My Page" })).toBeInTheDocument();
  });

  it("renders a wrapping <div> as the root element", () => {
    const { container } = render(<PageHeader title="Root" />);
    expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
  });

  it("renders with title, description, and children without crashing", () => {
    render(
      <PageHeader title="Projects" description="Manage your projects.">
        <button>New Project</button>
      </PageHeader>
    );
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});

// ─── title prop ───────────────────────────────────────────────────────────────

describe("PageHeader – title prop", () => {
  it("renders title text inside h1", () => {
    render(<PageHeader title="All Projects" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("All Projects");
  });

  it("title is a required prop — present in rendered DOM", () => {
    render(<PageHeader title="Analytics" />);
    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });

  it("h1 has font-semibold class in start alignment", () => {
    render(<PageHeader title="Fonts" />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.className).toContain("font-semibold");
  });

  it("h1 has tracking-tight class in start alignment", () => {
    render(<PageHeader title="Tracking" />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.className).toContain("tracking-tight");
  });

  it("h1 has text-xl class in start alignment", () => {
    render(<PageHeader title="Text size" />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.className).toContain("text-xl");
  });

  it("h1 has text-2xl class in center alignment", () => {
    render(<PageHeader title="Centered" align="center" />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.className).toContain("text-2xl");
  });

  it("h1 also has sm:text-3xl class in center alignment", () => {
    render(<PageHeader title="Centered Responsive" align="center" />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.className).toContain("sm:text-3xl");
  });

  it("renders title with special characters", () => {
    render(<PageHeader title="API & Webhooks — v2.0" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("API & Webhooks — v2.0");
  });

  it("renders title with a long string without crashing", () => {
    const longTitle = "A".repeat(200);
    render(<PageHeader title={longTitle} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(longTitle);
  });
});

// ─── description prop ─────────────────────────────────────────────────────────

describe("PageHeader – description prop", () => {
  it("renders description text when provided", () => {
    render(
      <PageHeader
        title="Analytics"
        description="Track engagement metrics and audience trends over time."
      />
    );
    expect(
      screen.getByText("Track engagement metrics and audience trends over time.")
    ).toBeInTheDocument();
  });

  it("description is inside a <p> element", () => {
    const { container } = render(
      <PageHeader title="Title" description="A paragraph description." />
    );
    const p = container.querySelector("p");
    expect(p).not.toBeNull();
    expect(p).toHaveTextContent("A paragraph description.");
  });

  it("description has text-muted-foreground class in start alignment", () => {
    const { container } = render(
      <PageHeader title="Title" description="Desc" />
    );
    const p = container.querySelector("p")!;
    expect(p.className).toContain("text-muted-foreground");
  });

  it("description has text-sm class in start alignment", () => {
    const { container } = render(
      <PageHeader title="Title" description="Small text" />
    );
    const p = container.querySelector("p")!;
    expect(p.className).toContain("text-sm");
  });

  it("description has text-muted-foreground class in center alignment", () => {
    const { container } = render(
      <PageHeader title="Title" description="Centered desc" align="center" />
    );
    const p = container.querySelector("p")!;
    expect(p.className).toContain("text-muted-foreground");
  });

  it("description has text-[15px] class in center alignment", () => {
    const { container } = render(
      <PageHeader title="Title" description="15px desc" align="center" />
    );
    const p = container.querySelector("p")!;
    expect(p.className).toContain("text-[15px]");
  });

  it("does NOT render a <p> when description is omitted", () => {
    const { container } = render(<PageHeader title="No Desc" />);
    expect(container.querySelector("p")).toBeNull();
  });

  it("does NOT render a <p> when description is undefined", () => {
    const { container } = render(<PageHeader title="Undef Desc" description={undefined} />);
    expect(container.querySelector("p")).toBeNull();
  });

  it("renders a long description without crashing", () => {
    const longDesc = "B".repeat(500);
    render(<PageHeader title="Long" description={longDesc} />);
    expect(screen.getByText(longDesc)).toBeInTheDocument();
  });
});

// ─── align prop ───────────────────────────────────────────────────────────────

describe("PageHeader – align prop", () => {
  it("defaults to align='start' (flex-col layout, not centered)", () => {
    const { container } = render(<PageHeader title="Start" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("flex-col");
  });

  it("align='start' root has flex class", () => {
    const { container } = render(<PageHeader title="Start" align="start" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("flex");
  });

  it("align='start' root has sm:flex-row class", () => {
    const { container } = render(<PageHeader title="Start" align="start" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("sm:flex-row");
  });

  it("align='start' root has sm:items-center class", () => {
    const { container } = render(<PageHeader title="Start" align="start" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("sm:items-center");
  });

  it("align='start' root has sm:justify-between class", () => {
    const { container } = render(<PageHeader title="Start" align="start" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("sm:justify-between");
  });

  it("align='center' root has items-center class", () => {
    const { container } = render(<PageHeader title="Center" align="center" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("items-center");
  });

  it("align='center' root has text-center class", () => {
    const { container } = render(<PageHeader title="Center" align="center" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("text-center");
  });

  it("align='center' root has flex-col class", () => {
    const { container } = render(<PageHeader title="Center" align="center" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("flex-col");
  });

  it("align='center' root has gap-4 class", () => {
    const { container } = render(<PageHeader title="Center" align="center" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("gap-4");
  });

  it("align='start' produces different root classes than align='center'", () => {
    const { container: startContainer } = render(<PageHeader title="S" align="start" />);
    const { container: centerContainer } = render(<PageHeader title="C" align="center" />);
    const startClass = (startContainer.firstChild as HTMLElement).className;
    const centerClass = (centerContainer.firstChild as HTMLElement).className;
    expect(startClass).not.toBe(centerClass);
  });

  it("align='center' does NOT have sm:justify-between class", () => {
    const { container } = render(<PageHeader title="Center" align="center" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).not.toContain("sm:justify-between");
  });

  it("align='start' does NOT have text-center class", () => {
    const { container } = render(<PageHeader title="Start" align="start" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).not.toContain("text-center");
  });
});

// ─── children prop (actions slot) ─────────────────────────────────────────────

describe("PageHeader – children prop (actions slot)", () => {
  it("renders a single child button in start alignment", () => {
    render(
      <PageHeader title="Reports">
        <button>Export</button>
      </PageHeader>
    );
    expect(screen.getByRole("button", { name: "Export" })).toBeInTheDocument();
  });

  it("renders multiple children in start alignment", () => {
    render(
      <PageHeader title="Team Members">
        <button>Manage Roles</button>
        <button>Invite Member</button>
      </PageHeader>
    );
    expect(screen.getByRole("button", { name: "Manage Roles" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Invite Member" })).toBeInTheDocument();
  });

  it("renders children inside a flex wrapper in start alignment", () => {
    const { container } = render(
      <PageHeader title="Title">
        <button>Action</button>
      </PageHeader>
    );
    // The children wrapper div should have flex class
    const wrappers = container.querySelectorAll("div");
    const flexWrapper = Array.from(wrappers).find(
      (div) => div.className.includes("flex") && div.className.includes("items-center") && div.className.includes("gap-2")
    );
    expect(flexWrapper).toBeDefined();
  });

  it("renders children inside a flex wrapper in center alignment", () => {
    const { container } = render(
      <PageHeader title="Title" align="center">
        <button>Continue</button>
      </PageHeader>
    );
    const wrappers = container.querySelectorAll("div");
    const flexWrapper = Array.from(wrappers).find(
      (div) => div.className.includes("flex-wrap") && div.className.includes("justify-center")
    );
    expect(flexWrapper).toBeDefined();
  });

  it("children wrapper in center alignment has justify-center class", () => {
    const { container } = render(
      <PageHeader title="Center" align="center">
        <button>Button</button>
      </PageHeader>
    );
    const wrappers = container.querySelectorAll("div");
    const childrenWrapper = Array.from(wrappers).find(
      (div) => div.className.includes("justify-center")
    );
    expect(childrenWrapper).not.toBeUndefined();
  });

  it("children wrapper in center alignment has flex-wrap class", () => {
    const { container } = render(
      <PageHeader title="Center" align="center">
        <button>Button</button>
      </PageHeader>
    );
    const wrappers = container.querySelectorAll("div");
    const childrenWrapper = Array.from(wrappers).find(
      (div) => div.className.includes("flex-wrap")
    );
    expect(childrenWrapper).not.toBeUndefined();
  });

  it("does NOT render a children wrapper when no children passed (start)", () => {
    const { container } = render(<PageHeader title="No Actions" />);
    // There should be only the root div and the inner text div — no extra gap-2 wrapper
    const flexGap = container.querySelector("div.gap-2");
    expect(flexGap).toBeNull();
  });

  it("does NOT render a children wrapper when no children passed (center)", () => {
    const { container } = render(<PageHeader title="No Actions" align="center" />);
    // There should be no flex-wrap justify-center wrapper
    const flexWrap = container.querySelector("div.flex-wrap");
    expect(flexWrap).toBeNull();
  });

  it("children can be non-button elements (badge)", () => {
    render(
      <PageHeader title="API Keys">
        <span>3 active</span>
      </PageHeader>
    );
    expect(screen.getByText("3 active")).toBeInTheDocument();
  });

  it("renders icon-only button as a child", () => {
    render(
      <PageHeader title="Integrations">
        <button aria-label="Open settings">⚙</button>
      </PageHeader>
    );
    expect(screen.getByRole("button", { name: "Open settings" })).toBeInTheDocument();
  });

  it("renders mixed children (text + badge + button)", () => {
    render(
      <PageHeader title="Billing">
        <span>Past due</span>
        <button>Update Payment</button>
      </PageHeader>
    );
    expect(screen.getByText("Past due")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Update Payment" })).toBeInTheDocument();
  });
});

// ─── className prop ───────────────────────────────────────────────────────────

describe("PageHeader – className prop", () => {
  it("merges custom className onto root div in start alignment", () => {
    const { container } = render(
      <PageHeader title="Styled" className="my-custom-class" />
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("my-custom-class");
  });

  it("merges custom className onto root div in center alignment", () => {
    const { container } = render(
      <PageHeader title="Styled" align="center" className="another-class" />
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("another-class");
  });

  it("custom className does not remove flex class (start)", () => {
    const { container } = render(
      <PageHeader title="Test" className="extra" />
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("flex");
    expect(root.className).toContain("extra");
  });

  it("custom className does not remove items-center class (center)", () => {
    const { container } = render(
      <PageHeader title="Test" align="center" className="extra" />
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("items-center");
    expect(root.className).toContain("extra");
  });

  it("multiple custom classNames are all applied", () => {
    const { container } = render(
      <PageHeader title="Multi" className="foo bar baz" />
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("foo");
    expect(root.className).toContain("bar");
    expect(root.className).toContain("baz");
  });

  it("className='' does not break rendering", () => {
    render(<PageHeader title="Empty class" className="" />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("omitting className renders default classes only", () => {
    const { container } = render(<PageHeader title="No class" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("flex");
  });
});

// ─── Structural / composition ─────────────────────────────────────────────────

describe("PageHeader – structural composition", () => {
  it("start: inner text wrapper has space-y-1 class", () => {
    const { container } = render(<PageHeader title="Title" />);
    const spaceDiv = container.querySelector(".space-y-1");
    expect(spaceDiv).not.toBeNull();
  });

  it("center: inner text wrapper has space-y-1.5 class", () => {
    const { container } = render(<PageHeader title="Title" align="center" />);
    const spaceDiv = container.querySelector(".space-y-1\\.5");
    expect(spaceDiv).not.toBeNull();
  });

  it("start: root div has gap-3 class", () => {
    const { container } = render(<PageHeader title="Title" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("gap-3");
  });

  it("center: root div has gap-4 class", () => {
    const { container } = render(<PageHeader title="Title" align="center" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("gap-4");
  });

  it("h1 is a descendant of the root wrapper div", () => {
    const { container } = render(<PageHeader title="Nested" />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(container.firstChild).toContainElement(h1!);
  });

  it("description p is a descendant of the root wrapper div", () => {
    const { container } = render(
      <PageHeader title="T" description="Desc" />
    );
    const p = container.querySelector("p");
    expect(p).not.toBeNull();
    expect(container.firstChild).toContainElement(p!);
  });

  it("children button is a descendant of the root wrapper div", () => {
    const { container } = render(
      <PageHeader title="T">
        <button>Action</button>
      </PageHeader>
    );
    const btn = screen.getByRole("button", { name: "Action" });
    expect(container.firstChild).toContainElement(btn);
  });

  it("title and description both present renders both in DOM", () => {
    render(<PageHeader title="Title" description="Description text" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Title");
    expect(screen.getByText("Description text")).toBeInTheDocument();
  });

  it("title and children both present renders both in DOM", () => {
    render(
      <PageHeader title="Title">
        <button>New</button>
      </PageHeader>
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Title");
    expect(screen.getByRole("button", { name: "New" })).toBeInTheDocument();
  });

  it("all three props present renders all three", () => {
    render(
      <PageHeader title="All" description="Desc">
        <button>Action</button>
      </PageHeader>
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("All");
    expect(screen.getByText("Desc")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });
});

// ─── Example usage patterns ───────────────────────────────────────────────────

describe("PageHeader – example usage patterns", () => {
  it("replicates 'All Projects' default example", () => {
    render(
      <PageHeader title="All Projects" description="Manage and monitor your active projects.">
        <button>New Project</button>
      </PageHeader>
    );
    expect(screen.getByRole("heading", { level: 1, name: "All Projects" })).toBeInTheDocument();
    expect(screen.getByText("Manage and monitor your active projects.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New Project" })).toBeInTheDocument();
  });

  it("replicates 'Account Settings' centered example", () => {
    render(
      <PageHeader
        title="Account Settings"
        description="Update your preferences and profile details."
        align="center"
      />
    );
    expect(screen.getByRole("heading", { level: 1, name: "Account Settings" })).toBeInTheDocument();
    expect(screen.getByText("Update your preferences and profile details.")).toBeInTheDocument();
  });

  it("replicates 'Documents' left-aligned with multiple actions", () => {
    render(
      <PageHeader title="Documents" description="Browse and manage your files.">
        <button>Import</button>
        <button>Upload</button>
      </PageHeader>
    );
    expect(screen.getByRole("button", { name: "Import" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Upload" })).toBeInTheDocument();
  });

  it("replicates 'Get Started' centered with multiple actions", () => {
    render(
      <PageHeader
        title="Get Started"
        description="Follow these steps to set up your workspace."
        align="center"
      >
        <button>View Docs</button>
        <button>Continue</button>
      </PageHeader>
    );
    expect(screen.getByRole("heading", { level: 1, name: "Get Started" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View Docs" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument();
  });

  it("replicates 'Dashboard' title-only example", () => {
    render(<PageHeader title="Dashboard" />);
    expect(screen.getByRole("heading", { level: 1, name: "Dashboard" })).toBeInTheDocument();
    expect(screen.queryByRole("paragraph")).toBeNull();
  });

  it("replicates 'Welcome back' centered title-only example", () => {
    render(<PageHeader title="Welcome back" align="center" />);
    const root = screen.getByRole("heading", { level: 1, name: "Welcome back" }).closest("div");
    expect(root).not.toBeNull();
  });

  it("replicates 'Verify your email' centered with long description", () => {
    const desc =
      "We sent a 6-digit code to the address on file. Check your inbox to continue.";
    render(
      <PageHeader title="Verify your email" description={desc} align="center" />
    );
    expect(screen.getByText(desc)).toBeInTheDocument();
  });

  it("replicates 'Project Alpha' breadcrumb-context example", () => {
    render(
      <div>
        <nav aria-label="breadcrumb">
          <span>Workspace</span>
          <span>/</span>
          <span>Projects</span>
          <span>/</span>
          <span>Alpha</span>
        </nav>
        <PageHeader
          title="Project Alpha"
          description="Manage tasks, milestones, and collaborators for this project."
        >
          <button>Share</button>
          <button>New Task</button>
        </PageHeader>
      </div>
    );
    expect(screen.getByRole("heading", { level: 1, name: "Project Alpha" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New Task" })).toBeInTheDocument();
  });

  it("replicates 'API Keys' with badge and button children", () => {
    render(
      <PageHeader title="API Keys" description="Manage credentials for programmatic access.">
        <span>3 active</span>
        <button>New Key</button>
      </PageHeader>
    );
    expect(screen.getByText("3 active")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New Key" })).toBeInTheDocument();
  });

  it("replicates 'Webhooks' with success badge", () => {
    render(
      <PageHeader
        title="Webhooks"
        description="Receive real-time event notifications from your account."
      >
        <span>All healthy</span>
        <button>Add Endpoint</button>
      </PageHeader>
    );
    expect(screen.getByText("All healthy")).toBeInTheDocument();
  });

  it("replicates icon-only action button pattern", () => {
    render(
      <PageHeader title="Integrations" description="Connect your tools and external services.">
        <button aria-label="Open settings">⚙</button>
        <button>Add Integration</button>
      </PageHeader>
    );
    expect(screen.getByRole("button", { name: "Open settings" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Integration" })).toBeInTheDocument();
  });
});

// ─── Re-render behavior ───────────────────────────────────────────────────────

describe("PageHeader – re-render behavior", () => {
  it("updates title on re-render", () => {
    const { rerender } = render(<PageHeader title="Before" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Before");
    rerender(<PageHeader title="After" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("After");
  });

  it("shows description after re-render adds it", () => {
    const { rerender } = render(<PageHeader title="T" />);
    expect(screen.queryByText("New desc")).toBeNull();
    rerender(<PageHeader title="T" description="New desc" />);
    expect(screen.getByText("New desc")).toBeInTheDocument();
  });

  it("removes description after re-render removes it", () => {
    const { rerender } = render(<PageHeader title="T" description="Old desc" />);
    expect(screen.getByText("Old desc")).toBeInTheDocument();
    rerender(<PageHeader title="T" />);
    expect(screen.queryByText("Old desc")).toBeNull();
  });

  it("switches from start to center alignment on re-render", () => {
    const { rerender, container } = render(<PageHeader title="T" align="start" />);
    let root = container.firstChild as HTMLElement;
    expect(root.className).not.toContain("text-center");

    rerender(<PageHeader title="T" align="center" />);
    root = container.firstChild as HTMLElement;
    expect(root.className).toContain("text-center");
  });

  it("switches from center to start alignment on re-render", () => {
    const { rerender, container } = render(<PageHeader title="T" align="center" />);
    let root = container.firstChild as HTMLElement;
    expect(root.className).toContain("text-center");

    rerender(<PageHeader title="T" align="start" />);
    root = container.firstChild as HTMLElement;
    expect(root.className).not.toContain("text-center");
  });

  it("shows children after re-render adds them", () => {
    const { rerender } = render(<PageHeader title="T" />);
    expect(screen.queryByRole("button", { name: "New" })).toBeNull();
    rerender(
      <PageHeader title="T">
        <button>New</button>
      </PageHeader>
    );
    expect(screen.getByRole("button", { name: "New" })).toBeInTheDocument();
  });
});

// ─── Multiple instances ───────────────────────────────────────────────────────

describe("PageHeader – multiple instances", () => {
  it("renders two start-aligned headers without interference", () => {
    render(
      <div>
        <PageHeader title="First" description="First description" />
        <PageHeader title="Second" description="Second description" />
      </div>
    );
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(2);
    expect(headings[0]).toHaveTextContent("First");
    expect(headings[1]).toHaveTextContent("Second");
  });

  it("renders mixed alignment headers without interference", () => {
    render(
      <div>
        <PageHeader title="Left" align="start" />
        <PageHeader title="Centered" align="center" />
      </div>
    );
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings[0]).toHaveTextContent("Left");
    expect(headings[1]).toHaveTextContent("Centered");
  });

  it("each instance's children are isolated", () => {
    render(
      <div>
        <PageHeader title="First">
          <button>Action A</button>
        </PageHeader>
        <PageHeader title="Second">
          <button>Action B</button>
        </PageHeader>
      </div>
    );
    expect(screen.getByRole("button", { name: "Action A" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Action B" })).toBeInTheDocument();
  });

  it("each instance's description is isolated", () => {
    render(
      <div>
        <PageHeader title="X" description="Desc X" />
        <PageHeader title="Y" description="Desc Y" />
      </div>
    );
    expect(screen.getByText("Desc X")).toBeInTheDocument();
    expect(screen.getByText("Desc Y")).toBeInTheDocument();
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe("PageHeader – edge cases", () => {
  it("renders with an empty string description without crashing", () => {
    // Empty string is falsy → should NOT render a <p>
    const { container } = render(<PageHeader title="T" description="" />);
    expect(container.querySelector("p")).toBeNull();
  });

  it("renders with null children without crashing", () => {
    render(<PageHeader title="T">{null}</PageHeader>);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders with undefined children without crashing", () => {
    render(<PageHeader title="T">{undefined}</PageHeader>);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders with false children without crashing", () => {
    render(<PageHeader title="T">{false}</PageHeader>);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("title with only whitespace still renders an h1", () => {
    render(<PageHeader title="   " />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders deeply nested children without crashing", () => {
    render(
      <PageHeader title="Deep">
        <div>
          <span>
            <button>Deep Action</button>
          </span>
        </div>
      </PageHeader>
    );
    expect(screen.getByRole("button", { name: "Deep Action" })).toBeInTheDocument();
  });

  it("renders numeric children without crashing", () => {
    render(<PageHeader title="T">{42 as unknown as React.ReactNode}</PageHeader>);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});

// ─── Accessibility (axe) ──────────────────────────────────────────────────────

describe("PageHeader – accessibility (axe)", () => {
  it("default (title only) has no axe violations", async () => {
    const { container } = render(<PageHeader title="Dashboard" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("title + description (start) has no axe violations", async () => {
    const { container } = render(
      <PageHeader
        title="Analytics"
        description="Track engagement metrics and audience trends over time."
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("title + description + children (start) has no axe violations", async () => {
    const { container } = render(
      <PageHeader title="All Projects" description="Manage and monitor your active projects.">
        <button>New Project</button>
      </PageHeader>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("align='center' title only has no axe violations", async () => {
    const { container } = render(<PageHeader title="Welcome back" align="center" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("align='center' with description has no axe violations", async () => {
    const { container } = render(
      <PageHeader
        title="Get Started"
        description="Follow these steps to set up your workspace."
        align="center"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("align='center' with children has no axe violations", async () => {
    const { container } = render(
      <PageHeader
        title="Account Settings"
        description="Update your preferences and profile details."
        align="center"
      >
        <button>View Docs</button>
        <button>Continue</button>
      </PageHeader>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("start with multiple action buttons has no axe violations", async () => {
    const { container } = render(
      <PageHeader title="Team Members" description="Manage roles and access for your organization.">
        <button>Manage Roles</button>
        <button>Invite Member</button>
      </PageHeader>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("start with icon-only action button (aria-label) has no axe violations", async () => {
    const { container } = render(
      <PageHeader title="Integrations" description="Connect your tools and external services.">
        <button aria-label="Open settings">⚙</button>
        <button>Add Integration</button>
      </PageHeader>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("custom className does not introduce axe violations", async () => {
    const { container } = render(
      <PageHeader title="Styled" className="py-8 px-4" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("header used within a landmark region has no axe violations", async () => {
    const { container } = render(
      <main>
        <PageHeader
          title="Project Alpha"
          description="Manage tasks, milestones, and collaborators for this project."
        >
          <button>New Task</button>
        </PageHeader>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("two page headers on the same page have no axe violations", async () => {
    const { container } = render(
      <main>
        <section aria-labelledby="h1">
          <PageHeader title="Section One" />
        </section>
        <section aria-labelledby="h2">
          <PageHeader title="Section Two" />
        </section>
      </main>
    );
    // Multiple h1s are a best-practice concern but not technically an axe error
    // Just confirm no hard violations
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
