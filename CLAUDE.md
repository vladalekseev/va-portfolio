# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. It is re-injected after context compaction, so everything here must hold in every session.

## Development workflow

- Analyze the requirement and the existing code first; plan before any significant change.
- Implement one logical step at a time and run the relevant validation after each.
- Stop for approval before the next major step. Never make an architectural decision (new dependency, project, alias, build or hosting change) silently.
- Never commit silently: show the change and wait to be asked.

## Toolchain

Nx 23 monorepo managed with Bun (`bun@1.4.3`, pinned with Node 24 in `mise.toml`). Bun installs packages and runs scripts; the Angular/Nx tooling runs on Node. `bunfig.toml` sets `exact = true`, so dependencies are pinned to exact versions. Always install with `bun install --frozen-lockfile`. Prettier uses single quotes.

## Commands

```sh
bun run dev            # Angular dev server on :4200 (proxies /api/trpc/** → 127.0.0.1:3000)
bun run dev:api        # tRPC API on :3000 (bun --watch; HOST/PORT env vars)
bun run dev:full       # both together
bun run build          # prerendered static build → dist/apps/portfolio/browser
bun run preview        # build, then serve the static output on :4200
bun run test           # all unit tests (portfolio + api-router)
bun run lint
bun run typecheck      # only the API host and router (api, api-router); the Angular app is type-checked by its build
bun run check          # what CI runs: format:check, lint, typecheck, test, build
bun run e2e            # Playwright against `bun run preview` (needs `bunx playwright install chromium` once)
```

Running a subset:

```sh
bunx nx test portfolio --include='**/trpc.spec.ts'                  # one Angular spec (@angular/build:unit-test, Vitest + jsdom)
bunx nx test api-router -- server.spec                               # one API spec (plain Vitest, Node environment)
bunx playwright test -c apps/portfolio-e2e/playwright.config.mts --project=chromium
```

Set `BASE_URL` to run e2e against a deployed site instead of starting the local preview.

CI: `.github/workflows/ci.yml` runs `bun run check`, then e2e. Husky runs `format:check` plus `nx affected -t lint typecheck` on pre-commit, and commitlint on commit-msg. Upgrade Angular and Nx with `bunx ng update` / `bunx nx migrate`, not a plain version bump: they run the code migrations.

## Architecture

Nx projects: `portfolio` (Angular app), `portfolio-e2e` (Playwright, desktop + Pixel 7 Chromium), `api` (`apps/api`, a thin Bun HTTP host), and `api-router` (`libs/api`, the tRPC router). The Nx name of `libs/api` is `api-router`, not `api`.

**Angular app (`apps/portfolio`).** Angular 22: standalone components, zoneless (there is no zone.js), signals with `OnPush`, and strict templates. Component and directive selectors must use the `app` prefix (enforced by ESLint). `build` uses `outputMode: "static"`, and `app.routes.server.ts` prerenders every route (`RenderMode.Prerender`). The production artifact is therefore plain static files; the server entry (`main.server.ts`, `app.config.server.ts`) exists only for prerendering, and the client hydrates with event replay. The routing is deliberately minimal: one lazy `Home` page, and `**` redirects to `''`. Production budgets are 500kb warning / 1mb error for the initial bundle and 6kb / 10kb per component stylesheet.

**Content.** Page copy comes from the typed object in `src/app/content/portfolio.ts`, not from the API. Keep content and page components independent of the routing and build setup: a migration to AnalogJS is planned, and that file and the pages should carry over unchanged.

**Styling.** Dark-only, with sunset orange as the brand color. The Material 3 theme is defined in `src/styles.scss` (`mat.theme`, `mat.theme-overrides`, and `mat.button-overrides` for the pill buttons plus the `.button-light`/`.button-dusk` variants) and exposes CSS variables (`--paper`, `--ink`, `--muted-ink`, `--line`, `--raised`, `--sunset`, `--ember`, `--glow`, and `--gutter`, the shared page edge) on top of `--mat-sys-*` tokens. Plus Jakarta Sans is self-hosted via `@fontsource-variable/plus-jakarta-sans`. Each homepage section is its own component under `pages/home/sections/`, which keeps every stylesheet within the per-component budget. Import Material components individually (e.g. `MatButton` from `@angular/material/button`). Customize them through Material's Sass theme and override APIs, not by targeting their internals.

