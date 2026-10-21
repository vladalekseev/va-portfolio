"""Exercise the guard with synthetic paths without reading credential files."""

import json
from pathlib import Path
import subprocess
import unittest


HOOK = Path(__file__).with_name("secret-file-guard.sh")


class SecretFileGuardTests(unittest.TestCase):
    def check_input(self, tool_input, expected):
        result = subprocess.run(
            ["bash", str(HOOK)],
            input=json.dumps({"tool_input": tool_input}),
            text=True,
            capture_output=True,
        )
        self.assertEqual(result.returncode, expected, result.stderr)
        self.assertEqual(result.stdout, "")

    def test_blocks_literal_secret_paths_in_shell_and_read_tools(self):
        for path in (
            ".env",
            ".env.local",
            "config/.env.production",
            ".env.example.local",
            ".env.sample.backup",
            ".env.template.old",
            "id_rsa",
            "id_ed25519",
            ".ssh/config",
            ".aws/credentials",
            "~/.aws/config",
            "/tmp/example/.ssh/config",
            "cert.pem",
        ):
            for tool_input in ({"command": f"cat '{path}'"}, {"file_path": path}):
                with self.subTest(tool_input=tool_input):
                    self.check_input(tool_input, 2)

    def test_allows_templates_and_ordinary_reads(self):
        for path in (".env.example", ".env.sample", "config/.env.template", "README.md"):
            for tool_input in ({"command": f"cat '{path}'"}, {"file_path": path}):
                with self.subTest(tool_input=tool_input):
                    self.check_input(tool_input, 0)
        self.check_input({"command": "git status --short"}, 0)
        self.check_input({"command": "node -p 'process.env.PORT'"}, 0)
        self.check_input({"command": "cat .env.example .env.sample .env.template"}, 0)
        self.check_input({"command": "cat .env.example .env.local"}, 2)


if __name__ == "__main__":
    unittest.main()
