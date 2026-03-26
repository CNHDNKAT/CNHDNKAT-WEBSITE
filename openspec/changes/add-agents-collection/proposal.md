# Change: Add Dedicated COBET Agents Collection

## Why
The COBET section currently stores three full agent records inside a single `main` collection entry. This couples page structure, editorial content, and visual representation too tightly, which makes targeted edits risky and blocks moving the agent faces into the presentation layer.

## What Changes
- Add a dedicated `agents` content collection for `CASPAR`, `MELCHIOR`, and `BALTHASAR`
- Keep `src/content/main/06-cobet.md` as the section shell only
- Update the page renderer and prompt builder to read both `main` and `agents`
- Prepare the renderer for face components owned by the layout layer instead of Markdown

## Impact
- Affected specs: none yet, project has no published specs
- Affected code: `src/content.config.ts`, `src/content/main/06-cobet.md`, `src/content/agents/*.md`, `src/lib/content.ts`, `src/lib/prompt.ts`, `src/pages/index.astro`, `src/components/sections/AgentsSection.astro`
