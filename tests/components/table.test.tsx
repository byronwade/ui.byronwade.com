/**
 * Exhaustive tests for the Table compound component.
 *
 * Component source: components/ui/table.tsx
 * API summary:
 *   Exported parts (all are thin wrappers of their native HTML elements):
 *     Table          → <div data-slot="table-container"> wrapping <table data-slot="table">
 *     TableHeader    → <thead data-slot="table-header">
 *     TableBody      → <tbody data-slot="table-body">
 *     TableFooter    → <tfoot data-slot="table-footer">
 *     TableRow       → <tr data-slot="table-row">
 *     TableHead      → <th data-slot="table-head">
 *     TableCell      → <td data-slot="table-cell">
 *     TableCaption   → <caption data-slot="table-caption">
 *
 *   CSS notes (from source):
 *     Table container:  relative w-full overflow-x-auto
 *     Table element:    w-full caption-bottom text-sm
 *     TableHeader:      [&_tr]:border-b
 *     TableBody:        [&_tr:last-child]:border-0
 *     TableFooter:      border-t bg-muted/50 font-medium [&>tr]:last:border-b-0
 *     TableRow:         border-b transition-colors hover:bg-muted/50
 *                       has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted
 *     TableHead:        h-10 px-2 text-left align-middle font-medium whitespace-nowrap
 *                       text-foreground [&:has([role=checkbox])]:pr-0
 *     TableCell:        p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0
 *     TableCaption:     mt-4 text-sm text-muted-foreground
 */

import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

// ---------------------------------------------------------------------------
// Helper — a fully-composed minimal table used by many tests
// ---------------------------------------------------------------------------

