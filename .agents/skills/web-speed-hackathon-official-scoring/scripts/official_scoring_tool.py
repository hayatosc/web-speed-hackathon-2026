#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import re
import shlex
import shutil
import subprocess
import sys
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen


DEFAULT_GITHUB_ORG = "CyberAgentHack"
DEFAULT_CLONE_ROOT = Path("scripts")
GITHUB_REPO_PATTERNS = (
    re.compile(r"^https://github\.com/(?P<owner>[^/]+)/(?P<repo>[^/]+?)(?:\.git)?/?$"),
    re.compile(r"^git@github\.com:(?P<owner>[^/]+)/(?P<repo>[^/]+?)(?:\.git)?$"),
)
YEAR_RE = re.compile(r"^web-speed-hackathon-(\d{4})(?:$|[-/])")
CHROME_CANDIDATES = ("google-chrome", "google-chrome-stable", "chrome")
CHROMIUM_CANDIDATES = ("chromium", "chromium-browser")


@dataclass
class RepoRef:
    owner: str
    repo: str
    html_url: str
    default_branch: str

    @property
    def full_name(self) -> str:
        return f"{self.owner}/{self.repo}"

    @property
    def year(self) -> int | None:
        match = YEAR_RE.match(self.repo)
        if match is None:
            return None
        return int(match.group(1))


@dataclass
class Strategy:
    name: str
    supports_local_run: bool
    summary: str
    browser: str | None
    needs_build: bool


@dataclass
class DiscoveryResult:
    challenge_repo: RepoRef
    measurement_repo: RepoRef
    measurement_kind: str
    measurement_reason: str
    vrt_repo: RepoRef | None
    vrt_reason: str | None


@dataclass
class PreparedContext:
    discovery: DiscoveryResult
    measurement_dir: Path
    measurement_strategy: Strategy
    vrt_dir: Path | None
    vrt_strategy: Strategy | None


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Discover, prepare, and run official Web Speed Hackathon scoring and VRT tooling without hardcoding repo URLs."
    )

    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--year", type=int, help="Target Web Speed Hackathon year. Defaults to the latest available year.")
    common.add_argument(
        "--challenge-repo-path",
        help="Local challenge repo path. The helper reads git remote origin from this path to discover official repos.",
    )
    common.add_argument(
        "--challenge-repo-url",
        help="Challenge repo URL or git remote URL. Used for discovery when no local checkout is available.",
    )
    common.add_argument("--github-org", default=DEFAULT_GITHUB_ORG, help=f"GitHub organization to inspect. Default: {DEFAULT_GITHUB_ORG}.")
    common.add_argument("--project-dir", default=".", help="Project root where official repos should be cloned. Default: current working directory.")
    common.add_argument(
        "--measurement-dir",
        help="Optional clone directory for the discovered scoring/measurement repo. Relative paths are resolved from --project-dir.",
    )
    common.add_argument(
        "--vrt-dir",
        help="Optional clone directory for the discovered VRT repo. Relative paths are resolved from --project-dir.",
    )
    common.add_argument("--update", action="store_true", help="Pull the latest official changes if a discovered repo already exists.")
    common.add_argument("--skip-install", action="store_true", help="Skip package installation.")
    common.add_argument("--clean-install", action="store_true", help="Use nci instead of ni where applicable.")
    common.add_argument("--no-mise", action="store_true", help="Disable mise even when the discovered repo contains mise.toml.")
    common.add_argument("--dry-run", action="store_true", help="Print commands without executing them.")

    discover_parser = parser.add_subparsers(dest="command", required=True)

    cmd_discover = discover_parser.add_parser("discover", parents=[common], help="Resolve official scoring and VRT repos.")
    cmd_discover.add_argument("--json", action="store_true", help="Print JSON output.")

    discover_parser.add_parser("prepare", parents=[common], help="Clone the discovered official scoring and VRT repos under scripts/.")

    cmd_inspect = discover_parser.add_parser("inspect", parents=[common], help="Prepare repos and inspect local-run strategies.")
    cmd_inspect.add_argument("--json", action="store_true", help="Print JSON output.")

    scoring_parser = discover_parser.add_parser("run", parents=[common], help="Prepare repos and run the discovered scoring tool when supported.")
    scoring_parser.add_argument("--application-url", required=True, help="Application URL to score.")
    scoring_parser.add_argument("--debug-browser", action="store_true", help="Set DEBUG=wsh:browser when the scoring tool supports it.")
    scoring_parser.add_argument("--debug-log", action="store_true", help="Set DEBUG=wsh:log when the scoring tool supports it.")
    scoring_parser.add_argument("--page", dest="pages", action="append", default=[], help="2021 scoring tool only. Repeatable page path without a leading slash.")
    scoring_parser.add_argument("--target-path", dest="target_paths", action="append", default=[], help="2022 scoring tool only. Repeatable target path.")
    scoring_parser.add_argument("--competitor-id", default="local", help="2022 scoring tool only. Default: local.")
    scoring_parser.add_argument("extra_args", nargs=argparse.REMAINDER, help="Additional scoring arguments. Put them after --.")

    vrt_parser = discover_parser.add_parser("run-vrt", parents=[common], help="Prepare repos and run the discovered official VRT when supported.")
    vrt_parser.add_argument("--application-url", required=True, help="Application URL to test.")
    vrt_parser.add_argument("--debug-browser", action="store_true", help="Run VRT in debug mode when a debug script exists.")
    vrt_parser.add_argument("--capture-only", action="store_true", help="2022 VRT only. Run capture without detect.")
    vrt_parser.add_argument("--detect-only", action="store_true", help="2022 VRT only. Run detect without capture.")

    all_parser = discover_parser.add_parser("run-all", parents=[common], help="Run scoring and VRT sequentially when both are publicly runnable.")
    all_parser.add_argument("--application-url", required=True, help="Application URL to score and test.")
    all_parser.add_argument("--debug-browser", action="store_true", help="Enable debug-browser behavior where supported.")
    all_parser.add_argument("--debug-log", action="store_true", help="Enable DEBUG=wsh:log where supported.")
    all_parser.add_argument("--page", dest="pages", action="append", default=[], help="2021 scoring tool only.")
    all_parser.add_argument("--target-path", dest="target_paths", action="append", default=[], help="2022 scoring tool only.")
    all_parser.add_argument("--competitor-id", default="local", help="2022 scoring tool only.")
    all_parser.add_argument("--capture-only", action="store_true", help="2022 VRT only.")
    all_parser.add_argument("--detect-only", action="store_true", help="2022 VRT only.")
    all_parser.add_argument("extra_args", nargs=argparse.REMAINDER, help="Additional scoring arguments. Put them after --.")

    return parser.parse_args()


