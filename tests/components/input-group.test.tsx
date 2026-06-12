import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { MagnifyingGlass } from "@/lib/icons"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

describe("InputGroup – smoke", () => {
  it("renders with data-slot='input-group' and role='group'", () => {
    const { container } = render(
      <InputGroup>
        <InputGroupInput aria-label="Search" />
      </InputGroup>
    );
    const root = container.querySelector("[data-slot='input-group']");
    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute("role", "group");
  });

  it("merges a custom className on the root", () => {
    const { container } = render(
      <InputGroup className="custom-root">
        <InputGroupInput aria-label="Search" />
      </InputGroup>
    );
    const root = container.querySelector("[data-slot='input-group']");
    expect(root).toHaveClass("custom-root");
    expect(root).toHaveClass("relative");
  });

  it("uses a visible input fill on the group surface", () => {
    const { container } = render(
      <InputGroup>
        <InputGroupInput aria-label="Search" />
      </InputGroup>
    );
    const root = container.querySelector("[data-slot='input-group']");
    expect(root).toHaveClass("bg-input/30");
    expect(root).not.toHaveClass("bg-transparent");
  });
});

describe("InputGroup – control", () => {
  it("input control has data-slot='input-group-control'", () => {
    render(
      <InputGroup>
        <InputGroupInput aria-label="Search" />
      </InputGroup>
    );
    expect(screen.getByRole("textbox", { name: "Search" })).toHaveAttribute(
      "data-slot",
      "input-group-control"
    );
  });

  it("input control is typeable and updates its value", async () => {
    const user = userEvent.setup();
    render(
      <InputGroup>
        <InputGroupInput aria-label="Search" />
      </InputGroup>
    );
    const input = screen.getByRole("textbox", { name: "Search" });
    await user.type(input, "hello");
    expect(input).toHaveValue("hello");
  });

  it("renders InputGroupTextarea as a textarea control", () => {
    render(
      <InputGroup>
        <InputGroupTextarea aria-label="Notes" />
      </InputGroup>
    );
    const textarea = screen.getByRole("textbox", { name: "Notes" });
    expect(textarea.tagName).toBe("TEXTAREA");
    expect(textarea).toHaveAttribute("data-slot", "input-group-control");
  });
});

describe("InputGroup – addon", () => {
  it.each([
    "inline-start",
    "inline-end",
    "block-start",
    "block-end",
  ] as const)("sets data-align=%s", (align) => {
    const { container } = render(
      <InputGroup>
        <InputGroupAddon align={align}>Addon</InputGroupAddon>
        <InputGroupInput aria-label="field" />
      </InputGroup>
    );
    expect(
      container.querySelector("[data-slot='input-group-addon']")
    ).toHaveAttribute("data-align", align);
  });

  it("defaults to inline-start align", () => {
    const { container } = render(
      <InputGroup>
        <InputGroupAddon>
          <MagnifyingGlass aria-hidden />
        </InputGroupAddon>
        <InputGroupInput aria-label="field" />
      </InputGroup>
    );
    expect(
      container.querySelector("[data-slot='input-group-addon']")
    ).toHaveAttribute("data-align", "inline-start");
  });

  it("clicking an addon focuses the input", async () => {
    const user = userEvent.setup();
    render(
      <InputGroup>
        <InputGroupAddon data-testid="addon">
          <MagnifyingGlass aria-hidden />
        </InputGroupAddon>
        <InputGroupInput aria-label="Search" />
      </InputGroup>
    );
    await user.click(screen.getByTestId("addon"));
    expect(document.activeElement).toBe(
      screen.getByRole("textbox", { name: "Search" })
    );
  });

  it("clicking a nested button keeps focus on the button", async () => {
    const user = userEvent.setup();
    render(
      <InputGroup>
        <InputGroupInput aria-label="Search" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton>Send</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    );
    const button = screen.getByRole("button", { name: "Send" });
    await user.click(button);
    expect(document.activeElement).toBe(button);
  });
});

describe("InputGroup – button", () => {
  it("renders InputGroupButton as a button and fires onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <InputGroup>
        <InputGroupInput aria-label="field" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton onClick={onClick}>Go</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    );
    const button = screen.getByRole("button", { name: "Go" });
    expect(button).toBeInTheDocument();
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("supports icon sizes via data-size", () => {
    render(
      <InputGroup>
        <InputGroupInput aria-label="field" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-sm" aria-label="Send">
            →
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    );
    expect(screen.getByRole("button", { name: "Send" })).toHaveAttribute(
      "data-size",
      "icon-sm"
    );
  });
});

describe("InputGroup – text", () => {
  it("renders provided text", () => {
    render(
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput aria-label="domain" />
      </InputGroup>
    );
    expect(screen.getByText("https://")).toBeInTheDocument();
  });
});

describe("InputGroup – accessibility", () => {
  it("a labeled input group has no axe violations", async () => {
    const { container } = render(
      <InputGroup>
        <InputGroupAddon>
          <MagnifyingGlass aria-hidden />
        </InputGroupAddon>
        <InputGroupInput aria-label="Search projects" />
      </InputGroup>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
