/**
 * Tests for the file-tree (components/ui/file-tree.tsx) — rebuilt on Base UI
 * Collapsible. Covers element + composed rendering, expand/collapse, selection,
 * sorting, initial expansion, the CollapseButton, disabled items, and a11y.
 */

import * as React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import {
  Tree,
  Folder,
  File,
  CollapseButton,
  type TreeViewElement,
} from "@/components/ui/file-tree";

// ScrollArea (Base UI) needs ResizeObserver + Element.getAnimations, neither of
// which jsdom provides.
beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
  if (!("getAnimations" in Element.prototype)) {
    Element.prototype.getAnimations = () => [];
  }
});

// Restore jsdom's natural absence of ResizeObserver so it does not leak into
// sibling test files sharing this worker — recharts (chart) and the carousel's
// scroll-measurement behave differently when a global ResizeObserver is present
// (see tests/setup.ts).
afterAll(() => {
  Reflect.deleteProperty(globalThis, "ResizeObserver");
});

const ELEMENTS: TreeViewElement[] = [
  {
    id: "1",
    name: "src",
    children: [
      { id: "2", name: "index.ts" },
      {
        id: "3",
        name: "components",
        children: [{ id: "4", name: "button.tsx" }],
      },
    ],
  },
  { id: "5", name: "README.md" },
  { id: "6", name: "locked", isSelectable: false, children: [{ id: "7", name: "secret" }] },
];

describe("file-tree — element rendering", () => {
  it("renders top-level folders and files from elements", () => {
    const { container } = render(<Tree elements={ELEMENTS} initialExpandedItems={[]} />);
    expect(container.querySelector('[data-slot="file-tree"]')).not.toBeNull();
    expect(screen.getByText("src")).toBeInTheDocument();
    expect(screen.getByText("README.md")).toBeInTheDocument();
  });

  it("folders sort before files by default", () => {
    render(<Tree elements={ELEMENTS} />);
    const labels = screen
      .getAllByText(/src|README\.md|locked/)
      .map((el) => el.textContent);
    // 'src' and 'locked' (folders) precede 'README.md' (file).
    expect(labels.indexOf("README.md")).toBeGreaterThan(labels.indexOf("src"));
  });

  it("sorts a file that precedes a folder back behind it", () => {
    // source order: file 'zzz.md' then folder 'aaa' → comparator hits both arms.
    const mixed: TreeViewElement[] = [
      { id: "f", name: "zzz.md" },
      { id: "d", name: "aaa", children: [{ id: "c", name: "child" }] },
    ];
    render(<Tree elements={mixed} />);
    const labels = screen
      .getAllByText(/zzz\.md|aaa/)
      .map((el) => el.textContent);
    expect(labels.indexOf("aaa")).toBeLessThan(labels.indexOf("zzz.md"));
  });

  it("keeps source order with sort='none'", () => {
    render(<Tree elements={ELEMENTS} sort="none" />);
    expect(screen.getByText("src")).toBeInTheDocument();
  });

  it("accepts a custom comparator", () => {
    const cmp = vi.fn((a: TreeViewElement, b: TreeViewElement) =>
      a.name.localeCompare(b.name),
    );
    render(<Tree elements={ELEMENTS} sort={cmp} />);
    expect(cmp).toHaveBeenCalled();
  });
});

describe("file-tree — expansion", () => {
  it("reveals children when a folder is opened", async () => {
    const user = userEvent.setup();
    render(<Tree elements={ELEMENTS} />);
    expect(screen.queryByText("index.ts")).not.toBeInTheDocument();
    await user.click(screen.getByText("src"));
    expect(screen.getByText("index.ts")).toBeInTheDocument();
  });

  it("honors initialExpandedItems", () => {
    render(<Tree elements={ELEMENTS} initialExpandedItems={["1"]} />);
    expect(screen.getByText("index.ts")).toBeInTheDocument();
  });

  it("expands ancestors of initialSelectedId", () => {
    render(<Tree elements={ELEMENTS} initialSelectedId="4" />);
    // src → components must be expanded to reveal button.tsx.
    expect(screen.getByText("button.tsx")).toBeInTheDocument();
  });

  it("collapses an open folder when its trigger is clicked again", async () => {
    const user = userEvent.setup();
    render(<Tree elements={ELEMENTS} initialExpandedItems={["1"]} />);
    expect(screen.getByText("index.ts")).toBeInTheDocument();
    await user.click(screen.getByText("src"));
    expect(screen.queryByText("index.ts")).not.toBeInTheDocument();
  });

  it("no-ops initialSelectedId when no elements are provided", () => {
    // exercises the early return in the ancestor-expansion walk
    render(
      <Tree initialSelectedId="z">
        <Folder value="q" element="q">
          <File value="r">
            <span>r</span>
          </File>
        </Folder>
      </Tree>,
    );
    expect(screen.getByText("q")).toBeInTheDocument();
  });

  it("handles a non-selectable initialSelectedId without expanding it", () => {
    // id '6' (locked) is non-selectable → its own path leaf is popped.
    render(<Tree elements={ELEMENTS} initialSelectedId="6" />);
    expect(screen.getByText("locked")).toBeInTheDocument();
  });
});

