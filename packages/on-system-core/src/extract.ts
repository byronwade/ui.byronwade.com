import type { Node } from "./parse.js"
import { walk } from "./parse.js"

export interface ClassToken {
  value: string
  range: [number, number]
}
export interface StyleString {
  value: string
  prop: string
  range: [number, number]
}
export interface JsxElement {
  name: string
  range: [number, number]
}

/** Split a static class string into tokens, each with absolute source offsets. */
function splitClasses(text: string, base: number): ClassToken[] {
  const out: ClassToken[] = []
  const re = /\S+/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text)))
    out.push({
      value: m[0],
      range: [base + m.index, base + m.index + m[0].length],
    })
  return out
}

/** Static string parts of a className value, with absolute offsets (literal start + 1 for the quote). */
function stringParts(node: Node): { text: string; base: number }[] {
  if (node.type === "Literal" && typeof node.value === "string") {
    return [{ text: node.value as string, base: node.range[0] + 1 }]
  }
  if (node.type === "TemplateLiteral") {
    return (node.quasis as Node[]).map((q) => ({
      text: (q.value as { cooked?: string } | undefined)?.cooked ?? "",
      base: q.range[0] + 1,
    }))
  }
  if (node.type === "CallExpression") {
    // cn(...) / clsx(...) / cva(...) — recurse into string + template args
    return (node.arguments as Node[]).flatMap((a) => stringParts(a))
  }
  if (node.type === "LogicalExpression") {
    // a && "cls" / a || "cls" — recurse both sides
    return [
      ...stringParts(node.left as Node),
      ...stringParts(node.right as Node),
    ]
  }
  if (node.type === "ConditionalExpression") {
    // a ? "x" : "y" — recurse both branches
    return [
      ...stringParts(node.consequent as Node),
      ...stringParts(node.alternate as Node),
    ]
  }
  if (node.type === "ObjectExpression") {
    // clsx object syntax { "cls": cond } — treat string-literal keys as class strings
    const parts: { text: string; base: number }[] = []
    for (const prop of node.properties as Node[]) {
      const key = prop.key as Node | undefined
      if (key && key.type === "Literal" && typeof key.value === "string") {
        parts.push({ text: key.value as string, base: key.range[0] + 1 })
      }
    }
    return parts
  }
  return []
}

/** Static class tokens of a single className/class JSXAttribute. */
function attrClassTokens(attr: Node): ClassToken[] {
  const value = attr.value as Node | null
  if (!value) return []
  const expr =
    value.type === "JSXExpressionContainer" ? (value.expression as Node) : value
  const out: ClassToken[] = []
  for (const { text, base } of stringParts(expr))
    out.push(...splitClasses(text, base))
  return out
}

const isClassAttr = (n: Node) => {
  const name = (n.name as { name?: string } | undefined)?.name
  return name === "className" || name === "class"
}

export function extractClassTokens(ast: Node): ClassToken[] {
  const out: ClassToken[] = []
  walk(ast, (n) => {
    if (n.type === "JSXAttribute" && isClassAttr(n))
      out.push(...attrClassTokens(n))
  })
  return out
}

export interface ElementClasses {
  name: string
  classes: ClassToken[]
}

/** Each JSX opening element paired with its own className tokens (for element-scoped rules). */
export function extractElementClasses(ast: Node): ElementClasses[] {
  const out: ElementClasses[] = []
  walk(ast, (n) => {
    if (n.type !== "JSXOpeningElement") return
    const nm = n.name as { type: string; name?: string }
    if (nm.type !== "JSXIdentifier" || !nm.name) return
    const classes: ClassToken[] = []
    for (const attr of n.attributes as Node[]) {
      if (attr.type === "JSXAttribute" && isClassAttr(attr))
        classes.push(...attrClassTokens(attr))
    }
    out.push({ name: nm.name, classes })
  })
  return out
}

export function extractStyleStrings(ast: Node): StyleString[] {
  const out: StyleString[] = []
  walk(ast, (n) => {
    if (n.type !== "JSXAttribute") return
    if ((n.name as { name?: string } | undefined)?.name !== "style") return
    const value = n.value as Node | null
    if (!value || value.type !== "JSXExpressionContainer") return
    const obj = value.expression as Node
    if (obj.type !== "ObjectExpression") return
    for (const p of obj.properties as Node[]) {
      const key = p.key as { name?: string; value?: string } | undefined
      const prop = key?.name ?? key?.value ?? ""
      const v = p.value as Node | undefined
      if (v && v.type === "Literal" && typeof v.value === "string") {
        out.push({
          value: v.value as string,
          prop: String(prop),
          range: [v.range[0] + 1, v.range[1] - 1],
        })
      }
    }
  })
  return out
}

export function extractJsxElements(ast: Node): JsxElement[] {
  const out: JsxElement[] = []
  walk(ast, (n) => {
    if (n.type !== "JSXOpeningElement") return
    const nm = n.name as { type: string; name?: string }
    if (nm.type === "JSXIdentifier" && nm.name)
      out.push({ name: nm.name, range: (n.name as Node).range })
  })
  return out.sort((a, b) => a.range[0] - b.range[0])
}
