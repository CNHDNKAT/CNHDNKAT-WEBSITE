import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("capture C page", () => {
  it("provides a dedicated Astro route for the screenshot", () => {
    const pagePath = resolve(process.cwd(), "src/pages/capture-c.astro");

    expect(existsSync(pagePath)).toBe(true);

    const source = readFileSync(pagePath, "utf8");

    expect(source).toContain('pageTitle="Capture C | CNHDNKAT"');
    expect(source).toContain('class="capture-c-page"');
    expect(source).toContain("<pre");
    expect(source).toContain("██████╗");
    expect(source).toContain("╚═════╝");
  });
});