function MinimalTable({
  caption,
  footerRow,
  rowState,
  onClick,
}: {
  caption?: string;
  footerRow?: boolean;
  rowState?: string;
  onClick?: () => void;
}) {
  return (
    <Table>
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          data-state={rowState as "selected" | undefined}
          onClick={onClick}
        >
          <TableCell>Acme Corp</TableCell>
          <TableCell>$100</TableCell>
        </TableRow>
      </TableBody>
      {footerRow && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total: $100</TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}

// ---------------------------------------------------------------------------
// 1. Renders without crashing — default usage
// ---------------------------------------------------------------------------

describe("Table — default render (renders without crashing)", () => {
  it("renders without crashing with no children", () => {
    const { container } = render(<Table />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders a <table> element inside a wrapper div", () => {
    const { container } = render(<Table />);
    expect(container.querySelector("table")).not.toBeNull();
  });

  it("renders the outer wrapper as a <div>", () => {
    const { container } = render(<Table />);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("renders a complete minimal table without crashing", () => {
    const { container } = render(<MinimalTable />);
    expect(container.querySelector("table")).not.toBeNull();
  });

  it("renders all parts in sequence without error", () => {
    render(<MinimalTable caption="Test table" footerRow />);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 2. Table — container and element classes
// ---------------------------------------------------------------------------

describe("Table — CSS classes", () => {
  it("container div has data-slot='table-container'", () => {
    const { container } = render(<Table />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.getAttribute("data-slot")).toBe("table-container");
  });

  it("container div has 'relative' class", () => {
    const { container } = render(<Table />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("relative");
  });

  it("container div has 'w-full' class", () => {
    const { container } = render(<Table />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("w-full");
  });

  it("container div has 'overflow-x-auto' class", () => {
    const { container } = render(<Table />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("overflow-x-auto");
  });

  it("table element has data-slot='table'", () => {
    const { container } = render(<Table />);
    const table = container.querySelector("table") as HTMLElement;
    expect(table.getAttribute("data-slot")).toBe("table");
  });

  it("table element has 'w-full' class", () => {
    const { container } = render(<Table />);
    const table = container.querySelector("table") as HTMLElement;
    expect(table.className).toContain("w-full");
  });

  it("table element has 'caption-bottom' class", () => {
    const { container } = render(<Table />);
    const table = container.querySelector("table") as HTMLElement;
    expect(table.className).toContain("caption-bottom");
  });

  it("table element has 'text-sm' class", () => {
    const { container } = render(<Table />);
    const table = container.querySelector("table") as HTMLElement;
    expect(table.className).toContain("text-sm");
  });

  it("merges custom className onto <table>", () => {
    const { container } = render(<Table className="my-table" />);
    const table = container.querySelector("table") as HTMLElement;
    expect(table.className).toContain("my-table");
  });

  it("preserves base classes when custom className is provided", () => {
    const { container } = render(<Table className="my-table" />);
    const table = container.querySelector("table") as HTMLElement;
    expect(table.className).toContain("w-full");
    expect(table.className).toContain("text-sm");
  });
});

// ---------------------------------------------------------------------------
// 3. TableHeader — structure and classes
// ---------------------------------------------------------------------------

describe("TableHeader — structure and CSS classes", () => {
  it("renders a <thead> element", () => {
    const { container } = render(
      <table>
        <TableHeader />
      </table>
    );
    expect(container.querySelector("thead")).not.toBeNull();
  });

  it("has data-slot='table-header'", () => {
    const { container } = render(
      <table>
        <TableHeader />
      </table>
    );
    const thead = container.querySelector("thead") as HTMLElement;
    expect(thead.getAttribute("data-slot")).toBe("table-header");
  });

  it("has '[&_tr]:border-b' class", () => {
    const { container } = render(
      <table>
        <TableHeader />
      </table>
    );
    const thead = container.querySelector("thead") as HTMLElement;
    expect(thead.className).toContain("[&_tr]:border-b");
  });

  it("merges custom className", () => {
    const { container } = render(
      <table>
        <TableHeader className="custom-header" />
      </table>
    );
    const thead = container.querySelector("thead") as HTMLElement;
    expect(thead.className).toContain("custom-header");
    expect(thead.className).toContain("[&_tr]:border-b");
  });

  it("renders children (TableRow/TableHead) inside it", () => {
    render(
      <table>
        <TableHeader>
          <TableRow>
            <TableHead>Column</TableHead>
          </TableRow>
        </TableHeader>
      </table>
    );
    expect(screen.getByRole("columnheader", { name: "Column" })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 4. TableBody — structure and classes
// ---------------------------------------------------------------------------

describe("TableBody — structure and CSS classes", () => {
  it("renders a <tbody> element", () => {
    const { container } = render(
      <table>
        <TableBody />
      </table>
    );
    expect(container.querySelector("tbody")).not.toBeNull();
  });

  it("has data-slot='table-body'", () => {
    const { container } = render(
      <table>
        <TableBody />
      </table>
    );
    const tbody = container.querySelector("tbody") as HTMLElement;
    expect(tbody.getAttribute("data-slot")).toBe("table-body");
  });

  it("has '[&_tr:last-child]:border-0' class", () => {
    const { container } = render(
      <table>
        <TableBody />
      </table>
    );
    const tbody = container.querySelector("tbody") as HTMLElement;
    expect(tbody.className).toContain("[&_tr:last-child]:border-0");
  });

  it("merges custom className", () => {
    const { container } = render(
      <table>
        <TableBody className="custom-body" />
      </table>
    );
    const tbody = container.querySelector("tbody") as HTMLElement;
    expect(tbody.className).toContain("custom-body");
    expect(tbody.className).toContain("[&_tr:last-child]:border-0");
  });

  it("renders TableRow children inside it", () => {
    render(
      <table>
        <TableBody>
          <TableRow>
            <TableCell>Hello</TableCell>
          </TableRow>
        </TableBody>
      </table>
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 5. TableFooter — structure and classes
// ---------------------------------------------------------------------------

describe("TableFooter — structure and CSS classes", () => {
  it("renders a <tfoot> element", () => {
    const { container } = render(
      <table>
        <TableFooter />
      </table>
    );
    expect(container.querySelector("tfoot")).not.toBeNull();
  });

  it("has data-slot='table-footer'", () => {
    const { container } = render(
      <table>
        <TableFooter />
      </table>
    );
    const tfoot = container.querySelector("tfoot") as HTMLElement;
    expect(tfoot.getAttribute("data-slot")).toBe("table-footer");
  });

  it("has 'border-t' class", () => {
    const { container } = render(
      <table>
        <TableFooter />
      </table>
    );
    const tfoot = container.querySelector("tfoot") as HTMLElement;
    expect(tfoot.className).toContain("border-t");
  });

  it("has 'bg-muted/50' class", () => {
    const { container } = render(
      <table>
        <TableFooter />
      </table>
    );
    const tfoot = container.querySelector("tfoot") as HTMLElement;
    expect(tfoot.className).toContain("bg-muted/50");
  });

  it("has 'font-medium' class", () => {
    const { container } = render(
      <table>
        <TableFooter />
      </table>
    );
    const tfoot = container.querySelector("tfoot") as HTMLElement;
    expect(tfoot.className).toContain("font-medium");
  });

  it("has '[&>tr]:last:border-b-0' class", () => {
    const { container } = render(
      <table>
        <TableFooter />
      </table>
    );
    const tfoot = container.querySelector("tfoot") as HTMLElement;
    expect(tfoot.className).toContain("[&>tr]:last:border-b-0");
  });

  it("merges custom className", () => {
    const { container } = render(
      <table>
        <TableFooter className="custom-footer" />
      </table>
    );
    const tfoot = container.querySelector("tfoot") as HTMLElement;
    expect(tfoot.className).toContain("custom-footer");
    expect(tfoot.className).toContain("border-t");
  });

  it("renders children inside it", () => {
    render(
      <table>
        <TableFooter>
          <TableRow>
            <TableCell>Total: $500</TableCell>
          </TableRow>
        </TableFooter>
      </table>
    );
    expect(screen.getByText("Total: $500")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 6. TableRow — structure and classes
// ---------------------------------------------------------------------------

describe("TableRow — structure and CSS classes", () => {
  it("renders a <tr> element", () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow />
        </tbody>
      </table>
    );
    expect(container.querySelector("tr")).not.toBeNull();
  });

  it("has data-slot='table-row'", () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow />
        </tbody>
      </table>
    );
    const tr = container.querySelector("tr") as HTMLElement;
    expect(tr.getAttribute("data-slot")).toBe("table-row");
  });

  it("has 'border-b' class", () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow />
        </tbody>
      </table>
    );
    const tr = container.querySelector("tr") as HTMLElement;
    expect(tr.className).toContain("border-b");
  });

  it("has 'transition-colors' class", () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow />
        </tbody>
      </table>
    );
    const tr = container.querySelector("tr") as HTMLElement;
    expect(tr.className).toContain("transition-colors");
  });

  it("has 'hover:bg-muted/50' class", () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow />
        </tbody>
      </table>
    );
    const tr = container.querySelector("tr") as HTMLElement;
    expect(tr.className).toContain("hover:bg-muted/50");
  });

  it("has 'has-aria-expanded:bg-muted/50' class", () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow />
        </tbody>
      </table>
    );
    const tr = container.querySelector("tr") as HTMLElement;
    expect(tr.className).toContain("has-aria-expanded:bg-muted/50");
  });

  it("has 'data-[state=selected]:bg-muted' class", () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow />
        </tbody>
      </table>
    );
    const tr = container.querySelector("tr") as HTMLElement;
    expect(tr.className).toContain("data-[state=selected]:bg-muted");
  });

  it("merges custom className", () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow className="cursor-pointer" />
        </tbody>
      </table>
    );
    const tr = container.querySelector("tr") as HTMLElement;
    expect(tr.className).toContain("cursor-pointer");
    expect(tr.className).toContain("border-b");
  });

  it("renders children (TableCell) inside it", () => {
    render(
      <table>
        <tbody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </tbody>
      </table>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 7. TableRow — selected state (data-state="selected")
// ---------------------------------------------------------------------------

describe("TableRow — data-state='selected'", () => {
  it("sets data-state='selected' attribute when passed", () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow data-state="selected">
            <TableCell>Selected</TableCell>
          </TableRow>
        </tbody>
      </table>
    );
    const tr = container.querySelector("tr") as HTMLElement;
    expect(tr.getAttribute("data-state")).toBe("selected");
  });

  it("does NOT set data-state when not passed", () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow>
            <TableCell>Normal</TableCell>
          </TableRow>
        </tbody>
      </table>
    );
    const tr = container.querySelector("tr") as HTMLElement;
    expect(tr.getAttribute("data-state")).toBeNull();
  });

  it("toggling from unselected to selected updates data-state", () => {
    const { container, rerender } = render(
      <table>
        <tbody>
          <TableRow>
            <TableCell>Row</TableCell>
          </TableRow>
        </tbody>
      </table>
    );
    expect((container.querySelector("tr") as HTMLElement).getAttribute("data-state")).toBeNull();

    rerender(
      <table>
        <tbody>
          <TableRow data-state="selected">
            <TableCell>Row</TableCell>
          </TableRow>
        </tbody>
      </table>
    );
    expect((container.querySelector("tr") as HTMLElement).getAttribute("data-state")).toBe("selected");
  });

  it("toggling from selected back to unselected clears data-state", () => {
    const { container, rerender } = render(
      <table>
        <tbody>
          <TableRow data-state="selected">
            <TableCell>Row</TableCell>
          </TableRow>
        </tbody>
      </table>
    );
    expect((container.querySelector("tr") as HTMLElement).getAttribute("data-state")).toBe("selected");

    rerender(
      <table>
        <tbody>
          <TableRow data-state={undefined}>
            <TableCell>Row</TableCell>
          </TableRow>
        </tbody>
      </table>
    );
    expect((container.querySelector("tr") as HTMLElement).getAttribute("data-state")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 8. TableHead — structure and classes
// ---------------------------------------------------------------------------

describe("TableHead — structure and CSS classes", () => {
  it("renders a <th> element", () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHead />
          </tr>
        </thead>
      </table>
    );
    expect(container.querySelector("th")).not.toBeNull();
  });

  it("has data-slot='table-head'", () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHead />
          </tr>
        </thead>
      </table>
    );
    const th = container.querySelector("th") as HTMLElement;
    expect(th.getAttribute("data-slot")).toBe("table-head");
  });

  it("has 'h-10' class", () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHead />
          </tr>
        </thead>
      </table>
    );
    const th = container.querySelector("th") as HTMLElement;
    expect(th.className).toContain("h-10");
  });

  it("has 'px-2' class", () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHead />
          </tr>
        </thead>
      </table>
    );
    const th = container.querySelector("th") as HTMLElement;
    expect(th.className).toContain("px-2");
  });

  it("has 'text-left' class", () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHead />
          </tr>
        </thead>
      </table>
    );
    const th = container.querySelector("th") as HTMLElement;
    expect(th.className).toContain("text-left");
  });

  it("has 'align-middle' class", () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHead />
          </tr>
        </thead>
      </table>
    );
    const th = container.querySelector("th") as HTMLElement;
    expect(th.className).toContain("align-middle");
  });

  it("has 'font-medium' class", () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHead />
          </tr>
        </thead>
      </table>
    );
    const th = container.querySelector("th") as HTMLElement;
    expect(th.className).toContain("font-medium");
  });

  it("has 'whitespace-nowrap' class", () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHead />
          </tr>
        </thead>
      </table>
    );
    const th = container.querySelector("th") as HTMLElement;
    expect(th.className).toContain("whitespace-nowrap");
  });

  it("has 'text-foreground' class", () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHead />
          </tr>
        </thead>
      </table>
    );
    const th = container.querySelector("th") as HTMLElement;
    expect(th.className).toContain("text-foreground");
  });

  it("has '[&:has([role=checkbox])]:pr-0' class", () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHead />
          </tr>
        </thead>
      </table>
    );
    const th = container.querySelector("th") as HTMLElement;
    expect(th.className).toContain("[&:has([role=checkbox])]:pr-0");
  });

  it("merges custom className onto the <th>", () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHead className="text-right" />
          </tr>
        </thead>
      </table>
    );
    const th = container.querySelector("th") as HTMLElement;
    expect(th.className).toContain("text-right");
    expect(th.className).toContain("h-10");
  });

  it("renders text children", () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHead>Invoice</TableHead>
          </tr>
        </thead>
      </table>
    );
    expect(screen.getByRole("columnheader", { name: "Invoice" })).toBeInTheDocument();
  });

  it("accessible role is 'columnheader' (implicit on <th>)", () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHead>Amount</TableHead>
          </tr>
        </thead>
      </table>
    );
    expect(screen.getByRole("columnheader")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 9. TableCell — structure and classes
// ---------------------------------------------------------------------------

describe("TableCell — structure and CSS classes", () => {
  it("renders a <td> element", () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell />
          </tr>
        </tbody>
      </table>
    );
    expect(container.querySelector("td")).not.toBeNull();
  });

  it("has data-slot='table-cell'", () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell />
          </tr>
        </tbody>
      </table>
    );
    const td = container.querySelector("td") as HTMLElement;
    expect(td.getAttribute("data-slot")).toBe("table-cell");
  });

  it("has 'p-2' class", () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell />
          </tr>
        </tbody>
      </table>
    );
    const td = container.querySelector("td") as HTMLElement;
    expect(td.className).toContain("p-2");
  });

  it("has 'align-middle' class", () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell />
          </tr>
        </tbody>
      </table>
    );
    const td = container.querySelector("td") as HTMLElement;
    expect(td.className).toContain("align-middle");
  });

  it("has 'whitespace-nowrap' class", () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell />
          </tr>
        </tbody>
      </table>
    );
    const td = container.querySelector("td") as HTMLElement;
    expect(td.className).toContain("whitespace-nowrap");
  });

  it("has '[&:has([role=checkbox])]:pr-0' class", () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell />
          </tr>
        </tbody>
      </table>
    );
    const td = container.querySelector("td") as HTMLElement;
    expect(td.className).toContain("[&:has([role=checkbox])]:pr-0");
  });

  it("merges custom className", () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell className="font-medium text-right" />
          </tr>
        </tbody>
      </table>
    );
    const td = container.querySelector("td") as HTMLElement;
    expect(td.className).toContain("font-medium");
    expect(td.className).toContain("text-right");
    expect(td.className).toContain("p-2");
  });

  it("renders text children", () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell>Acme Corp</TableCell>
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
  });

  it("renders with colSpan attribute", () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell colSpan={3}>Spanning cell</TableCell>
          </tr>
        </tbody>
      </table>
    );
    const td = container.querySelector("td") as HTMLElement;
    expect(td.getAttribute("colspan")).toBe("3");
  });

  it("accessible role is 'cell' (implicit on <td>)", () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell>Cell value</TableCell>
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByRole("cell")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 10. TableCaption — structure and classes
// ---------------------------------------------------------------------------

describe("TableCaption — structure and CSS classes", () => {
  it("renders a <caption> element", () => {
    const { container } = render(
      <table>
        <TableCaption>Caption text</TableCaption>
      </table>
    );
    expect(container.querySelector("caption")).not.toBeNull();
  });

  it("has data-slot='table-caption'", () => {
    const { container } = render(
      <table>
        <TableCaption>Caption</TableCaption>
      </table>
    );
    const caption = container.querySelector("caption") as HTMLElement;
    expect(caption.getAttribute("data-slot")).toBe("table-caption");
  });

  it("has 'mt-4' class", () => {
    const { container } = render(
      <table>
        <TableCaption>Caption</TableCaption>
      </table>
    );
    const caption = container.querySelector("caption") as HTMLElement;
    expect(caption.className).toContain("mt-4");
  });

  it("has 'text-sm' class", () => {
    const { container } = render(
      <table>
        <TableCaption>Caption</TableCaption>
      </table>
    );
    const caption = container.querySelector("caption") as HTMLElement;
    expect(caption.className).toContain("text-sm");
  });

  it("has 'text-muted-foreground' class", () => {
    const { container } = render(
      <table>
        <TableCaption>Caption</TableCaption>
      </table>
    );
    const caption = container.querySelector("caption") as HTMLElement;
    expect(caption.className).toContain("text-muted-foreground");
  });

  it("renders caption text content", () => {
    render(
      <table>
        <TableCaption>A list of recent invoices.</TableCaption>
      </table>
    );
    expect(screen.getByText("A list of recent invoices.")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(
      <table>
        <TableCaption className="my-caption">Caption</TableCaption>
      </table>
    );
    const caption = container.querySelector("caption") as HTMLElement;
    expect(caption.className).toContain("my-caption");
    expect(caption.className).toContain("text-sm");
  });
});

// ---------------------------------------------------------------------------
// 11. data-slot attributes on all parts
// ---------------------------------------------------------------------------

describe("Table — data-slot attributes on every part", () => {
  it("Table outer div has data-slot='table-container'", () => {
    const { container } = render(<Table />);
    expect((container.firstChild as HTMLElement).getAttribute("data-slot")).toBe("table-container");
  });

  it("Table inner <table> has data-slot='table'", () => {
    const { container } = render(<Table />);
    expect(container.querySelector("table")!.getAttribute("data-slot")).toBe("table");
  });

  it("TableHeader has data-slot='table-header'", () => {
    const { container } = render(
      <table>
        <TableHeader />
      </table>
    );
    expect(container.querySelector("thead")!.getAttribute("data-slot")).toBe("table-header");
  });

  it("TableBody has data-slot='table-body'", () => {
    const { container } = render(
      <table>
        <TableBody />
      </table>
    );
    expect(container.querySelector("tbody")!.getAttribute("data-slot")).toBe("table-body");
  });

  it("TableFooter has data-slot='table-footer'", () => {
    const { container } = render(
      <table>
        <TableFooter />
      </table>
    );
    expect(container.querySelector("tfoot")!.getAttribute("data-slot")).toBe("table-footer");
  });

  it("TableRow has data-slot='table-row'", () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow />
        </tbody>
      </table>
    );
    expect(container.querySelector("tr")!.getAttribute("data-slot")).toBe("table-row");
  });

  it("TableHead has data-slot='table-head'", () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHead />
          </tr>
        </thead>
      </table>
    );
    expect(container.querySelector("th")!.getAttribute("data-slot")).toBe("table-head");
  });

  it("TableCell has data-slot='table-cell'", () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell />
          </tr>
        </tbody>
      </table>
    );
    expect(container.querySelector("td")!.getAttribute("data-slot")).toBe("table-cell");
  });

  it("TableCaption has data-slot='table-caption'", () => {
    const { container } = render(
      <table>
        <TableCaption />
      </table>
    );
    expect(container.querySelector("caption")!.getAttribute("data-slot")).toBe("table-caption");
  });
});

