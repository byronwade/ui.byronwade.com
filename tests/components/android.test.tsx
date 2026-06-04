/**
 * Tests for <Android /> (components/ui/android.tsx)
 *
 * Presentational Android phone-frame mockup rendered as a single <svg data-slot="android">:
 *  - width/height props drive the viewBox
 *  - Optional <image href={src}> and/or <foreignObject><video> overlay the screen
 *  - Body uses token fills (fill-muted / fill-card)
 */

import * as React from "react";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";

import { Android } from "@/components/ui/android";

describe("Android — default render", () => {
  it("renders an svg with data-slot='android'", () => {
    const { container } = render(<Android />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("data-slot", "android");
  });

  it("uses the default viewBox derived from default width/height", () => {
    const { container } = render(<Android />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "viewBox",
      "0 0 433 882",
    );
  });

  it("renders neither image nor video by default", () => {
    const { container } = render(<Android />);
    expect(container.querySelector("image")).toBeNull();
    expect(container.querySelector("video")).toBeNull();
  });
});

describe("Android — sizing", () => {
  it("honors custom width/height in the viewBox and attributes", () => {
    const { container } = render(<Android width={200} height={400} />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("viewBox", "0 0 200 400");
    expect(svg).toHaveAttribute("width", "200");
    expect(svg).toHaveAttribute("height", "400");
  });
});

describe("Android — media variants", () => {
  it("renders an <image> when src is provided", () => {
    const { container } = render(<Android src="/shot.png" />);
    const image = container.querySelector("image");
    expect(image).not.toBeNull();
    expect(image).toHaveAttribute("href", "/shot.png");
  });

  it("renders a <video> inside foreignObject when videoSrc is provided", () => {
    const { container } = render(<Android videoSrc="/clip.mp4" />);
    expect(container.querySelector("foreignObject video")).toHaveAttribute(
      "src",
      "/clip.mp4",
    );
  });

  it("can render both image and video overlays together", () => {
    const { container } = render(<Android src="/shot.png" videoSrc="/clip.mp4" />);
    expect(container.querySelector("image")).not.toBeNull();
    expect(container.querySelector("video")).not.toBeNull();
  });
});

describe("Android — passthrough / tokens", () => {
  it("passes through className and arbitrary svg props", () => {
    const { container } = render(<Android className="size-full" aria-label="App" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveClass("size-full");
    expect(svg).toHaveAttribute("aria-label", "App");
  });

  it("uses token fills (no raw hex)", () => {
    const { container } = render(<Android />);
    expect(container.querySelector(".fill-muted")).not.toBeNull();
    expect(container.querySelector(".fill-card")).not.toBeNull();
    expect(container.innerHTML).not.toMatch(/#[0-9a-fA-F]{6}/);
  });
});

describe("Android — accessibility", () => {
  it("has no axe violations (decorative frame)", async () => {
    const { container } = render(<Android aria-hidden="true" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
