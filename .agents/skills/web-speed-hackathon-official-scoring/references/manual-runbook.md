# Manual Runbook

Use this file when `scripts/official_scoring_tool.py` does not work and you need to run the official tooling manually.

## Contents

- Common Discovery Steps
- 2025 Manual Scoring
- 2025 Manual VRT
- 2024 Manual Scoring
- 2024 Manual VRT
- 2023 Manual Scoring
- 2022 Manual Scoring
- 2022 Manual VRT
- 2021 Manual Scoring
- 2020 Manual Scoring

All examples assume the target project root is:

```bash
cd /path/to/project
```

The official repos should be cloned under `./scripts/`.

## Common Discovery Steps

1. Read the official challenge README for the target year.
2. Identify the public scoring repo from the README.
3. Identify the public VRT source separately.
   - 2022: leaderboard repo
   - 2024: challenge repo `workspaces/testing`
   - 2025: challenge repo `workspaces/test`
4. Clone the discovered repos under `./scripts/`.

If a repo contains `mise.toml`, `.node-version`, or `.tool-versions`, prefer:

```bash
mise install -y
```

If `ni` does not honor the repo runtime correctly even after `mise install`, use the repo-native package manager through `mise exec` as a last-resort recovery path.

## 2025 Manual Scoring

Clone the public scorer:

```bash
git clone --depth=1 https://github.com/CyberAgentHack/web-speed-hackathon-2025-scoring-tool ./scripts/web-speed-hackathon-2025-scoring-tool
```

Install and run:

```bash
cd ./scripts/web-speed-hackathon-2025-scoring-tool
mise trust ./mise.toml
mise install -y
mise exec -- ni
mise exec -- nr start --applicationUrl http://127.0.0.1:3000
```

## 2025 Manual VRT

Clone the official challenge repo:

```bash
git clone --depth=1 https://github.com/CyberAgentHack/web-speed-hackathon-2025 ./scripts/web-speed-hackathon-2025
```

Install and run:

```bash
cd ./scripts/web-speed-hackathon-2025
mise install -y
mise exec -- ni
E2E_BASE_URL=http://127.0.0.1:3000 mise exec -- nr test
```

## 2024 Manual Scoring

The public scorer repo is issue-driven and is not a safe public local CLI.

Manual fallback:

- Clone it under `./scripts/web-speed-hackathon-2024-scoring-tool` only for inspection.
- Do not promise a public local scoring run from that repo.
- Use the official VRT from the challenge repo instead.

## 2024 Manual VRT

Clone the official challenge repo:

```bash
git clone --depth=1 https://github.com/CyberAgentHack/web-speed-hackathon-2024 ./scripts/web-speed-hackathon-2024
```

Install and run:

```bash
cd ./scripts/web-speed-hackathon-2024
mise install -y
mise exec -- ni
E2E_BASE_URL=http://127.0.0.1:3000 mise exec -- nr test
```

Debug mode:

```bash
E2E_BASE_URL=http://127.0.0.1:3000 mise exec -- nr test:debug
```

## 2023 Manual Scoring

The public scorer repo references a private workspace checkout and is not self-contained.

Manual fallback:

- Clone the public repo only for registration-related reference.
- Do not claim that the public repo can be run locally as-is.
- Explain to the user that a public manual local runbook is not available from the inspected repos.

## 2022 Manual Scoring

Clone the public leaderboard repo:

```bash
git clone --depth=1 https://github.com/CyberAgentHack/web-speed-hackathon-2022-leaderboard ./scripts/web-speed-hackathon-2022-leaderboard
```

Install, build, and run:

```bash
cd ./scripts/web-speed-hackathon-2022-leaderboard
ni
nr build
WSH_SCORING_TARGET_PATHS='["/","/races/1","/odds/1","/results/1"]' nr scoring -- --id local --url http://127.0.0.1:3000
```

## 2022 Manual VRT

From the same repo:

```bash
cd ./scripts/web-speed-hackathon-2022-leaderboard
ni
nr build
nr vrt:capture -- --url http://127.0.0.1:3000
nr vrt:detect
```

## 2021 Manual Scoring

Clone the public scorer:

```bash
git clone --depth=1 https://github.com/CyberAgentHack/web-speed-hackathon-2021-scoring-tool ./scripts/web-speed-hackathon-2021-scoring-tool
```

Prepare config:

```bash
cd ./scripts/web-speed-hackathon-2021-scoring-tool
cp ./config/default.json ./config/local.json
```

Edit `./config/local.json` so `pages` contains the target paths without a leading slash.

Install, build, and run:

```bash
ni
nr build
nr scoring https://example.com/
```

## 2020 Manual Scoring

No separate public scorer repo was detected in the inspected org repos.

Manual fallback:

- Use the challenge README for the scoring formula only.
- Do not invent an official public local scorer repo.