**tRPC split.** `tsconfig.base.json` defines two path aliases with different purposes:

- `@portfolio/api` → `libs/api/src/index.ts`. Exports **only** `type AppRouter`. This is the only form browser code may import, and it must stay a type-only import.
- `@portfolio/api/server` → `libs/api/src/server.ts`. The router, the standalone HTTP adapter for local development (`createApiServer`, `basePath: '/api/trpc/'`), and the Fetch adapter for Vercel (`handleApiRequest`, `endpoint: '/api/trpc'`). Only `apps/api`, the Vercel entry `api/trpc/[trpc].ts` (by relative path, since Vercel's bundler ignores tsconfig aliases) and the API tests may import it.

Add procedures in `libs/api/src/lib/router.ts`; the client infers their types from `AppRouter`. Add runtime input validation for any procedure that takes input. On the Angular side, `src/app/data-access/trpc.ts` provides the injection tokens `TRPC_CLIENT` (a vanilla tRPC client with `httpBatchLink`) and `TRPC_API_URL` (default `/api/trpc`; override it in `app.config.ts`). Injecting the client must not trigger any request, and a spec checks this. Nothing calls the API during build or prerender yet. Any future server-side query would need an absolute URL and a reachable API, and Angular's HTTP transfer cache does not cover tRPC's fetch requests.

**Deployment.** One Vercel project on the free Hobby plan, configured in `vercel.json`: the prerendered site is served from `dist/apps/portfolio/browser`, paths outside `/api/` fall back to `index.html`, and `api/trpc/[trpc].ts` serves `/api/trpc/*` as a Node.js Vercel Function. `apps/api` typechecks that entry; `apps/api` itself and the dev proxy are not deployed. Before going public, the page title, social metadata, and canonical/Open Graph URLs in `src/index.html` still need real values.

## Conventions

- **Branches**: `<type>/<short-description>` off `main`, merged by PR.
- **Commits**: Conventional Commits with the Nx project as scope, e.g. `feat(portfolio): …`, `fix(api-router): …`.
- **Comments**: one line, two at most, explaining _why_ or a non-obvious constraint. Never restate the code or narrate history.
- **Naming**: say what and to whom in domain terms; helpers start with a verb.
- **Dependencies**: exact versions only (`bunfig.toml` enforces it); keep Angular, Material and CDK on the same version, and all `@nx/*` packages on the same version as `nx`. Never format `bun.lock`.
- **Testing**: logic is test-first and bug fixes always start with a failing spec. Use the `tdd` skill.
- **Docs**: `README.md` and this file share command tables, paths and ports. Any rename, script, port, alias or env-var change updates both in the same change; run the `docs-drift` skill before finishing.

## Skills, MCP and hooks

Project skills in `.claude/skills/` (shared with Codex via `.agents/skills/` symlinks): `tdd`, `docs-drift`. Write a new skill only after a pattern (e.g. an Angular page, a tRPC procedure with validation) has been implemented twice. The Nx skills (`nx-workspace`, `nx-generate`, …) come from the `nx` plugin enabled in `.claude/settings.json`; Codex copies live in `.agents/skills/`, managed by `bunx nx configure-ai-agents`.

MCP: the Nx plugin provides `nx-mcp` (project graph, generators, docs). `.mcp.json` adds the Angular CLI server in `--read-only` mode. Call its `get_best_practices` before writing Angular code and `search_documentation` for API questions; its workspace tools (`list_projects`, builds, dev server) need `angular.json`, so they don't work in this Nx workspace.

Hooks in `.claude/hooks/` are silent on success and don't replace `bun run check` or CI. Codex runs the same scripts via `.codex/config.toml` (see [AGENTS.md](AGENTS.md)), so change them here, not in a copy:

- **`format-and-lint.sh`** (PostToolUse, Edit|Write) runs Prettier, then `eslint --fix` from the nearest project config, on the changed file. Fix whatever it reports straight away. Shell edits bypass it, so format those manually.
- **`secret-file-guard.sh`** (PreToolUse, Bash|Read) blocks reads of dotenv files, private keys, SSH files and AWS config/credentials; `.env.example`, `.env.sample` and `.env.template` stay readable. It matches literal paths: a floor, not a sandbox.

Hooks require Bash and `jq`, plus Python 3.9+ for the Codex patch adapter. After changing the credential-path guard, run `python3 .claude/hooks/test_secret_file_guard.py`.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