def request_text(url: str) -> str:
    request = Request(url, headers={"User-Agent": "codex-wsh-skill"})
    with urlopen(request) as response:
        return response.read().decode("utf-8", "replace")


def request_json(url: str) -> Any:
    return json.loads(request_text(url))


@lru_cache(maxsize=8)
def list_org_repos(org: str) -> list[RepoRef]:
    repos: list[RepoRef] = []
    page = 1
    while True:
        data = request_json(f"https://api.github.com/orgs/{org}/repos?per_page=100&page={page}")
        if not data:
            break
        for item in data:
            repos.append(
                RepoRef(
                    owner=item["owner"]["login"],
                    repo=item["name"],
                    html_url=item["html_url"],
                    default_branch=item["default_branch"],
                )
            )
        if len(data) < 100:
            break
        page += 1
    return repos


def parse_repo_ref(value: str) -> tuple[str, str]:
    normalized = value.strip()
    for pattern in GITHUB_REPO_PATTERNS:
        match = pattern.match(normalized)
        if match is not None:
            return match.group("owner"), match.group("repo")
    raise SystemExit(f"Unsupported GitHub repo URL or remote format: {value}")


def capture_stdout(command: list[str], *, cwd: Path | None = None) -> str:
    completed = subprocess.run(command, cwd=cwd, text=True, capture_output=True, check=True)
    return completed.stdout


def repo_ref_from_path(path: str) -> tuple[str, str]:
    repo_path = Path(path).expanduser().resolve()
    if not repo_path.exists():
        raise SystemExit(f"Challenge repo path does not exist: {repo_path}")
    if not repo_path.is_dir():
        raise SystemExit(f"Challenge repo path is not a directory: {repo_path}")
    remote = capture_stdout(["git", "-C", str(repo_path), "remote", "get-url", "origin"]).strip()
    return parse_repo_ref(remote)


def repo_by_name(repos: list[RepoRef], owner: str, repo_name: str) -> RepoRef | None:
    for repo in repos:
        if repo.owner == owner and repo.repo == repo_name:
            return repo
    return None


def latest_challenge_repo(repos: list[RepoRef], org: str) -> RepoRef:
    candidates = [repo for repo in repos if repo.owner == org and YEAR_RE.match(repo.repo) and repo.repo.count("-") == 3]
    if not candidates:
        raise SystemExit(f"No challenge repos found under GitHub org {org}.")
    return max(candidates, key=lambda repo: repo.year or 0)


def fetch_readme(repo: RepoRef) -> str:
    url = f"https://raw.githubusercontent.com/{repo.owner}/{repo.repo}/{repo.default_branch}/README.md"
    try:
        return request_text(url)
    except (HTTPError, URLError):
        return ""


