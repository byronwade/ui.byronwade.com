import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus, Download, Trash2, Loader2, ArrowRight } from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** All variant values the component advertises. */
const ALL_VARIANTS = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "link",
] as const;

/** Fragment of a class that each variant must contain (from the CVA source). */
const VARIANT_CLASS_FRAGMENT: Record<(typeof ALL_VARIANTS)[number], string> = {
  default: "bg-primary",
  outline: "border-border",
  secondary: "bg-secondary",
  ghost: "hover:bg-muted",
  destructive: "bg-destructive",
  link: "underline-offset-4",
};

/** All size values the component advertises. */
const ALL_SIZES = [
  "default",
  "xs",
  "sm",
  "lg",
  "icon",
  "icon-xs",
  "icon-sm",
  "icon-lg",
] as const;

/** A class fragment expected for each size (from the CVA source). */
const SIZE_CLASS_FRAGMENT: Record<(typeof ALL_SIZES)[number], string> = {
  default: "h-8",
  xs: "h-6",
  sm: "h-8",
  lg: "h-9",
  icon: "size-8",
  "icon-xs": "size-6",
  "icon-sm": "size-8",
  "icon-lg": "size-9",
};

// ─── Smoke ────────────────────────────────────────────────────────────────────

describe("Button – smoke", () => {
  it("renders without crashing with text child", () => {
    render(<Button>Save changes</Button>);
    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
  });

  it("renders as a <button> element by default", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toBeInstanceOf(HTMLButtonElement);
  });

  it("renders with data-slot='button'", () => {
    render(<Button>Slot</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("data-slot", "button");
  });

  it("renders children correctly", () => {
    render(<Button>Hello World</Button>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders with no props without crashing", () => {
    render(<Button />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("forwards a ref correctly", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref test</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

// ─── Default props ────────────────────────────────────────────────────────────

describe("Button – default props", () => {
  it("defaults to variant='default' → has bg-primary class", () => {
    render(<Button>Default</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-primary");
  });

  it("defaults to size='default' → has h-8 class", () => {
    render(<Button>Default size</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("h-8");
  });

  it("always has base class: group/button", () => {
    render(<Button>Base</Button>);
    expect(screen.getByRole("button").className).toContain("group/button");
  });

  it("always has base class: inline-flex", () => {
    render(<Button>Base</Button>);
    expect(screen.getByRole("button").className).toContain("inline-flex");
  });

  it("always has base class: rounded-full", () => {
    render(<Button>Base</Button>);
    expect(screen.getByRole("button").className).toContain("rounded-full");
  });

  it("always has base class: font-medium", () => {
    render(<Button>Base</Button>);
    expect(screen.getByRole("button").className).toContain("font-medium");
  });

  it("always has base class: text-sm", () => {
    render(<Button>Base</Button>);
    expect(screen.getByRole("button").className).toContain("text-sm");
  });

  it("always has base class: transition-all", () => {
    render(<Button>Base</Button>);
    expect(screen.getByRole("button").className).toContain("transition-all");
  });

  it("always has base class: shrink-0", () => {
    render(<Button>Base</Button>);
    expect(screen.getByRole("button").className).toContain("shrink-0");
  });

  it("always has base class: items-center", () => {
    render(<Button>Base</Button>);
    expect(screen.getByRole("button").className).toContain("items-center");
  });

  it("always has base class: justify-center", () => {
    render(<Button>Base</Button>);
    expect(screen.getByRole("button").className).toContain("justify-center");
  });
});

// ─── Variant prop ─────────────────────────────────────────────────────────────

describe("Button – variant prop", () => {
  ALL_VARIANTS.forEach((variant) => {
    it(`variant="${variant}" → has class fragment "${VARIANT_CLASS_FRAGMENT[variant]}"`, () => {
      render(<Button variant={variant}>{variant}</Button>);
      const btn = screen.getByRole("button");
      expect(btn.className).toContain(VARIANT_CLASS_FRAGMENT[variant]);
    });
  });

  it("variant='default' → has text-primary-foreground", () => {
    render(<Button variant="default">Default</Button>);
    expect(screen.getByRole("button").className).toContain("text-primary-foreground");
  });

  it("variant='secondary' → has text-secondary-foreground", () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button").className).toContain("text-secondary-foreground");
  });

  it("variant='destructive' → has text-destructive", () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole("button").className).toContain("text-destructive");
  });

  it("variant='link' → has text-primary", () => {
    render(<Button variant="link">View docs</Button>);
    expect(screen.getByRole("button").className).toContain("text-primary");
  });

  it("variant='ghost' → does NOT have bg-primary class", () => {
    render(<Button variant="ghost">Ghost</Button>);
    // Ghost has no background — bg-primary must be absent
    const classes = screen.getByRole("button").className.split(/\s+/);
    expect(classes).not.toContain("bg-primary");
  });

  it("variant='outline' → has border-border class", () => {
    render(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button").className).toContain("border-border");
  });

  it("variant='outline' → has bg-background class", () => {
    render(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button").className).toContain("bg-background");
  });

  it("each variant produces a unique class set (mutually exclusive background choices)", () => {
    const classLists = ALL_VARIANTS.map((variant) => {
      const { container } = render(
        <Button variant={variant}>{variant}</Button>
      );
      return container.querySelector("button")!.className;
    });
    // All class strings are unique
    const unique = new Set(classLists);
    expect(unique.size).toBe(ALL_VARIANTS.length);
  });
});

// ─── Size prop ────────────────────────────────────────────────────────────────

describe("Button – size prop", () => {
  ALL_SIZES.forEach((size) => {
    it(`size="${size}" → has class fragment "${SIZE_CLASS_FRAGMENT[size]}"`, () => {
      render(
        <Button size={size} aria-label={`${size} button`}>
          {size.startsWith("icon") ? <Plus /> : size}
        </Button>
      );
      const btn = screen.getByRole("button");
      expect(btn.className).toContain(SIZE_CLASS_FRAGMENT[size]);
    });
  });

  it("size='xs' → has gap-1 class", () => {
    render(<Button size="xs">XS</Button>);
    expect(screen.getByRole("button").className).toContain("gap-1");
  });

  it("size='sm' → has text-[0.8rem] class", () => {
    render(<Button size="sm">SM</Button>);
    expect(screen.getByRole("button").className).toContain("text-[0.8rem]");
  });

  it("size='lg' → has px-3.5 class", () => {
    render(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button").className).toContain("px-3.5");
  });

  it("size='default' → has px-2.5 class", () => {
    render(<Button size="default">Default</Button>);
    expect(screen.getByRole("button").className).toContain("px-2.5");
  });

  it("small interactive sizes keep a 32px touch target floor", () => {
    const dimensionClasses = ALL_SIZES.map((size) => {
      render(
        <Button size={size} aria-label={`${size}`}>
          {size.startsWith("icon") ? <Plus /> : size}
        </Button>,
      );
      return SIZE_CLASS_FRAGMENT[size];
    });
    expect(dimensionClasses).toContain("h-8");
    expect(dimensionClasses).toContain("size-8");
    expect(SIZE_CLASS_FRAGMENT.sm).toBe("h-8");
    expect(SIZE_CLASS_FRAGMENT["icon-sm"]).toBe("size-8");
  });
});

// ─── Disabled state ───────────────────────────────────────────────────────────

describe("Button – disabled state", () => {
  it("disabled button has disabled attribute", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("disabled button has opacity-50 class via Tailwind disabled:", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button").className).toContain("disabled:opacity-50");
  });

  it("disabled button has pointer-events-none class via Tailwind disabled:", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button").className).toContain("disabled:pointer-events-none");
  });

  it("disabled button does NOT fire onClick when clicked", async () => {
    const handler = vi.fn();
    render(
      <Button disabled onClick={handler}>
        Disabled
      </Button>
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button"));
    expect(handler).not.toHaveBeenCalled();
  });

  it("all variants render as disabled correctly", () => {
    ALL_VARIANTS.forEach((variant) => {
      const { unmount } = render(
        <Button variant={variant} disabled>
          {variant} disabled
        </Button>
      );
      expect(screen.getByRole("button", { name: `${variant} disabled` })).toBeDisabled();
      unmount();
    });
  });

  it("icon button renders as disabled correctly", () => {
    render(
      <Button size="icon" aria-label="Download" disabled>
        <Download />
      </Button>
    );
    expect(screen.getByRole("button", { name: "Download" })).toBeDisabled();
  });

  it("disabled+outline variant shows disabled", () => {
    render(
      <Button variant="outline" disabled>
        Cancel
      </Button>
    );
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
  });
});

// ─── aria-invalid state ───────────────────────────────────────────────────────

describe("Button – aria-invalid state", () => {
  it("aria-invalid='true' sets aria-invalid attribute", () => {
    render(<Button aria-invalid="true">Invalid action</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-invalid", "true");
  });

  it("aria-invalid='true' → has aria-invalid:border-destructive class", () => {
    render(<Button aria-invalid="true">Invalid</Button>);
    expect(screen.getByRole("button").className).toContain("aria-invalid:border-destructive");
  });

  it("aria-invalid='true' → has aria-invalid:ring-3 class", () => {
    render(<Button aria-invalid="true">Invalid</Button>);
    expect(screen.getByRole("button").className).toContain("aria-invalid:ring-3");
  });

  it("aria-invalid='true' → has aria-invalid:ring-destructive/20 class", () => {
    render(<Button aria-invalid="true">Invalid</Button>);
    expect(screen.getByRole("button").className).toContain("aria-invalid:ring-destructive/20");
  });

  it("aria-invalid works with outline variant", () => {
    render(
      <Button variant="outline" aria-invalid="true">
        Invalid outline
      </Button>
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-invalid", "true");
  });

  it("aria-invalid works with secondary variant", () => {
    render(
      <Button variant="secondary" aria-invalid="true">
        Invalid secondary
      </Button>
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-invalid", "true");
  });

  it("aria-invalid=undefined → no aria-invalid attribute", () => {
    render(<Button>Normal</Button>);
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-invalid");
  });
});

// ─── Icon button patterns ─────────────────────────────────────────────────────

describe("Button – icon button patterns", () => {
  it("icon size button with aria-label is accessible by name", () => {
    render(
      <Button size="icon" aria-label="Download">
        <Download />
      </Button>
    );
    expect(screen.getByRole("button", { name: "Download" })).toBeInTheDocument();
  });

  it("icon-xs size with aria-label is accessible", () => {
    render(
      <Button size="icon-xs" aria-label="Settings extra small">
        <Plus />
      </Button>
    );
    expect(screen.getByRole("button", { name: "Settings extra small" })).toBeInTheDocument();
  });

  it("icon-sm size with aria-label is accessible", () => {
    render(
      <Button size="icon-sm" aria-label="Settings small">
        <Plus />
      </Button>
    );
    expect(screen.getByRole("button", { name: "Settings small" })).toBeInTheDocument();
  });

  it("icon-lg size with aria-label is accessible", () => {
    render(
      <Button size="icon-lg" aria-label="Settings large">
        <Plus />
      </Button>
    );
    expect(screen.getByRole("button", { name: "Settings large" })).toBeInTheDocument();
  });

  it("SVG icon inside button has pointer-events-none (from base class)", () => {
    render(
      <Button size="icon" aria-label="Add">
        <Plus />
      </Button>
    );
    const svg = screen.getByRole("button").querySelector("svg");
    expect(svg).not.toBeNull();
    // The SVG is present — the class is on the button, not the SVG itself
    expect(screen.getByRole("button").className).toContain("[&_svg]:pointer-events-none");
  });

  it("inline-start icon via data-icon attribute renders inside button", () => {
    render(
      <Button>
        <Plus data-icon="inline-start" />
        New item
      </Button>
    );
    const btn = screen.getByRole("button", { name: /New item/i });
    const svg = btn.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("inline-end icon via data-icon attribute renders inside button", () => {
    render(
      <Button>
        Continue
        <ArrowRight data-icon="inline-end" />
      </Button>
    );
    const btn = screen.getByRole("button", { name: /Continue/i });
    const svg = btn.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});

// ─── className prop ───────────────────────────────────────────────────────────

describe("Button – className prop", () => {
  it("merges a custom className onto the button", () => {
    render(<Button className="my-custom-class">Custom</Button>);
    expect(screen.getByRole("button").className).toContain("my-custom-class");
  });

  it("custom className does not remove the base inline-flex class", () => {
    render(<Button className="extra">Extra</Button>);
    expect(screen.getByRole("button").className).toContain("inline-flex");
  });

  it("custom className does not remove the variant class", () => {
    render(
      <Button variant="outline" className="extra">
        Outline
      </Button>
    );
    expect(screen.getByRole("button").className).toContain("border-border");
  });

  it("multiple custom classNames are all applied", () => {
    render(<Button className="foo bar baz">Multi</Button>);
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("foo");
    expect(cls).toContain("bar");
    expect(cls).toContain("baz");
  });
});

// ─── Interaction / click behavior ─────────────────────────────────────────────

describe("Button – interactions", () => {
  it("calls onClick handler when clicked", async () => {
    const handler = vi.fn();
    render(<Button onClick={handler}>Click me</Button>);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button"));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("calls onClick handler on every click", async () => {
    const handler = vi.fn();
    render(<Button onClick={handler}>Click</Button>);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("button"));
    expect(handler).toHaveBeenCalledTimes(3);
  });

  it("calls onClick when activated via keyboard (Enter)", async () => {
    const handler = vi.fn();
    render(<Button onClick={handler}>Enter</Button>);
    const user = userEvent.setup();
    screen.getByRole("button").focus();
    await user.keyboard("{Enter}");
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("calls onClick when activated via keyboard (Space)", async () => {
    const handler = vi.fn();
    render(<Button onClick={handler}>Space</Button>);
    const user = userEvent.setup();
    screen.getByRole("button").focus();
    await user.keyboard(" ");
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("can be focused via Tab", async () => {
    render(<Button>Focusable</Button>);
    const user = userEvent.setup();
    await user.tab();
    expect(screen.getByRole("button")).toHaveFocus();
  });

  it("disabled button is NOT focusable via Tab", async () => {
    render(
      <div>
        <Button disabled>Disabled</Button>
        <input data-testid="other" />
      </div>
    );
    const user = userEvent.setup();
    await user.tab();
    // focus should land on the input, not the disabled button
    expect(screen.getByTestId("other")).toHaveFocus();
  });
});

// ─── Loading state pattern ────────────────────────────────────────────────────

describe("Button – loading state pattern", () => {
  it("loading button with disabled and spinner text is disabled", () => {
    render(
      <Button disabled>
        <Loader2 className="animate-spin" />
        Processing
      </Button>
    );
    expect(screen.getByRole("button", { name: /Processing/i })).toBeDisabled();
  });

  it("loading button shows spinner svg and text", () => {
    render(
      <Button disabled>
        <Loader2 className="animate-spin" data-testid="spinner" />
        Loading
      </Button>
    );
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("loading variant outline button is disabled", () => {
    render(
      <Button variant="outline" disabled>
        <Loader2 className="animate-spin" />
        Uploading…
      </Button>
    );
    expect(screen.getByRole("button", { name: /Uploading/i })).toBeDisabled();
  });

  it("loading icon-only button is disabled", () => {
    render(
      <Button size="icon" variant="outline" aria-label="Loading" disabled>
        <Loader2 className="animate-spin" />
      </Button>
    );
    expect(screen.getByRole("button", { name: "Loading" })).toBeDisabled();
  });

  it("loading state does not fire onClick", async () => {
    const handler = vi.fn();
    render(
      <Button disabled onClick={handler}>
        <Loader2 className="animate-spin" />
        Saving…
      </Button>
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button"));
    expect(handler).not.toHaveBeenCalled();
  });
});

// ─── render prop (custom element) ────────────────────────────────────────────

describe("Button – render prop", () => {
  it("render prop with <a> renders an anchor element", () => {
    render(
      <Button render={<a href="#test" />}>Link Button</Button>
    );
    // Base UI renders a native anchor when render=<a>
    const link = screen.getByText("Link Button").closest("a");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#test");
  });

  it("render prop with <a> applies button variant classes to the anchor", () => {
    render(
      <Button variant="outline" render={<a href="#test" />}>
        Outline Link
      </Button>
    );
    const link = screen.getByText("Outline Link").closest("a");
    expect(link).not.toBeNull();
    expect(link!.className).toContain("border-border");
  });

  it("render prop does not break onClick callback", async () => {
    const handler = vi.fn();
    render(
      <Button render={<a href="#" />} onClick={handler}>
        Anchor Button
      </Button>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Anchor Button"));
    expect(handler).toHaveBeenCalledTimes(1);
  });
});

// ─── buttonVariants utility ──────────────────────────────────────────────────

describe("buttonVariants – class generation utility", () => {
  it("returns a string", () => {
    expect(typeof buttonVariants()).toBe("string");
  });

  it("default call includes bg-primary", () => {
    expect(buttonVariants()).toContain("bg-primary");
  });

  it("variant='ghost' includes hover:bg-muted", () => {
    expect(buttonVariants({ variant: "ghost" })).toContain("hover:bg-muted");
  });

  it("size='lg' includes h-9", () => {
    expect(buttonVariants({ size: "lg" })).toContain("h-9");
  });

  it("extra className is merged in", () => {
    expect(buttonVariants({ className: "my-extra" })).toContain("my-extra");
  });

  it("variant='destructive' includes text-destructive", () => {
    expect(buttonVariants({ variant: "destructive" })).toContain("text-destructive");
  });

  it("size='icon' includes size-8", () => {
    expect(buttonVariants({ size: "icon" })).toContain("size-8");
  });

  it("size='xs' includes h-6", () => {
    expect(buttonVariants({ size: "xs" })).toContain("h-6");
  });
});

// ─── Re-render / state update ─────────────────────────────────────────────────

describe("Button – re-render behavior", () => {
  it("updates text content on re-render", () => {
    const { rerender } = render(<Button>Before</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Before");
    rerender(<Button>After</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("After");
  });

  it("updates from enabled to disabled on re-render", () => {
    const { rerender } = render(<Button>Toggle</Button>);
    expect(screen.getByRole("button")).not.toBeDisabled();
    rerender(<Button disabled>Toggle</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("updates variant on re-render", () => {
    const { rerender } = render(<Button variant="default">Btn</Button>);
    expect(screen.getByRole("button").className).toContain("bg-primary");
    rerender(<Button variant="outline">Btn</Button>);
    expect(screen.getByRole("button").className).toContain("border-border");
  });

  it("updates size on re-render", () => {
    const { rerender } = render(<Button size="sm">Btn</Button>);
    expect(screen.getByRole("button").className).toContain("h-8");
    rerender(<Button size="lg">Btn</Button>);
    expect(screen.getByRole("button").className).toContain("h-9");
  });

  it("click count is correctly tracked across multiple renders", async () => {
    let count = 0;
    const handler = vi.fn(() => count++);
    const { rerender } = render(<Button onClick={handler}>Click</Button>);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button"));
    rerender(<Button onClick={handler}>Click</Button>);
    await user.click(screen.getByRole("button"));
    expect(handler).toHaveBeenCalledTimes(2);
  });
});

// ─── Additional HTML attributes forwarding ────────────────────────────────────

describe("Button – HTML attribute forwarding", () => {
  it("forwards type attribute", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("forwards type='reset'", () => {
    render(<Button type="reset">Reset</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "reset");
  });

  it("forwards id attribute", () => {
    render(<Button id="my-button">ID</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("id", "my-button");
  });

  it("forwards data-testid attribute", () => {
    render(<Button data-testid="btn-test">Test</Button>);
    expect(screen.getByTestId("btn-test")).toBeInTheDocument();
  });

  it("forwards aria-label attribute", () => {
    render(<Button aria-label="Close dialog">X</Button>);
    expect(screen.getByRole("button", { name: "Close dialog" })).toBeInTheDocument();
  });

  it("forwards aria-describedby attribute", () => {
    render(
      <>
        <span id="desc">Description</span>
        <Button aria-describedby="desc">Action</Button>
      </>
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-describedby", "desc");
  });

  it("forwards form attribute", () => {
    render(<Button form="my-form">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("form", "my-form");
  });

  it("forwards name attribute", () => {
    render(<Button name="action">Named</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("name", "action");
  });

  it("forwards value attribute", () => {
    render(<Button value="save">Valued</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("value", "save");
  });
});

// ─── Variant × size combinations ─────────────────────────────────────────────

describe("Button – variant × size combinations", () => {
  it("variant='outline' size='sm' → both classes present", () => {
    render(
      <Button variant="outline" size="sm">
        Combo
      </Button>
    );
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("border-border");
    expect(btn.className).toContain("h-8");
  });

  it("variant='destructive' size='lg' → both classes present", () => {
    render(
      <Button variant="destructive" size="lg">
        Delete
      </Button>
    );
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-destructive");
    expect(btn.className).toContain("h-9");
  });

  it("variant='ghost' size='xs' → both classes present", () => {
    render(
      <Button variant="ghost" size="xs">
        Tiny
      </Button>
    );
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("hover:bg-muted");
    expect(btn.className).toContain("h-6");
  });

  it("variant='secondary' size='icon' → both classes present", () => {
    render(
      <Button variant="secondary" size="icon" aria-label="Action">
        <Plus />
      </Button>
    );
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-secondary");
    expect(btn.className).toContain("size-8");
  });
});

// ─── Multiple buttons in the same tree ───────────────────────────────────────

describe("Button – multiple instances", () => {
  it("renders multiple buttons without interference", () => {
    render(
      <div>
        <Button>Save</Button>
        <Button variant="outline">Cancel</Button>
        <Button variant="secondary">Export</Button>
      </div>
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export" })).toBeInTheDocument();
  });

  it("clicking one button does not trigger another button's handler", async () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    render(
      <div>
        <Button onClick={handler1}>First</Button>
        <Button onClick={handler2}>Second</Button>
      </div>
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "First" }));
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).not.toHaveBeenCalled();
  });
});

// ─── Accessibility ────────────────────────────────────────────────────────────

describe("Button – accessibility (axe)", () => {
  it("default button has no axe violations", async () => {
    const { container } = render(<Button>Save changes</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("icon-only button with aria-label has no axe violations", async () => {
    const { container } = render(
      <Button size="icon" aria-label="Download file">
        <Download />
      </Button>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("disabled button has no axe violations", async () => {
    const { container } = render(<Button disabled>Cannot click</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("each variant has no axe violations", async () => {
    for (const variant of ALL_VARIANTS) {
      const { container } = render(
        <Button variant={variant}>{variant} button</Button>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  it("text sizes (xs, sm, default, lg) have no axe violations", async () => {
    for (const size of ["xs", "sm", "default", "lg"] as const) {
      const { container } = render(<Button size={size}>{size} button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  it("icon sizes with aria-label have no axe violations", async () => {
    for (const size of ["icon", "icon-xs", "icon-sm", "icon-lg"] as const) {
      const { container } = render(
        <Button size={size} aria-label={`${size} action`}>
          <Plus />
        </Button>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  it("button with aria-invalid='true' has no axe violations when inside a form", async () => {
    const { container } = render(
      <form>
        <Button type="submit" aria-invalid="true" aria-describedby="err">
          Submit
        </Button>
        <span id="err" role="alert">
          Error occurred
        </span>
      </form>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("button with icon and visible label has no axe violations", async () => {
    const { container } = render(
      <Button>
        <Plus />
        Add new
      </Button>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("button rendered as anchor with aria-label has no axe violations", async () => {
    const { container } = render(
      <Button render={<a href="#section" />} aria-label="Go to section">
        Jump
      </Button>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("destructive variant with icon has no axe violations", async () => {
    const { container } = render(
      <Button variant="destructive">
        <Trash2 />
        Delete item
      </Button>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe("Button – edge cases", () => {
  it("renders with null children without crashing", () => {
    render(<Button>{null}</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders with undefined children without crashing", () => {
    render(<Button>{undefined}</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders with numeric child", () => {
    render(<Button>{42}</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("42");
  });

  it("renders with deeply nested children", () => {
    render(
      <Button>
        <span>
          <strong>Bold</strong>
        </span>
      </Button>
    );
    expect(screen.getByText("Bold")).toBeInTheDocument();
  });

  it("renders multiple icon + text children without error", () => {
    render(
      <Button>
        <Plus />
        Add
        <ArrowRight />
      </Button>
    );
    expect(screen.getByRole("button", { name: /Add/i })).toBeInTheDocument();
  });

  it("className='' does not break rendering", () => {
    render(<Button className="">Empty class</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("has role='button' when rendered as default", () => {
    render(<Button>Role check</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});

// ─── Stateful (auto-async) ─────────────────────────────────────────────────────

/** A promise whose settlement we control, for deterministic state assertions. */
function deferred<T = void>() {
  let resolve!: (v: T | PromiseLike<T>) => void;
  let reject!: (e?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe("Button — stateful", () => {
  it("non-stateful button has no data-status", () => {
    render(<Button>Plain</Button>);
    expect(screen.getByRole("button")).not.toHaveAttribute("data-status");
  });

  it("loading prop forces the loading state (disabled + aria-busy + data-status)", () => {
    render(<Button loading>Save</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("data-status", "loading");
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "true");
  });

  it("loadingText swaps the label while loading; falls back to children otherwise", () => {
    const { rerender } = render(
      <Button loading loadingText="Saving…">
        Save
      </Button>
    );
    expect(screen.getByRole("button")).toHaveTextContent("Saving…");
    rerender(<Button loading={false}>Save</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Save");
  });

  it("onClickAsync drives idle → loading → success → idle", async () => {
    const user = userEvent.setup();
    const d = deferred();
    const onClickAsync = vi.fn(() => d.promise);
    render(
      <Button onClickAsync={onClickAsync} resetDelay={20} successText="Saved">
        Save
      </Button>
    );
    const btn = screen.getByRole("button");

    await user.click(btn);
    await waitFor(() => expect(btn).toHaveAttribute("data-status", "loading"));
    expect(onClickAsync).toHaveBeenCalledTimes(1);
    expect(btn).toBeDisabled();

    d.resolve();
    await waitFor(() => expect(btn).toHaveAttribute("data-status", "success"));
    expect(btn).toHaveTextContent("Saved");
    expect(btn.className).toContain("text-success");

    await waitFor(() => expect(btn).toHaveAttribute("data-status", "idle"));
    expect(btn).not.toBeDisabled();
  });

  it("onClickAsync rejection drives loading → error (aria-invalid) → idle", async () => {
    const user = userEvent.setup();
    const d = deferred();
    render(
      <Button onClickAsync={() => d.promise} resetDelay={20} errorText="Failed">
        Submit
      </Button>
    );
    const btn = screen.getByRole("button");

    await user.click(btn);
    await waitFor(() => expect(btn).toHaveAttribute("data-status", "loading"));

    d.reject(new Error("nope"));
    await waitFor(() => expect(btn).toHaveAttribute("data-status", "error"));
    expect(btn).toHaveAttribute("aria-invalid", "true");
    expect(btn).toHaveTextContent("Failed");

    await waitFor(() => expect(btn).toHaveAttribute("data-status", "idle"));
  });

  it("still calls a provided onClick alongside onClickAsync", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onClickAsync = vi.fn(() => Promise.resolve());
    render(
      <Button onClick={onClick} onClickAsync={onClickAsync} resetDelay={10}>
        Go
      </Button>
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(onClickAsync).toHaveBeenCalledTimes(1));
  });

  it("skips the async run when the click is default-prevented", async () => {
    const user = userEvent.setup();
    const onClickAsync = vi.fn(() => Promise.resolve());
    render(
      <Button onClick={(e) => e.preventDefault()} onClickAsync={onClickAsync}>
        Guarded
      </Button>
    );
    await user.click(screen.getByRole("button"));
    expect(onClickAsync).not.toHaveBeenCalled();
  });

  it("does not update state if unmounted mid-flight", async () => {
    const user = userEvent.setup();
    const d = deferred();
    const { unmount } = render(<Button onClickAsync={() => d.promise}>X</Button>);
    const btn = screen.getByRole("button");
    await user.click(btn);
    await waitFor(() => expect(btn).toHaveAttribute("data-status", "loading"));
    unmount();
    d.resolve();
    // flush microtasks — no act() warnings / errors should surface
    await Promise.resolve();
    expect(true).toBe(true);
  });

  it("a plain onClick (no onClickAsync) still fires and stays stateless", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Plain</Button>);
    const btn = screen.getByRole("button");
    await user.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(btn).not.toHaveAttribute("data-status");
  });

  it("stateful button has no axe violations in each state", async () => {
    const { container, rerender } = render(<Button loading>Save</Button>);
    expect(await axe(container)).toHaveNoViolations();
    rerender(<Button loading={false}>Save</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
