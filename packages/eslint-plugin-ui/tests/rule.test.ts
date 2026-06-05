import { RuleTester } from "eslint"
import parser from "@typescript-eslint/parser"
import { onSystem } from "../src/rule.js"

// ESLint's RuleTester.run() registers its own `describe`/`it` blocks via the
// global test hooks. Under Vitest 4 those suite functions may not be called from
// inside a running `it()` ("Calling the suite function inside test function is
// not allowed"), so we invoke it at module top level and let RuleTester own the
// suite/case registration.
const tester = new RuleTester({
  languageOptions: { parser, parserOptions: { ecmaFeatures: { jsx: true } } },
})

tester.run("on-system", onSystem, {
  valid: [{ code: `const x = <div className="bg-brand p-4" />;` }],
  invalid: [
    {
      code: `const x = <div className="text-[#16a34a]" />;`,
      output: `const x = <div className="text-brand" />;`,
      errors: 1,
    },
  ],
})
