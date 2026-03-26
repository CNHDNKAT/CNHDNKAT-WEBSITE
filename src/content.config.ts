import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const badgeSchema = z.object({
  label: z.string(),
});

const agentSchema = z.object({
  name: z.string(),
  slug: z.string(),
  order: z.number(),
  role: z.string(),
  last_modified: z.string(),
  badges: z.array(badgeSchema).default([]),
  summary: z.string(),
  system_prompt: z.string(),
  prompt_label: z.string().default("system_prompt"),
});

const principleSchema = z.object({
  number: z.string(),
  title: z.string(),
  body: z.string(),
  proposed: z.boolean().optional(),
});

const main = defineCollection({
  loader: glob({
    base: "./src/content/main",
    pattern: "**/*.md",
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    order: z.number(),
    last_modified: z.string(),
    template: z.enum([
      "default",
      "principles",
      "members",
      "agents",
      "pulse",
      "apply",
    ]),
    nav_label: z.string().optional(),
    intro: z.string().optional(),
    granted: z.array(z.string()).optional(),
    denied: z.array(z.string()).optional(),
    aside: z.string().optional(),
    principles: z.array(principleSchema).optional(),
    steps: z.array(z.string()).optional(),
    subsections: z
      .array(
        z.object({
          title: z.string(),
          meta: z.string().optional(),
          badges: z.array(z.string()).default([]),
          paragraphs: z.array(z.string()).default([]),
        }),
      )
      .optional(),
    include_in_prompt: z.boolean().default(true),
  }),
});

const agents = defineCollection({
  loader: glob({
    base: "./src/content/agents",
    pattern: "**/*.md",
  }),
  schema: agentSchema,
});

export const collections = { main, agents };
