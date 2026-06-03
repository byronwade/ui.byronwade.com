# Messages Cockpit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax. This is a PORT: the source already exists in SignalRoute — each task recreates a file on-system (byronwade tokens, `edge`, no shadows) and fake-backed. Read the cited source file at task time.

**Goal:** Port SignalRoute's messaging page into byronwade/ui as a reusable, fake-backed `/layouts` archetype plus 4 tested registry items.

**Architecture:** An in-memory `comms-store` (useReducer + simulated `commit` + fake realtime emitter) is the swappable backend boundary; `conversation-list` / `message-thread` / `message-composer` are reusable composites; the cockpit shell + feature overlays live as a `/layouts` archetype. All token-driven, `edge` hairline, no drop shadows.

**Tech Stack:** React 19 + Base UI, Tailwind v4 tokens, vitest + jsdom + vitest-axe, shadcn registry.

**Spec:** `docs/superpowers/specs/2026-06-03-messages-cockpit-layout-design.md`
**Source root:** `/Users/byronwade/signalroute/app/(line)/line/messages/_components/` (+ `components/dashboard/`)

---

## Conventions (every task)

- Edit source under `registry/` (composites/lib) or `app/layouts/_archetypes/messages-cockpit/` (archetype-private). `npm run sync` after registry edits.
- **Retokenize while porting:** replace any raw color / `bg-white` / hex with token utilities; use `edge` (no `shadow-*`); radius scale; `cn()` + `className` passthrough; `data-slot` on composite parts. No `@/lib/supabase`, no server actions, no `@/lib/types` — use `comms-store` types.
- Registry items need `tests/components/<slug>.test.tsx` + coverage (99/96/100/99). Archetype-private files are covered by the archetype smoke test.
- Fast single-file test: `npx vitest run tests/components/<slug>.test.tsx`.

## File structure

| Target | Responsibility | Tested as |
|--------|---------------|-----------|
| `registry/lib/comms-store.tsx` | Types, seed, `MessagesProvider`, `useMessages`/`useMessagesActions`, actions, simulated `commit`, fake realtime | registry:lib (test) |
| `registry/components/conversation-list.tsx` | List + search + filter + bulk + rows | registry:component |
| `registry/components/message-thread.tsx` | Thread pane + bubbles + reactions + empty | registry:component |
| `registry/components/message-composer.tsx` | Composer (text/attachments/template+schedule hooks) | registry:component |
| `app/layouts/_archetypes/messages-cockpit/index.tsx` | Cockpit shell wiring store + composites | archetype smoke |
| `…/new-message.tsx`, `command-palette.tsx`, `template-picker.tsx`, `schedule.tsx`, `thread-bar.tsx`, `hotkeys.ts`, `states.tsx` | Feature overlays | archetype smoke |

---

## Phase 1 — Data layer (`comms-store`) — the contract everything depends on

**Files:** Create `registry/lib/comms-store.tsx`; Test `tests/components/comms-store.test.tsx`.
**Source to mirror:** `messages-store.tsx` (state/reducer/ActionsCtx), `use-realtime-messages.ts` (replace Supabase with a fake emitter).

- [ ] **Step 1: Define types + seed.** In `comms-store.tsx`:

```tsx
export type ConversationFlag = "pinned" | "archived" | "unread" | "spam";
export interface Contact { id: string; name: string; handle: string; avatarSeed: string }
export interface Message {
  id: string; conversationId: string; body: string;
  direction: "in" | "out";
  at: number;
  status: "sending" | "sent" | "delivered" | "read" | "failed";
  reactions: string[];
  scheduledAt?: number;
  attachments?: { name: string; kind: "image" | "file" }[];
}
export interface Conversation {
  id: string; contact: Contact; number: string;
  lastMessage: string; unread: number;
  flags: ConversationFlag[]; updatedAt: number; hidden?: boolean;
}
// SEED: ~8 conversations + their messages, deterministic timestamps passed in (no Date.now in module scope).
```

- [ ] **Step 2: Write the failing reducer/actions test.**

