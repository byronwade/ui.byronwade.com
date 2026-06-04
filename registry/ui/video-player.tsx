/**
 * Adapted for byronwade/ui from kibo-ui.
 * Original code, concept, and design © kibo-ui — https://www.kibo-ui.com
 * Reworked to the byronwade/ui design system (token-mapped media-chrome,
 * data-slot) and expanded with cva variants.
 */
"use client";

import {
  MediaControlBar,
  MediaController,
  MediaMuteButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaTimeDisplay,
  MediaTimeRange,
  MediaVolumeRange,
} from "media-chrome/react";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import type { ComponentProps, CSSProperties } from "react";

import { cn } from "@/lib/utils";

/**
 * media-chrome controls are themed entirely through CSS variables. We map every
 * one of them to a byronwade semantic token so the player re-skins for free with
 * the rest of the system (and inherits dark mode). The accent (range progress,
 * focus) resolves to `--brand`; nothing is pinned to a literal color.
 */
const mediaVariables = {
  "--media-primary-color": "var(--foreground)",
  "--media-secondary-color": "var(--muted)",
  "--media-text-color": "var(--foreground)",
  "--media-background-color": "var(--background)",
  "--media-control-background": "transparent",
  "--media-control-hover-background": "var(--accent)",
  "--media-font-family": "var(--font-sans)",
  "--media-font-weight": "400",
  "--media-live-button-icon-color": "var(--muted-foreground)",
  "--media-live-button-indicator-color": "var(--brand)",
  "--media-range-track-background": "var(--border)",
  "--media-range-bar-color": "var(--brand)",
  "--media-range-thumb-background": "var(--brand)",
  "--media-time-range-buffered-color": "var(--muted-foreground)",
} as CSSProperties;

