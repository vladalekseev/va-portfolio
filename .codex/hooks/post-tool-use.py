#!/usr/bin/env python3
"""Translate Codex patches into the existing per-file Claude hook payloads."""

import json
from pathlib import Path
import subprocess
import sys

CLAUDE_HOOKS = ("format-and-lint.sh",)


def changed_paths(command):
    paths = []
    for line in command.splitlines():
        if line.startswith(("*** Add File: ", "*** Update File: ")):
            paths.append(line.split(": ", 1)[1])
        elif line.startswith("*** Move to: ") and paths:
            paths[-1] = line.split(": ", 1)[1]
    return dict.fromkeys(paths)


def main():
    payload = json.load(sys.stdin)
    repo_root = Path(__file__).resolve().parents[2]
    cwd = Path(payload.get("cwd", str(repo_root)))
    command = payload.get("tool_input", {}).get("command", "")
    failed = False

    for file in changed_paths(command):
        path = (cwd / file).resolve()
        if not path.is_relative_to(repo_root):
            continue

        # Claude's Edit/Write hooks take one file; a Codex patch can change many.
        file_payload = {**payload, "tool_input": {"file_path": str(path)}}
        for hook in CLAUDE_HOOKS:
            result = subprocess.run(
                ["bash", str(repo_root / ".claude/hooks" / hook)],
                input=json.dumps(file_payload),
                text=True,
            )
            failed = failed or result.returncode != 0

    return 2 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
