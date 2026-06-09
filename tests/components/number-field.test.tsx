/**
 * Tests for <NumberField /> (components/ui/number-field.tsx) — Base UI number field.
 * Base UI renders a labelled text input (not a native spinbutton) plus
 * increment/decrement buttons; the focusable input is labelled directly. We
 * cover value wiring, stepping, controlled/disabled, token surfaces, and a11y.
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from "@/components/ui/number-field";

function Stepper(props: React.ComponentProps<typeof NumberField>) {
  return (
    <NumberField {...props}>
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <NumberFieldInput aria-label="Quantity" />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberField>
  );
}

const input = () => screen.getByLabelText("Quantity");

describe("NumberField — render", () => {
  it("renders the field, group and input slots", () => {
    const { container } = render(<Stepper defaultValue={5} />);
    expect(container.querySelector('[data-slot="number-field"]')).not.toBeNull();
    expect(
      container.querySelector('[data-slot="number-field-group"]'),
    ).not.toBeNull();
    expect(
      container.querySelector('[data-slot="number-field-input"]'),
    ).not.toBeNull();
  });

  it("shows the current value in the input", () => {
    render(<Stepper defaultValue={5} />);
    expect(input()).toHaveDisplayValue("5");
  });

  it("renders labelled increment/decrement controls", () => {
    render(<Stepper defaultValue={5} />);
    expect(screen.getByRole("button", { name: "Increase" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Decrease" })).toBeInTheDocument();
  });

  it("uses token surfaces on the group", () => {
    const { container } = render(<Stepper defaultValue={5} />);
    const group = container.querySelector('[data-slot="number-field-group"]');
    expect(group).toHaveClass("border-input");
    expect(group).toHaveClass("bg-input/30");
    expect(group).not.toHaveClass("bg-transparent");
  });
});

describe("NumberField — interaction", () => {
  it("increments on the Increase button", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Stepper defaultValue={5} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: "Increase" }));
    expect(onValueChange).toHaveBeenCalledWith(6, expect.anything());
  });

  it("decrements on the Decrease button", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Stepper defaultValue={5} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: "Decrease" }));
    expect(onValueChange).toHaveBeenCalledWith(4, expect.anything());
  });

  it("does not step below min", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Stepper defaultValue={1} min={1} max={9} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: "Decrease" }));
    // Already at min — value stays clamped at 1.
    expect(input()).toHaveDisplayValue("1");
  });

  it("supports a controlled value", () => {
    render(<Stepper value={7} onValueChange={() => {}} />);
    expect(input()).toHaveDisplayValue("7");
  });

  it("disables when disabled", () => {
    render(<Stepper defaultValue={5} disabled />);
    expect(input()).toBeDisabled();
  });
});

describe("NumberField — size", () => {
  const group = (c: HTMLElement) =>
    c.querySelector('[data-slot="number-field-group"]');
  const stepBtn = (c: HTMLElement) =>
    c.querySelector('[data-slot="number-field-increment"]');

  it("uses the default group height when no size prop is given", () => {
    const { container } = render(<Stepper defaultValue={5} />);
    expect(group(container)).toHaveClass("h-8");
    expect(stepBtn(container)).toHaveClass("w-7");
  });

  it("threads the sm size through the group and step buttons", () => {
    const { container } = render(<Stepper defaultValue={5} size="sm" />);
    expect(group(container)).toHaveClass("h-7");
    expect(stepBtn(container)).toHaveClass("w-6");
  });

  it("threads the lg size through the group and step buttons", () => {
    const { container } = render(<Stepper defaultValue={5} size="lg" />);
    expect(group(container)).toHaveClass("h-9");
    expect(stepBtn(container)).toHaveClass("w-8");
  });
});

describe("NumberField — custom step content & className", () => {
  it("renders custom decrement/increment children and merges classNames", () => {
    render(
      <NumberField defaultValue={2}>
        <NumberFieldGroup className="custom-group">
          <NumberFieldDecrement>down</NumberFieldDecrement>
          <NumberFieldInput aria-label="Q" className="custom-input" />
          <NumberFieldIncrement>up</NumberFieldIncrement>
        </NumberFieldGroup>
      </NumberField>,
    );
    expect(screen.getByRole("button", { name: "Decrease" })).toHaveTextContent(
      "down",
    );
    expect(screen.getByLabelText("Q")).toHaveClass("custom-input");
  });
});

describe("NumberField — accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(<Stepper defaultValue={5} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