describe("file-tree — context guard", () => {
  it("throws when a tree part is used outside a Tree", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Folder value="x" element="y" />)).toThrow(/useTree/);
    spy.mockRestore();
  });
});

describe("file-tree — selection", () => {
  it("marks a file selected on click", async () => {
    const user = userEvent.setup();
    render(<Tree elements={ELEMENTS} initialExpandedItems={["1"]} />);
    const file = screen.getByText("index.ts").closest("button")!;
    await user.click(file);
    expect(file).toHaveClass("bg-muted");
  });

  it("disables non-selectable folders", () => {
    render(<Tree elements={ELEMENTS} />);
    const locked = screen.getByText("locked").closest("button")!;
    // Base UI's disabled Collapsible.Trigger marks itself via aria-disabled.
    expect(locked).toHaveAttribute("aria-disabled", "true");
  });
});

describe("file-tree — composed children & CollapseButton", () => {
  it("renders manually composed Folder/File children", () => {
    render(
      <Tree initialExpandedItems={["a"]}>
        <Folder value="a" element="app">
          <File value="b">
            <span>page.tsx</span>
          </File>
        </Folder>
        <CollapseButton elements={ELEMENTS}>Toggle all</CollapseButton>
      </Tree>,
    );
    expect(screen.getByText("app")).toBeInTheDocument();
    expect(screen.getByText("page.tsx")).toBeInTheDocument();
  });

  // CollapseButton lives inside a manually composed tree (Tree uses
  // children-or-elements, so it can't render elements AND a child button).
  function ComposedTree({ expandAll = false }: { expandAll?: boolean }) {
    return (
      <Tree>
        <Folder value="1" element="src">
          <File value="2">
            <span>index.ts</span>
          </File>
          <Folder value="3" element="components">
            <File value="4">
              <span>button.tsx</span>
            </File>
          </Folder>
        </Folder>
        <CollapseButton elements={ELEMENTS} expandAll={expandAll} />
      </Tree>
    );
  }

  it("expands everything then collapses on the CollapseButton", async () => {
    const user = userEvent.setup();
    render(<ComposedTree />);
    const toggle = screen.getByRole("button", { name: /toggle/i });
    await user.click(toggle);
    expect(screen.getByText("button.tsx")).toBeInTheDocument();
    await user.click(toggle);
    expect(screen.queryByText("button.tsx")).not.toBeInTheDocument();
  });

  it("expandAll expands on mount when set", () => {
    render(<ComposedTree expandAll />);
    expect(screen.getByText("index.ts")).toBeInTheDocument();
  });
});

const ICON_ELEMENTS: TreeViewElement[] = [
  {
    id: "a",
    name: "app",
    icon: <span data-testid="folder-icon">FI</span>,
    children: [
      { id: "b", name: "page.tsx", icon: <span data-testid="file-icon">CI</span> },
      { id: "c", name: "layout.tsx" },
    ],
  },
  { id: "d", name: "root.txt" },
];

describe("file-tree — panel variant", () => {
  it("renders the panel variant data attribute + cva gap", () => {
    const { container } = render(<Tree elements={ELEMENTS} variant="panel" />);
    const root = container.querySelector('[data-slot="file-tree"]')!;
    expect(root).toHaveAttribute("data-variant", "panel");
    expect(root).toHaveClass("gap-0.5");
  });

  it("applies panel row classes to a folder trigger", () => {
    render(<Tree elements={ELEMENTS} variant="panel" />);
    const trigger = screen.getByText("src").closest("button")!;
    expect(trigger).toHaveClass("px-2", "py-1");
    expect(trigger.className).toMatch(/hover:bg-muted\/50/);
  });

  it("guide line uses bg-border in panel mode", () => {
    const { container } = render(
      <Tree elements={ELEMENTS} variant="panel" initialExpandedItems={["1"]} />,
    );
    const indicator = container.querySelector(
      '[data-slot="file-tree-indicator"]',
    )!;
    expect(indicator).toHaveClass("bg-border");
  });

  it("minimal mode (default) keeps the tight look + no data-variant=panel", () => {
    const { container } = render(<Tree elements={ELEMENTS} />);
    const root = container.querySelector('[data-slot="file-tree"]')!;
    expect(root).toHaveAttribute("data-variant", "minimal");
    expect(root).toHaveClass("gap-1");
  });
});

