/**
 * Exhaustive tests for the Toaster component in @/components/ui/sonner.
 *
 * The component is a thin wrapper around the `sonner` library that:
 *   - wires up `@wrksz/themes` for automatic light/dark switching
 *   - injects custom Phosphor icons (success/info/warning/error/loading)
 *   - sets CSS-variable style overrides for our design-system tokens
 *   - forces `cn-toast` onto every `toastOptions.classNames.toast`
 *   - forwards all ToasterProps to the underlying Sonner <Toaster>
 *
 * DOM structure produced by sonner (with active toasts):
 *   <section aria-label="Notifications alt+T" aria-live="polite" …>
 *     <ol data-sonner-toaster data-sonner-theme="{theme}" class="toaster group" …>
 *       <li data-sonner-toast data-type="{type}" class="cn-toast" …>…</li>
 *     </ol>
 *   </section>
 *
 * Important jsdom constraints:
 *   - The <ol> with data-sonner-toaster is only injected AFTER the first toast
 *     is shown — it is not present on static render.
 *   - window.matchMedia is not available → theme="system" needs matchMedia mock.
 *   - setPointerCapture is not available → clicks on toast items trigger
 *     sonner's onPointerDown which calls setPointerCapture; guard with mock.
 *
 * Test coverage
 * ─────────────
 * 1.  Smoke — Toaster renders, produces live-region section
 * 2.  Theme prop forwarding — light / dark
 * 3.  Position props — all 6 positions → data-x-position / data-y-position
 * 4.  className forwarding — class appears on <ol>
 * 5.  CSS-variable style overrides baked into our wrapper
 * 6.  Custom icons — the wrapper ships five custom Phosphor icons
 * 7.  toastOptions.classNames.toast = "cn-toast" always applied
 * 8.  toast() — default/message toast renders, title visible
 * 9.  toast.success() — type=success, title text visible
 * 10. toast.error()   — type=error, title text visible
 * 11. toast.info()    — type=info, title text visible
 * 12. toast.warning() — type=warning, title text visible
 * 13. toast.loading() — loading icon wrapper shown
 * 14. toast with description — description text + data-description element
 * 15. toast with action button — label visible, data-button, onClick fires
 * 16. toast with cancel button — label visible, data-cancel, onClick fires
 * 17. toast with action + cancel — both labels rendered
 * 18. toast.custom() — JSX content rendered inside toast
 * 19. closeButton prop — per-toast close button data-close-button rendered
 * 20. toast.dismiss() — dismisses all active toasts
 * 21. toast with id — updating existing toast by id changes content
 * 22. toast.promise() — loading / success / error states
 * 23. richColors prop on Toaster — renders without error
 * 24. richColors on individual toast → data-rich-colors='true' on <li>
 * 25. duration:Infinity — toast persists after render
 * 26. Multiple toasts at once
 * 27. containerAriaLabel override → section aria-label updated
 * 28. dir="rtl" / "ltr" forwarded to Toaster <ol>
 * 29. A11y — no axe violations on rendered Toaster (static)
 * 30. A11y — no axe violations after toasts are shown
 */

import * as React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from "vitest";
import { axe } from "vitest-axe";
import { toast } from "sonner";

// ── Mock @wrksz/themes ────────────────────────────────────────────────────────
vi.mock("@wrksz/themes/client", () => ({
  useTheme: () => ({ theme: "light", resolvedTheme: "light" }),
}));

// ── Mock window.matchMedia (needed for sonner theme="system") ─────────────────
beforeAll(() => {
  if (!window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    });
  }
  // Sonner calls setPointerCapture on the toast <li> during drag/pointer events.
  // jsdom does not implement it; stub it to avoid uncaught exceptions.
  if (!HTMLElement.prototype.setPointerCapture) {
    HTMLElement.prototype.setPointerCapture = vi.fn();
  }
  if (!HTMLElement.prototype.releasePointerCapture) {
    HTMLElement.prototype.releasePointerCapture = vi.fn();
  }
  if (!HTMLElement.prototype.hasPointerCapture) {
    (HTMLElement.prototype as any).hasPointerCapture = vi.fn(() => false);
  }
});

import { Toaster } from "@/components/ui/sonner";

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Find the sonner <ol> (data-sonner-toaster). The <ol> is only injected after
 * the first toast is shown; this helper should only be called after a toast
 * has been triggered.
 */
function getToasterOl(): HTMLElement {
  const el = document.querySelector("[data-sonner-toaster]") as HTMLElement | null;
  if (!el) throw new Error("No [data-sonner-toaster] element found. Trigger a toast first.");
  return el;
}

/** Find the sonner <section> (always present after render). */
function getSonnerSection(): HTMLElement {
  const el = document.querySelector("section[aria-live]") as HTMLElement | null;
  if (!el) throw new Error("No sonner <section aria-live> found in DOM.");
  return el;
}

/** Find all rendered toast <li> elements. */
function getToastItems(): HTMLElement[] {
  return Array.from(document.querySelectorAll("[data-sonner-toast]"));
}

/**
 * Wait for at least one toast <li> to appear with optionally matching text.
 */
