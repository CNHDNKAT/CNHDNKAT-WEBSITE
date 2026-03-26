## Context

`COBET` is modeled as one page section plus three agent profiles. Right now all four concerns live inside `src/content/main/06-cobet.md`, which means a small content change forces editing a very large frontmatter object.

## Goals

- Keep `main` focused on page sections
- Give each COBET agent an independent Markdown source file
- Preserve the existing render order and prompt order
- Make it possible to move the visual faces out of content later without reworking data again

## Non-Goals

- Redesign the whole site
- Change the agent prompts themselves
- Introduce a CMS or database-backed content system

## Decisions

- Decision: create a dedicated `agents` collection with one entry per agent
  - Why: it matches the domain model and makes agent edits isolated
- Decision: keep `06-cobet.md` as a shell entry in `main`
  - Why: the page still needs section-level metadata, nav order, and intro text
- Decision: update the prompt builder to consume both `sections` and `agents`
  - Why: prompt generation must stay deterministic after the split

## Risks / Trade-offs

- Risk: partial migration could leave the page with an empty COBET section
  - Mitigation: migrate content, renderer, and prompt builder in one implementation pass
- Risk: old fields remain in schema and create confusion
  - Mitigation: keep compatibility only for the migration step, then remove obsolete fields in a follow-up cleanup

## Migration Plan

1. Add `agents` collection schema
2. Create agent markdown files from the current embedded records
3. Simplify `06-cobet.md`
4. Update helpers, renderer, and prompt builder
5. Verify the page and copied prompt still contain all three agents in order
