import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

describe("Kbd", () => {
  it("renders its content", () => {
    render(<Kbd>Esc</Kbd>);
    expect(screen.getByText("Esc")).toBeInTheDocument();
  });

  it("has data-slot='kbd'", () => {
    const { container } = render(<Kbd>K</Kbd>);
    expect(container.querySelector("[data-slot='kbd']")).toBeInTheDocument();
  });

  it.each([
    ["sm", "h-5"],
    ["default", "h-6"],
    ["lg", "h-7"],
  ] as const)("size=%s applies its height class", (size, fragment) => {
    const { container } = render(<Kbd size={size}>X</Kbd>);
    expect(container.querySelector("[data-slot='kbd']")?.className).toContain(fragment);
  });

  it("merges a custom className", () => {
    const { container } = render(<Kbd className="test-kbd">X</Kbd>);
    expect(container.querySelector(".test-kbd")).toBeInTheDocument();
  });

  it("KbdGroup renders children with its slot", () => {
    const { container } = render(
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    );
    expect(container.querySelector("[data-slot='kbd-group']")).toBeInTheDocument();
    expect(screen.getByText("⌘")).toBeInTheDocument();
    expect(screen.getByText("K")).toBeInTheDocument();
  });

  it("KbdGroup merges a custom className", () => {
    const { container } = render(<KbdGroup className="test-grp" />);
    expect(container.querySelector(".test-grp")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
