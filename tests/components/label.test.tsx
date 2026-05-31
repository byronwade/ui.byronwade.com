/**
 * Exhaustive tests for <Label />
 *
 * Component source: components/ui/label.tsx
 * API summary:
 *   - Label renders a native <label> element
 *   - Props: all native <label> HTML props (className, htmlFor, children, id, …)
 *   - Base classes: flex items-center gap-2 text-sm leading-none font-medium select-none
 *   - Group-disabled: group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50
 *   - Peer-disabled: peer-disabled:cursor-not-allowed peer-disabled:opacity-50
 *   - data-slot="label" attribute always present
 *   - className is merged via cn()
 *   - No custom variants / size props — pure native <label> wrapper
 */

import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Label } from "@/components/ui/label";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the <label> element rendered by Label. */
function getLabel(container: HTMLElement): HTMLLabelElement {
  return container.querySelector("label") as HTMLLabelElement;
}

// ─── 1. Smoke — renders without crashing ─────────────────────────────────────

describe("Label — smoke", () => {
  it("renders without crashing with no props", () => {
    const { container } = render(<Label />);
    expect(getLabel(container)).toBeInTheDocument();
  });

  it("renders a <label> element as the root", () => {
    const { container } = render(<Label>Name</Label>);
    expect(getLabel(container).tagName).toBe("LABEL");
  });

  it("renders children as text content", () => {
    render(<Label>Full name</Label>);
    expect(screen.getByText("Full name")).toBeInTheDocument();
  });

  it("has the correct accessible role (generic label)", () => {
    // A <label> element is accessible by text; it is not a form widget itself.
    render(<Label>My label</Label>);
    expect(screen.getByText("My label").tagName).toBe("LABEL");
  });

  it("renders with children as JSX nodes", () => {
    render(
      <Label>
        <span data-testid="icon-node">★</span>
        Field name
      </Label>
    );
    expect(screen.getByTestId("icon-node")).toBeInTheDocument();
    expect(screen.getByText("Field name")).toBeInTheDocument();
  });
});

// ─── 2. data-slot attribute ───────────────────────────────────────────────────

describe("Label — data-slot attribute", () => {
  it("always has data-slot='label'", () => {
    const { container } = render(<Label>Test</Label>);
    expect(getLabel(container)).toHaveAttribute("data-slot", "label");
  });

  it("data-slot='label' present even with extra className", () => {
    const { container } = render(<Label className="extra">Test</Label>);
    expect(getLabel(container)).toHaveAttribute("data-slot", "label");
  });

  it("data-slot='label' present with no children", () => {
    const { container } = render(<Label />);
    expect(getLabel(container)).toHaveAttribute("data-slot", "label");
  });
});

// ─── 3. Base classes ──────────────────────────────────────────────────────────

describe("Label — base classes", () => {
  it("has 'flex' class", () => {
    const { container } = render(<Label>Test</Label>);
    expect(getLabel(container)).toHaveClass("flex");
  });

  it("has 'items-center' class", () => {
    const { container } = render(<Label>Test</Label>);
    expect(getLabel(container)).toHaveClass("items-center");
  });

  it("has 'gap-2' class", () => {
    const { container } = render(<Label>Test</Label>);
    expect(getLabel(container)).toHaveClass("gap-2");
  });

  it("has 'text-sm' class", () => {
    const { container } = render(<Label>Test</Label>);
    expect(getLabel(container)).toHaveClass("text-sm");
  });

  it("has 'leading-none' class", () => {
    const { container } = render(<Label>Test</Label>);
    expect(getLabel(container)).toHaveClass("leading-none");
  });

  it("has 'font-medium' class", () => {
    const { container } = render(<Label>Test</Label>);
    expect(getLabel(container)).toHaveClass("font-medium");
  });

  it("has 'select-none' class", () => {
    const { container } = render(<Label>Test</Label>);
    expect(getLabel(container)).toHaveClass("select-none");
  });

  it("all base classes are present together (no regression)", () => {
    const { container } = render(<Label>Test</Label>);
    const el = getLabel(container);
    expect(el).toHaveClass("flex");
    expect(el).toHaveClass("items-center");
    expect(el).toHaveClass("gap-2");
    expect(el).toHaveClass("text-sm");
    expect(el).toHaveClass("leading-none");
    expect(el).toHaveClass("font-medium");
    expect(el).toHaveClass("select-none");
  });
});

