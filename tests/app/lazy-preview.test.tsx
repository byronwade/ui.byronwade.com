import * as React from "react";
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { LazyPreview } from "@/app/(docs)/_components/lazy-preview";

afterEach(() => {
  vi.unstubAllGlobals();
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
