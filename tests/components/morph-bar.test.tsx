import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { axe } from "vitest-axe";
import { MorphBar } from "@/components/ui/morph-bar";

beforeEach(() => {
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });
});

const items = [
  { id: "home", label: "Home", active: true },
  { id: "docs", label: "Docs" },
  { id: "pricing", label: "Pricing" },
];

describe("MorphBar", () => {
  it("renders the brand and every item, marking the active one", () => {
    render(<MorphBar brand="Acme" items={items} panel={<div>mega</div>} />);
    expect(screen.getAllByText("Acme").length).toBeGreaterThanOrEqual(1);
    for (const i of items) expect(screen.getByRole("link", { name: i.label })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  });

  it("blooms the panel when the menu trigger is clicked and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<MorphBar brand="Acme" items={items} panel={<div>mega menu body</div>} />);
    const panel = document.querySelector('[data-slot="morph-panel"]')!;
    expect(panel).toHaveAttribute("aria-hidden", "true");
    await user.click(screen.getByRole("button", { name: /menu/i }));
    expect(panel).toHaveAttribute("aria-hidden", "false");
    await user.keyboard("{Escape}");
    expect(panel).toHaveAttribute("aria-hidden", "true");
  });

  it("fires onSelect when an item is chosen", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<MorphBar brand="Acme" items={[{ id: "docs", label: "Docs", onSelect }]} panel={<div />} />);
    await user.click(screen.getByRole("link", { name: "Docs" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("has no axe violations", async () => {
    const { container } = render(<MorphBar brand="Acme" items={items} panel={<div>mega</div>} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
