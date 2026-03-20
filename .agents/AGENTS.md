# AGENTS.md

## Goal
- The goal of this project is to achieve a strong score in Web Speed Hackathon.
- Optimize for real scoring, not cosmetic benchmark wins.
- Regulation compliance is a hard requirement. A fast app that fails regulation is not a successful outcome.

## Source of Truth
- Detailed optimization guidance, regulation notes, and year-specific context live in the Web Speed Hackathon skills and their reference documents.

## Core Strategy
- Follow the Web Speed Hackathon principle: subtract before you add.
- Hunt for detuning first: artificial sleeps, large debounce windows, wasteful loops, unnecessary polling, and oversized bundles.
- Prioritize page-display performance first. In the verified 2025 rules, interaction and video scores only count after the page-display score reaches 200 or more.
- Treat regulation-sensitive behavior as more important than speculative micro-optimizations.

## Exploration Policy
- When searching for improvements, actively use subagents to explore broadly and in parallel.
- Split exploration into concrete tracks such as:
  - detuning removal
  - build and bundle optimization
  - asset, font, and video delivery
  - caching and backend latency
  - regulation and visual regression risk
- Ask each subagent for evidence, affected files, expected score impact, and risk level.
- Consolidate overlapping findings before implementation.

## Measurement Workflow
- Establish a baseline before making changes.
- Re-measure after each major batch of changes.
- Use the official scorer workflow for the target year whenever a public local CLI exists.
- Inspect the scorer before assuming local execution details, because the public repo shape differs by year.

## Regulation Guardrails
- Do not break `POST /api/initialize` or any equivalent initialization endpoint required by the competition.
- Do not introduce obvious design regressions, missing content, broken navigation, or failed visual checks in the latest Google Chrome.
- Keep all required pages accessible and working.
- Run regulation checks after every risky change set, especially after detuning removal, build changes, asset changes, and library swaps.
- Preserve functional behavior unless a change is clearly allowed and verified.

## Issue Creation
- If you find room to improve the implementation, create a GitHub issue with the `gh` command instead of leaving the idea undocumented.
- Every issue should include:
  - the affected page, flow, or subsystem
  - the current bottleneck or failure mode
  - evidence or reproduction steps
  - the expected score or latency impact
  - regulation or regression risk
  - a concrete implementation direction

## Implementation Bias
- Prefer high-confidence, high-impact changes over clever but fragile rewrites.
- Prefer simpler implementations, smaller dependencies, and behavior-preserving fixes.
- If a year-specific rule or scorer behavior is unclear, verify it from the official docs or scorer before acting.
