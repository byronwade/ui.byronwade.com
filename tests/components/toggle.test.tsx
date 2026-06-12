import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { TextB } from "@/lib/icons"
import { Toggle, toggleVariants } from "@/components/ui/toggle";

describe("Toggle – rendering", () => {
  it("renders without crashing", () => {
    render(<Toggle aria-label="Bold">B</Toggle>);
    expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();
  });

  it("has data-slot='toggle'", () => {
    const { container } = render(<Toggle aria-label="Bold">B</Toggle>);
    expect(
      container.querySelector("[data-slot='toggle']")
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute("data-slot", "toggle");
  });

  it("defaults to aria-pressed=false", () => {
    render(<Toggle aria-label="Bold">B</Toggle>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });

  it("renders an icon child", () => {
    render(
      <Toggle aria-label="Bold">
        <TextB data-testid="icon" />
      </Toggle>
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("merges a custom className with the variant classes", () => {
    render(
      <Toggle aria-label="Bold" className="custom-toggle">
        B
      </Toggle>
    );
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("custom-toggle");
    // base variant class is still present (merged, not replaced)
    expect(btn.className).toContain("inline-flex");
  });
});

describe("Toggle – variants", () => {
  it("default variant uses a transparent background without an outline border", () => {
    render(
      <Toggle aria-label="Bold" variant="default">
        B
      </Toggle>
    );
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-transparent");
    expect(btn.className).not.toContain("border-input");
  });

  it("outline variant adds the bordered class fragment", () => {
    render(
      <Toggle aria-label="Bold" variant="outline">
        B
      </Toggle>
    );
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("border");
    expect(btn.className).toContain("border-input");
  });

  it("toggleVariants helper reflects the variant classes", () => {
    expect(typeof toggleVariants).toBe("function");
    expect(toggleVariants({ variant: "outline" })).toContain("border-input");
    expect(toggleVariants({ variant: "default" })).not.toContain("border-input");
  });
});

describe("Toggle – sizes", () => {
  it("size sm applies the h-7 height class", () => {
    render(
      <Toggle aria-label="Bold" size="sm">
        B
      </Toggle>
    );
    expect(screen.getByRole("button").className).toContain("h-7");
  });

  it("size default applies the h-8 height class", () => {
    render(
      <Toggle aria-label="Bold" size="default">
        B
      </Toggle>
    );
    expect(screen.getByRole("button").className).toContain("h-8");
  });

  it("size lg applies the h-9 height class", () => {
    render(
      <Toggle aria-label="Bold" size="lg">
        B
      </Toggle>
    );
    expect(screen.getByRole("button").className).toContain("h-9");
  });

  it("toggleVariants helper reflects the size classes", () => {
    expect(toggleVariants({ size: "sm" })).toContain("h-7");
    expect(toggleVariants({ size: "default" })).toContain("h-8");
    expect(toggleVariants({ size: "lg" })).toContain("h-9");
  });
});

describe("Toggle – interaction", () => {
  it("toggles aria-pressed false → true → false on click", async () => {
    const user = userEvent.setup();
    render(<Toggle aria-label="Bold">B</Toggle>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-pressed", "false");
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "true");
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "false");
  });

  it("defaultPressed starts in the pressed state", () => {
    render(
      <Toggle aria-label="Bold" defaultPressed>
        B
      </Toggle>
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("fires onPressedChange with the new value (uncontrolled)", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <Toggle aria-label="Bold" onPressedChange={onPressedChange}>
        B
      </Toggle>
    );
    await user.click(screen.getByRole("button"));
    expect(onPressedChange).toHaveBeenCalledWith(true, expect.any(Object));
  });

  it("respects a controlled pressed prop and reports each new value", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();

    function Controlled() {
      const [pressed, setPressed] = React.useState(false);
      return (
        <Toggle
          aria-label="Bold"
          pressed={pressed}
          onPressedChange={(value, event) => {
            onPressedChange(value, event);
            setPressed(value);
          }}
        >
          B
        </Toggle>
      );
    }

    render(<Controlled />);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-pressed", "false");

    await user.click(btn);
    expect(onPressedChange).toHaveBeenLastCalledWith(true, expect.any(Object));
    expect(btn).toHaveAttribute("aria-pressed", "true");

    await user.click(btn);
    expect(onPressedChange).toHaveBeenLastCalledWith(false, expect.any(Object));
    expect(btn).toHaveAttribute("aria-pressed", "false");
  });

  it("a fixed controlled pressed prop wins without local state updates", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <Toggle aria-label="Bold" pressed={false} onPressedChange={onPressedChange}>
        B
      </Toggle>
    );
    const btn = screen.getByRole("button");
    await user.click(btn);
    // parent never updated state, so the controlled value stays false…
    expect(btn).toHaveAttribute("aria-pressed", "false");
    // …but the handler still reported the intended next value
    expect(onPressedChange).toHaveBeenCalledWith(true, expect.any(Object));
  });
});

describe("Toggle – disabled", () => {
  it("sets the disabled attribute", () => {
    render(
      <Toggle aria-label="Bold" disabled>
        B
      </Toggle>
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("does not toggle or fire onPressedChange when disabled", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <Toggle aria-label="Bold" disabled onPressedChange={onPressedChange}>
        B
      </Toggle>
    );
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-pressed", "false");
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "false");
    expect(onPressedChange).not.toHaveBeenCalled();
  });
});

describe("Toggle – accessibility", () => {
  it("has no axe violations for a labeled toggle", async () => {
    const { container } = render(<Toggle aria-label="Bold">B</Toggle>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
