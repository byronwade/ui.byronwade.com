/**
 * Exhaustive tests for the OpenIn ("Open in chat") compound component family
 *
 * Component source: components/ai-elements/open-in-chat.tsx
 *
 * Exports (all from @/components/ai-elements/open-in-chat):
 *   OpenIn          — root provider; wraps DropdownMenu + supplies `query` context
 *   OpenInTrigger   — button that opens the menu (default "Open in chat" button)
 *   OpenInContent   — portal popup (width w-60)
 *   OpenInLabel     — non-interactive header row
 *   OpenInSeparator — visual divider
 *   OpenInItem      — generic passthrough menu item
 *   OpenInChatGPT   — link item → chatgpt.com
 *   OpenInClaude    — link item → claude.ai
 *   OpenInT3        — link item → t3.chat
 *   OpenInScira     — link item → scira.ai
 *   OpenInv0        — link item → v0.app
 *   OpenInCursor    — link item → cursor.com
 *
 * Strategy:
 *   1. Render without crashing (closed + open)
 *   2. Trigger: default button + custom children, data-slot
 *   3. Content: data-slot, w-60 width, className merge
 *   4. Label / Separator / Item: data-slot + passthrough
 *   5. Every provider item: renders as <a>, correct href + query encoding,
 *      target/rel, title text, data-provider, data-slot
 *   6. Context guard: provider item outside <OpenIn> throws
 *   7. Interactions: open on click, items present in portal
 *   8. Accessibility via axe (closed + open)
 */

import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";

import {
  OpenIn,
  OpenInTrigger,
  OpenInContent,
  OpenInLabel,
  OpenInSeparator,
  OpenInItem,
  OpenInChatGPT,
  OpenInClaude,
  OpenInT3,
  OpenInScira,
  OpenInv0,
  OpenInCursor,
} from "@/components/ai-elements/open-in-chat";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const QUERY = "How do I deploy a Next.js app?";

/** A fully-composed menu. `defaultOpen` renders the portal content immediately. */
function FullMenu({
  defaultOpen = false,
  query = QUERY,
}: {
  defaultOpen?: boolean;
  query?: string;
}) {
  return (
    <OpenIn query={query} defaultOpen={defaultOpen}>
      <OpenInTrigger />
      <OpenInContent>
        <OpenInLabel>Open this prompt in…</OpenInLabel>
        <OpenInSeparator />
        <OpenInChatGPT />
        <OpenInClaude />
        <OpenInCursor />
        <OpenInScira />
        <OpenInT3 />
        <OpenInv0 />
      </OpenInContent>
    </OpenIn>
  );
}

/** Open-state content for a single provider item, returns the rendered <a>. */
async function openWithItem(item: React.ReactNode) {
  render(
    <OpenIn query={QUERY} defaultOpen>
      <OpenInTrigger />
      <OpenInContent>{item}</OpenInContent>
    </OpenIn>
  );
  await waitFor(() =>
    expect(
      document.querySelector("[data-slot='open-in-content']")
    ).not.toBeNull()
  );
}

/** The provider rows, parameterized for table-driven tests. */
const PROVIDERS: Array<{
  name: string;
  Comp: React.ComponentType<Record<string, unknown>>;
  key: string;
  title: string;
  hrefIncludes: string;
}> = [
  {
    name: "ChatGPT",
    Comp: OpenInChatGPT,
    key: "chatgpt",
    title: "Open in ChatGPT",
    hrefIncludes: "chatgpt.com",
  },
  {
    name: "Claude",
    Comp: OpenInClaude,
    key: "claude",
    title: "Open in Claude",
    hrefIncludes: "claude.ai",
  },
  {
    name: "Cursor",
    Comp: OpenInCursor,
    key: "cursor",
    title: "Open in Cursor",
    hrefIncludes: "cursor.com",
  },
  {
    name: "Scira",
    Comp: OpenInScira,
    key: "scira",
    title: "Open in Scira",
    hrefIncludes: "scira.ai",
  },
  {
    name: "T3",
    Comp: OpenInT3,
    key: "t3",
    title: "Open in T3 Chat",
    hrefIncludes: "t3.chat",
  },
  {
    name: "v0",
    Comp: OpenInv0,
    key: "v0",
    title: "Open in v0",
    hrefIncludes: "v0.app",
  },
];

