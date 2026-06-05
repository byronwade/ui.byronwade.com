import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { axe } from "vitest-axe";
import { MorphMenubar } from "@/components/ui/morph-menubar";

beforeEach(() => {
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });
});

const menus = [
  { id: "file", label: "File", items: [{ id: "new", label: "New" }, { id: "open", label: "Open" }] },
  { id: "edit", label: "Edit", items: [{ id: "undo", label: "Undo" }] },
];

describe("MorphMenubar", () => {
  it("renders every top-level menu", () => {
    render(<MorphMenubar menus={menus} />);
    for (const m of menus) expect(screen.getByRole("button", { name: m.label })).toBeInTheDocument();
  });

  it("blooms a menu's dropdown when clicked and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<MorphMenubar menus={menus} />);
    const panel = document.querySelector('[data-slot="morph-panel"]')!;
    expect(panel).toHaveAttribute("aria-hidden", "true");
    await user.click(screen.getByRole("button", { name: "File" }));
    expect(panel).toHaveAttribute("aria-hidden", "false");
    expect(screen.getByRole("menuitem", { name: "New" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(panel).toHaveAttribute("aria-hidden", "true");
  });

  it("fires onSelect and closes when a menu item is chosen", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<MorphMenubar menus={[{ id: "file", label: "File", items: [{ id: "new", label: "New", onSelect }] }]} />);
    await user.click(screen.getByRole("button", { name: "File" }));
    await user.click(screen.getByRole("menuitem", { name: "New" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[data-slot="morph-panel"]')!).toHaveAttribute("aria-hidden", "true");
  });

  it("has no axe violations", async () => {
    const { container } = render(<MorphMenubar menus={menus} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