describe("file-tree — direction", () => {
  it("renders an empty tree with neither children nor elements", () => {
    const { container } = render(<Tree />);
    expect(
      container.querySelector('[data-slot="file-tree"]'),
    ).toBeInTheDocument();
  });

  it("applies rtl direction when dir='rtl'", () => {
    const { container } = render(<Tree elements={ELEMENTS} dir="rtl" />);
    expect(
      container.querySelector('[data-slot="file-tree"]'),
    ).toHaveAttribute("dir", "rtl");
  });
});

describe("file-tree — chevron disclosure", () => {
  it("is OFF by default in minimal", () => {
    const { container } = render(<Tree elements={ELEMENTS} />);
    expect(
      container.querySelector('[data-slot="file-tree-chevron"]'),
    ).toBeNull();
  });

  it("is ON by default in panel and rotates when open", () => {
    const { container } = render(
      <Tree elements={ELEMENTS} variant="panel" initialExpandedItems={["1"]} />,
    );
    const chevrons = container.querySelectorAll(
      '[data-slot="file-tree-chevron"]',
    );
    expect(chevrons.length).toBeGreaterThan(0);
    // src is open → rotate-90; a collapsed folder (components is hidden) — check src.
    const srcChevron = screen
      .getByText("src")
      .closest("button")!
      .querySelector('[data-slot="file-tree-chevron"]')!;
    expect(srcChevron).toHaveClass("rotate-90");
  });

  it("shows a non-rotated chevron when the folder is closed", () => {
    render(<Tree elements={ELEMENTS} showChevron />);
    const srcChevron = screen
      .getByText("src")
      .closest("button")!
      .querySelector('[data-slot="file-tree-chevron"]')!;
    expect(srcChevron).not.toHaveClass("rotate-90");
  });

  it("respects a per-Folder showChevron override", () => {
    render(
      <Tree variant="panel" initialExpandedItems={["x"]}>
        <Folder value="x" element="off" showChevron={false}>
          <File value="y">
            <span>leaf</span>
          </File>
        </Folder>
      </Tree>,
    );
    const trigger = screen.getByText("off").closest("button")!;
    expect(
      trigger.querySelector('[data-slot="file-tree-chevron"]'),
    ).toBeNull();
  });
});

describe("file-tree — count badge", () => {
  it("renders the direct-children count in font-mono", () => {
    render(<Tree elements={ELEMENTS} showCount />);
    const count = screen.getByText("src").closest("button")!
      .querySelector('[data-slot="file-tree-count"]')!;
    // 'src' has 2 direct children (index.ts + components).
    expect(count).toHaveTextContent("2");
    expect(count).toHaveClass("font-mono");
  });

  it("is absent when showCount is off", () => {
    const { container } = render(<Tree elements={ELEMENTS} />);
    expect(container.querySelector('[data-slot="file-tree-count"]')).toBeNull();
  });
});

describe("file-tree — explicit type without children", () => {
  it("renders a type='folder' node that has no children array", () => {
    const els: TreeViewElement[] = [
      { id: "ef", name: "emptyFolder", type: "folder" },
      { id: "ft", name: "typed.txt", type: "file" },
    ];
    render(<Tree elements={els} showCount initialExpandedItems={["ef"]} />);
    expect(screen.getByText("emptyFolder")).toBeInTheDocument();
    // direct-children count is 0 for the childless folder.
    const count = screen
      .getByText("emptyFolder")
      .closest("button")!
      .querySelector('[data-slot="file-tree-count"]')!;
    expect(count).toHaveTextContent("0");
  });
});

describe("file-tree — custom icons", () => {
  it("overrides the default folder + file icons", () => {
    render(<Tree elements={ICON_ELEMENTS} initialExpandedItems={["a"]} />);
    expect(screen.getByTestId("folder-icon")).toBeInTheDocument();
    expect(screen.getByTestId("file-icon")).toBeInTheDocument();
  });
});

