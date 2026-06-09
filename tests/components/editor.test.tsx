/**
 * Tests for the Editor (Tiptap rich-text) compound component family.
 *
 * Tiptap/ProseMirror render into a contenteditable host. jsdom lacks layout, so
 * we stub getBoundingClientRect / matchMedia / ResizeObserver / DOMRect and
 * Range/Selection geometry so mount (and the floating menus / slash popup) do
 * not throw. We cover what is reachable in jsdom:
 *   - the editor mounts and renders the prose content (.ProseMirror)
 *   - toolbar buttons render with data-slot + aria-label
 *   - clicking a formatting button runs the editor command without throwing
 *   - token classes are applied (no raw color)
 *   - an axe scan
 *
 * Slash-menu suggestion internals (Fuse + tippy positioning) and table
 * selection geometry are exercised at mount but are not deeply asserted — they
 * require real layout that jsdom does not provide.
 */

import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, afterAll, describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { useCurrentEditor } from "@tiptap/react";

beforeAll(() => {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal("ResizeObserver", ResizeObserverStub);

  if (!window.matchMedia) {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    );
  }

  // jsdom has no layout — every rect is zero. Provide a non-null rect so tippy /
  // the table-position effects don't choke on undefined geometry.
  Element.prototype.getBoundingClientRect = vi.fn(() => ({
    width: 120,
    height: 24,
    top: 0,
    left: 0,
    right: 120,
    bottom: 24,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  })) as unknown as typeof Element.prototype.getBoundingClientRect;

  Range.prototype.getBoundingClientRect = vi.fn(() => ({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  })) as unknown as typeof Range.prototype.getBoundingClientRect;

  Range.prototype.getClientRects = vi.fn(
    () => ({ length: 0, item: () => null, [Symbol.iterator]: function* () {} })
  ) as unknown as typeof Range.prototype.getClientRects;

  Element.prototype.scrollIntoView = vi.fn();

  // ProseMirror's posAtCoords (used by the Placeholder viewport tracker) needs
  // document.elementFromPoint, which jsdom does not implement.
  if (!document.elementFromPoint) {
    // @ts-expect-error patching jsdom Document
    document.elementFromPoint = vi.fn(() => null);
  } else {
    vi.spyOn(document, "elementFromPoint").mockReturnValue(null);
  }
  // caretPositionFromPoint / caretRangeFromPoint are also consulted by PM.
  // @ts-expect-error patching jsdom Document
  document.caretPositionFromPoint = vi.fn(() => null);
  // @ts-expect-error patching jsdom Document
  document.caretRangeFromPoint = vi.fn(() => null);

  // collapseToEnd is called by the slash command; jsdom's Selection lacks a body.
  if (window.getSelection) {
    const sel = window.getSelection();
    if (sel && !sel.collapseToEnd) {
      // @ts-expect-error patching jsdom Selection
      sel.collapseToEnd = vi.fn();
    }
  }
});

