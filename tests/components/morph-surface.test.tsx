import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { axe } from "vitest-axe";
import { MorphSurface, type MorphPlacement, type MorphGrow } from "@/components/ui/morph-surface";

beforeEach(() => {
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });
});

function Harness({ placement = "top" as MorphPlacement, grow = "height" as MorphGrow }) {
  const [open, setOpen] = React.useState(false);
  return (
    <MorphSurface
      open={open}
      onOpenChange={setOpen}
      placement={placement}
      grow={grow}
      navLabel="Demo nav"
      collapsed={<button onClick={() => setOpen(true)}>open</button>}
      panel={<div>panel body</div>}
    />
  );
}

describe("MorphSurface", () => {
  it("renders the collapsed content inside a labeled nav landmark", () => {
    render(<Harness />);
    const nav = screen.getByRole("navigation", { name: "Demo nav" });
    expect(nav).toHaveAttribute("data-slot", "morph-surface");
    expect(screen.getByRole("button", { name: "open" })).toBeInTheDocument();
  });

  it("toggles aria-hidden on rest/panel when opened", async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness />);
    const rest = container.querySelector('[data-slot="morph-rest"]')!;
    const panel = container.querySelector('[data-slot="morph-panel"]')!;
    expect(rest).toHaveAttribute("aria-hidden", "false");
    expect(panel).toHaveAttribute("aria-hidden", "true");
    await user.click(screen.getByRole("button", { name: "open" }));
    expect(rest).toHaveAttribute("aria-hidden", "true");
    expect(panel).toHaveAttribute("aria-hidden", "false");
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "open" }));
    const panel = document.querySelector('[data-slot="morph-panel"]')!;
    expect(panel).toHaveAttribute("aria-hidden", "false");
    await user.keyboard("{Escape}");
    expect(panel).toHaveAttribute("aria-hidden", "true");
  });

  it("closes on outside pointer-down", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Harness />
        <div data-testid="outside">outside</div>
      </div>,
    );
    await user.click(screen.getByRole("button", { name: "open" }));
    expect(document.querySelector('[data-slot="morph-panel"]')!).toHaveAttribute("aria-hidden", "false");
    await user.pointer({ keys: "[MouseLeft]", target: screen.getByTestId("outside") });
    expect(document.querySelector('[data-slot="morph-panel"]')!).toHaveAttribute("aria-hidden", "true");
  });

  it("renders for every placement and reflects it via data-placement", () => {
    for (const p of ["top", "bottom", "left", "right"] as MorphPlacement[]) {
      const { container, unmount } = render(<Harness placement={p} />);
      expect(container.querySelector('[data-slot="morph-surface"]')).toHaveAttribute("data-placement", p);
      unmount();
    }
  });

  it("opens in every grow mode without crashing", async () => {
    const user = userEvent.setup();
    for (const g of ["height", "width", "both"] as MorphGrow[]) {
      const { unmount } = render(<Harness grow={g} />);
      const open = screen.getByRole("button", { name: "open" });
      await user.click(open);
      expect(document.querySelector('[data-slot="morph-panel"]')).toHaveAttribute("aria-hidden", "false");
      unmount();
    }
  });

  it("has no axe violations", async () => {
    const { container } = render(<Harness />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