def extract_org_repo_links(markdown: str, org: str) -> list[str]:
    pattern = re.compile(rf"https://github\.com/{re.escape(org)}/([A-Za-z0-9_.-]+)")
    names: list[str] = []
    for match in pattern.finditer(markdown):
        name = match.group(1)
        if name not in names:
            names.append(name)
    return names


@lru_cache(maxsize=128)
def remote_path_exists(owner: str, repo: str, branch: str, path: str) -> bool:
    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}?ref={branch}"
    try:
        request_text(url)
        return True
    except HTTPError as err:
        if err.code == 404:
            return False
        raise
    except URLError:
        return False


def resolve_challenge_repo(args: argparse.Namespace, repos: list[RepoRef]) -> RepoRef:
    if args.challenge_repo_url:
        owner, repo_name = parse_repo_ref(args.challenge_repo_url)
        repo = repo_by_name(repos, owner, repo_name)
        if repo is None:
            raise SystemExit(f"Challenge repo not found in GitHub org listing: {owner}/{repo_name}")
        return repo
    if args.challenge_repo_path:
        owner, repo_name = repo_ref_from_path(args.challenge_repo_path)
        repo = repo_by_name(repos, owner, repo_name)
        if repo is None:
            raise SystemExit(f"Challenge repo not found in GitHub org listing: {owner}/{repo_name}")
        return repo
    if args.year is not None:
        repo = repo_by_name(repos, args.github_org, f"web-speed-hackathon-{args.year}")
        if repo is None:
            raise SystemExit(f"Challenge repo not found for year {args.year}.")
        return repo
    return latest_challenge_repo(repos, args.github_org)


def resolve_measurement_repo(challenge_repo: RepoRef, repos: list[RepoRef]) -> tuple[RepoRef, str, str]:
    readme = fetch_readme(challenge_repo)
    linked_names = [name for name in extract_org_repo_links(readme, challenge_repo.owner) if name != challenge_repo.repo]

    preferred_names = [
        *[name for name in linked_names if "scoring-tool" in name],
        *[name for name in linked_names if "leaderboard" in name],
        f"web-speed-hackathon-{challenge_repo.year}-scoring-tool",
        f"web-speed-hackathon-{challenge_repo.year}-leaderboard",
    ]

    ordered_names: list[str] = []
    for name in preferred_names:
        if name not in ordered_names:
            ordered_names.append(name)

    for candidate_name in ordered_names:
        repo = repo_by_name(repos, challenge_repo.owner, candidate_name)
        if repo is None:
            continue
        kind = "scoring-tool" if "scoring-tool" in repo.repo else "leaderboard"
        if candidate_name in linked_names:
            return repo, kind, f"Discovered from {challenge_repo.full_name} README links."
        return repo, kind, f"Resolved by org repo naming fallback for year {challenge_repo.year}."

    raise SystemExit(f"Could not discover a measurement repo for {challenge_repo.full_name}.")


def resolve_vrt_repo(challenge_repo: RepoRef, measurement_repo: RepoRef) -> tuple[RepoRef | None, str | None]:
    if remote_path_exists(measurement_repo.owner, measurement_repo.repo, measurement_repo.default_branch, "scripts/vrt/package.json"):
        return measurement_repo, f"Detected VRT workspace in {measurement_repo.full_name}."
    if remote_path_exists(challenge_repo.owner, challenge_repo.repo, challenge_repo.default_branch, "workspaces/test/package.json"):
        return challenge_repo, f"Detected Playwright test workspace in {challenge_repo.full_name}."
    if remote_path_exists(challenge_repo.owner, challenge_repo.repo, challenge_repo.default_branch, "workspaces/testing/package.json"):
        return challenge_repo, f"Detected Playwright testing workspace in {challenge_repo.full_name}."
    return None, None


def resolve_discovery(args: argparse.Namespace) -> DiscoveryResult:
    repos = list_org_repos(args.github_org)
    challenge_repo = resolve_challenge_repo(args, repos)
    measurement_repo, measurement_kind, measurement_reason = resolve_measurement_repo(challenge_repo, repos)
    vrt_repo, vrt_reason = resolve_vrt_repo(challenge_repo, measurement_repo)
    return DiscoveryResult(
        challenge_repo=challenge_repo,
        measurement_repo=measurement_repo,
        measurement_kind=measurement_kind,
        measurement_reason=measurement_reason,
        vrt_repo=vrt_repo,
        vrt_reason=vrt_reason,
    )


def resolve_project_dir(raw: str) -> Path:
    path = Path(raw).expanduser().resolve()
    if not path.exists():
        raise SystemExit(f"Project directory does not exist: {path}")
    if not path.is_dir():
        raise SystemExit(f"Project path is not a directory: {path}")
    return path


