# Web Speed Hackathon Official Scorer History

This file records the verified public scoring and VRT repo patterns across past Web Speed Hackathon years so the skill does not assume the 2025 layout applies everywhere.

## Contents

- Summary
- Discovery Rules
- Verified Sources

## Summary

- 2020:
  - Challenge repo: `CyberAgentHack/web-speed-hackathon-2020`
  - No separate public scorer repo was found in the org repo list.
  - The challenge README documents the scoring formula only.

- 2021:
  - Challenge repo: `CyberAgentHack/web-speed-hackathon-2021`
  - Public scorer repo: `CyberAgentHack/web-speed-hackathon-2021-scoring-tool`
  - Public local CLI exists.
  - Usage in README is `yarn scoring https://example.com/.../`.
  - Requires `config/local.json` with a `pages` array.
  - No public official VRT repo or workspace was detected in the inspected repos.

- 2022:
  - Challenge repo: `CyberAgentHack/web-speed-hackathon-2022`
  - No separate public `-scoring-tool` repo was found.
  - Public measurement code lives in `CyberAgentHack/web-speed-hackathon-2022-leaderboard`.
  - Root script is `scoring`, but the actual scorer is a workspace package under `scripts/scoring`.
  - Public local CLI exists, but it requires `--id`, `--url`, and `WSH_SCORING_TARGET_PATHS`.
  - Official VRT also lives in the leaderboard repo under `scripts/vrt`.
  - Root scripts include `vrt:capture` and `vrt:detect`.

- 2023:
  - Challenge repo: `CyberAgentHack/web-speed-hackathon-2023`
  - Public scorer repo: `CyberAgentHack/web-speed-hackathon-2023-scoring-tool`
  - The public README points participants to the scorer repo for registration.
  - The public workflow checks out `CyberAgentHack/web-speed-hackathon-2023-scoring-tool-workspace`.
  - The public repo references `tsx ./src/index.mts`, but the public checkout does not contain `src/`.
  - Treat the public repo as not self-contained for local execution.
  - No public official VRT workspace was detected in the inspected repos.

- 2024:
  - Challenge repo: `CyberAgentHack/web-speed-hackathon-2024`
  - Public scorer repo: `CyberAgentHack/web-speed-hackathon-2024-scoring-tool`
  - Challenge README points people to issue registration instead of a documented local CLI.
  - `src/index.mts` reads GitHub issue context instead of a direct `applicationUrl` argument.
  - `src/utils/create_page.mts` launches Playwright Chromium, not Chrome channel.
  - Workflow installs Chromium with `pnpm playwright install chromium --with-deps`.
  - Treat the public repo as GitHub-issue-driven unless the user explicitly wants a custom local adapter.
  - Official VRT lives in the challenge repo under `workspaces/testing`.
  - Root scripts expose `test` and `test:debug`.
  - `workspaces/testing/playwright.config.ts` reads `E2E_BASE_URL` and defaults to `http://localhost:8000`.

- 2025:
  - Challenge repo: `CyberAgentHack/web-speed-hackathon-2025`
  - Public scorer repo: `CyberAgentHack/web-speed-hackathon-2025-scoring-tool`
  - Challenge README explicitly documents local measurement.
  - Public local CLI exists via `pnpm start --applicationUrl <applicationUrl>`.
  - `mise.toml` pins Node and pnpm.
  - `src/utils/create_page.ts` launches Playwright with `channel: 'chrome'`.
  - Official VRT lives in the challenge repo under `workspaces/test`.
  - Root script `test` delegates to the Playwright workspace.
  - `workspaces/test/playwright.config.ts` reads `E2E_BASE_URL` and uses Desktop Chrome with `channel: 'chrome'`.

## Discovery Rules

1. Prefer the challenge README as the source of truth.
   - Extract official GitHub repo links from the challenge README.
   - Prefer repos whose names contain `scoring-tool`.
   - Fall back to repos whose names contain `leaderboard`.

2. If the README does not explicitly link a measurement repo, use org naming fallback.
   - Try `web-speed-hackathon-<year>-scoring-tool`.
   - Then try `web-speed-hackathon-<year>-leaderboard`.

3. Discover official VRT separately from scoring.
   - If the measurement repo contains `scripts/vrt/package.json`, use that repo for VRT.
   - Otherwise, if the challenge repo contains `workspaces/test/package.json`, use the challenge repo for VRT.
   - Otherwise, if the challenge repo contains `workspaces/testing/package.json`, use the challenge repo for VRT.
   - Otherwise, treat VRT as not publicly available.

4. Inspect the public repo before assuming local execution is possible.
   - Self-contained public CLI patterns:
     - 2021: `src/cli/scoring.ts`
     - 2022: `scripts/scoring/src/index.ts`
     - 2025-style: public source with `applicationUrl` CLI argument
   - Not safely local from the public repo:
     - 2023: public wrapper references missing source
     - 2024: issue-context entrypoint

5. Match browser expectations to the public repo.
   - 2025 expects Chrome channel.
   - 2024 uses Chromium and installs it through Playwright.
   - 2021 and 2022 depend on `chrome-launcher`.
   - 2025 VRT also expects Chrome channel.
   - 2024 VRT uses Playwright Chromium defaults.

## Verified Sources

- 2020 challenge: https://github.com/CyberAgentHack/web-speed-hackathon-2020
- 2021 challenge: https://github.com/CyberAgentHack/web-speed-hackathon-2021
- 2021 scorer: https://github.com/CyberAgentHack/web-speed-hackathon-2021-scoring-tool
- 2022 challenge: https://github.com/CyberAgentHack/web-speed-hackathon-2022
- 2022 leaderboard: https://github.com/CyberAgentHack/web-speed-hackathon-2022-leaderboard
- 2023 challenge: https://github.com/CyberAgentHack/web-speed-hackathon-2023
- 2023 scorer: https://github.com/CyberAgentHack/web-speed-hackathon-2023-scoring-tool
- 2024 challenge: https://github.com/CyberAgentHack/web-speed-hackathon-2024
- 2024 scorer: https://github.com/CyberAgentHack/web-speed-hackathon-2024-scoring-tool
- 2025 challenge: https://github.com/CyberAgentHack/web-speed-hackathon-2025
- 2025 scorer: https://github.com/CyberAgentHack/web-speed-hackathon-2025-scoring-tool
