// Recorded-style responses for --dry-run + tests. Keyed by "<prompt>:<condition>".
// with-rule responses are on-system; baseline responses contain off-system code.
export const ON_SYSTEM = "```tsx\nexport function Demo() {\n  return <div className=\"bg-card text-foreground p-4 rounded-lg\"><span className=\"bg-brand text-primary-foreground\">ok</span></div>;\n}\n```";
export const OFF_SYSTEM = "```tsx\nexport function Demo() {\n  return <div style={{ color: \"#16a34a\" }} className=\"p-[13px]\"><button>go</button></div>;\n}\n```";
