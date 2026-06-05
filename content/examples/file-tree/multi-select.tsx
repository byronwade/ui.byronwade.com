import { Tree, type TreeViewElement } from "@/components/ui/file-tree"

const ELEMENTS: TreeViewElement[] = [
  {
    id: "1",
    name: "src",
    children: [
      { id: "2", name: "index.ts" },
      {
        id: "3",
        name: "components",
        children: [
          { id: "4", name: "button.tsx" },
          { id: "5", name: "card.tsx" },
        ],
      },
    ],
  },
  { id: "6", name: "README.md" },
]

export default function Example() {
  return (
    <div className="h-72 w-full max-w-xs rounded-lg border border-border p-2">
      <Tree
        elements={ELEMENTS}
        variant="panel"
        selectionMode="multi"
        showChevron
        initialExpandedItems={["1", "3"]}
        defaultCheckedIds={["4"]}
      />
    </div>
  )
}