def resolve_clone_dir(project_dir: Path, raw_dir: str | None, repo: RepoRef) -> Path:
    if raw_dir is None:
        return (project_dir / DEFAULT_CLONE_ROOT / repo.repo).resolve()
    path = Path(raw_dir).expanduser()
    if path.is_absolute():
        return path.resolve()
    return (project_dir / path).resolve()


def format_command(command: list[str]) -> str:
    return shlex.join(command)


def direct_has(command: str) -> bool:
    return shutil.which(command) is not None


def shell_has(command: str) -> bool:
    zsh = shutil.which("zsh")
    if zsh is None:
        return False
    script = "\n".join(["source ~/.zshrc >/dev/null 2>&1", f"command -v {shlex.quote(command)} >/dev/null"])
    result = subprocess.run([zsh, "-lc", script], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=False)
    return result.returncode == 0


def ensure_direct_command(command: str) -> None:
    if not direct_has(command):
        raise SystemExit(f"Required command not found on PATH: {command}")


def ensure_shell_command(command: str) -> None:
    if not shell_has(command):
        raise SystemExit(f"Required command not found after loading ~/.zshrc: {command}")


def run_direct(command: list[str], *, cwd: Path | None = None, dry_run: bool = False) -> None:
    if cwd is None:
        print(f"$ {format_command(command)}", flush=True)
    else:
        print(f"$ (cd {cwd} && {format_command(command)})", flush=True)
    if dry_run:
        return
    subprocess.run(command, cwd=cwd, check=True)


def run_zsh(command: list[str], *, cwd: Path | None = None, dry_run: bool = False, env: dict[str, str] | None = None) -> None:
    zsh = shutil.which("zsh")
    if zsh is None:
        raise SystemExit("zsh is required because this helper loads ~/.zshrc before running ni/nr/mise.")
    lines = ["source ~/.zshrc >/dev/null 2>&1"]
    if cwd is not None:
        lines.append(f"cd {shlex.quote(str(cwd))}")
    lines.append(format_command(command))
    script = "\n".join(lines)
    print(f"$ zsh -lc {shlex.quote(script)}", flush=True)
    if dry_run:
        return
    subprocess.run([zsh, "-lc", script], env=env, check=True)


def temp_path_needs_override(value: str | None) -> bool:
    if not value:
        return True
    lowered = value.lower()
    return lowered.startswith("/mnt/") or ":\\" in lowered or ":/" in lowered


def build_runtime_env(*, debug_browser: bool = False, debug_log: bool = False) -> dict[str, str]:
    env = os.environ.copy()
    for key in ("TMPDIR", "TMP", "TEMP"):
        if temp_path_needs_override(env.get(key)):
            env[key] = "/tmp"
    debug_values: list[str] = []
    if env.get("DEBUG"):
        debug_values.extend([value for value in env["DEBUG"].split(",") if value])
    if debug_browser and "wsh:browser" not in debug_values:
        debug_values.append("wsh:browser")
    if debug_log and "wsh:log" not in debug_values:
        debug_values.append("wsh:log")
    if debug_values:
        env["DEBUG"] = ",".join(debug_values)
    return env


def use_mise(repo_dir: Path, no_mise: bool) -> bool:
    if no_mise or not shell_has("mise"):
        return False
    return any(
        (repo_dir / marker).exists()
        for marker in ("mise.toml", ".node-version", ".tool-versions")
    )


def ensure_checkout(repo: RepoRef, dest_dir: Path, *, update: bool, dry_run: bool) -> None:
    if dest_dir.exists():
        if not (dest_dir / ".git").exists():
            raise SystemExit(f"Clone directory already exists and is not a git repo: {dest_dir}")
        remote = capture_stdout(["git", "config", "--get", "remote.origin.url"], cwd=dest_dir).strip()
        owner, repo_name = parse_repo_ref(remote)
        if (owner, repo_name) != (repo.owner, repo.repo):
            raise SystemExit(
                f"Existing checkout points to {owner}/{repo_name}, expected {repo.full_name}. "
                "Use a different target directory or clean the existing one first."
            )
        print(f"[wsh] Using existing checkout: {dest_dir}", flush=True)
        if not update:
            return
        dirty = capture_stdout(["git", "status", "--porcelain"], cwd=dest_dir).strip()
        if dirty:
            raise SystemExit(f"Refusing to update {dest_dir} because it has local changes.")
        run_direct(["git", "pull", "--ff-only"], cwd=dest_dir, dry_run=dry_run)
        return

    dest_dir.parent.mkdir(parents=True, exist_ok=True)
    run_direct(["git", "clone", "--depth=1", repo.html_url, str(dest_dir)], dry_run=dry_run)


