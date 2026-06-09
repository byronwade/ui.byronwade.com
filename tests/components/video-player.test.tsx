/**
 * Tests for <VideoPlayer /> parts (components/ui/video-player.tsx). media-chrome
 * custom elements register as unknown elements in jsdom (no real playback), so
 * we assert DOM structure, data-slots, the cva variant classes, the token CSS
 * variables on the wrapper, the poster overlay state machine, and a11y.
 */

import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";

import {
  MediaPlayer,
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControlBar,
  VideoPlayerMuteButton,
  VideoPlayerPlayButton,
  VideoPlayerPoster,
  VideoPlayerSeekBackwardButton,
  VideoPlayerSeekForwardButton,
  VideoPlayerTimeDisplay,
  VideoPlayerTimeRange,
  VideoPlayerVolumeRange,
  videoPlayerVariants,
} from "@/components/ui/video-player";

// jsdom does not implement media playback.
beforeAll(() => {
  HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  HTMLMediaElement.prototype.pause = vi.fn();
});

function FullPlayer(
  props: React.ComponentProps<typeof VideoPlayer> = {},
) {
  return (
    <VideoPlayer {...props}>
      <VideoPlayerContent slot="media" src="/video.mp4" />
      <VideoPlayerControlBar>
        <VideoPlayerPlayButton />
        <VideoPlayerSeekBackwardButton />
        <VideoPlayerSeekForwardButton />
        <VideoPlayerTimeRange />
        <VideoPlayerTimeDisplay />
        <VideoPlayerMuteButton />
        <VideoPlayerVolumeRange />
      </VideoPlayerControlBar>
    </VideoPlayer>
  );
}

