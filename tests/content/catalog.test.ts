import { describe, it, expect } from "vitest";
import { catalogItems, filterCatalog, type CatalogItem } from "@/content/catalog";
import { components } from "@/content/components";

describe("catalogItems", () => {
  const items = catalogItems();

  it("returns one item per component, sorted A–Z by name", () => {
    expect(items.length).toBe(components.length);
    const names = items.map((i) => i.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it("button item carries group, variant count, facet tags, and a searchable haystack", () => {
    const button = items.find((i) => i.slug === "button")!;
    expect(button.group).toBe("Primitives");
    expect(button.variantCount).toBeGreaterThanOrEqual(18);
    expect(button.tags).toContain("interactive");
    expect(button.href).toBe("/docs/button");
    expect(button.search).toContain("ghost"); // sourced from variant tags
    expect(button.search).toBe(button.search.toLowerCase());
  });

  it("uses the example count for components without authored variants", () => {
    // accordion has no authored `variants`; with a counts map it reports the real count.
    const withCounts = catalogItems({ accordion: 7 });
    const accordion = withCounts.find((i) => i.slug === "accordion")!;
    expect(accordion.variantCount).toBe(7);
    // button keeps its authored count regardless of the example count passed in.
    const button = withCounts.find((i) => i.slug === "button")!;
    expect(button.variantCount).toBeGreaterThanOrEqual(18);
  });
});

describe("filterCatalog", () => {
  const items: CatalogItem[] = [
    { slug: "button", name: "Button", group: "Primitives", description: "A button.", tags: ["interactive", "action"], variantCount: 18, depCount: 2, href: "/docs/button", search: "button primitives a button interactive action ghost solid" },
    { slug: "card", name: "Card", group: "Primitives", description: "A card.", tags: ["layout"], variantCount: 1, depCount: 2, href: "/docs/card", search: "card primitives a card layout" },
    { slug: "alert", name: "Alert", group: "Feedback", description: "An alert.", tags: ["status"], variantCount: 1, depCount: 2, href: "/docs/alert", search: "alert feedback an alert status" },
  ];
  const base = { query: "", groups: [], tags: [], sort: "featured" as const };

  it("returns all items with no filters", () => {
    expect(filterCatalog(items, base)).toHaveLength(3);
  });
  it("free-text query matches the haystack (incl. variant tokens)", () => {
    const r = filterCatalog(items, { ...base, query: "GHOST" });
    expect(r.map((i) => i.slug)).toEqual(["button"]);
  });
  it("group facet narrows to matching groups", () => {
    expect(filterCatalog(items, { ...base, groups: ["Feedback"] }).map((i) => i.slug)).toEqual(["alert"]);
  });
  it("tag facet matches any selected tag", () => {
    expect(filterCatalog(items, { ...base, tags: ["layout"] }).map((i) => i.slug)).toEqual(["card"]);
  });
  it("az sort orders by name", () => {
    expect(filterCatalog(items, { ...base, sort: "az" }).map((i) => i.name)).toEqual(["Alert", "Button", "Card"]);
  });
  it("returns empty when nothing matches", () => {
    expect(filterCatalog(items, { ...base, query: "zzz" })).toHaveLength(0);
  });
});
