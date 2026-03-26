# Astro Markdown Site Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Convert the single HTML protocol page into an Astro site where all page content lives in shareable Markdown files and the full copyable prompt is assembled from those Markdown sources.

**Architecture:** Bootstrap a minimal Astro project, store page content in `src/content/<page>/*.md`, validate frontmatter with `astro:content`, render sections through shared Astro components selected by `template`, and generate the copyable prompt from content data instead of scraping the DOM. Keep one shared visual system so future pages can reuse the same tokens, typography, and section patterns.

**Tech Stack:** Astro, TypeScript, `astro:content`, Markdown, CSS

---

### Task 1: Bootstrap the Astro project in place

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/env.d.ts`
- Create: `src/pages/index.astro`
- Keep as reference: `_in/index_cnhdnkat.html`

**Step 1: Scaffold the Astro app**

Run: `npm create astro@latest . -- --template minimal --typescript strict --install`
Expected: Astro creates the base app files without deleting `_in/index_cnhdnkat.html`.

**Step 2: Verify the scaffold exists**

Run: `rg --files package.json astro.config.mjs tsconfig.json src`
Expected: all scaffold files are present.

**Step 3: Start the dev server once**

Run: `npm run dev`
Expected: Astro starts and serves the default page locally.

**Step 4: Stop the dev server**

Expected: workspace is ready for content and component work.

### Task 2: Define the content model and collection schema

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/main/01-about.md`
- Create: `src/content/main/02-goal.md`
- Create: `src/content/main/03-context.md`
- Create: `src/content/main/04-principles.md`
- Create: `src/content/main/05-members.md`
- Create: `src/content/main/06-cobet.md`
- Create: `src/content/main/07-pulse.md`
- Create: `src/content/main/08-apply.md`

**Step 1: Write the collection schema**

Implement a `main` collection with shared fields:

```ts
import { defineCollection, z } from "astro:content";

const badgeSchema = z.object({
  label: z.string(),
});

const agentSchema = z.object({
  name: z.string(),
  role: z.string(),
  ascii: z.string(),
  badges: z.array(badgeSchema).default([]),
  summary: z.string(),
  system_prompt: z.string(),
});

const principleSchema = z.object({
  number: z.string(),
  title: z.string(),
  body: z.string(),
  proposed: z.boolean().optional(),
});

const main = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    order: z.number(),
    last_modified: z.string(),
    template: z.enum(["default", "principles", "members", "agents", "pulse", "apply"]),
    nav_label: z.string().optional(),
    intro: z.string().optional(),
    granted: z.array(z.string()).optional(),
    denied: z.array(z.string()).optional(),
    aside: z.string().optional(),
    principles: z.array(principleSchema).optional(),
    agents: z.array(agentSchema).optional(),
    steps: z.array(z.string()).optional(),
    subsections: z.array(
      z.object({
        title: z.string(),
        meta: z.string().optional(),
        badges: z.array(z.string()).default([]),
        paragraphs: z.array(z.string()).default([]),
      })
    ).optional(),
    include_in_prompt: z.boolean().default(true),
  }),
});

export const collections = { main };
```

**Step 2: Convert the HTML page into 8 Markdown source files**

Move all copy from `_in/index_cnhdnkat.html` into the new `src/content/main/*.md` files.
Use Markdown body for prose and YAML frontmatter for structured lists/cards.

**Step 3: Validate the content schema**

Run: `npm run astro check`
Expected: collection schema passes and all markdown files are valid.

### Task 3: Build the shared layout and style system

**Files:**
- Create: `src/layouts/MainLayout.astro`
- Create: `src/styles/tokens.css`
- Create: `src/styles/base.css`
- Create: `src/styles/components.css`

**Step 1: Define shared tokens**

Put colors, fonts, spacing, borders, and radii in `src/styles/tokens.css`.
Carry over the protocol palette from the HTML reference.

**Step 2: Define base typography and layout**

Put document-level styles in `src/styles/base.css`:
- `body`
- `.page`
- `.nav`
- `.section`
- headings
- prose rules

**Step 3: Define reusable component classes**

Put reusable classes in `src/styles/components.css`:
- prompt block
- badges
- access blocks
- agent cards
- lab card
- CTA buttons
- toast