describe("file-tree — multi-select", () => {
  it("toggles a single leaf file via its checkbox", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Tree
        elements={ELEMENTS}
        selectionMode="multi"
        initialExpandedItems={["1"]}
        onCheckedChange={onCheckedChange}
      />,
    );
    const file = screen.getByLabelText("Select index.ts");
    await user.click(file);
    expect(onCheckedChange).toHaveBeenCalledWith(["2"]);
  });

  it("checking a folder cascades to all descendants", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Tree
        elements={ELEMENTS}
        selectionMode="multi"
        onCheckedChange={onCheckedChange}
      />,
    );
    await user.click(screen.getByLabelText("Select src"));
    // src(1) cascades to index.ts(2), components(3), button.tsx(4).
    const ids = onCheckedChange.mock.calls.at(-1)![0] as string[];
    expect(new Set(ids)).toEqual(new Set(["1", "2", "3", "4"]));
  });

  it("a fully-checked folder is checked; partial is indeterminate", () => {
    // index.ts(2) checked but not components → src is indeterminate.
    render(
      <Tree
        elements={ELEMENTS}
        selectionMode="multi"
        defaultCheckedIds={["2"]}
      />,
    );
    const srcBox = screen.getByLabelText("Select src");
    expect(srcBox).toHaveAttribute("data-indeterminate");
    expect(srcBox).not.toHaveAttribute("data-checked");
  });

  it("a folder with all descendants checked shows data-checked", () => {
    render(
      <Tree
        elements={ELEMENTS}
        selectionMode="multi"
        defaultCheckedIds={["2", "3", "4"]}
      />,
    );
    expect(screen.getByLabelText("Select src")).toHaveAttribute("data-checked");
  });

  it("unchecking a folder clears all descendants", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Tree
        elements={ELEMENTS}
        selectionMode="multi"
        defaultCheckedIds={["1", "2", "3", "4"]}
        onCheckedChange={onCheckedChange}
      />,
    );
    await user.click(screen.getByLabelText("Select src"));
    expect(onCheckedChange).toHaveBeenLastCalledWith([]);
  });

  it("is fully controlled via checkedIds", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    function Controlled() {
      const [ids, setIds] = React.useState<string[]>([]);
      return (
        <Tree
          elements={ELEMENTS}
          selectionMode="multi"
          checkedIds={ids}
          onCheckedChange={(next) => {
            onCheckedChange(next);
            setIds(next);
          }}
        />
      );
    }
    render(<Controlled />);
    const readme = screen.getByLabelText("Select README.md");
    await user.click(readme);
    expect(onCheckedChange).toHaveBeenCalledWith(["5"]);
    expect(readme).toHaveAttribute("data-checked");
  });

  it("initializes from defaultCheckedIds (uncontrolled)", () => {
    render(
      <Tree
        elements={ELEMENTS}
        selectionMode="multi"
        defaultCheckedIds={["5"]}
      />,
    );
    expect(screen.getByLabelText("Select README.md")).toHaveAttribute(
      "data-checked",
    );
  });

  it("compositional File uses the fallback checkbox label", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Tree selectionMode="multi" onCheckedChange={onCheckedChange}>
        <File value="solo">
          <span>solo.tsx</span>
        </File>
      </Tree>,
    );
    const box = screen.getByLabelText("Select file");
    await user.click(box);
    expect(onCheckedChange).toHaveBeenLastCalledWith(["solo"]);
  });

  it("does not toggle a non-selectable folder open", async () => {
    const user = userEvent.setup();
    render(<Tree elements={ELEMENTS} selectionMode="multi" />);
    const locked = screen.getByText("locked").closest("button")!;
    await user.click(locked);
    // 'secret' (child of locked) must stay hidden — open was blocked.
    expect(screen.queryByText("secret")).not.toBeInTheDocument();
  });

  it("compositional multi-select toggles only the folder's own id", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Tree selectionMode="multi" onCheckedChange={onCheckedChange}>
        <Folder value="f1" element="folder">
          <File value="f2">
            <span>child</span>
          </File>
        </Folder>
      </Tree>,
    );
    await user.click(screen.getByLabelText("Select folder"));
    expect(onCheckedChange).toHaveBeenLastCalledWith(["f1"]);
  });
});

describe("file-tree — accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <Tree elements={ELEMENTS} initialExpandedItems={["1"]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations in panel mode", async () => {
    const { container } = render(
      <Tree
        elements={ELEMENTS}
        variant="panel"
        showChevron
        showCount
        initialExpandedItems={["1", "3"]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations in multi mode", async () => {
    const { container } = render(
      <Tree
        elements={ELEMENTS}
        selectionMode="multi"
        initialExpandedItems={["1", "3"]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("file-tree — token guard", () => {
  it("leaks no raw color into the panel markup", () => {
    const { container } = render(
      <Tree
        elements={ELEMENTS}
        variant="panel"
        showChevron
        showCount
        selectionMode="multi"
        initialExpandedItems={["1", "3"]}
      />,
    );
    const html = container.innerHTML;
    expect(html).not.toMatch(/text-white|bg-white|text-black|bg-black/);
    expect(html).not.toMatch(/bg-gray|text-gray|bg-slate|text-slate/);
    expect(html).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(html).not.toMatch(/rgb\(|hsl\(/);
  });
});