def prepare_dependencies(repo_dir: Path, *, no_mise: bool, skip_install: bool, clean_install: bool, dry_run: bool) -> None:
    runtime_env = build_runtime_env()
    if use_mise(repo_dir, no_mise):
        ensure_shell_command("mise")
        ensure_shell_command("ni")
        if clean_install:
            ensure_shell_command("nci")
        print("[wsh] Using mise runtimes pinned by the repo.", flush=True)
        if (repo_dir / "mise.toml").exists():
            run_zsh(["mise", "trust", str(repo_dir / "mise.toml")], dry_run=dry_run, env=runtime_env)
        run_zsh(["mise", "install", "-y"], cwd=repo_dir, dry_run=dry_run, env=runtime_env)
        if skip_install:
            return
        command = ["mise", "exec", "--", "nci" if clean_install else "ni"]
        run_zsh(command, cwd=repo_dir, dry_run=dry_run, env=runtime_env)
        return

    ensure_shell_command("ni")
    if clean_install:
        ensure_shell_command("nci")
    print("[wsh] Using ni from ~/.zshrc.", flush=True)
    if skip_install:
        return
    run_zsh(["nci" if clean_install else "ni"], cwd=repo_dir, dry_run=dry_run, env=runtime_env)


def read_text_if_exists(path: Path) -> str:
    if not path.exists() or not path.is_file():
        return ""
    return path.read_text(encoding="utf-8", errors="replace")


def load_json_if_exists(path: Path) -> Any | None:
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def has_playwright_config(repo_dir: Path) -> bool:
    return any(
        path.exists()
        for path in (
            repo_dir / "playwright.config.ts",
            repo_dir / "workspaces" / "test" / "playwright.config.ts",
            repo_dir / "workspaces" / "testing" / "playwright.config.ts",
        )
    )


def maybe_install_playwright_browser(
    repo_dir: Path,
    strategy: Strategy | None,
    *,
    no_mise: bool,
    skip_install: bool,
    dry_run: bool,
) -> None:
    if strategy is None or not strategy.supports_local_run:
        return
    if skip_install:
        return
    if strategy.browser != "chromium":
        return
    if not has_playwright_config(repo_dir):
        return
    ensure_shell_command("nlx")
    runtime_env = build_runtime_env()
    command = ["nlx", "playwright", "install", "chromium"]
    if use_mise(repo_dir, no_mise):
        command = ["mise", "exec", "--", *command]
    run_zsh(command, cwd=repo_dir, dry_run=dry_run, env=runtime_env)


def detect_scoring_browser(repo_dir: Path) -> str | None:
    create_page_text = read_text_if_exists(repo_dir / "src" / "utils" / "create_page.ts")
    create_page_text += read_text_if_exists(repo_dir / "src" / "utils" / "create_page.mts")
    if "channel: 'chrome'" in create_page_text or 'channel: "chrome"' in create_page_text:
        return "chrome"
    if "playwright.chromium" in create_page_text or "playwright['chromium']" in create_page_text:
        return "chromium"
    return None


def detect_scoring_strategy(repo_dir: Path) -> Strategy:
    package_json = load_json_if_exists(repo_dir / "package.json") or {}
    scripts = package_json.get("scripts") or {}
    index_text = ""
    for candidate in (repo_dir / "src" / "index.ts", repo_dir / "src" / "index.mts", repo_dir / "src" / "index.js"):
        index_text += read_text_if_exists(candidate)

    if (repo_dir / "src" / "cli" / "scoring.ts").exists():
        return Strategy(
            name="wsh2021-cli",
            supports_local_run=True,
            summary="2021 public scorer. Requires config/local.json pages and a trailing-slash URL.",
            browser="chrome",
            needs_build=True,
        )

    if (repo_dir / "scripts" / "scoring" / "src" / "index.ts").exists():
        return Strategy(
            name="wsh2022-workspace",
            supports_local_run=True,
            summary="2022 leaderboard workspace scorer. Requires --id, --url, and WSH_SCORING_TARGET_PATHS.",
            browser="chrome",
            needs_build=True,
        )

    if "applicationUrl" in index_text and isinstance(scripts.get("start"), str):
        return Strategy(
            name="application-url-cli",
            supports_local_run=True,
            summary="Public CLI that accepts --applicationUrl.",
            browser=detect_scoring_browser(repo_dir),
            needs_build=False,
        )

    if "github.context.payload.issue" in index_text and "applicationUrl" not in index_text:
        return Strategy(
            name="github-issue-flow",
            supports_local_run=False,
            summary="Public repo is wired to GitHub issue context and does not expose a public local CLI.",
            browser=detect_scoring_browser(repo_dir),
            needs_build=False,
        )

    start_script = scripts.get("start")
    if isinstance(start_script, str):
        match = re.search(r"src/index\.[cm]?[jt]s", start_script)
        if match is not None and not (repo_dir / match.group(0)).exists():
            return Strategy(
                name="public-wrapper-incomplete",
                supports_local_run=False,
                summary="Public repo references a local runner that is not present in the public checkout.",
                browser=None,
                needs_build=False,
            )

    return Strategy(
        name="unknown",
        supports_local_run=False,
        summary="Could not infer a safe scoring strategy from the public checkout.",
        browser=detect_scoring_browser(repo_dir),
        needs_build=False,
    )


