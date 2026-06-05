# Messages Cockpit — reusable, fake-backed messaging layout

**Date:** 2026-06-03
**Status:** Draft for review
**Source:** SignalRoute `app/(line)/line/messages/_components/` (~22 files)

## Goal

Port SignalRoute's full messaging page into byronwade/ui as a **reusable, fake-backed
layout archetype** on `/layouts`, with the genuinely reusable pieces extracted as
installable registry items. All messaging features included. No real backend —
in-memory mock data + React state with simulated latency, behind a swappable interface.

## Decisions (locked)

1. **Slice:** messaging page only (calls/voicemail/other `(line)` routes are later slices).
2. **Packaging:** **hybrid** — full cockpit as a `/layouts` archetype (archetype-private
   files are app pages, exempt from the per-component registry test mandate) **plus**
   extracted tested registry items: the fake data lib + the key composites.
3. **Features:** **everything** — list/search/flags/archive/read/bulk, thread + bubbles
   - reactions, composer, new-message flow, templates, scheduled messages, command
     palette, hotkeys, thread morph-bar, skeleton/error states.
4. **Backend:** in-memory mock module + `useReducer` state + simulated-latency `commit`
   - a fake realtime emitter (replaces Supabase). Swappable for a real source.

## Source architecture (what we're porting)

State lives in `messages-store.tsx` (`useReducer`, optimistic updates, `commit:
() => Promise`). Types: `ConversationWithNumber`, `ConversationFlag` (`@/lib/types`).
Only real backend dep: `use-realtime-messages.ts` (Supabase channel) + `commit`.
Component tree (`messages/_components/`): messages-cockpit, messages-store,
cockpit-shell, conversation-list, conversation-row, thread-pane, thread-conversation,
thread-empty, messages-composer, cockpit-new-message, command-palette,
message-reactions, schedule-button, scheduled-tag, template-picker, thread-morph-bar,
cockpit-shortcuts, use-cockpit-hotkeys, cockpit-skeleton, cockpit-error,
use-realtime-messages.

## Target file layout (byronwade/ui)

**Reusable registry items (tested, coverage-gated):**

- `registry/lib/comms-store.tsx` — the fake data layer: types (`Conversation`,
  `Message`, `Contact`, `ConversationFlag`), seed data, `MessagesProvider`,
  `useMessages`/`useMessagesActions`, all actions, simulated `commit`, and a fake
  realtime emitter. **This is the swappable boundary.**
- `registry/components/conversation-list.tsx` — list + search + filter + bulk + rows.
- `registry/components/message-thread.tsx` — thread pane + bubbles + reactions + empty.
- `registry/components/message-composer.tsx` — composer (text, attachments, templates,
  schedule hooks).

**Archetype-private (on `/layouts`, exempt from per-component test mandate):**

- `app/layouts/_archetypes/messages-cockpit/` — `index.tsx` (the cockpit shell wiring
  the registry composites + the store), plus the feature-specific overlays that aren't
  general-purpose: cockpit-shell, cockpit-new-message, command-palette, template-picker,
  schedule-button, scheduled-tag, thread-morph-bar, cockpit-shortcuts/use-hotkeys,
  cockpit-skeleton, cockpit-error.
- Register the archetype in `app/layouts/_archetypes/index.ts` + `components.ts` so it
  appears on `/layouts` and at `/preview/messages-cockpit`.

## Fake-backend interface (`comms-store`)

Types (ported/trimmed from SignalRoute, messaging-relevant fields only — exact fields
finalized against `@/lib/types` during implementation):

- `Contact { id, name, handle (phone/email), avatarSeed }`
- `Message { id, conversationId, body, direction: "in"|"out", at, status:
"sending"|"sent"|"delivered"|"read"|"failed", reactions: string[], scheduledAt?,
attachments?: { name, kind }[] }`
- `Conversation { id, contact, number, lastMessage, unread: number, flags:
ConversationFlag[] (pinned|archived|unread|spam…), updatedAt, hidden? }`

Actions (mirror the source `ActionsCtx`, all referentially stable):
`send`, `markRead`, `markUnread`, `toggleFlag`, `archive`, `remove`, `bulk`,
`createConversation`, `react`, `schedule`, `setActive`, plus `liveUpsert`/`liveDrop`
driven by the fake realtime emitter. `commit` resolves after a simulated delay; the
fake realtime optionally emits an inbound reply to show realtime updates.

## Reusability

Consumers install `comms-store` + the composites and wrap their tree in
`MessagesProvider`. The provider takes an optional `source` prop; default is the
in-memory fake. A real backend is dropped in by implementing the same actions +
realtime emitter interface — no component changes.

## Design DNA compliance

Retokenize during the port: no raw colors → token utilities; **`edge` hairline, no
drop shadows** (matches the just-landed elevation pass); radius scale; `cn()` +
`className` passthrough; `data-slot`s on composite parts. Update
`registry/rules/byronwade-ui.mdc` only if a new token/utility is introduced.

## Testing

- Registry items (`comms-store`, `conversation-list`, `message-thread`,
  `message-composer`) get full test files + axe, meeting coverage (stmts ≥ 99,
  branches ≥ 96, functions 100, lines ≥ 99). The store's reducer/actions are
  pure-ish and highly testable.
- Archetype-private files are exercised by an archetype smoke render (mount the
  cockpit, assert it renders + key interactions) — not individually coverage-gated.
- `npm run update:registry` + `npm run test:ci` green before commit.

## Phasing (the plan will expand each)

1. **Data layer** — types + seed + `MessagesProvider` + actions + fake realtime + tests.
2. **Conversation list** — list/row/search/filter/bulk + tests.
3. **Thread** — pane/bubbles/reactions/empty + tests.
4. **Composer** — composer + attachments + tests.
5. **Feature overlays** — new-message, templates, schedule, command palette, hotkeys,
   morph-bar, skeleton/error (archetype-private).
6. **Shell + archetype** — wire it all on `/layouts` + preview + smoke test.
7. **Registry + gate** — manifest items, `update:registry`, `test:ci` green.

## Out of scope

Calls, video, voicemail, queues, routing, presence, flow, settings (later slices).
A real backend. Auth. Multi-org.

## Risks

- **Large surface (~22 files).** Mitigated by phasing + hybrid packaging (only 4
  registry items carry the full test mandate).
- **`thread-morph-bar` is the biggest file (~19KB)** — built on the morph system;
  reuse `morph-dock`/`use-chrome-morph` where possible rather than re-porting.
- **Retokenizing** SignalRoute classes to byronwade tokens is per-file manual work.
- **Coverage on the composites** (esp. the store) is the main test cost.
