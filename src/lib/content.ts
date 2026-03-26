import type { CollectionEntry } from "astro:content";

export type MainSectionEntry = CollectionEntry<"main">;
export type AgentEntry = CollectionEntry<"agents">;

export interface NavItem {
  href: string;
  label: string;
}

export interface MainPageData {
  sections: MainSectionEntry[];
  navItems: NavItem[];
  globalLastModified: string;
}

export function deriveAgentEntries(entries: readonly AgentEntry[]): AgentEntry[] {
  return [...entries].sort((left, right) => left.data.order - right.data.order);
}

export function deriveMainPageData(entries: readonly MainSectionEntry[]): MainPageData {
  const sections = [...entries].sort((left, right) => left.data.order - right.data.order);
  const navItems = sections.map((section) => ({
    href: `#${section.data.slug}`,
    label: section.data.slug,
  }));
  const globalLastModified = sections.reduce(
    (latest, section) =>
      section.data.last_modified > latest ? section.data.last_modified : latest,
    "",
  );

  return {
    sections,
    navItems,
    globalLastModified,
  };
}
