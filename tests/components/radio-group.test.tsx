/**
 * Exhaustive tests for <RadioGroup /> + <RadioGroupItem />
 *
 * Component source: components/ui/radio-group.tsx
 * Underlying lib:   @base-ui/react/radio-group + @base-ui/react/radio
 *
 * API summary:
 *   RadioGroup  — wraps RadioGroupPrimitive (<div role="radiogroup">)
 *     Props: value, defaultValue, onValueChange, disabled, readOnly, required,
 *            name, className, ...rest (RadioGroupPrimitive.Props)
 *     Base classes: "grid w-full gap-2"
 *     data-slot="radio-group"
 *
 *   RadioGroupItem — wraps RadioPrimitive.Root (<span role="radio">)
 *     Props: value, disabled, readOnly, required, className, ...rest (RadioPrimitive.Root.Props)
 *     Base classes: relative flex aspect-square size-4 shrink-0 rounded-full
 *                   border border-input outline-none disabled:cursor-not-allowed
 *                   disabled:opacity-50 data-checked:border-primary
 *                   data-checked:bg-primary aria-invalid:border-destructive
 *     data-slot="radio-group-item"
 *     Contains RadioPrimitive.Indicator with a white dot indicator span.
 *
 *   ARIA: RadioGroup → role="radiogroup"; RadioGroupItem → role="radio" + aria-checked
 *
 *   NOTE: Base UI uses aria-labelledby (not for/id on the span) to link the
 *   Label to the radio span. The `id` prop on RadioGroupItem goes to the
 *   hidden <input> element. Use `getAllByRole('radio')` + name matching, or
 *   `within` the group to get a specific radio by accessible name.
 */

import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Get the radio item (span[role="radio"]) by its accessible name.
 * Because Base UI links via aria-labelledby (not for/id), getByLabelText
 * matches BOTH the span and the hidden <input>. We narrow to role="radio".
 */
function getRadioByName(name: string) {
  return screen.getByRole("radio", { name });
}

function queryRadioByName(name: string) {
  return screen.queryByRole("radio", { name });
}

/** Render a basic labeled RadioGroup for convenience. */
function BasicGroup({
  value,
  defaultValue,
  onValueChange,
  disabled,
  required,
  name,
  className,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  className?: string;
}) {
  return (
    <RadioGroup
      aria-label="Billing cycle"
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      required={required}
      name={name}
      className={className}
    >
      <div className="flex items-center gap-2">
        <RadioGroupItem value="monthly" id="monthly" />
        <Label htmlFor="monthly">Monthly</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="yearly" id="yearly" />
        <Label htmlFor="yearly">Yearly</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="lifetime" id="lifetime" />
        <Label htmlFor="lifetime">Lifetime</Label>
      </div>
    </RadioGroup>
  );
}

// ---------------------------------------------------------------------------
// 1. Renders without crashing — default usage
// ---------------------------------------------------------------------------

