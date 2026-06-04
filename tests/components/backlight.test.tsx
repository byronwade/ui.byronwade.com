/**
 * Tests for <Backlight /> (components/ui/backlight.tsx)
 *
 * Wraps a child in a saturated, blurred glow via an inline SVG filter referenced
 * by a useId()-generated id. We assert the filter wiring, blur prop, child
 * rendering, className passthrough, and a11y.
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

import { Backlight } from "@/components/ui/backlight";

describe("Backlight — default render", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <Backlight>
        <div>child</div>
      </Backlight>,
    );
    expect(container.querySelector('[data-slot="backlight"]')).not.toBeNull();
  });

  it("renders its child", () => {
    render(
      <Backlight>
        <div>glowing</div>
      </Backlight>,
    );
    expect(screen.getByText("glowing")).toBeInTheDocument();
  });

  it("renders an svg filter", () => {
    const { container } = render(
      <Backlight>
        <span>x</span>
      </Backlight>,
    );
    expect(container.querySelector("filter")).not.toBeNull();
    expect(container.querySelector("feGaussianBlur")).not.toBeNull();
    expect(container.querySelector("feColorMatrix")).not.toBeNull();
    expect(container.querySelector("feComposite")).not.toBeNull();
  });

  it("applies the filter url to the content wrapper", () => {
    const { container } = render(
      <Backlight>
        <span>x</span>
      </Backlight>,
    );
    const filter = container.querySelector("filter")!;
    const id = filter.getAttribute("id")!;
    const content = container.querySelector(
      '[data-slot="backlight-content"]',
    ) as HTMLElement;
    // jsdom normalizes url(#id) → url("#id"); assert it references the filter id.
    expect(content.style.filter).toMatch(
      new RegExp(`^url\\(["']?#${id}["']?\\)$`),
    );
  });

  it("renders nothing for the child slot when no children passed", () => {
    const { container } = render(<Backlight />);
    const content = container.querySelector('[data-slot="backlight-content"]');
    expect(content).not.toBeNull();
    expect(content).toBeEmptyDOMElement();
  });
});

describe("Backlight — blur prop", () => {
  it("defaults blur to 20", () => {
    const { container } = render(
      <Backlight>
        <span>x</span>
      </Backlight>,
    );
    expect(container.querySelector("feGaussianBlur")).toHaveAttribute(
      "stdDeviation",
      "20",
    );
  });

  it("honors a custom blur value", () => {
    const { container } = render(
      <Backlight blur={8}>
        <span>x</span>
      </Backlight>,
    );
    expect(container.querySelector("feGaussianBlur")).toHaveAttribute(
      "stdDeviation",
      "8",
    );
  });
});

describe("Backlight — className / a11y", () => {
  it("merges className onto the root", () => {
    const { container } = render(
      <Backlight className="my-wrap">
        <span>x</span>
      </Backlight>,
    );
    expect(container.firstChild).toHaveClass("my-wrap");
  });

  it("marks the offscreen filter svg as aria-hidden", () => {
    const { container } = render(
      <Backlight>
        <span>x</span>
      </Backlight>,
    );
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("generates unique filter ids across instances", () => {
    const { container } = render(
      <>
        <Backlight>
          <span>a</span>
        </Backlight>
        <Backlight>
          <span>b</span>
        </Backlight>
      </>,
    );
    const ids = Array.from(container.querySelectorAll("filter")).map((f) =>
      f.getAttribute("id"),
    );
    expect(ids[0]).not.toBe(ids[1]);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Backlight>
        <button type="button">Click</button>
      </Backlight>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
