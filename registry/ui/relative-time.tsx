/**
 * Adapted for byronwade/ui from kibo-ui.
 * Original code, concept, and design © kibo-ui — https://www.kibo-ui.com
 * Reworked to the byronwade/ui design system: token surfaces, `data-slot`
 * hooks, and a small inlined `useControllableState` so it drops the
 * @radix-ui dependency (byronwade primitives build on Base UI).
 */
"use client";

import {
  createContext,
  type HTMLAttributes,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { cn } from "@/lib/utils";

function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: {
  prop?: T;
  defaultProp: T;
  onChange?: (value: T) => void;
}) {
  const [uncontrolled, setUncontrolled] = useState<T>(defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? (prop as T) : uncontrolled;
  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setUncontrolled(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );
  return [value, setValue] as const;
}

const formatDate = (
  date: Date,
  timeZone: string,
  options?: Intl.DateTimeFormatOptions,
) =>
  new Intl.DateTimeFormat("en-US", options ?? { dateStyle: "long", timeZone }).format(date);

const formatTime = (
  date: Date,
  timeZone: string,
  options?: Intl.DateTimeFormatOptions,
) =>
  new Intl.DateTimeFormat(
    "en-US",
    options ?? { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone },
  ).format(date);

type RelativeTimeContextType = {
  time: Date;
  dateFormatOptions?: Intl.DateTimeFormatOptions;
  timeFormatOptions?: Intl.DateTimeFormatOptions;
};

const RelativeTimeContext = createContext<RelativeTimeContextType>({
  time: new Date(0),
  dateFormatOptions: { dateStyle: "long" },
  timeFormatOptions: { hour: "2-digit", minute: "2-digit" },
});

export type RelativeTimeProps = HTMLAttributes<HTMLDivElement> & {
  time?: Date;
  defaultTime?: Date;
  onTimeChange?: (time: Date) => void;
  dateFormatOptions?: Intl.DateTimeFormatOptions;
  timeFormatOptions?: Intl.DateTimeFormatOptions;
};

export const RelativeTime = ({
  time: controlledTime,
  defaultTime,
  onTimeChange,
  dateFormatOptions,
  timeFormatOptions,
  className,
  ...props
}: RelativeTimeProps) => {
  const [time, setTime] = useControllableState<Date>({
    defaultProp: defaultTime ?? new Date(),
    prop: controlledTime,
    onChange: onTimeChange,
  });

  useEffect(() => {
    if (controlledTime) return;
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [setTime, controlledTime]);

  return (
    <RelativeTimeContext.Provider
      value={{ time, dateFormatOptions, timeFormatOptions }}
    >
      <div data-slot="relative-time" className={cn("grid gap-2", className)} {...props} />
    </RelativeTimeContext.Provider>
  );
};

const RelativeTimeZoneContext = createContext<{ zone: string }>({ zone: "UTC" });

export type RelativeTimeZoneProps = HTMLAttributes<HTMLDivElement> & {
  zone: string;
};

export const RelativeTimeZone = ({ zone, className, ...props }: RelativeTimeZoneProps) => (
  <RelativeTimeZoneContext.Provider value={{ zone }}>
    <div
      data-slot="relative-time-zone"
      className={cn("flex items-center justify-between gap-1.5 text-xs", className)}
      {...props}
    />
  </RelativeTimeZoneContext.Provider>
);

export type RelativeTimeZoneDisplayProps = HTMLAttributes<HTMLDivElement>;

export const RelativeTimeZoneDisplay = ({
  className,
  ...props
}: RelativeTimeZoneDisplayProps) => {
  const { time, timeFormatOptions } = useContext(RelativeTimeContext);
  const { zone } = useContext(RelativeTimeZoneContext);
  return (
    <div
      data-slot="relative-time-zone-display"
      className={cn("pl-8 text-muted-foreground tabular-nums", className)}
      {...props}
    >
      {formatTime(time, zone, timeFormatOptions)}
    </div>
  );
};

export type RelativeTimeZoneDateProps = HTMLAttributes<HTMLDivElement>;

export const RelativeTimeZoneDate = ({ className, ...props }: RelativeTimeZoneDateProps) => {
  const { time, dateFormatOptions } = useContext(RelativeTimeContext);
  const { zone } = useContext(RelativeTimeZoneContext);
  return (
    <div data-slot="relative-time-zone-date" className={className} {...props}>
      {formatDate(time, zone, dateFormatOptions)}
    </div>
  );
};

export type RelativeTimeZoneLabelProps = HTMLAttributes<HTMLDivElement>;

export const RelativeTimeZoneLabel = ({ className, ...props }: RelativeTimeZoneLabelProps) => (
  <div
    data-slot="relative-time-zone-label"
    className={cn(
      "flex h-4 items-center justify-center rounded-xs bg-secondary px-1.5 font-mono",
      className,
    )}
    {...props}
  />
);
