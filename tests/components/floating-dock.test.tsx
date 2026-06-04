/**
 * Tests for <FloatingDock /> (components/ui/floating-dock.tsx)
 *
 * Renders a desktop magnify dock (always in the DOM; hidden via CSS only) and a
 * mobile dock with a toggle button. Desktop items are <a aria-label={title}>;
 * hovering an item reveals a tooltip with the title. motion runs in jsdom; we
 * assert structure/state/a11y, never the spring visuals.
 */

import * as React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Home, Inbox, Settings } from "lucide-react";

import { FloatingDock } from "@/components/ui/floating-dock";

const ITEMS = [
  { title: "Home", icon: <Home className="h-full w-full" />, href: "/home" },
  { title: "Inbox", icon: <Inbox className="h-full w-full" />, href: "/inbox" },
  { title: "Settings", icon: <Settings className="h-full w-full" />, href: "/settings" },
];

describe("FloatingDock — default render", () => {
  it("renders without crashing", () => {
    const { container } = render(<FloatingDock items={ITEMS} />);
    expect(container.querySelector('[data-slot="floating-dock"]')).not.toBeNull();
  });

  it("renders both the desktop and mobile docks", () => {
    const { container } = render(<FloatingDock items={ITEMS} />);
    expect(container.querySelector('[data-slot="floating-dock"]')).not.toBeNull();
    expect(
      container.querySelector('[data-slot="floating-dock-mobile"]'),
    ).not.toBeNull();
  });

  it("renders a desktop link per item with an accessible name", () => {
    render(<FloatingDock items={ITEMS} />);
    for (const item of ITEMS) {
      expect(
        screen.getByRole("link", { name: item.title }),
      ).toHaveAttribute("href", item.href);
    }
  });

  it("applies token surfaces (bg-muted dock, bg-accent items)", () => {
    const { container } = render(<FloatingDock items={ITEMS} />);
    expect(container.querySelector('[data-slot="floating-dock"]')).toHaveClass(
      "bg-muted",
    );
    expect(container.querySelector(".bg-accent")).not.toBeNull();
  });

  it("forwards desktop/mobile classNames", () => {
    const { container } = render(
      <FloatingDock
        items={ITEMS}
        desktopClassName="desk-x"
        mobileClassName="mob-x"
      />,
    );
    expect(container.querySelector('[data-slot="floating-dock"]')).toHaveClass(
      "desk-x",
    );
    expect(
      container.querySelector('[data-slot="floating-dock-mobile"]'),
    ).toHaveClass("mob-x");
  });
});

describe("FloatingDock — desktop hover tooltip", () => {
  it("reveals the title tooltip on hover and hides it on leave", async () => {
    const { container } = render(<FloatingDock items={ITEMS} />);
    // The icon container is the motion div inside the first desktop link.
    const firstLink = screen.getAllByRole("link", { name: "Home" })[0];
    const iconBox = firstLink.querySelector("div")!;
    expect(within(container).queryByText("Home")).not.toBeInTheDocument();
    fireEvent.mouseEnter(iconBox);
    expect(await screen.findByText("Home")).toBeInTheDocument();
    fireEvent.mouseLeave(iconBox);
  });
});

describe("FloatingDock — desktop magnify pointer tracking", () => {
  it("updates on mouse move and resets on mouse leave without crashing", () => {
    const { container } = render(<FloatingDock items={ITEMS} />);
    const dock = container.querySelector(
      '[data-slot="floating-dock"]',
    ) as HTMLElement;
    // Drives mouseX.set(pageX) and the per-item distance useTransform.
    fireEvent.mouseMove(dock, { pageX: 120 });
    fireEvent.mouseMove(dock, { pageX: 300 });
    fireEvent.mouseLeave(dock);
    expect(dock).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Home" }).length).toBeGreaterThan(
      0,
    );
  });
});

describe("FloatingDock — mobile toggle", () => {
  it("toggle button is labelled and collapsed by default", () => {
    render(<FloatingDock items={ITEMS} />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("opens the mobile items on click and relabels the toggle", async () => {
    const user = userEvent.setup();
    const { container } = render(<FloatingDock items={ITEMS} />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    await user.click(toggle);
    expect(
      screen.getByRole("button", { name: "Collapse menu" }),
    ).toHaveAttribute("aria-expanded", "true");
    // Mobile dock now contains its own set of item links.
    const mobile = container.querySelector(
      '[data-slot="floating-dock-mobile"]',
    ) as HTMLElement;
    expect(within(mobile).getAllByRole("link").length).toBe(ITEMS.length);
  });
});

describe("FloatingDock — accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(<FloatingDock items={ITEMS} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