```tsx
import { renderHook, act } from "@testing-library/react";
import { MessagesProvider, useMessages, useMessagesActions } from "@/components/lib/comms-store"; // adjust import path to synced location
// markRead clears unread; send appends an outgoing message; toggleFlag pins.
test("markRead zeroes unread", () => { /* render provider, call actions.markRead(id), assert conv.unread === 0 */ });
test("send appends an outgoing message with status sending→sent", async () => { /* fake timers advance commit */ });
test("toggleFlag pins/unpins", () => {});
```

- [ ] **Step 3: Implement provider + reducer + actions.** Mirror source `ActionsCtx`:
  `send, markRead, markUnread, toggleFlag, archive, remove, bulk, createConversation, react, schedule, setActive, liveUpsert, liveDrop`. `commit = (mutator) => new Promise(r => setTimeout(r, LATENCY))` (LATENCY default 400, injectable for tests). Optimistic update first, then resolve. `MessagesProvider` accepts optional `source` (default = built-in seed) for swappability. Fake realtime: a `useEffect` timer that occasionally `liveUpsert`s an inbound reply (opt-in via `simulateRealtime` prop, off in tests).

- [ ] **Step 4: Run tests → PASS.** `npm run sync && npx vitest run tests/components/comms-store.test.tsx`

- [ ] **Step 5: Register + commit.** Add `comms-store` to `registry.json` (type `registry:lib`, files, deps `react`). `git add registry/lib/comms-store.tsx tests/components/comms-store.test.tsx registry.json && git commit`.

## Phase 2 — `conversation-list` (registry:component)

**Files:** Create `registry/components/conversation-list.tsx`; Test `tests/components/conversation-list.test.tsx`.
**Source:** `conversation-list.tsx` + `conversation-row.tsx`.

- [ ] **Step 1: Port the row + list**, retokenized, consuming `useMessages`/`useMessagesActions`. Props: `{ activeId?, onSelect }`. Features: search input (filters by contact/handle/body), flag filters (all/unread/pinned/archived), unread badge, per-row hover actions (star/archive/delete/mark-unread), bulk select. `data-slot="conversation-list"`/`"conversation-row"`.
- [ ] **Step 2: Tests (write first, then port to green):** renders seeded conversations; typing in search filters rows; clicking a row calls `onSelect`; star toggles pinned flag; mark-read zeroes the unread badge; axe clean. Cover every branch (filter modes, empty search result).
- [ ] **Step 3:** `npm run sync && npx vitest run tests/components/conversation-list.test.tsx` → PASS.
- [ ] **Step 4:** Register in `registry.json` (deps: `comms-store`, `gradient-avatar`, `foundation`, `utils`, lucide). Commit.

## Phase 3 — `message-thread` (registry:component)

**Files:** Create `registry/components/message-thread.tsx`; Test `tests/components/message-thread.test.tsx`.
**Source:** `thread-pane.tsx`, `thread-conversation.tsx`, `thread-empty.tsx`, `message-reactions.tsx`.

- [ ] **Step 1: Port** the thread (header with contact, scrollable bubble list, in/out bubble styles via tokens, status ticks, reaction chips + add-reaction, empty state when no `activeId`). Props: `{ conversationId? }`. `data-slot="message-thread"`.
- [ ] **Step 2: Tests:** renders bubbles for the active conversation; empty state when no id; adding a reaction calls `react` and shows the emoji; outgoing vs incoming bubble alignment; axe.
- [ ] **Step 3:** sync + test → PASS. **Step 4:** register + commit.

## Phase 4 — `message-composer` (registry:component)

**Files:** Create `registry/components/message-composer.tsx`; Test `tests/components/message-composer.test.tsx`.
**Source:** `messages-composer.tsx`.

- [ ] **Step 1: Port** composer: growing textarea, send button (Enter to send, Shift+Enter newline), attachment affordance, slots for template + schedule (callbacks `onPickTemplate?`, `onSchedule?`). Calls `send(conversationId, body)`. `data-slot="message-composer"`.
- [ ] **Step 2: Tests:** typing + Enter calls `send` and clears; Shift+Enter inserts newline (no send); empty body disables send; attachment button fires callback; axe.
- [ ] **Step 3:** sync + test → PASS. **Step 4:** register + commit.

## Phase 5 — Feature overlays (archetype-private; no per-file test mandate)

