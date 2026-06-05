"use client";

import { MorphMenubar } from "@/components/ui/morph-menubar";

export default function Example() {
  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-xl edge">
      <MorphMenubar
        menus={[
          { id: "file", label: "File", items: [{ id: "new", label: "New File" }, { id: "open", label: "Open…" }, { id: "save", label: "Save" }] },
          { id: "edit", label: "Edit", items: [{ id: "undo", label: "Undo" }, { id: "redo", label: "Redo" }] },
          { id: "view", label: "View", items: [{ id: "zoom-in", label: "Zoom In" }, { id: "zoom-out", label: "Zoom Out" }] },
        ]}
      />
    </div>
  );
}
