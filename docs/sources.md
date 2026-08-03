# Design sources — what Meridian follows

Meridian’s controlled principles come from published guidance by teams and practitioners who ship top-tier product UI. We take **discipline**, not visual pastiche. We do not name these brands in product chrome.

**Ranked merge + detailed specs:** [`influences.md`](./influences.md) · [`layout.md`](./layout.md) · [`architecture.md`](./architecture.md) · [`ux.md`](./ux.md) · [`animations.md`](./animations.md) · [`color.md`](./color.md) · [`typography.md`](./typography.md) · [`density.md`](./density.md) · [`ai-surfaces.md`](./ai-surfaces.md) — browsable at [`/system`](/meridian/system).

## Primary sources

| Source | What we follow | What we ignore |
| --- | --- | --- |
| [Vercel — Design Engineer Principles](https://vercel.com/design/engineer) | Usefulness; own the whole experience; find constraints; build for everyone; excellence over volume; raise the team’s floor | Using “design engineer” as a style look |
| [NN/g — 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) | Status, control, consistency, error prevention/recovery, recognition, flexibility, minimalism, help | Treating heuristics as a visual style |
| [Shopify Polaris — Pro design language](https://polaris-react.shopify.com/design/pro-design-language) | Assign meaning; density by task; juicy but predictable interactions; action-driven, not verbose | Shopify green as brand; admin-only vocabulary |
| [Linear — How we redesigned the Linear UI](https://linear.app/now/how-we-redesigned-the-linear-ui) | Reduce chrome noise; align hierarchy; soften/neutralize borders; improve content contrast; evolve without disassembling the product | Purple accent; Inter Display as required type; Electron-specific chrome |
| [Brad Frost — Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/) | Parts and wholes concurrently; systems proven in real pages | Rigid atom→page waterfall; “atomic” as folder dogma |
| [Brad Frost — Extending Atomic Design](https://bradfrost.com/blog/post/extending-atomic-design/) | Tokens as subatomic particles; components apply tokens | Tokenizing every one-off variation |
| [Brad Frost — The Part and The Whole](https://bradfrost.com/blog/post/the-part-and-the-whole/) | Pattern libraries without context fail; compose wholes | Isolated styleguide screenshots as the product |

## Supporting craft (encoded, not labeled)

| Craft | Encode |
| --- | --- |
| [Fluent 2](https://fluent2.microsoft.design/) | 4px grid; control vs layer radius; thin stroke; motion tokens; neutrals + brand sparingly |
| Cursor application (not Cursor.com) | Dense quiet chrome; object-bound composer; mono metadata |
| OpenAI / ChatGPT product simplicity | Progressive disclosure; product as hero; provenance without chatbot cliché |
| Cinema staging (Apple / Tesla / YouTube product films) | Full-bleed product subject; one idea per frame; no scroll spectacle |

## AI + typed design (2025–2026)

| Source | What we follow |
| --- | --- |
| [Why AI Breaks Your Design System](https://superdesign.dev/blog/ai-design-system-drift) | Freeze a contract; constrain components; validate output |
| [Expose your design system to LLMs](https://hvpandya.com/llm-design-systems) | Spec + closed token layer + audit script |
| [What is DESIGN.md](https://superdesign.dev/blog/what-is-design-md) | Tokens + prose rationale agents can apply |
| [How to write a good spec for AI agents (Osmani)](https://addyosmani.com/blog/good-spec/) | Always / Ask / Never; self-verification |
| [Progressive disclosure for AI (Nielsen)](https://jakobnielsenphd.substack.com/p/progressive-disclosure) | Outcome first; trace one click away |
| [Systems in layers (Capozzi)](https://maecapozzi.com/blog/progressive-disclosure-of-complexity) | Escape down a layer — don’t eject from the system |
| [Design tokens as AI guardrails](https://otf-kit.dev/blog/design-tokens-as-guardrails) | Tokens as typed API; lint off-token values |
| [Into Design Systems — not ready for agents](https://www.intodesignsystems.com/blog/design-system-not-ready-for-ai-agents) | Align docs/tokens/components; always-on foundation rules |
| Cinematic product staging (Apple-class DESIGN.md patterns) | Product as subject; one idea/frame; chrome recedes |

Encoded as: `lib/design/` (incl. `experience.ts`) + `check:design` / `check:experience` + frozen/creative zones.  
Pillar specs: [`ux.md`](./ux.md) · [`dx.md`](./dx.md).

## How to use this file

1. When changing DNA or tokens, prefer advice that appears in the primary table.
2. If a proposal only matches a trend mood board, reject it.
3. Update this file when we adopt a new published rule — keep Meridian accountable to sources.
