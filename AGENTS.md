# Codex

Read and follow [CLAUDE.md](CLAUDE.md) before starting a task. It is the single
source for the workflow, commands, architecture, conventions and Nx guidance.
Do not maintain a second copy here.

## Codex integration

- Skills are discovered in `.agents/skills/`. `tdd` and `docs-drift` link to
  the same skill in `.claude/skills/`; the `nx-*` skills are managed by
  `bunx nx configure-ai-agents`. Its Nx Cloud skills, `monitor-ci` and the CI
  subagent were removed because this repo doesn't use Nx Cloud; delete them
  again if a re-run restores them. Read the applicable `SKILL.md` before using it.
- [.codex/config.toml](.codex/config.toml) runs the hooks from `.claude/hooks/`:
  the secret-file guard before shell calls, and the format-and-lint hook after
  `apply_patch` through [.codex/hooks/post-tool-use.py](.codex/hooks/post-tool-use.py).
  New or changed hooks are skipped until trusted in Codex's `/hooks`.
- Shell edits don't trigger the patch adapter. After changing a file through a
  shell command, run `bunx prettier --write <file>` and `bun run lint`.
- [.codex/rules/project.rules](.codex/rules/project.rules) allows only `gh`
  view/list/checks outside the sandbox and forbids `git push --force`/`-f`.
- Never read credential values into the transcript. Never force-push. Commit
  only when the user asks.
