import { describe, it, expect } from "vitest";
import { RuleTester } from "eslint";
import parser from "@typescript-eslint/parser";
import { onSystem } from "../src/rule.js";

const tester = new RuleTester({
  languageOptions: { parser, parserOptions: { ecmaFeatures: { jsx: true } } },
});

describe("byronwade-ui/on-system", () => {
  it("passes valid + flags invalid", () => {
    tester.run("on-system", onSystem, {
      valid: [{ code: `const x = <div className="bg-brand p-4" />;` }],
      invalid: [{
        code: `const x = <div className="text-[#16a34a]" />;`,
        output: `const x = <div className="text-brand" />;`,
        errors: 1,
      }],
    });
    expect(true).toBe(true);
  });
});
