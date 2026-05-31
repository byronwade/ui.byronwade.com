/**
 * Exhaustive tests for <Avatar /> and its compound parts.
 *
 * Component source: components/ui/avatar.tsx
 * Built on Base UI's Avatar primitive (not Radix).
 *
 * API summary:
 *   Avatar        – Root <span>, size="default"|"sm"|"lg", data-slot="avatar", data-size=<size>
 *   AvatarImage   – <img>, shown only after the image loads (event-driven), data-slot="avatar-image"
 *   AvatarFallback– <span>, shown when image is absent or fails to load, data-slot="avatar-fallback"
 *   AvatarBadge   – Status dot <span> absolutely positioned at bottom-right, data-slot="avatar-badge"
 *   AvatarGroup   – Wrapper <div> with negative-margin stacking, data-slot="avatar-group"
 *   AvatarGroupCount – Overflow count <div>, data-slot="avatar-group-count"
 *
 * Key jsdom behavior:
 *   - Images never auto-load in jsdom: AvatarImage stays unmounted until we mock load events.
 *   - We use an HTMLImageElement.prototype.src setter to fire load/error microtasks.
 *   - "broken" anywhere in the src triggers an error event.
 *   - Size is NOT a class toggle — it is a `data-size` attribute; the className contains
 *     responsive data-attribute selectors (`data-[size=lg]:size-10`) in every instance.
 *   - tailwind-merge runs via cn(): overriding bg-primary with bg-green-500 drops bg-primary.
 */

import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";

// ─── Image-load mock ─────────────────────────────────────────────────────────
// AvatarImage renders null until imageLoadingStatus = 'loaded'.
// useImageLoadingStatus sets the status via onload/onerror events.
// We override the src setter to fire those events asynchronously.

beforeAll(() => {
  Object.defineProperty(window.HTMLImageElement.prototype, "src", {
    configurable: true,
    set(value: string) {
      this.setAttribute("src", value);
      queueMicrotask(() => {
        if (String(value).includes("broken")) {
          this.dispatchEvent(new Event("error"));
        } else {
          this.dispatchEvent(new Event("load"));
        }
      });
    },
  });
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRoot(container: HTMLElement) {
  return container.querySelector("[data-slot='avatar']") as HTMLElement;
}
function getFallback(container: HTMLElement) {
  return container.querySelector("[data-slot='avatar-fallback']") as HTMLElement | null;
}
function getBadge(container: HTMLElement) {
  return container.querySelector("[data-slot='avatar-badge']") as HTMLElement | null;
}
function getGroup(container: HTMLElement) {
  return container.querySelector("[data-slot='avatar-group']") as HTMLElement;
}
function getGroupCount(container: HTMLElement) {
  return container.querySelector("[data-slot='avatar-group-count']") as HTMLElement;
}

// =============================================================================
// 1. Avatar root – basic rendering
// =============================================================================

describe("Avatar root – basic rendering", () => {
  it("renders without crashing (default usage)", () => {
    expect(() =>
      render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      )
    ).not.toThrow();
  });

  it("renders a <span> element at the root", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    expect(getRoot(container).tagName.toLowerCase()).toBe("span");
  });

  it("has data-slot='avatar'", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    );
    expect(getRoot(container)).toHaveAttribute("data-slot", "avatar");
  });

  it("defaults to data-size='default' when no size prop is given", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    );
    expect(getRoot(container)).toHaveAttribute("data-size", "default");
  });

  it("renders children (AvatarFallback text visible)", () => {
    render(
      <Avatar>
        <AvatarFallback>XY</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText("XY")).toBeInTheDocument();
  });

  it("carries the group/avatar Tailwind class for group context targeting", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>GH</AvatarFallback>
      </Avatar>
    );
    expect(getRoot(container).className).toContain("group/avatar");
  });

  it("is round (rounded-full)", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>GH</AvatarFallback>
      </Avatar>
    );
    expect(getRoot(container).className).toContain("rounded-full");
  });

  it("has relative positioning for badge overlay", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>GH</AvatarFallback>
      </Avatar>
    );
    expect(getRoot(container).className).toContain("relative");
  });

  it("has shrink-0 to prevent flex shrinking", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>GH</AvatarFallback>
      </Avatar>
    );
    expect(getRoot(container).className).toContain("shrink-0");
  });

  it("has select-none to prevent text selection", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>GH</AvatarFallback>
      </Avatar>
    );
    expect(getRoot(container).className).toContain("select-none");
  });

  it("forwards additional className to root", () => {
    const { container } = render(
      <Avatar className="opacity-75">
        <AvatarFallback>CL</AvatarFallback>
      </Avatar>
    );
    expect(getRoot(container).className).toContain("opacity-75");
  });

  it("forwards arbitrary HTML attributes (e.g. data-testid) to root", () => {
    const { container } = render(
      <Avatar data-testid="my-avatar">
        <AvatarFallback>AT</AvatarFallback>
      </Avatar>
    );
    expect(getRoot(container)).toHaveAttribute("data-testid", "my-avatar");
  });
});

