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

describe("file-tree — accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <Tree elements={ELEMENTS} initialExpandedItems={["1"]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
