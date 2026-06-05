/**
 * Unit tests for the pure video-player helpers (lib/video-player-utils.ts).
 * These carry the "intelligent" logic — resume/memory, keymap, gestures,
 * chapters→VTT, and heatmap math — kept DOM-free so they are exhaustively
 * testable. The component file wires them up.
 */

import {
  formatVttTime,
  chaptersToVtt,
  normalizeHeatmap,
  resumeStorageKey,
  readPlaybackState,
  writePlaybackState,
  clearPlaybackState,
  shouldResume,
  resolveMediaKey,
  resolveGesture,
  shouldSyncAmbient,
  isEditableTarget,
  applyMediaAction,
  PLAYBACK_RATES,
} from "@/lib/video-player-utils";

describe("formatVttTime", () => {
  it("formats zero", () => {
    expect(formatVttTime(0)).toBe("00:00:00.000");
  });
  it("formats minutes and fractional seconds", () => {
    expect(formatVttTime(65.5)).toBe("00:01:05.500");
  });
  it("formats hours", () => {
    expect(formatVttTime(3661)).toBe("01:01:01.000");
  });
  it("clamps negatives to zero", () => {
    expect(formatVttTime(-10)).toBe("00:00:00.000");
  });
});

describe("chaptersToVtt", () => {
  it("returns a bare header for no chapters", () => {
    expect(chaptersToVtt([])).toBe("WEBVTT\n");
  });

  it("serializes cues, ending each at the next chapter start", () => {
    const vtt = chaptersToVtt(
      [
        { startTime: 0, title: "Intro" },
        { startTime: 30, title: "Middle" },
      ],
      90,
    );
    expect(vtt).toBe(
      "WEBVTT\n\n" +
        "00:00:00.000 --> 00:00:30.000\nIntro\n\n" +
        "00:00:30.000 --> 00:01:30.000\nMiddle\n",
    );
  });

  it("sorts chapters by start time before serializing", () => {
    const vtt = chaptersToVtt([
      { startTime: 30, title: "Second" },
      { startTime: 0, title: "First" },
    ]);
    expect(vtt.indexOf("First")).toBeLessThan(vtt.indexOf("Second"));
  });

  it("gives the last chapter a 1s tail when no duration is provided", () => {
    const vtt = chaptersToVtt([{ startTime: 10, title: "Only" }]);
    expect(vtt).toContain("00:00:10.000 --> 00:00:11.000");
  });

  it("guards against a non-increasing end (duration before last start)", () => {
    const vtt = chaptersToVtt([{ startTime: 10, title: "Only" }], 5);
    expect(vtt).toContain("00:00:10.000 --> 00:00:11.000");
  });
});

describe("normalizeHeatmap", () => {
  it("returns an empty array for no values", () => {
    expect(normalizeHeatmap([])).toEqual([]);
  });
  it("scales values relative to the max", () => {
    expect(normalizeHeatmap([1, 2, 4])).toEqual([0.25, 0.5, 1]);
  });
  it("clamps negatives to zero before scaling", () => {
    expect(normalizeHeatmap([-5, 5])).toEqual([0, 1]);
  });
  it("returns all zeros when every value is zero", () => {
    expect(normalizeHeatmap([0, 0])).toEqual([0, 0]);
  });
});

describe("resumeStorageKey", () => {
  it("namespaces the key", () => {
    expect(resumeStorageKey("clip-7")).toBe(
      "byronwade-ui:video-player:clip-7",
    );
  });
});

function memoryStorage(seed: Record<string, string> = {}) {
  const map = new Map(Object.entries(seed));
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
    _map: map,
  };
}

describe("playback state storage", () => {
  it("round-trips a written state", () => {
    const storage = memoryStorage();
    writePlaybackState(storage, "k", { time: 12, volume: 0.5 });
    expect(readPlaybackState(storage, "k")).toEqual({ time: 12, volume: 0.5 });
  });

  it("reads null for a missing key", () => {
    expect(readPlaybackState(memoryStorage(), "nope")).toBeNull();
  });

  it("reads null for malformed JSON", () => {
    expect(readPlaybackState(memoryStorage({ k: "{not json" }), "k")).toBeNull();
  });

  it("reads null when time is not a number", () => {
    expect(
      readPlaybackState(memoryStorage({ k: '{"time":"x"}' }), "k"),
    ).toBeNull();
  });

  it("reads null when storage is absent", () => {
    expect(readPlaybackState(null, "k")).toBeNull();
  });

  it("swallows write errors from a throwing storage", () => {
    const throwing = {
      getItem: () => null,
      setItem: () => {
        throw new Error("quota");
      },
      removeItem: () => {},
    };
    expect(() => writePlaybackState(throwing, "k", { time: 1 })).not.toThrow();
  });

  it("does nothing when writing to absent storage", () => {
    expect(() => writePlaybackState(null, "k", { time: 1 })).not.toThrow();
  });

  it("clears a stored key", () => {
    const storage = memoryStorage({ "byronwade-ui:video-player:k": "x" });
    clearPlaybackState(storage, "byronwade-ui:video-player:k");
    expect(storage._map.has("byronwade-ui:video-player:k")).toBe(false);
  });

  it("swallows clear errors from a throwing storage", () => {
    const throwing = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {
        throw new Error("nope");
      },
    };
    expect(() => clearPlaybackState(throwing, "k")).not.toThrow();
  });

  it("does nothing when clearing absent storage", () => {
    expect(() => clearPlaybackState(null, "k")).not.toThrow();
  });
});