// ─── 4. className prop merging ────────────────────────────────────────────────

describe("Label — className prop merging", () => {
  it("merges custom className with base classes", () => {
    const { container } = render(<Label className="my-custom">Test</Label>);
    const el = getLabel(container);
    expect(el).toHaveClass("my-custom");
    expect(el).toHaveClass("flex"); // base class still present
  });

  it("allows overriding text color via className", () => {
    const { container } = render(
      <Label className="text-destructive">Error field</Label>
    );
    expect(getLabel(container)).toHaveClass("text-destructive");
  });

  it("allows adding cursor-pointer via className", () => {
    const { container } = render(
      <Label className="cursor-pointer">Clickable</Label>
    );
    expect(getLabel(container)).toHaveClass("cursor-pointer");
  });

  it("allows adding cursor-not-allowed via className", () => {
    const { container } = render(
      <Label className="cursor-not-allowed">Disabled-style</Label>
    );
    expect(getLabel(container)).toHaveClass("cursor-not-allowed");
  });

  it("allows adding w-28 shrink-0 text-right for inline layout", () => {
    const { container } = render(
      <Label className="w-28 shrink-0 text-right">Country</Label>
    );
    const el = getLabel(container);
    expect(el).toHaveClass("w-28");
    expect(el).toHaveClass("shrink-0");
    expect(el).toHaveClass("text-right");
  });

  it("className does not remove data-slot attribute", () => {
    const { container } = render(
      <Label className="extra-class">Test</Label>
    );
    expect(getLabel(container)).toHaveAttribute("data-slot", "label");
  });

  it("renders with empty className without error", () => {
    const { container } = render(<Label className="">Test</Label>);
    expect(getLabel(container)).toBeInTheDocument();
  });
});

// ─── 5. htmlFor / for attribute ──────────────────────────────────────────────

describe("Label — htmlFor prop", () => {
  it("sets the 'for' attribute on the element", () => {
    const { container } = render(<Label htmlFor="username">Username</Label>);
    expect(getLabel(container)).toHaveAttribute("for", "username");
  });

  it("associates label with a text input via htmlFor", () => {
    render(
      <div>
        <Label htmlFor="full-name">Full name</Label>
        <input id="full-name" type="text" />
      </div>
    );
    // screen.getByLabelText uses the for/id linkage
    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
  });

  it("associates label with an email input via htmlFor", () => {
    render(
      <div>
        <Label htmlFor="email">Email address</Label>
        <input id="email" type="email" />
      </div>
    );
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
  });

  it("associates label with a textarea via htmlFor", () => {
    render(
      <div>
        <Label htmlFor="bio">Bio</Label>
        <textarea id="bio" />
      </div>
    );
    expect(screen.getByLabelText("Bio")).toBeInTheDocument();
  });

  it("associates label with a select via htmlFor", () => {
    render(
      <div>
        <Label htmlFor="country">Country</Label>
        <select id="country">
          <option>US</option>
        </select>
      </div>
    );
    expect(screen.getByLabelText("Country")).toBeInTheDocument();
  });

  it("associates label with a checkbox via htmlFor", () => {
    render(
      <div>
        <input id="notifications" type="checkbox" />
        <Label htmlFor="notifications">Activity notifications</Label>
      </div>
    );
    expect(screen.getByLabelText("Activity notifications")).toBeInTheDocument();
  });

  it("works without htmlFor (standalone label)", () => {
    const { container } = render(<Label>Standalone</Label>);
    expect(getLabel(container)).not.toHaveAttribute("for");
    expect(screen.getByText("Standalone")).toBeInTheDocument();
  });
});

// ─── 6. id prop ──────────────────────────────────────────────────────────────

describe("Label — id prop", () => {
  it("passes id attribute through", () => {
    const { container } = render(<Label id="label-name">Name</Label>);
    expect(getLabel(container)).toHaveAttribute("id", "label-name");
  });

  it("label with id can be referenced via aria-labelledby", () => {
    render(
      <div>
        <Label id="group-title">Email preferences</Label>
        <div role="group" aria-labelledby="group-title">
          <input type="checkbox" aria-label="newsletter" />
        </div>
      </div>
    );
    const group = screen.getByRole("group");
    expect(group).toHaveAttribute("aria-labelledby", "group-title");
  });
});

