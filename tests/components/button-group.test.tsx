import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";

describe("ButtonGroup", () => {
  it("renders as a group containing its children", () => {
    render(
      <ButtonGroup>
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>
    );
    expect(screen.getByRole("group")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "One" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Two" })).toBeInTheDocument();
  });

  it("defaults to horizontal orientation", () => {
    render(<ButtonGroup>x</ButtonGroup>);
    expect(screen.getByRole("group")).toHaveAttribute("data-orientation", "horizontal");
  });

  it("supports vertical orientation", () => {
    render(<ButtonGroup orientation="vertical">x</ButtonGroup>);
    const group = screen.getByRole("group");
    expect(group).toHaveAttribute("data-orientation", "vertical");
    expect(group.className).toContain("flex-col");
  });

  it("has data-slot='button-group'", () => {
    const { container } = render(<ButtonGroup>x</ButtonGroup>);
    expect(container.querySelector("[data-slot='button-group']")).toBeInTheDocument();
  });

  it("merges a custom className", () => {
    render(<ButtonGroup className="test-bg">x</ButtonGroup>);
    expect(screen.getByRole("group").className).toContain("test-bg");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ButtonGroup>
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
