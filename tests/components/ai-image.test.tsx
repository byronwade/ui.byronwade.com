/**
 * Exhaustive tests for the AI Image component (adapted from AI Elements).
 *
 * Component source: components/ai-elements/image.tsx
 *
 * Exports:
 *   Image      – renders an `Experimental_GeneratedImage` as an <img> with a
 *                data-URI src, data-slot="image", `edge`-framed, radius-clipped.
 *   ImageProps – the prop type ({ base64, uint8Array, mediaType, alt?, className? }).
 *
 * Behavior contract:
 *   - src = `data:${mediaType};base64,${base64}`
 *   - `uint8Array` is destructured out and must NOT leak onto the DOM element.
 *   - `alt` is forwarded (absent when not provided; empty string for decorative).
 *   - `className` is merged via cn() with the base classes.
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Image, type ImageProps } from "@/components/ai-elements/image";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// 1x1 transparent PNG (base64, no data-URI prefix)
const PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

/** Build a complete, type-valid prop set. */
function makeProps(overrides: Partial<ImageProps> = {}): ImageProps {
  return {
    base64: PNG_BASE64,
    uint8Array: new Uint8Array(),
    mediaType: "image/png",
    alt: "An AI-generated landscape",
    ...overrides,
  };
}

/** Render and return the rendered <img> element. */
function renderImage(overrides: Partial<ImageProps> = {}) {
  const result = render(<Image {...makeProps(overrides)} />);
  const img = result.container.querySelector("img") as HTMLImageElement;
  return { ...result, img };
}

// ---------------------------------------------------------------------------
// 1. Renders without crashing
// ---------------------------------------------------------------------------

describe("Image — renders without crashing", () => {
  it("renders without throwing", () => {
    expect(() => renderImage()).not.toThrow();
  });

  it("renders an <img> element", () => {
    const { img } = renderImage();
    expect(img).toBeInTheDocument();
    expect(img.tagName).toBe("IMG");
  });

  it("renders exactly one element at the root", () => {
    const { container } = renderImage();
    expect(container.children).toHaveLength(1);
    expect(container.firstChild?.nodeName).toBe("IMG");
  });

  it("Image is an exported function", () => {
    expect(typeof Image).toBe("function");
  });
});

// ---------------------------------------------------------------------------
// 2. src — data URI assembly
// ---------------------------------------------------------------------------

describe("Image — src data URI", () => {
  it("builds a data URI from mediaType + base64", () => {
    const { img } = renderImage();
    expect(img.getAttribute("src")).toBe(
      `data:image/png;base64,${PNG_BASE64}`
    );
  });

  it("src begins with the data:image/png;base64, scheme", () => {
    const { img } = renderImage();
    expect(img.getAttribute("src")).toMatch(/^data:image\/png;base64,/);
  });

  it("respects a different mediaType (image/jpeg)", () => {
    const { img } = renderImage({ mediaType: "image/jpeg" });
    expect(img.getAttribute("src")).toBe(
      `data:image/jpeg;base64,${PNG_BASE64}`
    );
  });

  it("respects a different mediaType (image/webp)", () => {
    const { img } = renderImage({ mediaType: "image/webp" });
    expect(img.getAttribute("src")).toMatch(/^data:image\/webp;base64,/);
  });

  it("embeds the provided base64 payload verbatim", () => {
    const { img } = renderImage({ base64: "QUJD" });
    expect(img.getAttribute("src")).toBe("data:image/png;base64,QUJD");
  });
});

// ---------------------------------------------------------------------------
// 3. uint8Array must not leak onto the DOM
// ---------------------------------------------------------------------------