describe("VideoPlayer — structure", () => {
  it("mounts every part with its data-slot", () => {
    const { container } = render(<FullPlayer />);
    const slots = [
      "video-player",
      "video-player-control-bar",
      "video-player-play-button",
      "video-player-seek-backward-button",
      "video-player-seek-forward-button",
      "video-player-time-range",
      "video-player-time-display",
      "video-player-mute-button",
      "video-player-volume-range",
      "video-player-content",
    ];
    for (const slot of slots) {
      expect(
        container.querySelector(`[data-slot="${slot}"]`),
        `missing [data-slot="${slot}"]`,
      ).not.toBeNull();
    }
  });

  it("maps media-chrome controls to byronwade tokens (no raw color)", () => {
    const { container } = render(<FullPlayer />);
    const root = container.querySelector(
      '[data-slot="video-player"]',
    ) as HTMLElement;
    const style = root.getAttribute("style") ?? "";
    expect(style).toContain("--media-primary-color: var(--foreground)");
    expect(style).toContain("--media-background-color: var(--background)");
    expect(style).toContain("--media-range-bar-color: var(--brand)");
    // No literal colors leak into the wrapper.
    expect(style).not.toMatch(/#[0-9a-f]{3,6}|rgb\(|hsl\(/i);
  });

  it("merges a caller style without dropping the token variables", () => {
    const { container } = render(
      <VideoPlayer style={{ opacity: 0.5 }}>
        <VideoPlayerContent slot="media" src="/v.mp4" />
      </VideoPlayer>,
    );
    const root = container.querySelector(
      '[data-slot="video-player"]',
    ) as HTMLElement;
    const style = root.getAttribute("style") ?? "";
    expect(style).toContain("--media-primary-color");
    expect(style).toContain("opacity: 0.5");
  });

  it("passes className through on the wrapper and parts", () => {
    const { container } = render(
      <VideoPlayer className="ring-test">
        <VideoPlayerContent slot="media" className="content-test" src="/v.mp4" />
        <VideoPlayerControlBar className="bar-test">
          <VideoPlayerPlayButton className="play-test" />
          <VideoPlayerSeekBackwardButton className="back-test" />
          <VideoPlayerSeekForwardButton className="fwd-test" />
          <VideoPlayerTimeRange className="range-test" />
          <VideoPlayerTimeDisplay className="time-test" />
          <VideoPlayerMuteButton className="mute-test" />
          <VideoPlayerVolumeRange className="vol-test" />
        </VideoPlayerControlBar>
      </VideoPlayer>,
    );
    for (const cls of [
      "ring-test",
      "content-test",
      "bar-test",
      "play-test",
      "back-test",
      "fwd-test",
      "range-test",
      "time-test",
      "mute-test",
      "vol-test",
    ]) {
      expect(container.querySelector(`.${cls}`), `missing .${cls}`).not.toBeNull();
    }
  });

  it("time display uses a mono token for data", () => {
    const { container } = render(<FullPlayer />);
    const time = container.querySelector(
      '[data-slot="video-player-time-display"]',
    );
    expect(time).toHaveClass("font-mono");
  });
});

describe("VideoPlayer — variants", () => {
  it("defaults to the default variant when no variant prop is given", () => {
    const { container } = render(<FullPlayer />);
    const root = container.querySelector('[data-slot="video-player"]');
    expect(root).toHaveAttribute("data-variant", "default");
    expect(root).toHaveClass("edge", "rounded-lg");
  });

  it.each([
    ["minimal", "rounded-md"],
    ["theater", "max-w-4xl"],
    ["poster", "rounded-lg"],
  ] as const)("applies the %s variant class", (variant, expected) => {
    const { container } = render(<FullPlayer variant={variant} />);
    const root = container.querySelector('[data-slot="video-player"]');
    expect(root).toHaveAttribute("data-variant", variant);
    expect(root).toHaveClass(expected);
  });

  it("propagates the variant to the control bar via context", () => {
    const { container } = render(<FullPlayer variant="theater" />);
    const bar = container.querySelector(
      '[data-slot="video-player-control-bar"]',
    );
    // theater control bar gets gap-1 / px-1
    expect(bar?.className).toContain("px-1");
  });

  it("falls back to default when variant is explicitly undefined", () => {
    const { container } = render(<FullPlayer variant={undefined} />);
    const root = container.querySelector('[data-slot="video-player"]');
    expect(root).toHaveAttribute("data-variant", "default");
    expect(root).toHaveClass("rounded-lg");
  });

  it("videoPlayerVariants() is exported and produces a string", () => {
    expect(typeof videoPlayerVariants({ variant: "minimal" })).toBe("string");
  });
});

describe("VideoPlayer — poster overlay", () => {
  it("renders a default brand play button when no children/src", () => {
    const { container } = render(
      <VideoPlayer variant="poster">
        <VideoPlayerContent slot="media" src="/v.mp4" />
        <VideoPlayerPoster />
      </VideoPlayer>,
    );
    const poster = screen.getByRole("button", { name: /play video/i });
    expect(poster).toHaveAttribute("data-slot", "video-player-poster");
    expect(
      container.querySelector('[data-slot="video-player-poster-button"]'),
    ).not.toBeNull();
  });

  it("renders a poster image when src is provided", () => {
    const { container } = render(
      <VideoPlayer variant="poster">
        <VideoPlayerContent slot="media" src="/v.mp4" />
        <VideoPlayerPoster src="/poster.jpg" alt="A frame" />
      </VideoPlayer>,
    );
    const img = container.querySelector(
      '[data-slot="video-player-poster-image"]',
    ) as HTMLImageElement;
    expect(img).not.toBeNull();
    expect(img.getAttribute("src")).toBe("/poster.jpg");
    expect(img).toHaveAttribute("alt", "A frame");
  });

  it("renders custom poster children instead of the default button", () => {
    render(
      <VideoPlayer variant="poster">
        <VideoPlayerContent slot="media" src="/v.mp4" />
        <VideoPlayerPoster>
          <span>Watch now</span>
        </VideoPlayerPoster>
      </VideoPlayer>,
    );
    expect(screen.getByText("Watch now")).toBeInTheDocument();
  });

  it("hides itself, fires onClick, and plays the video when pressed", () => {
    const onClick = vi.fn();
    const { container } = render(
      <VideoPlayer variant="poster">
        <VideoPlayerContent slot="media" src="/v.mp4" />
        <VideoPlayerPoster onClick={onClick} />
      </VideoPlayer>,
    );
    const poster = screen.getByRole("button", { name: /play video/i });
    fireEvent.click(poster);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
    // Overlay unmounts after activation.
    expect(
      container.querySelector('[data-slot="video-player-poster"]'),
    ).toBeNull();
  });

  it("accepts a custom className on the poster", () => {
    const { container } = render(
      <VideoPlayer variant="poster">
        <VideoPlayerContent slot="media" src="/v.mp4" />
        <VideoPlayerPoster className="poster-cls" />
      </VideoPlayer>,
    );
    expect(container.querySelector(".poster-cls")).not.toBeNull();
  });
});

describe("VideoPlayer — a11y", () => {
  it("has no axe violations (default)", async () => {
    const { container } = render(<FullPlayer />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations (poster)", async () => {
    const { container } = render(
      <VideoPlayer variant="poster">
        <VideoPlayerContent slot="media" src="/v.mp4" />
        <VideoPlayerPoster src="/poster.jpg" alt="Frame" />
      </VideoPlayer>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("MediaPlayer — theater toggle", () => {
  it("flips uncontrolled theater state and notifies onTheaterChange", () => {
    const onTheaterChange = vi.fn();
    render(
      <MediaPlayer
        src="/video.mp4"
        title="Clip"
        onTheaterChange={onTheaterChange}
      />,
    );
    const theaterButton = screen.getByRole("button", { name: "Theater mode" });
    fireEvent.click(theaterButton);
    // toggleTheater() ran the uncontrolled branch (setTheaterInternal) and fired
    // the callback with the next value.
    expect(onTheaterChange).toHaveBeenCalledWith(true);
    expect(
      screen.getByRole("button", { name: "Exit theater mode" }),
    ).toBeInTheDocument();
  });
});