// ---------------------------------------------------------------------------
// 12. Full compositions — examples from docs
// ---------------------------------------------------------------------------

describe("Table — default (invoice list) example", () => {
  const invoices = [
    { id: "INV-001", customer: "Acme Corp", amount: "$250.00", status: "Paid" },
    { id: "INV-002", customer: "Globex Inc", amount: "$125.00", status: "Pending" },
    { id: "INV-003", customer: "Initech", amount: "$400.00", status: "Overdue" },
  ];

  function InvoiceTable() {
    return (
      <Table>
        <TableCaption>A list of recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell className="font-medium">{inv.id}</TableCell>
              <TableCell>{inv.customer}</TableCell>
              <TableCell>{inv.status}</TableCell>
              <TableCell className="text-right">{inv.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$775.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
  }

  it("renders the full invoice table without crashing", () => {
    render(<InvoiceTable />);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("renders the caption text", () => {
    render(<InvoiceTable />);
    expect(screen.getByText("A list of recent invoices.")).toBeInTheDocument();
  });

  it("renders all column headers", () => {
    render(<InvoiceTable />);
    expect(screen.getByRole("columnheader", { name: "Invoice" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Customer" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Status" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Amount" })).toBeInTheDocument();
  });

  it("renders data rows for every invoice", () => {
    render(<InvoiceTable />);
    invoices.forEach((inv) => {
      expect(screen.getByText(inv.id)).toBeInTheDocument();
      expect(screen.getByText(inv.customer)).toBeInTheDocument();
      expect(screen.getByText(inv.status)).toBeInTheDocument();
      expect(screen.getByText(inv.amount)).toBeInTheDocument();
    });
  });

  it("renders the footer Total row", () => {
    render(<InvoiceTable />);
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("$775.00")).toBeInTheDocument();
  });

  it("correct number of body rows (3 invoices)", () => {
    const { container } = render(<InvoiceTable />);
    const tbody = container.querySelector("tbody");
    expect(tbody?.querySelectorAll("tr")).toHaveLength(3);
  });

  it("Amount header has text-right class", () => {
    const { container } = render(<InvoiceTable />);
    const headers = container.querySelectorAll("th");
    const amountHeader = Array.from(headers).find((th) => th.textContent === "Amount");
    expect(amountHeader?.className).toContain("text-right");
  });
});

// ---------------------------------------------------------------------------
// 13. Interactive — selectable rows
// ---------------------------------------------------------------------------

describe("Table — selectable rows (interaction)", () => {
  const files = [
    { id: "1", name: "quarterly-report.pdf" },
    { id: "2", name: "design-assets.zip" },
    { id: "3", name: "budget-2026.xlsx" },
  ];

  function SelectableTable() {
    const [selected, setSelected] = React.useState<Set<string>>(new Set());

    function toggleRow(id: string) {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    }

    return (
      <div>
        <p data-testid="selection-count">{selected.size} selected</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow
                key={file.id}
                data-state={selected.has(file.id) ? "selected" : undefined}
                onClick={() => toggleRow(file.id)}
                className="cursor-pointer"
                data-testid={`row-${file.id}`}
              >
                <TableCell className="font-medium">{file.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  it("renders all rows", () => {
    render(<SelectableTable />);
    files.forEach((f) => {
      expect(screen.getByText(f.name)).toBeInTheDocument();
    });
  });

  it("no rows are selected initially", () => {
    render(<SelectableTable />);
    expect(screen.getByTestId("selection-count")).toHaveTextContent("0 selected");
    files.forEach((f) => {
      expect(screen.getByTestId(`row-${f.id}`)).not.toHaveAttribute("data-state", "selected");
    });
  });

  it("clicking a row selects it (data-state='selected')", async () => {
    const user = userEvent.setup();
    render(<SelectableTable />);
    await user.click(screen.getByText("quarterly-report.pdf"));
    expect(screen.getByTestId("row-1")).toHaveAttribute("data-state", "selected");
    expect(screen.getByTestId("selection-count")).toHaveTextContent("1 selected");
  });

  it("clicking a selected row deselects it", async () => {
    const user = userEvent.setup();
    render(<SelectableTable />);
    await user.click(screen.getByText("quarterly-report.pdf"));
    expect(screen.getByTestId("row-1")).toHaveAttribute("data-state", "selected");

    await user.click(screen.getByText("quarterly-report.pdf"));
    expect(screen.getByTestId("row-1")).not.toHaveAttribute("data-state", "selected");
    expect(screen.getByTestId("selection-count")).toHaveTextContent("0 selected");
  });

  it("multiple rows can be selected independently", async () => {
    const user = userEvent.setup();
    render(<SelectableTable />);
    await user.click(screen.getByText("quarterly-report.pdf"));
    await user.click(screen.getByText("design-assets.zip"));
    expect(screen.getByTestId("row-1")).toHaveAttribute("data-state", "selected");
    expect(screen.getByTestId("row-2")).toHaveAttribute("data-state", "selected");
    expect(screen.getByTestId("row-3")).not.toHaveAttribute("data-state", "selected");
    expect(screen.getByTestId("selection-count")).toHaveTextContent("2 selected");
  });

  it("selection count updates correctly after select/deselect cycle", async () => {
    const user = userEvent.setup();
    render(<SelectableTable />);
    await user.click(screen.getByText("quarterly-report.pdf"));
    await user.click(screen.getByText("design-assets.zip"));
    await user.click(screen.getByText("budget-2026.xlsx"));
    expect(screen.getByTestId("selection-count")).toHaveTextContent("3 selected");

    await user.click(screen.getByText("design-assets.zip"));
    expect(screen.getByTestId("selection-count")).toHaveTextContent("2 selected");
    expect(screen.getByTestId("row-2")).not.toHaveAttribute("data-state", "selected");
  });
});

// ---------------------------------------------------------------------------
// 14. Interactive — sortable columns
// ---------------------------------------------------------------------------

describe("Table — sortable columns (interaction)", () => {
  type Item = { id: number; name: string; amount: number };
  const rows: Item[] = [
    { id: 1, name: "Charlie", amount: 300 },
    { id: 2, name: "Alice", amount: 100 },
    { id: 3, name: "Bob", amount: 200 },
  ];

  function SortableTable() {
    const [sortKey, setSortKey] = React.useState<keyof Item | null>(null);
    const [sortDir, setSortDir] = React.useState<"asc" | "desc" | null>(null);

    function handleSort(key: keyof Item) {
      if (sortKey === key) {
        if (sortDir === "asc") setSortDir("desc");
        else if (sortDir === "desc") { setSortKey(null); setSortDir(null); }
        else setSortDir("asc");
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
    }

    const sorted = [...rows].sort((a, b) => {
      if (!sortKey || !sortDir) return 0;
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("name")}
              data-testid="sort-name"
            >
              Name
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("amount")}
              data-testid="sort-amount"
            >
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((item) => (
            <TableRow key={item.id}>
              <TableCell data-testid={`name-${item.id}`}>{item.name}</TableCell>
              <TableCell data-testid={`amount-${item.id}`}>{item.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  it("renders all rows in original order initially", () => {
    render(<SortableTable />);
    const cells = screen.getAllByRole("cell");
    // Rows: Charlie(300), Alice(100), Bob(200) — names at index 0, 2, 4
    const names = cells.filter((_, i) => i % 2 === 0).map((c) => c.textContent);
    expect(names).toEqual(["Charlie", "Alice", "Bob"]);
  });

  it("clicking Name header sorts ascending (A→Z)", async () => {
    const user = userEvent.setup();
    render(<SortableTable />);
    await user.click(screen.getByTestId("sort-name"));
    const cells = screen.getAllByRole("cell");
    const names = cells.filter((_, i) => i % 2 === 0).map((c) => c.textContent);
    expect(names).toEqual(["Alice", "Bob", "Charlie"]);
  });

  it("clicking Name header twice sorts descending (Z→A)", async () => {
    const user = userEvent.setup();
    render(<SortableTable />);
    await user.click(screen.getByTestId("sort-name"));
    await user.click(screen.getByTestId("sort-name"));
    const cells = screen.getAllByRole("cell");
    const names = cells.filter((_, i) => i % 2 === 0).map((c) => c.textContent);
    expect(names).toEqual(["Charlie", "Bob", "Alice"]);
  });

  it("clicking Name header three times resets order", async () => {
    const user = userEvent.setup();
    render(<SortableTable />);
    await user.click(screen.getByTestId("sort-name"));
    await user.click(screen.getByTestId("sort-name"));
    await user.click(screen.getByTestId("sort-name"));
    const cells = screen.getAllByRole("cell");
    const names = cells.filter((_, i) => i % 2 === 0).map((c) => c.textContent);
    expect(names).toEqual(["Charlie", "Alice", "Bob"]);
  });

  it("clicking Amount header sorts ascending (low→high)", async () => {
    const user = userEvent.setup();
    render(<SortableTable />);
    await user.click(screen.getByTestId("sort-amount"));
    const cells = screen.getAllByRole("cell");
    const amounts = cells.filter((_, i) => i % 2 === 1).map((c) => Number(c.textContent));
    expect(amounts).toEqual([100, 200, 300]);
  });

  it("switching sort column resets direction to asc for the new column", async () => {
    const user = userEvent.setup();
    render(<SortableTable />);
    await user.click(screen.getByTestId("sort-name"));
    await user.click(screen.getByTestId("sort-name")); // now desc
    await user.click(screen.getByTestId("sort-amount")); // switch col → asc amount
    const cells = screen.getAllByRole("cell");
    const amounts = cells.filter((_, i) => i % 2 === 1).map((c) => Number(c.textContent));
    expect(amounts).toEqual([100, 200, 300]);
  });
});

// ---------------------------------------------------------------------------
// 15. Interactive — row action menu (open / close / remove)
// ---------------------------------------------------------------------------

describe("Table — row actions (open/close menu, remove row)", () => {
  type Member = { id: string; name: string; email: string };
  const initial: Member[] = [
    { id: "u1", name: "Alex Rivera", email: "alex@example.com" },
    { id: "u2", name: "Morgan Chen", email: "morgan@example.com" },
  ];

  function ActionsTable() {
    const [members, setMembers] = React.useState<Member[]>(initial);
    const [openMenu, setOpenMenu] = React.useState<string | null>(null);

    function remove(id: string) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
      setOpenMenu(null);
    }

    return (
      <div onClick={() => setOpenMenu(null)}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.name}</TableCell>
                <TableCell>{m.email}</TableCell>
                <TableCell className="relative">
                  <button
                    aria-label={`Open actions for ${m.name}`}
                    data-testid={`menu-btn-${m.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenu(openMenu === m.id ? null : m.id);
                    }}
                  >
                    •••
                  </button>
                  {openMenu === m.id && (
                    <div data-testid={`menu-${m.id}`}>
                      <button
                        data-testid={`remove-${m.id}`}
                        onClick={() => remove(m.id)}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  it("renders all member rows initially", () => {
    render(<ActionsTable />);
    expect(screen.getByText("Alex Rivera")).toBeInTheDocument();
    expect(screen.getByText("Morgan Chen")).toBeInTheDocument();
  });

  it("action menus are closed initially", () => {
    render(<ActionsTable />);
    expect(screen.queryByTestId("menu-u1")).toBeNull();
    expect(screen.queryByTestId("menu-u2")).toBeNull();
  });

  it("clicking action button opens the menu for that row", async () => {
    const user = userEvent.setup();
    render(<ActionsTable />);
    await user.click(screen.getByTestId("menu-btn-u1"));
    expect(screen.getByTestId("menu-u1")).toBeInTheDocument();
    expect(screen.queryByTestId("menu-u2")).toBeNull();
  });

  it("clicking action button again closes the menu", async () => {
    const user = userEvent.setup();
    render(<ActionsTable />);
    await user.click(screen.getByTestId("menu-btn-u1"));
    expect(screen.getByTestId("menu-u1")).toBeInTheDocument();
    await user.click(screen.getByTestId("menu-btn-u1"));
    expect(screen.queryByTestId("menu-u1")).toBeNull();
  });

  it("clicking a different row's action button switches the open menu", async () => {
    const user = userEvent.setup();
    render(<ActionsTable />);
    await user.click(screen.getByTestId("menu-btn-u1"));
    expect(screen.getByTestId("menu-u1")).toBeInTheDocument();

    await user.click(screen.getByTestId("menu-btn-u2"));
    expect(screen.queryByTestId("menu-u1")).toBeNull();
    expect(screen.getByTestId("menu-u2")).toBeInTheDocument();
  });

  it("clicking Remove removes the row from the table", async () => {
    const user = userEvent.setup();
    render(<ActionsTable />);
    await user.click(screen.getByTestId("menu-btn-u1"));
    await user.click(screen.getByTestId("remove-u1"));
    expect(screen.queryByText("Alex Rivera")).toBeNull();
    expect(screen.getByText("Morgan Chen")).toBeInTheDocument();
  });

  it("menu closes after Remove is clicked", async () => {
    const user = userEvent.setup();
    render(<ActionsTable />);
    await user.click(screen.getByTestId("menu-btn-u1"));
    await user.click(screen.getByTestId("remove-u1"));
    expect(screen.queryByTestId("menu-u1")).toBeNull();
  });

  it("removing both rows leaves an empty table body", async () => {
    const user = userEvent.setup();
    render(<ActionsTable />);
    await user.click(screen.getByTestId("menu-btn-u1"));
    await user.click(screen.getByTestId("remove-u1"));
    await user.click(screen.getByTestId("menu-btn-u2"));
    await user.click(screen.getByTestId("remove-u2"));
    expect(screen.queryByText("Alex Rivera")).toBeNull();
    expect(screen.queryByText("Morgan Chen")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 16. Empty state pattern
// ---------------------------------------------------------------------------

describe("Table — empty state", () => {
  function EmptyStateTable({ empty }: { empty: boolean }) {
    const items = empty
      ? []
      : [{ id: "T-101", title: "Fix login redirect" }];

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length > 0 ? (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.title}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="h-40 text-center">
                No tasks found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  }

  it("renders data rows when items exist", () => {
    render(<EmptyStateTable empty={false} />);
    expect(screen.getByText("T-101")).toBeInTheDocument();
    expect(screen.getByText("Fix login redirect")).toBeInTheDocument();
  });

  it("renders the empty state row when items is empty", () => {
    render(<EmptyStateTable empty />);
    expect(screen.getByText("No tasks found")).toBeInTheDocument();
    expect(screen.queryByText("T-101")).toBeNull();
  });

  it("empty state cell has colSpan attribute set", () => {
    const { container } = render(<EmptyStateTable empty />);
    const td = container.querySelector("td");
    expect(td?.getAttribute("colspan")).toBe("2");
  });

  it("toggling empty→data re-renders table with rows", () => {
    const { rerender } = render(<EmptyStateTable empty />);
    expect(screen.getByText("No tasks found")).toBeInTheDocument();

    rerender(<EmptyStateTable empty={false} />);
    expect(screen.queryByText("No tasks found")).toBeNull();
    expect(screen.getByText("T-101")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 17. Loading skeleton pattern
// ---------------------------------------------------------------------------

describe("Table — loading skeleton state", () => {
  function SkeletonRow() {
    return (
      <TableRow>
        {[60, 140, 100].map((w, i) => (
          <TableCell key={i}>
            <div
              data-testid="skeleton-cell"
              className="h-4 rounded bg-muted animate-pulse"
              style={{ width: w }}
            />
          </TableCell>
        ))}
      </TableRow>
    );
  }

  function LoadingTable({ loading }: { loading: boolean }) {
    const data = [{ id: "P-001", name: "Wireless Mouse", category: "Peripherals" }];

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
            : data.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.category}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    );
  }

  it("renders skeleton rows when loading", () => {
    render(<LoadingTable loading />);
    const skeletonCells = screen.getAllByTestId("skeleton-cell");
    expect(skeletonCells.length).toBe(9); // 3 rows × 3 cells
  });

  it("skeleton cells have animate-pulse class", () => {
    render(<LoadingTable loading />);
    const cell = screen.getAllByTestId("skeleton-cell")[0];
    expect(cell.className).toContain("animate-pulse");
  });

  it("does not render data rows while loading", () => {
    render(<LoadingTable loading />);
    expect(screen.queryByText("P-001")).toBeNull();
    expect(screen.queryByText("Wireless Mouse")).toBeNull();
  });

  it("renders data rows when not loading", () => {
    render(<LoadingTable loading={false} />);
    expect(screen.getByText("P-001")).toBeInTheDocument();
    expect(screen.getByText("Wireless Mouse")).toBeInTheDocument();
    expect(screen.queryByTestId("skeleton-cell")).toBeNull();
  });

  it("transitions from loading to loaded on rerender", () => {
    const { rerender } = render(<LoadingTable loading />);
    expect(screen.getAllByTestId("skeleton-cell")).toHaveLength(9);

    rerender(<LoadingTable loading={false} />);
    expect(screen.queryByTestId("skeleton-cell")).toBeNull();
    expect(screen.getByText("Wireless Mouse")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 18. Native HTML attribute pass-through
// ---------------------------------------------------------------------------

describe("Table — native attribute pass-through", () => {
  it("Table accepts and passes id to the inner <table>", () => {
    const { container } = render(<Table id="invoice-table" />);
    expect(container.querySelector("table")).toHaveAttribute("id", "invoice-table");
  });

  it("Table accepts aria-label on the inner <table>", () => {
    const { container } = render(<Table aria-label="Invoice list" />);
    expect(container.querySelector("table")).toHaveAttribute("aria-label", "Invoice list");
  });

  it("TableRow accepts onClick handler", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(
      <table>
        <tbody>
          <TableRow onClick={handleClick}>
            <TableCell>Click me</TableCell>
          </TableRow>
        </tbody>
      </table>
    );
    await user.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("TableRow accepts data-testid", () => {
    render(
      <table>
        <tbody>
          <TableRow data-testid="my-row">
            <TableCell>Row</TableCell>
          </TableRow>
        </tbody>
      </table>
    );
    expect(screen.getByTestId("my-row")).toBeInTheDocument();
  });

  it("TableCell accepts data-testid", () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell data-testid="my-cell">Cell</TableCell>
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByTestId("my-cell")).toBeInTheDocument();
  });

  it("TableHead accepts scope attribute", () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHead scope="col">Name</TableHead>
          </tr>
        </thead>
      </table>
    );
    expect(container.querySelector("th")).toHaveAttribute("scope", "col");
  });
});

// ---------------------------------------------------------------------------
// 19. ARIA roles — implicit accessible structure
// ---------------------------------------------------------------------------

describe("Table — accessible roles", () => {
  it("table has role='table'", () => {
    render(<MinimalTable />);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("TableHead cells have role='columnheader'", () => {
    render(<MinimalTable />);
    const headers = screen.getAllByRole("columnheader");
    expect(headers.length).toBeGreaterThanOrEqual(2);
  });

  it("TableBody rows have role='row'", () => {
    render(<MinimalTable />);
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBeGreaterThanOrEqual(1);
  });

  it("TableCell has role='cell'", () => {
    render(<MinimalTable />);
    const cells = screen.getAllByRole("cell");
    expect(cells.length).toBeGreaterThanOrEqual(2);
  });

  it("TableHead can be queried by accessible name", () => {
    render(<MinimalTable />);
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Amount" })).toBeInTheDocument();
  });

  it("TableCell text is accessible", () => {
    render(<MinimalTable />);
    expect(screen.getByRole("cell", { name: "Acme Corp" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "$100" })).toBeInTheDocument();
  });

  it("within() scopes queries to a table row", () => {
    render(
      <Table>
        <TableBody>
          <TableRow data-testid="row-1">
            <TableCell>Row 1 Col 1</TableCell>
            <TableCell>Row 1 Col 2</TableCell>
          </TableRow>
          <TableRow data-testid="row-2">
            <TableCell>Row 2 Col 1</TableCell>
            <TableCell>Row 2 Col 2</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const row1 = screen.getByTestId("row-1");
    expect(within(row1).getByText("Row 1 Col 1")).toBeInTheDocument();
    expect(within(row1).queryByText("Row 2 Col 1")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 20. Accessibility — axe violations
// ---------------------------------------------------------------------------

describe("Table — accessibility (axe)", () => {
  it("minimal table has no axe violations", async () => {
    const { container } = render(<MinimalTable />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("table with caption has no axe violations", async () => {
    const { container } = render(<MinimalTable caption="Invoice list" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("table with footer has no axe violations", async () => {
    const { container } = render(<MinimalTable footerRow />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("table with selected row has no axe violations", async () => {
    const { container } = render(<MinimalTable rowState="selected" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("full invoice table has no axe violations", async () => {
    const invoices = [
      { id: "INV-001", customer: "Acme Corp", amount: "$250.00", status: "Paid" },
      { id: "INV-002", customer: "Globex Inc", amount: "$125.00", status: "Pending" },
    ];
    const { container } = render(
      <Table aria-label="Invoice list">
        <TableCaption>Recent invoices</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell>{inv.id}</TableCell>
              <TableCell>{inv.customer}</TableCell>
              <TableCell>{inv.status}</TableCell>
              <TableCell className="text-right">{inv.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$375.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("empty state table has no axe violations", async () => {
    const { container } = render(
      <Table aria-label="Tasks table">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={2} className="text-center">
              No tasks found
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("table with scope=col on th has no axe violations", async () => {
    const { container } = render(
      <Table aria-label="Employee table">
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Name</TableHead>
            <TableHead scope="col">Department</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Alex</TableCell>
            <TableCell>Engineering</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// 21. Re-render / update behavior
// ---------------------------------------------------------------------------

describe("Table — re-render behavior", () => {
  it("updating children re-renders body rows", () => {
    const { rerender } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Original</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByText("Original")).toBeInTheDocument();

    rerender(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Updated</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.queryByText("Original")).toBeNull();
    expect(screen.getByText("Updated")).toBeInTheDocument();
  });

  it("adding more rows updates the DOM", () => {
    const { rerender } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Row A</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getAllByRole("row")).toHaveLength(1);

    rerender(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Row A</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Row B</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getAllByRole("row")).toHaveLength(2);
  });

  it("removing rows updates the DOM", () => {
    const { rerender } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Row A</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Row B</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getAllByRole("row")).toHaveLength(2);

    rerender(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Row A</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getAllByRole("row")).toHaveLength(1);
    expect(screen.queryByText("Row B")).toBeNull();
  });

  it("updating a cell value reflects in the DOM", () => {
    function Comp({ value }: { value: string }) {
      return (
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>{value}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
    }
    const { rerender } = render(<Comp value="Before" />);
    expect(screen.getByText("Before")).toBeInTheDocument();
    rerender(<Comp value="After" />);
    expect(screen.queryByText("Before")).toBeNull();
    expect(screen.getByText("After")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 22. Edge cases
// ---------------------------------------------------------------------------

describe("Table — edge cases", () => {
  it("renders with no children and no className without crashing", () => {
    const { container } = render(<Table />);
    expect(container).toBeInTheDocument();
  });

  it("renders a table with only a header (no body)", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Col</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    expect(screen.getByRole("columnheader")).toBeInTheDocument();
  });

  it("renders a table with only a body (no header)", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByText("Data")).toBeInTheDocument();
  });

  it("multiple Table instances render independently", () => {
    render(
      <div>
        <Table aria-label="Table A">
          <TableBody>
            <TableRow>
              <TableCell>A</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table aria-label="Table B">
          <TableBody>
            <TableRow>
              <TableCell>B</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getAllByRole("table")).toHaveLength(2);
  });

  it("TableCell renders JSX children (e.g. a badge)", () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell>
              <span data-testid="badge">Paid</span>
            </TableCell>
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByTestId("badge")).toBeInTheDocument();
    expect(screen.getByText("Paid")).toBeInTheDocument();
  });

  it("TableHead renders JSX children (e.g. sort icon)", () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHead>
              Name <span data-testid="sort-icon">↕</span>
            </TableHead>
          </tr>
        </thead>
      </table>
    );
    expect(screen.getByTestId("sort-icon")).toBeInTheDocument();
  });

  it("TableRow does not crash with zero TableCell children", () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow />
        </tbody>
      </table>
    );
    expect(container.querySelector("tr")).toBeInTheDocument();
  });

  it("TableCell renders with empty children (no crash)", () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell />
          </tr>
        </tbody>
      </table>
    );
    expect(container.querySelector("td")).toBeInTheDocument();
  });
});
