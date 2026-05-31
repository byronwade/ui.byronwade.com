import { render, screen } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import { axe } from "vitest-axe";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { gradientFor, animalName } from "@/lib/identity";

// ─── helpers ──────────────────────────────────────────────────────────────────

/** Return the single rendered element (GradientAvatar renders a <span>). */
function getAvatar(container: HTMLElement) {
  // aria-hidden span — query directly; it has no role
  return container.querySelector("span") as HTMLElement;
}

// ─── 1. Basic rendering ───────────────────────────────────────────────────────

describe("GradientAvatar – basic rendering", () => {
  it("renders without crashing with a seed string", () => {
    const { container } = render(<GradientAvatar seed="alice" />);
    expect(getAvatar(container)).toBeTruthy();
  });

  it("renders a <span> element", () => {
    const { container } = render(<GradientAvatar seed="test" />);
    expect(getAvatar(container).tagName.toLowerCase()).toBe("span");
  });

  it("renders inline-block", () => {
    const { container } = render(<GradientAvatar seed="test" />);
    const el = getAvatar(container);
    expect(el.className).toMatch(/inline-block/);
  });

  it("renders as shrink-0", () => {
    const { container } = render(<GradientAvatar seed="test" />);
    expect(getAvatar(container).className).toMatch(/shrink-0/);
  });

  it("is always a full pill (rounded-full)", () => {
    const { container } = render(<GradientAvatar seed="test" />);
    expect(getAvatar(container).className).toMatch(/rounded-full/);
  });
});

// ─── 2. aria-hidden ───────────────────────────────────────────────────────────

describe("GradientAvatar – aria-hidden", () => {
  it("has aria-hidden='true' so it is decorative", () => {
    const { container } = render(<GradientAvatar seed="alice" />);
    expect(getAvatar(container)).toHaveAttribute("aria-hidden", "true");
  });

  it("is not part of the accessibility tree (no role by default)", () => {
    const { container } = render(<GradientAvatar seed="alice" />);
    // aria-hidden elements are excluded from the a11y tree;
    // querying by any role should return nothing
    const roles = ["img", "presentation", "button"];
    for (const role of roles) {
      expect(screen.queryByRole(role as any)).toBeNull();
    }
  });
});

// ─── 3. Sizes ─────────────────────────────────────────────────────────────────

describe("GradientAvatar – size prop", () => {
  const sizeClasses: Record<string, string> = {
    sm: "size-6",
    md: "size-8",
    lg: "size-10",
    xl: "size-16",
  };

  for (const [size, expectedClass] of Object.entries(sizeClasses)) {
    it(`size="${size}" applies class "${expectedClass}"`, () => {
      const { container } = render(
        <GradientAvatar seed="cosmos" size={size as "sm" | "md" | "lg" | "xl"} />
      );
      expect(getAvatar(container).className).toContain(expectedClass);
    });
  }

  it("defaults to size='md' when size prop is omitted", () => {
    const { container } = render(<GradientAvatar seed="cosmos" />);
    expect(getAvatar(container).className).toContain("size-8");
  });

  it("each size produces a distinct class (no two sizes share the same size-* class)", () => {
    const classes = Object.keys(sizeClasses).map((size) => {
      const { container } = render(
        <GradientAvatar seed="x" size={size as "sm" | "md" | "lg" | "xl"} />
      );
      return getAvatar(container).className;
    });
    const classSet = new Set(classes);
    expect(classSet.size).toBe(4);
  });
});

// ─── 4. Gradient background-image ────────────────────────────────────────────

