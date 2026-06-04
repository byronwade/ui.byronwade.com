"use client";

/**
 * Adapted for byronwade/ui from kibo-ui.
 * Original code, concept, and design © kibo-ui — https://www.kibo-ui.com
 * Reworked to the byronwade/ui design system (tokens, mono dates, data-slot).
 */

import {
  DndContext,
  MouseSensor,
  useDraggable,
  useSensor,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { useMouse, useThrottle, useWindowScroll } from "@uidotdev/usehooks";
import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import {
  addDays,
  addMonths,
  differenceInDays,
  differenceInHours,
  differenceInMonths,
  endOfDay,
  endOfMonth,
  format,
  formatDate,
  formatDistance,
  getDate,
  getDaysInMonth,
  isSameDay,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { atom, useAtom } from "jotai";
import throttle from "lodash.throttle";
import { PlusIcon, TrashIcon } from "lucide-react";
import type {
  CSSProperties,
  FC,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  RefObject,
} from "react";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const draggingAtom = atom(false);
const scrollXAtom = atom(0);

export const useGanttDragging = () => useAtom(draggingAtom);
export const useGanttScrollX = () => useAtom(scrollXAtom);

/* -------------------------------------------------------------------------- */
/* Local context menu (Base UI). byronwade/ui has no shared context-menu       */
/* primitive, so the marker's right-click menu is built inline here, modeled    */
/* on registry/ui/dropdown-menu.tsx (data-slots + semantic tokens).            */
/* -------------------------------------------------------------------------- */

function ContextMenu({ ...props }: ContextMenuPrimitive.Root.Props) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

function ContextMenuTrigger({ ...props }: ContextMenuPrimitive.Trigger.Props) {
  return (
    <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
  );
}

function ContextMenuContent({
  className,
  ...props
}: ContextMenuPrimitive.Popup.Props) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Positioner className="isolate z-50 outline-none">
        <ContextMenuPrimitive.Popup
          data-slot="context-menu-content"
          className={cn(
            "z-50 min-w-32 origin-(--transform-origin) overflow-hidden rounded-lg bg-popover p-1 text-popover-foreground edge outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
}

function ContextMenuItem({
  className,
  variant = "default",
  ...props
}: ContextMenuPrimitive.Item.Props & {
  variant?: "default" | "destructive";
}) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-variant={variant}
      className={cn(
        "relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

export type GanttStatus = {
  id: string;
  name: string;
  /** A token-driven utility class for the status dot, e.g. `bg-brand`. */
  color: string;
};

export type GanttFeature = {
  id: string;
  name: string;
  startAt: Date;
  endAt: Date;
  status: GanttStatus;
  lane?: string; // Optional: features with the same lane will share a row
};

export type GanttMarkerProps = {
  id: string;
  date: Date;
  label: string;
};

export type Range = "daily" | "monthly" | "quarterly";

export type TimelineData = {
  year: number;
  quarters: {
    months: {
      days: number;
    }[];
  }[];
}[];

export type GanttContextProps = {
  zoom: number;
  range: Range;
  columnWidth: number;
  sidebarWidth: number;
  headerHeight: number;
  rowHeight: number;
  onAddItem: ((date: Date) => void) | undefined;
  placeholderLength: number;
  timelineData: TimelineData;
  ref: RefObject<HTMLDivElement | null> | null;
  scrollToFeature?: (feature: GanttFeature) => void;
};

const getsDaysIn = (range: Range) => {
  // For when range is daily
  let fn = (_date: Date) => 1;

  if (range === "monthly" || range === "quarterly") {
    fn = getDaysInMonth;
  }

  return fn;
};

const getDifferenceIn = (range: Range) => {
  let fn = differenceInDays;

  if (range === "monthly" || range === "quarterly") {
    fn = differenceInMonths;
  }

  return fn;
};

const getInnerDifferenceIn = (range: Range) => {
  let fn = differenceInHours;

  if (range === "monthly" || range === "quarterly") {
    fn = differenceInDays;
  }

  return fn;
};

const getStartOf = (range: Range) => {
  let fn = startOfDay;

  if (range === "monthly" || range === "quarterly") {
    fn = startOfMonth;
  }

  return fn;
};

const getEndOf = (range: Range) => {
  let fn = endOfDay;

  if (range === "monthly" || range === "quarterly") {
    fn = endOfMonth;
  }

  return fn;
};

const getAddRange = (range: Range) => {
  let fn = addDays;

  if (range === "monthly" || range === "quarterly") {
    fn = addMonths;
  }

  return fn;
};

const getDateByMousePosition = (context: GanttContextProps, mouseX: number) => {
  const timelineStartDate = new Date(context.timelineData[0].year, 0, 1);
  const columnWidth = (context.columnWidth * context.zoom) / 100;
  const offset = Math.floor(mouseX / columnWidth);
  const daysIn = getsDaysIn(context.range);
  const addRange = getAddRange(context.range);
  const month = addRange(timelineStartDate, offset);
  const daysInMonth = daysIn(month);
  const pixelsPerDay = Math.round(columnWidth / daysInMonth);
  const dayOffset = Math.floor((mouseX % columnWidth) / pixelsPerDay);
  const actualDate = addDays(month, dayOffset);

  return actualDate;
};

const createInitialTimelineData = (today: Date) => {
  const data: TimelineData = [];

  data.push(
    { year: today.getFullYear() - 1, quarters: new Array(4).fill(null) },
    { year: today.getFullYear(), quarters: new Array(4).fill(null) },
    { year: today.getFullYear() + 1, quarters: new Array(4).fill(null) }
  );

  for (const yearObj of data) {
    yearObj.quarters = new Array(4).fill(null).map((_, quarterIndex) => ({
      months: new Array(3).fill(null).map((_, monthIndex) => {
        const month = quarterIndex * 3 + monthIndex;
        return {
          days: getDaysInMonth(new Date(yearObj.year, month, 1)),
        };
      }),
    }));
  }

  return data;
};

const getOffset = (
  date: Date,
  timelineStartDate: Date,
  context: GanttContextProps
) => {
  const parsedColumnWidth = (context.columnWidth * context.zoom) / 100;
  const differenceIn = getDifferenceIn(context.range);
  const startOf = getStartOf(context.range);
  const fullColumns = differenceIn(startOf(date), timelineStartDate);

  if (context.range === "daily") {
    return parsedColumnWidth * fullColumns;
  }

  const partialColumns = date.getDate();
  const daysInMonth = getDaysInMonth(date);
  const pixelsPerDay = parsedColumnWidth / daysInMonth;

  return fullColumns * parsedColumnWidth + partialColumns * pixelsPerDay;
};

const getWidth = (
  startAt: Date,
  endAt: Date | null,
  context: GanttContextProps
) => {
  const parsedColumnWidth = (context.columnWidth * context.zoom) / 100;

  if (!endAt) {
    return parsedColumnWidth * 2;
  }

  const differenceIn = getDifferenceIn(context.range);

  if (context.range === "daily") {
    const delta = differenceIn(endAt, startAt);

    return parsedColumnWidth * (delta ? delta : 1);
  }

  const daysInStartMonth = getDaysInMonth(startAt);
  const pixelsPerDayInStartMonth = parsedColumnWidth / daysInStartMonth;

  if (isSameDay(startAt, endAt)) {
    return pixelsPerDayInStartMonth;
  }

  const innerDifferenceIn = getInnerDifferenceIn(context.range);
  const startOf = getStartOf(context.range);

  if (isSameDay(startOf(startAt), startOf(endAt))) {
    return innerDifferenceIn(endAt, startAt) * pixelsPerDayInStartMonth;
  }

  const startRangeOffset = daysInStartMonth - getDate(startAt);
  const endRangeOffset = getDate(endAt);
  const fullRangeOffset = differenceIn(startOf(endAt), startOf(startAt));
  const daysInEndMonth = getDaysInMonth(endAt);
  const pixelsPerDayInEndMonth = parsedColumnWidth / daysInEndMonth;

  return (
    (fullRangeOffset - 1) * parsedColumnWidth +
    startRangeOffset * pixelsPerDayInStartMonth +
    endRangeOffset * pixelsPerDayInEndMonth
  );
};

const calculateInnerOffset = (
  date: Date,
  range: Range,
  columnWidth: number
) => {
  const startOf = getStartOf(range);
  const endOf = getEndOf(range);
  const differenceIn = getInnerDifferenceIn(range);
  const startOfRange = startOf(date);
  const endOfRange = endOf(date);
  const totalRangeDays = differenceIn(endOfRange, startOfRange);
  const dayOfMonth = date.getDate();

  return (dayOfMonth / totalRangeDays) * columnWidth;
};

const GanttContext = createContext<GanttContextProps>({
  zoom: 100,
  range: "monthly",
  columnWidth: 50,
  headerHeight: 60,
  sidebarWidth: 300,
  rowHeight: 36,
  onAddItem: undefined,
  placeholderLength: 2,
  timelineData: [],
  ref: null,
  scrollToFeature: undefined,
});

export type GanttContentHeaderProps = {
  renderHeaderItem: (index: number) => ReactNode;
  title: string;
  columns: number;
};

export const GanttContentHeader: FC<GanttContentHeaderProps> = ({
  title,
  columns,
  renderHeaderItem,
}) => {
  const id = useId();

  return (
    <div
      data-slot="gantt-content-header"
      className="sticky top-0 z-20 grid w-full shrink-0 bg-card/90 backdrop-blur-sm"
      style={{ height: "var(--gantt-header-height)" }}
    >
      <div>
        <div
          className="sticky inline-flex whitespace-nowrap px-3 py-2 font-mono text-xs text-muted-foreground"
          style={{
            left: "var(--gantt-sidebar-width)",
          }}
        >
          <p>{title}</p>
        </div>
      </div>
      <div
        className="grid w-full"
        style={{
          gridTemplateColumns: `repeat(${columns}, var(--gantt-column-width))`,
        }}
      >
        {Array.from({ length: columns }).map((_, index) => (
          <div
            className="shrink-0 border-b border-border/50 py-1 text-center font-mono text-xs"
            key={`${id}-${index}`}
          >
            {renderHeaderItem(index)}
          </div>
        ))}
      </div>
    </div>
  );
};

const DailyHeader: FC = () => {
  const gantt = useContext(GanttContext);

  return gantt.timelineData.map((year) =>
    year.quarters
      .flatMap((quarter) => quarter.months)
      .map((month, index) => (
        <div className="relative flex flex-col" key={`${year.year}-${index}`}>
          <GanttContentHeader
            columns={month.days}
            renderHeaderItem={(item: number) => (
              <div className="flex items-center justify-center gap-1">
                <p>
                  {format(addDays(new Date(year.year, index, 1), item), "d")}
                </p>
                <p className="text-muted-foreground">
                  {format(
                    addDays(new Date(year.year, index, 1), item),
                    "EEEEE"
                  )}
                </p>
              </div>
            )}
            title={format(new Date(year.year, index, 1), "MMMM yyyy")}
          />
          <GanttColumns
            columns={month.days}
            isColumnSecondary={(item: number) =>
              [0, 6].includes(
                addDays(new Date(year.year, index, 1), item).getDay()
              )
            }
          />
        </div>
      ))
  );
};

const MonthlyHeader: FC = () => {
  const gantt = useContext(GanttContext);

  return gantt.timelineData.map((year) => (
    <div className="relative flex flex-col" key={year.year}>
      <GanttContentHeader
        columns={year.quarters.flatMap((quarter) => quarter.months).length}
        renderHeaderItem={(item: number) => (
          <p>{format(new Date(year.year, item, 1), "MMM")}</p>
        )}
        title={`${year.year}`}
      />
      <GanttColumns
        columns={year.quarters.flatMap((quarter) => quarter.months).length}
      />
    </div>
  ));
};

const QuarterlyHeader: FC = () => {
  const gantt = useContext(GanttContext);

  return gantt.timelineData.map((year) =>
    year.quarters.map((quarter, quarterIndex) => (
      <div
        className="relative flex flex-col"
        key={`${year.year}-${quarterIndex}`}
      >
        <GanttContentHeader
          columns={quarter.months.length}
          renderHeaderItem={(item: number) => (
            <p>
              {format(new Date(year.year, quarterIndex * 3 + item, 1), "MMM")}
            </p>
          )}
          title={`Q${quarterIndex + 1} ${year.year}`}
        />
        <GanttColumns columns={quarter.months.length} />
      </div>
    ))
  );
};

const headers: Record<Range, FC> = {
  daily: DailyHeader,
  monthly: MonthlyHeader,
  quarterly: QuarterlyHeader,
};

export type GanttHeaderProps = {
  className?: string;
};

export const GanttHeader: FC<GanttHeaderProps> = ({ className }) => {
  const gantt = useContext(GanttContext);
  const Header = headers[gantt.range];

  return (
    <div
      data-slot="gantt-header"
      className={cn(
        "-space-x-px flex h-full w-max divide-x divide-border/50",
        className
      )}
    >
      <Header />
    </div>
  );
};

export type GanttSidebarItemProps = {
  feature: GanttFeature;
  onSelectItem?: (id: string) => void;
  className?: string;
};

export const GanttSidebarItem: FC<GanttSidebarItemProps> = ({
  feature,
  onSelectItem,
  className,
}) => {
  const gantt = useContext(GanttContext);
  const tempEndAt =
    feature.endAt && isSameDay(feature.startAt, feature.endAt)
      ? addDays(feature.endAt, 1)
      : feature.endAt;
  const duration = tempEndAt
    ? formatDistance(feature.startAt, tempEndAt)
    : `${formatDistance(feature.startAt, new Date())} so far`;

  const handleClick: MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.target === event.currentTarget) {
      // Scroll to the feature in the timeline
      gantt.scrollToFeature?.(feature);
      // Call the original onSelectItem callback
      onSelectItem?.(feature.id);
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === "Enter") {
      // Scroll to the feature in the timeline
      gantt.scrollToFeature?.(feature);
      // Call the original onSelectItem callback
      onSelectItem?.(feature.id);
    }
  };

  return (
    <div
      data-slot="gantt-sidebar-item"
      className={cn(
        "relative flex items-center gap-2.5 p-2.5 text-xs hover:bg-secondary",
        className
      )}
      key={feature.id}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      style={{
        height: "var(--gantt-row-height)",
      }}
      tabIndex={0}
    >
      <div
        className={cn(
          "pointer-events-none size-2 shrink-0 rounded-full",
          feature.status.color
        )}
      />
      <p className="pointer-events-none flex-1 truncate text-left font-medium">
        {feature.name}
      </p>
      <p className="pointer-events-none font-mono text-muted-foreground">
        {duration}
      </p>
    </div>
  );
};

export const GanttSidebarHeader: FC = () => (
  <div
    data-slot="gantt-sidebar-header"
    className="sticky top-0 z-10 flex shrink-0 items-end justify-between gap-2.5 border-b border-border/50 bg-card/90 p-2.5 text-xs font-medium text-muted-foreground backdrop-blur-sm"
    style={{ height: "var(--gantt-header-height)" }}
  >
    <p className="flex-1 truncate text-left">Issues</p>
    <p className="shrink-0">Duration</p>
  </div>
);

export type GanttSidebarGroupProps = {
  children: ReactNode;
  name: string;
  className?: string;
};

export const GanttSidebarGroup: FC<GanttSidebarGroupProps> = ({
  children,
  name,
  className,
}) => (
  <div data-slot="gantt-sidebar-group" className={className}>
    <p
      className="w-full truncate p-2.5 text-left text-xs font-medium text-muted-foreground"
      style={{ height: "var(--gantt-row-height)" }}
    >
      {name}
    </p>
    <div className="divide-y divide-border/50">{children}</div>
  </div>
);

export type GanttSidebarProps = {
  children: ReactNode;
  className?: string;
};

export const GanttSidebar: FC<GanttSidebarProps> = ({
  children,
  className,
}) => (
  <div
    className={cn(
      "sticky left-0 z-30 h-max min-h-full overflow-clip border-r border-border/50 bg-background/90 backdrop-blur-md",
      className
    )}
    data-slot="gantt-sidebar"
    data-roadmap-ui="gantt-sidebar"
  >
    <GanttSidebarHeader />
    <div className="space-y-4">{children}</div>
  </div>
);

export type GanttAddFeatureHelperProps = {
  top: number;
  className?: string;
};

export const GanttAddFeatureHelper: FC<GanttAddFeatureHelperProps> = ({
  top,
  className,
}) => {
  const [scrollX] = useGanttScrollX();
  const gantt = useContext(GanttContext);
  const [mousePosition, mouseRef] = useMouse<HTMLDivElement>();

  const handleClick = () => {
    const ganttRect = gantt.ref?.current?.getBoundingClientRect();
    const x =
      mousePosition.x - (ganttRect?.left ?? 0) + scrollX - gantt.sidebarWidth;
    const currentDate = getDateByMousePosition(gantt, x);

    gantt.onAddItem?.(currentDate);
  };

  return (
    <div
      data-slot="gantt-add-feature-helper"
      className={cn("absolute top-0 w-full px-0.5", className)}
      ref={mouseRef}
      style={{
        marginTop: -gantt.rowHeight / 2,
        transform: `translateY(${top}px)`,
      }}
    >
      <button
        aria-label="Add feature"
        className="flex h-full w-full items-center justify-center rounded-md border border-dashed border-border p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={handleClick}
        type="button"
      >
        <PlusIcon
          className="pointer-events-none size-4 select-none text-muted-foreground"
        />
      </button>
    </div>
  );
};

export type GanttColumnProps = {
  index: number;
  isColumnSecondary?: (item: number) => boolean;
};

export const GanttColumn: FC<GanttColumnProps> = ({
  index,
  isColumnSecondary,
}) => {
  const gantt = useContext(GanttContext);
  const [dragging] = useGanttDragging();
  const [mousePosition, mouseRef] = useMouse<HTMLDivElement>();
  const [hovering, setHovering] = useState(false);
  const [windowScroll] = useWindowScroll();

  const handleMouseEnter = () => setHovering(true);
  const handleMouseLeave = () => setHovering(false);

  const top = useThrottle(
    mousePosition.y -
      (mouseRef.current?.getBoundingClientRect().y ?? 0) -
      (windowScroll.y ?? 0),
    10
  );

  return (
    <div
      data-slot="gantt-column"
      className={cn(
        "group relative h-full overflow-hidden",
        isColumnSecondary?.(index) ? "bg-secondary" : ""
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={mouseRef}
    >
      {!dragging && hovering && gantt.onAddItem ? (
        <GanttAddFeatureHelper top={top} />
      ) : null}
    </div>
  );
};

export type GanttColumnsProps = {
  columns: number;
  isColumnSecondary?: (item: number) => boolean;
};

export const GanttColumns: FC<GanttColumnsProps> = ({
  columns,
  isColumnSecondary,
}) => {
  const id = useId();

  return (
    <div
      data-slot="gantt-columns"
      className="divide grid h-full w-full divide-x divide-border/50"
      style={{
        gridTemplateColumns: `repeat(${columns}, var(--gantt-column-width))`,
      }}
    >
      {Array.from({ length: columns }).map((_, index) => (
        <GanttColumn
          index={index}
          isColumnSecondary={isColumnSecondary}
          key={`${id}-${index}`}
        />
      ))}
    </div>
  );
};

export type GanttCreateMarkerTriggerProps = {
  onCreateMarker: (date: Date) => void;
  className?: string;
};

export const GanttCreateMarkerTrigger: FC<GanttCreateMarkerTriggerProps> = ({
  onCreateMarker,
  className,
}) => {
  const gantt = useContext(GanttContext);
  const [mousePosition, mouseRef] = useMouse<HTMLDivElement>();
  const [windowScroll] = useWindowScroll();
  const x = useThrottle(
    mousePosition.x -
      (mouseRef.current?.getBoundingClientRect().x ?? 0) -
      (windowScroll.x ?? 0),
    10
  );

  const date = getDateByMousePosition(gantt, x);

  const handleClick = () => onCreateMarker(date);

  return (
    <div
      data-slot="gantt-create-marker-trigger"
      className={cn(
        "group pointer-events-none absolute top-0 left-0 h-full w-full select-none overflow-visible",
        className
      )}
      ref={mouseRef}
    >
      <div
        className="-ml-2 pointer-events-auto sticky top-6 z-20 flex w-4 flex-col items-center justify-center gap-1 overflow-visible opacity-0 group-hover:opacity-100"
        style={{ transform: `translateX(${x}px)` }}
      >
        <button
          aria-label="Create marker"
          className="z-50 inline-flex size-4 items-center justify-center rounded-full bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={handleClick}
          type="button"
        >
          <PlusIcon className="size-3 text-muted-foreground" />
        </button>
        <div className="whitespace-nowrap rounded-full border border-border/50 bg-background/90 px-2 py-1 font-mono text-xs text-foreground backdrop-blur-lg">
          {formatDate(date, "MMM dd, yyyy")}
        </div>
      </div>
    </div>
  );
};

export type GanttFeatureDragHelperProps = {
  featureId: GanttFeature["id"];
  direction: "left" | "right";
  date: Date | null;
};

export const GanttFeatureDragHelper: FC<GanttFeatureDragHelperProps> = ({
  direction,
  featureId,
  date,
}) => {
  const [, setDragging] = useGanttDragging();
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `feature-drag-helper-${featureId}`,
  });

  const isPressed = Boolean(attributes["aria-pressed"]);

  useEffect(() => setDragging(isPressed), [isPressed, setDragging]);

  return (
    <div
      data-slot="gantt-feature-drag-helper"
      className={cn(
        "group -translate-y-1/2 !cursor-col-resize absolute top-1/2 z-[3] h-full w-6 rounded-md outline-none",
        direction === "left" ? "-left-2.5" : "-right-2.5"
      )}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <div
        className={cn(
          "-translate-y-1/2 absolute top-1/2 h-[80%] w-1 rounded-sm bg-muted-foreground opacity-0 transition-all",
          direction === "left" ? "left-2.5" : "right-2.5",
          direction === "left" ? "group-hover:left-0" : "group-hover:right-0",
          isPressed && (direction === "left" ? "left-0" : "right-0"),
          "group-hover:opacity-100",
          isPressed && "opacity-100"
        )}
      />
      {date && (
        <div
          className={cn(
            "-translate-x-1/2 absolute top-10 hidden whitespace-nowrap rounded-lg border border-border/50 bg-background/90 px-2 py-1 font-mono text-xs text-foreground backdrop-blur-lg group-hover:block",
            isPressed && "block"
          )}
        >
          {format(date, "MMM dd, yyyy")}
        </div>
      )}
    </div>
  );
};

export type GanttFeatureItemCardProps = Pick<GanttFeature, "id"> & {
  children?: ReactNode;
};

export const GanttFeatureItemCard: FC<GanttFeatureItemCardProps> = ({
  id,
  children,
}) => {
  const [, setDragging] = useGanttDragging();
  const { attributes, listeners, setNodeRef } = useDraggable({ id });
  const isPressed = Boolean(attributes["aria-pressed"]);

  useEffect(() => setDragging(isPressed), [isPressed, setDragging]);

  return (
    <Card
      data-slot="gantt-feature-item-card"
      className="h-full w-full gap-0 rounded-md bg-background p-2 py-0 text-xs"
    >
      <div
        className={cn(
          "flex h-full w-full items-center justify-between gap-2 text-left",
          isPressed && "cursor-grabbing"
        )}
        {...attributes}
        {...listeners}
        ref={setNodeRef}
      >
        {children}
      </div>
    </Card>
  );
};

export type GanttFeatureItemProps = GanttFeature & {
  onMove?: (id: string, startDate: Date, endDate: Date | null) => void;
  children?: ReactNode;
  className?: string;
};

export const GanttFeatureItem: FC<GanttFeatureItemProps> = ({
  onMove,
  children,
  className,
  ...feature
}) => {
  const [scrollX] = useGanttScrollX();
  const gantt = useContext(GanttContext);
  const timelineStartDate = useMemo(
    () => new Date(gantt.timelineData.at(0)?.year ?? 0, 0, 1),
    [gantt.timelineData]
  );
  const [startAt, setStartAt] = useState<Date>(feature.startAt);
  const [endAt, setEndAt] = useState<Date | null>(feature.endAt);

  // Memoize expensive calculations
  const width = useMemo(
    () => getWidth(startAt, endAt, gantt),
    [startAt, endAt, gantt]
  );
  const offset = useMemo(
    () => getOffset(startAt, timelineStartDate, gantt),
    [startAt, timelineStartDate, gantt]
  );

  const addRange = useMemo(() => getAddRange(gantt.range), [gantt.range]);
  const [mousePosition] = useMouse<HTMLDivElement>();

  const [previousMouseX, setPreviousMouseX] = useState(0);
  const [previousStartAt, setPreviousStartAt] = useState(startAt);
  const [previousEndAt, setPreviousEndAt] = useState(endAt);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const handleItemDragStart = useCallback(() => {
    setPreviousMouseX(mousePosition.x);
    setPreviousStartAt(startAt);
    setPreviousEndAt(endAt);
  }, [mousePosition.x, startAt, endAt]);

  const handleItemDragMove = useCallback(() => {
    const currentDate = getDateByMousePosition(gantt, mousePosition.x);
    const originalDate = getDateByMousePosition(gantt, previousMouseX);
    const delta =
      gantt.range === "daily"
        ? getDifferenceIn(gantt.range)(currentDate, originalDate)
        : getInnerDifferenceIn(gantt.range)(currentDate, originalDate);
    const newStartDate = addDays(previousStartAt, delta);
    const newEndDate = previousEndAt ? addDays(previousEndAt, delta) : null;

    setStartAt(newStartDate);
    setEndAt(newEndDate);
  }, [gantt, mousePosition.x, previousMouseX, previousStartAt, previousEndAt]);

  const onDragEnd = useCallback(
    () => onMove?.(feature.id, startAt, endAt),
    [onMove, feature.id, startAt, endAt]
  );

  const handleLeftDragMove = useCallback(() => {
    const ganttRect = gantt.ref?.current?.getBoundingClientRect();
    const x =
      mousePosition.x - (ganttRect?.left ?? 0) + scrollX - gantt.sidebarWidth;
    const newStartAt = getDateByMousePosition(gantt, x);

    setStartAt(newStartAt);
  }, [gantt, mousePosition.x, scrollX]);

  const handleRightDragMove = useCallback(() => {
    const ganttRect = gantt.ref?.current?.getBoundingClientRect();
    const x =
      mousePosition.x - (ganttRect?.left ?? 0) + scrollX - gantt.sidebarWidth;
    const newEndAt = getDateByMousePosition(gantt, x);

    setEndAt(newEndAt);
  }, [gantt, mousePosition.x, scrollX]);

  return (
    <div
      data-slot="gantt-feature-item"
      className={cn("relative flex w-max min-w-full py-0.5", className)}
      style={{ height: "var(--gantt-row-height)" }}
    >
      <div
        className="pointer-events-auto absolute top-0.5"
        style={{
          height: "calc(var(--gantt-row-height) - 4px)",
          width: Math.round(width),
          left: Math.round(offset),
        }}
      >
        {onMove && (
          <DndContext
            modifiers={[restrictToHorizontalAxis]}
            onDragEnd={onDragEnd}
            onDragMove={handleLeftDragMove}
            sensors={[mouseSensor]}
          >
            <GanttFeatureDragHelper
              date={startAt}
              direction="left"
              featureId={feature.id}
            />
          </DndContext>
        )}
        <DndContext
          modifiers={[restrictToHorizontalAxis]}
          onDragEnd={onDragEnd}
          onDragMove={handleItemDragMove}
          onDragStart={handleItemDragStart}
          sensors={[mouseSensor]}
        >
          <GanttFeatureItemCard id={feature.id}>
            {children ?? (
              <p className="flex-1 truncate text-xs">{feature.name}</p>
            )}
          </GanttFeatureItemCard>
        </DndContext>
        {onMove && (
          <DndContext
            modifiers={[restrictToHorizontalAxis]}
            onDragEnd={onDragEnd}
            onDragMove={handleRightDragMove}
            sensors={[mouseSensor]}
          >
            <GanttFeatureDragHelper
              date={endAt ?? addRange(startAt, 2)}
              direction="right"
              featureId={feature.id}
            />
          </DndContext>
        )}
      </div>
    </div>
  );
};

export type GanttFeatureListGroupProps = {
  children: ReactNode;
  className?: string;
};

export const GanttFeatureListGroup: FC<GanttFeatureListGroupProps> = ({
  children,
  className,
}) => (
  <div
    data-slot="gantt-feature-list-group"
    className={className}
    style={{ paddingTop: "var(--gantt-row-height)" }}
  >
    {children}
  </div>
);

export type GanttFeatureRowProps = {
  features: GanttFeature[];
  onMove?: (id: string, startAt: Date, endAt: Date | null) => void;
  children?: (feature: GanttFeature) => ReactNode;
  className?: string;
};

export const GanttFeatureRow: FC<GanttFeatureRowProps> = ({
  features,
  onMove,
  children,
  className,
}) => {
  // Sort features by start date to handle potential overlaps
  const sortedFeatures = [...features].sort(
    (a, b) => a.startAt.getTime() - b.startAt.getTime()
  );

  // Calculate sub-row positions for overlapping features using a proper algorithm
  const featureWithPositions = [];
  const subRowEndTimes: Date[] = []; // Track when each sub-row becomes free

  for (const feature of sortedFeatures) {
    let subRow = 0;

    // Find the first sub-row that's free (doesn't overlap)
    while (
      subRow < subRowEndTimes.length &&
      subRowEndTimes[subRow] > feature.startAt
    ) {
      subRow++;
    }

    // Update the end time for this sub-row
    if (subRow === subRowEndTimes.length) {
      subRowEndTimes.push(feature.endAt);
    } else {
      subRowEndTimes[subRow] = feature.endAt;
    }

    featureWithPositions.push({ ...feature, subRow });
  }

  const maxSubRows = Math.max(1, subRowEndTimes.length);
  const subRowHeight = 36; // Base row height

  return (
    <div
      data-slot="gantt-feature-row"
      className={cn("relative", className)}
      style={{
        height: `${maxSubRows * subRowHeight}px`,
        minHeight: "var(--gantt-row-height)",
      }}
    >
      {featureWithPositions.map((feature) => (
        <div
          className="absolute w-full"
          key={feature.id}
          style={{
            top: `${feature.subRow * subRowHeight}px`,
            height: `${subRowHeight}px`,
          }}
        >
          <GanttFeatureItem {...feature} onMove={onMove}>
            {children ? (
              children(feature)
            ) : (
              <p className="flex-1 truncate text-xs">{feature.name}</p>
            )}
          </GanttFeatureItem>
        </div>
      ))}
    </div>
  );
};

export type GanttFeatureListProps = {
  className?: string;
  children: ReactNode;
};

export const GanttFeatureList: FC<GanttFeatureListProps> = ({
  className,
  children,
}) => (
  <div
    data-slot="gantt-feature-list"
    className={cn("absolute top-0 left-0 h-full w-max space-y-4", className)}
    style={{ marginTop: "var(--gantt-header-height)" }}
  >
    {children}
  </div>
);

export const GanttMarker: FC<
  GanttMarkerProps & {
    onRemove?: (id: string) => void;
    className?: string;
  }
> = memo(({ label, date, id, onRemove, className }) => {
  const gantt = useContext(GanttContext);
  const differenceIn = useMemo(
    () => getDifferenceIn(gantt.range),
    [gantt.range]
  );
  const timelineStartDate = useMemo(
    () => new Date(gantt.timelineData.at(0)?.year ?? 0, 0, 1),
    [gantt.timelineData]
  );

  // Memoize expensive calculations
  const offset = useMemo(
    () => differenceIn(date, timelineStartDate),
    [differenceIn, date, timelineStartDate]
  );
  const innerOffset = useMemo(
    () =>
      calculateInnerOffset(
        date,
        gantt.range,
        (gantt.columnWidth * gantt.zoom) / 100
      ),
    [date, gantt.range, gantt.columnWidth, gantt.zoom]
  );

  const handleRemove = useCallback(() => onRemove?.(id), [onRemove, id]);

  return (
    <div
      data-slot="gantt-marker"
      className="pointer-events-none absolute top-0 left-0 z-20 flex h-full select-none flex-col items-center justify-center overflow-visible"
      style={{
        width: 0,
        transform: `translateX(calc(var(--gantt-column-width) * ${offset} + ${innerOffset}px))`,
      }}
    >
      <ContextMenu>
        <ContextMenuTrigger
          render={
            <div
              className={cn(
                "group pointer-events-auto sticky top-0 flex select-auto flex-col flex-nowrap items-center justify-center whitespace-nowrap rounded-b-md bg-brand-muted px-2 py-1 text-xs text-foreground",
                className
              )}
            >
              {label}
              <span className="max-h-0 overflow-hidden font-mono opacity-80 transition-all group-hover:max-h-8">
                {formatDate(date, "MMM dd, yyyy")}
              </span>
            </div>
          }
        />
        <ContextMenuContent>
          {onRemove ? (
            <ContextMenuItem
              variant="destructive"
              className="flex items-center gap-2"
              onClick={handleRemove}
            >
              <TrashIcon className="size-4" />
              Remove marker
            </ContextMenuItem>
          ) : null}
        </ContextMenuContent>
      </ContextMenu>
      <div className={cn("h-full w-px bg-brand", className)} />
    </div>
  );
});

GanttMarker.displayName = "GanttMarker";

export type GanttProviderProps = {
  range?: Range;
  zoom?: number;
  onAddItem?: (date: Date) => void;
  children: ReactNode;
  className?: string;
};

export const GanttProvider: FC<GanttProviderProps> = ({
  zoom = 100,
  range = "monthly",
  onAddItem,
  children,
  className,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [timelineData, setTimelineData] = useState<TimelineData>(
    createInitialTimelineData(new Date())
  );
  const [, setScrollX] = useGanttScrollX();
  const [sidebarWidth, setSidebarWidth] = useState(0);

  const headerHeight = 60;
  const rowHeight = 36;
  let columnWidth = 50;

  if (range === "monthly") {
    columnWidth = 150;
  } else if (range === "quarterly") {
    columnWidth = 100;
  }

  // Memoize CSS variables to prevent unnecessary re-renders
  const cssVariables = useMemo(
    () =>
      ({
        "--gantt-zoom": `${zoom}`,
        "--gantt-column-width": `${(zoom / 100) * columnWidth}px`,
        "--gantt-header-height": `${headerHeight}px`,
        "--gantt-row-height": `${rowHeight}px`,
        "--gantt-sidebar-width": `${sidebarWidth}px`,
      }) as CSSProperties,
    [zoom, columnWidth, sidebarWidth]
  );

  // Center the viewport on "today" once the sidebar (and therefore the grid)
  // has been measured — otherwise scrollWidth isn't final on mount and the
  // timeline lands at its far-left edge (years away from the data). Re-centers
  // when the range/zoom variant changes, but not on user scroll or the
  // infinite-scroll timelineData growth (guarded by `centeredKey`).
  const centeredKey = useRef<string | null>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || sidebarWidth === 0) {
      return;
    }
    const key = `${range}:${zoom}`;
    if (centeredKey.current === key) {
      return;
    }
    const id = requestAnimationFrame(() => {
      // Nothing to center until the viewport has a measured width (e.g. jsdom).
      if (el.clientWidth === 0) {
        return;
      }
      const timelineStartDate = new Date(timelineData[0].year, 0, 1);
      const todayOffset = getOffset(new Date(), timelineStartDate, {
        zoom,
        range,
        columnWidth,
        sidebarWidth,
        headerHeight,
        rowHeight,
        onAddItem,
        placeholderLength: 2,
        timelineData,
        ref: scrollRef,
      });
      el.scrollLeft = Math.max(0, todayOffset - (el.clientWidth - sidebarWidth) / 2);
      setScrollX(el.scrollLeft);
      centeredKey.current = key;
    });
    return () => cancelAnimationFrame(id);
  }, [
    sidebarWidth,
    range,
    zoom,
    columnWidth,
    timelineData,
    onAddItem,
    setScrollX,
  ]);

  // Update sidebar width when DOM is ready
  useEffect(() => {
    const updateSidebarWidth = () => {
      const sidebarElement = scrollRef.current?.querySelector(
        '[data-roadmap-ui="gantt-sidebar"]'
      );
      const newWidth = sidebarElement ? 300 : 0;
      setSidebarWidth(newWidth);
    };

    // Update immediately
    updateSidebarWidth();

    // Also update on resize or when children change
    const observer = new MutationObserver(updateSidebarWidth);
    if (scrollRef.current) {
      observer.observe(scrollRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Fix the useCallback to include all dependencies
  const handleScroll = useCallback(
    throttle(() => {
      const scrollElement = scrollRef.current;
      if (!scrollElement) {
        return;
      }

      const { scrollLeft, scrollWidth, clientWidth } = scrollElement;
      setScrollX(scrollLeft);

      if (scrollLeft === 0) {
        // Extend timelineData to the past
        const firstYear = timelineData[0]?.year;

        if (!firstYear) {
          return;
        }

        const newTimelineData: TimelineData = [...timelineData];
        newTimelineData.unshift({
          year: firstYear - 1,
          quarters: new Array(4).fill(null).map((_, quarterIndex) => ({
            months: new Array(3).fill(null).map((_, monthIndex) => {
              const month = quarterIndex * 3 + monthIndex;
              return {
                days: getDaysInMonth(new Date(firstYear, month, 1)),
              };
            }),
          })),
        });

        setTimelineData(newTimelineData);

        // Scroll a bit forward so it's not at the very start
        scrollElement.scrollLeft = scrollElement.clientWidth;
        setScrollX(scrollElement.scrollLeft);
      } else if (scrollLeft + clientWidth >= scrollWidth) {
        // Extend timelineData to the future
        const lastYear = timelineData.at(-1)?.year;

        if (!lastYear) {
          return;
        }

        const newTimelineData: TimelineData = [...timelineData];
        newTimelineData.push({
          year: lastYear + 1,
          quarters: new Array(4).fill(null).map((_, quarterIndex) => ({
            months: new Array(3).fill(null).map((_, monthIndex) => {
              const month = quarterIndex * 3 + monthIndex;
              return {
                days: getDaysInMonth(new Date(lastYear, month, 1)),
              };
            }),
          })),
        });

        setTimelineData(newTimelineData);

        // Scroll a bit back so it's not at the very end
        scrollElement.scrollLeft =
          scrollElement.scrollWidth - scrollElement.clientWidth;
        setScrollX(scrollElement.scrollLeft);
      }
    }, 100),
    []
  );

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      // Fix memory leak by properly referencing the scroll element
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  const scrollToFeature = useCallback(
    (feature: GanttFeature) => {
      const scrollElement = scrollRef.current;
      if (!scrollElement) {
        return;
      }

      // Calculate timeline start date from timelineData
      const timelineStartDate = new Date(timelineData[0].year, 0, 1);

      // Calculate the horizontal offset for the feature's start date
      const offset = getOffset(feature.startAt, timelineStartDate, {
        zoom,
        range,
        columnWidth,
        sidebarWidth,
        headerHeight,
        rowHeight,
        onAddItem,
        placeholderLength: 2,
        timelineData,
        ref: scrollRef,
      });

      // Scroll to align the feature's start with the right side of the sidebar
      const targetScrollLeft = Math.max(0, offset);

      scrollElement.scrollTo({
        left: targetScrollLeft,
        behavior: "smooth",
      });
    },
    [timelineData, zoom, range, columnWidth, sidebarWidth, onAddItem]
  );

  return (
    <GanttContext.Provider
      value={{
        zoom,
        range,
        headerHeight,
        columnWidth,
        sidebarWidth,
        rowHeight,
        onAddItem,
        timelineData,
        placeholderLength: 2,
        ref: scrollRef,
        scrollToFeature,
      }}
    >
      <div
        data-slot="gantt"
        className={cn(
          "gantt relative isolate grid h-full w-full flex-none select-none overflow-auto rounded-sm bg-secondary",
          range,
          className
        )}
        ref={scrollRef}
        style={{
          ...cssVariables,
          gridTemplateColumns: "var(--gantt-sidebar-width) 1fr",
        }}
      >
        {children}
      </div>
    </GanttContext.Provider>
  );
};

export type GanttTimelineProps = {
  children: ReactNode;
  className?: string;
};

export const GanttTimeline: FC<GanttTimelineProps> = ({
  children,
  className,
}) => (
  <div
    data-slot="gantt-timeline"
    className={cn(
      "relative flex h-full w-max flex-none overflow-clip",
      className
    )}
  >
    {children}
  </div>
);

export type GanttTodayProps = {
  className?: string;
};

export const GanttToday: FC<GanttTodayProps> = ({ className }) => {
  const label = "Today";
  const date = useMemo(() => new Date(), []);
  const gantt = useContext(GanttContext);
  const differenceIn = useMemo(
    () => getDifferenceIn(gantt.range),
    [gantt.range]
  );
  const timelineStartDate = useMemo(
    () => new Date(gantt.timelineData.at(0)?.year ?? 0, 0, 1),
    [gantt.timelineData]
  );

  // Memoize expensive calculations
  const offset = useMemo(
    () => differenceIn(date, timelineStartDate),
    [differenceIn, date, timelineStartDate]
  );
  const innerOffset = useMemo(
    () =>
      calculateInnerOffset(
        date,
        gantt.range,
        (gantt.columnWidth * gantt.zoom) / 100
      ),
    [date, gantt.range, gantt.columnWidth, gantt.zoom]
  );

  return (
    <div
      data-slot="gantt-today"
      className="pointer-events-none absolute top-0 left-0 z-20 flex h-full select-none flex-col items-center justify-center overflow-visible"
      style={{
        width: 0,
        transform: `translateX(calc(var(--gantt-column-width) * ${offset} + ${innerOffset}px))`,
      }}
    >
      <div
        className={cn(
          "group pointer-events-auto sticky top-0 flex select-auto flex-col flex-nowrap items-center justify-center whitespace-nowrap rounded-b-md bg-brand-muted px-2 py-1 text-xs text-foreground",
          className
        )}
      >
        {label}
        <span className="max-h-0 overflow-hidden font-mono opacity-80 transition-all group-hover:max-h-8">
          {formatDate(date, "MMM dd, yyyy")}
        </span>
      </div>
      <div className={cn("h-full w-px bg-brand", className)} />
    </div>
  );
};
