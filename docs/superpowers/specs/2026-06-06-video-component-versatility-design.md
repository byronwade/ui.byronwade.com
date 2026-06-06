# Video component versatility pass - design spec

**Date:** 2026-06-06
**Status:** Draft for review

## Goal

Make the video browse/watch composites more versatile and feature-rich while preserving byronwade/ui's
Design DNA: token-only styling, editorial typography, `data-slot` handles, `className` passthrough,
accessible interaction, and polished defaults.

This pass focuses on `video-card`, `video-shelf`, `mini-player`, and `shorts-player`. The core
`video-player` already has a richer YouTube-grade API and should only be touched if these composites
need small integration fixes.

## Product Direction

Use **design-system flexibility with YouTube-grade defaults**.

The default examples should remain instantly recognizable as video product UI. The API should also let
consumers adapt the same components to home feeds, search results, watch-page sidebars, featured rows,
marketing embeds, compact dashboards, and floating playback.

## Non-Goals

- Do not rewrite every video component into a compound-component framework.
- Do not change `video-player` unless a small integration improvement is needed.
- Do not introduce raw colors, hardcoded theme branches, or arbitrary Tailwind color values.
- Do not collapse existing deprecated props in this pass; preserve backwards compatibility where
  existing tests or examples rely on them.
- Do not broaden this pass into market components. Market components should receive a separate spec.

## Component Designs

### VideoCard

`VideoCard` should move from a single vertical tile to a flexible video item.

Add variants:

| Prop      | Values                                                    | Purpose                                                                                  |
| --------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `variant` | `default`, `compact`, `horizontal`, `overlay`, `featured` | Switch between feed tile, sidebar/search row, media overlay, and large feature treatment |
| `size`    | `sm`, `md`, `lg`                                          | Control thumbnail scale, title size, and metadata density                                |
| `density` | `comfortable`, `compact`                                  | Tighten vertical rhythm without changing component semantics                             |

Add API surface:

- `description?: React.ReactNode` for search/result cards and featured placements.
- `badges?: React.ReactNode` for labels such as `New`, `Members only`, `Premiere`, or topic tags.
- `stats?: React.ReactNode` to override the default views/timestamp line.
- `actions?: React.ReactNode` for inline save/share controls in addition to menu items.
- `thumbnailAspectRatio?: ComponentProps<typeof Thumbnail>["aspectRatio"]` if the local
  `Thumbnail` API supports it; otherwise defer this until `Thumbnail` exposes aspect variants.
- `selected?: boolean` for playlist/current-video states.
- `disabled?: boolean` for unavailable or permission-gated videos.

Behavior:

- Preserve `href` and `onClick`.
- Continue keyboard activation when rendered as a non-anchor interactive surface.
- Make disabled cards non-interactive and visibly muted with token classes.
- Expose stable `data-slot`s for media, body, title, byline, meta, badges, description, actions, and menu.

### VideoShelf

`VideoShelf` should become a real content-section primitive, not only a horizontal overflow wrapper.

Add variants:

| Prop       | Values                              | Purpose                                                            |
| ---------- | ----------------------------------- | ------------------------------------------------------------------ |
| `variant`  | `carousel`, `grid`, `rail`, `stack` | Horizontal shelf, responsive grid, compact rail, or vertical group |
| `density`  | `comfortable`, `compact`            | Control header and item spacing                                    |
| `controls` | `hover`, `always`, `none`           | Configure scroll-button visibility                                 |

Add API surface:

- `description?: React.ReactNode` under the title.
- `empty?: React.ReactNode` for no-content states.
- `loading?: boolean` and `loadingItems?: number` for skeleton rows/cards.
- `itemClassName?: string` to control repeated item sizing without wrapping every child manually.
- `scrollAmount?: number | "page"` to tune arrow behavior.
- `onScrollStateChange?: (state: { canScrollLeft: boolean; canScrollRight: boolean }) => void`.

Behavior:

- Keep current arrow scrolling for `carousel` and `rail`.
- Do not render scroll controls for `grid` or `stack`.
- Preserve `mask-fade-x` only for horizontal variants.
- Ensure the header remains optional and accessible.
- Add keyboard support for left/right arrow navigation on horizontal tracks.

### MiniPlayer

`MiniPlayer` should cover floating PiP, inline "continue watching", and compact dock use cases.

Add variants:

| Prop      | Values                             | Purpose                                            |
| --------- | ---------------------------------- | -------------------------------------------------- |
| `variant` | `floating`, `inline`, `dock`       | Corner card, inline media row/card, compact dock   |
| `size`    | `sm`, `md`, `lg`                   | Control media and body scale                       |
| `state`   | `default`, `collapsed`, `expanded` | Let consumers present docked vs expanded player UI |