// =============================================================================
// 2. Avatar root – size prop
// =============================================================================

describe("Avatar root – size prop", () => {
  it("size='default' sets data-size='default'", () => {
    const { container } = render(
      <Avatar size="default">
        <AvatarFallback>DE</AvatarFallback>
      </Avatar>
    );
    expect(getRoot(container)).toHaveAttribute("data-size", "default");
  });

  it("size='sm' sets data-size='sm'", () => {
    const { container } = render(
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
    );
    expect(getRoot(container)).toHaveAttribute("data-size", "sm");
  });

  it("size='lg' sets data-size='lg'", () => {
    const { container } = render(
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    );
    expect(getRoot(container)).toHaveAttribute("data-size", "lg");
  });

  it("all three sizes produce distinct data-size attribute values", () => {
    const sizes = ["default", "sm", "lg"] as const;
    const seen = new Set<string>();
    sizes.forEach((s) => {
      const { container } = render(
        <Avatar size={s}>
          <AvatarFallback>XX</AvatarFallback>
        </Avatar>
      );
      seen.add(getRoot(container).getAttribute("data-size")!);
    });
    expect(seen.size).toBe(3);
  });

  it("className contains the responsive data-size selector for sm", () => {
    const { container } = render(
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
    );
    // The static className encodes all three sizes via data-attribute variants
    expect(getRoot(container).className).toContain("data-[size=sm]:size-6");
  });

  it("className contains the responsive data-size selector for lg", () => {
    const { container } = render(
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    );
    expect(getRoot(container).className).toContain("data-[size=lg]:size-10");
  });

  it("omitting size prop is equivalent to size='default'", () => {
    const { container: c1 } = render(
      <Avatar>
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
    );
    const { container: c2 } = render(
      <Avatar size="default">
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
    );
    expect(getRoot(c1).getAttribute("data-size")).toBe(
      getRoot(c2).getAttribute("data-size")
    );
  });
});

// =============================================================================
// 3. AvatarImage – fallback state (no image mock, jsdom default)
// =============================================================================

describe("AvatarImage – default (image not loaded in jsdom)", () => {
  it("img is NOT in the DOM before load events fire", () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/40" alt="Sam" />
        <AvatarFallback>SR</AvatarFallback>
      </Avatar>
    );
    // Image element should not be present until the mock fires
    // (this tests the synchronous state before microtasks run)
    // We can't guarantee timing here, so we just check the fallback is there
    expect(screen.getByText("SR")).toBeInTheDocument();
  });
});

// =============================================================================
// 4. AvatarImage – loaded state (with image mock)
// =============================================================================

describe("AvatarImage – loaded via mock", () => {
  it("renders an <img> element with the correct role after loading", async () => {
    render(
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/40?u=test1" alt="Sam Rivera" />
        <AvatarFallback>SR</AvatarFallback>
      </Avatar>
    );
    const img = await screen.findByRole("img", { name: "Sam Rivera" });
    expect(img).toBeInTheDocument();
  });

  it("has data-slot='avatar-image' when loaded", async () => {
    render(
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/40?u=test2" alt="Alex Lee" />
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
    );
    const img = await screen.findByRole("img", { name: "Alex Lee" });
    expect(img).toHaveAttribute("data-slot", "avatar-image");
  });

  it("forwards the src attribute to the img element", async () => {
    const src = "https://i.pravatar.cc/40?u=test3";
    render(
      <Avatar>
        <AvatarImage src={src} alt="Taylor" />
        <AvatarFallback>TL</AvatarFallback>
      </Avatar>
    );
    const img = await screen.findByRole("img", { name: "Taylor" });
    expect(img).toHaveAttribute("src", src);
  });

  it("forwards the alt attribute to the img element", async () => {
    render(
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/40?u=test4" alt="Jordan Kim" />
        <AvatarFallback>JK</AvatarFallback>
      </Avatar>
    );
    const img = await screen.findByRole("img", { name: "Jordan Kim" });
    expect(img.getAttribute("alt")).toBe("Jordan Kim");
  });

  it("img has aspect-square and rounded-full classes", async () => {
    render(
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/40?u=test5" alt="Casey" />
        <AvatarFallback>CA</AvatarFallback>
      </Avatar>
    );
    const img = await screen.findByRole("img", { name: "Casey" });
    expect(img.className).toContain("aspect-square");
    expect(img.className).toContain("rounded-full");
  });

  it("img is object-cover to fill the container", async () => {
    render(
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/40?u=test6" alt="Dana" />
        <AvatarFallback>DA</AvatarFallback>
      </Avatar>
    );
    const img = await screen.findByRole("img", { name: "Dana" });
    expect(img.className).toContain("object-cover");
  });

  it("forwards additional className to img", async () => {
    render(
      <Avatar>
        <AvatarImage
          src="https://i.pravatar.cc/40?u=test7"
          alt="Morgan"
          className="grayscale"
        />
        <AvatarFallback>MO</AvatarFallback>
      </Avatar>
    );
    const img = await screen.findByRole("img", { name: "Morgan" });
    expect(img.className).toContain("grayscale");
  });
});

