import { render, screen } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import { axe } from "vitest-axe";
import {
  VerifiedBadge,
  type VerifiedBadgeProps,
} from "@/components/ui/verified-badge";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SIZE_CLASS: Record<NonNullable<VerifiedBadgeProps["size"]>, string> = {
  sm: "size-3.5",
  md: "size-4",
};

const ALL_SIZES = ["sm", "md"] as const;
const ALL_VARIANTS = ["default", "artist"] as const;

/** The component root is the first <span> inside the container. */
function getRoot(container: HTMLElement) {
  return container.firstElementChild as HTMLElement;
}

// ─── Smoke ────────────────────────────────────────────────────────────────────

describe("VerifiedBadge – smoke", () => {
  it("renders without crashing with no props", () => {
    const { container } = render(<VerifiedBadge />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders a span element as the root", () => {
    const { container } = render(<VerifiedBadge />);
    expect(getRoot(container).tagName).toBe("SPAN");
  });

  it("root carries data-slot='verified-badge'", () => {
    const { container } = render(<VerifiedBadge />);
    expect(getRoot(container).getAttribute("data-slot")).toBe("verified-badge");
  });

  it("renders an icon (svg) inside the root", () => {
    const { container } = render(<VerifiedBadge />);
    expect(getRoot(container).querySelector("svg")).not.toBeNull();
  });
});

// ─── Role / label ─────────────────────────────────────────────────────────────

describe("VerifiedBadge – role and label", () => {
  it("root has role='img'", () => {
    const { container } = render(<VerifiedBadge />);
    expect(getRoot(container).getAttribute("role")).toBe("img");
  });

  it("exposes the default title 'Verified' as the accessible label", () => {
    render(<VerifiedBadge />);
    expect(screen.getByRole("img", { name: "Verified" })).toBeInTheDocument();
  });

  it("uses a custom title as the accessible label", () => {
    render(<VerifiedBadge title="Verified artist" />);
    expect(
      screen.getByRole("img", { name: "Verified artist" }),
    ).toBeInTheDocument();
  });

  it("inner icon is aria-hidden", () => {
    const { container } = render(<VerifiedBadge />);
    const svg = getRoot(container).querySelector("svg") as SVGElement;
    expect(svg.getAttribute("aria-hidden")).toBe("true");
  });
});

// ─── Default props ────────────────────────────────────────────────────────────

describe("VerifiedBadge – default props", () => {
  it("defaults size to 'sm' → applies size-3.5", () => {
    const { container } = render(<VerifiedBadge />);
    expect(getRoot(container).className).toContain(SIZE_CLASS.sm);
  });

  it("applies the muted-foreground token color by default", () => {
    const { container } = render(<VerifiedBadge />);
    expect(getRoot(container).className).toContain("text-muted-foreground");
  });

  it("is inline-flex and shrink-0 by default", () => {
    const { container } = render(<VerifiedBadge />);
    const cls = getRoot(container).className;
    expect(cls).toContain("inline-flex");
    expect(cls).toContain("shrink-0");
  });
});

// ─── Size prop ────────────────────────────────────────────────────────────────

describe("VerifiedBadge – size prop", () => {
  ALL_SIZES.forEach((size) => {
    it(`size="${size}" → root has class ${SIZE_CLASS[size]}`, () => {
      const { container } = render(<VerifiedBadge size={size} />);
      expect(getRoot(container).className).toContain(SIZE_CLASS[size]);
    });
  });

  it("only one size class present at a time (sm)", () => {
    const { container } = render(<VerifiedBadge size="sm" />);
    const classes = getRoot(container).className.split(/\s+/);
    expect(classes).toContain(SIZE_CLASS.sm);
    expect(classes).not.toContain(SIZE_CLASS.md);
  });

  it("only one size class present at a time (md)", () => {
    const { container } = render(<VerifiedBadge size="md" />);
    const classes = getRoot(container).className.split(/\s+/);
    expect(classes).toContain(SIZE_CLASS.md);
    expect(classes).not.toContain(SIZE_CLASS.sm);
  });
});

// ─── Variant prop ─────────────────────────────────────────────────────────────

describe("VerifiedBadge – variant prop", () => {
  ALL_VARIANTS.forEach((variant) => {
    it(`variant="${variant}" → renders an svg icon`, () => {
      const { container } = render(<VerifiedBadge variant={variant} />);
      expect(getRoot(container).querySelector("svg")).not.toBeNull();
    });
  });

  it("default variant renders the SealCheck icon", () => {
    const { container } = render(<VerifiedBadge variant="default" />);
    const root = getRoot(container);
    expect(root).toHaveAttribute("data-variant", "default");
    expect(root.querySelector("svg")).not.toBeNull();
  });

  it("artist variant renders the MusicNote icon", () => {
    const { container } = render(<VerifiedBadge variant="artist" />);
    const root = getRoot(container);
    expect(root).toHaveAttribute("data-variant", "artist");
    expect(root.querySelector("svg")).not.toBeNull();
  });

  it("variant icons differ between default and artist", () => {
    const { container: a } = render(<VerifiedBadge variant="default" />);
    const { container: b } = render(<VerifiedBadge variant="artist" />);
    const svgA = getRoot(a).querySelector("svg") as SVGElement;
    const svgB = getRoot(b).querySelector("svg") as SVGElement;
    expect(svgA.innerHTML).not.toBe(svgB.innerHTML);
  });
});

// ─── className prop ───────────────────────────────────────────────────────────

describe("VerifiedBadge – className prop", () => {
  it("merges a custom className onto the root", () => {
    const { container } = render(<VerifiedBadge className="my-custom-class" />);
    expect(getRoot(container).className).toContain("my-custom-class");
  });

  it("custom className does not clobber the base color token", () => {
    const { container } = render(<VerifiedBadge className="extra" />);
    expect(getRoot(container).className).toContain("text-muted-foreground");
  });

  it("renders without error when className is an empty string", () => {
    const { container } = render(<VerifiedBadge className="" />);
    expect(container.firstElementChild).toBeInTheDocument();
  });
});

// ─── Size × variant combinations ──────────────────────────────────────────────

describe("VerifiedBadge – size × variant combinations", () => {
  ALL_SIZES.forEach((size) => {
    ALL_VARIANTS.forEach((variant) => {
      it(`size="${size}" variant="${variant}" → correct size class + svg`, () => {
        const { container } = render(
          <VerifiedBadge size={size} variant={variant} />,
        );
        const root = getRoot(container);
        expect(root.className).toContain(SIZE_CLASS[size]);
        expect(root.querySelector("svg")).not.toBeNull();
      });
    });
  });
});

// ─── Usage in context ─────────────────────────────────────────────────────────

describe("VerifiedBadge – usage in context", () => {
  it("renders inline alongside a channel name", () => {
    render(
      <div>
        <span>Lo-Fi Channel</span>
        <VerifiedBadge />
      </div>,
    );
    expect(screen.getByText("Lo-Fi Channel")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Verified" })).toBeInTheDocument();
  });

  it("renders multiple badges with different variants in one tree", () => {
    render(
      <div>
        <VerifiedBadge variant="default" title="Verified channel" />
        <VerifiedBadge variant="artist" title="Verified artist" />
      </div>,
    );
    expect(
      screen.getByRole("img", { name: "Verified channel" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Verified artist" }),
    ).toBeInTheDocument();
  });
});

// ─── Re-render edge cases ─────────────────────────────────────────────────────

describe("VerifiedBadge – re-render", () => {
  it("updates size class across re-renders", () => {
    const { container, rerender } = render(<VerifiedBadge size="sm" />);
    expect(getRoot(container).className).toContain(SIZE_CLASS.sm);
    rerender(<VerifiedBadge size="md" />);
    expect(getRoot(container).className).toContain(SIZE_CLASS.md);
  });

  it("swaps icon when variant changes", () => {
    const { container, rerender } = render(
      <VerifiedBadge variant="default" />,
    );
    expect(getRoot(container)).toHaveAttribute("data-variant", "default");
    rerender(<VerifiedBadge variant="artist" />);
    expect(getRoot(container)).toHaveAttribute("data-variant", "artist");
  });
});

// ─── A11y ─────────────────────────────────────────────────────────────────────

describe("VerifiedBadge – accessibility", () => {
  it("has no axe violations with default props", async () => {
    const { container } = render(<VerifiedBadge />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations for every size", async () => {
    for (const size of ALL_SIZES) {
      const { container } = render(<VerifiedBadge size={size} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  it("has no axe violations for every variant", async () => {
    for (const variant of ALL_VARIANTS) {
      const { container } = render(<VerifiedBadge variant={variant} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  it("has no axe violations when used inline beside text", async () => {
    const { container } = render(
      <span>
        <span>Lo-Fi Channel</span>
        <VerifiedBadge title="Verified channel" />
      </span>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
