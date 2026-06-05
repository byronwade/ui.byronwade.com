import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { axe } from "vitest-axe";
import { Home, Inbox, Settings } from "lucide-react";
import { MorphSidebar } from "@/components/ui/morph-sidebar";

beforeEach(() => {
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });
});

const items = [
  { id: "home", label: "Home", icon: Home, active: true },
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "settings", label: "Settings", icon: Settings },
];

describe("MorphSidebar", () => {
  it("renders every item in the resting rail, marking the active one", () => {
    render(<MorphSidebar items={items} />);
    for (const i of items) expect(screen.getByRole("link", { name: i.label })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  });

  it("expands when the toggle is clicked and collapses on Escape", async () => {
    const user = userEvent.setup();
    render(<MorphSidebar items={items} />);
    const panel = document.querySelector('[data-slot="morph-panel"]')!;
    expect(panel).toHaveAttribute("aria-hidden", "true");
    await user.click(screen.getByRole("button", { name: /expand sidebar/i }));
    expect(panel).toHaveAttribute("aria-hidden", "false");
    await user.keyboard("{Escape}");
    expect(panel).toHaveAttribute("aria-hidden", "true");
  });

  it("fires onSelect when an item is chosen", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<MorphSidebar items={[{ id: "home", label: "Home", icon: Home, onSelect }]} />);
    await user.click(screen.getByRole("link", { name: "Home" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("navigates without error for an item that has no onSelect", async () => {
    const user = userEvent.setup();
    render(<MorphSidebar items={items} />);
    await user.click(screen.getByRole("link", { name: "Inbox" }));
    expect(screen.getByRole("link", { name: "Inbox" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<MorphSidebar items={items} brand={<span>UI</span>} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
