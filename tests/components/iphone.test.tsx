/**
 * Tests for <Iphone /> (components/ui/iphone.tsx)
 *
 * Presentational phone-frame mockup:
 *  - Root <div data-slot="iphone"> with aspect-ratio + merged className/style
 *  - Optional <video> (videoSrc) or <img> (src, when no video)
 *  - SVG body uses token fills (fill-muted / fill-card); screenPunch mask when media present
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

import { Iphone } from "@/components/ui/iphone";

describe("Iphone — default render", () => {
  it("renders without crashing", () => {
    const { container } = render(<Iphone />);
    expect(container.querySelector('[data-slot="iphone"]')).not.toBeNull();
  });

  it("has data-slot='iphone'", () => {
    const { container } = render(<Iphone />);
    expect(container.firstChild).toHaveAttribute("data-slot", "iphone");
  });

  it("renders an svg frame", () => {
    const { container } = render(<Iphone />);
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("applies the phone aspect-ratio inline style", () => {
    const { container } = render(<Iphone />);
    const root = container.querySelector('[data-slot="iphone"]') as HTMLElement;
    expect(root.style.aspectRatio).toBe("433/882");
  });

  it("renders no media when none provided", () => {
    const { container } = render(<Iphone />);
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("img")).toBeNull();
  });
});

describe("Iphone — media variants", () => {
  it("renders an <img> when src is provided", () => {
    const { container } = render(<Iphone src="/shot.png" />);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("src", "/shot.png");
  });

  it("renders a <video> when videoSrc is provided", () => {
    const { container } = render(<Iphone videoSrc="/clip.mp4" />);
    expect(container.querySelector("video")).toHaveAttribute("src", "/clip.mp4");
  });

  it("prefers video over image when both provided", () => {
    const { container } = render(<Iphone videoSrc="/clip.mp4" src="/shot.png" />);
    expect(container.querySelector("video")).not.toBeNull();
    expect(container.querySelector("img")).toBeNull();
  });

  it("masks the body group when media is present", () => {
    const { container } = render(<Iphone src="/shot.png" />);
    expect(container.querySelector('g[mask="url(#screenPunch)"]')).not.toBeNull();
  });

  it("does not mask when no media is present", () => {
    const { container } = render(<Iphone />);
    expect(container.querySelector('g[mask="url(#screenPunch)"]')).toBeNull();
  });
});

describe("Iphone — className / style / passthrough", () => {
  it("merges custom className (no 'undefined' leak)", () => {
    const { container } = render(<Iphone className="custom" />);
    expect(container.firstChild).toHaveClass("custom");
    expect((container.firstChild as HTMLElement).className).not.toMatch(/undefined/);
  });

  it("does not leak 'undefined' into className when omitted", () => {
    const { container } = render(<Iphone />);
    expect((container.firstChild as HTMLElement).className).not.toMatch(/undefined/);
  });

  it("merges custom inline style with aspect-ratio", () => {
    const { container } = render(<Iphone style={{ maxWidth: 240 }} />);
    const root = container.querySelector('[data-slot="iphone"]') as HTMLElement;
    expect(root.style.maxWidth).toBe("240px");
    expect(root.style.aspectRatio).toBe("433/882");
  });

  it("passes through arbitrary props", () => {
    render(<Iphone data-testid="phone" id="hero" />);
    expect(screen.getByTestId("phone")).toHaveAttribute("id", "hero");
  });

  it("uses token fills (no raw hex)", () => {
    const { container } = render(<Iphone />);
    expect(container.querySelector(".fill-muted")).not.toBeNull();
    expect(container.querySelector(".fill-card")).not.toBeNull();
    expect(container.innerHTML).not.toMatch(/#[0-9a-fA-F]{6}/);
  });
});

describe("Iphone — accessibility", () => {
  it("has no axe violations (bare frame)", async () => {
    const { container } = render(<Iphone />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations (with image)", async () => {
    const { container } = render(<Iphone src="/shot.png" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
