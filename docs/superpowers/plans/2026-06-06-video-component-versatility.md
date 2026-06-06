# Video Component Versatility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add versatile, additive APIs and polished variants to the video browse/watch components.

**Architecture:** Update the hand-maintained registry sources first, then run `npm run sync` so generated app components match. Each component keeps a single-file family shape, exposes variant props through CVA where useful, preserves existing props, and adds tests before implementation.

**Tech Stack:** React 19, TypeScript, Tailwind v4 token utilities, class-variance-authority, lucide-react, Testing Library, Vitest, vitest-axe.

---

### Task 1: VideoCard

**Files:**

- Modify: `registry/components/video-card.tsx`
- Modify via sync: `components/video-card.tsx`
- Modify: `tests/components/video-card.test.tsx`
- Create examples: `content/examples/video-card/horizontal.tsx`, `content/examples/video-card/overlay.tsx`, `content/examples/video-card/featured.tsx`

- [ ] **Step 1: Write failing tests**

Add tests that render `variant="horizontal"`, `variant="overlay"`, `variant="featured"`, `size`, `density`, `description`, `badges`, `stats`, `actions`, `selected`, `disabled`, and `thumbnailRatio`.

- [ ] **Step 2: Verify red**

Run: `npm run test:run -- tests/components/video-card.test.tsx`

Expected: TypeScript or assertion failures because the new props and slots do not exist yet.

- [ ] **Step 3: Implement**

Add `variant`, `size`, and `density` CVA blocks. Preserve `href`, `onClick`, `menuItems`, views/timestamp formatting, and keyboard activation. Add `data-variant`, `data-size`, `data-density`, `data-selected`, and `data-disabled` on the root.

- [ ] **Step 4: Verify green**

Run: `npm run test:run -- tests/components/video-card.test.tsx`

Expected: PASS.

### Task 2: VideoShelf

**Files:**

- Modify: `registry/components/video-shelf.tsx`
- Modify via sync: `components/video-shelf.tsx`
- Modify: `tests/components/video-shelf.test.tsx`
- Create examples: `content/examples/video-shelf/grid.tsx`, `content/examples/video-shelf/rail.tsx`

- [ ] **Step 1: Write failing tests**

Add tests for `variant="grid"`, `variant="rail"`, `variant="stack"`, `density`, `controls`, `description`, `empty`, `loading`, `loadingItems`, `itemClassName`, `scrollAmount`, `onScrollStateChange`, and horizontal keyboard scrolling.

- [ ] **Step 2: Verify red**

Run: `npm run test:run -- tests/components/video-shelf.test.tsx`

Expected: TypeScript or assertion failures because the new props and behavior do not exist yet.

- [ ] **Step 3: Implement**

Add variants for carousel/grid/rail/stack, loading skeletons, empty state, configurable controls, item class passthrough, scroll-state callback, and left/right arrow key support on horizontal tracks.

- [ ] **Step 4: Verify green**

Run: `npm run test:run -- tests/components/video-shelf.test.tsx`

Expected: PASS.

### Task 3: MiniPlayer

**Files:**

- Modify: `registry/components/mini-player.tsx`
- Modify via sync: `components/mini-player.tsx`
- Modify: `tests/components/mini-player.test.tsx`
- Create examples: `content/examples/mini-player/dock.tsx`, `content/examples/mini-player/expanded.tsx`

- [ ] **Step 1: Write failing tests**

Add tests for `variant`, `size`, `state`, `queueLabel`, `metadata`, `actions`, `disabled`, `showClose`, `playbackLabel`, and controlled/uncontrolled playback behavior.

- [ ] **Step 2: Verify red**

Run: `npm run test:run -- tests/components/mini-player.test.tsx`

Expected: TypeScript or assertion failures because the new props and structure do not exist yet.

- [ ] **Step 3: Implement**

Add variant/size/state CVA blocks. Preserve current playback, close, and expand behavior. Suppress playback changes while disabled. Hide secondary content in `collapsed` state and render metadata/actions in default/expanded states.

- [ ] **Step 4: Verify green**

Run: `npm run test:run -- tests/components/mini-player.test.tsx`

Expected: PASS.

### Task 4: ShortsPlayer

**Files:**

- Modify: `registry/components/shorts-player.tsx`
- Modify via sync: `components/shorts-player.tsx`
- Modify: `tests/components/shorts-player.test.tsx`
- Create examples: `content/examples/shorts-player/preview.tsx`, `content/examples/shorts-player/immersive.tsx`

- [ ] **Step 1: Write failing tests**

Add tests for `variant`, `rail`, `density`, `captionMode`, `status`, `authorAction`, `overlay`, `topActions`, `fallback`, and `onVideoClick`.

- [ ] **Step 2: Verify red**

Run: `npm run test:run -- tests/components/shorts-player.test.tsx`

Expected: TypeScript or assertion failures because the new props and modes do not exist yet.

- [ ] **Step 3: Implement**

Add the new props without removing grouped toggle state. Keep deprecated flat props. Move/hide `ActionRail` based on `rail`, control caption rendering by `captionMode`, render custom overlay/top actions/fallback, and call `onVideoClick` when the media tap area toggles playback.

- [ ] **Step 4: Verify green**

Run: `npm run test:run -- tests/components/shorts-player.test.tsx`

Expected: PASS.

### Task 5: Catalog and Verification

**Files:**

- Modify: `content/examples/registry.ts`
- Modify: `content/components.ts`
- Modify if required by check-rule: `registry/rules/byronwade-ui.mdc`

- [ ] **Step 1: Register examples and props**

Import and list the new examples. Update component metadata descriptions and prop tables for the new API surface.

- [ ] **Step 2: Sync registry**

Run: `npm run sync`

Expected: generated `components/` files match updated `registry/` files.

- [ ] **Step 3: Run focused tests**

Run: `npm run test:run -- tests/components/video-card.test.tsx tests/components/video-shelf.test.tsx tests/components/mini-player.test.tsx tests/components/shorts-player.test.tsx`

Expected: PASS.

- [ ] **Step 4: Run validation**

Run: `npm run validate`

Expected: PASS. If formatting fails, run `npx prettier --write` on touched files and re-run.

- [ ] **Step 5: Run CI tests**

Run: `npm run test:ci`

Expected: PASS.
