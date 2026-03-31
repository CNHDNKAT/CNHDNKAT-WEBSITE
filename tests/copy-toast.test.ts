import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("CopyToast", () => {
  it("uses the prompt copied message by default", () => {
    const componentPath = resolve(process.cwd(), "src/components/CopyToast.astro");
    const source = readFileSync(componentPath, "utf8");

    expect(source).toContain('message = "Промпт скопирован"');
    expect(source).not.toContain('message = "Документ скопирован"');
  });
});
