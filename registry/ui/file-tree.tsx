/**
 * Adapted for byronwade/ui from MagicUI.
 * Original code, concept, and design © MagicUI — https://magicui.design
 * Rebuilt on Base UI (via the byronwade `collapsible` primitive) instead of
 * @radix-ui/react-accordion to stay on-system, with token surfaces only.
 */
"use client";

import * as React from "react";
import { FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

type TreeViewElement = {
  id: string;
  name: string;
  type?: "file" | "folder";
  isSelectable?: boolean;
  children?: TreeViewElement[];
};

type TreeSortMode =
  | "default"
  | "none"
  | ((a: TreeViewElement, b: TreeViewElement) => number);

type Direction = "rtl" | "ltr";

type TreeContextProps = {
  selectedId: string | undefined;
  expandedItems: string[] | undefined;
  indicator: boolean;
  handleExpand: (id: string) => void;
  selectItem: (id: string) => void;
  setExpandedItems?: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  direction: Direction;
};

const TreeContext = React.createContext<TreeContextProps | null>(null);

const useTree = () => {
  const context = React.useContext(TreeContext);
  if (!context) {
    throw new Error("useTree must be used within a TreeProvider");
  }
  return context;
};

const isFolderElement = (element: TreeViewElement) => {
  if (element.type) return element.type === "folder";
  return Array.isArray(element.children);
};

const mergeExpandedItems = (
  currentItems: string[] | undefined,
  nextItems: string[],
) => [...new Set([...(currentItems ?? []), ...nextItems])];

const treeCollator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

const defaultTreeComparator = (a: TreeViewElement, b: TreeViewElement) => {
  const aIsFolder = isFolderElement(a);
  const bIsFolder = isFolderElement(b);
  if (aIsFolder !== bIsFolder) return aIsFolder ? -1 : 1;
  return treeCollator.compare(a.name, b.name);
};

const getTreeComparator = (sort: TreeSortMode) => {
  if (sort === "none") return undefined;
  if (sort === "default") return defaultTreeComparator;
  return sort;
};

const sortTreeElements = (
  elements: TreeViewElement[],
  sort: TreeSortMode,
): TreeViewElement[] => {
  const comparator = getTreeComparator(sort);
  const nextElements = elements.map((element) => {
    if (!Array.isArray(element.children)) return element;
    return { ...element, children: sortTreeElements(element.children, sort) };
  });
  if (!comparator) return nextElements;
  return [...nextElements].sort(comparator);
};

const renderTreeElements = (
  elements: TreeViewElement[],
  sort: TreeSortMode,
): React.ReactNode =>
  sortTreeElements(elements, sort).map((element) => {
    if (isFolderElement(element)) {
      return (
        <Folder
          key={element.id}
          value={element.id}
          element={element.name}
          isSelectable={element.isSelectable}
        >
          {Array.isArray(element.children)
            ? renderTreeElements(element.children, sort)
            : null}
        </Folder>
      );
    }
    return (
      <File key={element.id} value={element.id} isSelectable={element.isSelectable}>
        <span>{element.name}</span>
      </File>
    );
  });

type TreeViewProps = {
  initialSelectedId?: string;
  indicator?: boolean;
  elements?: TreeViewElement[];
  initialExpandedItems?: string[];
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  sort?: TreeSortMode;
  dir?: Direction;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "dir">;

const Tree = React.forwardRef<HTMLDivElement, TreeViewProps>(
  (
    {
      className,
      elements,
      initialSelectedId,
      initialExpandedItems,
      children,
      indicator = true,
      openIcon,
      closeIcon,
      sort = "default",
      dir,
      ...props
    },
    ref,
  ) => {
    const [selectedId, setSelectedId] = React.useState<string | undefined>(
      initialSelectedId,
    );
    const [expandedItems, setExpandedItems] = React.useState<
      string[] | undefined
    >(initialExpandedItems);

    const selectItem = React.useCallback((id: string) => {
      setSelectedId(id);
    }, []);

    const handleExpand = React.useCallback((id: string) => {
      setExpandedItems((prev) => {
        if (prev?.includes(id)) return prev.filter((item) => item !== id);
        return [...(prev ?? []), id];
      });
    }, []);

    const expandSpecificTargetedElements = React.useCallback(
      (els?: TreeViewElement[], selectId?: string) => {
        if (!els || !selectId) return;
        const findParent = (
          currentElement: TreeViewElement,
          currentPath: string[] = [],
        ) => {
          const isSelectable = currentElement.isSelectable ?? true;
          const newPath = [...currentPath, currentElement.id];
          if (currentElement.id === selectId) {
            if (isSelectable) {
              setExpandedItems((prev) => mergeExpandedItems(prev, newPath));
            } else {
              newPath.pop();
              setExpandedItems((prev) => mergeExpandedItems(prev, newPath));
            }
            return;
          }
          if (
            Array.isArray(currentElement.children) &&
            currentElement.children.length > 0
          ) {
            currentElement.children.forEach((child) =>
              findParent(child, newPath),
            );
          }
        };
        els.forEach((element) => findParent(element));
      },
      [],
    );

    React.useEffect(() => {
      if (initialSelectedId) {
        expandSpecificTargetedElements(elements, initialSelectedId);
      }
    }, [initialSelectedId, elements, expandSpecificTargetedElements]);

    const direction: Direction = dir === "rtl" ? "rtl" : "ltr";
    const treeChildren =
      children ?? (elements ? renderTreeElements(elements, sort) : null);

    return (
      <TreeContext.Provider
        value={{
          selectedId,
          expandedItems,
          handleExpand,
          selectItem,
          setExpandedItems,
          indicator,
          openIcon,
          closeIcon,
          direction,
        }}
      >
        <div className={cn("size-full", className)} {...props}>
          <ScrollArea ref={ref} className="relative h-full px-2" dir={direction}>
            <div
              data-slot="file-tree"
              dir={direction}
              className="flex flex-col gap-1"
            >
              {treeChildren}
            </div>
          </ScrollArea>
        </div>
      </TreeContext.Provider>
    );
  },
);
Tree.displayName = "Tree";

const TreeIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { direction } = useTree();
  return (
    <div
      dir={direction}
      ref={ref}
      data-slot="file-tree-indicator"
      className={cn(
        "absolute left-1.5 h-full w-px rounded-md bg-muted py-3 duration-300 ease-in-out hover:bg-muted-foreground/40 rtl:right-1.5",
        className,
      )}
      {...props}
    />
  );
});
TreeIndicator.displayName = "TreeIndicator";

