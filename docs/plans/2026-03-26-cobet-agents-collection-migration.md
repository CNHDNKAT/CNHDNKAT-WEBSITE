# COBET Agents Collection Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Split the three COBET agents out of the `main` page collection into their own Markdown entries so content, visuals, and rendering can evolve independently.

**Architecture:** Keep `src/content/main/06-cobet.md` as the page section shell with intro and section metadata only. Add a dedicated `agents` content collection for `CASPAR`, `MELCHIOR`, and `BALTHASAR`, then render those entries inside `AgentsSection.astro` in `order` sequence. Move visual glyphs out of Markdown and into dedicated Astro presentation components so agent presentation becomes a flat UI concern instead of content data.

**Tech Stack:** Astro 6, TypeScript, `astro:content`, `astro/loaders`, Markdown, Vitest, CSS

---

### Task 1: Create the planning gate for the architecture change

**Files:**
- Create: `openspec/changes/add-agents-collection/proposal.md`
- Create: `openspec/changes/add-agents-collection/tasks.md`
- Create: `openspec/changes/add-agents-collection/design.md`

**Step 1: Scaffold the OpenSpec change**

Create the directory tree for `add-agents-collection`.

Expected: the change folder exists under `openspec/changes/`.

**Step 2: Write the proposal**

Document:
- why embedded agent frontmatter is too coupled
- why visuals should not live in Markdown
- what collections and renderers will change

Expected: `proposal.md` clearly states the migration scope.

**Step 3: Write the task checklist**

Mirror the implementation tasks below as a short OpenSpec checklist.

Expected: `tasks.md` exists and matches this implementation plan.

**Step 4: Write the design note**

Document:
- `main` stays page-level
- `agents` becomes entry-level
- prompt assembly must still serialize all three agents in order
- visuals move to code

Expected: `design.md` explains the data flow and rollback surface.

### Task 2: Add an `agents` content collection

**Files:**
- Modify: `src/content.config.ts`
- Create: `src/content/agents/01-caspar.md`
- Create: `src/content/agents/02-melchior.md`
- Create: `src/content/agents/03-balthasar.md`
- Modify: `src/content/main/06-cobet.md`

**Step 1: Write the failing test for agent collection loading**

Add a Vitest case in `tests/protocol-helpers.test.ts` that expects:
- three agent entries
- sorted order `CASPAR`, `MELCHIOR`, `BALTHASAR`

Expected: FAIL because no `agents` helper exists yet.

**Step 2: Run the test to verify it fails**

Run: `npm test`

Expected: FAIL with missing helper or missing collection shape.

**Step 3: Define the new schema**

Update `src/content.config.ts`:
- keep `main`
- add `agents`
- move agent-specific fields into the new schema:
  - `name`
  - `slug`
  - `order`
  - `role`
  - `last_modified`
  - `badges`
  - `summary`
  - `system_prompt`
  - optional `prompt_label`

Expected: content config supports two collections.

**Step 4: Move agent content into three Markdown files**

Create:
- `src/content/agents/01-caspar.md`
- `src/content/agents/02-melchior.md`
- `src/content/agents/03-balthasar.md`

Put each agent’s content there.

Expected: each agent is independently editable.

**Step 5: Simplify `06-cobet.md`**

Remove the embedded `agents:` array and keep only:
- section metadata
- intro copy
- optional section body if needed

Expected: `06-cobet.md` becomes a small page-shell entry.

**Step 6: Run checks**

Run: `npm run astro check`

Expected: PASS with both collections valid.

### Task 3: Add agent loaders and page helpers

**Files:**
- Modify: `src/lib/content.ts`
- Test: `tests/protocol-helpers.test.ts`

**Step 1: Extend the failing tests**

Add tests for:
- `deriveAgentData()` sorts by `order`
- returned agent nav/render data is stable

Expected: FAIL before implementation.

**Step 2: Run the test to verify it fails**

Run: `npm test`

Expected: FAIL with missing export or wrong result.

**Step 3: Implement minimal agent helpers**

Add to `src/lib/content.ts`:
- `type AgentEntry = CollectionEntry<"agents">`
- `deriveAgentEntries(entries)`
- optionally `getAgentEntries()` if needed

Expected: helpers return sorted agents and stay pure for testing.

**Step 4: Verify tests pass**

Run: `npm test`

Expected: PASS.