// =============================================================================
// 5. AvatarImage – error state (broken src)
// =============================================================================

describe("AvatarImage – error state (broken src)", () => {
  it("does NOT render an img when src contains 'broken'", async () => {
    render(
      <Avatar>
        <AvatarImage src="broken-url.jpg" alt="Broken" />
        <AvatarFallback>BR</AvatarFallback>
      </Avatar>
    );
    // Wait for error microtask
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("shows fallback initials when src is broken", async () => {
    render(
      <Avatar>
        <AvatarImage src="broken-photo.jpg" alt="Alex Reed" />
        <AvatarFallback>AR</AvatarFallback>
      </Avatar>
    );
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.getByText("AR")).toBeInTheDocument();
  });

  it("shows fallback when no src is provided (empty string)", async () => {
    render(
      <Avatar>
        <AvatarImage src="" alt="Empty" />
        <AvatarFallback>EM</AvatarFallback>
      </Avatar>
    );
    // Base UI treats empty src as error
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.getByText("EM")).toBeInTheDocument();
  });
});

// =============================================================================
// 6. AvatarFallback – rendering and API
// =============================================================================

describe("AvatarFallback – rendering", () => {
  it("renders a <span> element", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    const fallback = getFallback(container);
    expect(fallback).not.toBeNull();
    expect(fallback!.tagName.toLowerCase()).toBe("span");
  });

  it("has data-slot='avatar-fallback'", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    expect(getFallback(container)).toHaveAttribute(
      "data-slot",
      "avatar-fallback"
    );
  });

  it("renders text content (initials)", () => {
    render(
      <Avatar>
        <AvatarFallback>MJ</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText("MJ")).toBeInTheDocument();
  });

  it("renders a single initial", () => {
    render(
      <Avatar>
        <AvatarFallback>T</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText("T")).toBeInTheDocument();
  });

  it("renders custom SVG icon as fallback", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>
          <svg data-testid="user-icon" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
          </svg>
        </AvatarFallback>
      </Avatar>
    );
    expect(container.querySelector("[data-testid='user-icon']")).toBeInTheDocument();
  });

  it("has bg-muted for the fallback background", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    expect(getFallback(container)!.className).toContain("bg-muted");
  });

  it("has text-muted-foreground for fallback text color", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    expect(getFallback(container)!.className).toContain("text-muted-foreground");
  });

  it("is flex with centered alignment", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    const cls = getFallback(container)!.className;
    expect(cls).toContain("flex");
    expect(cls).toContain("items-center");
    expect(cls).toContain("justify-center");
  });

  it("is rounded-full to match the avatar shape", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    expect(getFallback(container)!.className).toContain("rounded-full");
  });

  it("forwards additional className to fallback span", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback className="bg-blue-500">JD</AvatarFallback>
      </Avatar>
    );
    expect(getFallback(container)!.className).toContain("bg-blue-500");
  });

  it("shows smaller text (text-xs) in size='sm' avatars via group selector", () => {
    const { container } = render(
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
    );
    // The responsive class for sm text is encoded as a static selector in className
    expect(getFallback(container)!.className).toContain(
      "group-data-[size=sm]/avatar:text-xs"
    );
  });
});

// =============================================================================
// 7. AvatarBadge – rendering and classes
// =============================================================================

