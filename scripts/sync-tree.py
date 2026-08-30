#!/usr/bin/env python3
"""
sync-tree.py: Scans the dotfiles repository and generates a structured
JSON tree (data/tree.json) for the website.

Can be run locally (`python3 scripts/sync-tree.py ~/dotfiles`) or
automated in GitHub Actions workflows on git push.
"""

import os
import sys
import json
from pathlib import Path

IGNORE_NAMES = {".git", ".direnv", "result", ".devenv", ".trash"}

def build_tree_node(path: Path, root_path: Path):
    rel_path = str(path.relative_to(root_path))
    node = {
        "name": path.name,
        "path": rel_path,
        "type": "directory" if path.is_dir() else "file"
    }

    if path.is_file():
        ext = path.suffix.lower()
        if ext == ".nix":
            node["fileType"] = "nix"
        elif ext in [".md", ".txt", ".rst"]:
            node["fileType"] = "doc"
        elif ext in [".wav", ".png", ".jpg", ".svg", ".mp3"]:
            node["fileType"] = "media"
        elif ext in [".yaml", ".yml", ".json", ".toml", ".rasi", ".sh", ".pem"]:
            node["fileType"] = "config"
        else:
            node["fileType"] = "other"
        return node

    # Directory recursion
    children = []
    try:
        items = sorted(path.iterdir(), key=lambda p: (not p.is_dir(), p.name.lower()))
        for item in items:
            if item.name in IGNORE_NAMES:
                continue
            children.append(build_tree_node(item, root_path))
    except PermissionError:
        pass

    node["children"] = children
    return node

def count_stats(node):
    dirs = 0
    files = 0
    if node["type"] == "directory":
        dirs += 1
        for child in node.get("children", []):
            d, f = count_stats(child)
            dirs += d
            files += f
    else:
        files += 1
    return dirs, files

def main():
    target_dir = sys.argv[1] if len(sys.argv) > 1 else str(Path.home() / "dotfiles")
    repo_path = Path(target_dir).resolve()

    if not repo_path.exists():
        print(f"Error: Target path {repo_path} does not exist", file=sys.stderr)
        sys.exit(1)

    print(f"Scanning dotfiles repository at {repo_path}...")
    root_node = build_tree_node(repo_path, repo_path)
    root_node["name"] = "NixOS-Dotfiles"

    total_dirs, total_files = 0, 0
    for child in root_node.get("children", []):
        d, f = count_stats(child)
        total_dirs += d
        total_files += f

    output_data = {
        "repoName": "NixOS-Dotfiles",
        "totalDirectories": total_dirs,
        "totalFiles": total_files,
        "tree": root_node.get("children", [])
    }

    output_file = Path(__file__).resolve().parent.parent / "data" / "tree.json"
    output_file.parent.mkdir(parents=True, exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2)

    print(f"[OK] Generated {output_file} with {total_dirs} directories and {total_files} files.")

if __name__ == "__main__":
    main()