describe("RadioGroup — default render", () => {
  it("renders without crashing (no props)", () => {
    const { container } = render(
      <RadioGroup aria-label="Options">
        <RadioGroupItem value="a" />
      </RadioGroup>
    );
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders a radiogroup element", () => {
    render(<BasicGroup />);
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });

  it("renders all radio items", () => {
    render(<BasicGroup />);
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
  });

  it("renders children labels", () => {
    render(<BasicGroup />);
    expect(screen.getByText("Monthly")).toBeInTheDocument();
    expect(screen.getByText("Yearly")).toBeInTheDocument();
    expect(screen.getByText("Lifetime")).toBeInTheDocument();
  });

  it("renders with no items without crashing", () => {
    const { container } = render(<RadioGroup aria-label="Empty group" />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders a single item group without crashing", () => {
    render(
      <RadioGroup aria-label="Single">
        <RadioGroupItem value="only" />
      </RadioGroup>
    );
    expect(screen.getAllByRole("radio")).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// 2. data-slot attributes
// ---------------------------------------------------------------------------

describe("RadioGroup — data-slot attributes", () => {
  it("RadioGroup has data-slot='radio-group'", () => {
    render(<BasicGroup />);
    const group = screen.getByRole("radiogroup");
    expect(group).toHaveAttribute("data-slot", "radio-group");
  });

  it("every RadioGroupItem has data-slot='radio-group-item'", () => {
    const { container } = render(<BasicGroup />);
    const items = container.querySelectorAll('[data-slot="radio-group-item"]');
    expect(items).toHaveLength(3);
  });
});

// ---------------------------------------------------------------------------
// 3. Base CSS classes on RadioGroup
// ---------------------------------------------------------------------------

describe("RadioGroup — base CSS classes", () => {
  it("has 'grid' class", () => {
    render(<BasicGroup />);
    const group = screen.getByRole("radiogroup");
    expect(group.className).toContain("grid");
  });

  it("has 'w-full' class", () => {
    render(<BasicGroup />);
    const group = screen.getByRole("radiogroup");
    expect(group.className).toContain("w-full");
  });

  it("has 'gap-2' class", () => {
    render(<BasicGroup />);
    const group = screen.getByRole("radiogroup");
    expect(group.className).toContain("gap-2");
  });
});

// ---------------------------------------------------------------------------
// 4. Base CSS classes on RadioGroupItem
// ---------------------------------------------------------------------------

describe("RadioGroupItem — base CSS classes", () => {
  it("has 'rounded-full' class", () => {
    render(<BasicGroup />);
    const radios = screen.getAllByRole("radio");
    radios.forEach((r) => expect(r.className).toContain("rounded-full"));
  });

  it("has 'border' class", () => {
    render(<BasicGroup />);
    const radios = screen.getAllByRole("radio");
    radios.forEach((r) => expect(r.className).toContain("border"));
  });

  it("has 'border-input' class", () => {
    render(<BasicGroup />);
    const radios = screen.getAllByRole("radio");
    radios.forEach((r) => expect(r.className).toContain("border-input"));
  });

  it("has 'size-4' class", () => {
    render(<BasicGroup />);
    const radios = screen.getAllByRole("radio");
    radios.forEach((r) => expect(r.className).toContain("size-4"));
  });

  it("has 'aspect-square' class", () => {
    render(<BasicGroup />);
    const radios = screen.getAllByRole("radio");
    radios.forEach((r) => expect(r.className).toContain("aspect-square"));
  });

  it("has 'shrink-0' class", () => {
    render(<BasicGroup />);
    const radios = screen.getAllByRole("radio");
    radios.forEach((r) => expect(r.className).toContain("shrink-0"));
  });

  it("has 'outline-none' class", () => {
    render(<BasicGroup />);
    const radios = screen.getAllByRole("radio");
    radios.forEach((r) => expect(r.className).toContain("outline-none"));
  });

  it("has 'group/radio-group-item' class", () => {
    render(<BasicGroup />);
    const radios = screen.getAllByRole("radio");
    radios.forEach((r) => expect(r.className).toContain("group/radio-group-item"));
  });

  it("has 'relative' class", () => {
    render(<BasicGroup />);
    const radios = screen.getAllByRole("radio");
    radios.forEach((r) => expect(r.className).toContain("relative"));
  });

  it("has 'flex' class", () => {
    render(<BasicGroup />);
    const radios = screen.getAllByRole("radio");
    radios.forEach((r) => expect(r.className).toContain("flex"));
  });
});

// ---------------------------------------------------------------------------
// 5. ARIA roles and attributes — RadioGroupItem
// ---------------------------------------------------------------------------

describe("RadioGroupItem — ARIA roles and attributes", () => {
  it("each item has role='radio'", () => {
    render(<BasicGroup />);
    screen.getAllByRole("radio").forEach((r) => {
      expect(r).toHaveAttribute("role", "radio");
    });
  });

  it("unchecked items have aria-checked='false'", () => {
    render(<BasicGroup defaultValue="monthly" />);
    const yearly = getRadioByName("Yearly");
    expect(yearly).toHaveAttribute("aria-checked", "false");
    const lifetime = getRadioByName("Lifetime");
    expect(lifetime).toHaveAttribute("aria-checked", "false");
  });

  it("checked item has aria-checked='true'", () => {
    render(<BasicGroup defaultValue="monthly" />);
    const monthly = getRadioByName("Monthly");
    expect(monthly).toHaveAttribute("aria-checked", "true");
  });

  it("no item is checked when no defaultValue is provided", () => {
    render(<BasicGroup />);
    screen.getAllByRole("radio").forEach((r) => {
      expect(r).toHaveAttribute("aria-checked", "false");
    });
  });

  it("each item has an accessible name via aria-labelledby", () => {
    render(<BasicGroup />);
    expect(screen.getByRole("radio", { name: "Monthly" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Yearly" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Lifetime" })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 6. ARIA roles and attributes — RadioGroup
// ---------------------------------------------------------------------------

describe("RadioGroup — ARIA roles and attributes", () => {
  it("has role='radiogroup'", () => {
    render(<BasicGroup />);
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });

  it("accepts aria-label", () => {
    render(<BasicGroup />);
    expect(screen.getByRole("radiogroup", { name: "Billing cycle" })).toBeInTheDocument();
  });

  it("accepts aria-labelledby", () => {
    render(
      <div>
        <p id="group-label">Payment interval</p>
        <RadioGroup aria-labelledby="group-label">
          <RadioGroupItem value="a" id="a" />
          <Label htmlFor="a">Option A</Label>
        </RadioGroup>
      </div>
    );
    expect(screen.getByRole("radiogroup", { name: "Payment interval" })).toBeInTheDocument();
  });

  it("required prop sets aria-required on the group", () => {
    render(<BasicGroup required />);
    const group = screen.getByRole("radiogroup");
    expect(group).toHaveAttribute("aria-required", "true");
  });

  it("disabled prop sets aria-disabled on the group", () => {
    render(<BasicGroup disabled />);
    const group = screen.getByRole("radiogroup");
    expect(group).toHaveAttribute("aria-disabled", "true");
  });

  it("name prop is accepted without crashing", () => {
    render(<BasicGroup name="billing" />);
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 7. Controlled value
// ---------------------------------------------------------------------------

describe("RadioGroup — controlled value", () => {
  it("renders with controlled value='monthly' — monthly is checked", () => {
    render(<BasicGroup value="monthly" onValueChange={() => {}} />);
    expect(getRadioByName("Monthly")).toHaveAttribute("aria-checked", "true");
    expect(getRadioByName("Yearly")).toHaveAttribute("aria-checked", "false");
    expect(getRadioByName("Lifetime")).toHaveAttribute("aria-checked", "false");
  });

  it("renders with controlled value='yearly' — yearly is checked", () => {
    render(<BasicGroup value="yearly" onValueChange={() => {}} />);
    expect(getRadioByName("Yearly")).toHaveAttribute("aria-checked", "true");
    expect(getRadioByName("Monthly")).toHaveAttribute("aria-checked", "false");
  });

  it("renders with controlled value='lifetime' — lifetime is checked", () => {
    render(<BasicGroup value="lifetime" onValueChange={() => {}} />);
    expect(getRadioByName("Lifetime")).toHaveAttribute("aria-checked", "true");
  });

  it("controlled: changing value prop updates checked state", () => {
    const { rerender } = render(
      <BasicGroup value="monthly" onValueChange={() => {}} />
    );
    expect(getRadioByName("Monthly")).toHaveAttribute("aria-checked", "true");

    rerender(<BasicGroup value="yearly" onValueChange={() => {}} />);
    expect(getRadioByName("Yearly")).toHaveAttribute("aria-checked", "true");
    expect(getRadioByName("Monthly")).toHaveAttribute("aria-checked", "false");
  });

  it("controlled with empty string value — nothing is checked", () => {
    render(<BasicGroup value="" onValueChange={() => {}} />);
    screen.getAllByRole("radio").forEach((r) => {
      expect(r).toHaveAttribute("aria-checked", "false");
    });
  });
});

// ---------------------------------------------------------------------------
// 8. Uncontrolled defaultValue
// ---------------------------------------------------------------------------

describe("RadioGroup — uncontrolled defaultValue", () => {
  it("defaultValue='monthly' checks monthly on mount", () => {
    render(<BasicGroup defaultValue="monthly" />);
    expect(getRadioByName("Monthly")).toHaveAttribute("aria-checked", "true");
  });

  it("defaultValue='yearly' checks yearly on mount", () => {
    render(<BasicGroup defaultValue="yearly" />);
    expect(getRadioByName("Yearly")).toHaveAttribute("aria-checked", "true");
  });

  it("defaultValue='lifetime' checks lifetime on mount", () => {
    render(<BasicGroup defaultValue="lifetime" />);
    expect(getRadioByName("Lifetime")).toHaveAttribute("aria-checked", "true");
  });

  it("no defaultValue → nothing checked", () => {
    render(<BasicGroup />);
    screen.getAllByRole("radio").forEach((r) => {
      expect(r).toHaveAttribute("aria-checked", "false");
    });
  });
});

// ---------------------------------------------------------------------------
// 9. Interactions — click to select
// ---------------------------------------------------------------------------

describe("RadioGroup — click interaction", () => {
  it("clicking an unselected item calls onValueChange with its value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<BasicGroup onValueChange={onValueChange} />);
    await user.click(getRadioByName("Monthly"));
    // Base UI calls onValueChange(value, eventDetails) — check first arg
    expect(onValueChange.mock.calls[0][0]).toBe("monthly");
  });

  it("clicking yearly calls onValueChange with 'yearly'", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<BasicGroup onValueChange={onValueChange} />);
    await user.click(getRadioByName("Yearly"));
    expect(onValueChange.mock.calls[0][0]).toBe("yearly");
  });

  it("clicking lifetime calls onValueChange with 'lifetime'", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<BasicGroup onValueChange={onValueChange} />);
    await user.click(getRadioByName("Lifetime"));
    expect(onValueChange.mock.calls[0][0]).toBe("lifetime");
  });

  it("uncontrolled: clicking an item makes it checked", async () => {
    const user = userEvent.setup();
    render(<BasicGroup />);
    await user.click(getRadioByName("Yearly"));
    expect(getRadioByName("Yearly")).toHaveAttribute("aria-checked", "true");
  });

  it("uncontrolled: selecting different item unchecks the previous", async () => {
    const user = userEvent.setup();
    render(<BasicGroup defaultValue="monthly" />);
    expect(getRadioByName("Monthly")).toHaveAttribute("aria-checked", "true");
    await user.click(getRadioByName("Yearly"));
    expect(getRadioByName("Yearly")).toHaveAttribute("aria-checked", "true");
    expect(getRadioByName("Monthly")).toHaveAttribute("aria-checked", "false");
  });

  it("clicking the label text selects the associated radio item", async () => {
    const user = userEvent.setup();
    render(<BasicGroup />);
    await user.click(screen.getByText("Lifetime"));
    expect(getRadioByName("Lifetime")).toHaveAttribute("aria-checked", "true");
  });

  it("onValueChange is called exactly once per click", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<BasicGroup onValueChange={onValueChange} />);
    await user.click(getRadioByName("Monthly"));
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("clicking already-checked item keeps it checked", async () => {
    const user = userEvent.setup();
    render(<BasicGroup defaultValue="monthly" />);
    await user.click(getRadioByName("Monthly"));
    expect(getRadioByName("Monthly")).toHaveAttribute("aria-checked", "true");
  });
});

// ---------------------------------------------------------------------------
// 10. Keyboard interaction
// ---------------------------------------------------------------------------

describe("RadioGroup — keyboard interaction", () => {
  it("pressing ArrowDown from first item moves selection to second item", async () => {
    const user = userEvent.setup();
    render(<BasicGroup defaultValue="monthly" />);
    const monthly = getRadioByName("Monthly");
    monthly.focus();
    await user.keyboard("{ArrowDown}");
    expect(getRadioByName("Yearly")).toHaveAttribute("aria-checked", "true");
  });

  it("pressing ArrowUp from second item moves selection to first item", async () => {
    const user = userEvent.setup();
    render(<BasicGroup defaultValue="yearly" />);
    const yearly = getRadioByName("Yearly");
    yearly.focus();
    await user.keyboard("{ArrowUp}");
    expect(getRadioByName("Monthly")).toHaveAttribute("aria-checked", "true");
  });

  it("checked item has tabIndex >= 0 (in tab order)", () => {
    render(<BasicGroup defaultValue="monthly" />);
    const monthly = getRadioByName("Monthly");
    expect(Number(monthly.getAttribute("tabindex"))).toBeGreaterThanOrEqual(0);
  });
});

// ---------------------------------------------------------------------------
// 11. Disabled — entire group
// ---------------------------------------------------------------------------

describe("RadioGroup — disabled (entire group)", () => {
  it("disabled group sets aria-disabled='true' on group", () => {
    render(<BasicGroup disabled defaultValue="monthly" />);
    const group = screen.getByRole("radiogroup");
    expect(group).toHaveAttribute("aria-disabled", "true");
  });

  it("disabled group: clicking does not fire onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<BasicGroup disabled onValueChange={onValueChange} />);
    // Pointer events are blocked on disabled items; click should not fire
    const radios = screen.getAllByRole("radio");
    await user.click(radios[0]);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("disabled group: items carry disabled:cursor-not-allowed class", () => {
    render(<BasicGroup disabled />);
    screen.getAllByRole("radio").forEach((r) => {
      expect(r.className).toContain("disabled:cursor-not-allowed");
      expect(r.className).toContain("disabled:opacity-50");
    });
  });

  it("disabled group renders without crashing", () => {
    const { container } = render(<BasicGroup disabled defaultValue="monthly" />);
    expect(container.firstElementChild).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 12. Disabled — individual item
// ---------------------------------------------------------------------------

describe("RadioGroupItem — disabled (individual item)", () => {
  it("disabled item carries disabled:cursor-not-allowed class", () => {
    render(
      <RadioGroup aria-label="Account type" defaultValue="personal">
        <div>
          <RadioGroupItem value="personal" id="personal" />
          <Label htmlFor="personal">Personal</Label>
        </div>
        <div>
          <RadioGroupItem value="enterprise" id="enterprise" disabled />
          <Label htmlFor="enterprise">Enterprise</Label>
        </div>
      </RadioGroup>
    );
    const enterprise = getRadioByName("Enterprise");
    expect(enterprise.className).toContain("disabled:cursor-not-allowed");
    expect(enterprise.className).toContain("disabled:opacity-50");
  });

  it("disabled item cannot be clicked to change value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup aria-label="Shipping" defaultValue="standard" onValueChange={onValueChange}>
        <div>
          <RadioGroupItem value="standard" id="standard" />
          <Label htmlFor="standard">Standard</Label>
        </div>
        <div>
          <RadioGroupItem value="overnight" id="overnight" disabled />
          <Label htmlFor="overnight">Overnight</Label>
        </div>
      </RadioGroup>
    );
    await user.click(getRadioByName("Overnight"));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("non-disabled items in same group still work when one is disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup aria-label="Plan" defaultValue="personal" onValueChange={onValueChange}>
        <div>
          <RadioGroupItem value="personal" id="p2" />
          <Label htmlFor="p2">Personal</Label>
        </div>
        <div>
          <RadioGroupItem value="team" id="t2" />
          <Label htmlFor="t2">Team</Label>
        </div>
        <div>
          <RadioGroupItem value="enterprise" id="e2" disabled />
          <Label htmlFor="e2">Enterprise</Label>
        </div>
      </RadioGroup>
    );
    await user.click(getRadioByName("Team"));
    expect(onValueChange.mock.calls[0][0]).toBe("team");
  });
});

// ---------------------------------------------------------------------------
// 13. aria-invalid state (form validation)
// ---------------------------------------------------------------------------

describe("RadioGroupItem — aria-invalid state", () => {
  it("aria-invalid class string contains aria-invalid:border-destructive selector", () => {
    render(
      <RadioGroup aria-label="Contact">
        <RadioGroupItem value="email" id="email" aria-invalid={true} />
        <Label htmlFor="email">Email</Label>
      </RadioGroup>
    );
    const item = getRadioByName("Email");
    // The class string carries the Tailwind variant selector
    expect(item.className).toContain("aria-invalid:border-destructive");
  });

  it("aria-invalid attribute is present on item when set", () => {
    render(
      <RadioGroup aria-label="Contact">
        <RadioGroupItem value="sms" id="sms" aria-invalid={true} />
        <Label htmlFor="sms">SMS</Label>
      </RadioGroup>
    );
    const item = getRadioByName("SMS");
    expect(item).toHaveAttribute("aria-invalid");
  });

  it("aria-invalid class string includes ring selectors", () => {
    render(
      <RadioGroup aria-label="Contact">
        <RadioGroupItem value="push" id="push" aria-invalid={true} />
        <Label htmlFor="push">Push</Label>
      </RadioGroup>
    );
    const item = getRadioByName("Push");
    expect(item.className).toContain("aria-invalid:ring-3");
  });

  it("aria-invalid on RadioGroup does not crash", () => {
    const { container } = render(
      <RadioGroup aria-label="Contact" aria-invalid={true}>
        <RadioGroupItem value="email" id="email-invalid" />
        <Label htmlFor="email-invalid">Email</Label>
      </RadioGroup>
    );
    expect(container.firstElementChild).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 14. Checked state classes — data-checked
// ---------------------------------------------------------------------------

describe("RadioGroupItem — checked state classes", () => {
  it("all items carry data-checked:border-primary in class string", () => {
    render(<BasicGroup defaultValue="monthly" />);
    screen.getAllByRole("radio").forEach((r) => {
      expect(r.className).toContain("data-checked:border-primary");
      expect(r.className).toContain("data-checked:bg-primary");
    });
  });

  it("all items carry data-checked:text-primary-foreground in class string", () => {
    render(<BasicGroup defaultValue="monthly" />);
    screen.getAllByRole("radio").forEach((r) => {
      expect(r.className).toContain("data-checked:text-primary-foreground");
    });
  });

  it("checked item has data-checked attribute; unchecked items have data-unchecked", () => {
    render(<BasicGroup defaultValue="monthly" />);
    const monthly = getRadioByName("Monthly");
    const yearly = getRadioByName("Yearly");
    expect(monthly).toHaveAttribute("data-checked");
    expect(yearly).toHaveAttribute("data-unchecked");
  });

  it("after clicking, newly-selected item gains data-checked attribute", async () => {
    const user = userEvent.setup();
    render(<BasicGroup />);
    await user.click(getRadioByName("Yearly"));
    expect(getRadioByName("Yearly")).toHaveAttribute("data-checked");
  });

  it("after clicking, previously-checked item loses data-checked and gains data-unchecked", async () => {
    const user = userEvent.setup();
    render(<BasicGroup defaultValue="monthly" />);
    await user.click(getRadioByName("Yearly"));
    expect(getRadioByName("Monthly")).toHaveAttribute("data-unchecked");
  });
});

// ---------------------------------------------------------------------------
// 15. className pass-through on RadioGroup
// ---------------------------------------------------------------------------

describe("RadioGroup — className pass-through", () => {
  it("merges custom className with base classes", () => {
    render(<BasicGroup className="custom-group" />);
    const group = screen.getByRole("radiogroup");
    expect(group.className).toContain("custom-group");
    expect(group.className).toContain("grid"); // base still present
  });

  it("horizontal layout className applies correctly", () => {
    render(
      <RadioGroup
        aria-label="Size"
        className="flex flex-row gap-4 w-auto"
        defaultValue="md"
      >
        {["xs", "sm", "md", "lg", "xl"].map((s) => (
          <div key={s}>
            <RadioGroupItem value={s} id={`size-${s}`} />
            <Label htmlFor={`size-${s}`}>{s.toUpperCase()}</Label>
          </div>
        ))}
      </RadioGroup>
    );
    const group = screen.getByRole("radiogroup");
    expect(group.className).toContain("flex");
    expect(group.className).toContain("flex-row");
  });

  it("custom className 'gap-3' merges in", () => {
    render(<BasicGroup className="gap-3" />);
    const group = screen.getByRole("radiogroup");
    expect(group.className).toContain("gap-3");
  });
});

// ---------------------------------------------------------------------------
// 16. className pass-through on RadioGroupItem
// ---------------------------------------------------------------------------

describe("RadioGroupItem — className pass-through", () => {
  it("merges custom className on RadioGroupItem", () => {
    render(
      <RadioGroup aria-label="Options">
        <RadioGroupItem value="a" id="a" className="custom-item" />
        <Label htmlFor="a">Option A</Label>
      </RadioGroup>
    );
    const item = getRadioByName("Option A");
    expect(item.className).toContain("custom-item");
    expect(item.className).toContain("rounded-full"); // base still present
  });

  it("sr-only className is applied to the radio item", () => {
    render(
      <RadioGroup aria-label="Color">
        <label>
          <RadioGroupItem value="red" className="sr-only" />
          <span>Red</span>
        </label>
      </RadioGroup>
    );
    const radio = screen.getByRole("radio");
    expect(radio.className).toContain("sr-only");
    expect(radio).toBeInTheDocument();
  });

  it("mt-0.5 className merges in for description layouts", () => {
    render(
      <RadioGroup aria-label="Plan choice">
        <div>
          <RadioGroupItem value="starter" id="plan-starter" className="mt-0.5 shrink-0" />
          <Label htmlFor="plan-starter">Starter</Label>
        </div>
      </RadioGroup>
    );
    const item = getRadioByName("Starter");
    expect(item.className).toContain("mt-0.5");
    expect(item.className).toContain("shrink-0");
  });
});

// ---------------------------------------------------------------------------
// 17. Focus-visible classes in the base class string
// ---------------------------------------------------------------------------

describe("RadioGroupItem — focus-visible classes", () => {
  it("has focus-visible:border-ring class", () => {
    render(<BasicGroup />);
    screen.getAllByRole("radio").forEach((r) => {
      expect(r.className).toContain("focus-visible:border-ring");
    });
  });

  it("has focus-visible:ring-3 class", () => {
    render(<BasicGroup />);
    screen.getAllByRole("radio").forEach((r) => {
      expect(r.className).toContain("focus-visible:ring-3");
    });
  });

  it("has focus-visible:ring-ring/50 class", () => {
    render(<BasicGroup />);
    screen.getAllByRole("radio").forEach((r) => {
      expect(r.className).toContain("focus-visible:ring-ring/50");
    });
  });
});

// ---------------------------------------------------------------------------
// 18. Dark mode class on RadioGroupItem
// ---------------------------------------------------------------------------

describe("RadioGroupItem — dark mode classes", () => {
  it("has dark:bg-input/30 class", () => {
    render(<BasicGroup />);
    screen.getAllByRole("radio").forEach((r) => {
      expect(r.className).toContain("dark:bg-input/30");
    });
  });

  it("has dark:data-checked:bg-primary class", () => {
    render(<BasicGroup />);
    screen.getAllByRole("radio").forEach((r) => {
      expect(r.className).toContain("dark:data-checked:bg-primary");
    });
  });
});

// ---------------------------------------------------------------------------
// 19. RadioPrimitive.Indicator — the white dot
// ---------------------------------------------------------------------------

describe("RadioGroupItem — indicator slot", () => {
  // The indicator (data-slot="radio-group-indicator") is only rendered by Base UI
  // when the item is in the checked state (data-checked). When unchecked,
  // the indicator is not present in the DOM.

  it("checked item renders data-slot='radio-group-indicator'", () => {
    const { container } = render(<BasicGroup defaultValue="monthly" />);
    const indicators = container.querySelectorAll('[data-slot="radio-group-indicator"]');
    expect(indicators.length).toBeGreaterThanOrEqual(1);
  });

  it("indicator has size-4 class", () => {
    const { container } = render(<BasicGroup defaultValue="monthly" />);
    const indicator = container.querySelector('[data-slot="radio-group-indicator"]');
    expect(indicator?.className).toContain("size-4");
  });

  it("indicator has items-center class", () => {
    const { container } = render(<BasicGroup defaultValue="monthly" />);
    const indicator = container.querySelector('[data-slot="radio-group-indicator"]');
    expect(indicator?.className).toContain("items-center");
  });

  it("indicator contains the white dot span with rounded-full and bg-primary-foreground", () => {
    const { container } = render(<BasicGroup defaultValue="monthly" />);
    const indicator = container.querySelector('[data-slot="radio-group-indicator"]');
    const dot = indicator?.querySelector("span");
    expect(dot).toBeInTheDocument();
    expect(dot?.className).toContain("rounded-full");
    expect(dot?.className).toContain("bg-primary-foreground");
  });

  it("indicator has flex class", () => {
    const { container } = render(<BasicGroup defaultValue="monthly" />);
    const indicator = container.querySelector('[data-slot="radio-group-indicator"]');
    expect(indicator?.className).toContain("flex");
  });

  it("unchecked items do not render the indicator", () => {
    const { container } = render(<BasicGroup defaultValue="monthly" />);
    // Only the checked radio (monthly) should have an indicator
    const radios = container.querySelectorAll('[data-slot="radio-group-item"]');
    const uncheckedRadios = Array.from(radios).filter((r) =>
      r.hasAttribute("data-unchecked")
    );
    uncheckedRadios.forEach((r) => {
      expect(r.querySelector('[data-slot="radio-group-indicator"]')).toBeNull();
    });
  });
});

// ---------------------------------------------------------------------------
// 20. Horizontal layout (from horizontal.tsx example)
// ---------------------------------------------------------------------------

describe("RadioGroup — horizontal layout (example)", () => {
  it("renders horizontal size selector without crashing", () => {
    render(
      <RadioGroup
        aria-label="Size"
        defaultValue="md"
        className="flex flex-row flex-wrap gap-4 w-auto"
      >
        {["xs", "sm", "md", "lg", "xl"].map((s) => (
          <div key={s} className="flex items-center gap-1.5">
            <RadioGroupItem value={s} id={`h-size-${s}`} />
            <Label htmlFor={`h-size-${s}`}>{s.toUpperCase()}</Label>
          </div>
        ))}
      </RadioGroup>
    );
    expect(screen.getAllByRole("radio")).toHaveLength(5);
    expect(screen.getByRole("radio", { name: "MD" })).toHaveAttribute("aria-checked", "true");
  });

  it("clicking XS in horizontal group fires onValueChange with 'xs'", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup
        aria-label="Size"
        defaultValue="md"
        className="flex flex-row gap-4 w-auto"
        onValueChange={onValueChange}
      >
        {["xs", "sm", "md"].map((s) => (
          <div key={s}>
            <RadioGroupItem value={s} id={`h2-size-${s}`} />
            <Label htmlFor={`h2-size-${s}`}>{s.toUpperCase()}</Label>
          </div>
        ))}
      </RadioGroup>
    );
    await user.click(screen.getByRole("radio", { name: "XS" }));
    expect(onValueChange.mock.calls[0][0]).toBe("xs");
  });

  it("color swatch layout with 5 items renders all radios", () => {
    const colors = ["slate", "red", "amber", "emerald", "sky"];
    render(
      <RadioGroup
        aria-label="Color"
        defaultValue="slate"
        className="flex flex-row gap-3 w-auto"
      >
        {colors.map((c) => (
          <label key={c} htmlFor={`color-${c}`} aria-label={c}>
            <RadioGroupItem value={c} id={`color-${c}`} className="sr-only" />
          </label>
        ))}
      </RadioGroup>
    );
    expect(screen.getAllByRole("radio")).toHaveLength(5);
  });
});

// ---------------------------------------------------------------------------
// 21. With description layout (from with-description.tsx example)
// ---------------------------------------------------------------------------

describe("RadioGroup — with description layout (example)", () => {
  const plans = [
    { value: "starter", label: "Starter", description: "Good for small teams", price: "Free" },
    { value: "pro", label: "Pro", description: "Up to 50 users", price: "$12 / mo" },
    { value: "business", label: "Business", description: "Unlimited users", price: "$49 / mo" },
  ];

  it("renders plan selection with descriptions", () => {
    render(
      <RadioGroup aria-label="Plan" defaultValue="pro" className="gap-3">
        {plans.map((plan) => (
          <label key={plan.value} htmlFor={`plan-${plan.value}`} className="flex items-start gap-3">
            <RadioGroupItem value={plan.value} id={`plan-${plan.value}`} />
            <div>
              <Label htmlFor={`plan-${plan.value}`}>{plan.label}</Label>
              <p>{plan.description}</p>
              <p>{plan.price}</p>
            </div>
          </label>
        ))}
      </RadioGroup>
    );
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(screen.getByText("Good for small teams")).toBeInTheDocument();
    expect(screen.getByText(plans[1].price)).toBeInTheDocument();
  });

  it("clicking a plan item fires onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup aria-label="Plan" defaultValue="pro" className="gap-3" onValueChange={onValueChange}>
        {plans.map((plan) => (
          <label key={plan.value} htmlFor={`plan2-${plan.value}`} className="flex items-start gap-3">
            <RadioGroupItem value={plan.value} id={`plan2-${plan.value}`} />
            <Label htmlFor={`plan2-${plan.value}`}>{plan.label}</Label>
          </label>
        ))}
      </RadioGroup>
    );
    await user.click(screen.getByRole("radio", { name: "Business" }));
    expect(onValueChange.mock.calls[0][0]).toBe("business");
  });
});

// ---------------------------------------------------------------------------
// 22. With icon layout (from with-icon.tsx example)
// ---------------------------------------------------------------------------

describe("RadioGroup — with icon layout (example)", () => {
  it("renders device selector with sr-only radio items", () => {
    render(
      <RadioGroup
        aria-label="Preview device"
        defaultValue="desktop"
        className="flex flex-row gap-3 w-auto"
      >
        {[
          { value: "desktop", label: "Desktop" },
          { value: "tablet", label: "Tablet" },
          { value: "mobile", label: "Mobile" },
        ].map(({ value, label }) => (
          <label key={value} htmlFor={`dev-${value}`} className="flex flex-col items-center gap-2">
            <RadioGroupItem value={value} id={`dev-${value}`} className="sr-only" />
            <Label htmlFor={`dev-${value}`}>{label}</Label>
          </label>
        ))}
      </RadioGroup>
    );
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(screen.getByRole("radio", { name: "Desktop" })).toHaveAttribute("aria-checked", "true");
  });

  it("clicking Mobile in icon group fires onValueChange with 'mobile'", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup
        aria-label="Device"
        defaultValue="desktop"
        className="flex flex-row gap-3 w-auto"
        onValueChange={onValueChange}
      >
        {["desktop", "mobile"].map((v) => (
          <label key={v} htmlFor={`icon-dev-${v}`}>
            <RadioGroupItem value={v} id={`icon-dev-${v}`} className="sr-only" />
            <Label htmlFor={`icon-dev-${v}`}>{v}</Label>
          </label>
        ))}
      </RadioGroup>
    );
    await user.click(screen.getByRole("radio", { name: "mobile" }));
    expect(onValueChange.mock.calls[0][0]).toBe("mobile");
  });
});

// ---------------------------------------------------------------------------
// 23. Form validation pattern (from form-validation.tsx example)
// ---------------------------------------------------------------------------

describe("RadioGroup — form validation pattern", () => {
  it("renders with aria-invalid on each item when validation fails", () => {
    render(
      <RadioGroup aria-label="Contact method">
        {["email", "sms", "push"].map((v) => (
          <div key={v}>
            <RadioGroupItem value={v} id={`fv-${v}`} aria-invalid={true} />
            <Label htmlFor={`fv-${v}`}>{v.toUpperCase()}</Label>
          </div>
        ))}
      </RadioGroup>
    );
    screen.getAllByRole("radio").forEach((r) => {
      expect(r).toHaveAttribute("aria-invalid");
    });
  });

  it("selecting an option in validation-mode group fires onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup aria-label="Contact method" onValueChange={onValueChange}>
        {["email", "sms"].map((v) => (
          <div key={v}>
            <RadioGroupItem value={v} id={`fv2-${v}`} />
            <Label htmlFor={`fv2-${v}`}>{v.toUpperCase()}</Label>
          </div>
        ))}
      </RadioGroup>
    );
    await user.click(screen.getByRole("radio", { name: "SMS" }));
    expect(onValueChange.mock.calls[0][0]).toBe("sms");
  });

  it("renders error message alongside group without crashing", () => {
    render(
      <div>
        <RadioGroup aria-label="Contact method" aria-describedby="contact-error">
          <RadioGroupItem value="email" id="fv3-email" />
          <Label htmlFor="fv3-email">Email</Label>
        </RadioGroup>
        <p id="contact-error">Please select a contact method.</p>
      </div>
    );
    expect(screen.getByText("Please select a contact method.")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 24. Native attribute pass-through
// ---------------------------------------------------------------------------

describe("RadioGroup — native attribute pass-through", () => {
  it("accepts id prop without crashing (id goes to hidden input, not group div)", () => {
    // Base UI: RadioGroupPrimitive passes `id` to the hidden <input>, not the
    // <div role="radiogroup"> element. The group gets an auto-generated id.
    const { container } = render(
      <RadioGroup aria-label="Test" id="my-group">
        <RadioGroupItem value="x" />
      </RadioGroup>
    );
    // The group should still render
    expect(container.querySelector('[role="radiogroup"]')).toBeInTheDocument();
  });

  it("passes data-testid to RadioGroup", () => {
    render(
      <RadioGroup aria-label="Test" data-testid="rg">
        <RadioGroupItem value="x" />
      </RadioGroup>
    );
    expect(screen.getByTestId("rg")).toBeInTheDocument();
  });

  it("passes data-testid to RadioGroupItem", () => {
    render(
      <RadioGroup aria-label="Test">
        <RadioGroupItem value="x" data-testid="rgi" />
      </RadioGroup>
    );
    expect(screen.getByTestId("rgi")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 25. Re-render behavior
// ---------------------------------------------------------------------------

describe("RadioGroup — re-render behavior", () => {
  it("updates checked state on value prop change (controlled)", () => {
    const { rerender } = render(
      <RadioGroup aria-label="Plan" value="monthly" onValueChange={() => {}}>
        <div>
          <RadioGroupItem value="monthly" id="re-monthly" />
          <Label htmlFor="re-monthly">Monthly</Label>
        </div>
        <div>
          <RadioGroupItem value="yearly" id="re-yearly" />
          <Label htmlFor="re-yearly">Yearly</Label>
        </div>
      </RadioGroup>
    );
    expect(screen.getByRole("radio", { name: "Monthly" })).toHaveAttribute("aria-checked", "true");

    rerender(
      <RadioGroup aria-label="Plan" value="yearly" onValueChange={() => {}}>
        <div>
          <RadioGroupItem value="monthly" id="re-monthly" />
          <Label htmlFor="re-monthly">Monthly</Label>
        </div>
        <div>
          <RadioGroupItem value="yearly" id="re-yearly" />
          <Label htmlFor="re-yearly">Yearly</Label>
        </div>
      </RadioGroup>
    );
    expect(screen.getByRole("radio", { name: "Yearly" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Monthly" })).toHaveAttribute("aria-checked", "false");
  });

  it("toggling disabled on re-render updates the group aria-disabled", () => {
    const { rerender } = render(<BasicGroup disabled={false} />);
    expect(screen.getByRole("radiogroup")).not.toHaveAttribute("aria-disabled");

    rerender(<BasicGroup disabled={true} />);
    expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-disabled", "true");
  });
});

// ---------------------------------------------------------------------------
// 26. Multiple independent groups on same page
// ---------------------------------------------------------------------------

describe("RadioGroup — multiple groups on same page", () => {
  it("two groups are independent — selecting in one doesn't affect the other", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <RadioGroup aria-label="Group A" defaultValue="a1">
          <div>
            <RadioGroupItem value="a1" id="a1" />
            <Label htmlFor="a1">A1</Label>
          </div>
          <div>
            <RadioGroupItem value="a2" id="a2" />
            <Label htmlFor="a2">A2</Label>
          </div>
        </RadioGroup>
        <RadioGroup aria-label="Group B" defaultValue="b1">
          <div>
            <RadioGroupItem value="b1" id="b1" />
            <Label htmlFor="b1">B1</Label>
          </div>
          <div>
            <RadioGroupItem value="b2" id="b2" />
            <Label htmlFor="b2">B2</Label>
          </div>
        </RadioGroup>
      </div>
    );
    await user.click(screen.getByRole("radio", { name: "A2" }));
    expect(screen.getByRole("radio", { name: "A2" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "B1" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "B2" })).toHaveAttribute("aria-checked", "false");
  });
});

// ---------------------------------------------------------------------------
// 27. Edge cases
// ---------------------------------------------------------------------------

describe("RadioGroup — edge cases", () => {
  it("renders with a single option and selects it on click", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup aria-label="Single" onValueChange={onValueChange}>
        <RadioGroupItem value="only" id="only" />
        <Label htmlFor="only">Only option</Label>
      </RadioGroup>
    );
    await user.click(screen.getByRole("radio", { name: "Only option" }));
    expect(onValueChange.mock.calls[0][0]).toBe("only");
  });

  it("renders with many options (10) without crashing", () => {
    render(
      <RadioGroup aria-label="Many options">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i}>
            <RadioGroupItem value={`opt-${i}`} id={`opt-${i}`} />
            <Label htmlFor={`opt-${i}`}>Option {i}</Label>
          </div>
        ))}
      </RadioGroup>
    );
    expect(screen.getAllByRole("radio")).toHaveLength(10);
  });

  it("defaultValue pointing to non-existent item leaves all unchecked", () => {
    render(<BasicGroup defaultValue="nonexistent" />);
    screen.getAllByRole("radio").forEach((r) => {
      expect(r).toHaveAttribute("aria-checked", "false");
    });
  });

  it("renders with React fragments as children without crashing", () => {
    render(
      <RadioGroup aria-label="Fragments">
        <>
          <RadioGroupItem value="x" id="frag-x" />
          <Label htmlFor="frag-x">X</Label>
        </>
        <>
          <RadioGroupItem value="y" id="frag-y" />
          <Label htmlFor="frag-y">Y</Label>
        </>
      </RadioGroup>
    );
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// 28. Accessibility (axe)
// ---------------------------------------------------------------------------

describe("RadioGroup — accessibility (axe)", () => {
  it("has no axe violations with default usage (no selection)", async () => {
    const { container } = render(
      <RadioGroup aria-label="Billing cycle">
        <div>
          <RadioGroupItem value="monthly" id="axe-monthly" />
          <Label htmlFor="axe-monthly">Monthly</Label>
        </div>
        <div>
          <RadioGroupItem value="yearly" id="axe-yearly" />
          <Label htmlFor="axe-yearly">Yearly</Label>
        </div>
      </RadioGroup>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with a defaultValue set", async () => {
    const { container } = render(
      <RadioGroup aria-label="Billing cycle" defaultValue="monthly">
        <div>
          <RadioGroupItem value="monthly" id="axe2-monthly" />
          <Label htmlFor="axe2-monthly">Monthly</Label>
        </div>
        <div>
          <RadioGroupItem value="yearly" id="axe2-yearly" />
          <Label htmlFor="axe2-yearly">Yearly</Label>
        </div>
      </RadioGroup>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with disabled group", async () => {
    const { container } = render(
      <RadioGroup aria-label="Disabled shipping" disabled defaultValue="standard">
        <div>
          <RadioGroupItem value="standard" id="axe-d-standard" />
          <Label htmlFor="axe-d-standard">Standard</Label>
        </div>
        <div>
          <RadioGroupItem value="express" id="axe-d-express" />
          <Label htmlFor="axe-d-express">Express</Label>
        </div>
      </RadioGroup>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with individually disabled item", async () => {
    const { container } = render(
      <RadioGroup aria-label="Account type" defaultValue="personal">
        <div>
          <RadioGroupItem value="personal" id="axe-p" />
          <Label htmlFor="axe-p">Personal</Label>
        </div>
        <div>
          <RadioGroupItem value="enterprise" id="axe-e" disabled />
          <Label htmlFor="axe-e">Enterprise (contact sales)</Label>
        </div>
      </RadioGroup>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with horizontal layout", async () => {
    const { container } = render(
      <RadioGroup
        aria-label="Device preview"
        defaultValue="desktop"
        className="flex flex-row gap-4"
      >
        {["desktop", "tablet", "mobile"].map((d) => (
          <div key={d}>
            <RadioGroupItem value={d} id={`axe-dev-${d}`} />
            <Label htmlFor={`axe-dev-${d}`}>{d}</Label>
          </div>
        ))}
      </RadioGroup>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with required group", async () => {
    const { container } = render(
      <RadioGroup aria-label="Required choice" required>
        <div>
          <RadioGroupItem value="yes" id="axe-req-yes" />
          <Label htmlFor="axe-req-yes">Yes</Label>
        </div>
        <div>
          <RadioGroupItem value="no" id="axe-req-no" />
          <Label htmlFor="axe-req-no">No</Label>
        </div>
      </RadioGroup>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with aria-labelledby", async () => {
    const { container } = render(
      <div>
        <p id="axe-grp-label">Preferred plan</p>
        <RadioGroup aria-labelledby="axe-grp-label" defaultValue="pro">
          <div>
            <RadioGroupItem value="free" id="axe-lby-free" />
            <Label htmlFor="axe-lby-free">Free</Label>
          </div>
          <div>
            <RadioGroupItem value="pro" id="axe-lby-pro" />
            <Label htmlFor="axe-lby-pro">Pro</Label>
          </div>
        </RadioGroup>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations after user interaction (item selected)", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <RadioGroup aria-label="Choice">
        <div>
          <RadioGroupItem value="option1" id="axe-int-1" />
          <Label htmlFor="axe-int-1">Option 1</Label>
        </div>
        <div>
          <RadioGroupItem value="option2" id="axe-int-2" />
          <Label htmlFor="axe-int-2">Option 2</Label>
        </div>
      </RadioGroup>
    );
    await user.click(screen.getByRole("radio", { name: "Option 1" }));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with plan+description layout", async () => {
    const { container } = render(
      <RadioGroup aria-label="Choose a plan" defaultValue="pro">
        {[
          { value: "starter", label: "Starter", description: "For small teams", price: "Free" },
          { value: "pro", label: "Pro", description: "Priority support", price: "$12/mo" },
        ].map((plan) => (
          <div key={plan.value}>
            <RadioGroupItem value={plan.value} id={`axe-plan-${plan.value}`} />
            <div>
              <Label htmlFor={`axe-plan-${plan.value}`}>{plan.label}</Label>
              <p>{plan.description}</p>
            </div>
          </div>
        ))}
      </RadioGroup>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