// ─── 7. Group-disabled state (group-data-[disabled=true]) ────────────────────

describe("Label — group-disabled state via group wrapper", () => {
  it("has group-data-[disabled=true]:pointer-events-none class defined", () => {
    const { container } = render(<Label>Test</Label>);
    // The Tailwind class includes the responsive selector in its className string
    expect(getLabel(container).className).toContain("group-data-[disabled=true]:pointer-events-none");
  });

  it("has group-data-[disabled=true]:opacity-50 class defined", () => {
    const { container } = render(<Label>Test</Label>);
    expect(getLabel(container).className).toContain("group-data-[disabled=true]:opacity-50");
  });

  it("renders correctly inside a disabled fieldset with group data attr", () => {
    render(
      <fieldset disabled className="group" data-disabled="true">
        <div>
          <Label htmlFor="group-field">Group-disabled field</Label>
          <input id="group-field" type="text" />
        </div>
      </fieldset>
    );
    // The label must exist; runtime opacity is CSS/Tailwind-driven not inline style
    const label = screen.getByText("Group-disabled field");
    expect(label).toBeInTheDocument();
    expect(label.closest("fieldset")).toBeDisabled();
  });

  it("renders correctly when group is NOT disabled", () => {
    render(
      <div className="group">
        <Label htmlFor="active-field">Active</Label>
        <input id="active-field" type="text" />
      </div>
    );
    expect(screen.getByText("Active")).toBeInTheDocument();
  });
});

// ─── 8. Peer-disabled state (peer-disabled:*) ────────────────────────────────

describe("Label — peer-disabled responsive classes", () => {
  it("has peer-disabled:cursor-not-allowed class defined", () => {
    const { container } = render(<Label>Test</Label>);
    expect(getLabel(container).className).toContain("peer-disabled:cursor-not-allowed");
  });

  it("has peer-disabled:opacity-50 class defined", () => {
    const { container } = render(<Label>Test</Label>);
    expect(getLabel(container).className).toContain("peer-disabled:opacity-50");
  });

  it("renders label after a disabled input (peer pattern) without crashing", () => {
    render(
      <div>
        <input
          id="disabled-field"
          type="text"
          disabled
          className="peer"
        />
        <Label htmlFor="disabled-field">Disabled field</Label>
      </div>
    );
    // The <label> must be present; runtime cursor/opacity is driven by Tailwind CSS
    expect(screen.getByText("Disabled field")).toBeInTheDocument();
  });

  it("renders label after an active input (peer pattern) without crashing", () => {
    render(
      <div>
        <input id="active" type="text" className="peer" />
        <Label htmlFor="active">Active field</Label>
      </div>
    );
    expect(screen.getByText("Active field")).toBeInTheDocument();
  });
});

// ─── 9. Click interaction — clicking label focuses associated input ────────────

describe("Label — click interaction", () => {
  it("clicking label focuses the associated input", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Label htmlFor="click-input">Click me</Label>
        <input id="click-input" type="text" />
      </div>
    );
    await user.click(screen.getByText("Click me"));
    expect(screen.getByRole("textbox")).toHaveFocus();
  });

  it("clicking label toggles associated checkbox", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <input id="chk" type="checkbox" />
        <Label htmlFor="chk">Notifications</Label>
      </div>
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
    await user.click(screen.getByText("Notifications"));
    expect(checkbox).toBeChecked();
    await user.click(screen.getByText("Notifications"));
    expect(checkbox).not.toBeChecked();
  });

  it("accepts and fires custom onClick handler", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Label onClick={handleClick}>Clickable label</Label>);
    await user.click(screen.getByText("Clickable label"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("fires onClick on multiple clicks", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Label onClick={handleClick}>Click</Label>);
    const el = screen.getByText("Click");
    await user.click(el);
    await user.click(el);
    await user.click(el);
    expect(handleClick).toHaveBeenCalledTimes(3);
  });
});

// ─── 10. Required-field pattern ───────────────────────────────────────────────

