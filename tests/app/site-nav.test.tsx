import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePathname } from "next/navigation";
import { SiteNav } from "@/app/(docs)/_components/site-nav";

vi.mock("next/navigation", () => ({ usePathname: vi.fn() }));

describe("SiteNav", () => {
  beforeEach(() => vi.mocked(usePathname).mockReturnValue("/docs"));

  it("shows Get Started guides and a single Browse-all link, not an exhaustive component list", () => {
    render(<SiteNav />);
    expect(screen.getByRole("link", { name: "Introduction" })).toHaveAttribute("href", "/docs");
    const browse = screen.getByRole("link", { name: /Browse all components/i });
    expect(browse).toHaveAttribute("href", "/docs#catalog");
    expect(screen.queryByRole("link", { name: "Badge" })).toBeNull();
  });

  it("shows an 'On this page' variant jump-list on a component page with variants", () => {
    vi.mocked(usePathname).mockReturnValue("/docs/button");
    render(<SiteNav />);
    expect(screen.getByText(/On this page/i)).toBeInTheDocument();
    const ghost = screen.getByRole("link", { name: "Ghost" });
    expect(ghost).toHaveAttribute("href", "/docs/button#ghost");
  });

  it("omits 'On this page' on pages without authored variants", () => {
    vi.mocked(usePathname).mockReturnValue("/docs/accordion");
    render(<SiteNav />);
    expect(screen.queryByText(/On this page/i)).toBeNull();
  });
});
