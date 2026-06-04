# @byronwade/eval

Measures how on-system Claude's generated UI is **with** the byronwade/ui design rule
versus **without** it, graded by `@byronwade/on-system-core` (all five detectors strict —
zero violations = on-system).

## Run

```bash
# real run (spends API budget: ~24 claude-sonnet-4-6 calls, rule prompt-cached)
ANTHROPIC_API_KEY=sk-... npm run eval

# wiring smoke test, no API calls (uses recorded fixtures)
npm run eval -- --dry-run
```

Outputs `packages/eval/results/latest.json` (machine-readable, read by the homepage) and
`latest.md` (human summary). Single generation per cell at temperature 0 — a dated
snapshot, not a guaranteed-stable number.