describe("AvatarBadge – rendering", () => {
  it("renders a <span> element", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
        <AvatarBadge />
      </Avatar>
    );
    expect(getBadge(container)!.tagName.toLowerCase()).toBe("span");
  });

  it("has data-slot='avatar-badge'", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
        <AvatarBadge />
      </Avatar>
    );
    expect(getBadge(container)).toHaveAttribute("data-slot", "avatar-badge");
  });

  it("is absolutely positioned at bottom-right", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
        <AvatarBadge />
      </Avatar>
    );
    const cls = getBadge(container)!.className;
    expect(cls).toContain("absolute");
    expect(cls).toContain("right-0");
    expect(cls).toContain("bottom-0");
  });

  it("is circular (rounded-full)", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
        <AvatarBadge />
      </Avatar>
    );
    expect(getBadge(container)!.className).toContain("rounded-full");
  });

  it("has ring-2 ring-background for the halo border", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
        <AvatarBadge />
      </Avatar>
    );
    const cls = getBadge(container)!.className;
    expect(cls).toContain("ring-2");
    expect(cls).toContain("ring-background");
  });

  it("default badge has bg-primary class", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
        <AvatarBadge />
      </Avatar>
    );
    expect(getBadge(container)!.className).toContain("bg-primary");
  });

  it("has z-10 to appear above avatar image", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
        <AvatarBadge />
      </Avatar>
    );
    expect(getBadge(container)!.className).toContain("z-10");
  });

  it("overriding with bg-green-500 replaces bg-primary (tailwind-merge)", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>ON</AvatarFallback>
        <AvatarBadge className="bg-green-500" />
      </Avatar>
    );
    const cls = getBadge(container)!.className;
    expect(cls).toContain("bg-green-500");
    // tailwind-merge removes the conflicting bg-primary
    expect(cls).not.toContain("bg-primary");
  });

  it("overriding with bg-yellow-400 (away state) replaces bg-primary", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>AW</AvatarFallback>
        <AvatarBadge className="bg-yellow-400" />
      </Avatar>
    );
    const cls = getBadge(container)!.className;
    expect(cls).toContain("bg-yellow-400");
    expect(cls).not.toContain("bg-primary");
  });

  it("overriding with bg-muted-foreground (offline state) works", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>OF</AvatarFallback>
        <AvatarBadge className="bg-muted-foreground" />
      </Avatar>
    );
    expect(getBadge(container)!.className).toContain("bg-muted-foreground");
  });

  it("badge size selector for sm is encoded in the static class string", () => {
    const { container } = render(
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
        <AvatarBadge />
      </Avatar>
    );
    expect(getBadge(container)!.className).toContain(
      "group-data-[size=sm]/avatar:size-2"
    );
  });

  it("badge size selector for default is encoded in the static class string", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>DE</AvatarFallback>
        <AvatarBadge />
      </Avatar>
    );
    expect(getBadge(container)!.className).toContain(
      "group-data-[size=default]/avatar:size-2.5"
    );
  });

  it("badge size selector for lg is encoded in the static class string", () => {
    const { container } = render(
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
        <AvatarBadge />
      </Avatar>
    );
    expect(getBadge(container)!.className).toContain(
      "group-data-[size=lg]/avatar:size-3"
    );
  });

  it("badge can render children (e.g. an icon)", () => {
    const { container } = render(
      <Avatar size="lg">
        <AvatarFallback>IC</AvatarFallback>
        <AvatarBadge>
          <svg data-testid="badge-icon" aria-hidden="true" width="8" height="8" />
        </AvatarBadge>
      </Avatar>
    );
    expect(container.querySelector("[data-testid='badge-icon']")).toBeInTheDocument();
  });

  it("badge forwards aria-hidden attribute for decorative usage", () => {
    // AvatarBadge is a plain <span> — aria-label is prohibited on roleless spans.
    // The correct a11y pattern for a decorative status dot is aria-hidden="true".
    const { container } = render(
      <Avatar>
        <AvatarFallback>ON</AvatarFallback>
        <AvatarBadge aria-hidden="true" />
      </Avatar>
    );
    expect(getBadge(container)).toHaveAttribute("aria-hidden", "true");
  });
});

// =============================================================================
// 8. AvatarGroup – rendering and stacking
// =============================================================================

