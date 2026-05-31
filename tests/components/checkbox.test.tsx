import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { CheckboxGroup } from "@base-ui/react/checkbox-group";
import { Checkbox } from "@/components/ui/checkbox";

// ─── Smoke ────────────────────────────────────────────────────────────────────

describe("Checkbox – smoke", () => {
  it("renders without crashing", () => {
    render(<Checkbox aria-label="Accept" />);
    expect(screen.getByRole("checkbox", { name: "Accept" })).toBeInTheDocument();
  });

  it("renders as a checkbox role element", () => {
    render(<Checkbox aria-label="Test" />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("renders with data-slot='checkbox'", () => {
    render(<Checkbox aria-label="Slot test" />);
    const cb = screen.getByRole("checkbox");
    expect(cb).toHaveAttribute("data-slot", "checkbox");
  });

  it("renders without any props without crashing", () => {
    // No aria-label but should not throw
    const { container } = render(<Checkbox />);
    const el = container.querySelector("[data-slot='checkbox']");
    expect(el).toBeInTheDocument();
  });

  it("renders the CheckIcon indicator inside the root when checked", () => {
    // The indicator is only mounted when checked or indeterminate (keepMounted=false by default)
    const { container } = render(<Checkbox aria-label="Icon check" defaultChecked />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("indicator is NOT in DOM when unchecked (keepMounted=false default)", () => {
    // Verifies the unmount-by-default behavior of CheckboxPrimitive.Indicator
    const { container } = render(<Checkbox aria-label="No indicator" />);
    const indicator = container.querySelector("[data-slot='checkbox-indicator']");
    expect(indicator).toBeNull();
  });

  it("renders indicator with data-slot='checkbox-indicator' when checked", () => {
    const { container } = render(<Checkbox aria-label="Indicator" defaultChecked />);
    const indicator = container.querySelector("[data-slot='checkbox-indicator']");
    expect(indicator).toBeInTheDocument();
  });
});

// ─── Default (unchecked) state ────────────────────────────────────────────────

describe("Checkbox – default unchecked state", () => {
  it("is unchecked by default", () => {
    render(<Checkbox aria-label="Default" />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("has data-unchecked attribute when unchecked", () => {
    render(<Checkbox aria-label="Unchecked" />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("data-unchecked");
  });

  it("does NOT have data-checked attribute when unchecked", () => {
    render(<Checkbox aria-label="No checked attr" />);
    expect(screen.getByRole("checkbox")).not.toHaveAttribute("data-checked");
  });

  it("has base class: peer", () => {
    render(<Checkbox aria-label="Base class" />);
    expect(screen.getByRole("checkbox").className).toContain("peer");
  });

  it("has base class: rounded-[4px]", () => {
    render(<Checkbox aria-label="Rounded" />);
    expect(screen.getByRole("checkbox").className).toContain("rounded-[4px]");
  });

  it("has base class: border", () => {
    render(<Checkbox aria-label="Border" />);
    expect(screen.getByRole("checkbox").className).toContain("border");
  });

  it("has base class: size-4", () => {
    render(<Checkbox aria-label="Size" />);
    expect(screen.getByRole("checkbox").className).toContain("size-4");
  });

  it("has base class: shrink-0", () => {
    render(<Checkbox aria-label="Shrink" />);
    expect(screen.getByRole("checkbox").className).toContain("shrink-0");
  });

  it("has base class: flex", () => {
    render(<Checkbox aria-label="Flex" />);
    expect(screen.getByRole("checkbox").className).toContain("flex");
  });

  it("has base class: items-center", () => {
    render(<Checkbox aria-label="Items center" />);
    expect(screen.getByRole("checkbox").className).toContain("items-center");
  });

  it("has base class: justify-center", () => {
    render(<Checkbox aria-label="Justify center" />);
    expect(screen.getByRole("checkbox").className).toContain("justify-center");
  });

  it("has base class: transition-colors", () => {
    render(<Checkbox aria-label="Transition" />);
    expect(screen.getByRole("checkbox").className).toContain("transition-colors");
  });

  it("has base class: outline-none", () => {
    render(<Checkbox aria-label="Outline" />);
    expect(screen.getByRole("checkbox").className).toContain("outline-none");
  });

  it("has base disabled class: disabled:cursor-not-allowed", () => {
    render(<Checkbox aria-label="Disabled cursor" />);
    expect(screen.getByRole("checkbox").className).toContain("disabled:cursor-not-allowed");
  });

  it("has base disabled class: disabled:opacity-50", () => {
    render(<Checkbox aria-label="Disabled opacity" />);
    expect(screen.getByRole("checkbox").className).toContain("disabled:opacity-50");
  });
});

// ─── checked prop (controlled) ────────────────────────────────────────────────

describe("Checkbox – checked prop (controlled)", () => {
  it("is checked when checked=true", () => {
    render(<Checkbox aria-label="Checked" checked onCheckedChange={() => {}} />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("has data-checked attribute when checked=true", () => {
    render(<Checkbox aria-label="Checked attr" checked onCheckedChange={() => {}} />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("data-checked");
  });

  it("does NOT have data-unchecked attribute when checked=true", () => {
    render(<Checkbox aria-label="No unchecked" checked onCheckedChange={() => {}} />);
    expect(screen.getByRole("checkbox")).not.toHaveAttribute("data-unchecked");
  });

  it("has data-checked:bg-primary class in className string", () => {
    render(<Checkbox aria-label="Checked bg" checked onCheckedChange={() => {}} />);
    expect(screen.getByRole("checkbox").className).toContain("data-checked:bg-primary");
  });

  it("has data-checked:border-primary class in className string", () => {
    render(<Checkbox aria-label="Checked border" checked onCheckedChange={() => {}} />);
    expect(screen.getByRole("checkbox").className).toContain("data-checked:border-primary");
  });

  it("has data-checked:text-primary-foreground class in className string", () => {
    render(<Checkbox aria-label="Checked text" checked onCheckedChange={() => {}} />);
    expect(screen.getByRole("checkbox").className).toContain("data-checked:text-primary-foreground");
  });

  it("is unchecked when checked=false", () => {
    render(<Checkbox aria-label="Unchecked ctrl" checked={false} onCheckedChange={() => {}} />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });
});

// ─── defaultChecked prop (uncontrolled) ──────────────────────────────────────

describe("Checkbox – defaultChecked prop (uncontrolled)", () => {
  it("is checked when defaultChecked=true", () => {
    render(<Checkbox aria-label="Default checked" defaultChecked />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("has data-checked attribute when defaultChecked=true", () => {
    render(<Checkbox aria-label="Default checked attr" defaultChecked />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("data-checked");
  });

  it("starts unchecked when defaultChecked is not provided", () => {
    render(<Checkbox aria-label="Default unchecked" />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });
});

// ─── disabled state ───────────────────────────────────────────────────────────

describe("Checkbox – disabled state", () => {
  it("is disabled when disabled=true (aria-disabled on span)", () => {
    // Base UI renders checkbox as <span role="checkbox" aria-disabled="true">
    // toBeDisabled() checks native disabled attribute; aria-disabled must be checked separately
    render(<Checkbox aria-label="Disabled" disabled />);
    const cb = screen.getByRole("checkbox");
    expect(cb).toHaveAttribute("aria-disabled", "true");
  });

  it("has data-disabled attribute when disabled", () => {
    render(<Checkbox aria-label="Disabled attr" disabled />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("data-disabled");
  });

  it("disabled unchecked checkbox is still unchecked", () => {
    render(<Checkbox aria-label="Disabled unchecked" disabled />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("disabled checked checkbox shows checked state", () => {
    render(<Checkbox aria-label="Disabled checked" disabled defaultChecked />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("disabled checkbox does NOT fire onCheckedChange when clicked", async () => {
    const handler = vi.fn();
    render(<Checkbox aria-label="No fire" disabled onCheckedChange={handler} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("checkbox"));
    expect(handler).not.toHaveBeenCalled();
  });

  it("disabled checkbox has tabindex=-1 (not keyboard focusable)", () => {
    // Base UI sets tabindex="-1" on disabled span checkboxes
    render(<Checkbox aria-label="Disabled tabindex" disabled />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("tabindex", "-1");
  });
});

// ─── readOnly state ───────────────────────────────────────────────────────────

describe("Checkbox – readOnly state", () => {
  it("has data-readonly attribute when readOnly=true", () => {
    render(<Checkbox aria-label="Readonly" readOnly />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("data-readonly");
  });

  it("readOnly checked checkbox shows checked state", () => {
    render(<Checkbox aria-label="Readonly checked" readOnly checked onCheckedChange={() => {}} />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("readOnly unchecked checkbox shows unchecked state", () => {
    render(<Checkbox aria-label="Readonly unchecked" readOnly />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("readOnly checkbox does NOT fire onCheckedChange when clicked", async () => {
    const handler = vi.fn();
    render(<Checkbox aria-label="Readonly no fire" readOnly onCheckedChange={handler} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("checkbox"));
    expect(handler).not.toHaveBeenCalled();
  });
});

// ─── required state ───────────────────────────────────────────────────────────

describe("Checkbox – required state", () => {
  it("has data-required attribute when required=true", () => {
    render(<Checkbox aria-label="Required" required />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("data-required");
  });

  it("required checkbox is still interactive (not disabled)", () => {
    render(<Checkbox aria-label="Required interactive" required />);
    expect(screen.getByRole("checkbox")).not.toBeDisabled();
  });
});

// ─── indeterminate state ──────────────────────────────────────────────────────

describe("Checkbox – indeterminate state", () => {
  it("has data-indeterminate attribute when indeterminate=true", () => {
    render(<Checkbox aria-label="Indeterminate" indeterminate />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("data-indeterminate");
  });

  it("does NOT have data-checked when only indeterminate (not checked)", () => {
    render(<Checkbox aria-label="Indet no checked" indeterminate />);
    expect(screen.getByRole("checkbox")).not.toHaveAttribute("data-checked");
  });

  it("indeterminate checkbox with checked=true has data-indeterminate (overrides data-checked)", () => {
    // Base UI: when indeterminate=true, data-indeterminate is set and data-checked is NOT set
    // (indeterminate state takes precedence over checked for data attributes)
    render(
      <Checkbox
        aria-label="Indet and checked"
        indeterminate
        checked
        onCheckedChange={() => {}}
      />
    );
    const cb = screen.getByRole("checkbox");
    expect(cb).toHaveAttribute("data-indeterminate");
  });
});

// ─── aria-invalid state ───────────────────────────────────────────────────────

describe("Checkbox – aria-invalid state", () => {
  it("has aria-invalid='true' when passed", () => {
    render(<Checkbox aria-label="Invalid" aria-invalid="true" />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("has aria-invalid:border-destructive class in className string", () => {
    render(<Checkbox aria-label="Invalid border" aria-invalid="true" />);
    expect(screen.getByRole("checkbox").className).toContain("aria-invalid:border-destructive");
  });

  it("has aria-invalid:ring-3 class in className string", () => {
    render(<Checkbox aria-label="Invalid ring" aria-invalid="true" />);
    expect(screen.getByRole("checkbox").className).toContain("aria-invalid:ring-3");
  });

  it("has aria-invalid:ring-destructive/20 class in className string", () => {
    render(<Checkbox aria-label="Invalid ring color" aria-invalid="true" />);
    expect(screen.getByRole("checkbox").className).toContain("aria-invalid:ring-destructive/20");
  });

  it("does NOT have aria-invalid attribute when not set", () => {
    render(<Checkbox aria-label="Normal" />);
    expect(screen.getByRole("checkbox")).not.toHaveAttribute("aria-invalid");
  });
});

// ─── className prop ───────────────────────────────────────────────────────────

describe("Checkbox – className prop", () => {
  it("merges a custom className onto the root element", () => {
    render(<Checkbox aria-label="Custom class" className="my-custom-class" />);
    expect(screen.getByRole("checkbox").className).toContain("my-custom-class");
  });

  it("custom className does not remove base class: peer", () => {
    render(<Checkbox aria-label="Custom keeps base" className="extra" />);
    expect(screen.getByRole("checkbox").className).toContain("peer");
  });

  it("multiple custom classNames are all applied", () => {
    render(<Checkbox aria-label="Multi class" className="foo bar baz" />);
    const cls = screen.getByRole("checkbox").className;
    expect(cls).toContain("foo");
    expect(cls).toContain("bar");
    expect(cls).toContain("baz");
  });

  it("empty className does not break rendering", () => {
    render(<Checkbox aria-label="Empty class" className="" />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });
});

// ─── Interactions ─────────────────────────────────────────────────────────────

describe("Checkbox – interactions (toggle)", () => {
  it("toggles from unchecked to checked on click", async () => {
    render(<Checkbox aria-label="Toggle on" />);
    const user = userEvent.setup();
    const cb = screen.getByRole("checkbox");
    expect(cb).not.toBeChecked();
    await user.click(cb);
    expect(cb).toBeChecked();
  });

  it("toggles from checked to unchecked on second click", async () => {
    render(<Checkbox aria-label="Toggle off" defaultChecked />);
    const user = userEvent.setup();
    const cb = screen.getByRole("checkbox");
    expect(cb).toBeChecked();
    await user.click(cb);
    expect(cb).not.toBeChecked();
  });

  it("calls onCheckedChange with true when checked", async () => {
    const handler = vi.fn();
    render(<Checkbox aria-label="Handler on" onCheckedChange={handler} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("checkbox"));
    expect(handler).toHaveBeenCalledWith(true, expect.anything());
  });

  it("calls onCheckedChange with false when unchecked", async () => {
    const handler = vi.fn();
    render(<Checkbox aria-label="Handler off" defaultChecked onCheckedChange={handler} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("checkbox"));
    expect(handler).toHaveBeenCalledWith(false, expect.anything());
  });

  it("calls onCheckedChange exactly once per click", async () => {
    const handler = vi.fn();
    render(<Checkbox aria-label="Handler count" onCheckedChange={handler} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("checkbox"));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("calls onCheckedChange twice after two clicks", async () => {
    const handler = vi.fn();
    render(<Checkbox aria-label="Handler twice" onCheckedChange={handler} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("checkbox"));
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it("can be focused via Tab", async () => {
    render(<Checkbox aria-label="Focusable" />);
    const user = userEvent.setup();
    await user.tab();
    expect(screen.getByRole("checkbox")).toHaveFocus();
  });

  it("toggles via keyboard Space when focused", async () => {
    render(<Checkbox aria-label="Keyboard Space" />);
    const user = userEvent.setup();
    const cb = screen.getByRole("checkbox");
    cb.focus();
    await user.keyboard(" ");
    expect(cb).toBeChecked();
  });

  it("controlled checked value does not change without calling onCheckedChange", async () => {
    // Purely controlled: checked stays false because handler does nothing
    render(<Checkbox aria-label="Controlled" checked={false} onCheckedChange={() => {}} />);
    const user = userEvent.setup();
    const cb = screen.getByRole("checkbox");
    await user.click(cb);
    expect(cb).not.toBeChecked();
  });

  it("updates state when controlled parent updates checked prop", () => {
    const { rerender } = render(
      <Checkbox aria-label="Rerender" checked={false} onCheckedChange={() => {}} />
    );
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    rerender(<Checkbox aria-label="Rerender" checked={true} onCheckedChange={() => {}} />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });
});

// ─── With label (id + htmlFor) ────────────────────────────────────────────────

describe("Checkbox – with label association", () => {
  it("clicking the label checks the checkbox", async () => {
    render(
      <div>
        <Checkbox id="label-cb" />
        <label htmlFor="label-cb">Agree</label>
      </div>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Agree"));
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("checkbox is findable by its label text via getByRole", () => {
    render(
      <div>
        <Checkbox id="named-cb" />
        <label htmlFor="named-cb">Subscribe</label>
      </div>
    );
    expect(screen.getByRole("checkbox", { name: "Subscribe" })).toBeInTheDocument();
  });
});

// ─── name / value / form props ────────────────────────────────────────────────

describe("Checkbox – name / value / form props", () => {
  it("forwards id to the hidden input element (Base UI uses its own id for the span)", () => {
    // Base UI generates its own id for the root span; the user-provided id goes to the hidden input
    const { container } = render(<Checkbox aria-label="ID" id="my-checkbox" />);
    const hiddenInput = container.querySelector("input[type='checkbox']");
    expect(hiddenInput).toHaveAttribute("id", "my-checkbox");
  });

  it("has a hidden input with the name attribute for form submission", () => {
    const { container } = render(<Checkbox aria-label="Named" name="accept" />);
    const hiddenInput = container.querySelector("input[type='checkbox']");
    expect(hiddenInput).toBeInTheDocument();
    expect(hiddenInput).toHaveAttribute("name", "accept");
  });

  it("has a hidden input with the value attribute", () => {
    const { container } = render(<Checkbox aria-label="Valued" value="on" />);
    const hiddenInput = container.querySelector("input[type='checkbox']");
    expect(hiddenInput).toBeInTheDocument();
    expect(hiddenInput).toHaveAttribute("value", "on");
  });

  it("forwards form attribute to the hidden input", () => {
    const { container } = render(<Checkbox aria-label="Formed" form="my-form" />);
    const hiddenInput = container.querySelector("input[type='checkbox']");
    expect(hiddenInput).toHaveAttribute("form", "my-form");
  });
});

// ─── CheckboxGroup integration ────────────────────────────────────────────────

describe("Checkbox – CheckboxGroup integration", () => {
  const ITEMS = ["read", "write", "delete"] as const;

  it("renders checkboxes inside a CheckboxGroup", () => {
    render(
      <CheckboxGroup value={["read"]} onValueChange={() => {}}>
        {ITEMS.map((item) => (
          <Checkbox key={item} aria-label={item} value={item} />
        ))}
      </CheckboxGroup>
    );
    expect(screen.getByRole("checkbox", { name: "read" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "write" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "delete" })).toBeInTheDocument();
  });

  it("checkbox in group is checked when its value is in group value array", () => {
    render(
      <CheckboxGroup value={["read", "write"]} onValueChange={() => {}}>
        {ITEMS.map((item) => (
          <Checkbox key={item} aria-label={item} value={item} />
        ))}
      </CheckboxGroup>
    );
    expect(screen.getByRole("checkbox", { name: "read" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "write" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "delete" })).not.toBeChecked();
  });

  it("calls onValueChange when a checkbox in the group is toggled", async () => {
    const handler = vi.fn();
    render(
      <CheckboxGroup value={["read"]} onValueChange={handler}>
        {ITEMS.map((item) => (
          <Checkbox key={item} aria-label={item} value={item} />
        ))}
      </CheckboxGroup>
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("checkbox", { name: "write" }));
    expect(handler).toHaveBeenCalled();
  });

  it("uncontrolled group with defaultValue checks the right boxes", () => {
    render(
      <CheckboxGroup defaultValue={["delete"]}>
        {ITEMS.map((item) => (
          <Checkbox key={item} aria-label={item} value={item} />
        ))}
      </CheckboxGroup>
    );
    expect(screen.getByRole("checkbox", { name: "delete" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "read" })).not.toBeChecked();
  });

  it("uncontrolled group toggles checkboxes on click", async () => {
    const user = userEvent.setup();
    render(
      <CheckboxGroup defaultValue={[]}>
        {ITEMS.map((item) => (
          <Checkbox key={item} aria-label={item} value={item} />
        ))}
      </CheckboxGroup>
    );
    await user.click(screen.getByRole("checkbox", { name: "read" }));
    expect(screen.getByRole("checkbox", { name: "read" })).toBeChecked();
  });

  it("disabled CheckboxGroup disables all checkboxes (aria-disabled)", () => {
    // Base UI renders <span role="checkbox" aria-disabled="true"> not native disabled
    render(
      <CheckboxGroup value={[]} onValueChange={() => {}} disabled>
        {ITEMS.map((item) => (
          <Checkbox key={item} aria-label={item} value={item} />
        ))}
      </CheckboxGroup>
    );
    ITEMS.forEach((item) => {
      expect(screen.getByRole("checkbox", { name: item })).toHaveAttribute("aria-disabled", "true");
    });
  });
});

// ─── Indeterminate "select-all" pattern ──────────────────────────────────────

describe("Checkbox – indeterminate select-all pattern", () => {
  const FRUITS = ["Apples", "Bananas", "Cherries"];

  function SelectAll() {
    const [selected, setSelected] = React.useState<string[]>(["Apples"]);
    const allChecked = selected.length === FRUITS.length;
    const someChecked = selected.length > 0 && !allChecked;

    return (
      <div>
        <Checkbox
          aria-label="Select all"
          checked={allChecked}
          indeterminate={someChecked}
          onCheckedChange={(checked) => setSelected(checked ? [...FRUITS] : [])}
        />
        {FRUITS.map((item) => (
          <Checkbox
            key={item}
            aria-label={item}
            checked={selected.includes(item)}
            onCheckedChange={(checked) =>
              setSelected((prev) =>
                checked ? [...prev, item] : prev.filter((i) => i !== item)
              )
            }
          />
        ))}
        <span data-testid="count">{selected.length}</span>
      </div>
    );
  }

  it("parent is indeterminate when some (not all) items are selected", () => {
    render(<SelectAll />);
    const parent = screen.getByRole("checkbox", { name: "Select all" });
    expect(parent).toHaveAttribute("data-indeterminate");
    expect(parent).not.toHaveAttribute("data-checked");
  });

  it("selecting all via parent checks all children", async () => {
    const user = userEvent.setup();
    render(<SelectAll />);
    const parent = screen.getByRole("checkbox", { name: "Select all" });
    await user.click(parent);
    FRUITS.forEach((fruit) => {
      expect(screen.getByRole("checkbox", { name: fruit })).toBeChecked();
    });
  });

  it("deselecting all via parent unchecks all children", async () => {
    const user = userEvent.setup();
    render(<SelectAll />);
    // First click checks all
    await user.click(screen.getByRole("checkbox", { name: "Select all" }));
    // Second click unchecks all
    await user.click(screen.getByRole("checkbox", { name: "Select all" }));
    FRUITS.forEach((fruit) => {
      expect(screen.getByRole("checkbox", { name: fruit })).not.toBeChecked();
    });
  });

  it("parent has data-checked when all items are selected", async () => {
    const user = userEvent.setup();
    render(<SelectAll />);
    await user.click(screen.getByRole("checkbox", { name: "Select all" }));
    expect(screen.getByRole("checkbox", { name: "Select all" })).toHaveAttribute("data-checked");
  });

  it("parent loses indeterminate and gains unchecked when all deselected", async () => {
    const user = userEvent.setup();
    render(<SelectAll />);
    // Deselect the initially-selected Apples
    await user.click(screen.getByRole("checkbox", { name: "Apples" }));
    const parent = screen.getByRole("checkbox", { name: "Select all" });
    expect(parent).not.toHaveAttribute("data-indeterminate");
    expect(parent).toHaveAttribute("data-unchecked");
  });
});

// ─── Re-render behavior ───────────────────────────────────────────────────────

describe("Checkbox – re-render behavior", () => {
  it("updates from unchecked to checked on re-render", () => {
    const { rerender } = render(
      <Checkbox aria-label="Rerender" checked={false} onCheckedChange={() => {}} />
    );
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    rerender(<Checkbox aria-label="Rerender" checked={true} onCheckedChange={() => {}} />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("updates from enabled to disabled on re-render (aria-disabled)", () => {
    // Base UI sets aria-disabled on the span, not native disabled attribute
    const { rerender } = render(<Checkbox aria-label="Toggle disabled" />);
    expect(screen.getByRole("checkbox")).not.toHaveAttribute("aria-disabled");
    rerender(<Checkbox aria-label="Toggle disabled" disabled />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-disabled", "true");
  });

  it("updates indeterminate state on re-render", () => {
    const { rerender } = render(<Checkbox aria-label="Rerender indet" />);
    expect(screen.getByRole("checkbox")).not.toHaveAttribute("data-indeterminate");
    rerender(<Checkbox aria-label="Rerender indet" indeterminate />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("data-indeterminate");
  });
});

// ─── Multiple checkboxes ──────────────────────────────────────────────────────

describe("Checkbox – multiple instances", () => {
  it("renders multiple checkboxes independently", () => {
    render(
      <div>
        <Checkbox aria-label="A" />
        <Checkbox aria-label="B" />
        <Checkbox aria-label="C" />
      </div>
    );
    expect(screen.getByRole("checkbox", { name: "A" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "B" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "C" })).toBeInTheDocument();
  });

  it("clicking one checkbox does not affect another", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Checkbox aria-label="First" />
        <Checkbox aria-label="Second" />
      </div>
    );
    await user.click(screen.getByRole("checkbox", { name: "First" }));
    expect(screen.getByRole("checkbox", { name: "First" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Second" })).not.toBeChecked();
  });

  it("independently controlled checked states work correctly", () => {
    render(
      <div>
        <Checkbox aria-label="Checked1" checked onCheckedChange={() => {}} />
        <Checkbox aria-label="Unchecked2" checked={false} onCheckedChange={() => {}} />
      </div>
    );
    expect(screen.getByRole("checkbox", { name: "Checked1" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Unchecked2" })).not.toBeChecked();
  });
});

// ─── Accessibility (axe) ──────────────────────────────────────────────────────

describe("Checkbox – accessibility (axe)", () => {
  it("default unchecked checkbox with label has no axe violations", async () => {
    const { container } = render(
      <div>
        <Checkbox id="axe-default" />
        <label htmlFor="axe-default">Default</label>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("checked checkbox with label has no axe violations", async () => {
    const { container } = render(
      <div>
        <Checkbox id="axe-checked" defaultChecked />
        <label htmlFor="axe-checked">Checked option</label>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("disabled checkbox with label has no axe violations", async () => {
    const { container } = render(
      <div>
        <Checkbox id="axe-disabled" disabled />
        <label htmlFor="axe-disabled">Disabled option</label>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("disabled checked checkbox with label has no axe violations", async () => {
    const { container } = render(
      <div>
        <Checkbox id="axe-disabled-checked" disabled defaultChecked />
        <label htmlFor="axe-disabled-checked">Disabled checked</label>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("readOnly checkbox with label has no axe violations", async () => {
    const { container } = render(
      <div>
        <Checkbox id="axe-readonly" readOnly checked onCheckedChange={() => {}} />
        <label htmlFor="axe-readonly">Read-only option</label>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("required checkbox with label has no axe violations", async () => {
    const { container } = render(
      <form>
        <div>
          <Checkbox id="axe-required" required />
          <label htmlFor="axe-required">Required option</label>
        </div>
      </form>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("checkbox with aria-label has no axe violations", async () => {
    const { container } = render(<Checkbox aria-label="Standalone checkbox" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("CheckboxGroup with labeled checkboxes has no axe violations", async () => {
    const { container } = render(
      <CheckboxGroup value={["read"]} onValueChange={() => {}} aria-label="Permissions">
        {["read", "write", "delete"].map((item) => (
          <div key={item}>
            <Checkbox id={`axe-group-${item}`} value={item} />
            <label htmlFor={`axe-group-${item}`}>{item}</label>
          </div>
        ))}
      </CheckboxGroup>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe("Checkbox – edge cases", () => {
  it("renders with both checked and indeterminate without crashing", () => {
    render(
      <Checkbox
        aria-label="Both"
        checked
        indeterminate
        onCheckedChange={() => {}}
      />
    );
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("renders with required and disabled together without crashing", () => {
    render(<Checkbox aria-label="Both states" required disabled />);
    const cb = screen.getByRole("checkbox");
    expect(cb).toBeInTheDocument();
    expect(cb).toHaveAttribute("aria-disabled", "true");
    expect(cb).toHaveAttribute("data-required");
  });

  it("renders with readOnly and defaultChecked together without crashing", () => {
    render(<Checkbox aria-label="Readonly checked" readOnly defaultChecked />);
    const cb = screen.getByRole("checkbox");
    expect(cb).toBeInTheDocument();
    expect(cb).toBeChecked();
    expect(cb).toHaveAttribute("data-readonly");
  });

  it("indicator with data-slot='checkbox-indicator' is present when checked", () => {
    // The indicator is only mounted when checked or indeterminate (keepMounted=false)
    const { container } = render(<Checkbox aria-label="Indicator slot" defaultChecked />);
    expect(container.querySelector("[data-slot='checkbox-indicator']")).toBeInTheDocument();
  });
});
