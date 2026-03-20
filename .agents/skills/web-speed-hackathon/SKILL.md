---
name: web-speed-hackathon
description: Guide optimization, profiling, measurement, and regulation-safe implementation for CyberAgent Web Speed Hackathon repositories. Use when Claude needs to inspect or improve a WSH app, remove intentional detuning, prioritize Lighthouse work, run year-specific scoring or regulation checks, or choose safe optimization tactics across the 2020-2025 editions.
---

# Web Speed Hackathon

Use this skill to improve a Web Speed Hackathon repository without sacrificing regulation compliance.

## Follow This Workflow

1. Read the repository docs and identify the exact scoring, Lighthouse, VRT, and E2E commands for the target year.
2. Establish a baseline before editing anything.
   - Record Lighthouse with Incognito, CPU throttle, and Slow 3G.
   - Run the regulation command so failures are visible before optimization work.
3. Search for detuning first.
   - Run `rg -n "sleep|setTimeout|setInterval|delay|Math\\.pow|2\\*\\*" .`
   - Search for suspicious polling, oversized batch windows, fake waits, and heavy libraries.
4. Fix the highest-confidence, highest-impact problems first.
   - Remove artificial slowdowns before adding clever optimizations.
   - Prefer production builds, smaller bundles, cache headers, asset compression, DB indexes, and N+1 removal.
5. Re-measure after each change batch.
   - Keep changes small enough that score movement and regressions stay attributable.
6. Run regulation checks after every risky batch.
   - Re-run after detuning removal, build changes, asset changes, library swaps, and layout work.
7. Verify submission-critical requirements before finishing.
   - Keep `/initialize` working.
   - Preserve required pages, labels, hover states, and visual output.
   - For 2024+, keep the service worker behavior intact.
   - For 2025, prioritize page-display score first because interaction and video scores only count after the gate is met.

## Apply These Rules

- Prefer subtracting code over adding new machinery.
- Prefer standard library and existing platform features over new dependencies.
- Do not treat a Lighthouse gain as success if VRT or E2E breaks.
- Do not make year-specific assumptions without checking the target repository and rules.
- Use the official scoring workflow for the target year when a public local CLI exists.

## Load References Only When Needed

- Read `references/techniques.md` when you need concrete optimization patterns for profiling, build settings, assets, Core Web Vitals, caching, backend, resource hints, or video.
- Read `references/regulation-guard.md` when you need year-specific regulation constraints, VRT/E2E checkpoints, safe areas, or common failure modes.
