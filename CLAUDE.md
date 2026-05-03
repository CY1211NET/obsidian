# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Crain's Blog — a React 19 + Vite 6 + TypeScript personal blog with Tailwind CSS v4. Blog posts are Markdown files with YAML frontmatter, authored in an Obsidian vault (`post/` directory) and loaded at build time via `import.meta.glob`. The site is a bilingual (Chinese/English) SPA with dark/light theme, Giscus comments, Mermaid diagrams, KaTeX math, and syntax-highlighted code blocks.

## Commands

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Dev server (port 3000) | `npm run dev` |
| Production build | `npm run build` |
| Preview production build | `npm run preview` |
| Type-check | `npm run lint` (runs `tsc --noEmit`) |
| Clean build artifacts | `npm run clean` |

There is no test framework, linter, or formatter configured.

## Architecture

**Content pipeline:** Markdown files in `post/` → loaded eagerly via `import.meta.glob('/post/**/*.md', { query: '?raw', import: 'default', eager: true })` in [src/data.ts](src/data.ts) → frontmatter parsed client-side with `gray-matter` (Buffer polyfill for browser) → sorted by date, drafts filtered out.

**Routing** (React Router v7, defined in [src/App.tsx](src/App.tsx)):
- `/` — Home: post listing with category/tag/year/month filters and pagination
- `/timeline` — Timeline view grouped by year/month
- `/about` — About page with profile and friend links
- `/post/:id` — Post detail with table of contents, Giscus comments, prev/next navigation

**State management:** Two React Contexts only:
- `LanguageContext` ([src/contexts/LanguageContext.tsx](src/contexts/LanguageContext.tsx)) — zh/en toggle, persisted to localStorage
- `SearchContext` ([src/contexts/SearchContext.tsx](src/contexts/SearchContext.tsx)) — global search query

**Central configuration:** [src/siteConfig.ts](src/siteConfig.ts) holds all site-wide settings — author info, social links, i18n strings (`siteConfig.ui`), Giscus config, NetEase Music playlist IDs, about page content, and friend links.

## Path Aliases

`@` maps to the project root (configured in both `vite.config.ts` and `tsconfig.json`). Use `@/src/...` for imports.

## Environment Variables

See [.env.example](.env.example). Required:
- `GEMINI_API_KEY` — Google Gemini AI API key (injected via Vite `define`)
- `APP_URL` — Hosting URL

## Blog Post Frontmatter

Posts use YAML frontmatter parsed by `gray-matter`. Key fields: `title`, `date`, `category`, `tags`, `author`, `draft` (boolean — draft posts are excluded from home/timeline listings).

## Key Libraries

- **Markdown:** `react-markdown` + `remark-gfm` + `remark-math` + `rehype-katex`
- **Code blocks:** `react-syntax-highlighter` (Prism, vscDarkPlus theme)
- **Diagrams:** `mermaid` v11 (custom renderer in [src/components/Mermaid.tsx](src/components/Mermaid.tsx))
- **Math:** `katex` v0.16
- **Animations:** `motion` (Framer Motion) v12
- **Comments:** `@giscus/react` (GitHub Discussions-backed)
- **Icons:** `lucide-react`
- **Styling:** `clsx` + `tailwind-merge` via `cn()` utility in [src/lib/utils.ts](src/lib/utils.ts)