describe("shouldResume", () => {
  it("resumes past the floor and before the ceiling", () => {
    expect(shouldResume(30, 100)).toBe(true);
  });
  it("does not resume below the floor", () => {
    expect(shouldResume(2, 100)).toBe(false);
  });
  it("does not resume past the near-end ceiling", () => {
    expect(shouldResume(99, 100)).toBe(false);
  });
  it("resumes without a known duration when past the floor", () => {
    expect(shouldResume(30, 0)).toBe(true);
  });
  it("honors custom floor and ceiling", () => {
    expect(shouldResume(30, 100, { floor: 40 })).toBe(false);
    expect(shouldResume(96, 100, { ceilingRatio: 0.99 })).toBe(true);
  });
});

describe("isEditableTarget", () => {
  it("is true for an input", () => {
    expect(isEditableTarget({ tagName: "INPUT" })).toBe(true);
  });
  it("is true for a textarea", () => {
    expect(isEditableTarget({ tagName: "TEXTAREA" })).toBe(true);
  });
  it("is true for a contenteditable element", () => {
    expect(isEditableTarget({ tagName: "DIV", isContentEditable: true })).toBe(
      true,
    );
  });
  it("is false for a plain element", () => {
    expect(isEditableTarget({ tagName: "DIV" })).toBe(false);
  });
  it("is false for null", () => {
    expect(isEditableTarget(null)).toBe(false);
  });
});

describe("resolveMediaKey", () => {
  it("maps j to seek back 10s", () => {
    expect(resolveMediaKey({ key: "j" })).toEqual({ type: "seek-by", delta: -10 });
  });
  it("maps l to seek forward 10s", () => {
    expect(resolveMediaKey({ key: "l" })).toEqual({ type: "seek-by", delta: 10 });
  });
  it("is case-insensitive", () => {
    expect(resolveMediaKey({ key: "J" })).toEqual({ type: "seek-by", delta: -10 });
  });
  it("maps digits to a seek fraction", () => {
    expect(resolveMediaKey({ key: "0" })).toEqual({
      type: "seek-to-fraction",
      fraction: 0,
    });
    expect(resolveMediaKey({ key: "5" })).toEqual({
      type: "seek-to-fraction",
      fraction: 0.5,
    });
    expect(resolveMediaKey({ key: "9" })).toEqual({
      type: "seek-to-fraction",
      fraction: 0.9,
    });
  });
  it("maps < (and shift+comma) to a slower rate step", () => {
    expect(resolveMediaKey({ key: "<" })).toEqual({ type: "rate-step", dir: -1 });
    expect(resolveMediaKey({ key: ",", shiftKey: true })).toEqual({
      type: "rate-step",
      dir: -1,
    });
  });
  it("maps > (and shift+period) to a faster rate step", () => {
    expect(resolveMediaKey({ key: ">" })).toEqual({ type: "rate-step", dir: 1 });
    expect(resolveMediaKey({ key: ".", shiftKey: true })).toEqual({
      type: "rate-step",
      dir: 1,
    });
  });
  it("does not step rate for a bare comma or period", () => {
    expect(resolveMediaKey({ key: "," })).toBeNull();
    expect(resolveMediaKey({ key: "." })).toBeNull();
  });
  it("maps i to toggle picture-in-picture", () => {
    expect(resolveMediaKey({ key: "i" })).toEqual({ type: "toggle-pip" });
  });
  it("returns null for keys media-chrome already handles (k/space/f)", () => {
    expect(resolveMediaKey({ key: "k" })).toBeNull();
    expect(resolveMediaKey({ key: " " })).toBeNull();
    expect(resolveMediaKey({ key: "f" })).toBeNull();
  });
  it("returns null when typing in an editable field", () => {
    expect(
      resolveMediaKey({ key: "j", target: { tagName: "INPUT" } }),
    ).toBeNull();
  });
});

