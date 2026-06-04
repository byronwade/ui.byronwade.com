import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Spinner } from "@/components/ui/spinner";

describe("Spinner", () => {
  it("renders with status role and an accessible label", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Loading");
  });

  it("has data-slot='spinner' and the spin animation", () => {
    const { container } = render(<Spinner />);
    const el = container.querySelector("[data-slot='spinner']");
    expect(el).toBeInTheDocument();
    expect(el?.className).toContain("animate-spin");
  });

  it.each([
    ["sm", "size-3"],
    ["default", "size-4"],
    ["lg", "size-6"],
  ] as const)("size=%s applies its size class", (size, fragment) => {
    render(<Spinner size={size} />);
    expect(screen.getByRole("status").className).toContain(fragment);
  });

  it("merges a custom className (e.g. brand tint)", () => {
    render(<Spinner className="text-brand" />);
    expect(screen.getByRole("status").className).toContain("text-brand");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Spinner />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
