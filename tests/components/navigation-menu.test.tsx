import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuIndicator,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

function SiteNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Product</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-48 gap-1 p-2">
              <li>
                <NavigationMenuLink href="#">Overview</NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">Analytics</NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Pricing</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

describe("NavigationMenu – smoke", () => {
  it("renders without crashing", () => {
    render(<SiteNav />);
    expect(screen.getByRole("button", { name: /Product/i })).toBeInTheDocument();
  });

  it("root has data-slot='navigation-menu'", () => {
    const { container } = render(<SiteNav />);
    expect(container.querySelector("[data-slot='navigation-menu']")).toBeInTheDocument();
  });

  it("list has data-slot='navigation-menu-list'", () => {
    const { container } = render(<SiteNav />);
    expect(container.querySelector("[data-slot='navigation-menu-list']")).toBeInTheDocument();
  });

  it("renders plain link item", () => {
    render(<SiteNav />);
    expect(screen.getByRole("link", { name: "Pricing" })).toBeInTheDocument();
  });

  it("exports navigationMenuTriggerStyle helper", () => {
    expect(typeof navigationMenuTriggerStyle).toBe("function");
    expect(navigationMenuTriggerStyle()).toContain("inline-flex");
  });

  it("merges custom className on root (does not clobber base classes)", () => {
    const { container } = render(
      <NavigationMenu className="custom-nav">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="#">Home</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    const root = container.querySelector("[data-slot='navigation-menu']");
    expect(root).toHaveClass("custom-nav");
    expect(root).toHaveClass("relative");
  });
});

describe("NavigationMenu – interaction", () => {
  it("opens dropdown content on trigger click", async () => {
    const user = userEvent.setup();
    render(<SiteNav />);
    await user.click(screen.getByRole("button", { name: /Product/i }));
    expect(await screen.findByRole("link", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Analytics" })).toBeInTheDocument();
  });

  it("trigger has data-slot='navigation-menu-trigger'", () => {
    const { container } = render(<SiteNav />);
    expect(
      container.querySelector("[data-slot='navigation-menu-trigger']")
    ).toBeInTheDocument();
  });

  it("trigger is a button that toggles aria-expanded when opened", async () => {
    const user = userEvent.setup();
    render(<SiteNav />);
    const trigger = screen.getByRole("button", { name: /Product/i });
    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    // Wait for the portalled content so the open state has settled.
    expect(
      await screen.findByRole("link", { name: "Overview" })
    ).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("item has data-slot='navigation-menu-item'", () => {
    const { container } = render(<SiteNav />);
    expect(
      container.querySelector("[data-slot='navigation-menu-item']")
    ).toBeInTheDocument();
  });

  it("link has data-slot='navigation-menu-link'", () => {
    const { container } = render(<SiteNav />);
    expect(
      container.querySelector("[data-slot='navigation-menu-link']")
    ).toBeInTheDocument();
  });

  it("renders NavigationMenuIndicator with data-slot", () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Features</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="#">Docs</NavigationMenuLink>
            </NavigationMenuContent>
            <NavigationMenuIndicator />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    expect(
      container.querySelector("[data-slot='navigation-menu-indicator']")
    ).toBeInTheDocument();
  });
});

describe("NavigationMenu – accessibility", () => {
  it("closed menu has no axe violations", async () => {
    const { container } = render(<SiteNav />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
