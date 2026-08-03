# Design contracts — closed prefs

> Users may **tweak a little**. Agents must **fail closed**.  
> Prefs ≠ freeform theming. Prefs ≠ layout builder. Prefs ≠ animation catalog.

## What prefs are

Closed preset ids only:

| Knob | Ids |
| --- | --- |
| `brand` | `teal` · `slate` · `moss` · `wine` |
| `radius` | `compact` · `default` · `soft` |
| `paper` | `warm` · `cool` · `night` |
| `surface` (optional) | `application` · `marketing` · `mobile` · `desktop` |

Emitted as `app/contract-prefs.css` + `contract.prefs.json` via MCP **`apply_prefs`**.

Live UI: [`/{id}/theme`](/meridian/theme) → copy MCP call / JSON / CSS.

## What prefs are NOT

| Not a pref | Where the law lives |
| --- | --- |
| Preferred layouts / shell builders | [`layout.md`](./layout.md) · `data-surface` · task recipes |
| Preferred animations / motion catalogs | [`animations.md`](./animations.md) · `motionLaws` (micro only) |
| Freeform OKLCH / hex pickers | Banned — inventing colors breaks the contract |
| Second brand accent | One accent → `--brand` |
| Per-component skins | Compose shadcn atoms under the kit |

Density follows **task**, not a user slider. Motion stays **functional + short** and honors `prefers-reduced-motion`.

## Agent workflow

1. User picks presets on `/{id}/theme` (or names ids in chat).
2. Call `apply_prefs({ brand, radius, paper })`.
3. Write returned CSS/JSON into the project; import the CSS.
4. Compose UI under `get_contract` / recipes.
5. `validate_ui` before done.

```json
{
  "contractId": "meridian",
  "brand": "teal",
  "radius": "compact",
  "paper": "warm",
  "surface": "application"
}
```

Unknown ids → rejection. Extra keys → rejection.