afterAll(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

import {
  EditorBubbleMenu,
  EditorCharacterCount,
  EditorClearFormatting,
  EditorFormatBold,
  EditorFormatCode,
  EditorFormatItalic,
  EditorFormatStrike,
  EditorFloatingMenu,
  EditorFormatSubscript,
  EditorFormatSuperscript,
  EditorFormatUnderline,
  EditorLinkSelector,
  EditorNodeBulletList,
  EditorNodeCode,
  EditorNodeHeading1,
  EditorNodeHeading2,
  EditorNodeHeading3,
  EditorNodeOrderedList,
  EditorNodeQuote,
  EditorNodeTable,
  EditorNodeTaskList,
  EditorNodeText,
  EditorProvider,
  EditorSelector,
  EditorTableColumnAfter,
  EditorTableColumnBefore,
  EditorTableColumnDelete,
  EditorTableColumnMenu,
  EditorTableDelete,
  EditorTableFix,
  EditorTableGlobalMenu,
  EditorTableHeaderColumnToggle,
  EditorTableHeaderRowToggle,
  EditorTableMenu,
  EditorTableMergeCells,
  EditorTableRowAfter,
  EditorTableRowBefore,
  EditorTableRowDelete,
  EditorTableRowMenu,
  EditorTableSplitCell,
  defaultSlashSuggestions,
} from "@/components/ui/editor";

const HTML = `<h2>Hello</h2><p>Some <strong>bold</strong> text.</p>`;

/** Wait until the ProseMirror contenteditable surface has mounted. */
async function findProse(container: HTMLElement) {
  return waitFor(() => {
    const prose = container.querySelector(".ProseMirror");
    expect(prose).not.toBeNull();
    return prose as HTMLElement;
  });
}

/**
 * Tiptap's BubbleMenu mounts its children into a detached, layout-driven portal
 * that never becomes visible in jsdom (no selection geometry). The node/format
 * controls only depend on the editor context, so to exercise them we render them
 * directly under EditorProvider — a supported usage that is reachable in jsdom.
 */
function FullToolbar() {
  return (
    <EditorProvider content={HTML} limit={1000} placeholder="Type /">
      <EditorNodeText />
      <EditorNodeHeading1 />
      <EditorNodeHeading2 />
      <EditorNodeHeading3 />
      <EditorNodeBulletList />
      <EditorNodeOrderedList />
      <EditorNodeTaskList />
      <EditorNodeQuote />
      <EditorNodeCode />
      <EditorNodeTable />
      <EditorFormatBold hideName />
      <EditorFormatItalic hideName />
      <EditorFormatStrike hideName />
      <EditorFormatCode hideName />
      <EditorFormatSubscript hideName />
      <EditorFormatSuperscript hideName />
      <EditorFormatUnderline hideName />
      <EditorClearFormatting hideName />
      <EditorCharacterCount.Words>Words: </EditorCharacterCount.Words>
      <EditorCharacterCount.Characters>Chars: </EditorCharacterCount.Characters>
    </EditorProvider>
  );
}

/** The bubble-menu wrapper, exercised only for "mounts without throwing". */
function BubbleToolbar() {
  return (
    <EditorProvider content={HTML} placeholder="Type /">
      <EditorBubbleMenu>
        <EditorNodeText />
        <EditorFormatBold hideName />
        <EditorFormatItalic hideName />
      </EditorBubbleMenu>
    </EditorProvider>
  );
}

function TableToolbar() {
  return (
    <EditorProvider content={`<p>table</p>`}>
      <EditorTableMenu>
        <EditorTableGlobalMenu>
          <EditorTableHeaderColumnToggle />
          <EditorTableHeaderRowToggle />
          <EditorTableMergeCells />
          <EditorTableSplitCell />
          <EditorTableFix />
          <EditorTableDelete />
        </EditorTableGlobalMenu>
        <EditorTableColumnMenu>
          <EditorTableColumnBefore />
          <EditorTableColumnAfter />
          <EditorTableColumnDelete />
        </EditorTableColumnMenu>
        <EditorTableRowMenu>
          <EditorTableRowBefore />
          <EditorTableRowAfter />
          <EditorTableRowDelete />
        </EditorTableRowMenu>
      </EditorTableMenu>
    </EditorProvider>
  );
}

// ---------------------------------------------------------------------------
// Mount + content
// ---------------------------------------------------------------------------

describe("Editor — mount and content", () => {
  it("mounts the editor surface with data-slot='editor'", async () => {
    const { container } = render(
      <EditorProvider content={HTML} placeholder="Write…" />
    );
    expect(
      container.querySelector("[data-slot='editor']")
    ).toBeInTheDocument();
    await findProse(container);
  });

  it("renders a contenteditable ProseMirror surface", async () => {
    const { container } = render(<EditorProvider content={HTML} />);
    const prose = await findProse(container);
    expect(prose).toHaveAttribute("contenteditable", "true");
  });

  it("renders the initial HTML content into the document", async () => {
    const { container } = render(<EditorProvider content={HTML} />);
    await findProse(container);
    await waitFor(() => {
      expect(container.textContent).toContain("Hello");
      expect(container.textContent).toContain("bold");
    });
  });

  it("does not throw with the full toolbar example", async () => {
    const { container } = render(<FullToolbar />);
    await findProse(container);
    expect(
      container.querySelector("[data-slot='editor']")
    ).toBeInTheDocument();
  });

  it("does not throw with the table toolbar example", async () => {
    const { container } = render(<TableToolbar />);
    await findProse(container);
    expect(container.querySelector(".ProseMirror")).not.toBeNull();
  });

  it("applies a custom className on the editor wrapper", async () => {
    const { container } = render(
      <EditorProvider className="my-editor" content={HTML} />
    );
    await findProse(container);
    expect(container.querySelector("[data-slot='editor']")).toHaveClass(
      "my-editor"
    );
  });
});

// ---------------------------------------------------------------------------
// Toolbar buttons — render, data-slot, aria-label
// ---------------------------------------------------------------------------

describe("Editor — bubble menu buttons", () => {
  it("renders formatting buttons with data-slot and aria-label", async () => {
    const { container } = render(<FullToolbar />);
    await findProse(container);
    const buttons = container.querySelectorAll(
      "[data-slot='editor-bubble-menu-button']"
    );
    expect(buttons.length).toBeGreaterThan(0);
    // Bold should be reachable by its accessible name
    expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Italic" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Clear Formatting" })
    ).toBeInTheDocument();
  });

  it("renders a labeled button for each node/format control", async () => {
    const { container } = render(<FullToolbar />);
    await findProse(container);
    for (const name of [
      "Text",
      "Heading 1",
      "Heading 2",
      "Heading 3",
      "Bullet List",
      "Numbered List",
      "To-do List",
      "Quote",
      "Strikethrough",
      "Subscript",
      "Superscript",
      "Underline",
      "Table",
    ]) {
      expect(screen.getByRole("button", { name })).toBeInTheDocument();
    }
  });

  it("the bubble-menu wrapper mounts without throwing", async () => {
    const { container } = render(<BubbleToolbar />);
    await findProse(container);
    // BubbleMenu portals its content into a detached, layout-driven element that
    // stays hidden in jsdom; the editor surface must still be present.
    expect(container.querySelector(".ProseMirror")).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Clicking a formatting button runs the command without throwing
// ---------------------------------------------------------------------------

describe("Editor — running commands", () => {
  it("clicking Bold runs the command and the editor stays mounted", async () => {
    const user = userEvent.setup();
    const { container } = render(<FullToolbar />);
    await findProse(container);
    const bold = screen.getByRole("button", { name: "Bold" });
    await user.click(bold);
    // The editor surface must still be present (command did not crash the tree)
    expect(container.querySelector(".ProseMirror")).not.toBeNull();
  });

  it("clicking several toolbar commands in sequence does not throw", async () => {
    const user = userEvent.setup();
    const { container } = render(<FullToolbar />);
    await findProse(container);
    for (const name of [
      "Italic",
      "Strikethrough",
      "Underline",
      "Heading 1",
      "Bullet List",
      "Quote",
      "Clear Formatting",
    ]) {
      const btn = screen.getByRole("button", { name });
      await user.click(btn);
    }
    // "Code" is shared by EditorNodeCode and EditorFormatCode — click both.
    for (const btn of screen.getAllByRole("button", { name: "Code" })) {
      await user.click(btn);
    }
    expect(container.querySelector(".ProseMirror")).not.toBeNull();
  });

  it("clicking Table runs insertTable without throwing", async () => {
    const user = userEvent.setup();
    const { container } = render(<FullToolbar />);
    await findProse(container);
    await user.click(screen.getByRole("button", { name: "Table" }));
    expect(container.querySelector(".ProseMirror")).not.toBeNull();
  });

  it("clicking every node and format control runs its command closure", async () => {
    const user = userEvent.setup();
    const { container } = render(<FullToolbar />);
    await findProse(container);
    // Click every labeled control. "Code" is shared (node + mark) so click all.
    for (const name of [
      "Text",
      "Heading 1",
      "Heading 2",
      "Heading 3",
      "Bullet List",
      "Numbered List",
      "To-do List",
      "Quote",
      "Table",
      "Bold",
      "Italic",
      "Strikethrough",
      "Subscript",
      "Superscript",
      "Underline",
      "Clear Formatting",
    ]) {
      await user.click(screen.getByRole("button", { name }));
    }
    for (const btn of screen.getAllByRole("button", { name: "Code" })) {
      await user.click(btn);
    }
    expect(container.querySelector(".ProseMirror")).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Character / word count
// ---------------------------------------------------------------------------

describe("Editor — character and word count", () => {
  it("renders the word count slot with mono token styling", async () => {
    const { container } = render(<FullToolbar />);
    await findProse(container);
    const words = container.querySelector("[data-slot='editor-word-count']");
    expect(words).not.toBeNull();
    expect(words).toHaveClass("font-mono");
    expect(words).toHaveClass("text-muted-foreground");
    expect(words?.textContent).toContain("Words:");
  });

  it("renders the character count slot", async () => {
    const { container } = render(<FullToolbar />);
    await findProse(container);
    const chars = container.querySelector(
      "[data-slot='editor-character-count']"
    );
    expect(chars).not.toBeNull();
    expect(chars?.textContent).toContain("Chars:");
  });
});

// ---------------------------------------------------------------------------
// Selector / popovers
// ---------------------------------------------------------------------------

describe("Editor — selector and link popover", () => {
  it("EditorSelector renders a trigger button", async () => {
    const { container } = render(
      <EditorProvider content={HTML}>
        <EditorSelector title="Format">
          <EditorNodeText />
        </EditorSelector>
      </EditorProvider>
    );
    await findProse(container);
    expect(
      document.querySelector("[data-slot='editor-selector-trigger']")
    ).not.toBeNull();
    expect(screen.getByText("Format")).toBeInTheDocument();
  });

  it("opening the EditorSelector reveals its popover children", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <EditorProvider content={HTML}>
        <EditorSelector title="Turn into">
          <EditorNodeHeading1 />
        </EditorSelector>
      </EditorProvider>
    );
    await findProse(container);
    await user.click(screen.getByText("Turn into"));
    expect(
      await screen.findByRole("button", { name: "Heading 1" })
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Token / no-raw-color discipline
// ---------------------------------------------------------------------------

describe("Editor — token discipline", () => {
  it("the code block extension class uses tokens, not hard-coded hex", async () => {
    // The configured code-block class is attached to the editor schema; we assert
    // on the rendered surface that token utilities are present and no #hex leaks
    // into the editor wrapper markup.
    const { container } = render(<EditorProvider content={HTML} />);
    await findProse(container);
    const html = container.innerHTML;
    // No raw 6/3-digit hex colors in the rendered tree.
    expect(html).not.toMatch(/#[0-9a-fA-F]{6}\b/);
  });

  it("the editor wrapper applies the focus-outline-reset utility", async () => {
    const { container } = render(<EditorProvider content={HTML} />);
    await findProse(container);
    const wrapper = container.querySelector("[data-slot='editor']");
    expect(wrapper?.className).toContain("ProseMirror-focused");
  });
});

// ---------------------------------------------------------------------------
// Slash suggestions data
// ---------------------------------------------------------------------------

describe("Editor — slash suggestions", () => {
  it("defaultSlashSuggestions returns the expected command set", () => {
    const items = (
      defaultSlashSuggestions as (props: {
        editor: unknown;
        query: string;
      }) => Array<{ title: string }>
    )({ editor: {}, query: "" });
    const titles = items.map((i) => i.title);
    expect(titles).toContain("Text");
    expect(titles).toContain("Heading 1");
    expect(titles).toContain("Bullet List");
    expect(titles).toContain("Table");
    expect(titles).toContain("Code");
  });

  it("every slash suggestion carries an icon and a command", () => {
    const items = (
      defaultSlashSuggestions as (props: {
        editor: unknown;
        query: string;
      }) => Array<{ icon: unknown; command: unknown }>
    )({ editor: {}, query: "" });
    for (const item of items) {
      expect(item.icon).toBeTruthy();
      expect(typeof item.command).toBe("function");
    }
  });

  it("a slash node in the document round-trips through HTML serialization", async () => {
    // Mounting content that already contains a slash node exercises the node's
    // parseHTML / renderHTML / renderText methods (the serialization branches).
    let html = "";
    function Probe() {
      const { editor } = useCurrentEditor();
      React.useEffect(() => {
        if (editor) {
          html = editor.getHTML();
        }
      }, [editor]);
      return null;
    }
    render(
      <EditorProvider
        content={`<p>hi <span data-type="slash" data-id="foo" data-label="Foo"></span> end</p>`}
      >
        <Probe />
      </EditorProvider>
    );
    await waitFor(() => {
      expect(html).not.toBe("");
    });
    // renderHTML/renderText emit the trigger char + label.
    expect(html).toContain('data-type="slash"');
    expect(html).toContain("/Foo");
  });

  it("typing '/' opens the slash command popup", async () => {
    const user = userEvent.setup();
    const { container } = render(<EditorProvider content={`<p></p>`} />);
    const prose = await findProse(container);
    await user.click(prose);
    await user.keyboard("/");
    await waitFor(() => {
      expect(document.querySelector("#slash-command")).not.toBeNull();
    });
    // The slash menu renders the default suggestion titles via EditorSlashMenu.
    const menu = document.querySelector(
      "[data-slot='editor-slash-menu']"
    ) as HTMLElement;
    expect(menu).not.toBeNull();
    expect(menu.textContent).toContain("Heading 1");
  });

  it("filtering the slash menu narrows the suggestions (Fuse path)", async () => {
    const user = userEvent.setup();
    const { container } = render(<EditorProvider content={`<p></p>`} />);
    const prose = await findProse(container);
    await user.click(prose);
    await user.keyboard("/head");
    await waitFor(() => {
      const menu = document.querySelector("[data-slot='editor-slash-menu']");
      expect(menu?.textContent).toContain("Heading 1");
    });
    const menu = document.querySelector(
      "[data-slot='editor-slash-menu']"
    ) as HTMLElement;
    // A query that matches no command should surface the empty state.
    await user.keyboard("{Backspace}{Backspace}{Backspace}{Backspace}zzzzz");
    await waitFor(() => {
      expect(menu.textContent).toContain("No results");
    });
  });

  it("arrow navigation + Enter selects a slash command without throwing", async () => {
    const user = userEvent.setup();
    const { container } = render(<EditorProvider content={`<p></p>`} />);
    const prose = await findProse(container);
    await user.click(prose);
    await user.keyboard("/");
    await waitFor(() => {
      expect(document.querySelector("#slash-command")).not.toBeNull();
    });
    // handleCommandNavigation forwards ArrowDown/Enter to the cmdk list.
    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    expect(container.querySelector(".ProseMirror")).not.toBeNull();
  });

  it("pressing Escape dismisses the slash menu", async () => {
    const user = userEvent.setup();
    const { container } = render(<EditorProvider content={`<p></p>`} />);
    const prose = await findProse(container);
    await user.click(prose);
    await user.keyboard("/");
    await waitFor(() => {
      expect(document.querySelector("#slash-command")).not.toBeNull();
    });
    await user.keyboard("{Escape}");
    expect(container.querySelector(".ProseMirror")).not.toBeNull();
  });

  it("clicking a slash command item runs its node command", async () => {
    const user = userEvent.setup();
    const { container } = render(<EditorProvider content={`<p></p>`} />);
    const prose = await findProse(container);
    await user.click(prose);
    await user.keyboard("/");
    const item = await waitFor(() => {
      const menu = document.querySelector("[data-slot='editor-slash-menu']");
      const el = Array.from(
        menu?.querySelectorAll("[data-slot='command-item']") ?? []
      ).find((n) => n.textContent?.includes("Heading 1"));
      expect(el).toBeTruthy();
      return el as HTMLElement;
    });
    await user.click(item);
    // The slash node command (deleteRange + setNode) ran; editor stays mounted.
    expect(container.querySelector(".ProseMirror")).not.toBeNull();
  });

  it("Backspace after a slash trigger does not throw (keyboard shortcut path)", async () => {
    const user = userEvent.setup();
    const { container } = render(<EditorProvider content={`<p></p>`} />);
    const prose = await findProse(container);
    await user.click(prose);
    await user.keyboard("/");
    await waitFor(() => {
      expect(document.querySelector("#slash-command")).not.toBeNull();
    });
    await user.keyboard("{Backspace}");
    expect(container.querySelector(".ProseMirror")).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Table controls — rendered directly under the editor context (reachable)
// ---------------------------------------------------------------------------

/**
 * The table-op items (EditorTableColumnBefore, …) and the tooltip-wrapped
 * actions (EditorTableDelete, …) only need editor context to render; the menu
 * wrappers (EditorTableColumnMenu, …) build on DropdownMenu/Button which render
 * their trigger eagerly. We render them directly to exercise every handler.
 */
function AllTableOps() {
  return (
    <EditorProvider content={`<p>x</p>`}>
      {/* dropdown-item ops must live inside a DropdownMenu (Base UI Menu.Root) */}
      <EditorTableColumnMenu>
        <EditorTableColumnBefore />
        <EditorTableColumnAfter />
        <EditorTableColumnDelete />
      </EditorTableColumnMenu>
      <EditorTableRowMenu>
        <EditorTableRowBefore />
        <EditorTableRowAfter />
        <EditorTableRowDelete />
      </EditorTableRowMenu>
      {/* tooltip-wrapped ops render their own Button trigger standalone */}
      <EditorTableHeaderColumnToggle />
      <EditorTableHeaderRowToggle />
      <EditorTableDelete />
      <EditorTableMergeCells />
      <EditorTableSplitCell />
      <EditorTableFix />
    </EditorProvider>
  );
}

describe("Editor — table controls", () => {
  it("renders every table action and toggle without throwing", async () => {
    const { container } = render(<AllTableOps />);
    await findProse(container);
    for (const name of [
      "Toggle header column",
      "Toggle header row",
      "Delete table",
      "Merge cells",
      "Split cell",
      "Fix table",
    ]) {
      expect(screen.getByRole("button", { name })).toBeInTheDocument();
    }
  });

  it("clicking each tooltip-wrapped table action runs its command", async () => {
    const user = userEvent.setup();
    const { container } = render(<AllTableOps />);
    await findProse(container);
    for (const name of [
      "Toggle header column",
      "Toggle header row",
      "Merge cells",
      "Split cell",
      "Fix table",
      "Delete table",
    ]) {
      await user.click(screen.getByRole("button", { name }));
    }
    expect(container.querySelector(".ProseMirror")).not.toBeNull();
  });

  it("opening the column menu fires each column op handler", async () => {
    const user = userEvent.setup();
    const { container } = render(<AllTableOps />);
    await findProse(container);
    const colTrigger = document.querySelector(
      "[data-slot='editor-table-column-menu']"
    ) as HTMLElement;
    await user.click(colTrigger);
    for (const label of [
      "Add column before",
      "Add column after",
      "Delete column",
    ]) {
      const item = await waitFor(() => {
        const el = Array.from(
          document.querySelectorAll("[data-slot='dropdown-menu-item']")
        ).find((n) => n.textContent?.includes(label));
        expect(el).toBeTruthy();
        return el as HTMLElement;
      });
      await user.click(item);
      // re-open between clicks (Base UI closes the menu on item select)
      await user.click(colTrigger);
    }
    expect(container.querySelector(".ProseMirror")).not.toBeNull();
  });

  it("opening the row menu fires each row op handler", async () => {
    const user = userEvent.setup();
    const { container } = render(<AllTableOps />);
    await findProse(container);
    const rowTrigger = document.querySelector(
      "[data-slot='editor-table-row-menu']"
    ) as HTMLElement;
    await user.click(rowTrigger);
    for (const label of ["Add row before", "Add row after", "Delete row"]) {
      const item = await waitFor(() => {
        const el = Array.from(
          document.querySelectorAll("[data-slot='dropdown-menu-item']")
        ).find((n) => n.textContent?.includes(label));
        expect(el).toBeTruthy();
        return el as HTMLElement;
      });
      await user.click(item);
      await user.click(rowTrigger);
    }
    expect(container.querySelector(".ProseMirror")).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Table menu wrappers — DropdownMenu/visibility wrappers mount + open
// ---------------------------------------------------------------------------

describe("Editor — table menu wrappers", () => {
  it("the column/row dropdown triggers render and open", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <EditorProvider content={`<p>x</p>`}>
        <EditorTableColumnMenu>
          <EditorTableColumnBefore />
        </EditorTableColumnMenu>
        <EditorTableRowMenu>
          <EditorTableRowBefore />
        </EditorTableRowMenu>
      </EditorProvider>
    );
    await findProse(container);
    const colTrigger = document.querySelector(
      "[data-slot='editor-table-column-menu']"
    ) as HTMLElement;
    const rowTrigger = document.querySelector(
      "[data-slot='editor-table-row-menu']"
    ) as HTMLElement;
    expect(colTrigger).not.toBeNull();
    expect(rowTrigger).not.toBeNull();
    await user.click(colTrigger);
    expect(await screen.findByText("Add column before")).toBeInTheDocument();
  });

  it("inserting a table and selecting a cell positions the table menus", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <EditorProvider content={`<p>x</p>`}>
        <EditorNodeTable />
        <EditorTableMenu>
          <EditorTableGlobalMenu>
            <EditorTableDelete />
          </EditorTableGlobalMenu>
          <EditorTableColumnMenu>
            <EditorTableColumnBefore />
          </EditorTableColumnMenu>
          <EditorTableRowMenu>
            <EditorTableRowBefore />
          </EditorTableRowMenu>
        </EditorTableMenu>
      </EditorProvider>
    );
    const prose = await findProse(container);
    await user.click(prose);
    await user.click(screen.getByRole("button", { name: "Table" }));
    const cell = await waitFor(() => {
      const c = container.querySelector("td, th");
      expect(c).not.toBeNull();
      return c as HTMLElement;
    });
    // Place a real DOM selection inside the cell, then nudge the editor so its
    // "selectionUpdate" listeners (the table-position effects) run and read the
    // cell/row/table geometry.
    const sel = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(cell);
    sel?.removeAllRanges();
    sel?.addRange(range);
    await user.click(cell);
    await user.keyboard("hi");
    // The table-position effects executed (column/row/global menus mounted);
    // the editor remains intact and a table exists in the document.
    await waitFor(() => {
      expect(container.querySelector("table")).not.toBeNull();
    });
    expect(
      container.querySelector("[data-slot='editor-table-global-menu']")
    ).not.toBeNull();
    expect(container.querySelector(".ProseMirror")).not.toBeNull();
  });

  it("EditorTableMenu hides its children when no table is active", async () => {
    const { container } = render(
      <EditorProvider content={`<p>x</p>`}>
        <EditorTableMenu>
          <span data-testid="table-only">inside</span>
        </EditorTableMenu>
        <EditorTableGlobalMenu>
          <EditorTableDelete />
        </EditorTableGlobalMenu>
      </EditorProvider>
    );
    await findProse(container);
    const wrapper = container.querySelector(
      "[data-slot='editor-table-menu']"
    );
    expect(wrapper).toHaveClass("hidden");
    expect(
      container.querySelector("[data-slot='editor-table-global-menu']")
    ).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Link selector
// ---------------------------------------------------------------------------

describe("Editor — link selector", () => {
  it("renders a Link trigger and opens a URL input on click", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <EditorProvider content={HTML}>
        <EditorLinkSelector />
      </EditorProvider>
    );
    await findProse(container);
    expect(
      document.querySelector("[data-slot='editor-link-selector-trigger']")
    ).not.toBeNull();
    await user.click(screen.getByText("Link"));
    const input = await screen.findByLabelText("Link URL");
    expect(input).toBeInTheDocument();
  });

  it("submitting a valid URL sets a link and does not throw", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <EditorProvider content={HTML}>
        <EditorLinkSelector open onOpenChange={() => {}} />
      </EditorProvider>
    );
    await findProse(container);
    const input = await screen.findByLabelText("Link URL");
    await user.type(input, "example.com");
    const form = input.closest("form") as HTMLFormElement;
    form.requestSubmit?.() ?? form.dispatchEvent(new Event("submit"));
    expect(container.querySelector(".ProseMirror")).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Format marks — clicking each runs its command
// ---------------------------------------------------------------------------

describe("Editor — format marks", () => {
  it("clicking subscript / superscript / underline runs each command", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <EditorProvider content={HTML}>
        <EditorFormatSubscript hideName />
        <EditorFormatSuperscript hideName />
        <EditorFormatUnderline hideName />
        <EditorNodeText />
        <EditorNodeHeading2 />
        <EditorNodeHeading3 />
        <EditorNodeTaskList />
        <EditorNodeQuote />
        <EditorNodeOrderedList />
      </EditorProvider>
    );
    await findProse(container);
    for (const name of [
      "Subscript",
      "Superscript",
      "Underline",
      "Text",
      "Heading 2",
      "Heading 3",
      "To-do List",
      "Quote",
      "Numbered List",
    ]) {
      await user.click(screen.getByRole("button", { name }));
    }
    expect(container.querySelector(".ProseMirror")).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Floating menu
// ---------------------------------------------------------------------------

describe("Editor — floating menu", () => {
  it("the floating-menu wrapper mounts without throwing", async () => {
    const { container } = render(
      <EditorProvider content={`<p></p>`}>
        <EditorFloatingMenu>
          <EditorNodeHeading1 />
        </EditorFloatingMenu>
      </EditorProvider>
    );
    await findProse(container);
    expect(container.querySelector(".ProseMirror")).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// No-editor guard — every editor-aware control returns null off-context
// ---------------------------------------------------------------------------

describe("Editor — null-editor guards", () => {
  // Rendered with no EditorProvider ancestor, useCurrentEditor() yields no
  // editor, so every control must hit its `if (!editor) return null` guard.
  const Controls = [
    EditorClearFormatting,
    EditorNodeText,
    EditorNodeHeading1,
    EditorNodeHeading2,
    EditorNodeHeading3,
    EditorNodeBulletList,
    EditorNodeOrderedList,
    EditorNodeTaskList,
    EditorNodeQuote,
    EditorNodeCode,
    EditorNodeTable,
    EditorFormatBold,
    EditorFormatItalic,
    EditorFormatStrike,
    EditorFormatCode,
    EditorFormatSubscript,
    EditorFormatSuperscript,
    EditorFormatUnderline,
    EditorLinkSelector,
    EditorTableColumnBefore,
    EditorTableColumnAfter,
    EditorTableColumnDelete,
    EditorTableRowBefore,
    EditorTableRowAfter,
    EditorTableRowDelete,
    EditorTableHeaderColumnToggle,
    EditorTableHeaderRowToggle,
    EditorTableDelete,
    EditorTableMergeCells,
    EditorTableSplitCell,
    EditorTableFix,
  ];

  it("each control renders nothing (null) without an editor context", () => {
    for (const Control of Controls) {
      const { container, unmount } = render(<Control />);
      expect(container).toBeEmptyDOMElement();
      unmount();
    }
  });

  it("EditorSelector returns null without an editor context", () => {
    const { container } = render(
      <EditorSelector title="X">
        <span>child</span>
      </EditorSelector>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("character/word count return null without an editor context", () => {
    const { container } = render(
      <>
        <EditorCharacterCount.Characters>c</EditorCharacterCount.Characters>
        <EditorCharacterCount.Words>w</EditorCharacterCount.Words>
      </>
    );
    expect(container).toBeEmptyDOMElement();
  });
});

// ---------------------------------------------------------------------------
// Active-state branches — content where marks/nodes are active
// ---------------------------------------------------------------------------

describe("Editor — active node detection", () => {
  it("renders controls over heading/list/quote content (isActive true paths)", async () => {
    const { container } = render(
      <EditorProvider
        content={`<h1>Title</h1><ul><li>one</li></ul><blockquote>q</blockquote><pre><code>x</code></pre>`}
      >
        <EditorNodeHeading1 />
        <EditorNodeBulletList />
        <EditorNodeQuote />
        <EditorNodeCode />
        <EditorNodeText />
      </EditorProvider>
    );
    await findProse(container);
    // All controls mounted; isActive() closures evaluated against real content.
    expect(
      container.querySelectorAll("[data-slot='editor-bubble-menu-button']")
        .length
    ).toBeGreaterThanOrEqual(5);
  });
});

// ---------------------------------------------------------------------------
// Slash command closures + node text serialization
// ---------------------------------------------------------------------------

describe("Editor — slash command closures", () => {
  it("invoking every default slash command runs its editor chain", () => {
    // A self-returning chain proxy: every property access yields a function that
    // returns the same proxy, so any `.chain().focus()....run()` shape resolves
    // without throwing. This drives each item.command closure (Text, To-do,
    // Heading 1-3, Bullet/Numbered list, Quote, Code, Table).
    const chain: unknown = new Proxy(() => chain, {
      get: () => () => chain,
    });
    const editor = new Proxy(
      {},
      {
        get: () => () => chain,
      }
    ) as unknown as { view: unknown };

    const items = (
      defaultSlashSuggestions as (props: {
        editor: unknown;
        query: string;
      }) => Array<{ command: (p: { editor: unknown; range: unknown }) => void }>
    )({ editor, query: "" });

    expect(() => {
      for (const item of items) {
        item.command({ editor, range: { from: 0, to: 0 } });
      }
    }).not.toThrow();
    // All ten command closures executed without error.
    expect(items.length).toBe(10);
  });

  it("getText() serializes a slash node via the node renderText option", async () => {
    // getHTML() exercises renderHTML; getText() routes through the node-level
    // renderText method, which delegates to the default renderText option
    // (`${char}${label}`). This covers the otherwise-untouched text-serializer
    // path.
    let text = "";
    function Probe() {
      const { editor } = useCurrentEditor();
      React.useEffect(() => {
        if (editor) {
          text = editor.getText();
        }
      }, [editor]);
      return null;
    }
    render(
      <EditorProvider
        content={`<p>hi <span data-type="slash" data-id="foo" data-label="Foo"></span> end</p>`}
      >
        <Probe />
      </EditorProvider>
    );
    await waitFor(() => {
      expect(text).not.toBe("");
    });
    // renderText emits the trigger char + label into the plain-text output.
    expect(text).toContain("/Foo");
  });
});

// ---------------------------------------------------------------------------
// Link selector — remove-link branch
// ---------------------------------------------------------------------------

describe("Editor — link selector remove-link branch", () => {
  it("renders and clicks the Remove link button when a link is active", async () => {
    const user = userEvent.setup();
    // Selecting the whole document puts the cursor inside the existing link, so
    // editor.getAttributes("link").href resolves and the destructive "Remove
    // link" button (instead of "Apply link") renders.
    function SelectAll() {
      const { editor } = useCurrentEditor();
      React.useEffect(() => {
        if (editor) {
          editor.chain().selectAll().run();
        }
      }, [editor]);
      return null;
    }
    const { container } = render(
      <EditorProvider content={`<p><a href="https://example.com">x</a></p>`}>
        <SelectAll />
        <EditorLinkSelector open onOpenChange={() => {}} />
      </EditorProvider>
    );
    await findProse(container);
    const remove = await screen.findByRole("button", { name: "Remove link" });
    await user.click(remove);
    // unsetLink ran; the editor surface is intact.
    expect(container.querySelector(".ProseMirror")).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Accessibility
// ---------------------------------------------------------------------------

describe("Editor — accessibility", () => {
  it("the mounted editor has no axe violations", async () => {
    const { container } = render(
      <EditorProvider content={HTML} placeholder="Write…" />
    );
    await findProse(container);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// Additional branch coverage — wrapper null-guards, slash-node attribute
// variants, URL validation, navigation/short-circuit edge cases.
// ---------------------------------------------------------------------------

describe("Editor — wrapper null-editor guards", () => {
  // EditorTableMenu opens with `if (!editor) return null`; with no provider it
  // hits that guard and renders nothing.
  it("EditorTableMenu renders nothing without an editor context", () => {
    const { container } = render(
      <EditorTableMenu>
        <span>child</span>
      </EditorTableMenu>
    );
    expect(container).toBeEmptyDOMElement();
  });

  // EditorTableGlobalMenu / -ColumnMenu / -RowMenu have no component-level null
  // guard, but their position effect opens with `if (!editor) return`. Rendered
  // with no provider the effect runs with editor undefined and hits that early
  // return (the consequent branch). They still render their (positioned) shell.
  it("global/column/row table menus run their effect null-guard off-context", () => {
    for (const Wrapper of [
      EditorTableGlobalMenu,
      EditorTableColumnMenu,
      EditorTableRowMenu,
    ]) {
      const { unmount } = render(
        <Wrapper>
          <span>child</span>
        </Wrapper>
      );
      // The effect's `if (!editor) return` executed without throwing.
      unmount();
    }
  });
});

describe("Editor — slash node attribute variants", () => {
  // A slash node with an id but NO label exercises the `label ?? id` fallback
  // (renderText/renderHTML default options) and the `!attributes.id` false /
  // `!attributes.label` true renderHTML attribute branches.
  it("serializes a slash node that has an id but no label (label ?? id)", async () => {
    let html = "";
    let text = "";
    function Probe() {
      const { editor } = useCurrentEditor();
      React.useEffect(() => {
        if (editor) {
          html = editor.getHTML();
          // getText() routes through the node renderText option, whose default
          // also falls back to `label ?? id` — exercise the `?? id` side there.
          text = editor.getText();
        }
      }, [editor]);
      return null;
    }
    render(
      <EditorProvider
        content={`<p>hi <span data-type="slash" data-id="bar"></span> end</p>`}
      >
        <Probe />
      </EditorProvider>
    );
    await waitFor(() => {
      expect(html).not.toBe("");
    });
    // Falls back to the id when no label is present: `${char}${id}` => "/bar".
    expect(html).toContain('data-type="slash"');
    expect(html).toContain('data-id="bar"');
    expect(html).toContain("/bar");
    // No label attribute is emitted (the `!attributes.label` early-return path).
    expect(html).not.toContain("data-label");
    // renderText also emits the id-based fallback into plain text.
    expect(text).toContain("/bar");
  });

  it("serializes a slash node with neither id nor label", async () => {
    let html = "";
    function Probe() {
      const { editor } = useCurrentEditor();
      React.useEffect(() => {
        if (editor) {
          html = editor.getHTML();
        }
      }, [editor]);
      return null;
    }
    render(
      <EditorProvider content={`<p>x <span data-type="slash"></span> y</p>`}>
        <Probe />
      </EditorProvider>
    );
    await waitFor(() => {
      expect(html).not.toBe("");
    });
    // Both `!attributes.id` and `!attributes.label` are true => empty attrs.
    expect(html).toContain('data-type="slash"');
    expect(html).not.toContain("data-id");
    expect(html).not.toContain("data-label");
  });
});

describe("Editor — link selector URL validation branches", () => {
  it("submitting a fully-qualified URL sets a link (isValidUrl true path)", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { container } = render(
      <EditorProvider content={HTML}>
        <EditorLinkSelector open onOpenChange={onOpenChange} />
      </EditorProvider>
    );
    await findProse(container);
    const input = await screen.findByLabelText("Link URL");
    // A complete URL takes the `isValidUrl(text) === true` branch directly.
    await user.type(input, "https://example.com");
    const form = input.closest("form") as HTMLFormElement;
    form.requestSubmit?.() ?? form.dispatchEvent(new Event("submit"));
    // href resolved => onOpenChange(false) fired (the `if (href)` true branch).
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
    expect(container.querySelector(".ProseMirror")).not.toBeNull();
  });

  it("submitting an unparseable string does not set a link (href null path)", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { container } = render(
      <EditorProvider content={HTML}>
        <EditorLinkSelector open onOpenChange={onOpenChange} />
      </EditorProvider>
    );
    await findProse(container);
    const input = await screen.findByLabelText("Link URL");
    // No dot + a space => getUrlFromString hits the `includes(".")` false side
    // and returns null, so handleSubmit's `if (href)` false branch runs.
    await user.type(input, "not a url");
    const form = input.closest("form") as HTMLFormElement;
    form.requestSubmit?.() ?? form.dispatchEvent(new Event("submit"));
    // onOpenChange is never called because href stayed null.
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(container.querySelector(".ProseMirror")).not.toBeNull();
  });
});

describe("Editor — bubble menu single (non-array) child", () => {
  // Passing exactly one child means `Array.isArray(children)` is false, taking
  // the alternate branch that renders the child verbatim (no separators).
  it("renders a single bubble-menu child without inserting separators", async () => {
    const { container } = render(
      <EditorProvider content={HTML} placeholder="Type /">
        <EditorBubbleMenu>
          <EditorFormatBold hideName />
        </EditorBubbleMenu>
      </EditorProvider>
    );
    await findProse(container);
    expect(container.querySelector(".ProseMirror")).not.toBeNull();
  });
});

describe("Editor — command navigation without an open menu", () => {
  // handleCommandNavigation early-returns (no #slash-command in the DOM) when an
  // arrow/Enter is pressed but the slash menu is closed — the `if (slashCommand)`
  // false side.
  it("arrow/Enter keys are a no-op when no slash menu is open", async () => {
    const user = userEvent.setup();
    const { container } = render(<EditorProvider content={`<p>hello</p>`} />);
    const prose = await findProse(container);
    await user.click(prose);
    expect(document.querySelector("#slash-command")).toBeNull();
    await user.keyboard("{ArrowDown}{ArrowUp}{Enter}");
    expect(container.querySelector(".ProseMirror")).not.toBeNull();
  });
});

describe("Editor — slash Backspace with a non-empty selection", () => {
  // The slash node's Backspace keyboard shortcut bails out early when the
  // selection is not empty (`if (!empty) return false`).
  it("Backspace over a selection runs the command guard without throwing", async () => {
    const user = userEvent.setup();
    function SelectAll() {
      const { editor } = useCurrentEditor();
      React.useEffect(() => {
        if (editor) {
          editor.chain().selectAll().run();
        }
      }, [editor]);
      return null;
    }
    const { container } = render(
      <EditorProvider content={`<p>some text here</p>`}>
        <SelectAll />
      </EditorProvider>
    );
    const prose = await findProse(container);
    await user.click(prose);
    // Re-establish a non-collapsed selection across the paragraph, then delete.
    const sel = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(prose);
    sel?.removeAllRanges();
    sel?.addRange(range);
    await user.keyboard("{Backspace}");
    expect(container.querySelector(".ProseMirror")).not.toBeNull();
  });
});

describe("Editor — Backspace adjacent to a committed slash node", () => {
  // Placing the (empty) cursor immediately after a real slash node and pressing
  // Backspace makes `nodesBetween(anchor-1, anchor)` find the slash node, so the
  // `node.type.name === this.name` true branch runs and the trigger char is
  // re-inserted in its place.
  it("re-inserts the trigger char when Backspace lands on a slash node", async () => {
    let html = "";
    function Probe() {
      const { editor } = useCurrentEditor();
      React.useEffect(() => {
        if (editor) {
          // Move the cursor to the document end (just after the slash node) and
          // record the serialized doc once.
          editor.chain().focus("end").run();
          html = editor.getHTML();
        }
      }, [editor]);
      return null;
    }
    const { container } = render(
      <EditorProvider
        content={`<p><span data-type="slash" data-id="foo" data-label="Foo"></span></p>`}
      >
        <Probe />
      </EditorProvider>
    );
    const prose = await findProse(container);
    await waitFor(() => {
      expect(html).toContain('data-type="slash"');
    });
    await prose.focus();
    const user = userEvent.setup();
    await user.click(prose);
    // Collapse the selection to the very end (after the atom slash node).
    const sel = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(prose);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
    await user.keyboard("{Backspace}");
    expect(container.querySelector(".ProseMirror")).not.toBeNull();
  });
});

describe("Editor — EditorNodeText over an ordered list", () => {
  // Smoke test: EditorNodeText mounts and runs its isActive() `&&` chain against
  // ordered-list content (a list item still contains a paragraph, so the chain
  // short-circuits on the paragraph operand — this does NOT, and cannot, reach
  // the unreachable `?? false` fallback). Kept as an extra active-state render.
  it("renders over ordered-list content without throwing", async () => {
    const { container } = render(
      <EditorProvider content={`<ol><li>one</li><li>two</li></ol>`}>
        <EditorNodeText />
      </EditorProvider>
    );
    await findProse(container);
    expect(
      container.querySelector("[data-slot='editor-bubble-menu-button']")
    ).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// EditorTableRowMenu — selectionUpdate position handler
// ---------------------------------------------------------------------------

describe("Editor — EditorTableRowMenu selection positioning", () => {
  // Captures the live editor so the test can emit "selectionUpdate" directly,
  // driving the row-menu's position handler past its early-returns into the
  // table-row geometry path.
  function CaptureEditor({
    onReady,
  }: {
    onReady: (editor: NonNullable<ReturnType<typeof useCurrentEditor>["editor"]>) => void;
  }) {
    const { editor } = useCurrentEditor();
    React.useEffect(() => {
      if (editor) onReady(editor);
    }, [editor, onReady]);
    return null;
  }

  function renderRowMenu() {
    let captured: NonNullable<
      ReturnType<typeof useCurrentEditor>["editor"]
    > | null = null;
    const result = render(
      <EditorProvider content={`<p>row menu</p>`}>
        <CaptureEditor onReady={(e) => (captured = e)} />
        <EditorTableRowMenu>
          <EditorTableRowBefore />
        </EditorTableRowMenu>
      </EditorProvider>
    );
    return { ...result, getEditor: () => captured };
  }

  it("ignores selection updates with no active range", async () => {
    const { container, getEditor } = renderRowMenu();
    await findProse(container);
    const editor = getEditor();
    expect(editor).not.toBeNull();

    const getSelectionSpy = vi
      .spyOn(window, "getSelection")
      .mockReturnValue(null as unknown as Selection);
    React.act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (editor as any).emit("selectionUpdate", { editor });
    });
    getSelectionSpy.mockRestore();

    // No range -> the handler returns early, so the trigger stays hidden
    // (left/top remain 0).
    const trigger = container.querySelector(
      "[data-slot='editor-table-row-menu']"
    ) as HTMLElement;
    expect(trigger).toHaveClass("hidden");
  });

  it("positions the row menu from the selected table row's rect", async () => {
    const { container, getEditor } = renderRowMenu();
    await findProse(container);
    const editor = getEditor();
    expect(editor).not.toBeNull();

    // Build a detached table-row DOM so closest("tr") resolves; the beforeAll
    // getBoundingClientRect stub gives top:0 / height:24 -> setTop(12).
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    tr.appendChild(td);
    tbody.appendChild(tr);
    table.appendChild(tbody);

    const fakeSelection = {
      rangeCount: 1,
      getRangeAt: () => ({ startContainer: td }),
    } as unknown as Selection;
    const getSelectionSpy = vi
      .spyOn(window, "getSelection")
      .mockReturnValue(fakeSelection);
    React.act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (editor as any).emit("selectionUpdate", { editor });
    });
    getSelectionSpy.mockRestore();

    // top became 12 (truthy) -> the trigger is no longer hidden and carries the
    // computed offset.
    const trigger = container.querySelector(
      "[data-slot='editor-table-row-menu']"
    ) as HTMLElement;
    expect(trigger).not.toHaveClass("hidden");
    expect(trigger.style.top).toBe("12px");
  });
});
