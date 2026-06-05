import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { axe } from "vitest-axe";
import { Home, Search, Bell } from "lucide-react";
import { MorphTabs } from "@/components/ui/morph-tabs";

beforeEach(() => {
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });
});

const items = [
  { id: "home", label: "Home", icon: Home, active: true },
  { id: "search", label: "Search", icon: Search },
  { id: "alerts", label: "Alerts", icon: Bell },
];

describe("MorphTabs", () => {
  it("renders every tab, marking the active one", () => {
    render(<MorphTabs items={items} sheet={<div>sheet</div>} />);
    for (const i of items) expect(screen.getByRole("button", { name: i.label })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Home" })).toHaveAttribute("aria-current", "page");
  });

  it("blooms the sheet when the handle is clicked and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<MorphTabs items={items} sheet={<div>sheet body</div>} />);
    const panel = document.querySelector('[data-slot="morph-panel"]')!;
    expect(panel).toHaveAttribute("aria-hidden", "true");
    await user.click(screen.getByRole("button", { name: /open sheet/i }));
    expect(panel).toHaveAttribute("aria-hidden", "false");
    await user.keyboard("{Escape}");
    expect(panel).toHaveAttribute("aria-hidden", "true");
  });

  it("fires onSelect when a tab is chosen", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<MorphTabs items={[{ id: "home", label: "Home", icon: Home, onSelect }]} sheet={<div />} />);
    await user.click(screen.getByRole("button", { name: "Home" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("has no axe violations", async () => {
    const { container } = render(<MorphTabs items={items} sheet={<div>sheet</div>} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
