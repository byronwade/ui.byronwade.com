import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { AspectRatio } from "@/components/ui/aspect-ratio";

describe("AspectRatio – smoke", () => {
  it("renders without crashing", () => {
    const { container } = render(<AspectRatio ratio={16 / 9} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("sets data-slot='aspect-ratio'", () => {
    render(<AspectRatio ratio={1} data-testid="ar" />);
    expect(screen.getByTestId("ar")).toHaveAttribute("data-slot", "aspect-ratio");
  });

  it("renders children", () => {
    render(
      <AspectRatio ratio={1}>
        <span>Media</span>
      </AspectRatio>
    );
    expect(screen.getByText("Media")).toBeInTheDocument();
  });
});

describe("AspectRatio – ratio prop", () => {
  it.each([
    ["16:9", 16 / 9],
    ["1:1", 1],
    ["4:3", 4 / 3],
    ["3:4", 3 / 4],
    ["21:9", 21 / 9],
  ])("sets the --ratio custom property for %s", (_label, ratio) => {
    render(<AspectRatio ratio={ratio} data-testid="ar" />);
    const el = screen.getByTestId("ar");
    expect(el.style.getPropertyValue("--ratio")).toBe(String(ratio));
    expect(el.getAttribute("style")).toContain(String(ratio));
  });
});

describe("AspectRatio – styling", () => {
  it("applies the relative and aspect-(--ratio) utilities", () => {
    render(<AspectRatio ratio={16 / 9} data-testid="ar" />);
    const el = screen.getByTestId("ar");
    expect(el).toHaveClass("relative");
    expect(el).toHaveClass("aspect-(--ratio)");
  });

  it("merges a custom className while preserving base utilities", () => {
    render(
      <AspectRatio ratio={1} className="rounded-xl border bg-muted" data-testid="ar" />
    );
    const el = screen.getByTestId("ar");
    expect(el).toHaveClass("rounded-xl");
    expect(el).toHaveClass("border");
    expect(el).toHaveClass("bg-muted");
    expect(el).toHaveClass("relative");
    expect(el).toHaveClass("aspect-(--ratio)");
  });
});

describe("AspectRatio – accessibility", () => {
  it("has no axe violations with a labeled image child", async () => {
    const { container } = render(
      <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-xl border">
        <img
          src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
          alt="Scenic mountain landscape preview"
          className="size-full object-cover"
        />
      </AspectRatio>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations as a labeled image region", async () => {
    const { container } = render(
      <AspectRatio ratio={1} role="img" aria-label="Color swatch">
        <div className="size-full bg-muted" />
      </AspectRatio>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