// ---------------------------------------------------------------------------
// 1. Renders without crashing
// ---------------------------------------------------------------------------

describe("OpenIn — renders without crashing", () => {
  it("renders a closed menu (trigger only) without crashing", () => {
    expect(() => render(<FullMenu />)).not.toThrow();
  });

  it("renders the default trigger button", () => {
    render(<FullMenu />);
    expect(
      screen.getByRole("button", { name: /open in chat/i })
    ).toBeInTheDocument();
  });

  it("renders an open menu (defaultOpen) without crashing", async () => {
    render(<FullMenu defaultOpen />);
    await waitFor(() =>
      expect(
        document.querySelector("[data-slot='open-in-content']")
      ).not.toBeNull()
    );
  });
});

// ---------------------------------------------------------------------------
// 2. OpenInTrigger
// ---------------------------------------------------------------------------

describe("OpenInTrigger", () => {
  it("has data-slot='open-in-trigger'", () => {
    render(<FullMenu />);
    expect(
      screen.getByRole("button", { name: /open in chat/i })
    ).toHaveAttribute("data-slot", "open-in-trigger");
  });

  it("renders the default 'Open in chat' label when no children", () => {
    render(
      <OpenIn query={QUERY}>
        <OpenInTrigger />
      </OpenIn>
    );
    expect(screen.getByText("Open in chat")).toBeInTheDocument();
  });

  it("renders a custom child trigger when children are provided", () => {
    render(
      <OpenIn query={QUERY}>
        <OpenInTrigger>Share prompt</OpenInTrigger>
      </OpenIn>
    );
    expect(
      screen.getByRole("button", { name: "Share prompt" })
    ).toBeInTheDocument();
    expect(screen.queryByText("Open in chat")).not.toBeInTheDocument();
  });

  it("opens the menu when clicked", async () => {
    const user = userEvent.setup();
    render(<FullMenu />);
    await user.click(screen.getByRole("button", { name: /open in chat/i }));
    await waitFor(() =>
      expect(
        document.querySelector("[data-slot='open-in-content']")
      ).not.toBeNull()
    );
  });

  it("forwards a disabled prop to the trigger", () => {
    render(
      <OpenIn query={QUERY}>
        <OpenInTrigger disabled>Locked</OpenInTrigger>
      </OpenIn>
    );
    expect(screen.getByRole("button", { name: "Locked" })).toBeDisabled();
  });
});

// ---------------------------------------------------------------------------
// 3. OpenInContent
// ---------------------------------------------------------------------------

describe("OpenInContent", () => {
  it("has data-slot='open-in-content'", async () => {
    render(<FullMenu defaultOpen />);
    await waitFor(() =>
      expect(
        document.querySelector("[data-slot='open-in-content']")
      ).not.toBeNull()
    );
  });

  it("applies the w-60 width class", async () => {
    render(<FullMenu defaultOpen />);
    await waitFor(() => {
      const content = document.querySelector(
        "[data-slot='open-in-content']"
      ) as HTMLElement;
      expect(content.className).toContain("w-60");
    });
  });

  it("merges a custom className", async () => {
    render(
      <OpenIn query={QUERY} defaultOpen>
        <OpenInTrigger />
        <OpenInContent className="custom-content">
          <OpenInChatGPT />
        </OpenInContent>
      </OpenIn>
    );
    await waitFor(() => {
      const content = document.querySelector(
        "[data-slot='open-in-content']"
      ) as HTMLElement;
      expect(content.className).toContain("custom-content");
      expect(content.className).toContain("w-60");
    });
  });
});

// ---------------------------------------------------------------------------
// 4. OpenInLabel / OpenInSeparator / OpenInItem
// ---------------------------------------------------------------------------

describe("OpenInLabel", () => {
  it("has data-slot='open-in-label' and renders text", async () => {
    render(<FullMenu defaultOpen />);
    await waitFor(() => {
      const label = document.querySelector("[data-slot='open-in-label']");
      expect(label).not.toBeNull();
      expect(label).toHaveTextContent("Open this prompt in…");
    });
  });

  it("forwards a custom className", async () => {
    render(
      <OpenIn query={QUERY} defaultOpen>
        <OpenInTrigger />
        <OpenInContent>
          <OpenInLabel className="my-label">Heading</OpenInLabel>
        </OpenInContent>
      </OpenIn>
    );
    await waitFor(() => {
      const label = document.querySelector(
        "[data-slot='open-in-label']"
      ) as HTMLElement;
      expect(label.className).toContain("my-label");
    });
  });
});