**Files:** under `app/layouts/_archetypes/messages-cockpit/`: `new-message.tsx`, `command-palette.tsx`, `template-picker.tsx`, `schedule.tsx`, `scheduled-tag.tsx`, `states.tsx` (skeleton + error), `hotkeys.ts`.
**Source:** `cockpit-new-message.tsx`, `command-palette.tsx`, `template-picker.tsx`, `schedule-button.tsx`, `scheduled-tag.tsx`, `cockpit-skeleton.tsx`, `cockpit-error.tsx`, `use-cockpit-hotkeys.ts`, `cockpit-shortcuts.tsx`.

- [ ] **Step 1:** Port each, retokenized, wired to `comms-store` actions (`createConversation`, `schedule`, `send`). New-message uses contact search → `createConversation`. Command palette = action list (filter, jump to conversation, new message). Template picker inserts into composer. Schedule sets `scheduledAt`. Hotkeys: j/k navigate, ⌘K palette, c compose, e archive, etc.
- [ ] **Step 2:** No individual tests; exercised by the Phase 6 smoke test. Commit per file or as a group.

## Phase 6 — Thread morph-bar + cockpit shell + archetype

**Files:** `…/messages-cockpit/thread-bar.tsx`, `index.tsx`; register archetype in `app/layouts/_archetypes/index.ts` + `content/components.ts`; Test `tests/archetypes/messages-cockpit.test.tsx` (smoke).
**Source:** `thread-morph-bar.tsx` (rebuild on existing `morph-dock`/`use-chrome-morph` — do NOT re-port the 19KB version), `cockpit-shell.tsx`, `messages-cockpit.tsx`.

- [ ] **Step 1: thread-bar** — a `MorphDock`-based bar over the thread with quick actions (call, info, schedule, more) that bloom panels. Reuse the existing dock; don't reimplement morph.
- [ ] **Step 2: shell + index** — two/three-pane layout: `conversation-list` (left), `message-thread` + `message-composer` + `thread-bar` (center), wrapped in `MessagesProvider simulateRealtime`. Mount overlays (palette, new-message). Wire hotkeys.
- [ ] **Step 3: archetype registration** — add `{ slug: "messages-cockpit", name, category, uses }` to `_archetypes/index.ts` and `archetypeComponents`; verify `/layouts` lists it and `/preview/messages-cockpit` renders full-bleed.
- [ ] **Step 4: smoke test** — mount `<MessagesCockpit/>`, assert: conversation list renders, selecting a row shows its thread, composer send appends a bubble, command palette opens on trigger. axe clean. (Covers archetype-private files.)
- [ ] **Step 5:** Commit.

## Phase 7 — Registry build + full gate

- [ ] **Step 1:** `npm run update:registry` — manifest + built output + examples valid (add `content/examples/<slug>/default.tsx` for each new registry component; `npm run gen:examples`).
- [ ] **Step 2:** `npm run test:ci` → exit 0, coverage ≥ thresholds.
- [ ] **Step 3:** Visual check on `/layouts` → open Messages Cockpit preview; verify list/thread/composer/palette/new-message all work, token-driven, edge (no shadows).
- [ ] **Step 4:** Update `registry/rules/byronwade-ui.mdc` only if a new token/utility was added. Commit.

## Self-review

- **Spec coverage:** data layer (P1), conversation-list (P2), thread (P3), composer (P4), all feature overlays incl. templates/schedule/palette/hotkeys/states (P5), morph-bar via existing dock + shell + archetype + smoke (P6), registry/gate (P7). ✓
- **Reusability boundary:** `MessagesProvider` `source` prop (P1) + composites consume store via hooks (P2–4). ✓
- **Test burden contained:** only 4 registry items coverage-gated; overlays via smoke. ✓
- **Type consistency:** `Conversation`/`Message`/`Contact`/`ConversationFlag` + action names (`send`, `markRead`, `toggleFlag`, `react`, `schedule`, `createConversation`…) defined in P1, reused verbatim P2–6. ✓
- **Open risk:** exact field set of the ported types is finalized in P1 against the source `@/lib/types` (`ConversationWithNumber`); downstream phases use only the fields listed above.
