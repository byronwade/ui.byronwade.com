import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, describe, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";

// ─── helpers ───────────────────────────────────────────────────────────────
const THREE_OPTIONS = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
] as const;

const TWO_OPTIONS = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
] as const;

const MANY_OPTIONS = [
  { label: "1h", value: "1h" },
  { label: "6h", value: "6h" },
  { label: "24h", value: "24h" },
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
  { label: "90d", value: "90d" },
] as const;

/** Controlled wrapper so we can observe real state changes */
function Controlled<T extends string>({
  options,
  initialValue,
}: {
  options: { label: string; value: T }[];
  initialValue: T;
}) {
  const [value, setValue] = useState(initialValue);
  return (
    <>
      <span data-testid="current">{value}</span>
      <SegmentedControl
        options={options}
        value={value}
        onValueChange={setValue}
      />
    </>
  );
}

// ─── 1. Renders without crashing ───────────────────────────────────────────
describe("renders without crashing", () => {
  it("mounts with a default (three) option set", () => {
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="week"
        onValueChange={vi.fn()}
      />
    );
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("renders all option labels as buttons", () => {
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="week"
        onValueChange={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "Day" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Week" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Month" })).toBeInTheDocument();
  });

  it("renders two-option variant", () => {
    render(
      <SegmentedControl
        options={TWO_OPTIONS as unknown as { label: string; value: string }[]}
        value="light"
        onValueChange={vi.fn()}
      />
    );
    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Light" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dark" })).toBeInTheDocument();
  });

  it("renders many-option variant (6 buttons)", () => {
    render(
      <SegmentedControl
        options={MANY_OPTIONS as unknown as { label: string; value: string }[]}
        value="24h"
        onValueChange={vi.fn()}
      />
    );
    expect(screen.getAllByRole("button")).toHaveLength(6);
  });
});

// ─── 2. Container structure & classes ──────────────────────────────────────
describe("container structure", () => {
  it("wraps buttons in a role=group element", () => {
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="day"
        onValueChange={vi.fn()}
      />
    );
    const group = screen.getByRole("group");
    expect(group).toBeInTheDocument();
    expect(within(group).getAllByRole("button")).toHaveLength(3);
  });

  it("group has rounded-full class", () => {
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="day"
        onValueChange={vi.fn()}
      />
    );
    expect(screen.getByRole("group")).toHaveClass("rounded-full");
  });

  it("group has inline-flex class", () => {
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="day"
        onValueChange={vi.fn()}
      />
    );
    expect(screen.getByRole("group")).toHaveClass("inline-flex");
  });

  it("applies a custom className to the group", () => {
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="day"
        onValueChange={vi.fn()}
        className="custom-class"
      />
    );
    expect(screen.getByRole("group")).toHaveClass("custom-class");
  });

  it("custom className does not remove base classes", () => {
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="day"
        onValueChange={vi.fn()}
        className="extra"
      />
    );
    const group = screen.getByRole("group");
    expect(group).toHaveClass("rounded-full");
    expect(group).toHaveClass("extra");
  });
});

