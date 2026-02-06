import ast
from pathlib import Path
from typing import Dict, List, Set
import re

class CodeParser:
    """Parse Python codebase to extract structure and patterns"""

    def __init__(self, codebase_dir: Path):
        self.codebase_dir = Path(codebase_dir)
        self.python_files = []
        self.imports = set()
        self.dependencies = {}
        self.code_patterns = {}

    async def parse(self) -> Dict:
        """Parse the entire codebase"""
        # Find all Python files
        self.python_files = list(self.codebase_dir.rglob("*.py"))

        # Parse each file
        for file_path in self.python_files:
            await self._parse_file(file_path)

        # Parse dependencies
        await self._parse_dependencies()

        return {
            "files": [str(f.relative_to(self.codebase_dir)) for f in self.python_files],
            "imports": list(self.imports),
            "dependencies": self.dependencies,
            "code_patterns": self.code_patterns
        }

    async def _parse_file(self, file_path: Path):
        """Parse a single Python file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Parse AST
            tree = ast.parse(content)

            # Extract imports
            for node in ast.walk(tree):
                if isinstance(node, ast.Import):
                    for alias in node.names:
                        self.imports.add(alias.name.split('.')[0])
                elif isinstance(node, ast.ImportFrom):
                    if node.module:
                        self.imports.add(node.module.split('.')[0])

            # Store code content for pattern matching
            rel_path = str(file_path.relative_to(self.codebase_dir))
            self.code_patterns[rel_path] = {
                "content": content,
                "lines": len(content.split('\n'))
            }

        except Exception as e:
            # Skip files that can't be parsed
            pass

    async def _parse_dependencies(self):
        """Parse requirements.txt, pyproject.toml, etc."""
        # Check requirements.txt
        req_file = self.codebase_dir / "requirements.txt"
        if req_file.exists():
            with open(req_file, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#'):
                        # Extract package name
                        pkg = re.split(r'[=<>!]', line)[0].strip()
                        self.dependencies[pkg] = "requirements.txt"

        # Check pyproject.toml
        pyproject = self.codebase_dir / "pyproject.toml"
        if pyproject.exists():
            with open(pyproject, 'r') as f:
                content = f.read()
                # Simple regex-based extraction
                deps = re.findall(r'"([^"]+)"', content)
                for dep in deps:
                    pkg = re.split(r'[=<>!]', dep)[0].strip()
                    if pkg and not pkg.startswith('python'):
                        self.dependencies[pkg] = "pyproject.toml"

        # Also add imports as potential dependencies
        for imp in self.imports:
            if imp not in self.dependencies:
                self.dependencies[imp] = "import"
