---
name: web-speed-hackathon-official-scoring
description: Discover, prepare, and run the official Web Speed Hackathon scoring tool and official VRT assets for the relevant year without hardcoding repo URLs. Use when Claude needs to inspect a Web Speed Hackathon challenge repo or year, find the matching official scorer and VRT source repos, clone them under the target project's scripts directory, determine whether the public repos support local execution, and run scoring or VRT against a localhost or preview URL when a public local CLI exists.
---

# Web Speed Hackathon Official Scoring

## Overview

Use this skill to discover the correct official Web Speed Hackathon scorer and official VRT source for the target year, clone them into the target project's `scripts/` directory, and run them locally only when the public repos actually support it.

Do not hardcode a scorer repo URL in your workflow. Prefer the bundled helper instead of re-deriving discovery, clone, trust, runtime install, dependency install, and run sequence by hand.

## Quick Start

Discover the latest official scorer:

```bash
python3 scripts/official_scoring_tool.py discover
```

Discover a specific year:

```bash
python3 scripts/official_scoring_tool.py discover --year 2025
```

Discover from a local challenge repo checkout:

```bash
python3 scripts/official_scoring_tool.py discover \
  --challenge-repo-path /path/to/web-speed-hackathon-2025
```

Prepare the discovered official repos under the project:

```bash
python3 scripts/official_scoring_tool.py prepare \
  --year 2025 \
  --project-dir /path/to/project
```

Inspect whether the public repo can be run locally:

```bash
python3 scripts/official_scoring_tool.py inspect \
  --year 2025 \
  --project-dir /path/to/project
```

## Workflow

1. Resolve the target year or challenge repo.
   - Prefer `--challenge-repo-path` when you already have the official challenge repo checked out.
   - Otherwise pass `--year`.
   - If neither is available, the helper falls back to the latest published year in the GitHub org.

2. Discover the official measurement repo.
   - Run `scripts/official_scoring_tool.py discover ...`.
   - The helper reads the challenge README first and looks for official scorer or leaderboard repo links.
   - If the README does not explicitly link one, the helper falls back to the GitHub org naming pattern for that year.

3. Prepare the public repo locally.
   - Run `scripts/official_scoring_tool.py prepare ...`.
   - The repos are cloned into `<project>/scripts/<discovered-repo-name>` by default.
   - If `mise.toml` exists, the helper runs `mise trust`, `mise install`, and then `ni` or `nci` through `mise exec`.
   - Otherwise it runs `ni` or `nci` directly.

4. Inspect the strategy before running.
   - Run `scripts/official_scoring_tool.py inspect ...`.
   - If the public scorer repo is GitHub-issue-driven only, publicly incomplete, or otherwise lacks a safe local CLI, stop and explain that limitation to the user.
   - If the public VRT repo is not discovered, explain that clearly too.
   - Read [history-and-discovery.md](./references/history-and-discovery.md) if you need the verified year-by-year findings.

5. Run scoring or VRT when the detected strategy supports it.
   - Confirm the application is already running.
   - Run `scripts/official_scoring_tool.py run --application-url <url> ...` for scoring.
   - Run `scripts/official_scoring_tool.py run-vrt --application-url <url> ...` for VRT.
   - Run `scripts/official_scoring_tool.py run-all --application-url <url> ...` if both are publicly runnable.
   - For some historical years, you may also need `--page` or `--target-path`.

6. Fall back to the manual runbook if the Python helper fails.
   - Read [manual-runbook.md](./references/manual-runbook.md).
   - Follow the year-specific clone, install, and run steps there.

## Commands

Prepare the latest available official tooling under `<project>/scripts/`:

```bash
python3 scripts/official_scoring_tool.py prepare \
  --project-dir /path/to/project
```

Prepare a specific year and update the checkout:

```bash
python3 scripts/official_scoring_tool.py prepare \
  --year 2025 \
  --project-dir /path/to/project \
  --update
```

Run a modern scorer that accepts `--applicationUrl`:

```bash
python3 scripts/official_scoring_tool.py run \
  --year 2025 \
  --project-dir /path/to/project \
  --application-url http://127.0.0.1:3000
```

Run a historical 2021 scorer:

```bash
python3 scripts/official_scoring_tool.py run \
  --year 2021 \
  --project-dir /path/to/project \
  --application-url https://example.com/ \
  --page "" \
  --page posts/a \
  --page posts/b
```

Run a historical 2022 scorer:

```bash
python3 scripts/official_scoring_tool.py run \
  --year 2022 \
  --project-dir /path/to/project \
  --application-url http://127.0.0.1:3000 \
  --target-path / \
  --target-path /races/1 \
  --target-path /odds/1 \
  --target-path /results/1
```

Run official VRT for 2025:

```bash
python3 scripts/official_scoring_tool.py run-vrt \
  --year 2025 \
  --project-dir /path/to/project \
  --application-url http://127.0.0.1:3000
```

Run official VRT for 2022:

```bash
python3 scripts/official_scoring_tool.py run-vrt \
  --year 2022 \
  --project-dir /path/to/project \
  --application-url http://127.0.0.1:3000
```

Run scoring and VRT together:

```bash
python3 scripts/official_scoring_tool.py run-all \
  --year 2025 \
  --project-dir /path/to/project \
  --application-url http://127.0.0.1:3000
```

Run with a clean install:

```bash
python3 scripts/official_scoring_tool.py prepare \
  --year 2025 \
  --project-dir /path/to/project \
  --clean-install
```

## Rules

- Do not hardcode a scorer repo URL or assume the current year uses the same repo as 2025.
- Clone official repos under `<project>/scripts/` by default.
- Keep each official repo in its own directory and do not rewrite upstream source unless the user explicitly asks.
- Use `--update` only when the user wants the latest official changes.
- If the discovered repo already exists and has local changes, stop instead of overwriting it during update.
- Keep package-manager operations on the `ni` toolchain. Use `nci` only when the user wants a clean reinstall.
- Read [history-and-discovery.md](./references/history-and-discovery.md) before adding year-specific assumptions. The public scoring and VRT layout differs across 2020, 2021, 2022, 2023, 2024, and 2025.
- Read [manual-runbook.md](./references/manual-runbook.md) if the Python helper fails or if you need to execute the same steps manually.