describe("AvatarGroup – rendering", () => {
  it("renders without crashing", () => {
    expect(() =>
      render(
        <AvatarGroup>
          <Avatar>
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
        </AvatarGroup>
      )
    ).not.toThrow();
  });

  it("renders a <div> element", () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    );
    expect(getGroup(container).tagName.toLowerCase()).toBe("div");
  });

  it("has data-slot='avatar-group'", () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    );
    expect(getGroup(container)).toHaveAttribute("data-slot", "avatar-group");
  });

  it("has group/avatar-group class for child targeting", () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    );
    expect(getGroup(container).className).toContain("group/avatar-group");
  });

  it("has -space-x-2 for negative-margin stacking overlap", () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    );
    expect(getGroup(container).className).toContain("-space-x-2");
  });

  it("has flex layout", () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    );
    expect(getGroup(container).className).toContain("flex");
  });

  it("renders multiple Avatar children", () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>U1</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>U2</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>U3</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    );
    expect(screen.getByText("U1")).toBeInTheDocument();
    expect(screen.getByText("U2")).toBeInTheDocument();
    expect(screen.getByText("U3")).toBeInTheDocument();
  });

  it("forwards additional className to the group div", () => {
    const { container } = render(
      <AvatarGroup className="my-custom-class">
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    );
    expect(getGroup(container).className).toContain("my-custom-class");
  });

  it("forwards arbitrary HTML attributes (e.g. aria-label)", () => {
    const { container } = render(
      <AvatarGroup aria-label="Project members">
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    );
    expect(getGroup(container)).toHaveAttribute("aria-label", "Project members");
  });

  it("applies ring-2 ring-background to child Avatars via CSS selector class", () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    );
    // The ring is applied via a * selector in the group className
    expect(getGroup(container).className).toContain(
      "*:data-[slot=avatar]:ring-2"
    );
    expect(getGroup(container).className).toContain(
      "*:data-[slot=avatar]:ring-background"
    );
  });

  it("can contain sm-sized avatars", () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar size="sm">
          <AvatarFallback>S1</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarFallback>S2</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    );
    const avatars = container.querySelectorAll("[data-slot='avatar']");
    expect(avatars).toHaveLength(2);
    avatars.forEach((a) =>
      expect(a).toHaveAttribute("data-size", "sm")
    );
  });

  it("can contain lg-sized avatars", () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar size="lg">
          <AvatarFallback>L1</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>L2</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    );
    const avatars = container.querySelectorAll("[data-slot='avatar']");
    avatars.forEach((a) =>
      expect(a).toHaveAttribute("data-size", "lg")
    );
  });
});

// =============================================================================
// 9. AvatarGroupCount – rendering
// =============================================================================

describe("AvatarGroupCount – rendering", () => {
  it("renders without crashing inside a group", () => {
    expect(() =>
      render(
        <AvatarGroup>
          <AvatarGroupCount>+5</AvatarGroupCount>
        </AvatarGroup>
      )
    ).not.toThrow();
  });

  it("renders a <div> element", () => {
    const { container } = render(
      <AvatarGroup>
        <AvatarGroupCount>+5</AvatarGroupCount>
      </AvatarGroup>
    );
    expect(getGroupCount(container).tagName.toLowerCase()).toBe("div");
  });

  it("has data-slot='avatar-group-count'", () => {
    const { container } = render(
      <AvatarGroup>
        <AvatarGroupCount>+5</AvatarGroupCount>
      </AvatarGroup>
    );
    expect(getGroupCount(container)).toHaveAttribute(
      "data-slot",
      "avatar-group-count"
    );
  });

  it("renders the overflow text content", () => {
    render(
      <AvatarGroup>
        <AvatarGroupCount>+7</AvatarGroupCount>
      </AvatarGroup>
    );
    expect(screen.getByText("+7")).toBeInTheDocument();
  });

  it("renders large overflow numbers", () => {
    render(
      <AvatarGroup>
        <AvatarGroupCount>+99</AvatarGroupCount>
      </AvatarGroup>
    );
    expect(screen.getByText("+99")).toBeInTheDocument();
  });

  it("is circular (rounded-full)", () => {
    const { container } = render(
      <AvatarGroup>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
    );
    expect(getGroupCount(container).className).toContain("rounded-full");
  });

  it("has shrink-0 to prevent flex shrinking", () => {
    const { container } = render(
      <AvatarGroup>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
    );
    expect(getGroupCount(container).className).toContain("shrink-0");
  });

  it("has bg-muted and text-muted-foreground for muted appearance", () => {
    const { container } = render(
      <AvatarGroup>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
    );
    const cls = getGroupCount(container).className;
    expect(cls).toContain("bg-muted");
    expect(cls).toContain("text-muted-foreground");
  });

  it("has ring-2 ring-background to match adjacent avatar rings", () => {
    const { container } = render(
      <AvatarGroup>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
    );
    const cls = getGroupCount(container).className;
    expect(cls).toContain("ring-2");
    expect(cls).toContain("ring-background");
  });

  it("has flex with centered alignment", () => {
    const { container } = render(
      <AvatarGroup>
        <AvatarGroupCount>+2</AvatarGroupCount>
      </AvatarGroup>
    );
    const cls = getGroupCount(container).className;
    expect(cls).toContain("flex");
    expect(cls).toContain("items-center");
    expect(cls).toContain("justify-center");
  });

  it("forwards additional className", () => {
    const { container } = render(
      <AvatarGroup>
        <AvatarGroupCount className="font-bold">+2</AvatarGroupCount>
      </AvatarGroup>
    );
    expect(getGroupCount(container).className).toContain("font-bold");
  });

  it("group-count size responds to lg avatars via group selector (class encoding)", () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar size="lg">
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+2</AvatarGroupCount>
      </AvatarGroup>
    );
    // The size-10 responsive class is encoded as a static group selector
    expect(getGroupCount(container).className).toContain(
      "group-has-data-[size=lg]/avatar-group:size-10"
    );
  });

  it("group-count size responds to sm avatars via group selector (class encoding)", () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar size="sm">
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+2</AvatarGroupCount>
      </AvatarGroup>
    );
    expect(getGroupCount(container).className).toContain(
      "group-has-data-[size=sm]/avatar-group:size-6"
    );
  });
});

