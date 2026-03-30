import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("MainLayout metadata", () => {
  it("defines SEO, social sharing, and favicon assets", () => {
    const layoutPath = resolve(process.cwd(), "src/layouts/MainLayout.astro");
    const source = readFileSync(layoutPath, "utf8");

    expect(source).toContain('meta name="description"');
    expect(source).toContain('property="og:title"');
    expect(source).toContain('property="og:image"');
    expect(source).toContain('name="twitter:card"');
    expect(source).toContain('rel="apple-touch-icon"');
    expect(source).toContain('rel="canonical"');
    expect(source).toContain("import.meta.env.BASE_URL");
  });

  it("ships branded share and favicon assets", () => {
    const requiredAssets = [
      "public/favicon-16x16.png",
      "public/favicon-32x32.png",
      "public/apple-touch-icon.png",
      "public/share.jpg",
    ];

    for (const assetPath of requiredAssets) {
      expect(existsSync(resolve(process.cwd(), assetPath)), assetPath).toBe(true);
    }
  });
});
