import { FileTextIcon, ImageIcon, SettingsIcon } from "lucide-react";

import { Tree, type TreeViewElement } from "@/components/ui/file-tree";

const ELEMENTS: TreeViewElement[] = [
  {
    id: "1",
    name: "app",
    children: [
      { id: "2", name: "layout.tsx" },
      { id: "3", name: "page.tsx", icon: <FileTextIcon className="size-4" /> },
      {
        id: "4",
        name: "assets",
        children: [
          { id: "5", name: "logo.svg", icon: <ImageIcon className="size-4" /> },
          { id: "6", name: "hero.png", icon: <ImageIcon className="size-4" /> },
        ],
      },
    ],
  },
  {
    id: "7",
    name: "config",
    children: [{ id: "8", name: "tailwind.config.ts", icon: <SettingsIcon className="size-4" /> }],
  },
  { id: "9", name: "package.json" },
];

export default function Example() {
  return (
    <div className="h-72 w-full max-w-xs rounded-lg border border-border p-2">
      <Tree
        elements={ELEMENTS}
        variant="panel"
        showChevron
        showCount
        initialExpandedItems={["1", "4"]}
        initialSelectedId="3"
      />
    </div>
  );
}
