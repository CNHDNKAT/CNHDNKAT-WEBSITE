import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("PromptCopyButton", () => {
  it("uses the copy prompt label", () => {
    const componentPath = resolve(process.cwd(), "src/components/PromptCopyButton.astro");
    const source = readFileSync(componentPath, "utf8");

    expect(source).toContain("copy prompt");
    expect(source).not.toContain("copy full document");
  });
});