describe("OpenInSeparator", () => {
  it("has data-slot='open-in-separator'", async () => {
    render(<FullMenu defaultOpen />);
    await waitFor(() =>
      expect(
        document.querySelector("[data-slot='open-in-separator']")
      ).not.toBeNull()
    );
  });

  it("forwards a custom className", async () => {
    render(
      <OpenIn query={QUERY} defaultOpen>
        <OpenInTrigger />
        <OpenInContent>
          <OpenInSeparator className="my-sep" />
          <OpenInChatGPT />
        </OpenInContent>
      </OpenIn>
    );
    await waitFor(() => {
      const sep = document.querySelector(
        "[data-slot='open-in-separator']"
      ) as HTMLElement;
      expect(sep.className).toContain("my-sep");
    });
  });
});

describe("OpenInItem (generic passthrough)", () => {
  it("has data-slot='open-in-item' and renders children", async () => {
    render(
      <OpenIn query={QUERY} defaultOpen>
        <OpenInTrigger />
        <OpenInContent>
          <OpenInItem>Custom action</OpenInItem>
        </OpenInContent>
      </OpenIn>
    );
    await waitFor(() => {
      const item = document.querySelector("[data-slot='open-in-item']");
      expect(item).not.toBeNull();
      expect(item).toHaveTextContent("Custom action");
    });
  });

  it("fires onClick when activated", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <OpenIn query={QUERY} defaultOpen>
        <OpenInTrigger />
        <OpenInContent>
          <OpenInItem onClick={onClick}>Clickable</OpenInItem>
        </OpenInContent>
      </OpenIn>
    );
    await waitFor(() =>
      expect(screen.getByText("Clickable")).toBeInTheDocument()
    );
    await user.click(screen.getByText("Clickable"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("forwards a custom className", async () => {
    render(
      <OpenIn query={QUERY} defaultOpen>
        <OpenInTrigger />
        <OpenInContent>
          <OpenInItem className="my-item">Item</OpenInItem>
        </OpenInContent>
      </OpenIn>
    );
    await waitFor(() => {
      const item = document.querySelector(
        "[data-slot='open-in-item']"
      ) as HTMLElement;
      expect(item.className).toContain("my-item");
    });
  });
});

// ---------------------------------------------------------------------------
// 5. Provider items — table-driven (every export)
// ---------------------------------------------------------------------------

describe("Provider items — render as links with correct targets", () => {
  it.each(PROVIDERS)(
    "$name renders an <a> with data-slot, data-provider, target, rel, and title",
    async ({ Comp, key, title, hrefIncludes }) => {
      await openWithItem(<Comp />);
      const item = document.querySelector(
        `[data-slot='open-in-item'][data-provider='${key}']`
      ) as HTMLAnchorElement;
      expect(item).not.toBeNull();
      expect(item.tagName).toBe("A");
      expect(item).toHaveAttribute("target", "_blank");
      expect(item).toHaveAttribute("rel", "noopener");
      expect(item).toHaveTextContent(title);
      expect(item.getAttribute("href")).toContain(hrefIncludes);
    }
  );

  it.each(PROVIDERS)(
    "$name encodes the query into the href",
    async ({ Comp, key }) => {
      await openWithItem(<Comp />);
      const item = document.querySelector(
        `[data-slot='open-in-item'][data-provider='${key}']`
      ) as HTMLAnchorElement;
      const href = item.getAttribute("href") ?? "";
      // Every provider embeds the URL-encoded query. URLSearchParams encodes
      // spaces as "+", while the URL builder (Cursor) uses "%20" — normalize
      // "+" back to a space before decoding so both forms match.
      const decoded = decodeURIComponent(href.replace(/\+/g, " "));
      expect(decoded).toContain("How do I deploy a Next.js app?");
    }
  );

  it.each(PROVIDERS)(
    "$name exposes icon + title + external-link sub-slots",
    async ({ Comp, key }) => {
      await openWithItem(<Comp />);
      const item = document.querySelector(
        `[data-provider='${key}']`
      ) as HTMLElement;
      expect(
        item.querySelector("[data-slot='open-in-item-icon']")
      ).not.toBeNull();
      expect(
        item.querySelector("[data-slot='open-in-item-title']")
      ).not.toBeNull();
      expect(
        item.querySelector("[data-slot='open-in-item-external']")
      ).not.toBeNull();
    }
  );

  it.each(PROVIDERS)(
    "$name forwards a custom className onto the item",
    async ({ Comp, key }) => {
      await openWithItem(<Comp className="provider-extra" />);
      const item = document.querySelector(
        `[data-provider='${key}']`
      ) as HTMLElement;
      expect(item.className).toContain("provider-extra");
    }
  );
});

describe("Provider items — query encoding specifics", () => {
  it("ChatGPT uses the prompt + hints search params", async () => {
    await openWithItem(<OpenInChatGPT />);
    const item = document.querySelector(
      "[data-provider='chatgpt']"
    ) as HTMLAnchorElement;
    const href = item.getAttribute("href") ?? "";
    expect(href).toContain("hints=search");
    expect(href).toContain("prompt=");
  });

  it("Cursor builds a cursor.com/link/prompt URL with text param", async () => {
    await openWithItem(<OpenInCursor />);
    const item = document.querySelector(
      "[data-provider='cursor']"
    ) as HTMLAnchorElement;
    const href = item.getAttribute("href") ?? "";
    expect(href).toContain("cursor.com/link/prompt");
    expect(href).toContain("text=");
  });

  it("encodes a different query at render time", async () => {
    render(
      <OpenIn query="special & chars = test" defaultOpen>
        <OpenInTrigger />
        <OpenInContent>
          <OpenInClaude />
        </OpenInContent>
      </OpenIn>
    );
    await waitFor(() =>
      expect(document.querySelector("[data-provider='claude']")).not.toBeNull()
    );
    const item = document.querySelector(
      "[data-provider='claude']"
    ) as HTMLAnchorElement;
    const decoded = decodeURIComponent(
      (item.getAttribute("href") ?? "").replace(/\+/g, " ")
    );
    expect(decoded).toContain("special & chars = test");
  });
});

// ---------------------------------------------------------------------------
// 6. Context guard
// ---------------------------------------------------------------------------

describe("OpenIn context guard", () => {
  it("throws when a provider item is rendered outside <OpenIn>", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<OpenInChatGPT />)).toThrow(
      /OpenIn components must be used within an OpenIn provider/
    );
    spy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// 7. Interaction — open on click renders all providers
// ---------------------------------------------------------------------------

describe("OpenIn — open interaction", () => {
  it("clicking the trigger reveals every provider item", async () => {
    const user = userEvent.setup();
    render(<FullMenu />);
    await user.click(screen.getByRole("button", { name: /open in chat/i }));
    await waitFor(() =>
      expect(
        document.querySelector("[data-slot='open-in-content']")
      ).not.toBeNull()
    );
    for (const { title } of PROVIDERS) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it("supports a controlled open state via the open prop", async () => {
    const onOpenChange = vi.fn();
    render(
      <OpenIn query={QUERY} open onOpenChange={onOpenChange}>
        <OpenInTrigger />
        <OpenInContent>
          <OpenInClaude />
        </OpenInContent>
      </OpenIn>
    );
    await waitFor(() =>
      expect(document.querySelector("[data-provider='claude']")).not.toBeNull()
    );
  });
});

// ---------------------------------------------------------------------------
// 8. Accessibility — axe
// ---------------------------------------------------------------------------

describe("OpenIn — accessibility (axe)", () => {
  it("closed menu (trigger only) has no axe violations", async () => {
    const { container } = render(
      <main>
        <FullMenu />
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("open menu with all provider links has no axe violations", async () => {
    // Base UI portals the popup outside any page landmark and injects
    // visually-hidden focus-guard sentinels; scan just the popup element and
    // strip those library internals (region disabled — the isolated popup is
    // intentionally not wrapped in a landmark, matching the dropdown-menu suite).
    render(<FullMenu defaultOpen />);
    await waitFor(() =>
      expect(
        document.querySelector("[data-slot='open-in-content']")
      ).not.toBeNull()
    );
    const popup = document.querySelector(
      "[data-slot='open-in-content']"
    ) as HTMLElement;
    popup
      .querySelectorAll("[data-base-ui-focus-guard]")
      .forEach((el) => el.remove());
    const results = await axe(popup, { rules: { region: { enabled: false } } });
    expect(results).toHaveNoViolations();
  });
});
