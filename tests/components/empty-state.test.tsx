import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  FolderOpen,
  Inbox,
  AlertCircle,
  Search,
  PlusCircle,
  Star,
  FileText,
} from "lucide-react";
import { EmptyState } from "@/components/empty-state";

// ─── Smoke ────────────────────────────────────────────────────────────────────

describe("EmptyState – smoke", () => {
  it("renders without crashing with title only (minimal required prop)", () => {
    render(<EmptyState title="No results found" />);
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("renders as a div container", () => {
    const { container } = render(<EmptyState title="Empty" />);
    const root = container.firstChild as HTMLElement;
    expect(root.tagName).toBe("DIV");
  });
});

// ─── Title ────────────────────────────────────────────────────────────────────

describe("EmptyState – title prop", () => {
  it("renders the title in an h3 element", () => {
    render(<EmptyState title="No files yet" />);
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("No files yet");
  });

  it("applies medium font class to the title", () => {
    render(<EmptyState title="Title text" />);
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading.className).toContain("font-medium");
  });

  it("renders a title with special characters", () => {
    render(<EmptyState title={`No results for "webhooks"`} />);
    expect(
      screen.getByText(/No results for/)
    ).toBeInTheDocument();
  });
});

// ─── Description ─────────────────────────────────────────────────────────────

describe("EmptyState – description prop", () => {
  it("renders description when provided", () => {
    render(
      <EmptyState
        title="No files"
        description="Upload your first file to get started."
      />
    );
    expect(
      screen.getByText("Upload your first file to get started.")
    ).toBeInTheDocument();
  });

  it("does NOT render a description paragraph when omitted", () => {
    render(<EmptyState title="No files" />);
    // No <p> element (or any element with that muted class) should be present
    const container = screen.getByText("No files").closest("div")!;
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs.length).toBe(0);
  });

  it("description paragraph has muted text class", () => {
    render(
      <EmptyState title="Title" description="Helper text here" />
    );
    const desc = screen.getByText("Helper text here");
    expect(desc.tagName).toBe("P");
    expect(desc.className).toContain("text-muted-foreground");
  });

  it("description paragraph has max-w constraint", () => {
    render(<EmptyState title="Title" description="Some description" />);
    const desc = screen.getByText("Some description");
    expect(desc.className).toContain("max-w-sm");
  });

  it("description has top margin class (mt-1)", () => {
    render(<EmptyState title="Title" description="Some description" />);
    const desc = screen.getByText("Some description");
    expect(desc.className).toContain("mt-1");
  });
});

// ─── Icon ─────────────────────────────────────────────────────────────────────

