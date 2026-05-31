"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

const files = [
  { id: "1", name: "quarterly-report.pdf", size: "2.4 MB", modified: "Today, 9:41 AM", type: "PDF" },
  { id: "2", name: "design-assets.zip", size: "18.3 MB", modified: "Yesterday", type: "Archive" },
  { id: "3", name: "budget-2026.xlsx", size: "540 KB", modified: "May 29", type: "Spreadsheet" },
  { id: "4", name: "presentation.pptx", size: "7.1 MB", modified: "May 28", type: "Presentation" },
  { id: "5", name: "meeting-notes.docx", size: "124 KB", modified: "May 27", type: "Document" },
];

export default function Example() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allSelected = selected.size === files.length;
  const someSelected = selected.size > 0 && !allSelected;

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(files.map((f) => f.id)));
    }
  }

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
    <div className="p-8 max-w-3xl mx-auto">
      {selected.size > 0 && (
        <p className="mb-3 text-sm text-muted-foreground">
          {selected.size} file{selected.size !== 1 ? "s" : ""} selected
        </p>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onCheckedChange={toggleAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Modified</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow
              key={file.id}
              data-state={selected.has(file.id) ? "selected" : undefined}
              onClick={() => toggleRow(file.id)}
              className="cursor-pointer"
            >
              <TableCell>
                <span onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selected.has(file.id)}
                    onCheckedChange={() => toggleRow(file.id)}
                    aria-label={`Select ${file.name}`}
                  />
                </span>
              </TableCell>
              <TableCell className="font-medium">{file.name}</TableCell>
              <TableCell className="text-muted-foreground">{file.type}</TableCell>
              <TableCell className="text-muted-foreground">{file.size}</TableCell>
              <TableCell className="text-muted-foreground">{file.modified}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