describe("Image — uint8Array stripping", () => {
  it("does not render a uint8Array / uint8array attribute on the <img>", () => {
    const { img } = renderImage({
      uint8Array: new Uint8Array([1, 2, 3, 4]),
    });
    expect(img.hasAttribute("uint8Array")).toBe(false);
    expect(img.hasAttribute("uint8array")).toBe(false);
  });

  it("does not render base64 / mediaType as DOM attributes", () => {
    const { img } = renderImage();
    expect(img.hasAttribute("base64")).toBe(false);
    expect(img.hasAttribute("mediaType")).toBe(false);
    expect(img.hasAttribute("mediatype")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 4. alt forwarding (present / empty / absent)
// ---------------------------------------------------------------------------

describe("Image — alt attribute", () => {
  it("forwards a provided alt string", () => {
    const { img } = renderImage({ alt: "A neon skyline" });
    expect(img).toHaveAttribute("alt", "A neon skyline");
  });

  it("is accessible by its alt text via role=img", () => {
    renderImage({ alt: "A neon skyline" });
    expect(
      screen.getByRole("img", { name: "A neon skyline" })
    ).toBeInTheDocument();
  });

  it("supports an empty alt for decorative images (alt='')", () => {
    const { img } = renderImage({ alt: "" });
    expect(img).toHaveAttribute("alt", "");
    expect(img.getAttribute("alt")).toBe("");
  });

  it("omits the alt attribute entirely when alt is not provided", () => {
    const { img } = renderImage({ alt: undefined });
    expect(img.hasAttribute("alt")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 5. data-slot
// ---------------------------------------------------------------------------

describe("Image — data-slot", () => {
  it("has data-slot='image'", () => {
    const { img } = renderImage();
    expect(img).toHaveAttribute("data-slot", "image");
  });
});

// ---------------------------------------------------------------------------
// 6. base classes (on-system framing)
// ---------------------------------------------------------------------------

describe("Image — base classes", () => {
  it("has the edge hairline utility", () => {
    const { img } = renderImage();
    expect(img.className).toContain("edge");
  });

  it("clips content with overflow-hidden", () => {
    const { img } = renderImage();
    expect(img.className).toContain("overflow-hidden");
  });

  it("uses a scale radius (rounded-lg)", () => {
    const { img } = renderImage();
    expect(img.className).toContain("rounded-lg");
  });

  it("has h-auto", () => {
    const { img } = renderImage();
    expect(img.className).toContain("h-auto");
  });

  it("has max-w-full so it never overflows its container", () => {
    const { img } = renderImage();
    expect(img.className).toContain("max-w-full");
  });

  it("uses a token surface (bg-muted) — no raw color", () => {
    const { img } = renderImage();
    expect(img.className).toContain("bg-muted");
  });

  it("does not use a hard border (edge replaces it)", () => {
    const { img } = renderImage();
    expect(img.className).not.toContain("border-border");
  });
});

// ---------------------------------------------------------------------------
// 7. className passthrough / merge
// ---------------------------------------------------------------------------

describe("Image — className passthrough", () => {
  it("forwards a custom className", () => {
    const { img } = renderImage({ className: "my-custom-class" });
    expect(img.className).toContain("my-custom-class");
  });

  it("merges custom className while keeping base classes", () => {
    const { img } = renderImage({ className: "aspect-video" });
    expect(img.className).toContain("aspect-video");
    expect(img.className).toContain("edge");
    expect(img.className).toContain("rounded-lg");
  });

  it("renders with no className override (base classes only)", () => {
    const { img } = renderImage({ className: undefined });
    expect(img.className).toContain("edge");
    expect(img.className).toContain("max-w-full");
  });
});

// ---------------------------------------------------------------------------
// 8. HTML attribute forwarding
// ---------------------------------------------------------------------------

describe("Image — HTML attribute forwarding", () => {
  it("forwards id", () => {
    const { img } = renderImage({ id: "gen-1" } as Partial<ImageProps>);
    expect(img).toHaveAttribute("id", "gen-1");
  });

  it("forwards data-testid", () => {
    const { img } = renderImage({
      "data-testid": "gen-img",
    } as Partial<ImageProps>);
    expect(img).toHaveAttribute("data-testid", "gen-img");
  });

  it("forwards title", () => {
    const { img } = renderImage({ title: "Prompt: a skyline" } as Partial<ImageProps>);
    expect(img).toHaveAttribute("title", "Prompt: a skyline");
  });

  it("forwards width and height", () => {
    const { img } = renderImage({
      width: 320,
      height: 180,
    } as Partial<ImageProps>);
    expect(img).toHaveAttribute("width", "320");
    expect(img).toHaveAttribute("height", "180");
  });

  it("forwards loading attribute", () => {
    const { img } = renderImage({
      loading: "lazy",
    } as Partial<ImageProps>);
    expect(img).toHaveAttribute("loading", "lazy");
  });
});

// ---------------------------------------------------------------------------
// 9. Re-render behavior
// ---------------------------------------------------------------------------

describe("Image — re-render", () => {
  it("updates src when base64/mediaType change", () => {
    const { rerender, container } = render(<Image {...makeProps()} />);
    let img = container.querySelector("img") as HTMLImageElement;
    expect(img.getAttribute("src")).toBe(`data:image/png;base64,${PNG_BASE64}`);

    rerender(
      <Image {...makeProps({ base64: "QUJD", mediaType: "image/jpeg" })} />
    );
    img = container.querySelector("img") as HTMLImageElement;
    expect(img.getAttribute("src")).toBe("data:image/jpeg;base64,QUJD");
  });

  it("updates alt on re-render", () => {
    const { rerender, container } = render(
      <Image {...makeProps({ alt: "first" })} />
    );
    let img = container.querySelector("img") as HTMLImageElement;
    expect(img).toHaveAttribute("alt", "first");

    rerender(<Image {...makeProps({ alt: "second" })} />);
    img = container.querySelector("img") as HTMLImageElement;
    expect(img).toHaveAttribute("alt", "second");
  });

  it("updates className on re-render", () => {
    const { rerender, container } = render(
      <Image {...makeProps({ className: "class-a" })} />
    );
    let img = container.querySelector("img") as HTMLImageElement;
    expect(img.className).toContain("class-a");

    rerender(<Image {...makeProps({ className: "class-b" })} />);
    img = container.querySelector("img") as HTMLImageElement;
    expect(img.className).toContain("class-b");
    expect(img.className).not.toContain("class-a");
  });
});

// ---------------------------------------------------------------------------
// 10. Accessibility — axe
// ---------------------------------------------------------------------------

describe("Image — accessibility (axe)", () => {
  it("has no axe violations with descriptive alt text", async () => {
    const { container } = render(
      <main>
        <Image {...makeProps({ alt: "A neon city skyline at dusk" })} />
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations for a decorative image (alt='')", async () => {
    const { container } = render(
      <main>
        <Image {...makeProps({ alt: "" })} />
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations inside a figure with caption", async () => {
    const { container } = render(
      <main>
        <figure>
          <Image {...makeProps({ alt: "Generated portrait" })} />
          <figcaption>Generated image</figcaption>
        </figure>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
