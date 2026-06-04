import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { NativeSelect } from "@/components/ui/native-select";

function options() {
  return (
    <>
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
    </>
  );
}

describe("NativeSelect", () => {
  it("renders a select with its options", () => {
    render(<NativeSelect aria-label="fruit">{options()}</NativeSelect>);
    expect(screen.getByRole("combobox", { name: "fruit" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument();
  });

  it("has data-slot='native-select'", () => {
    const { container } = render(<NativeSelect>{options()}</NativeSelect>);
    expect(container.querySelector("[data-slot='native-select']")).toBeInTheDocument();
  });

  it("fires onChange when an option is chosen", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <NativeSelect aria-label="fruit" defaultValue="apple" onChange={onChange}>
        {options()}
      </NativeSelect>
    );
    await user.selectOptions(screen.getByRole("combobox", { name: "fruit" }), "banana");
    expect(onChange).toHaveBeenCalled();
    expect((screen.getByRole("combobox", { name: "fruit" }) as HTMLSelectElement).value).toBe(
      "banana"
    );
  });

  it("can be disabled", () => {
    render(<NativeSelect aria-label="fruit" disabled>{options()}</NativeSelect>);
    expect(screen.getByRole("combobox", { name: "fruit" })).toBeDisabled();
  });

  it("merges a custom className", () => {
    const { container } = render(<NativeSelect className="test-sel">{options()}</NativeSelect>);
    expect(container.querySelector(".test-sel")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<NativeSelect aria-label="fruit">{options()}</NativeSelect>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
