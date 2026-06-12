import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { TextAlignCenter, TextAlignLeft, TextAlignRight, TextB, TextItalic, TextUnderline } from "@/lib/icons"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const root = (container: HTMLElement) =>
  container.querySelector("[data-slot='toggle-group']");

function AlignGroup(props: React.ComponentProps<typeof ToggleGroup>) {
  return (
    <ToggleGroup defaultValue={["left"]} {...props}>
      <ToggleGroupItem value="left" aria-label="Align left">
        <TextAlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <TextAlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <TextAlignRight />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

function FormatGroup(props: React.ComponentProps<typeof ToggleGroup>) {
  return (
    <ToggleGroup multiple defaultValue={["bold"]} {...props}>
      <ToggleGroupItem value="bold" aria-label="Bold">
        <TextB />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <TextItalic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <TextUnderline />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

describe("ToggleGroup – smoke", () => {
  it("renders without crashing", () => {
    render(<AlignGroup />);
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("root has data-slot='toggle-group'", () => {
    const { container } = render(<AlignGroup />);
    expect(root(container)).toBeInTheDocument();
  });

  it("items have data-slot='toggle-group-item'", () => {
    const { container } = render(<AlignGroup />);
    expect(
      container.querySelectorAll("[data-slot='toggle-group-item']")
    ).toHaveLength(3);
  });

  it("default selection presses the default item", () => {
    render(<AlignGroup />);
    expect(screen.getByRole("button", { name: "Align left" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });
});

describe("ToggleGroup – data attributes", () => {
  it("variant outline is reflected on root data-variant", () => {
    const { container } = render(<AlignGroup variant="outline" />);
    expect(root(container)).toHaveAttribute("data-variant", "outline");
  });

  it("size sm is reflected on root data-size", () => {
    const { container } = render(<AlignGroup size="sm" />);
    expect(root(container)).toHaveAttribute("data-size", "sm");
  });

  it("vertical orientation sets data-orientation", () => {
    const { container } = render(<AlignGroup orientation="vertical" />);
    expect(root(container)).toHaveAttribute("data-orientation", "vertical");
  });

  it("defaults data-orientation to horizontal", () => {
    const { container } = render(<AlignGroup />);
    expect(root(container)).toHaveAttribute("data-orientation", "horizontal");
  });

  it("spacing prop sets data-spacing", () => {
    const { container } = render(<AlignGroup spacing={0} />);
    expect(root(container)).toHaveAttribute("data-spacing", "0");
  });

  it("defaults data-spacing to 2", () => {
    const { container } = render(<AlignGroup />);
    expect(root(container)).toHaveAttribute("data-spacing", "2");
  });

  it("propagates variant and size from the group to each item", () => {
    const { container } = render(<AlignGroup variant="outline" size="sm" />);
    const items = container.querySelectorAll(
      "[data-slot='toggle-group-item']"
    );
    expect(items).toHaveLength(3);
    items.forEach((item) => {
      expect(item).toHaveAttribute("data-variant", "outline");
      expect(item).toHaveAttribute("data-size", "sm");
    });
  });
});

describe("ToggleGroup – single select", () => {
  it("selecting an item presses it and unpresses the previously selected one", async () => {
    const user = userEvent.setup();
    render(<AlignGroup />);
    const left = screen.getByRole("button", { name: "Align left" });
    const center = screen.getByRole("button", { name: "Align center" });
    expect(left).toHaveAttribute("aria-pressed", "true");

    await user.click(center);
    expect(center).toHaveAttribute("aria-pressed", "true");
    expect(left).toHaveAttribute("aria-pressed", "false");
    expect(
      screen.getByRole("button", { name: "Align right" })
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onValueChange with a single-element array", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<AlignGroup onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: "Align right" }));
    expect(onValueChange).toHaveBeenCalledWith(["right"], expect.any(Object));
  });
});

describe("ToggleGroup – multiple select", () => {
  it("allows two items to be pressed at once", async () => {
    const user = userEvent.setup();
    render(<FormatGroup />);
    const bold = screen.getByRole("button", { name: "Bold" });
    const italic = screen.getByRole("button", { name: "Italic" });
    expect(bold).toHaveAttribute("aria-pressed", "true");

    await user.click(italic);
    expect(bold).toHaveAttribute("aria-pressed", "true");
    expect(italic).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onValueChange with an array of two values", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<FormatGroup onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: "Italic" }));
    expect(onValueChange).toHaveBeenCalledWith(
      ["bold", "italic"],
      expect.any(Object)
    );
  });

  it("unpressing a value removes only that value from the array", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<FormatGroup onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: "Bold" }));
    expect(onValueChange).toHaveBeenCalledWith([], expect.any(Object));
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });
});

describe("ToggleGroup – disabled", () => {
  it("disables every item in the group", () => {
    render(<AlignGroup disabled />);
    screen.getAllByRole("button").forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it("does not change selection or fire onValueChange when disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<AlignGroup disabled onValueChange={onValueChange} />);
    const center = screen.getByRole("button", { name: "Align center" });
    await user.click(center);
    expect(center).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Align left" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe("ToggleGroup – accessibility", () => {
  // The root renders Base UI's CompositeRoot, which always emits
  // `aria-orientation`. `aria-orientation` is invalid on `role="group"` but
  // valid on `role="toolbar"` (axe-core `toolbar.allowedAttrs`), and a labeled
  // button toolbar is the correct ARIA pattern for a toggle-button cluster — so
  // we expose it as a named toolbar instead of disabling `aria-allowed-attr`.
  it("has no axe violations as a labeled toolbar", async () => {
    const { container } = render(
      <AlignGroup role="toolbar" aria-label="Text alignment" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations for a multiple-select toolbar", async () => {
    const { container } = render(
      <FormatGroup role="toolbar" aria-label="Text formatting" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
