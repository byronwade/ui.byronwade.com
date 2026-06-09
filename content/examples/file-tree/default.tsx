import { Tree, type TreeViewElement } from "@/components/ui/file-tree"

const ELEMENTS: TreeViewElement[] = [
  {
    id: "1",
    name: "app",
    children: [
      { id: "2", name: "layout.tsx" },
      { id: "3", name: "page.tsx" },
      {
        id: "4",
        name: "components",
        children: [
          { id: "5", name: "button.tsx" },
          { id: "6", name: "card.tsx" },
        ],
      },
    ],
  },
  { id: "7", name: "package.json" },
  { id: "8", name: "tsconfig.json" },
]

export default function Example() {
  return (
    <div className="h-72 w-full max-w-xs rounded-lg edge p-2">
      <Tree
        elements={ELEMENTS}
        initialExpandedItems={["1", "4"]}
        initialSelectedId="3"
      />
    </div>
  )
}
