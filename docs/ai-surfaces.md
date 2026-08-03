# Meridian — ai-surfaces.md

> Object-bound AI UI. Ranking: [`influences.md`](./influences.md).  
> **Primary absorb:** Cursor application composer · OpenAI provenance simplicity · Fluent/Polaris quiet chrome · anti-drift contracts.

## 1. Laws

1. **AI attaches to a product object** — issue, file, tool call, verification step — never a floating chatbot.  
2. **Show provenance** — `data-provenance` + mono labels (`user` · `assistant` · `tool` · `source` · `app` · `action`).  
3. **Activity encodes verb** — `bg-activity-thinking|search|read|edit` — not decoration.  
4. **Rail is optional** — appear when selection needs it (progressive disclosure).  
5. **Same material laws** — control radius, thin stroke, brand wash selection.  
6. **Agents authoring UI** follow `design.md` / `agents.md` — freeze tokens, compose shadcn.

## 2. Canonical layouts

### Workbench agent rail

```
[ index with selected row bg-brand/10 ]
[ rail header: Sparkle + mono object id ]
[ events: provenance cards edge ]
[ input: ask about this object ]
```

### Composer shell

```
[ explorer files ]
[ tabs + editor — highlight agent edit line ]
[ agent pane: user → assistant(+spin) → tool ]
```

Proofs: `workbench.tsx`, `composer-shell.tsx`.

## 3. Provenance card anatomy

```
┌─────────────────────────────┐
│ mono label   [activity chip]│
│ body text 12–13px           │
│ optional mono path / tool   │
└─────────────────────────────┘
```

- Surface: `bg-card` + `edge`  
- Radius: `rounded-lg` (control-scale message)  
- No avatar soup unless identity matters  

## 4. Activity semantics

| Activity | Meaning |
| --- | --- |
| thinking | Model reasoning |
| search | Retrieval |
| read | Inspecting source |
| edit | Writing code/content |

Do not reuse as general accent chips.

## 5. Copy tone

| Do | Don’t |
| --- | --- |
| Bound to `ISS-1842` | “Chat with AI” |
| “Ask about this issue…” | “Ask me anything” |
| Mono tool filenames | Vague “Assistant said” without object |

## 6. Anti-drift for AI authors

From [Superdesign](https://superdesign.dev/blog/ai-design-system-drift):

| Failure | Meridian fix |
| --- | --- |
| Token fabrication | `@/lib/design` + lint |
| Within-session drift | Skills + proofs |
| Between-session amnesia | `design.md` / `agents.md` every session |
| Silent breaking changes | Reviewer agent + tests |

## 7. States

| State | UI |
| --- | --- |
| Idle | Rail hidden or “Ready” |
| Bound | Mono id in header |
| Working | Spinner + activity chip |
| Error | Destructive inline on rail |
| Review needed | Clear accept/reject affordance near diff |

## 8. Agent checklist

- [ ] Object id visible  
- [ ] `data-provenance` on events  
- [ ] Activity token if tool running  
- [ ] No floating widget  
- [ ] Contrast on paper + theater  

## Sources

- Cursor application patterns (in-repo proofs)
- [Superdesign — AI design system drift](https://superdesign.dev/blog/ai-design-system-drift)
- [Fluent 2](https://fluent2.microsoft.design/) material for chrome
- [Polaris Pro](https://polaris-react.shopify.com/design/pro-design-language) meaning
