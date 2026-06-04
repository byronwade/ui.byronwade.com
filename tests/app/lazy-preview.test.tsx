import * as React from "react";
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { LazyPreview, fitScale } from "@/app/(docs)/_components/lazy-preview";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fitScale", () => {
  it("returns null until both boxes are known", () => {
    expect(fitScale({ w: 0, h: 0 }, { w: 100, h: 100 })).toBeNull();
    expect(fitScale({ w: 400, h: 250 }, { w: 0, h: 0 })).toBeNull();
  });
  it("scales a large component down to fit (limited by the tighter axis)", () => {
    // 800x600 into 400x250 -> min(0.5, 0.4166) = 0.4166
    expect(fitScale({ w: 400, h: 250 }, { w: 800, h: 600 })).toBeCloseTo(0.4167, 3);
  });
  it("caps upscaling of a tiny component", () => {
    // 120x40 into 400x250 would be ~3.3x; capped to max 1.5
    expect(fitScale({ w: 400, h: 250 }, { w: 120, h: 40 })).toBe(1.5);
    expect(fitScale({ w: 400, h: 250 }, { w: 120, h: 40 }, { max: 2 })).toBe(2);
  });
});

describe("LazyPreview", () => {
  it("shows only the placeholder when IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<LazyPreview src="/preview/components/button" title="Button preview" placeholder={<span>mark</span>} />);
    expect(screen.getByText("mark")).toBeInTheDocument();
    expect(document.querySelector("iframe")).toBeNull();
  });

  it("mounts the iframe once the container intersects the viewport", () => {
    let trigger: ((entries: Array<{ isIntersecting: boolean }>) => void) | undefined;
    const observe = vi.fn();
    const disconnect = vi.fn();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(cb: (entries: Array<{ isIntersecting: boolean }>) => void) {
          trigger = cb;
        }
        observe = observe;
        disconnect = disconnect;
        unobserve = vi.fn();
        takeRecords = vi.fn();
      },
    );

    render(<LazyPreview src="/preview/components/button" title="Button preview" placeholder={<span>mark</span>} />);
    expect(document.querySelector("iframe")).toBeNull();
    expect(observe).toHaveBeenCalled();

    act(() => trigger!([{ isIntersecting: true }]));

    const iframe = document.querySelector("iframe")!;
    expect(iframe).not.toBeNull();
    expect(iframe.getAttribute("src")).toBe("/preview/components/button");
    expect(iframe.getAttribute("title")).toBe("Button preview");
    expect(disconnect).toHaveBeenCalled();
  });
});