describe("EmptyState – icon prop", () => {
  it("renders an icon wrapper div when icon prop is provided", () => {
    const { container } = render(
      <EmptyState icon={FolderOpen} title="No files" />
    );
    // The icon wrapper has size-11 class
    const iconWrapper = container.querySelector(".size-11");
    expect(iconWrapper).toBeInTheDocument();
  });

  it("does NOT render an icon wrapper when icon is omitted", () => {
    const { container } = render(<EmptyState title="No files" />);
    const iconWrapper = container.querySelector(".size-11");
    expect(iconWrapper).toBeNull();
  });

  it("icon wrapper has rounded-2xl edge and bg-muted/40 classes", () => {
    const { container } = render(
      <EmptyState icon={Inbox} title="Inbox empty" />
    );
    const iconWrapper = container.querySelector(".size-11");
    expect(iconWrapper!.className).toContain("rounded-2xl");
    expect(iconWrapper!.className).toContain("edge");
    expect(iconWrapper!.className).toContain("bg-muted/40");
  });

  it("icon wrapper has mb-4 margin class", () => {
    const { container } = render(
      <EmptyState icon={Search} title="No results" />
    );
    const iconWrapper = container.querySelector(".size-11");
    expect(iconWrapper!.className).toContain("mb-4");
  });

  it("renders SVG icon inside the icon wrapper", () => {
    const { container } = render(
      <EmptyState icon={FolderOpen} title="No files" />
    );
    const iconWrapper = container.querySelector(".size-11");
    const svg = iconWrapper!.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("icon SVG has size-5 and text-muted-foreground classes", () => {
    const { container } = render(
      <EmptyState icon={AlertCircle} title="Error" />
    );
    const iconWrapper = container.querySelector(".size-11");
    const svg = iconWrapper!.querySelector("svg");
    // SVGElement.className is an SVGAnimatedString — use getAttribute instead
    const svgClass = svg!.getAttribute("class") ?? "";
    expect(svgClass).toContain("size-5");
    expect(svgClass).toContain("text-muted-foreground");
  });

  it("renders different icons correctly (Inbox)", () => {
    const { container } = render(
      <EmptyState icon={Inbox} title="Empty inbox" />
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders different icons correctly (PlusCircle)", () => {
    const { container } = render(
      <EmptyState icon={PlusCircle} title="Empty workspace" />
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders different icons correctly (Star)", () => {
    const { container } = render(
      <EmptyState icon={Star} title="No favorites" />
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders different icons correctly (FileText)", () => {
    const { container } = render(
      <EmptyState icon={FileText} title="No documents" />
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});

// ─── Action ───────────────────────────────────────────────────────────────────

describe("EmptyState – action prop", () => {
  it("renders action content when provided", () => {
    render(
      <EmptyState
        title="No files"
        action={<button>Upload file</button>}
      />
    );
    expect(screen.getByRole("button", { name: "Upload file" })).toBeInTheDocument();
  });

  it("does NOT render an action wrapper when action is omitted", () => {
    const { container } = render(<EmptyState title="No files" />);
    // The action wrapper has mt-5 class
    const actionWrapper = container.querySelector(".mt-5");
    expect(actionWrapper).toBeNull();
  });

  it("action wrapper has mt-5 class", () => {
    const { container } = render(
      <EmptyState
        title="Title"
        action={<button>Act</button>}
      />
    );
    const actionWrapper = container.querySelector(".mt-5");
    expect(actionWrapper).toBeInTheDocument();
  });

  it("renders multiple actions (div with two buttons)", () => {
    render(
      <EmptyState
        title="Empty workspace"
        action={
          <div>
            <button>Create project</button>
            <button>Invite team</button>
          </div>
        }
      />
    );
    expect(screen.getByRole("button", { name: "Create project" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Invite team" })).toBeInTheDocument();
  });

  it("renders a link as an action", () => {
    render(
      <EmptyState
        title="No docs"
        action={<a href="/docs">See docs</a>}
      />
    );
    expect(screen.getByRole("link", { name: "See docs" })).toBeInTheDocument();
  });

  it("renders any ReactNode as action (plain text)", () => {
    render(
      <EmptyState
        title="Title"
        action={<span>Contact support</span>}
      />
    );
    expect(screen.getByText("Contact support")).toBeInTheDocument();
  });
});

// ─── className override ───────────────────────────────────────────────────────

describe("EmptyState – className prop", () => {
  it("applies custom className to the root div", () => {
    const { container } = render(
      <EmptyState title="Compact" className="py-8" />
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("py-8");
  });

  it("merges custom className with default classes", () => {
    const { container } = render(
      <EmptyState title="Title" className="border-destructive/30" />
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("border-destructive/30");
    // Default classes still present
    expect(root.className).toContain("rounded-2xl");
    expect(root.className).toContain("border-dashed");
  });

  it("className can override padding (compact usage)", () => {
    const { container } = render(
      <EmptyState title="Inbox empty" className="py-8" />
    );
    const root = container.firstChild as HTMLElement;
    // The override class is present
    expect(root.className).toContain("py-8");
  });

  it("applies additional arbitrary classes", () => {
    const { container } = render(
      <EmptyState title="Test" className="my-custom-class another-class" />
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("my-custom-class");
    expect(root.className).toContain("another-class");
  });
});

// ─── Root element default classes ────────────────────────────────────────────

describe("EmptyState – root element default classes", () => {
  it("has flex flex-col classes", () => {
    const { container } = render(<EmptyState title="Test" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("flex");
    expect(root.className).toContain("flex-col");
  });

  it("has items-center justify-center for centering", () => {
    const { container } = render(<EmptyState title="Test" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("items-center");
    expect(root.className).toContain("justify-center");
  });

  it("has rounded-2xl class", () => {
    const { container } = render(<EmptyState title="Test" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("rounded-2xl");
  });

  it("has border border-dashed classes", () => {
    const { container } = render(<EmptyState title="Test" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("border");
    expect(root.className).toContain("border-dashed");
  });

  it("has horizontal padding px-6", () => {
    const { container } = render(<EmptyState title="Test" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("px-6");
  });

  it("has vertical padding py-16", () => {
    const { container } = render(<EmptyState title="Test" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("py-16");
  });

  it("has text-center class", () => {
    const { container } = render(<EmptyState title="Test" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("text-center");
  });
});

// ─── Interactions ─────────────────────────────────────────────────────────────

describe("EmptyState – interactions", () => {
  it("action button click handler fires when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <EmptyState
        icon={FolderOpen}
        title="No files yet"
        action={<button onClick={handleClick}>Upload file</button>}
      />
    );
    const btn = screen.getByRole("button", { name: "Upload file" });
    await user.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("action button fires multiple clicks correctly", async () => {
    const user = userEvent.setup();
    const handleRetry = vi.fn();
    render(
      <EmptyState
        icon={AlertCircle}
        title="Something went wrong"
        action={<button onClick={handleRetry}>Try again</button>}
      />
    );
    const btn = screen.getByRole("button", { name: "Try again" });
    await user.click(btn);
    await user.click(btn);
    expect(handleRetry).toHaveBeenCalledTimes(2);
  });

  it("clear-search action clears the query state in a search scenario", async () => {
    const user = userEvent.setup();

    function SearchWrapper() {
      const [query, setQuery] = React.useState("webhooks");
      const items = ["Dashboard", "Analytics"];
      const results = items.filter((i) =>
        i.toLowerCase().includes(query.toLowerCase())
      );
      return (
        <div>
          <input
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {results.length === 0 ? (
            <EmptyState
              icon={Search}
              title={`No results for "${query}"`}
              action={
                <button onClick={() => setQuery("")}>Clear search</button>
              }
            />
          ) : (
            <ul>
              {results.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    render(<SearchWrapper />);

    // With query="webhooks" → no results → EmptyState visible
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      /No results for/
    );

    // Click "Clear search"
    await user.click(screen.getByRole("button", { name: "Clear search" }));

    // After clearing, all items show → EmptyState gone
    expect(screen.queryByRole("heading", { level: 3 })).toBeNull();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });

  it("action button is keyboard accessible via Enter key", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <EmptyState
        title="Empty"
        action={<button onClick={handleClick}>Create item</button>}
      />
    );
    const btn = screen.getByRole("button", { name: "Create item" });
    btn.focus();
    await user.keyboard("{Enter}");
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("action button is keyboard accessible via Space key", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <EmptyState
        title="Empty"
        action={<button onClick={handleClick}>Create item</button>}
      />
    );
    const btn = screen.getByRole("button", { name: "Create item" });
    btn.focus();
    await user.keyboard(" ");
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disabled action button does not fire click handler", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <EmptyState
        title="Title"
        action={
          <button disabled onClick={handleClick}>
            Disabled action
          </button>
        }
      />
    );
    const btn = screen.getByRole("button", { name: "Disabled action" });
    await user.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders multiple action buttons and each fires independently", async () => {
    const user = userEvent.setup();
    const handleCreate = vi.fn();
    const handleInvite = vi.fn();
    render(
      <EmptyState
        icon={PlusCircle}
        title="Empty workspace"
        action={
          <div>
            <button onClick={handleCreate}>Create project</button>
            <button onClick={handleInvite}>Invite team</button>
          </div>
        }
      />
    );
    await user.click(screen.getByRole("button", { name: "Create project" }));
    await user.click(screen.getByRole("button", { name: "Invite team" }));
    expect(handleCreate).toHaveBeenCalledTimes(1);
    expect(handleInvite).toHaveBeenCalledTimes(1);
  });
});

// ─── Composition / prop combinations ─────────────────────────────────────────

describe("EmptyState – prop combinations", () => {
  it("renders all props together: icon + title + description + action", () => {
    render(
      <EmptyState
        icon={FolderOpen}
        title="No files yet"
        description="Upload your first file to get started."
        action={<button>Upload file</button>}
      />
    );
    const { container } = render(
      <EmptyState
        icon={FolderOpen}
        title="No files yet"
        description="Upload your first file to get started."
        action={<button>Upload file</button>}
      />
    );
    expect(screen.getAllByRole("heading", { level: 3 })[0]).toHaveTextContent(
      "No files yet"
    );
    expect(screen.getAllByText("Upload your first file to get started.")[0]).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Upload file" })[0]).toBeInTheDocument();
    expect(container.querySelector(".size-11")).toBeInTheDocument();
  });

  it("renders title + description only (no icon, no action)", () => {
    render(
      <EmptyState
        title="Nothing here yet"
        description="Once you add some items they'll show up here."
      />
    );
    expect(screen.getByText("Nothing here yet")).toBeInTheDocument();
    expect(
      screen.getByText("Once you add some items they'll show up here.")
    ).toBeInTheDocument();
  });

  it("renders title + action only (no icon, no description)", () => {
    render(
      <EmptyState
        title="Nothing here yet"
        action={<button>Create item</button>}
      />
    );
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Nothing here yet"
    );
    expect(screen.getByRole("button", { name: "Create item" })).toBeInTheDocument();
  });

  it("renders icon + title only (compact — no description, no action)", () => {
    const { container } = render(
      <EmptyState icon={Inbox} title="Inbox is empty" />
    );
    const iconWrapper = container.querySelector(".size-11");
    expect(iconWrapper).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Inbox is empty"
    );
    // No description, no action wrapper
    expect(container.querySelector("p")).toBeNull();
    expect(container.querySelector(".mt-5")).toBeNull();
  });

  it("error-state pattern: icon + title + description + destructive action + border className", () => {
    const { container } = render(
      <EmptyState
        icon={AlertCircle}
        title="Something went wrong"
        description="We couldn't load your data."
        action={<button>Try again</button>}
        className="border-destructive/30"
      />
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("border-destructive/30");
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Something went wrong"
    );
  });
});

// ─── DOM structure / nesting order ───────────────────────────────────────────

describe("EmptyState – DOM nesting order", () => {
  it("icon wrapper appears before the title h3", () => {
    const { container } = render(
      <EmptyState icon={FolderOpen} title="No files" />
    );
    const root = container.firstChild as HTMLElement;
    const children = Array.from(root.children);
    const iconWrapperIdx = children.findIndex((el) =>
      el.className.includes("size-11")
    );
    const titleIdx = children.findIndex(
      (el) => el.tagName === "H3"
    );
    expect(iconWrapperIdx).toBeLessThan(titleIdx);
  });

  it("description appears after title", () => {
    const { container } = render(
      <EmptyState title="Title" description="Description text" />
    );
    const root = container.firstChild as HTMLElement;
    const children = Array.from(root.children);
    const titleIdx = children.findIndex((el) => el.tagName === "H3");
    const descIdx = children.findIndex((el) => el.tagName === "P");
    expect(titleIdx).toBeLessThan(descIdx);
  });

  it("action wrapper appears after description", () => {
    const { container } = render(
      <EmptyState
        title="Title"
        description="Desc"
        action={<button>Act</button>}
      />
    );
    const root = container.firstChild as HTMLElement;
    const children = Array.from(root.children);
    const descIdx = children.findIndex((el) => el.tagName === "P");
    const actionIdx = children.findIndex((el) =>
      el.className.includes("mt-5")
    );
    expect(descIdx).toBeLessThan(actionIdx);
  });

  it("action wrapper appears after title when description is absent", () => {
    const { container } = render(
      <EmptyState title="Title" action={<button>Act</button>} />
    );
    const root = container.firstChild as HTMLElement;
    const children = Array.from(root.children);
    const titleIdx = children.findIndex((el) => el.tagName === "H3");
    const actionIdx = children.findIndex((el) =>
      el.className.includes("mt-5")
    );
    expect(titleIdx).toBeLessThan(actionIdx);
  });
});

// ─── A11Y ─────────────────────────────────────────────────────────────────────

describe("EmptyState – accessibility", () => {
  it("passes axe with title only (minimal)", async () => {
    const { container } = render(<EmptyState title="No results found" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("passes axe with all props: icon + title + description + action button", async () => {
    const { container } = render(
      <EmptyState
        icon={FolderOpen}
        title="No files yet"
        description="Upload your first file to get started."
        action={<button>Upload file</button>}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("passes axe for error-state pattern", async () => {
    const { container } = render(
      <EmptyState
        icon={AlertCircle}
        title="Something went wrong"
        description="We couldn't load your data. Please try again."
        action={<button>Try again</button>}
        className="border-destructive/30"
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("passes axe for compact/no-description pattern", async () => {
    const { container } = render(
      <EmptyState icon={Inbox} title="Inbox is empty" className="py-8" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("passes axe for multiple-actions pattern", async () => {
    const { container } = render(
      <EmptyState
        icon={PlusCircle}
        title="Your workspace is empty"
        description="Invite teammates or create your first project."
        action={
          <div>
            <button>Create project</button>
            <button>Invite team</button>
          </div>
        }
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("passes axe for no-icon pattern with action link", async () => {
    const { container } = render(
      <EmptyState
        title="Nothing here yet"
        description="Get started by creating your first one."
        action={<a href="/create">Create item</a>}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("heading is discoverable by assistive technology as heading level 3", () => {
    render(<EmptyState title="Screen reader title" />);
    expect(
      screen.getByRole("heading", { level: 3, name: "Screen reader title" })
    ).toBeInTheDocument();
  });

  it("action content is reachable in the tab order", () => {
    render(
      <EmptyState
        title="No items"
        action={<button>Create first item</button>}
      />
    );
    const btn = screen.getByRole("button", { name: "Create first item" });
    // Buttons are focusable by default; verify it's not explicitly hidden
    expect(btn).not.toHaveAttribute("aria-hidden", "true");
    expect(btn).not.toHaveAttribute("tabindex", "-1");
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe("EmptyState – edge cases", () => {
  it("renders with a very long title without crashing", () => {
    const longTitle =
      "No results were found for your extremely long and detailed search query that exceeds normal lengths";
    render(<EmptyState title={longTitle} />);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      longTitle
    );
  });

  it("renders with a very long description without crashing", () => {
    const longDesc = "A".repeat(300);
    render(<EmptyState title="Title" description={longDesc} />);
    expect(screen.getByText(longDesc)).toBeInTheDocument();
  });

  it("renders with an empty string description (falsy → omits the paragraph)", () => {
    const { container } = render(
      <EmptyState title="Title" description="" />
    );
    // Empty string is falsy, so the description p should not render
    expect(container.querySelector("p")).toBeNull();
  });

  it("renders with a React element as title text (wrapped in fragment) — title accepts string", () => {
    render(<EmptyState title="Dynamic title content" />);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Dynamic title content"
    );
  });

  it("renders with no className prop (undefined) without error", () => {
    expect(() => render(<EmptyState title="Test" className={undefined} />)).not.toThrow();
  });

  it("renders multiple instances independently on the same page", () => {
    render(
      <div>
        <EmptyState title="First empty state" />
        <EmptyState title="Second empty state" />
      </div>
    );
    expect(screen.getByText("First empty state")).toBeInTheDocument();
    expect(screen.getByText("Second empty state")).toBeInTheDocument();
  });

  it("updates when title prop changes (reactive re-render)", () => {
    function Wrapper({ title }: { title: string }) {
      return <EmptyState title={title} />;
    }
    const { rerender } = render(<Wrapper title="Initial title" />);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Initial title"
    );
    rerender(<Wrapper title="Updated title" />);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Updated title"
    );
  });

  it("updates when icon prop changes from provided to undefined (icon disappears)", () => {
    function Wrapper({ icon }: { icon?: typeof FolderOpen }) {
      return <EmptyState icon={icon} title="Title" />;
    }
    const { container, rerender } = render(<Wrapper icon={FolderOpen} />);
    expect(container.querySelector(".size-11")).toBeInTheDocument();
    rerender(<Wrapper icon={undefined} />);
    expect(container.querySelector(".size-11")).toBeNull();
  });

  it("updates when description changes from undefined to a value", () => {
    function Wrapper({ desc }: { desc?: string }) {
      return <EmptyState title="Title" description={desc} />;
    }
    const { container, rerender } = render(<Wrapper />);
    expect(container.querySelector("p")).toBeNull();
    rerender(<Wrapper desc="Now I have a description" />);
    expect(screen.getByText("Now I have a description")).toBeInTheDocument();
  });

  it("updates when action changes from undefined to a button", () => {
    function Wrapper({ hasAction }: { hasAction: boolean }) {
      return (
        <EmptyState
          title="Title"
          action={hasAction ? <button>Click me</button> : undefined}
        />
      );
    }
    const { container, rerender } = render(<Wrapper hasAction={false} />);
    expect(container.querySelector(".mt-5")).toBeNull();
    rerender(<Wrapper hasAction={true} />);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });
});
