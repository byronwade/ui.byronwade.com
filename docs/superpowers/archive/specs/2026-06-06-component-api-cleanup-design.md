# Component API cleanup — design spec

**Date:** 2026-06-06  
**Status:** Phase 1 + Phase 2 implemented

## Goals

1. Fix broken controllable-state patterns (open/subscribed/expanded).
2. Normalize callbacks to house conventions (`onValueChange`, `onPlayingChange`).
3. Deduplicate shared types (overflow menu items).
4. Improve catalog discoverability for Video components.

## House conventions

| Pattern | Callback        | Default prop   |
| ------- | --------------- | -------------- |
| Value   | `onValueChange` | `defaultValue` |
| Boolean | `onXChange`     | `defaultX`     |
| Open    | `onOpenChange`  | `defaultOpen`  |

Shared helper: `@/lib/controllable-state` (`useControllableState`).

## Phase 1 (this change)

- **alert-create-form** — fix `open` / `onOpenChange` via `useControllableState`.
- **comment-composer** — add `onOpenChange`; clarify controlled `open` vs focus-driven expand.
- **channel-header** — pass through controlled `subscribed` to `SubscribeButton`.
- **replay-controls** — add `defaultPlaying` + `onPlayingChange`; keep `onPlay` / `onPause`.
- **variant-picker** — add `onValueChange`; keep `onChange` as alias.
- **overflow-menu-item** — shared type for video-card, up-next-item, studio-video-row.
- **catalog** — `tags: ["youtube", "video"]` on all Video category entries.

## Phase 2 (implemented)

- **toggle-state** lib — `ToggleState` + `useToggleState` for grouped booleans.
- **engagement-bar** / **shorts-player** — `like`, `dislike`, `save` / `follow`, `mute`, `play` grouped props; flat props deprecated.
- **rating** — `onValueChange` only; uses shared `useControllableState`.
- **catalog** — `thumbnail` + `chip-bar` recategorized to UI; `tier:*` tags + `props` on all Video entries.

## Tier tags (catalog)

| Tier                | Examples                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| `tier:simple`       | live-badge, verified-badge, subscribe-button, action-rail, description-box, mini-player, channel-byline |
| `tier:intermediate` | video-card, channel-header, comment-composer, engagement-bar, playback-menu, chip-bar                   |
| `tier:advanced`     | shorts-player, chapter-list, studio-video-row, upload-row, comment-moderation-row                       |

## Phase 3 (deferred)

- Collapse remaining flat deprecated props after one release cycle.
- Recategorize `action-rail` to UI if used outside Video composites.
- Engagement object single prop: `engagement={{ like, dislike, save }}`.
