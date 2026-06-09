# Demo-states rollout checklist — COMPLETE ✅

Apply the 5-state demo treatment (default/loading/empty/success/error) to the canonical
`default.tsx` example of each STATEFUL component, following the activity-grid pattern + the
`DemoEmptyState`/`DemoErrorState` helpers, using native `loading`/`empty`/`status` APIs where present.
PRIMITIVES are intentionally skipped (states are meaningless on them — DNA).

**Status: 85 stateful examples now drive all five demo states via `useDemoState`. Committed across
`12d06ec`…`6b9b8c5`. Full suite green (8759 pass), `npm run build` green. The dark-mode depth fix is
finalized (`9ef23d7`): dark runs its own darker elevation ramp so depth levels read as distinct.**

## Done — foundation (7)
- [x] data-table, event-timeline, activity-grid (Phase 1 + states fix)
- [x] resource-list, index-table, stat-card, metric-stat (pilot)

## Done — stateful rollout (78)

### Market (26)
- [x] sparkline, candlestick-chart, lightweight-chart, depth-chart, order-book, heatmap-grid,
  ticker-tape, quote-header, watchlist, market-depth, position-card, positions-table,
  portfolio-summary, trade-history, market-movers, screener-table, economic-calendar,
  market-news (native loading/empty), symbol-search, volume-profile, time-and-sales,
  symbol-details, sector-rotation, compare-symbols, options-chain, volume-footprint

### AI (17)
- [x] ai-conversation (native empty), ai-sources, ai-task (native status), ai-queue (native status),
  ai-plan (native isStreaming), ai-chain-of-thought (native status), ai-reasoning, ai-web-preview
  (native loading), ai-image, ai-code-block, ai-artifact, ai-tool, ai-message, ai-node, ai-panel,
  ai-canvas, ai-attachments

### Video (12)
- [x] video-card, video-shelf (native loading/empty), studio-video-row, upload-row (native status),
  comment-moderation-row (native status), channel-header, up-next-item, watch-meta-bar,
  description-box, comment, shorts-player (native status), chapter-list

### Forms (7)
- [x] combobox, date-picker, tag-input, drop-zone, rating, color-picker, editor

### Media (6)
- [x] audio-player, track-list, lyrics, now-playing-bar, playlist-card, artist-header

### Commerce (5)
- [x] order-summary (native empty), product-card, customer-card, fulfillment-tracker, inventory-bar

### Data display (5)
- [x] table, carousel, file-tree, kanban, gantt

## Primitives — intentionally SKIPPED (62)
Forms: calendar, date-picker?, field, input-otp, input, textarea, label, select, checkbox, switch,
radio-group, toggle, toggle-group, input-group, slider, number-field, native-select.
Data display: kbd, tabs, accordion, avatar, separator, breadcrumb, pagination, resizable,
aspect-ratio, scroll-area, collapsible. Feedback: spinner, alert, progress, skeleton, sonner, banner.
AI: ai-loader, ai-shimmer, ai-suggestion, ai-open-in-chat, ai-inline-citation, ai-context,
ai-model-selector, ai-confirmation, ai-checkpoint, ai-edge, ai-controls, ai-toolbar, ai-connection,
ai-prompt-input. Media: equalizer-bars, album-cover, audio-waveform. Commerce: money-input,
bulk-action-bar, variant-picker. Video: verified-badge, live-badge, subscribe-button, action-rail,
engagement-bar, comment-composer, mini-player, playback-menu. Market: price-change, chart-toolbar,
chart-layout-grid, drawing-toolbar, indicator-legend, replay-controls, session-stats-bar,
alert-create-form, price-alert, order-entry.

## Method
Per component: parallel agent reads activity-grid/in-card.tsx (reference) + target example +
component source; uses native state APIs if present else composes; "use client" + useDemoState;
tokens only, font-medium, skeletons mirror layout, error shows no fake data. Typecheck + component
test must pass. Commit per batch. Visual quality spot-checked by user (browser automation unavailable
to the agent).
