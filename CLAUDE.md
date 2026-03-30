<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Статический сайт-протокол синдиката CNHDNKAT — закрытого объединения компаний в сфере AI. Astro 6, TypeScript, контент в Markdown с Zod-валидацией. Деплой на VPS (https://cnhdnkat.com) через GitHub Actions + SSH.

## OpenSpec Workflow

This project uses OpenSpec for spec-driven development. Always check `@/openspec/AGENTS.md` when working with proposals, specs, or planning changes.

### Key Commands

```bash
# View active changes and specs
openspec list                  # List active change proposals
openspec list --specs          # List all specifications
openspec show [item]           # View change or spec details

# Create and validate proposals
openspec validate [change] --strict --no-interactive  # Validate changes
openspec archive <change-id> --yes  # Archive completed change

# Project context
# Edit openspec/project.md to add project-specific context
```

### When to Create Proposals

Create OpenSpec change proposal for:

- New features or capabilities
- Breaking changes (API, schema, architecture)
- Performance/security work that changes behavior

Skip proposals for:

- Bug fixes (restoring intended behavior)
- Typos, formatting, comments
- Dependency updates (non-breaking)

See `openspec/AGENTS.md` for complete workflow details.

## Development Commands

### Setup

```bash
npm install
```

### Build & Run

```bash
npm run dev        # Dev-сервер с HMR
npm run build      # Статическая сборка в dist/
npm run preview    # Предпросмотр собранного сайта
```

### Testing

```bash
npm test           # Vitest — юнит-тесты
```

### Type Checking

```bash
npx astro check    # Проверка типов Astro + TypeScript
```

## Architecture

Astro 6 static site с Content Collections. Контент (секции, агенты) хранится в Markdown с frontmatter, валидируется через Zod-схемы в `src/content.config.ts`. Каждая секция использует свой шаблон (template) для рендеринга.

### Key Patterns

- **Content Collections** — `src/content/main/` (секции протокола) и `src/content/agents/` (AI-агенты CASPAR, MELCHIOR, BALTHASAR). Схемы в `src/content.config.ts`.
- **Template dispatch** — поле `template` в frontmatter определяет компонент рендеринга: `default`, `principles`, `members`, `agents`, `pulse`, `apply`.
- **SectionShell** — обёртка для всех секций, генерирует `<h1>` для первой секции (about), `<h2>` для остальных.
- **CSS tokens** — дизайн-токены в `src/styles/tokens.css`, глобальные стили в `base.css`, компоненты в `components.css`. Без CSS-фреймворков.
- **Self-hosted шрифты** — `@fontsource` (Fira Code, IBM Plex Sans), без внешних зависимостей.
- **SEO** — JSON-LD (Organization + WebSite + WebPage), canonical URL, OG/Twitter meta, sitemap, robots.txt.

### Directory Structure

```
src/
├── content/          # Markdown-контент с Zod-валидацией
│   ├── main/         # 8 секций протокола (01-about .. 08-apply)
│   └── agents/       # 3 AI-агента
├── components/
│   ├── sections/     # Шаблоны секций (DefaultSection, AgentsSection и т.д.)
│   └── agents/       # SVG-лица агентов
├── layouts/          # MainLayout.astro — единственный layout
├── lib/              # Утилиты: content helpers, prompt builder, protocol metadata
├── pages/            # Маршруты: index.astro, capture-c.astro
└── styles/           # tokens.css, base.css, components.css
scripts/deploy/       # deploy.sh — деплой на VPS с релизами и rollback
```

### Deploy

- **VPS:** push в `main` → GitHub Actions (appleboy/ssh-action) → SSH на сервер
- **deploy.sh:** git fetch → checkout SHA → npm ci → build → cp dist → symlink switch → nginx reload → health check → cleanup old releases
- **Переменные:** `SITE_URL` (default: https://cnhdnkat.com), `HEALTHCHECK_URL`, `MAX_RELEASES`
- **Nginx:** `/var/www/syndicate-website/current` → текущий релиз
- **Rollback:** автоматический при failed health check

## Important Notes

- `astro.config.mjs` использует `process.env.SITE_URL` — на VPS задаётся в deploy.sh, локально fallback на https://cnhdnkat.com
- Страница `capture-c` имеет `noindex` и исключена из sitemap
- Umami-аналитика подключена через `stats.khabaroff.studio`
- Язык сайта — русский (`lang="ru"`), контент и комментарии на русском