### Task 4: Render COBET from section shell + agent entries

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/components/sections/AgentsSection.astro`
- Modify: `src/components/sections/SectionShell.astro` if needed

**Step 1: Write the failing render test**

Add a test that expects prompt/render assembly helpers to include all three agent names from separate entries.

Expected: FAIL because page/prompt still assumes embedded agents.

**Step 2: Run the test to verify it fails**

Run: `npm test`

Expected: FAIL with missing agent injection path.

**Step 3: Load both collections in the page**

In `src/pages/index.astro`:
- fetch `main`
- fetch `agents`
- pass sorted `agents` into `AgentsSection`

Expected: page has both section entries and agent entries available.

**Step 4: Refactor `AgentsSection.astro`**

Change props from:
- `entry` only

To:
- `entry`
- `agents`

Render cards from the separate collection entries.

Expected: COBET no longer depends on frontmatter array nesting.

**Step 5: Verify tests pass**

Run: `npm test`

Expected: PASS.

### Task 5: Move agent visuals out of content and flatten the presentation

**Files:**
- Create: `src/components/agents/CasparFace.astro`
- Create: `src/components/agents/MelchiorFace.astro`
- Create: `src/components/agents/BalthasarFace.astro`
- Create: `src/components/agents/AgentFace.astro`
- Modify: `src/components/sections/AgentsSection.astro`
- Modify: `src/styles/components.css`
- Modify: `src/styles/base.css`

**Step 1: Implement code-owned face components**

Create one Astro component per agent face and one small switch component:
- `CasparFace.astro`
- `MelchiorFace.astro`
- `BalthasarFace.astro`
- `AgentFace.astro`

`AgentFace.astro` should choose the correct face by agent slug or name.

Expected: visuals are code-owned, reusable, and clearly separated from content data.

**Step 2: Replace Markdown ASCII rendering**

Remove direct use of `ascii` from the renderer and mount the face component instead.

Expected: agent cards render glyphs from code, not content.

**Step 3: Flatten the COBET styling**

Update styles to reduce depth:
- remove boxed sub-card feel
- convert badges to a metadata line
- keep prompt as a flat mono block
- preserve the green ambient background

Expected: COBET reads flatter and cleaner.

**Step 4: Flatten `pulse` and `apply` in the same visual pass**

Reduce heavy fills and chips:
- `pulse` becomes border-left + metadata line
- `apply` becomes simple numbered rows + flatter CTAs

Expected: all three late-page sections feel visually consistent.

### Task 6: Rebuild prompt assembly for separate agent entries

**Files:**
- Modify: `src/lib/prompt.ts`
- Test: `tests/protocol-helpers.test.ts`

**Step 1: Write the failing prompt test**

Expect the final prompt to include:
- `# COBET`
- all three agent names
- each `system_prompt`
- preserved order

Expected: FAIL before prompt builder is updated.

**Step 2: Run the test to verify it fails**

Run: `npm test`

Expected: FAIL with missing agent serialization.

**Step 3: Update the prompt builder**

Refactor `buildProtocolPrompt()` to accept:
- `sections`
- `agents`
- `globalLastModified`

Serialize agents under the COBET section from the separate collection.

Expected: prompt no longer depends on embedded section frontmatter.

**Step 4: Verify the tests pass**

Run: `npm test`

Expected: PASS.

### Task 7: Remove obsolete content fields and update docs

**Files:**
- Modify: `src/content.config.ts`
- Modify: `AGENTS.md`
- Create or Modify: `docs/content-architecture.md`

**Step 1: Remove obsolete agent-in-main schema fields**

After migration, remove `agents` and `ascii` from the `main` collection shape if no longer needed there.

Expected: schema reflects the new architecture instead of legacy compatibility.

**Step 2: Document the new source-of-truth rules**

Update docs with:
- `main` for page sections
- `agents` for COBET member entries
- agent faces in Astro components, not Markdown
- prompt builder reads both collections

Expected: future edits follow the new structure by default.

### Task 8: Verify end-to-end in browser

**Files:**
- Verify: `src/pages/index.astro`
- Verify: `src/components/sections/AgentsSection.astro`
- Verify: `src/lib/prompt.ts`
- Verify: `src/content/agents/*.md`

**Step 1: Run automated checks**

Run: `npm test`

Expected: PASS.

**Step 2: Run Astro checks**

Run: `npm run astro check`

Expected: PASS.

**Step 3: Run production build**

Run: `npm run build`

Expected: PASS.

**Step 4: Manual Chrome DevTools checklist**

Check:
- `#COBET` nav anchor works
- all three agent cards render
- `pulse` still renders content
- `apply` still renders steps and copy button
- copy button includes all three agent prompts
- no agent visuals remain embedded in Markdown

**Step 5: Text integrity review**

Compare rendered text with `_in/index_cnhdnkat.html`.

Expected:
- copy remains identical except for deliberate visual-only changes
- no content loss during migration

### Notes for execution

- This is an architecture change, so implementation should only begin after the OpenSpec proposal is reviewed.
- The current workspace is not a git repository, so any worktree/commit steps must be skipped unless the repo is initialized later.