describe("GradientAvatar – gradient style", () => {
  it("sets a radial-gradient backgroundImage style", () => {
    const { container } = render(<GradientAvatar seed="alice" />);
    const el = getAvatar(container);
    expect(el.style.backgroundImage).toMatch(/radial-gradient/);
  });

  it("gradient includes 'circle at 30% 30%' origin", () => {
    const { container } = render(<GradientAvatar seed="alice" />);
    expect(getAvatar(container).style.backgroundImage).toMatch(/circle at 30% 30%/);
  });

  it("gradient uses oklch color stops derived from seed", () => {
    const seed = "nova";
    const { from, to } = gradientFor(seed);
    const { container } = render(<GradientAvatar seed={seed} />);
    const bg = getAvatar(container).style.backgroundImage;
    expect(bg).toContain(from);
    expect(bg).toContain(to);
  });

  it("different seeds produce different gradients", () => {
    const render1 = render(<GradientAvatar seed="alpha" />);
    const render2 = render(<GradientAvatar seed="beta" />);
    const bg1 = render1.container.querySelector("span")!.style.backgroundImage;
    const bg2 = render2.container.querySelector("span")!.style.backgroundImage;
    // FNV-1a makes collisions essentially impossible for these seeds
    expect(bg1).not.toBe(bg2);
  });

  it("same seed always produces the same gradient (deterministic)", () => {
    const { from: f1, to: t1 } = gradientFor("echo");
    const { from: f2, to: t2 } = gradientFor("echo");
    expect(f1).toBe(f2);
    expect(t1).toBe(t2);
  });
});

// ─── 5. gradientFor – unit tests ─────────────────────────────────────────────

