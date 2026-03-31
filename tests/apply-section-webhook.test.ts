import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("ApplySection dialog webhook", () => {
  it("renders a dialog link form and posts it to the n8n webhook", () => {
    const componentPath = resolve(
      process.cwd(),
      "src/components/sections/ApplySection.astro",
    );
    const source = readFileSync(componentPath, "utf8");

    expect(source).toContain('type="text"');
    expect(source).toContain('name="dialogUrl"');
    expect(source).toContain('name="telegramUsername"');
    expect(source).toContain(
      "https://n8n.khabaroff.com/webhook/586a1568-5779-40bf-98ab-bd222fb82798",
    );
    expect(source).toContain("new URLSearchParams({ dialogUrl, telegramUsername })");
    expect(source).toContain("new Image()");
    expect(source).toContain("requestUrl");
    expect(source).toContain('class="dialog-link-inline"');
    expect(source).not.toContain("поделиться ссылкой на диалог");
    expect(source).toContain('pattern="https://.*"');
    expect(source).toContain('placeholder="@nickname"');
    expect(source).not.toContain("navigator.sendBeacon");
    expect(source).not.toContain("fetch(webhookUrl");
  });

  it("places the prompt copy button into the section header actions slot", () => {
    const componentPath = resolve(
      process.cwd(),
      "src/components/sections/ApplySection.astro",
    );
    const source = readFileSync(componentPath, "utf8");

    expect(source).toContain('<PromptCopyButton slot="header-actions"');
    expect(source).not.toContain("<PromptCopyButton prompt={prompt} toastId={toastId} />");
  });
});

describe("SectionShell header actions", () => {
  it("renders an optional header actions slot below last_modified", () => {
    const componentPath = resolve(
      process.cwd(),
      "src/components/sections/SectionShell.astro",
    );
    const source = readFileSync(componentPath, "utf8");

    expect(source).toContain('Astro.slots.has("header-actions")');
    expect(source).toContain('<slot name="header-actions" />');
    expect(source).toContain('class="section-header-actions"');
  });
});
