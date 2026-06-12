import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { axe } from "vitest-axe";
import { Files, GitBranch, MagnifyingGlass } from "@/lib/icons"
import { MorphRail } from "@/components/ui/morph-rail";

beforeEach(() => {
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });
});

const items = [
  { id: "files", label: "Files", icon: Files, panel: <div>files panel</div> },
  { id: "search", label: "Search", icon: MagnifyingGlass, panel: <div>search panel</div> },
  { id: "git", label: "Source Control", icon: GitBranch, panel: <div>git panel</div> },
];

describe("MorphRail", () => {
  it("renders every rail item", () => {
    render(<MorphRail items={items} />);
    for (const i of items) expect(screen.getByRole("button", { name: i.label })).toBeInTheDocument();
  });

  it("blooms an item's panel when clicked and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<MorphRail items={items} />);
    const panel = document.querySelector('[data-slot="morph-panel"]')!;
    expect(panel).toHaveAttribute("aria-hidden", "true");
    await user.click(screen.getByRole("button", { name: "Files" }));
    expect(panel).toHaveAttribute("aria-hidden", "false");
    await user.keyboard("{Escape}");
    expect(panel).toHaveAttribute("aria-hidden", "true");
  });

  it("toggles the panel closed when the active item is clicked again", async () => {
    const user = userEvent.setup();
    render(<MorphRail items={items} />);
    const panel = document.querySelector('[data-slot="morph-panel"]')!;
    await user.click(screen.getByRole("button", { name: "Files" }));
    expect(panel).toHaveAttribute("aria-hidden", "false");
    await user.click(screen.getByRole("button", { name: "Files" }));
    expect(panel).toHaveAttribute("aria-hidden", "true");
  });

  it("has no axe violations", async () => {
    const { container } = render(<MorphRail items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