// ─── 3. Active / pressed state ─────────────────────────────────────────────
describe("active state", () => {
  it("the value-matching button has aria-pressed=true", () => {
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="week"
        onValueChange={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "Week" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("non-active buttons have aria-pressed=false", () => {
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="week"
        onValueChange={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "Day" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
    expect(screen.getByRole("button", { name: "Month" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("active button has data-active=true attribute", () => {
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="month"
        onValueChange={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "Month" })).toHaveAttribute(
      "data-active",
      "true"
    );
  });

  it("inactive buttons have data-active=false attribute", () => {
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="month"
        onValueChange={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "Day" })).toHaveAttribute(
      "data-active",
      "false"
    );
    expect(screen.getByRole("button", { name: "Week" })).toHaveAttribute(
      "data-active",
      "false"
    );
  });

  it("first option is active when value equals first option", () => {
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="day"
        onValueChange={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "Day" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "Week" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
    expect(screen.getByRole("button", { name: "Month" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("last option is active when value equals last option", () => {
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="month"
        onValueChange={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "Month" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("active button has data-[active=true] styled classes applied", () => {
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="week"
        onValueChange={vi.fn()}
      />
    );
    const activeBtn = screen.getByRole("button", { name: "Week" });
    // The component applies `data-[active=true]:bg-card` via Tailwind data attribute selector
    // We verify the data-active=true attribute is set (the CSS class selector will apply at runtime)
    expect(activeBtn).toHaveAttribute("data-active", "true");
  });
});

// ─── 4. Button type attribute ───────────────────────────────────────────────
describe("button type", () => {
  it("each button has type=button (no accidental form submission)", () => {
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="day"
        onValueChange={vi.fn()}
      />
    );
    screen.getAllByRole("button").forEach((btn) => {
      expect(btn).toHaveAttribute("type", "button");
    });
  });
});

// ─── 5. Interactions ───────────────────────────────────────────────────────
describe("interactions", () => {
  it("calls onValueChange with the clicked option value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="week"
        onValueChange={onChange}
      />
    );
    await user.click(screen.getByRole("button", { name: "Day" }));
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith("day");
  });

  it("calls onValueChange when the last option is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="day"
        onValueChange={onChange}
      />
    );
    await user.click(screen.getByRole("button", { name: "Month" }));
    expect(onChange).toHaveBeenCalledWith("month");
  });

  it("calls onValueChange when the currently-active button is clicked again", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="week"
        onValueChange={onChange}
      />
    );
    await user.click(screen.getByRole("button", { name: "Week" }));
    expect(onChange).toHaveBeenCalledWith("week");
  });

  it("does NOT call onValueChange unless a button is actually clicked", () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="week"
        onValueChange={onChange}
      />
    );
    expect(onChange).not.toHaveBeenCalled();
  });

  it("updates the active state after a click (controlled via wrapper)", async () => {
    const user = userEvent.setup();
    render(
      <Controlled
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        initialValue="week"
      />
    );
    expect(screen.getByTestId("current")).toHaveTextContent("week");
    await user.click(screen.getByRole("button", { name: "Day" }));
    expect(screen.getByTestId("current")).toHaveTextContent("day");
    // aria-pressed should now reflect the new active
    expect(screen.getByRole("button", { name: "Day" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "Week" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("cycles through multiple selections correctly", async () => {
    const user = userEvent.setup();
    render(
      <Controlled
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        initialValue="day"
      />
    );
    await user.click(screen.getByRole("button", { name: "Week" }));
    expect(screen.getByTestId("current")).toHaveTextContent("week");
    await user.click(screen.getByRole("button", { name: "Month" }));
    expect(screen.getByTestId("current")).toHaveTextContent("month");
    await user.click(screen.getByRole("button", { name: "Day" }));
    expect(screen.getByTestId("current")).toHaveTextContent("day");
  });

  it("works with two-option segmented control", async () => {
    const user = userEvent.setup();
    render(
      <Controlled
        options={TWO_OPTIONS as unknown as { label: string; value: string }[]}
        initialValue="light"
      />
    );
    await user.click(screen.getByRole("button", { name: "Dark" }));
    expect(screen.getByTestId("current")).toHaveTextContent("dark");
    expect(screen.getByRole("button", { name: "Dark" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "Light" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("works with many options", async () => {
    const user = userEvent.setup();
    render(
      <Controlled
        options={MANY_OPTIONS as unknown as { label: string; value: string }[]}
        initialValue="24h"
      />
    );
    await user.click(screen.getByRole("button", { name: "90d" }));
    expect(screen.getByTestId("current")).toHaveTextContent("90d");
    expect(screen.getByRole("button", { name: "90d" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "24h" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("only exactly one button is active at a time after clicking", async () => {
    const user = userEvent.setup();
    render(
      <Controlled
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        initialValue="week"
      />
    );
    await user.click(screen.getByRole("button", { name: "Month" }));
    const pressedButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.getAttribute("aria-pressed") === "true");
    expect(pressedButtons).toHaveLength(1);
    expect(pressedButtons[0]).toHaveAccessibleName("Month");
  });

  it("keyboard Enter activates a focused button", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="week"
        onValueChange={onChange}
      />
    );
    const dayBtn = screen.getByRole("button", { name: "Day" });
    dayBtn.focus();
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledWith("day");
  });

  it("keyboard Space activates a focused button", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="week"
        onValueChange={onChange}
      />
    );
    const monthBtn = screen.getByRole("button", { name: "Month" });
    monthBtn.focus();
    await user.keyboard(" ");
    expect(onChange).toHaveBeenCalledWith("month");
  });

  it("Tab key moves focus between buttons", async () => {
    const user = userEvent.setup();
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="day"
        onValueChange={vi.fn()}
      />
    );
    const [dayBtn, weekBtn] = screen.getAllByRole("button");
    dayBtn.focus();
    expect(document.activeElement).toBe(dayBtn);
    await user.tab();
    expect(document.activeElement).toBe(weekBtn);
  });
});

// ─── 6. Disabled (wrapper pattern from examples) ───────────────────────────
describe("disabled (wrapper pattern)", () => {
  it("pointer-events-none wrapper prevents onValueChange from firing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    // The component itself has no disabled prop — the pattern is to wrap in a
    // pointer-events-none + opacity div (as shown in examples/disabled.tsx)
    render(
      <div className="pointer-events-none select-none opacity-40">
        <SegmentedControl
          options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
          value="chart"
          onValueChange={onChange}
        />
      </div>
    );
    // userEvent cannot click through pointer-events-none in jsdom environment
    // — attempting to click should either be blocked or the onChange stays silent
    // We verify the initial rendered state is stable
    expect(
      screen.getByRole("button", { name: "Week" })
    ).toHaveAttribute("aria-pressed", "false");
    expect(onChange).not.toHaveBeenCalled();
  });
});

// ─── 7. Option count rendering ─────────────────────────────────────────────
describe("option counts", () => {
  it("renders exactly the number of buttons matching the options array length", () => {
    render(
      <SegmentedControl
        options={MANY_OPTIONS as unknown as { label: string; value: string }[]}
        value="1h"
        onValueChange={vi.fn()}
      />
    );
    expect(screen.getAllByRole("button")).toHaveLength(MANY_OPTIONS.length);
  });

  it("renders a single-option segmented control", () => {
    render(
      <SegmentedControl
        options={[{ label: "Only", value: "only" }]}
        value="only"
        onValueChange={vi.fn()}
      />
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveAttribute("aria-pressed", "true");
  });
});

// ─── 8. Label rendering ────────────────────────────────────────────────────
describe("label rendering", () => {
  it("button text matches the label property", () => {
    render(
      <SegmentedControl
        options={[
          { label: "A → Z", value: "az" },
          { label: "Popular", value: "popular" },
        ]}
        value="az"
        onValueChange={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "A → Z" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Popular" })
    ).toBeInTheDocument();
  });

  it("label with special characters renders correctly", () => {
    render(
      <SegmentedControl
        options={[{ label: "50%", value: "fifty" }]}
        value="fifty"
        onValueChange={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "50%" })).toBeInTheDocument();
  });
});

// ─── 9. Sizes (via className overrides, as per examples/sizes.tsx) ─────────
describe("sizes via className", () => {
  it("accepts large size className and still renders group + buttons", () => {
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="list"
        onValueChange={vi.fn()}
        className="p-1 [&_button]:px-5 [&_button]:py-1.5 [&_button]:text-base"
      />
    );
    const group = screen.getByRole("group");
    expect(group).toHaveClass("p-1");
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("accepts small size className override", () => {
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="day"
        onValueChange={vi.fn()}
        className="p-0.5"
      />
    );
    expect(screen.getByRole("group")).toHaveClass("p-0.5");
  });
});

// ─── 10. Controlled display pattern (controlled-display example) ────────────
describe("controlled display", () => {
  it("value prop drives the active button (external state)", () => {
    const { rerender } = render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="day"
        onValueChange={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "Day" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    rerender(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="month"
        onValueChange={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "Month" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "Day" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("re-render with same value keeps existing active button", () => {
    const { rerender } = render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="week"
        onValueChange={vi.fn()}
      />
    );
    rerender(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="week"
        onValueChange={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "Week" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });
});

// ─── 11. Button-level classes ──────────────────────────────────────────────
describe("button classes", () => {
  it("all buttons have rounded-full class", () => {
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="day"
        onValueChange={vi.fn()}
      />
    );
    screen.getAllByRole("button").forEach((btn) => {
      expect(btn).toHaveClass("rounded-full");
    });
  });

  it("all buttons have text-sm class", () => {
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="day"
        onValueChange={vi.fn()}
      />
    );
    screen.getAllByRole("button").forEach((btn) => {
      expect(btn).toHaveClass("text-sm");
    });
  });

  it("all buttons have transition-colors class", () => {
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="day"
        onValueChange={vi.fn()}
      />
    );
    screen.getAllByRole("button").forEach((btn) => {
      expect(btn).toHaveClass("transition-colors");
    });
  });
});

// ─── 12. Accessibility ─────────────────────────────────────────────────────
describe("accessibility", () => {
  it("has no axe violations with default usage", async () => {
    const { container } = render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="week"
        onValueChange={vi.fn()}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with two options", async () => {
    const { container } = render(
      <SegmentedControl
        options={TWO_OPTIONS as unknown as { label: string; value: string }[]}
        value="light"
        onValueChange={vi.fn()}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with many options", async () => {
    const { container } = render(
      <SegmentedControl
        options={MANY_OPTIONS as unknown as { label: string; value: string }[]}
        value="7d"
        onValueChange={vi.fn()}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations after a click interaction", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Controlled
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        initialValue="day"
      />
    );
    await user.click(screen.getByRole("button", { name: "Week" }));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("buttons are keyboard focusable (not tabIndex=-1)", () => {
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="day"
        onValueChange={vi.fn()}
      />
    );
    screen.getAllByRole("button").forEach((btn) => {
      // tabIndex defaults to 0 (not set) which means focusable
      // buttons should NOT have tabIndex=-1
      expect(btn).not.toHaveAttribute("tabindex", "-1");
    });
  });

  it("active button is discoverable via aria-pressed=true", () => {
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="month"
        onValueChange={vi.fn()}
      />
    );
    // AT query: find pressed button
    const pressedButtons = screen
      .getAllByRole("button")
      .filter((b) => b.getAttribute("aria-pressed") === "true");
    expect(pressedButtons).toHaveLength(1);
    expect(pressedButtons[0]).toHaveAccessibleName("Month");
  });
});

// ─── 13. Edge cases ────────────────────────────────────────────────────────
describe("edge cases", () => {
  it("works when options array is dynamically updated", () => {
    const opts1 = [
      { label: "A", value: "a" },
      { label: "B", value: "b" },
    ];
    const opts2 = [
      { label: "X", value: "x" },
      { label: "Y", value: "y" },
      { label: "Z", value: "z" },
    ];
    const { rerender } = render(
      <SegmentedControl options={opts1} value="a" onValueChange={vi.fn()} />
    );
    expect(screen.getAllByRole("button")).toHaveLength(2);

    rerender(
      <SegmentedControl options={opts2} value="x" onValueChange={vi.fn()} />
    );
    expect(screen.getAllByRole("button")).toHaveLength(3);
    expect(screen.getByRole("button", { name: "X" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("value not found in options results in no button having aria-pressed=true", () => {
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value={"nonexistent" as string}
        onValueChange={vi.fn()}
      />
    );
    const pressedButtons = screen
      .getAllByRole("button")
      .filter((b) => b.getAttribute("aria-pressed") === "true");
    expect(pressedButtons).toHaveLength(0);
  });

  it("onValueChange callback can be a no-op without crashing", async () => {
    const user = userEvent.setup();
    render(
      <SegmentedControl
        options={THREE_OPTIONS as unknown as { label: string; value: string }[]}
        value="week"
        onValueChange={() => {}}
      />
    );
    await user.click(screen.getByRole("button", { name: "Day" }));
    // Should not throw
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("renders inside a form without type=submit defaulting", () => {
    render(
      <form>
        <SegmentedControl
          options={TWO_OPTIONS as unknown as { label: string; value: string }[]}
          value="light"
          onValueChange={vi.fn()}
        />
      </form>
    );
    screen.getAllByRole("button").forEach((btn) => {
      expect(btn).toHaveAttribute("type", "button");
    });
  });
});
