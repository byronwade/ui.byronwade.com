/**
 * Exhaustive tests for <FilterPill />
 *
 * Component source: components/ui/filter-pill.tsx
 * API summary:
 *   - FilterPill is a <button type="button"> with data-slot="filter-pill"
 *   - Props: all native button props + `icon?: React.ReactNode`
 *   - Always renders a ChevronsUpDown chevron at the right
 *   - Classes applied: rounded-full, h-8, border, bg-background, px-3, text-sm, font-medium
 *   - Hover/expanded state: hover:bg-muted, aria-expanded:bg-muted
 *   - Focus ring: focus-visible:ring-3, focus-visible:ring-ring/50
 *   - className is merged via cn()
 *   - Disabled via native `disabled` prop
 *   - aria-pressed supported for toggle/active state
 *   - Can be used as a DropdownMenu trigger via render prop
 */

import * as React from "react";
import { render, screen, within, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { FilterPill } from "@/components/ui/filter-pill";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { CalendarDots, Tag } from "@/lib/icons"

// ---------------------------------------------------------------------------
// 1. Renders without crashing — default usage
// ---------------------------------------------------------------------------

describe("FilterPill — default render", () => {
  it("renders without crashing", () => {
    render(<FilterPill>All time</FilterPill>);
    expect(screen.getByRole("button", { name: /all time/i })).toBeInTheDocument();
  });

  it("renders a <button> element", () => {
    const { container } = render(<FilterPill>Test</FilterPill>);
    expect(container.querySelector("button")).not.toBeNull();
  });

  it("has type='button' so it doesn't accidentally submit forms", () => {
    render(<FilterPill>Test</FilterPill>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("has data-slot='filter-pill'", () => {
    render(<FilterPill>Test</FilterPill>);
    expect(screen.getByRole("button")).toHaveAttribute("data-slot", "filter-pill");
  });

  it("renders children text", () => {
    render(<FilterPill>Last 7 days</FilterPill>);
    expect(screen.getByRole("button")).toHaveTextContent("Last 7 days");
  });

  it("always renders the chevron icon (svg)", () => {
    const { container } = render(<FilterPill>Today</FilterPill>);
    // ChevronsUpDown renders as an svg inside the button
    const btn = container.querySelector("button");
    const svg = btn?.querySelector("svg");
    expect(svg).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 2. Pill / shape classes
// ---------------------------------------------------------------------------

describe("FilterPill — pill shape and base classes", () => {
  it("has rounded-full class", () => {
    render(<FilterPill>Test</FilterPill>);
    expect(screen.getByRole("button")).toHaveClass("rounded-full");
  });

  it("has h-8 class (height token)", () => {
    render(<FilterPill>Test</FilterPill>);
    expect(screen.getByRole("button")).toHaveClass("h-8");
  });

  it("has inline-flex class", () => {
    render(<FilterPill>Test</FilterPill>);
    expect(screen.getByRole("button")).toHaveClass("inline-flex");
  });

  it("has items-center class", () => {
    render(<FilterPill>Test</FilterPill>);
    expect(screen.getByRole("button")).toHaveClass("items-center");
  });

  it("elevates with edge (immersive edge, no hard border)", () => {
    render(<FilterPill>Test</FilterPill>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("edge");
    expect(btn).not.toHaveClass("border-border");
  });

  it("has px-3 class", () => {
    render(<FilterPill>Test</FilterPill>);
    expect(screen.getByRole("button")).toHaveClass("px-3");
  });

  it("has text-sm class", () => {
    render(<FilterPill>Test</FilterPill>);
    expect(screen.getByRole("button")).toHaveClass("text-sm");
  });

  it("has font-medium class", () => {
    render(<FilterPill>Test</FilterPill>);
    expect(screen.getByRole("button")).toHaveClass("font-medium");
  });

  it("has transition-colors class", () => {
    render(<FilterPill>Test</FilterPill>);
    expect(screen.getByRole("button")).toHaveClass("transition-colors");
  });

  it("has outline-none class", () => {
    render(<FilterPill>Test</FilterPill>);
    expect(screen.getByRole("button")).toHaveClass("outline-none");
  });
});

// ---------------------------------------------------------------------------
// 3. icon prop
// ---------------------------------------------------------------------------

describe("FilterPill — icon prop", () => {
  it("renders icon node when icon prop is provided", () => {
    render(
      <FilterPill icon={<span data-testid="test-icon">icon</span>}>Category</FilterPill>
    );
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("icon appears inside the button", () => {
    const { container } = render(
      <FilterPill icon={<span data-testid="icon-inside">●</span>}>Status</FilterPill>
    );
    const btn = container.querySelector("button");
    expect(within(btn!).getByTestId("icon-inside")).toBeInTheDocument();
  });

  it("does not render extra icon-slot element when icon is omitted", () => {
    render(<FilterPill>No icon</FilterPill>);
    // The button only contains: (no icon), text children, and the chevron svg
    // There should be no explicit icon-slot span
    const btn = screen.getByRole("button");
    // Confirm it has exactly one svg (the chevron) when no icon is passed
    expect(btn.querySelectorAll("svg")).toHaveLength(1);
  });

  it("renders with a Phosphor icon component as icon prop", () => {
    const { container } = render(
      <FilterPill icon={<CalendarDots className="size-3.5 text-muted-foreground" data-testid="cal-icon" />}>
        Date range
      </FilterPill>
    );
    expect(container.querySelector('[data-testid="cal-icon"]')).toBeInTheDocument();
  });

  it("renders with Tag icon and correct label", () => {
    render(
      <FilterPill icon={<Tag className="size-3.5" data-testid="tag-icon" />}>
        Category
      </FilterPill>
    );
    expect(screen.getByRole("button")).toHaveTextContent("Category");
    expect(screen.getByTestId("tag-icon")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 4. className merging
// ---------------------------------------------------------------------------

describe("FilterPill — className prop merging", () => {
  it("merges custom className with default classes", () => {
    render(<FilterPill className="custom-class">Test</FilterPill>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("custom-class");
    expect(btn).toHaveClass("rounded-full"); // default still present
  });

  it("allows overriding background with active-state classes", () => {
    render(
      <FilterPill className="bg-foreground text-background">Active</FilterPill>
    );
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("bg-foreground");
    expect(btn).toHaveClass("text-background");
  });

  it("allows cursor-not-allowed via className", () => {
    render(<FilterPill disabled className="cursor-not-allowed opacity-50">Disabled</FilterPill>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("cursor-not-allowed");
    expect(btn).toHaveClass("opacity-50");
  });
});

// ---------------------------------------------------------------------------
// 5. Disabled state
// ---------------------------------------------------------------------------

describe("FilterPill — disabled state", () => {
  it("is disabled when disabled prop is passed", () => {
    render(<FilterPill disabled>Status</FilterPill>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("does not fire onClick when disabled", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <FilterPill disabled onClick={handleClick}>
        Status
      </FilterPill>
    );
    await user.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("is enabled by default (no disabled prop)", () => {
    render(<FilterPill>Status</FilterPill>);
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("disabled with icon still renders correctly", () => {
    render(
      <FilterPill disabled icon={<CalendarDots data-testid="icon" />}>
        Date range
      </FilterPill>
    );
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 6. aria-pressed (active/toggle state)
// ---------------------------------------------------------------------------

describe("FilterPill — aria-pressed state", () => {
  it("renders with aria-pressed='true' for active selection", () => {
    render(<FilterPill aria-pressed={true}>Documents</FilterPill>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("renders with aria-pressed='false' for inactive selection", () => {
    render(<FilterPill aria-pressed={false}>Images</FilterPill>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });

  it("does not have aria-pressed when not set", () => {
    render(<FilterPill>All</FilterPill>);
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-pressed");
  });

  it("toggles aria-pressed on click when controlled externally", async () => {
    const user = userEvent.setup();

    function ToggleWrapper() {
      const [pressed, setPressed] = React.useState(false);
      return (
        <FilterPill
          aria-pressed={pressed}
          onClick={() => setPressed((p) => !p)}
        >
          Toggle
        </FilterPill>
      );
    }

    render(<ToggleWrapper />);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-pressed", "false");
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "true");
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "false");
  });
});

// ---------------------------------------------------------------------------
// 7. aria-expanded (used when wrapping a dropdown/select trigger)
// ---------------------------------------------------------------------------

describe("FilterPill — aria-expanded attribute", () => {
  it("applies bg-muted class via aria-expanded when set to 'true'", () => {
    // The class 'aria-expanded:bg-muted' is a Tailwind variant; we test that
    // aria-expanded is correctly forwarded as an attribute
    render(<FilterPill aria-expanded="true">Open</FilterPill>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });

  it("accepts aria-expanded='false' attribute", () => {
    render(<FilterPill aria-expanded="false">Closed</FilterPill>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
  });
});

// ---------------------------------------------------------------------------
// 8. onClick interaction
// ---------------------------------------------------------------------------

describe("FilterPill — click interactions", () => {
  it("fires onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<FilterPill onClick={handleClick}>Click me</FilterPill>);
    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("fires onClick multiple times on multiple clicks", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<FilterPill onClick={handleClick}>Click</FilterPill>);
    const btn = screen.getByRole("button");
    await user.click(btn);
    await user.click(btn);
    await user.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(3);
  });

  it("is keyboard-activatable via Space key", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<FilterPill onClick={handleClick}>Press space</FilterPill>);
    const btn = screen.getByRole("button");
    btn.focus();
    await user.keyboard(" ");
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is keyboard-activatable via Enter key", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<FilterPill onClick={handleClick}>Press enter</FilterPill>);
    const btn = screen.getByRole("button");
    btn.focus();
    await user.keyboard("{Enter}");
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// 9. Keyboard focus / tab navigation
// ---------------------------------------------------------------------------

describe("FilterPill — focus and keyboard navigation", () => {
  it("is focusable (has tab stop)", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <FilterPill>First</FilterPill>
        <FilterPill>Second</FilterPill>
      </div>
    );
    await user.tab();
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Second" })).toHaveFocus();
  });

  it("is not focusable via Tab when disabled", async () => {
    const user = userEvent.setup();
    render(<FilterPill disabled>Disabled</FilterPill>);
    await user.tab();
    expect(screen.getByRole("button")).not.toHaveFocus();
  });
});

// ---------------------------------------------------------------------------
// 10. Ref forwarding
// ---------------------------------------------------------------------------

describe("FilterPill — ref forwarding", () => {
  it("forwards ref to the underlying button element", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<FilterPill ref={ref}>Ref test</FilterPill>);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("BUTTON");
  });

  it("ref.current matches the rendered button", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<FilterPill ref={ref}>Ref match</FilterPill>);
    expect(ref.current).toBe(screen.getByRole("button"));
  });
});

// ---------------------------------------------------------------------------
// 11. Native HTML attribute pass-through
// ---------------------------------------------------------------------------

describe("FilterPill — native attribute pass-through", () => {
  it("passes aria-label through", () => {
    render(<FilterPill aria-label="Filter by date">Date</FilterPill>);
    expect(screen.getByRole("button", { name: "Filter by date" })).toBeInTheDocument();
  });

  it("passes id through", () => {
    render(<FilterPill id="my-filter">Status</FilterPill>);
    expect(screen.getByRole("button")).toHaveAttribute("id", "my-filter");
  });

  it("passes data-* attributes through", () => {
    render(<FilterPill data-testid="custom-pill">Data</FilterPill>);
    expect(screen.getByTestId("custom-pill")).toBeInTheDocument();
  });

  it("passes tabIndex through", () => {
    render(<FilterPill tabIndex={-1}>Skippable</FilterPill>);
    expect(screen.getByRole("button")).toHaveAttribute("tabIndex", "-1");
  });

  it("passes aria-controls through", () => {
    render(<FilterPill aria-controls="menu-123">Open menu</FilterPill>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-controls", "menu-123");
  });

  it("passes aria-haspopup through", () => {
    render(<FilterPill aria-haspopup="listbox">Select</FilterPill>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-haspopup", "listbox");
  });
});

// ---------------------------------------------------------------------------
// 12. Multiple pills (filter bar pattern)
// ---------------------------------------------------------------------------

describe("FilterPill — filter bar usage with multiple pills", () => {
  it("renders multiple pills independently", () => {
    render(
      <div>
        <FilterPill>Status</FilterPill>
        <FilterPill>Date range</FilterPill>
        <FilterPill>Assignee</FilterPill>
      </div>
    );
    expect(screen.getByRole("button", { name: /status/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /date range/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /assignee/i })).toBeInTheDocument();
  });

  it("each pill fires its own onClick independently", async () => {
    const user = userEvent.setup();
    const click1 = vi.fn();
    const click2 = vi.fn();
    render(
      <div>
        <FilterPill onClick={click1}>First</FilterPill>
        <FilterPill onClick={click2}>Second</FilterPill>
      </div>
    );
    await user.click(screen.getByRole("button", { name: "First" }));
    expect(click1).toHaveBeenCalledTimes(1);
    expect(click2).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Second" }));
    expect(click2).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// 13. Active state pattern (selected pill group)
// ---------------------------------------------------------------------------

describe("FilterPill — active-state selection pattern", () => {
  function SelectionGroup() {
    const OPTIONS = ["All", "Documents", "Images", "Video"];
    const [selected, setSelected] = React.useState("All");

    return (
      <div>
        <span data-testid="selected-value">{selected}</span>
        {OPTIONS.map((option) => (
          <FilterPill
            key={option}
            aria-pressed={selected === option}
            onClick={() => setSelected(option)}
            className={
              selected === option
                ? "border-foreground bg-foreground text-background"
                : undefined
            }
          >
            {option}
          </FilterPill>
        ))}
      </div>
    );
  }

  it("starts with first option selected", () => {
    render(<SelectionGroup />);
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "Documents" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("changes selection on click", async () => {
    const user = userEvent.setup();
    render(<SelectionGroup />);
    await user.click(screen.getByRole("button", { name: "Documents" }));
    expect(screen.getByTestId("selected-value")).toHaveTextContent("Documents");
    expect(screen.getByRole("button", { name: "Documents" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("active pill has active-state classes applied", async () => {
    const user = userEvent.setup();
    render(<SelectionGroup />);
    await user.click(screen.getByRole("button", { name: "Images" }));
    expect(screen.getByRole("button", { name: "Images" })).toHaveClass("bg-foreground");
    expect(screen.getByRole("button", { name: "Images" })).toHaveClass("text-background");
  });

  it("only one pill is active at a time (mutual exclusion)", async () => {
    const user = userEvent.setup();
    render(<SelectionGroup />);
    await user.click(screen.getByRole("button", { name: "Video" }));
    const allPills = screen.getAllByRole("button");
    const activePills = allPills.filter(
      (btn) => btn.getAttribute("aria-pressed") === "true"
    );
    expect(activePills).toHaveLength(1);
    expect(activePills[0]).toHaveAccessibleName("Video");
  });
});

// ---------------------------------------------------------------------------
// 14. DropdownMenu integration (as-select-trigger pattern)
// ---------------------------------------------------------------------------

describe("FilterPill — DropdownMenu trigger integration", () => {
  function DropdownWrapper() {
    const [value, setValue] = React.useState("Last 7 days");
    const OPTIONS = ["Today", "Last 7 days", "Last 30 days"];

    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <FilterPill icon={<CalendarDots data-testid="cal-icon" />}>
              {value}
            </FilterPill>
          }
        />
        <DropdownMenuContent>
          {OPTIONS.map((opt) => (
            <DropdownMenuItem key={opt} onClick={() => setValue(opt)}>
              {opt}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  it("renders the trigger as a FilterPill button", () => {
    render(<DropdownWrapper />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Last 7 days");
  });

  it("opens dropdown menu on click", async () => {
    const user = userEvent.setup();
    render(<DropdownWrapper />);
    await user.click(screen.getByRole("button"));
    expect(await screen.findByRole("menuitem", { name: "Today" })).toBeInTheDocument();
  });

  it("dropdown menu items are visible after opening", async () => {
    const user = userEvent.setup();
    render(<DropdownWrapper />);
    await user.click(screen.getByRole("button"));
    expect(await screen.findByRole("menuitem", { name: "Last 7 days" })).toBeInTheDocument();
    expect(await screen.findByRole("menuitem", { name: "Last 30 days" })).toBeInTheDocument();
  });

  it("selecting a menu item updates the trigger label", async () => {
    const user = userEvent.setup();
    render(<DropdownWrapper />);
    await user.click(screen.getByRole("button"));
    const todayItem = await screen.findByRole("menuitem", { name: "Today" });
    await user.click(todayItem);
    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent("Today");
    });
  });

  it("closes dropdown on Escape key", async () => {
    const user = userEvent.setup();
    render(<DropdownWrapper />);
    await user.click(screen.getByRole("button"));
    expect(await screen.findByRole("menuitem", { name: "Today" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("menuitem", { name: "Today" })).not.toBeInTheDocument();
    });
  });
});

// ---------------------------------------------------------------------------
// 15. Chevron icon specifics
// ---------------------------------------------------------------------------

describe("FilterPill — ChevronsUpDown chevron icon", () => {
  it("chevron svg has muted-foreground color class", () => {
    const { container } = render(<FilterPill>Test</FilterPill>);
    const btn = container.querySelector("button");
    // The ChevronsUpDown gets class "size-3.5 text-muted-foreground"
    const svgElements = btn?.querySelectorAll("svg");
    // When no icon prop: only one svg (the chevron)
    expect(svgElements?.length).toBeGreaterThanOrEqual(1);
    const chevron = Array.from(svgElements || []).find((svg) =>
      svg.classList.contains("text-muted-foreground")
    );
    expect(chevron).not.toBeUndefined();
  });

  it("chevron has size-3.5 class", () => {
    const { container } = render(<FilterPill>Test</FilterPill>);
    const btn = container.querySelector("button");
    const svgs = Array.from(btn?.querySelectorAll("svg") || []);
    const chevron = svgs.find((svg) => svg.classList.contains("size-3.5"));
    expect(chevron).not.toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// 16. Rendering with complex children
// ---------------------------------------------------------------------------

describe("FilterPill — complex children", () => {
  it("renders with JSX children", () => {
    render(
      <FilterPill>
        <span data-testid="child-span">Type: Documents</span>
      </FilterPill>
    );
    expect(screen.getByTestId("child-span")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Type: Documents");
  });

  it("renders with no children (icon only)", () => {
    render(
      <FilterPill
        icon={<Tag data-testid="icon-only" />}
        aria-label="Filter by tag"
      />
    );
    expect(screen.getByRole("button", { name: "Filter by tag" })).toBeInTheDocument();
    expect(screen.getByTestId("icon-only")).toBeInTheDocument();
  });

  it("renders with icon and complex children together", () => {
    render(
      <FilterPill
        icon={<Tag data-testid="tag" />}
        className="border-foreground bg-foreground text-background"
      >
        Type: <strong>Images</strong>
      </FilterPill>
    );
    expect(screen.getByRole("button")).toHaveTextContent("Type: Images");
    expect(screen.getByTestId("tag")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 17. Accessibility — axe violations
// ---------------------------------------------------------------------------

describe("FilterPill — accessibility (axe)", () => {
  it("has no axe violations (default, with text content)", async () => {
    const { container } = render(<FilterPill>All time</FilterPill>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations (with icon and label)", async () => {
    const { container } = render(
      <FilterPill icon={<CalendarDots />}>Date range</FilterPill>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations (with aria-label, icon-only)", async () => {
    const { container } = render(
      <FilterPill aria-label="Filter by category">
        {/* no text children */}
      </FilterPill>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations (disabled state)", async () => {
    const { container } = render(
      <FilterPill disabled className="cursor-not-allowed opacity-50">
        Status
      </FilterPill>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations (aria-pressed active state)", async () => {
    const { container } = render(
      <FilterPill aria-pressed={true} className="bg-foreground text-background">
        Documents
      </FilterPill>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations (aria-expanded state)", async () => {
    const { container } = render(
      <FilterPill aria-expanded="true" aria-haspopup="menu">
        Open
      </FilterPill>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// 18. Edge cases
// ---------------------------------------------------------------------------

describe("FilterPill — edge cases", () => {
  it("renders with empty children string", () => {
    const { container } = render(<FilterPill>{""}</FilterPill>);
    expect(container.querySelector("button")).not.toBeNull();
  });

  it("renders with zero (falsy) number child gracefully", () => {
    const { container } = render(<FilterPill>{0}</FilterPill>);
    expect(container.querySelector("button")).not.toBeNull();
  });

  it("renders with undefined children gracefully", () => {
    const { container } = render(<FilterPill>{undefined}</FilterPill>);
    expect(container.querySelector("button")).not.toBeNull();
  });

  it("renders with very long text without crashing", () => {
    const longText = "A".repeat(200);
    render(<FilterPill>{longText}</FilterPill>);
    expect(screen.getByRole("button")).toHaveTextContent(longText);
  });

  it("renders with special characters", () => {
    render(<FilterPill>{"<>&\"'"}</FilterPill>);
    expect(screen.getByRole("button")).toHaveTextContent("<>&\"'");
  });

  it("handles rapid successive clicks without error", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<FilterPill onClick={handleClick}>Rapid</FilterPill>);
    const btn = screen.getByRole("button");
    for (let i = 0; i < 5; i++) {
      await user.click(btn);
    }
    expect(handleClick).toHaveBeenCalledTimes(5);
  });
});
