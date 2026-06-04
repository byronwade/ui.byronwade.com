/**
 * Adapted for byronwade/ui from MagicUI.
 * Original code, concept, and design © MagicUI — https://magicui.design
 * Rebuilt on Base UI (via the byronwade `collapsible` primitive) instead of
 * @radix-ui/react-accordion to stay on-system, with token surfaces only.
 *
 * The `panel` variant, multi-select checkbox cascade, guide lines, chevron
 * disclosure, and trailing direct-children counts are an original byronwade/ui
 * implementation inspired by Untitled UI's tree-view (design inspiration credit
 * only — Untitled UI's source is PRO-licensed; no code was copied). Built from
 * scratch on design tokens + the byronwade `checkbox`/`badge` primitives.
 */
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  ChevronRightIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  /** Custom leading icon — overrides the default File/Folder icon for this node. */
  icon?: React.ReactNode;
  children?: TreeViewElement[];
};

type TreeSortMode =
  | "default"
  | "none"
  | ((a: TreeViewElement, b: TreeViewElement) => number);

type Direction = "rtl" | "ltr";

type TreeVariant = "minimal" | "panel";
type SelectionMode = "single" | "multi";

const treeVariants = cva("flex flex-col", {
  variants: {
    variant: {
      minimal: "gap-1",
      panel: "gap-0.5",
    },
  },
  defaultVariants: {
    variant: "minimal",
  },
});

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
  variant: TreeVariant;
  selectionMode: SelectionMode;
  showChevron: boolean;
  showCount: boolean;
  checkedIds: Set<string>;
  toggleChecked: (id: string) => void;
  /** parentId → set of all descendant ids (built from `elements`). */
  descendantsMap: Map<string, Set<string>>;
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

/** Build a parentId → all-descendant-ids map for folder cascade + indeterminate. */
const buildDescendantsMap = (
  elements: TreeViewElement[],
): Map<string, Set<string>> => {
  const map = new Map<string, Set<string>>();
  const collect = (element: TreeViewElement): string[] => {
    const childIds: string[] = [];
    if (Array.isArray(element.children)) {
      for (const child of element.children) {
        childIds.push(child.id, ...collect(child));
      }
    }
    if (isFolderElement(element)) map.set(element.id, new Set(childIds));
    return childIds;
  };
  for (const element of elements) collect(element);
  return map;
};