const videoPlayerVariants = cva(
  "group/video-player relative isolate w-full overflow-hidden bg-card text-foreground outline-none [&_video]:w-full [&_video]:object-cover focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default: "rounded-lg border border-border shadow-sm",
        minimal: "rounded-md border border-border/60",
        theater:
          "mx-auto w-full max-w-4xl rounded-xl border border-border bg-background shadow-lg [&_media-control-bar]:px-2 [&_media-control-bar]:py-1",
        poster: "rounded-lg border border-border shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type VideoPlayerVariant = NonNullable<
  VariantProps<typeof videoPlayerVariants>["variant"]
>;

const VideoPlayerVariantContext =
  React.createContext<VideoPlayerVariant>("default");

/** Read the current player variant from any descendant part. */
export const useVideoPlayerVariant = () =>
  React.useContext(VideoPlayerVariantContext);

export type VideoPlayerProps = ComponentProps<typeof MediaController> &
  VariantProps<typeof videoPlayerVariants>;

export const VideoPlayer = ({
  className,
  style,
  variant,
  ...props
}: VideoPlayerProps) => {
  const resolvedVariant: VideoPlayerVariant = variant ?? "default";
  return (
    <VideoPlayerVariantContext.Provider value={resolvedVariant}>
      <MediaController
        data-slot="video-player"
        data-variant={resolvedVariant}
        className={cn(videoPlayerVariants({ variant: resolvedVariant }), className)}
        style={{ ...mediaVariables, ...style }}
        {...props}
      />
    </VideoPlayerVariantContext.Provider>
  );
};

const controlBarVariants = cva(
  "flex w-full items-center gap-0.5 bg-background/80 backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "",
        minimal: "gap-1 bg-transparent backdrop-blur-none",
        theater: "gap-1 px-1",
        poster: "",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export type VideoPlayerControlBarProps = ComponentProps<
  typeof MediaControlBar
>;

export const VideoPlayerControlBar = ({
  className,
  ...props
}: VideoPlayerControlBarProps) => {
  const variant = useVideoPlayerVariant();
  return (
    <MediaControlBar
      data-slot="video-player-control-bar"
      className={cn(controlBarVariants({ variant }), className)}
      {...props}
    />
  );
};

export type VideoPlayerTimeRangeProps = ComponentProps<typeof MediaTimeRange>;

export const VideoPlayerTimeRange = ({
  className,
  ...props
}: VideoPlayerTimeRangeProps) => (
  <MediaTimeRange
    data-slot="video-player-time-range"
    className={cn("flex-1 p-2.5", className)}
    {...props}
  />
);

export type VideoPlayerTimeDisplayProps = ComponentProps<
  typeof MediaTimeDisplay
>;

export const VideoPlayerTimeDisplay = ({
  className,
  ...props
}: VideoPlayerTimeDisplayProps) => (
  <MediaTimeDisplay
    data-slot="video-player-time-display"
    className={cn("p-2.5 font-mono text-sm tabular-nums", className)}
    {...props}
  />
);

export type VideoPlayerVolumeRangeProps = ComponentProps<
  typeof MediaVolumeRange
>;

export const VideoPlayerVolumeRange = ({
  className,
  ...props
}: VideoPlayerVolumeRangeProps) => (
  <MediaVolumeRange
    data-slot="video-player-volume-range"
    className={cn("p-2.5", className)}
    {...props}
  />
);

export type VideoPlayerPlayButtonProps = ComponentProps<typeof MediaPlayButton>;

export const VideoPlayerPlayButton = ({
  className,
  ...props
}: VideoPlayerPlayButtonProps) => (
  <MediaPlayButton
    data-slot="video-player-play-button"
    className={cn("p-2.5", className)}
    {...props}
  />
);

export type VideoPlayerSeekBackwardButtonProps = ComponentProps<
  typeof MediaSeekBackwardButton
>;

export const VideoPlayerSeekBackwardButton = ({
  className,
  ...props
}: VideoPlayerSeekBackwardButtonProps) => (
  <MediaSeekBackwardButton
    data-slot="video-player-seek-backward-button"
    className={cn("p-2.5", className)}
    {...props}
  />
);

export type VideoPlayerSeekForwardButtonProps = ComponentProps<
  typeof MediaSeekForwardButton
>;

export const VideoPlayerSeekForwardButton = ({
  className,
  ...props
}: VideoPlayerSeekForwardButtonProps) => (
  <MediaSeekForwardButton
    data-slot="video-player-seek-forward-button"
    className={cn("p-2.5", className)}
    {...props}
  />
);

export type VideoPlayerMuteButtonProps = ComponentProps<typeof MediaMuteButton>;

export const VideoPlayerMuteButton = ({
  className,
  ...props
}: VideoPlayerMuteButtonProps) => (
  <MediaMuteButton
    data-slot="video-player-mute-button"
    className={cn("p-2.5", className)}
    {...props}
  />
);

export type VideoPlayerContentProps = ComponentProps<"video">;

export const VideoPlayerContent = ({
  className,
  ...props
}: VideoPlayerContentProps) => (
  <video
    data-slot="video-player-content"
    className={cn("mt-0 mb-0", className)}
    {...props}
  />
);

export type VideoPlayerPosterProps = ComponentProps<"button"> & {
  /** Poster image shown until the viewer presses play. */
  src?: string;
  /** Alt text for the poster image. */
  alt?: string;
};

/**
 * Big centered play affordance for the `poster` variant. Renders an overlay
 * (optional image + brand play button) and hides itself once activated, handing
 * playback to the underlying `<video>`. Pair with `variant="poster"`.
 */
export const VideoPlayerPoster = ({
  src,
  alt = "",
  className,
  onClick,
  children,
  ...props
}: VideoPlayerPosterProps) => {
  const [played, setPlayed] = React.useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    setPlayed(true);
    const root = event.currentTarget.closest(
      '[data-slot="video-player"]',
    );
    const video = root?.querySelector("video");
    video?.play?.();
  };

  if (played) {
    return null;
  }

  return (
    <button
      type="button"
      data-slot="video-player-poster"
      aria-label="Play video"
      className={cn(
        "absolute inset-0 z-10 flex items-center justify-center bg-background/40 outline-none transition-colors hover:bg-background/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          data-slot="video-player-poster-image"
          className="absolute inset-0 -z-10 size-full object-cover"
        />
      ) : null}
      {children ?? (
        <span
          aria-hidden
          data-slot="video-player-poster-button"
          className="flex size-16 items-center justify-center rounded-full bg-brand text-primary-foreground shadow-lg transition-transform group-hover/video-player:scale-105"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 size-7">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      )}
    </button>
  );
};

export { videoPlayerVariants };