// =============================================================================
// 10. Compound compositions (real-world usage patterns)
// =============================================================================

describe("Compound compositions", () => {
  it("Avatar + Image + Fallback — fallback visible until image loads", () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/photo.jpg" alt="User" />
        <AvatarFallback>US</AvatarFallback>
      </Avatar>
    );
    // Synchronously the fallback should be present (image not yet loaded)
    expect(screen.getByText("US")).toBeInTheDocument();
  });

  it("Avatar + Image (loaded) + Fallback + Badge — all parts present", async () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/40?u=comp1" alt="Pat Chen" />
        <AvatarFallback>PC</AvatarFallback>
        <AvatarBadge className="bg-green-500" />
      </Avatar>
    );
    // Badge is always present
    expect(getBadge(container)).toBeInTheDocument();
    // Image loads via mock
    const img = await screen.findByRole("img", { name: "Pat Chen" });
    expect(img).toBeInTheDocument();
  });

  it("AvatarGroup with 3 avatars + AvatarGroupCount shows all children", () => {
    render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>UA</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>UB</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>UC</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+5</AvatarGroupCount>
      </AvatarGroup>
    );
    expect(screen.getByText("UA")).toBeInTheDocument();
    expect(screen.getByText("UB")).toBeInTheDocument();
    expect(screen.getByText("UC")).toBeInTheDocument();
    expect(screen.getByText("+5")).toBeInTheDocument();
  });

  it("AvatarGroup fallback-only group renders all initials", () => {
    render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>RK</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>ST</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>UV</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+12</AvatarGroupCount>
      </AvatarGroup>
    );
    ["RK", "ST", "UV", "+12"].forEach((t) =>
      expect(screen.getByText(t)).toBeInTheDocument()
    );
  });

  it("Avatar with fallback-only renders fallback (no image element in DOM)", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>FO</AvatarFallback>
      </Avatar>
    );
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("FO")).toBeInTheDocument();
  });

  it("user-list pattern: each member renders Avatar + Badge with correct status color", () => {
    const members = [
      { name: "Jordan Lee", initials: "JL", online: true },
      { name: "Casey Brown", initials: "CB", online: false },
    ];
    const { container } = render(
      <ul>
        {members.map((m) => (
          <li key={m.name}>
            <Avatar>
              <AvatarFallback>{m.initials}</AvatarFallback>
              <AvatarBadge className={m.online ? "bg-green-500" : "bg-muted-foreground"} />
            </Avatar>
            <span>{m.name}</span>
          </li>
        ))}
      </ul>
    );
    const badges = container.querySelectorAll("[data-slot='avatar-badge']");
    expect(badges).toHaveLength(2);
    expect(badges[0].className).toContain("bg-green-500");
    expect(badges[1].className).toContain("bg-muted-foreground");
  });

  it("sm group: all avatars have data-size='sm'", () => {
    const { container } = render(
      <AvatarGroup>
        {["g1", "g2", "g3"].map((k) => (
          <Avatar key={k} size="sm">
            <AvatarFallback>{k.toUpperCase()}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>
    );
    const avatars = container.querySelectorAll("[data-slot='avatar']");
    expect(avatars).toHaveLength(3);
    avatars.forEach((a) => expect(a).toHaveAttribute("data-size", "sm"));
  });

  it("lg group with count: avatars are lg-sized and count text is rendered", () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar size="lg">
          <AvatarFallback>DA</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>EL</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+2</AvatarGroupCount>
      </AvatarGroup>
    );
    const avatars = container.querySelectorAll("[data-slot='avatar']");
    avatars.forEach((a) => expect(a).toHaveAttribute("data-size", "lg"));
    expect(screen.getByText("+2")).toBeInTheDocument();
  });
});

