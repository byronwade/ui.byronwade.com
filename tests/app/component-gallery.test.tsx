import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ComponentGallery } from "@/app/(docs)/_components/component-gallery";
import type { CatalogItem } from "@/content/catalog";

const items: CatalogItem[] = [
  { slug: "button", name: "Button", group: "Primitives", description: "A button.", tags: ["interactive", "action"], variantCount: 18, depCount: 2, href: "/docs/button", search: "button primitives a button interactive action ghost solid" },
  { slug: "card", name: "Card", group: "Primitives", description: "A card.", tags: ["layout"], variantCount: 1, depCount: 0, href: "/docs/card", search: "card primitives a card layout" },
  { slug: "alert", name: "Alert", group: "Feedback", description: "An alert.", tags: ["status"], variantCount: 1, depCount: 0, href: "/docs/alert", search: "alert feedback an alert status" },
];

describe("ComponentGallery", () => {
  it("renders a linked card per item with name, description, and variant count", () => {
    render(<ComponentGallery items={items} />);
    expect(screen.getByRole("link", { name: /Button/ })).toHaveAttribute("href", "/docs/button");
    expect(screen.getByText("18 variants")).toBeInTheDocument();
    expect(screen.getAllByText("1 variant")).toHaveLength(2);
    expect(screen.getByText("A button.")).toBeInTheDocument();
  });

  it("free-text search filters the grid (matches variant tokens in the haystack)", async () => {
    const user = userEvent.setup();
    render(<ComponentGallery items={items} />);
    await user.type(screen.getByRole("searchbox", { name: /search components/i }), "ghost");
    expect(screen.getByRole("link", { name: /Button/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Card/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Alert/ })).not.toBeInTheDocument();
  });

  it("shows an empty state and clears it", async () => {
    const user = userEvent.setup();
    render(<ComponentGallery items={items} />);
    const box = screen.getByRole("searchbox", { name: /search components/i });
    await user.type(box, "zzzznomatch");
    expect(screen.getByText(/No components match/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Clear all filters/i }));
    expect(screen.getByRole("link", { name: /Button/ })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<ComponentGallery items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
