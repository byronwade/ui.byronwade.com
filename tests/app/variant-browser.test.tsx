import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { VariantBrowser, filterVariants, type VariantView } from "@/app/(docs)/_components/variant-browser";

const variants: VariantView[] = [
  { id: "solid", name: "Solid", tags: ["variant:default", "emphasis:high"], install: "npx shadcn@latest add @byronwade/button", preview: <button>Solid</button>, code: "<Button>Save</Button>" },
  { id: "ghost", name: "Ghost", tags: ["variant:ghost", "emphasis:low"], install: "npx shadcn@latest add @byronwade/button", preview: <button>Ghost</button>, code: "<Button variant=\"ghost\">Learn</Button>" },
  { id: "icon", name: "Icon only", tags: ["shape:icon"], install: "npx shadcn@latest add @byronwade/button", preview: <button>Icon</button>, code: "<Button size=\"icon\" />" },
];

describe("filterVariants", () => {
  const base = { query: "", tags: [] };
  it("returns all with no filter", () => {
    expect(filterVariants(variants, base)).toHaveLength(3);
  });
  it("query matches name / id / tags", () => {
    expect(filterVariants(variants, { ...base, query: "GHOST" }).map((v) => v.id)).toEqual(["ghost"]);
    expect(filterVariants(variants, { ...base, query: "shape:icon" }).map((v) => v.id)).toEqual(["icon"]);
  });
  it("tag facet matches any selected tag", () => {
    expect(filterVariants(variants, { ...base, tags: ["emphasis:low"] }).map((v) => v.id)).toEqual(["ghost"]);
  });
  it("empty when nothing matches", () => {
    expect(filterVariants(variants, { ...base, query: "zzz" })).toHaveLength(0);
  });
});

describe("VariantBrowser", () => {
  it("renders an anchored block per variant with name, tags, and install", () => {
    const { container } = render(<VariantBrowser variants={variants} />);
    expect(container.querySelector("#solid")).not.toBeNull();
    expect(container.querySelector("#ghost")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Solid" })).toBeInTheDocument();
    expect(screen.getByText("variant:ghost")).toBeInTheDocument();
    expect(screen.getAllByText(/add @byronwade\/button/).length).toBeGreaterThanOrEqual(3);
  });

  it("free-text search filters the rendered blocks", async () => {
    const user = userEvent.setup();
    const { container } = render(<VariantBrowser variants={variants} />);
    await user.type(screen.getByRole("searchbox", { name: /search variants/i }), "ghost");
    expect(container.querySelector("#ghost")).not.toBeNull();
    expect(container.querySelector("#solid")).toBeNull();
  });

  it("shows an empty state when nothing matches", async () => {
    const user = userEvent.setup();
    render(<VariantBrowser variants={variants} />);
    await user.type(screen.getByRole("searchbox", { name: /search variants/i }), "zzz");
    expect(screen.getByText(/No variants match/i)).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<VariantBrowser variants={variants} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
