import { parse as tsParse } from "@typescript-eslint/parser"

export interface Node {
  type: string
  range: [number, number]
  [k: string]: unknown
}

export function parse(code: string): Node {
  return tsParse(code, {
    ecmaFeatures: { jsx: true },
    range: true,
    loc: false,
  }) as unknown as Node
}

/** Depth-first walk; calls visit(node) for every node with a string `type`. */
export function walk(node: Node, visit: (n: Node) => void): void {
  visit(node)
  for (const key of Object.keys(node)) {
    if (key === "parent" || key === "range" || key === "loc") continue
    const child = (node as Record<string, unknown>)[key]
    if (Array.isArray(child)) {
      for (const c of child)
        if (c && typeof (c as Node).type === "string") walk(c as Node, visit)
    } else if (child && typeof (child as Node).type === "string") {
      walk(child as Node, visit)
    }
  }
}
