import promptDocument from "../content/prompt.md?raw";
import type { AgentEntry, MainSectionEntry } from "./content";
import {
  PROTOCOL_BANNER,
  PROTOCOL_INTRO,
  PROTOCOL_VERSION,
} from "./protocol";
import { typografText } from "./typograf";

interface ReadPromptDocumentInput {
  sections: readonly MainSectionEntry[];
  agents: readonly AgentEntry[];
  globalLastModified: string;
}

function normalizeMarkdownBody(body?: string): string {
  if (!body) {
    return "";
  }

  return body
    .replace(/<!--.*?-->/gs, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n\n");
}

function serializeSection(
  section: MainSectionEntry,
  agents: readonly AgentEntry[],
): string {
  const lines: string[] = [
    `# ${section.data.nav_label ?? section.data.slug}`,
    `last_modified: ${section.data.last_modified}`,
  ];

  const body = normalizeMarkdownBody(section.body);
  if (body) {
    lines.push(body);
  }

  if (section.data.principles) {
    for (const principle of section.data.principles) {
      lines.push(`${principle.number} — ${principle.title}`);
      lines.push(principle.body);
    }
  }

  if (section.data.granted?.length) {
    lines.push("access_granted:");
    for (const item of section.data.granted) {
      lines.push(`— ${item}`);
    }
  }

  if (section.data.denied?.length) {
    lines.push("access_denied:");
    for (const item of section.data.denied) {
      lines.push(`— ${item}`);
    }
  }

  if (section.data.aside) {
    lines.push(section.data.aside);
  }

  if (section.data.intro) {
    lines.push(section.data.intro);
  }

  if (section.data.slug === "cobet") {
    for (const agent of agents) {
      lines.push(`## ${agent.data.name} | ${agent.data.role}`);
      if (agent.data.badges.length) {
        lines.push(agent.data.badges.map((badge) => badge.label).join(" | "));
      }
      lines.push(agent.data.summary);
      lines.push(
        `${agent.data.prompt_label}:\n\`\`\`\n${agent.data.system_prompt}\n\`\`\``,
      );
    }
  }

  if (section.data.subsections) {
    for (const subsection of section.data.subsections) {
      lines.push(`## ${subsection.title}`);
      if (subsection.meta) {
        lines.push(subsection.meta);
      }
      if (subsection.badges.length) {
        lines.push(subsection.badges.join(" | "));
      }
      for (const paragraph of subsection.paragraphs) {
        lines.push(normalizeMarkdownBody(paragraph));
      }
    }
  }

  if (section.data.steps) {
    section.data.steps.forEach((step, index) => {
      lines.push(`${index + 1}. ${step}`);
    });
  }

  return lines.filter(Boolean).join("\n\n");
}

function buildProtocolPrelude({
  sections,
  agents,
  globalLastModified,
}: ReadPromptDocumentInput): string {
  const sortedSections = [...sections]
    .sort((left, right) => left.data.order - right.data.order)
    .filter((section) => section.data.include_in_prompt !== false);
  const applyIndex = sortedSections.findIndex((section) => section.data.slug === "apply");
  const sectionsBeforeApply =
    applyIndex === -1 ? sortedSections : sortedSections.slice(0, applyIndex);

  return [
    PROTOCOL_BANNER,
    `${PROTOCOL_VERSION} | last_modified: ${globalLastModified}`,
    `> ${PROTOCOL_INTRO}`,
    ...sectionsBeforeApply.map((section) => serializeSection(section, agents)),
  ].join("\n\n");
}

export async function readPromptDocument(input?: ReadPromptDocumentInput): Promise<string> {
  const promptTemplate = typografText(promptDocument.trim());

  if (!input) {
    return promptTemplate;
  }

  return [buildProtocolPrelude(input), promptTemplate].join("\n\n").trim();
}
