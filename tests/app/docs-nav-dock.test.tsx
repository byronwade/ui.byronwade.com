import * as React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { usePathname } from "next/navigation";
import { DocsNavDock } from "@/app/(docs)/_components/docs-nav-dock";

vi.mock("next/navigation", () => ({ usePathname: vi.fn() }));

function stubMatchMedia() {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("prefers-reduced-motion") ? false : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

function stubResizeObserver() {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

beforeEach(() => {
  stubResizeObserver();
  stubMatchMedia();
});

afterEach(() => {
  vi.restoreAllMocks();
  Reflect.deleteProperty(globalThis, "ResizeObserver");
});

describe("DocsNavDock", () => {
  it("mounts on the catalog index without crashing", () => {
    vi.mocked(usePathname).mockReturnValue("/docs");
    expect(() => render(<DocsNavDock />)).not.toThrow();
  });

  it("mounts on a component page with authored variants without crashing", () => {
    vi.mocked(usePathname).mockReturnValue("/docs/button");
    const { container } = render(<DocsNavDock />);
    expect(container).toBeTruthy();
  });
});