def detect_vrt_strategy(repo_dir: Path | None) -> Strategy | None:
    if repo_dir is None:
        return None
    if (repo_dir / "scripts" / "vrt" / "package.json").exists():
        return Strategy(
            name="wsh2022-vrt-workspace",
            supports_local_run=True,
            summary="2022 visual regression tooling from the leaderboard workspace. Capture then detect from the repo root.",
            browser="chrome",
            needs_build=True,
        )
    if (repo_dir / "workspaces" / "testing" / "package.json").exists():
        return Strategy(
            name="challenge-playwright-testing",
            supports_local_run=True,
            summary="Challenge repo Playwright VRT workspace (2024 style). Run from the repo root with E2E_BASE_URL.",
            browser="chromium",
            needs_build=False,
        )
    if (repo_dir / "workspaces" / "test" / "package.json").exists():
        config_text = read_text_if_exists(repo_dir / "workspaces" / "test" / "playwright.config.ts")
        browser = "chrome" if "channel: 'chrome'" in config_text or 'channel: "chrome"' in config_text else "chromium"
        return Strategy(
            name="challenge-playwright-test",
            supports_local_run=True,
            summary="Challenge repo Playwright VRT workspace (2025 style). Run from the repo root with E2E_BASE_URL.",
            browser=browser,
            needs_build=False,
        )
    return Strategy(
        name="no-public-vrt",
        supports_local_run=False,
        summary="No public official VRT workspace was detected in the discovered repos.",
        browser=None,
        needs_build=False,
    )


def ensure_browser(strategy: Strategy) -> None:
    if strategy.browser == "chrome":
        if any(direct_has(candidate) or shell_has(candidate) for candidate in CHROME_CANDIDATES):
            return
        raise SystemExit("This command requires Google Chrome, but no chrome binary was found.")
    if strategy.browser == "chromium":
        if any(direct_has(candidate) or shell_has(candidate) for candidate in (*CHROME_CANDIDATES, *CHROMIUM_CANDIDATES)):
            return
        raise SystemExit("This command requires Chromium or Chrome, but no supported browser binary was found.")


def ensure_build_if_needed(repo_dir: Path, strategy: Strategy, *, no_mise: bool, dry_run: bool) -> None:
    if not strategy.needs_build:
        return
    package_json = load_json_if_exists(repo_dir / "package.json") or {}
    scripts = package_json.get("scripts") or {}
    if "build" not in scripts:
        return
    runtime_env = build_runtime_env()
    command = ["nr", "build"]
    if use_mise(repo_dir, no_mise):
        command = ["mise", "exec", "--", *command]
    run_zsh(command, cwd=repo_dir, dry_run=dry_run, env=runtime_env)


def forwarded_extra_args(extra_args: list[str]) -> list[str]:
    if extra_args and extra_args[0] == "--":
        return extra_args[1:]
    return extra_args


