/**
 * Tests for <Safari /> (components/ui/safari.tsx)
 *
 * Safari is a presentational browser-frame mockup:
 *  - Root <div data-slot="safari"> with aspect-ratio + merged className/style
 *  - Optional <video> when videoSrc is set; optional <img> when imageSrc is set (no video)
 *  - SVG chrome uses token fills (fill-muted / fill-card / fill-muted-foreground)
 *  - `mode="default"` renders the toolbar action icons; `mode="simple"` omits them
 *  - `url` is rendered as <text> inside the address bar
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

import { Safari } from "@/components/ui/safari";

describe("Safari — default render", () => {
  it("renders without crashing", () => {
    const { container } = render(<Safari />);
    expect(container.querySelector('[data-slot="safari"]')).not.toBeNull();
  });

  it("has data-slot='safari'", () => {
    const { container } = render(<Safari />);
    expect(container.firstChild).toHaveAttribute("data-slot", "safari");
  });

  it("renders an svg frame", () => {
    const { container } = render(<Safari />);
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("applies the Safari aspect-ratio inline style", () => {
    const { container } = render(<Safari />);
    const root = container.querySelector('[data-slot="safari"]') as HTMLElement;
    expect(root.style.aspectRatio).toBe("1203/753");
  });

  it("renders no video or img when no media provided", () => {
    const { container } = render(<Safari />);
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("img")).toBeNull();
  });
});

describe("Safari — url", () => {
  it("renders the url string in the address bar", () => {
    render(<Safari url="example.com" />);
    expect(screen.getByText("example.com")).toBeInTheDocument();
  });
});

describe("Safari — media variants", () => {
  it("renders an <img> when imageSrc is provided (and no video)", () => {
    const { container } = render(<Safari imageSrc="/shot.png" />);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("src", "/shot.png");
    expect(container.querySelector("video")).toBeNull();
  });

  it("renders a <video> when videoSrc is provided", () => {
    const { container } = render(<Safari videoSrc="/clip.mp4" />);
    const video = container.querySelector("video");
    expect(video).not.toBeNull();
    expect(video).toHaveAttribute("src", "/clip.mp4");
  });

  it("prefers video over image when both are provided", () => {
    const { container } = render(
      <Safari videoSrc="/clip.mp4" imageSrc="/shot.png" />,
    );
    expect(container.querySelector("video")).not.toBeNull();
    expect(container.querySelector("img")).toBeNull();
  });

  it("applies the screen-punch mask to the chrome group when media is present", () => {
    const { container } = render(<Safari imageSrc="/shot.png" />);
    const masked = container.querySelector('g[mask="url(#safariPunch)"]');
    expect(masked).not.toBeNull();
  });

  it("does not mask the chrome group when no media is present", () => {
    const { container } = render(<Safari />);
    expect(container.querySelector('g[mask="url(#safariPunch)"]')).toBeNull();
  });
});

describe("Safari — mode", () => {
  it("renders toolbar action icons in default mode", () => {
    const { container } = render(<Safari mode="default" />);
    // default mode adds several extra luminosity icon groups
    const groups = container.querySelectorAll("g.mix-blend-luminosity");
    expect(groups.length).toBeGreaterThan(2);
  });

  it("omits toolbar action icons in simple mode", () => {
    const { container: def } = render(<Safari mode="default" />);
    const { container: simple } = render(<Safari mode="simple" />);
    const defCount = def.querySelectorAll("g.mix-blend-luminosity").length;
    const simpleCount = simple.querySelectorAll("g.mix-blend-luminosity").length;
    expect(simpleCount).toBeLessThan(defCount);
  });
});

describe("Safari — className / style / passthrough", () => {
  it("merges custom className", () => {
    const { container } = render(<Safari className="custom-frame" />);
    expect(container.firstChild).toHaveClass("custom-frame");
    expect(container.firstChild).toHaveClass("relative");
  });

  it("merges custom inline style with the aspect-ratio", () => {
    const { container } = render(<Safari style={{ maxWidth: 320 }} />);
    const root = container.querySelector('[data-slot="safari"]') as HTMLElement;
    expect(root.style.maxWidth).toBe("320px");
    expect(root.style.aspectRatio).toBe("1203/753");
  });

  it("passes through arbitrary props (id, data-*)", () => {
    const { container } = render(<Safari id="hero-frame" data-testid="frame" />);
    expect(container.querySelector("#hero-frame")).not.toBeNull();
    expect(screen.getByTestId("frame")).toBeInTheDocument();
  });

  it("uses token fills (no raw hex) on the chrome", () => {
    const { container } = render(<Safari />);
    expect(container.querySelector(".fill-muted")).not.toBeNull();
    expect(container.querySelector(".fill-card")).not.toBeNull();
    expect(container.innerHTML).not.toMatch(/#[0-9a-fA-F]{6}/);
  });
});

describe("Safari — accessibility", () => {
  it("has no axe violations (bare frame)", async () => {
    const { container } = render(<Safari url="byronwade.com" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations (with image)", async () => {
    const { container } = render(<Safari imageSrc="/shot.png" url="byronwade.com" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