describe("resolveGesture", () => {
  it("double-tap left seeks back", () => {
    expect(resolveGesture("left", 2)).toEqual({ type: "seek-by", delta: -10 });
  });
  it("double-tap right seeks forward", () => {
    expect(resolveGesture("right", 2)).toEqual({ type: "seek-by", delta: 10 });
  });
  it("single-tap center toggles play", () => {
    expect(resolveGesture("center", 1)).toEqual({ type: "toggle-play" });
  });
  it("single-tap on a seek zone does nothing", () => {
    expect(resolveGesture("left", 1)).toBeNull();
  });
  it("double-tap center does nothing", () => {
    expect(resolveGesture("center", 2)).toBeNull();
  });
});

describe("shouldSyncAmbient", () => {
  it("syncs when drift exceeds the threshold", () => {
    expect(shouldSyncAmbient(10, 9, 0.3)).toBe(true);
  });
  it("does not sync within the threshold", () => {
    expect(shouldSyncAmbient(10, 9.9, 0.3)).toBe(false);
  });
  it("uses a default threshold", () => {
    expect(shouldSyncAmbient(10, 10.5)).toBe(true);
  });
});

function fakeMedia(overrides: Record<string, unknown> = {}) {
  return {
    paused: true,
    currentTime: 0,
    duration: 100,
    playbackRate: 1,
    play: vi.fn(),
    pause: vi.fn(),
    requestPictureInPicture: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe("applyMediaAction", () => {
  it("exposes the YouTube playback-rate ladder", () => {
    expect(PLAYBACK_RATES).toContain(1);
    expect(PLAYBACK_RATES[0]).toBeLessThan(1);
    expect(PLAYBACK_RATES[PLAYBACK_RATES.length - 1]).toBeGreaterThan(1);
  });

  it("plays a paused element on toggle-play", () => {
    const media = fakeMedia({ paused: true });
    applyMediaAction(media as never, { type: "toggle-play" });
    expect(media.play).toHaveBeenCalled();
  });

  it("pauses a playing element on toggle-play", () => {
    const media = fakeMedia({ paused: false });
    applyMediaAction(media as never, { type: "toggle-play" });
    expect(media.pause).toHaveBeenCalled();
  });

  it("seeks by a delta, clamped to zero", () => {
    const media = fakeMedia({ currentTime: 5 });
    applyMediaAction(media as never, { type: "seek-by", delta: -10 });
    expect(media.currentTime).toBe(0);
  });

  it("seeks by a delta, clamped to duration", () => {
    const media = fakeMedia({ currentTime: 95, duration: 100 });
    applyMediaAction(media as never, { type: "seek-by", delta: 10 });
    expect(media.currentTime).toBe(100);
  });

  it("seeks to a fraction of a finite duration", () => {
    const media = fakeMedia({ duration: 200 });
    applyMediaAction(media as never, { type: "seek-to-fraction", fraction: 0.5 });
    expect(media.currentTime).toBe(100);
  });

  it("ignores seek-to-fraction when duration is not finite", () => {
    const media = fakeMedia({ duration: Number.NaN, currentTime: 7 });
    applyMediaAction(media as never, { type: "seek-to-fraction", fraction: 0.5 });
    expect(media.currentTime).toBe(7);
  });

  it("steps the rate up and down within the ladder", () => {
    const media = fakeMedia({ playbackRate: 1 });
    applyMediaAction(media as never, { type: "rate-step", dir: 1 });
    expect(media.playbackRate).toBeGreaterThan(1);
    const slow = fakeMedia({ playbackRate: 1 });
    applyMediaAction(slow as never, { type: "rate-step", dir: -1 });
    expect(slow.playbackRate).toBeLessThan(1);
  });

  it("clamps the rate ladder at the ends", () => {
    const fast = fakeMedia({ playbackRate: PLAYBACK_RATES[PLAYBACK_RATES.length - 1] });
    applyMediaAction(fast as never, { type: "rate-step", dir: 1 });
    expect(fast.playbackRate).toBe(PLAYBACK_RATES[PLAYBACK_RATES.length - 1]);
  });

  it("snaps an off-ladder rate to the nearest step", () => {
    const media = fakeMedia({ playbackRate: 1.1 });
    applyMediaAction(media as never, { type: "rate-step", dir: 1 });
    expect(PLAYBACK_RATES).toContain(media.playbackRate);
  });

  it("requests picture-in-picture when none is active", () => {
    const media = fakeMedia();
    applyMediaAction(media as never, { type: "toggle-pip" });
    expect(media.requestPictureInPicture).toHaveBeenCalled();
  });

  it("does not throw when picture-in-picture is unsupported", () => {
    const media = fakeMedia({ requestPictureInPicture: undefined });
    expect(() =>
      applyMediaAction(media as never, { type: "toggle-pip" }),
    ).not.toThrow();
  });
});