def ensure_2021_pages(repo_dir: Path, pages: list[str]) -> None:
    local_json = repo_dir / "config" / "local.json"
    if pages:
        local_json.parent.mkdir(parents=True, exist_ok=True)
        local_json.write_text(json.dumps({"pages": pages}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        return
    if not local_json.exists():
        raise SystemExit("2021 scoring requires config/local.json or repeated --page values.")


def ensure_2022_target_paths(target_paths: list[str]) -> str:
    if not target_paths:
        raise SystemExit("2022 scoring requires one or more --target-path values.")
    return json.dumps(target_paths, ensure_ascii=False)


def validate_application_url(url: str) -> None:
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise SystemExit(f"Invalid --application-url: {url}")


def prepare_context(args: argparse.Namespace) -> PreparedContext:
    ensure_direct_command("git")
    project_dir = resolve_project_dir(args.project_dir)
    discovery = resolve_discovery(args)

    measurement_dir = resolve_clone_dir(project_dir, args.measurement_dir, discovery.measurement_repo)
    vrt_dir: Path | None = None
    if discovery.vrt_repo is not None:
        if discovery.vrt_repo.full_name == discovery.measurement_repo.full_name:
            vrt_dir = measurement_dir
        else:
            vrt_dir = resolve_clone_dir(project_dir, args.vrt_dir, discovery.vrt_repo)

    print(f"[wsh] Challenge repo: {discovery.challenge_repo.full_name}", flush=True)
    print(f"[wsh] Measurement repo: {discovery.measurement_repo.full_name}", flush=True)
    print(f"[wsh] Measurement discovery: {discovery.measurement_reason}", flush=True)
    print(f"[wsh] Project directory: {project_dir}", flush=True)
    print(f"[wsh] Measurement clone dir: {measurement_dir}", flush=True)

    ensure_checkout(discovery.measurement_repo, measurement_dir, update=args.update, dry_run=args.dry_run)
    prepare_dependencies(measurement_dir, no_mise=args.no_mise, skip_install=args.skip_install, clean_install=args.clean_install, dry_run=args.dry_run)
    measurement_strategy = detect_scoring_strategy(measurement_dir)

    if discovery.vrt_repo is not None and vrt_dir is not None:
        print(f"[wsh] VRT repo: {discovery.vrt_repo.full_name}", flush=True)
        print(f"[wsh] VRT discovery: {discovery.vrt_reason}", flush=True)
        print(f"[wsh] VRT clone dir: {vrt_dir}", flush=True)
        if vrt_dir != measurement_dir:
            ensure_checkout(discovery.vrt_repo, vrt_dir, update=args.update, dry_run=args.dry_run)
            prepare_dependencies(vrt_dir, no_mise=args.no_mise, skip_install=args.skip_install, clean_install=args.clean_install, dry_run=args.dry_run)
        vrt_strategy = detect_vrt_strategy(vrt_dir)
    else:
        vrt_strategy = detect_vrt_strategy(None)

    maybe_install_playwright_browser(
        measurement_dir,
        measurement_strategy,
        no_mise=args.no_mise,
        skip_install=args.skip_install,
        dry_run=args.dry_run,
    )
    if vrt_dir is not None and vrt_dir != measurement_dir:
        maybe_install_playwright_browser(
            vrt_dir,
            vrt_strategy,
            no_mise=args.no_mise,
            skip_install=args.skip_install,
            dry_run=args.dry_run,
        )

    print(f"[wsh] Scoring strategy: {measurement_strategy.name}", flush=True)
    print(f"[wsh] Scoring summary: {measurement_strategy.summary}", flush=True)
    if vrt_strategy is not None:
        print(f"[wsh] VRT strategy: {vrt_strategy.name}", flush=True)
        print(f"[wsh] VRT summary: {vrt_strategy.summary}", flush=True)

    return PreparedContext(
        discovery=discovery,
        measurement_dir=measurement_dir,
        measurement_strategy=measurement_strategy,
        vrt_dir=vrt_dir,
        vrt_strategy=vrt_strategy,
    )


def run_scoring(args: argparse.Namespace, context: PreparedContext) -> None:
    strategy = context.measurement_strategy
    repo_dir = context.measurement_dir
    if not strategy.supports_local_run:
        raise SystemExit(f"The discovered scoring repo cannot be run locally with this helper. {strategy.summary}")

    validate_application_url(args.application_url)
    ensure_browser(strategy)
    ensure_build_if_needed(repo_dir, strategy, no_mise=args.no_mise, dry_run=args.dry_run)

    runtime_env = build_runtime_env(debug_browser=getattr(args, "debug_browser", False), debug_log=getattr(args, "debug_log", False))

    if strategy.name == "application-url-cli":
        command = ["nr", "start", "--applicationUrl", args.application_url, *forwarded_extra_args(getattr(args, "extra_args", []))]
        if use_mise(repo_dir, args.no_mise):
            command = ["mise", "exec", "--", *command]
        run_zsh(command, cwd=repo_dir, dry_run=args.dry_run, env=runtime_env)
        return

    if strategy.name == "wsh2021-cli":
        ensure_2021_pages(repo_dir, getattr(args, "pages", []))
        target_url = args.application_url if args.application_url.endswith("/") else f"{args.application_url}/"
        command = ["nr", "scoring", target_url]
        if use_mise(repo_dir, args.no_mise):
            command = ["mise", "exec", "--", *command]
        run_zsh(command, cwd=repo_dir, dry_run=args.dry_run, env=runtime_env)
        return

    if strategy.name == "wsh2022-workspace":
        runtime_env["WSH_SCORING_TARGET_PATHS"] = ensure_2022_target_paths(getattr(args, "target_paths", []))
        command = ["nr", "scoring", "--", "--id", getattr(args, "competitor_id", "local"), "--url", args.application_url]
        if use_mise(repo_dir, args.no_mise):
            command = ["mise", "exec", "--", *command]
        run_zsh(command, cwd=repo_dir, dry_run=args.dry_run, env=runtime_env)
        return

    raise SystemExit(f"Unhandled scoring strategy: {strategy.name}")


def run_vrt(args: argparse.Namespace, context: PreparedContext) -> None:
    strategy = context.vrt_strategy
    repo_dir = context.vrt_dir
    if strategy is None or repo_dir is None:
        raise SystemExit("No VRT repo was discovered.")
    if not strategy.supports_local_run:
        raise SystemExit(f"The discovered VRT cannot be run locally with this helper. {strategy.summary}")

    validate_application_url(args.application_url)
    ensure_browser(strategy)
    ensure_build_if_needed(repo_dir, strategy, no_mise=args.no_mise, dry_run=args.dry_run)

    runtime_env = build_runtime_env(debug_browser=getattr(args, "debug_browser", False))

    if strategy.name == "wsh2022-vrt-workspace":
        if getattr(args, "capture_only", False) and getattr(args, "detect_only", False):
            raise SystemExit("--capture-only and --detect-only cannot be used together.")
        base_command = ["nr"]
        if use_mise(repo_dir, args.no_mise):
            base_command = ["mise", "exec", "--", *base_command]
        if not getattr(args, "detect_only", False):
            run_zsh([*base_command, "vrt:capture", "--", "--url", args.application_url], cwd=repo_dir, dry_run=args.dry_run, env=runtime_env)
        if not getattr(args, "capture_only", False):
            run_zsh([*base_command, "vrt:detect"], cwd=repo_dir, dry_run=args.dry_run, env=runtime_env)
        return

    if strategy.name == "challenge-playwright-testing":
        runtime_env["E2E_BASE_URL"] = args.application_url
        command = ["nr", "test:debug" if getattr(args, "debug_browser", False) else "test"]
        if use_mise(repo_dir, args.no_mise):
            command = ["mise", "exec", "--", *command]
        run_zsh(command, cwd=repo_dir, dry_run=args.dry_run, env=runtime_env)
        return

    if strategy.name == "challenge-playwright-test":
        runtime_env["E2E_BASE_URL"] = args.application_url
        command = ["nr", "test"]
        if use_mise(repo_dir, args.no_mise):
            command = ["mise", "exec", "--", *command]
        run_zsh(command, cwd=repo_dir, dry_run=args.dry_run, env=runtime_env)
        return

    raise SystemExit(f"Unhandled VRT strategy: {strategy.name}")


def print_discovery(discovery: DiscoveryResult, *, as_json: bool) -> None:
    payload = {
        "year": discovery.challenge_repo.year,
        "challenge_repo": discovery.challenge_repo.html_url,
        "measurement_repo": discovery.measurement_repo.html_url,
        "measurement_kind": discovery.measurement_kind,
        "measurement_reason": discovery.measurement_reason,
        "vrt_repo": discovery.vrt_repo.html_url if discovery.vrt_repo is not None else None,
        "vrt_reason": discovery.vrt_reason,
    }
    text = json.dumps(payload, ensure_ascii=False, indent=2)
    print(text)


def print_inspection(context: PreparedContext, *, as_json: bool) -> None:
    payload = {
        "year": context.discovery.challenge_repo.year,
        "challenge_repo": context.discovery.challenge_repo.html_url,
        "measurement_repo": context.discovery.measurement_repo.html_url,
        "measurement_dir": str(context.measurement_dir),
        "measurement_strategy": context.measurement_strategy.name,
        "measurement_supports_local_run": context.measurement_strategy.supports_local_run,
        "measurement_summary": context.measurement_strategy.summary,
        "vrt_repo": context.discovery.vrt_repo.html_url if context.discovery.vrt_repo is not None else None,
        "vrt_dir": str(context.vrt_dir) if context.vrt_dir is not None else None,
        "vrt_strategy": context.vrt_strategy.name if context.vrt_strategy is not None else None,
        "vrt_supports_local_run": context.vrt_strategy.supports_local_run if context.vrt_strategy is not None else False,
        "vrt_summary": context.vrt_strategy.summary if context.vrt_strategy is not None else None,
    }
    text = json.dumps(payload, ensure_ascii=False, indent=2)
    print(text)


def main() -> int:
    args = parse_args()
    try:
        if args.command == "discover":
            print_discovery(resolve_discovery(args), as_json=getattr(args, "json", False))
            return 0

        context = prepare_context(args)

        if args.command == "prepare":
            return 0
        if args.command == "inspect":
            print_inspection(context, as_json=getattr(args, "json", False))
            return 0
        if args.command == "run":
            run_scoring(args, context)
            return 0
        if args.command == "run-vrt":
            run_vrt(args, context)
            return 0
        if args.command == "run-all":
            run_scoring(args, context)
            run_vrt(args, context)
            return 0
        raise SystemExit(f"Unknown command: {args.command}")
    except KeyboardInterrupt:
        print("Interrupted.", file=sys.stderr)
        return 130
    except subprocess.CalledProcessError as exc:
        return exc.returncode or 1


if __name__ == "__main__":
    raise SystemExit(main())
