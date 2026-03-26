import { describe, expect, it } from "vitest";
import type { AgentEntry, MainSectionEntry } from "../src/lib/content";

const sampleEntries: MainSectionEntry[] = [
  {
    id: "02-goal",
    collection: "main",
    body: "Goal body",
    data: {
      title: "Goal",
      slug: "goal",
      order: 2,
      last_modified: "2026-03-18",
      template: "default",
      nav_label: "goal",
      include_in_prompt: true,
    },
  },
  {
    id: "01-about",
    collection: "main",
    body: "About body",
    data: {
      title: "About",
      slug: "about",
      order: 1,
      last_modified: "2026-03-20",
      template: "default",
      nav_label: "about",
      include_in_prompt: true,
    },
  },
  {
    id: "08-apply",
    collection: "main",
    body: "Apply body",
    data: {
      title: "Apply",
      slug: "apply",
      order: 8,
      last_modified: "2026-03-19",
      template: "apply",
      nav_label: "apply",
      steps: ["Step 1", "Step 2"],
      include_in_prompt: true,
    },
  },
];

const promptEntries: MainSectionEntry[] = [
  ...sampleEntries,
  {
    id: "06-cobet",
    collection: "main",
    body: "",
    data: {
      title: "COBET",
      slug: "cobet",
      order: 6,
      last_modified: "2026-03-27",
      template: "agents",
      nav_label: "COBET",
      intro: "COBET intro",
      include_in_prompt: true,
    },
  },
];

const sampleAgents: AgentEntry[] = [
  {
    id: "02-melchior",
    collection: "agents",
    body: "",
    data: {
      name: "MELCHIOR",
      slug: "melchior",
      order: 2,
      role: "Системщик",
      last_modified: "2026-03-27",
      badges: [{ label: "status: draft" }],
      summary: "System summary",
      system_prompt: "Melchior prompt",
      prompt_label: "system_prompt",
    },
  },
  {
    id: "03-balthasar",
    collection: "agents",
    body: "",
    data: {
      name: "BALTHASAR",
      slug: "balthasar",
      order: 3,
      role: "Критик",
      last_modified: "2026-03-27",
      badges: [{ label: "status: draft" }],
      summary: "Balthasar summary",
      system_prompt: "Balthasar prompt",
      prompt_label: "system_prompt",
    },
  },
  {
    id: "01-caspar",
    collection: "agents",
    body: "",
    data: {
      name: "CASPAR",
      slug: "caspar",
      order: 1,
      role: "Прагматик",
      last_modified: "2026-03-27",
      badges: [{ label: "status: draft" }],
      summary: "Caspar summary",
      system_prompt: "Caspar prompt",
      prompt_label: "system_prompt",
    },
  },
];

describe("deriveMainPageData", () => {
  it("sorts sections and computes global metadata", async () => {
    const contentModule = await import("../src/lib/content").catch(() => null);

    expect(contentModule?.deriveMainPageData).toBeTypeOf("function");
    if (!contentModule?.deriveMainPageData) {
      return;
    }

    const pageData = contentModule.deriveMainPageData(sampleEntries);

    expect(pageData.globalLastModified).toBe("2026-03-20");
    expect(pageData.sections.map((section) => section.data.slug)).toEqual([
      "about",
      "goal",
      "apply",
    ]);
    expect(pageData.navItems).toEqual([
      { href: "#about", label: "about" },
      { href: "#goal", label: "goal" },
      { href: "#apply", label: "apply" },
    ]);
  });
});

describe("deriveAgentEntries", () => {
  it("sorts agent entries by order", async () => {
    const contentModule = await import("../src/lib/content").catch(() => null);

    expect(contentModule?.deriveAgentEntries).toBeTypeOf("function");
    if (!contentModule?.deriveAgentEntries) {
      return;
    }

    const agents = contentModule.deriveAgentEntries(sampleAgents);

    expect(agents.map((agent) => agent.data.name)).toEqual([
      "CASPAR",
      "MELCHIOR",
      "BALTHASAR",
    ]);
  });
});

describe("buildProtocolPrompt", () => {
  it("serializes prompt text from sorted content entries", async () => {
    const promptModule = await import("../src/lib/prompt").catch(() => null);

    expect(promptModule?.buildProtocolPrompt).toBeTypeOf("function");
    if (!promptModule?.buildProtocolPrompt) {
      return;
    }

    const prompt = promptModule.buildProtocolPrompt({
      sections: promptEntries,
      agents: sampleAgents,
      globalLastModified: "2026-03-20",
    });

    expect(prompt).toContain("protocol v0.1 | last_modified: 2026-03-20");
    expect(prompt).toContain("# about");
    expect(prompt).toContain("last_modified: 2026-03-20");
    expect(prompt).toContain("# apply");
    expect(prompt).toContain("# COBET");
    expect(prompt).toContain("1. Step 1");
    expect(prompt).toContain("2. Step 2");
    expect(prompt).toContain("## CASPAR | Прагматик");
    expect(prompt).toContain("Melchior prompt");
    expect(prompt).toContain("Balthasar prompt");
    expect(prompt).toContain("end_of_document");
  });
});