const renderTreeElements = (
  elements: TreeViewElement[],
  sort: TreeSortMode,
): React.ReactNode =>
  sortTreeElements(elements, sort).map((element) => {
    if (isFolderElement(element)) {
      const directChildren = element.children?.length ?? 0;
      return (
        <Folder
          key={element.id}
          value={element.id}
          element={element.name}
          isSelectable={element.isSelectable}
          icon={element.icon}
          childCount={directChildren}
        >
          {Array.isArray(element.children)
            ? renderTreeElements(element.children, sort)
            : null}
        </Folder>
      );
    }
    return (
      <File
        key={element.id}
        value={element.id}
        isSelectable={element.isSelectable}
        fileIcon={element.icon}
        checkboxLabel={`Select ${element.name}`}
      >
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
  /** Visual density/treatment. `minimal` (default) = current look; `panel` = Untitled-UI-inspired rows. */
  variant?: TreeVariant;
  /** `single` (default) selection, or `multi` for cascading checkboxes. */
  selectionMode?: SelectionMode;
  /** Rotating chevron disclosure on folders. Defaults ON for `panel`, OFF for `minimal`. */
  showChevron?: boolean;
  /** Trailing direct-children count badge on folders. */
  showCount?: boolean;
  /** Controlled checked ids (multi-select). */
  checkedIds?: string[];
  /** Uncontrolled initial checked ids (multi-select). */
  defaultCheckedIds?: string[];
  onCheckedChange?: (ids: string[]) => void;
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
      variant = "minimal",
      selectionMode = "single",
      showChevron,
      showCount = false,
      checkedIds: checkedIdsProp,
      defaultCheckedIds,
      onCheckedChange,
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

    const [uncontrolledChecked, setUncontrolledChecked] = React.useState<
      Set<string>
    >(() => new Set(defaultCheckedIds ?? []));
    const isCheckedControlled = checkedIdsProp !== undefined;
    const checkedIds = React.useMemo(
      () =>
        isCheckedControlled ? new Set(checkedIdsProp) : uncontrolledChecked,
      [isCheckedControlled, checkedIdsProp, uncontrolledChecked],
    );

    const descendantsMap = React.useMemo(
      () =>
        elements
          ? buildDescendantsMap(elements)
          : new Map<string, Set<string>>(),
      [elements],
    );

    const toggleChecked = React.useCallback(
      (id: string) => {
        const next = new Set(checkedIds);
        // Folder cascade: a checked folder toggles all its descendants too.
        // In compositional mode (no `elements`) there is no descendants map,
        // so the checkbox toggles only its own id.
        const descendants = descendantsMap.get(id);
        const isOn = next.has(id);
        if (isOn) {
          next.delete(id);
          descendants?.forEach((d) => next.delete(d));
        } else {
          next.add(id);
          descendants?.forEach((d) => next.add(d));
        }
        if (!isCheckedControlled) setUncontrolledChecked(next);
        onCheckedChange?.([...next]);
      },
      [checkedIds, descendantsMap, isCheckedControlled, onCheckedChange],
    );

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
    const resolvedShowChevron = showChevron ?? variant === "panel";
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
          variant,
          selectionMode,
          showChevron: resolvedShowChevron,
          showCount,
          checkedIds,
          toggleChecked,
          descendantsMap,
        }}
      >
        <div className={cn("size-full", className)} {...props}>
          <ScrollArea ref={ref} className="relative h-full px-2" dir={direction}>
            <div
              data-slot="file-tree"
              data-variant={variant}
              dir={direction}
              className={treeVariants({ variant })}
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

// Row treatment shared by File + Folder triggers. `panel` rows become
// full-width selectable rows; `minimal` keeps today's tighter look.
const rowVariants = cva("flex items-center gap-1 rounded-md text-sm", {
  variants: {
    variant: {
      minimal: "",
      panel: "w-full px-2 py-1 transition-colors hover:bg-muted/50",
    },
    selected: { true: "bg-muted", false: "" },
    selectable: { true: "cursor-pointer", false: "cursor-not-allowed opacity-50" },
  },
  defaultVariants: { variant: "minimal", selected: false, selectable: true },
});

/** Compute the checkbox state of a folder from its descendants. */
const folderCheckState = (descendants: Set<string> | undefined, checked: Set<string>) => {
  if (!descendants || descendants.size === 0) return { checked: false, indeterminate: false };
  let some = false;
  let all = true;
  for (const id of descendants) {
    if (checked.has(id)) some = true;
    else all = false;
  }
  return { checked: all, indeterminate: some && !all };
};

type FolderProps = {
  element: string;
  value: string;
  isSelectable?: boolean;
  isSelect?: boolean;
  className?: string;
  icon?: React.ReactNode;
  /** Direct-children count for the trailing count badge (data-driven only). */
  childCount?: number;
  /** Per-folder chevron override. */
  showChevron?: boolean;
  children?: React.ReactNode;
};

const Folder = React.forwardRef<HTMLDivElement, FolderProps>(
  (
    {
      className,
      element,
      value,
      isSelectable = true,
      isSelect,
      icon,
      childCount,
      showChevron: showChevronProp,
      children,
    },
    ref,
  ) => {
    const {
      direction,
      handleExpand,
      expandedItems,
      indicator,
      selectedId,
      selectItem,
      openIcon,
      closeIcon,
      variant,
      selectionMode,
      showChevron: ctxShowChevron,
      showCount,
      checkedIds,
      toggleChecked,
      descendantsMap,
    } = useTree();
    const isOpen = expandedItems?.includes(value) ?? false;
    const isSelected = isSelect ?? selectedId === value;
    const resolvedChevron = showChevronProp ?? ctxShowChevron;

    const leadingIcon =
      icon ??
      (isOpen
        ? (openIcon ?? <FolderOpenIcon className="size-4" />)
        : (closeIcon ?? <FolderIcon className="size-4" />));

    const chevron = resolvedChevron ? (
      <ChevronRightIcon
        data-slot="file-tree-chevron"
        aria-hidden="true"
        className={cn(
          "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
          isOpen && "rotate-90",
        )}
      />
    ) : null;

    const checkState = folderCheckState(descendantsMap.get(value), checkedIds);
    // In compositional mode there is no descendants map, so fall back to the
    // folder's own checked id.
    const ownChecked = checkedIds.has(value);
    const isChecked = descendantsMap.has(value) ? checkState.checked : ownChecked;
    const isIndeterminate = descendantsMap.has(value)
      ? checkState.indeterminate
      : false;

    const checkbox =
      selectionMode === "multi" ? (
        <Checkbox
          data-slot="file-tree-checkbox"
          aria-label={`Select ${element}`}
          checked={isChecked}
          indeterminate={isIndeterminate}
          disabled={!isSelectable}
          onCheckedChange={() => toggleChecked(value)}
        />
      ) : null;

    const count =
      showCount && childCount !== undefined ? (
        <Badge
          data-slot="file-tree-count"
          variant="secondary"
          className="ml-auto font-mono"
        >
          {childCount}
        </Badge>
      ) : null;

    const trigger = (
      <CollapsibleTrigger
        className={cn(
          rowVariants({ variant, selected: isSelected && isSelectable, selectable: isSelectable }),
          selectionMode === "multi" && "flex-1",
          className,
        )}
        disabled={!isSelectable}
      >
        {chevron}
        {leadingIcon}
        <span>{element}</span>
        {count}
      </CollapsibleTrigger>
    );

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
        {/* In multi mode the checkbox is a SIBLING of the trigger button, never
            a child — nesting interactive elements fails axe nested-interactive. */}
        {selectionMode === "multi" ? (
          <div
            data-slot="file-tree-row"
            className="flex w-full items-center gap-2"
          >
            {checkbox}
            {trigger}
          </div>
        ) : (
          trigger
        )}
        <CollapsibleContent className="relative h-full overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up">
          {element && indicator && (
            <TreeIndicator
              aria-hidden="true"
              className={variant === "panel" ? "bg-border" : undefined}
            />
          )}
          <div
            dir={direction}
            className={cn(
              "flex flex-col rtl:mr-5",
              variant === "panel" ? "ml-5 gap-0.5 py-0.5" : "ml-5 gap-1 py-1",
            )}
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
    /** aria-label for the multi-select checkbox (data-driven mode passes the file name). */
    checkboxLabel?: string;
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
      checkboxLabel,
      children,
      ...props
    },
    ref,
  ) => {
    const { selectedId, selectItem, variant, selectionMode, checkedIds, toggleChecked } =
      useTree();
    const isSelected = isSelect ?? selectedId === value;

    const checkbox =
      selectionMode === "multi" ? (
        <Checkbox
          data-slot="file-tree-checkbox"
          aria-label={checkboxLabel ?? "Select file"}
          checked={checkedIds.has(value)}
          disabled={!isSelectable}
          onCheckedChange={() => toggleChecked(value)}
        />
      ) : null;

    const button = (
      <button
        ref={ref}
        type="button"
        data-slot="file-tree-file"
        disabled={!isSelectable}
        className={cn(
          rowVariants({
            variant,
            selected: isSelected && isSelectable,
            selectable: isSelectable,
          }),
          variant === "minimal" && "w-fit pr-1 duration-200 ease-in-out rtl:pr-0 rtl:pl-1",
          selectionMode === "multi" && "flex-1",
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

    if (selectionMode === "multi") {
      return (
        <div
          data-slot="file-tree-row"
          className="flex w-full items-center gap-2"
        >
          {checkbox}
          {button}
        </div>
      );
    }
    return button;
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

export {
  CollapseButton,
  File,
  Folder,
  Tree,
  TreeIndicator,
  treeVariants,
  type TreeViewElement,
  type TreeSortMode,
};