describe("Label — required field pattern", () => {
  it("renders required asterisk span inside label", () => {
    render(
      <Label htmlFor="req-name">
        Full name
        <span aria-hidden="true">*</span>
      </Label>
    );
    expect(screen.getByText("Full name")).toBeInTheDocument();
    // The asterisk is in the dom but hidden from AT
    const asterisk = screen.getByText("*");
    expect(asterisk).toHaveAttribute("aria-hidden", "true");
  });

  it("renders optional indicator span inside label", () => {
    render(
      <Label htmlFor="opt-website">
        Website
        <span>(optional)</span>
      </Label>
    );
    expect(screen.getByText("(optional)")).toBeInTheDocument();
  });

  it("label with required asterisk still associates with input via htmlFor", () => {
    // The input is associated with the label via htmlFor/id linkage.
    // We verify the association by querying the <label> element directly.
    render(
      <div>
        <Label htmlFor="req-email">
          Email
          <span aria-hidden="true">*</span>
        </Label>
        <input id="req-email" type="email" required />
      </div>
    );
    const label = screen.getByText("Email").closest("label");
    expect(label).toHaveAttribute("for", "req-email");
    expect(document.getElementById("req-email")).toBeInTheDocument();
  });
});

// ─── 11. Icon-inside-label pattern ────────────────────────────────────────────