describe("gradientFor – unit (lib/identity)", () => {
  it("returns an object with from, to, angle", () => {
    const g = gradientFor("seed");
    expect(g).toHaveProperty("from");
    expect(g).toHaveProperty("to");
    expect(g).toHaveProperty("angle");
  });

  it("from and to are valid oklch color strings", () => {
    const { from, to } = gradientFor("test");
    expect(from).toMatch(/^oklch\(/);
    expect(to).toMatch(/^oklch\(/);
  });

  it("angle is a number in [0, 359]", () => {
    const { angle } = gradientFor("test");
    expect(angle).toBeGreaterThanOrEqual(0);
    expect(angle).toBeLessThan(360);
  });

  it("is deterministic across multiple calls with the same seed", () => {
    const g1 = gradientFor("stable");
    const g2 = gradientFor("stable");
    expect(g1).toEqual(g2);
  });

  it("produces distinct results for different seeds (spot-check 5 pairs)", () => {
    const seeds = ["atlas", "beacon", "cedar", "dune", "echo"];
    const froms = seeds.map((s) => gradientFor(s).from);
    const unique = new Set(froms);
    // At minimum 4 of 5 should differ (collision probability near zero)
    expect(unique.size).toBeGreaterThanOrEqual(4);
  });
});

// ─── 6. animalName – unit tests ───────────────────────────────────────────────

describe("animalName – unit (lib/identity)", () => {
  it("returns a two-word string", () => {
    const name = animalName("test");
    expect(name.split(" ")).toHaveLength(2);
  });

  it("is deterministic", () => {
    expect(animalName("x")).toBe(animalName("x"));
  });

  it("first word is a known adjective", () => {
    const ADJECTIVES = [
      "Spectacular", "Injured", "Current", "Verbal", "Theoretical", "Natural",
      "Expensive", "Significant", "Quiet", "Brave", "Sleepy", "Curious",
      "Polished", "Distant", "Gentle", "Rapid",
    ];
    const [adj] = animalName("alice").split(" ");
    expect(ADJECTIVES).toContain(adj);
  });

  it("second word is a known animal", () => {
    const ANIMALS = [
      "Bonobo", "Narwhal", "Pheasant", "Bobcat", "Iguana", "Wasp",
      "Ant", "Slug", "Otter", "Falcon", "Lynx", "Heron",
      "Marten", "Gecko", "Tapir", "Crane",
    ];
    const parts = animalName("alice").split(" ");
    expect(ANIMALS).toContain(parts[1]);
  });

  it("different seeds produce different names (spot-check)", () => {
    const names = ["cardinal-1", "mosaic-2", "tidal-3", "vortex-4"].map(animalName);
    const unique = new Set(names);
    expect(unique.size).toBeGreaterThanOrEqual(3);
  });
});

// ─── 7. className forwarding ──────────────────────────────────────────────────

describe("GradientAvatar – className prop", () => {
  it("merges a custom className alongside the base classes", () => {
    const { container } = render(
      <GradientAvatar seed="alice" className="opacity-50" />
    );
    const el = getAvatar(container);
    expect(el.className).toContain("opacity-50");
    // base classes are still there
    expect(el.className).toContain("rounded-full");
  });

  it("custom className does not erase size class", () => {
    const { container } = render(
      <GradientAvatar seed="alice" size="lg" className="border-2" />
    );
    const el = getAvatar(container);
    expect(el.className).toContain("size-10");
    expect(el.className).toContain("border-2");
  });

  it("no className prop still renders without error", () => {
    expect(() => render(<GradientAvatar seed="alice" />)).not.toThrow();
  });

  it("empty-string className renders without error", () => {
    const { container } = render(<GradientAvatar seed="alice" className="" />);
    expect(getAvatar(container)).toBeTruthy();
  });
});

// ─── 8. Varied / edge-case seeds ─────────────────────────────────────────────

describe("GradientAvatar – seed edge cases", () => {
  it("empty string seed renders without crashing", () => {
    const { container } = render(<GradientAvatar seed="" />);
    expect(getAvatar(container)).toBeTruthy();
  });

  it("numeric-looking string seed renders without crashing", () => {
    const { container } = render(<GradientAvatar seed="12345" />);
    expect(getAvatar(container)).toBeTruthy();
  });

  it("very long seed renders without crashing", () => {
    const long = "a".repeat(500);
    const { container } = render(<GradientAvatar seed={long} />);
    expect(getAvatar(container)).toBeTruthy();
  });

  it("unicode seed renders without crashing", () => {
    const { container } = render(<GradientAvatar seed="🌟" />);
    expect(getAvatar(container)).toBeTruthy();
  });

  it("seed with spaces renders without crashing", () => {
    const { container } = render(<GradientAvatar seed="hello world" />);
    expect(getAvatar(container)).toBeTruthy();
  });

  it("seed with hyphens (real usage pattern like 'nova-1') renders", () => {
    const { container } = render(<GradientAvatar seed="nova-1" />);
    expect(getAvatar(container)).toBeTruthy();
    expect(getAvatar(container).style.backgroundImage).toMatch(/radial-gradient/);
  });
});

// ─── 9. All size + seed combinations (matrix smoke) ──────────────────────────

describe("GradientAvatar – size × seed matrix", () => {
  const sizes = ["sm", "md", "lg", "xl"] as const;
  const seeds = ["atlas", "beacon", "cedar"];

  for (const size of sizes) {
    for (const seed of seeds) {
      it(`size="${size}" seed="${seed}" renders the correct size class`, () => {
        const sizeClasses = { sm: "size-6", md: "size-8", lg: "size-10", xl: "size-16" };
        const { container } = render(<GradientAvatar seed={seed} size={size} />);
        expect(getAvatar(container).className).toContain(sizeClasses[size]);
      });
    }
  }
});

// ─── 10. A11Y ─────────────────────────────────────────────────────────────────

describe("GradientAvatar – accessibility", () => {
  it("has no axe violations when rendered standalone (aria-hidden decorative avatar)", async () => {
    // The component is aria-hidden — it is decorative by design; no violations expected.
    const { container } = render(
      <div>
        <GradientAvatar seed="alice" size="md" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations when used in a list alongside a text label", async () => {
    const { container } = render(
      <ul>
        <li>
          <GradientAvatar seed="alice" size="sm" />
          <span>Alice Chen</span>
        </li>
      </ul>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations across all four sizes", async () => {
    const { container } = render(
      <div>
        <GradientAvatar seed="cosmos" size="sm" />
        <GradientAvatar seed="cosmos" size="md" />
        <GradientAvatar seed="cosmos" size="lg" />
        <GradientAvatar seed="cosmos" size="xl" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations for a stack of avatars with overflow counter", async () => {
    const { container } = render(
      <div aria-label="Collaborators" role="group">
        <GradientAvatar seed="alpha" size="md" />
        <GradientAvatar seed="beta" size="md" />
        <span aria-hidden>+3</span>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations when accompanied by a visually-hidden accessible label", async () => {
    const { container } = render(
      <div>
        <GradientAvatar seed="alice" size="lg" />
        {/* Screen-reader label lives alongside, not inside, the avatar */}
        <span className="sr-only">Alice Chen's avatar</span>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ─── 11. DOM snapshot-style assertions ───────────────────────────────────────

describe("GradientAvatar – DOM structure", () => {
  it("renders exactly one DOM element", () => {
    const { container } = render(<GradientAvatar seed="test" />);
    expect(container.children).toHaveLength(1);
    expect(container.firstElementChild!.tagName.toLowerCase()).toBe("span");
  });

  it("has no children inside the span", () => {
    const { container } = render(<GradientAvatar seed="test" />);
    expect(getAvatar(container).childElementCount).toBe(0);
  });

  it("has no text content", () => {
    const { container } = render(<GradientAvatar seed="test" />);
    expect(getAvatar(container).textContent).toBe("");
  });
});

// ─── 12. Usage patterns from example files ────────────────────────────────────

describe("GradientAvatar – usage patterns (from example files)", () => {
  it("default example: renders alongside name text without crashing", () => {
    const { container } = render(
      <div className="flex items-center gap-3 p-6">
        <GradientAvatar seed="alice" size="md" />
        <div>
          <p className="text-sm font-medium">Alice Chen</p>
          <p className="text-xs text-muted-foreground">Joined 3 days ago</p>
        </div>
      </div>
    );
    expect(screen.getByText("Alice Chen")).toBeInTheDocument();
    expect(getAvatar(container.querySelector(".flex")!)).toBeTruthy();
  });

  it("seeds example: renders 20 unique seeds without crash", () => {
    const seeds = [
      "atlas", "beacon", "cedar", "dune", "echo",
      "fable", "grove", "haven", "iris", "jade",
      "kestrel", "lotus", "mosaic", "nova", "orbit",
      "prism", "quill", "river", "slate", "tide",
    ];
    const { container } = render(
      <div>
        {seeds.map((seed) => <GradientAvatar key={seed} seed={seed} size="lg" />)}
      </div>
    );
    const avatars = container.querySelectorAll("span");
    expect(avatars).toHaveLength(20);
  });

  it("grouped-stack example: renders a stack of 5 avatars", () => {
    const participants = ["atlas-a", "beacon-b", "cedar-c", "dune-d", "echo-e"];
    const { container } = render(
      <div>
        {participants.map((seed) => (
          <GradientAvatar key={seed} seed={seed} size="md" />
        ))}
      </div>
    );
    const avatars = container.querySelectorAll("span");
    expect(avatars).toHaveLength(5);
  });

  it("list-rows example: each member renders a sm avatar with distinct gradient", () => {
    const members = [
      { seed: "nova-1", name: "Remarkable Falcon" },
      { seed: "prism-2", name: "Curious Otter" },
      { seed: "tide-3", name: "Gentle Lynx" },
    ];
    const { container } = render(
      <ul>
        {members.map((m) => (
          <li key={m.seed}>
            <GradientAvatar seed={m.seed} size="sm" />
            <span>{m.name}</span>
          </li>
        ))}
      </ul>
    );
    const avatars = container.querySelectorAll("span[aria-hidden]");
    expect(avatars).toHaveLength(3);
    const bgs = Array.from(avatars).map(
      (el) => (el as HTMLElement).style.backgroundImage
    );
    expect(new Set(bgs).size).toBe(3);
  });

  it("with-name-badge example: animalName generates readable label alongside avatar", () => {
    const seeds = ["cardinal-1", "mosaic-2", "tidal-3", "vortex-4"];
    const { container } = render(
      <div>
        {seeds.map((seed) => (
          <div key={seed}>
            <GradientAvatar seed={seed} size="sm" />
            <span>{animalName(seed)}</span>
          </div>
        ))}
      </div>
    );
    const names = screen.getAllByText(/\w+ \w+/);
    expect(names.length).toBeGreaterThanOrEqual(4);
    // Every label should be two words
    names.slice(0, 4).forEach((el) => {
      expect(el.textContent!.split(" ")).toHaveLength(2);
    });
  });
});
