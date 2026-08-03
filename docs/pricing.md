# Pricing — why the MCP is open source

> Cost research (Aug 2026). Decision: **open source every design-contract MCP.**  
> Charging for compute we do not run fails the “~50% markup on real cost” bar.

## What customers actually run

| Piece | Where it runs | Cost to the publisher |
| --- | --- | --- |
| MCP server (`packages/contract-mcp`) | **Customer machine** via stdio (Cursor / Claude Desktop spawns it) | **$0** — [stdio has no hosting cost](https://amgres.com/blog/mcp-stdio-vs-streamable-http) |
| Contract JSON `/r/{id}.contract.json` | Static file on the catalog site (CDN) | Negligible bandwidth on existing site hosting |
| Machine docs (`design.md`, `agents.md`, …) | Same site / negotiated routes | Negligible |
| `validate_ui` / recipes | Local CPU in the MCP process | **$0** to the publisher |

For the default install path, **per-contract MCP marginal cost ≈ $0/month**.

## If we hosted remote MCP (optional later)

Only needed for cloud agents that cannot spawn stdio. Ballpark infra (shared across *all* contracts, not per system):

| Option | Typical monthly floor | Notes |
| --- | --- | --- |
| [Cloudflare Workers Free](https://developers.cloudflare.com/workers/platform/pricing/) | **$0** | 100k requests/day, 10ms CPU/invocation |
| Workers Paid | **$5** | 10M requests + 30M CPU-ms included |
| Small VPS / Railway-class | **~$5–10** | Long-lived Streamable HTTP ([hosting survey](https://hostingsift.com/blog/mcp-server-hosting-guide-2026)) |
| Site itself (Vercel Hobby → Pro) | **$0 → $20/seat** | Already needed for the catalog; not MCP-specific ([Vercel pricing](https://vercel.com/pricing)) |

Even at **$5–20/mo** total remote infra for the whole platform, a 50% markup is **~$7.50–30/mo for the entire product**, not $9 per contract per seat. Spreading that across users makes per-seat MCP fees pennies — not a credible paid SKU.

## Decision

| Model | Verdict |
| --- | --- |
| **$9/mo per MCP** | Rejected — markup on ~$0 (stdio) or shared ~$5 infra is not honest |
| **Open source MCP + contracts** | **Ship this** — cost is negligible; distribution is the product |
| Paid later (optional) | Hosted remote MCP with auth, team analytics, or support retainers — only if real COGS appear |

Platform constant: `MCP_PRICE_USD = 0` · `pricingModel: "open-source"` in `lib/platform/skeleton.ts`.

## Sources

- [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [MCP stdio vs Streamable HTTP](https://amgres.com/blog/mcp-stdio-vs-streamable-http)
- [MCP server hosting guide 2026](https://hostingsift.com/blog/mcp-server-hosting-guide-2026)
- [Vercel pricing](https://vercel.com/pricing)