type FolderProps = {
  element: string;
  value: string;
  isSelectable?: boolean;
  isSelect?: boolean;
  className?: string;
  children?: React.ReactNode;
};

const Folder = React.forwardRef<HTMLDivElement, FolderProps>(
  ({ className, element, value, isSelectable = true, isSelect, children }, ref) => {
    const {
      direction,
      handleExpand,
      expandedItems,
      indicator,
      selectedId,
      selectItem,
      openIcon,
      closeIcon,
    } = useTree();
    const isOpen = expandedItems?.includes(value) ?? false;
    const isSelected = isSelect ?? selectedId === value;

    return (
      <Collapsible
        ref={ref}
        data-slot="file-tree-folder"
        open={isOpen}
        onOpenChange={() => {
          if (!isSelectable) return;
          selectItem(value);
          handleExpand(value);
        }}
        className="relative h-full overflow-hidden"
      >
        <CollapsibleTrigger
          className={cn(
            "flex items-center gap-1 rounded-md text-sm",
            isSelected && isSelectable && "bg-muted",
            isSelectable ? "cursor-pointer" : "cursor-not-allowed opacity-50",
            className,
          )}
          disabled={!isSelectable}
        >
          {isOpen
            ? (openIcon ?? <FolderOpenIcon className="size-4" />)
            : (closeIcon ?? <FolderIcon className="size-4" />)}
          <span>{element}</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="relative h-full overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up">
          {element && indicator && <TreeIndicator aria-hidden="true" />}
          <div
            dir={direction}
            className="ml-5 flex flex-col gap-1 py-1 rtl:mr-5"
          >
            {children}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
);
Folder.displayName = "Folder";

const File = React.forwardRef<
  HTMLButtonElement,
  {
    value: string;
    handleSelect?: (id: string) => void;
    isSelectable?: boolean;
    isSelect?: boolean;
    fileIcon?: React.ReactNode;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(
  (
    {
      value,
      className,
      handleSelect,
      onClick,
      isSelectable = true,
      isSelect,
      fileIcon,
      children,
      ...props
    },
    ref,
  ) => {
    const { selectedId, selectItem } = useTree();
    const isSelected = isSelect ?? selectedId === value;
    return (
      <button
        ref={ref}
        type="button"
        data-slot="file-tree-file"
        disabled={!isSelectable}
        className={cn(
          "flex w-fit items-center gap-1 rounded-md pr-1 text-sm duration-200 ease-in-out rtl:pr-0 rtl:pl-1",
          isSelected && isSelectable && "bg-muted",
          isSelectable ? "cursor-pointer" : "cursor-not-allowed opacity-50",
          className,
        )}
        onClick={(event) => {
          selectItem(value);
          handleSelect?.(value);
          onClick?.(event);
        }}
        {...props}
      >
        {fileIcon ?? <FileIcon className="size-4" />}
        {children}
      </button>
    );
  },
);
File.displayName = "File";

const CollapseButton = React.forwardRef<
  HTMLButtonElement,
  {
    elements: TreeViewElement[];
    expandAll?: boolean;
  } & React.HTMLAttributes<HTMLButtonElement>
>(({ className, elements, expandAll = false, children, ...props }, ref) => {
  const { expandedItems, setExpandedItems } = useTree();

  const expandAllTree = React.useCallback((els: TreeViewElement[]) => {
    const ids: string[] = [];
    const walk = (element: TreeViewElement) => {
      const isSelectable = element.isSelectable ?? true;
      if (isSelectable && element.children && element.children.length > 0) {
        ids.push(element.id);
        for (const child of element.children) walk(child);
      }
    };
    for (const element of els) walk(element);
    return [...new Set(ids)];
  }, []);

  const closeAll = React.useCallback(() => {
    setExpandedItems?.([]);
  }, [setExpandedItems]);

  React.useEffect(() => {
    if (expandAll) setExpandedItems?.(expandAllTree(elements));
  }, [expandAll, elements, expandAllTree, setExpandedItems]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      className={cn("absolute right-2 bottom-1 h-8 w-fit p-1", className)}
      onClick={
        expandedItems && expandedItems.length > 0
          ? closeAll
          : () => setExpandedItems?.(expandAllTree(elements))
      }
      {...props}
    >
      {children}
      <span className="sr-only">Toggle</span>
    </Button>
  );
});
CollapseButton.displayName = "CollapseButton";

export { CollapseButton, File, Folder, Tree, type TreeViewElement, type TreeSortMode };