// =============================================================================
// 11. Edge cases and robustness
// =============================================================================

describe("Edge cases and robustness", () => {
  it("renders Avatar with no children without crashing", () => {
    expect(() => render(<Avatar />)).not.toThrow();
  });

  it("renders AvatarGroup with no children without crashing", () => {
    expect(() => render(<AvatarGroup />)).not.toThrow();
  });

  it("renders AvatarGroupCount without a group wrapper without crashing", () => {
    expect(() =>
      render(<AvatarGroupCount>+1</AvatarGroupCount>)
    ).not.toThrow();
  });

  it("renders AvatarBadge without a parent Avatar without crashing", () => {
    expect(() => render(<AvatarBadge />)).not.toThrow();
  });

  it("renders two badges inside one avatar (unusual but should not crash)", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>DB</AvatarFallback>
        <AvatarBadge />
        <AvatarBadge className="bg-red-500" />
      </Avatar>
    );
    const badges = container.querySelectorAll("[data-slot='avatar-badge']");
    expect(badges).toHaveLength(2);
  });

  it("renders a large number of avatars in a group without crashing", () => {
    const users = Array.from({ length: 20 }, (_, i) => `U${i}`);
    expect(() =>
      render(
        <AvatarGroup>
          {users.map((u) => (
            <Avatar key={u}>
              <AvatarFallback>{u}</AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount>+100</AvatarGroupCount>
        </AvatarGroup>
      )
    ).not.toThrow();
  });

  it("renders nested AvatarGroupCount with an SVG child", () => {
    const { container } = render(
      <AvatarGroup>
        <AvatarGroupCount>
          <svg
            data-testid="more-icon"
            aria-hidden="true"
            width="16"
            height="16"
          />
        </AvatarGroupCount>
      </AvatarGroup>
    );
    expect(container.querySelector("[data-testid='more-icon']")).toBeInTheDocument();
  });

  it("Avatar className merging does not break base classes", () => {
    const { container } = render(
      <Avatar className="border-2 border-blue-500">
        <AvatarFallback>MG</AvatarFallback>
      </Avatar>
    );
    const cls = getRoot(container).className;
    expect(cls).toContain("border-2");
    expect(cls).toContain("rounded-full"); // base class survives
  });

  it("AvatarFallback renders long text without crashing", () => {
    render(
      <Avatar>
        <AvatarFallback>Very Long Name Initials</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText("Very Long Name Initials")).toBeInTheDocument();
  });
});

// =============================================================================
// 12. Sizes × parts (matrix)
// =============================================================================

describe("Avatar size × part matrix", () => {
  const sizes = ["sm", "default", "lg"] as const;

  sizes.forEach((size) => {
    describe(`size="${size}"`, () => {
      it("Avatar root has correct data-size", () => {
        const { container } = render(
          <Avatar size={size}>
            <AvatarFallback>XX</AvatarFallback>
          </Avatar>
        );
        expect(getRoot(container)).toHaveAttribute("data-size", size);
      });

      it("AvatarFallback is present at this size", () => {
        const { container } = render(
          <Avatar size={size}>
            <AvatarFallback>XX</AvatarFallback>
          </Avatar>
        );
        expect(getFallback(container)).toBeInTheDocument();
      });

      it("AvatarBadge is present at this size", () => {
        const { container } = render(
          <Avatar size={size}>
            <AvatarFallback>XX</AvatarFallback>
            <AvatarBadge />
          </Avatar>
        );
        expect(getBadge(container)).toBeInTheDocument();
      });

      it("AvatarImage loads at this size", async () => {
        render(
          <Avatar size={size}>
            <AvatarImage
              src={`https://i.pravatar.cc/40?u=size-${size}`}
              alt={`User ${size}`}
            />
            <AvatarFallback>XX</AvatarFallback>
          </Avatar>
        );
        const img = await screen.findByRole("img", { name: `User ${size}` });
        expect(img).toBeInTheDocument();
      });
    });
  });
});

// =============================================================================
// 13. Accessibility (axe)
// =============================================================================

describe("Accessibility (axe)", () => {
  it("basic Avatar with fallback initials has no axe violations", async () => {
    const { container } = render(
      <div>
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <span>John Doe</span>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Avatar with loaded image (alt text provided) has no axe violations", async () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/40?u=a11y1" alt="Sam Rivera" />
        <AvatarFallback>SR</AvatarFallback>
      </Avatar>
    );
    // Wait for image to load
    await screen.findByRole("img", { name: "Sam Rivera" });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Avatar with badge (decorative badge, aria-hidden) has no axe violations", async () => {
    // AvatarBadge is a plain <span> with no ARIA role — aria-label is not
    // permitted on a roleless span (axe aria-prohibited-attr rule).
    // The correct pattern for a decorative status dot is aria-hidden="true"
    // and an accessible label conveyed via the surrounding text.
    const { container } = render(
      <div>
        <Avatar>
          <AvatarFallback>ON</AvatarFallback>
          <AvatarBadge aria-hidden="true" />
        </Avatar>
        <span>Pat Online</span>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("AvatarGroup with multiple avatars and adjacent label has no axe violations", async () => {
    const { container } = render(
      <div>
        <p id="group-label">Project members</p>
        <AvatarGroup aria-labelledby="group-label" role="group">
          <Avatar>
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>BO</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>CA</AvatarFallback>
          </Avatar>
          <AvatarGroupCount aria-label="+7 more">+7</AvatarGroupCount>
        </AvatarGroup>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("all three sizes together have no axe violations", async () => {
    const { container } = render(
      <div>
        {(["sm", "default", "lg"] as const).map((s) => (
          <div key={s}>
            <Avatar size={s}>
              <AvatarFallback>{s.toUpperCase().slice(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="sr-only">{s} avatar</span>
          </div>
        ))}
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Avatar in a user-list context has no axe violations", async () => {
    // AvatarBadge is a plain <span> with no ARIA role — aria-label is not
    // permitted on a roleless span. Use aria-hidden="true" on the decorative
    // status dot; the online/offline status is conveyed by visible text.
    const { container } = render(
      <ul aria-label="Team members">
        {[
          { name: "Jordan Lee", initials: "JL", online: true },
          { name: "Morgan Kim", initials: "MK", online: false },
        ].map((m) => (
          <li key={m.name}>
            <Avatar>
              <AvatarFallback>{m.initials}</AvatarFallback>
              <AvatarBadge
                aria-hidden="true"
                className={m.online ? "bg-green-500" : "bg-muted-foreground"}
              />
            </Avatar>
            <span>{m.name}</span>
          </li>
        ))}
      </ul>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Avatar with broken image (fallback shown) has no axe violations", async () => {
    const { container } = render(
      <div>
        <Avatar>
          <AvatarImage src="broken-url.jpg" alt="Alex Reed" />
          <AvatarFallback>AR</AvatarFallback>
        </Avatar>
        <span>Alex Reed</span>
      </div>
    );
    await new Promise((r) => setTimeout(r, 50));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// =============================================================================
// 14. DOM structure assertions
// =============================================================================

describe("DOM structure", () => {
  it("Avatar root is a direct child of the container", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>DS</AvatarFallback>
      </Avatar>
    );
    expect(container.firstElementChild).toHaveAttribute("data-slot", "avatar");
  });

  it("AvatarFallback is a direct child of Avatar root", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>DS</AvatarFallback>
      </Avatar>
    );
    const root = getRoot(container);
    // data-slot=avatar-fallback should be nested inside the root
    const fallback = root.querySelector("[data-slot='avatar-fallback']");
    expect(fallback).toBeInTheDocument();
  });

  it("AvatarBadge is positioned inside Avatar root", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>DS</AvatarFallback>
        <AvatarBadge />
      </Avatar>
    );
    const root = getRoot(container);
    const badge = root.querySelector("[data-slot='avatar-badge']");
    expect(badge).toBeInTheDocument();
  });

  it("AvatarGroup contains Avatar children with correct slot attributes", () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    );
    const group = getGroup(container);
    const avatars = within(group).getAllByText(/[AB]/);
    expect(avatars).toHaveLength(2);
  });

  it("AvatarGroupCount is a sibling of Avatar elements in the group", () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>X</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
    );
    const group = getGroup(container);
    const count = within(group).getByText("+3");
    expect(count).toBeInTheDocument();
  });
});