Add API surface:

- `queueLabel?: React.ReactNode` for playlist or queue context.
- `metadata?: React.ReactNode` for channel, episode, or watch progress details.
- `actions?: React.ReactNode` for secondary controls.
- `disabled?: boolean` for unavailable playback.
- `showClose?: boolean` paired with existing `onClose`; preserve `onClose` behavior.
- `playbackLabel?: string` for clearer accessible play/pause labels in custom contexts.

Behavior:

- Preserve controlled and uncontrolled playback behavior.
- Keep muted inline video playback while playing.
- Do not auto-play when disabled.
- `collapsed` should hide secondary metadata and leave title plus primary controls.
- `expanded` should expose metadata/actions without requiring a separate component.

### ShortsPlayer

`ShortsPlayer` is already featureful. The pass should improve adaptability rather than replace the
core shape.

Add variants:

| Prop          | Values                            | Purpose                                                  |
| ------------- | --------------------------------- | -------------------------------------------------------- |
| `variant`     | `default`, `preview`, `immersive` | Full player, small preview, or edge-to-edge presentation |
| `rail`        | `right`, `left`, `hidden`         | Place or hide engagement actions                         |
| `density`     | `comfortable`, `compact`          | Tune overlay text and spacing                            |
| `captionMode` | `clamped`, `expanded`, `hidden`   | Control caption presentation                             |

Add API surface:

- `status?: React.ReactNode` for `Live`, `Ad`, `Sponsored`, or moderation badges.
- `authorAction?: React.ReactNode` to replace the built-in follow button.
- `overlay?: React.ReactNode` for custom lower-third content.
- `topActions?: React.ReactNode` for mute/share/settings controls near the top edge.
- `fallback?: React.ReactNode` when no `src`, `posterSrc`, or children are provided.
- `onVideoClick?: () => void` in addition to the built-in play/pause tap behavior.

Behavior:

- Keep grouped `follow`, `like`, `dislike`, `mute`, and `play` props from the prior API cleanup.
- Preserve deprecated flat props for compatibility.
- Respect `rail="hidden"` by not rendering `ActionRail`.
- `captionMode="expanded"` should remove line clamp; `hidden` should omit caption entirely.
- Keep the full-surface play/pause button accessible when media exists.

## Examples

Add examples that demonstrate breadth, not only happy-path defaults:

- `video-card/horizontal.tsx`
- `video-card/overlay.tsx`
- `video-card/featured.tsx`
- `video-shelf/grid.tsx`
- `video-shelf/rail.tsx`
- `mini-player/dock.tsx`
- `mini-player/expanded.tsx`
- `shorts-player/preview.tsx`
- `shorts-player/immersive.tsx`

Update `content/examples/registry.ts` and `content/components.ts` metadata so the catalog exposes the
new variants and props.

## Testing

Expand tests per component:

- Default render still mounts without crashing.
- Every new `variant`, `size`, `density`, and mode prop renders the expected `data-*` attributes or
  slot structure.
- Interactive callbacks fire: card click, menu actions, shelf scroll, mini-player play/close/expand,
  shorts follow/like/dislike/mute/play/comment/share.
- Controlled and uncontrolled play/toggle state remains stable.
- Disabled states suppress interaction.
- `axe` has no violations for representative variants.

Use targeted component tests first, then run:

```bash
npm run test:run -- tests/components/video-card.test.tsx tests/components/video-shelf.test.tsx tests/components/mini-player.test.tsx tests/components/shorts-player.test.tsx
npm run validate
```

Run `npm run test:ci` before claiming the implementation is complete.

## Compatibility

This is an additive API pass. Existing examples and common prop names should keep working. If a local
component already has deprecated props, keep the deprecation comments and route them through the newer
grouped state helpers.

## Implementation Order

1. Update `VideoCard` API, variants, examples, and tests.
2. Update `VideoShelf` API, variants, examples, and tests.
3. Update `MiniPlayer` API, variants, examples, and tests.
4. Update `ShortsPlayer` API, variants, examples, and tests.
5. Refresh catalog metadata and registry example imports.
6. Run focused tests, validation, formatting, and the full CI test command.

## Open Decisions

No user-facing decisions remain for this pass. Implementation should prefer the smallest additive API
that satisfies the designs above. If an existing primitive does not expose an assumed prop, defer that
single prop instead of expanding the primitive in the same pass.