describe("Label — with-icon pattern", () => {
  it("renders an icon node alongside text inside the label", () => {
    render(
      <Label htmlFor="username">
        <span data-testid="user-icon" aria-hidden="true">👤</span>
        Username
      </Label>
    );
    expect(screen.getByTestId("user-icon")).toBeInTheDocument();
    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  it("icon and text are both rendered as label children", () => {
    const { container } = render(
      <Label htmlFor="email-with-icon">
        <span data-testid="mail-icon" aria-hidden="true">✉</span>
        Email
      </Label>
    );
    const label = getLabel(container);
    expect(within(label).getByTestId("mail-icon")).toBeInTheDocument();
    expect(within(label).getByText("Email")).toBeInTheDocument();
  });

  it("icon renders inside gap-2 flex container (flex layout is present)", () => {
    const { container } = render(
      <Label htmlFor="search">
        <span data-testid="search-icon" aria-hidden="true">🔍</span>
        Search
      </Label>
    );
    const label = getLabel(container);
    expect(label).toHaveClass("flex");
    expect(label).toHaveClass("gap-2");
    expect(within(label).getByTestId("search-icon")).toBeInTheDocument();
  });
});

// ─── 12. Error-state pattern ──────────────────────────────────────────────────

describe("Label — error / success state patterns", () => {
  it("renders with text-destructive className for error state", () => {
    const { container } = render(
      <Label htmlFor="err-email" className="text-destructive">
        Email address
      </Label>
    );
    expect(getLabel(container)).toHaveClass("text-destructive");
  });

  it("renders error icon and text-destructive together", () => {
    render(
      <Label htmlFor="err-username" className="text-destructive">
        <span data-testid="err-icon" aria-hidden="true">⚠</span>
        Username
      </Label>
    );
    const label = screen.getByText("Username").closest("label");
    expect(label).toHaveClass("text-destructive");
    expect(screen.getByTestId("err-icon")).toBeInTheDocument();
  });

  it("renders with a green success className", () => {
    const { container } = render(
      <Label htmlFor="ok-website" className="text-green-600">
        Website
      </Label>
    );
    expect(getLabel(container)).toHaveClass("text-green-600");
  });

  it("base classes remain present in error state (class merge)", () => {
    const { container } = render(
      <Label htmlFor="error" className="text-destructive">
        Email
      </Label>
    );
    const el = getLabel(container);
    expect(el).toHaveClass("text-destructive");
    expect(el).toHaveClass("text-sm"); // base class still present
    expect(el).toHaveClass("font-medium");
  });
});

// ─── 13. Disabled-state pattern (with-checkbox) ───────────────────────────────

describe("Label — disabled checkbox pattern", () => {
  it("renders label for disabled checkbox without crashing", () => {
    render(
      <div>
        <input id="security" type="checkbox" disabled className="peer" />
        <Label htmlFor="security" className="cursor-not-allowed">
          Security alerts
        </Label>
      </div>
    );
    expect(screen.getByText("Security alerts")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("label for disabled checkbox has cursor-not-allowed class", () => {
    const { container } = render(
      <Label htmlFor="sec-chk" className="cursor-not-allowed">
        Security alerts
      </Label>
    );
    expect(getLabel(container)).toHaveClass("cursor-not-allowed");
  });
});

// ─── 14. Form-layout patterns ─────────────────────────────────────────────────

describe("Label — form-layout patterns", () => {
  it("stacked layout: label above input renders correctly", () => {
    render(
      <div>
        <Label htmlFor="stacked">Display name</Label>
        <input id="stacked" type="text" />
      </div>
    );
    expect(screen.getByLabelText("Display name")).toBeInTheDocument();
  });

  it("inline layout: label with w-28 text-right className", () => {
    const { container } = render(
      <Label htmlFor="inline-country" className="w-28 shrink-0 text-right">
        Country
      </Label>
    );
    const el = getLabel(container);
    expect(el).toHaveClass("w-28");
    expect(el).toHaveClass("text-right");
  });

  it("renders multiple labels in a form without conflict", () => {
    render(
      <form>
        <Label htmlFor="f-name">Name</Label>
        <input id="f-name" type="text" />
        <Label htmlFor="f-email">Email</Label>
        <input id="f-email" type="email" />
        <Label htmlFor="f-bio">Bio</Label>
        <textarea id="f-bio" />
      </form>
    );
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Bio")).toBeInTheDocument();
  });
});

// ─── 15. Ref forwarding ────────────────────────────────────────────────────────

describe("Label — ref forwarding", () => {
  it("forwards ref to the underlying <label> element", () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Ref test</Label>);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("LABEL");
  });

  it("ref.current matches the rendered label element", () => {
    const ref = React.createRef<HTMLLabelElement>();
    const { container } = render(<Label ref={ref}>Ref match</Label>);
    expect(ref.current).toBe(getLabel(container));
  });
});

// ─── 16. Native HTML attribute pass-through ───────────────────────────────────

describe("Label — native attribute pass-through", () => {
  it("passes aria-label through", () => {
    const { container } = render(
      <Label aria-label="Hidden label name">Visible text</Label>
    );
    expect(getLabel(container)).toHaveAttribute("aria-label", "Hidden label name");
  });

  it("passes data-* attributes through", () => {
    const { container } = render(
      <Label data-testid="custom-label">Test</Label>
    );
    expect(screen.getByTestId("custom-label")).toBeInTheDocument();
  });

  it("passes tabIndex through", () => {
    const { container } = render(<Label tabIndex={0}>Focusable label</Label>);
    expect(getLabel(container)).toHaveAttribute("tabIndex", "0");
  });

  it("passes style prop through", () => {
    const { container } = render(
      <Label style={{ color: "rgb(255, 0, 0)" }}>Styled</Label>
    );
    // jsdom normalizes color keywords to rgb(); use the rgb form directly
    expect(getLabel(container)).toHaveStyle({ color: "rgb(255, 0, 0)" });
  });

  it("passes role prop through", () => {
    const { container } = render(
      <Label role="presentation">Decorative</Label>
    );
    expect(getLabel(container)).toHaveAttribute("role", "presentation");
  });

  it("passes form attribute through", () => {
    const { container } = render(
      <Label htmlFor="outside-input" form="my-form">
        Outside input
      </Label>
    );
    expect(getLabel(container)).toHaveAttribute("form", "my-form");
  });
});

// ─── 17. Re-render / prop updates ─────────────────────────────────────────────

describe("Label — re-render / prop update behavior", () => {
  it("updates text content on re-render", () => {
    const { rerender } = render(<Label>Initial text</Label>);
    expect(screen.getByText("Initial text")).toBeInTheDocument();
    rerender(<Label>Updated text</Label>);
    expect(screen.getByText("Updated text")).toBeInTheDocument();
    expect(screen.queryByText("Initial text")).not.toBeInTheDocument();
  });

  it("updates htmlFor on re-render", () => {
    const { rerender, container } = render(
      <Label htmlFor="first">First</Label>
    );
    expect(getLabel(container)).toHaveAttribute("for", "first");
    rerender(<Label htmlFor="second">Second</Label>);
    expect(getLabel(container)).toHaveAttribute("for", "second");
  });

  it("updates className on re-render", () => {
    const { rerender, container } = render(
      <Label className="text-foreground">Field</Label>
    );
    expect(getLabel(container)).toHaveClass("text-foreground");
    rerender(<Label className="text-destructive">Field</Label>);
    expect(getLabel(container)).toHaveClass("text-destructive");
  });

  it("adds children on re-render from empty to populated", () => {
    const { rerender } = render(<Label />);
    rerender(<Label>Now has text</Label>);
    expect(screen.getByText("Now has text")).toBeInTheDocument();
  });
});

// ─── 18. Wrapping / nesting patterns ─────────────────────────────────────────

describe("Label — wrapping / nesting patterns", () => {
  it("renders correctly with an input wrapped inside the label", () => {
    render(
      <Label>
        <input type="checkbox" aria-label="Accept terms" />
        Accept terms
      </Label>
    );
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByText("Accept terms")).toBeInTheDocument();
  });

  it("implicit label association (input nested inside label)", () => {
    render(
      <Label>
        Newsletter
        <input type="checkbox" />
      </Label>
    );
    // The label text is accessible
    expect(screen.getByText("Newsletter")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("renders correctly inside a fieldset", () => {
    render(
      <fieldset>
        <legend>Personal info</legend>
        <Label htmlFor="fs-name">Name</Label>
        <input id="fs-name" type="text" />
      </fieldset>
    );
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("renders correctly inside a <form>", () => {
    render(
      <form>
        <Label htmlFor="form-name">Name</Label>
        <input id="form-name" type="text" />
      </form>
    );
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("renders correctly inside a <div> wrapper", () => {
    render(
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="div-name">Display name</Label>
        <input id="div-name" type="text" />
      </div>
    );
    expect(screen.getByLabelText("Display name")).toBeInTheDocument();
  });
});

// ─── 19. Multiple labels in the same tree ─────────────────────────────────────

describe("Label — multiple labels in same render tree", () => {
  it("renders multiple independent labels without interference", () => {
    render(
      <div>
        <Label htmlFor="a">Label A</Label>
        <Label htmlFor="b">Label B</Label>
        <Label htmlFor="c">Label C</Label>
      </div>
    );
    expect(screen.getByText("Label A")).toBeInTheDocument();
    expect(screen.getByText("Label B")).toBeInTheDocument();
    expect(screen.getByText("Label C")).toBeInTheDocument();
  });

  it("each label has its own data-slot attribute", () => {
    const { container } = render(
      <div>
        <Label>First</Label>
        <Label>Second</Label>
      </div>
    );
    const labels = container.querySelectorAll("label");
    labels.forEach((label) => {
      expect(label).toHaveAttribute("data-slot", "label");
    });
  });

  it("each label's htmlFor targets the right input", () => {
    render(
      <div>
        <Label htmlFor="i1">Name</Label>
        <input id="i1" type="text" aria-label="Name" />
        <Label htmlFor="i2">Email</Label>
        <input id="i2" type="email" aria-label="Email" />
      </div>
    );
    const labels = screen.getAllByRole("generic");
    // The labels are <label> elements (generic role) → verify by text
    expect(screen.getByText("Name")).toHaveAttribute("for", "i1");
    expect(screen.getByText("Email")).toHaveAttribute("for", "i2");
  });
});

// ─── 20. Edge cases ────────────────────────────────────────────────────────────

describe("Label — edge cases", () => {
  it("renders with empty string children without crashing", () => {
    const { container } = render(<Label>{""}</Label>);
    expect(getLabel(container)).toBeInTheDocument();
  });

  it("renders with undefined children without crashing", () => {
    const { container } = render(<Label>{undefined}</Label>);
    expect(getLabel(container)).toBeInTheDocument();
  });

  it("renders with null children without crashing", () => {
    const { container } = render(<Label>{null}</Label>);
    expect(getLabel(container)).toBeInTheDocument();
  });

  it("renders with very long text without crashing", () => {
    const longText = "A".repeat(300);
    render(<Label htmlFor="long">{longText}</Label>);
    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  it("renders with special characters in text", () => {
    render(<Label>{"<>&\"'"}</Label>);
    expect(screen.getByText("<>&\"'")).toBeInTheDocument();
  });

  it("renders with numeric children", () => {
    render(<Label>{42}</Label>);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders with deeply nested children", () => {
    render(
      <Label>
        <span>
          <strong>
            <em>Deep nested</em>
          </strong>
        </span>
      </Label>
    );
    expect(screen.getByText("Deep nested")).toBeInTheDocument();
  });

  it("renders with multiple text nodes and elements", () => {
    render(
      <Label>
        Field
        <span aria-hidden="true">*</span>
        <span>(required)</span>
      </Label>
    );
    expect(screen.getByText("Field")).toBeInTheDocument();
    expect(screen.getByText("*")).toBeInTheDocument();
    expect(screen.getByText("(required)")).toBeInTheDocument();
  });

  it("renders multiple instances with different props independently", () => {
    const { container } = render(
      <div>
        <Label htmlFor="a" className="text-destructive">Error label</Label>
        <Label htmlFor="b" className="text-green-600">Success label</Label>
        <Label htmlFor="c">Default label</Label>
      </div>
    );
    const labels = container.querySelectorAll("label");
    expect(labels).toHaveLength(3);
    expect(labels[0]).toHaveClass("text-destructive");
    expect(labels[1]).toHaveClass("text-green-600");
    // Third label has no color override
    expect(labels[2]).not.toHaveClass("text-destructive");
    expect(labels[2]).not.toHaveClass("text-green-600");
  });
});

// ─── 21. Accessibility — axe violations ───────────────────────────────────────

describe("Label — accessibility (axe)", () => {
  it("has no axe violations (default render with associated input)", async () => {
    const { container } = render(
      <div>
        <Label htmlFor="axe-name">Full name</Label>
        <input id="axe-name" type="text" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations (label for email input)", async () => {
    const { container } = render(
      <div>
        <Label htmlFor="axe-email">Email address</Label>
        <input id="axe-email" type="email" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations (label for checkbox with cursor-pointer)", async () => {
    const { container } = render(
      <div>
        <input id="axe-chk" type="checkbox" />
        <Label htmlFor="axe-chk" className="cursor-pointer">
          Notifications
        </Label>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations (label for textarea)", async () => {
    const { container } = render(
      <div>
        <Label htmlFor="axe-bio">Bio</Label>
        <textarea id="axe-bio" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations (required indicator with aria-hidden asterisk)", async () => {
    const { container } = render(
      <div>
        <Label htmlFor="axe-req">
          Full name
          <span aria-hidden="true">*</span>
        </Label>
        <input id="axe-req" type="text" required />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations (icon inside label with aria-hidden icon)", async () => {
    const { container } = render(
      <div>
        <Label htmlFor="axe-username">
          <span aria-hidden="true">👤</span>
          Username
        </Label>
        <input id="axe-username" type="text" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations (error state with text-destructive)", async () => {
    const { container } = render(
      <div>
        <Label htmlFor="axe-err" className="text-destructive">
          Email address
        </Label>
        <input id="axe-err" type="email" aria-invalid="true" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations (label for disabled checkbox)", async () => {
    const { container } = render(
      <div>
        <input id="axe-dis-chk" type="checkbox" disabled />
        <Label htmlFor="axe-dis-chk" className="cursor-not-allowed">
          Security alerts
        </Label>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations (inline layout with text-right)", async () => {
    const { container } = render(
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Label htmlFor="axe-inline" className="w-28 shrink-0 text-right">
          Country
        </Label>
        <input id="axe-inline" type="text" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations (form with multiple labels and inputs)", async () => {
    const { container } = render(
      <form>
        <div>
          <Label htmlFor="axe-fn">First name</Label>
          <input id="axe-fn" type="text" />
        </div>
        <div>
          <Label htmlFor="axe-ln">Last name</Label>
          <input id="axe-ln" type="text" />
        </div>
        <div>
          <Label htmlFor="axe-em">Email</Label>
          <input id="axe-em" type="email" />
        </div>
      </form>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations (label wrapping a checkbox — implicit association)", async () => {
    const { container } = render(
      <Label>
        <input type="checkbox" />
        Accept terms
      </Label>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations when used inside a fieldset/legend context", async () => {
    const { container } = render(
      <fieldset>
        <legend>Account details</legend>
        <div>
          <Label htmlFor="axe-fs-name">Name</Label>
          <input id="axe-fs-name" type="text" />
        </div>
      </fieldset>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