async function waitForToast(matcher?: string | RegExp) {
  await waitFor(
    () => {
      const items = getToastItems();
      expect(items.length).toBeGreaterThan(0);
      if (matcher) {
        const found = items.some((el) =>
          typeof matcher === "string"
            ? el.textContent?.includes(matcher)
            : matcher.test(el.textContent ?? "")
        );
        expect(found, `Toast matching "${matcher}" not found`).toBe(true);
      }
    },
    { timeout: 3000 }
  );
}

// Dismiss all toasts before/after each test to prevent cross-test bleed.
beforeEach(() => {
  act(() => {
    toast.dismiss();
  });
});
afterEach(() => {
  act(() => {
    toast.dismiss();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 1. Smoke
// ─────────────────────────────────────────────────────────────────────────────

describe("Toaster – smoke", () => {
  it("renders without crashing", () => {
    expect(() => render(<Toaster />)).not.toThrow();
  });

  it("produces a <section> live region in the document", () => {
    render(<Toaster />);
    expect(document.querySelector("section[aria-live]")).not.toBeNull();
  });

  it("live region has aria-live='polite'", () => {
    render(<Toaster />);
    const section = getSonnerSection();
    expect(section.getAttribute("aria-live")).toBe("polite");
  });

  it("live region has aria-relevant='additions text'", () => {
    render(<Toaster />);
    const section = getSonnerSection();
    expect(section.getAttribute("aria-relevant")).toBe("additions text");
  });

  it("live region has aria-atomic='false'", () => {
    render(<Toaster />);
    const section = getSonnerSection();
    expect(section.getAttribute("aria-atomic")).toBe("false");
  });

  it("no toast items are visible on initial render", () => {
    render(<Toaster />);
    expect(getToastItems().length).toBe(0);
  });

  it("Toaster export is a React component (function)", () => {
    expect(typeof Toaster).toBe("function");
  });

  it("<ol> with data-sonner-toaster appears after first toast is shown", async () => {
    render(<Toaster />);
    act(() => {
      toast("Smoke toast");
    });
    await waitForToast("Smoke toast");
    expect(document.querySelector("[data-sonner-toaster]")).not.toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Theme prop forwarding
// ─────────────────────────────────────────────────────────────────────────────

describe("Toaster – theme prop", () => {
  it("explicit theme='light' → data-sonner-theme='light' on <ol>", async () => {
    render(<Toaster theme="light" />);
    act(() => {
      toast("Theme light test");
    });
    await waitForToast("Theme light test");
    expect(getToasterOl().getAttribute("data-sonner-theme")).toBe("light");
  });

  it("explicit theme='dark' → data-sonner-theme='dark' on <ol>", async () => {
    render(<Toaster theme="dark" />);
    act(() => {
      toast("Theme dark test");
    });
    await waitForToast("Theme dark test");
    expect(getToasterOl().getAttribute("data-sonner-theme")).toBe("dark");
  });

  it("no explicit theme → uses useTheme() result (mocked to 'light')", async () => {
    render(<Toaster />);
    act(() => {
      toast("Theme default test");
    });
    await waitForToast("Theme default test");
    expect(getToasterOl().getAttribute("data-sonner-theme")).toBe("light");
  });

  it("explicit theme='system' renders without error (matchMedia mocked)", () => {
    expect(() => render(<Toaster theme="system" />)).not.toThrow();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Position props
// ─────────────────────────────────────────────────────────────────────────────

describe("Toaster – position prop", () => {
  const cases: Array<{ position: string; x: string; y: string }> = [
    { position: "top-left", x: "left", y: "top" },
    { position: "top-center", x: "center", y: "top" },
    { position: "top-right", x: "right", y: "top" },
    { position: "bottom-left", x: "left", y: "bottom" },
    { position: "bottom-center", x: "center", y: "bottom" },
    { position: "bottom-right", x: "right", y: "bottom" },
  ];

  cases.forEach(({ position, x, y }) => {
    it(`position="${position}" → data-x-position="${x}" data-y-position="${y}"`, async () => {
      render(<Toaster position={position as any} />);
      act(() => {
        toast(`Position ${position} toast`);
      });
      await waitForToast(`Position ${position} toast`);
      const ol = getToasterOl();
      expect(ol.getAttribute("data-x-position")).toBe(x);
      expect(ol.getAttribute("data-y-position")).toBe(y);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. className forwarding
// ─────────────────────────────────────────────────────────────────────────────

describe("Toaster – className prop", () => {
  it("<ol> has 'toaster' class from the wrapper's default className", async () => {
    render(<Toaster />);
    act(() => {
      toast("ClassName toaster test");
    });
    await waitForToast("ClassName toaster test");
    expect(getToasterOl().className).toContain("toaster");
  });

  it("<ol> has 'group' class from the wrapper's default className", async () => {
    render(<Toaster />);
    act(() => {
      toast("ClassName group test");
    });
    await waitForToast("ClassName group test");
    expect(getToasterOl().className).toContain("group");
  });

  it("extra className prop is forwarded and appears on <ol>", async () => {
    render(<Toaster className="my-extra-class" />);
    act(() => {
      toast("Extra class toast");
    });
    await waitForToast("Extra class toast");
    expect(getToasterOl().className).toContain("my-extra-class");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. CSS-variable style overrides
// ─────────────────────────────────────────────────────────────────────────────

describe("Toaster – CSS-variable style overrides", () => {
  it("renders without error when style overrides are applied", () => {
    expect(() => render(<Toaster />)).not.toThrow();
  });

  it("--normal-bg override is present on the <ol> style attribute", async () => {
    render(<Toaster />);
    act(() => {
      toast("Style override test");
    });
    await waitForToast("Style override test");
    const styleAttr = getToasterOl().getAttribute("style") ?? "";
    expect(styleAttr).toContain("--normal-bg");
  });

  it("--normal-text override is present on the <ol> style attribute", async () => {
    render(<Toaster />);
    act(() => {
      toast("Style --normal-text test");
    });
    await waitForToast("Style --normal-text test");
    const styleAttr = getToasterOl().getAttribute("style") ?? "";
    expect(styleAttr).toContain("--normal-text");
  });

  it("--normal-border override is present on the <ol> style attribute", async () => {
    render(<Toaster />);
    act(() => {
      toast("Style --normal-border test");
    });
    await waitForToast("Style --normal-border test");
    const styleAttr = getToasterOl().getAttribute("style") ?? "";
    expect(styleAttr).toContain("--normal-border");
  });

  it("--border-radius override is present on the <ol> style attribute", async () => {
    render(<Toaster />);
    act(() => {
      toast("Style --border-radius test");
    });
    await waitForToast("Style --border-radius test");
    const styleAttr = getToasterOl().getAttribute("style") ?? "";
    expect(styleAttr).toContain("--border-radius");
  });

  it("--normal-bg is set to var(--popover)", async () => {
    render(<Toaster />);
    act(() => {
      toast("Style popover test");
    });
    await waitForToast("Style popover test");
    const styleAttr = getToasterOl().getAttribute("style") ?? "";
    expect(styleAttr).toContain("var(--popover)");
  });

  it("--normal-text is set to var(--popover-foreground)", async () => {
    render(<Toaster />);
    act(() => {
      toast("Style pf test");
    });
    await waitForToast("Style pf test");
    const styleAttr = getToasterOl().getAttribute("style") ?? "";
    expect(styleAttr).toContain("var(--popover-foreground)");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. Custom icons injected by the wrapper
// ─────────────────────────────────────────────────────────────────────────────

describe("Toaster – custom icons", () => {
  it("success toast renders an icon (SVG or element) inside [data-icon]", async () => {
    render(<Toaster />);
    act(() => {
      toast.success("Icon success check");
    });
    await waitForToast("Icon success check");
    const toastEl = getToastItems().find((el) =>
      el.textContent?.includes("Icon success check")
    )!;
    const icon = toastEl.querySelector("[data-icon] svg, [data-icon] > *");
    expect(icon).not.toBeNull();
  });

  it("error toast renders an icon inside [data-icon]", async () => {
    render(<Toaster />);
    act(() => {
      toast.error("Icon error check");
    });
    await waitForToast("Icon error check");
    const toastEl = getToastItems().find((el) =>
      el.textContent?.includes("Icon error check")
    )!;
    const icon = toastEl.querySelector("[data-icon] svg, [data-icon] > *");
    expect(icon).not.toBeNull();
  });

  it("info toast renders an icon inside [data-icon]", async () => {
    render(<Toaster />);
    act(() => {
      toast.info("Icon info check");
    });
    await waitForToast("Icon info check");
    const toastEl = getToastItems().find((el) =>
      el.textContent?.includes("Icon info check")
    )!;
    const icon = toastEl.querySelector("[data-icon] svg, [data-icon] > *");
    expect(icon).not.toBeNull();
  });

  it("warning toast renders an icon inside [data-icon]", async () => {
    render(<Toaster />);
    act(() => {
      toast.warning("Icon warning check");
    });
    await waitForToast("Icon warning check");
    const toastEl = getToastItems().find((el) =>
      el.textContent?.includes("Icon warning check")
    )!;
    const icon = toastEl.querySelector("[data-icon] svg, [data-icon] > *");
    expect(icon).not.toBeNull();
  });

  it("loading toast renders a loading icon wrapper", async () => {
    render(<Toaster />);
    act(() => {
      toast.loading("Icon loading check");
    });
    await waitForToast("Icon loading check");
    const toastEl = getToastItems().find((el) =>
      el.textContent?.includes("Icon loading check")
    )!;
    const loader = toastEl.querySelector(".sonner-loading-wrapper, [data-icon]");
    expect(loader).not.toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. toastOptions.classNames.toast = "cn-toast"
// ─────────────────────────────────────────────────────────────────────────────

describe("Toaster – cn-toast class applied to toasts", () => {
  it("toast <li> has 'cn-toast' class for a default toast", async () => {
    render(<Toaster />);
    act(() => {
      toast("cn-toast default test");
    });
    await waitForToast("cn-toast default test");
    const toastEl = getToastItems().find((el) =>
      el.textContent?.includes("cn-toast default test")
    )!;
    expect(toastEl.className).toContain("cn-toast");
  });

  it("toast <li> has 'cn-toast' class for a success toast", async () => {
    render(<Toaster />);
    act(() => {
      toast.success("cn-toast success test");
    });
    await waitForToast("cn-toast success test");
    const toastEl = getToastItems().find((el) =>
      el.textContent?.includes("cn-toast success test")
    )!;
    expect(toastEl.className).toContain("cn-toast");
  });

  it("toast <li> has 'cn-toast' class for an error toast", async () => {
    render(<Toaster />);
    act(() => {
      toast.error("cn-toast error test");
    });
    await waitForToast("cn-toast error test");
    const toastEl = getToastItems().find((el) =>
      el.textContent?.includes("cn-toast error test")
    )!;
    expect(toastEl.className).toContain("cn-toast");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. toast() — default / message toast
// ─────────────────────────────────────────────────────────────────────────────

describe("toast() – default toast", () => {
  it("renders a toast <li> with the given message text", async () => {
    render(<Toaster />);
    act(() => {
      toast("Hello from Sonner");
    });
    await waitForToast("Hello from Sonner");
    expect(document.body.textContent).toContain("Hello from Sonner");
  });

  it("renders at least one [data-sonner-toast] element", async () => {
    render(<Toaster />);
    act(() => {
      toast("List item toast");
    });
    await waitForToast("List item toast");
    expect(getToastItems().length).toBeGreaterThan(0);
  });

  it("toast.message() with description renders both text snippets", async () => {
    render(<Toaster />);
    act(() => {
      toast.message("Scheduled maintenance tonight.", {
        description: "Expect 30 minutes of downtime.",
      });
    });
    await waitForToast("Scheduled maintenance tonight.");
    expect(document.body.textContent).toContain("Scheduled maintenance tonight.");
    expect(document.body.textContent).toContain("Expect 30 minutes of downtime.");
  });

  it("toast item has data-sonner-toast attribute", async () => {
    render(<Toaster />);
    act(() => {
      toast("Data attr check");
    });
    await waitForToast("Data attr check");
    const items = getToastItems();
    expect(items.some((el) => el.textContent?.includes("Data attr check"))).toBe(true);
  });

  it("toast item has data-visible='true'", async () => {
    render(<Toaster />);
    act(() => {
      toast("Visibility check");
    });
    await waitForToast("Visibility check");
    const toastEl = getToastItems().find((el) =>
      el.textContent?.includes("Visibility check")
    )!;
    expect(toastEl.getAttribute("data-visible")).toBe("true");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. toast.success()
// ─────────────────────────────────────────────────────────────────────────────

describe("toast.success()", () => {
  it("renders the success message text", async () => {
    render(<Toaster />);
    act(() => {
      toast.success("File saved successfully.");
    });
    await waitForToast("File saved successfully.");
    expect(document.body.textContent).toContain("File saved successfully.");
  });

  it("toast item has data-type='success'", async () => {
    render(<Toaster />);
    act(() => {
      toast.success("Success type check");
    });
    await waitFor(() => {
      const el = getToastItems().find((li) =>
        li.textContent?.includes("Success type check")
      );
      expect(el?.getAttribute("data-type")).toBe("success");
    });
  });

  it("success toast title is in [data-title] element", async () => {
    render(<Toaster />);
    act(() => {
      toast.success("Success title element");
    });
    await waitForToast("Success title element");
    const toastEl = getToastItems().find((el) =>
      el.textContent?.includes("Success title element")
    )!;
    expect(toastEl.querySelector("[data-title]")?.textContent).toContain("Success title element");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 10. toast.error()
// ─────────────────────────────────────────────────────────────────────────────

describe("toast.error()", () => {
  it("renders the error message text", async () => {
    render(<Toaster />);
    act(() => {
      toast.error("Something went wrong.");
    });
    await waitForToast("Something went wrong.");
    expect(document.body.textContent).toContain("Something went wrong.");
  });

  it("toast item has data-type='error'", async () => {
    render(<Toaster />);
    act(() => {
      toast.error("Error type check");
    });
    await waitFor(() => {
      const el = getToastItems().find((li) =>
        li.textContent?.includes("Error type check")
      );
      expect(el?.getAttribute("data-type")).toBe("error");
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 11. toast.info()
// ─────────────────────────────────────────────────────────────────────────────

describe("toast.info()", () => {
  it("renders the info message text", async () => {
    render(<Toaster />);
    act(() => {
      toast.info("Update available.");
    });
    await waitForToast("Update available.");
    expect(document.body.textContent).toContain("Update available.");
  });

  it("toast item has data-type='info'", async () => {
    render(<Toaster />);
    act(() => {
      toast.info("Info type check");
    });
    await waitFor(() => {
      const el = getToastItems().find((li) =>
        li.textContent?.includes("Info type check")
      );
      expect(el?.getAttribute("data-type")).toBe("info");
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 12. toast.warning()
// ─────────────────────────────────────────────────────────────────────────────

describe("toast.warning()", () => {
  it("renders the warning message text", async () => {
    render(<Toaster />);
    act(() => {
      toast.warning("Low disk space.");
    });
    await waitForToast("Low disk space.");
    expect(document.body.textContent).toContain("Low disk space.");
  });

  it("toast item has data-type='warning'", async () => {
    render(<Toaster />);
    act(() => {
      toast.warning("Warning type check");
    });
    await waitFor(() => {
      const el = getToastItems().find((li) =>
        li.textContent?.includes("Warning type check")
      );
      expect(el?.getAttribute("data-type")).toBe("warning");
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 13. toast.loading()
// ─────────────────────────────────────────────────────────────────────────────

describe("toast.loading()", () => {
  it("renders the loading message text", async () => {
    render(<Toaster />);
    act(() => {
      toast.loading("Uploading…");
    });
    await waitForToast("Uploading…");
    expect(document.body.textContent).toContain("Uploading…");
  });

  it("loading toast renders a loading icon wrapper element", async () => {
    render(<Toaster />);
    act(() => {
      toast.loading("Loading spinner check");
    });
    await waitForToast("Loading spinner check");
    const toastEl = getToastItems().find((el) =>
      el.textContent?.includes("Loading spinner check")
    )!;
    const loader = toastEl.querySelector(".sonner-loading-wrapper, [data-icon]");
    expect(loader).not.toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 14. toast with description
// ─────────────────────────────────────────────────────────────────────────────

describe("toast – with description", () => {
  it("description text is visible inside the toast", async () => {
    render(<Toaster />);
    act(() => {
      toast.success("Export complete.", {
        description: "Your report has been saved to Downloads/report.csv.",
      });
    });
    await waitForToast("Export complete.");
    expect(document.body.textContent).toContain(
      "Your report has been saved to Downloads/report.csv."
    );
  });

  it("description is rendered in a [data-description] element", async () => {
    render(<Toaster />);
    act(() => {
      toast.error("Upload failed.", {
        description: "File exceeds the 25 MB limit.",
      });
    });
    await waitForToast("Upload failed.");
    const toastEl = getToastItems().find((el) =>
      el.textContent?.includes("Upload failed.")
    )!;
    const desc = toastEl.querySelector("[data-description]");
    expect(desc).not.toBeNull();
    expect(desc?.textContent).toContain("File exceeds the 25 MB limit.");
  });

  it("title is rendered in a [data-title] element alongside description", async () => {
    render(<Toaster />);
    act(() => {
      toast.info("New version available.", {
        description: "Version 3.2.0 includes performance improvements.",
      });
    });
    await waitForToast("New version available.");
    const toastEl = getToastItems().find((el) =>
      el.textContent?.includes("New version available.")
    )!;
    const title = toastEl.querySelector("[data-title]");
    expect(title).not.toBeNull();
    expect(title?.textContent).toContain("New version available.");
  });

  it("multiple description variants render correctly", async () => {
    render(<Toaster />);
    act(() => {
      toast.warning("API rate limit approaching.", {
        description: "You have used 80% of your hourly quota.",
      });
    });
    await waitForToast("API rate limit approaching.");
    expect(document.body.textContent).toContain("You have used 80% of your hourly quota.");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 15. toast with action button
// ─────────────────────────────────────────────────────────────────────────────

describe("toast – with action button", () => {
  it("action label is visible inside the toast", async () => {
    render(<Toaster />);
    act(() => {
      toast("Item moved to trash.", {
        action: { label: "Undo", onClick: vi.fn() },
      });
    });
    await waitForToast("Item moved to trash.");
    expect(document.body.textContent).toContain("Undo");
  });

  it("action button has [data-button] attribute", async () => {
    render(<Toaster />);
    act(() => {
      toast("Action data attr", {
        action: { label: "Go", onClick: vi.fn() },
      });
    });
    await waitForToast("Action data attr");
    const toastEl = getToastItems().find((el) =>
      el.textContent?.includes("Action data attr")
    )!;
    expect(toastEl.querySelector("[data-button]")).not.toBeNull();
  });

  it("clicking the action button calls the onClick handler", async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<Toaster />);
    act(() => {
      toast("Click action test", {
        duration: Infinity,
        action: { label: "Do it", onClick: handler },
      });
    });
    await waitForToast("Click action test");
    const actionBtn = Array.from(
      document.querySelectorAll<HTMLElement>("[data-button]")
    ).find((el) => el.textContent?.includes("Do it"));
    expect(actionBtn).not.toBeUndefined();
    await user.click(actionBtn!);
    expect(handler).toHaveBeenCalledTimes(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 16. toast with cancel button
// ─────────────────────────────────────────────────────────────────────────────

describe("toast – with cancel button", () => {
  it("cancel label is visible inside the toast", async () => {
    render(<Toaster />);
    act(() => {
      toast.info("New update available.", {
        action: { label: "Install now", onClick: vi.fn() },
        cancel: { label: "Later", onClick: vi.fn() },
      });
    });
    await waitForToast("New update available.");
    expect(document.body.textContent).toContain("Later");
  });

  it("cancel button has [data-cancel] attribute", async () => {
    render(<Toaster />);
    act(() => {
      toast("Cancel data attr", {
        action: { label: "OK", onClick: vi.fn() },
        cancel: { label: "Dismiss", onClick: vi.fn() },
      });
    });
    await waitForToast("Cancel data attr");
    const toastEl = getToastItems().find((el) =>
      el.textContent?.includes("Cancel data attr")
    )!;
    expect(toastEl.querySelector("[data-cancel]")).not.toBeNull();
  });

  it("clicking the cancel button calls its onClick handler", async () => {
    const cancelFn = vi.fn();
    const user = userEvent.setup();
    render(<Toaster />);
    act(() => {
      toast("Cancel click test", {
        duration: Infinity,
        action: { label: "Confirm", onClick: vi.fn() },
        cancel: { label: "CancelMe", onClick: cancelFn },
      });
    });
    await waitForToast("Cancel click test");
    const cancelBtn = Array.from(
      document.querySelectorAll<HTMLElement>("[data-cancel]")
    ).find((el) => el.textContent?.includes("CancelMe"));
    expect(cancelBtn).not.toBeUndefined();
    await user.click(cancelBtn!);
    expect(cancelFn).toHaveBeenCalledTimes(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 17. toast with action + cancel (combined)
// ─────────────────────────────────────────────────────────────────────────────

describe("toast – with action AND cancel", () => {
  it("both action and cancel labels are rendered in the same toast", async () => {
    render(<Toaster />);
    act(() => {
      toast.warning("Unsaved changes.", {
        description: "You have unsaved changes that will be lost.",
        action: { label: "SaveNow", onClick: vi.fn() },
        cancel: { label: "DiscardNow", onClick: vi.fn() },
      });
    });
    await waitForToast("Unsaved changes.");
    expect(document.body.textContent).toContain("SaveNow");
    expect(document.body.textContent).toContain("DiscardNow");
  });

  it("action error toast with retry and cancel renders both buttons", async () => {
    render(<Toaster />);
    act(() => {
      toast.error("Submission failed.", {
        description: "Check your connection.",
        action: { label: "Retry", onClick: vi.fn() },
        cancel: { label: "Dismiss", onClick: vi.fn() },
      });
    });
    await waitForToast("Submission failed.");
    const toastEl = getToastItems().find((el) =>
      el.textContent?.includes("Submission failed.")
    )!;
    expect(toastEl.querySelector("[data-button]")).not.toBeNull();
    expect(toastEl.querySelector("[data-cancel]")).not.toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 18. toast.custom() — JSX content
// ─────────────────────────────────────────────────────────────────────────────

describe("toast.custom()", () => {
  it("renders custom JSX content inside the toast", async () => {
    render(<Toaster />);
    act(() => {
      toast.custom(() => (
        <div data-testid="custom-toast-content">
          <p>Milestone reached!</p>
        </div>
      ));
    });
    await waitFor(() => {
      expect(document.querySelector("[data-testid='custom-toast-content']")).not.toBeNull();
    });
    expect(screen.getByTestId("custom-toast-content")).toBeInTheDocument();
  });

  it("custom toast text is visible in the document", async () => {
    render(<Toaster />);
    act(() => {
      toast.custom(() => <div><span>Custom text content</span></div>);
    });
    await waitFor(() => {
      expect(document.body.textContent).toContain("Custom text content");
    });
  });

  it("custom toast with manual dismiss removes the toast", async () => {
    const user = userEvent.setup();
    render(<Toaster />);
    act(() => {
      toast.custom((id) => (
        <div>
          <p>Custom dismissible</p>
          <button onClick={() => toast.dismiss(id)}>CloseCustom</button>
        </div>
      ), { duration: Infinity });
    });
    await waitFor(() => {
      expect(document.body.textContent).toContain("Custom dismissible");
    });
    const closeBtn = screen.getByRole("button", { name: "CloseCustom" });
    await user.click(closeBtn);
    await waitFor(() => {
      expect(document.body.textContent).not.toContain("Custom dismissible");
    }, { timeout: 3000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 19. closeButton prop
// ─────────────────────────────────────────────────────────────────────────────

describe("Toaster – closeButton prop", () => {
  it("closeButton=true renders a [data-close-button] element on each toast", async () => {
    render(<Toaster closeButton />);
    act(() => {
      toast("Close button toast", { duration: Infinity });
    });
    await waitForToast("Close button toast");
    const toastEl = getToastItems().find((el) =>
      el.textContent?.includes("Close button toast")
    )!;
    expect(toastEl.querySelector("[data-close-button]")).not.toBeNull();
  });

  it("per-toast closeButton=true renders [data-close-button] on that toast", async () => {
    render(<Toaster />);
    act(() => {
      toast.info("Per-toast close", { closeButton: true, duration: Infinity });
    });
    await waitForToast("Per-toast close");
    const toastEl = getToastItems().find((el) =>
      el.textContent?.includes("Per-toast close")
    )!;
    expect(toastEl.querySelector("[data-close-button]")).not.toBeNull();
  });

  it(
    "clicking the close button removes the toast",
    async () => {
      const user = userEvent.setup();
      render(<Toaster closeButton />);
      act(() => {
        toast("Dismissible via X", { duration: Infinity });
      });
      await waitForToast("Dismissible via X");
      const toastEl = getToastItems().find((el) =>
        el.textContent?.includes("Dismissible via X")
      )!;
      const closeBtn = toastEl.querySelector<HTMLElement>("[data-close-button]");
      expect(closeBtn).not.toBeNull();
      await user.click(closeBtn!);
      await waitFor(() => {
        const visibleItems = getToastItems().filter(
          (el) => el.getAttribute("data-visible") !== "false"
        );
        expect(visibleItems.some((el) => el.textContent?.includes("Dismissible via X"))).toBe(false);
      }, { timeout: 3000 });
    }
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// 20. toast.dismiss()
// ─────────────────────────────────────────────────────────────────────────────

describe("toast.dismiss()", () => {
  it("toast.dismiss() with no args makes all toasts invisible", async () => {
    render(<Toaster />);
    act(() => {
      toast("Dismiss all 1", { duration: Infinity });
      toast("Dismiss all 2", { duration: Infinity });
    });
    await waitFor(() => expect(getToastItems().length).toBeGreaterThanOrEqual(2));
    act(() => {
      toast.dismiss();
    });
    await waitFor(() => {
      const visibleItems = getToastItems().filter(
        (el) =>
          el.getAttribute("data-visible") !== "false" &&
          !el.hasAttribute("data-removed")
      );
      expect(visibleItems.length).toBe(0);
    }, { timeout: 3000 });
  });

  it("toast.dismiss(id) makes the targeted toast invisible", async () => {
    render(<Toaster />);
    let id1: string | number;
    act(() => {
      id1 = toast("Remove this one", { duration: Infinity });
      toast("Keep this one", { duration: Infinity });
    });
    await waitFor(() => expect(getToastItems().length).toBeGreaterThanOrEqual(2));

    act(() => {
      toast.dismiss(id1);
    });
    await waitFor(() => {
      const visibleItems = getToastItems().filter(
        (el) => el.getAttribute("data-visible") !== "false"
      );
      expect(visibleItems.some((el) => el.textContent?.includes("Remove this one"))).toBe(false);
    }, { timeout: 3000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 21. toast with id — update by id
// ─────────────────────────────────────────────────────────────────────────────

describe("toast – update by id", () => {
  it("updating a toast by id changes its displayed content", async () => {
    render(<Toaster />);
    let toastId: string | number;
    act(() => {
      toastId = toast.loading("Running background job…", { duration: Infinity });
    });
    await waitForToast("Running background job…");

    act(() => {
      toast.success("Job completed!", { id: toastId });
    });
    await waitFor(() => {
      expect(document.body.textContent).toContain("Job completed!");
    }, { timeout: 3000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 22. toast.promise()
// ─────────────────────────────────────────────────────────────────────────────

describe("toast.promise()", () => {
  it("shows the loading message while the promise is pending", async () => {
    render(<Toaster />);
    const neverResolves = new Promise<void>(() => {});
    act(() => {
      toast.promise(neverResolves, {
        loading: "Processing records…",
        success: "Done!",
        error: "Failed.",
      });
    });
    await waitForToast("Processing records…");
    expect(document.body.textContent).toContain("Processing records…");
  });

  it("transitions to success message when promise resolves", async () => {
    render(<Toaster />);
    let resolve!: () => void;
    const p = new Promise<void>((res) => { resolve = res; });
    act(() => {
      toast.promise(p, {
        loading: "Saving changes…",
        success: "All changes saved.",
        error: "Failed to save.",
      });
    });
    await waitForToast("Saving changes…");
    act(() => { resolve(); });
    await waitFor(() => {
      expect(document.body.textContent).toContain("All changes saved.");
    }, { timeout: 3000 });
  });

  it("transitions to error message when promise rejects", async () => {
    render(<Toaster />);
    let reject!: (err: Error) => void;
    const p = new Promise<void>((_, rej) => { reject = rej; });
    act(() => {
      toast.promise(p, {
        loading: "Uploading file…",
        success: "Upload done.",
        error: "Upload failed. Please try again.",
      });
    });
    await waitForToast("Uploading file…");
    act(() => { reject(new Error("Network timeout")); });
    await waitFor(() => {
      expect(document.body.textContent).toContain("Upload failed. Please try again.");
    }, { timeout: 3000 });
  });

  it("promise toast with description shows description text", async () => {
    render(<Toaster />);
    let resolve!: () => void;
    const p = new Promise<void>((res) => { resolve = res; });
    act(() => {
      toast.promise(p, {
        loading: "Saving progress…",
        success: "Progress saved.",
        error: "Save failed.",
        description: "Your progress is being persisted.",
      });
    });
    await waitForToast("Saving progress…");
    // The description is shown during loading
    expect(document.body.textContent).toContain("Your progress is being persisted.");
    act(() => { resolve(); });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 23. richColors prop on Toaster
// ─────────────────────────────────────────────────────────────────────────────

describe("Toaster – richColors prop", () => {
  it("richColors=true renders without error", () => {
    expect(() => render(<Toaster richColors />)).not.toThrow();
  });

  it("richColors success toast carries data-rich-colors='true' on <li>", async () => {
    render(<Toaster richColors />);
    act(() => {
      toast.success("Rich success", { richColors: true });
    });
    await waitForToast("Rich success");
    const toastEl = getToastItems().find((el) =>
      el.textContent?.includes("Rich success")
    )!;
    expect(toastEl.getAttribute("data-rich-colors")).toBe("true");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 24. richColors on individual toasts
// ─────────────────────────────────────────────────────────────────────────────

describe("individual toast richColors option", () => {
  (["success", "error", "info", "warning"] as const).forEach((type) => {
    it(`toast.${type}() with richColors:true → data-rich-colors='true' on <li>`, async () => {
      render(<Toaster />);
      act(() => {
        toast[type](`Rich ${type} check`, { richColors: true });
      });
      await waitForToast(`Rich ${type} check`);
      const toastEl = getToastItems().find((el) =>
        el.textContent?.includes(`Rich ${type} check`)
      )!;
      expect(toastEl.getAttribute("data-rich-colors")).toBe("true");
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 25. duration:Infinity
// ─────────────────────────────────────────────────────────────────────────────

describe("toast – duration:Infinity", () => {
  it("toast with Infinity duration persists in DOM", async () => {
    render(<Toaster />);
    act(() => {
      toast("Sticky notification", { duration: Infinity, dismissible: true });
    });
    await waitForToast("Sticky notification");
    // Short delay to confirm it has not auto-dismissed
    await new Promise((r) => setTimeout(r, 200));
    expect(document.body.textContent).toContain("Sticky notification");
  });

  it("persistent toast has data-dismissible='true'", async () => {
    render(<Toaster />);
    act(() => {
      toast("Dismissible attr check", { duration: Infinity, dismissible: true });
    });
    await waitForToast("Dismissible attr check");
    const toastEl = getToastItems().find((el) =>
      el.textContent?.includes("Dismissible attr check")
    )!;
    expect(toastEl.getAttribute("data-dismissible")).toBe("true");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 26. Multiple toasts at once
// ─────────────────────────────────────────────────────────────────────────────

describe("Multiple toasts", () => {
  it("renders multiple toasts simultaneously", async () => {
    render(<Toaster />);
    act(() => {
      toast.success("First toast", { duration: Infinity });
      toast.error("Second toast", { duration: Infinity });
      toast.info("Third toast", { duration: Infinity });
    });
    await waitFor(() => {
      expect(getToastItems().length).toBeGreaterThanOrEqual(3);
    });
    expect(document.body.textContent).toContain("First toast");
    expect(document.body.textContent).toContain("Second toast");
    expect(document.body.textContent).toContain("Third toast");
  });

  it("each toast has a distinct message", async () => {
    render(<Toaster />);
    act(() => {
      toast("Message A", { duration: Infinity });
      toast("Message B", { duration: Infinity });
    });
    await waitFor(() => {
      expect(getToastItems().length).toBeGreaterThanOrEqual(2);
    });
    const texts = getToastItems().map((el) => el.textContent ?? "");
    expect(texts.some((t) => t.includes("Message A"))).toBe(true);
    expect(texts.some((t) => t.includes("Message B"))).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 27. containerAriaLabel override
// ─────────────────────────────────────────────────────────────────────────────

describe("Toaster – containerAriaLabel", () => {
  it("default aria-label contains 'Notifications'", () => {
    render(<Toaster />);
    const section = getSonnerSection();
    expect(section.getAttribute("aria-label")).toMatch(/Notifications/i);
  });

  it("custom containerAriaLabel is reflected in section aria-label", () => {
    render(<Toaster containerAriaLabel="Alerts" />);
    const section = getSonnerSection();
    expect(section.getAttribute("aria-label")).toMatch(/Alerts/i);
  });

  it("custom containerAriaLabel with special characters works", () => {
    expect(() => render(<Toaster containerAriaLabel="System Notifications" />)).not.toThrow();
    const section = getSonnerSection();
    expect(section.getAttribute("aria-label")).toMatch(/System Notifications/i);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 28. dir prop
// ─────────────────────────────────────────────────────────────────────────────

describe("Toaster – dir prop", () => {
  it("dir='rtl' is forwarded to the <ol> (appears after a toast)", async () => {
    render(<Toaster dir="rtl" />);
    act(() => {
      toast("RTL test");
    });
    await waitForToast("RTL test");
    expect(getToasterOl().getAttribute("dir")).toBe("rtl");
  });

  it("dir='ltr' is forwarded to the <ol>", async () => {
    render(<Toaster dir="ltr" />);
    act(() => {
      toast("LTR test");
    });
    await waitForToast("LTR test");
    expect(getToasterOl().getAttribute("dir")).toBe("ltr");
  });

  it("default dir is 'ltr' (document direction)", async () => {
    render(<Toaster />);
    act(() => {
      toast("Default dir test");
    });
    await waitForToast("Default dir test");
    // Default is ltr in jsdom
    expect(getToasterOl().getAttribute("dir")).toBe("ltr");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 29. A11y — static Toaster (no open toasts)
// ─────────────────────────────────────────────────────────────────────────────

describe("Toaster – accessibility (axe) – static", () => {
  it("static Toaster (no toasts) has no axe violations", async () => {
    const { container } = render(<Toaster />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Toaster with position + richColors (no toasts) has no axe violations", async () => {
    const { container } = render(
      <Toaster position="top-right" richColors theme="light" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Toaster with custom containerAriaLabel has no axe violations", async () => {
    const { container } = render(<Toaster containerAriaLabel="App Notifications" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 30. A11y — Toaster after toasts are shown
// ─────────────────────────────────────────────────────────────────────────────

describe("Toaster – accessibility (axe) – with active toasts", () => {
  it("success toast has no axe violations", async () => {
    render(<Toaster />);
    act(() => {
      toast.success("Accessible success toast", { duration: Infinity });
    });
    await waitForToast("Accessible success toast");
    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });

  it("error toast with description has no axe violations", async () => {
    render(<Toaster />);
    act(() => {
      toast.error("Accessible error toast", {
        description: "Check your connection and try again.",
        duration: Infinity,
      });
    });
    await waitForToast("Accessible error toast");
    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });

  it("toast with action button has no axe violations", async () => {
    render(<Toaster />);
    act(() => {
      toast("Accessible action toast", {
        duration: Infinity,
        action: { label: "Undo action", onClick: vi.fn() },
      });
    });
    await waitForToast("Accessible action toast");
    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });

  it("toast with close button has no axe violations", async () => {
    render(<Toaster closeButton />);
    act(() => {
      toast.info("Accessible close button toast", { duration: Infinity });
    });
    await waitForToast("Accessible close button toast");
    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });
});
