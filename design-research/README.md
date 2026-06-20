# Design Research

This folder contains external design-system teardown papers used to benchmark and sharpen
byronwade/ui. **How we work** (usefulness, whole-experience ownership, constraints, inclusion,
excellence, team improvement) is in [`AGENTS.md`](../AGENTS.md#design-engineer-principles--how-we-work)
and on the [philosophy docs page](/docs/philosophy).

## Files

| File                                                       | Subject                 | Research basis                               | Coverage status      |
| ---------------------------------------------------------- | ----------------------- | -------------------------------------------- | -------------------- |
| [`ATLASSIAN-DESIGN-SYSTEM.md`](ATLASSIAN-DESIGN-SYSTEM.md) | Atlassian Design System | Official ADS docs + Atlaskit npm artifacts   | Complete             |
| [`CHATGPT-DESIGN-SYSTEM.md`](CHATGPT-DESIGN-SYSTEM.md)     | ChatGPT / Apps SDK UI   | OpenAI docs + Apps SDK UI package artifacts  | Complete             |
| [`CURSOR-DESIGN-SYSTEM.md`](CURSOR-DESIGN-SYSTEM.md)       | Cursor                  | Live site inspection + brand/editor research | Complete, normalized |
| [`FLUENT2-DESIGN-SYSTEM.md`](FLUENT2-DESIGN-SYSTEM.md)     | Microsoft Fluent 2      | Fluent docs + Fluent UI npm artifacts        | Complete             |
| [`LINEAR-DESIGN-SYSTEM.md`](LINEAR-DESIGN-SYSTEM.md)       | Linear                  | Brand/docs + live CSS + SDK metadata         | Complete             |
| [`SHOPIFY-DESIGN-SYSTEM.md`](SHOPIFY-DESIGN-SYSTEM.md)     | Shopify Polaris         | Polaris docs + package artifacts             | Complete             |
| [`TWENTY-DESIGN-SYSTEM.md`](TWENTY-DESIGN-SYSTEM.md)       | Twenty                  | Source-code inspection of Twenty repo        | Complete, normalized |
| [`VERCEL-DESIGN-SYSTEM.md`](VERCEL-DESIGN-SYSTEM.md)       | Vercel / Geist          | Geist docs + live CSS + Geist font package   | Complete             |
| [`COMPARATIVE-ANALYSIS.md`](COMPARATIVE-ANALYSIS.md)       | Cross-system comparison | All papers + byronwade/ui rules              | Complete             |

## Coverage Standard

The papers are organized to be comparable by research dimensions, not identical line count. Each
paper covers the same core questions:

| Dimension                | Required coverage                                                     |
| ------------------------ | --------------------------------------------------------------------- |
| Brand philosophy         | What the system is trying to signal and for whom.                     |
| Product context          | What workflows and surfaces it optimizes.                             |
| Token architecture       | How values are represented and consumed.                              |
| Color                    | Palette, semantic roles, dark/light behavior, accent strategy.        |
| Typography               | Typeface, scale, weights, line height, tracking, code/data treatment. |
| Spacing/layout           | Base units, grids, density, layout surfaces.                          |
| Shape/depth              | Radius, borders, shadows/elevation, surface logic.                    |
| Motion                   | Durations/easing/interaction personality.                             |
| Components/patterns      | Core primitives and product-specific composites.                      |
| Accessibility/governance | Keyboard/focus/contrast plus design-system enforcement model.         |
| Implementation           | Packages, stack, source artifacts, theme model.                       |
| AI/agent layer           | How AI is treated visually and structurally when relevant.            |
| Replication rules        | Practical rules for producing a similar UI.                           |
| byronwade/ui comparison  | How the system maps to our design DNA.                                |
| Source notes             | Primary sources, artifacts inspected, caveats.                        |

## Normalization Notes

- `CURSOR-DESIGN-SYSTEM.md` and `TWENTY-DESIGN-SYSTEM.md` were earlier papers with shorter section
  models. They now include addenda for accessibility/governance, AI/product layer, and byronwade/ui
  comparison so they can be read against the same dimensions as the newer papers.
- The newer papers already used the normalized structure and include explicit implementation,
  source, AI/current-layer, and replication sections.
- Line counts vary because the systems expose different evidence. Fluent, Vercel, and Atlassian have
  broad public docs/package artifacts; Cursor and Linear require more live-site inference; Twenty
  has source-code evidence; Shopify has broad but highly product-specific Polaris evidence.

## Reading Order

1. Read [`COMPARATIVE-ANALYSIS.md`](COMPARATIVE-ANALYSIS.md) first for the cross-system takeaways.
2. Read individual papers when making a specific design decision.
3. Use byronwade/ui's own rule files as the final authority:
   - [`../AGENTS.md`](../AGENTS.md)
   - [`../registry/rules/byronwade-ui.mdc`](../registry/rules/byronwade-ui.mdc)
   - [`../docs/CONVENTIONS.md`](../docs/CONVENTIONS.md)
