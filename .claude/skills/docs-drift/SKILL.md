---
name: docs-drift
description: Find and fix documentation left stale by a change. Run before finishing any change that renames or moves a file, renames or removes a package.json script or Nx target, changes a port, path alias, API base path or env var (HOST, PORT, BASE_URL, TRPC_API_URL), or changes CI. Derives stale tokens from the git diff and sweeps README.md, CLAUDE.md, AGENTS.md and the skills.
---

# Documentation drift

`README.md` and `CLAUDE.md` both carry command tables, paths and ports, so a
change in one place silently falsifies the other. Run this **before** calling
a change done, even if the task never touched docs.

## 1. Take the old tokens from the diff

```bash
git diff main...HEAD --name-status --find-renames                   # moved/renamed paths
git diff main...HEAD -- package.json | grep -E '^-\s+"[a-z:-]+":'   # removed scripts
git diff main...HEAD -- '**/project.json' tsconfig.base.json apps/portfolio/proxy.conf.json
git diff main...HEAD -- .github/workflows mise.toml
```

Include uncommitted work: repeat with `git diff HEAD` if nothing is committed yet.

## 2. Sweep for them

```bash
grep -rn "<old-token>" --include='*.md' . --exclude-dir=node_modules --exclude-dir=dist
```

Where drift hides:

- `README.md`: the command table, project layout tree, tRPC section (ports,
  `/api/trpc`, alias names), static deployment section.
- `CLAUDE.md`: commands, Nx project names, the tRPC split, budgets.
- `.claude/skills/*/SKILL.md`: commands and spec paths.
- Code comments that name a file or port.

## 3. Absolute claims

```bash
grep -nEi "only|never|always|no running|not part of|nothing calls" README.md CLAUDE.md
```

Check each one against the diff. Adding the first server-side query, for
example, falsifies "Nothing calls the API during build or prerender yet".

## Verify

`bun run format:check`, then re-run step 2. Every old token comes back empty.