**Step 4: Wire styles into the layout**

Import all CSS once in `src/layouts/MainLayout.astro`.

### Task 4: Build shared section renderers

**Files:**
- Create: `src/components/sections/DefaultSection.astro`
- Create: `src/components/sections/PrinciplesSection.astro`
- Create: `src/components/sections/MembersSection.astro`
- Create: `src/components/sections/AgentsSection.astro`
- Create: `src/components/sections/PulseSection.astro`
- Create: `src/components/sections/ApplySection.astro`
- Create: `src/components/Nav.astro`

**Step 1: Create the shared section shell**

Each section component should render:
- `id` from `slug`
- title
- section-level `last_modified`
- body content when present

**Step 2: Implement the specialized templates**

Map structured frontmatter into styled blocks:
- `principles` -> numbered cards
- `members` -> granted/denied lists
- `agents` -> agent cards with ASCII, badges, summary, and prompt block
- `pulse` -> subsection cards and badges
- `apply` -> ordered steps and CTA area

**Step 3: Build top navigation**

Create `Nav.astro` from collection entries sorted by `order`.

### Task 5: Assemble the index page from content

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/lib/content.ts`

**Step 1: Create a helper that loads and sorts the collection**

Implement a helper that:
- reads all entries from `main`
- sorts by `order`
- computes global `last_modified` as the max section date
- returns nav items and section entries

**Step 2: Render the page through a template registry**

Use a registry like:

```ts
const templates = {
  default: DefaultSection,
  principles: PrinciplesSection,
  members: MembersSection,
  agents: AgentsSection,
  pulse: PulseSection,
  apply: ApplySection,
} as const;
```

**Step 3: Recreate the page chrome**

Render:
- top nav
- banner
- banner meta using computed global `last_modified`
- intro quote
- all content sections
- footer protocol block

### Task 6: Generate the full prompt and copy interaction

**Files:**
- Create: `src/lib/prompt.ts`
- Create: `src/components/PromptCopyButton.astro`
- Create: `src/components/CopyToast.astro`
- Modify: `src/components/sections/ApplySection.astro`

**Step 1: Write a deterministic prompt builder**

Create a function that serializes the content entries into one plain-text prompt in section order.
Do not read from the DOM.

**Step 2: Mirror the existing document semantics**

The prompt builder should include:
- banner text
- protocol meta
- intro quote
- section headings
- section `last_modified`
- paragraphs from markdown body
- structured content from frontmatter arrays
- final footer block

**Step 3: Wire the copy button**

Pass the assembled prompt string into `PromptCopyButton.astro`.
Use the Clipboard API with a textarea fallback.

**Step 4: Verify prompt correctness manually**

Run: `npm run dev`
Expected: button copies the assembled prompt and the copied text matches the content sources, not the rendered DOM quirks.

### Task 7: Document the rules for humans and agents

**Files:**
- Modify: `AGENTS.md`
- Create: `docs/content-architecture.md`

**Step 1: Add hard rules to `AGENTS.md`**

Document non-negotiables:
- markdown is source of truth
- no duplicated copy in Astro files
- `last_modified` changes only with content edits
- prompt is assembled from content
- shared styles and reusable section components are preferred

**Step 2: Write the detailed architecture guide**

Document:
- folder structure
- frontmatter contracts per template
- rules for adding new pages
- style layers and reuse rules
- how prompt assembly works

### Task 8: Verify the system end-to-end

**Files:**
- Verify: `src/pages/index.astro`
- Verify: `src/content/main/*.md`
- Verify: `docs/content-architecture.md`
- Verify: `AGENTS.md`

**Step 1: Run type/content checks**

Run: `npm run astro check`
Expected: PASS

**Step 2: Run production build**

Run: `npm run build`
Expected: PASS and Astro emits the site successfully.

**Step 3: Manual review checklist**

Check:
- nav anchors work
- section order matches source files
- global `last_modified` equals the freshest section date
- changing CSS only does not require markdown date changes
- copy button copies the prebuilt prompt
- future sections can reuse the existing templates and styles

**Step 4: Commit if the repository is initialized**

Run: `git status`
Expected: if this becomes a git repo later, commit after successful verification; if not, skip commit for now.
